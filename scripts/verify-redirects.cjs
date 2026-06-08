// Verifikasi redirect: test semua 301 redirect dari next.config.ts & mapping
// Run: node scripts/verify-redirects.cjs

const BASE = 'http://localhost:3000';
const LIVE = 'https://dreamlab.id';

const REDIRECTS_TO_TEST = [
  // next.config.ts /news-blog/{slug} redirects
  { source: '/news-blog/cara-hitunghpp-produk-kosmeti', expected: '/cara-hitunghpp-produk-kosmeti/' },
  
  // WordPress legacy redirects (old slug → new slug)
  { source: '/tips-sukses-bisnis-parfum', expected: '/bisnis-parfum-merk-sendiri/' },
  { source: '/prediksi-tren-2026', expected: '/8-tren-kecantikan-2026-smart-formula/' },
  { source: '/maklon-parfum-jakarta', expected: '/pabrik-parfum-jakarta/' },
  
  // structural
  { source: '/thankyou-page', expected: '/contact-us/' },
  
  // canonical pages should 200
  { source: '/', expected: 200 },
  { source: '/news-blog/', expected: 200 },
  { source: '/cara-hitunghpp-produk-kosmeti/', expected: 200 },
];

async function checkRedirect(source, expected) {
  const url = BASE + source;
  try {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
    const status = response.status;
    const location = response.headers.get('location') || '';
    const cleanLoc = location.replace(BASE, '');
    
    if (expected === 200) {
      return { source, status, pass: status === 200, detail: `status ${status}` };
    }
    
    if (status === 301 || status === 308) {
      const pass = cleanLoc === expected || cleanLoc === expected.replace(/\/$/, '') + '/';
      return { source, status, location: cleanLoc, expected, pass, detail: pass ? '✅' : `→ ${cleanLoc} (expected ${expected})` };
    }
    
    if (status === 200) {
      return { source, status, pass: false, detail: 'No redirect (200 instead of 301)' };
    }
    
    return { source, status, pass: false, detail: `Unexpected: ${status}` };
  } catch (err) {
    return { source, status: 'ERR', pass: false, detail: err.message };
  }
}

async function main() {
  console.log('=== Redirect Verification ===\n');
  
  // Check if server is running first
  try {
    const test = await fetch(BASE, { signal: AbortSignal.timeout(3000) });
    console.log(`ℹ️  Testing against LOCAL: ${BASE}\n`);
  } catch {
    console.log(`⚠️  Local server (${BASE}) not reachable. Testing against LIVE: ${LIVE}\n`);
    // Use live URL instead
    process.exit(1); // For now, just exit. Run with local server.
  }
  
  let passed = 0;
  let failed = 0;
  
  for (const { source, expected } of REDIRECTS_TO_TEST) {
    const result = await checkRedirect(source, expected);
    if (result.pass) {
      console.log(`  ✅ ${source} → ${expected} (${result.status})`);
      passed++;
    } else {
      console.log(`  ❌ ${source}: ${result.detail}`);
      failed++;
    }
  }
  
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  if (failed === 0) console.log('✅ ALL REDIRECTS VERIFIED');
}

main().catch(console.error);
