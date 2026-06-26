import https from 'https';
import http from 'http';

const SITE = 'https://www.dreamlab.id';
const SITEMAP = 'https://www.dreamlab.id/sitemap.xml';

// Fetch URLs from all sitemaps
async function fetchSitemapUrls(url: string): Promise<string[]> {
  const xml = await fetchText(url);
  const urls: string[] = [];
  
  // Check if it's a sitemap index
  const sitemapMatches = xml.match(/<sitemap[^>]*>.*?<\/sitemap>/gs);
  if (sitemapMatches) {
    for (const sm of sitemapMatches) {
      const loc = sm.match(/<loc[^>]*>([^<]+)<\/loc>/)?.[1];
      if (loc) {
        const subUrls = await fetchSitemapUrls(loc);
        urls.push(...subUrls);
      }
    }
    return urls;
  }

  // Regular sitemap - extract URLs
  const locMatches = xml.match(/<loc[^>]*>([^<]+)<\/loc>/g);
  if (locMatches) {
    for (const loc of locMatches) {
      const u = loc.replace(/<\/?loc[^>]*>/g, '');
      urls.push(u);
    }
  }
  return urls;
}

async function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { timeout: 30000 }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function checkUrl(url: string): Promise<{ url: string; status: number; redirect?: string }> {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 15000 }, (res) => {
      resolve({
        url,
        status: res.statusCode || 0,
        redirect: res.headers.location,
      });
      res.resume();
    });
    req.on('error', () => resolve({ url, status: 0 }));
    req.end();
  });
}

async function main() {
  console.log('📍 Fetching sitemap URLs...\n');
  const sitemapUrls = await fetchSitemapUrls(SITEMAP);
  console.log(`Found ${sitemapUrls.length} URLs in sitemap\n`);

  // Check each URL
  console.log('🔍 Checking URLs...\n');
  const results: { url: string; status: number; redirect?: string }[] = [];
  const batchSize = 10;

  for (let i = 0; i < sitemapUrls.length; i += batchSize) {
    const batch = sitemapUrls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);

    const done = Math.min(i + batchSize, sitemapUrls.length);
    process.stdout.write(`\rProgress: ${done}/${sitemapUrls.length}`);
    
    if (i + batchSize < sitemapUrls.length) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log('\n\n=== SITEMAP SCAN RESULTS ===\n');
  
  // Categorize
  const ok = results.filter(r => r.status === 200);
  const redirect = results.filter(r => r.status === 301 || r.status === 302 || r.status === 307 || r.status === 308);
  const notFound = results.filter(r => r.status === 404);
  const error = results.filter(r => r.status !== 200 && r.status !== 301 && r.status !== 302 && r.status !== 307 && r.status !== 308 && r.status !== 404);

  console.log(`✅ 200 OK: ${ok.length}`);
  console.log(`🔄 Redirect (3xx): ${redirect.length}`);
  console.log(`❌ 404 Not Found: ${notFound.length}`);
  console.log(`⚠️ Other errors: ${error.length}\n`);

  if (notFound.length > 0) {
    console.log('❌ 404 PAGES:');
    for (const r of notFound) {
      console.log(`  ${r.url}`);
    }
    console.log('');
  }

  if (error.length > 0) {
    console.log('⚠️ OTHER ERRORS:');
    for (const r of error) {
      console.log(`  [${r.status}] ${r.url}${r.redirect ? ' → ' + r.redirect : ''}`);
    }
    console.log('');
  }

  // Analyze redirect destinations
  const redirectChains = redirect.filter(r => r.redirect);
  console.log(`🔄 Redirect analysis (${redirectChains.length}):`);
  const internalRedirects = redirectChains.filter(r => r.redirect?.includes('dreamlab.id'));
  const brokenRedirects = redirectChains.filter(r => !r.redirect?.includes('dreamlab.id'));
  console.log(`  Internal: ${internalRedirects.length}`);
  console.log(`  External: ${brokenRedirects.length}`);
}

main().catch(console.error);
