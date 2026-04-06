// hooks/useTocIndex.ts
'use client';

import { useState, useEffect } from 'react';
import type { DocumentSection } from './useDocumentChunks';

type TocEntry = { id: string; type: string; content: string };
const cache = new Map<string, TocEntry[]>();

export function useTocIndex(locale: string) {
  const [sections, setSections] = useState<DocumentSection[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  useEffect(() => {
    if (cache.has(locale)) {
      setSections(cache.get(locale) as DocumentSection[]);
      setStatus('loaded');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    fetch(`/data/${locale}/toc-index.json`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data: TocEntry[]) => {
        if (cancelled) return;
        cache.set(locale, data);
        setSections(data as DocumentSection[]);
        setStatus('loaded');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });

    return () => { cancelled = true; };
  }, [locale]);

  return { sections, status };
}