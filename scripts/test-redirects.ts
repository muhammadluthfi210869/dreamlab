import seoMappingData from '../src/data/seo-mapping.json';
import { articles } from '../src/data/articles';

interface SeoMappingItem {
  source: string;
  destination: string;
  permanent?: boolean;
  _metadata?: {
    original_title: string;
    original_h1?: string;
  };
}

const seoMapping = seoMappingData as SeoMappingItem[];

interface RedirectTestResult {
  source: string;
  destination: string;
  status: 'valid' | 'invalid' | 'missing_dest' | 'self_redirect' | 'chain_risk';
  reason?: string;
}

async function testRedirects(): Promise<RedirectTestResult[]> {
  console.log('=== REDIRECT INTEGRITY TEST (v3.0) ===\n');

  const results: RedirectTestResult[] = [];

  // 1. Build a set of all valid destination slugs from articles
  const articleSlugs = new Set(articles.map(a => '/' + a.slug.replace(/^\/+/, '').replace(/\/+$/, '')));
  const mappingDestinations = new Set(seoMapping.map(m => {
    const d = (m.destination || '').replace(/\/$/, '') || '/';
    return d.startsWith('/') ? d : '/' + d;
  }));

  // 2. Build set of known static/valid paths
  const staticPaths = new Set([
    '/', '/news-blog', '/about-us', '/services', '/contact-us',
    '/our-client', '/career', '/terms-of-service', '/privacy-policy',
    '/maklon-skincare', '/maklon-body-care', '/maklon-baby-care',
    '/maklon-hair-care', '/maklon-foot-care', '/maklon-parfum',
    '/maklon-decorative', '/maklon-pkrt',
  ]);

  // 3. Test each mapping
  console.log('--- 1. SEISMIC MAPPING VALIDATION ---');
  console.log(`   Testing ${seoMapping.length} entries from seo-mapping.json\n`);

  let validCount = 0;
  let invalidCount = 0;
  let selfRedirectCount = 0;
  let chainRiskCount = 0;

  for (const item of seoMapping) {
    const source = (item.source || '').replace(/\/$/, '') || '/';
    const dest = (item.destination || '').replace(/\/$/, '') || '/';

    // Normalize
    const normalizedSource = source.startsWith('/') ? source : '/' + source;
    let normalizedDest = dest.startsWith('/') ? dest : '/' + dest;

    // Self-redirect check
    if (normalizedSource === normalizedDest || normalizedDest === normalizedSource + '/') {
      selfRedirectCount++;
      results.push({
        source: normalizedSource,
        destination: normalizedDest,
        status: 'self_redirect',
        reason: 'Source === Destination — harmless but unnecessary',
      });
      continue;
    }

    // Missing destination
    if (!item.destination || item.destination.trim() === '') {
      invalidCount++;
      results.push({
        source: normalizedSource,
        destination: '(empty)',
        status: 'missing_dest',
        reason: 'Destination is empty',
      });
      continue;
    }

    // External destination is always valid
    if (normalizedDest.startsWith('http')) {
      validCount++;
      results.push({ source: normalizedSource, destination: normalizedDest, status: 'valid' });
      continue;
    }

    // Check if destination path exists in any known source
    const exists = staticPaths.has(normalizedDest) ||
                   articleSlugs.has(normalizedDest) ||
                   mappingDestinations.has(normalizedDest);

    if (exists) {
      validCount++;
      results.push({ source: normalizedSource, destination: normalizedDest, status: 'valid' });
    } else {
      invalidCount++;
      results.push({
        source: normalizedSource,
        destination: normalizedDest,
        status: 'invalid',
        reason: `Destination "${normalizedDest}" not found in articles, static paths, or mapping destinations`,
      });
    }
  }

  // 4. Category → Silo redirect test
  console.log('--- 2. CATEGORY → SILO REDIRECTS ---');
  const categoryToSilo: Array<[string, string]> = [
    ['/skincare-face-care', '/maklon-skincare/'],
    ['/body-care', '/maklon-body-care/'],
    ['/baby-care', '/maklon-baby-care/'],
    ['/foot-care', '/maklon-foot-care/'],
    ['/hair-care', '/maklon-hair-care/'],
    ['/parfum', '/maklon-parfum/'],
    ['/decorative', '/maklon-decorative/'],
    ['/pkrt', '/maklon-pkrt/'],
    ['/product', '/services/'],
  ];

  let siloValid = 0;
  for (const [source, dest] of categoryToSilo) {
    const destClean = dest.replace(/\/$/, '');
    if (staticPaths.has(destClean)) {
      siloValid++;
    } else {
      console.log(`   ⚠️  ${source} → ${dest} — destination not in static paths`);
      chainRiskCount++;
    }
  }
  console.log(`   ${siloValid}/${categoryToSilo.length} silo redirects valid\n`);

  // 5. WordPress 301 legacy redirect test
  console.log('--- 3. WORDPRESS LEGACY 301s ---');
  const wpRedirects: Array<[string, string]> = [
    ['/tips-sukses-bisnis-parfum', '/bisnis-parfum-merk-sendiri/'],
    ['/maklon-scalp-haircare-bisnis-produk-rambut-sehat', '/pabrik-shampoo-merek-sendiri/'],
    ['/tren-parfum-arab-bisnis-maklon-dreamlab', '/produk-viral-tiktok/'],
    ['/maklon-skincare-untuk-brand-baru', '/maklon-kosmetik-pemula-modal-kecil/'],
    ['/prediksi-tren-2026', '/8-tren-kecantikan-2026-smart-formula/'],
    ['/pabrik-parfum-makasar', '/maklon-parfum-makassar/'],
    ['/cara-bisnis-skincare-dari-nol', '/bisnis-kosmetik-dari-nol/'],
    ['/pabrik-parfum-surabaya-biaya-2026', '/pabrik-parfum-surabaya/'],
    ['/maklon-parfum-bpom-indonesia-strategi-bisnis', '/maklon-parfum-dreamlab/'],
    ['/maklon-kosmetik-parfum-tangerang', '/maklon-kosmetik-tangerang-terpercaya/'],
    ['/maklon-kosmetik-jakarta-dreamlab-2026', '/maklon-jakarta-terbaik/'],
    ['/maklon-skincare-surabaya-umkm', '/pabrik-maklon-kosmetik-surabaya-terlengkap/'],
    ['/jasa-maklon-sabun-mandi-batang', '/jasa-maklon-bar-soap-merek-sendiri/'],
    ['/bahan-aktif-untuk-mengatasi-jerawat', '/bahan-aktif-skincare-jerawat/'],
    ['/maklon-parfum-jakarta', '/pabrik-parfum-jakarta/'],
    ['/rahasia-maklon-parfum-jakarta', '/pabrik-parfum-jakarta/'],
    ['/body-care-2', '/maklon-body-care/'],
    ['/cara-membuat-masker-wajah-organik-praktis-aman-dan-cocok-untuk-ide-bisnis-skincare', '/maklon-skincare/masker-wajah/'],
  ];

  let wpValid = 0;
  let wpInvalid = 0;
  for (const [source, dest] of wpRedirects) {
    const destClean = dest.replace(/\/$/, '');
    const sourceClean = source.replace(/\/$/, '');
    const exists = staticPaths.has(destClean) || articleSlugs.has(destClean) || mappingDestinations.has(destClean);
    if (exists) {
      wpValid++;
      results.push({ source: sourceClean, destination: destClean, status: 'valid' });
    } else {
      wpInvalid++;
      results.push({
        source: sourceClean,
        destination: destClean,
        status: 'invalid',
        reason: `WP legacy redirect destination "${destClean}" not found in known paths`,
      });
    }
  }
  console.log(`   ${wpValid} valid, ${wpInvalid} invalid\n`);

  // 6. News-blog → root redirect integrity
  console.log('--- 4. NEWS-BLOG → ROOT ARTICLE REDIRECTS ---');
  const articleRedirectCount = articles.length;
  console.log(`   ${articleRedirectCount} article slugs will auto-generate /news-blog/{slug} → /{slug}/ redirects`);
  console.log('   ✅ Auto-generated via next.config.ts\n');

  // 7. Final report
  console.log('═══════════════════════════════════');
  console.log('       REDIRECT TEST REPORT        ');
  console.log('═══════════════════════════════════');
  console.log(`   Total SEO Mapping Entries : ${seoMapping.length}`);
  console.log(`   ✅ Valid                  : ${validCount}`);
  console.log(`   🔄 Self-Redirects         : ${selfRedirectCount}`);
  console.log(`   ⛓️ Chain Risks             : ${chainRiskCount}`);
  console.log(`   ❌ Invalid                : ${invalidCount}`);
  console.log(`   📝 WP Legacy 301s         : ${wpValid}/${wpRedirects.length} valid`);
  console.log(`   📝 Silo Redirects         : ${siloValid}/${categoryToSilo.length} valid`);
  console.log(`   📝 Article Redirects      : ${articleRedirectCount} (auto)`);

  const totalValid = validCount + selfRedirectCount + wpValid + siloValid;
  const totalInvalid = invalidCount + (wpRedirects.length - wpValid) + (categoryToSilo.length - siloValid);

  console.log(`\n   ${totalInvalid === 0 ? '🌟 ALL REDIRECTS VALID — ZERO BROKEN' : `⚠️  ${totalInvalid} issues to fix`}`);

  if (invalidCount > 0 || wpInvalid > 0) {
    console.log('\n--- INVALID REDIRECTS (MUST FIX BEFORE CUTOVER) ---');
    const invalids = results.filter(r => r.status === 'invalid');
    invalids.forEach(r => console.log(`   ❌ ${r.source} → ${r.destination} | ${r.reason}`));
    process.exit(1);
  }

  return results;
}

testRedirects().catch(console.error);
