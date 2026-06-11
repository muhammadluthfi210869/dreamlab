import { articles } from '../src/data/articles';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

const csvPath = path.join(process.cwd(), 'src/data/seo-audit-export.csv');
const records = parse(fs.readFileSync(csvPath, 'utf-8'), { columns: true }) as any[];

// === CHECK 1: Articles missing from CSV ===
const articleSlugs = new Set(articles.filter(a => a.slug).map(a => a.slug.replace(/^\/+|\/+$/g, '')));
const csvSlugsSet = new Set(records.map(r => String(r.slug).replace(/^\/+|\/+$/g, '')));

const missingInCSV = [...articleSlugs].filter(s => !csvSlugsSet.has(s));
const missingArticles = articles.filter(a => missingInCSV.includes(a.slug.replace(/^\/+|\/+$/g, '')));

console.log('=== REPORT: ON-PAGE SEO PARITY ===');
console.log('Date:', new Date().toISOString());
console.log('Total CSV entries:', records.length);
console.log('Total articles:', articles.length);
console.log('');

// === CHECK 2: Garbled titles ===
console.log('=== GARBLED/SCRAPING ARTIFACTS ===');
let garbleCount = 0;
records.forEach(r => {
  const t = String(r.meta_title || '');
  if (t.includes('Scrolling Banner') || t.includes('&lt;') || t.includes('&amp;') || t.includes('!important')) {
    garbleCount++;
    console.log(`  ${r.slug}: "${t.substring(0, 100)}"`);
  }
});
if (garbleCount === 0) console.log('  None found');
console.log('');

// === CHECK 3: H1 vs Meta Title consistency ===
console.log('=== H1 vs META TITLE CONSISTENCY ===');
let h1IssueCount = 0;
records.slice(0, 50).forEach(r => {
  const h1 = String(r.h1 || '').trim();
  const title = String(r.meta_title || '').trim();
  if (h1 && title && title.length > 20) {
    // Check if H1 is contained in title or vice versa
    const h1Norm = h1.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const titleNorm = title.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const wordOverlap = h1Norm.split(/\s+/).filter(w => w.length > 3 && titleNorm.includes(w)).length;
    if (wordOverlap < 2 && h1Norm !== titleNorm) {
      h1IssueCount++;
      if (h1IssueCount <= 10) console.log(`  ${r.slug}\n    H1:    "${h1.substring(0, 80)}"\n    Title: "${title.substring(0, 80)}"\n`);
    }
  }
});
console.log(`  Pages with divergent H1 vs title: ${h1IssueCount}`);
console.log('');

// === CHECK 4: Truncated/short titles ===
console.log('=== SHORT/MISSING TITLES (< 30 chars or empty) ===');
records.filter(r => { const t = String(r.meta_title || '').trim(); return t.length < 30 || !t; })
  .forEach(r => console.log(`  ${r.slug}: "${String(r.meta_title || '').trim()}"`));
console.log('');

// === CHECK 5: Brand name in titles ===
console.log('=== TITLES MISSING BRAND (Dreamlab/DREAMLAB) ===');
const noBrand = records.filter(r => { const t = String(r.meta_title); return t.length > 15 && !t.toLowerCase().includes('dreamlab'); });
noBrand.forEach(r => console.log(`  ${r.slug}: "${String(r.meta_title).substring(0, 80)}"`));
console.log(`  Count: ${noBrand.length}`);
console.log('');

// === CHECK 6: Canonical URLs ===
console.log('=== CANONICAL URL ISSUES ===');
records.forEach(r => {
  const canonical = String(r.canonical || '');
  const url = String(r.url || '');
  if (!canonical) console.log(`  ${r.slug}: MISSING canonical`);
  else if (canonical !== url) console.log(`  ${r.slug}: canonical "${canonical}" != url "${url}"`);
});
console.log('');

// === CHECK 7: Short meta descriptions ===
console.log('=== SHORT META DESCRIPTIONS (< 60 chars) ===');
records.filter(r => { const d = String(r.meta_description || '').trim(); return d.length > 0 && d.length < 60; })
  .forEach(r => console.log(`  ${r.slug}: "${String(r.meta_description).substring(0, 100)}"`));
console.log('');

// === SUMMARY ===
console.log('=== SUMMARY ===');
console.log(`  1. Articles missing CSV SEO data: ${missingInCSV.length} / ${articles.length}`);
console.log(`  2. Garbled titles: ${garbleCount}`);
console.log(`  3. Divergent H1 vs title: ${h1IssueCount}`);
console.log(`  4. Short/empty titles: ${records.filter(r => { const t = String(r.meta_title || '').trim(); return t.length < 30; }).length}`);
console.log(`  5. Titles missing brand: ${noBrand.length}`);
console.log(`  6. Canonical mismatches: ${records.filter(r => String(r.canonical || '') !== String(r.url || '')).length}`);
console.log(`  7. Short descriptions: ${records.filter(r => { const d = String(r.meta_description || '').trim(); return d.length > 0 && d.length < 60; }).length}`);
console.log('');
console.log('Note: Missing CSV data = 70 articles use article.title as fallback');
console.log('      These still render but lack optimized SEO metadata');
