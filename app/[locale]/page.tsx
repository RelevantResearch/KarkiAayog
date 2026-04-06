// 'use client';

// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import DocumentViewer from '@/components/DocumentViewer';
// import ResultsCard from '@/components/ResultsCard';
// import { Search, Loader as Loader2, Languages, Keyboard } from 'lucide-react';
// import { useLocale, useTranslations } from 'next-intl';

// declare global {
//   interface Window {
//     pramukhIME: {
//       addLanguage: (plugin: unknown, lang: string) => void;
//       enable: (name: string, el: HTMLElement) => void;
//       disable: (name?: string) => void;
//       setLanguage: (lang: string, plugin: string) => void;
//     };
//     PramukhIndic: unknown;
//   }
// }

// type InputMode = 'english' | 'romanized';

// export default function Home() {
//   const locale   = useLocale();
//   const language = locale;
//   const t = useTranslations('home');

//   const [englishInput,  setEnglishInput]  = useState('');
//   const [nepaliInput,   setNepaliInput]   = useState('');
//   const [searchTerm,    setSearchTerm]    = useState('');
//   const [matches,       setMatches]       = useState<{ id: string; preview: string }[]>([]);
//   const [isTranslating, setIsTranslating] = useState(false);
//   const [isSearching,   setIsSearching]   = useState(false);
//   const [showNoResults, setShowNoResults] = useState(false);
//   const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
//   const [inputMode,     setInputMode]     = useState<InputMode>('english');

//   const romanizedInputRef = useRef<HTMLInputElement>(null);

//   // ── Reset on locale change ─────────────────────────────────────────────────
//   useEffect(() => {
//     if (language === 'en') {
//       setEnglishInput('');
//       setNepaliInput('');
//     }
//   }, [language]);

//   // ── Reset nepali input when switching modes ────────────────────────────────
//   useEffect(() => {
//     setNepaliInput('');
//     if (romanizedInputRef.current) {
//       romanizedInputRef.current.value = '';
//     }
//   }, [inputMode]);

//   // ── Enable/disable Pramukh IME ────────────────────────────────────────────
//   useEffect(() => {
//     if (inputMode !== 'romanized' || !romanizedInputRef.current) return;

//     const tryEnable = () => {
//       if (!window.pramukhIME) return;
//       window.pramukhIME.addLanguage(window.PramukhIndic, 'nepali');
//       window.pramukhIME.enable('romanized-input', romanizedInputRef.current!);
//     };

//     if (window.pramukhIME) {
//       tryEnable();
//     } else {
//       const interval = setInterval(() => {
//         if (window.pramukhIME) { tryEnable(); clearInterval(interval); }
//       }, 100);
//       return () => clearInterval(interval);
//     }

//     return () => {
//       window.pramukhIME?.disable('romanized-input');
//     };
//   }, [inputMode]);

//   // ── Poll DOM to sync IME value → React state ──────────────────────────────
//   // Pramukh IME rewrites the input's DOM value directly, bypassing ALL
//   // React synthetic events (onChange, onInput, onCompositionEnd).
//   // Polling every 100ms is the only reliable way to capture its output.
//   useEffect(() => {
//     if (inputMode !== 'romanized') return;

//     const interval = setInterval(() => {
//       const el = romanizedInputRef.current;
//       if (el && el.value !== nepaliInput) {
//         setNepaliInput(el.value);
//       }
//     }, 100);

//     return () => clearInterval(interval);
//   }, [inputMode, nepaliInput]);

//   // ── Auto-translate English → Nepali ───────────────────────────────────────
//   useEffect(() => {
//     if (language !== 'ne' || inputMode !== 'english' || !englishInput.trim()) return;

//     const timeoutId = setTimeout(async () => {
//       setIsTranslating(true);
//       try {
//         const response = await fetch('http://localhost:8002/translate', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ text: englishInput, mode: 'translate' }),
//         });
//         const data = await response.json();
//         if (data.translatedText) setNepaliInput(data.translatedText);
//       } catch (error) {
//         console.error('Translation error:', error);
//       } finally {
//         setIsTranslating(false);
//       }
//     }, 500);

//     return () => clearTimeout(timeoutId);
//   }, [englishInput, language, inputMode]);

//   // ── Search ────────────────────────────────────────────────────────────────
//   const handleSearch = async () => {
//     const term = language === 'en' ? englishInput : nepaliInput;
//     if (!term.trim()) return;

