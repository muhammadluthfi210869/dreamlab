import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        // NOTE: /_next/static/ TIDAK di-disallow. Googlebot harus bisa
        // mengambil JS/CSS untuk me-render halaman Next.js (khususnya
        // konten yang dirender client-side). Memblokir /_next/static/
        // menyebabkan ~469 URL "Diblokir robots.txt" di GSC dan dapat
        // membuat Google gagal me-render konten → "crawled not indexed".
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
        // NOTE: /pages/ TIDAK di-disallow — proxy.ts mengembalikan 410 Gone
        // untuk semua /pages/*.php. Jika di-disallow, Google tidak bisa melihat
        // status 410 dan URL legacy tidak pernah dibuang dari index. Tanpa
        // disallow, Google akan crawl → lihat 410 → drop secara permanen.
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
        // NOTE: Disallow /maklon-*, /bisnis-*, /dreampreneur*, /tips-* dsb.
        // DIHAPUS. Semua slug legacy ini kini 301 redirect ke /produk/* atau
        // /category/panduan-bisnis-kosmetik/ via proxy.ts. Jika di-disallow,
        // Googlebot TIDAK bisa mengikuti redirect 301 → equity backlink lama
        // tidak tersalur & URL tidak pernah dibersihkan dari index. Dengan
        // membiarkannya crawlable, Google ikuti 301 → consolidate equity.
      ],
    },
    sitemap: 'https://dreamlab.id/sitemap.xml',
  };
}
