import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { google } from 'googleapis';

const ROOT = process.cwd();
const AUDIT_DIR = path.join(ROOT, 'seo-redesign-audit');
const RAW_DIR = path.join(AUDIT_DIR, 'raw-evidence');
const OUT = (name) => path.join(AUDIT_DIR, name);
const RAW = (name) => path.join(RAW_DIR, name);
const SITE = 'https://dreamlab.id';
const GSC_SITE = 'sc-domain:dreamlab.id';
const GSC_INSPECT_SITE = 'https://dreamlab.id';
const CREDENTIALS = path.join(ROOT, 'scripts', 'gsc-credentials.json');
const GSC_OUTPUT = path.join(ROOT, 'scripts', 'output');

fs.mkdirSync(RAW_DIR, { recursive: true });

const fmt = (d) => d.toISOString().slice(0, 10);
const norm = (url) => {
  const u = String(url || '').trim().split('#')[0];
  if (!u) return '';
  return u.endsWith('/') ? u : `${u}/`;
};
const pathOnly = (url) => {
  try {
    const u = new URL(url, SITE);
    return `${u.pathname}${u.search}`;
  } catch {
    return url;
  }
};
const csvCell = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
};
const writeCsv = (file, rows, headers) => {
  const lines = [headers.join(',')];
  for (const row of rows) lines.push(headers.map((h) => csvCell(row[h])).join(','));
  fs.writeFileSync(file, lines.join('\n'));
};
const sum = (rows, field) => rows.reduce((acc, row) => acc + (Number(row[field]) || 0), 0);
const avgPos = (rows) => {
  const imps = sum(rows, 'impressions');
  if (!imps) return 0;
  return rows.reduce((acc, row) => acc + ((Number(row.position) || 0) * (Number(row.impressions) || 0)), 0) / imps;
};

function safeReadJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}

function runGit(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    return `ERROR: ${error.message}`;
  }
}

async function gscClient() {
  if (!fs.existsSync(CREDENTIALS)) return null;
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const client = await auth.getClient();
  return google.webmasters({ version: 'v3', auth: client });
}

async function searchRows(webmasters, startDate, endDate, dimensions, rowLimit = 25000) {
  const rows = [];
  let startRow = 0;
  while (true) {
    const res = await webmasters.searchanalytics.query({
      siteUrl: GSC_SITE,
      requestBody: { startDate, endDate, dimensions, rowLimit, startRow },
    });
    const batch = res.data.rows || [];
    rows.push(...batch.map((row) => ({
      keys: row.keys || [],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    })));
    if (batch.length < rowLimit) break;
    startRow += rowLimit;
  }
  return rows;
}

async function fetchText(url, init = {}) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; DreamlabRedesignAudit/1.0)' },
    signal: AbortSignal.timeout(15000),
    ...init,
  });
  return { status: res.status, url: res.url, headers: Object.fromEntries(res.headers.entries()), text: await res.text() };
}

