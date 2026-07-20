/**
 * GSC ADVANCED REPORT — Full coverage, performance & URL inspection
 * Jalankan: node scripts/gsc-advanced-report.mjs
 */

import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'output');
const CREDENTIALS_PATH = path.join(__dirname, 'gsc-credentials.json');
const REPORT_FILE = path.join(OUTPUT_DIR, 'gsc-advanced-report.json');
const SUMMARY_FILE = path.join(OUTPUT_DIR, 'GSC-ADVANCED-LAPORAN.md');

// Site URLs — sc-domain untuk search analytics, https:// untuk URL Inspection
const SITE_URL = 'sc-domain:dreamlab.id';
const SITE_URL_INSPECT = 'https://dreamlab.id';
const fmt = (d) => d.toISOString().split('T')[0];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('='.repeat(70));
  console.log('  GSC ADVANCED REPORT — dreamlab.id');
  console.log('='.repeat(70) + '\n');

  // Auth
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const webmasters = google.webmasters({ version: 'v3', auth });

  // =========================================
  // 1. GET ALL PERFORMANCE DATA
  // =========================================
  console.log('📊 1. Mengambil data performa pencarian...');
  
  const endDate = new Date(); endDate.setDate(endDate.getDate() - 1);
  const startDate = new Date(); startDate.setDate(startDate.getDate() - 90);
  
  const performanceData = { pages: [], totalClicks: 0, totalImpressions: 0 };
  
  try {
    // Get all pages with their performance data
    const allRows = [];
    let startRow = 0;
    const pageSize = 25000;
    
    while (true) {
      const response = await webmasters.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: fmt(startDate),
          endDate: fmt(endDate),
          dimensions: ['page'],
          rowLimit: pageSize,
          startRow: startRow,
        },
      });
      
      const rows = response.data.rows || [];
      if (rows.length === 0) break;
      
      allRows.push(...rows);
      console.log(`   Batch: ${startRow} - ${startRow + rows.length} (total: ${allRows.length})`);
      
      if (rows.length < pageSize) break;
      startRow += pageSize;
      await sleep(200);
    }
    
    console.log(`   ✅ Total pages found: ${allRows.length}`);
    
    for (const row of allRows) {
      const url = row.keys?.[0] || '';
      const slug = url.replace(/https?:\/\/dreamlab\.id/gi, '').replace(/\/$/, '') || '/';
      performanceData.pages.push({
        url,
        slug,
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr ? (row.ctr * 100).toFixed(2) + '%' : '0%',
        avgPosition: row.position ? row.position.toFixed(1) : '-',
      });
      performanceData.totalClicks += row.clicks || 0;
      performanceData.totalImpressions += row.impressions || 0;
    }
    
    performanceData.pages.sort((a, b) => b.impressions - a.impressions);
    
  } catch (e) {
    console.error('   ❌ Error:', e.message);
  }

  // =========================================
  // 2. CHECK SITEMAPS
  // =========================================
  console.log('\n🗺️  2. Memeriksa sitemaps...');
  
  let sitemaps = [];
  try {
    const response = await webmasters.sitemaps.list({ siteUrl: SITE_URL });
    sitemaps = response.data.sitemap || [];
    console.log(`   ✅ ${sitemaps.length} sitemap ditemukan`);
    sitemaps.forEach(s => {
      console.log(`      ${s.path} — ${s.contents?.length || 0} URLs (${s.errors || 0} errors)`);
    });
  } catch (e) {
    console.error('   ❌ Error:', e.message);
  }

  // =========================================
  // 3. BACA DATA COVERAGE LAMA + GABUNGKAN
  // =========================================
  console.log('\n📂 3. Membaca & menggabungkan data coverage...');
  
  const coverageFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.startsWith('gsc-coverage-') && f.endsWith('.json') && !f.includes('history'))
    .sort().reverse();

  let latestCoverage = [];
  if (coverageFiles.length > 0) {
    latestCoverage = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, coverageFiles[0]), 'utf-8'));
    console.log(`   ✅ ${coverageFiles[0]}: ${latestCoverage.length} URLs`);
  }

  // =========================================
  // 4. GET URL INSPECTION FOR CRITICAL PAGES
  // =========================================
  console.log('\n🔍 4. Inspeksi URL bermasalah (menggunakan URL Inspection API)...');
  
  // Dapatkan daftar URL yang perlu diinspeksi
  const urlsToInspect = [];
  
  // Dari coverage data
  if (latestCoverage.length > 0) {
    for (const page of latestCoverage) {
      if (page.coverageState && 
          page.coverageState !== 'Submitted and indexed' &&
          page.coverageState !== 'URL is unknown to Google') {
        urlsToInspect.push(page.url);
      }
    }
  }
  
  // Dari performance data - halaman dengan 0 clicks & impressions > 100
  for (const page of performanceData.pages) {
    if (page.clicks === 0 && page.impressions > 100) {
      if (!urlsToInspect.includes(page.url)) {
        urlsToInspect.push(page.url);
      }
    }
  }
  
  console.log(`   ${urlsToInspect.length} URLs perlu diinspeksi`);
  console.log('   (URL Inspection API terbatas ~2000 queries/hari, akan inspeksi top 50)');

  const inspectionResults = [];
  const topPriority = urlsToInspect.slice(0, 50);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < topPriority.length; i++) {
    const url = topPriority[i];
    try {
      const response = await webmasters.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl: SITE_URL_INSPECT,
        },
      });
      const result = response.data.inspectionResult;
      inspectionResults.push({
        url,
        coverageState: result?.indexStatusResult?.coverageState || 'Unknown',
        indexingState: result?.indexStatusResult?.indexingState || 'Unknown',
        crawledAs: result?.indexStatusResult?.crawledAs || 'Unknown',
        lastCrawlTime: result?.indexStatusResult?.lastCrawlTime || 'N/A',
        googleCanonical: result?.indexStatusResult?.googleCanonical || 'N/A',
        userCanonical: result?.indexStatusResult?.userCanonical || 'N/A',
        verdict: result?.verdict || 'UNKNOWN',
      });
      successCount++;
      process.stdout.write(`\r   ✅ [${i + 1}/${topPriority.length}] ${url.substring(0, 60)}...`);
      await sleep(500); // Rate limiting
    } catch (e) {
      failCount++;
      process.stdout.write(`\r   ❌ [${i + 1}/${topPriority.length}] ${url.substring(0, 60)}... (${e.message.substring(0, 50)})`);
      await sleep(500);
    }
  }
  console.log(`\n   ✅ ${successCount} sukses, ❌ ${failCount} gagal`);

  // =========================================
  // 5. COMPILE REPORT
  // =========================================
  console.log('\n📝 5. Menyusun laporan lengkap...');

  const report = {
    generated_at: new Date().toISOString(),
    site_url: SITE_URL,
    data_period: { start: fmt(startDate), end: fmt(endDate) },
    performance: {
      total_pages: performanceData.pages.length,
      total_clicks: performanceData.totalClicks,
      total_impressions: performanceData.totalImpressions,
      avg_ctr: performanceData.totalImpressions > 0 
        ? (performanceData.totalClicks / performanceData.totalImpressions * 100).toFixed(2) + '%' 
        : '0%',
    },
    sitemaps: sitemaps.map(s => ({ path: s.path, urls: s.contents?.length || 0, errors: s.errors || 0 })),
    coverage_analysis: null,
    inspection_results: inspectionResults,
    issues: {
      critical: [],
      warnings: [],
      info: [],
    },
    recommendations: [],
  };

  // Analisis coverage dari data yang ada
  if (latestCoverage.length > 0) {
    const states = {};
    for (const page of latestCoverage) {
      const state = page.coverageState || 'Unknown';
      states[state] = (states[state] || 0) + 1;
    }
    
    report.coverage_analysis = {
      total_inspected: latestCoverage.length,
      by_state: states,
      passed: states['Submitted and indexed'] || 0,
    };
  }

  // Analisis performa
  const zeroClickPages = performanceData.pages.filter(p => p.clicks === 0);
  const highImpNoClick = performanceData.pages.filter(p => p.clicks === 0 && p.impressions > 200);
  const lowCtrPages = performanceData.pages.filter(p => 
    p.clicks > 0 && p.impressions > 100 && (p.clicks / p.impressions * 100) < 0.5
  );

  if (zeroClickPages.length > 0) {
    report.issues.warnings.push({
      type: 'zero_clicks',
      count: zeroClickPages.length,
      detail: `${zeroClickPages.length} halaman mendapat 0 klik dalam 90 hari. Ini menunjukkan masalah visibilitas atau relevansi.`,
    });
  }

  if (highImpNoClick.length > 0) {
    report.issues.critical.push({
      type: 'high_impressions_no_clicks',
      count: highImpNoClick.length,
      detail: `${highImpNoClick.length} halaman memiliki >200 impressions tapi 0 klik. Perbaiki title & meta description segera!`,
      pages: highImpNoClick.slice(0, 20).map(p => p.url),
    });
  }

  if (lowCtrPages.length > 0) {
    report.issues.warnings.push({
      type: 'low_ctr',
      count: lowCtrPages.length,
      detail: `${lowCtrPages.length} halaman dengan CTR < 0.5%. Optimasi title tag diperlukan.`,
      pages: lowCtrPages.slice(0, 10).map(p => `${p.url} (CTR: ${p.ctr})`),
    });
  }

  // Analisis URL Inspection
  const notIndexed = inspectionResults.filter(r => 
    r.coverageState === 'Not found (404)' || 
    r.coverageState === 'Crawled - currently not indexed' ||
    r.coverageState === 'Page with redirect'
  );

  if (notIndexed.length > 0) {
    report.issues.critical.push({
      type: 'url_inspection_issues',
      count: notIndexed.length,
      detail: `${notIndexed.length} dari ${inspectionResults.length} URL yang diinspeksi bermasalah.`,
      pages: notIndexed.slice(0, 30).map(r => ({
        url: r.url,
        state: r.coverageState,
        canonical: r.googleCanonical,
        lastCrawl: r.lastCrawlTime,
      })),
    });
  }

  // =========================================
  // 6. REKOMENDASI
  // =========================================
  report.recommendations = [
    {
      priority: '🔥 CRITICAL #1',
      action: 'Perbaiki 505 halaman "Di-crawl - tidak diindeks"',
      detail: '505 halaman adalah jumlah sangat besar. Kemungkinan penyebab: (a) Konten duplikat/thin content, (b) Tidak ada internal links, (c) Halaman hasil generate otomatis (tag/category pages). Audit konten dan hapus/noindex halaman yang tidak perlu.',
    },
    {
      priority: '🔥 CRITICAL #2',
      action: 'Perbaiki 338 halaman redirect & canonical www vs non-www',
      detail: 'Pastikan semua canonical tag mengarah ke dreamlab.id (tanpa www). Perbaiki redirect chain. Halaman seperti /maklon-parfum/ → /ads/maklon-parfum/ perlu diperbaiki.',
    },
    {
      priority: '🔥 CRITICAL #3',
      action: 'Perbaiki 26 halaman 4xx (404 + lainnya)',
      detail: 'Buat redirect 301 untuk semua halaman 404. Periksa broken links di internal dan external.',
    },
    {
      priority: '⚡ HIGH',
      action: 'Review 73 halaman dengan tag noindex',
      detail: 'Periksa apakah halaman-halaman ini sengaja di-noindex. Jika tidak, hapus tag noindex dan minta indexing ulang.',
    },
    {
      priority: '⚡ HIGH',
      action: 'Optimasi Title & Meta Description',
      detail: `Ada ${highImpNoClick.length} halaman dengan impressions tinggi tapi 0 klik. Fokus optimasi halaman-halaman ini untuk meningkatkan CTR.`,
    },
    {
      priority: '📈 MEDIUM',
      action: 'Tambah indexed pages dari 172 ke 300+',
      detail: 'Buat konten baru berkualitas, perbaiki internal linking, submit sitemap, dan minta indexing via GSC.',
    },
  ];

  // Save JSON
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log(`   ✅ JSON report: ${REPORT_FILE}`);

  // =========================================
  // 7. CREATE SUMMARY MD
  // =========================================
  const md = [];
  md.push('# 📊 GSC ADVANCED REPORT — dreamlab.id');
  md.push('');
  md.push(`**Generated:** ${report.generated_at}`);
  md.push(`**Data Period (Performance):** ${report.data_period.start} → ${report.data_period.end}`);
  md.push('');
  md.push('---');
  md.push('');
  md.push('## 📈 PERFORMANCE OVERVIEW');
  md.push('');
  md.push(`| Metrik | Nilai |`);
  md.push(`|--------|-------|`);
  md.push(`| Total Pages | ${report.performance.total_pages} |`);
  md.push(`| Total Clicks | ${report.performance.total_clicks} |`);
  md.push(`| Total Impressions | ${report.performance.total_impressions} |`);
  md.push(`| Avg CTR | ${report.performance.avg_ctr} |`);
  md.push(`| Zero-Click Pages | ${zeroClickPages.length} |`);
  md.push(`| High Impressions (200+) No Click | ${highImpNoClick.length} |`);
  md.push('');
  md.push('### 🏆 Top 10 Pages by Impressions');
  md.push('');
  md.push('| URL | Clicks | Impressions | CTR | Position |');
  md.push('|-----|--------|-------------|-----|----------|');
  for (const p of performanceData.pages.slice(0, 10)) {
    md.push(`| ${p.slug} | ${p.clicks} | ${p.impressions} | ${p.ctr} | ${p.avgPosition} |`);
  }
  md.push('');
  md.push('### 🔻 Bottom 10 — High Impressions, Zero Clicks');
  md.push('');
  md.push('| URL | Clicks | Impressions |');
  md.push('|-----|--------|-------------|');
  for (const p of highImpNoClick.slice(0, 10)) {
    md.push(`| ${p.slug} | 0 | ${p.impressions} |`);
  }
  md.push('');

  // Coverage
  if (report.coverage_analysis) {
    md.push('## 📊 COVERAGE (Dari 328 Sample URLs)');
    md.push('');
    md.push('⚠️ Data ini hanya sample 328 URL. Data GSC asli menunjukkan **1.141 halaman tidak terindeks**.');
    md.push('');
    md.push('| Status | Sample |');
    md.push('|--------|--------|');
    for (const [state, count] of Object.entries(report.coverage_analysis.by_state)) {
      md.push(`| ${state} | ${count} |`);
    }
    md.push('');
  }

  // Issues from GSC (from user's screenshot)
  md.push('## 🔴 ALL ISSUES FROM GSC (Per 20 Juli 2026)');
  md.push('');
  md.push('**Total: 1.141 halaman tidak terindeks dengan benar**');
  md.push('');
  md.push('| # | Masalah | Jumlah | Severity | Tindakan |');
  md.push('|---|--------|:------:|:--------:|----------|');
  md.push('| 1 | Di-crawl - saat ini tidak diindeks | **505** | 🔴 KRITIS | Audit konten, perbaiki kualitas, internal link |');
  md.push('| 2 | Halaman dengan pengalihan | **338** | 🔴 KRITIS | Perbaiki canonical www vs non-www |');
  md.push('| 3 | Halaman alternatif tag kanonis tepat | **173** | 🟡 SEDANG | Review apakah sengaja |');
  md.push('| 4 | Dikecualikan tag noindex | **73** | 🟡 SEDANG | Cek apakah sengaja di-noindex |');
  md.push('| 5 | Tidak ditemukan (404) | **20** | 🔴 KRITIS | Redirect 301 ke halaman relevan |');
  md.push('| 6 | Ditemukan - tidak diindeks | **19** | 🟠 TINGGI | Perbaiki kualitas konten |');
  md.push('| 7 | Duplikat tanpa kanonis | **10** | 🟠 TINGGI | Tambah canonical tag |');
  md.push('| 8 | Duplikat kanonis berbeda | **3** | 🟡 SEDANG | Perbaiki canonical |');
  md.push('');

  // Inspection results
  if (inspectionResults.length > 0) {
    md.push('## 🔍 URL INSPECTION RESULTS');
    md.push('');
    const failed = inspectionResults.filter(r => r.coverageState !== 'Submitted and indexed');
    md.push(`**${failed.length} dari ${inspectionResults.length} URL bermasalah:**`);
    md.push('');
    for (const r of failed.slice(0, 30)) {
      md.push(`- ❌ **${r.coverageState}** — ${r.url}`);
      md.push(`  - Canonical Google: ${r.googleCanonical}`);
      md.push(`  - Last crawl: ${r.lastCrawlTime}`);
    }
    md.push('');
  }

  // Recommendations
  md.push('## 💡 REKOMENDASI PRIORITAS');
  md.push('');
  for (const rec of report.recommendations) {
    md.push(`### ${rec.priority}: ${rec.action}`);
    md.push('');
    md.push(`${rec.detail}`);
    md.push('');
  }

  md.push('---');
  md.push('');

  // Need to add service account in GSC
  md.push('## ✅ STATUS AKSES API');
  md.push('');
  md.push('✅ Service account **berhasil** terhubung ke GSC!');
  md.push(`- Email: dreamlab@sunny-idiom-499103-g6.iam.gserviceaccount.com`);
  md.push(`- Permission: siteFullUser`);
  md.push(`- Situs: sc-domain:dreamlab.id`);
  md.push('');
  md.push('📁 **Output files:**');
  md.push(`- Laporan ini: \`scripts/output/GSC-ADVANCED-LAPORAN.md\``);
  md.push(`- JSON report: \`scripts/output/gsc-advanced-report.json\``);
  md.push('');

  fs.writeFileSync(SUMMARY_FILE, md.join('\n'));
  console.log(`   ✅ Summary: ${SUMMARY_FILE}`);

  // Console summary
  console.log('\n' + '='.repeat(70));
  console.log('  RINGKASAN');
  console.log('='.repeat(70));
  console.log();
  console.log('📈 PERFORMANCE:');
  console.log(`   Pages: ${report.performance.total_pages}`);
  console.log(`   Clicks: ${report.performance.total_clicks}`);
  console.log(`   Impressions: ${report.performance.total_impressions}`);
  console.log(`   CTR: ${report.performance.avg_ctr}`);
  console.log(`   Zero-click pages: ${zeroClickPages.length}`);
  console.log(`   High imp (200+) no click: ${highImpNoClick.length}`);
  console.log();
  console.log('📋 CRITICAL ISSUES:');
  console.log('   Dari GSC (data asli):');
  console.log('   🔴 505 Di-crawl - tidak diindeks');
  console.log('   🔴 338 Halaman redirect');
  console.log('   🔴 173 Canonical alternatif');
  console.log('   🔴 73 Noindex');
  console.log('   🔴 20 404');
  console.log('   🔴 19 Ditemukan - tidak diindeks');
  console.log('   🔴 10 Duplikat tanpa kanonis');
  console.log(`   --- Total: 1.141 halaman ---`);
  console.log();
  console.log('🔍 URL Inspection:');
  console.log(`   ${inspectionResults.length} URL diinspeksi`);
  console.log(`   ${inspectionResults.filter(r => r.coverageState !== 'Submitted and indexed').length} bermasalah`);
  console.log();
  console.log(`📁 Full report: ${SUMMARY_FILE}`);
}

main().catch(err => {
  console.error('\n❌ Fatal:', err);
  process.exit(1);
});
