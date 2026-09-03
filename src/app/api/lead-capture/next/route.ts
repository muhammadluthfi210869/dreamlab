import { NextRequest, NextResponse } from 'next/server';
import { getNextAgentFromDb, normalizePhone } from '@/lib/round-robin-db';
import { pickEmergencyFallbackAgent } from '@/lib/round-robin-config';
import { getOrCreateVisitorId, setVisitorCookieIfNew } from '@/lib/visitor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/lead-capture/next
 * Ambil CS berikutnya (round-robin + sticky) dari PostgreSQL dedicated.
 * 1 visitor = 1 CS — counter hanya maju untuk visitor BARU.
 */
export async function GET(req: NextRequest) {
  try {
    const visitorId = getOrCreateVisitorId(req);
    const agent = await getNextAgentFromDb(visitorId);

    const res = NextResponse.json(
      {
        id: agent.id,
        name: agent.name,
        phoneNumber: agent.phoneNumber,
        orderIndex: agent.orderIndex,
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' } }
    );

    setVisitorCookieIfNew(res, req, visitorId);

    return res;
  } catch (err) {
    console.error('[lead-capture/next] Gagal ambil agent dari DB, fallback ke random active agent:', err);
    const fallback = pickEmergencyFallbackAgent();
    return NextResponse.json(
      {
        id: fallback.id,
        name: fallback.name || fallback.id,
        phoneNumber: normalizePhone(fallback.phone),
        orderIndex: Math.floor(Math.random() * 100),
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' } }
    );
  }
}
