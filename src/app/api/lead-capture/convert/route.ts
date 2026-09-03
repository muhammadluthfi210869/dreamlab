import { NextRequest, NextResponse } from 'next/server';
import { convertLead, normalizePhone } from '@/lib/round-robin-db';
import { pickEmergencyFallbackAgent } from '@/lib/round-robin-config';
import { getOrCreateVisitorId, setVisitorCookieIfNew } from '@/lib/visitor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /api/lead-capture/convert/
 * Alur BARU & tercepat: assign CS (sticky/rotasi) + simpan lead (dedup)
 * dalam SATU panggilan DB.
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
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' } }
    );

    setVisitorCookieIfNew(res, req, visitorId);

    return res;
  } catch (err) {
    console.error('[lead-capture/convert] Gagal assign+track lead, fallback ke random active agent:', err);
    const fallback = pickEmergencyFallbackAgent();
    const phone = normalizePhone(fallback.phone);
    const trackingCode = `DL-LOCAL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const waUrl = `https://wa.me/${phone}`;
    return NextResponse.json(
      {
        id: fallback.id,
        name: fallback.name || fallback.id,
        phoneNumber: phone,
        orderIndex: Math.floor(Math.random() * 100),
        trackingCode,
        waUrl,
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' } }
    );
  }
}