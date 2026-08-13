import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const GONE_PATTERNS = [
  '/.help/dhl/',
  '/wp-content/',
  '/wp-admin/',
  '/wp-json/',
  '/pages/',
  '/product-category/',
  '/shop/',
  '/cms_block_cat/',
  '/cgi-sys/',
  '/checkout/',
  '/cart/',
  '/my-account/',
  '/blog/',
  '/post-sitemap',
  '/search/',
  '/juaranyaformula/',
  // Thin product sub-categories — template only, 0 traffic, 0 backlink value
  '/produk/pkrt/',
  // Dead thankyou/landing pages — no SEO value, 0 clicks
  '/thankyou-page',
  '/thankyoupage-google',
  // Landing pages — no SEO value
  '/landing/',
  // Floating buttons preview page — template only, no content
  '/e-floating-buttons/',
  // Orphaned pagination pages (/page/2/, /page/8/) — zero SEO value, conflicting robots meta
  '/page/',
];

const GONE_EXACT = [
  { type: 'includes', value: '):attr_identifier' },
  { type: 'includes', value: '%29:attr_identifier' },
  { type: 'includes', value: '.php' },
  { type: 'includes', value: '/feed' },
  { type: 'includes', value: '/feed/' },
  { type: 'includes', value: '/$/' },
  { type: 'includes', value: '/$' },
  { type: 'includes', value: '/&/' },
  { type: 'includes', value: '/&' },
];

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const normalizedPathname = nextUrl.pathname.replace(/[\u2010-\u2015\u2212]/g, '-');
  const hostname = nextUrl.hostname.toLowerCase();
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const pathname = normalizedPathname;

  if (
    nextUrl.searchParams.has('wc-ajax') ||
    nextUrl.searchParams.has('s') ||
    nextUrl.searchParams.get('action') === 'googlesitekit_auth'
  ) {
    return new NextResponse(null, { status: 410 });
  }

  for (const pattern of GONE_PATTERNS) {
    if (pathname.startsWith(pattern)) {
      return new NextResponse(null, { status: 410 });
    }
  }

  for (const exact of GONE_EXACT) {
    if (exact.type === 'includes' && pathname.includes(exact.value)) {
      return new NextResponse(null, { status: 410 });
    }
  }

  const localHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0']);
  const shouldForceHttps = forwardedProto === 'http' && !localHosts.has(hostname);
  const shouldForceNonWww = hostname === 'www.dreamlab.id';
  const shouldNormalizeDash = normalizedPathname !== nextUrl.pathname;
  const shouldNormalizeBlog = pathname === '/blog' || pathname === '/blog/';
  const categoryPaginationMatch = pathname.match(/^\/category\/([^/]+)\/page\/(\d+)\/?$/);

  // 301 redirect legacy direct slugs (NON /category/ variants) to new pillar URLs
  // NOTE: Dikembalikan ke perilaku SEMULA (sebelum commit SEO) — target maklon
  // mengarah ke /maklon/kosmetik/ dan sub-path dipertahankan. Ini memulihkan
  // penempatan URL persis seperti sebelumnya.
  const LEGACY_SLUG_REDIRECTS: Record<string, string> = {
    // Dreampreneur landing → batch 2 slug
    '/dreampreneur/': '/dreampreneur-batch-2/',
    '/dreampreneur/thankyou/': '/dreampreneur-batch-2/thankyou/',
    // Legacy maklon categories → Maklon Kosmetik
    '/maklon-skincare/': '/maklon/kosmetik/',
    '/maklon-personal-care/': '/maklon/kosmetik/',
    '/personal-care/': '/maklon/kosmetik/',
    '/maklon-bodycare/': '/maklon/kosmetik/',
    '/maklon-footcare/': '/maklon/kosmetik/',
    '/maklon-baby-care/': '/maklon/kosmetik/',
    '/maklon-haircare/': '/maklon/kosmetik/',
    '/maklon-parfum/': '/maklon/kosmetik/',
    '/bisnis-men-grooming/': '/maklon/kosmetik/',
    // Legacy bisnis categories → Panduan Bisnis Kosmetik
    '/bisnis-kosmetik/': '/category/panduan-bisnis-kosmetik/',
    '/bisnis-skincare/': '/category/panduan-bisnis-kosmetik/',
    // Previous pillar slugs → new pillar slugs
    '/tren-kosmetik/': '/maklon/kosmetik/',
    '/bisnis-dreampreneur/': '/category/panduan-bisnis-kosmetik/',
    '/tips-bisnis/': '/category/panduan-bisnis-kosmetik/',
    '/tips-trick/': '/category/panduan-bisnis-kosmetik/',
    '/dreamlab-pedia/': '/category/panduan-bisnis-kosmetik/',
  };
  const directSlugMatch = LEGACY_SLUG_REDIRECTS[pathname] || LEGACY_SLUG_REDIRECTS[pathname.replace(/\/$/, '') + '/'];
  // Also match legacy sub-pages: /maklon-body-care/something → redirect to base
  const directSlugPrefixMatch = Object.keys(LEGACY_SLUG_REDIRECTS).find(pattern =>
    pathname.startsWith(pattern) && pattern !== '/'
  );

  // 301 redirect old category slugs + previous pillar slugs to new pillar categories
  const CATEGORY_REDIRECTS: Record<string, string> = {
    // All legacy maklon categories → Maklon Kosmetik
    'maklon-skincare': 'maklon-kosmetik',
    'maklon-personal-care': 'maklon-kosmetik',
    'personal-care': 'maklon-kosmetik',
    'maklon-bodycare': 'maklon-kosmetik',
    'maklon-footcare': 'maklon-kosmetik',
    'maklon-baby-care': 'maklon-kosmetik',
    'maklon-haircare': 'maklon-kosmetik',
    'maklon-parfum': 'maklon-kosmetik',
    // Bisnis Men Grooming → Maklon Kosmetik
    'bisnis-men-grooming': 'maklon-kosmetik',
    // Legacy bisnis categories → Panduan Bisnis Kosmetik
    'bisnis-kosmetik': 'panduan-bisnis-kosmetik',
    'bisnis-skincare': 'panduan-bisnis-kosmetik',
    // Previous pillar slugs → new pillar slugs
    'tren-kosmetik': 'maklon-kosmetik',
    'maklon-kosmetik-skincare': 'maklon-kosmetik',
    'bisnis-dreampreneur': 'panduan-bisnis-kosmetik',
    'tips-bisnis': 'panduan-bisnis-kosmetik',
    'tips-trick': 'panduan-bisnis-kosmetik',
    'dreamlab-pedia': 'panduan-bisnis-kosmetik',
  };
  const categoryRedirectMatch = pathname.match(/^\/category\/([^/]+)\/?$/);
  const categoryRedirectTo = categoryRedirectMatch ? CATEGORY_REDIRECTS[categoryRedirectMatch[1]] : null;

  if (shouldForceHttps || shouldForceNonWww || shouldNormalizeDash || shouldNormalizeBlog || categoryPaginationMatch || categoryRedirectTo || directSlugMatch || directSlugPrefixMatch) {
    const canonicalUrl = new URL(nextUrl.toString());

    if (shouldNormalizeDash) {
      canonicalUrl.pathname = normalizedPathname;
    }

    if (shouldNormalizeBlog) {
      canonicalUrl.pathname = '/news-blog/';
    }

    if (categoryPaginationMatch) {
      canonicalUrl.pathname = `/category/${categoryPaginationMatch[1]}/`;
    }

    if (categoryRedirectTo) {
      canonicalUrl.pathname = `/category/${categoryRedirectTo}/`;
    }

    // Redirect legacy direct slugs (non-/category/ variants)
    if (directSlugPrefixMatch) {
      // Kembalikan perilaku semula: pertahankan sub-path
      // /maklon-body-care/xxx → /maklon/kosmetik/xxx
      const target = LEGACY_SLUG_REDIRECTS[directSlugPrefixMatch];
      const subPath = pathname.slice(directSlugPrefixMatch.length);
      canonicalUrl.pathname = `${target.replace(/\/$/, '')}/${subPath.replace(/^\//, '')}`;
    } else if (directSlugMatch) {
      canonicalUrl.pathname = LEGACY_SLUG_REDIRECTS[pathname];
    }

    if (shouldForceHttps) {
      canonicalUrl.protocol = 'https:';
    }

    if (shouldForceNonWww) {
      canonicalUrl.hostname = 'dreamlab.id';
    }

    if (!canonicalUrl.pathname.endsWith('/')) {
      canonicalUrl.pathname = `${canonicalUrl.pathname}/`;
    }

    return NextResponse.redirect(canonicalUrl, 301);
  }

  // 301 redirect legacy /produk/decorative/ URLs (old make-up subcategories) → /produk/decorative/make-up/
  const DECORATIVE_REDIRECTS: Record<string, string> = {
    '/produk/decorative/foundation': '/produk/decorative/make-up/',
    '/produk/decorative/foundation/': '/produk/decorative/make-up/',
    '/produk/decorative/face-primer': '/produk/decorative/make-up/',
    '/produk/decorative/face-primer/': '/produk/decorative/make-up/',
    '/produk/decorative/bb-cream': '/produk/decorative/make-up/',
    '/produk/decorative/bb-cream/': '/produk/decorative/make-up/',
  };
  const decorativeRedirect = DECORATIVE_REDIRECTS[pathname];
  if (decorativeRedirect) {
    const canonicalUrl = new URL(nextUrl.toString());
    canonicalUrl.pathname = decorativeRedirect;
    return NextResponse.redirect(canonicalUrl, 301);
  }

  // 301 redirect legacy WordPress-to-Next.js migration paths → /produk/[category]/
  const LEGACY_PATH_REDIRECTS: Record<string, string> = {
    '/skincare-face-care': '/produk/skincare/',
    '/skincare-face-care/': '/produk/skincare/',
    '/body-care': '/produk/bodycare/',
    '/body-care/': '/produk/bodycare/',
    '/baby-care': '/produk/babycare/',
    '/baby-care/': '/produk/babycare/',
    '/foot-care': '/produk/footcare/',
    '/foot-care/': '/produk/footcare/',
    '/hair-care': '/produk/haircare/',
    '/hair-care/': '/produk/haircare/',
    '/parfum': '/produk/parfum/',
    '/parfum/': '/produk/parfum/',
    '/decorative': '/produk/decorative/',
    '/decorative/': '/produk/decorative/',
    '/pkrt': '/produk/pkrt/',
    '/pkrt/': '/produk/pkrt/',
    '/pabrik-kosmetik': '/produk/skincare/',
    '/pabrik-kosmetik/': '/produk/skincare/',
    '/pabrik-parfum': '/produk/parfum/',
    '/pabrik-parfum/': '/produk/parfum/',
    '/maklon-baby-care': '/produk/babycare/',
    '/maklon-baby-care/': '/produk/babycare/',
    '/maklon-body-care': '/produk/bodycare/',
    '/maklon-body-care/': '/produk/bodycare/',
    '/maklon-decorative': '/produk/decorative/',
    '/maklon-decorative/': '/produk/decorative/',
    '/maklon-foot-care': '/produk/footcare/',
    '/maklon-foot-care/': '/produk/footcare/',
  };
  const legacyRedirect = LEGACY_PATH_REDIRECTS[pathname];
  if (legacyRedirect) {
    const canonicalUrl = new URL(nextUrl.toString());
    canonicalUrl.pathname = legacyRedirect;
    return NextResponse.redirect(canonicalUrl, 301);
  }

  // NOTE: Middleware soft-404 (pengecekan SITE_PATHS) DIHAPUS.
  // Terbukti merusak: memblokir file statis public/ (mis. /promo-kemerdekaan/),
  // gambar, dan halaman valid yang tidak ada di daftar → broken image & 404.
  // Untuk menjamin perilaku URL PERSIS seperti sebelum commit SEO, middleware
  // hanya menangani redirect & 410 (di atas) — TIDAK memutus path lain.
  // Konsekuensi: path invalid kembali menjadi soft-404 (200 + noindex) — ini
  // adalah perilaku asli/status quo sebelum commit, sesuai permintaan.

  // Teruskan pathname sebagai request header supaya root layout bisa
  // menentukan <html lang> yang benar (id/en) saat SSR. Ini penting
  // untuk halaman English /en/... supaya output HTML awal sudah
  // lang="en" (bukan hanya setelah hydration).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-dreamlab-path", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // API routes dilewati middleware (edge) supaya request round-robin & lead
  // capture tidak menambah hop latensi. Middleware hanya untuk redirect/410 SEO
  // dan penentuan lang — tidak dipakai route API.
  matcher:
    '/((?!_next/static|_next/image|favicon.ico|assets|robots.txt|sitemap.xml|api|new(?:%20|\\s)asset|images|promo-kemerdekaan|next.svg|file.svg|globe.svg|vercel.svg|window.svg|Sampul(?:%20|\\s)WEB).*)',
};
