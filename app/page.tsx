'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import DocumentViewer from '@/components/DocumentViewer';
import ResultsCard from '@/components/ResultsCard';
import { nepaliDocument } from '@/data/document';
import { Search, Loader as Loader2 } from 'lucide-react';

export default function Home() {
  const { language } = useLanguage();
  const [englishInput, setEnglishInput] = useState('');
  const [nepaliInput, setNepaliInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState<{ id: string; preview: string }[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  useEffect(() => {
    if (language === 'en') {
      setEnglishInput('');
      setNepaliInput('');
    }
  }, [language]);

  useEffect(() => {
    if (language === 'ne' && englishInput.trim()) {
      const timeoutId = setTimeout(async () => {
        setIsTranslating(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/translate`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ text: englishInput }),
            }
          );

          const data = await response.json();
          if (data.translatedText) {
            setNepaliInput(data.translatedText);
          }
        } catch (error) {
          console.error('Translation error:', error);
        } finally {
          setIsTranslating(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [englishInput, language]);

  const handleSearch = () => {
    setIsSearching(true);
    setShowNoResults(false);

    setTimeout(() => {
      const term = language === 'en' ? englishInput : nepaliInput;
      setSearchTerm(term);
      setIsSearching(false);
    }, 300);
  };

  const handleMatchFound = useCallback(
    (foundMatches: { id: string; preview: string }[]) => {
      setMatches(foundMatches);
      if (searchTerm.trim() && foundMatches.length === 0) {
        setShowNoResults(true);
      } else {
        setShowNoResults(false);
      }
    },
    [searchTerm]
  );

  const handleClearSearch = () => {
    setSearchTerm('');
    setMatches([]);
    setShowNoResults(false);
  };

  const canSearch =
    language === 'en'
      ? englishInput.trim() !== ''
      : nepaliInput.trim() !== '';

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
              {language === 'en'
                ? 'Search Nepali Documents'
                : 'नेपाली कागजात खोज्नुहोस्'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === 'en'
                ? 'Find information quickly with our intelligent search'
                : 'हाम्रो बुद्धिमान खोजबाट छिटो जानकारी पाउनुहोस्'}
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-lg border border-border p-6 transition-all duration-300 hover:shadow-xl">
            {language === 'ne' && (
              <div className="mb-4">
                <label
                  htmlFor="english-input"
                  className="block text-sm font-medium mb-2"
                >
                  अंग्रेजीमा टाइप गर्नुहोस्
                </label>
                <input
                  id="english-input"
                  type="text"
                  value={englishInput}
                  onChange={(e) => setEnglishInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canSearch && !isSearching) {
                      handleSearch();
                    }
                  }}
                  placeholder="स्वचालित अनुवादको लागि टाइप गर्नुहोस्..."
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
                {isTranslating && (
                  <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>अनुवाद गर्दै...</span>
                  </div>
                )}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="search-input"
                className="block text-sm font-medium mb-2"
              >
                {language === 'en'
                  ? 'Search Query'
                  : 'अनुवादित नेपाली पाठ (सम्पादन योग्य)'}
              </label>
              <input
                id="search-input"
                type="text"
                value={language === 'en' ? englishInput : nepaliInput}
                onChange={(e) =>
                  language === 'en'
                    ? setEnglishInput(e.target.value)
                    : setNepaliInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canSearch && !isSearching) {
                    handleSearch();
                  }
                }}
                placeholder={
                  language === 'en'
                    ? 'Enter search term...'
                    : 'खोज शब्द प्रविष्ट गर्नुहोस्...'
                }
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={!canSearch || isSearching}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>
                    {language === 'en' ? 'Searching...' : 'खोज्दै...'}
                  </span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>{language === 'en' ? 'Search' : 'खोज्नुहोस्'}</span>
                </>
              )}
            </button>
          </div>

          {showNoResults && (
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-center animate-in fade-in duration-300">
              <p className="text-orange-600 dark:text-orange-400 font-medium">
                {language === 'en'
                  ? 'No results found. Try a different search term.'
                  : 'कुनै परिणाम फेला परेन। फरक खोज शब्द प्रयास गर्नुहोस्।'}
              </p>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            <DocumentViewer
              sections={nepaliDocument}
              searchTerm={searchTerm}
              onMatchFound={handleMatchFound}
            />
          </div>
        </div>

        <ResultsCard
          matches={matches}
          searchTerm={searchTerm}
          onClose={handleClearSearch}
        />
      </div>
    </main>
  );
}
