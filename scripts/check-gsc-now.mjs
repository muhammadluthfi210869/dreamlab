import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'gsc-credentials.json'),
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const webmasters = google.webmasters({ version: 'v3', auth });

  const today = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];

  const end1 = new Date(today); end1.setDate(end1.getDate() - 1);
  const start1 = new Date(today); start1.setDate(start1.getDate() - 30);

  const end2 = new Date(start1); end2.setDate(end2.getDate() - 1);
  const start2 = new Date(end2); start2.setDate(start2.getDate() - 30);

  console.log('=== GSC PERFORMANCE (API) ===');
  console.log('Period 1:', fmt(start1), '→', fmt(end1));
  console.log('Period 2:', fmt(start2), '→', fmt(end2));
  console.log('');

  // Period 1
  const r1 = await webmasters.searchanalytics.query({
    siteUrl: 'sc-domain:dreamlab.id',
    requestBody: { startDate: fmt(start1), endDate: fmt(end1), dimensions: ['page'], rowLimit: 5000 },
  });
  const rows1 = r1.data.rows || [];
  const totalClicks1 = rows1.reduce((s, r) => s + (r.clicks || 0), 0);
  const totalImp1 = rows1.reduce((s, r) => s + (r.impressions || 0), 0);

  // Period 2
  const r2 = await webmasters.searchanalytics.query({
    siteUrl: 'sc-domain:dreamlab.id',
    requestBody: { startDate: fmt(start2), endDate: fmt(end2), dimensions: ['page'], rowLimit: 5000 },
  });
  const rows2 = r2.data.rows || [];
  const totalClicks2 = rows2.reduce((s, r) => s + (r.clicks || 0), 0);
  const totalImp2 = rows2.reduce((s, r) => s + (r.impressions || 0), 0);

  console.log('PERIOD 1 (last 30d):');
  console.log('  Clicks:', totalClicks1);
  console.log('  Impressions:', totalImp1);
  console.log('  Pages with data:', rows1.length);

  console.log('PERIOD 2 (prev 30d):');
  console.log('  Clicks:', totalClicks2);
  console.log('  Impressions:', totalImp2);
  console.log('  Pages with data:', rows2.length);

  const clickChange = totalClicks1 - totalClicks2;
  const impChange = totalImp1 - totalImp2;
  const clickPct = totalClicks2 > 0 ? ((clickChange / totalClicks2) * 100).toFixed(1) : 'N/A';
  const impPct = totalImp2 > 0 ? ((impChange / totalImp2) * 100).toFixed(1) : 'N/A';
  console.log('');
  console.log('CHANGE:');
  console.log('  Clicks:', clickChange >= 0 ? '+' : '', clickChange, '(' + clickPct + '%)');
  console.log('  Impressions:', impChange >= 0 ? '+' : '', impChange, '(' + impPct + '%)');

  // Pilot pages check
  const pilotPaths = [
    '/biaya-maklon-skincare/', '/moq-maklon-kosmetik/', '/pabrik-kosmetik/',
    '/pabrik-parfum/', '/jasa-maklon-kosmetik/', '/private-label-kosmetik/',
    '/estimasi-biaya-maklon-kosmetik/', '/panduan/'
  ];
  console.log('');
  console.log('=== PILOT PAGES (last 30d) ===');
  for (const slug of pilotPaths) {
    const key = slug.replace(/\/$/, '');
    const row = rows1.find(r => (r.keys?.[0] || '').includes(key));
    if (row) {
      console.log(`  ${row.clicks || 0} clicks | ${row.impressions || 0} imp | pos ${(row.position || 0).toFixed(1)} | CTR ${((row.ctr || 0)*100).toFixed(1)}% → ${slug}`);
    } else {
      console.log(`  no data yet → ${slug}`);
    }
  }

  // Top queries
  console.log('');
  console.log('=== TOP 20 QUERIES BY IMPRESSIONS ===');
  const q1 = await webmasters.searchanalytics.query({
    siteUrl: 'sc-domain:dreamlab.id',
    requestBody: { startDate: fmt(start1), endDate: fmt(end1), dimensions: ['query'], rowLimit: 50 },
  });
  const queryRows = q1.data.rows || [];
  queryRows.slice(0, 20).forEach((r, i) => {
    console.log(`  ${(i+1).toString().padStart(2)}. ${(r.impressions || 0).toString().padStart(6)} imp | ${(r.clicks || 0).toString().padStart(4)} cl | pos ${(r.position || 0).toFixed(1).padStart(5)} → ${r.keys?.[0] || ''}`);
  });

  // Also check 404s & crawl errors
  console.log('');
  console.log('=== CRAWL ERRORS (last 90d) ===');
  try {
    const r3 = await webmasters.searchanalytics.query({
      siteUrl: 'sc-domain:dreamlab.id',
      requestBody: { startDate: fmt(start2), endDate: fmt(end1), dimensions: ['page'], rowLimit: 25000 },
    });
    const allRows = r3.data.rows || [];
    const withClicks = allRows.filter(r => (r.clicks || 0) > 0).length;
    const zeroClicks = allRows.length - withClicks;
    console.log(`  Pages with clicks: ${withClicks}`);
    console.log(`  Pages with zero clicks: ${zeroClicks}`);
    console.log(`  Total unique pages: ${allRows.length}`);
  } catch(e) {
    console.log('  Error fetching extended data:', e.message);
  }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
