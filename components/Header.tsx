'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/contexts/LanguageSwitcher';
import ThemeToggle from '@/contexts/ThemeToggle';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  const navItems = [
    { label: t('header.nav.home'), path: '/' },
    { label: t('header.nav.about'), path: '/about' },
  ];


  const strippedPath = '/' + pathname.replace(`/${locale}`, '').replace(/^\//, '');

  const isActive = (path: string) =>
    path === '/' ? strippedPath === '/' || strippedPath === '' : strippedPath === path;



  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          
          <span className="font-semibold text-lg tracking-tight text-foreground">
            {t('header.brand')}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-4 py-2 rounded-xl text-sm font-body font-medium transition-all duration-300
  ${isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-10 h-10 rounded-full flex items-center justify-center
                     bg-secondary hover:bg-accent transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div

            transition={{ duration: 0.1, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-border/50"
          >
            <div className="px-6 py-4 space-y-3 bg-background">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-body font-medium transition-all
  ${isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}