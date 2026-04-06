const fs = require('fs');

const filePath = '/home/apocalypse/Freelance/KarkiAayog/data/en/document.json';
let text = fs.readFileSync(filePath, 'utf8');
const originalLength = text.length;

// 1. Remove all invisible/problematic Unicode characters
const badChars = [
  0x200C, 0x200B, 0x200D, 0xFEFF, 0x00AD,
  0x200E, 0x200F, 0x2028, 0x2029, 0x0000,
  0x0001, 0x0002, 0x0003, 0x0004, 0x0005,
  0x0006, 0x0007, 0x0008, 0x000B, 0x000C,
  0x000E, 0x000F, 0x0010, 0x0011, 0x0012,
  0x0013, 0x0014, 0x0015, 0x0016, 0x0017,
  0x0018, 0x0019, 0x001A, 0x001B, 0x001C,
  0x001D, 0x001E, 0x001F,
];

badChars.forEach(code => {
  const char = String.fromCodePoint(code);
  const before = text.length;
  text = text.split(char).join('');
  const removed = before - text.length;
  if (removed > 0) {
    console.log(`Removed ${removed} × U+${code.toString(16).toUpperCase().padStart(4,'0')}`);
  }
});

// 2. Validate  if still broken, find the exact character at the error position
try {
  JSON.parse(text);
  console.log('✅ JSON is valid after cleanup!');
  fs.writeFileSync(filePath, text, 'utf8');
  console.log(`Saved. Removed ${originalLength - text.length} chars total.`);
} catch (e) {
  console.error('❌ Still invalid:', e.message);

  // Extract position from error message
  const match = e.message.match(/position (\d+)/);
  if (match) {
    const pos = parseInt(match[1]);
    const start = Math.max(0, pos - 100);
    const end = Math.min(text.length, pos + 100);
    const snippet = text.slice(start, end);

    console.log('\n--- Context around error ---');
    console.log(JSON.stringify(snippet));

    console.log('\n--- Character codes at/near position ---');
    for (let i = Math.max(0, pos - 5); i < Math.min(text.length, pos + 5); i++) {
      const code = text.charCodeAt(i);
      const char = text[i];
      const printable = code >= 32 && code < 127 ? char : '?';
      console.log(`  pos ${i}: U+${code.toString(16).toUpperCase().padStart(4,'0')} '${printable}'`);
    }
  }

  // Save anyway so you can inspect
  fs.writeFileSync(filePath, text, 'utf8');
}