'use client';

import React, { useState, useEffect } from 'react';
import { Dices, Sparkles, X, Shuffle } from 'lucide-react';
import { GameData } from '@/data/games';

interface DiceRollerProps {
  isOpen: boolean;
  onClose: () => void;
  game?: GameData;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ isOpen, onClose, game }) => {
  const isCatan = Boolean(game?.id?.includes('catan'));
  const isMonopoly = Boolean(game?.id?.includes('monopoly'));
  const defaultDiceCount = isCatan || isMonopoly ? 2 : 1;

  const [diceCount, setDiceCount] = useState<number>(defaultDiceCount);
  const [diceValues, setDiceValues] = useState<number[]>([4]);
  const [isRolling, setIsRolling] = useState(false);
  const [playerCount, setPlayerCount] = useState<number>(
    Math.min(Math.max(game?.minPlayers || 4, 2), 6)
  );
  const [firstPlayer, setFirstPlayer] = useState<number | null>(null);

  // Sync dice count when game changes or modal opens
  useEffect(() => {
    const count = isCatan || isMonopoly ? 2 : 1;
    setDiceCount(count);
    if (count === 2) {
      setDiceValues([3, 4]);
    } else {
      setDiceValues([Math.floor(Math.random() * 6) + 1]);
    }
    setFirstPlayer(null);
  }, [game?.id, isCatan, isMonopoly, isOpen]);

  if (!isOpen) return null;

  const rollDice = () => {
    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      if (diceCount === 2) {
        setDiceValues([
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ]);
      } else {
        setDiceValues([Math.floor(Math.random() * 6) + 1]);
      }
      count++;
      if (count > 8) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 70);
  };

  const pickFirstPlayer = () => {
    const chosen = Math.floor(Math.random() * playerCount) + 1;
    setFirstPlayer(chosen);
  };

  const total = diceValues.reduce((a, b) => a + b, 0);
  const isDouble = diceCount === 2 && diceValues[0] === diceValues[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border-[3px] border-slate-900 w-full max-w-sm rounded-2xl p-5 sm:p-6 shadow-[6px_6px_0px_0px_#0f172a] relative text-slate-900 flex flex-col items-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 transition shadow-[2px_2px_0px_0px_#0f172a]"
          aria-label="Kapat"
        >
          <X className="w-5 h-5 text-slate-800" />
        </button>

        <div className="p-3 bg-amber-300 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] text-slate-900 mb-2 mt-1">
          <Dices className="w-6 h-6 stroke-[2.5]" />
        </div>

        <h3 className="font-display font-extrabold text-base text-slate-900 mb-0.5">
          {(game?.title || 'Masa').toUpperCase()} ZARLARI
        </h3>
        <p className="text-xs font-semibold text-slate-500 mb-4">
          {diceCount === 2 ? '2d6 Masa Zarı' : '1d6 Standart Masa Zarı'}
        </p>

        {/* Dice Selector Toggle (1d6 or 2d6) */}
        {!isCatan && (
          <div className="flex items-center gap-1.5 mb-4 p-1 bg-slate-100 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a]">
            <button
              type="button"
              onClick={() => {
                setDiceCount(1);
                setDiceValues([diceValues[0] || 4]);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                diceCount === 1
                  ? 'bg-amber-300 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1 Zar (1d6)
            </button>
            <button
              type="button"
              onClick={() => {
                setDiceCount(2);
                setDiceValues([diceValues[0] || 3, 4]);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                diceCount === 2
                  ? 'bg-amber-300 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2 Zar (2d6)
            </button>
          </div>
        )}

        {/* Visual Dice Display */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div
            className={`w-16 h-16 rounded-xl bg-amber-300 border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] text-slate-900 font-display font-black text-3xl flex items-center justify-center transition-transform ${
              isRolling ? 'rotate-12 scale-110' : ''
            }`}
          >
            {diceValues[0]}
          </div>

          {diceCount === 2 && (
            <div
              className={`w-16 h-16 rounded-xl bg-sky-300 border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] text-slate-900 font-display font-black text-3xl flex items-center justify-center transition-transform ${
                isRolling ? '-rotate-12 scale-110' : ''
              }`}
            >
              {diceValues[1]}
            </div>
          )}
        </div>

        {/* Total or Value Display */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {diceCount === 2 ? 'Toplam Sonuç:' : 'Gelen Zar:'}
          </span>
          <div className="text-3xl font-display font-black text-slate-900">
            {total}
          </div>
        </div>

        {/* Catan Exclusive Alert: 7 Rolled */}
        {isCatan && total === 7 && (
          <div className="w-full mb-4 bg-rose-100 border-2 border-slate-900 rounded-xl p-3 text-rose-950 shadow-[3px_3px_0px_0px_#0f172a] text-center animate-bounce">
            <div className="font-display font-black text-xs text-rose-900 flex items-center justify-center gap-1">
              🚨 7 GELDİ! HIRSIZ DEVREDE!
            </div>
            <p className="text-[11px] font-semibold text-rose-800 mt-1 leading-tight">
              Elinizde 7&apos;den fazla kart varsa yarısını bankaya atın. Hırsızı yeni bir karoya taşıyın ve bir oyuncudan kart çekin!
            </p>
          </div>
        )}

        {/* Monopoly Exclusive Alert: Doubles Rolled */}
        {isMonopoly && diceCount === 2 && isDouble && (
          <div className="w-full mb-4 bg-sky-100 border-2 border-slate-900 rounded-xl p-2.5 text-sky-950 shadow-[2px_2px_0px_0px_#0f172a] text-center">
            <div className="font-display font-extrabold text-xs text-sky-900">
              🎲 ÇİFT ATTINIZ ({diceValues[0]} - {diceValues[1]})!
            </div>
            <p className="text-[11px] font-semibold text-sky-800 mt-0.5 leading-tight">
              Tekrar zar atma hakkı kazandınız. (3 kez üst üste çift atarsanız hapse girersiniz!)
            </p>
          </div>
        )}

        {/* Roll Button */}
        <button
          type="button"
          onClick={rollDice}
          disabled={isRolling}
          className="w-full pixel-btn pixel-btn-primary min-h-[44px] py-2.5 text-xs flex items-center justify-center gap-2 mb-4 font-extrabold"
        >
          <Sparkles className="w-4 h-4" />
          <span>{diceCount === 2 ? 'Zar At (2d6)' : 'Zar At (1d6)'}</span>
        </button>

        {/* First Player Chooser */}
        <div className="w-full pt-3.5 border-t-2 border-slate-900 flex flex-col items-center">
          <span className="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
            <Shuffle className="w-3.5 h-3.5 text-sky-600" /> Oyuna Kim Başlayacak?
          </span>

          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs font-bold text-slate-500">Oyuncu:</span>
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPlayerCount(num)}
                className={`w-8 h-8 min-h-[36px] rounded-lg text-xs font-display font-extrabold border-2 border-slate-900 transition shadow-[1px_1px_0px_0px_#0f172a] ${
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
            className="w-full pixel-btn pixel-btn-secondary min-h-[40px] py-2 text-xs font-bold flex items-center justify-center"
          >
            İlk Oyuncuyu Seç
          </button>

          {firstPlayer && (
            <div className="mt-2.5 py-1.5 px-4 rounded-xl bg-emerald-100 border-2 border-slate-900 text-emerald-900 text-xs font-bold shadow-[2px_2px_0px_0px_#0f172a]">
              🎉 Oyuncu {firstPlayer} Başlıyor!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
