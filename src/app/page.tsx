'use client';

import React, { useState, useEffect } from 'react';
import { GAMES_DATA, GameData } from '@/data/games';
import { Navbar } from '@/components/Navbar';
import { PixelScene } from '@/components/PixelScene';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
import Link from 'next/link';
import {
  Users,
  Clock,
  ShieldCheck,
  Search,
  ArrowRight,
  Flame,
  Zap,
} from 'lucide-react';

import { getGameIcon } from '@/data/icons';

export default function HomePage() {
  const [gamesMap, setGamesMap] = useState<Record<string, GameData>>(GAMES_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Tümü');

  useEffect(() => {
    fetch('/api/games')
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data) => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          setGamesMap(data);
        }
      })
      .catch(() => {});
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
    <div className="min-h-screen bg-[#f0fdf4] text-slate-900 flex flex-col">
      <Navbar />

      {/* Hero Section with Pixel Castle & Hills */}
      <section className="relative pt-6 sm:pt-8 bg-gradient-to-b from-[#e0f2fe] via-[#ecfdf5] to-[#f0fdf4] border-b-[3px] border-slate-900 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3 relative z-10">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-200 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] text-slate-900 text-xs font-bold">
            🎲 KUTU OYUNU HAKEMİ
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-display leading-tight">
            Masandaki Oyunu Seç, <br className="hidden sm:inline" />
            <span className="bg-sky-300 px-3 py-0.5 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] rounded-xl inline-block mt-1">
              Kuralları Anında Sor!
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-lg mx-auto">
            Listeden masandaki oyuna dokun; kurulum, tur akışı ve kurallar anında telefonunda.
          </p>

          {/* Quick Jump Chips */}
          <div className="pt-2 pb-1 max-w-2xl mx-auto">
            <div className="p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Masada Sık Oynananlar:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {gamesList.slice(0, 12).map((g) => (
                  <Link
                    key={g.id}
                    href={`/game/${g.id}`}
                    className="pixel-btn min-h-[40px] px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-slate-900 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <span>{getGameIcon(g.id)}</span>
                    <span>{g.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pixel Art Scene (Castle, Rolling Hills, Trees & Dice) */}
        <div className="w-full mt-3 -mb-1">
          <PixelScene />
        </div>
      </section>

      {/* Main Content & Games Grid */}
      <section id="oyunlar" className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {/* Search & Fast Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
            <input
              type="text"
              placeholder="Oyun ara (Catan, Tabu, Munchkin...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-[44px] bg-white border-2 border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-extrabold text-slate-700 mr-1">Zorluk:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Tümü', 'Kolay', 'Orta', 'Zor'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`pixel-btn min-h-[44px] px-3.5 py-2 text-xs font-extrabold transition cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-emerald-300 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Total Count Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-slate-600">
            Toplam <span className="text-slate-900 font-extrabold">{filteredGames.length}</span> oyun hazır
          </p>
          <span className="text-xs font-semibold text-slate-500">
            Kural hakemini açmak için oyuna dokunun
          </span>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredGames.length > 0 ? (
          /* Games Grid - ENTIRE CARD IS FULLY CLICKABLE LINK */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <Link
                key={game.id}
                href={`/game/${game.id}`}
                className="pixel-box-card bg-white p-5 flex flex-col justify-between group cursor-pointer transition-all hover:-translate-y-1 block"
                title={`${game.title} Kural Hakemini Aç`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-100 border-2 border-slate-900 text-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
                      {game.category}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-200 border-2 border-slate-900 text-slate-900 shadow-[1px_1px_0px_0px_#0f172a] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-emerald-800" /> {game.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-2xl">{getGameIcon(game.id)}</span>
                    <h2 className="text-xl font-extrabold text-slate-900 font-display group-hover:text-sky-600 transition">
                      {game.title}
                    </h2>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 mb-4 line-clamp-3 leading-relaxed min-h-[48px]">
                    {game.tagline}
                  </p>

                  {/* Info stats */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y-2 border-slate-900 mb-5 text-[11px] font-bold text-slate-800">
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-sky-50 border border-slate-300 text-center">
                      <Users className="w-3.5 h-3.5 text-sky-600 mb-0.5" />
                      <span className="leading-tight text-center">{game.players}</span>
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

                {/* Tactile button row */}
                <div className="w-full pixel-btn pixel-btn-primary min-h-[44px] py-2.5 px-4 text-xs font-extrabold transition flex items-center justify-center gap-2 group-hover:brightness-105">
                  <span>Kural Hakemini Aç</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aradığınız Oyun Bulunamadı!"
            description={`"${searchTerm}" aramasına uygun oyun bulunamadı.`}
            actionText="Filtreleri Temizle"
            onAction={handleResetFilters}
          />
        )}
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-slate-900 bg-white py-5 px-4 text-center text-xs font-bold text-slate-600">
        <p>© 2026 Kutu Oyunu AI Asistanı — Haftalık Etkinlik Masa Hakemi.</p>
      </footer>
    </div>
  );
}
