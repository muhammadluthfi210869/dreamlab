import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
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
      ],
    },
    sitemap: 'https://dreamlab.id/sitemap.xml',
  };
}
