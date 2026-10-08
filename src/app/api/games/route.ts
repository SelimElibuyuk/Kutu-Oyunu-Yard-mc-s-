import { NextRequest, NextResponse } from 'next/server';
import { getStoredGames, saveGame, deleteGame } from '@/data/storage';
import { GameData } from '@/data/games';
import { checkRateLimit } from '@/lib/rateLimit';
import { getCorsHeaders, handleOptionsCors } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return handleOptionsCors(req);
}

export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const games = getStoredGames();
    return NextResponse.json(games, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: 'Oyun listesi yüklenemedi.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);

  // Rate limiting for admin writes (30 per minute)
  const rateLimit = checkRateLimit(req, 30, 60 * 1000);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Çok fazla istek yapıldı. Lütfen biraz bekleyin.' },
      { status: 429, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const { game } = body as { game: GameData };

    if (!game || !game.id || !game.title) {
      return NextResponse.json(
        { error: 'Geçersiz oyun verisi. ID ve Başlık zorunludur.' },
        { status: 400, headers: corsHeaders }
      );
    }

    game.id = game.id
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    saveGame(game);
    return NextResponse.json({ success: true, game }, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: 'Oyun kaydedilemedi.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);

  const rateLimit = checkRateLimit(req, 20, 60 * 1000);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Çok fazla istek yapıldı.' },
      { status: 429, headers: corsHeaders }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Silinecek oyun ID parametresi gereklidir.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const success = deleteGame(id);
    if (!success) {
      return NextResponse.json(
        { error: 'Silinecek oyun bulunamadı.' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: 'Oyun silinirken bir hata oluştu.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
