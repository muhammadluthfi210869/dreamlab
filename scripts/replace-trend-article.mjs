import { readFileSync, writeFileSync } from 'fs';

// Read the generated JSON
const newEntry = JSON.parse(readFileSync('/Users/revitayustianawati/dreamlab/scripts/trend-parfum-output.json', 'utf8'));

// Read articles.ts
const content = readFileSync('/Users/revitayustianawati/dreamlab/src/data/articles.ts', 'utf8');

// Find the existing entry for this slug
const slug = '/trend-aroma-parfum-disukai-market-2026';
const slugPattern = `"slug": "${slug}"`;

// Find the line containing this slug
const lines = content.split('\n');
let startLine = -1;
let endLine = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes(slugPattern)) {
    // Find the start of this entry (previous `{`)
    for (let j = i; j >= 0; j--) {
      if (lines[j].trim() === '{' || lines[j].trim().startsWith('{')) {
        startLine = j;
        break;
      }
    }
    // Find the end of this entry (closing `},` or `}`)
    for (let j = i; j < lines.length; j++) {
      if (lines[j].trim() === '},' || lines[j].trim() === '}' || lines[j].trim() === '},' || lines[j].trim() === '},') {
        endLine = j;
        break;
      }
    }
    break;
  }
}

if (startLine === -1 || endLine === -1) {
  console.error(`Could not find entry for slug "${slug}"`);
  process.exit(1);
}

console.log(`Found entry at lines ${startLine + 1}-${endLine + 1}`);

// Build new entry string with proper formatting  
function buildEntryString(entry) {
  const contentJson = JSON.stringify(entry.content);
  const lines = [
    '  {',
    `    "slug": ${JSON.stringify(entry.slug)},`,
    `    "title": ${JSON.stringify(entry.title)},`,
    `    "publishDate": ${JSON.stringify(entry.publishDate)},`,
    `    "author": ${JSON.stringify(entry.author)},`,
    `    "categories": ${JSON.stringify(entry.categories)},`,
    `    "tags": ${JSON.stringify(entry.tags)},`,
    `    "featuredImage": ${JSON.stringify(entry.featuredImage)},`,
    `    "excerpt": ${JSON.stringify(entry.excerpt)},`,
    `    "content": ${contentJson},`,
    '    "seo": {',
    `      "title": ${JSON.stringify(entry.seo.title)},`,
    `      "description": ${JSON.stringify(entry.seo.description)}`,
    '    }',
    '  }',
  ];
  return lines.join('\n');
}

const newEntryStr = buildEntryString(newEntry);

const newContent = content.substring(0, content.indexOf(lines[startLine])) + newEntryStr + content.substring(content.indexOf(lines[endLine]) + lines[endLine].length);

writeFileSync('/Users/revitayustianawati/dreamlab/src/data/articles.ts', newContent);
console.log('Replaced article entry successfully!');
