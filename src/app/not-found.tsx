import React from 'react';
import Link from 'next/link';
import { Home, Compass, Dices } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f0f9ff] text-slate-900 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-full max-w-md bg-white border-[3px] border-slate-900 rounded-3xl p-8 shadow-[6px_6px_0px_0px_#0f172a] space-y-6">
        
        {/* Pixel Icon badge */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-200 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center text-slate-900">
          <Dices className="w-10 h-10 animate-spin" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-lg bg-rose-200 border-2 border-slate-900 text-rose-900 font-extrabold text-xs">
            HATA 404 • ZAR BOŞA DÜŞTÜ!
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900">
            Oyun Masası Bulunamadı!
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
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

      <p className="mt-8 text-xs font-bold text-slate-500 flex items-center gap-1.5">
        <Compass className="w-3.5 h-3.5" />
        Kutu Oyunu Asistanı • 8-Bit Masa Hakemi
      </p>
    </div>
  );
}
