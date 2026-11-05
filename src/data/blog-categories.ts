export interface BlogCategoryDef {
  slug: BlogCategorySlug;
  display: string;
}

export const BLOG_CATEGORIES = [
  { slug: 'maklon-kosmetik', display: 'Maklon Kosmetik' },
  { slug: 'panduan-bisnis', display: 'Panduan Bisnis' },
  { slug: 'formula-rnd', display: 'Formula & R&D' },
  { slug: 'legalitas-regulasi', display: 'Legalitas & Regulasi' },
  { slug: 'tren-inovasi', display: 'Tren & Inovasi' },
  { slug: 'aipreneur', display: 'AIpreneur' },
  { slug: 'event-aktivitas', display: 'Event & Aktivitas' },
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]['slug'];

export const VALID_CATEGORY_SLUGS: ReadonlySet<string> = new Set(
  BLOG_CATEGORIES.map((c) => c.slug)
);

export const PILLAR_CATEGORIES: readonly string[] = BLOG_CATEGORIES.map(
  (c) => c.display
);

// Lookup map for case-insensitive matching of the 7 canonical slugs and their 7 display names
const STRICT_LOOKUP = new Map<string, BlogCategoryDef>();
for (const cat of BLOG_CATEGORIES) {
  STRICT_LOOKUP.set(cat.slug.toLowerCase(), cat);
  STRICT_LOOKUP.set(cat.display.toLowerCase(), cat);
}

// Legacy URL route aliases for /category/[category]/ pages so existing URLs continue to work
const ROUTE_ALIAS_TO_SLUG: Record<string, BlogCategorySlug> = {
  'formula-rd': 'formula-rnd',
  'formula-r-d': 'formula-rnd',
  'formula-kosmetik': 'formula-rnd',
  'event': 'event-aktivitas',
  'panduan-bisnis-kosmetik': 'panduan-bisnis',
  'bisnis-kosmetik': 'panduan-bisnis',
  'bisnis-parfum': 'panduan-bisnis',
  'dreampreneur-beauty-academy': 'aipreneur',
};

/**
 * Resolves a category string (either canonical slug like 'maklon-kosmetik' or
 * canonical display name like 'Maklon Kosmetik', case-insensitive) to its
 * canonical { slug, display } definition. Returns null for any value outside the 7 categories.
 */
export function resolveBlogCategory(
  raw: string | undefined | null
): BlogCategoryDef | null {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return null;
  return STRICT_LOOKUP.get(trimmed) || null;
}

/**
 * Resolves a category string including legacy /category/[category] route aliases.
 */
export function resolveBlogCategoryWithRouteAliases(
  raw: string | undefined | null
): BlogCategoryDef | null {
  const direct = resolveBlogCategory(raw);
  if (direct) return direct;
  if (!raw || typeof raw !== 'string') return null;
  const aliasTarget = ROUTE_ALIAS_TO_SLUG[raw.trim().toLowerCase()];
  if (!aliasTarget) return null;
  return STRICT_LOOKUP.get(aliasTarget) || null;
}

export function getCategorySlug(
  raw: string | undefined | null
): BlogCategorySlug | null {
  return resolveBlogCategory(raw)?.slug ?? null;
}

export function getCategoryDisplay(
  raw: string | undefined | null,
  fallback = 'Uncategorized'
): string {
  if (!raw || typeof raw !== 'string' || !raw.trim()) return fallback;
  return resolveBlogCategory(raw)?.display ?? raw;
}

/**
 * Case-insensitive and format-tolerant check whether an article's categories
 * match a selected category (by slug or display name).
 */
export function articleMatchesCategory(
  articleCategories: readonly string[] | undefined | null,
  selectedCategory: string
): boolean {
  if (!articleCategories || articleCategories.length === 0) return false;
  if (!selectedCategory || selectedCategory.toLowerCase() === 'all') return true;

  const target =
    resolveBlogCategoryWithRouteAliases(selectedCategory)?.slug ??
    selectedCategory.trim().toLowerCase();

  return articleCategories.some((cat) => {
    const resolved =
      resolveBlogCategoryWithRouteAliases(cat)?.slug ??
      (cat || '').trim().toLowerCase();
    return resolved === target;
  });
}

const BASELINE_PUBLISHED_POST_COUNT = 269;
const MAX_ALLOWED_POST_DROP_RATIO = 0.2;

/**
 * Build-time guard: throws if any post has a category outside the 7 pillar slugs
 * or if the total published post count drops by more than 20% compared with the baseline.
 */
export function assertValidBlogArticles(
  posts: ReadonlyArray<{
    slug: string;
    categories?: readonly string[];
    category?: string;
  }>,
  baselineCount: number = BASELINE_PUBLISHED_POST_COUNT
): void {
  const allowedList = Array.from(VALID_CATEGORY_SLUGS).join(', ');
  const errors: string[] = [];

  for (const post of posts) {
    const cats = [
      ...(Array.isArray(post.categories) ? post.categories : []),
      ...(typeof post.category === 'string' ? [post.category] : []),
    ];
    if (cats.length === 0) {
      errors.push(
        `Post "${post.slug}" has no categories. Allowed category slugs: [${allowedList}].`
      );
      continue;
    }
    for (const cat of cats) {
      if (!resolveBlogCategory(cat)) {
        errors.push(
          `Post "${post.slug}" has invalid category "${cat}". Allowed category slugs (7 pillars): [${allowedList}].`
        );
      }
    }
  }

  const publishedCount = posts.filter(
    (p) => (p.categories && p.categories.length > 0) || Boolean(p.category)
  ).length;
  const minRequired = Math.ceil(baselineCount * (1 - MAX_ALLOWED_POST_DROP_RATIO));

  if (publishedCount < minRequired) {
    errors.push(
      `Published post count dropped by more than 20%: found ${publishedCount} posts, expected at least ${minRequired} (baseline: ${baselineCount}).`
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `Blog article validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    );
  }
}

