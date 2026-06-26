import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import https from 'https';

const SITE_URL = 'sc-domain:dreamlab.id';
const CREDENTIALS_PATH = path.join(process.cwd(), 'scripts', 'gsc-credentials.json');

function fetchStatus(url: string): Promise<number> {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      resolve(res.statusCode || 0);
      res.resume();
    });
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
  });
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const client = await auth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: client });

  console.log('=== PULLING ALL URLs FROM GSC SEARCH ANALYTICS ===\n');
  const allPages = new Set<string>();
  let startRow = 0;
  const ROW_LIMIT = 5000;

  while (true) {
    const res = await webmasters.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: '2025-01-01',
        endDate: '2026-06-25',
        dimensions: ['page'],
        rowLimit: ROW_LIMIT,
        startRow,
      },
    });
    const rows = res.data.rows || [];
    if (rows.length === 0) break;
    for (const row of rows) allPages.add(row.keys[0]);
    console.log(`  Fetched ${allPages.size} unique URLs...`);
    startRow += ROW_LIMIT;
    if (rows.length < ROW_LIMIT) break;
  }

  console.log(`\nTotal unique URLs from GSC: ${allPages.size}`);

  const urls = [...allPages].map(u => {
    try { return new URL(u).pathname; } catch { return u; }
  }).filter(Boolean);

  // Known good prefix patterns
  const goodPrefixes = [
    '/', '/about-us', '/contact-us', '/services', '/news-blog', '/our-client',
    '/privacy-policy', '/terms-of-service', '/career', '/robots.txt', '/sitemap.xml',
    '/produk/', '/maklon/', '/category/', '/author/', '/news-blog/page/',
    '/ads/', '/thankyou', '/hair-care', '/skincare-face-care', '/parfum',
  ];

  // Article slug check — 9 crawled-not-indexed
  const articleSlugs = [
    'biaya-maklon-parfum-moq-kecil', 'bisnis-skincare-glow-glasskin-cystamine',
    'hero-ingredients-2025', 'maklon-shampoo-psoriasis-formula-juara',
    'perbedaan-micellar-water-dan-toner', 'potensi-bisnis-babycare',
    'produk-haircare-yang-sedang-tren',
  ];

  const indexed: string[] = [];
  const unknown: string[] = [];

  for (const url of urls) {
    const known = goodPrefixes.some(p => url.startsWith(p));
    if (known || url.includes('#') || url.length < 2) {
      indexed.push(url);
    } else {
      unknown.push(url);
    }
  }

  console.log(`\nKnown/indexed URLs: ${indexed.length}`);
  console.log(`Unknown/unexpected URLs: ${unknown.length}`);

  if (unknown.length > 0) {
    console.log(`\n=== CHECKING ${Math.min(unknown.length, 100)} UNKNOWN URLs ===`);
    const LIMIT = Math.min(unknown.length, 100);
    const results: { url: string; status: number }[] = [];

    for (let i = 0; i < LIMIT; i++) {
      const fullUrl = unknown[i].startsWith('http') ? unknown[i] : `https://www.dreamlab.id${unknown[i]}`;
      const status = await fetchStatus(fullUrl);
      results.push({ url: unknown[i], status });
      const icon = status === 200 ? '✅' : status === 404 ? '🔴' : status === 301 ? '🟡' : status === 0 ? '💀' : '⚪';
      console.log(`  ${icon} ${unknown[i]} → ${status}`);
    }

    const notFound = results.filter(r => r.status === 404);
    const redirects = results.filter(r => r.status === 301 || r.status === 302);

    if (notFound.length > 0) {
      console.log(`\n🔴 404 URLs (${notFound.length}):`);
      notFound.forEach(r => console.log(`  ${r.url}`));
    }
    if (redirects.length > 0) {
      console.log(`\n🟡 Redirect URLs (${redirects.length}):`);
      redirects.slice(0, 10).forEach(r => console.log(`  ${r.url}`));
    }
  }

  // Check article pages
  console.log(`\n=== CRAWLED-NOT-INDEXED ARTICLES — STATUS CHECK ===`);
  for (const slug of articleSlugs) {
    const url = `https://www.dreamlab.id/${slug}/`;
    const status = await fetchStatus(url);
    console.log(`  ${status === 200 ? '✅' : '🔴'} /${slug}/ → ${status}`);
  }

  // Summary
  console.log(`\n=== SUMMARY ===`);
  console.log(`GSC knows ${allPages.size} unique URLs`);
  console.log(`${unknown.length} don't match known patterns`);
  console.log(`Next: deploy the allArticles fix → Google can process the pages`);
}

main().catch(console.error);
