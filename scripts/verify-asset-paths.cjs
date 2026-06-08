const fs = require('fs');
const c = fs.readFileSync('src/data/articles.ts', 'utf-8');

// Find unique bv-data-src paths
const pattern = /bv-data-src=\\"(.*?)\\"/g;
const paths = new Set();
let match;
while ((match = pattern.exec(c)) !== null) {
  paths.add(match[1]);
}
console.log('Unique bv-data-src paths:', paths.size);
const pathsArr = Array.from(paths);
pathsArr.slice(0, 5).forEach(p => console.log('  ' + p));

// Check if these files exist
const blogDir = 'public/assets/images/blog';
const files = fs.readdirSync(blogDir);
const missing = [];
for (const p of pathsArr) {
  const filename = p.split('/').pop();
  if (!files.includes(filename) && !files.some(f => f.toLowerCase() === filename.toLowerCase())) {
    missing.push(p);
  }
}
console.log('\nMissing blog images:', missing.length);
missing.slice(0, 20).forEach(m => console.log('  ' + m));

// Same for top-level images
const pattern2 = /bv-data-src=\\"\/assets\/images\/([^\\"]+)\\"/g;
const topPaths = new Set();
let match2;
while ((match2 = pattern2.exec(c)) !== null) {
  topPaths.add(match2[1]);
}
console.log('\nTop-level /assets/images/ paths:', topPaths.size);
Array.from(topPaths).slice(0, 5).forEach(p => console.log('  ' + p));

// Check top-level images
const assetsDir = 'public/assets/images';
const topFiles = fs.readdirSync(assetsDir).filter(f => !fs.statSync(assetsDir + '/' + f).isDirectory());
const topMissing = [];
for (const p of topPaths) {
  if (!topFiles.includes(p) && !topFiles.some(f => f.toLowerCase() === p.toLowerCase())) {
    topMissing.push(p);
  }
}
console.log('Missing top images:', topMissing.length);

console.log('\nTotal images in /assets/images/blog:', files.length);