//     setIsSearching(true);
//     setShowNoResults(false);
//     setMatches([]);
//     setActiveMatchId(null);

//     try {
//       const base = window.location.origin;
//       const res  = await fetch(
//         `${base}/api/document/search?locale=${locale}&q=${encodeURIComponent(term)}`
//       );
//       const data = await res.json() as { matches: { id: string; preview: string }[] };
//       setMatches(data.matches);
//       setShowNoResults(data.matches.length === 0);
//       setSearchTerm(term);
//     } catch (error) {
//       console.error('Search error:', error);
//       setShowNoResults(true);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handleMatchFound = useCallback(() => {}, []);

//   const handleClearSearch = () => {
//     setSearchTerm('');
//     setMatches([]);
//     setShowNoResults(false);
//     setActiveMatchId(null);
//   };

//   const canSearch =
//     language === 'en' ? englishInput.trim() !== '' : nepaliInput.trim() !== '';

//   return (
//     <main className="min-h-screen">
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto mb-12">
//           <div className="text-center mb-8" />

//           <div className="bg-card rounded-xl shadow-lg border border-border p-6 transition-all duration-300 hover:shadow-xl">

//             {language === 'ne' && (
//               <>
//                 {/* ── Mode toggle ──────────────────────────────────────────── */}
//                 <div className="flex gap-2 mb-4">
//                   <button
//                     onClick={() => setInputMode('english')}
//                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
//                       inputMode === 'english'
//                         ? 'bg-orange-500 text-white border-orange-500'
//                         : 'border-border text-muted-foreground hover:border-orange-400'
//                     }`}
//                   >
//                     <Languages className="h-3 w-3" />
//                     English → नेपाली
//                   </button>
//                   <button
//                     onClick={() => setInputMode('romanized')}
//                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
//                       inputMode === 'romanized'
//                         ? 'bg-orange-500 text-white border-orange-500'
//                         : 'border-border text-muted-foreground hover:border-orange-400'
//                     }`}
//                   >
//                     <Keyboard className="h-3 w-3" />
//                     Romanized → नेपाली
//                   </button>
//                 </div>

//                 {/* ── English input (translate mode) ───────────────────────── */}
//                 {inputMode === 'english' && (
//                   <div className="mb-4">
//                     <label htmlFor="english-input" className="block text-sm font-medium mb-2">
//                       अंग्रेजीमा टाइप गर्नुहोस्
//                     </label>
//                     <input
//                       id="english-input"
//                       type="text"
//                       value={englishInput}
//                       onChange={(e) => setEnglishInput(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter' && canSearch && !isSearching) handleSearch();
//                       }}
//                       placeholder="Type in English to auto-translate..."
//                       className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
//                     />
//                     {isTranslating && (
//                       <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         <span>अनुवाद गर्दै...</span>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* ── Romanized input (Pramukh IME mode) ───────────────────── */}
//                 {inputMode === 'romanized' && (
//                   <div className="mb-4">
//                     <label htmlFor="romanized-input" className="block text-sm font-medium mb-2">
//                       Roman अक्षरमा टाइप गर्नुहोस्
//                     </label>
//                     <input
//                       id="romanized-input"
//                       ref={romanizedInputRef}
//                       type="text"
//                       // Intentionally uncontrolled — Pramukh IME owns this DOM node.
//                       // State is synced via the polling useEffect above.
//                       defaultValue=""
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter' && canSearch && !isSearching) handleSearch();
//                       }}
//                       placeholder="maile kaam garye → मैले काम गर्ये"
//                       className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
//                     />
//                     <p className="text-xs text-muted-foreground mt-1">
//                       Type in Roman — converts to Devanagari live as you type
//                     </p>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* ── Nepali result / English direct input ─────────────────────── */}
//             {!(language === 'ne' && inputMode === 'romanized') && (
//               <div className="mb-4">
//                 <label htmlFor="search-input" className="block text-sm font-medium mb-2">
//                   {language === 'en'
//                     ? 'Search Query'
//                     : 'अनुवादित नेपाली पाठ (सम्पादन योग्य)'}
//                 </label>
//                 <input
//                   id="search-input"
//                   type="text"
//                   value={language === 'en' ? englishInput : nepaliInput}
//                   onChange={(e) =>
//                     language === 'en'
//                       ? setEnglishInput(e.target.value)
//                       : setNepaliInput(e.target.value)
//                   }
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' && canSearch && !isSearching) handleSearch();
//                   }}
//                   placeholder={
//                     language === 'en'
//                       ? 'Enter search term...'
//                       : 'खोज शब्द प्रविष्ट गर्नुहोस्...'
//                   }
//                   className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
//                 />
//               </div>
//             )}

