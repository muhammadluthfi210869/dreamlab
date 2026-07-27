/**
 * Submit sitemap.xml to Google Search Console
 * Run: node scripts/submit-sitemap.mjs
 */
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CREDENTIALS_PATH = path.join(__dirname, 'gsc-credentials.json');
const SITE_URL = 'sc-domain:dreamlab.id';
const SITEMAP_URL = 'https://dreamlab.id/sitemap.xml';

async function main() {
  console.log('='.repeat(60));
  console.log('  SUBMIT SITEMAP TO GSC');
  console.log('='.repeat(60));

  // Auth
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters'],
  });
  const webmasters = google.webmasters({ version: 'v3', auth });

  // 1. List existing sitemaps
  console.log('\n listing existing sitemaps:');
  try {
    const res = await webmasters.sitemaps.list({ siteUrl: SITE_URL });
    const sitemaps = res.data.sitemap || [];
    if (sitemaps.length === 0) {
      console.log('  No sitemaps found.');
    } else {
      sitemaps.forEach(s => {
        console.log(`  ${s.path} — ${s.contents || 0} URLs (errors: ${s.errors || 0})`);
      });
    }
  } catch (e) {
    console.log('  Error:', e.message);
  }

  // 2. Submit sitemap
  console.log(`\n submitting: ${SITEMAP_URL}`);
  try {
    await webmasters.sitemaps.submit({
      siteUrl: SITE_URL,
      feedpath: SITEMAP_URL,
    });
    console.log('  ✅ Sitemap submitted!');
  } catch (e) {
    console.error('  Error:', e.message);
  }

  console.log('\n✅ Done');
}

main().catch(console.error);
