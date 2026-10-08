'use client';

import React, { useState } from 'react';
import { Trophy, Plus, Minus, X, Trash2, UserPlus, Crown } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  score: number;
}

interface ScoreTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
}

export const ScoreTracker: React.FC<ScoreTrackerProps> = ({ isOpen, onClose, gameTitle }) => {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Oyuncu 1', score: 0 },
    { id: '2', name: 'Oyuncu 2', score: 0 },
    { id: '3', name: 'Oyuncu 3', score: 0 },
  ]);
  const [newName, setNewName] = useState('');

  if (!isOpen) return null;

  const addPlayer = () => {
    if (!newName.trim()) return;
    setPlayers((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newName.trim(), score: 0 },
    ]);
    setNewName('');
  };

  const updateScore = (id: string, delta: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, score: Math.max(0, p.score + delta) } : p))
    );
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const resetScores = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
  };

  const highestScore = Math.max(...players.map((p) => p.score), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border-[3px] border-slate-900 w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-[6px_6px_0px_0px_#0f172a] relative text-slate-900 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-300 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] text-slate-900">
              <Trophy className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-slate-900">SKOR TAHTASI</h3>
              <p className="text-xs font-semibold text-slate-500">{gameTitle} Puanları</p>
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

        {/* Players List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {players.length === 0 ? (
            <p className="text-center text-sm font-medium text-slate-500 py-6">
              Henüz oyuncu eklenmedi. Aşağıdan ekleyin!
            </p>
          ) : (
            players.map((p) => {
              const isLeader = p.score > 0 && p.score === highestScore;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 border-slate-900 transition shadow-[3px_3px_0px_0px_#0f172a] ${
                    isLeader
                      ? 'bg-amber-100 border-amber-500'
                      : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isLeader && <Crown className="w-4 h-4 text-amber-600 shrink-0 fill-amber-400" />}
                    <span className="font-bold text-sm truncate max-w-[120px] text-slate-900">
                      {p.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateScore(p.id, -1)}
                      className="w-10 h-10 min-h-[40px] rounded-lg bg-white border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] hover:bg-slate-100 active:translate-y-0.5 flex items-center justify-center font-bold text-slate-900 transition"
                      aria-label={`${p.name} skorunu 1 azalt`}
                    >
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <span className="w-9 text-center font-display text-lg font-black text-slate-900">
                      {p.score}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateScore(p.id, 1)}
                      className="w-10 h-10 min-h-[40px] rounded-lg bg-emerald-300 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] hover:bg-emerald-400 active:translate-y-0.5 flex items-center justify-center font-bold text-slate-900 transition"
                      aria-label={`${p.name} skorunu 1 artır`}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePlayer(p.id)}
                      className="min-h-[40px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-rose-500 transition ml-1"
                      title="Sil"
                      aria-label={`${p.name} sil`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
            className="pixel-btn pixel-btn-accent min-h-[44px] px-3.5 py-2 text-xs flex items-center gap-1.5 font-bold shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Ekle
          </button>
        </div>

        {players.length > 0 && (
          <div className="mt-2.5 flex justify-end">
            <button
              type="button"
              onClick={resetScores}
              className="min-h-[40px] px-2 text-xs font-bold text-slate-500 hover:text-rose-600 transition underline flex items-center"
            >
              Puanları Sıfırla
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
