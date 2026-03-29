'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const navItems = [
    { href: '/', label: language === 'en' ? 'Home' : 'गृहपृष्ठ' },
    { href: '/about', label: language === 'en' ? 'About' : 'बारेमा' },
    { href: '/timeline', label: language === 'en' ? 'Timeline' : 'समयरेखा' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
              {language === 'en' ? 'NepalDocs' : 'नेपाल डक्स'}
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'en' ? 'EN' : 'ने'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-md transition-colors hover:bg-accent"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md transition-colors hover:bg-accent"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border/40">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
