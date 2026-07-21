import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'output');
const ADVANCED_REPORT = path.join(OUTPUT_DIR, 'gsc-advanced-report.json');
const COVERAGE_FILE = path.join(OUTPUT_DIR, 'gsc-coverage-2026-07-13.json');
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_JSON = path.join(OUTPUT_DIR, `gsc-live-verification-${TODAY}.json`);
const OUT_MD = path.join(OUTPUT_DIR, `GSC-LIVE-VERIFICATION-${TODAY}.md`);

const TIMEOUT_MS = 8000;

function normalizeUrl(url) {
  const clean = String(url || '').split('#')[0].trim();
  return clean.endsWith('/') ? clean : `${clean}/`;
}

function issueName(state) {
  if (!state) return 'Unknown';
  return state.replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
}

async function fetchLive(url) {
  const target = normalizeUrl(url);
  const result = {
    url: target,
    initialStatus: 0,
    redirectLocation: null,
    finalStatus: 0,
    finalUrl: null,
    canonical: null,
    robots: null,
    title: null,
    h1: null,
    error: null,
  };

  try {
    const manual = await fetch(target, {
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; DreamlabSEOAudit/1.0)' },
    });
    result.initialStatus = manual.status;
    result.redirectLocation = manual.headers.get('location');

    const final = await fetch(target, {
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; DreamlabSEOAudit/1.0)' },
    });
    result.finalStatus = final.status;
    result.finalUrl = final.url;

    const html = await final.text();
    result.canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1]
      || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
      || null;
    result.robots = html.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["']/i)?.[1] || null;
    result.title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || null;
    result.h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || null;
  } catch (error) {
    result.error = error.message;
  }

  return result;
}

function classify(row) {
  const live = row.live;
  const gscState = issueName(row.gsc.coverageState);
  const problems = [];

  if (live.error) problems.push('live_fetch_failed');
  if (live.finalStatus >= 400 || live.initialStatus >= 400) problems.push('still_4xx_or_5xx');
  if (live.initialStatus >= 300 && live.initialStatus < 400) problems.push('live_redirect');
  if (live.robots && /noindex/i.test(live.robots)) problems.push('live_noindex');

  const finalUrl = live.finalUrl ? normalizeUrl(live.finalUrl) : null;
  const canonical = live.canonical ? normalizeUrl(live.canonical) : null;
  if (finalUrl && canonical && finalUrl !== canonical) problems.push('live_canonical_mismatch');

  if (problems.length === 0 && gscState !== 'Submitted and indexed') {
    return {
      status: 'FIX_LOOKS_OK_WAITING_RECRAWL',
      problems,
      note: `Live page looks indexable now, but GSC snapshot still says "${gscState}".`,
    };
  }

  if (problems.length === 0) {
    return { status: 'OK_NOW', problems, note: 'Live page is indexable and GSC snapshot is indexed.' };
  }

  return {
    status: 'STILL_NEEDS_FIX',
    problems,
    note: `Live page still has ${problems.join(', ')}.`,
  };
}

