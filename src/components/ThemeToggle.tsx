'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('boardgame_theme');
    if (savedTheme) {
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('boardgame_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('boardgame_theme', 'light');
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="pixel-btn bg-white dark:bg-slate-800 text-slate-800 dark:text-amber-300 w-11 h-11 p-0 flex items-center justify-center shrink-0"
      aria-label={isDark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
      title={isDark ? 'Aydınlık Mod' : 'Karanlık Mod'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 stroke-[2.5]" />
      ) : (
        <Moon className="w-5 h-5 text-sky-600 stroke-[2.5]" />
      )}
    </button>
  );
};
