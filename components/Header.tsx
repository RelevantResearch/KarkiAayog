// 'use client';
// import React, { useState } from 'react';
// import { useTranslations, useLocale } from 'next-intl';
// import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
// import { useTheme } from '@/contexts/ThemeContext';
// import { useRouter, usePathname } from '@/i18n/navigation';
// import Link from 'next/link';

// export default function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { theme, toggleTheme } = useTheme();

//   const locale = useLocale();
//   const t = useTranslations(); // now t('header.brand'), t('header.nav.home'), etc.

//   const router = useRouter();
//   const pathname = usePathname();

//   const navItems = [
//     { href: '/', label: t('header.nav.home') },
//     { href: '/about', label: t('header.nav.about') },
//   ];

//   const toggleLocale = () => {
//     router.replace(pathname, { locale: locale === 'en' ? 'ne' : 'en' });
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-border/40  backdrop-blur bg-navbar">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           {/* Brand */}
//           <Link href="/" className="flex items-center space-x-2">
//             <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600 ">
//               {t('header.brand')}
//             </span>
//           </Link>

//           {/* Desktop nav */}
//           <nav className="hidden md:flex items-center space-x-6">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="text-sm font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400"
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </nav>

//           {/* Controls */}
//           <div className="flex items-center space-x-2">
//             {/* Language toggle */}
//             <button
//               onClick={toggleLocale}
//               className="flex items-center space-x-1 px-3 py-2 rounded-md border border-primary/50 transition-colors text-sm font-medium transition-colors hover:bg-accent"
//               aria-label={`Switch to ${locale === 'en' ? 'Nepali' : 'English'}`}
//             >
//               <Globe className="h-4 w-4" />
//               <span>{t('header.langLabel')}</span>
//             </button>

//             {/* Theme toggle */}
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-md border border-primary/50 transition-colors hover:bg-accent"
//               aria-label="Toggle theme"
//             >
//               {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
//             </button>

//             {/* Mobile menu button */}
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="md:hidden p-2 rounded-md transition-colors hover:bg-accent"
//               aria-label="Toggle menu"
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile nav */}
//         {isMenuOpen && (
//           <div className="md:hidden py-4 space-y-2 border-t border-border/40">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block px-4 py-2 text-sm font-medium transition-colors hover:bg-accent border-b border-border/40 last:border-b-0"
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }


'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Sun, Moon, Globe, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter, usePathname } from '@/i18n/navigation';
import Link from 'next/link';

const LANGUAGES = {
  en: [
    { code: 'en', label: 'English' },
    { code: 'ne', label: 'Nepali' },
  ],
  ne: [
    { code: 'en', label: 'अंग्रेजी' },
    { code: 'ne', label: 'नेपाली' },
  ],
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: t('header.nav.home') },
    { href: '/about', label: t('header.nav.about') },
  ];

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsLangOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = LANGUAGES[locale as keyof typeof LANGUAGES] ?? LANGUAGES.en;
  const currentLang = languages.find((l) => l.code === locale) ?? languages[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur bg-navbar">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2">
  <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
    <span className="hidden sm:inline">{t('header.brand')}</span> 
    <span className="inline sm:hidden">Karki Aayog</span>
  </span>
</Link>

          {/* Desktop nav */}
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

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Language dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="flex items-center space-x-1 px-3 py-2 rounded-md border border-primary/50 text-sm font-medium transition-colors hover:bg-accent"
                aria-label="Select language"
                aria-expanded={isLangOpen}
                aria-haspopup="listbox"
              >
                <Globe className="h-4 w-4" />
                <span>{currentLang.label}</span>
                {isLangOpen ? (
                  <ChevronUp className="h-3 w-3 opacity-60" />
                ) : (
                  <ChevronDown className="h-3 w-3 opacity-60" />
                )}
              </button>

              {isLangOpen && (
                <div
                  role="listbox"
                  aria-label="Language options"
                  className="absolute right-0 mt-2 w-40 rounded-md border border-border/60 bg-popover shadow-lg z-50 overflow-hidden"
                >
                  {languages.map((lang) => {
                    const isActive = lang.code === locale;
                    return (
                      <button
                        key={lang.code}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => switchLocale(lang.code)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-navbar
                          ${isActive ? 'text-white font-medium bg-primary/80' : 'text-foreground'}`}
                      >
                        <span className="flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5 opacity-60 text-white shrink-0" />
                          {lang.label}
                        </span>
                        {isActive && <Check className="h-3.5 w-3.5 text-orange-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-primary/50 transition-colors hover:bg-accent"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md transition-colors hover:bg-accent"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border/40">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium transition-colors hover:bg-accent border-b border-border/40 last:border-b-0"
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