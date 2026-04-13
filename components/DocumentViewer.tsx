import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useVirtualizer } from '@tanstack/react-virtual';

import type { ChunkManifest, ChunkState, DocumentSection as HookDocumentSection } from '@/hooks/useDocumentChunks';
import type { ListItem, ListType } from '@/types/types';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';


interface DocumentViewerProps {
  searchTerm: string;
  activeMatchId?: string | null;
  activeTocSectionId?: string | null;
  onMatchFound: (matches: { id: string; preview: string }[]) => void;
  // ── Hook data passed from parent ──
  manifest: ChunkManifest | null;
  manifestStatus: 'idle' | 'loading' | 'loaded' | 'error';
  chunks: ChunkState[];
  sections: HookDocumentSection[];
  loadChunk: (index: number) => Promise<void>;
  loadAllChunks?: () => Promise<void>;
  loadUntilSection: (sectionId: string) => Promise<void>;
}

// ── Section types ─────────────────────────────────────────────────────────────

type SectionType =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  | 'list' | 'table' | 'complex-table'
  | 'image' | 'timeline';

interface TimelineEntry {
  label: string;
  sublabel?: string;
  items?: TimelineItem[];
}
interface TimelineItem {
  content: string;
  children?: TimelineItem[];
}
interface ComplexTableCell {
  content: string;
  colspan?: number;
  rowspan?: number;
  header?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}
interface DocumentSection {
  id: string;
  type: SectionType;
  content?: string | string[] | ListItem[];
  'list-type'?: ListType;
  headers?: string[];
  rows?: string[][];
  alt?: string;
  caption?: string;
  grid?: ComplexTableCell[][];
  entries?: TimelineEntry[];
}

// ── Highlight helper ──────────────────────────────────────────────────────────

