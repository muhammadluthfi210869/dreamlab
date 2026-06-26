import path from 'path';
import https from 'https';
import { google } from 'googleapis';
import { readFileSync } from 'fs';

const CREDENTIALS_PATH = path.join(process.cwd(), 'scripts', 'gsc-credentials.json');
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'output');

const URLS = [
  'https://www.dreamlab.id/produk/bodycare/body-lotion/',
  'https://www.dreamlab.id/produk/bodycare/body-butter/',
  'https://www.dreamlab.id/produk/bodycare/bath-salt/',
  'https://www.dreamlab.id/produk/bodycare/massage-cream/',
  'https://www.dreamlab.id/produk/bodycare/massage-oil/',
  'https://www.dreamlab.id/produk/bodycare/bar-soap/',
  'https://www.dreamlab.id/produk/bodycare/soothing-gel/',
  'https://www.dreamlab.id/produk/bodycare/body-serum/',
  'https://www.dreamlab.id/produk/bodycare/transparent-soap/',
  'https://www.dreamlab.id/produk/bodycare/underarm-cream/',
  'https://www.dreamlab.id/produk/bodycare/whitening-soap/',
  'https://www.dreamlab.id/produk/bodycare/organic-soap/',
  'https://www.dreamlab.id/produk/bodycare/neck-cream/',
  'https://www.dreamlab.id/produk/bodycare/body-wash/',
  'https://www.dreamlab.id/produk/bodycare/body-scrub/',
  'https://www.dreamlab.id/produk/bodycare/shower-gel/',
];

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const client = await auth.getClient();
  const token = (await client.getAccessToken()).token!;

  console.log(`Submitting ${URLS.length} URLs to Google Indexing API...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < URLS.length; i++) {
    const url = URLS[i];
    const body = JSON.stringify({
      url: url,
      type: 'URL_UPDATED',
    });

    try {
      const response = await new Promise<string>((resolve, reject) => {
        const req = https.request({
          hostname: 'indexing.googleapis.com',
          path: '/v3/urlNotifications:publish',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }, (res) => {
          let data = '';
          res.on('data', c => data += c);
          res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
      });

      const parsed = JSON.parse(response);
      if (parsed.error) {
        console.log(`❌ [${i + 1}/${URLS.length}] ${url}: ${parsed.error.message}`);
        failed++;
      } else {
        console.log(`✅ [${i + 1}/${URLS.length}] ${url}: ${parsed.notificationMetadata?.lastNotifyTime || 'submitted'}`);
        success++;
      }
    } catch (e: any) {
      console.log(`❌ [${i + 1}/${URLS.length}] ${url}: ${e.message}`);
      failed++;
    }

    // Rate limit: 200/day, spread them out
    if (i < URLS.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\nDone: ${success} success, ${failed} failed`);
}

main().catch(console.error);
