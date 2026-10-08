import React from 'react';
import Link from 'next/link';
import { Home, Compass, Dices } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f0f9ff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-[3px] border-slate-900 dark:border-sky-500 rounded-3xl p-8 shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#38bdf8] space-y-6">
        
        {/* Pixel Icon badge */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-200 dark:bg-amber-900/60 border-2 border-slate-900 dark:border-amber-400 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center text-slate-900 dark:text-amber-300">
          <Dices className="w-10 h-10 animate-spin" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-lg bg-rose-200 dark:bg-rose-950/70 border-2 border-slate-900 dark:border-rose-500 text-rose-900 dark:text-rose-300 font-extrabold text-xs">
            HATA 404 • ZAR BOŞA DÜŞTÜ!
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Oyun Masası Bulunamadı!
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
            Görünüşe göre kuralları olmayan bir diyara adım attın veya bu oyun henüz kutusundan çıkarılmadı.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="pixel-btn pixel-btn-primary w-full py-3.5 px-6 min-h-[48px] text-sm font-extrabold flex items-center justify-center gap-2.5 transition"
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
            <span>Ana Masaya Geri Dön</span>
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs font-bold text-slate-500 dark:text-slate-500 flex items-center gap-1.5">
        <Compass className="w-3.5 h-3.5" />
        Kutu Oyunu Asistanı v2.0 • 8-Bit Masa Hakemi
      </p>
    </div>
  );
}
