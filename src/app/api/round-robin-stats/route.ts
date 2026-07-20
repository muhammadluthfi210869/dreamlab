import { NextRequest, NextResponse } from 'next/server';
import { getAgentLeadCounts, getRoundRobinStats } from '@/lib/roundRobin';
import { isInternalRequestAuthorized } from '@/lib/internal-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isInternalRequestAuthorized(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }

  const counts = await getAgentLeadCounts();
  const stats = await getRoundRobinStats();

  const total = Object.values(counts).reduce((sum, c) => sum + c, 0);
  const breakdown = Object.entries(counts).map(([agentId, count]) => ({
    agentId,
    count,
    percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
  }));

  // totalLeads menghitung SEMUA assignment yang diserve, termasuk repeat
  // visit dari cookie sticky (30 hari). totalRotations cuma menghitung
  // slot rotasi Redis yang benar-benar dipakai (visitor baru / fallback).
  // Kalau totalLeads >> totalRotations, itu tandanya banyak traffic-nya
  // repeat visitor yang "nempel" ke CS yang sama — bukan berarti rotasi
  // round-robin-nya bermasalah. Lihat docs/thankyou-round-robin.md.
  const stickyServes = Math.max(0, total - stats.totalAssigned);
  const stickyRatePercent = total > 0 ? Math.round((stickyServes / total) * 1000) / 10 : 0;

  return NextResponse.json(
    {
      totalLeads: total,
      totalRotations: stats.totalAssigned,
      stickyServes,
      stickyRatePercent,
      breakdown,
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
