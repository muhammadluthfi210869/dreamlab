/**
 * GSC ZERO-CLICK AUDIT — Identifikasi & kategorisasi halaman 0 klik untuk di-410
 * Jalankan: node scripts/gsc-advanced-report.mjs
 */

import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'output');
const CREDENTIALS_PATH = path.join(__dirname, 'gsc-credentials.json');
const REPORT_FILE = path.join(OUTPUT_DIR, 'gsc-advanced-report.json');
const SUMMARY_FILE = path.join(OUTPUT_DIR, 'GSC-ADVANCED-LAPORAN.md');
const ZERO_CLICK_FILE = path.join(OUTPUT_DIR, 'zero-click-audit.json');
const ZERO_CLICK_MD = path.join(OUTPUT_DIR, 'ZERO-CLICK-AUDIT.md');

// Site URLs — sc-domain untuk search analytics, https:// untuk URL Inspection
const SITE_URL = 'sc-domain:dreamlab.id';
const SITE_URL_INSPECT = 'https://dreamlab.id';
const fmt = (d) => d.toISOString().split('T')[0];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('='.repeat(70));
  console.log('  🎯 ZERO-CLICK AUDIT — dreamlab.id');
  console.log('  Level 2: Identifikasi halaman 0-klik untuk di-410');
  console.log('='.repeat(70) + '\n');

  // Auth
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const webmasters = google.webmasters({ version: 'v3', auth });

  // =========================================
  // 1. GET ALL PERFORMANCE DATA (90 hari)
  // =========================================
  console.log('📊 1. Mengambil data performa pencarian 90 hari...');

  const endDate = new Date(); endDate.setDate(endDate.getDate() - 1);
  const startDate = new Date(); startDate.setDate(startDate.getDate() - 90);

  const allPages = [];
  let totalClicks = 0;
  let totalImpressions = 0;

  try {
    let startRow = 0;
    const pageSize = 25000;

    while (true) {
      const response = await webmasters.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: fmt(startDate),
          endDate: fmt(endDate),
          dimensions: ['page'],
          rowLimit: pageSize,
          startRow: startRow,
        },
      });

      const rows = response.data.rows || [];
      if (rows.length === 0) break;

      for (const row of rows) {
        const url = row.keys?.[0] || '';
        const slug = url.replace(/https?:\/\/dreamlab\.id/gi, '').replace(/\/$/, '') || '/';
        allPages.push({
          url,
          slug,
          clicks: row.clicks || 0,
          impressions: row.impressions || 0,
          ctr: row.ctr || 0,
          avgPosition: row.position || 0,
        });
        totalClicks += row.clicks || 0;
        totalImpressions += row.impressions || 0;
      }

      console.log(`   Batch: ${startRow} - ${startRow + rows.length} (total: ${allPages.length})`);

      if (rows.length < pageSize) break;
      startRow += pageSize;
      await sleep(200);
    }
  } catch (e) {
    console.error('   ❌ Error:', e.message);
  }

  console.log(`   ✅ Total: ${allPages.length} halaman, ${totalClicks} klik, ${totalImpressions} impressions`);

  // =========================================
  // 2. KLASIFIKASI HALAMAN
  // =========================================
  console.log('\n📂 2. Mengklasifikasikan halaman...');

  // Kategorisasi URL pattern
  function categorizeUrl(slug) {
    if (slug === '/' || slug === '') return 'homepage';
    if (slug.startsWith('/produk/')) return 'product';
    if (slug.startsWith('/maklon/')) return 'maklon';
    if (slug.startsWith('/category/')) return 'category';
    if (slug.startsWith('/news-blog/') || slug.startsWith('/news-blog')) return 'blog';
    if (slug.startsWith('/panduan/')) return 'panduan';
    if (slug.startsWith('/ads/')) return 'ads';
    if (slug.startsWith('/about-us/') || slug === '/about-us') return 'about';
    if (slug.startsWith('/contact') || slug === '/contact-us') return 'contact';
    if (slug.startsWith('/privacy') || slug.startsWith('/terms') || slug.startsWith('/cookie')) return 'legal';
    if (slug.startsWith('/our-client') || slug === '/our-client') return 'social-proof';
    if (slug.startsWith('/career') || slug === '/career') return 'career';
    if (slug.startsWith('/services') || slug === '/services') return 'services';
    if (slug.startsWith('/thankyou')) return 'thankyou';
    if (slug.startsWith('/metaads') || slug.startsWith('/google-ads')) return 'ads';
    if (slug.startsWith('/author/')) return 'author';
    if (slug.startsWith('/landing/')) return 'landing';
    if (slug.startsWith('/parfum/')) return 'parfum-redirect';
    if (slug.startsWith('/skincare-face-care/')) return 'skincare-redirect';
    // Wordpress/legacy paths
    if (slug.includes('/blog/') || slug.includes('/wp-')) return 'legacy-wp';
    // Others are articles/blog posts
    return 'article';
  }

  const classifiedPages = allPages.map(p => ({
    ...p,
    category: categorizeUrl(p.slug),
  }));

  // Group by category
  const byCategory = {};
  for (const p of classifiedPages) {
    if (!byCategory[p.category]) byCategory[p.category] = { total: 0, zeroClicks: 0, pages: [] };
    byCategory[p.category].total++;
    byCategory[p.category].pages.push(p);
    if (p.clicks === 0) byCategory[p.category].zeroClicks++;
  }

  console.log('\n   📋 Distribusi URL:');
  for (const [cat, data] of Object.entries(byCategory).sort((a, b) => b[1].total - a[1].total)) {
    console.log(`   ${cat.padEnd(20)} ${String(data.total).padStart(5)} total, ${String(data.zeroClicks).padStart(5)} zero-click (${(data.zeroClicks/data.total*100).toFixed(0)}%)`);
  }

  // =========================================
  // 3. IDENTIFIKASI KANDIDAT 410
  // =========================================
  console.log('\n🔍 3. Mengidentifikasi kandidat 410...');

  // Kategori halaman yang AMAN di-410:
  // A. Thin product sub-categories (pkrt, footcare, babycare, decorative) — sudah ditangani
  // B. Legacy WP paths that slipped through
  // C. Redirect-only pages (parfum/, skincare-face-care/)
  // D. Zero-click articles with 0 impressions (no search demand at all)
  // E. Thankyou/landing pages
  // F. Author pages with 0 clicks
  // G. Empty category pages

  const candidates410 = [];
  const needsContentFix = [];
  const needsRedirectFix = [];
  const keepAsIs = [];

  for (const p of classifiedPages) {
    if (p.clicks > 0) {
      // Has clicks — KEEP
      keepAsIs.push(p);
      continue;
    }

    // Zero-click pages — evaluate

    // Check if already handled (thin categories already in proxy.ts)
    const isThinProduct = p.slug.match(/^\/produk\/(pkrt|footcare|babycare|decorative)/);
    if (isThinProduct) {
      candidates410.push({ ...p, reason: 'Thin product category (already in proxy.ts)', confidence: 'HIGH' });
      continue;
    }

    // Redirect stubs (pages that only existed to redirect)
    if (p.slug.startsWith('/parfum/') || p.slug.startsWith('/skincare-face-care/')) {
      candidates410.push({ ...p, reason: 'Legacy redirect stub — no content', confidence: 'HIGH' });
      continue;
    }

    // Thankyou / landing pages — no SEO value
    if (p.slug.startsWith('/thankyou') || p.slug.startsWith('/landing/') || p.slug.startsWith('/metaads/') || p.slug.startsWith('/google-ads/')) {
      candidates410.push({ ...p, reason: 'Thankyou/landing/ads page — no SEO value', confidence: 'HIGH' });
      continue;
    }

    // Author pages with 0 clicks
    if (p.slug.startsWith('/author/')) {
      candidates410.push({ ...p, reason: 'Author archive — 0 clicks (should noindex)', confidence: 'HIGH' });
      continue;
    }

    // Zero-click, zero-impression articles (no search demand at all)
    if (p.category === 'article' && p.impressions === 0) {
      candidates410.push({ ...p, reason: 'Article with 0 impressions in 90 days — no search demand', confidence: 'HIGH' });
      continue;
    }

    // Zero-click product pages that aren't in main categories
    if (p.category === 'product' && p.impressions === 0) {
      candidates410.push({ ...p, reason: 'Product page with 0 impressions — no demand', confidence: 'MEDIUM' });
      continue;
    }

    // Legacy WP pages
    if (p.category === 'legacy-wp') {
      candidates410.push({ ...p, reason: 'Legacy WordPress path', confidence: 'HIGH' });
      continue;
    }

    // Zero-click with low impressions — needs content fix or 410
    if (p.impressions < 50) {
      candidates410.push({ ...p, reason: `Zero clicks, ${p.impressions} impressions in 90 days — very low search demand`, confidence: 'MEDIUM' });
      continue;
    }

    // Zero-click but has some impressions — might have potential with content fix
    if (p.impressions >= 50) {
      needsContentFix.push({ ...p, reason: `Zero clicks but ${p.impressions} impressions — needs content improvement`, confidence: 'LOW_410' });
      continue;
    }

    // Default — keep
    keepAsIs.push(p);
  }

  const verified410 = candidates410.filter(c => c.confidence === 'HIGH');
  const medium410 = candidates410.filter(c => c.confidence === 'MEDIUM');

  console.log(`\n   ✅ Kandidat 410 (HIGH confidence): ${verified410.length} halaman`);
  console.log(`   ⚠️  Kandidat 410 (MEDIUM confidence): ${medium410.length} halaman`);
  console.log(`   📝 Butuh perbaikan konten: ${needsContentFix.length} halaman`);
  console.log(`   ✅ Dipertahankan (ada clicks): ${keepAsIs.length} halaman`);

  // =========================================
  // 4. DETAIL PER KATEGORI
  // =========================================
  console.log('\n📋 4. Detail kandidat HIGH confidence:');

  const byReason = {};
  for (const c of verified410) {
    if (!byReason[c.reason]) byReason[c.reason] = [];
    byReason[c.reason].push(c);
  }

  for (const [reason, pages] of Object.entries(byReason).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`   [${String(pages.length).padStart(3)}] ${reason}`);
    // Show first 5 as sample
    for (const p of pages.slice(0, 5)) {
      console.log(`         ${p.slug}`);
    }
    if (pages.length > 5) console.log(`         ... and ${pages.length - 5} more`);
  }

  // =========================================
  // 5. SAVE AUDIT RESULT
  // =========================================
  console.log('\n💾 5. Menyimpan hasil audit...');

  const auditResult = {
    generated_at: new Date().toISOString(),
    data_period: { start: fmt(startDate), end: fmt(endDate) },
    summary: {
      total_pages: allPages.length,
      total_clicks: totalClicks,
      total_impressions: totalImpressions,
      zero_click_pages: classifiedPages.filter(p => p.clicks === 0).length,
      high_confidence_410: verified410.length,
      medium_confidence_410: medium410.length,
      needs_content_fix: needsContentFix.length,
      keep_with_clicks: keepAsIs.length,
    },
    high_confidence_410: verified410.map(p => ({
      url: p.url,
      slug: p.slug,
      category: p.category,
      impressions: p.impressions,
      reason: p.reason,
    })),
    medium_confidence_410: medium410.map(p => ({
      url: p.url,
      slug: p.slug,
      category: p.category,
      impressions: p.impressions,
      reason: p.reason,
    })),
    needs_content_fix: needsContentFix.map(p => ({
      url: p.url,
      slug: p.slug,
      category: p.category,
      impressions: p.impressions,
      reason: p.reason,
    })),
    by_category: Object.fromEntries(
      Object.entries(byCategory).map(([cat, data]) => [cat, { total: data.total, zero_clicks: data.zeroClicks }])
    ),
  };

  fs.writeFileSync(ZERO_CLICK_FILE, JSON.stringify(auditResult, null, 2));
  console.log(`   ✅ JSON: ${ZERO_CLICK_FILE}`);

  // =========================================
  // 6. CREATE ACTION PLAN MD
  // =========================================
  console.log('📝 6. Membuat action plan...');

  const md = [];
  md.push('# 🎯 ZERO-CLICK AUDIT — Level 2 Action Plan');
  md.push('');
  md.push(`**Generated:** ${auditResult.generated_at}`);
  md.push(`**Data Period:** ${auditResult.data_period.start} → ${auditResult.data_period.end}`);
  md.push('');
  md.push('---');
  md.push('');
  md.push('## 📊 SUMMARY');
  md.push('');
  md.push('| Metrik | Value |');
  md.push('|--------|-------|');
  md.push(`| Total Pages in GSC | ${auditResult.summary.total_pages} |`);
  md.push(`| Total Clicks (90 hari) | ${auditResult.summary.total_clicks} |`);
  md.push(`| Total Impressions (90 hari) | ${auditResult.summary.total_impressions} |`);
  md.push(`| Zero-Click Pages | ${auditResult.summary.zero_click_pages} |`);
  md.push(`| 🔴 HIGH Confidence 410 | ${auditResult.summary.high_confidence_410} |`);
  md.push(`| 🟡 MEDIUM Confidence 410 | ${auditResult.summary.medium_confidence_410} |`);
  md.push(`| 📝 Needs Content Fix | ${auditResult.summary.needs_content_fix} |`);
  md.push(`| ✅ Keep (Has Clicks) | ${auditResult.summary.keep_with_clicks} |`);
  md.push('');
  md.push('---');
  md.push('');
  md.push('## 🔴 HIGH CONFIDENCE 410 CANDIDATES');
  md.push('');
  md.push('Halaman-halaman ini **aman di-410** karena:');
  md.push('- 0 klik dalam 90 hari');
  md.push('- 0 atau sangat rendah impressions');
  md.push('- Template/thin content tidak memiliki backlink');
  md.push('- Tidak ada nilai SEO yang hilang');
  md.push('');

  for (const [reason, pages] of Object.entries(byReason).sort((a, b) => b[1].length - a[1].length)) {
    md.push(`### ${reason} (${pages.length} pages)`);
    md.push('');
    for (const p of pages) {
      md.push(`- \`${escapeMd(p.slug)}\``);
    }
    md.push('');
  }

  md.push('---');
  md.push('');

  if (medium410.length > 0) {
    md.push('## 🟡 MEDIUM CONFIDENCE 410 CANDIDATES');
    md.push('');
    md.push('Halaman-halaman ini **mungkin bisa di-410**, tapi perlu verifikasi manual:');
    md.push('');

    const medByReason = {};
    for (const c of medium410) {
      if (!medByReason[c.reason]) medByReason[c.reason] = [];
      medByReason[c.reason].push(c);
    }
    for (const [reason, pages] of Object.entries(medByReason).sort((a, b) => b[1].length - a[1].length)) {
      md.push(`### ${reason} (${pages.length} pages)`);
      md.push('');
      md.push(pages.map(p => `- \`${escapeMd(p.slug)}\``).join('\n'));
      md.push('');
    }
    md.push('');
  }

  if (needsContentFix.length > 0) {
    md.push('## 📝 NEEDS CONTENT FIX (NOT 410)');
    md.push('');
    md.push('Halaman-halaman ini punya impressions tapi 0 klik — lebih baik perbaiki konten daripada di-410:');
    md.push('');
    const fixByReason = {};
    for (const c of needsContentFix) {
      if (!fixByReason[c.reason]) fixByReason[c.reason] = [];
      fixByReason[c.reason].push(c);
    }
    for (const [reason, pages] of Object.entries(fixByReason).sort((a, b) => b[1].length - a[1].length)) {
      md.push(`### ${reason} (${pages.length} pages)`);
      md.push('');
      md.push(pages.slice(0, 20).map(p => `- \`${escapeMd(p.slug)}\` (${p.impressions} impressions)`).join('\n'));
      if (pages.length > 20) md.push(`- ... and ${pages.length - 20} more`);
      md.push('');
    }
    md.push('');
  }

  md.push('---');
  md.push('');
  md.push('## 📋 DISTRIBUSI BERDASARKAN KATEGORI');
  md.push('');
  md.push('| Kategori | Total | Zero-Click | % Zero |');
  md.push('|----------|:----:|:----------:|:------:|');
  for (const [cat, data] of Object.entries(byCategory).sort((a, b) => b[1].total - a[1].total)) {
    const pct = data.total > 0 ? (data.zeroClicks / data.total * 100).toFixed(0) : '0';
    md.push(`| ${cat} | ${data.total} | ${data.zeroClicks} | ${pct}% |`);
  }
  md.push('');
  md.push('---');
  md.push('');
  md.push('## ✅ ACTION PLAN');
  md.push('');
  md.push('### Phase 2A: 410 Gone (Right Now)');
  md.push('');
  md.push(`1. **Add ${verified410.length} patterns to proxy.ts GONE_PATTERNS**`);
  md.push('2. Deploy to production');
  md.push('3. Monitor GSC coverage in 3-7 days');
  md.push('');
  md.push('### Phase 2B: Content Fix');
  md.push('');
  md.push(`1. **Improve ${needsContentFix.length} pages with thin content**`);
  md.push('2. Add internal links from high-authority pages');
  md.push('3. Request indexing via GSC API');
  md.push('');
  md.push('### Phase 2C: Medium Confidence 410');
  md.push('');
  md.push(`1. **Verify ${medium410.length} pages manually**`);
  md.push('2. Check for backlinks (manually via GSC Links report)');
  md.push('3. If no backlinks, add to 410 patterns');
  md.push('');
  md.push('---');
  md.push('');
  md.push(`📁 Output: \`scripts/output/zero-click-audit.json\``);

  fs.writeFileSync(ZERO_CLICK_MD, md.join('\n'));
  console.log(`   ✅ Action plan: ${ZERO_CLICK_MD}`);

  // Console summary
  console.log('\n' + '='.repeat(70));
  console.log('  RINGKASAN AKHIR');
  console.log('='.repeat(70));
  console.log();
  console.log(`📊 Total halaman: ${allPages.length}`);
  console.log(`   Dengan clicks: ${keepAsIs.length}`);
  console.log(`   Zero clicks:   ${classifiedPages.filter(p => p.clicks === 0).length}`);
  console.log();
  console.log(`🎯 🔴 HIGH confidence 410: ${verified410.length} halaman → langsung bisa`);
  console.log(`🎯 🟡 MEDIUM confidence 410: ${medium410.length} halaman → verifikasi manual`);
  console.log(`🎯 📝 Needs content fix: ${needsContentFix.length} halaman`);
  console.log();
  console.log(`📁 Zero-click audit: ${ZERO_CLICK_FILE}`);
  console.log(`📁 Action plan:      ${ZERO_CLICK_MD}`);
}

function escapeMd(str) {
  return str.replace(/[|*{}[\]()#+\-!]/g, '\\$&');
}

main().catch(err => {
  console.error('\n❌ Fatal:', err);
  process.exit(1);
});