async function main() {
  const advanced = JSON.parse(fs.readFileSync(ADVANCED_REPORT, 'utf8'));
  const coverage = JSON.parse(fs.readFileSync(COVERAGE_FILE, 'utf8'));

  const problemCoverage = coverage
    .filter((row) => issueName(row.coverageState) !== 'Submitted and indexed' && issueName(row.coverageState) !== 'URL is unknown to Google')
    .sort((a, b) => issueName(a.coverageState).localeCompare(issueName(b.coverageState)));

  const highImpNoClick = advanced.issues?.critical?.find((item) => item.type === 'high_impressions_no_clicks')?.pages || [];
  const lowCtr = (advanced.issues?.warnings?.find((item) => item.type === 'low_ctr')?.pages || [])
    .map((text) => text.split(' (CTR:')[0]);

  const priorityUrls = [...new Set([
    ...problemCoverage.map((row) => row.url),
    ...highImpNoClick.map(normalizeUrl),
    ...lowCtr.map(normalizeUrl),
  ])].slice(0, 120);

  const liveResults = [];
  const concurrency = 24;
  for (let i = 0; i < priorityUrls.length; i += concurrency) {
    const batch = priorityUrls.slice(i, i + concurrency);
    liveResults.push(...await Promise.all(batch.map(fetchLive)));
    process.stdout.write(`\rChecked ${Math.min(i + concurrency, priorityUrls.length)}/${priorityUrls.length}`);
  }
  console.log();

  const coverageByUrl = new Map(coverage.map((row) => [normalizeUrl(row.url), row]));
  const rows = liveResults.map((live) => {
    const gsc = coverageByUrl.get(normalizeUrl(live.url)) || { url: live.url, coverageState: 'Performance issue only', lastCrawlTime: null, canonical: null };
    const row = { url: normalizeUrl(live.url), gsc, live };
    return { ...row, classification: classify(row) };
  });

  const byStatus = rows.reduce((acc, row) => {
    acc[row.classification.status] = (acc[row.classification.status] || 0) + 1;
    return acc;
  }, {});

  const byGscState = coverage.reduce((acc, row) => {
    const state = issueName(row.coverageState);
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  const report = {
    generatedAt: new Date().toISOString(),
    source: {
      performanceReport: ADVANCED_REPORT,
      coverageSnapshot: COVERAGE_FILE,
    },
    gscPerformance: advanced.performance,
    gscSitemaps: advanced.sitemaps,
    gscCoverageSnapshot: {
      total: coverage.length,
      byState: byGscState,
    },
    currentLiveVerification: {
      checked: rows.length,
      byStatus,
      rows,
    },
    gscPerformanceIssues: advanced.issues,
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));

  const stillNeedsFix = rows.filter((row) => row.classification.status === 'STILL_NEEDS_FIX');
  const waiting = rows.filter((row) => row.classification.status === 'FIX_LOOKS_OK_WAITING_RECRAWL');
  const okNow = rows.filter((row) => row.classification.status === 'OK_NOW');

  const md = [];
  md.push('# GSC Live Verification - dreamlab.id');
  md.push('');
  md.push(`Generated: ${report.generatedAt}`);
  md.push('');
  md.push('## GSC Snapshot');
  md.push('');
  md.push(`- Performance period: ${advanced.data_period.start} to ${advanced.data_period.end}`);
  md.push(`- Pages with GSC performance data: ${advanced.performance.total_pages}`);
  md.push(`- Clicks / impressions / CTR: ${advanced.performance.total_clicks} / ${advanced.performance.total_impressions} / ${advanced.performance.avg_ctr}`);
  md.push(`- GSC sitemap entries: ${advanced.sitemaps.length}; submitted sitemap reports ${advanced.sitemaps[0]?.urls ?? 'N/A'} URL group and ${advanced.sitemaps[0]?.errors ?? 'N/A'} errors.`);
  md.push('');
  md.push('## Coverage Snapshot From URL Inspection');
  md.push('');
  md.push('| State | Count |');
  md.push('|---|---:|');
  for (const [state, count] of Object.entries(byGscState).sort((a, b) => b[1] - a[1])) {
    md.push(`| ${state.replaceAll('|', '\\|')} | ${count} |`);
  }
  md.push('');
  md.push('## Current Live Verification');
  md.push('');
  md.push(`- Checked priority URLs live now: ${rows.length}`);
  md.push(`- Still needs fix: ${stillNeedsFix.length}`);
  md.push(`- Looks fixed live, likely waiting Google recrawl: ${waiting.length}`);
  md.push(`- OK now: ${okNow.length}`);
  md.push('');
  md.push('## Still Needs Fix');
  md.push('');
  md.push('| URL | GSC state | Live problem | HTTP -> final | Canonical | Last Google crawl |');
  md.push('|---|---|---|---|---|---|');
  for (const row of stillNeedsFix.slice(0, 80)) {
    md.push(`| ${row.url} | ${issueName(row.gsc.coverageState)} | ${row.classification.problems.join(', ')} | ${row.live.initialStatus} -> ${row.live.finalStatus} | ${row.live.canonical || ''} | ${row.gsc.lastCrawlTime || ''} |`);
  }
  if (stillNeedsFix.length === 0) md.push('| None | | | | | |');
  md.push('');
  md.push('## Looks Fixed Live, Waiting Recrawl');
  md.push('');
  md.push('| URL | GSC state | Live final | Canonical | Last Google crawl |');
  md.push('|---|---|---|---|---|');
  for (const row of waiting.slice(0, 80)) {
    md.push(`| ${row.url} | ${issueName(row.gsc.coverageState)} | ${row.live.finalStatus} ${row.live.finalUrl || ''} | ${row.live.canonical || ''} | ${row.gsc.lastCrawlTime || ''} |`);
  }
  if (waiting.length === 0) md.push('| None | | | | |');
  md.push('');
  md.push('## CTR Problems From Fresh GSC Pull');
  md.push('');
  md.push(`- High impressions, zero clicks: ${advanced.issues.critical?.find((item) => item.type === 'high_impressions_no_clicks')?.count || 0}`);
  md.push(`- Low CTR pages: ${advanced.issues.warnings?.find((item) => item.type === 'low_ctr')?.count || 0}`);
  md.push(`- Zero-click pages overall: ${advanced.issues.warnings?.find((item) => item.type === 'zero_clicks')?.count || 0}`);
  md.push('');
  md.push(`Full JSON: ${OUT_JSON}`);

  fs.writeFileSync(OUT_MD, md.join('\n'));
  console.log(`Saved ${OUT_JSON}`);
  console.log(`Saved ${OUT_MD}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
