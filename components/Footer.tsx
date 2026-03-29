'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
              {language === 'en' ? 'NepalDocs' : 'नेपाल डक्स'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'en'
                ? 'Search and explore Nepali documents with ease.'
                : 'सजिलै नेपाली कागजातहरू खोज्नुहोस् र अन्वेषण गर्नुहोस्।'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">
              {language === 'en' ? 'Quick Links' : 'द्रुत लिङ्कहरू'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-orange-600 transition-colors"
                >
                  {language === 'en' ? 'Home' : 'गृहपृष्ठ'}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-orange-600 transition-colors"
                >
                  {language === 'en' ? 'About' : 'बारेमा'}
                </Link>
              </li>
              <li>
                <Link
                  href="/timeline"
                  className="text-muted-foreground hover:text-orange-600 transition-colors"
                >
                  {language === 'en' ? 'Timeline' : 'समयरेखा'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">
              {language === 'en' ? 'Connect' : 'सम्पर्क'}
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-orange-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-orange-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@nepaldocs.com"
                className="text-muted-foreground hover:text-orange-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>
            {language === 'en'
              ? '© 2024 NepalDocs. All rights reserved.'
              : '© २०२४ नेपाल डक्स। सबै अधिकार सुरक्षित।'}
          </p>
        </div>
      </div>
    </footer>
  );
}
