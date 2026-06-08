import fs from 'fs';
import path from 'path';

const content = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'articles.ts'), 'utf-8');

// Find all wp-content references in article content
const matches = content.match(/dreamlab\.id\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"'\\]+\.(?:webp|png|jpg|jpeg|svg|gif)/gi) || [];

console.log('wp-content URLs found in articles:', matches.length);

// Extract unique filenames
const filenames = new Set(matches.map(m => m.split('/').pop()).filter(Boolean));
console.log('Unique filenames needed:', filenames.size);

// Check what's in public/assets/images
const assetsDir = 'public/assets/images';
if (!fs.existsSync(assetsDir)) {
  console.log('\nERROR: public/assets/images/ does not exist!');
  process.exit(1);
}

const existingFiles = fs.readdirSync(assetsDir);
console.log('Files in public/assets/images:', existingFiles.length);

// Find missing
const missing = [];
for (const f of filenames) {
  if (!existingFiles.includes(f) && !existingFiles.some(e => e.toLowerCase() === f.toLowerCase())) {
    missing.push(f);
  }
}

console.log('\nMissing files:', missing.length);
if (missing.length > 0) {
  console.log('Sample missing (first 20):');
  missing.slice(0, 20).forEach(f => console.log('  - ' + f));
  
  // Check if they exist with different extension
  console.log('\nChecking alternative extensions...');
  const extMap = {};
  for (const f of missing) {
    const base = f.replace(/\.\w+$/, '');
    const found = existingFiles.filter(e => e.startsWith(base));
    if (found.length > 0) {
      extMap[f] = found;
    }
  }
  if (Object.keys(extMap).length > 0) {
    console.log('Found with different extension:');
    for (const [orig, alts] of Object.entries(extMap)) {
      console.log(`  ${orig} -> ${alts.join(', ')}`);
    }
  }
}

console.log('\n=== Article count ===');
const articleMatches = content.match(/slug:/g);
console.log('Total articles:', articleMatches ? articleMatches.length : 0);
