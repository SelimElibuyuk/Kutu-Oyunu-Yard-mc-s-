import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Kutu Oyunu Asistanı | 8-Bit Masa Hakemi',
  description: 'Haftalık kutu oyunu etkinlikleri için canlı, pikselli yapay zeka kural hakemi ve QR asistanı.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('boardgame_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f0f9ff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden w-full selection:bg-sky-300 selection:text-slate-900 pb-16 sm:pb-0">
        <main className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
