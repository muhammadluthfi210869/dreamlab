import { articles } from '../src/data/articles';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

const csvPath = path.join(process.cwd(), 'src/data/seo-audit-export.csv');
const records = parse(fs.readFileSync(csvPath, 'utf-8'), { columns: true }) as any[];

const articleSlugs = new Set(articles.filter(a => a.slug).map(a => a.slug.replace(/^\/+|\/+$/g, '')));
const csvSlugsSet = new Set(records.map(r => String(r.slug).replace(/^\/+|\/+$/g, '')));

const missingInCSV = [...articleSlugs].filter(s => !csvSlugsSet.has(s));
const missingArticles = articles.filter(a => missingInCSV.includes(a.slug.replace(/^\/+|\/+$/g, '')));

console.log('=== ARTICLES MISSING FROM SEO CSV ===');
console.log('Count:', missingInCSV.length);
missingArticles.forEach(a => console.log(a.slug, '-', a.title?.substring(0, 80)));

console.log('\n=== CSV ENTRIES WITH GARBLED TITLES ===');
records
  .filter(r => String(r.meta_title).includes('Scrolling Banner'))
  .forEach(r => console.log(r.slug, '-', String(r.meta_title).substring(0, 80)));

console.log('\n=== H1 vs META TITLE COMPARISON (sample 10) ===');
records
  .filter(r => r.h1 && r.meta_title)
  .slice(0, 10)
  .forEach(r => console.log(r.slug, '| H1:', String(r.h1).substring(0, 60), '| Title:', String(r.meta_title).substring(0, 60)));

console.log('\n=== TRUNCATED TITLES (< 30 chars) ===');
records
  .filter(r => String(r.meta_title).trim().length < 30 && String(r.meta_title).trim().length > 0)
  .forEach(r => console.log(r.slug, '-', String(r.meta_title).trim()));
