const fs = require('fs');
const c = fs.readFileSync('src/data/articles.ts', 'utf-8');
const articles = c.substring(c.indexOf('export const articles'));

const wpContentIdx = articles.indexOf('/wp-content');
if (wpContentIdx >= 0) {
  console.log('Found /wp-content at position:', wpContentIdx);
  console.log('Context:', articles.substring(Math.max(0, wpContentIdx - 80), wpContentIdx + 120));
} else {
  console.log('No /wp-content references found in articles.ts');
  
  // Check for image references
  const matches = articles.match(/featuredImage:\s*'([^']+)'/g);
  if (matches) {
    console.log('\nFeatured images referenced:', matches.length);
    console.log('First 5:', matches.slice(0, 5));
  }
  
  // Check content fields that have actual HTML
  const contentFields = articles.match(/"content":[^]+?slug/g);
  console.log('\nContent fields found:', contentFields ? contentFields.length : 0);
  
  // Look for any HTML in content
  const htmlMatches = articles.match(/<div[^>]*class="[^"]*elementor[^"]*"/g);
  console.log('Elementor divs found:', htmlMatches ? htmlMatches.length : 0);
  
  if (htmlMatches && htmlMatches.length > 0) {
    // Find around that elementor div
    const idx = articles.indexOf(htmlMatches[0]);
    console.log('\nContext around first elementor reference:');
    console.log(articles.substring(Math.max(0, idx - 200), idx + 300));
  }
}
