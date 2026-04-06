'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const tHeader = useTranslations('header');
  const tFooter = useTranslations('footer');

  return (
    <footer className="border-t border-border/40 bg-background/95 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2">
        
            <span className="font-semibold text-sm bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
              {tHeader('brand')}
            </span>
          </Link>

          {/* Rights */}
          <p className="text-sm text-muted-foreground">{tFooter('rights')}</p>
        </div>
      </div>
    </footer>
  );
}