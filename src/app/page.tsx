'use client';

import React, { useState } from 'react';
import { GAMES_DATA, GameData } from '@/data/games';
import { Navbar } from '@/components/Navbar';
import { QrModal } from '@/components/QrModal';
import { PixelScene } from '@/components/PixelScene';
import Link from 'next/link';
import {
  Users,
  Clock,
  ShieldCheck,
  Search,
  QrCode,
  Sparkles,
  ArrowRight,
  Printer,
  Compass,
  MessageSquare,
  Smartphone,
  Flame,
  Zap
} from 'lucide-react';

export const GAME_ICONS: Record<string, string> = {
  catan: '🌾',
  carcassonne: '🏰',
  'ticket-to-ride': '🚂',
  avalon: '👑',
  'exploding-kittens': '💣',
  splendor: '💎'
};

export default function HomePage() {
  const [gamesMap, setGamesMap] = useState<Record<string, GameData>>(GAMES_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Tümü');
  const [activeQrGame, setActiveQrGame] = useState<{ id: string; title: string } | null>(null);

  React.useEffect(() => {
    fetch('/api/games')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setGamesMap(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const gamesList: GameData[] = Object.values(gamesMap);

  const filteredGames = gamesList.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.tagline.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'Tümü' || game.difficulty.includes(selectedDifficulty);

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-900 flex flex-col">
      <Navbar />

      {/* Hero Section with Pixel Castle & Hills Illustration */}
      <section className="relative pt-6 sm:pt-8 bg-gradient-to-b from-[#e0f2fe] via-[#ecfdf5] to-[#f0fdf4] border-b-[3px] border-slate-900 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-200 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] text-slate-900 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" /> HAFTALIK KUTU OYUNU ETKİNLİĞİ ASİSTANI
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-display leading-tight">
            Masadaki Oyununuzu Seçin, <br className="hidden sm:inline" />
            <span className="bg-sky-300 px-3 py-0.5 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] rounded-xl inline-block mt-1">
              Kural Hakemi Yanınızda!
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl mx-auto leading-relaxed">
            Kitapçık aramakla uğraşmayın. Oyununuzu seçin ya da kutudaki QR kodu okutun; kurulum, tur akışı ve kural anlaşmazlıkları anında çözülsün.
          </p>

          {/* Quick Instant Jump Bar (Tak Diye Girme Alanı) */}
          <div className="pt-2 pb-1 max-w-2xl mx-auto">
            <div className="p-3 bg-white/95 border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Masadaki Oyuna Tek Tıkla Bağlan:
              </span>
              <div className="flex flex-wrap gap-2">
                {gamesList.map((g) => (
                  <Link
                    key={g.id}
                    href={`/game/${g.id}`}
                    className="pixel-btn px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-slate-900 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <span>{GAME_ICONS[g.id] || '🎲'}</span>
                    <span>{g.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pixel Art Scene (Castle, Rolling Hills, Trees & Dice) */}
        <div className="w-full mt-4 -mb-1">
          <PixelScene />
        </div>
      </section>

      {/* Main Content & Games Grid */}
      <section className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {/* Search & Fast Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
            <input
              type="text"
              placeholder="Oyun ara (Catan, Avalon, Splendor...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-600 mr-1 shrink-0">Zorluk:</span>
            {['Tümü', 'Kolay', 'Orta', 'Zor'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`pixel-btn px-3 py-1.5 text-xs font-bold shrink-0 transition ${
                  selectedDifficulty === diff
                    ? 'bg-emerald-300 text-slate-900'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="pixel-box-card bg-white p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-sky-100 border-2 border-slate-900 text-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
                    {game.category}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-200 border-2 border-slate-900 text-slate-900 shadow-[1px_1px_0px_0px_#0f172a] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-emerald-800" /> {game.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl">{GAME_ICONS[game.id] || '🎲'}</span>
                  <h3 className="text-xl font-extrabold text-slate-900 font-display group-hover:text-sky-600 transition">
                    {game.title}
                  </h3>
                </div>

                <p className="text-xs font-semibold text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                  {game.tagline}
                </p>

                {/* Info row */}
                <div className="grid grid-cols-3 gap-2 py-2.5 border-y-2 border-slate-900 mb-5 text-[11px] font-bold text-slate-800">
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-sky-50 border border-slate-300 text-center">
                    <Users className="w-3.5 h-3.5 text-sky-600 mb-0.5" />
                    <span className="truncate max-w-[80px]">{game.players.split(' ')[0]}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-50 border border-slate-300 text-center">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
                    <span>{game.duration}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-amber-50 border border-slate-300 text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 mb-0.5" />
                    <span>{game.difficulty}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href={`/game/${game.id}`}
                  className="w-full pixel-btn pixel-btn-primary py-2.5 px-4 text-xs font-extrabold transition flex items-center justify-center gap-2"
                >
                  <span>Kural Hakemini Aç</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveQrGame({ id: game.id, title: game.title })}
                    className="pixel-btn bg-white hover:bg-slate-50 text-slate-900 py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-sky-600" /> Masa QR
                  </button>
                  <Link
                    href={`/print/${game.id}`}
                    target="_blank"
                    className="pixel-btn bg-emerald-100 hover:bg-emerald-200 text-slate-900 py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-800" /> Kart Bas
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-16 text-sm font-bold text-slate-500">
            Aradığınız kriterlere uygun oyun bulunamadı!
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-slate-900 bg-white py-6 px-4 text-center text-xs font-bold text-slate-600">
        <p>© 2026 Kutu Oyunu AI Asistanı — Etkinlikleriniz için akıllı masa arkadaşı.</p>
      </footer>

      {/* QR Modal */}
      {activeQrGame && (
        <QrModal
          isOpen={Boolean(activeQrGame)}
          onClose={() => setActiveQrGame(null)}
          gameId={activeQrGame.id}
          gameTitle={activeQrGame.title}
        />
      )}
    </div>
  );
}
