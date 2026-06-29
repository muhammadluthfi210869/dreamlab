import type { NextConfig } from "next";
import fs from 'fs';
import path from 'path';

interface SeoMappingItem {
  source: string;
  destination: string;
  _metadata: {
    original_title: string;
    original_h1?: string;
  };
}

const seoMapping = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/data/seo-mapping.json'), 'utf-8')
) as SeoMappingItem[];

// Extract all article slugs that exist in articles data
// These are blog posts that WordPress served at root level
const articleSlugs = seoMapping
  .filter(m => 
    m.source !== '/' && 
    !m.source.startsWith('/category/') &&
    !m.source.startsWith('/about-us') &&
    !m.source.startsWith('/services') &&
    !m.source.startsWith('/career') &&
    !m.source.startsWith('/contact-us') &&
    !m.source.startsWith('/our-client') &&
    !m.source.startsWith('/news-blog') &&
    !m.source.startsWith('/produk') &&
    !m.source.startsWith('/baby-care') &&
    !m.source.startsWith('/body-care') &&
    !m.source.startsWith('/hair-care') &&
    !m.source.startsWith('/foot-care') &&
    !m.source.startsWith('/skincare-face-care') &&
    !m.source.startsWith('/decorative') &&
    !m.source.startsWith('/parfum') &&
    !m.source.startsWith('/pkrt') &&
    !m.source.startsWith('/author/') &&
    !m.source.startsWith('/thankyou') &&
    !m.source.includes('page/') &&
    !m.source.includes('%20') &&
    !m.source.includes(':') &&
    m.source.length < 255
  )
  .map(m => m.source.replace(/^\/+/, '').replace(/\/+$/, ''));

