import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NepalDocs - Search Nepali Documents',
  description:
    'Search and explore Nepali documents with ease. Featuring intelligent search with automatic English to Nepali translation and document highlighting.',
  keywords: [
    'Nepal',
    'Nepali documents',
    'search',
    'translation',
    'document viewer',
    'नेपाली',
  ],
  authors: [{ name: 'NepalDocs' }],
  openGraph: {
    title: 'NepalDocs - Search Nepali Documents',
    description:
      'Search and explore Nepali documents with intelligent search and automatic translation.',
    url: 'https://nepaldocs.com',
    siteName: 'NepalDocs',
    locale: 'ne_NP',
    type: 'website',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
        width: 1200,
        height: 630,
        alt: 'NepalDocs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NepalDocs - Search Nepali Documents',
    description: 'Search and explore Nepali documents with intelligent search.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
        alt: 'NepalDocs',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-grow">{children}</div>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
