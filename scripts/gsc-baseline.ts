/**
 * GSC BASELINE — 2 Cara:
 *
 * A. MANUAL EXPORT (5 menit, tanpa API):
 *    1. Buka https://search.google.com/search-console → dreamlab.id
 *    2. Performance → Date: Last 3 months → Export → Download CSV
 *    3. Simpan sebagai: scripts/output/gsc-manual-export.csv
 *    4. Jalankan: npx tsx scripts/gsc-baseline.ts
 *
 * B. API OTOMATIS (butuh setup):
 *    1. Google Cloud Console → Enable "Google Search Console API"
 *    2. Credentials → Service Account → download JSON
 *    3. Simpan sebagai: scripts/gsc-credentials.json
 *    4. Tambah service account email ke GSC sebagai Owner
 *    5. npm install googleapis (tambahkan dependency)
 *    6. Jalankan: npx tsx scripts/gsc-baseline.ts
 */

import fs from 'fs';
import path from 'path';
import './lib/env-loader';

const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'output');

function processManualExport(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n').filter(Boolean);

  if (lines.length < 2) {
    console.log('❌ CSV file is empty or has no data rows');
    return;
  }

  // Parse headers (GSC export has: Query, Page, Clicks, Impressions, CTR, Position)
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const idx = (name: string) => headers.findIndex(h => h.includes(name));
  
  const pageIdx = idx('page') !== -1 ? idx('page') : 1;
  const clicksIdx = idx('click') !== -1 ? idx('click') : 2;
  const impIdx = idx('impression') !== -1 ? idx('impression') : 3;
  const ctrIdx = idx('ctr') !== -1 ? idx('ctr') : 4;
  const posIdx = idx('position') !== -1 ? idx('position') : 5;

  // Aggregate by page
  const pageStats = new Map<string, { clicks: number; impressions: number; sumPos: number; queries: Set<string> }>();

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/"/g, ''));
    const page = cols[pageIdx] || '';
    if (!page || page === 'page' || page.toLowerCase().includes('total')) continue;

    const slug = page.replace(/https?:\/\/dreamlab\.id/gi, '').replace(/\/$/, '') || '/';
    const clicks = parseInt(cols[clicksIdx]) || 0;
    const impressions = parseInt(cols[impIdx]) || 0;
    const position = parseFloat(cols[posIdx]) || 0;
    const query = cols[0] || '';

    if (!pageStats.has(slug)) {
      pageStats.set(slug, { clicks: 0, impressions: 0, sumPos: 0, queries: new Set() });
    }
    const s = pageStats.get(slug)!;
    s.clicks += clicks;
    s.impressions += impressions;
    s.sumPos += position * impressions;
    if (query) s.queries.add(query);
  }

  // Generate summary
  let totalClicks = 0, totalImpressions = 0;
  const topPages = [];
  for (const [slug, stats] of pageStats) {
    totalClicks += stats.clicks;
    totalImpressions += stats.impressions;
    topPages.push({
      slug,
      clicks: stats.clicks,
      impressions: stats.impressions,
      ctr: ((stats.clicks / Math.max(stats.impressions, 1)) * 100).toFixed(2) + '%',
      position: stats.impressions > 0 ? (stats.sumPos / stats.impressions).toFixed(1) : '-',
      queries: stats.queries.size,
    });
  }
  topPages.sort((a, b) => b.clicks - a.clicks);

  const summary = {
    export_date: new Date().toISOString(),
    source: 'manual_export',
    total_pages: pageStats.size,
    total_clicks: totalClicks,
    total_impressions: totalImpressions,
    avg_ctr: ((totalClicks / Math.max(totalImpressions, 1)) * 100).toFixed(2) + '%',
    top_20_pages: topPages.slice(0, 20),
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc-baseline-summary.json'), JSON.stringify(summary, null, 2));

  console.log('\n=== GSC BASELINE REPORT ===');
  console.log(`📊 Pages with data: ${pageStats.size}`);
  console.log(`🖱️  Total clicks: ${totalClicks}`);
  console.log(`👁️  Total impressions: ${totalImpressions}`);
  console.log(`📈 Avg CTR: ${summary.avg_ctr}`);
  console.log('\n🏆 Top 10 pages by clicks:');
  topPages.slice(0, 10).forEach((p, i) => {
    console.log(`  ${(i+1).toString().padStart(2)}. ${p.clicks.toString().padStart(5)} clicks | ${p.impressions.toString().padStart(6)} imp | pos ${p.position.padStart(4)} | CTR ${p.ctr.padStart(5)} → ${p.slug}`);
  });

  if (topPages.length > 10) {
    console.log(`  ... and ${topPages.length - 10} more pages`);
  }

  console.log(`\n📁 Full report: scripts/output/gsc-baseline-summary.json`);
}

