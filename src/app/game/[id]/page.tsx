import { getStoredGames } from '@/data/storage';
import { notFound } from 'next/navigation';
import { GameClient } from '@/components/GameClient';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const games = getStoredGames();
  return Object.keys(games).map((id) => ({ id }));
}

export default async function GamePage({ params }: GamePageProps) {
  const resolvedParams = await params;
  const games = getStoredGames();
  const game = games[resolvedParams.id];

  if (!game) {
    notFound();
  }

  return <GameClient game={game} />;
}
