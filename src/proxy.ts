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

  // 301 redirect old category slugs to new pillar categories
  const CATEGORY_REDIRECTS: Record<string, string> = {
    'maklon-kosmetik': 'maklon-kosmetik-skincare',
    'maklon-skincare': 'maklon-kosmetik-skincare',
    'maklon-personal-care': 'maklon-kosmetik-skincare',
    'personal-care': 'maklon-kosmetik-skincare',
    'maklon-bodycare': 'maklon-kosmetik-skincare',
    'maklon-footcare': 'maklon-kosmetik-skincare',
    'maklon-baby-care': 'maklon-kosmetik-skincare',
    'maklon-haircare': 'maklon-kosmetik-skincare',
    'maklon-parfum': 'maklon-kosmetik-skincare',
    'bisnis-kosmetik': 'bisnis-dreampreneur',
    'bisnis-skincare': 'bisnis-dreampreneur',
    'bisnis-men-grooming': 'bisnis-dreampreneur',
    'dreampreneur-beauty-academy': 'bisnis-dreampreneur',
  };
  const categoryRedirectMatch = pathname.match(/^\/category\/([^/]+)\/?$/);
  const categoryRedirectTo = categoryRedirectMatch ? CATEGORY_REDIRECTS[categoryRedirectMatch[1]] : null;

  if (shouldForceHttps || shouldForceNonWww || shouldNormalizeDash || shouldNormalizeBlog || categoryPaginationMatch || categoryRedirectTo) {
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

    if (shouldForceHttps) {
      canonicalUrl.protocol = 'https:';
    }

    if (shouldForceNonWww) {
      canonicalUrl.hostname = 'dreamlab.id';
    }

    if (!canonicalUrl.pathname.endsWith('/')) {
      canonicalUrl.pathname = `${canonicalUrl.pathname}/`;
    }

    return NextResponse.redirect(canonicalUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|assets|robots.txt|sitemap.xml).*)',
};
