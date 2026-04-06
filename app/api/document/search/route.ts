// app/api/document/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BAD_CHARS = [
  0x200C, 0x200B, 0x200D, 0xFEFF, 0x00AD,
  0x200E, 0x200F, 0x2028, 0x2029,
  ...Array.from({ length: 32 }, (_, i) => i).filter(i => i !== 9 && i !== 10 && i !== 13),
];

function sanitizeJson(text: string): string {
  let result = text;
  for (const code of BAD_CHARS) {
    result = result.split(String.fromCodePoint(code)).join('');
  }
  return result;
}

type TimelineItem = { content: string; children?: TimelineItem[] };
type TimelineEntry = { label: string; sublabel?: string; items?: TimelineItem[] };
type ComplexTableCell = { content: string };

function extractTexts(section: any): string[] {
  const texts: string[] = [];
  if (section.type === 'image') return texts;

  if (section.type === 'timeline') {
    (section.entries ?? []).forEach((entry: TimelineEntry) => {
      texts.push(entry.label);
      if (entry.sublabel) texts.push(entry.sublabel);
      const walk = (items: TimelineItem[]) => {
        items.forEach(item => {
          texts.push(item.content);
          if (item.children) walk(item.children);
        });
      };
      if (entry.items) walk(entry.items);
    });
  } else if (section.type === 'complex-table') {
    (section.grid ?? []).flat().forEach((cell: ComplexTableCell) => texts.push(cell.content));
  } else if (typeof section.content === 'string') {
    texts.push(section.content);
  } else if (Array.isArray(section.content)) {
    section.content.forEach((item: any) => {
      texts.push(typeof item === 'string' ? item : item.content ?? '');
    });
  }
  if (section.headers) texts.push(...section.headers);
  if (section.rows) section.rows.flat().forEach((c: string) => texts.push(c));

  return texts.filter(Boolean);
}

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') ?? 'en';
  const term   = req.nextUrl.searchParams.get('q') ?? '';

  if (!term.trim()) return NextResponse.json({ matches: [] });

  try {
    const filePath = path.join(process.cwd(), 'data', locale, 'document.json');
    const raw      = fs.readFileSync(filePath, 'utf8');
    const all      = JSON.parse(sanitizeJson(raw)) as any[];

    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches: { id: string; preview: string }[] = [];

    all.forEach((section, i) => {
      const sectionId = `section-${i + 1}`;
      let occurrenceIndex = 0;

      extractTexts(section).forEach(text => {
        const regex = new RegExp(escapedTerm, 'gi');
        let m;
        while ((m = regex.exec(text)) !== null) {
          const start   = Math.max(0, m.index - 20);
          const end     = Math.min(text.length, m.index + term.length + 20);
          const preview = text.slice(start, end).replace(/\n/g, ' ');
          matches.push({ id: `${sectionId}::${occurrenceIndex++}`, preview });
        }
      });
    });

    return NextResponse.json({ matches });
  } catch {
    return NextResponse.json({ matches: [] });
  }
}