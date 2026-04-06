'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, Link } from 'lucide-react';

type TimelineEvent = { year: string; title: string; description: string };

export default function TimelinePage() {
  const t = useTranslations('timeline');
  const events = t.raw('events') as TimelineEvent[];

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line  desktop only */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-orange-600 hidden md:block" />

            <div className="space-y-8">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="relative pl-0 md:pl-20 animate-in fade-in slide-in-from-left duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Desktop dot */}
                  <div className="hidden md:flex absolute left-5 top-6 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-4 border-background shadow-lg items-center justify-center z-10" />

                  <div className="bg-card rounded-xl shadow-lg border border-border p-6 hover:shadow-xl transition-all duration-300 hover:border-orange-500">
                    <div className="flex items-start space-x-4">
                      {/* Mobile icon */}
                      <div className="flex-shrink-0 md:hidden">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-semibold">
                            {event.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA banner */}
          <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">{t('ctaTitle')}</h2>
            <p className="mb-6">{t('ctaBody')}</p>
            <Link
              href="/"
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              {t('ctaButton')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}