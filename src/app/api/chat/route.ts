import { NextRequest, NextResponse } from 'next/server';
import { getStoredGames } from '@/data/storage';
import { GameData, SetupStep, TurnPhase } from '@/data/games';
import { GoogleGenAI } from '@google/genai';
import { checkRateLimit } from '@/lib/rateLimit';
import { getCorsHeaders, handleOptionsCors } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return handleOptionsCors(req);
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);

  // 1. Rate Limiting Check (25 requests per minute per IP)
  const rateLimit = checkRateLimit(req, 25, 60 * 1000);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: 'Çok fazla istek gönderildi. Lütfen bir süre sonra tekrar deneyin.',
        retryAfter: rateLimit.resetInSeconds,
      },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          'Retry-After': String(rateLimit.resetInSeconds),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { gameId, messages, userApiKey } = body;

    if (!gameId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Geçersiz istek formatı. gameId ve messages zorunludur.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const allGames = getStoredGames();
    const game = allGames[gameId];
    if (!game) {
      return NextResponse.json(
        { error: 'Belirtilen oyun bulunamadı.' },
        { status: 404, headers: corsHeaders }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content || '';
    const headerApiKey = req.headers.get('x-gemini-api-key');
    const apiKey = userApiKey || headerApiKey || process.env.GEMINI_API_KEY;

    // 2. If Gemini API Key is configured/provided, invoke Google GenAI SDK
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `Sen "${game.title}" kutu oyunu için özel olarak atanmış profesyonel bir Kural Hakemi ve Masa Asistanısın (Board Game Referee).
Kullanıcılar oyun gecesinde masada bu oyunu oynuyorlar ve anlık takıldıkları yerleri, kural anlaşmazlıklarını ve kurulum detaylarını sana soruyorlar.

KURALLAR VE BİLGİ BANKASI:
Oyun: ${game.title}
Kategori: ${game.category}
Oyuncu Sayısı: ${game.players}
Süre: ${game.duration}
Zorluk: ${game.difficulty}
Kazanma Şartı: ${game.winCondition}

Kural Özeti & Bilgi Tabanı:
${game.rulesKnowledge}

Sık Sorulan Sorular ve Hakem Kararları:
${game.faqs.map((f, i) => `${i + 1}. Soru: ${f.question}\nCevap: ${f.answer} (${f.pageRef || ''})`).join('\n\n')}

YÖNERGELERİN:
1. Türkçe, samimi ama kararlı ve net bir hakem tonunda cevap ver.
2. Masada hızlıca okunabilmesi için cevabını gereksiz uzatma, maddeler ve kalın (bold) metinlerle netleştir.
3. Kural kitapçığına uygun kesin kararı belirt. Tartışmaya yer bırakmayacak şekilde adım adım ne yapılması gerektiğini söyle.
4. Gerekirse kural referansına atıfta bulun (Örn: "Resmi Kural Kitapçığına göre...").
5. Oyunun ruhuna uygun pozitif ve motive edici ol!`;

        const contents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(m.content).slice(0, 1000) }],
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction,
          },
        });

        const reply = response.text || 'Kural analizi yapılamadı. Lütfen tekrar sorunuz.';
        return NextResponse.json({ reply, source: 'gemini' }, { headers: corsHeaders });
      } catch (err) {
        // Safe logging in dev only, never leak API keys
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Gemini API call failed, falling back to local engine');
        }
      }
    }

    // 3. Built-in Smart Rule Engine (Instant Offline / Fallback response)
    const reply = generateRuleEngineResponse(game, lastMessage);
    return NextResponse.json({ reply, source: 'local_engine' }, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: 'İstek işlenirken bir sorun oluştu. Lütfen tekrar deneyin.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

function generateRuleEngineResponse(game: GameData, query: string): string {
  const q = query.toLowerCase().trim();

  // Check exact/close FAQ matches
  for (const faq of game.faqs) {
    const faqQ = faq.question.toLowerCase();
    const words = faqQ.split(' ').filter((w: string) => w.length > 3);
    const matchCount = words.filter((w: string) => q.includes(w)).length;

    if (matchCount >= 2 || q.includes(faqQ) || faqQ.includes(q)) {
      return `🎲 **Hakem Kararı (${faq.pageRef || 'Kural Kitapçığı'}):**\n\n${faq.answer}\n\n*Masada iyi eğlenceler! Başka bir kural anlaşmazlığı olursa sormaktan çekinmeyin.*`;
    }
  }

  // Setup / Kurulum queries
  if (q.includes('kurulum') || q.includes('nasıl kurulur') || q.includes('başla') || q.includes('hazır')) {
    let res = `📋 **${game.title} Hızlı Kurulum Adımları:**\n\n`;
    game.setupSteps.forEach((step: SetupStep, idx: number) => {
      res += `**${idx + 1}. ${step.title}:** ${step.description}\n`;
      if (step.tip) res += `💡 *İpucu: ${step.tip}*\n`;
      res += '\n';
    });
    return res;
  }

  // Turn flow / Sıra bendeyken ne yaparım
  if (q.includes('sıra') || q.includes('tur') || q.includes('hamle') || q.includes('ne yapabilirim') || q.includes('aşama')) {
    let res = `⏱️ **${game.title} Tur Akışı (Sıra Sizdeyken):**\n\n`;
    game.turnPhases.forEach((tp: TurnPhase) => {
      res += `🔹 **${tp.phase}**\n${tp.description}\n\n`;
    });
    return res;
  }

  // How to win / Puanlama
  if (q.includes('nasıl kazanılır') || q.includes('kazan') || q.includes('puan') || q.includes('bit')) {
    return `🏆 **${game.title} - Kazanma Şartı:**\n\n${game.winCondition}\n\n${game.rulesKnowledge.trim()}`;
  }

  // Fallback helpful generic answer
  return `🎲 **${game.title} Kural Hakemi:**\n\nSorunuzla ilgili temel kural:\n${game.rulesKnowledge.trim()}\n\n💡 *Daha detaylı analiz için sorunuzu biraz daha açabilir veya yukarıdaki hazır kural haplarına dokunabilirsiniz.*`;
}
