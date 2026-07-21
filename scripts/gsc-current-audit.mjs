import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'output');
const CREDENTIALS_PATH = path.join(__dirname, 'gsc-credentials.json');
const SITE_URL = 'sc-domain:dreamlab.id';
const INSPECTION_SITE_URL = 'https://dreamlab.id';
const SITEMAP_URL = 'https://dreamlab.id/sitemap.xml';
const INSPECTION_LIMIT = Number(process.env.URL_INSPECTION_LIMIT || 50);
const REQUEST_TIMEOUT_MS = Number(process.env.AUDIT_REQUEST_TIMEOUT_MS || 12000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fmt = (d) => d.toISOString().slice(0, 10);

function stripHash(url) {
  return String(url || '').split('#')[0];
}

function normalizeUrl(url) {
  const noHash = stripHash(url).trim();
  return noHash.endsWith('/') ? noHash : `${noHash}/`;
}

function slug(url) {
  try {
    const u = new URL(stripHash(url));
    return `${u.pathname}${u.search}` || '/';
  } catch {
    return url;
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  return auth.getClient();
}

async function getAccessToken(client) {
  const token = await client.getAccessToken();
  if (!token?.token) throw new Error('Could not obtain Google access token');
  return token.token;
}

async function getPerformance(webmasters, startDate, endDate, dimensions, rowLimit = 25000) {
  const rows = [];
  let startRow = 0;
  while (true) {
    const response = await webmasters.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: { startDate, endDate, dimensions, rowLimit, startRow },
    });
    const batch = response.data.rows || [];
    rows.push(...batch);
    if (batch.length < rowLimit) break;
    startRow += rowLimit;
    await sleep(150);
  }
  return rows;
}

async function getSitemaps(webmasters) {
  const response = await webmasters.sitemaps.list({ siteUrl: SITE_URL });
  return response.data.sitemap || [];
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; DreamlabAudit/1.0)' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  return { status: response.status, text: await response.text(), url: response.url };
}

