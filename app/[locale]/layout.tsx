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
  metadataBase: new URL('https://karkiaayog.tathyaraanka.com'),

  title: {
    default: 'Karki Commission Report 2082 (Bhadra 23–24) – Full Timeline & Findings',
    template: '%s | Karki Aayog Nepal',
  },

  description:
    'Explore the complete Karki Commission (Aayog) Report of Nepal based on the Bhadra 23–24, 2082 BS events. Read full findings, timeline, investigation details, and official insights in a structured digital format.',

  keywords: [
    'Karki Aayog',
    'Karki Commission Nepal',
    'Karki Aayog Report 2082',
    'Bhadra 23 24 Nepal incident',
    'Nepal investigation report',
    'Karki report full text',
    'Nepal protest report 2082',
    'Karki commission findings',
    'Nepal government report 2082',
    'आयोग प्रतिवेदन',
    'कार्की आयोग',
    'नेपाल सरकारी रिपोर्ट',
  ],

  alternates: {
    canonical: 'https://karkiaayog.tathyaraanka.com/',
    languages: {
      en: '/en',
      ne: '/ne',
    },
  },

  openGraph: {
    title: 'Karki Commission Report 2082 – Full Timeline & Findings',
    description:
      'Read the complete Karki Aayog report of Nepal, including timeline of Bhadra 23–24 events, key findings, and official investigation insights.',
    url: 'https://karkiaayog.tathyaraanka.com/',
    siteName: 'Karki Aayog Nepal',
    images: [
      {
        url: '/images/protest.jpeg',
        width: 1200,
        height: 630,
        alt: 'Karki Commission Report Nepal Protest Scene',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Karki Commission Report 2082 – Full Findings & Timeline',
    description:
      'Full digital version of the Karki Aayog report with timeline, findings, and insights from Nepal.',
    images: ['/images/impact.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

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