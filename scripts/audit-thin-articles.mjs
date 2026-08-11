import fs from 'fs';

const raw = fs.readFileSync('src/data/articles.ts', 'utf-8');

// Find each article between { and } at top level
const articleMatches = [];
let depth = 0;
let currentStart = -1;

for (let i = 0; i < raw.length; i++) {
  const ch = raw[i];
  if (ch === '{') {
    if (depth === 0) currentStart = i;
    depth++;
  } else if (ch === '}') {
    depth--;
    if (depth === 0 && currentStart >= 0) {
      articleMatches.push(raw.substring(currentStart, i + 1));
      currentStart = -1;
    }
  }
}

console.log('Found', articleMatches.length, 'article blocks');
console.log('');

function extractField(json, field) {
  const regex = new RegExp('"' + field + '":\\s*"((?:[^"\\\\]|\\\\.)*)"');
  const m = json.match(regex);
  return m ? m[1] : '';
}

function extractArray(json, field) {
  const regex = new RegExp('"' + field + '":\\s*\\[(.*?)\\]');
  const m = json.match(regex);
  if (!m) return '';
  return m[1].replace(/"\s*,\s*"/g, ', ').replace(/"/g, '');
}

const articles = articleMatches.map(block => {
  const slug = extractField(block, 'slug');
  const title = extractField(block, 'title');
  const contentWithEscapes = extractField(block, 'content');
  // Unescape
  const content = contentWithEscapes.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n');
  const wordCount = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const seoTitle = extractField(block, 'title');
  const seoDesc = extractField(block, 'description');
  const cats = extractArray(block, 'categories');

  return { slug, title, wordCount, seoTitle, seoDesc, cats };
});

const valid = articles.filter(a => a.slug && a.slug !== '/');
valid.sort((a, b) => a.wordCount - b.wordCount);

console.log('=== STATS ===');
console.log('Total:', valid.length);
console.log('< 200:', valid.filter(a => a.wordCount < 200).length);
console.log('200-499:', valid.filter(a => a.wordCount >= 200 && a.wordCount <= 499).length);
console.log('500-999:', valid.filter(a => a.wordCount >= 500 && a.wordCount <= 999).length);
console.log('>= 1000:', valid.filter(a => a.wordCount >= 1000).length);

console.log('');
console.log('=== < 200 KATA ===');
valid.filter(a => a.wordCount < 200).forEach(a => {
  console.log('[' + a.wordCount + '] ' + a.title + ' => /' + a.slug + '/');
});

console.log('');
console.log('=== 200-499 KATA ===');
valid.filter(a => a.wordCount >= 200 && a.wordCount <= 499).forEach(a => {
  console.log('');
  console.log('[' + a.wordCount + ' kata] ' + a.title);
  console.log('  URL: /' + a.slug + '/');
  console.log('  SEO: ' + (a.seoTitle ? a.seoTitle.substring(0, 80) : '(default)'));
  console.log('  Cat: ' + a.cats);
});
