import { NextResponse } from 'next/server';
import { getOrAssignAgent } from '@/lib/lead-assignment';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { agent, source: assignmentMethod } = await getOrAssignAgent();
    return NextResponse.json({
      phone: agent.phone,
      busdev_id: agent.id,
      name: agent.name ?? null,
      assignmentMethod,
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Round robin error:', error);
    return NextResponse.json({ error: 'Assignment failed' }, { status: 500 });
  }
}
