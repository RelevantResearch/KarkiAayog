'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';



export default function AboutPage() {
  const t = useTranslations('about');
  const languageItems = t.raw('languageItems') as string[];

  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4 ">
          <nav className="max-w-7xl mx-auto mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground">About</span>
        </nav>
        
        <article className="max-w-7xl mx-auto">
        

          {/* Title */}
          <h1 className="text-3xl font-bold mb-6 text-primary">
            {t('title')}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            {t('intro')}
          </p>

          <hr className="border-border mb-10" />

          {/* Vision */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {t('visionTitle')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('visionBody')}
            </p>
          </section>

          <hr className="border-border mb-10" />

          {/* Why */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {t('whyTitle')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              {t('whyP1')}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('whyP2')}
            </p>
          </section>

          <hr className="border-border mb-10" />

          {/* Background */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {t('backgroundTitle')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              {t('backgroundP1')}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              {t('backgroundP2')}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('backgroundP3')}
            </p>
          </section>

          <hr className="border-border mb-10" />

          {/* Commission */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {t('commissionTitle')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              {t('commissionP1')}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('commissionP2')}
            </p>
          </section>

          <hr className="border-border mb-10" />

          {/* Language Support */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {t('languageTitle')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-3">
              {t('languageBody')}
            </p>
            <ul className="text-base space-y-1.5 pl-4 border-l-2 border-orange-500/40">
              {languageItems.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-border mb-10" />

          {/* Disclaimer */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {t('disclaimerTitle')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('disclaimerBody')}
            </p>
          </section>

        </article>
      </div>
    </main>
  );
}