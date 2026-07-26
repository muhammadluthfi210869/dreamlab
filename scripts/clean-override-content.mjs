import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/article-overrides.ts';
let src = readFileSync(filePath, 'utf8');

const marker = '/trend-aroma-parfum-disukai-market-2026';
const entryStart = src.indexOf(marker);
const contentKeyIdx = src.indexOf('content: "', entryStart);
const contentStart = src.indexOf('"<div', contentKeyIdx);
const contentEnd = src.indexOf('",\n    faqs:', contentStart);

// Extract raw escaped string (includes the opening + closing quote)
const rawFragment = src.slice(contentStart, contentEnd + 1);
// Parse it as JSON to get the actual string
const rawContent = JSON.parse(rawFragment);

function normalizeKey(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

// Split by H2 and dedupe within each section
const parts = rawContent.split(/(?=<h2\s)/i);

const deduped = parts.map((part, idx) => {
  if (idx === 0) {
    // Intro: dedupe paragraph blocks
    const blocks = part.split(/\n{2,}/).filter(b => b.trim());
    const seen = new Set();
    return blocks.filter(b => {
      const k = normalizeKey(b);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).join('\n\n');
  }

  // H2 sections
  const h2End = part.indexOf('</h2>');
  if (h2End === -1) return part;
  const heading = part.slice(0, h2End + 6);
  const body = part.slice(h2End + 6).trim();

  const blocks = body.split(/\n{2,}/).filter(b => b.trim());
  const seen = new Set();
  const unique = blocks.filter(b => {
    const k = normalizeKey(b);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  if (unique.length === blocks.length) return part;
  return heading + '\n\n' + unique.join('\n\n');
});

let cleaned = deduped.join('');

// Remove plain-text FAQ duplicate (after </details>)
const ld = cleaned.lastIndexOf('</details>');
if (ld !== -1) {
  const after = cleaned.slice(ld + '</details>'.length);
  const nh = after.indexOf('<h2');
  if (nh !== -1) {
    const plain = after.slice(0, nh);
    if (plain.includes('<p><strong>')) {
      cleaned = cleaned.slice(0, ld + '</details>'.length) + after.slice(nh);
    }
  }
}

// Fix Konsultasikan Konsep paragraph duplicate
const ki = cleaned.indexOf('<h2 id="konsultasikan-konsep-aroma-parfum-brand-kamu"');
if (ki !== -1) {
  const afterH2 = cleaned.slice(ki);
  const h2End = afterH2.indexOf('</h2>');
  if (h2End !== -1) {
    let body = afterH2.slice(h2End + 6).trimStart();
    if (body.startsWith('<p>Tahu tren aromanya adalah langkah awal')) {
      const firstP = body.slice(0, body.indexOf('</p>') + 4);
      body = body.slice(body.indexOf('</p>') + 4).trimStart();
      if (body.startsWith('<p>Tahu tren aromanya adalah langkah awal')) {
        body = body.slice(body.indexOf('</p>') + 4).trimStart();
        const cleanedSection = afterH2.slice(0, h2End + 6) + '\n\n' + firstP + '\n\n' + body;
        cleaned = cleaned.slice(0, ki) + cleanedSection;
      }
    }
  }
}

// Check for other duplicated H2 sections across the article
const h2Regex = /<h2[^>]*>[\s\S]*?<\/h2>/gi;
const matches = Array.from(cleaned.matchAll(h2Regex));
if (matches.length >= 2) {
  const seenSections = new Set();
  let result = cleaned.slice(0, matches[0].index);
  
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : cleaned.length;
    const section = cleaned.slice(start, end).trim();
    const key = normalizeKey(section);
    
    if (!seenSections.has(key)) {
      seenSections.add(key);
      result += section + '\n\n';
    }
  }
  
  cleaned = result.trimEnd();
}

// Now check the cleaned content has no duplicates
const checkLines = [
  'Salah pilih arah aroma',
  'Karena itu, sebelum masuk',
  'Gourmand adalah istilah di dunia parfum',
  'Kalau kamu ingin mengembangkan dua tren',
  'Tahu tren aromanya saja belum cukup',
  'Tahu dua tren aroma di atas cuma titik awal',
  'Tahu tren aromanya adalah langkah awal',
];

for (const line of checkLines) {
  const re = new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const count = (cleaned.match(re) || []).length;
  if (count > 1) console.log(`WARNING: "${line.slice(0, 40)}..." appears ${count}x`);
}

console.log('ORIGINAL bytes:', rawContent.length);
console.log('CLEANED bytes:', cleaned.length);

// Write back: JSON.stringify produces proper escaping
const escapedCleaned = JSON.stringify(cleaned);
// Remove the surrounding quotes from JSON.stringify
const innerCleaned = escapedCleaned.slice(1, -1);

const newSrc = src.slice(0, contentStart) + '"' + innerCleaned + '"' + src.slice(contentEnd + 1);
writeFileSync(filePath, newSrc, 'utf8');
console.log('Done!');
