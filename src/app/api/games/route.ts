import { NextRequest, NextResponse } from 'next/server';
import { getStoredGames, saveGame, deleteGame } from '@/data/storage';
import { GameData } from '@/data/games';

export async function GET() {
  try {
    const games = getStoredGames();
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Oyunlar yüklenemedi' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { game } = body as { game: GameData };

    if (!game || !game.id || !game.title) {
      return NextResponse.json({ error: 'Geçersiz oyun bilgisi' }, { status: 400 });
    }

    // Slug formatting for id if not provided or contains spaces
    game.id = game.id.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    saveGame(game);
    return NextResponse.json({ success: true, game });
  } catch (error) {
    console.error('Error saving game:', error);
    return NextResponse.json({ error: 'Oyun kaydedilemedi' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parametresi gerekli' }, { status: 400 });
    }

    const success = deleteGame(id);
    if (!success) {
      return NextResponse.json({ error: 'Oyun bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json({ error: 'Oyun silinemedi' }, { status: 500 });
  }
}
