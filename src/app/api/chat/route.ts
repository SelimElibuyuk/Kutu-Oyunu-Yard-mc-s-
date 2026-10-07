import { NextRequest, NextResponse } from 'next/server';
import { GAMES_DATA } from '@/data/games';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameId, messages, userApiKey } = body;

    const game = GAMES_DATA[gameId];
    if (!game) {
      return NextResponse.json({ error: 'Oyun bulunamadı' }, { status: 404 });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    // 1. If Gemini API Key is provided, use Google GenAI SDK
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

        // Format history for Gemini
        const contents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction
          }
        });

        const reply = response.text || 'Üzgünüm, şu an yanıt üretemedim. Lütfen tekrar deneyin.';
        return NextResponse.json({ reply, source: 'gemini' });
      } catch (err: unknown) {
        console.error('Gemini API Error, falling back to local engine:', err);
        // Fall back to rule-based engine if API fails
      }
    }

    // 2. Built-in Smart Rule Engine (Instant Offline Fallback)
    const reply = generateRuleEngineResponse(game, lastMessage);
    return NextResponse.json({ reply, source: 'local_engine' });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}

function generateRuleEngineResponse(game: typeof GAMES_DATA[string], query: string): string {
  const q = query.toLowerCase().trim();

  // Check exact/close FAQ matches
  for (const faq of game.faqs) {
    const faqQ = faq.question.toLowerCase();
    const words = faqQ.split(' ').filter(w => w.length > 3);
    const matchCount = words.filter(w => q.includes(w)).length;
    
    if (matchCount >= 2 || q.includes(faqQ) || faqQ.includes(q)) {
      return `🎲 **Hakem Kararı (${faq.pageRef || 'Kural Kitapçığı'}):**\n\n${faq.answer}\n\n*Masada iyi eğlenceler! Başka bir kural anlaşmazlığı olursa sormaktan çekinmeyin.*`;
    }
  }

  // Setup / Kurulum queries
  if (q.includes('kurulum') || q.includes('nasıl kurulur') || q.includes('başla') || q.includes('hazır')) {
    let res = `📋 **${game.title} Hızlı Kurulum Adımları:**\n\n`;
    game.setupSteps.forEach((step, idx) => {
      res += `**${idx + 1}. ${step.title}:** ${step.description}\n`;
      if (step.tip) res += `💡 *İpucu: ${step.tip}*\n`;
      res += '\n';
    });
    return res;
  }

  // Turn flow / Sıra bendeyken ne yaparım
  if (q.includes('sıra') || q.includes('tur') || q.includes('hamle') || q.includes('ne yapabilirim') || q.includes('aşama')) {
    let res = `⏱️ **${game.title} Tur Akışı (Sıra Sizdeyken):**\n\n`;
    game.turnPhases.forEach(tp => {
      res += `🔹 **${tp.phase}**\n${tp.description}\n\n`;
    });
    return res;
  }

  // How to win / Puanlama
  if (q.includes('nasıl kazanılır') || q.includes('kazan') || q.includes('puan') || q.includes('bit')) {
    return `🏆 **${game.title} - Kazanma Şartı:**\n\n${game.winCondition}\n\n${game.rulesKnowledge.trim()}`;
  }

  // Keyword-based smart matches per game
  if (game.id === 'catan') {
    if (q.includes('7') || q.includes('yedi') || q.includes('hırsız')) {
      return `🎲 **Zarda 7 ve Hırsız Kuralı:**\n\n1. **El Kontrolü:** Elinde **8 veya daha fazla** kartı olan herkes kartlarının tam yarısını bankaya atmak zorundadır.\n2. **Hırsızı Taşı:** Zarı atan oyuncu hırsızı çöl dahil istediği başka bir araziye taşır.\n3. **Kart Çalma:** Hırsızın yeni taşındığı arazide köyü/şehri olan bir oyuncunun elinden görmeden 1 rastgele kaynak çeker.\n4. **Üretim Engeli:** Hırsız o arazide durduğu sürece, o sayı atılsa bile oradan kimse kaynak alamaz!`;
    }
    if (q.includes('yol') || q.includes('en uzun')) {
      return `🛣️ **En Uzun Ticaret Yolu Kuralı:**\n\n- En az **5 kesintisiz yol** yapan ilk oyuncu 2 Zafer Puanı değerindeki kartı alır.\n- Bir başkası daha uzun yol yaparsa kart anında ona geçer.\n- **Yolun Kesilmesi:** Eğer bir rakip, sizin yolunuzun üzerindeki boş bir kavşağa kurala uygun (2 yol mesafe kuralı) köy dikerse yolunuz ikiye bölünür!`;
    }
    if (q.includes('gelişim') || q.includes('kart')) {
      return `🃏 **Gelişim Kartı Kuralları:**\n\n- Satın aldığınız tur o kartı **OYNAMAZSINIZ** (bir sonraki tur oynayabilirsiniz).\n- Bir turda en fazla 1 gelişim kartı oynanabilir.\n- **İstisna:** Satın aldığınız kart "Zafer Puanı" ise ve bu kartla 10 puana ulaşıyorsanız hemen gösterip oyunu bitirebilirsiniz.`;
    }
  }

  if (game.id === 'carcassonne') {
    if (q.includes('manastır') || q.includes('rahip') || q.includes('keşiş')) {
      return `⛪ **Manastır Kuralı:**\n\n- Manastır karosu, etrafındaki 8 karenin tamamı karolarla çevrelendiğinde (toplam 9 karo) tamamlanır.\n- Tamamlandığında sahibine tam **9 PUAN** kazandırır ve piyon sahibine geri döner.\n- Oyun sonunda yarım kalırsa: Manastır + etrafındaki karo sayısı kadar puan verir.`;
    }
    if (q.includes('şehir') || q.includes('kale')) {
      return `🏰 **Şehir Puanlaması:**\n\n- Tamamlanan şehir: Her karo için **2 puan**, her kalkan simgesi için ekstra **2 puan** verir.\n- Oyun sonu yarım kalan şehir: Karo başına **1 puan**, kalkan başına **1 puan** verir.`;
    }
  }

  if (game.id === 'avalon') {
    if (q.includes('merlin') || q.includes('suikast')) {
      return `👑 **Merlin & Suikastçi Kuralı:**\n\n- Merlin tüm kötü karakterleri bilir (Mordred hariç).\n- İyiler 3 görevi tamamlasa bile oyun bitmez! Kötülerin Suikastçisi (Assassin) Merlin'in kim olduğunu tahmin ederse kötüler oyunu tersine çevirip KAZANIR! Bu yüzden Merlin kendini asla açık etmemelidir.`;
    }
    if (q.includes('başarısız') || q.includes('fail')) {
      return `⚔️ **Görev Kartı Kuralı:**\n\n- **İyi karakterler ASLA Fail (Başarısızlık) kartı ATAMAZ!** Sadece Başarı atabilirler.\n- Sadece kötü karakterler stratejilerine göre Başarı veya Başarısızlık atabilir.`;
    }
  }

  // Fallback helpful generic answer
  return `🎲 **${game.title} Kural Hakemi:**\n\nSorunuzla ilgili temel kural:\n${game.rulesKnowledge.trim()}\n\n💡 *Daha detaylı analiz veya farklı bir kural durumu için sorunuzu biraz daha açabilirsiniz (Örn: "${game.quickPrompts[0]}").*\n*(İpucu: Sağ üstteki ayarlardan Gemini API Anahtarı girerek tüm özel senaryolarda derin yapay zeka analizini de aktifleştirebilirsiniz!)*`;
}
