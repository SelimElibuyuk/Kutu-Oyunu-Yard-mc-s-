import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kutu Oyunu Asistanı | 8-Bit Masa Hakemi',
  description: 'Haftalık kutu oyunu etkinlikleri için canlı, pikselli yapay zeka kural hakemi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full flex flex-col bg-[#f0f9ff] text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
