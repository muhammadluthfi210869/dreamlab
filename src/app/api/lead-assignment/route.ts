import { NextRequest, NextResponse } from 'next/server';
import { getNextAgentFromDb, normalizePhone } from '@/lib/round-robin-db';
import { pickEmergencyFallbackAgent } from '@/lib/round-robin-config';
import { getOrCreateVisitorId, setVisitorCookieIfNew } from '@/lib/visitor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' } }
    );

    setVisitorCookieIfNew(res, req, visitorId);

    return res;
  } catch (error) {
    console.error('Lead assignment error from DB, fallback:', error);
    const fallback = pickEmergencyFallbackAgent();
    return NextResponse.json(
      {
        phone: normalizePhone(fallback.phone),
        agentId: fallback.id,
        assignmentMethod: 'fallback-random',
        campaignSource: req.nextUrl.searchParams.get('campaignSource'),
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' } }
    );
  }
}
