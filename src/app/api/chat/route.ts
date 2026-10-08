import { NextRequest, NextResponse } from 'next/server';
import { getStoredGames, getAdminConfig } from '@/data/storage';
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
    const { gameId, messages } = body;

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
    
    // Read from environment variable or admin server configuration
    const adminConfig = getAdminConfig();
    const apiKey = process.env.GEMINI_API_KEY || adminConfig.geminiApiKey;

    // 2. If Gemini API Key is configured on the server, invoke Google GenAI SDK
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
      } catch {
        // Fallback to local rule engine if API fails
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
  const q = query.toLowerCase();

  // 1. FAQ Exact or Keyword Match
  const matchingFaq = game.faqs.find((f) =>
    f.question.toLowerCase().split(' ').some((word) => word.length > 3 && q.includes(word))
  );
  if (matchingFaq) {
    return `**Hakem Kararı:**\n\n${matchingFaq.answer}\n\n*(Kaynak: ${matchingFaq.pageRef || 'Resmi Kural Kitapçığı'})*`;
  }

  // 2. Setup query
  if (q.includes('kurulum') || q.includes('dizilim') || q.includes('başla') || q.includes('hazır')) {
    const steps = game.setupSteps
      .map((s: SetupStep, i: number) => `**${i + 1}. ${s.title}**: ${s.description}`)
      .join('\n\n');
    return `**${game.title} Kurulum Sırası:**\n\n${steps}`;
  }

  // 3. Turn query
  if (q.includes('sıra') || q.includes('tur') || q.includes('hamle') || q.includes('akış')) {
    const phases = game.turnPhases
      .map((p: TurnPhase) => `**${p.phase}**: ${p.description}`)
      .join('\n\n');
    return `**${game.title} Tur Akışı:**\n\n${phases}`;
  }

  // 4. Win condition query
  if (q.includes('kazan') || q.includes('puan') || q.includes('skor') || q.includes('bit')) {
    return `**Kazanma Şartı:**\n\n${game.winCondition}`;
  }

  // 5. Default rules summary
  return `**Hakem Notu (${game.title}):**\n\n${game.rulesKnowledge}\n\n*💡 Detaylı kural çelişkisi için soru sorabilir veya yukarıdaki sekmelerden Kurulum / Tur Akışı bölümlerini inceleyebilirsiniz.*`;
}
