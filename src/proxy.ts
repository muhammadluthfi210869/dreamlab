import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import seoMappingData from './data/seo-mapping.json';

// Define the shape of our mapping data
interface SeoMappingItem {
  source: string;
  destination: string;
  permanent?: boolean;
}

const seoMapping = seoMappingData as SeoMappingItem[];

// Create a lookup map for faster redirects
const redirectMap = new Map<string, SeoMappingItem>();
seoMapping.forEach(item => {
  // Store both with and without trailing slash for robustness
  const sourceClean = item.source.replace(/\/$/, '');
  redirectMap.set(sourceClean, item);
  redirectMap.set(sourceClean + '/', item);
});

export default function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, searchParams } = url;

  // 1. Strip unwanted tracking parameters (Canonical Guard)
  const unwantedParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
  let hasUnwanted = false;
  
  unwantedParams.forEach(param => {
    if (searchParams.has(param)) {
      searchParams.delete(param);
      hasUnwanted = true;
    }
  });

  // 2. Enforce trailing slash consistency (Matching legacy WordPress behavior)
  if (pathname !== '/' && !pathname.endsWith('/') && !pathname.includes('.')) {
    url.pathname = pathname + '/';
    return NextResponse.redirect(url, 301);
  }

  // If parameters were stripped, redirect to clean URL
  if (hasUnwanted) {
    return NextResponse.redirect(url, 301);
  }

  // 3. Check if the current path exists in our SEO mapping
  const mapping = redirectMap.get(pathname);
  
  if (mapping) {
    const destination = mapping.destination;
    
    // Prevent infinite loops if destination is the same as current path
    if (destination === pathname || destination === `${pathname}/`) {
      return NextResponse.next();
    }

    // Perform 301 (Permanent) or 302 (Temporary) redirect
    return NextResponse.redirect(new URL(destination, request.url), {
      status: mapping.permanent !== false ? 301 : 302,
    });
  }

  // 4. Pagination is handled by dedicated route: /news-blog/page/[num]/
  // No redirect needed

  return NextResponse.next();
}

// Only run middleware on paths that could be legacy URLs
// Avoid running on static assets, api routes, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (local assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|robots.txt|sitemap.xml).*)',
  ],
};
