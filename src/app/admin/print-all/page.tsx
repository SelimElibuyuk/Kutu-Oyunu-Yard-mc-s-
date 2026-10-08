'use client';

import React, { useState, useEffect } from 'react';
import { GameData } from '@/data/games';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, ArrowLeft, Dices, Users, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrintAllPage() {
  const [games, setGames] = useState<GameData[]>([]);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }

    fetch('/api/games')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setGames(Object.values(data));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-900 p-6 print:bg-white print:p-0">
      {/* Non-print toolbar */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/admin"
          className="pixel-btn bg-white px-3 py-2 min-h-[44px] text-xs font-bold inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Yönetici Paneline Dön
        </Link>

        <button
          onClick={() => window.print()}
          className="pixel-btn pixel-btn-accent px-5 py-2 min-h-[44px] text-xs font-extrabold flex items-center gap-2 shadow-lg"
        >
          <Printer className="w-4 h-4 stroke-[2.5]" /> Tüm Masa Kartlarını Yazdır (A4)
        </button>
      </div>

      {/* Cards Grid for Printing */}
      <div className="max-w-4xl mx-auto space-y-6 print:space-y-8">
        {games.map((game) => {
          const gameUrl = `${baseUrl}/game/${game.id}`;
          return (
            <div
              key={game.id}
              className="bg-white border-[3px] border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_0px_#0f172a] print:border-4 print:border-black print:shadow-none print:break-inside-avoid print:page-break-after-always"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left info column */}
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-200 border-2 border-slate-900 rounded-lg text-slate-900 text-xs font-display font-extrabold shadow-[2px_2px_0px_0px_#0f172a]">
                    <Dices className="w-4 h-4 stroke-[2.5]" /> KUTU OYUNU HAKEMİ
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display">
                    {game.title}
                  </h2>

                  <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                    {game.tagline}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-bold text-slate-800 pt-1">
                    <span className="flex items-center gap-1 bg-sky-100 px-2.5 py-1 rounded-lg border-2 border-slate-900">
                      <Users className="w-3.5 h-3.5 text-sky-700" /> {game.players}
                    </span>
                    <span className="flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-lg border-2 border-slate-900">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" /> {game.duration}
                    </span>
                    <span className="flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-lg border-2 border-slate-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> {game.difficulty}
                    </span>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-900 text-xs text-slate-700 space-y-1">
                    <p className="font-display text-xs font-black text-slate-900">
                      💡 KURALLARDA TAKILDINIZ MI?
                    </p>
                    <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                      1. Telefon kameranızı açın.<br />
                      2. QR kodu okutun.<br />
                      3. Kurulum, kural çelişkileri ve turlar hakkında yapay zekaya sorun!
                    </p>
                  </div>
                </div>

                {/* Right QR Column */}
                <div className="flex flex-col items-center shrink-0 p-4 bg-sky-50 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
                  <div className="p-2.5 bg-white rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                    <QRCodeSVG
                      value={gameUrl}
                      size={160}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <span className="mt-2.5 text-[11px] font-display font-black text-slate-900 tracking-wider">
                    MASA ASİSTANI
                  </span>
                  <span className="text-[9px] font-mono font-bold text-slate-600 max-w-[160px] truncate mt-0.5">
                    {gameUrl}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
