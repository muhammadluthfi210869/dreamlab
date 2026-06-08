import fs from 'fs';
import path from 'path';

const articlesPath = path.join(process.cwd(), 'src', 'data', 'articles.ts');
const content = fs.readFileSync(articlesPath, 'utf-8');

console.log('🧹 Cleaning up complex image paths in articles.ts...');

// Pattern 1: WordPress Optimization paths (al_opt_content...)
// We want to extract just the final filename
const complexWPPattern = /(?:https:\/\/dreamlab\.id\/wp-content\/uploads\/|al_opt_content\/IMAGE\/dreamlab\.id\/wp-content\/uploads\/|wp-content\/uploads\/)(?:[^"'\\]+\/)*([^"'\\]+\.(?:webp|jpg|png|jpeg|gif|svg|png|webp))(?:\?[^"'\\]+)?/g;

let matchCount = 0;
const cleanedContent = content.replace(complexWPPattern, (match, fileName) => {
    matchCount++;
    return `/assets/images/blog/${fileName}`;
});

fs.writeFileSync(articlesPath, cleanedContent);
console.log(`✅ Cleaned up ${matchCount} image paths!`);
console.log('💡 Now all images point to: /assets/images/blog/[filename]');
