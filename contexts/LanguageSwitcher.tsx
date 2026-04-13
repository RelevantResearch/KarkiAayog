'use client';

import { useTransition } from 'react';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ne' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="flex items-center gap-2 px-3 py-2 rounded-full
                 bg-secondary hover:bg-accent transition-colors duration-300
                 text-sm font-body font-medium text-foreground
                 disabled:opacity-60 disabled:cursor-wait"
      aria-label="Switch language"
    >
      <Languages className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
      <motion.span
        key={locale}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="uppercase tracking-wider text-xs"
      >
        {locale === 'en' ? 'नेपाली' : 'English'}
      </motion.span>
    </button>
  );
}