function highlight(
  text: string,
  term: string,
  sectionId: string,
  occurrenceCounter: { value: number },
  activeMatchId: string | null
): React.ReactNode {
  if (!term.trim()) return text;
  const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedTerm})`, 'gi');
  const parts = text.split(regex);
  const matchRegex = new RegExp(`^${escapedTerm}$`, 'i');
  return parts.map((part, i) => {
    if (matchRegex.test(part)) {
      const matchId = `${sectionId}::${occurrenceCounter.value++}`;
      return (
        <mark
          key={i}
          id={matchId}
          className={`rounded px-0.5 transition-all ${activeMatchId === matchId
            ? 'bg-orange-400 dark:bg-orange-600 border-2 border-orange-600 dark:border-orange-300'
            : 'bg-orange-200 dark:bg-orange-800'
            }`}
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

// ── Timeline ──────────────────────────────────────────────────────────────────

function Timeline({ id, entries, hl }: { id: string; entries: TimelineEntry[]; hl: (text: string) => React.ReactNode }) {
  return (
    <div id={id} className="mb-6 font-mono text-sm text-foreground">
      {entries.map((entry, ei) => {
        const isLast = ei === entries.length - 1;
        return (
          <div key={ei} className="flex">
            <div className="flex flex-col items-center mr-0 mt-[-8px]" style={{ width: 20, minWidth: 20 }}>
              <div className="w-px flex-shrink-0" style={{ height: 12, background: ei === 0 ? 'transparent' : 'var(--timeline-line, #666)' }} />
              <div className="w-2 h-2 rounded-full border-2 flex-shrink-0" style={{ borderColor: 'var(--timeline-dot, #555)', background: 'var(--background)' }} />
              <div className="w-px flex-grow" style={{ background: isLast ? 'transparent' : 'var(--timeline-line, #666)', minHeight: 8 }} />
            </div>
            <div className="flex-1 pb-4 pl-2">
              <div className="flex flex-wrap items-baseline gap-1 text-[16px] leading-snug mb-1">
                <span className="font-semibold text-foreground">{hl(entry.label)}</span>
                {entry.sublabel && <span className="text-muted-foreground">{hl(entry.sublabel)}</span>}
              </div>
              {entry.items && entry.items.length > 0 && <TimelineItemList items={entry.items} hl={hl} depth={0} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineItemList({ items, hl, depth }: { items: TimelineItem[]; hl: (t: string) => React.ReactNode; depth: number }) {
  return (
    <ul className="space-y-0.5" style={{ paddingLeft: depth === 0 ? 0 : 16 }}>
      {items.map((item, idx) => (
        <li key={idx}>
          <div className="flex items-start gap-1 leading-relaxed text-muted-foreground">
            <span className="flex-shrink-0 select-none" style={{ color: 'var(--timeline-line, #888)', marginTop: 2 }}>
              {depth === 0 ? '├─' : '└─'}
            </span>
            {/* <p className="flex-1">{hl(item.content)}</p> */}
            <motion.p
              // key={section.id}

              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.45 }}
              className="flex-1 font-body text-base md:text-[1.05rem] text-foreground/80 leading-[1.9] mb-4"
            >
              {hl(item.content)}
            </motion.p>
          </div>
          {item.children && item.children.length > 0 && (
            <div className="pl-4"><TimelineItemList items={item.children} hl={hl} depth={depth + 1} /></div>
          )}
        </li>
      ))}
    </ul>
  );
}

// ── ComplexTable ──────────────────────────────────────────────────────────────

function ComplexTable({ id, caption, grid, hl }: { id: string; caption?: string; grid: ComplexTableCell[][]; hl: (t: string) => React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<'start' | 'middle' | 'end' | 'none'>('none');

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth <= clientWidth) setScrollState('none');
    else if (scrollLeft <= 2) setScrollState('start');
    else if (scrollLeft + clientWidth >= scrollWidth - 2) setScrollState('end');
    else setScrollState('middle');
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', updateScrollState); ro.disconnect(); };
  }, [updateScrollState]);

  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });

  const canScrollLeft = scrollState === 'middle' || scrollState === 'end';
  const canScrollRight = scrollState === 'middle' || scrollState === 'start';
  const isScrollable = scrollState !== 'none';

  const alignClass: Record<NonNullable<ComplexTableCell['align']>, string> = {
    left: 'text-left', center: 'text-center', right: 'text-right',
  };

  return (
    <div id={id} className="mb-6">
      {caption &&
        <motion.p


          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.45 }}
          className="font-body text-base md:text-[1.05rem] text-foreground/80 leading-[1.9] mb-4"
        >
          {caption}
        </motion.p>

        // <p className="text-sm font-semibold text-foreground mb-1">{caption}
        // </p>
      }
      <div ref={scrollRef} className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div className="rounded-lg overflow-hidden border border-border min-w-full w-max">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-muted/50 transition-colors">
                  {row.map((cell, cellIndex) => {
                    const Tag = cell.header ? 'th' : 'td';
                    const baseClass = cell.header
                      ? 'bg-orange-50 dark:bg-orange-900/20 font-semibold text-foreground'
                      : 'text-muted-foreground';
                    return (
                      <Tag key={cellIndex} colSpan={cell.colspan ?? 1} rowSpan={cell.rowspan ?? 1}
                        className={['border border-border px-3 py-2', baseClass, alignClass[cell.align ?? 'left'], cell.className ?? ''].filter(Boolean).join(' ')}>
                        {hl(cell.content)}
                      </Tag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isScrollable && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <button onClick={() => scroll('left')} disabled={!canScrollLeft} aria-label="Scroll left"
            className={['flex items-center justify-center w-8 h-8 rounded-full border border-border text-sm transition-colors',
              canScrollLeft ? 'text-foreground hover:bg-muted cursor-pointer' : 'text-muted-foreground/40 cursor-not-allowed'].join(' ')}>←</button>
          <div className="flex gap-1.5">
            {(['start', 'middle', 'end'] as const).map((pos) => (
              <span key={pos} className={['block w-1.5 h-1.5 rounded-full transition-colors duration-200', scrollState === pos ? 'bg-foreground' : 'bg-border'].join(' ')} />
            ))}
          </div>
          <button onClick={() => scroll('right')} disabled={!canScrollRight} aria-label="Scroll right"
            className={['flex items-center justify-center w-8 h-8 rounded-full border border-border text-sm transition-colors',
              canScrollRight ? 'text-foreground hover:bg-muted cursor-pointer' : 'text-muted-foreground/40 cursor-not-allowed'].join(' ')}>→</button>
        </div>
      )}
    </div>
  );
}

// ── Section renderer ──────────────────────────────────────────────────────────

function renderSection(
  section: DocumentSection,
  searchTerm: string,
  activeMatchId: string | null
): React.ReactNode {
  const { id, type, content, headers, rows, alt, caption, grid, entries } = section;
  const counter = { value: 0 };
  const hl = (text: string) => highlight(text, searchTerm, id, counter, activeMatchId);

  switch (type) {
    case 'h1':
      return <h1 id={id} className="text-3xl font-bold mt-8 mb-4 text-primary border-b border-border pb-2">{hl(content as string)}</h1>;
    case 'h2':
      return <h2 id={id} className="text-2xl font-semibold mt-6 mb-3 border-b border-border pb-2 text-primary">{hl(content as string)}</h2>;
    case 'h3':
      return <h3 id={id} className="text-xl font-semibold mt-5 mb-2 text-foreground">{hl(content as string)}</h3>;
    case 'h4':
      return <h4 id={id} className="text-lg font-semibold mt-4 mb-2 text-foreground">{hl(content as string)}</h4>;
    case 'p':
      return <motion.p
        key={id}
        id={id}

        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.45 }}
        className="font-body text-base md:text-[1.05rem] text-foreground/80 leading-[1.9] mb-4"
      >
        {hl(content as string)}
      </motion.p>;
    case 'list': {
      const listType = section['list-type'];
      const isOrdered = listType === 'number';
      const items = content as (string | ListItem)[];
      return (
        <ul id={id} className="space-y-1 mb-4 text-muted-foreground">
          {items.map((item, i) => {
            const text = typeof item === 'string' ? item : item.content;
            const no = typeof item === 'object' ? item.no : undefined;
            return (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 font-medium text-foreground">
                  {no !== undefined && no !== null ? `${no}.` : isOrdered ? `${i + 1}.` : '•'}
                </span>
                <span>{hl(text)}</span>
              </li>
            );
          })}
        </ul>
      );
    }
    case 'table':
      return (
        <div id={id} className="overflow-x-auto mb-6">
          <div className="rounded-lg overflow-hidden border border-border min-w-full w-max">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-orange-50 dark:bg-orange-900/20">
                  {(headers ?? []).map((h, i) => (
                    <th key={i} className="border border-border px-4 py-2 text-left font-semibold text-foreground">{hl(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(rows ?? []).map((row, ri) => (
                  <tr key={ri} className="hover:bg-muted/50 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-border px-4 py-2 text-muted-foreground">{hl(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case 'complex-table':
      return <ComplexTable key={id} id={id} caption={caption} grid={grid ?? []} hl={hl} />;
    case 'timeline':
      return <Timeline key={id} id={id} entries={entries ?? []} hl={hl} />;
    case 'image':
      return (
        <figure id={id} className="mb-6">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <Image src={content as string} alt={alt ?? ''} fill className="object-contain" sizes="(max-width: 768px) 100vw, 800px" />
          </div>
          {caption && <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">{caption}</figcaption>}
        </figure>
      );
    default:
      return null;
  }
}

// ── VirtualRow ────────────────────────────────────────────────────────────────

const VirtualRow = React.memo(function VirtualRow({
  section,
  searchTerm,
  activeMatchId,
}: {
  section: DocumentSection;
  searchTerm: string;
  activeMatchId: string | null;
}) {
  return <>{renderSection(section, searchTerm, activeMatchId)}</>;
});

// ── DocumentViewer ────────────────────────────────────────────────────────────

export default function DocumentViewer({
  searchTerm,
  activeMatchId = null,
  activeTocSectionId,
  onMatchFound,
  manifest,
  manifestStatus,
  chunks,
  sections,
  loadChunk,
  loadUntilSection,
}: DocumentViewerProps) {
  const locale = useLocale();

  // Load first chunk immediately when manifest is ready
  useEffect(() => {
    if (manifest && chunks[0]?.status === 'idle') {
      loadChunk(0);
    }
  }, [manifest, chunks, loadChunk]);

  // ── Virtualiser ────────────────────────────────────────────────────────────
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: sections.length,
    getScrollElement: () =>
      typeof window !== 'undefined' ? window.document.documentElement : null,
    estimateSize: useCallback(
      (index: number) => {
        const s = sections[index];
        if (!s) return 80;
        if (s.type === 'table' || s.type === 'complex-table') return 200;
        if (s.type === 'timeline') return 300;
        if (s.type === 'h1' || s.type === 'h2') return 60;
        if (s.type === 'image') return 320;
        return 80;
      },
      [sections]
    ),
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // ── Sentinel ───────────────────────────────────────────────────────────────
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!manifest) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const nextIdle = chunks.findIndex((c) => c.status === 'idle');
        if (nextIdle !== -1) loadChunk(nextIdle);
      },
      { rootMargin: '400px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [manifest, chunks, loadChunk]);

  // ── Scroll to active search match ─────────────────────────────────────────
  useEffect(() => {
    if (!activeMatchId) return;
    const sectionId = activeMatchId.split('::')[0];
    loadUntilSection(sectionId).then(() => {
      setTimeout(() => {
        const sectionIndex = sections.findIndex((s) => s.id === sectionId);
        if (sectionIndex !== -1) {
          virtualizer.scrollToIndex(sectionIndex, { align: 'center', behavior: 'smooth' });
        }
        setTimeout(() => {
          document.getElementById(activeMatchId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      }, 100);
    });
  }, [activeMatchId, sections, virtualizer, loadUntilSection]);

  // ── Scroll to TOC section ─────────────────────────────────────────────────
  // useEffect(() => {
  //   if (!activeTocSectionId) return;
  //   loadUntilSection(activeTocSectionId).then(() => {
  //     setTimeout(() => {
  //       const sectionIndex = sections.findIndex((s) => s.id === activeTocSectionId);
  //       if (sectionIndex !== -1) {
  //         virtualizer.scrollToIndex(sectionIndex, { align: 'start', behavior: 'smooth' });
  //       }
  //       setTimeout(() => {
  //         document.getElementById(activeTocSectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //       }, 200);
  //     }, 100);
  //   });
  // }, [activeTocSectionId, sections, virtualizer, loadUntilSection]);



  // ── Scroll to TOC section ─────────────────────────────────────────────────
  useEffect(() => {
    if (!activeTocSectionId) return;

    loadUntilSection(activeTocSectionId).then(() => {
      // Give React time to render newly loaded chunks
      setTimeout(() => {
        const el = document.getElementById(activeTocSectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        // Element not in DOM yet (virtualizer hasn't rendered it)
        // Find its index and use virtualizer to bring it into view first
        const sectionIndex = sections.findIndex((s) => s.id === activeTocSectionId);
        if (sectionIndex !== -1) {
          virtualizer.scrollToIndex(sectionIndex, { align: 'start', behavior: 'auto' });
          // Then scroll the window to it after virtualizer renders
          setTimeout(() => {
            document.getElementById(activeTocSectionId)
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 200);
        }
      }, 100);
    });
  }, [activeTocSectionId, sections, virtualizer, loadUntilSection]);

  // ── onMatchFound ───────────────────────────────────────────────────────────
  useEffect(() => {
    onMatchFound([]);
  }, [onMatchFound]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (manifestStatus === 'loading' || manifestStatus === 'idle') {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground gap-3">
        <span className="animate-spin text-orange-500">⟳</span>
        <span>Loading document…</span>
      </div>
    );
  }

  if (manifestStatus === 'error') {
    return (
      <div className="py-8 text-center text-destructive">
        Failed to load document. Please refresh the page.
      </div>
    );
  }

  return (
    <div ref={parentRef}>
      {locale === 'en' && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          {/* <Sparkles className="h-6 w-6 text-blue-500 shrink-0" /> */}
          <motion.p
            // key={section.id}

            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.45 }}
            className="font-body text-base md:text-[1.05rem] text-foreground/80 leading-[1.9]"
          >
            Note: This document has been translated by AI. Some inaccuracies may be present.
          </motion.p>

        </div>
      )}

      <article
        className="prose-sm max-w-none relative"
        style={{ height: virtualizer.getTotalSize(), position: 'relative' }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            ref={virtualizer.measureElement}
            data-index={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <VirtualRow
              section={sections[virtualItem.index] as DocumentSection}
              searchTerm={searchTerm}
              activeMatchId={activeMatchId}
            />
          </div>
        ))}
      </article>

      <div ref={sentinelRef} className="h-1" aria-hidden />

      {chunks.some((c) => c.status === 'loading') && (
        <div className="flex items-center justify-center py-6 text-muted-foreground gap-2 text-sm">
          <span className="animate-spin text-orange-500">⟳</span>
          <span>Loading more…</span>
        </div>
      )}
    </div>
  );
}