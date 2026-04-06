'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SearchIndexEntry {
  id: string;
  type: string;
  text: string;
  tokens: string[];
  preview: string;
}

export interface SearchMatch {
  id: string;
  preview: string;
}

type IndexStatus = 'idle' | 'loading' | 'loaded' | 'error';

// ── Module-level cache (survives re-renders, shared across hook instances) ────
const indexCache = new Map<string, SearchIndexEntry[]>();

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useSearchIndex(locale: string) {
  const [status, setStatus]   = useState<IndexStatus>('idle');
  const [index, setIndex]     = useState<SearchIndexEntry[]>([]);
  const activeLocale           = useRef(locale);

  useEffect(() => {
    activeLocale.current = locale;

    // Serve from cache if available
    if (indexCache.has(locale)) {
      setIndex(indexCache.get(locale)!);
      setStatus('loaded');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setIndex([]);

    fetch(`/data/${locale}/search-index.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<SearchIndexEntry[]>;
      })
      .then((data) => {
        if (cancelled) return;
        indexCache.set(locale, data);
        setIndex(data);
        setStatus('loaded');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => { cancelled = true; };
  }, [locale]);

  /**
   * Search the index for `term`.
   * Returns up to `limit` matches (default 50).
   *
   * Strategy:
   *   - Splits `term` into tokens
   *   - An entry matches if ALL tokens appear somewhere in its text (case-insensitive)
   *   - Returns { id, preview } with the preview trimmed around the first match
   */
  const search = useCallback(
    (term: string, limit = 50): SearchMatch[] => {
      if (!term.trim() || !index.length) return [];

      const queryTokens = term
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      const results: SearchMatch[] = [];

      for (const entry of index) {
        if (results.length >= limit) break;

        const lowerText = entry.text.toLowerCase();

        // All query tokens must be present
        const allMatch = queryTokens.every((qt) => lowerText.includes(qt));
        if (!allMatch) continue;

        // Build a contextual preview around the first token match
        const firstTokenIdx = lowerText.indexOf(queryTokens[0]);
        const start   = Math.max(0, firstTokenIdx - 30);
        const end     = Math.min(entry.text.length, firstTokenIdx + term.length + 60);
        const snippet = (start > 0 ? '…' : '') +
                        entry.text.slice(start, end).replace(/\n/g, ' ') +
                        (end < entry.text.length ? '…' : '');

        results.push({ id: `${entry.id}::0`, preview: snippet });
      }

      return results;
    },
    [index]
  );

  return { status, search, entryCount: index.length };
}