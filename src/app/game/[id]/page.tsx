import { GAMES_DATA } from '@/data/games';
import { notFound } from 'next/navigation';
import { GameClient } from '@/components/GameClient';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return Object.keys(GAMES_DATA).map((id) => ({ id }));
}

export default async function GamePage({ params }: GamePageProps) {
  const resolvedParams = await params;
  const game = GAMES_DATA[resolvedParams.id];

  if (!game) {
    notFound();
  }

  return <GameClient game={game} />;
}
