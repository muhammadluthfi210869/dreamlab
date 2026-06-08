import fs from 'fs';
import path from 'path';
import './lib/env-loader';

/**
 * PAGESPEED SNAPSHOT
 * 
 * Memerlukan Google API Key — gratis, setup 5 menit:
 * 1. Buka https://console.cloud.google.com/
 * 2. Buat/buka project → "APIs & Services" → "Library"
 * 3. Cari "PageSpeed Insights API" → Enable
 * 4. "Credentials" → "Create Credentials" → "API Key"
 * 5. Set API key: $env:PSI_API_KEY="your-key"
 * 
 * Tanpa API key: quota publik sangat terbatas.
 * Alternatif: jalankan manual via https://pagespeed.web.dev/
 */

interface PSIResult {
  url: string;
  label: string;
  strategy: 'mobile' | 'desktop';
  lcp: number | null;
  cls: number | null;
  inp: number | null;
  tbt: number | null;
  fcp: number | null;
  si: number | null;
  performance_score: number | null;
  error: string | null;
}

const BASE_URL = 'https://dreamlab.id';

const PRIORITY_PAGES = [
  { url: '/', label: 'Homepage' },
  { url: '/news-blog/', label: 'Blog Listing' },
  { url: '/skincare-face-care/', label: 'Service: Skincare' },
  { url: '/parfum/', label: 'Service: Parfum' },
  { url: '/hair-care/', label: 'Service: Hair Care' },
  { url: '/body-care/', label: 'Service: Body Care' },
  { url: '/foot-care/', label: 'Service: Foot Care' },
  { url: '/baby-care/', label: 'Service: Baby Care' },
  { url: '/decorative/', label: 'Service: Decorative' },
  { url: '/pkrt/', label: 'Service: PKRT' },
  { url: '/about-us/', label: 'About Us' },
  { url: '/services/', label: 'Services' },
  { url: '/category/maklon-skincare/', label: 'Category: Maklon Skincare' },
  { url: '/category/dreamlabpedia/', label: 'Category: Dreamlab Pedia' },
  { url: '/pabrik-maklon-kosmetik-cpkb-grade-a/', label: 'Article: CPKB' },
  { url: '/cara-hitunghpp-produk-kosmeti/', label: 'Article: HPP' },
  { url: '/rekomendasi-sunscreen-lokal/', label: 'Article: Sunscreen' },
  { url: '/atur-kosmetik-halal-dreamlab/', label: 'Article: Halal' },
  { url: '/perusahaan-maklon-kosmetik/', label: 'Article: Perusahaan' },
  { url: '/maklon-kosmetik-kediri/', label: 'Article: Kediri' },
];

