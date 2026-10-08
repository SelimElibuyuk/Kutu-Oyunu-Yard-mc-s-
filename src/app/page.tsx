'use client';

import React, { useState, useEffect } from 'react';
import { GAMES_DATA, GameData } from '@/data/games';
import { Navbar } from '@/components/Navbar';
import { QrModal } from '@/components/QrModal';
import { PixelScene } from '@/components/PixelScene';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
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
  Flame,
  Zap,
} from 'lucide-react';

export const GAME_ICONS: Record<string, string> = {
  catan: '🌾',
  carcassonne: '🏰',
  'ticket-to-ride-europe': '🚂',
  'ticket-to-ride': '🚂',
  splendor: '💎',
  '7-wonders': '🏛️',
  '7-wonders-duel': '⚔️',
  'secret-hitler': '🕵️',
  pandemic: '🧪',
  munchkin: '🗡️',
  cluedo: '🔍',
  codenames: '🕶️',
  monopoly: '🎩',
  tabu: '🗣️',
  bang: '🤠',
  scrabble: '🔤',
  jenga: '🧱',
  uno: '🃏',
  'uno-flip': '🔄',
  'uno-no-mercy': '⚡',
  cascadia: '🌲',
  wyrmspan: '🐉',
  'machi-koro': '🏙️',
  citadels: '👑',
};

export default function HomePage() {
  const [gamesMap, setGamesMap] = useState<Record<string, GameData>>(GAMES_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Tümü');
  const [activeQrGame, setActiveQrGame] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/games')
      .then((res) => {
        if (!res.ok) throw new Error('API fetch error');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data && typeof data === 'object') {
          setGamesMap(data);
        }
      })
      .catch(() => {
        // Fallback already pre-seeded from GAMES_DATA
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const gamesList: GameData[] = Object.values(gamesMap);

  const filteredGames = gamesList.filter((game) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      game.title.toLowerCase().includes(term) ||
      game.category.toLowerCase().includes(term) ||
      game.tagline.toLowerCase().includes(term);

    const matchesDifficulty =
      selectedDifficulty === 'Tümü' || game.difficulty.includes(selectedDifficulty);

    return matchesSearch && matchesDifficulty;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('Tümü');
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      {/* Hero Section with Pixel Art Castle & Hills */}
      <section className="relative pt-6 sm:pt-8 bg-gradient-to-b from-[#e0f2fe] via-[#ecfdf5] to-[#f0fdf4] dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 border-b-[3px] border-slate-900 dark:border-sky-500 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-200 dark:bg-amber-900/80 border-2 border-slate-900 dark:border-amber-400 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#f59e0b] text-slate-900 dark:text-amber-200 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" /> HAFTALIK KUTU OYUNU ETKİNLİĞİ ASİSTANI
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-tight">
            Masadaki Oyununuzu Seçin, <br className="hidden sm:inline" />
            <span className="bg-sky-300 dark:bg-sky-500 px-3 py-0.5 border-2 border-slate-900 dark:border-white shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#38bdf8] rounded-xl inline-block mt-1 text-slate-900 dark:text-white">
              Kural Hakemi Yanınızda!
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Kitapçık aramakla uğraşmayın. Masadaki oyunun kutusundaki QR kodu okutun ya da listeden seçin; kurulum, tur akışı ve kurallar anında telefonunuzda!
          </p>

          {/* Quick Jump Carousel / Grid */}
          <div className="pt-2 pb-1 max-w-3xl mx-auto">
            <div className="p-3.5 bg-white/95 dark:bg-slate-900/90 border-2 border-slate-900 dark:border-sky-500 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#38bdf8] text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-400" /> Masada Sık Oynananlar (Hızlı Erişim):
              </span>
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
                {gamesList.slice(0, 12).map((g) => (
                  <Link
                    key={g.id}
                    href={`/game/${g.id}`}
                    className="pixel-btn min-h-[44px] px-3 py-2 bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold flex items-center gap-1.5 transition"
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
            <input
              type="text"
              placeholder="Oyun ara (Catan, Tabu, Munchkin...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-[44px] bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#38bdf8] transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mr-1 shrink-0">Zorluk:</span>
            {['Tümü', 'Kolay', 'Orta', 'Zor'].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                className={`pixel-btn min-h-[44px] px-3.5 py-2 text-xs font-bold shrink-0 transition ${
                  selectedDifficulty === diff
                    ? 'bg-emerald-300 dark:bg-emerald-500 text-slate-900 dark:text-slate-950 font-extrabold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Total Count badge */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Toplam <span className="text-slate-900 dark:text-white font-extrabold">{filteredGames.length}</span> oyun listeleniyor
          </p>
          <Link
            href="/admin/print-all"
            target="_blank"
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" /> Tüm QR Kartlarını Yazdır (A4)
          </Link>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredGames.length > 0 ? (
          /* Games Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="pixel-box-card bg-white dark:bg-slate-900 p-5 flex flex-col justify-between group transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950 border-2 border-slate-900 dark:border-sky-500 text-slate-900 dark:text-sky-300 shadow-[1px_1px_0px_0px_#0f172a]">
                      {game.category}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-200 dark:bg-emerald-950 border-2 border-slate-900 dark:border-emerald-500 text-slate-900 dark:text-emerald-300 shadow-[1px_1px_0px_0px_#0f172a] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" /> {game.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-2xl">{GAME_ICONS[game.id] || '🎲'}</span>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                      {game.title}
                    </h2>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {game.tagline}
                  </p>

                  {/* Info row */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y-2 border-slate-900 dark:border-slate-800 mb-5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-sky-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-center">
                      <Users className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mb-0.5" />
                      <span className="truncate max-w-[80px]">{game.players.split(' ')[0]}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-center">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mb-0.5" />
                      <span>{game.duration}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-amber-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mb-0.5" />
                      <span>{game.difficulty}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons (Touch Target >= 44x44px) */}
                <div className="space-y-2">
                  <Link
                    href={`/game/${game.id}`}
                    className="w-full pixel-btn pixel-btn-primary min-h-[44px] py-2.5 px-4 text-xs font-extrabold transition flex items-center justify-center gap-2"
                  >
                    <span>Kural Hakemini Aç</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveQrGame({ id: game.id, title: game.title })}
                      className="pixel-btn min-h-[44px] bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>Masa QR</span>
                    </button>
                    <Link
                      href={`/print/${game.id}`}
                      target="_blank"
                      className="pixel-btn min-h-[44px] bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-slate-900 dark:text-emerald-200 py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                      <span>Kart Bas</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aradığınız Oyun Bulunamadı!"
            description={`"${searchTerm}" aramasına veya seçili zorluk derecesine uygun bir kutu oyunu bulunamadı.`}
            actionText="Filtreleri Temizle"
            onAction={handleResetFilters}
          />
        )}
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-slate-900 dark:border-sky-500 bg-white dark:bg-slate-900 py-6 px-4 text-center text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors">
        <p>© 2026 Kutu Oyunu AI Asistanı — Haftalık Masa Oyunu Etkinlikleri İçin Hazırlandı.</p>
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
