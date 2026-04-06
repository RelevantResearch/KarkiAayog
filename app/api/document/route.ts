// app/api/document/route.ts
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

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') ?? 'en';
  const page   = parseInt(req.nextUrl.searchParams.get('page')  ?? '0', 10);
  const size   = parseInt(req.nextUrl.searchParams.get('size')  ?? '100', 10);

  try {
    const filePath = path.join(process.cwd(), 'data', locale, 'document.json');
    const raw   = fs.readFileSync(filePath, 'utf8');
    const clean = sanitizeJson(raw);
    const all = JSON.parse(clean) as unknown[];

    const start = page * size;
    const items = all.slice(start, start + size);

    return NextResponse.json({
      items,
      total:   all.length,
      hasMore: start + size < all.length,
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}