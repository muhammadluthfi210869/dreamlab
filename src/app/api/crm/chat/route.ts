import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { formatWaChatLink } from '@/lib/crm-stages';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireUser(req, { write: false });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  const url = new URL(req.url);
  const phoneParam = url.searchParams.get('phone')?.trim();
  const codeParam = url.searchParams.get('code')?.trim();
  const busdevFilter = url.searchParams.get('busdev')?.trim();
  const qFilter = url.searchParams.get('q')?.trim()?.toLowerCase();

  const pool = getMonitorPool();

  // JIKA MEMINTA DETAIL THREAD SATU PERCAKAPAN
  if (phoneParam || codeParam) {
    const threadQuery = `
      SELECT 
        m.id,
        m.tracking_code,
        m.phone,
        m.sender_type,
        m.sender_name,
        m.message_text,
        m.status,
        m.direction,
        m.channel,
        m.busdev_name,
        m.created_at,
        m.is_read
      FROM crm_chat_messages m
      WHERE ${phoneParam ? 'm.phone = $1' : 'm.tracking_code = $1'}
      ORDER BY m.created_at ASC
      LIMIT 200
    `;
    const targetKey = phoneParam || codeParam;
    const messagesRes = await pool.query(threadQuery, [targetKey]);

    // Ambil detail lead untuk panel tengah
    const leadQuery = `
      SELECT 
        l.id,
        l.tracking_code,
        l.nama,
        l.wa_profile_name,
        COALESCE(NULLIF(l.whatsapp_phone_e164, ''), NULLIF(l.wa_phone, ''), NULLIF(l.hp, ''), m.phone) as phone,
        l.perusahaan,
        l.assigned_to,
        l.source,
        l.utm_source,
        l.utm_campaign,
        l.page_title,
        l.page_url,
        l.created_at,
        l.confirmed_at,
        cls.stage,
        COALESCE(cls.produk_manual, l.produk) as produk,
        COALESCE(cls.moq_manual, l.requested_quantity_pcs) as moq,
        cls.note
      FROM crm_chat_messages m
      LEFT JOIN leads l ON (m.tracking_code = l.tracking_code OR m.phone = l.whatsapp_phone_e164 OR m.phone = l.wa_phone OR m.phone = l.hp)
      LEFT JOIN crm_lead_state cls ON (l.tracking_code = cls.tracking_code OR m.tracking_code = cls.tracking_code)
      WHERE ${phoneParam ? 'm.phone = $1' : 'm.tracking_code = $1'}
      ORDER BY l.id DESC NULLS LAST
      LIMIT 1
    `;
    const leadRes = await pool.query(leadQuery, [targetKey]);

    return json({
      success: true,
      messages: messagesRes.rows,
      lead: leadRes.rows[0] || null,
    });
  }

  // JIKA MEMINTA DAFTAR KOTAK MASUK (CONVERSATIONS LIST)
  // Mengambil percakapan unik terakhir per nomor telepon
  const listQuery = `
    WITH ranked_messages AS (
      SELECT 
        m.id,
        m.phone,
        m.tracking_code,
        m.sender_name,
        m.sender_type,
        m.message_text,
        m.direction,
        m.channel,
        m.busdev_name,
        m.created_at,
        m.is_read,
        ROW_NUMBER() OVER (PARTITION BY m.phone ORDER BY m.created_at DESC) as rn
      FROM crm_chat_messages m
    ),
    unread_counts AS (
      SELECT 
        phone, 
        COUNT(*) as unread_count 
      FROM crm_chat_messages 
      WHERE is_read = FALSE AND direction = 'inbound'
      GROUP BY phone
    )
    SELECT 
      rm.id as last_message_id,
      rm.phone,
      rm.tracking_code,
      COALESCE(NULLIF(l.nama, ''), NULLIF(l.wa_profile_name, ''), rm.sender_name, 'Calon Klien') as customer_name,
      COALESCE(NULLIF(l.assigned_to, ''), rm.busdev_name, 'Unassigned') as busdev,
      COALESCE(cls.stage, 'traffic') as stage,
      COALESCE(cls.produk_manual, l.produk, 'Kosmetik') as produk,
      COALESCE(cls.moq_manual, l.requested_quantity_pcs, 0) as moq,
      COALESCE(l.source, 'WhatsApp Webhook') as source,
      rm.message_text as last_message,
      rm.direction as last_direction,
      rm.channel,
      rm.created_at as last_message_at,
      COALESCE(uc.unread_count, 0) as unread_count
    FROM ranked_messages rm
    LEFT JOIN leads l ON (rm.tracking_code = l.tracking_code OR rm.phone = l.whatsapp_phone_e164 OR rm.phone = l.wa_phone OR rm.phone = l.hp)
    LEFT JOIN crm_lead_state cls ON (l.tracking_code = cls.tracking_code OR rm.tracking_code = cls.tracking_code)
    LEFT JOIN unread_counts uc ON rm.phone = uc.phone
    WHERE rm.rn = 1
    ORDER BY rm.created_at DESC
    LIMIT 200
  `;

  const listRes = await pool.query(listQuery);
  let rows = listRes.rows;

  // Filter jika ada Busdev tab
  if (busdevFilter && busdevFilter !== 'all' && busdevFilter !== 'Semua') {
    rows = rows.filter((r) => (r.busdev || '').toLowerCase() === busdevFilter.toLowerCase());
  }

  // Filter query pencarian
  if (qFilter) {
    rows = rows.filter(
      (r) =>
        (r.customer_name || '').toLowerCase().includes(qFilter) ||
        (r.phone || '').includes(qFilter) ||
        (r.last_message || '').toLowerCase().includes(qFilter) ||
        (r.tracking_code || '').toLowerCase().includes(qFilter)
    );
  }

  return json({
    success: true,
    conversations: rows,
    totalCount: rows.length,
    unreadTotal: rows.reduce((acc, cur) => acc + Number(cur.unread_count || 0), 0),
  });
}

