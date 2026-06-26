import path from 'path';
import https from 'https';
import { google } from 'googleapis';

const CREDENTIALS_PATH = path.join(process.cwd(), 'scripts', 'gsc-credentials.json');

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters', 'https://www.googleapis.com/auth/indexing'],
  });

  const webmasters = google.webmasters({ version: 'v3', auth });
  const client = await auth.getClient();

  // Submit sitemap
  try {
    await webmasters.sitemaps.submit({
      siteUrl: 'sc-domain:dreamlab.id',
      feedpath: 'https://www.dreamlab.id/sitemap.xml',
    });
    console.log('✅ Sitemap submitted: sitemap.xml\n');
  } catch (e: any) {
    console.log(`❌ sitemap submit: ${e.message?.split('\n')[0]}\n`);
  }

  // List current sitemaps
  console.log('Current sitemaps:');
  const sitemaps = await webmasters.sitemaps.list({ siteUrl: 'sc-domain:dreamlab.id' });
  for (const s of sitemaps.data.sitemap || []) {
    console.log(`  ${s.path} | errors: ${s.errors || 0} | warnings: ${s.warnings || 0}`);
  }

  // Check index status of a few key pages
  console.log('\nIndex status of bodycare pages:');
  const urls = [
    'https://www.dreamlab.id/produk/bodycare/body-lotion/',
    'https://www.dreamlab.id/produk/bodycare/body-butter/',
    'https://www.dreamlab.id/produk/bodycare/body-wash/',
    'https://www.dreamlab.id/produk/bodycare/body-scrub/',
  ];

  const token = (await client.getAccessToken()).token!;

  for (const url of urls) {
    try {
      const response = await new Promise<string>((resolve, reject) => {
        const data = JSON.stringify({
          siteUrl: 'sc-domain:dreamlab.id',
          inspectionUrl: url,
        });
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
          res.on('data', c => body += c);
          res.on('end', () => resolve(body));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
      });

      const parsed = JSON.parse(response);
      const idx = parsed.inspectionResult?.indexStatusResult || {};
      console.log(`  ${url}`);
      console.log(`    Verdict: ${idx.verdict || 'N/A'}`);
      console.log(`    Coverage: ${idx.coverageState || 'N/A'}`);
      console.log(`    Last crawl: ${idx.lastCrawlTime || 'N/A'}`);
    } catch (e: any) {
      console.log(`  ${url}: ${e.message}`);
    }
  }
}

main().catch(console.error);
