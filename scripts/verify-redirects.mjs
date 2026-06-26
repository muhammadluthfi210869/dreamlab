import https from 'https';

const TESTS = [
  { url: 'https://www.dreamlab.id/homepage.php', expected: 301 },
  { url: 'https://www.dreamlab.id/Homepage', expected: 301 },
  { url: 'https://www.dreamlab.id/thank-you-maklon/', expected: 301 },
  { url: 'https://www.dreamlab.id/career-2/', expected: 301 },
  { url: 'https://www.dreamlab.id/career-3/', expected: 301 },
  { url: 'https://www.dreamlab.id/perbedaan-moisturizer-gel-vs-cream/dreamlab', expected: 301 },
  { url: 'https://www.dreamlab.id/category/bisnis-kosmetik/page/4/', expected: 301 },
  { url: 'https://www.dreamlab.id/news-blog/page/8/', expected: 301 },
  { url: 'https://www.dreamlab.id/academy-beautypreneur/', expected: 301 },
  { url: 'https://www.dreamlab.id/menghadapi-tantangan-dalam-industri-maklon-kosmetik/', expected: 301 },
  { url: 'https://www.dreamlab.id/dreampreneur-id-konfirmasi-pembayaran/', expected: 301 },
];

async function check(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      resolve({
        status: res.statusCode || 0,
        location: res.headers.location || '',
      });
      res.resume();
    });
    req.on('error', () => resolve({ status: 0, location: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, location: '' }); });
  });
}

async function main() {
  console.log('=== VERIFYING 404 REDIRECTS ===\n');
  let pass = 0;
  let fail = 0;
  for (const t of TESTS) {
    const result = await check(t.url);
    const ok = result.status === t.expected;
    const icon = ok ? 'PASS' : 'FAIL';
    console.log(`${icon} ${t.url}`);
    console.log(`   Status: ${result.status}${result.location ? ' -> ' + result.location : ''}`);
    if (ok) pass++; else fail++;
  }
  console.log(`\n=== RESULT: ${pass}/${TESTS.length} passed, ${fail} failed ===`);
}

main();
