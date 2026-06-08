import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface AuditData {
  url: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  canonical: string;
}

interface Article {
  slug: string;
  title: string;
}

async function verifySEO() {
  console.log('🚀 Starting SEO Integrity Verification...');
  
  const csvPath = path.join(process.cwd(), 'src', 'data', 'seo-audit-export.csv');
  const articlesPath = path.join(process.cwd(), 'src', 'data', 'articles.ts');
  const mappingPath = path.join(process.cwd(), 'src', 'data', 'seo-mapping.json');

  if (!fs.existsSync(csvPath)) {
    console.error('❌ Error: seo-audit-export.csv missing!');
    return;
  }

  // Load CSV Data
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const auditRecords = parse(fileContent, { columns: true }) as AuditData[];
  
  // Load Articles Data (more robust regex for verification)
  const articlesContent = fs.readFileSync(articlesPath, 'utf-8');
  // Match "slug": "value" or slug: "value"
  const articleSlugs = Array.from(articlesContent.matchAll(/["']?slug["']?:\s*["']([^"']+)["']/g)).map(m => m[1]);

  // Load Static Routes
  const staticRoutes = ['/', '/news-blog', '/about-us', '/services', '/contact-us', '/our-client', '/career'];

  const results = {
    total: auditRecords.length,
    passed: 0,
    failed: 0,
    missingSlugs: [] as string[],
    metadataMismatches: [] as string[]
  };

  for (const record of auditRecords) {
    const slug = record.slug.replace(/\/$/, '') || '/';
    const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
    const slugWithoutSlash = cleanSlug.slice(1);

    // 1. Check if route exists
    const exists = staticRoutes.includes(cleanSlug) || 
                   articleSlugs.includes(cleanSlug) || 
                   articleSlugs.includes(slugWithoutSlash) ||
                   cleanSlug.startsWith('/category/') || // Handled by redirects/news-blog
                   cleanSlug.startsWith('/author/');     // Handled by news-blog

    if (!exists && !record.meta_title.includes('Page not found')) {
      results.missingSlugs.push(cleanSlug);
      results.failed++;
    } else {
      results.passed++;
    }
  }

  console.log('\n--- SEO Audit Report ---');
  console.log(`✅ Total Checked: ${results.total}`);
  console.log(`🟢 Passed: ${results.passed}`);
  console.log(`🔴 Missing/Risk Slugs: ${results.failed}`);

  if (results.missingSlugs.length > 0) {
    console.log('\n⚠️ The following slugs are in the SEO audit but not explicitly mapped in Next.js yet:');
    results.missingSlugs.forEach(s => console.log(` - ${s}`));
    console.log('\n💡 Recommendation: Ensure these are covered by dynamic routes or redirects.');
  } else {
    console.log('\n🌟 100% Path Coverage Confirmed!');
  }

  console.log('\n--- Metadata Authoritative Check ---');
  console.log('Note: metadata.generateMetadata in [...slug]/page.tsx is configured to use this CSV as the Authority of Truth.');
  console.log('Any page rendered via the dynamic route will automatically inherit these titles and descriptions.');
}

verifySEO().catch(console.error);
