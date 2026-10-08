'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dices, Gamepad2, Shield } from 'lucide-react';
import { GamePickerModal } from './GamePickerModal';

export const Navbar: React.FC = () => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-[3px] border-slate-900 shadow-[0_3px_0_0_rgba(15,23,42,0.06)]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 min-h-[44px]">
            <div className="w-10 h-10 rounded-xl bg-sky-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center text-slate-900 group-hover:-rotate-6 transition-transform">
              <Dices className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
                KUTU OYUNU ASİSTANI
              </span>
              <span className="text-[11px] font-bold text-slate-500 hidden sm:block mt-0.5">
                Masa Hakemi
              </span>
            </div>
          </Link>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Game Picker - opens interactive searchable game drawer */}
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="pixel-btn pixel-btn-primary min-h-[44px] px-3.5 text-xs flex items-center gap-1.5 font-bold cursor-pointer"
              title="Tüm oyunları ara ve seç"
            >
              <Gamepad2 className="w-4 h-4 shrink-0" />
              <span>Oyunlar</span>
            </button>

            {/* Admin panel */}
            <Link
              href="/admin"
              className="pixel-btn bg-amber-200 hover:bg-amber-300 text-slate-900 min-h-[44px] px-3.5 text-xs flex items-center gap-1.5 font-bold"
              title="Yönetici Paneli"
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Yönetici</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Interactive Game Picker Modal */}
      <GamePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
      />
    </>
  );
};
