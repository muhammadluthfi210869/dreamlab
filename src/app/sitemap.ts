import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { articles } from '@/data/articles';
import { getAllCategories } from '@/data/products-v2';
import { maklonPages } from '@/data/maklon-pages';
import { pilotBatch1Routes } from '@/data/seo-pilot/batch-1';
import { pilotBatch2Routes } from '@/data/seo-pilot/batch-2';
import { isIndexableSitemapPath, normalizeSeoPath } from '@/lib/seo-url-policy';

interface AuditData {
  slug: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dreamlab.id';
  const priorityRecrawlSlugs = new Set([
    'biaya-maklon-parfum-moq-kecil',
    'bisnis-skincare-glow-glasskin-cystamine',
    'perbedaan-micellar-water-dan-toner',
  ]);

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/news-blog',
    '/panduan',
    '/dreampreneur-batch-2',
    '/about-us',
    '/about-us/alur-maklon',
    '/services',
    '/contact-us',
    '/contact-medsos',
    '/our-client',
    '/career',
    '/terms-of-service',
    '/privacy-policy',
    // Halaman hub katalog produk (breadcrumb semua produk menunjuk ke sini)
    '/produk',
    '/category/maklon-kosmetik',
    '/category/panduan-bisnis-kosmetik',
    '/category/dreampreneur-beauty-academy',
  ].map(route => ({
    url: `${baseUrl}${route}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1.0,
  }));

  // Known slug patterns that exist in the current app (safelist for CSV audit slugs)
  // NOTE: 'ads/' intentionally excluded — ads/thankyou pages have zero SEO value
  const validRoutePrefixes = [
    'category/', 'produk/', 'maklon/',
    'news-blog/', 'about-us/',
  ];
  const knownArticleSlugs = new Set(
    articles
      .filter(a => a.slug)
      .map(a => a.slug.replace(/^\/+/, '').replace(/\/+$/, ''))
  );
  const categoryArticleCounts = new Map<string, number>();
  for (const article of articles) {
    const allCats = [...(article.categories || []), ...(article.tags || [])];
    for (const category of allCats) {
      const slug = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
      categoryArticleCounts.set(slug, (categoryArticleCounts.get(slug) || 0) + 1);
    }
  }
  // Proxy caught patterns — MUST match proxy.ts GONE_PATTERNS exactly.
  // URLs matching these patterns return 410 Gone and must NOT appear in sitemap.
  const proxyPrefixes = [
    '.help/dhl/', 'wp-content/', 'wp-admin/', 'wp-json/',
    'pages/', 'product-category/', 'shop/', 'cms_block_cat/', 'cgi-sys/',
    'checkout/', 'cart/', 'my-account/', 'blog/',
    'post-sitemap', 'search/', 'juaranyaformula/',
    'produk/pkrt/',
    'thankyou-page', 'thankyoupage-google', 'google-ads/', 'e-floating-buttons/',
    'thankyou/', 'thankyou-medsos/', 'landing/',
    // Maklon legacy redirects (301 to /produk/*/ via proxy.ts LEGACY_PATH_REDIRECTS)
    'maklon-body-care/', 'maklon-baby-care/', 'maklon-decorative/', 'maklon-foot-care/',
  ];

  function isSlugInCurrentSite(slug: string): boolean {
    if (knownArticleSlugs.has(slug)) return true;
    for (const p of validRoutePrefixes) {
      if (slug.startsWith(p)) return true;
    }
    return false;
  }

  function isProxyCaught(slug: string): boolean {
    for (const p of proxyPrefixes) {
      if (slug.startsWith(p)) return true;
    }
    return false;
  }

  function isThinCategorySlug(slug: string): boolean {
    if (!slug.startsWith('category/')) return false;
    const categorySlug = slug.replace(/^category\//, '').replace(/\/+$/, '');
    const count = categoryArticleCounts.get(categorySlug) || 0;
    return count > 0 && count <= 2;
  }

  // Category slugs yang di-redirect proxy.ts (CATEGORY_REDIRECTS) ke kategori
  // baru — source category TIDAK boleh muncul di sitemap (URL-nya 301).
  const REDIRECTING_CATEGORY_SLUGS = new Set([
    'maklon-skincare', 'maklon-bodycare', 'maklon-footcare',
    'maklon-haircare', 'maklon-baby-care', 'maklon-parfum',
    'personal-care', 'bisnis-kosmetik', 'bisnis-skincare',
    'tren-kosmetik', 'dreampreneur', 'bisnis-dreampreneur',
    'tips-bisnis', 'tips-trick', 'dreamlab-pedia', 'dreamlabpedia',
    'maklon-kosmetik-skincare',
  ]);

  function isRedirectingCategorySlug(slug: string): boolean {
    if (!slug.startsWith('category/')) return false;
    const categorySlug = slug.replace(/^category\//, '').replace(/\/+$/, '');
    return REDIRECTING_CATEGORY_SLUGS.has(categorySlug);
  }

  // 2. Audit CSV Routes (The Legacy Footprint)
  let auditRoutes: MetadataRoute.Sitemap = [];
  try {
    const csvPath = path.join(process.cwd(), 'src', 'data', 'seo-audit-export.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, { columns: true }) as AuditData[];
    
    auditRoutes = records
      .filter(r => {
        const s = r.slug;
        if (!s || s === '/') return false;
        if (s.length > 200 || s.includes(' ') || s.includes('%20') || s.includes(':')) return false;
        
        // Strip leading/trailing slashes
        let cleaned = s.replace(/^\/+/, '').replace(/\/+$/, '');
        
        // news-blog/ prefix maps to root — adjust before checking
        if (cleaned.startsWith('news-blog/')) {
          cleaned = cleaned.replace('news-blog/', '');
        }
        
        // Exclude slugs caught by proxy (410 Gone)
        if (isProxyCaught(cleaned)) return false;

        if (isThinCategorySlug(cleaned)) return false;

        // Exclude category slugs yang di-redirect proxy.ts (301)
        if (isRedirectingCategorySlug(cleaned)) return false;
        
        // Only include slugs that exist in the current site
        if (!isSlugInCurrentSite(cleaned)) return false;
        
        return true;
      })
      .map(r => {
        // Clean up: remove leading/trailing slashes, then add them back consistently
        let slug = r.slug.replace(/^\/+/, '').replace(/\/+$/, '');
        
        // If it starts with news-blog/, we want to point to the root version 
        // to match our next.config.ts redirects
        if (slug.startsWith('news-blog/')) {
          slug = slug.replace('news-blog/', '');
        }
        
        return {
          url: `${baseUrl}/${slug}/`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        };
      });
  } catch (e) {
    console.error('Sitemap: Failed to load audit CSV', e);
  }

  // Helper: rough word count stripping HTML tags
  function getWordCount(html: string): number {
    return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  }

  const MIN_ARTICLE_WORDS = 200;

  // 3. Current Articles — filtered by content substance
  // Per review data: no articles < 200 words exist; 22 articles 200-499 need manual audit.
  // Filter hanya untuk artikel dengan konten sangat minimal (< MIN_ARTICLE_WORDS kata).
  const articleRoutes = articles
    .filter(a => a.slug)
    .filter(a => {
      if (!a.content || a.content.trim().length < 100) return false;
      const wordCount = getWordCount(a.content);
      return wordCount >= MIN_ARTICLE_WORDS;
    })
    .map(article => {
      const slug = article.slug.replace(/^\/+/, '').replace(/\/+$/, '');
      const isPriorityRecrawl = priorityRecrawlSlugs.has(slug);
      const changeFrequency: 'weekly' | 'monthly' = isPriorityRecrawl ? 'weekly' : 'monthly';
      return {
        url: `${baseUrl}/${slug}/`,
        lastModified: new Date(article.publishDate || new Date()),
        changeFrequency,
        priority: isPriorityRecrawl ? 0.9 : 0.7,
      };
    });

  // 4. Product Pages (V2 - Individual Product Pages)
  const THIN_PRODUCT_CATEGORIES = new Set(['pkrt']);
  const categories = getAllCategories();
  const productRoutes: MetadataRoute.Sitemap = [];

  for (const category of categories) {
    const isThinCategory = THIN_PRODUCT_CATEGORIES.has(category.slug);

    // Add category page (only if NOT thin)
    if (!isThinCategory) {
      productRoutes.push({
        url: `${baseUrl}/produk/${category.slug}/`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    }

    // Add individual product pages (only if NOT thin)
    if (!isThinCategory) {
      const flatProductSlugs = new Set(category.products.map(p => p.slug));
      for (const product of category.products) {
        productRoutes.push({
          url: `${baseUrl}/produk/${category.slug}/${product.slug}/`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        });
      }
      // Sub-kategori produk (mis. /produk/decorative/make-up/cream-blush/) yang
      // TIDAK punya versi FLAT — tambahkan ke sitemap agar bisa di-index sebagai
      // halaman produk individual (tanpa menciptakan duplikat dgn versi flat).
      if (category.subCategories) {
        for (const sub of category.subCategories) {
          // Tambahkan sub-category HUB page (mis. /produk/skincare/face-cream/)
          // — halaman browse/search yang berisi daftar produk dan jadi landing
          // page bagi long-tail query. Selalu indexable dan self-canonical.
          productRoutes.push({
            url: `${baseUrl}/produk/${category.slug}/${sub.slug}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.75,
          });
          for (const product of sub.products) {
            if (!flatProductSlugs.has(product.slug)) {
              productRoutes.push({
                url: `${baseUrl}/produk/${category.slug}/${sub.slug}/${product.slug}/`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
              });
            }
          }
        }
      }
    }
  }

  // 5. Maklon Pages — FASE 2: SEMUA /maklon-* product page kini 301 ke /produk/*
  // (via MAKLON_PRODUCT_REDIRECTS di proxy.ts). Maka tidak ada lagi halaman
  // maklon yang layak masuk sitemap — hanya /produk/* yang menjadi kanonis.
  const maklonRoutes: MetadataRoute.Sitemap = maklonPages
    .filter(mp => {
      // FASE 2: exclude semua halaman maklon (redirect ke /produk/*).
      // Kategori parent (mis. /maklon-body-care/) dan sub-page produk semuanya
      // di-redirect. Hanya artikel standalone bernama maklon-* (dari articles.ts)
      // yang tetap valid — itu di-handle articleRoutes, bukan di sini.
      if (mp.path.startsWith('/maklon-')) return false;
      // Only include pages with actual content sections (not just template)
      return mp.sections && mp.sections.length >= 3;
    })
    .map(mp => ({
      url: `${baseUrl}${mp.path.replace(/\/?$/, '/')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));

  const pilotRoutes: MetadataRoute.Sitemap = [...pilotBatch1Routes, ...pilotBatch2Routes].map(route => ({
    url: `${baseUrl}${route.replace(/\/?$/, '/')}`,
    lastModified: new Date('2026-07-13T00:00:00+07:00'),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // 7. English Routes (/en/) — versi English dari halaman utama
  const enRoutes: MetadataRoute.Sitemap = [
    '/en',
    '/en/produk',
    '/en/about-us',
    '/en/services',
    '/en/our-client',
    '/en/contact-us',
  ].map(route => ({
    url: `${baseUrl}${route.replace(/\/?$/, '/')}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Combine and de-duplicate by URL
  const allRoutes = [...staticRoutes, ...auditRoutes, ...articleRoutes, ...productRoutes, ...maklonRoutes, ...pilotRoutes, ...enRoutes];
  const indexableRoutes = allRoutes.filter(route => {
    const pathName = normalizeSeoPath(route.url);
    if (!isIndexableSitemapPath(pathName)) return false;
    const cleanedPath = pathName.replace(/^\//, '');
    if (isThinCategorySlug(cleanedPath)) return false;
    if (isRedirectingCategorySlug(cleanedPath)) return false;
    return true;
  });
  const uniqueRoutes = Array.from(new Map(indexableRoutes.map(r => [r.url, r])).values());

  return uniqueRoutes;
}
