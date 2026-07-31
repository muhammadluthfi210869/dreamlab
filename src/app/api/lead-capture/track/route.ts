import { NextRequest, NextResponse } from 'next/server';
import { insertLead } from '@/lib/round-robin-db';

export const dynamic = 'force-dynamic';

const VISITOR_COOKIE = 'dreamlab_vid';

/**
 * POST /api/lead-capture/track
 * Simpan lead ke PostgreSQL dedicated (tabel `leads`), TERPISAH dari ERP.
 * Menyimpan `visitor_id` (dari cookie) + `source` (channel) untuk dedup
 * dan atribusi channel yang konsisten.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const visitorId = req.cookies.get(VISITOR_COOKIE)?.value || body.visitorId || null;

    const result = await insertLead({
      intent: body.intent,
      source: body.source,
      visitorId,
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
