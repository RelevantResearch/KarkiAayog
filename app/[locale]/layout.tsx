import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../globals.css';
import { loadLocaleMessages } from '@/lib/messages';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });



export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ne')) {
    notFound();
  }

  const messages = await loadLocaleMessages(locale);
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-grow">{children}</div>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
        {locale === 'ne' && (
  <>
    <Script src="/pramukhime/pramukhime.js" strategy="beforeInteractive" />
    <Script src="/pramukhime/pramukhindic.js" strategy="beforeInteractive" />
  </>
)}
      </body>
    </html>
  );
}