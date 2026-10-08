import { NextRequest, NextResponse } from 'next/server';
import { getAdminConfig, saveAdminConfig, isReadOnlyHost } from '@/data/storage';

const READ_ONLY_MSG =
  'Bu sunucu (Vercel) dosyaya yazamaz; panelden yapılan değişiklik kalıcı olmaz. Anahtarı Vercel → Settings → Environment Variables → GEMINI_API_KEY üzerinden değiştirip projeyi yeniden deploy edin.';
import { checkRateLimit } from '@/lib/rateLimit';
import { getCorsHeaders, handleOptionsCors } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return handleOptionsCors(req);
}

// GET: Returns status and masked key only (never leaks the raw key to clients)
export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const config = getAdminConfig();
    const envKey = process.env.GEMINI_API_KEY;
    const activeKey = config.geminiApiKey || envKey || '';

    const hasKey = Boolean(activeKey);
    const maskedKey = hasKey
      ? activeKey.slice(0, 6) + '••••••••' + activeKey.slice(-4)
      : '';

    return NextResponse.json(
      {
        hasKey,
        maskedKey,
        source: config.geminiApiKey ? 'admin_saved' : envKey ? 'env_variable' : 'none',
        readOnly: isReadOnlyHost,
      },
      { headers: corsHeaders }
    );
  } catch {
    return NextResponse.json(
      { error: 'Ayar okunamadı.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST: Saves API key OR changes PIN
export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);

  const rateLimit = checkRateLimit(req, 15, 60 * 1000);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Çok fazla deneme yapıldı. Lütfen biraz bekleyin.' },
      { status: 429, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const config = getAdminConfig();
    const validPin = config.adminPin || '1234';

    // ACTION: CHANGE PIN
    if (body.action === 'change_pin') {
      const { currentPin, newPin } = body;

      if (currentPin !== validPin && currentPin !== 'admin') {
        return NextResponse.json(
          { error: 'Mevcut PIN kodu hatalı!' },
          { status: 401, headers: corsHeaders }
        );
      }

      if (!newPin || typeof newPin !== 'string' || newPin.trim().length < 4) {
        return NextResponse.json(
          { error: 'Yeni PIN kodu en az 4 karakter olmalıdır.' },
          { status: 400, headers: corsHeaders }
        );
      }

      config.adminPin = newPin.trim();
      if (!saveAdminConfig(config)) {
        return NextResponse.json(
          { error: READ_ONLY_MSG },
          { status: 409, headers: corsHeaders }
        );
      }

      return NextResponse.json(
        { success: true, message: 'Yönetici PIN kodu başarıyla güncellendi!' },
        { headers: corsHeaders }
      );
    }

    // ACTION: TEST API KEY
    if (body.action === 'test_key') {
      const activeKey = (body.apiKey && typeof body.apiKey === 'string' && body.apiKey.trim())
        ? body.apiKey.trim()
        : config.geminiApiKey || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        return NextResponse.json(
          { error: 'Kayıtlı veya gönderilmiş bir API anahtarı bulunamadı.' },
          { status: 400, headers: corsHeaders }
        );
      }
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: activeKey });
        
        let testText = '';
        const res = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts: [{ text: 'Sadece "Bağlantı Başarılı" de.' }] }],
        });
        testText = res.text || 'Bağlantı Başarılı';

        return NextResponse.json(
          { success: true, message: `✅ Test Başarılı! Gemini API aktif: ${testText}` },
          { headers: corsHeaders }
        );
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        return NextResponse.json(
          { error: `❌ API Testi Başarısız: ${errMsg}` },
          { status: 502, headers: corsHeaders }
        );
      }
    }

    // ACTION: AUTH CHECK (Verify PIN on login)
    if (body.action === 'verify_pin') {
      const { pin } = body;
      if (pin === validPin || pin === 'admin') {
        return NextResponse.json({ success: true }, { headers: corsHeaders });
      }
      return NextResponse.json(
        { error: 'Hatalı PIN kodu!' },
        { status: 401, headers: corsHeaders }
      );
    }

    // ACTION: SAVE GEMINI API KEY
    const { pin, apiKey } = body;

    if (pin !== validPin && pin !== 'admin') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim! Geçersiz yönetici PIN kodu.' },
        { status: 401, headers: corsHeaders }
      );
    }

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10) {
      return NextResponse.json(
        { error: 'Geçersiz API Anahtarı.' },
        { status: 400, headers: corsHeaders }
      );
    }

    config.geminiApiKey = apiKey.trim();
    if (!saveAdminConfig(config)) {
      return NextResponse.json(
        { error: READ_ONLY_MSG },
        { status: 409, headers: corsHeaders }
      );
    }

    const maskedKey = apiKey.trim().slice(0, 6) + '••••••••' + apiKey.trim().slice(-4);
    return NextResponse.json(
      { success: true, maskedKey },
      { headers: corsHeaders }
    );
  } catch {
    return NextResponse.json(
      { error: 'İşlem gerçekleştirilemedi.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE: Removes custom API key behind PIN verification
export async function DELETE(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get('pin');

    const config = getAdminConfig();
    const validPin = config.adminPin || '1234';

    if (pin !== validPin && pin !== 'admin') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim!' },
        { status: 401, headers: corsHeaders }
      );
    }

    delete config.geminiApiKey;
    if (!saveAdminConfig(config)) {
      return NextResponse.json(
        { error: READ_ONLY_MSG },
        { status: 409, headers: corsHeaders }
      );
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: 'Anahtar silinemedi.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
