import { NextResponse } from 'next/server';
import { getNextAgentFromDb } from '@/lib/round-robin-db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/lead-capture/next
 * Ambil CS berikutnya (round-robin) dari PostgreSQL dedicated.
 * Format response disamakan dengan ERP lama supaya komponen
 * tombol WA tidak perlu diubah: { id, name, phoneNumber, orderIndex }
 */
export async function GET() {
  try {
    const agent = await getNextAgentFromDb();
    return NextResponse.json(
      {
        id: agent.id,
        name: agent.name,
        phoneNumber: agent.phoneNumber,
        orderIndex: agent.orderIndex,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err) {
    console.error('[lead-capture/next] Gagal ambil agent:', err);
    return NextResponse.json({ error: 'Assignment failed' }, { status: 500 });
  }
}
