/**
 * GSC FULL REPORT — Google Search Console Data Pull
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'output');
const CREDENTIALS_PATH = path.join(__dirname, 'gsc-credentials.json');
const REPORT_PATH = path.join(OUTPUT_DIR, 'gsc-full-report.json');
const SUMMARY_PATH = path.join(OUTPUT_DIR, 'gsc-issues-summary.md');
const SITE_URLS = ['sc-domain:dreamlab.id', 'https://dreamlab.id']; // Coba beberapa format

async function main() {
  console.log('='.repeat(60));
  console.log('  GSC FULL REPORT');
  console.log('='.repeat(60));
  console.log();

  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('Credentials not found');
    process.exit(1);
  }

  console.log('Authenticating...');
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const webmasters = google.webmasters({ version: 'v3', auth });

  const sites = await webmasters.sites.list();
  const siteEntry = sites.data.siteEntry || [];
  console.log('Sites:', siteEntry.length > 0 ? siteEntry.map(s => s.siteUrl).join(', ') : '(empty)');

  // Test if we can query the site
  console.log('Testing site access...');
  for (const testUrl of SITE_URLS) {
    try {
      const testQuery = await webmasters.searchanalytics.query({
        siteUrl: testUrl,
        requestBody: {
          startDate: '2026-07-01',
          endDate: '2026-07-02',
          dimensions: ['query'],
          rowLimit: 1,
        },
      });
      console.log('  ' + testUrl + ': OK');
    } catch (e) {
      console.log('  ' + testUrl + ': ' + e.message);
    }
  }

  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  const fmt = (d) => d.toISOString().split('T')[0];

  console.log('\nFetching search analytics...');
  let performanceData = null;
  let activeSiteUrl = SITE_URLS[0];

  for (const siteUrl of SITE_URLS) {
    try {
      console.log('  Trying:', siteUrl);
      const response = await webmasters.searchanalytics.query({
        siteUrl: siteUrl,
        requestBody: {
          startDate: fmt(startDate),
          endDate: fmt(endDate),
          dimensions: ['page', 'query'],
          rowLimit: 25000,
        },
      });
      performanceData = response.data;
      activeSiteUrl = siteUrl;
      console.log('  Success! Got', performanceData.rows?.length || 0, 'rows');
      break;
    } catch (e) {
      console.log('  Failed:', e.message);
    }
  }

  if (performanceData) {
    console.log('Using site URL:', activeSiteUrl);
  }

  console.log('\nReading coverage data...');
  const coverageFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.startsWith('gsc-coverage-') && f.endsWith('.json') && !f.includes('history'))
    .sort().reverse();
  let latestCoverage = null;
  if (coverageFiles.length > 0) {
    latestCoverage = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, coverageFiles[0]), 'utf-8'));
    console.log('Using:', coverageFiles[0], '-', latestCoverage.length, 'URLs');
  }

  const report = {
    generated_at: new Date().toISOString(),
    site_url: activeSiteUrl,
    data_period: { start: fmt(startDate), end: fmt(endDate) },
    performance: null,
    coverage_analysis: null,
    issues: { critical: [], warnings: [], info: [] },
    recommendations: [],
  };

  if (performanceData && performanceData.rows) {
    const pageMap = new Map();
    for (const row of performanceData.rows) {
      const page = row.keys?.[0] || '';
      const query = row.keys?.[1] || '';
      if (!pageMap.has(page)) {
        pageMap.set(page, { clicks: 0, impressions: 0, sumPosition: 0, queries: new Set() });
      }
      const p = pageMap.get(page);
      p.clicks += row.clicks || 0;
      p.impressions += row.impressions || 0;
      p.sumPosition += (row.position || 0) * (row.impressions || 0);
      if (query) p.queries.add(query);
    }

    const pages = [];
    let totalClicks = 0, totalImpressions = 0;
    for (const [url, stats] of pageMap) {
      totalClicks += stats.clicks;
      totalImpressions += stats.impressions;
      pages.push({
        url,
        slug: url.replace(/https?:\/\/dreamlab\.id/gi, '').replace(/\/$/, '') || '/',
        clicks: stats.clicks,
        impressions: stats.impressions,
        ctr: stats.impressions > 0 ? (stats.clicks / stats.impressions * 100).toFixed(2) + '%' : '0%',
        avgPosition: stats.impressions > 0 ? (stats.sumPosition / stats.impressions).toFixed(1) : '-',
        uniqueQueries: stats.queries.size,
      });
    }
    pages.sort((a, b) => b.clicks - a.clicks);

    report.performance = {
      total_pages: pages.length,
      total_clicks: totalClicks,
      total_impressions: totalImpressions,
      avg_ctr: totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) + '%' : '0%',
      top_20_pages: pages.slice(0, 20),
    };

    const zeroClickPages = pages.filter(p => p.clicks === 0);
    const lowCtrPages = pages.filter(p => p.impressions > 100 && p.clicks > 0 && (p.clicks / p.impressions * 100) < 0.5);
    const highImpPages = pages.filter(p => p.impressions > 500 && p.clicks === 0);

    if (zeroClickPages.length > 0) {
      report.issues.warnings.push({
        type: 'zero_clicks',
        count: zeroClickPages.length,
        detail: zeroClickPages.length + ' halaman memiliki 0 klik. Perlu optimasi title & meta description.',
        examples: zeroClickPages.slice(0, 5).map(p => p.url),
      });
    }
    if (lowCtrPages.length > 0) {
      report.issues.warnings.push({
        type: 'low_ctr',
        count: lowCtrPages.length,
        detail: lowCtrPages.length + ' halaman dengan CTR < 0.5% dan >100 impressions.',
        examples: lowCtrPages.slice(0, 5).map(p => p.url + ' (CTR: ' + p.ctr + ')'),
      });
    }
    if (highImpPages.length > 0) {
      report.issues.info.push({
        type: 'high_impressions_no_clicks',
        count: highImpPages.length,
        detail: highImpPages.length + ' halaman dengan >500 impressions tapi 0 klik.',
        examples: highImpPages.slice(0, 5).map(p => p.url),
      });
    }
  }

  if (latestCoverage && Array.isArray(latestCoverage)) {
    const states = {};
    const errors = {};
    const redirectPages = [];
    const notFoundPages = [];
    const noindexPages = [];
    const crawledNotIndexed = [];
    const canonicalIssues = [];
    const unknownUrls = [];

    for (const page of latestCoverage) {
      const state = page.coverageState || 'Unknown';
      if (!states[state]) states[state] = [];
      states[state].push(page.url);
      if (page.verdict === 'FAIL' || page.verdict === 'NEUTRAL') {
        if (!errors[state]) errors[state] = [];
        errors[state].push(page.url);
      }
      if (state === 'Page with redirect') redirectPages.push(page);
      if (state === 'Not found (404)') notFoundPages.push(page);
      if (state === 'Excluded by noindex tag') noindexPages.push(page);
      if (state === 'Crawled - currently not indexed') crawledNotIndexed.push(page);
      if (state === 'URL is unknown to Google') unknownUrls.push(page);
      if (page.canonical && !page.canonical.includes('dreamlab.id/') && page.canonical !== page.url) {
        canonicalIssues.push(page);
      }
    }

    report.coverage_analysis = {
      total_inspected: latestCoverage.length,
      by_state: Object.fromEntries(Object.entries(states).map(([k, v]) => [k, v.length])),
      passed: (states['Submitted and indexed'] || []).length,
    };

    if (notFoundPages.length > 0) {
      report.issues.critical.push({
        type: '404_not_found',
        count: notFoundPages.length,
        detail: notFoundPages.length + ' halaman 404. Redirect atau pulihkan.',
        pages: notFoundPages.slice(0, 20).map(p => ({ url: p.url, lastCrawl: p.lastCrawlTime })),
      });
    }
    if (redirectPages.length > 0) {
      report.issues.critical.push({
        type: 'redirect_issues',
        count: redirectPages.length,
        detail: redirectPages.length + ' halaman dengan redirect. Perbaiki chain & canonical.',
        pages: redirectPages.slice(0, 20).map(p => ({ url: p.url, canonical: p.canonical })),
      });
    }
    if (crawledNotIndexed.length > 0) {
      report.issues.critical.push({
        type: 'crawled_not_indexed',
        count: crawledNotIndexed.length,
        detail: crawledNotIndexed.length + ' halaman di-crawl tapi tidak diindeks. Periksa kualitas konten.',
        pages: crawledNotIndexed.slice(0, 20).map(p => ({ url: p.url, lastCrawl: p.lastCrawlTime })),
      });
    }
    if (canonicalIssues.length > 0) {
      report.issues.critical.push({
        type: 'canonical_mismatch',
        count: canonicalIssues.length,
        detail: canonicalIssues.length + ' halaman dengan canonical salah.',
        pages: canonicalIssues.slice(0, 20).map(p => ({ url: p.url, canonical: p.canonical })),
      });
    }
    if (noindexPages.length > 0) {
      report.issues.warnings.push({
        type: 'noindex_tagged',
        count: noindexPages.length,
        detail: noindexPages.length + ' halaman dengan tag noindex.',
        pages: noindexPages.slice(0, 20).map(p => p.url),
      });
    }
    if (unknownUrls.length > 0) {
      report.issues.info.push({
        type: 'unknown_urls',
        count: unknownUrls.length,
        detail: unknownUrls.length + ' URL tidak dikenal Google (fragment URLs).',
        pages: unknownUrls.slice(0, 10).map(p => p.url),
      });
    }
  }

  // Recommendations
  if (report.issues.critical.some(i => i.type === '404_not_found')) {
    report.recommendations.push({ priority: 'CRITICAL', action: 'Redirect 404 pages', detail: 'Buat redirect 301 untuk semua halaman 404 ke halaman relevan.' });
  }
  if (report.issues.critical.some(i => i.type === 'redirect_issues')) {
    report.recommendations.push({ priority: 'CRITICAL', action: 'Fix redirect chain & canonical', detail: 'Pastikan redirect langsung ke halaman final. Canonical harus non-www (dreamlab.id).' });
  }
  if (report.issues.critical.some(i => i.type === 'crawled_not_indexed')) {
    report.recommendations.push({ priority: 'CRITICAL', action: 'Optimize content quality', detail: 'Tingkatkan kualitas konten untuk halaman yang di-crawl tapi tidak diindeks.' });
  }
  if (report.issues.critical.some(i => i.type === 'canonical_mismatch')) {
    report.recommendations.push({ priority: 'CRITICAL', action: 'Fix canonical tags', detail: 'Perbaiki canonical tags.' });
  }
  if (report.issues.warnings.some(i => i.type === 'low_ctr')) {
    report.recommendations.push({ priority: 'HIGH', action: 'Optimize titles & meta descriptions', detail: 'Buat title dan meta description lebih menarik untuk meningkatkan CTR.' });
  }
  if (report.issues.warnings.some(i => i.type === 'noindex_tagged')) {
    report.recommendations.push({ priority: 'HIGH', action: 'Review noindex pages', detail: 'Pastikan halaman noindex memang sengaja tidak ingin diindeks.' });
  }
  if (report.coverage_analysis && report.coverage_analysis.passed < 200) {
    report.recommendations.push({ priority: 'HIGH', action: 'Increase indexed pages', detail: 'Hanya ' + report.coverage_analysis.passed + ' halaman terindeks. Target 300+.' });
  }
  report.recommendations.push({ priority: 'REGULAR', action: 'Submit sitemap', detail: 'Submit sitemap.xml ke GSC.' });
  report.recommendations.push({ priority: 'REGULAR', action: 'Monitor weekly', detail: 'Cek coverage setiap minggu.' });

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log('\nReport saved:', REPORT_PATH);

  // Console summary
  console.log('\n' + '='.repeat(60));
  console.log('  RINGKASAN LENGKAP');
  console.log('='.repeat(60) + '\n');

  if (report.performance) {
    console.log('PERFORMANCE (90 hari):');
    console.log('  Pages:', report.performance.total_pages);
    console.log('  Clicks:', report.performance.total_clicks);
    console.log('  Impressions:', report.performance.total_impressions);
    console.log('  CTR:', report.performance.avg_ctr + '\n');
  }

  if (report.coverage_analysis) {
    console.log('COVERAGE:');
    console.log('  Total inspected:', report.coverage_analysis.total_inspected);
    console.log('  Passed (indexed):', report.coverage_analysis.passed);
    for (const [state, count] of Object.entries(report.coverage_analysis.by_state)) {
      console.log('  - ' + state + ': ' + count);
    }
    console.log();
  }

  console.log('CRITICAL ISSUES: ' + report.issues.critical.length);
  for (const issue of report.issues.critical) {
    console.log('  [CRITICAL] ' + issue.type + ': ' + issue.count + ' halaman');
  }
  console.log('\nWARNINGS: ' + report.issues.warnings.length);
  for (const issue of report.issues.warnings) {
    console.log('  [WARNING] ' + issue.type + ': ' + issue.count + ' halaman');
  }
  console.log('\nRECOMMENDATIONS:');
  for (const rec of report.recommendations) {
    console.log('  [' + rec.priority + '] ' + rec.action);
  }
  console.log('\nFull report:', REPORT_PATH);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