async function runPSI(url: string, strategy: 'mobile' | 'desktop', apiKey: string): Promise<Partial<PSIResult>> {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}&category=performance`;

  try {
    const response = await fetch(apiUrl, { signal: AbortSignal.timeout(120000) });
    const data = await response.json() as any;

    if (data.error) {
      return { error: data.error.message || 'API error' };
    }
    if (!data.lighthouseResult) {
      return { error: 'No lighthouse result in response' };
    }

    const lr = data.lighthouseResult;
    const audits = lr.audits || {};
    const metrics = audits.metrics?.details?.items?.[0] || {};

    return {
      lcp: metrics.largestContentfulPaint ? Math.round(metrics.largestContentfulPaint) : null,
      cls: metrics.cumulativeLayoutShift ? Math.round(metrics.cumulativeLayoutShift * 1000) / 1000 : null,
      inp: metrics.interactionToNextPaint ? Math.round(metrics.interactionToNextPaint) : null,
      tbt: audits['total-blocking-time']?.numericValue ? Math.round(audits['total-blocking-time'].numericValue) : null,
      fcp: metrics.firstContentfulPaint ? Math.round(metrics.firstContentfulPaint) : null,
      si: audits['speed-index']?.numericValue ? Math.round(audits['speed-index'].numericValue) : null,
      performance_score: lr.categories?.performance?.score ? Math.round(lr.categories.performance.score * 100) : null,
      error: null,
    };
  } catch (err: any) {
    return { error: err.message || 'Unknown error' };
  }
}

async function main() {
  const apiKey = process.env.PSI_API_KEY;

  console.log('=== PageSpeed Baseline Snapshot ===');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Pages to test: ${PRIORITY_PAGES.length} × 2 strategies = ${PRIORITY_PAGES.length * 2} tests\n`);

  if (!apiKey) {
    console.log('⚠️  PSI_API_KEY not found in environment.\n');
    console.log('   SETUP:');
    console.log('   1. Go to https://console.cloud.google.com/');
    console.log('   2. Enable PageSpeed Insights API');
    console.log('   3. Create API Key');
    console.log('   4. $env:PSI_API_KEY="your-key"\n');
    console.log('   FALLBACK:');
    console.log('   Run tests manually via https://pagespeed.web.dev/');
    console.log('   Pages to test:');
    for (const p of PRIORITY_PAGES) {
      console.log(`   • ${BASE_URL}${p.url} (${p.label})`);
    }

    const instructions = `PAGESPEED MANUAL TESTING
=========================
1. Buka https://pagespeed.web.dev/
2. Test halaman berikut (masukkan URL satu per satu):
${PRIORITY_PAGES.map(p => `   - ${BASE_URL}${p.url} (${p.label})`).join('\n')}
3. Catat hasil: Performance Score, LCP, CLS, TBT
4. Simpan sebagai: scripts/output/pagespeed-manual-results.csv
`;
    fs.mkdirSync(path.join(process.cwd(), 'scripts', 'output'), { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), 'scripts', 'output', 'PSI_MANUAL_INSTRUCTIONS.txt'), instructions);
    return;
  }

  const results: PSIResult[] = [];

  for (let i = 0; i < PRIORITY_PAGES.length; i++) {
    const { url, label } = PRIORITY_PAGES[i];
    const fullUrl = `${BASE_URL}${url}`;

    // Mobile
    process.stdout.write(`[${i + 1}/${PRIORITY_PAGES.length}] ${label} (mobile)... `);
    const mobile = await runPSI(fullUrl, 'mobile', apiKey);
    console.log(mobile.error ? `❌ ${mobile.error}` : `✅ Score:${mobile.performance_score} LCP:${mobile.lcp}ms`);
    
    results.push({
      url: fullUrl,
      label,
      strategy: 'mobile',
      ...mobile,
    } as PSIResult);

    // Desktop
    process.stdout.write(`[${i + 1}/${PRIORITY_PAGES.length}] ${label} (desktop)... `);
    const desktop = await runPSI(fullUrl, 'desktop', apiKey);
    console.log(desktop.error ? `❌ ${desktop.error}` : `✅ Score:${desktop.performance_score} LCP:${desktop.lcp}ms`);

    results.push({
      url: fullUrl,
      label,
      strategy: 'desktop',
      ...desktop,
    } as PSIResult);

    // Rate limiting delay
    await new Promise(r => setTimeout(r, 1000));
  }

  // Save results
  const outputPath = path.join(process.cwd(), 'scripts', 'output', 'pagespeed-baseline.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  // Summary
  const mobileResults = results.filter(r => r.strategy === 'mobile' && !r.error);
  const desktopResults = results.filter(r => r.strategy === 'desktop' && !r.error);

  console.log('\n=== PAGESPEED BASELINE SUMMARY ===');
  if (mobileResults.length > 0) {
    const avgScore = Math.round(mobileResults.reduce((a, b) => a + (b.performance_score || 0), 0) / mobileResults.length);
    const avgLCP = Math.round(mobileResults.reduce((a, b) => a + (b.lcp || 0), 0) / mobileResults.length);
    const avgCLS = mobileResults.reduce((a, b) => a + (b.cls || 0), 0) / mobileResults.length;
    console.log(`📱 Mobile (${mobileResults.length} pages):`);
    console.log(`   Avg Score: ${avgScore} | Avg LCP: ${avgLCP}ms | Avg CLS: ${avgCLS.toFixed(3)}`);
  }
  if (desktopResults.length > 0) {
    const avgScore = Math.round(desktopResults.reduce((a, b) => a + (b.performance_score || 0), 0) / desktopResults.length);
    const avgLCP = Math.round(desktopResults.reduce((a, b) => a + (b.lcp || 0), 0) / desktopResults.length);
    console.log(`💻 Desktop (${desktopResults.length} pages):`);
    console.log(`   Avg Score: ${avgScore} | Avg LCP: ${avgLCP}ms`);
  }

  console.log(`\n📁 Full report: ${outputPath}`);
}

main().catch(console.error);
