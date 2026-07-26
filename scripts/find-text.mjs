import { readFileSync } from 'fs';

const src = readFileSync('src/data/articles.ts', 'utf8');
const marker = '/peluang-bisnis-deodorant-ditrend-sport';
const idx = src.indexOf(marker);
const ck = src.indexOf('"content": "', idx);
const cs = ck + 11;
const ce = src.indexOf('",\n    "seo"', cs);
const content = src.substring(cs, ce);

// Find "Deodorant yang dulu dianggap"
const target = content.indexOf('Deodorant yang dulu dianggap');
if (target >= 0) {
  const from = Math.max(0, target - 10);
  const to = Math.min(content.length, target + 150);
  console.log('=== CONTEXT ===');
  console.log(content.substring(from, to));
  console.log('=== RAW ===');
  console.log(JSON.stringify(content.substring(from, to)));
}
