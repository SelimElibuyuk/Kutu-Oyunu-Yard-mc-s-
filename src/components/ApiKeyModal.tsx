'use client';

import React, { useState, useEffect } from 'react';
import { Key, X, Check, ExternalLink, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [key, setKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key') || '';
    setKey(saved);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', key.trim());
    setSavedSuccess(true);
    onSaved(key.trim());
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setKey('');
    onSaved('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border-[3px] border-slate-900 dark:border-sky-500 rounded-2xl w-full max-w-md p-6 shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#38bdf8] relative text-slate-900 dark:text-white transition-colors">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-[2px_2px_0px_0px_#0f172a]"
          aria-label="Kapat"
        >
          <X className="w-5 h-5 text-slate-900 dark:text-slate-100" />
        </button>

        <div className="flex items-center gap-3 mb-4 mt-1">
          <div className="p-3 bg-amber-200 dark:bg-amber-500 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] text-slate-900">
            <Key className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">GEMINI API ANAHTARI</h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Gelişmiş AI Hakem Motoru</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed font-medium">
          Sistem varsayılan olarak dahili akıllı kural motoruyla anında çalışır. Daha karmaşık kural ve istisnalar için kişisel Google AI Studio anahtarınızı ekleyebilirsiniz.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              API Anahtarı
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full min-h-[44px] bg-slate-50 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-700 shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 min-h-[44px] text-sky-600 dark:text-sky-400 hover:underline"
            >
              Ücretsiz Key Al <ExternalLink className="w-3.5 h-3.5" />
            </a>
            {key && (
              <button
                type="button"
                onClick={handleClear}
                className="min-h-[44px] px-2 text-rose-600 dark:text-rose-400 hover:underline font-bold"
              >
                Anahtarı Sil
              </button>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 pixel-btn pixel-btn-secondary min-h-[44px] py-2.5 text-xs font-bold"
            >
              Kapat
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 pixel-btn pixel-btn-accent min-h-[44px] py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-900" /> Kaydedildi!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Kaydet
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
