import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import seoMappingData from '../src/data/seo-mapping.json';

interface AuditData {
  url: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  canonical: string;
}

interface SeoMappingItem {
  source: string;
  destination: string;
  _metadata?: { original_title: string; original_h1?: string };
}

interface IntegrityReport {
  csv: { total: number; passed: number; failed: number; missing: string[] };
  metadata: { missingTitle: number; missingDesc: number; truncated: string[] };
  schema: { hasAggregateRating: boolean; schemaFileClean: boolean };
  soft404: { validateFunctionFound: boolean; catchAllImportsNotFound: boolean };
  seoMapping: { totalMappings: number; dirtySlugs: string[] };
  articleCoverage: { totalArticles: number; matchedInMapping: number; orphans: string[] };
}

async function verifySEOIntegrity(): Promise<IntegrityReport> {
  console.log('=== SEO INTEGRITY VERIFICATION v3.0 ===\n');

  const csvPath = path.join(process.cwd(), 'src', 'data', 'seo-audit-export.csv');
  const articlesPath = path.join(process.cwd(), 'src', 'data', 'articles.ts');
  const schemaGenPath = path.join(process.cwd(), 'src', 'lib', 'schema-generator.ts');
  const catchAllPagePath = path.join(process.cwd(), 'src', 'app', '[...slug]', 'page.tsx');

  const report: IntegrityReport = {
    csv: { total: 0, passed: 0, failed: 0, missing: [] },
    metadata: { missingTitle: 0, missingDesc: 0, truncated: [] },
    schema: { hasAggregateRating: false, schemaFileClean: false },
    soft404: { validateFunctionFound: false, catchAllImportsNotFound: false },
    seoMapping: { totalMappings: 0, dirtySlugs: [] },
    articleCoverage: { totalArticles: 0, matchedInMapping: 0, orphans: [] },
  };

  // ═══════════════════════════════════════════
  // GATE A: Soft 404 Defense Check
  // ═══════════════════════════════════════════
  console.log('--- GATE A: SOFT 404 DEFENSE ---');
  if (fs.existsSync(catchAllPagePath)) {
    const catchAllContent = fs.readFileSync(catchAllPagePath, 'utf-8');
    report.soft404.validateFunctionFound = catchAllContent.includes('validateSlugOrReject');
    report.soft404.catchAllImportsNotFound = catchAllContent.includes('notFound') && catchAllContent.includes('seo-mapping.json');

    console.log(report.soft404.validateFunctionFound
      ? '   ✅ validateSlugOrReject() ditemukan di [...slug]/page.tsx'
      : '   ❌ CRITICAL: validateSlugOrReject() TIDAK DITEMUKAN!');
    console.log(report.soft404.catchAllImportsNotFound
      ? '   ✅ notFound + seo-mapping.json diimpor'
      : '   ❌ CRITICAL: notFound atau seo-mapping.json tidak diimpor!');
  } else {
    console.log('   ❌ [...slug]/page.tsx TIDAK DITEMUKAN!');
  }
  console.log('');

  // ═══════════════════════════════════════════
  // GATE B: Schema Sanitization Check
  // ═══════════════════════════════════════════
  console.log('--- GATE B: SCHEMA SANITIZATION ---');
  if (fs.existsSync(schemaGenPath)) {
    const schemaContent = fs.readFileSync(schemaGenPath, 'utf-8');
    report.schema.hasAggregateRating = schemaContent.includes('aggregateRating') || schemaContent.includes('ratingValue') || schemaContent.includes('reviewCount');
    report.schema.schemaFileClean = !report.schema.hasAggregateRating;

    if (report.schema.hasAggregateRating) {
      console.log('   ❌ CRITICAL: aggregateRating/ratingValue/reviewCount MASIH ADA di schema-generator.ts!');
      if (schemaContent.includes('aggregateRating')) console.log('      - aggregateRating ditemukan');
      if (schemaContent.includes('ratingValue')) console.log('      - ratingValue ditemukan');
      if (schemaContent.includes('reviewCount')) console.log('      - reviewCount ditemukan');
    } else {
      console.log('   ✅ Schema bersih — tidak ada aggregateRating fiktif');
    }
  } else {
    console.log('   ❌ schema-generator.ts TIDAK DITEMUKAN!');
  }
  console.log('');

  // ═══════════════════════════════════════════
  // CSV Audit Integrity
  // ═══════════════════════════════════════════
  console.log('--- CSV AUDIT INTEGRITY ---');
  if (!fs.existsSync(csvPath)) {
    console.log('   ❌ seo-audit-export.csv MISSING!');
    return report;
  }

  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const auditRecords = parse(fileContent, { columns: true }) as AuditData[];
  report.csv.total = auditRecords.length;

  let validSlugs = 0;
  const invalidSlugs: string[] = [];
  let missingTitle = 0;
  let missingDesc = 0;
  const truncatedTitles: string[] = [];

  for (const record of auditRecords) {
    const slug = (record.slug || '').replace(/\/$/, '') || '/';
    const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;

    // Validate slug format
    if (!cleanSlug || cleanSlug === '/' || cleanSlug.includes(' ') || cleanSlug.includes('%20') || cleanSlug.includes(':')) {
      continue;
    }
    if (cleanSlug.length > 200) continue;

    validSlugs++;
    report.csv.passed++;

    // Check metadata
    if (!record.meta_title || record.meta_title.trim() === '') missingTitle++;
    if (!record.meta_description || record.meta_description.trim() === '') missingDesc++;
    if (record.meta_title && record.meta_title.length > 60) {
      truncatedTitles.push(`${cleanSlug}: "${record.meta_title.substring(0, 60)}..." (${record.meta_title.length} chars)`);
    }
  }

  report.metadata.missingTitle = missingTitle;
  report.metadata.missingDesc = missingDesc;
  report.metadata.truncated = truncatedTitles;

  console.log(`   Total CSV entries: ${report.csv.total}`);
  console.log(`   Valid slugs: ${validSlugs}`);
  console.log(`   Missing titles: ${missingTitle}`);
  console.log(`   Missing descriptions: ${missingDesc}`);
  console.log(`   Truncated titles (>60 chars): ${truncatedTitles.length}`);
  if (truncatedTitles.length > 0 && truncatedTitles.length <= 10) {
    truncatedTitles.forEach(t => console.log(`     - ${t}`));
  }
  console.log('');

  // ═══════════════════════════════════════════
  // SEO Mapping Validation
  // ═══════════════════════════════════════════
  console.log('--- SEO MAPPING VALIDATION ---');
  const mapping = seoMappingData as SeoMappingItem[];
  report.seoMapping.totalMappings = mapping.length;

  const dirtySlugs: string[] = [];
  for (const item of mapping) {
    const source = (item.source || '').replace(/\/$/, '') || '/';
    if (source.includes('%20') || source.includes(' ') || source.length > 200) {
      dirtySlugs.push(source);
    }
  }
  report.seoMapping.dirtySlugs = dirtySlugs;
  console.log(`   Total mappings: ${report.seoMapping.totalMappings}`);
  console.log(`   Dirty slugs: ${dirtySlugs.length}`);
  if (dirtySlugs.length > 0) {
    dirtySlugs.slice(0, 10).forEach(s => console.log(`     - ${s}`));
  }
  console.log('');

  // ═══════════════════════════════════════════
  // Article Coverage
  // ═══════════════════════════════════════════
  console.log('--- ARTICLE COVERAGE ---');
  if (fs.existsSync(articlesPath)) {
    const articlesContent = fs.readFileSync(articlesPath, 'utf-8');
    const articleSlugMatches = Array.from(articlesContent.matchAll(/["']?slug["']?:\s*["']([^"']+)["']/g)).map(m => m[1]);
    report.articleCoverage.totalArticles = articleSlugMatches.length;

    // Check how many articles have a mapping entry
    const mappingSources = new Set(mapping.map(m => (m.source || '').replace(/^\//, '').replace(/\/$/, '')));
    let matched = 0;
    const orphans: string[] = [];
    for (const slug of articleSlugMatches) {
      const cleanSlug = slug.replace(/^\//, '').replace(/\/$/, '');
      if (mappingSources.has(slug) || mappingSources.has(cleanSlug)) {
        matched++;
      } else {
        orphans.push(slug);
      }
    }
    report.articleCoverage.matchedInMapping = matched;
    report.articleCoverage.orphans = orphans;

    console.log(`   Total articles: ${report.articleCoverage.totalArticles}`);
    console.log(`   Matched in seo-mapping: ${matched}`);
    console.log(`   Orphans (no mapping): ${orphans.length}`);
    if (orphans.length > 0 && orphans.length <= 10) {
      orphans.forEach(s => console.log(`     - ${s}`));
    }
  }
  console.log('');

  // ═══════════════════════════════════════════
  // FINAL GATE VERDICT
  // ═══════════════════════════════════════════
  console.log('═══════════════════════════════════');
  console.log('   SEO INTEGRITY GATE VERDICT     ');
  console.log('═══════════════════════════════════');

  const gates = {
    'Soft 404 Defense': report.soft404.validateFunctionFound && report.soft404.catchAllImportsNotFound,
    'Schema Sanitization': report.schema.schemaFileClean,
    'CSV Metadata (tolerance < 10 missing desc)': report.metadata.missingDesc < 10,
    'SEO Mapping Clean': report.seoMapping.dirtySlugs.length === 0,
  };

  let allGatesPassed = true;
  for (const [name, passed] of Object.entries(gates)) {
    console.log(`   ${passed ? '✅' : '❌'} ${name}: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) allGatesPassed = false;
  }

  console.log(`\n   ${allGatesPassed ? '🌟 ALL GATES PASSED — READY FOR CUTOVER' : '⚠️  SOME GATES FAILED — FIX BEFORE CUTOVER'}`);

  if (!allGatesPassed) process.exit(1);

  return report;
}

verifySEOIntegrity().catch(console.error);
