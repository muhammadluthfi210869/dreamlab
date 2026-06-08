import fs from 'fs';
import path from 'path';

interface CrawlResult {
  url: string;
  slug: string;
  status: number | string;
  title: string | null;
  meta_description: string | null;
  h1: string | null;
  canonical: string | null;
  has_schema: boolean;
  og_locale: string | null;
  word_count: number;
  response_time: number;
  errors: string[];
}

const BASE_URL = 'https://dreamlab.id';
const SITEMAP_URL = `${BASE_URL}/sitemap_index.xml`;

async function fetchXml(url: string): Promise<string> {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  return res.text();
}

function parseSitemapUrls(xml: string): string[] {
  const urls: string[] = [];
  const locRegex = /<loc[^>]*>([^<]+)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

async function crawlUrl(url: string): Promise<CrawlResult> {
  const slug = url.replace(BASE_URL, '').replace(/\/$/, '') || '/';
  const errors: string[] = [];
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(20000),
      redirect: 'manual',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEOBot/1.0)' }
    });
    
    const responseTime = Date.now() - startTime;
    const status = response.status;
    const html = await response.text();
    
    if (status >= 400) {
      return { url, slug, status, title: null, meta_description: null, h1: null, canonical: null, has_schema: false, og_locale: null, word_count: 0, response_time: responseTime, errors: [`HTTP ${status}`] };
    }

    const title = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1]?.trim() || null;
    const metaDesc = html.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1]?.trim() || null;
    const h1 = html.match(/<h1[^>]*>([^<]*)<\/h1>/)?.[1]?.trim() || null;
    const canonical = html.match(/<link\s+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)?.[1]?.trim() || null;
    const ogLocale = html.match(/<meta\s+property=["']og:locale["'][^>]*content=["']([^"']*)["']/i)?.[1]?.trim() || null;
    const hasSchema = html.includes('application/ld+json');
    
    const bodyText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(/\s+/).length;

    if (!title) errors.push('Missing title');
    if (!metaDesc) errors.push('Missing meta description');
    if (!canonical) errors.push('Missing canonical');
    if (ogLocale && ogLocale !== 'id_ID') errors.push(`OG locale is "${ogLocale}" not "id_ID"`);
    if (!hasSchema) errors.push('No JSON-LD schema');
    
    return { url, slug, status, title, meta_description: metaDesc, h1, canonical, has_schema: hasSchema, og_locale: ogLocale, word_count: wordCount, response_time: responseTime, errors };
  } catch (err: any) {
    return { url, slug, status: 'ERROR', title: null, meta_description: null, h1: null, canonical: null, has_schema: false, og_locale: null, word_count: 0, response_time: Date.now() - startTime, errors: [err.message] };
  }
}

async function main() {
  console.log('=== Crawl Baseline: dreamlab.id ===\n');

  // 1. Fetch sitemap index
  console.log('1. Fetching sitemap index...');
  const sitemapIndexXml = await fetchXml(SITEMAP_URL);
  const sitemapUrls = parseSitemapUrls(sitemapIndexXml);
  console.log(`   Found ${sitemapUrls.length} sitemaps\n`);

  // 2. Fetch each sitemap
  const allUrls: string[] = [];
  for (const smUrl of sitemapUrls) {
    process.stdout.write(`   Fetching: ${smUrl.split('/').pop()}... `);
    const xml = await fetchXml(smUrl);
    const urls = parseSitemapUrls(xml);
    allUrls.push(...urls);
    console.log(`${urls.length} URLs`);
  }
  console.log(`\n   Total URLs in sitemap: ${allUrls.length}\n`);

  // 3. Crawl each URL
  console.log('3. Crawling URLs...');
  const results: CrawlResult[] = [];
  
  for (let i = 0; i < allUrls.length; i++) {
    const url = allUrls[i];
    process.stdout.write(`   [${i + 1}/${allUrls.length}] ${url.replace(BASE_URL, '')}... `);
    
    const result = await crawlUrl(url);
    results.push(result);
    
    const status = result.status === 200 ? '✅' : result.status === 301 ? '↪️' : result.status === 404 ? '❌' : `⚠️${result.status}`;
    const issues = result.errors.length > 0 ? ` (${result.errors.length} issues)` : '';
    console.log(`${status} ${result.response_time}ms${issues}`);
    
    if (i > 0 && i % 10 === 0) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // 4. Generate report
  const outputDir = path.join(process.cwd(), 'scripts', 'output');
  fs.mkdirSync(outputDir, { recursive: true });

  // Save full data
  fs.writeFileSync(path.join(outputDir, 'crawl-baseline.json'), JSON.stringify(results, null, 2));
  
  // Save CSV summary
  const csvLines = ['url,slug,status,response_time_ms,title,meta_description,h1,canonical,has_schema,og_locale,word_count,errors'];
  for (const r of results) {
    const escape = (s: string | null) => s ? `"${s.replace(/"/g, '""')}"` : '';
    csvLines.push(`${r.url},${r.slug},${r.status},${r.response_time},${escape(r.title)},${escape(r.meta_description)},${escape(r.h1)},${escape(r.canonical)},${r.has_schema},${r.og_locale || ''},${r.word_count},"${r.errors.join('; ')}"`);
  }
  fs.writeFileSync(path.join(outputDir, 'crawl-baseline.csv'), csvLines.join('\n'), 'utf-8');

  // 5. Summary
  const urlCount = results.length;
  const okCount = results.filter(r => r.status === 200).length;
  const redirectCount = results.filter(r => r.status === 301 || r.status === 308).length;
  const errorCount = results.filter(r => r.status !== 200 && r.status !== 301 && r.status !== 308).length;
  const missingCanonical = results.filter(r => !r.canonical && r.status === 200).length;
  const missingSchema = results.filter(r => !r.has_schema && r.status === 200).length;
  const missingTitle = results.filter(r => !r.title && r.status === 200).length;
  const avgResponseTime = Math.round(results.filter(r => typeof r.response_time === 'number').reduce((a, b) => a + b.response_time, 0) / results.filter(r => r.status === 200).length);

  console.log('\n=== CRAWL BASELINE REPORT ===');
  console.log(`📊 Total URLs crawled: ${urlCount}`);
  console.log(`✅ 200 OK: ${okCount}`);
  console.log(`↪️  Redirects: ${redirectCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`⚡ Avg response time: ${avgResponseTime}ms`);
  console.log('');
  console.log('SEO Issues Found:');
  console.log(`   Missing canonical: ${missingCanonical} pages`);
  console.log(`   Missing schema: ${missingSchema} pages`);
  console.log(`   Missing title: ${missingTitle} pages`);

  // Save summary
  const summary = {
    crawl_date: new Date().toISOString(),
    base_url: BASE_URL,
    total_urls: urlCount,
    ok: okCount,
    redirects: redirectCount,
    errors: errorCount,
    avg_response_time: avgResponseTime,
    seo_issues: {
      missing_canonical: missingCanonical,
      missing_schema: missingSchema,
      missing_title: missingTitle,
    },
  };
  fs.writeFileSync(path.join(outputDir, 'crawl-summary.json'), JSON.stringify(summary, null, 2));
  
  console.log(`\n📁 Reports saved to: ${outputDir}`);
}

main().catch(console.error);
