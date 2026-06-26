import https from 'https';

const url = 'https://www.dreamlab.id/biaya-maklon-parfum-moq-kecil/';
console.time('fetch');
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.timeEnd('fetch');
    console.log('Total HTML size:', (d.length / 1024).toFixed(0) + 'KB');
    
    // Check scripts
    let scriptSize = 0;
    const scriptRe = /<script[\s\S]*?<\/script>/g;
    let m;
    while ((m = scriptRe.exec(d)) !== null) scriptSize += m[0].length;
    console.log('Script content:', (scriptSize / 1024).toFixed(0) + 'KB (' + ((scriptSize / d.length) * 100).toFixed(0) + '%)');
    
    // Check article content
    const CLASS = 'article-content legacy-content-wrapper entry-content';
    const start = d.indexOf(CLASS);
    if (start > 0) {
      const divStart = d.lastIndexOf('<div', start);
      let depth = 1;
      let pos = divStart + 5;
      while (depth > 0 && pos < d.length) {
        const openIdx = d.indexOf('<div', pos);
        const closeIdx = d.indexOf('</div>', pos);
        if (closeIdx === -1 || (openIdx !== -1 && openIdx < closeIdx)) {
          depth++; pos = openIdx + 5;
        } else {
          depth--; pos = closeIdx + 6;
        }
      }
      const articleHtml = d.substring(divStart, pos);
      const text = articleHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const words = text.split(/\s+/).length;
      console.log('Article content:', (articleHtml.length / 1024).toFixed(0) + 'KB, ' + words + ' words');
    }
    
    // Compare with before
    console.log('\n=== COMPARISON ===');
    console.log('Before: 3396 KB total, 3350 KB scripts (98.5%)');
    console.log('After:  ' + (d.length / 1024).toFixed(0) + ' KB total, ' + (scriptSize / 1024).toFixed(0) + ' KB scripts (' + ((scriptSize / d.length) * 100).toFixed(0) + '%)');
    console.log('Improvement: ' + ((1 - d.length / 3396000) * 100).toFixed(0) + '% smaller');
  });
});
