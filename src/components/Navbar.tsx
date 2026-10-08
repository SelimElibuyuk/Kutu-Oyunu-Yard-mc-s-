'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dices, Key, Gamepad2, Shield } from 'lucide-react';
import { ApiKeyModal } from './ApiKeyModal';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key');
    setHasApiKey(Boolean(key));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-[3px] border-slate-900 dark:border-sky-500 shadow-[0_3px_0_0_rgba(15,23,42,0.06)] transition-colors">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0 min-h-[44px]">
            <div className="w-10 h-10 rounded-xl bg-sky-300 dark:bg-sky-500 border-2 border-slate-900 dark:border-slate-800 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center text-slate-900 group-hover:-rotate-6 transition-transform">
              <Dices className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-sm sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  KUTU OYUNU ASİSTANI
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-200 dark:bg-emerald-900 border border-slate-900 dark:border-emerald-400 font-bold text-slate-900 dark:text-emerald-200 hidden sm:inline-block">
                  CANLI
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:block">
                Haftalık Oyun Etkinlikleri Masa Hakemi
              </p>
            </div>
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle (44x44px button) */}
            <ThemeToggle />

            {/* Custom Gemini API Key button */}
            <button
              type="button"
              onClick={() => setIsKeyModalOpen(true)}
              className={`pixel-btn min-h-[44px] px-2.5 sm:px-3 text-xs flex items-center gap-1.5 transition ${
                hasApiKey
                  ? 'bg-emerald-200 dark:bg-emerald-950 text-slate-900 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title="Özel Gemini API Anahtarı Tanımla"
              aria-label="API Anahtarı Ayarları"
            >
              <Key className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline font-bold">
                {hasApiKey ? 'Gemini AI Aktif' : 'API Anahtarı'}
              </span>
              <span
                className={`w-2 h-2 rounded-full border border-slate-900 dark:border-white ${
                  hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </button>

            {/* Home / Games link */}
            <Link
              href="/"
              className="pixel-btn pixel-btn-primary min-h-[44px] px-3 text-xs flex items-center gap-1.5 font-bold"
              title="Tüm Kutu Oyunları"
            >
              <Gamepad2 className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Oyunlar</span>
            </Link>

            {/* Admin panel link */}
            <Link
              href="/admin"
              className="pixel-btn bg-amber-200 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 text-slate-900 min-h-[44px] px-2.5 sm:px-3 text-xs flex items-center gap-1.5 font-bold"
              title="Yönetici Paneli"
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Yönetici</span>
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
