import { Suspense } from 'react';
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

async function PrintContent({ params }: PrintPageProps) {
  const resolvedParams = await params;
  const games = getStoredGames();
  const game = games[resolvedParams.id];

  if (!game) {
    notFound();
  }

  return <PrintClient game={game} />;
}

export default function PrintPage({ params }: PrintPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-900 rounded-xl p-4 text-center font-bold text-xs text-slate-700">
            Yazdırma Kartı Hazırlanıyor...
          </div>
        </div>
      }
    >
      <PrintContent params={params} />
    </Suspense>
  );
}