//             <button
//               onClick={handleSearch}
//               disabled={!canSearch || isSearching}
//               className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
//             >
//               {isSearching ? (
//                 <>
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                   <span>{language === 'en' ? 'Searching...' : 'खोज्दै...'}</span>
//                 </>
//               ) : (
//                 <>
//                   <Search className="h-5 w-5" />
//                   <span>{language === 'en' ? 'Search' : 'खोज्नुहोस्'}</span>
//                 </>
//               )}
//             </button>
//           </div>

//           {showNoResults && searchTerm.trim() && (
//             <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-center animate-in fade-in duration-300">
//               <p className="text-orange-600 dark:text-orange-400 font-medium">
//                 {language === 'en'
//                   ? 'No results found. Try a different search term.'
//                   : 'कुनै परिणाम फेला परेन। फरक खोज शब्द प्रयास गर्नुहोस्।'}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* ── Document viewer ───────────────────────────────────────────────── */}
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-card rounded-xl shadow-lg border border-border p-8">
//             <DocumentViewer
//               searchTerm={searchTerm}
//               onMatchFound={handleMatchFound}
//               activeMatchId={activeMatchId}
//             />
//           </div>
//         </div>

//         <ResultsCard
//           matches={matches}
//           searchTerm={searchTerm}
//           onClose={handleClearSearch}
//           activeMatchId={activeMatchId}
//           setActiveMatchId={setActiveMatchId}
//         />
//       </div>
//     </main>
//   );
// }



