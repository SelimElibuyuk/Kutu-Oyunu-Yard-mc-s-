'use client';

import React, { useState, useEffect } from 'react';
import { GameData } from '@/data/games';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Sparkles, Users, Clock, ShieldCheck, ArrowLeft, Dices } from 'lucide-react';
import Link from 'next/link';

interface PrintClientProps {
  game: GameData;
}

export const PrintClient: React.FC<PrintClientProps> = ({ game }) => {
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(`${window.location.origin}/game/${game.id}`);
    }
  }, [game.id]);

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-slate-900 p-6 flex flex-col items-center justify-center print:bg-white print:p-0">
      {/* Non-print toolbar */}
      <div className="w-full max-w-2xl mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/game/${game.id}`}
          className="pixel-btn bg-white px-3 py-2 text-xs font-bold inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Asistan Ekranına Dön
        </Link>
        <button
          onClick={() => window.print()}
          className="pixel-btn pixel-btn-accent px-4 py-2 text-xs font-bold flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Masa Kartını Yazdır (Print)
        </button>
      </div>

      {/* The Printable Card / Table Tent */}
      <div className="w-full max-w-2xl bg-white text-slate-950 rounded-2xl p-8 border-[4px] border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] print:border-4 print:border-black print:shadow-none print:m-0 print:max-w-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left info column */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-200 border-2 border-slate-900 rounded-lg text-slate-900 text-xs font-display font-extrabold shadow-[2px_2px_0px_0px_#0f172a]">
              <Dices className="w-4 h-4" /> KUTU OYUNU HAKEMİ
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              {game.title}
            </h1>

            <p className="text-sm font-semibold text-slate-600 leading-relaxed">
              {game.tagline}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs font-bold text-slate-800 pt-1">
              <span className="flex items-center gap-1.5 bg-sky-100 px-3 py-1.5 rounded-lg border-2 border-slate-900">
                <Users className="w-3.5 h-3.5 text-sky-700" /> {game.players}
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-100 px-3 py-1.5 rounded-lg border-2 border-slate-900">
                <Clock className="w-3.5 h-3.5 text-emerald-700" /> {game.duration}
              </span>
              <span className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-lg border-2 border-slate-900">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> {game.difficulty}
              </span>
            </div>

            <div className="pt-4 border-t-2 border-slate-900 text-xs text-slate-700 space-y-1.5">
              <p className="font-display text-xs font-black text-slate-900">💡 KURALLARDA TAKILDINIZ MI?</p>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                1. Telefon kamerasını açın.<br />
                2. Yan taraftaki QR kodu okutun.<br />
                3. Kurulum, kural çelişkileri ve turlar hakkında yapay zekaya anında sorun!
              </p>
            </div>
          </div>

          {/* Right QR Column */}
          <div className="flex flex-col items-center shrink-0 p-5 bg-sky-50 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
            <div className="p-3 bg-white rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              {appUrl ? (
                <QRCodeSVG
                  value={appUrl}
                  size={180}
                  level="H"
                  includeMargin={false}
                />
              ) : (
                <div className="w-[180px] h-[180px] bg-slate-100 animate-pulse rounded" />
              )}
            </div>
            <span className="mt-3 text-xs font-display font-black text-slate-900 tracking-wider">
              MASA ASİSTANI
            </span>
            <span className="text-[9px] font-mono font-bold text-slate-600 max-w-[180px] truncate mt-0.5">
              {appUrl}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