// Build category slug → display name mapping from seo-mapping
const categoryMappings: Record<string, string> = {
  'bisnis-kosmetik': 'Bisnis Kosmetik',
  'bisnis-skincare': 'Bisnis Skincare',
  'tips-trick': 'Tips & Trick',
  'maklon-personal-care': 'Maklon Personal Care',
  'maklon-baby-care': 'Maklon Baby Care',
  'maklon-hair-care': 'Maklon Hair Care',
  'maklon-haircare': 'Maklon Haircare',
  'maklon-skincare': 'Maklon Skincare',
  'maklon-bodycare': 'Maklon Bodycare',
  'dreamlabpedia': 'Dreamlab Pedia',
  'maklon-parfum': 'Maklon Parfum',
  'dreampreneur-beauty-academy': 'Dreampreneur Beauty Academy',
  'maklon-footcare': 'Maklon Footcare',
  'bisnis-men-grooming': 'Bisnis Men Grooming',
  'personal-care': 'Personal Care',
};

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dreamlab.id',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
    ],
  },
  turbopack: {
    root: process.cwd(),
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.tawk.to https://embed.tawk.to https://analytics.tiktok.com https://connect.facebook.net https://www.clarity.ms https://googleads.g.doubleclick.net https://www.googleadservices.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.supabase.co https://dreamlab.id https://va.tawk.to wss://*.tawk.to https://analytics.google.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://analytics.tiktok.com https://connect.facebook.net https://www.clarity.ms https://www.google-analytics.com",
              "frame-src 'self' https://www.youtube.com https://*.tawk.to",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  async redirects() {
    const redirects: Array<{
      source: string;
      destination: string;
      permanent: boolean;
    }> = [];

    // 1. Redirect /news-blog/{slug} → /{slug}/ (articles should live at root, matching legacy WordPress)
    // This prevents duplicate content between /news-blog/slug and /slug
    articleSlugs.forEach(slug => {
      if (slug) {
        redirects.push({
          source: `/news-blog/${slug}`,
          destination: `/${slug}/`,
          permanent: true,
        });
      }
    });

    // 2. Category pages are now handled by dedicated route handler: /category/[slug]/
    // No redirect needed — the route already exists.

    // 3. Redirect known legacy WordPress structural URLs (only those without new routes)
    redirects.push({
      source: '/thankyou-page',
      destination: '/thankyou/google/',
      permanent: true,
    });

    // 3b. Redirect /news-blog/ listing page to root (commented out to allow access to blog archive)
    /*
    redirects.push({
      source: '/news-blog',
      destination: '/',
      permanent: true,
    });
    */

    // 3c. Redirect legacy WordPress / soft-404 pages that don't exist in Next.js
    // These preserve SEO equity from old site structure + fix GSC 404 errors
    const legacyRedirects: Array<[string, string]> = [
      ['/thankyoupage-google', '/'],
      ['/contact-form-dreamlab', '/contact-us/'],
      ['/cms_block_cat/pop-up-form', '/'],
      ['/e-floating-buttons/popup-website', '/'],
      ['/https-dreamlab-id-dreamlab-visit-ici-2026', '/'],
      ['/maklon-kosmetik-terbaik-english', '/'],
      ['/jadwalkanvisitmeeting.php', '/contact-us/'],
      // GSC 404 fixes — legacy pages that no longer exist
      ['/homepage.php', '/'],
      ['/Homepage{/}?', '/'],
      ['/result-body-lotion-a', '/produk/skincare/'],
      ['/thank-you-maklon', '/thankyou/google/'],
      ['/dreampreneur-id-konfirmasi-pembayaran', '/contact-us/'],
      ['/academy-beautypreneur', '/category/dreampreneur-beauty-academy/'],
      ['/advantages-and-challenges-in-registering-hki-products-and-bpom-maklon-kosmetik', '/news-blog/'],
      ['/menghadapi-tantangan-dalam-industri-maklon-kosmetik', '/news-blog/'],
      ['/career-2', '/career'],
      ['/career-3', '/career'],
      ['/newest-innovations-in-the-world-of-skincare-opportunities-for-women-careers', '/news-blog/'],
      ['/perbedaan-moisturizer-gel-vs-cream/dreamlab{/}?', '/perbedaan-moisturizer-gel-vs-cream/'],
      ['/category/bisnis-kosmetik/page/4', '/category/bisnis-kosmetik/'],
      ['/news-blog/page/8', '/news-blog/'],
      // GSC Crawled Not Indexed — legacy content → 410 or redirect
      ['/memunculkan-keranjang-reels', '/news-blog/'],
      ['/pabrik-parfum-surabaya', '/produk/parfum/'],
      ['/maklon-shampoo-psoriasis-formula-juara', '/produk/haircare/'],
      ['/dupe-parfum-nagita-slavina-tahan-lama', '/produk/parfum/'],
      ['/state-of-beauty-2025-tren-kecantikan-pertumbuhan-industri', '/news-blog/'],
      ['/potensi-bisnis-babycare', '/news-blog/'],
      ['/maklon-face-mist', '/produk/skincare/'],
      ['/solusi-bisnis-body-serum-aha-2025-tren-pasar-maklon-dreamlab', '/news-blog/'],
      ['/maklon-skinacre-lptiktok', '/produk/skincare/'],
      ['/maklon-moisturizer-bpom-dreamlab', '/produk/skincare/'],
      ['/omset-moisturizer-naik-tajam-dreamlab-bisnis-skincare', '/news-blog/'],
      ['/hero-ingredients-2025', '/news-blog/'],
      ['/flywheel-marketing-brand-skincare', '/news-blog/'],
      ['/produk-haircare-yang-sedang-tren', '/produk/haircare/'],
      ['/tentang-dreamlab/alur-maklon', '/about-us/alur-maklon/'],
      ['/ide-bisnis-kosmetik', '/news-blog/'],
      ['/babycare-masa-kini-sentuhan-lembut-dan-ilmu-pengetahuan', '/news-blog/'],
      ['/maklon-kosmetik-terbaik', '/news-blog/'],
      ['/category/bisnis-kosmetik/page/2', '/category/bisnis-kosmetik/'],
    ];
    redirects.push({
      source: '/author/admin/page/:path*',
      destination: '/author/admin/',
      permanent: true,
    });
    for (const [source, destination] of legacyRedirects) {
      redirects.push({ source, destination, permanent: true });
    }

    // Note: Author and pagination routes are now handled by dedicated route handlers:
    // - /author/[author]/  → src/app/author/[author]/page.tsx
    // - /news-blog/page/[num]/  → src/app/news-blog/page/[num]/page.tsx
    // These should NOT be redirected to preserve content and SEO equity.

    // 4. Category → Silo redirects: Old WordPress category pages redirect to new silo pages
    // These preserve SEO equity from the old site structure
    const categoryToSiloRedirects: Array<[string, string]> = [
      ['/skincare-face-care', '/maklon-skincare/'],
      ['/body-care', '/maklon-body-care/'],
      ['/baby-care', '/maklon-baby-care/'],
      ['/foot-care', '/maklon-foot-care/'],
      ['/hair-care', '/ads/maklon-hair-care/'],
      ['/parfum', '/ads/maklon-parfum/'],
      ['/maklon-haircare', '/ads/maklon-hair-care/'],
      ['/decorative', '/maklon-decorative/'],
      ['/pkrt', '/maklon-pkrt/'],
      ['/product', '/services/'],
    ];

    // 5. Landing pages moved under /ads/ subdirectory
    // Redirect old URLs to new /ads/ paths for campaign tracking
    const adsRedirects: Array<[string, string]> = [
      ['/maklon-parfum', '/ads/maklon-parfum/'],
      ['/maklon-skincare', '/ads/maklon-skincare/'],
      ['/maklon-hair-care', '/ads/maklon-hair-care/'],
      ['/thankyou-maklon', '/ads/thankyou/metaads/'],
      ['/linktree', '/contact-medsos/'],
      ['/links', '/contact-medsos/'],
    ];
    for (const [source, destination] of adsRedirects) {
      redirects.push({ source, destination, permanent: true });
    }

    // 6. Preserve existing WordPress 301 redirects (old slugs → new slugs)
    // These were captured from the live site crawl — maintaining them preserves backlink equity
    const wordpressRedirects: Array<[string, string]> = [
      ['/tips-sukses-bisnis-parfum', '/bisnis-parfum-merk-sendiri/'],
      ['/maklon-scalp-haircare-bisnis-produk-rambut-sehat', '/pabrik-shampoo-merek-sendiri/'],
      ['/tren-parfum-arab-bisnis-maklon-dreamlab', '/produk-viral-tiktok/'],
      ['/maklon-skincare-untuk-brand-baru', '/maklon-kosmetik-pemula-modal-kecil/'],
      ['/prediksi-tren-2026', '/8-tren-kecantikan-2026-smart-formula/'],
      ['/pabrik-parfum-makasar', '/maklon-parfum-makassar/'],
      ['/cara-bisnis-skincare-dari-nol', '/bisnis-kosmetik-dari-nol/'],
      ['/pabrik-parfum-surabaya-biaya-2026', '/produk/parfum/'],
      ['/maklon-parfum-bpom-indonesia-strategi-bisnis', '/maklon-parfum-dreamlab/'],
      ['/maklon-kosmetik-parfum-tangerang', '/maklon-kosmetik-tangerang-terpercaya/'],
      ['/maklon-kosmetik-jakarta-dreamlab-2026', '/maklon-jakarta-terbaik/'],
      ['/maklon-skincare-surabaya-umkm', '/pabrik-maklon-kosmetik-surabaya-terlengkap/'],
      ['/jasa-maklon-sabun-mandi-batang', '/jasa-maklon-bar-soap-merek-sendiri/'],
      ['/bahan-aktif-untuk-mengatasi-jerawat', '/bahan-aktif-skincare-jerawat/'],
      ['/maklon-parfum-jakarta', '/pabrik-parfum-jakarta/'],
      ['/rahasia-maklon-parfum-jakarta', '/pabrik-parfum-jakarta/'],
      ['/body-care-2', '/maklon-body-care/'],
      ['/cara-membuat-masker-wajah-organik-praktis-aman-dan-cocok-untuk-ide-bisnis-skincare', '/maklon-skincare/masker-wajah/'],
    ];
    for (const [source, destination] of wordpressRedirects) {
      redirects.push({ source, destination, permanent: true });
    }

    return redirects;
  },
};

export default nextConfig;
