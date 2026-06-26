import https from 'https';

const SITEMAP = 'https://www.dreamlab.id/sitemap.xml';

async function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 30000 }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function fetchSitemapUrls(url: string): Promise<string[]> {
  const xml = await fetchText(url);
  const urls: string[] = [];
  
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

  const locMatches = xml.match(/<loc[^>]*>([^<]+)<\/loc>/g);
  if (locMatches) {
    for (const loc of locMatches) {
      const u = loc.replace(/<\/?loc[^>]*>/g, '');
      urls.push(u);
    }
  }
  return urls;
}

function toWww(url: string): string {
  return url.replace('https://dreamlab.id/', 'https://www.dreamlab.id/');
}

async function checkUrl(url: string): Promise<{ url: string; status: number; content?: string }> {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode || 0,
          content: d.substring(0, 1000),
        });
      });
    }).on('error', () => resolve({ url, status: 0 }));
  });
}

async function main() {
  console.log('📍 Fetching sitemap URLs...');
  const sitemapUrls = await fetchSitemapUrls(SITEMAP);
  console.log(`Found ${sitemapUrls.length} URLs\n`);

  // Convert to www and check
  const checkUrls = sitemapUrls.map(toWww);
  
  console.log('🔍 Checking www URLs for 404s...');
  const results: { url: string; status: number; title?: string }[] = [];

  for (let i = 0; i < checkUrls.length; i += 10) {
    const batch = checkUrls.slice(i, i + 10);
    const batchResults = await Promise.all(batch.map(checkUrl));
    
    for (const r of batchResults) {
      const title = r.content?.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
      const isSoft404 = title?.toLowerCase().includes('tidak ditemukan') || title?.toLowerCase().includes('not found');
      results.push({ url: r.url, status: r.status, title });
      
      if (r.status === 404 || isSoft404) {
        console.log(`  ${r.status === 404 ? '❌' : '⚠️'} [${r.status}] ${r.url}${title ? ' → ' + title : ''}`);
      }
    }

    process.stdout.write(`\rProgress: ${Math.min(i + 10, checkUrls.length)}/${checkUrls.length}`);
    
    if (i + 10 < checkUrls.length) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  console.log('\n\n=== SUMMARY ===');
  const real404 = results.filter(r => r.status === 404);
  const soft404 = results.filter(r => r.status === 200 && r.title?.toLowerCase().includes('tidak ditemukan'));
  const redirect = results.filter(r => r.status >= 300 && r.status < 400);
  const ok = results.filter(r => r.status === 200 && !r.title?.toLowerCase().includes('tidak ditemukan'));

  console.log(`✅ OK (200 with real content): ${ok.length}`);
  console.log(`🔄 Redirect (3xx): ${redirect.length}`);
  console.log(`❌ Real 404: ${real404.length}`);
  console.log(`⚠️ Soft 404 (200 but 'Halaman Tidak Ditemukan'): ${soft404.length}`);

  if (soft404.length > 0) {
    console.log('\n⚠️ SOFT 404s (in sitemap but return 404 content):');
    for (const r of soft404) {
      console.log(`  ${r.url}`);
    }
  }
}

main().catch(console.error);