async function main() {
  console.log('=== GSC Baseline ===\n');

  // Try manual export first
  const manualPath = path.join(OUTPUT_DIR, 'gsc-manual-export.csv');
  if (fs.existsSync(manualPath)) {
    console.log('✅ Manual export found. Processing...\n');
    processManualExport(manualPath);
    return;
  }

  // Try API
  const credentialsPath = path.join(process.cwd(), 'scripts', 'gsc-credentials.json');
  if (fs.existsSync(credentialsPath)) {
    console.log('✅ API credentials found. Using API...');
    try {
      // Dynamic import so no error if googleapis not installed
      const { google } = await import('googleapis');
      const auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
      });
      const webmasters = google.webmasters({ version: 'v3', auth });
      
      const endDate = new Date(); endDate.setDate(endDate.getDate() - 1);
      const startDate = new Date(); startDate.setDate(startDate.getDate() - 90);
      const fmt = (d: Date) => d.toISOString().split('T')[0];

      const response = await webmasters.searchanalytics.query({
        siteUrl: 'sc-domain:dreamlab.id',
        requestBody: {
          startDate: fmt(startDate),
          endDate: fmt(endDate),
          dimensions: ['page', 'query'],
          rowLimit: 25000,
        },
      });

      const rows = response.data.rows || [];
      console.log(`   Total rows: ${rows.length}`);

      // Reuse manual export processor by building CSV first
      const csvLines = ['Query,Page,Clicks,Impressions,CTR,Position'];
      for (const row of rows) {
        const query = (row.keys?.[1] || '').replace(/,/g, ' ');
        const page = row.keys?.[0] || '';
        csvLines.push(`"${query}","${page}",${row.clicks || 0},${row.impressions || 0},${((row.ctr || 0) * 100).toFixed(2)},${(row.position || 0).toFixed(1)}`);
      }
      const tmpPath = path.join(OUTPUT_DIR, 'gsc-manual-export.csv');
      fs.writeFileSync(tmpPath, csvLines.join('\n'), 'utf-8');
      processManualExport(tmpPath);

    } catch (err: any) {
      console.error('❌ API Error:', err.message);
      console.log('\nTry manual export instead (see instructions above)');
    }
    return;
  }

  // No data found — show instructions
  console.log('⚠️  No GSC data found.\n');
  console.log('📋 CARA TERMUDAH — Manual Export (5 menit, tanpa API):');
  console.log('   1. Buka https://search.google.com/search-console');
  console.log('   2. Pilih property: dreamlab.id');
  console.log('   3. Performance → Date range: Last 3 months');
  console.log('   4. Klik "Export" (top-right) → "Download CSV"');
  console.log(`   5. Simpan sebagai: ${manualPath}`);
  console.log('   6. Jalankan ulang: npx tsx scripts/gsc-baseline.ts\n');

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const instructionPath = path.join(OUTPUT_DIR, 'GSC_INSTRUCTIONS.txt');
  fs.writeFileSync(instructionPath, `GSC Manual Export (5 menit)
===============================
1. Buka https://search.google.com/search-console
2. Pilih property: dreamlab.id
3. Tab: Performance → Search results
4. Date range: Last 3 months (atau 90 hari)
5. Klik "Export" → "Download CSV"
6. Simpan file sebagai: scripts/output/gsc-manual-export.csv
7. Jalankan ulang: npx tsx scripts/gsc-baseline.ts

Atau, untuk API key:
1. Buka https://console.cloud.google.com/
2. Enable "Google Search Console API"
3. Buat Service Account → download JSON key
4. Simpan sebagai: scripts/gsc-credentials.json
5. Tambah service account email ke GSC sebagai Owner
6. npm install googleapis
7. Jalankan: npx tsx scripts/gsc-baseline.ts
`);
  console.log(`📁 Instructions saved to: ${instructionPath}`);
}

main().catch(console.error);
