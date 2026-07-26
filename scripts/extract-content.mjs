import { readFileSync } from 'fs';

const src = readFileSync('src/data/articles.ts', 'utf8');

// KLi FM article
const marker = '/dreamlab-kolaborasi-di-klifm-bongkar-strategi-bisnis-kosmetik';
const idx = src.indexOf(marker);
const ck = src.indexOf('"content": "', idx);
const cs = ck + 11;
const ce = src.indexOf('",\n    "seo"', cs);
console.log('=== KLiFM Content ===');
console.log(src.substring(cs, ce));
console.log('=== END ===');

// Check for existing images in content
const content = src.substring(cs, ce);
const imgMatches = content.match(/<img[^>]*src="[^"]*"[^>]*>/g) || [];
console.log('\nImages found:', imgMatches.length);
imgMatches.forEach((m, i) => console.log(`  ${i+1}.`, m.substring(0, 150)));
