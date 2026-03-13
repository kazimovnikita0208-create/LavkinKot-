import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'ЛавкинКот',
  description: 'Доставка продуктов и еды в Самаре',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#26495C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        {/* Telegram Mini App SDK — обязательно до любого JS, иначе window.Telegram.WebApp = undefined */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen flex justify-center" style={{ backgroundColor: '#0D1B24' }} suppressHydrationWarning>
        <Providers>
          <div className="w-full max-w-[375px] min-h-screen" style={{ backgroundColor: '#1A2F3A', boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)' }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
