import https from 'https';
import http from 'http';

const SITE = 'https://www.dreamlab.id';

const URLS_TO_CHECK = [
  '/academy-beautypreneur/',
  '/panduan-maklon-deodorant-bpom/',
  '/jadwalkanvisitmeeting.php',
  '/thankyoupage-google/',
  '/contact-form-dreamlab/',
  '/cms_block_cat/pop-up-form/',
  '/e-floating-buttons/popup-website/',
  '/https-dreamlab-id-dreamlab-visit-ici-2026/',
  '/maklon-kosmetik-terbaik-english/',
  '/academy-beautypreneur/',
  '/author/admin/',
  '/author/admin/page/5/',
  '/author/admin/page/8/',
  '/author/admin/page/9/',
  '/affiliate-kol-brand-skincare/',
  '/atur-kosmetik-halal-dreamlab/',
  '/biaya-maklon-parfum-moq-kecil/',
  '/berapa-moq-maklon-skincare-di-dreamlab-ini-fakta-penting-untuk-pebisnis-pemula/',
  '/cara-hitunghpp-produk-kosmeti/',
  '/cara-membuat-hb-dosting-sendiri/',
  '/cara-meracik-handbody-pemutih-alami/',
  '/contoh-kalimat-iklan-kosmetik-unik/',
  '/kosmetik-olahraga/',
  '/maklon-body-whitening-formula-juara/',
  '/maklon-hairmist/',
  '/maklon-parfum-anak-custom-aroma/',
  '/parfum-inspired-peluang-bisnis/',
  '/rekomendasi-sunscreen-lokal/',
  '/state-of-beauty-2025-tren-kecantikan-pertumbuhan-industri-kosmetik-perubahan-pasar/',
  '/tren-aroma-parfum-2026-terbaru/',
  '/maklon-parfum-makassar/',
  '/maklon-kosmetik-tangerang-terpercaya/',
  '/bisnis-skincare-glow-glasskin-cystamine/',
  '/hero-ingredients-2025/',
  '/maklon-shampoo-psoriasis-formula-juara/',
  '/perbedaan-micellar-water-dan-toner/',
  '/potensi-bisnis-babycare/',
  '/produk-haircare-yang-sedang-tren/',
  '/hair-care',
];

async function checkUrl(path: string): Promise<{ path: string; status: number; location?: string }> {
  return new Promise((resolve) => {
    const url = new URL(path, SITE);
    const mod = url.protocol === 'https:' ? https : http;
    const req = mod.get(url, { timeout: 15000 }, (res) => {
      resolve({
        path,
        status: res.statusCode || 0,
        location: res.headers.location,
      });
      res.resume();
    });
    req.on('error', () => resolve({ path, status: 0 }));
    req.end();
  });
}

async function main() {
  console.log('🔍 404 CHECKER\n');
  console.log('Checking', URLS_TO_CHECK.length, 'URLs...\n');

  const results: { path: string; status: number; location?: string }[] = [];

  for (let i = 0; i < URLS_TO_CHECK.length; i++) {
    const result = await checkUrl(URLS_TO_CHECK[i]);
    results.push(result);
    const icon = result.status === 200 ? '✅' : result.status === 404 ? '❌' : result.status === 301 || result.status === 302 ? '🔄' : '⚠️';
    console.log(`${icon} [${result.status}] ${URLS_TO_CHECK[i]}${result.location ? ' → ' + result.location : ''}`);
  }

  console.log('\n=== SUMMARY ===');
  const byStatus: Record<number, number> = {};
  for (const r of results) {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  }
  for (const [status, count] of Object.entries(byStatus).sort()) {
    const label = status === '200' ? '✅ OK' : status === '404' ? '❌ NOT FOUND' : status === '301' ? '🔄 REDIRECT' : status === '302' ? '🔄 TEMP REDIRECT' : '⚠️ OTHER';
    console.log(`${label}: ${count}`);
  }

  const notFound = results.filter(r => r.status === 404);
  if (notFound.length > 0) {
    console.log('\n❌ 404 PAGES:');
    for (const r of notFound) {
      console.log(`  https://www.dreamlab.id${r.path}`);
    }
  }
}

main().catch(console.error);
