const SITEMAP_URL = process.env.SITEMAP_URL || 'https://dreamlab.id/sitemap.xml';
const TIMEOUT_MS = Number(process.env.SITEMAP_VERIFY_TIMEOUT_MS || 10000);
const CONCURRENCY = Number(process.env.SITEMAP_VERIFY_CONCURRENCY || 20);

async function fetchText(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; DreamlabSitemapVerifier/1.0)' },
  });
  return { url: response.url, status: response.status, text: await response.text() };
}

async function fetchSitemapUrls(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);

  const { text } = await fetchText(url);
  const locs = [...text.matchAll(/<loc[^>]*>([^<]+)<\/loc>/gi)].map(match => match[1].trim());
  if (/<sitemap[\s>]/i.test(text)) {
    const nested = [];
    for (const loc of locs) {
      nested.push(...await fetchSitemapUrls(loc, seen));
    }
    return nested;
  }
  return locs;
}

function normalizeUrl(url) {
  const value = String(url).split('#')[0].split('?')[0];
  return value.endsWith('/') ? value : `${value}/`;
}

function extractCanonical(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1]
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
    || null;
}

function extractRobots(html) {
  return html.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["']/i)?.[1] || null;
}

async function inspectUrl(url) {
  const result = {
    url,
    initialStatus: 0,
    finalStatus: 0,
    finalUrl: '',
    redirectLocation: '',
    canonical: '',
    robots: '',
    issues: [],
  };

  try {
    const manual = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; DreamlabSitemapVerifier/1.0)' },
    });
    result.initialStatus = manual.status;
    result.redirectLocation = manual.headers.get('location') || '';

    const final = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; DreamlabSitemapVerifier/1.0)' },
    });
    result.finalStatus = final.status;
    result.finalUrl = final.url;
    const html = await final.text();
    result.canonical = extractCanonical(html) || '';
    result.robots = extractRobots(html) || '';
  } catch (error) {
    result.issues.push(`fetch_error:${error.message}`);
    return result;
  }

  if (result.initialStatus >= 300 && result.initialStatus < 400) result.issues.push('redirect_in_sitemap');
  if (result.finalStatus >= 400 || result.finalStatus === 0) result.issues.push('bad_final_status');
  if (/noindex/i.test(result.robots)) result.issues.push('noindex_in_sitemap');
  if (result.canonical) {
    if (normalizeUrl(result.canonical) !== normalizeUrl(result.finalUrl)) result.issues.push('canonical_not_self');
    if (result.canonical.includes('https://www.dreamlab.id')) result.issues.push('canonical_www');
  } else {
    result.issues.push('missing_canonical');
  }

  return result;
}

async function main() {
  console.log(`Checking sitemap: ${SITEMAP_URL}`);
  const sitemapUrls = [...new Set((await fetchSitemapUrls(SITEMAP_URL)).map(normalizeUrl))];
  console.log(`URLs found: ${sitemapUrls.length}`);

  const results = [];
  for (let i = 0; i < sitemapUrls.length; i += CONCURRENCY) {
    const batch = sitemapUrls.slice(i, i + CONCURRENCY);
    results.push(...await Promise.all(batch.map(inspectUrl)));
    process.stdout.write(`\rChecked ${Math.min(i + CONCURRENCY, sitemapUrls.length)}/${sitemapUrls.length}`);
  }
  console.log();

  const failures = results.filter(result => result.issues.length > 0);
  if (failures.length > 0) {
    console.error(`Sitemap indexability failed: ${failures.length} URLs have issues`);
    for (const failure of failures.slice(0, 100)) {
      console.error(`${failure.issues.join(',')} | ${failure.initialStatus}->${failure.finalStatus} | ${failure.url} | canonical=${failure.canonical}`);
    }
    process.exit(1);
  }

  console.log('Sitemap indexability passed.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
