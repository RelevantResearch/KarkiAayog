// scripts/generate-toc-index.ts
import fs from 'fs';
import path from 'path';

const LOCALES = ['en', 'ne']; // add yours
const DATA_DIR = path.join(process.cwd(), 'public/data');

for (const locale of LOCALES) {
  const manifestPath = path.join(DATA_DIR, locale, 'document.manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  const headingTypes = new Set(['h1', 'h2', 'h3', 'h4']);
  const tocEntries: { id: string; type: string; content: string }[] = [];

  for (let i = 0; i < manifest.totalChunks; i++) {
    const chunkPath = path.join(DATA_DIR, locale, `document.chunk.${i}.json`);
    const sections = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
    const offset = i * manifest.chunkSize;

    sections.forEach((s: any, idx: number) => {
      if (!headingTypes.has(s.type)) return;
      if (!s.content || typeof s.content !== 'string') return;
      tocEntries.push({
        id: `section-${offset + idx + 1}`,
        type: s.type,
        content: s.content,
      });
    });
  }

  const outPath = path.join(DATA_DIR, locale, 'toc-index.json');
  fs.writeFileSync(outPath, JSON.stringify(tocEntries));
  console.log(`[${locale}] toc-index.json — ${tocEntries.length} headings`);
}