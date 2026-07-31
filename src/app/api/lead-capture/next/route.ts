import { NextRequest, NextResponse } from 'next/server';
import { getNextAgentFromDb } from '@/lib/round-robin-db';
import { getOrCreateVisitorId, setVisitorCookieIfNew } from '@/lib/visitor';

export const dynamic = 'force-dynamic';

/**
 * GET /api/lead-capture/next
 * Ambil CS berikutnya (round-robin + sticky) dari PostgreSQL dedicated.
 * 1 visitor = 1 CS — counter hanya maju untuk visitor BARU.
 * Response disamakan dengan ERP lama: { id, name, phoneNumber, orderIndex }
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
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );

    setVisitorCookieIfNew(res, req, visitorId);

    return res;
  } catch (err) {
    console.error('[lead-capture/next] Gagal ambil agent:', err);
    return NextResponse.json({ error: 'Assignment failed' }, { status: 500 });
  }
}
