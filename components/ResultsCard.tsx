'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, X } from 'lucide-react';

interface Match {
  id: string;
  preview: string;
}

interface ResultsCardProps {
  matches: Match[];
  searchTerm: string;
  onClose: () => void;
}

export default function ResultsCard({
  matches,
  searchTerm,
  onClose,
}: ResultsCardProps) {
  const { language } = useLanguage();

  const handleScrollToMatch = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-orange-500', 'ring-offset-2');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-orange-500', 'ring-offset-2');
      }, 2000);
    }
  };

  if (!searchTerm.trim() || matches.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-24 w-80 max-h-[70vh] bg-card border border-border rounded-lg shadow-xl overflow-hidden z-40 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <h3 className="font-semibold">
            {language === 'en' ? 'Search Results' : 'खोज परिणामहरू'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Close results"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-3">
          {language === 'en'
            ? `Found ${matches.length} result${matches.length !== 1 ? 's' : ''}`
            : `${matches.length} परिणाम${matches.length !== 1 ? 'हरू' : ''} फेला पर्यो`}
        </p>

        <div className="space-y-2 overflow-y-auto max-h-[calc(70vh-8rem)]">
          {matches.map((match, index) => (
            <button
              key={match.id}
              onClick={() => handleScrollToMatch(match.id)}
              className="w-full text-left p-3 rounded-lg border border-border hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-900/20 transition-all duration-200 group"
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
  );
}
