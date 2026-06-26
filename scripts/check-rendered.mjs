import https from 'https';

const url = 'https://www.dreamlab.id/biaya-maklon-parfum-moq-kecil/';
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const checks = [
      'Industri wewangian',
      'margin keuntungan',
      'maklon parfum',
      'container',
    ];
    for (const c of checks) {
      const idx = d.indexOf(c);
      if (idx >= 0) {
        console.log('FOUND:', c);
        console.log('Context:', d.substring(Math.max(0, idx - 30), idx + 80));
      } else {
        console.log('NOT FOUND:', c);
      }
      console.log('---');
    }

    // Count instances
    let count = 0;
    let pos = 0;
    while ((pos = d.indexOf('article-content', pos)) !== -1) {
      count++;
      pos += 1;
    }
    console.log('article-content count:', count);

    // Check if content is inside a JS string/script
    const ndIdx = d.indexOf('Industri wewangian');
    if (ndIdx >= 0) {
      const context = d.substring(Math.max(0, ndIdx - 200), ndIdx + 200);
      console.log('\nFull context around article text:');
      console.log(context);
    }
  });
});
