'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import DocumentViewer from '@/components/DocumentViewer';
import ResultsCard from '@/components/ResultsCard';
import TableOfContents from '@/components/TableOfContents';
import { Search, Loader2, Languages, Keyboard, ChevronUp, X, List } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useDocumentChunks } from '@/hooks/useDocumentChunks';
import { useTocIndex } from '@/hooks/useTocIndex';

declare global {
  interface Window {
    pramukhIME: {
      addLanguage: (plugin: unknown, lang: string) => void;
      enable: (name: string, el: HTMLElement) => void;
      disable: (name?: string) => void;
      setLanguage: (lang: string, plugin: string) => void;
    };
    PramukhIndic: unknown;
  }
}

type InputMode = 'english' | 'romanized';

export default function Home() {
  const locale = useLocale();
  const language = locale;
  const t = useTranslations('home');

  const { manifest, manifestStatus, chunks, sections, loadChunk, loadUntilSection } =
    useDocumentChunks(locale);

  const [englishInput, setEnglishInput] = useState('');
  const [nepaliInput, setNepaliInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState<{ id: string; preview: string }[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [activeTocSectionId, setActiveTocSectionId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('english');
  const [hasScrolled, setHasScrolled] = useState(false);
  const [floatingVisible, setFloatingVisible] = useState(false);
  const [showToc, setShowToc] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const { sections: tocSections } = useTocIndex(locale);
  const romanizedInputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  const hasResults = matches.length > 0 && searchTerm.trim() !== '';

  useEffect(() => {
    const stored = localStorage.getItem('showToc');
    if (stored !== null) setShowToc(stored === 'true');
  }, []);

  const toggleToc = useCallback(() => {
    setShowToc((prev) => {
      const next = !prev;
      localStorage.setItem('showToc', String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setHasScrolled(scrolled);
      setFloatingVisible(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (language === 'en') {
      setEnglishInput('');
      setNepaliInput('');
    }
  }, [language]);

  useEffect(() => {
    setNepaliInput('');
    if (romanizedInputRef.current) romanizedInputRef.current.value = '';
  }, [inputMode]);

  useEffect(() => {
    if (inputMode !== 'romanized' || !romanizedInputRef.current) return;
    const tryEnable = () => {
      if (!window.pramukhIME) return;
      window.pramukhIME.addLanguage(window.PramukhIndic, 'nepali');
      window.pramukhIME.enable('romanized-input', romanizedInputRef.current!);
    };
    if (window.pramukhIME) {
      tryEnable();
    } else {
      const interval = setInterval(() => {
        if (window.pramukhIME) { tryEnable(); clearInterval(interval); }
      }, 100);
      return () => clearInterval(interval);
    }
    return () => { window.pramukhIME?.disable('romanized-input'); };
  }, [inputMode]);

  useEffect(() => {
    if (inputMode !== 'romanized') return;
    const interval = setInterval(() => {
      const el = romanizedInputRef.current;
      if (el && el.value !== nepaliInput) setNepaliInput(el.value);
    }, 100);
    return () => clearInterval(interval);
  }, [inputMode, nepaliInput]);

  useEffect(() => {
    if (language !== 'ne' || inputMode !== 'english' || !englishInput.trim()) return;
    const id = setTimeout(async () => {
      setIsTranslating(true);
      try {
        const res = await fetch('http://localhost:8002/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: englishInput, mode: 'translate' }),
        });
        const data = await res.json();
        if (data.translatedText) setNepaliInput(data.translatedText);
      } catch (err) {
        console.error('Translation error:', err);
      } finally {
        setIsTranslating(false);
      }
    }, 500);
    return () => clearTimeout(id);
  }, [englishInput, language, inputMode]);

  const handleSearch = async () => {
    const term = language === 'en' ? englishInput : nepaliInput;
    if (!term.trim()) return;
    setIsSearching(true);
    setShowNoResults(false);
    setMatches([]);
    setActiveMatchId(null);
    setActiveTocSectionId(null);
    try {
      const res = await fetch(
        `${window.location.origin}/api/document/search?locale=${locale}&q=${encodeURIComponent(term)}`
      );
      const data = await res.json() as { matches: { id: string; preview: string }[] };
      setMatches(data.matches);
      setShowNoResults(data.matches.length === 0);
      setSearchTerm(term);
    } catch {
      setShowNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTocNavigate = useCallback((sectionId: string) => {
    setActiveMatchId(null);
    setActiveTocSectionId(null);
    requestAnimationFrame(() => setActiveTocSectionId(sectionId));
    setDrawerOpen(false);
  }, []);

  const handleMatchFound = useCallback(() => { }, []);

  const handleClearSearch = () => {
    setSearchTerm('');
    setMatches([]);
    setShowNoResults(false);
    setActiveMatchId(null);
  };

  const canSearch = language === 'en' ? englishInput.trim() !== '' : nepaliInput.trim() !== '';
  const isNepali = language === 'ne';

  const SearchCard = (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      {isNepali && (
        <div className="flex gap-2 mb-4">
          {(['english', 'romanized'] as InputMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setInputMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${inputMode === mode
                ? 'bg-orange-500 text-white border-orange-500'
                : 'border-border text-muted-foreground hover:border-orange-400'
                }`}
            >
              {mode === 'english'
                ? <Languages className="h-3 w-3" />
                : <Keyboard className="h-3 w-3" />}
              {mode === 'english' ? 'English → नेपाली' : 'Romanized → नेपाली'}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3 mb-4">
        {isNepali && inputMode === 'english' && (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              अंग्रेजीमा टाइप गर्नुहोस्
            </label>
            <input
              type="text"
              value={englishInput}
              onChange={(e) => setEnglishInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && canSearch && !isSearching) handleSearch(); }}
              placeholder="Type in English to auto-translate..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-muted/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
            {isTranslating && (
              <p className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                अनुवाद गर्दै...
              </p>
            )}
          </div>
        )}

        <div>
          {isNepali && (
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              {inputMode === 'english'
                ? 'अनुवादित नेपाली पाठ (सम्पादन योग्य)'
                : 'Roman अक्षरमा टाइप गर्नुहोस्'}
            </label>
          )}
          <input
            id={inputMode === 'romanized' ? 'romanized-input' : 'search-input'}
            ref={inputMode === 'romanized' ? romanizedInputRef : undefined}
            type="text"
            value={inputMode !== 'romanized' ? (isNepali ? nepaliInput : englishInput) : undefined}
            defaultValue={inputMode === 'romanized' ? '' : undefined}
            onChange={(e) => {
              if (inputMode !== 'romanized') {
                isNepali ? setNepaliInput(e.target.value) : setEnglishInput(e.target.value);
              }
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' && canSearch && !isSearching) handleSearch(); }}
            placeholder={
              !isNepali
                ? 'Enter search term...'
                : inputMode === 'romanized'
                  ? 'maile kaam garye → मैले काम गर्ये'
                  : 'खोज शब्द प्रविष्ट गर्नुहोस्...'
            }
            className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-muted/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
          {isNepali && inputMode === 'romanized' && (
            <p className="text-xs text-muted-foreground mt-1.5">
              Type in Roman — converts to Devanagari live
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleSearch}
        disabled={!canSearch || isSearching}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSearching
          ? <><Loader2 className="h-4 w-4 animate-spin" /><span>{isNepali ? 'खोज्दै...' : 'Searching...'}</span></>
          : <><Search className="h-4 w-4" /><span>{isNepali ? 'खोज्नुहोस्' : 'Search'}</span></>
        }
      </button>

      {showNoResults && searchTerm.trim() && (
        <p className="mt-3 text-xs text-center text-orange-600 dark:text-orange-400">
          {isNepali
            ? 'कुनै परिणाम फेला परेन। फरक खोज शब्द प्रयास गर्नुहोस्।'
            : 'No results found. Try a different search term.'}
        </p>
      )}

      <div className="hidden lg:flex items-center justify-between mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">Show Table of contents</span>
        <button
          role="switch"
          aria-checked={showToc}
          onClick={toggleToc}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${showToc ? 'bg-orange-500' : 'bg-muted-foreground/30'}`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 ${showToc ? 'translate-x-[18px]' : 'translate-x-0.5'}`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen relative">
      <div className="absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-accent/30 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative">
        <div className="max-w-7xl mx-auto mb-8">
          {SearchCard}
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {showToc && (
              <aside
                className={`hidden lg:flex lg:flex-col w-[20em] shrink-0 transition-all duration-300 ${hasScrolled ? 'lg:sticky lg:top-24 lg:self-start' : ''}`}
              >
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <TableOfContents
                    sections={tocSections}
                    activeMatchId={activeMatchId}
                    onNavigate={handleTocNavigate}
                    scrollable
                    maxHeight="calc(100vh - 8rem)"
                  />
                </div>
              </aside>
            )}

            <div ref={documentRef} className="flex-1 min-w-0">
              <DocumentViewer
                searchTerm={searchTerm}
                onMatchFound={handleMatchFound}
                activeMatchId={activeMatchId}
                activeTocSectionId={activeTocSectionId}
                manifest={manifest}
                manifestStatus={manifestStatus}
                chunks={chunks}
                sections={sections}
                loadChunk={loadChunk}
                loadUntilSection={loadUntilSection}
              />
            </div>
          </div>
        </div>

        {/* Desktop results panel — unchanged original behaviour */}
        <div className="hidden md:block">
          <ResultsCard
            matches={matches}
            searchTerm={searchTerm}
            onClose={handleClearSearch}
            activeMatchId={activeMatchId}
            setActiveMatchId={setActiveMatchId}
          />
        </div>
      </div>

      {/* Mobile TOC drawer backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />

      {/* Mobile TOC drawer panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 z-50 h-full w-[85vw] max-w-[22rem] bg-card flex flex-col shadow-xl transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="text-sm font-semibold text-foreground">
            {isNepali ? 'सामग्री सूची' : 'Table of contents'}
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <TableOfContents
            sections={tocSections}
            activeMatchId={activeMatchId}
            onNavigate={handleTocNavigate}
            scrollable
          />
        </div>
      </div>

      {/* ── Mobile results pill — always visible when results exist ── */}
      {hasResults && (
        <div className="md:hidden fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          <ResultsCard
            matches={matches}
            searchTerm={searchTerm}
            onClose={handleClearSearch}
            activeMatchId={activeMatchId}
            setActiveMatchId={setActiveMatchId}
            stacked
          />
        </div>
      )}

      {/* ── Floating controls — scroll-gated, nudged up when results pill visible ── */}
      <div
        className={`fixed right-6 z-40 flex flex-col items-end gap-2 transition-all duration-300 ${hasResults ? 'bottom-[4.5rem] md:bottom-6' : 'bottom-6'
          } ${floatingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
      >
        {/* TOC toggle — desktop only */}
        <button
          onClick={toggleToc}
          role="switch"
          aria-checked={showToc}
          className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-card border border-border text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white transition-all active:scale-95 shadow-sm"
        >
          <List className="h-3.5 w-3.5 shrink-0" />
          <span>{showToc ? 'Hide Table of contents' : 'Show Table of contents'}</span>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${showToc ? 'bg-orange-500' : 'bg-muted-foreground/30'}`} />
        </button>

        {/* Open TOC drawer — mobile only */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Show table of contents"
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-full bg-card border border-border text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white transition-all active:scale-95 shadow-sm"
        >
          <List className="h-3.5 w-3.5 shrink-0" />
          <span>{isNepali ? 'विषय-सूची देखाउनुहोस्' : 'Show Toc'}</span>
        </button>

        {/* Scroll to top */}
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-background border border-border bg-orange-500 hover:bg-orange-600 text-white transition-all active:scale-95 shadow-sm"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
}