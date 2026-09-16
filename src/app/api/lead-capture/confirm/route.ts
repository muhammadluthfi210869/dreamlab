import { NextRequest, NextResponse } from 'next/server';
import pool, { resetPool } from '@/lib/db';

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
 * 2. ATAU payload langsung/bridge dari ERP: { trackingCode, phone, waName, message }
 *
 * Mengubah status lead menjadi 'confirmed' dan mencatat profil pengirim.
 */

function resolveBusdevName(destPhone?: string | null, phoneId?: string | null): string {
  const cleanDest = (destPhone || '').replace(/[^0-9]/g, '');
  const pId = String(phoneId || '').trim();

  // Annisa: ID 116397311522216 | WA +62 819-5241-7051
  if (pId === '116397311522216' || cleanDest.endsWith('81952417051')) return 'Annisa';
  // Irma: ID 815864727920156 | WA +62 881-0272-40339
  if (pId === '815864727920156' || cleanDest.endsWith('881027240339')) return 'Irma';
  // Jessica: WA 0812-8362-6294
  if (cleanDest.endsWith('81283626294')) return 'Jessica';
  // Diaz: WA 0812-9026-2100
  if (cleanDest.endsWith('81290262100')) return 'Diaz';

  return 'Unassigned';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    let trackingCode: string | null = null;
    let phone: string | null = null;
    let waName: string | null = null;
    let messageText: string | null = null;
    let destinationPhone: string | null = null;
    let phoneNumberId: string | null = null;

    // A. Deteksi format payload Meta WhatsApp Cloud API
    if (body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const value = body.entry[0].changes[0].value;
      const msg = value.messages[0];
      const contact = value.contacts?.[0];

      phone = msg.from ? String(msg.from) : null;
      waName = contact?.profile?.name || null;
      messageText = msg.text?.body || msg.interactive?.button_reply?.title || null;
      destinationPhone = value.metadata?.display_phone_number ? String(value.metadata.display_phone_number) : null;
      phoneNumberId = value.metadata?.phone_number_id ? String(value.metadata.phone_number_id) : null;

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
      destinationPhone = body.destinationPhone || body.destination_phone || null;
      phoneNumberId = body.phoneNumberId || body.phone_number_id || null;

      if (!trackingCode && messageText) {
        const match = messageText.match(/\[Kode:\s*([A-Za-z0-9_-]+)\]/i);
        if (match) {
          trackingCode = match[1].trim();
        }
      }
    }

    // Normalisasi nomor HP pengirim
    let normalizedPhone = phone ? phone.replace(/[^0-9]/g, '') : null;
    if (normalizedPhone && normalizedPhone.startsWith('0')) {
      normalizedPhone = '62' + normalizedPhone.slice(1);
    }

    // Tentukan penerima Busdev
    const busdevName = resolveBusdevName(destinationPhone, phoneNumberId);

    // Forward ke NexERP jika request datang langsung dari Meta (anti infinite loop)
    const isFromNexerp = req.headers.get('x-forwarded-from') === 'nexerp';
    if (!isFromNexerp && body?.entry) {
      fetch('https://nexerp.id/api/wa-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-from': 'dreamlab',
        },
        body: JSON.stringify(body),
      }).catch((err) => {
        console.error('[lead-capture/confirm] NexERP background forward err:', err?.message || err);
      });
    }

    // Connect ke DB dengan retry resilien
    let client;
    let hasError = false;
    let updatedRows = 0;
    let finalTrackingCode = trackingCode;
    let assignedBusdev = busdevName;

    try {
      try {
        client = await pool.connect();
      } catch (connErr) {
        console.warn('[lead-capture/confirm] Pool connect failed, resetting pool and retrying...', connErr);
        resetPool();
        client = await pool.connect();
      }

      if (trackingCode) {
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

        if (updatedRows > 0) {
          assignedBusdev = updateRes.rows[0].assigned_to || busdevName;
        }

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
          // catat sebagai confirmed lead untuk busdev terkait
          await client.query(
            `INSERT INTO leads
               (tracking_code, assigned_to, status, wa_profile_name, wa_phone, wa_message, confirmed_at, source)
             VALUES ($1, $2, 'confirmed', $3, $4, $5, NOW(), 'wa-direct')
             ON CONFLICT (tracking_code) DO NOTHING`,
            [trackingCode, busdevName, waName, normalizedPhone, messageText]
          );
          updatedRows = 1;
        }
      } else {
        // Jika visitor menghapus [Kode: ...], coba cocokkan ke lead 'assigned' terbaru milik Busdev tersebut hari ini
        if (busdevName !== 'Unassigned') {
          const fallbackRes = await client.query(
            `UPDATE leads
                SET status = 'confirmed',
                    wa_profile_name = COALESCE($1, wa_profile_name),
                    wa_phone = COALESCE($2, wa_phone),
                    wa_message = COALESCE($3, wa_message),
                    confirmed_at = NOW()
              WHERE id = (
                SELECT id FROM leads
                 WHERE assigned_to = $4
                   AND status = 'assigned'
                   AND created_at >= NOW() - INTERVAL '3 hours'
                 ORDER BY created_at DESC
                 LIMIT 1
              )
              RETURNING id, tracking_code, assigned_to, status`,
            [waName, normalizedPhone, messageText, busdevName]
          );

          if ((fallbackRes.rowCount || 0) > 0) {
            updatedRows = fallbackRes.rowCount || 0;
            finalTrackingCode = fallbackRes.rows[0].tracking_code;
            assignedBusdev = fallbackRes.rows[0].assigned_to;
          }
        }

        // Jika tetap belum tercocokkan, catat sebagai confirmed direct chat
        if (updatedRows === 0) {
          const autoCode = `DL-DIR-${Date.now().toString(36).toUpperCase()}`;
          finalTrackingCode = autoCode;
          await client.query(
            `INSERT INTO leads
               (tracking_code, assigned_to, status, wa_profile_name, wa_phone, wa_message, confirmed_at, source)
             VALUES ($1, $2, 'confirmed', $3, $4, $5, NOW(), 'wa-direct')`,
            [autoCode, busdevName, waName, normalizedPhone, messageText]
          );
          updatedRows = 1;
        }
      }

      return NextResponse.json(
        {
          success: true,
          trackingCode: finalTrackingCode,
          assignedTo: assignedBusdev,
          updated: updatedRows > 0,
          status: 'confirmed',
          waName,
          phone: normalizedPhone,
        },
        { status: 200, headers: NO_STORE_HEADERS }
      );
    } catch (err: any) {
      hasError = true;
      throw err;
    } finally {
      if (client) {
        client.release(hasError);
      }
    }
  } catch (err: any) {
    console.error('[lead-capture/confirm] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
