import path from 'path';
import https from 'https';
import { google } from 'googleapis';
import { readFileSync } from 'fs';

const CREDENTIALS_PATH = path.join(process.cwd(), 'scripts', 'gsc-credentials.json');
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'output');

const URLS = [
  // 9 Sub-Category Hub Pages (newly added Service + WebPage + BreadcrumbList + FAQPage Schema)
  'https://dreamlab.id/produk/skincare/facial-serum/',
  'https://dreamlab.id/produk/skincare/facial-toner/',
  'https://dreamlab.id/produk/skincare/facial-wash/',
  'https://dreamlab.id/produk/skincare/face-cream/',
  'https://dreamlab.id/produk/skincare/face-mask/',
  'https://dreamlab.id/produk/skincare/sunscreen/',
  'https://dreamlab.id/produk/skincare/cleansing/',
  'https://dreamlab.id/produk/decorative/make-up/',
  'https://dreamlab.id/produk/decorative/lipcare/',
  // 7 Core Category Pages & Main Catalog Hub
  'https://dreamlab.id/produk/',
  'https://dreamlab.id/produk/skincare/',
  'https://dreamlab.id/produk/bodycare/',
  'https://dreamlab.id/produk/haircare/',
  'https://dreamlab.id/produk/parfum/',
  'https://dreamlab.id/produk/decorative/',
  'https://dreamlab.id/produk/babycare/',
  'https://dreamlab.id/produk/footcare/',
  // Priority Bodycare & New Blog Articles
  'https://dreamlab.id/maklon-hb-dosting/',
  'https://dreamlab.id/cara-membuat-hb-dosting-sendiri/',
  'https://dreamlab.id/checklist-legalitas-brand-kosmetik/',
  'https://dreamlab.id/cara-memulai-brand-hair-tonic-ginseng/',
  'https://dreamlab.id/maklon-kosmetik-bogor/',
  'https://dreamlab.id/langkah-praktis-sertifikasi-halal-kosmetik/',
  'https://dreamlab.id/produk/bodycare/body-lotion/',
  'https://dreamlab.id/produk/bodycare/body-butter/',
  'https://dreamlab.id/produk/bodycare/body-serum/',
  'https://dreamlab.id/produk/bodycare/body-wash/',
  'https://dreamlab.id/produk/bodycare/body-scrub/',
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
