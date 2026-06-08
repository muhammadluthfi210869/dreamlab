// Find where WordPress 301 redirects point
// Run: node scripts/check-301-destinations.cjs

const OLD_URLS = [
  '/tips-sukses-bisnis-parfum',
  '/maklon-scalp-haircare-bisnis-produk-rambut-sehat',
  '/tren-parfum-arab-bisnis-maklon-dreamlab',
  '/maklon-skincare-untuk-brand-baru',
  '/prediksi-tren-2026',
  '/pabrik-parfum-makasar',
  '/cara-bisnis-skincare-dari-nol',
  '/pabrik-parfum-surabaya-biaya-2026',
  '/maklon-parfum-bpom-indonesia-strategi-bisnis',
  '/maklon-kosmetik-parfum-tangerang',
  '/maklon-kosmetik-jakarta-dreamlab-2026',
  '/maklon-skincare-surabaya-umkm',
  '/jasa-maklon-sabun-mandi-batang',
  '/bahan-aktif-untuk-mengatasi-jerawat',
  '/maklon-parfum-jakarta',
  '/rahasia-maklon-parfum-jakarta',
];

const BASE = 'https://dreamlab.id';

async function main() {
  console.log('=== WordPress 301 Redirect Check ===\n');
  
  const results = [];
  
  for (const path of OLD_URLS) {
    const url = BASE + path;
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'manual',
        signal: AbortSignal.timeout(10000),
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      
      const status = response.status;
      const location = response.headers.get('location');
      
      console.log(`${path}`);
      console.log(`  Status: ${status}`);
      if (location) {
        const cleanLocation = location.replace(BASE, '');
        console.log(`  → ${cleanLocation}`);
        results.push({ source: path, destination: cleanLocation, status });
      } else {
        console.log(`  → (no location header)`);
      }
      console.log('');
    } catch (err) {
      console.log(`${path}: ERROR - ${err.message}\n`);
    }
  }

  // Generate next.config.ts redirect entries
  console.log('=== Generated redirect entries ===');
  for (const r of results) {
    if (r.destination && r.destination !== r.source) {
      console.log(`redirects.push({ source: '${r.source}', destination: '${r.destination}', permanent: true });`);
    }
  }
}

main().catch(console.error);
