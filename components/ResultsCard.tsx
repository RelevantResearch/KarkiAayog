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
  stacked?: boolean;
}

export default function ResultsCard({
  matches,
  searchTerm,
  onClose,
  activeMatchId,
  setActiveMatchId,
  stacked = false,
}: ResultsCardProps) {
  const t = useTranslations('results');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isStackedOpen, setIsStackedOpen] = useState(false);

  const scrollToMatch = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleMatchClick = (id: string) => {
    setActiveMatchId?.(id);
    scrollToMatch(id);
    setIsMobileOpen(false);
  };

  const handleStackedMatchClick = (id: string) => {
    setActiveMatchId?.(id);
    scrollToMatch(id);
    // setIsStackedOpen(false);
  };

  const handleClose = () => {
    onClose();
    setIsStackedOpen(false);
  };

  const foundLabel = t.rich('found_other', { count: matches.length });

  if (!searchTerm.trim() || matches.length === 0) return null;

  // ── Stacked mode: pill button + popover card above it ────────────────────
  if (stacked) {
    return (
      <div className="flex flex-col items-end gap-2">
        {/* Card — expands above the pill, anchored to bottom */}
        {isStackedOpen && (
          <div className="w-72 max-h-[55vh] bg-card border border-border rounded-xl shadow-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="font-semibold text-sm">{t('title')}</span>
              </div>
              <button
                className="p-1 hover:bg-white/20 rounded transition-colors"
                onClick={() => setIsStackedOpen(false)}
                aria-label="Close results"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3">
              <p className="text-xs text-muted-foreground mb-2">{foundLabel}</p>
              <div className="space-y-1.5">
                {matches.map((match, index) => (
                  <button
                    key={match.id}
                    onClick={() => handleStackedMatchClick(match.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all duration-200 group ${
                      activeMatchId === match.id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30'
                        : 'border-border hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-900/20'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </span>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-3">
                        {match.preview}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pill toggle button */}
        <button
          onClick={() => setIsStackedOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-all active:scale-95 shadow-sm"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span>{foundLabel}</span>
          <X
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
              isStackedOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0 w-0 overflow-hidden'
            }`}
          />
        </button>
      </div>
    );
  }

  // ── Default mode: original fixed-position panel with mobile pill ──────────
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
            onClick={handleClose}
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