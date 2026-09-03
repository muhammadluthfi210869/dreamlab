import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateVisitorId, setVisitorCookieIfNew } from '@/lib/visitor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/round-robin/redirect
 * Dipakai untuk link bio/QR/linktree (channel media sosial).
 * Redirect ke halaman thankyou medsos dulu — di sana atribusi + conversion
 * dicatat, lalu auto-redirect ke WhatsApp (sticky round-robin) dengan pesan
 * yang menyebut "media sosial" sebagai channel sumber.
 */
export async function GET(req: NextRequest) {
  try {
    const visitorId = getOrCreateVisitorId(req);

    const res = NextResponse.redirect(new URL('/thankyou-medsos/', req.url), {
      status: 302,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' },
    });

    setVisitorCookieIfNew(res, req, visitorId);

    return res;
  } catch (error) {
    console.error('Round robin redirect error:', error);
    return NextResponse.json({ error: 'Redirect failed' }, { status: 500 });
  }
}
