'use client';

import React, { useEffect, useRef } from 'react';
import { DocumentSection } from '@/data/document';
import Image from 'next/image';

interface DocumentViewerProps {
  sections: DocumentSection[];
  searchTerm: string;
  onMatchFound: (matches: { id: string; preview: string }[]) => void;
}

export default function DocumentViewer({
  sections,
  searchTerm,
  onMatchFound,
}: DocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      onMatchFound([]);
      return;
    }

    const matches: { id: string; preview: string }[] = [];

    sections.forEach((section) => {
      let hasMatch = false;
      let preview = '';

      if (section.type === 'h1' || section.type === 'h2' || section.type === 'h3' || section.type === 'h4' || section.type === 'p') {
        const content = section.content as string;
        if (content.toLowerCase().includes(searchTerm.toLowerCase())) {
          hasMatch = true;
          preview = content.length > 100 ? content.substring(0, 100) + '...' : content;
        }
      } else if (section.type === 'list') {
        const listItems = section.content as string[];
        listItems.forEach((item) => {
          if (item.toLowerCase().includes(searchTerm.toLowerCase())) {
            hasMatch = true;
            preview = item.length > 100 ? item.substring(0, 100) + '...' : item;
          }
        });
      } else if (section.type === 'table') {
        const table = section.content as { headers: string[]; rows: string[][] };
        const allText = [...table.headers, ...table.rows.flat()].join(' ');
        if (allText.toLowerCase().includes(searchTerm.toLowerCase())) {
          hasMatch = true;
          preview = 'तालिका मा फेला पर्यो';
        }
      } else if (section.type === 'image') {
        if (
          section.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.caption?.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          hasMatch = true;
          preview = section.caption || section.alt || 'तस्बिर';
        }
      }

      if (hasMatch) {
        matches.push({ id: section.id, preview });
      }
    });

    onMatchFound(matches);

    if (matches.length > 0) {
      setTimeout(() => {
        const firstMatch = document.getElementById(matches[0].id);
        if (firstMatch) {
          firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [searchTerm, sections, onMatchFound]);

  const highlightText = (text: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className="border-2 border-orange-300 bg-orange-50/50 dark:border-orange-600 dark:bg-orange-900/30 rounded px-1"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const renderSection = (section: DocumentSection) => {
    const isMatch = searchTerm.trim() !== '' && (() => {
      if (section.type === 'h1' || section.type === 'h2' || section.type === 'h3' || section.type === 'h4' || section.type === 'p') {
        return (section.content as string).toLowerCase().includes(searchTerm.toLowerCase());
      } else if (section.type === 'list') {
        return (section.content as string[]).some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
      } else if (section.type === 'table') {
        const table = section.content as { headers: string[]; rows: string[][] };
        return [...table.headers, ...table.rows.flat()].join(' ').toLowerCase().includes(searchTerm.toLowerCase());
      } else if (section.type === 'image') {
        return section.alt?.toLowerCase().includes(searchTerm.toLowerCase()) || section.caption?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    })();

    const baseClasses = isMatch ? 'scroll-mt-24 transition-all duration-300' : '';

    switch (section.type) {
      case 'h1':
        return (
          <h1
            key={section.id}
            id={section.id}
            className={`text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600 ${baseClasses}`}
          >
            {highlightText(section.content as string)}
          </h1>
        );
      case 'h2':
        return (
          <h2
            key={section.id}
            id={section.id}
            className={`text-3xl font-bold mb-4 mt-8 ${baseClasses}`}
          >
            {highlightText(section.content as string)}
          </h2>
        );
      case 'h3':
        return (
          <h3
            key={section.id}
            id={section.id}
            className={`text-2xl font-semibold mb-3 mt-6 ${baseClasses}`}
          >
            {highlightText(section.content as string)}
          </h3>
        );
      case 'h4':
        return (
          <h4
            key={section.id}
            id={section.id}
            className={`text-xl font-semibold mb-2 mt-4 ${baseClasses}`}
          >
            {highlightText(section.content as string)}
          </h4>
        );
      case 'p':
        return (
          <p
            key={section.id}
            id={section.id}
            className={`text-base leading-relaxed mb-4 text-muted-foreground ${baseClasses}`}
          >
            {highlightText(section.content as string)}
          </p>
        );
      case 'list':
        return (
          <ul
            key={section.id}
            id={section.id}
            className={`list-disc list-inside space-y-2 mb-4 ml-4 ${baseClasses}`}
          >
            {(section.content as string[]).map((item, idx) => (
              <li key={idx} className="text-muted-foreground">
                {highlightText(item)}
              </li>
            ))}
          </ul>
        );
      case 'table':
        const tableData = section.content as {
          headers: string[];
          rows: string[][];
        };
        return (
          <div
            key={section.id}
            id={section.id}
            className={`overflow-x-auto mb-6 ${baseClasses}`}
          >
            <table className="min-w-full border-collapse border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  {tableData.headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="border border-border px-4 py-2 text-left font-semibold"
                    >
                      {highlightText(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-muted/50 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="border border-border px-4 py-2 text-muted-foreground"
                      >
                        {highlightText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'image':
        return (
          <figure
            key={section.id}
            id={section.id}
            className={`mb-6 ${baseClasses}`}
          >
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src={section.content as string}
                alt={section.alt || ''}
                fill
                className="object-cover"
              />
            </div>
            {section.caption && (
              <figcaption className="text-sm text-muted-foreground text-center mt-2 italic">
                {highlightText(section.caption)}
              </figcaption>
            )}
          </figure>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="prose prose-neutral dark:prose-invert max-w-none">
      {sections.map(renderSection)}
    </div>
  );
}
