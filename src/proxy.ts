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
  { type: 'includes', value: '/&/' },
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

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
