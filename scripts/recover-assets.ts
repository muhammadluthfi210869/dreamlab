import axios from 'axios';
import fs from 'fs';
import path from 'path';

const AUDIT_REPORT_PATH = path.join(process.cwd(), '../asset-audit-report.json');
const TARGET_DIR = path.join(process.cwd(), 'public/assets/images');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function downloadImage(url: string, filename: string) {
  const filePath = path.join(TARGET_DIR, filename);
  
  // Skip if already exists
  if (fs.existsSync(filePath)) {
    return 'EXISTS';
  }

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve('DOWNLOADED'));
      writer.on('error', reject);
    });
  } catch (error) {
    return `FAILED: ${error instanceof Error ? error.message : String(error)}`;
  }
}

async function recoverAssets() {
  console.log('🚀 Starting Mass Asset Recovery...');
  
  if (!fs.existsSync(AUDIT_REPORT_PATH)) {
    console.error(`❌ Audit report not found at ${AUDIT_REPORT_PATH}`);
    return;
  }

  const auditData = JSON.parse(fs.readFileSync(AUDIT_REPORT_PATH, 'utf8'));
  const missingUrls = auditData.missing_urls || [];

  console.log(`📦 Found ${missingUrls.length} missing assets to recover.`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < missingUrls.length; i++) {
    const url = missingUrls[i];
    
    // Extract filename from URL (remove query params and path)
    const urlObj = new URL(url);
    let filename = path.basename(urlObj.pathname);
    
    // Clean up filename (sometimes they have weird characters)
    filename = decodeURIComponent(filename);

    process.stdout.write(`[${i + 1}/${missingUrls.length}] Downloading ${filename}... `);
    
    const result = await downloadImage(url, filename);
    
    if (result === 'DOWNLOADED') {
      console.log('✅');
      downloaded++;
    } else if (result === 'EXISTS') {
      console.log('⏭️ (Already exists)');
      skipped++;
    } else {
      console.log(`❌ ${result}`);
      failed++;
    }

    // Small delay to avoid hammering the server
    if (i % 5 === 0) await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n--- RECOVERY SUMMARY ---');
  console.log(`✅ Downloaded: ${downloaded}`);
  console.log(`⏭️ Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📂 Assets saved to: ${TARGET_DIR}`);
}

recoverAssets().catch(console.error);
