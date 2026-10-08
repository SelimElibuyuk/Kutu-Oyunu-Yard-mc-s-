'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dices, Trophy, Gamepad2, Shield } from 'lucide-react';
import { DiceRoller } from './DiceRoller';
import { ScoreTracker } from './ScoreTracker';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const [isDiceOpen, setIsDiceOpen] = useState(false);
  const [isScoreOpen, setIsScoreOpen] = useState(false);

  // Hide on print views
  if (pathname.includes('/print')) {
    return null;
  }

  return (
    <>
      <nav
        aria-label="Mobil Hızlı Menü"
        className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t-[3px] border-slate-900 dark:border-sky-500 shadow-[0_-3px_0_0_rgba(15,23,42,0.06)] px-2 py-1.5"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl font-bold transition ${
              pathname === '/'
                ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gamepad2 className="w-5 h-5 stroke-[2.3]" />
            <span className="text-[10px] mt-0.5">Oyunlar</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsDiceOpen(true)}
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 transition"
          >
            <Dices className="w-5 h-5 text-amber-500 stroke-[2.3]" />
            <span className="text-[10px] mt-0.5">Zar At</span>
          </button>

          <button
            type="button"
            onClick={() => setIsScoreOpen(true)}
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition"
          >
            <Trophy className="w-5 h-5 text-emerald-500 stroke-[2.3]" />
            <span className="text-[10px] mt-0.5">Skor</span>
          </button>

          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl font-bold transition ${
              pathname.startsWith('/admin')
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-5 h-5 stroke-[2.3]" />
            <span className="text-[10px] mt-0.5">Yönetici</span>
          </Link>
        </div>
      </nav>

      {/* Floating Global Modals */}
      <DiceRoller isOpen={isDiceOpen} onClose={() => setIsDiceOpen(false)} />
      <ScoreTracker
        isOpen={isScoreOpen}
        onClose={() => setIsScoreOpen(false)}
        gameTitle="Etkinlik Masası"
      />
    </>
  );
};
