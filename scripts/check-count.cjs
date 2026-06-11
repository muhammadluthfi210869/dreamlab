const fs = require('fs');
const content = fs.readFileSync('src/data/articles.ts', 'utf-8');
const slugRegex = /"slug":\s*"([^"]+)"/g;
const slugs = [];
let match;
while ((match = slugRegex.exec(content)) !== null) {
  slugs.push(match[1].replace(/^\/+|\/+$/g, ''));
}
console.log('Total articles in articles.ts:', slugs.length);

const csv = fs.readFileSync('src/data/seo-audit-export.csv', 'utf-8');
const csvLines = csv.trim().split('\n');
console.log('Total CSV data rows:', csvLines.length - 1);

const csvSlugs = new Set();
for (let i = 1; i < csvLines.length; i++) {
  const cols = csvLines[i].split(',');
  if (cols.length > 1) csvSlugs.add(cols[1].replace(/^\/+|\/+$/g, ''));
}

const missing = slugs.filter(s => !csvSlugs.has(s));
console.log('Articles missing from CSV:', missing.length);
console.log('Articles present in CSV:', slugs.length - missing.length);
console.log('');

console.log('=== MISSING SLUGS ===');
missing.forEach(s => console.log('/' + s));
