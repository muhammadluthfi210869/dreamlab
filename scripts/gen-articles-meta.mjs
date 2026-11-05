import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import Module from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Support both `node scripts/gen-articles-meta.mjs` (Node 22+/26 native TS) and `npx tsx scripts/gen-articles-meta.mjs`
if (typeof Module.registerHooks === 'function') {
  Module.registerHooks({
    resolve(specifier, context, nextResolve) {
      try {
        return nextResolve(specifier, context);
      } catch (err) {
        if (
          err &&
          err.code === 'ERR_MODULE_NOT_FOUND' &&
          (specifier.startsWith('./') || specifier.startsWith('../')) &&
          context.parentURL
        ) {
          const parentPath = fileURLToPath(context.parentURL);
          const candidateTs = path.resolve(path.dirname(parentPath), `${specifier}.ts`);
          if (existsSync(candidateTs)) {
            return nextResolve(pathToFileURL(candidateTs).href, context);
          }
        }
        throw err;
      }
    },
  });
}

const { articles } = await import('../src/data/articles.ts');
const { resolveBlogCategory, VALID_CATEGORY_SLUGS } = await import('../src/data/blog-categories.ts');

const MIN_BASELINE_COUNT = 269;
const minAllowedCount = Math.ceil(MIN_BASELINE_COUNT * 0.8);

function getReadingTime(content) {
  if (!content) return 1;
  const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}

const allowedList = Array.from(VALID_CATEGORY_SLUGS).join(', ');
const invalidErrors = [];

for (const a of articles) {
  const cats = a.categories || [];
  if (cats.length === 0) {
    invalidErrors.push(`Post "${a.slug}" has an empty categories array.`);
    continue;
  }
  for (const cat of cats) {
    if (!resolveBlogCategory(cat)) {
      invalidErrors.push(
        `Post "${a.slug}" has invalid category "${cat}". Allowed categories (7 pillars): [${allowedList}].`
      );
    }
  }
}

if (invalidErrors.length > 0) {
  console.error('❌ Refusing to generate articles-meta.ts due to invalid categories:');
  for (const err of invalidErrors) console.error(`  • ${err}`);
  process.exit(1);
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

if (meta.length < minAllowedCount) {
  console.error(
    `❌ Refusing to overwrite articles-meta.ts: published article count dropped by >20% (found ${meta.length}, expected at least ${minAllowedCount}).`
  );
  process.exit(1);
}

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
