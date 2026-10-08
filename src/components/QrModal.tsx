'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Printer, ExternalLink, QrCode } from 'lucide-react';
import Link from 'next/link';

interface QrModalProps {
  gameId: string;
  gameTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ gameId, gameTitle, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(`${window.location.origin}/game/${gameId}`);
    }
  }, [gameId]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border-[3px] border-slate-900 dark:border-sky-500 w-full max-w-sm rounded-2xl p-6 shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#38bdf8] relative text-slate-900 dark:text-white flex flex-col items-center text-center transition-colors">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-[2px_2px_0px_0px_#0f172a]"
          aria-label="Kapat"
        >
          <X className="w-5 h-5 text-slate-900 dark:text-slate-100" />
        </button>

        <div className="p-3 bg-sky-200 dark:bg-sky-500 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0f172a] text-slate-900 mb-3 mt-1">
          <QrCode className="w-6 h-6 stroke-[2.5]" />
        </div>

        <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white mb-1">{gameTitle}</h3>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-5">Masa için doğrudan asistan QR kodu</p>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-xl shadow-[4px_4px_0px_0px_#0f172a] mb-5 border-[3px] border-slate-900">
          {fullUrl && (
            <QRCodeSVG
              value={fullUrl}
              size={180}
              level="H"
              includeMargin={false}
            />
          )}
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 mb-4 font-mono shadow-[2px_2px_0px_0px_#0f172a]">
          <span className="truncate pr-2 font-semibold text-slate-900 dark:text-slate-200">{fullUrl}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition shrink-0 font-bold"
            title="Kopyala"
            aria-label="Linki kopyala"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="w-full grid grid-cols-2 gap-3">
          <Link
            href={`/print/${gameId}`}
            target="_blank"
            className="pixel-btn pixel-btn-secondary min-h-[44px] py-2.5 text-xs flex items-center justify-center gap-1.5 font-bold"
          >
            <Printer className="w-4 h-4 text-slate-900 dark:text-white" />
            <span>Kart Bas</span>
          </Link>
          <Link
            href={`/game/${gameId}`}
            className="pixel-btn pixel-btn-primary min-h-[44px] py-2.5 text-xs flex items-center justify-center gap-1.5 font-bold"
          >
            <span>Sayfayı Aç</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
