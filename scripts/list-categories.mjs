import { readFileSync } from 'fs';

const src = readFileSync('src/data/articles.ts', 'utf8');
const cats = new Set();
const re = /"categories":\s*\[([^\]]+)\]/g;
let m;
while ((m = re.exec(src)) !== null) {
  const items = m[1].split(',').map(s => s.trim().replace(/"/g, ''));
  items.forEach(i => cats.add(i));
}
console.log('All categories:', [...cats].sort());
