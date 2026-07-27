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
      ],
    },
    sitemap: 'https://dreamlab.id/sitemap.xml',
  };
}
