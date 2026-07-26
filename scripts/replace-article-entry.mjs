import { readFileSync, writeFileSync } from 'fs';

const newEntry = JSON.parse(
  readFileSync('/Users/revitayustianawati/dreamlab/scripts/trend-parfum-output.json', 'utf8')
);
const content = readFileSync('/Users/revitayustianawati/dreamlab/src/data/articles.ts', 'utf8');

function buildEntry(entry) {
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
    `    "content": ${JSON.stringify(entry.content)},`,
    '    "seo": {',
    `      "title": ${JSON.stringify(entry.seo.title)},`,
    `      "description": ${JSON.stringify(entry.seo.description)}`,
    '    }',
    '  }',
  ];
  return lines.join('\n');
}

const slug = '/trend-aroma-parfum-disukai-market-2026';
const slugLine = `"slug": "${slug}"`;

// Find byte position of the slug line
const slugPos = content.indexOf(slugLine);
if (slugPos === -1) {
  console.error(`Could not find slug "${slug}"`);
  process.exit(1);
}

// Find entry start: go backward from slugPos looking for '\n  {\n'
const beforeSlug = content.substring(0, slugPos);
const entryStartMarker = '\n  {\n';
const entryStartPos = beforeSlug.lastIndexOf(entryStartMarker);
if (entryStartPos === -1) {
  console.error('Could not find entry start marker');
  process.exit(1);
}
// The entry start is after the '  {' (the position of '{')
const entryStart = beforeSlug.indexOf('{', entryStartPos);

// Find entry end: go forward from slugPos looking for pattern '\n  },\n  {' or '\n  }\n];\n' or '\n  }\n]'
// We need to be careful not to match brace inside string literals
// Strategy: find '\n  }' after the slug, then check if next non-empty char is ',' or ']'
const afterSlug = content.substring(slugPos + slugLine.length);

// Find the closing of the entire entry - look for the pattern of entry separator
// The entry ends with '  },' (not last) or '  }' (last)
const entryEndMarkers = ['\n  },\n', '\n  }\n'];
let entryEndPos = -1;

for (const marker of entryEndMarkers) {
  const pos = afterSlug.indexOf(marker);
  if (pos !== -1) {
    entryEndPos = slugPos + slugLine.length + pos + marker.length - 1;
    // Verify: the content before entryEndPos should have the "content" field ending properly
    break;
  }
}

if (entryEndPos === -1) {
  console.error('Could not find entry end');
  process.exit(1);
}

console.log(`Entry found at byte positions: ${entryStart} to ${entryEndPos}`);
const entryText = content.substring(entryStart, entryEndPos);
console.log(`Entry starts with: ${JSON.stringify(entryText.substring(0, 50))}`);
console.log(`Entry ends with: ${JSON.stringify(entryText.substring(entryText.length - 30))}`);

// Build the new entry, check if it needs a trailing comma
const charAfter = content[entryEndPos];
const needsComma = charAfter === ',';
const finalEntryStr = buildEntry(newEntry) + (needsComma ? ',' : '');

const newContent = content.substring(0, entryStart) + finalEntryStr + content.substring(entryEndPos + (needsComma ? 1 : 0));
writeFileSync('/Users/revitayustianawati/dreamlab/src/data/articles.ts', newContent);
console.log('Replacement successful!');
