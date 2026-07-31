import { NextRequest, NextResponse } from 'next/server';
import { getNextAgentFromDb } from '@/lib/round-robin-db';
import { getOrCreateVisitorId, setVisitorCookieIfNew } from '@/lib/visitor';

export const dynamic = 'force-dynamic';

/**
 * GET /api/lead-assignment
 * Endpoint legacy (dipakai halaman thankyou lama / linktree). Sekarang
 * diarahkan ke sistem baru (PostgreSQL + sticky) supaya hasilnya konsisten
 * dengan semua trigger lain. Response shape tetap dipertahankan.
 */
export async function GET(req: NextRequest) {
  try {
    const campaignSource = req.nextUrl.searchParams.get('campaignSource');
    const visitorId = getOrCreateVisitorId(req);
    const agent = await getNextAgentFromDb(visitorId);

    const res = NextResponse.json(
      {
        phone: agent.phoneNumber,
        agentId: agent.id,
        assignmentMethod: 'db',
        campaignSource,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );

    setVisitorCookieIfNew(res, req, visitorId);

    return res;
  } catch (error) {
    console.error('Lead assignment error:', error);
    return NextResponse.json({ error: 'Assignment failed' }, { status: 500 });
  }
}
