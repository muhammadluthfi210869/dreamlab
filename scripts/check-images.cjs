const fs = require('fs');
const c = fs.readFileSync('src/data/articles.ts', 'utf-8');
const articlesSection = c.substring(c.indexOf('export const articles'));

// Find image references in the article content
const imgSrcRefs = articlesSection.match(/src=\\"[^\\"]+\.[a-z]{3,4}\\"/g);
if (imgSrcRefs) {
  console.log('Image src references found:', imgSrcRefs.length);
  console.log('\nSample paths:');
  imgSrcRefs.slice(0, 20).forEach(s => console.log('  ' + s));
  
  // Categorize
  const assetImages = imgSrcRefs.filter(s => s.includes('/assets/images/'));
  const wpContent = imgSrcRefs.filter(s => s.includes('wp-content'));
  const other = imgSrcRefs.filter(s => !s.includes('/assets/images/') && !s.includes('wp-content'));
  console.log('\nCategory breakdown:');
  console.log('  /assets/images/:', assetImages.length);
  console.log('  wp-content:', wpContent.length);
  console.log('  Other:', other.length);
  
  // Extract filenames from /assets/images/ paths
  const filenames = assetImages.map(s => {
    const m = s.match(/\/([^\/]+)\.\w{3,4}/);
    return m ? m[0] : null;
  }).filter(Boolean);
  
  console.log('\nUnique assets/images paths:', new Set(filenames).size);
}

// Check for broken HTML patterns
const brokenImg = articlesSection.match(/<img[^>]*src=\\"[^\\"]*\\"[^>]*>/g);
console.log('\nFull <img> tags in content:', brokenImg ? brokenImg.length : 0);
if (brokenImg && brokenImg.length > 0) {
  console.log('Sample <img> tag:');
  console.log(brokenImg[0].substring(0, 200));
}
