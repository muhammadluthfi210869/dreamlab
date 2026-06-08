const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../src/data/products-v2');
const files = fs.readdirSync(dirPath);

files.forEach(file => {
  if (file.endsWith('.ts') && file !== 'index.ts') {
    const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
    const matches = [...content.matchAll(/id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"]/g)];
    if (matches.length > 0) {
      console.log(`\nCategory: ${file}`);
      matches.forEach(m => {
        console.log(`  - ID/Slug: ${m[1]} | Name: ${m[2]}`);
      });
    }
  }
});
