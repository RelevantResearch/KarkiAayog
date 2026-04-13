'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { DocumentSection } from '@/hooks/useDocumentChunks';
import { useLocale } from 'next-intl';

type HeadingType = 'h1' | 'h2' | 'h3' | 'h4';

interface TocEntry {
  id: string;
  type: HeadingType;
  label: string;
  children: TocEntry[];
}

interface TableOfContentsProps {
  sections: DocumentSection[];
  activeMatchId?: string | null;
  onNavigate: (sectionId: string) => void;
  scrollable?: boolean;
  maxHeight?: string;
}

function buildTocTree(sections: DocumentSection[]): TocEntry[] {
  const headingTypes: HeadingType[] = ['h1', 'h2', 'h3', 'h4'];
  const levelOf: Record<HeadingType, number> = { h1: 1, h2: 2, h3: 3, h4: 4 };
  const roots: TocEntry[] = [];
  const stack: TocEntry[] = [];

  for (const section of sections) {
    if (!headingTypes.includes(section.type as HeadingType)) continue;
    const type = section.type as HeadingType;
    const label = typeof section.content === 'string' ? section.content : '';
    if (!label.trim()) continue;

    const entry: TocEntry = { id: section.id ?? '', type, label, children: [] };
    const level = levelOf[type];

    while (stack.length > 0 && levelOf[stack[stack.length - 1].type] >= level) {
      stack.pop();
    }

    if (stack.length === 0) roots.push(entry);
    else stack[stack.length - 1].children.push(entry);

    stack.push(entry);
  }

  return roots;
}

const INDENT: Record<HeadingType, string> = {
  h1: 'pl-0',
  h2: 'pl-4',
  h3: 'pl-7',
  h4: 'pl-10',
};

const FONT_SIZE: Record<HeadingType, string> = {
  h1: 'text-sm font-semibold text-foreground',
  h2: 'text-sm font-medium text-foreground',
  h3: 'text-xs font-normal text-muted-foreground',
  h4: 'text-xs font-normal text-muted-foreground/70',
};

function TocNode({
  entry,
  activeSectionId,
  expandedIds,
  onToggle,
  onNavigate,
}: {
  entry: TocEntry;
  activeSectionId: string | null;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onNavigate: (id: string) => void;
}) {
  const hasChildren = entry.children.length > 0;
  const isExpanded = expandedIds.has(entry.id);
  const isActive = activeSectionId === entry.id;

  return (
    <li>
      <div
        className={[
          'group flex items-center gap-1 rounded-md py-1 pr-2 cursor-pointer transition-all duration-150 select-none',
          INDENT[entry.type],
          isActive
            ? 'bg-orange-100 dark:bg-orange-900/30'
            : 'hover:bg-muted/60',
        ].join(' ')}
      >
        <button
          onClick={() => hasChildren && onToggle(entry.id)}
          className={[
            'flex-shrink-0 w-4 h-4 flex items-center justify-center rounded transition-colors',
            hasChildren
              ? 'text-muted-foreground hover:text-foreground'
              : 'text-transparent pointer-events-none',
          ].join(' ')}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          tabIndex={hasChildren ? 0 : -1}
        >
          {hasChildren ? (
            isExpanded
              ? <ChevronDown className="w-3 h-3" />
              : <ChevronRight className="w-3 h-3" />
          ) : (
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40 block" />
          )}
        </button>

        <span
          onClick={() => onNavigate(entry.id)}
          className={[
            'flex-1 leading-snug py-0.5 truncate transition-colors cursor-pointer',
            FONT_SIZE[entry.type],
            isActive ? 'text-orange-600 dark:text-orange-400' : '',
          ].join(' ')}
          title={entry.label}
        >
          {entry.label}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <ul className="mt-0.5 space-y-0.5 border-l border-border ml-2">
          {entry.children.map((child) => (
            <TocNode
              key={child.id}
              entry={child}
              activeSectionId={activeSectionId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function TableOfContents({
  sections,
  activeMatchId,
  onNavigate,
  scrollable = false,
  maxHeight = 'calc(100vh - 8rem)',
}: TableOfContentsProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const locale = useLocale();
  const tree = useMemo(() => buildTocTree(sections), [sections]);
  const activeSectionId = activeMatchId ? activeMatchId.split('::')[0] : null;

  const handleToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleNavigate = useCallback(
    (id: string) => { onNavigate(id); },
    [onNavigate]
  );

  const expandAll = useCallback(() => {
    const allIds = new Set<string>();
    const collect = (entries: TocEntry[]) => {
      for (const e of entries) {
        if (e.children.length > 0) { allIds.add(e.id); collect(e.children); }
      }
    };
    collect(tree);
    setExpandedIds(allIds);
  }, [tree]);

  const collapseAll = useCallback(() => setExpandedIds(new Set()), []);

  if (tree.length === 0) return null;

  return (
    // h-full so it fills whatever container it's placed in (drawer or aside)
    <div className="flex flex-col h-full">

      {/* Header — never scrolls */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <span className="text-sm font-semibold text-foreground">
          {locale === 'ne' ? 'सामग्री सूची' : 'Table of contents'}
        </span>
      </div>

      {/* Tree — scrolls independently */}
      <nav
        className="px-3 py-2 overflow-y-auto min-h-0 flex-1"
        // maxHeight only used for the aside (desktop sidebar); drawer relies on flex-1
        style={scrollable && maxHeight !== '100%' ? { maxHeight } : undefined}
      >
        <ul className="space-y-0.5">
          {tree.map((entry) => (
            <TocNode
              key={entry.id}
              entry={entry}
              activeSectionId={activeSectionId}
              expandedIds={expandedIds}
              onToggle={handleToggle}
              onNavigate={handleNavigate}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}