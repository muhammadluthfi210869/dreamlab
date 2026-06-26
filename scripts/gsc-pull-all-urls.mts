/**
 * Pull ALL known URLs from Google Search Console + check their status
 */
import { google } from 'googleapis';
import https from 'https';

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
const SITE_URL = 'https://www.dreamlab.id';
const KEY_PATH = 'scripts/gsc-credentials.json';

let auth: any;

async function getAuth() {
  if (auth) return auth;
  const key = (await import('../scripts/gsc-credentials.json', { assert: { type: 'json' } })).default;
  auth = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: SCOPES,
    subject: 'luthfizywx@gmail.com',
  });
  return auth;
}

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

async function getAllGscUrls(): Promise<Map<string, number>> {
  const auth2 = await getAuth();
  const webmasters = google.webmasters({ version: 'v3', auth: auth2 });

  let allRows: any[] = [];
  let startRow = 0;
  const ROW_LIMIT = 25000;

  while (true) {
    const resp = await webmasters.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: '2025-01-01',
        endDate: new Date().toISOString().split('T')[0],
        dimensions: ['page'],
        rowLimit: ROW_LIMIT,
        startRow,
      },
    });
    const rows = resp.data.rows || [];
    if (rows.length === 0) break;
    allRows = allRows.concat(rows);
    startRow += ROW_LIMIT;
    console.log(`  Fetched ${allRows.length} rows...`);
    if (rows.length < ROW_LIMIT) break;
  }

  console.log(`\nTotal unique URLs from GSC: ${allRows.length}`);
  const urlMap = new Map<string, number>();
  for (const row of allRows) {
    urlMap.set(row.keys[0], row.impressions || 0);
  }
  return urlMap;
}

// Known good URLs (from sitemap)
const KNOWN_GOOD_URLS = new Set<string>();

async function main() {
  console.log('=== PULLING ALL URLs FROM GSC SEARCH ANALYTICS ===\n');
  const urlMap = await getAllGscUrls();

  // Get sitemap URLs
  console.log('\n=== GETTING SITEMAP URLS ===');
  // We'll check a subset - URL Inspection has 2000/day limit
  const SITEMAP_CHECK_URLS = [
    '/',
    '/about-us',
    '/contact-us',
    '/services',
    '/news-blog',
    '/our-client',
    '/terms-of-service',
    '/privacy-policy',
    '/career',
    '/robots.txt',
  ];

  console.log(`\nGSC knows ${urlMap.size} unique URLs.`);
  
  // Categorize
  const knownPrefixes = ['/', '/about-us', '/contact', '/produk', '/maklon', '/news-blog', '/category', '/author', '/biaya', '/bisnis', '/hero', '/perbedaan', '/potensi', '/maklon-shampoo', '/produk-haircare', '/ads', '/thankyou', '/hair-care', '/skincare-face-care', '/parfum', '/api'];
  
  let unknown = 0;
  const unknownUrls: string[] = [];
  
  for (const url of urlMap.keys()) {
    const known = knownPrefixes.some(p => url.startsWith(p) || url.startsWith('https://www.dreamlab.id' + p));
    if (!known) {
      unknown++;
      if (unknown <= 30) unknownUrls.push(url);
    }
  }
  
  console.log(`\nPotentially unknown/problematic URLs: ${unknown}`);
  if (unknownUrls.length > 0) {
    console.log('\nSample unknown URLs:');
    for (const url of unknownUrls.slice(0, 20)) {
      console.log(`  ${url}`);
    }
  }

  // Check status of all unknown URLs
  if (unknownUrls.length > 0) {
    console.log('\n=== CHECKING STATUS OF UNKNOWN URLs ===');
    const results: { url: string; status: number; impressions: number }[] = [];
    for (const url of unknownUrls) {
      const status = await fetchStatus(url);
      const impressions = urlMap.get(url) || 0;
      results.push({ url, status, impressions });
      console.log(`  ${status === 200 ? '✅' : status === 404 ? '🔴' : status === 301 ? '🟡' : '⚪'} ${url} (status ${status}, impressions ${impressions})`);
    }
    
    const notFound = results.filter(r => r.status === 404);
    const redirects = results.filter(r => r.status >= 300 && r.status < 400);
    if (notFound.length > 0) {
      console.log(`\n🔴 404 URLs: ${notFound.length}`);
      notFound.forEach(r => console.log(`  ${r.url}`));
    }
    if (redirects.length > 0) {
      console.log(`\n🟡 Redirect URLs: ${redirects.length}`);
    }
  }
}

main().catch(console.error);
