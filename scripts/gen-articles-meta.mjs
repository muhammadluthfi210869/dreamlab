import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { articles } = await import('../src/data/articles.ts');

function getReadingTime(content) {
  if (!content) return 1;
  const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}

const meta = articles
  .filter(a => (a.categories || []).length > 0)
  .map(a => ({
    slug: a.slug,
    title: a.title,
    publishDate: a.publishDate,
    author: a.author,
    categories: a.categories,
    tags: a.tags || [],
    featuredImage: a.featuredImage,
    excerpt: a.excerpt,
    readingMinutes: getReadingTime(a.content),
  }));

const lines = [];
lines.push('export interface ArticleMeta {');
lines.push('  slug: string;');
lines.push('  title: string;');
lines.push('  publishDate: string;');
lines.push('  author: string;');
lines.push('  categories: string[];');
lines.push('  tags: string[];');
lines.push('  featuredImage: string | null;');
lines.push('  excerpt: string;');
lines.push('  readingMinutes: number;');
lines.push('}');
lines.push('');
lines.push('export const articlesMeta: ArticleMeta[] = ');
lines.push(JSON.stringify(meta, null, 2));
lines.push(';');

const outPath = path.join(__dirname, '..', 'src', 'data', 'articles-meta.ts');
writeFileSync(outPath, lines.join('\n') + '\n');
console.log(`Generated ${outPath} with ${meta.length} articles (${(Buffer.byteLength(lines.join('\n'), 'utf8') / 1024).toFixed(1)} KB)`);