async function fetchSitemapUrls(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);

  const { text } = await fetchText(url);
  const locs = [...text.matchAll(/<loc[^>]*>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
  const isIndex = /<sitemap[\s>]/i.test(text);
  if (!isIndex) return locs;

  const nested = [];
  for (const loc of locs) {
    nested.push(...await fetchSitemapUrls(loc, seen));
  }
  return nested;
}

async function fetchLive(url) {
  const target = normalizeUrl(url);
  const result = {
    url: target,
    status: 0,
    redirectLocation: null,
    finalUrl: null,
    finalStatus: 0,
    canonical: null,
    robots: null,
    title: null,
    h1: null,
    error: null,
  };

  try {
    const manual = await fetch(target, {
      redirect: 'manual',
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; DreamlabAudit/1.0)' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    result.status = manual.status;
    result.redirectLocation = manual.headers.get('location');

    const final = await fetch(target, {
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; DreamlabAudit/1.0)' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    result.finalUrl = final.url;
    result.finalStatus = final.status;
    const html = await final.text();
    result.canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1]
      || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
      || null;
    result.robots = html.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["']/i)?.[1] || null;
    result.title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || null;
    result.h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || null;
  } catch (error) {
    result.error = error.message;
  }

  return result;
}

async function inspectUrl(token, url) {
  const response = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ siteUrl: SITE_URL, inspectionUrl: normalizeUrl(url) }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const body = await response.json();
  if (!response.ok || body.error) {
    return { url: normalizeUrl(url), ok: false, error: body.error?.message || response.statusText };
  }

  const result = body.inspectionResult || {};
  const index = result.indexStatusResult || {};
  return {
    url: normalizeUrl(url),
    ok: true,
    verdict: result.verdict || index.verdict || 'UNKNOWN',
    coverageState: index.coverageState || 'Unknown',
    indexingState: index.indexingState || 'Unknown',
    robotsTxtState: index.robotsTxtState || 'Unknown',
    pageFetchState: index.pageFetchState || 'Unknown',
    lastCrawlTime: index.lastCrawlTime || null,
    crawledAs: index.crawledAs || null,
    googleCanonical: index.googleCanonical || null,
    userCanonical: index.userCanonical || null,
    referringUrls: index.referringUrls || [],
  };
}

function classifyLive(live, inspection) {
  const issues = [];
  const finalCanonical = live.canonical ? normalizeUrl(live.canonical) : null;
  const target = normalizeUrl(live.url);
  const finalUrl = live.finalUrl ? normalizeUrl(live.finalUrl) : null;

  if (live.finalStatus >= 400 || live.status >= 400) issues.push('live_4xx_or_5xx');
  if (live.status >= 300 && live.status < 400) issues.push('live_redirect');
  if (live.robots && /noindex/i.test(live.robots)) issues.push('live_noindex');
  if (finalCanonical && finalUrl && finalCanonical !== finalUrl) issues.push('live_canonical_mismatch');
  if (inspection?.ok && inspection.coverageState !== 'Submitted and indexed') issues.push('gsc_not_submitted_indexed');

  const fixedNow = issues.length === 0 || (
    inspection?.ok
    && inspection.coverageState !== 'Submitted and indexed'
    && !issues.some((i) => i.startsWith('live_'))
  );

  const likelyWaitingRecrawl = inspection?.ok
    && inspection.coverageState !== 'Submitted and indexed'
    && !issues.some((i) => i.startsWith('live_'))
    && inspection.lastCrawlTime;

  return { issues, fixedNow, likelyWaitingRecrawl, target, finalUrl, finalCanonical };
}

function aggregatePerformance(rows) {
  const pages = rows.map((row) => ({
    url: normalizeUrl(row.keys?.[0] || ''),
    slug: slug(row.keys?.[0] || ''),
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));
  pages.sort((a, b) => b.impressions - a.impressions);
  const totalClicks = pages.reduce((sum, row) => sum + row.clicks, 0);
  const totalImpressions = pages.reduce((sum, row) => sum + row.impressions, 0);
  return { pages, totalClicks, totalImpressions, ctr: totalClicks / Math.max(totalImpressions, 1) };
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() - 2);
  const start = new Date(end);
  start.setDate(start.getDate() - 89);

  console.log('GSC current audit');
  console.log(`Performance period: ${fmt(start)} to ${fmt(end)}`);

  const client = await getAuth();
  const token = await getAccessToken(client);
  const webmasters = google.webmasters({ version: 'v3', auth: client });

  const [pageRows, queryRows, sitemaps] = await Promise.all([
    getPerformance(webmasters, fmt(start), fmt(end), ['page']),
    getPerformance(webmasters, fmt(start), fmt(end), ['query'], 5000),
    getSitemaps(webmasters),
  ]);

  const performance = aggregatePerformance(pageRows);
  console.log(`GSC pages: ${performance.pages.length}`);
  console.log(`Clicks: ${performance.totalClicks}, impressions: ${performance.totalImpressions}`);

  let sitemapUrls = [];
  try {
    sitemapUrls = unique((await fetchSitemapUrls(SITEMAP_URL)).map(normalizeUrl));
  } catch (error) {
    console.log(`Sitemap fetch failed: ${error.message}`);
  }
  console.log(`Live sitemap URLs: ${sitemapUrls.length}`);

  const coverageFiles = fs.readdirSync(OUTPUT_DIR)
    .filter((file) => /^gsc-coverage-\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .sort()
    .reverse();
  const previousCoverage = coverageFiles[0]
    ? JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, coverageFiles[0]), 'utf8'))
    : [];

  const highImpNoClick = performance.pages.filter((page) => page.impressions >= 200 && page.clicks === 0);
  const lowCtr = performance.pages.filter((page) => page.impressions >= 100 && page.clicks > 0 && page.ctr < 0.005);
  const previousProblemUrls = previousCoverage
    .filter((row) => row.coverageState && row.coverageState !== 'Submitted and indexed' && row.coverageState !== 'URL is unknown to Google')
    .map((row) => row.url);

  const priorityUrls = unique([
    ...previousProblemUrls,
    ...highImpNoClick.map((page) => page.url),
    ...lowCtr.slice(0, 80).map((page) => page.url),
    ...performance.pages.slice(0, 80).map((page) => page.url),
    ...sitemapUrls,
  ]).slice(0, INSPECTION_LIMIT);

  console.log(`Priority URLs for live + URL Inspection: ${priorityUrls.length}`);

  const liveResults = [];
  const concurrency = 16;
  for (let i = 0; i < priorityUrls.length; i += concurrency) {
    const batch = priorityUrls.slice(i, i + concurrency);
    liveResults.push(...await Promise.all(batch.map(fetchLive)));
    process.stdout.write(`\rLive check: ${Math.min(i + concurrency, priorityUrls.length)}/${priorityUrls.length}`);
  }
  console.log();

  const inspectionResults = [];
  for (let i = 0; i < priorityUrls.length; i++) {
    const result = await inspectUrl(token, priorityUrls[i]);
    inspectionResults.push(result);
    process.stdout.write(`\rURL Inspection: ${i + 1}/${priorityUrls.length}`);
    await sleep(120);
  }
  console.log();

  const liveByUrl = new Map(liveResults.map((row) => [normalizeUrl(row.url), row]));
  const inspectionByUrl = new Map(inspectionResults.map((row) => [normalizeUrl(row.url), row]));
  const auditedPages = priorityUrls.map((url) => {
    const key = normalizeUrl(url);
    const live = liveByUrl.get(key);
    const inspection = inspectionByUrl.get(key);
    const classification = classifyLive(live, inspection);
    const perf = performance.pages.find((page) => normalizeUrl(page.url) === key);
    return { url: key, performance: perf || null, live, inspection, classification };
  });

  const coverageBreakdown = {};
  for (const row of inspectionResults) {
    const state = row.ok ? row.coverageState : `API error: ${row.error}`;
    coverageBreakdown[state] = (coverageBreakdown[state] || 0) + 1;
  }

  const liveIssues = auditedPages.filter((row) => row.classification.issues.some((issue) => issue.startsWith('live_')));
  const waitingRecrawl = auditedPages.filter((row) => row.classification.likelyWaitingRecrawl);
  const indexed = inspectionResults.filter((row) => row.ok && row.coverageState === 'Submitted and indexed');
  const notIndexed = inspectionResults.filter((row) => row.ok && row.coverageState !== 'Submitted and indexed');

  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl: SITE_URL,
    performancePeriod: { start: fmt(start), end: fmt(end) },
    performance: {
      pages: performance.pages.length,
      clicks: performance.totalClicks,
      impressions: performance.totalImpressions,
      ctr: performance.ctr,
      highImpNoClick: highImpNoClick.length,
      lowCtr: lowCtr.length,
      topPages: performance.pages.slice(0, 40),
      highImpNoClickPages: highImpNoClick.slice(0, 80),
      lowCtrPages: lowCtr.slice(0, 80),
      topQueries: queryRows.slice(0, 50).map((row) => ({
        query: row.keys?.[0] || '',
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      })),
    },
    sitemapsFromGsc: sitemaps.map((sitemap) => ({
      path: sitemap.path,
      errors: sitemap.errors,
      warnings: sitemap.warnings,
      lastSubmitted: sitemap.lastSubmitted,
      isPending: sitemap.isPending,
      contents: sitemap.contents,
    })),
    liveSitemap: {
      url: SITEMAP_URL,
      urls: sitemapUrls.length,
      sample: sitemapUrls.slice(0, 20),
    },
    previousCoverage: {
      sourceFile: coverageFiles[0] || null,
      urls: previousCoverage.length,
    },
    inspection: {
      inspected: inspectionResults.length,
      indexed: indexed.length,
      notIndexed: notIndexed.length,
      coverageBreakdown,
    },
    currentVerification: {
      liveIssuesCount: liveIssues.length,
      likelyWaitingRecrawlCount: waitingRecrawl.length,
      liveIssues: liveIssues.slice(0, 120),
      likelyWaitingRecrawl: waitingRecrawl.slice(0, 120),
      auditedPages,
    },
  };

  const date = fmt(new Date());
  const jsonPath = path.join(OUTPUT_DIR, `gsc-current-audit-${date}.json`);
  const mdPath = path.join(OUTPUT_DIR, `GSC-CURRENT-AUDIT-${date}.md`);
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const md = [];
  md.push(`# GSC Current Audit - dreamlab.id`);
  md.push('');
  md.push(`Generated: ${report.generatedAt}`);
  md.push(`Performance period: ${report.performancePeriod.start} to ${report.performancePeriod.end}`);
  md.push('');
  md.push('## Summary');
  md.push('');
  md.push(`- GSC performance pages: ${report.performance.pages}`);
  md.push(`- Clicks / impressions / CTR: ${report.performance.clicks} / ${report.performance.impressions} / ${(report.performance.ctr * 100).toFixed(2)}%`);
  md.push(`- High impressions with zero clicks: ${report.performance.highImpNoClick}`);
  md.push(`- Low CTR pages: ${report.performance.lowCtr}`);
  md.push(`- Sitemap submitted in GSC: ${report.sitemapsFromGsc.length}`);
  md.push(`- Live sitemap URLs found: ${report.liveSitemap.urls}`);
  md.push(`- URL Inspection checked: ${report.inspection.inspected}`);
  md.push(`- Indexed in inspected sample: ${report.inspection.indexed}`);
  md.push(`- Not indexed / redirected / excluded in inspected sample: ${report.inspection.notIndexed}`);
  md.push(`- Still broken live now: ${report.currentVerification.liveIssuesCount}`);
  md.push(`- Looks fixed live but likely waiting Google recrawl: ${report.currentVerification.likelyWaitingRecrawlCount}`);
  md.push('');
  md.push('## URL Inspection Breakdown');
  md.push('');
  md.push('| State | Count |');
  md.push('|---|---:|');
  for (const [state, count] of Object.entries(report.inspection.coverageBreakdown).sort((a, b) => b[1] - a[1])) {
    md.push(`| ${state.replaceAll('|', '\\|')} | ${count} |`);
  }
  md.push('');
  md.push('## Still Broken Live Now');
  md.push('');
  md.push('| URL | Live issue | HTTP -> final | Canonical | GSC state | Last crawl |');
  md.push('|---|---|---|---|---|---|');
  for (const row of liveIssues.slice(0, 80)) {
    md.push(`| ${row.url} | ${row.classification.issues.join(', ')} | ${row.live.status} -> ${row.live.finalStatus} | ${row.live.canonical || ''} | ${row.inspection?.coverageState || row.inspection?.error || ''} | ${row.inspection?.lastCrawlTime || ''} |`);
  }
  if (liveIssues.length === 0) md.push('| None |  |  |  |  |  |');
  md.push('');
  md.push('## Fixed Live, Waiting Recrawl');
  md.push('');
  md.push('| URL | GSC state | Google canonical | User canonical | Last crawl |');
  md.push('|---|---|---|---|---|');
  for (const row of waitingRecrawl.slice(0, 80)) {
    md.push(`| ${row.url} | ${row.inspection.coverageState} | ${row.inspection.googleCanonical || ''} | ${row.inspection.userCanonical || ''} | ${row.inspection.lastCrawlTime || ''} |`);
  }
  if (waitingRecrawl.length === 0) md.push('| None |  |  |  |');
  md.push('');
  md.push('## High Impression Zero Click Pages');
  md.push('');
  md.push('| URL | Impressions | Position |');
  md.push('|---|---:|---:|');
  for (const page of highImpNoClick.slice(0, 40)) {
    md.push(`| ${page.url} | ${page.impressions} | ${page.position.toFixed(1)} |`);
  }
  fs.writeFileSync(mdPath, md.join('\n'));

  console.log(`Saved JSON: ${jsonPath}`);
  console.log(`Saved report: ${mdPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
