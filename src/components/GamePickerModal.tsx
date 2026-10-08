'use client';

import React, { useState } from 'react';
import { GAMES_DATA } from '@/data/games';
import { getGameIcon } from '@/data/icons';
import { Search, X, ArrowRight, Dices } from 'lucide-react';
import Link from 'next/link';

interface GamePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GamePickerModal: React.FC<GamePickerModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const games = Object.values(GAMES_DATA);
  const filtered = games.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border-[3px] border-slate-900 rounded-2xl w-full max-w-lg p-5 shadow-[6px_6px_0px_0px_#0f172a] relative text-slate-900 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base">Oyun Seç</h3>
              <p className="text-[11px] font-semibold text-slate-500">Masadaki oyunu anında bul ve aç</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 transition shadow-[2px_2px_0px_0px_#0f172a]"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="pt-3 pb-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Oyun adı yazın (Catan, Tabu, Munchkin...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full min-h-[44px] bg-slate-50 border-2 border-slate-900 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>
        </div>

        {/* List of games with unique icons */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1.5 pr-1">
          {filtered.length === 0 ? (
            <p className="text-center text-xs font-bold text-slate-500 py-8">
              &quot;{searchTerm}&quot; ile eşleşen oyun bulunamadı.
            </p>
          ) : (
            filtered.map((g) => (
              <Link
                key={g.id}
                href={`/game/${g.id}`}
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl border-2 border-slate-900 bg-white hover:bg-sky-50 transition shadow-[2px_2px_0px_0px_#0f172a] group min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl w-8 text-center shrink-0">{getGameIcon(g.id)}</span>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-sky-600 transition">
                      {g.title}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500">
                      {g.category} • {g.players}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
