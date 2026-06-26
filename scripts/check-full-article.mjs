import https from 'https';

const url = 'https://www.dreamlab.id/biaya-maklon-parfum-moq-kecil/';
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // Find article content div by class
    const CLASS = 'article-content legacy-content-wrapper entry-content';
    const start = d.indexOf(CLASS);
    if (start > 0) {
      // Find associated div after this class
      const divStart = d.lastIndexOf('<div', start);
      if (divStart >= 0) {
        // Count tags to find matching closing div
        let depth = 1;
        let pos = divStart + 5; // skip <div
        while (depth > 0 && pos < d.length) {
          const openIdx = d.indexOf('<div', pos);
          const closeIdx = d.indexOf('</div>', pos);
          if (closeIdx === -1 || (openIdx !== -1 && openIdx < closeIdx)) {
            depth++;
            pos = openIdx + 5;
          } else {
            depth--;
            pos = closeIdx + 6;
          }
        }
        const divContent = d.substring(divStart, pos);
        const text = divContent.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        const words = text.split(/\s+/).filter(w => w.length > 0);
        console.log('Article div total size:', (divContent.length / 1024).toFixed(0) + 'KB');
        console.log('Article word count:', words.length);
        console.log('First 200 chars:', text.substring(0, 200));
        console.log('Last 200 chars:', text.substring(text.length - 200));
      }
    }
  });
});
