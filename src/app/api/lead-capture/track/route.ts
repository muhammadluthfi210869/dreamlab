import { NextRequest, NextResponse } from 'next/server';
import { insertLead } from '@/lib/round-robin-db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/lead-capture/track
 * Simpan lead ke PostgreSQL dedicated (tabel `leads`).
 * Tidak memakai server ERP sama sekali.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const result = await insertLead({
      intent: body.intent ?? body.source,
      pageUrl: body.pageUrl,
      pageTitle: body.pageTitle,
      referrer: body.referrer,
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
      utmCampaign: body.utmCampaign,
      deviceType: body.deviceType,
      browser: body.browser,
      sessionId: body.sessionId,
      assignedName: body.assignedName,
      assignedPhone: body.assignedPhone,
      nama: body.nama,
      perusahaan: body.perusahaan,
      hp: body.hp,
      produk: body.produk,
    });

    return NextResponse.json(
      { trackingCode: result.trackingCode, waUrl: result.waUrl },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err) {
    console.error('[lead-capture/track] Gagal simpan lead:', err);
    return NextResponse.json({ error: 'Track failed' }, { status: 500 });
  }
}
