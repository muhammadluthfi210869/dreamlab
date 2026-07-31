import type { NextRequest, NextResponse } from 'next/server';

/**
 * visitor.ts
 *
 * Identitas visitor (cookie `dreamlab_vid`) — dipakai oleh SEMUA route
 * lead-capture supaya 1 visitor = 1 CS konsisten di seluruh trigger.
 */

export const VISITOR_COOKIE = 'dreamlab_vid';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 tahun

/** Ambil visitorId dari cookie; kalau belum ada, buat UUID baru. */
export function getOrCreateVisitorId(req: NextRequest): string {
  return req.cookies.get(VISITOR_COOKIE)?.value || crypto.randomUUID();
}

/** Set cookie kalau visitor ini baru (belum punya cookie). */
export function setVisitorCookieIfNew(
  res: NextResponse,
  req: NextRequest,
  visitorId: string
) {
  if (!req.cookies.get(VISITOR_COOKIE)) {
    res.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });
  }
}
