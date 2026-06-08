import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { articles } from '../src/data/articles';

async function checkContentGap() {
  const csvPath = path.join(process.cwd(), 'src', 'data', 'seo-audit-export.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const auditRecords = parse(fileContent, { columns: true });

  const articleSlugs = new Set(articles.map((a: { slug: string }) => a.slug.replace(/^\//, '').replace(/\/$/, '')));
  
  const gaps = [];
  
  for (const record of auditRecords as Array<{ slug: string }>) {
    const slug = (record.slug as string).replace(/^\//, '').replace(/\/$/, '');
    if (slug && !articleSlugs.has(slug)) {
      // Exclude known static routes
      const staticRoutes = ['about-us', 'services', 'produk', 'contact-us', 'our-client', 'career', 'news-blog', ''];
      if (!staticRoutes.includes(slug) && !slug.startsWith('category/') && !slug.startsWith('author/')) {
        gaps.push(slug);
      }
    }
  }

  console.log(`\n--- CONTENT GAP ANALYSIS ---`);
  console.log(`Articles in articles.ts: ${articles.length}`);
  console.log(`Potential missing articles: ${gaps.length}`);
  console.log(`\nSample missing slugs:`);
  gaps.slice(0, 20).forEach(s => console.log(`- ${s}`));
}

checkContentGap().catch(console.error);
