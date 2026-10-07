import { GAMES_DATA } from '@/data/games';
import { notFound } from 'next/navigation';
import { PrintClient } from '@/components/PrintClient';

interface PrintPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return Object.keys(GAMES_DATA).map((id) => ({ id }));
}

export default async function PrintPage({ params }: PrintPageProps) {
  const resolvedParams = await params;
  const game = GAMES_DATA[resolvedParams.id];

  if (!game) {
    notFound();
  }

  return <PrintClient game={game} />;
}
