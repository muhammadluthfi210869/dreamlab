import https from 'https';
import { writeFileSync } from 'fs';
import path from 'path';

const BASE = 'https://dreamlab.id';
const OUTPUT = path.join(process.cwd(), 'scripts', 'output', 'schema-validation.json');

const PRODUCT_CATEGORIES = ['parfum', 'skincare', 'bodycare', 'haircare', 'babycare', 'decorative', 'footcare', 'pkrt'];

async function fetchWithSchemaCheck(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const issues = [];
        const warnings = [];
        const regex = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
        let match;
        let found = 0;
        const types = [];

        while ((match = regex.exec(data)) !== null) {
          found++;
          try {
            const parsed = JSON.parse(match[1]);
            const items = parsed['@graph'] || [parsed];
            for (const item of items) {
              const t = item['@type'];
              types.push(t);
              if (t === 'Product') {
                if (!item.name) issues.push('Product: missing name');
                if (!item.description) issues.push('Product: missing description');
                if (!item.image) issues.push('Product: missing image');
                if (!item.offers) issues.push('Product: missing offers');
                if (item.offers) {
                  if (!item.offers.price) issues.push('offers: missing price');
                  if (!item.offers.priceCurrency) issues.push('offers: missing priceCurrency');
                  if (!item.offers.availability) issues.push('offers: missing availability');
                  const hasShippingInOffers = item.offers.shippingDetails;
                  const hasShippingAtTop = item.shippingDetails;
                  if (hasShippingInOffers) warnings.push('shippingDetails is inside offers ✓');
                  else if (hasShippingAtTop) issues.push('shippingDetails is at Product level, should be inside offers');
                  else issues.push('offers: missing shippingDetails');
                }
                if (!item.hasMerchantReturnPolicy) warnings.push('missing hasMerchantReturnPolicy');
                const img = item.image;
                if (img && typeof img === 'string' && !img.startsWith('http')) {
                  issues.push(`image is relative, should be absolute: ${img}`);
                }
              } else if (t === 'BreadcrumbList') {
                // present, ok
              } else if (t === 'FAQPage') {
                // present, ok (SEO bonus)
              }
            }
          } catch (e) {
            issues.push('JSON-LD parse error: ' + e.message);
          }
        }

        if (found === 0) issues.push('No JSON-LD found on page');
        if (!types.includes('Product')) issues.push('No Product schema found');
        if (!types.includes('BreadcrumbList')) warnings.push('No BreadcrumbList schema (recommended)');

        resolve({ url, status: res.statusCode, schemas: found, types, issues, warnings });
      });
    }).on('error', (e) => resolve({ url, status: 0, schemas: 0, types: [], issues: ['Fetch error: ' + e.message], warnings: [] }));
  });
}

async function main() {
  // Build URL list: category pages + individual product pages
  const urlsToCheck = [];

  // Add category pages
  for (const cat of PRODUCT_CATEGORIES) {
    urlsToCheck.push(`${BASE}/produk/${cat}/`);
  }

  // Try to get product-level URLs from sitemap (live site)
  try {
    const sitemap = await new Promise((resolve) => {
      https.get(`${BASE}/sitemap.xml`, { timeout: 15000 }, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(d));
      }).on('error', () => resolve(''));
    });
    const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    for (const loc of locs) {
      if (loc.startsWith(`${BASE}/produk/`) && !urlsToCheck.includes(loc)) {
        urlsToCheck.push(loc);
      }
    }
  } catch (e) {}

  console.log(`Validating ${urlsToCheck.length} product URLs...\n`);

  const results = [];
  const batchSize = 3;
  let passed = 0;
  let failed = 0;

  for (let i = 0; i < urlsToCheck.length; i += batchSize) {
    const batch = urlsToCheck.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fetchWithSchemaCheck));
    for (const r of batchResults) {
      results.push(r);
      if (r.issues.length === 0) passed++;
      else failed++;
    }
    process.stdout.write(`\r   ${Math.min(i + batchSize, urlsToCheck.length)}/${urlsToCheck.length} | ✅ ${passed} | ❌ ${failed}`);
    if (i + batchSize < urlsToCheck.length) await new Promise(r => setTimeout(r, 200));
  }

  writeFileSync(OUTPUT, JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2));

  console.log('\n\n═══════════════════════════════════════');
  console.log('  SCHEMA VALIDATION REPORT');
  console.log('═══════════════════════════════════════');
  console.log(`Checked: ${urlsToCheck.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Issues: ${failed}`);
  console.log(`💾 Report: ${OUTPUT}`);

  const failedUrls = results.filter(r => r.issues.length > 0);
  if (failedUrls.length > 0) {
    console.log('\n❌ PAGES WITH ISSUES:');
    for (const f of failedUrls) {
      console.log(`  • ${f.url} (${f.status})`);
      for (const issue of f.issues) console.log(`    - ${issue}`);
    }
  }

  console.log('');
}

main().catch(console.error);
