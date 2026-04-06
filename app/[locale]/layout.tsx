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



export const metadata = {
  title: 'Karki Commission Aayog',
  description: 'Digital version of the Karki Commission Report - full report, timeline, and insights.',
  keywords: ['Karki Commission', 'Nepal', 'Government Report', 'Bhadra 23-24, 2082 BS', 'Gen-Z', 'Sept. 23 and 24', 'September 23 and 24', 'Karki Aayog' ],
  openGraph: {
    title: 'Karki Commission Aayog',
    description: 'Digital version of the Karki Commission Report',
    url: 'https://karkiaayog.tathyaraanka.com/',
    siteName: 'Karki Commission Aayog',
    images: [
      {
        url: 'public/images/protest.jpeg',
        width: 1200,
        height: 630,
        alt: 'Karki Commission Aayog'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karki Commission Aayog',
    description: 'Digital version of the Karki Commission Report',
    images: ['/images/impact.png'],
  },
}

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