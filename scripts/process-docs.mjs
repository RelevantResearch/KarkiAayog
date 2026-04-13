/**
 * process-docs.mjs
 *
 * Pre-processes large document JSON files into:
 *   1. Chunked files:      /public/data/{locale}/document.chunk.{n}.json
 *   2. Search index:       /public/data/{locale}/search-index.json
 *   3. Manifest:           /public/data/{locale}/document.manifest.json
 *
 * Usage:
 *   node scripts/process-docs.mjs
 *   bun scripts/process-docs.mjs
 *
 * Config (edit below):
 *   LOCALES         your locale codes
 *   SOURCE_DIR      where your current JSON files live
 *   OUTPUT_DIR      where chunked files should go (must be under /public for static export)
 *   CHUNK_SIZE      sections per chunk (50 is a good default)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Config ────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = '/var/www/Freelance/KarkiAayog';          // project root

const LOCALES    = ['en', 'ne'];                  // ← add/remove locales here
const SOURCE_DIR = join(ROOT, 'data');            // ← where document.json lives now
const OUTPUT_DIR = join(ROOT, 'public', 'data');  // ← must be under /public
const CHUNK_SIZE = 50;                            // sections per chunk

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractText(section) {
  const texts = [];
  const push = (v) => {
    if (typeof v === 'string' && v.trim()) texts.push(v.trim());
  };

  const { type, content, headers, rows, grid, entries } = section;

  if (type === 'image') return texts;

  if (type === 'timeline') {
    (entries ?? []).forEach((entry) => {
      push(entry.label);
      if (entry.sublabel) push(entry.sublabel);
      const walkItems = (items) => {
        (items ?? []).forEach((item) => {
          push(item.content);
          if (item.children) walkItems(item.children);
        });
      };
      walkItems(entry.items);
    });
    return texts;
  }

  if (type === 'complex-table') {
    (grid ?? []).flat().forEach((cell) => push(cell.content));
    return texts;
  }

  if (type === 'table') {
    (headers ?? []).forEach(push);
    (rows ?? []).flat().forEach(push);
    return texts;
  }

  if (typeof content === 'string') {
    push(content);
  } else if (Array.isArray(content)) {
    content.forEach((item) => {
      if (typeof item === 'string') push(item);
      else if (item && typeof item === 'object' && 'content' in item) push(item.content);
    });
  }

  return texts;
}

function buildIndexEntry(section, sectionId) {
  const texts = extractText(section);
  if (!texts.length) return null;

  const fullText = texts.join(' ');
  const preview = fullText.length > 120
    ? fullText.slice(0, 120).trimEnd() + '…'
    : fullText;

  return {
    id: sectionId,
    type: section.type,
    text: fullText,
    tokens: [...new Set(fullText.toLowerCase().split(/\s+/).filter(Boolean))],
    preview,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

let totalChunks = 0;
let totalIndexEntries = 0;

for (const locale of LOCALES) {
  const sourceFile = join(SOURCE_DIR, locale, 'document.json');

  if (!existsSync(sourceFile)) {
    console.warn(`⚠  Skipping ${locale}: ${sourceFile} not found`);
    continue;
  }

  console.log(`\n📂 Processing locale: ${locale}`);

  const raw = readFileSync(sourceFile, 'utf-8');
  const sections = JSON.parse(raw);

  if (!Array.isArray(sections)) {
    console.error(`✗  ${locale}/document.json must export a JSON array`);
    continue;
  }

  console.log(`   ${sections.length} sections found`);

  const outDir = join(OUTPUT_DIR, locale);
  mkdirSync(outDir, { recursive: true });

  // 1. Chunk the sections
  const chunks = [];
  for (let i = 0; i < sections.length; i += CHUNK_SIZE) {
    chunks.push(sections.slice(i, i + CHUNK_SIZE));
  }

  chunks.forEach((chunk, chunkIndex) => {
    const chunkFile = join(outDir, `document.chunk.${chunkIndex}.json`);
    writeFileSync(chunkFile, JSON.stringify(chunk), 'utf-8');
    console.log(`   ✓  chunk ${chunkIndex}: ${chunk.length} sections → document.chunk.${chunkIndex}.json`);
  });

  totalChunks += chunks.length;

  // 2. Write manifest
  const manifest = {
    totalSections: sections.length,
    chunkSize: CHUNK_SIZE,
    totalChunks: chunks.length,
    chunks: chunks.map((c, i) => ({ index: i, count: c.length })),
  };

  writeFileSync(
    join(outDir, 'document.manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );
  console.log(`   ✓  manifest: ${chunks.length} chunks, ${sections.length} total sections`);

  // 3. Build search index
  const searchIndex = sections
    .map((section, i) => buildIndexEntry(section, `section-${i + 1}`))
    .filter(Boolean);

  writeFileSync(
    join(outDir, 'search-index.json'),
    JSON.stringify(searchIndex),
    'utf-8'
  );

  totalIndexEntries += searchIndex.length;
  console.log(`   ✓  search-index: ${searchIndex.length} entries`);
}

console.log(`\n✅ Done. ${totalChunks} chunks, ${totalIndexEntries} index entries across ${LOCALES.length} locale(s).`);
console.log(`   Add this to your package.json scripts:`);
console.log(`   "prebuild": "node scripts/process-docs.mjs"\n`);