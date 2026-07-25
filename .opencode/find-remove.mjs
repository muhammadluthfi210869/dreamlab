import { readFileSync, writeFileSync } from 'fs';
const content = readFileSync('src/data/articles.ts', 'utf8');
const slug = 'dreamlab-kolaborasi-di-klik-fm-bongkar-strategi-bisnis-kosmetik';
const pos = content.indexOf(slug);
const block = content.substring(pos, pos + 12000);

// Find H2 #4
const target = 'dreamlab-adalah-partner-tepat-untuk-brand-anda';
const idx4 = block.indexOf(target);
console.log('Target at', idx4);

// Find the <h2 tag
const h2start = block.lastIndexOf('<h2', idx4);
console.log('H2 start at', h2start);

// Find next H2
const h2_5 = 'pertanyaan-yang-sering-diajukan';
const idx5 = block.indexOf(h2_5, idx4);
const h2_5start = block.lastIndexOf('<h2', idx5);
console.log('Next H2 at', h2_5start);

// Show the section to remove
const section = block.substring(h2start, h2_5start);
console.log('Section to remove:');
console.log(section.substring(0, 500) + '\n...\n' + section.substring(section.length - 500));
