'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Minus, X, Trash2, UserPlus, Crown, RotateCcw } from 'lucide-react';
import { GameData } from '@/data/games';

interface Player {
  id: string;
  name: string;
  score: number;
  level?: number;      // Specifically for Munchkin
  gearBonus?: number;  // Specifically for Munchkin
}

interface ScoreTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  game?: GameData;
  gameTitle?: string;
}

export const ScoreTracker: React.FC<ScoreTrackerProps> = ({ isOpen, onClose, game, gameTitle }) => {
  const isCatan = Boolean(game?.id?.includes('catan'));
  const isMunchkin = Boolean(game?.id?.includes('munchkin'));
  const isSplendor = Boolean(game?.id?.includes('splendor'));
  const isCarcassonne = Boolean(game?.id?.includes('carcassonne'));

  const storageKey = `boardgame_score_${game?.id || 'general'}`;
  const displayTitle = game?.title || gameTitle || 'Etkinlik Masası';

  const [players, setPlayers] = useState<Player[]>([]);
  const [newName, setNewName] = useState('');
  const [customAddId, setCustomAddId] = useState<string | null>(null);
  const [customDelta, setCustomDelta] = useState<string>('');

  // Load game-specific scores from localStorage on open or game change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setPlayers(JSON.parse(saved));
        return;
      }
    } catch {}

    // Initial default players for this game
    const defaultPlayers: Player[] = [
      { id: '1', name: 'Oyuncu 1', score: isMunchkin ? 1 : 0, level: isMunchkin ? 1 : undefined, gearBonus: isMunchkin ? 0 : undefined },
      { id: '2', name: 'Oyuncu 2', score: isMunchkin ? 1 : 0, level: isMunchkin ? 1 : undefined, gearBonus: isMunchkin ? 0 : undefined },
    ];
    setPlayers(defaultPlayers);
  }, [game?.id, isMunchkin, storageKey, isOpen]);

  // Persist to localStorage whenever players change
  const savePlayers = (updated: Player[]) => {
    setPlayers(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  };

  if (!isOpen) return null;

  const addPlayer = () => {
    if (!newName.trim()) return;
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newName.trim(),
      score: isMunchkin ? 1 : 0,
      level: isMunchkin ? 1 : undefined,
      gearBonus: isMunchkin ? 0 : undefined,
    };
    savePlayers([...players, newPlayer]);
    setNewName('');
  };

  const updateScore = (id: string, delta: number) => {
    const updated = players.map((p) => {
      if (p.id !== id) return p;
      if (isMunchkin) {
        const newLevel = Math.max(1, Math.min(10, (p.level || 1) + delta));
        return {
          ...p,
          level: newLevel,
          score: newLevel + (p.gearBonus || 0),
        };
      }
      return { ...p, score: Math.max(0, p.score + delta) };
    });
    savePlayers(updated);
  };

  const updateGearBonus = (id: string, delta: number) => {
    const updated = players.map((p) => {
      if (p.id !== id) return p;
      const newGear = Math.max(0, (p.gearBonus || 0) + delta);
      return {
        ...p,
        gearBonus: newGear,
        score: (p.level || 1) + newGear,
      };
    });
    savePlayers(updated);
  };

  const handleCustomAdd = (id: string) => {
    const delta = parseInt(customDelta, 10);
    if (!isNaN(delta) && delta !== 0) {
      updateScore(id, delta);
    }
    setCustomAddId(null);
    setCustomDelta('');
  };

  const removePlayer = (id: string) => {
    savePlayers(players.filter((p) => p.id !== id));
  };

  const resetScores = () => {
    if (!confirm(`"${displayTitle}" skorlarını sıfırlamak istediğinize emin misiniz?`)) return;
    const reset = players.map((p) => ({
      ...p,
      score: isMunchkin ? 1 : 0,
      level: isMunchkin ? 1 : undefined,
      gearBonus: isMunchkin ? 0 : undefined,
    }));
    savePlayers(reset);
  };

  const highestScore = Math.max(...players.map((p) => p.score), 0);

  // Check game-specific winner condition
  const checkWinner = (player: Player): boolean => {
    if (isCatan) return player.score >= 10;
    if (isSplendor) return player.score >= 15;
    if (isMunchkin) return (player.level || 1) >= 10;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border-[3px] border-slate-900 w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-[6px_6px_0px_0px_#0f172a] relative text-slate-900 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-300 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] text-slate-900">
              <Trophy className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-slate-900">
                {displayTitle.toUpperCase()} SKOR TAHTASI
              </h3>
              <p className="text-[11px] font-semibold text-slate-500">
                Bu oyuna özel kayıtlı skor tablosu
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 transition shadow-[2px_2px_0px_0px_#0f172a]"
            aria-label="Kapat"
          >
            <X className="w-5 h-5 text-slate-800" />
          </button>
        </div>

        {/* Win Condition / Target Badge */}
        <div className="mt-3 p-3 bg-amber-50 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-900">
          <div className="flex items-start gap-2">
            <span className="text-base shrink-0 select-none">🏆</span>
            <div className="leading-snug">
              <span className="font-extrabold text-amber-950 mr-1.5 inline-block">
                Kazanma Hedefi:
              </span>
              <span className="font-bold text-slate-800 break-words">
                {isCatan
                  ? '10 Zafer Puanına ilk ulaşan kazanır.'
                  : isMunchkin
                  ? '10. Seviyeye ilk ulaşan kazanır.'
                  : isSplendor
                  ? '15 Prestij Puanına ilk ulaşan kazanır.'
                  : game?.winCondition || 'En yüksek puanı toplayan kazanır.'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={resetScores}
            className="self-end sm:self-center text-[11px] font-extrabold text-slate-600 hover:text-rose-600 flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-300 shadow-[1px_1px_0px_0px_#0f172a] transition active:translate-y-0.5"
            title="Skorları Sıfırla"
          >
            <RotateCcw className="w-3 h-3" /> Sıfırla
          </button>
        </div>

        {/* Players List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {players.length === 0 ? (
            <p className="text-center text-xs font-semibold text-slate-500 py-6">
              Henüz oyuncu eklenmedi. Aşağıdan oyuncu ekleyebilirsiniz.
            </p>
          ) : (
            players.map((p) => {
              const hasWon = checkWinner(p);
              const isLeader = !hasWon && p.score > 0 && p.score === highestScore;

              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border-2 border-slate-900 transition shadow-[3px_3px_0px_0px_#0f172a] space-y-2.5 ${
                    hasWon
                      ? 'bg-emerald-100 border-emerald-600 ring-2 ring-emerald-500'
                      : isLeader
                      ? 'bg-amber-100 border-amber-600'
                      : 'bg-slate-50'
                  }`}
                >
                  {/* Top Bar: Name & Current Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {hasWon ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#0f172a] animate-pulse">
                          🎉 KAZANDI!
                        </span>
                      ) : isLeader ? (
                        <Crown className="w-4 h-4 text-amber-600 shrink-0 fill-amber-400" />
                      ) : null}
                      <span className="font-extrabold text-sm break-words max-w-[200px] text-slate-900">
                        {p.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isMunchkin ? (
                        <div className="text-right">
                          <span className="text-[11px] font-extrabold text-purple-900 block leading-tight">
                            Sev: {p.level || 1} / Güç: {p.score}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-2xl font-black text-slate-900">
                            {p.score}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            {isCatan || isSplendor ? 'VP' : 'Puan'}
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removePlayer(p.id)}
                        className="min-h-[36px] min-w-[32px] flex items-center justify-center text-slate-400 hover:text-rose-500 transition ml-1"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Game-Specific Quick Score Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-300">
                    {/* Catan Buttons */}
                    {isCatan && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, 1)}
                          className="px-2 py-1 bg-amber-200 hover:bg-amber-300 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          +1 Köy
                        </button>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, 2)}
                          className="px-2 py-1 bg-amber-300 hover:bg-amber-400 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          +2 Şehir
                        </button>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, 2)}
                          className="px-2 py-1 bg-sky-200 hover:bg-sky-300 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          +2 Yol/Ordu
                        </button>
                      </>
                    )}

                    {/* Munchkin Buttons */}
                    {isMunchkin && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, 1)}
                          className="px-2 py-1 bg-purple-200 hover:bg-purple-300 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          +1 Seviye
                        </button>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, -1)}
                          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          -1 Seviye
                        </button>
                        <button
                          type="button"
                          onClick={() => updateGearBonus(p.id, 1)}
                          className="px-2 py-1 bg-emerald-200 hover:bg-emerald-300 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          +1 Ekipman
                        </button>
                        <button
                          type="button"
                          onClick={() => updateGearBonus(p.id, -1)}
                          className="px-2 py-1 bg-rose-200 hover:bg-rose-300 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          -1 Ekipman
                        </button>
                      </>
                    )}

                    {/* Carcassonne Buttons */}
                    {isCarcassonne && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, 1)}
                          className="px-2 py-1 bg-amber-200 hover:bg-amber-300 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          +1 Yol
                        </button>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, 2)}
                          className="px-2 py-1 bg-sky-200 hover:bg-sky-300 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          +2 Şehir
                        </button>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, 9)}
                          className="px-2 py-1 bg-emerald-200 hover:bg-emerald-300 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          +9 Manastır
                        </button>
                      </>
                    )}

                    {/* Splendor Buttons */}
                    {isSplendor && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, 1)}
                          className="px-2 py-1 bg-sky-200 hover:bg-sky-300 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, 2)}
                          className="px-2 py-1 bg-amber-200 hover:bg-amber-300 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          +2
                        </button>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, 3)}
                          className="px-2 py-1 bg-emerald-200 hover:bg-emerald-300 border-2 border-slate-900 rounded-lg text-[11px] font-extrabold shadow-[1px_1px_0px_0px_#0f172a]"
                        >
                          +3 Asilzade
                        </button>
                      </>
                    )}

                    {/* Generic / All Games Buttons (+1, -1, +5, +10) */}
                    {!isMunchkin && (
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, -1)}
                          className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] flex items-center justify-center font-black text-xs"
                          title="-1 Azalt"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, 1)}
                          className="w-8 h-8 rounded-lg bg-emerald-300 hover:bg-emerald-400 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] flex items-center justify-center font-black text-xs"
                          title="+1 Artır"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => updateScore(p.id, 5)}
                          className="w-8 h-8 rounded-lg bg-sky-200 hover:bg-sky-300 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] flex items-center justify-center font-black text-[11px]"
                          title="+5 Ekle"
                        >
                          +5
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Player Input */}
        <div className="pt-3 border-t-2 border-slate-900 flex gap-2">
          <input
            type="text"
            placeholder="Yeni Oyuncu Adı..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            className="flex-1 min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#0f172a]"
          />
          <button
            type="button"
            onClick={addPlayer}
            disabled={!newName.trim()}
            className="pixel-btn pixel-btn-accent min-h-[44px] px-3.5 py-2 text-xs flex items-center gap-1.5 font-bold shrink-0 disabled:opacity-40"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Ekle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
