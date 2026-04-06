'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Match {
  id: string;
  preview: string;
}

interface ResultsCardProps {
  matches: Match[];
  searchTerm: string;
  onClose: () => void;
  activeMatchId?: string | null;
  setActiveMatchId?: (id: string | null) => void;
}

export default function ResultsCard({
  matches,
  searchTerm,
  onClose,
  activeMatchId,
  setActiveMatchId,
}: ResultsCardProps) {
  const t = useTranslations('results');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const scrollToMatch = (id: string) => {
    // The <mark> element has id like "section-3::0"
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleMatchClick = (id: string) => {
    setActiveMatchId?.(id);
    scrollToMatch(id);
    setIsMobileOpen(false);
  };

  const foundLabel = t.rich('found_other', { count: matches.length });

  if (!searchTerm.trim() || matches.length === 0) return null;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-primary/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      <button
        className="fixed bottom-4 right-4 z-40 md:hidden bg-orange-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-colors"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? 'Collapse panel' : 'Open search results'}
      >
        <div>
          <p className="text-sm text-white">{foundLabel}</p>
        </div>
        {isMobileOpen ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>

      {/* Panel */}
      <div
        className={`
          fixed top-24 w-80 max-h-[70vh] bg-card border border-border rounded-lg shadow-xl overflow-hidden z-40
          transition-transform duration-300
          ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}
          md:translate-x-0 md:right-4
          right-0 mt-20 md:mt-0
        `}
      >
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span className="font-semibold">{t('title')}</span>
          </div>
          <button
            className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
            onClick={onClose}
            aria-label="Close results"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="space-y-2 overflow-y-auto max-h-[calc(70vh-8rem)]">
            <p className="text-sm text-muted-foreground mb-3">{foundLabel}</p>
            {matches.map((match, index) => (
              <button
                key={match.id}
                onClick={() => handleMatchClick(match.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group ${
                  activeMatchId === match.id
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30'
                    : 'border-border hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-900/20'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-3">
                    {match.preview}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}