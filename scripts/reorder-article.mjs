import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/article-overrides.ts';
const src = readFileSync(filePath, 'utf8');

const marker = '/trend-aroma-parfum-disukai-market-2026';
const es = src.indexOf(marker);
const ck = src.indexOf('content: "', es);
const cs = src.indexOf('"<div', ck);
const ce = src.indexOf('",\n    faqs:', cs);
const raw = src.slice(cs, ce + 1);
const content = JSON.parse(raw);

// Split by H2
const parts = content.split(/(?=<h2\s)/i);

// 1. Change H2 #5 text
parts[5] = parts[5].replace(
  /<h2[^>]*>Kenapa Harus Dreamlab untuk Mengembangkan Aroma Ini<\/h2>/,
  '<h2 id="rubah-dari-ide-ke-eksekusi">Rubah dari Ide ke Eksekusi</h2>'
);

// 2. Extract FAQ (part 7) and CTA (part 8)
const faqPart = parts[7]; // Pertanyaan yang Sering Diajukan
const ctaPart = parts[8]; // Konsultasikan Konsep Aroma Parfum Brand Kamu

// 3. Reduce FAQ to 3 items
// Keep only: FAQ items 5, 11, and 12 (0-indexed: 4, 10, 11)
//   - Index 4: "Apa saja langkah membuat parfum brand sendiri?"
//   - Index 10: "Apakah konsultasi awal untuk konsep parfum ini berbayar?"
//   - Index 11: "Berapa biaya untuk membuat custom parfum di Dreamlab?"

const faqMatch = faqPart.match(/<h2[^>]*>[\s\S]*?<\/h2>/);
if (!faqMatch) throw new Error('No FAQ heading found');
const faqHeading = faqMatch[0];
const faqBody = faqPart.slice(faqMatch[0].length);

// Extract individual details elements
const detailsRegex = /<details[\s\S]*?<\/details>/g;
const allFaqs = faqBody.match(detailsRegex) || [];
console.log('Total FAQ items:', allFaqs.length);

// Keep only items at indices 4, 10, 11 (0-based)
// Index 4: "Apa saja langkah membuat parfum brand sendiri?"
// Index 10: "Apakah konsultasi awal untuk konsep parfum ini berbayar?"  
// Index 11: "Berapa biaya untuk membuat custom parfum di Dreamlab?"
const keptFaqs = [allFaqs[4], allFaqs[10], allFaqs[11]];
console.log('Kept FAQ:', keptFaqs.length);

const newFaqSection = faqHeading + '\n' + keptFaqs.join('\n');

// 4. Reorder: parts[7] = CTA, parts[8] = FAQ (swapped)
parts[7] = ctaPart;
parts[8] = newFaqSection;

// 5. Join back
const newContent = parts.join('');

// 6. Check: Konsultasikan section should now be before FAQ
const konsulIdx = newContent.indexOf('<h2 id="konsultasikan-konsep-aroma-parfum-brand-kamu"');
const faqSecIdx = newContent.indexOf('<h2 id="pertanyaan-yang-sering-diajukan"');
console.log('Konsultasi position:', konsulIdx);
console.log('FAQ position:', faqSecIdx);
console.log('FAQ after CTA?', faqSecIdx > konsulIdx);

// 7. Write back
const escaped = JSON.stringify(newContent);
const inner = escaped.slice(1, -1);
const newSrc = src.slice(0, cs) + '"' + inner + '"' + src.slice(ce + 1);
writeFileSync(filePath, newSrc, 'utf8');
console.log('Done!');
