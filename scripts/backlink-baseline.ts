/**
 * BACKLINK BASELINE — 3 approaches:
 *
 * A. BING WEBMASTER TOOLS (GRATIS!) — Recommended
 *    1. Buka https://www.bing.com/webmasters/
 *    2. Add site: dreamlab.id → verify ownership
 *    3. Dashboard → "Backlinks" → Export CSV
 *    4. Simpan sebagai: scripts/output/bing-backlinks-export.csv
 *    5. Jalankan: npx tsx scripts/backlink-baseline.ts
 *
 *    Atau via API:
 *    1. Bing Webmaster Tools → Settings → API Access → Generate Key
 *    2. Set: $env:BING_API_KEY="your-key"
 *    3. Jalankan: npx tsx scripts/backlink-baseline.ts
 *
 * B. MANUAL EXPORT (tool lain):
 *    - Ubersuggest: https://neilpatel.com/ubersuggest/
 *    - Moz Link Explorer: https://moz.com/link-explorer
 *    - Ahrefs Webmaster Tools: https://ahrefs.com/webmaster-tools (gratis)
 *
 * C. MANUAL INPUT:
 *    Buat file: scripts/output/manual-backlinks.csv dengan format:
 *    source_url,target_url,domain_rating
 */

import fs from 'fs';
import path from 'path';
import './lib/env-loader';

const DOMAIN = 'dreamlab.id';
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'output');

async function fetchBingApi() {
  const apiKey = process.env.BING_API_KEY;
  if (!apiKey) return null;

  console.log('   Fetching Bing Webmaster API...');
  try {
    // Bing API: get backlinks
    // API v1 endpoint
    const backlinksUrl = `https://ssl.bing.com/webmasterapi.svc/json/GetBacklinks?siteUrl=${encodeURIComponent('https://' + DOMAIN)}`;
    const response = await fetch(backlinksUrl, {
      headers: { 'api_key': apiKey },
      signal: AbortSignal.timeout(15000),
    });
    
    if (!response.ok) {
      console.log(`   ⚠️ Bing API returned ${response.status} (may need different API endpoint)`);
      // Try v3 API
      try {
        const v3Url = `https://api.bing.microsoft.com/v7.0/sites/${DOMAIN}/backlinks`;
        const v3Res = await fetch(v3Url, {
          headers: { 'Ocp-Apim-Subscription-Key': apiKey },
          signal: AbortSignal.timeout(10000),
        });
        if (v3Res.ok) {
          const v3Data = await v3Res.json() as any;
          return {
            source: 'bing_api_v3',
            total_backlinks: v3Data?.value?.length || null,
          };
        }
      } catch {}
      return null;
    }

    const data = await response.json() as any;
    return {
      source: 'bing_api',
      total_backlinks: data?.d?.BacklinkCount || null,
      total_domains: data?.d?.DomainCount || null,
      top_backlinks: (data?.d?.Backlinks || []).slice(0, 20).map((b: any) => ({
        source_url: b.SourceUrl,
        anchor_text: b.AnchorText,
      })),
    };
  } catch (err: any) {
    console.log(`   ⚠️ Bing API error: ${err.message}`);
    return null;
  }
}

function processManualExport(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return null;

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Try to detect columns (varies by export format)
  const sourceIdx = headers.findIndex(h => h.includes('source') || h.includes('url') || h.includes('domain'));
  const anchorIdx = headers.findIndex(h => h.includes('anchor') || h.includes('text'));

  const backlinks = [];
  for (let i = 1; i < Math.min(lines.length, 50); i++) {
    const cols = lines[i].split(',');
    if (sourceIdx >= 0) {
      backlinks.push({
        source: cols[sourceIdx]?.trim() || '',
        anchor: anchorIdx >= 0 ? cols[anchorIdx]?.trim() : '',
      });
    }
  }

  return {
    source: 'manual_export',
    file: filePath,
    backlinks_found: backlinks.length,
    sample_backlinks: backlinks.slice(0, 10),
  };
}

