import { NextRequest, NextResponse } from 'next/server';
import { getNextAgentFromDb } from '@/lib/round-robin-db';
import { buildWhatsAppUrl } from '@/lib/lead-routing';
import { buildWaMessage } from '@/lib/wa-message';
import { getOrCreateVisitorId, setVisitorCookieIfNew } from '@/lib/visitor';

export const dynamic = 'force-dynamic';

/**
 * GET /api/round-robin/redirect
 * Redirect langsung ke WhatsApp dengan CS dari round-robin (sticky).
 * Dipakai untuk link bio/QR/linktree.
 */
export async function GET(req: NextRequest) {
  try {
    const visitorId = getOrCreateVisitorId(req);
    const agent = await getNextAgentFromDb(visitorId);
    // Link bio/QR/linktree = channel media sosial
    const url = buildWhatsAppUrl(agent.phoneNumber, buildWaMessage('jasa maklon kosmetik', 'medsos'));

    const res = NextResponse.redirect(url, {
      status: 302,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });

    setVisitorCookieIfNew(res, req, visitorId);

    return res;
  } catch (error) {
    console.error('Round robin redirect error:', error);
    return NextResponse.json({ error: 'Redirect failed' }, { status: 500 });
  }
}
