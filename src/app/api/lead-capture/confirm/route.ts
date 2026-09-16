import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

/**
 * GET /api/lead-capture/confirm
 * Verifikasi webhook (jika Meta webhook diarahkan langsung ke endpoint ini).
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  const VERIFY_TOKEN =
    process.env.WA_WEBHOOK_VERIFY_TOKEN ||
    process.env.META_WEBHOOK_VERIFY_TOKEN ||
    'nex_meta_verify_2026_9Q7mK2vL5xR8cT4p';

  if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ status: 'ok', message: 'Lead confirmation webhook active' });
}

/**
 * POST /api/lead-capture/confirm
 * Menerima konfirmasi chat WhatsApp masuk:
 * 1. Menerima payload Meta Cloud API (entry -> changes -> messages)
 * 2. ATAU payload langsung/bridge: { trackingCode, phone, waName, message }
 *
 * Mengubah status lead menjadi 'confirmed' dan mencatat profil pengirim.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    let trackingCode: string | null = null;
    let phone: string | null = null;
    let waName: string | null = null;
    let messageText: string | null = null;

    // A. Deteksi format payload Meta WhatsApp Cloud API
    if (body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const value = body.entry[0].changes[0].value;
      const msg = value.messages[0];
      const contact = value.contacts?.[0];

      phone = msg.from ? String(msg.from) : null;
      waName = contact?.profile?.name || null;
      messageText = msg.text?.body || msg.interactive?.button_reply?.title || null;

      if (messageText) {
        const match = messageText.match(/\[Kode:\s*([A-Za-z0-9_-]+)\]/i);
        if (match) {
          trackingCode = match[1].trim();
        }
      }
    } 
    // B. Deteksi payload bridge langsung dari ERP atau testing script
    else {
      trackingCode = body.trackingCode || body.tracking_code || body.eventId || null;
      phone = body.phone || body.sender || null;
      waName = body.waName || body.wa_name || body.profileName || null;
      messageText = body.waMessage || body.message || body.text || null;

      if (!trackingCode && messageText) {
        const match = messageText.match(/\[Kode:\s*([A-Za-z0-9_-]+)\]/i);
        if (match) {
          trackingCode = match[1].trim();
        }
      }
    }

    if (!trackingCode) {
      return NextResponse.json(
        { success: false, error: 'Tracking code tidak ditemukan dalam pesan' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // Normalisasi nomor HP pengirim
    let normalizedPhone = phone ? phone.replace(/[^0-9]/g, '') : null;
    if (normalizedPhone && normalizedPhone.startsWith('0')) {
      normalizedPhone = '62' + normalizedPhone.slice(1);
    }

    // Update status di PostgreSQL tabel `leads`
    const client = await pool.connect();
    let updatedRows = 0;
    try {
      // 1. Coba update exact match pada tracking_code atau ILIKE
      const updateRes = await client.query(
        `UPDATE leads
            SET status = 'confirmed',
                wa_profile_name = COALESCE($1, wa_profile_name),
                wa_phone = COALESCE($2, wa_phone),
                wa_message = COALESCE($3, wa_message),
                confirmed_at = NOW()
          WHERE tracking_code = $4
             OR tracking_code ILIKE '%' || $4 || '%'
             OR session_id = $4
          RETURNING id, tracking_code, assigned_to, status, confirmed_at`,
        [waName, normalizedPhone, messageText, trackingCode]
      );

      updatedRows = updateRes.rowCount || 0;

      // 2. Update juga di tabel lead_assignments jika ada
      try {
        await client.query(
          `UPDATE lead_assignments
              SET status = 'confirmed',
                  wa_profile_name = COALESCE($1, wa_profile_name),
                  wa_phone = COALESCE($2, wa_phone),
                  wa_message = COALESCE($3, wa_message),
                  confirmed_at = NOW()
            WHERE event_id = $4
               OR id::text = $4`,
          [waName, normalizedPhone, messageText, trackingCode]
        );
      } catch {
        // Abaikan jika tabel lead_assignments tidak ada di pool ini
      }

      if (updatedRows === 0) {
        // Jika lead belum ada (misal chat masuk langsung tanpa lewat web form),
        // catat sebagai unlinked/orphan confirmed lead
        await client.query(
          `INSERT INTO leads
             (tracking_code, assigned_to, status, wa_profile_name, wa_phone, wa_message, confirmed_at, source)
           VALUES ($1, 'Unassigned', 'confirmed', $2, $3, $4, NOW(), 'wa-direct')
           ON CONFLICT (tracking_code) DO NOTHING`,
          [trackingCode, waName, normalizedPhone, messageText]
        );
      }

      return NextResponse.json(
        {
          success: true,
          trackingCode,
          updated: updatedRows > 0,
          status: 'confirmed',
          waName,
          phone: normalizedPhone,
        },
        { status: 200, headers: NO_STORE_HEADERS }
      );
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('[lead-capture/confirm] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
