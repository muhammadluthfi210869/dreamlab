import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import https from 'https';

const SITE_URL = 'sc-domain:dreamlab.id';
const CREDENTIALS_PATH = path.join(process.cwd(), 'scripts', 'gsc-credentials.json');
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'output');
const HISTORY_FILE = path.join(OUTPUT_DIR, 'gsc-coverage-history.json');

interface CoverageResult {
  url: string;
  inspectedAt: string;
  verdict: string;
  coverageState: string;
  indexingState: string;
  robotsTxtState: string;
  pageFetchState: string;
  canonical: string;
  crawledAs: string;
  lastCrawlTime: string;
  mobileUsability: string;
}

interface HistoryEntry {
  timestamp: string;
  date: string;
  totalInspected: number;
  passed: number;
  failed: number;
  warning: number;
  pages: CoverageResult[];
}

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  return await auth.getClient();
}

async function getPages(client: any): Promise<string[]> {
  const webmasters = google.webmasters({ version: 'v3', auth: client });
  const pages = new Set<string>();

  let startRow = 0;
  while (true) {
    const res = await webmasters.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: '2026-03-01',
        endDate: '2026-06-01',
        dimensions: ['page'],
        rowLimit: 25000,
        startRow,
      },
    });
    const rows = res.data.rows || [];
    if (rows.length === 0) break;
    for (const row of rows) {
      if (row.keys?.[0]) pages.add(row.keys[0]);
    }
    if (rows.length < 25000) break;
    startRow += 25000;
  }

  return Array.from(pages).sort();
}

async function inspectUrl(token: string, url: string): Promise<CoverageResult | null> {
  try {
    const data = JSON.stringify({
      siteUrl: 'sc-domain:dreamlab.id',
      inspectionUrl: url,
    });

    const response = await new Promise<string>((resolve, reject) => {
      const req = https.request({
        hostname: 'searchconsole.googleapis.com',
        path: '/v1/urlInspection/index:inspect',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => resolve(body));
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });

    const parsed = JSON.parse(response);
    if (parsed.error) {
      console.error(`   ❌ API error for ${url}: ${parsed.error.message}`);
      return null;
    }

    const r = parsed.inspectionResult;
    if (!r) return null;

    const idx = r.indexStatusResult || {};
    return {
      url,
      inspectedAt: new Date().toISOString(),
      verdict: (r.verdict || idx.verdict || 'UNKNOWN').toUpperCase(),
      coverageState: idx.coverageState || 'N/A',
      indexingState: idx.indexingState || 'N/A',
      robotsTxtState: idx.robotsTxtState || 'N/A',
      pageFetchState: idx.pageFetchState || 'N/A',
      canonical: idx.googleCanonical || idx.userCanonical || url,
      crawledAs: idx.crawledAs || 'N/A',
      lastCrawlTime: idx.lastCrawlTime || 'N/A',
      mobileUsability: r.mobileUsabilityResult?.verdict || 'N/A',
    };
  } catch (e: any) {
    console.error(`   ❌ Error inspecting ${url}: ${e.message}`);
    return null;
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('🔍 GSC COVERAGE MONITOR');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━\n');

  const startTime = Date.now();

  // 1. Auth
  console.log('🔑 Authenticating...');
  const client = await getAuthClient();
  const tokenRes = await client.getAccessToken();
  const token = tokenRes.token;
  console.log('   ✅ Authenticated\n');

  // 2. Get pages
  console.log('📄 Fetching pages from Search Analytics...');
  const pages = await getPages(client);
  console.log(`   ✅ ${pages.length} unique pages found\n`);

  if (pages.length === 0) {
    console.log('No pages to inspect.');
    return;
  }

  // 3. Inspect all URLs
  console.log('🔎 Inspecting URLs...');
  const results: CoverageResult[] = [];
  const batchSize = 5;

  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(url => inspectUrl(token!, url))
    );

    for (const r of batchResults) {
      if (r) results.push(r);
    }

    const done = Math.min(i + batchSize, pages.length);
    process.stdout.write(`\r   Progress: ${done}/${pages.length} (${((done / pages.length) * 100).toFixed(0)}%)`);

    if (i + batchSize < pages.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // 4. Categorize
  const passed = results.filter(r => r.verdict === 'PASS');
  const failed = results.filter(r => r.verdict === 'FAIL');
  const warning = results.filter(r => r.verdict === 'WARNING' || r.verdict === 'VERDICT_UNSPECIFIED');

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  const total = results.length;

  console.log('\n');

  // 5. Save report
  const dateStr = new Date().toISOString().split('T')[0];
  const reportFile = path.join(OUTPUT_DIR, `gsc-coverage-${dateStr}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));

  const history: HistoryEntry[] = fs.existsSync(HISTORY_FILE)
    ? JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'))
    : [];
  history.push({
    timestamp: new Date().toISOString(),
    date: dateStr,
    totalInspected: total,
    passed: passed.length,
    failed: failed.length,
    warning: warning.length,
    pages: results,
  });
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));

  // 6. Report
  console.log('\n═══════════════════════════════════════════');
  console.log('   GSC COVERAGE MONITOR REPORT');
  console.log(`   ${dateStr}`);
  console.log('═══════════════════════════════════════════\n');

  console.log(`📊 Summary:`);
  console.log(`   Total URLs inspected : ${total}/${pages.length}`);
  console.log(`   ✅ Passed (indexed)  : ${passed.length} (${((passed.length / total) * 100).toFixed(1)}%)`);
  console.log(`   ❌ Failed (errors)   : ${failed.length}`);
  console.log(`   ⚠  Warnings          : ${warning.length}`);
  console.log(`   ⏱  Duration          : ${elapsed}s\n`);

  // Coverage state breakdown
  const breakdown = new Map<string, number>();
  for (const r of results) {
    breakdown.set(r.coverageState, (breakdown.get(r.coverageState) || 0) + 1);
  }
  console.log('📈 Coverage State:');
  const sorted = Array.from(breakdown.entries()).sort((a, b) => b[1] - a[1]);
  for (const [state, count] of sorted) {
    const pct = ((count / total) * 100).toFixed(1);
    console.log(`   ${state.padEnd(45)} ${count.toString().padStart(4)} (${pct}%)`);
  }

  if (failed.length > 0) {
    console.log(`\n❌ FAILED PAGES:`);
    for (const f of failed) {
      console.log(`   • ${f.url}`);
      console.log(`     Coverage: ${f.coverageState} | Fetch: ${f.pageFetchState} | Robots: ${f.robotsTxtState}`);
    }
  }

  console.log(`\n💾 Saved: ${reportFile}`);
  console.log(`💾 History: ${HISTORY_FILE} (${history.length} snapshots)`);
}

main().catch(console.error);
