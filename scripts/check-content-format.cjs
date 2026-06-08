const fs = require('fs');
const c = fs.readFileSync('src/data/articles.ts', 'utf-8');
const articlesSection = c.substring(c.indexOf('export const articles'));

// Check if content uses backticks or quotes
const hasBacktick = articlesSection.includes('content:`');
const hasQuote = articlesSection.includes('"content": "');
console.log('Content format:');
console.log('  Backtick template literals:', hasBacktick);
console.log('  Double quotes:', hasQuote);

// Find a non-empty content
// The articles use double quotes with escaped characters
const contentStart = articlesSection.indexOf('"content": "');
if (contentStart >= 0) {
  const snippet = articlesSection.substring(contentStart, contentStart + 300);
  console.log('\nContent field sample:');
  console.log(snippet);
}

// Search all content fields that contain Elementor HTML
const elementorCount = (articlesSection.match(/elementor/g) || []).length;
console.log('\nElementor references in articles:', elementorCount);

// Search for wp-content references in the raw text
const wpContentCount = (articlesSection.match(/wp-content/g) || []).length;
const dreamlabWpCount = (articlesSection.match(/dreamlab\.id\\\/wp-content/g) || []).length;
console.log('wp-content references:', wpContentCount);
console.log('Escaped dreamlab.id/wp-content:', dreamlabWpCount);

// Check for escaped slashes
const escapedWp = (articlesSection.match(/dreamlab\\.id\\\/wp-content/g) || []).length;
const doubleEscapedWp = (articlesSection.match(/dreamlab\\\.id\\\/wp-content/g) || []).length;
console.log('Double-escaped dreamlab.id/wp-content:', escapedWp, doubleEscapedWp);

// Find what the actual stored path format is
const slashes = articlesSection.match(/content.*?slug/g);
if (slashes) {
  const sample = slashes.find(s => s.length > 100);
  if (sample) console.log('\nContent with HTML sample:', sample.substring(0, 300));
}
