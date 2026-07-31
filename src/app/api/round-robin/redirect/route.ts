import { NextRequest, NextResponse } from 'next/server';
import { getNextAgentFromDb } from '@/lib/round-robin-db';
import { buildWhatsAppUrl } from '@/lib/lead-routing';
import { buildWaMessage } from '@/lib/wa-message';

export const dynamic = 'force-dynamic';

const VISITOR_COOKIE = 'dreamlab_vid';

/**
 * GET /api/round-robin/redirect
 * Redirect langsung ke WhatsApp dengan CS dari round-robin (sticky).
 * Dipakai untuk link bio/QR/linktree. Set cookie visitor supaya konsisten
 * dengan tombol WA lain di situs.
 */
export async function GET(req: NextRequest) {
  try {
    let visitorId = req.cookies.get(VISITOR_COOKIE)?.value || null;
    const isNew = !visitorId;
    if (!visitorId) {
      visitorId = crypto.randomUUID();
    }

    const agent = await getNextAgentFromDb(visitorId);
    const url = buildWhatsAppUrl(agent.phoneNumber, buildWaMessage('jasa maklon kosmetik'));

    const res = NextResponse.redirect(url, {
      status: 302,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });

    if (isNew) {
      res.cookies.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return res;
  } catch (error) {
    console.error('Round robin redirect error:', error);
    return NextResponse.json({ error: 'Redirect failed' }, { status: 500 });
  }
}
