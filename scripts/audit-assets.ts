import fs from 'fs';
import path from 'path';

async function auditAssets() {
  console.log('🔍 Starting Visual Asset Integrity Audit...');
  
  const articlesPath = path.join(process.cwd(), 'src', 'data', 'articles.ts');
  const blogImagesDir = path.join(process.cwd(), 'public', 'assets', 'images', 'blog');
  const generalImagesDir = path.join(process.cwd(), 'public', 'assets', 'images');

  if (!fs.existsSync(articlesPath)) {
    console.error('❌ Error: articles.ts missing!');
    return;
  }

  // Ensure directories exist
  if (!fs.existsSync(blogImagesDir)) fs.mkdirSync(blogImagesDir, { recursive: true });

  // Load Articles Data (simple regex for images)
  const articlesContent = fs.readFileSync(articlesPath, 'utf-8');
  
  // 1. Check Featured Images (Cover)
  // Format: "featuredImage": "filename.webp"
  const featuredImages = Array.from(articlesContent.matchAll(/"featuredImage":\s*["']([^"']+)["']/g))
    .map(m => m[1])
    .filter(img => img && img !== 'null' && !img.startsWith('http'));

  // 2. Check Inline Content Images
  // Format: src="https://dreamlab.id/wp-content/uploads/..." 
  // or src="/assets/images/..."
  const contentImages = Array.from(articlesContent.matchAll(/src=\\?["'](?:https:\/\/dreamlab\.id\/wp-content\/uploads\/|\/assets\/images\/)([^"'\\]+)\\?["']/g))
    .map(m => m[1]);

  const uniqueImages = [...new Set([...featuredImages, ...contentImages])];
  
  const missing = [];
  const found = [];

  for (const imgName of uniqueImages) {
    // Check in both blog and general assets dir
    const possiblePaths = [
        path.join(blogImagesDir, imgName),
        path.join(generalImagesDir, imgName),
        path.join(generalImagesDir, path.basename(imgName))
    ];

    const exists = possiblePaths.some(p => fs.existsSync(p));

    if (exists) {
      found.push(imgName);
    } else {
      missing.push(imgName);
    }
  }

  console.log('\n--- Asset Audit Report ---');
  console.log(`✅ Total Unique Images Checked: ${uniqueImages.length}`);
  console.log(`🟢 Images Found & Verified: ${found.length}`);
  console.log(`🔴 Missing Images (Critical for SEO): ${missing.length}`);

  if (missing.length > 0) {
    console.log('\n⚠️ The following images are missing from your public/assets/images folder:');
    // Group by type for easier fixing
    missing.slice(0, 20).forEach(m => console.log(` - ${m}`));
    if (missing.length > 20) console.log(` ... and ${missing.length - 20} more.`);
    
    console.log('\n💡 Recommendation: Copy these files from your WordPress wp-content/uploads/ folder to:');
    console.log(`   ${blogImagesDir}`);
  } else {
    console.log('\n🌟 100% Visual Parity Confirmed! No broken images found.');
  }
}

auditAssets().catch(console.error);
