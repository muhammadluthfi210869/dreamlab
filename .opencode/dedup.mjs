import { readFileSync, writeFileSync } from 'fs';
let content = readFileSync('src/data/articles.ts', 'utf8');

const slug = 'dreamlab-kolaborasi-di-klik-fm-bongkar-strategi-bisnis-kosmetik';

// Find the LAST occurrence (the good one from final script)
const lastIdx = content.lastIndexOf(slug);
// Find the FIRST occurrence (the bad one from v2 script)
const firstIdx = content.indexOf(slug);

if (firstIdx === lastIdx) {
  console.log('Only one entry found - no duplicates');
  process.exit(0);
}

console.log('First occurrence at:', firstIdx);
console.log('Last occurrence at:', lastIdx);

// Remove the first entry
// Find its start: look for "  {\n" before the slug
const objStart = content.lastIndexOf('\n  {', firstIdx);
// Find the comma after its closing }
const objEnd = content.indexOf('\n  },\n', firstIdx);
if (objEnd === -1) {
  // Maybe it ends with \n  }\n (last entry)
  console.log('Trying alternative end');
}

// The entry before this one has a comma after its }, and our entry starts with "  {"
// After our entry ends with "  }," the next entry starts with "  {" or the array closes with "];"
// Find the comma that follows our entry's closing }
const afterComma = content.indexOf(',\n', firstIdx + 50);
const afterFirstEntry = content.indexOf('\n  },\n  {\n', objStart);
console.log('afterFirstEntry at:', afterFirstEntry);

if (afterFirstEntry > -1) {
  const removeStart = objStart;
  const removeEnd = afterFirstEntry + '\n  },\n'.length;
  content = content.substring(0, removeStart) + content.substring(removeEnd);
  console.log('Removed first entry');
} else {
  // It might be the last entry before ];
  const closeArray = content.indexOf('\n];', firstIdx);
  const beforeClose = content.lastIndexOf('\n  }', closeArray);
  console.log('Close array at:', closeArray, 'beforeClose at:', beforeClose);
  if (beforeClose > -1) {
    content = content.substring(0, objStart) + content.substring(closeArray);
    console.log('Removed last entry before ];');
  }
}

writeFileSync('src/data/articles.ts', content);
console.log('Done');
