import { NextResponse } from 'next/server';
import { getAgentLeadCounts, getRoundRobinStats } from '@/lib/roundRobin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const counts = await getAgentLeadCounts();
  const stats = await getRoundRobinStats();

  const total = Object.values(counts).reduce((sum, c) => sum + c, 0);
  const breakdown = Object.entries(counts).map(([agentId, count]) => ({
    agentId,
    count,
    percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
  }));

  return NextResponse.json({
    totalLeads: total,
    totalRotations: stats.totalAssigned,
    breakdown,
  });
}
