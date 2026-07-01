import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const GONE_PATTERNS = [
  '/.help/dhl/',
  '/wp-content/',
  '/wp-admin/',
  '/wp-json/',
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

  if (normalizedPathname !== nextUrl.pathname) {
    const normalizedUrl = new URL(nextUrl.toString());
    normalizedUrl.pathname = normalizedPathname;
    return NextResponse.redirect(normalizedUrl, 308);
  }

  const pathname = normalizedPathname;

  if (pathname === '/blog' || pathname === '/blog/') {
    const redirectUrl = new URL(nextUrl.toString());
    redirectUrl.pathname = '/news-blog/';
    return NextResponse.redirect(redirectUrl, 308);
  }

  if (forwardedProto === 'http') {
    const secureUrl = new URL(nextUrl.toString());
    secureUrl.protocol = 'https:';
    return NextResponse.redirect(secureUrl, 308);
  }

  if (hostname === 'www.dreamlab.id') {
    const normalizedUrl = new URL(nextUrl.toString());
    normalizedUrl.hostname = 'dreamlab.id';
    return NextResponse.redirect(normalizedUrl, 308);
  }

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

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|assets|robots.txt|sitemap.xml).*)',
};
