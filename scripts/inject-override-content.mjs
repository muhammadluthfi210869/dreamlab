import { readFileSync, writeFileSync } from 'fs';

const contentStr = readFileSync('/Users/revitayustianawati/dreamlab/scripts/trend-parfum-content-string.txt', 'utf8');
const filePath = '/Users/revitayustianawati/dreamlab/src/lib/article-overrides.ts';

let source = readFileSync(filePath, 'utf8');

// Find the placeholder pattern
const placeholder = `content: [].join('')`;
const marker = `'/trend-aroma-parfum-disukai-market-2026': {`;

const markerPos = source.indexOf(marker);
if (markerPos === -1) {
  console.error('Marker not found!');
  process.exit(1);
}

const placeholderPos = source.indexOf(placeholder, markerPos);
if (placeholderPos === -1) {
  console.error('Placeholder not found!');
  process.exit(1);
}

// Build the new content string
// Use the JSON-escaped string directly (it's already properly escaped for double-quoted JS strings)
const newContent = `content: ${contentStr}`;

source = source.substring(0, placeholderPos) + newContent + source.substring(placeholderPos + placeholder.length);

writeFileSync(filePath, source);
console.log('Injected content successfully!');
console.log('New file size:', source.length, 'bytes');
