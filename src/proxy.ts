import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const GONE_PATTERNS = [
  '/maklon-kosmetik-jombang',
  '/maklon-kosmetik-jombang/',
  '/.help/dhl/',
  '/wp-content',
  '/wp-content/',
  '/wp-admin',
  '/wp-admin/',
  '/wp-json',
  '/wp-json/',
  '/pages',
  '/pages/',
  '/product-category',
  '/product-category/',
  '/shop',
  '/shop/',
  '/cms_block_cat',
  '/cms_block_cat/',
  '/cgi-sys',
  '/cgi-sys/',
  '/checkout',
  '/checkout/',
  '/cart',
  '/cart/',
  '/my-account',
  '/my-account/',
  '/blog/',
  '/post-sitemap',
  '/search',
  '/search/',
  '/juaranyaformula',
  '/juaranyaformula/',
  // Floating buttons preview page — template only, no content
  '/e-floating-buttons',
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

  // 301 redirect legacy direct slugs (NON /category/ variants) to new pillar/product URLs
  const LEGACY_SLUG_REDIRECTS: Record<string, string> = {
    // Dreampreneur landing → batch 2 slug
    '/dreampreneur/': '/dreampreneur-batch-2/',
    '/dreampreneur/thankyou/': '/dreampreneur-batch-2/thankyou/',
    // Legacy maklon categories → Valid /produk/* Silo or Category Pillar (prevents 404 to /maklon/kosmetik/)
    '/maklon-skincare/': '/produk/skincare/',
    '/maklon-personal-care/': '/produk/bodycare/',
    '/personal-care/': '/produk/bodycare/',
    '/maklon-bodycare/': '/produk/bodycare/',
    '/maklon-footcare/': '/produk/footcare/',
    '/maklon-baby-care/': '/produk/babycare/',
    '/maklon-haircare/': '/produk/haircare/',
    '/maklon-parfum/': '/produk/parfum/',
    '/bisnis-men-grooming/': '/category/maklon-kosmetik/',
    // Legacy bisnis categories → Panduan Bisnis
    '/bisnis-kosmetik/': '/category/panduan-bisnis/',
    // Previous pillar slugs → new pillar slugs
    '/tren-kosmetik/': '/category/tren-inovasi/',
    '/bisnis-dreampreneur/': '/category/panduan-bisnis/',
    '/tips-bisnis/': '/category/panduan-bisnis/',
    '/tips-trick/': '/category/panduan-bisnis/',
    '/dreamlab-pedia/': '/category/panduan-bisnis/',
    '/dreamlabpedia/': '/category/panduan-bisnis/',
  };
  const directSlugMatch = LEGACY_SLUG_REDIRECTS[pathname] || LEGACY_SLUG_REDIRECTS[pathname.replace(/\/$/, '') + '/'];
  // Also match legacy sub-pages: /maklon-body-care/something → redirect to base
  const directSlugPrefixMatch = Object.keys(LEGACY_SLUG_REDIRECTS).find(pattern =>
    pathname.startsWith(pattern) && pattern !== '/'
  );

  // 301 redirect old category slugs + previous pillar slugs to new canonical 7-pillar categories
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
    // Legacy bisnis categories → Panduan Bisnis
    'bisnis-kosmetik': 'panduan-bisnis',
    'bisnis-skincare': 'panduan-bisnis',
    'bisnis-parfum': 'panduan-bisnis',
    'panduan-bisnis-kosmetik': 'panduan-bisnis',
    // Previous pillar slugs & route aliases → canonical 7-pillar slugs
    'tren-kosmetik': 'tren-inovasi',
    'maklon-kosmetik-skincare': 'maklon-kosmetik',
    'bisnis-dreampreneur': 'panduan-bisnis',
    'tips-bisnis': 'panduan-bisnis',
    'tips-trick': 'panduan-bisnis',
    'dreamlab-pedia': 'panduan-bisnis',
    'dreamlabpedia': 'panduan-bisnis',
    'formula-rd': 'formula-rnd',
    'formula-r-d': 'formula-rnd',
    'formula-kosmetik': 'formula-rnd',
    'event': 'event-aktivitas',
    'dreampreneur-beauty-academy': 'aipreneur',
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
      const rawCat = categoryPaginationMatch[1];
      const targetCat = CATEGORY_REDIRECTS[rawCat] || rawCat;
      canonicalUrl.pathname = `/category/${targetCat}/`;
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
    '/maklon-body-butter': '/cara-membuat-brand-body-butter/',
    '/maklon-body-butter/': '/cara-membuat-brand-body-butter/',
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
    '/thankyoupage-google': '/ads/thankyou/google-ads/',
    '/thankyoupage-google/': '/ads/thankyou/google-ads/',
    '/thankyou-page': '/thankyou/google/',
    '/thankyou-page/': '/thankyou/google/',
    // Ubersuggest 4xx audit fixes
    '/biaya-maklon-skincare-estimasi-lengkap': '/biaya-maklon-skincare/',
    '/biaya-maklon-skincare-estimasi-lengkap/': '/biaya-maklon-skincare/',
    '/cara-daftar-bpom-kosmetik': '/jasa-maklon-kosmetik-bpom-panduan-lengkap/',
    '/cara-daftar-bpom-kosmetik/': '/jasa-maklon-kosmetik-bpom-panduan-lengkap/',
    '/cara-memulai-bisnis-skincare-dari-nol': '/cara-mulai-bisnis-skincare-dari-nol/',
    '/cara-memulai-bisnis-skincare-dari-nol/': '/cara-mulai-bisnis-skincare-dari-nol/',
    '/cara-memutihkan-ketiak': '/cara-ampuh-memutihkan-ketiak/',
    '/cara-memutihkan-ketiak/': '/cara-ampuh-memutihkan-ketiak/',
    '/cara-menghitung-hpp-produk-skincare': '/cara-menghitung-hpp-kosmetik/',
    '/cara-menghitung-hpp-produk-skincare/': '/cara-menghitung-hpp-kosmetik/',
    '/maklon-moisturizer': '/produk/skincare/facial-moisturizer/',
    '/maklon-moisturizer/': '/produk/skincare/facial-moisturizer/',
    '/maklon/face-cream': '/produk/skincare/face-cream/',
    '/maklon/face-cream/': '/produk/skincare/face-cream/',
    '/maklon/facial-serum': '/produk/skincare/facial-serum/',
    '/maklon/facial-serum/': '/produk/skincare/facial-serum/',
    '/maklon/facial-toner': '/produk/skincare/facial-toner/',
    '/maklon/facial-toner/': '/produk/skincare/facial-toner/',
    '/maklon/facial-wash': '/produk/skincare/facial-wash/',
    '/maklon/facial-wash/': '/produk/skincare/facial-wash/',
    '/maklon/maklon-skincare': '/produk/skincare/',
    '/maklon/maklon-skincare/': '/produk/skincare/',
    '/maklon/moisturizer': '/produk/skincare/facial-moisturizer/',
    '/maklon/moisturizer/': '/produk/skincare/facial-moisturizer/',
    '/maklon/sunscreen': '/produk/skincare/sunscreen/',
    '/maklon/sunscreen/': '/produk/skincare/sunscreen/',
    '/panduan-lengkap-maklon-skincare-untuk-pemilik-brand-baru-dan-klien-aktif': '/cara-mulai-bisnis-skincare-dari-nol/',
    '/panduan-lengkap-maklon-skincare-untuk-pemilik-brand-baru-dan-klien-aktif/': '/cara-mulai-bisnis-skincare-dari-nol/',
    '/peluang-bisnis-maklon-body-care': '/cara-memulai-bisnis-bodycare/',
    '/peluang-bisnis-maklon-body-care/': '/cara-memulai-bisnis-bodycare/',
    '/produk/babycare/baby-wash': '/produk/babycare/baby-2in1-wash/',
    '/produk/babycare/baby-wash/': '/produk/babycare/baby-2in1-wash/',
    '/produk/body-care': '/produk/bodycare/',
    '/produk/body-care/': '/produk/bodycare/',
    '/produk/lipcare': '/produk/decorative/lipcare/',
    '/produk/lipcare/': '/produk/decorative/lipcare/',
    '/produk/skincare/moisturizer': '/produk/skincare/facial-moisturizer/',
    '/produk/skincare/moisturizer/': '/produk/skincare/facial-moisturizer/',
    '/produk/skincare/face-serum': '/produk/skincare/facial-serum/',
    '/produk/skincare/face-serum/': '/produk/skincare/facial-serum/',
    '/produk/skincare/facial-sunscreen': '/produk/skincare/sunscreen/',
    '/produk/skincare/facial-sunscreen/': '/produk/skincare/sunscreen/',
    '/produk/sunscreen': '/produk/skincare/sunscreen/',
    '/produk/sunscreen/': '/produk/skincare/sunscreen/',
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

  // Proteksi halaman /lead-monitor/*: wajib memiliki cookie sesi dl_crm (kecuali /lead-monitor/masuk)
  if (
    (pathname === '/lead-monitor' || pathname.startsWith('/lead-monitor/')) &&
    !pathname.startsWith('/lead-monitor/masuk')
  ) {
    const sessionCookie = request.cookies.get('dl_crm')?.value;
    if (!sessionCookie || sessionCookie.length < 20) {
      const loginUrl = new URL('/lead-monitor/masuk/', request.url);
      return NextResponse.redirect(loginUrl, 302);
    }
  }

  // Teruskan pathname sebagai request header supaya root layout bisa
  // menentukan <html lang> yang benar (id/en) saat SSR. Ini penting
  // untuk halaman English /en/... supaya output HTML awal sudah
  // lang="en" (bukan hanya setelah hydration).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-dreamlab-path", pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (pathname === '/produk/pkrt' || pathname === '/produk/pkrt/') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export const config = {
  // API routes dilewati middleware (edge) supaya request round-robin & lead
  // capture tidak menambah hop latensi. Middleware hanya untuk redirect/410 SEO
  // dan penentuan lang — tidak dipakai route API.
  matcher:
    '/((?!_next/static|_next/image|favicon.ico|assets|robots.txt|sitemap.xml|llms.txt|api|new(?:%20|\\s)asset|images|promo-kemerdekaan|next.svg|file.svg|globe.svg|vercel.svg|window.svg|Sampul(?:%20|\\s)WEB).*)',
};
