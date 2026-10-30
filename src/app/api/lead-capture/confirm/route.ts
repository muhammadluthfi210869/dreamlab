import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import pool, { resetPool } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

const IS_PROD = process.env.NODE_ENV === 'production';

/**
 * Baca verify token. Prioritas: env var. Fallback ke literal dev agar local
 * boot tidak crash. Untuk production, idealnya SET WA_WEBHOOK_VERIFY_TOKEN di
 * Vercel — tapi kami tetap fallback ke legacy hardcoded token agar Meta
 * subscription yang sudah ada tidak putus. Setelah operator set env + Re-
 * subscribe Meta dengan token baru, legacy ini bisa dihapus.
 *
 *   legacy token (deprecated): nex_meta_verify_2026_9Q7mK2vL5xR8cT4p
 */
const LEGACY_VERIFY_TOKEN = 'nex_meta_verify_2026_9Q7mK2vL5xR8cT4p';

function readVerifyToken(): string {
  const t =
    process.env.WA_WEBHOOK_VERIFY_TOKEN ||
    process.env.META_WEBHOOK_VERIFY_TOKEN;
  if (t) return t;
  if (IS_PROD) {
    console.warn(
      '[lead-capture/confirm] WA_WEBHOOK_VERIFY_TOKEN not set — using legacy hardcoded fallback (insecure, anyone with repo access can subscribe). SET IT in Vercel env, then re-subscribe Meta with the new token and remove LEGACY_VERIFY_TOKEN.'
    );
  }
  return LEGACY_VERIFY_TOKEN;
}

/**
 * Verifikasi signature Meta (X-Hub-Signature-256 = sha256=<hex>).
 * Constant-time compare untuk hindari timing attack.
 *
 * Kalau META_APP_SECRET tidak di-set: dev = skip check, prod = skip check
 * dengan warning. Tetap tidak ideal (siapa pun bisa forge POST), tapi tidak
 * memutus Meta subscription yang sudah jalan. Operator harus set env ASAP.
 */
function verifyMetaSignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.META_APP_SECRET;
  if (!secret) {
    console.warn(
      '[lead-capture/confirm] META_APP_SECRET not set — signature check disabled. SET IT in Vercel env.'
    );
    return true;
  }
  if (!header || !header.startsWith('sha256=')) return false;
  const expected =
    'sha256=' +
    crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * GET /api/lead-capture/confirm
 * Verifikasi webhook (jika Meta webhook diarahkan langsung ke endpoint ini).
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  let VERIFY_TOKEN: string;
  try {
    VERIFY_TOKEN = readVerifyToken();
  } catch (e: any) {
    return NextResponse.json(
      { status: 'error', error: e?.message || 'verify token not configured' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }

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

  // Annisa / Nisa: WA +62 819-5241-7051 | WABA 116397311522216 | Phone ID 105186819325503
  if (pId === '116397311522216' || pId === '105186819325503' || cleanDest.endsWith('81952417051')) return 'Annisa';
  // Irma: WA +62 851-3318-8827 | Alt WA +62 881-0272-40339 | WABA 321060871092518 (Phone ID 290340704173604) / WABA 815864727920156 (Phone ID 915133341684796)
  if (pId === '321060871092518' || pId === '290340704173604' || pId === '815864727920156' || pId === '915133341684796' || cleanDest.endsWith('85133188827') || cleanDest.endsWith('881027240339')) return 'Irma';
  // Diaz: WA +62 877-7655-0657 | WABA 148982938307527 | Phone ID 198659679989033 | Alt WA 0812-9026-2100
  if (pId === '148982938307527' || pId === '198659679989033' || cleanDest.endsWith('87776550657') || cleanDest.endsWith('81290262100')) return 'Diaz';
  // Jessica: WA +62 877-1223-2389 | Alt WA 0812-8362-6294 | WABA 1688350871863816 | Phone ID 747476801793002 (via Convia Coexistence)
  if (pId === '747476801793002' || cleanDest.endsWith('87712232389') || cleanDest.endsWith('81283626294')) return 'Jessica';

  return 'Unassigned';
}

export async function POST(req: NextRequest) {
  try {
    // Baca raw body SEKALI — dipakai untuk signature verification dan JSON parse
    const rawBody = await req.text();
    const isFromNexerp = req.headers.get('x-forwarded-from') === 'nexerp';
    if (!isFromNexerp && !verifyMetaSignature(rawBody, req.headers.get('x-hub-signature-256'))) {
      return NextResponse.json(
        { success: false, error: 'invalid signature' },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    let body: any = {};
    if (rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch (parseErr: any) {
        console.warn('[lead-capture/confirm] JSON.parse failed, falling back to regex extraction:', parseErr?.message);
        body = {};
      }
    }

    let trackingCode: string | null = null;
    let phone: string | null = null;
    let waName: string | null = null;
    let messageText: string | null = null;
    let destinationPhone: string | null = null;
    let phoneNumberId: string | null = null;
    let wamid: string | null = null;

    // A. Deteksi format payload Meta WhatsApp Cloud API
    if (body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const value = body.entry[0].changes[0].value;
      const msg = value.messages[0];
      const contact = value.contacts?.[0];

      phone = msg.from ? String(msg.from) : null;
      waName = contact?.profile?.name || null;
      wamid = msg.id ? String(msg.id) : null;
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
    // B. Deteksi payload bridge dari ERP, endpoint Convia (/api/lead-capture/convia), atau script uji
    else {
      trackingCode = body.trackingCode || body.tracking_code || body.eventId || null;
      phone = body.phone || body.sender || null;
      waName = body.waName || body.wa_name || body.profileName || null;
      wamid = body.wamid || body.messageId || body.msgId || null;
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

    // Tentukan penerima Busdev dari nomor tujuan / Phone Number ID WABA
    const busdevName = resolveBusdevName(destinationPhone, phoneNumberId);

    // Dedup by wamid: kalau wamid sudah pernah diproses, return early.
    // Tabel processed_webhook_messages dibuat oleh migration 00016.
    if (wamid) {
      const dup = await pool.query(
        `INSERT INTO processed_webhook_messages (wamid, processed_at)
         VALUES ($1, NOW())
         ON CONFLICT (wamid) DO NOTHING
         RETURNING wamid`,
        [wamid]
      );
      if ((dup.rowCount || 0) === 0) {
        return NextResponse.json(
          { success: true, dedup: true, wamid },
          { status: 200, headers: NO_STORE_HEADERS }
        );
      }
    }

    // ── ATURAN 1: ABAIKAN NOTIFIKASI SISTEM ANDROID / GHOST NOTIFICATIONS ──
    if (messageText) {
      const isGhostNotification =
        /memeriksa pesan baru/i.test(messageText) ||
        /checking for new messages/i.test(messageText) ||
        /pesan ini telah dihapus/i.test(messageText) ||
        /this message was deleted/i.test(messageText) ||
        /menunggu pesan ini/i.test(messageText);

      if (isGhostNotification) {
        return NextResponse.json(
          {
            success: true,
            ignored: true,
            reason: 'Notifikasi sistem WhatsApp / Android diabaikan (Ghost notification filter).',
          },
          { status: 200, headers: NO_STORE_HEADERS }
        );
      }
    }

    // ── ATURAN 2: HANYA CHAT PERTAMA DENGAN KODE TRACKING YANG DICATAT ──
    // Chat lanjutan, balasan biasa, obrolan internal, notifikasi sistem, atau chat tanpa kode DIABAIKAN.
    if (!trackingCode) {
      return NextResponse.json(
        {
          success: true,
          ignored: true,
          reason: 'Chat tanpa kode tracking diabaikan. Hanya chat awal prospek yang divalidasi.',
        },
        { status: 200, headers: NO_STORE_HEADERS }
      );
    }

    // Cek apakah kode tracking ini SUDAH PERNAH terkonfirmasi sebelumnya (Hanya Chat Pertama)
    const existingCheck = await pool.query(
      `SELECT id, tracking_code, status, assigned_to FROM leads WHERE tracking_code = $1 OR session_id = $1 LIMIT 1`,
      [trackingCode]
    );

    if (existingCheck.rows.length > 0 && existingCheck.rows[0].status === 'confirmed') {
      return NextResponse.json(
        {
          success: true,
          ignored: true,
          reason: 'Lead sudah terkonfirmasi sebelumnya. Chat susulan diabaikan (Hanya chat pertama yang dicatat).',
          leadId: existingCheck.rows[0].id,
          assignedTo: existingCheck.rows[0].assigned_to,
        },
        { status: 200, headers: NO_STORE_HEADERS }
      );
    }

    // ── ATURAN 3: DEDUPLIKASI NOMOR TELEPON 24 JAM (PHONE-LEVEL DEDUP) ──
    // Jika nomor HP yang sama sudah pernah terkonfirmasi dalam 24 jam terakhir,
    // jangan buat lead duplikat baru; cukup update baris existing dan increment visit_count.
    if (normalizedPhone && normalizedPhone.length >= 9) {
      const phoneCheck = await pool.query(
        `SELECT id, tracking_code, assigned_to 
           FROM leads 
          WHERE (wa_phone = $1 OR hp = $1)
            AND status = 'confirmed'
            AND created_at > NOW() - INTERVAL '24 hours'
            AND is_test IS NOT TRUE
          ORDER BY id DESC LIMIT 1`,
        [normalizedPhone]
      );
      if (phoneCheck.rows.length > 0) {
        await pool.query(
          `UPDATE leads 
              SET visit_count = visit_count + 1,
                  confirmed_at = NOW(),
                  wa_message = COALESCE($1, wa_message)
            WHERE id = $2`,
          [messageText, phoneCheck.rows[0].id]
        );
        return NextResponse.json(
          {
            success: true,
            dedup: true,
            reason: 'Nomor telepon sudah terkonfirmasi dalam 24 jam (dihitung 1 prospek unik).',
            leadId: phoneCheck.rows[0].id,
            assignedTo: phoneCheck.rows[0].assigned_to,
          },
          { status: 200, headers: NO_STORE_HEADERS }
        );
      }
    }

    // Forward ke NexERP jika request datang langsung dari Meta (anti infinite loop).
    // AbortController agar Vercel function tidak menggantung kalau nexerp.id down.
    if (!isFromNexerp && body?.entry) {
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), 5000);
      fetch('https://nexerp.id/api/wa-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-from': 'dreamlab',
        },
        body: rawBody,
        signal: ac.signal,
      })
        .catch((err) => {
          console.error('[lead-capture/confirm] NexERP background forward err:', err?.message || err);
        })
        .finally(() => clearTimeout(timer));
    }

    let updatedRows = 0;
    let finalTrackingCode = trackingCode;
    let assignedBusdev = busdevName;

    try {
      // 1. Exact match pada tracking_code atau session_id
      const updateRes = await pool.query(
        `UPDATE leads
            SET status = 'confirmed',
                wa_profile_name = COALESCE($1, wa_profile_name),
                wa_phone = COALESCE($2, wa_phone),
                wa_message = COALESCE($3, wa_message),
                confirmed_at = NOW()
          WHERE tracking_code = $4
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
        await pool.query(
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
      } catch (e: any) {
        if (e?.code !== '42P01') {
          console.error('[lead-capture/confirm] lead_assignments update error:', e?.message || e);
        }
      }

      if (updatedRows === 0) {
        // Jika lead belum ada (misal chat masuk langsung dari web tanpa lewat form pre-assign),
        // catat sebagai confirmed lead baru untuk busdev terkait
        await pool.query(
          `INSERT INTO leads
             (tracking_code, assigned_to, status, wa_profile_name, wa_phone, wa_message, confirmed_at, source)
           VALUES ($1, $2, 'confirmed', $3, $4, $5, NOW(), 'wa-direct')
           ON CONFLICT (tracking_code) DO NOTHING`,
          [trackingCode, busdevName, waName, normalizedPhone, messageText]
        );
        updatedRows = 1;
      }

      // 3. Update phone_assignments agar nomor prospek ini terkunci ke BusDev ini (Phone Sticky)
      // "menggunakan nomor yang sama tidak bisa ke busdev lainnya"
      if (
        normalizedPhone &&
        normalizedPhone.length >= 9 &&
        assignedBusdev &&
        assignedBusdev !== 'Unassigned'
      ) {
        try {
          await pool.query(
            `INSERT INTO phone_assignments (phone_number, agent_id, created_at, last_seen, expires_at)
             SELECT $1, b.id, NOW(), NOW(), NOW() + INTERVAL '180 days'
               FROM busdevs b
              WHERE b.is_active = true
                AND (b.name ILIKE '%' || $2 || '%' OR $2 ILIKE '%' || b.name || '%')
              LIMIT 1
             ON CONFLICT (phone_number)
             DO UPDATE SET agent_id = EXCLUDED.agent_id,
                           last_seen = NOW(),
                           expires_at = NOW() + INTERVAL '180 days'`,
            [normalizedPhone, assignedBusdev]
          );
        } catch (phoneErr: any) {
          console.error(
            '[lead-capture/confirm] phone_assignments error:',
            phoneErr?.message || phoneErr
          );
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
      console.error('[lead-capture/confirm] Query error:', err);
      resetPool();
      throw err;
    }
  } catch (err: any) {
    console.error('[lead-capture/confirm] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
