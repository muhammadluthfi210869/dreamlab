import { NextRequest, NextResponse } from 'next/server';
import { getNextAgentFromDb, normalizePhone } from '@/lib/round-robin-db';
import { pickEmergencyFallbackAgent } from '@/lib/round-robin-config';
import { getOrCreateVisitorId, setVisitorCookieIfNew } from '@/lib/visitor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/round-robin/next
 * Endpoint legacy. Diarahkan ke sistem baru (PostgreSQL + sticky).
 * Response shape tetap dipertahankan untuk kompatibilitas caller lama.
 */
export async function GET(req: NextRequest) {
  try {
    const visitorId = getOrCreateVisitorId(req);
    const agent = await getNextAgentFromDb(visitorId);

    const res = NextResponse.json(
      {
        phone: agent.phoneNumber,
        busdev_id: agent.id,
        name: agent.name ?? null,
        assignmentMethod: 'db',
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' } }
    );

    setVisitorCookieIfNew(res, req, visitorId);

    return res;
  } catch (error) {
    console.error('Round robin error from DB, fallback:', error);
    const fallback = pickEmergencyFallbackAgent();
    return NextResponse.json(
      {
        phone: normalizePhone(fallback.phone),
        busdev_id: fallback.id,
        name: fallback.name ?? null,
        assignmentMethod: 'fallback-random',
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' } }
    );
  }
}
