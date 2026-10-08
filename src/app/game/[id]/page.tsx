import { Suspense } from 'react';
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

async function GameContent({ params }: GamePageProps) {
  const resolvedParams = await params;
  const games = getStoredGames();
  const game = games[resolvedParams.id];

  if (!game) {
    notFound();
  }

  return <GameClient game={game} />;
}

export default function GamePage({ params }: GamePageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center p-4">
          <div className="bg-white border-[3px] border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_#0f172a] text-center max-w-sm w-full">
            <span className="text-3xl animate-bounce inline-block mb-3">🎲</span>
            <h2 className="text-base font-extrabold text-slate-900 font-display">Oyun Masası Açılıyor...</h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">Kural kitapçığı ve hakem hazırlanıyor</p>
          </div>
        </div>
      }
    >
      <GameContent params={params} />
    </Suspense>
  );
}
