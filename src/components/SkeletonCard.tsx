'use client';

import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div
      className="pixel-box-card bg-white p-5 flex flex-col justify-between animate-pulse"
      aria-hidden="true"
    >
      <div>
        {/* Badge row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="h-6 w-20 bg-slate-200 rounded-lg border-2 border-slate-300" />
          <div className="h-6 w-24 bg-slate-200 rounded-lg border-2 border-slate-300" />
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-slate-200" />
          <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
        </div>

        {/* Tagline lines */}
        <div className="space-y-1.5 mb-4">
          <div className="h-3.5 w-full bg-slate-200 rounded" />
          <div className="h-3.5 w-4/5 bg-slate-200 rounded" />
        </div>

        {/* Info stats row */}
        <div className="grid grid-cols-3 gap-2 py-2.5 border-y-2 border-slate-200 mb-5">
          <div className="h-12 bg-slate-100 rounded-lg border border-slate-200" />
          <div className="h-12 bg-slate-100 rounded-lg border border-slate-200" />
          <div className="h-12 bg-slate-100 rounded-lg border border-slate-200" />
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="space-y-2">
        <div className="h-11 w-full bg-slate-200 rounded-xl" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 bg-slate-100 rounded-xl" />
          <div className="h-10 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
