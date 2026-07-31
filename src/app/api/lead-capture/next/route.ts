import { NextRequest, NextResponse } from 'next/server';
import { getNextAgentFromDb } from '@/lib/round-robin-db';

export const dynamic = 'force-dynamic';

export const VISITOR_COOKIE = 'dreamlab_vid';

/**
 * GET /api/lead-capture/next
 * Ambil CS berikutnya (round-robin + sticky) dari PostgreSQL dedicated.
 *
 * Sticky: kalau visitor sudah punya cookie `dreamlab_vid`, dikembalikan CS
 * yang SAMA (tidak memajukan counter) → 1 visitor = 1 CS, mencegah lead
 * redundan masuk ke 2 CS berbeda. Counter hanya maju untuk visitor BARU.
 *
 * Format response disamakan dengan ERP lama supaya komponen tombol WA
 * tidak perlu diubah: { id, name, phoneNumber, orderIndex }
 */
export async function GET(req: NextRequest) {
  try {
    let visitorId = req.cookies.get(VISITOR_COOKIE)?.value || null;
    const isNew = !visitorId;
    if (!visitorId) {
      visitorId = crypto.randomUUID();
    }

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

    if (isNew) {
      res.cookies.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 tahun
      });
    }

    return res;
  } catch (err) {
    console.error('[lead-capture/next] Gagal ambil agent:', err);
    return NextResponse.json({ error: 'Assignment failed' }, { status: 500 });
  }
}