async function main() {
  console.log('=== Backlink Baseline ===\n');
  console.log(`Target domain: ${DOMAIN}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  let result: any = null;

  // 1. Try Bing API first
  console.log('1. Checking Bing Webmaster Tools API...');
  result = await fetchBingApi();
  if (result) console.log('   ✅ Bing API connected\n');
  else console.log('   ⏭️  No BING_API_KEY set\n');

  // 2. Try manual export files
  if (!result) {
    console.log('2. Checking manual export files...');
    const possibleFiles = [
      'bing-backlinks-export.csv',
      'bing-webmaster-export.csv',
      'backlinks-export.csv',
      'manual-backlinks.csv',
    ];
    
    for (const file of possibleFiles) {
      const filePath = path.join(OUTPUT_DIR, file);
      if (fs.existsSync(filePath)) {
        console.log(`   Found: ${file}`);
        result = processManualExport(filePath);
        if (result) {
          console.log(`   ✅ Processed ${result.backlinks_found} backlinks\n`);
          break;
        }
      }
    }
  }

  // 3. Try Bing Webmaster Tools organic search data
  if (process.env.BING_API_KEY) {
    console.log('3. Fetching Bing organic search performance...');
    try {
      const perfUrl = `https://ssl.bing.com/webmasterapi.svc/json/GetSearchPerformance?siteUrl=${encodeURIComponent('https://' + DOMAIN)}&format=json`;
      const perfRes = await fetch(perfUrl, {
        headers: { 'api_key': process.env.BING_API_KEY },
        signal: AbortSignal.timeout(15000),
      });
      if (perfRes.ok) {
        const perfData = await perfRes.json() as any;
        result = {
          ...(result || {}),
          bing_search_data: {
            total_clicks: perfData?.d?.TotalClicks || null,
            total_impressions: perfData?.d?.TotalImpressions || null,
            avg_ctr: perfData?.d?.AverageCTR ? (perfData.d.AverageCTR * 100).toFixed(2) + '%' : null,
            avg_position: perfData?.d?.AveragePosition?.toFixed(1) || null,
          },
        };
        console.log('   ✅ Search performance data fetched\n');
      }
    } catch (err: any) {
      console.log(`   ⚠️ Search performance error: ${err.message}\n`);
    }
  }

  // 4. Save & display results
  if (result) {
    fs.writeFileSync(path.join(OUTPUT_DIR, 'backlink-baseline.json'), JSON.stringify(result, null, 2));
    
    console.log('\n=== BACKLINK & SEARCH BASELINE ===');
    if (result.total_backlinks) console.log(`🔗 Total backlinks: ${result.total_backlinks}`);
    if (result.total_domains) console.log(`🌐 Referring domains: ${result.total_domains}`);
    if (result.bing_search_data) {
      console.log('\n📊 Bing Search Performance:');
      if (result.bing_search_data.total_clicks !== null) console.log(`   🖱️  Clicks: ${result.bing_search_data.total_clicks}`);
      if (result.bing_search_data.total_impressions !== null) console.log(`   👁️  Impressions: ${result.bing_search_data.total_impressions}`);
      if (result.bing_search_data.avg_ctr) console.log(`   📈 CTR: ${result.bing_search_data.avg_ctr}`);
      if (result.bing_search_data.avg_position) console.log(`   🎯 Avg Position: ${result.bing_search_data.avg_position}`);
    }
    if (result.sample_backlinks && result.sample_backlinks.length > 0) {
      console.log('\n🔗 Sample backlinks:');
      result.sample_backlinks.forEach((b: any) => console.log(`   ${b.source || b.source_url} → ${b.anchor_text || '(no anchor)'}`));
    }
    console.log(`\n📁 Report saved: scripts/output/backlink-baseline.json`);
  } else {
    console.log('⚠️  No data found.\n');
    console.log('📋 CARA TERMUDAH — Bing Webmaster Tools (GRATIS):');
    console.log('   1. Buka https://www.bing.com/webmasters/');
    console.log('   2. Add site → Verify ownership');
    console.log('   3. Dashboard → "Backlinks" → Export');
    console.log('   4. Simpan sebagai: scripts/output/bing-backlinks-export.csv');
    console.log('   5. Jalankan ulang: npx tsx scripts/backlink-baseline.ts\n');
    console.log('   Atau via API:');
    console.log('   1. Bing Webmaster Tools → Settings → API Access → Generate Key');
    console.log('   2. Set: $env:BING_API_KEY="your-key"');
    console.log('   3. Jalankan ulang\n');

    const instructions = `BING WEBMASTER TOOLS SETUP (GRATIS)
====================================
CARA 1: Manual Export
1. Buka https://www.bing.com/webmasters/
2. Add site: dreamlab.id → Verify (meta tag or DNS)
3. Dashboard → "Backlinks" → Export CSV
4. Simpan sebagai: scripts/output/bing-backlinks-export.csv

CARA 2: API (untuk otomatisasi)
1. Bing Webmaster Tools → Settings → API Access
2. Generate API Key
3. Set environment: $env:BING_API_KEY="your-key"
4. Jalankan: npx tsx scripts/backlink-baseline.ts
`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'BING_INSTRUCTIONS.txt'), instructions);
    console.log(`📁 Instructions saved to: scripts/output/BING_INSTRUCTIONS.txt`);
  }
}

main().catch(console.error);
