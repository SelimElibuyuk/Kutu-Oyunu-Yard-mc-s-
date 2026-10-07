import { getStoredGames } from '@/data/storage';
import { notFound } from 'next/navigation';
import { PrintClient } from '@/components/PrintClient';

interface PrintPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const games = getStoredGames();
  return Object.keys(games).map((id) => ({ id }));
}

export default async function PrintPage({ params }: PrintPageProps) {
  const resolvedParams = await params;
  const games = getStoredGames();
  const game = games[resolvedParams.id];

  if (!game) {
    notFound();
  }

  return <PrintClient game={game} />;
}
