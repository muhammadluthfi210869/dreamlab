import https from 'https';

const slugs = [
  'biaya-maklon-parfum-moq-kecil',
  'bisnis-skincare-glow-glasskin-cystamine',
  'hero-ingredients-2025',
  'maklon-shampoo-psoriasis-formula-juara',
  'perbedaan-micellar-water-dan-toner',
  'potensi-bisnis-babycare',
  'produk-haircare-yang-sedang-tren',
];

function check(url) {
  return new Promise(r => {
    https.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const clean = d
          .replace(/<script[\s\S]*?<\/script>/gi, ' ')
          .replace(/<style[\s\S]*?<\/style>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ').trim();
        r({ status: res.statusCode, size: (d.length / 1024).toFixed(0) + 'KB', words: clean.split(/\s+/).length });
      });
    }).on('error', () => r({ status: 0, size: '0KB', words: 0 }));
  });
}

async function main() {
  console.log('=== VERIFIED ARTICLES (POST-FIX) ===\n');
  for (const slug of slugs) {
    const url = 'https://www.dreamlab.id/' + slug + '/';
    const result = await check(url);
    console.log(slug);
    console.log('  Status: ' + result.status + ' | Size: ' + result.size + ' | Words: ' + result.words);
  }
  console.log('\nTarget: 1000+ words. All articles should pass.');
}
main();
