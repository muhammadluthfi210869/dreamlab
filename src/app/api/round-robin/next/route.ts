import { NextRequest, NextResponse } from 'next/server';
import { getNextAgentFromDb } from '@/lib/round-robin-db';
import { getOrCreateVisitorId, setVisitorCookieIfNew } from '@/lib/visitor';

export const dynamic = 'force-dynamic';

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
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );

    setVisitorCookieIfNew(res, req, visitorId);

    return res;
  } catch (error) {
    console.error('Round robin error:', error);
    return NextResponse.json({ error: 'Assignment failed' }, { status: 500 });
  }
}
