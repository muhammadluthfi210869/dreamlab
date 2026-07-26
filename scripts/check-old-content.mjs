import { execSync } from 'child_process';
const content = execSync('git show 64729ef:src/data/articles.ts', { encoding: 'utf8' });
const slug = '/trend-aroma-parfum-disukai-market-2026';
const idx = content.indexOf(slug);
const start = content.lastIndexOf('{', idx);
const end = content.indexOf('},', idx) + 2;
const entry = content.substring(start, end);
const h2s = entry.match(/<h2[^>]*>[\s\S]*?<\/h2>/g) || [];
console.log('H2 count:', h2s.length);
h2s.forEach((h,i) => console.log('  '+(i+1)+':', h.replace(/<[^>]*>/g,'').trim()));
// Check specific paragraphs
const checks = [
  'Ada dua aroma yang paling disukai',
  'Salah pilih arah aroma bisa bikin brand',
  'Gourmand adalah istilah',
  'Kombinasi base notes yang tepat',
  'Tahu tren aromanya saja belum cukup',
  'Konsultasikan Konsep Aroma Parfum'
];
for (const p of checks) {
  const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escaped, 'g');
  const m = content.match(re);
  if (m) console.log(p + ': ' + m.length + 'x');
}
