import { articles } from '../src/data/articles';
import { articlesMeta } from '../src/data/articles-meta';
import {
  BLOG_CATEGORIES,
  VALID_CATEGORY_SLUGS,
  resolveBlogCategory,
} from '../src/data/blog-categories';
import sitemap from '../src/app/sitemap';

// Previous build baseline: 269 published articles (271 with the 2 Nov 6 bodycare articles)
const PREVIOUS_BUILD_ARTICLE_COUNT = 269;
const MAX_ALLOWED_DROP_RATIO = 0.2; // 20%

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  totalArticles: number;
  metaArticles: number;
  sitemapArticleCount: number;
}

export function validateBlogArticles(
  postsToValidate: Array<{
    slug: string;
    title?: string;
    categories?: string[];
    category?: string;
  }> = articles,
  previousCount: number = PREVIOUS_BUILD_ARTICLE_COUNT
): ValidationResult {
  const errors: string[] = [];
  const allowedList = Array.from(VALID_CATEGORY_SLUGS).join(', ');

  // 1. Validate categories on every post
  for (const post of postsToValidate) {
    const rawCats: string[] = [
      ...(Array.isArray(post.categories) ? post.categories : []),
      ...(typeof post.category === 'string' ? [post.category] : []),
    ];

    if (rawCats.length === 0) {
      errors.push(
        `Post "${post.slug}" has no categories. Every published post must have at least one category from the 7 pillar slugs: [${allowedList}].`
      );
      continue;
    }

    for (const cat of rawCats) {
      const resolved = resolveBlogCategory(cat);
      if (!resolved) {
        errors.push(
          `Post "${post.slug}" has invalid category "${cat}". Allowed category slugs (7 pillars): [${allowedList}] (${BLOG_CATEGORIES.map((c) => `${c.slug} = "${c.display}"`).join(', ')}). Product topics like bodycare, skincare, or parfum must be placed in tags, not categories.`
        );
      }
    }
  }

  // 2. Check published post count drop (>20% drop guard compared with previous build/sitemap)
  const publishedCount = postsToValidate.filter(
    (p) => (p.categories || []).length > 0 || Boolean(p.category)
  ).length;
  const minRequiredCount = Math.ceil(previousCount * (1 - MAX_ALLOWED_DROP_RATIO));

  if (publishedCount < minRequiredCount) {
    errors.push(
      `Published post count dropped by more than 20%: found ${publishedCount} posts, expected at least ${minRequiredCount} (80% of previous build count ${previousCount}). Did a commit overwrite src/data/articles.ts instead of appending?`
    );
  }

  // 3.When validating the default articles dataset, also verify articles-meta.ts and sitemap consistency
  let sitemapArticleCount = 0;
  if (postsToValidate === articles) {
    if (articlesMeta.length < minRequiredCount) {
      errors.push(
        `articlesMeta count in src/data/articles-meta.ts dropped by more than 20%: found ${articlesMeta.length}, expected at least ${minRequiredCount}. Run "npm run gen:articles-meta" to regenerate.`
      );
    }

    if (articlesMeta.length !== publishedCount) {
      errors.push(
        `Mismatch between src/data/articles.ts (${publishedCount} published posts) and src/data/articles-meta.ts (${articlesMeta.length} posts). Run "npm run gen:articles-meta" to synchronize.`
      );
    }

    for (const metaPost of articlesMeta) {
      for (const cat of metaPost.categories || []) {
        if (!resolveBlogCategory(cat)) {
          errors.push(
            `articles-meta.ts entry "${metaPost.slug}" has invalid category "${cat}". Allowed category slugs: [${allowedList}].`
          );
        }
      }
    }

    const sitemapEntries = sitemap();
    const articleSlugSet = new Set(
      articles.map((a) => a.slug.replace(/^\/+/, '').replace(/\/+$/, ''))
    );
    sitemapArticleCount = sitemapEntries.filter((entry) => {
      const pathSlug = entry.url
        .replace(/^https?:\/\/[^/]+/, '')
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');
      return articleSlugSet.has(pathSlug);
    }).length;

    const minSitemapArticles = Math.ceil(previousCount * (1 - MAX_ALLOWED_DROP_RATIO));
    if (sitemapArticleCount < minSitemapArticles) {
      errors.push(
        `Sitemap article URL count dropped by more than 20%: found ${sitemapArticleCount} article URLs in sitemap, expected at least ${minSitemapArticles}.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    totalArticles: publishedCount,
    metaArticles: articlesMeta.length,
    sitemapArticleCount,
  };
}

// Run when executed directly from CLI
const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith('validate-blog-articles.ts') ||
    process.argv[1].endsWith('validate-blog-articles.mjs'));

if (isDirectRun) {
  // Support --test-invalid-category <cat> flag for testing failure mode without mutating files
  const testCatIdx = process.argv.indexOf('--test-invalid-category');
  if (testCatIdx !== -1) {
    const invalidCat = process.argv[testCatIdx + 1] || 'maklon-bodycare';
    const samplePosts = [
      ...articles,
      {
        slug: '/test-invalid-category-post',
        title: 'Test Post with Invalid Category',
        categories: [invalidCat],
      },
    ];
    const res = validateBlogArticles(samplePosts);
    if (!res.valid) {
      console.error('❌ BLOG ARTICLE BUILD CHECK FAILED:\n');
      for (const err of res.errors) {
        console.error(`  • ${err}`);
      }
      process.exit(1);
    }
  }

  const result = validateBlogArticles();
  if (!result.valid) {
    console.error('❌ BLOG ARTICLE BUILD CHECK FAILED:\n');
    for (const err of result.errors) {
      console.error(`  • ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `✅ Blog article check passed: ${result.totalArticles} articles in articles.ts, ${result.metaArticles} in articles-meta.ts, ${result.sitemapArticleCount} article URLs in sitemap (all categories valid across 7 pillars).`
  );
}

