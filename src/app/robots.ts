import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/_next/static/',
        '/api/',
        '/admin/',
        '/wp-admin/',
        '/wp-content/',
        '/wp-json/',
        '/product-category/',
        '/shop/',
        '/checkout/',
        '/cart/',
        '/my-account/',
        '/search/',
        '/cgi-sys/',
        '/cms_block_cat/',
        '/post-sitemap',
        '/blog/',
        '/feed/',
        '/pages/',
        // Thankyou pages are for lead tracking — disallow Google from indexing
        // NOTE: NOT in proxy.ts GONE_PATTERNS (they must return 200 for JS tracking)
        '/thankyou/',
        '/thankyou-page',
        '/thankyoupage-google',
        '/thankyou-medsos/',
        '/ads/thankyou/',
        '/metaads/',
        '/google-ads/',
        '/landing/',
        '/author/admin/',
        '/e-floating-buttons/',
        '/.help/dhl/',
        // Legacy thin product categories (return 410 via proxy.ts)
        '/produk/pkrt/',
        // Legacy redirect slugs (301 to new URLs via proxy.ts)
        '/maklon-skincare/',
        '/maklon-bodycare/',
        '/maklon-footcare/',
        '/maklon-baby-care/',
        '/maklon-haircare/',
        '/maklon-parfum/',
        '/bisnis-kosmetik/',
        '/bisnis-skincare/',
        '/dreampreneur/',
        '/tips-bisnis/',
        '/tips-trick/',
        '/dreamlab-pedia/',
        '/tren-kosmetik/',
        '/bisnis-dreampreneur/',
        '/personal-care/',
        '/maklon-personal-care/',
        '/bisnis-men-grooming/',
      ],
    },
    sitemap: 'https://dreamlab.id/sitemap.xml',
  };
}
