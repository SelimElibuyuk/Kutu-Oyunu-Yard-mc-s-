'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dices, Key, Gamepad2 } from 'lucide-react';
import { ApiKeyModal } from './ApiKeyModal';

export const Navbar: React.FC = () => {
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key');
    setHasApiKey(Boolean(key));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-[3px] border-slate-900 shadow-[0_3px_0_0_rgba(15,23,42,0.06)]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-sky-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center text-slate-900 group-hover:-rotate-6 transition-transform">
              <Dices className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  KUTU OYUNU ASİSTANI
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-200 border border-slate-900 font-bold text-slate-900 hidden sm:inline-block">
                  CANLI
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 hidden sm:block">
                Haftalık Oyun Etkinlikleri Masa Hakemi
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className={`pixel-btn px-3 py-1.5 text-xs flex items-center gap-1.5 transition ${
                hasApiKey
                  ? 'bg-emerald-200 text-slate-900'
                  : 'bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold">
                {hasApiKey ? 'Gemini AI Aktif' : 'API Anahtarı'}
              </span>
              <span
                className={`w-2 h-2 rounded-full border border-slate-900 ${
                  hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </button>

            <Link
              href="/"
              className="pixel-btn pixel-btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5 font-bold"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Oyunlar</span>
            </Link>
          </div>
        </div>
      </header>

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSaved={(key) => setHasApiKey(Boolean(key))}
      />
    </>
  );
};
