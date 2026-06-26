import path from 'path';
import https from 'https';

const CREDENTIALS_PATH = path.join(process.cwd(), 'scripts', 'gsc-credentials.json');

async function main() {
  // Load SA key manually for auth
  const key = JSON.parse(require('fs').readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const { google } = await import('googleapis');

  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const client = await auth.getClient();
  const token = (await client.getAccessToken()).token;

  // Search Console API: fetch list of issues
  // We need to use the sites.list + query params for enhancements
  // But there's no direct enhancements API.
  // Let's use URL Inspection on a few key pages + query the GSC data

  const { webmasters } = google.webmasters({ version: 'v3', auth: client }) as any;

  // Check which properties/sites we have access to
  const sites = await webmasters.sites.list();
  console.log('Sites:');
  for (const s of sites.data.siteEntry || []) {
    console.log(`  ${s.siteUrl} (${s.permissionLevel})`);
  }

  // For Merchant Listing issues, we need to check the relevant pages
  // Let's search analytics for pages that might have product schema
  const resp = await webmasters.searchanalytics.query({
    siteUrl: 'sc-domain:dreamlab.id',
    requestBody: {
      startDate: '2026-05-01',
      endDate: '2026-06-01',
      dimensions: ['page'],
      rowLimit: 100,
      orderBy: [{ metricName: 'impressions', sortOrder: 'DESCENDING' }],
    },
  });

  console.log('\nTop pages:');
  for (const row of resp.data.rows || []) {
    console.log(`  ${row.impressions} imp | ${row.clicks} cl | ${row.keys?.[0]}`);
  }
}

main().catch(console.error);