'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import DocumentViewer from '@/components/DocumentViewer';
import ResultsCard from '@/components/ResultsCard';
import TableOfContents from '@/components/TableOfContents';
import { Search, Loader as Loader2, Languages, Keyboard } from 'lucide-react';
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

  // ── Single shared instance of the document hook ───────────────────────────
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
  const { sections: tocSections } = useTocIndex(locale);

  const romanizedInputRef = useRef<HTMLInputElement>(null);

  // ── Reset on locale change ─────────────────────────────────────────────────
  useEffect(() => {
    if (language === 'en') {
      setEnglishInput('');
      setNepaliInput('');
    }
  }, [language]);

  // ── Reset nepali input when switching modes ────────────────────────────────
  useEffect(() => {
    setNepaliInput('');
    if (romanizedInputRef.current) {
      romanizedInputRef.current.value = '';
    }
  }, [inputMode]);

  // ── Enable/disable Pramukh IME ────────────────────────────────────────────
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

  // ── Poll DOM to sync IME value → React state ──────────────────────────────
  useEffect(() => {
    if (inputMode !== 'romanized') return;
    const interval = setInterval(() => {
      const el = romanizedInputRef.current;
      if (el && el.value !== nepaliInput) setNepaliInput(el.value);
    }, 100);
    return () => clearInterval(interval);
  }, [inputMode, nepaliInput]);



  // ── Auto-translate English → Nepali ───────────────────────────────────────
  useEffect(() => {
    if (language !== 'ne' || inputMode !== 'english' || !englishInput.trim()) return;
    const timeoutId = setTimeout(async () => {
      setIsTranslating(true);
      try {
        const response = await fetch('http://localhost:8002/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: englishInput, mode: 'translate' }),
        });
        const data = await response.json();
        if (data.translatedText) setNepaliInput(data.translatedText);
      } catch (error) {
        console.error('Translation error:', error);
      } finally {
        setIsTranslating(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [englishInput, language, inputMode]);

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = async () => {
    const term = language === 'en' ? englishInput : nepaliInput;
    if (!term.trim()) return;

    setIsSearching(true);
    setShowNoResults(false);
    setMatches([]);
    setActiveMatchId(null);
    setActiveTocSectionId(null);

    try {
      const base = window.location.origin;
      const res = await fetch(
        `${base}/api/document/search?locale=${locale}&q=${encodeURIComponent(term)}`
      );
      const data = await res.json() as { matches: { id: string; preview: string }[] };
      setMatches(data.matches);
      setShowNoResults(data.matches.length === 0);
      setSearchTerm(term);
    } catch (error) {
      console.error('Search error:', error);
      setShowNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTocNavigate = useCallback((sectionId: string) => {
    setActiveMatchId(null);
    setActiveTocSectionId(sectionId);
  }, []);

  const handleMatchFound = useCallback(() => { }, []);

  const handleClearSearch = () => {
    setSearchTerm('');
    setMatches([]);
    setShowNoResults(false);
    setActiveMatchId(null);
  };

  const canSearch =
    language === 'en' ? englishInput.trim() !== '' : nepaliInput.trim() !== '';

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8" />

          <div className="bg-card rounded-xl shadow-lg border border-border p-6 transition-all duration-300 hover:shadow-xl">
            {language === 'ne' && (
              <>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setInputMode('english')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${inputMode === 'english'
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'border-border text-muted-foreground hover:border-orange-400'
                      }`}
                  >
                    <Languages className="h-3 w-3" />
                    English → नेपाली
                  </button>
                  <button
                    onClick={() => setInputMode('romanized')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${inputMode === 'romanized'
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'border-border text-muted-foreground hover:border-orange-400'
                      }`}
                  >
                    <Keyboard className="h-3 w-3" />
                    Romanized → नेपाली
                  </button>
                </div>

                {inputMode === 'english' && (
                  <div className="mb-4">
                    <label htmlFor="english-input" className="block text-sm font-medium mb-2">
                      अंग्रेजीमा टाइप गर्नुहोस्
                    </label>
                    <input
                      id="english-input"
                      type="text"
                      value={englishInput}
                      onChange={(e) => setEnglishInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && canSearch && !isSearching) handleSearch(); }}
                      placeholder="Type in English to auto-translate..."
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

                {inputMode === 'romanized' && (
                  <div className="mb-4">
                    <label htmlFor="romanized-input" className="block text-sm font-medium mb-2">
                      Roman अक्षरमा टाइप गर्नुहोस्
                    </label>
                    <input
                      id="romanized-input"
                      ref={romanizedInputRef}
                      type="text"
                      defaultValue=""
                      onKeyDown={(e) => { if (e.key === 'Enter' && canSearch && !isSearching) handleSearch(); }}
                      placeholder="maile kaam garye → मैले काम गर्ये"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Type in Roman — converts to Devanagari live as you type
                    </p>
                  </div>
                )}
              </>
            )}

            {!(language === 'ne' && inputMode === 'romanized') && (
              <div className="mb-4">
                <label htmlFor="search-input" className="block text-sm font-medium mb-2">
                  {language === 'en' ? 'Search Query' : 'अनुवादित नेपाली पाठ (सम्पादन योग्य)'}
                </label>
                <input
                  id="search-input"
                  type="text"
                  value={language === 'en' ? englishInput : nepaliInput}
                  onChange={(e) => language === 'en' ? setEnglishInput(e.target.value) : setNepaliInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && canSearch && !isSearching) handleSearch(); }}
                  placeholder={language === 'en' ? 'Enter search term...' : 'खोज शब्द प्रविष्ट गर्नुहोस्...'}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            )}

            <button
              onClick={handleSearch}
              disabled={!canSearch || isSearching}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              {isSearching ? (
                <><Loader2 className="h-5 w-5 animate-spin" /><span>{language === 'en' ? 'Searching...' : 'खोज्दै...'}</span></>
              ) : (
                <><Search className="h-5 w-5" /><span>{language === 'en' ? 'Search' : 'खोज्नुहोस्'}</span></>
              )}
            </button>
          </div>

          {showNoResults && searchTerm.trim() && (
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-center animate-in fade-in duration-300">
              <p className="text-orange-600 dark:text-orange-400 font-medium">
                {language === 'en'
                  ? 'No results found. Try a different search term.'
                  : 'कुनै परिणाम फेला परेन। फरक खोज शब्द प्रयास गर्नुहोस्।'}
              </p>
            </div>
          )}


          <div className="max-w-4xl mx-auto mt-12">
            {/* ── Pass hook data down — no second fetch ── */}
            <TableOfContents
              sections={tocSections}  
              activeMatchId={activeMatchId}
              onNavigate={handleTocNavigate}
            />
          </div>

        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            {/* ── Pass hook data down — no second fetch ── */}
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

        <ResultsCard
          matches={matches}
          searchTerm={searchTerm}
          onClose={handleClearSearch}
          activeMatchId={activeMatchId}
          setActiveMatchId={setActiveMatchId}
        />
      </div>


    </main>
  );
}