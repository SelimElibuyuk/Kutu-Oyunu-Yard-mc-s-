'use client';

import React, { useState } from 'react';
import { Dices, Sparkles, X, Shuffle } from 'lucide-react';

interface DiceRollerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ isOpen, onClose }) => {
  const [dice1, setDice1] = useState(3);
  const [dice2, setDice2] = useState(4);
  const [isRolling, setIsRolling] = useState(false);
  const [playerCount, setPlayerCount] = useState(4);
  const [firstPlayer, setFirstPlayer] = useState<number | null>(null);

  if (!isOpen) return null;

  const rollDice = () => {
    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 80);
  };

  const pickFirstPlayer = () => {
    const chosen = Math.floor(Math.random() * playerCount) + 1;
    setFirstPlayer(chosen);
  };

  const total = dice1 + dice2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border-[3px] border-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-[6px_6px_0px_0px_#0f172a] relative text-slate-900 flex flex-col items-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 transition shadow-[2px_2px_0px_0px_#0f172a]"
          aria-label="Kapat"
        >
          <X className="w-5 h-5 text-slate-800" />
        </button>

        <div className="p-3 bg-amber-300 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] text-slate-900 mb-3 mt-1">
          <Dices className="w-6 h-6 stroke-[2.5]" />
        </div>

        <h3 className="font-display font-extrabold text-base text-slate-900 mb-1">MASA ZARLARI</h3>
        <p className="text-xs font-semibold text-slate-500 mb-5">2d6 Zar & İlk Oyuncu Seçici</p>

        {/* Dice Visual */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-16 h-16 rounded-xl bg-amber-300 border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] text-slate-900 font-display font-black text-3xl flex items-center justify-center transition-transform ${
              isRolling ? 'rotate-12 scale-110' : ''
            }`}
          >
            {dice1}
          </div>
          <div
            className={`w-16 h-16 rounded-xl bg-sky-300 border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] text-slate-900 font-display font-black text-3xl flex items-center justify-center transition-transform ${
              isRolling ? '-rotate-12 scale-110' : ''
            }`}
          >
            {dice2}
          </div>
        </div>

        <div className="text-center mb-5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Toplam:</span>
          <div className="text-3xl font-display font-black text-slate-900">
            {total} {total === 7 && <span className="text-rose-500 text-xs block font-bold mt-1">(7 Geldi: Hırsız! 🦹)</span>}
          </div>
        </div>

        <button
          type="button"
          onClick={rollDice}
          disabled={isRolling}
          className="w-full pixel-btn pixel-btn-primary min-h-[44px] py-2.5 text-xs flex items-center justify-center gap-2 mb-5 font-bold"
        >
          <Sparkles className="w-4 h-4" />
          <span>Zar At (2d6)</span>
        </button>

        {/* First player chooser */}
        <div className="w-full pt-4 border-t-2 border-slate-900 flex flex-col items-center">
          <span className="text-xs font-extrabold text-slate-800 mb-2.5 flex items-center gap-1.5">
            <Shuffle className="w-3.5 h-3.5 text-sky-600" /> Oyuna Kim Başlayacak?
          </span>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500">Kişi:</span>
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPlayerCount(num)}
                className={`w-9 h-9 min-h-[36px] rounded-lg text-xs font-display font-extrabold border-2 border-slate-900 transition shadow-[1px_1px_0px_0px_#0f172a] ${
                  playerCount === num
                    ? 'bg-emerald-300 text-slate-900'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={pickFirstPlayer}
            className="w-full pixel-btn pixel-btn-secondary min-h-[44px] py-2 text-xs font-bold flex items-center justify-center"
          >
            İlk Oyuncuyu Seç
          </button>

          {firstPlayer && (
            <div className="mt-3 py-2 px-4 rounded-xl bg-emerald-100 border-2 border-slate-900 text-emerald-900 text-xs font-bold shadow-[2px_2px_0px_0px_#0f172a]">
              🎉 Oyuncu {firstPlayer} Başlıyor!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
