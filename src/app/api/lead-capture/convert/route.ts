import { NextRequest, NextResponse } from 'next/server';
import { convertLead } from '@/lib/round-robin-db';
import { getOrCreateVisitorId, setVisitorCookieIfNew } from '@/lib/visitor';

export const dynamic = 'force-dynamic';

/**
 * POST /api/lead-capture/convert/
 * Alur BARU & tercepat: assign CS (sticky/rotasi) + simpan lead (dedup)
 * dalam SATU panggilan DB. Pengganti dua langkah lama:
 *   GET  /api/lead-capture/next/  → ambil CS
 *   POST /api/lead-capture/track/ → simpan lead
 * Kini cukup 1 request, 1 query DB → latency jauh lebih rendah.
 *
 * Response:
 *   { id, name, phoneNumber, orderIndex, trackingCode, waUrl }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const bodyVid =
      typeof body.visitorId === 'string' && body.visitorId.length > 5
        ? body.visitorId
        : null;
    const visitorId = bodyVid || getOrCreateVisitorId(req);

    const result = await convertLead({
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
      nama: body.nama,
      perusahaan: body.perusahaan,
      hp: body.hp,
      produk: body.produk,
    });

    const res = NextResponse.json(
      {
        id: result.id,
        name: result.name,
        phoneNumber: result.phoneNumber,
        orderIndex: result.orderIndex,
        trackingCode: result.trackingCode,
        waUrl: result.waUrl,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );

    setVisitorCookieIfNew(res, req, visitorId);

    return res;
  } catch (err) {
    console.error('[lead-capture/convert] Gagal assign+track lead:', err);
    return NextResponse.json({ error: 'Convert failed' }, { status: 500 });
  }
}