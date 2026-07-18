import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { articles } from '@/data/articles';
import { getAllCategories } from '@/data/products-v2';
import { maklonPages } from '@/data/maklon-pages';
import { pilotBatch1Routes } from '@/data/seo-pilot/batch-1';
import { pilotBatch2Routes } from '@/data/seo-pilot/batch-2';

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
    '/about-us',
    '/about-us/alur-maklon',
    '/services',
    '/produk',
    '/contact-us',
    '/contact-medsos',
    '/our-client',
    '/career',
    '/terms-of-service',
    '/privacy-policy',
    '/category/maklon-kosmetik-skincare',
    '/category/bisnis-dreampreneur',
    '/category/tips-trick',
    '/category/dreamlab-pedia',
  ].map(route => ({
    url: `${baseUrl}${route}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1.0,
  }));

  // Known slug patterns that exist in the current app (safelist for CSV audit slugs)
  const validRoutePrefixes = [
    'category/', 'produk/', 'maklon/',
    'news-blog/', 'about-us/', 'ads/',
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
  const proxyPrefixes = [
    'wp-content/', 'wp-admin/', 'wp-json/', '.help/dhl/',
    'product-category/', 'shop/', 'cms_block_cat/', 'cgi-sys/',
    'checkout/', 'cart/', 'my-account/', 'blog/',
    'post-sitemap', 'search/', 'juaranyaformula/',
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

  // 3. Current Articles
  const articleRoutes = articles
    .filter(a => a.slug)
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
  const categories = getAllCategories();
  const productRoutes: MetadataRoute.Sitemap = [];
  
  for (const category of categories) {
    // Add category page
    productRoutes.push({
      url: `${baseUrl}/produk/${category.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    });
    
    // Add individual product pages
    for (const product of category.products) {
      productRoutes.push({
        url: `${baseUrl}/produk/${category.slug}/${product.slug}/`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    }
  }

  // 5. Maklon Pages (silent SEO workhorse — ~80 service location pages)
  const maklonRoutes: MetadataRoute.Sitemap = maklonPages.map(mp => ({
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

  // Combine and de-duplicate by URL
  const allRoutes = [...staticRoutes, ...auditRoutes, ...articleRoutes, ...productRoutes, ...maklonRoutes, ...pilotRoutes];
  const uniqueRoutes = Array.from(new Map(allRoutes.map(r => [r.url, r])).values());

  return uniqueRoutes;
}
