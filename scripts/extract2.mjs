import { readFileSync } from 'fs';

// Deodorant article
const src = readFileSync('src/data/articles.ts', 'utf8');
const marker = '/peluang-bisnis-deodorant-ditrend-sport';
const idx = src.indexOf(marker);
const ck = src.indexOf('"content": "', idx);
const cs = ck + 11;
const ce = src.indexOf('",\n    "seo"', cs);
const content = src.substring(cs, ce);
console.log('=== DEODORANT FULL CONTENT ===');
console.log(JSON.parse(`"${content}"`));
