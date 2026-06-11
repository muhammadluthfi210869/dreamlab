import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { articles } from '@/data/articles';
import { getAllCategories } from '@/data/products-v2';
import { maklonPages } from '@/data/maklon-pages';

interface AuditData {
  slug: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dreamlab.id';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/news-blog',
    '/about-us',
    '/services',
    '/produk',
    '/contact-us',
    '/our-client',
    '/career',
    '/terms-of-service',
    '/privacy-policy',
  ].map(route => ({
    url: `${baseUrl}${route}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1.0,
  }));

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
      return {
        url: `${baseUrl}/${slug}/`,
        lastModified: new Date(article.publishDate || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
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

  // Combine and de-duplicate by URL
  const allRoutes = [...staticRoutes, ...auditRoutes, ...articleRoutes, ...productRoutes, ...maklonRoutes];
  const uniqueRoutes = Array.from(new Map(allRoutes.map(r => [r.url, r])).values());

  return uniqueRoutes;
}