// KIRIM BALASAN CHAT DARI BUSDEV
export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  const body = await req.json().catch(() => null);
  const phone = String(body?.phone || '').trim().replace(/[^0-9]/g, '');
  const trackingCode = body?.tracking_code ? String(body.tracking_code).trim() : null;
  const messageText = String(body?.message || '').trim();

  if (!phone || phone.length < 9) {
    return json({ success: false, error: 'Nomor telepon customer tidak valid' }, 400);
  }
  if (!messageText) {
    return json({ success: false, error: 'Pesan balasan tidak boleh kosong' }, 400);
  }

  const pool = getMonitorPool();

  // Simpan pesan keluar ke database crm_chat_messages
  const insertRes = await pool.query(
    `INSERT INTO crm_chat_messages (
      tracking_code,
      phone,
      sender_type,
      sender_name,
      message_text,
      status,
      direction,
      channel,
      busdev_name,
      is_read,
      created_at
    )
    VALUES ($1, $2, 'busdev', $3, $4, 'delivered', 'outbound', 'whatsapp', $5, TRUE, NOW())
    RETURNING *`,
    [trackingCode, phone, user.name, messageText, user.name]
  );

  // Jika lead masih dalam stage traffic, otomatis pindahkan ke stage cold atau catat interaksi
  if (trackingCode) {
    await pool.query(
      `INSERT INTO crm_lead_state (tracking_code, stage, updated_by, updated_at)
       VALUES ($1, 'cold', $2, NOW())
       ON CONFLICT (tracking_code) DO UPDATE SET
         updated_by = $2,
         updated_at = NOW()
       WHERE crm_lead_state.stage = 'traffic'`,
      [trackingCode, user.name]
    ).catch(() => undefined);
  }

  // Buat deep link WhatsApp Web dengan teks terisi
  const waUrl = formatWaChatLink(phone, body?.customer_name || null, user.name, body?.product || null);

  return json({
    success: true,
    message: insertRes.rows[0],
    waUrl,
  });
}

// TANDAI SUDAH DIBACA (MARK AS READ)
export async function PATCH(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;

  const body = await req.json().catch(() => null);
  const phone = String(body?.phone || '').trim().replace(/[^0-9]/g, '');

  if (!phone) {
    return json({ success: false, error: 'Nomor telepon tidak valid' }, 400);
  }

  const pool = getMonitorPool();
  await pool.query(
    `UPDATE crm_chat_messages 
     SET is_read = TRUE 
     WHERE phone = $1 AND is_read = FALSE`,
    [phone]
  );

  return json({ success: true });
}
