import { NextRequest, NextResponse } from 'next/server';
import { insertLead } from '@/lib/round-robin-db';
import { getOrCreateVisitorId, setVisitorCookieIfNew } from '@/lib/visitor';

export const dynamic = 'force-dynamic';

/**
 * POST /api/lead-capture/track
 * Simpan lead ke PostgreSQL dedicated (tabel `leads`), TERPISAH dari ERP.
 * Menyimpan visitor_id (dari cookie) + source (channel) untuk sticky/dedup.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const bodyVid = typeof body.visitorId === 'string' && body.visitorId.length > 5 ? body.visitorId : null;
    const visitorId = bodyVid || getOrCreateVisitorId(req);

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

    const res = NextResponse.json(
      { trackingCode: result.trackingCode, waUrl: result.waUrl },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );

    setVisitorCookieIfNew(res, req, visitorId);

    return res;
  } catch (err) {
    console.error('[lead-capture/track] Gagal simpan lead:', err);
    return NextResponse.json({ error: 'Track failed' }, { status: 500 });
  }
}
