import { NextRequest, NextResponse } from 'next/server';
import { getDbLeadStats } from '@/lib/round-robin-db';
import { isInternalRequestAuthorized } from '@/lib/internal-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/round-robin-stats
 * Statistik lead dari PostgreSQL (bukan Redis lama).
 * totalLeads    = semua lead tersimpan
 * totalRotations= jumlah visitor unik yang di-assign (baris visitor_assignments)
 * stickyServes  = lead dari visitor yang sama (repeat visit)
 */
export async function GET(req: NextRequest) {
  if (!isInternalRequestAuthorized(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }

  const stats = await getDbLeadStats();

  const total = Object.values(stats.countsByAgentId).reduce((sum, c) => sum + c, 0);
  const breakdown = Object.entries(stats.countsByAgentId)
    .map(([agentId, count]) => ({
      agentId,
      count,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => Number(a.agentId) - Number(b.agentId));

  const stickyServes = Math.max(0, total - stats.totalRotations);
  const stickyRatePercent = total > 0 ? Math.round((stickyServes / total) * 1000) / 10 : 0;

  return NextResponse.json(
    {
      totalLeads: total,
      totalRotations: stats.totalRotations,
      stickyServes,
      stickyRatePercent,
      breakdown,
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