async function sitemapUrls(url = `${SITE}/sitemap.xml`, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  const fetched = await fetchText(url);
  fs.writeFileSync(RAW(`sitemap-${seen.size}.xml`), fetched.text);
  const locs = [...fetched.text.matchAll(/<loc[^>]*>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
  if (!/<sitemap[\s>]/i.test(fetched.text)) return locs;
  const nested = [];
  for (const loc of locs) nested.push(...await sitemapUrls(loc, seen));
  return nested;
}

async function liveCheck(url) {
  const target = norm(url.startsWith('http') ? url : `${SITE}${url.startsWith('/') ? url : `/${url}`}`);
  const row = { url: target, initial_status: '', redirect_location: '', final_url: '', final_status: '', canonical: '', robots: '', title: '', h1: '', link_count: '', html_chars: '', error: '' };
  try {
    const manual = await fetch(target, { redirect: 'manual', headers: { 'user-agent': 'Mozilla/5.0 (compatible; DreamlabRedesignAudit/1.0)' }, signal: AbortSignal.timeout(12000) });
    row.initial_status = manual.status;
    row.redirect_location = manual.headers.get('location') || '';
    const final = await fetch(target, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; DreamlabRedesignAudit/1.0)' }, signal: AbortSignal.timeout(12000) });
    row.final_status = final.status;
    row.final_url = norm(final.url);
    const html = await final.text();
    row.html_chars = html.length;
    row.canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] || '';
    row.robots = html.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
    row.title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || '';
    row.h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
    row.link_count = [...html.matchAll(/<a\s[^>]*href=/gi)].length;
  } catch (error) {
    row.error = error.message;
  }
  return row;
}

async function main() {
  const evidence = {
    generated_at: new Date().toISOString(),
    constraints: [],
    gsc: { available: false },
    ga4: { available: false, note: 'TIDAK DAPAT DIVERIFIKASI: credential GA4 Data API/property id tidak ditemukan otomatis.' },
    dataforseo: { available: false, note: 'TIDAK DAPAT DIVERIFIKASI: tidak ada MCP/API DataForSEO yang terdeteksi di audit ini.' },
    server_logs: { available: false, note: 'TIDAK DAPAT DIVERIFIKASI: server access logs tidak ditemukan di repository.' },
  };

  fs.writeFileSync(RAW('git-log.tsv'), runGit(['log', '--date=short', '--pretty=format:%h%x09%ad%x09%an%x09%s', '-n', '160']));
  fs.writeFileSync(RAW('git-status.txt'), runGit(['status', '--short']));
  fs.writeFileSync(RAW('git-show-key-commits.txt'), [
    runGit(['show', '--stat', '--oneline', '--name-only', '6e0cea2']),
    runGit(['show', '--stat', '--oneline', '--name-only', '6a405d7']),
    runGit(['show', '--stat', '--oneline', '--name-only', 'f47a44e']),
  ].join('\n\n---\n\n'));

  const coverageFiles = fs.existsSync(GSC_OUTPUT)
    ? fs.readdirSync(GSC_OUTPUT).filter((f) => /^gsc-coverage-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort()
    : [];
  const coverageLatest = coverageFiles.at(-1) ? safeReadJson(path.join(GSC_OUTPUT, coverageFiles.at(-1)), []) : [];
  const coverageHistory = safeReadJson(path.join(GSC_OUTPUT, 'gsc-coverage-history.json'), []);
  evidence.coverage_snapshots = { files: coverageFiles, latest_file: coverageFiles.at(-1) || null, latest_count: coverageLatest.length };
  evidence.coverage_history = coverageHistory;

  const redirectsSource = fs.readFileSync(path.join(ROOT, 'next.config.ts'), 'utf8');
  fs.writeFileSync(RAW('next-config-redirects-excerpt.txt'), redirectsSource.split('\n').slice(0, 260).join('\n'));
  const seoMapping = safeReadJson(path.join(ROOT, 'src', 'data', 'seo-mapping.json'), []);
  const rootMapping = safeReadJson(path.join(ROOT, '..', 'seo-mapping.json'), []);
  const oldUrls = [...new Set([...seoMapping, ...rootMapping].map((x) => x.source).filter(Boolean).map((x) => norm(`${SITE}${x}`)))];
  evidence.old_url_sources = { seo_mapping_rows: seoMapping.length, root_mapping_rows: rootMapping.length, unique_old_urls: oldUrls.length };

  let liveSitemap = [];
  try {
    liveSitemap = [...new Set((await sitemapUrls()).map(norm))];
  } catch (error) {
    evidence.constraints.push(`Sitemap live fetch failed: ${error.message}`);
  }
  evidence.live_sitemap = { count: liveSitemap.length, sample: liveSitemap.slice(0, 20) };
  fs.writeFileSync(RAW('live-sitemap-urls.txt'), liveSitemap.join('\n'));
  fs.writeFileSync(RAW('old-url-candidates.txt'), oldUrls.join('\n'));

  const webmasters = await gscClient();
  const endDate = '2026-07-19';
  if (webmasters) {
    evidence.gsc.available = true;
    const daily = await searchRows(webmasters, '2026-04-21', endDate, ['date']);
    const pageAll = await searchRows(webmasters, '2026-04-21', endDate, ['page']);
    const before7 = await searchRows(webmasters, '2026-07-06', '2026-07-12', ['page']);
    const after7 = await searchRows(webmasters, '2026-07-13', '2026-07-19', ['page']);
    const queryBefore7 = await searchRows(webmasters, '2026-07-06', '2026-07-12', ['query']);
    const queryAfter7 = await searchRows(webmasters, '2026-07-13', '2026-07-19', ['query']);
    const deviceBefore7 = await searchRows(webmasters, '2026-07-06', '2026-07-12', ['device']);
    const deviceAfter7 = await searchRows(webmasters, '2026-07-13', '2026-07-19', ['device']);
    const countryBefore7 = await searchRows(webmasters, '2026-07-06', '2026-07-12', ['country']);
    const countryAfter7 = await searchRows(webmasters, '2026-07-13', '2026-07-19', ['country']);
    const appearanceBefore7 = await searchRows(webmasters, '2026-07-06', '2026-07-12', ['searchAppearance'], 5000).catch((e) => [{ keys: ['API_ERROR'], clicks: 0, impressions: 0, ctr: 0, position: 0, error: e.message }]);
    const appearanceAfter7 = await searchRows(webmasters, '2026-07-13', '2026-07-19', ['searchAppearance'], 5000).catch((e) => [{ keys: ['API_ERROR'], clicks: 0, impressions: 0, ctr: 0, position: 0, error: e.message }]);

    const rowsToCsv = (rows, headers, file) => writeCsv(RAW(file), rows.map((r) => ({ key: r.keys.join(' | '), clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })), headers);
    writeCsv(RAW('gsc-daily.csv'), daily.map((r) => ({ date: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })), ['date', 'clicks', 'impressions', 'ctr', 'position']);
    rowsToCsv(pageAll, ['key', 'clicks', 'impressions', 'ctr', 'position'], 'gsc-pages-90d.csv');
    rowsToCsv(before7, ['key', 'clicks', 'impressions', 'ctr', 'position'], 'gsc-pages-before7.csv');
    rowsToCsv(after7, ['key', 'clicks', 'impressions', 'ctr', 'position'], 'gsc-pages-after7.csv');
    rowsToCsv(queryBefore7, ['key', 'clicks', 'impressions', 'ctr', 'position'], 'gsc-queries-before7.csv');
    rowsToCsv(queryAfter7, ['key', 'clicks', 'impressions', 'ctr', 'position'], 'gsc-queries-after7.csv');
    rowsToCsv(deviceBefore7, ['key', 'clicks', 'impressions', 'ctr', 'position'], 'gsc-device-before7.csv');
    rowsToCsv(deviceAfter7, ['key', 'clicks', 'impressions', 'ctr', 'position'], 'gsc-device-after7.csv');
    rowsToCsv(countryBefore7, ['key', 'clicks', 'impressions', 'ctr', 'position'], 'gsc-country-before7.csv');
    rowsToCsv(countryAfter7, ['key', 'clicks', 'impressions', 'ctr', 'position'], 'gsc-country-after7.csv');
    rowsToCsv(appearanceBefore7, ['key', 'clicks', 'impressions', 'ctr', 'position'], 'gsc-appearance-before7.csv');
    rowsToCsv(appearanceAfter7, ['key', 'clicks', 'impressions', 'ctr', 'position'], 'gsc-appearance-after7.csv');

    const byUrl = new Map();
    for (const r of before7) byUrl.set(norm(r.keys[0]), { url: norm(r.keys[0]), clicks_before: r.clicks, impressions_before: r.impressions, position_before: r.position, clicks_after: 0, impressions_after: 0, position_after: 0 });
    for (const r of after7) {
      const key = norm(r.keys[0]);
      const row = byUrl.get(key) || { url: key, clicks_before: 0, impressions_before: 0, position_before: 0, clicks_after: 0, impressions_after: 0, position_after: 0 };
      row.clicks_after = r.clicks;
      row.impressions_after = r.impressions;
      row.position_after = r.position;
      byUrl.set(key, row);
    }
    const pageLoss = [...byUrl.values()].map((r) => ({ ...r, impression_change: r.impressions_after - r.impressions_before, click_change: r.clicks_after - r.clicks_before })).sort((a, b) => a.impression_change - b.impression_change);
    writeCsv(RAW('gsc-page-loss-7v7.csv'), pageLoss, ['url', 'clicks_before', 'impressions_before', 'position_before', 'clicks_after', 'impressions_after', 'position_after', 'impression_change', 'click_change']);

    const byQuery = new Map();
    for (const r of queryBefore7) byQuery.set(r.keys[0], { query: r.keys[0], clicks_before: r.clicks, impressions_before: r.impressions, position_before: r.position, clicks_after: 0, impressions_after: 0, position_after: 0 });
    for (const r of queryAfter7) {
      const key = r.keys[0];
      const row = byQuery.get(key) || { query: key, clicks_before: 0, impressions_before: 0, position_before: 0, clicks_after: 0, impressions_after: 0, position_after: 0 };
      row.clicks_after = r.clicks;
      row.impressions_after = r.impressions;
      row.position_after = r.position;
      byQuery.set(key, row);
    }
    const queryLoss = [...byQuery.values()].map((r) => ({ ...r, impression_change: r.impressions_after - r.impressions_before, click_change: r.clicks_after - r.clicks_before })).sort((a, b) => a.impression_change - b.impression_change);
    writeCsv(RAW('gsc-query-loss-7v7.csv'), queryLoss, ['query', 'clicks_before', 'impressions_before', 'position_before', 'clicks_after', 'impressions_after', 'position_after', 'impression_change', 'click_change']);

    evidence.gsc.performance = {
      period: { start: '2026-04-21', end: endDate },
      pages_90d: pageAll.length,
      clicks_90d: sum(pageAll, 'clicks'),
      impressions_90d: sum(pageAll, 'impressions'),
      before7: { start: '2026-07-06', end: '2026-07-12', clicks: sum(before7, 'clicks'), impressions: sum(before7, 'impressions'), avg_position: avgPos(before7), pages: before7.length },
      after7: { start: '2026-07-13', end: '2026-07-19', clicks: sum(after7, 'clicks'), impressions: sum(after7, 'impressions'), avg_position: avgPos(after7), pages: after7.length },
      top_page_losses: pageLoss.slice(0, 25),
      top_query_losses: queryLoss.slice(0, 25),
      daily,
      device_before7: deviceBefore7,
      device_after7: deviceAfter7,
      country_before7: countryBefore7,
      country_after7: countryAfter7,
      appearance_before7: appearanceBefore7,
      appearance_after7: appearanceAfter7,
    };
    try {
      const sitemaps = await webmasters.sitemaps.list({ siteUrl: GSC_SITE });
      evidence.gsc.sitemaps = sitemaps.data.sitemap || [];
    } catch (error) {
      evidence.gsc.sitemaps_error = error.message;
    }
  } else {
    evidence.gsc.note = 'TIDAK DAPAT DIVERIFIKASI: credential GSC tidak ditemukan.';
  }

  const priority = [
    '/',
    '/skincare-face-care/',
    '/parfum/',
    '/body-care/',
    '/hair-care/',
    '/baby-care/',
    '/services/',
    '/news-blog/',
    '/category/maklon-skincare/',
    '/category/event/',
    '/maklon-parfum/',
    '/pabrik-parfum-surabaya/',
    '/tips-sukses-bisnis-parfum/',
    '/bahan-aktif-untuk-mengatasi-jerawat/',
    '/cara-bisnis-skincare-dari-nol/',
    ...coverageLatest.filter((r) => r.coverageState && r.coverageState !== 'Submitted and indexed' && r.coverageState !== 'URL is unknown to Google').slice(0, 60).map((r) => r.url),
    ...liveSitemap.slice(0, 40),
  ];
  const priorityUrls = [...new Set(priority.map((u) => norm(u.startsWith('http') ? u : `${SITE}${u}`)))];
  const liveRows = [];
  for (let i = 0; i < priorityUrls.length; i += 12) {
    liveRows.push(...await Promise.all(priorityUrls.slice(i, i + 12).map(liveCheck)));
  }
  writeCsv(RAW('live-url-checks.csv'), liveRows, ['url', 'initial_status', 'redirect_location', 'final_url', 'final_status', 'canonical', 'robots', 'title', 'h1', 'link_count', 'html_chars', 'error']);
  evidence.live_checks = {
    count: liveRows.length,
    redirects: liveRows.filter((r) => Number(r.initial_status) >= 300 && Number(r.initial_status) < 400).length,
    noindex: liveRows.filter((r) => /noindex/i.test(r.robots)).length,
    fourxx: liveRows.filter((r) => Number(r.final_status) >= 400).length,
    canonical_mismatch: liveRows.filter((r) => r.canonical && norm(r.canonical) !== norm(r.final_url)).length,
  };

  const oldRows = oldUrls.slice(0, 600).map((url) => {
    const current = liveRows.find((r) => norm(r.url) === norm(url));
    const inSitemap = liveSitemap.includes(norm(url));
    return {
      Old_URL: url,
      Old_traffic: '',
      New_equivalent: current?.final_url || '',
      HTTP_status: current?.initial_status || '',
      Redirect: current?.redirect_location || '',
      Canonical: current?.canonical || '',
      New_URL_indexable: current && Number(current.final_status) === 200 && !/noindex/i.test(current.robots) ? 'YES' : current ? 'NO_OR_UNKNOWN' : 'NOT_CHECKED',
      Classification: current ? (Number(current.initial_status) >= 300 && Number(current.initial_status) < 400 ? 'REDIRECTED_CORRECTLY_OR_NEEDS_RELEVANCE_REVIEW' : Number(current.final_status) === 404 ? '404_NEEDS_REVIEW' : inSitemap ? 'PRESERVED' : 'UNKNOWN') : 'UNKNOWN',
    };
  });
  writeCsv(OUT('02-old-vs-new-url-map.csv'), oldRows, ['Old_URL', 'Old_traffic', 'New_equivalent', 'HTTP_status', 'Redirect', 'Canonical', 'New_URL_indexable', 'Classification']);

  fs.writeFileSync(RAW('audit-evidence.json'), JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify({
    generated_at: evidence.generated_at,
    gsc_available: evidence.gsc.available,
    old_urls: oldUrls.length,
    live_sitemap_urls: liveSitemap.length,
    live_checked: liveRows.length,
    output: AUDIT_DIR,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
