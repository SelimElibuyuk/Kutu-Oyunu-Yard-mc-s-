'use client';

import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Oyun Bulunamadı!',
  description = 'Arama kriterlerinize veya seçili filtreye uygun bir kutu oyunu bulunamadı.',
  actionText = 'Filtreleri Temizle',
  onAction,
}) => {
  return (
    <div className="w-full max-w-md mx-auto py-12 px-6 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center text-amber-600 mb-4 animate-bounce">
        <SearchX className="w-8 h-8 stroke-[2.3]" />
      </div>

      <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-6 leading-relaxed">
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="pixel-btn bg-sky-300 hover:bg-sky-400 text-slate-900 min-h-[44px] px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
