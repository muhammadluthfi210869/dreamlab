import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser, withCrmRls } from '@/lib/crm-auth';
import { canEditLead, canReadLead, formatWaChatLink, isAdminRole } from '@/lib/crm-stages';

export const dynamic = 'force-dynamic';

/**
 * Helper: periksa kepemilikan percakapan / lead berdasarkan phone, tracking_code, atau leadId.
 * Mengembalikan { found: boolean, allowed: boolean, lead: any }.
 */
async function resolveChatOwnership(
  pool: ReturnType<typeof getMonitorPool>,
  user: { id: number; name: string; role: any },
  opts: { phone?: string | null; code?: string | null; leadId?: number | null }
) {
  const { phone, code, leadId } = opts;
  let leadRes;
  if (leadId && leadId > 0) {
    leadRes = await pool.query(
      `SELECT l.id, l.tracking_code, l.nama, l.wa_profile_name,
              COALESCE(NULLIF(l.whatsapp_phone_e164, ''), NULLIF(l.wa_phone, ''), NULLIF(l.hp, '')) AS phone,
              l.perusahaan, l.assigned_to, l.source, l.utm_source, l.utm_campaign, l.page_title, l.page_url,
              l.created_at, l.confirmed_at,
              cls.stage, cls.owner, u_own.id AS owner_sales_id,
              COALESCE(cls.produk_manual, l.produk) AS produk,
              COALESCE(cls.moq_manual, l.requested_quantity_pcs) AS moq,
              cls.note
         FROM leads l
         LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
         LEFT JOIN crm_users u_own ON lower(u_own.name) = lower(COALESCE(NULLIF(cls.owner, ''), l.assigned_to))
        WHERE l.id = $1 AND l.is_test IS NOT TRUE
        LIMIT 1`,
      [leadId]
    );
  } else if (code) {
    leadRes = await pool.query(
      `SELECT l.id, l.tracking_code, l.nama, l.wa_profile_name,
              COALESCE(NULLIF(l.whatsapp_phone_e164, ''), NULLIF(l.wa_phone, ''), NULLIF(l.hp, '')) AS phone,
              l.perusahaan, l.assigned_to, l.source, l.utm_source, l.utm_campaign, l.page_title, l.page_url,
              l.created_at, l.confirmed_at,
              cls.stage, cls.owner, u_own.id AS owner_sales_id,
              COALESCE(cls.produk_manual, l.produk) AS produk,
              COALESCE(cls.moq_manual, l.requested_quantity_pcs) AS moq,
              cls.note
         FROM leads l
         LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
         LEFT JOIN crm_users u_own ON lower(u_own.name) = lower(COALESCE(NULLIF(cls.owner, ''), l.assigned_to))
        WHERE l.tracking_code = $1 AND l.is_test IS NOT TRUE
        ORDER BY l.id DESC
        LIMIT 1`,
      [code]
    );
  } else if (phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const withPlus = '+' + cleanPhone;
    leadRes = await pool.query(
      `SELECT l.id, l.tracking_code, l.nama, l.wa_profile_name,
              COALESCE(NULLIF(l.whatsapp_phone_e164, ''), NULLIF(l.wa_phone, ''), NULLIF(l.hp, ''), $1) AS phone,
              l.perusahaan, l.assigned_to, l.source, l.utm_source, l.utm_campaign, l.page_title, l.page_url,
              l.created_at, l.confirmed_at,
              cls.stage, cls.owner, u_own.id AS owner_sales_id,
              COALESCE(cls.produk_manual, l.produk) AS produk,
              COALESCE(cls.moq_manual, l.requested_quantity_pcs) AS moq,
              cls.note
         FROM leads l
         LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
         LEFT JOIN crm_users u_own ON lower(u_own.name) = lower(COALESCE(NULLIF(cls.owner, ''), l.assigned_to))
        WHERE l.is_test IS NOT TRUE
          AND (l.whatsapp_phone_e164 IN ($1, $2) OR l.wa_phone IN ($1, $2) OR l.hp IN ($1, $2))
        ORDER BY l.id DESC
        LIMIT 1`,
      [cleanPhone, withPlus]
    );
  } else {
    return { found: false, allowed: false, lead: null };
  }

  const lead = leadRes.rows[0] || null;
  if (lead) {
    const ownerName = lead.owner || lead.assigned_to || null;
    const ownerId = lead.owner_sales_id ? Number(lead.owner_sales_id) : null;
    const allowed = canReadLead(user, ownerName, ownerId);
    return { found: true, allowed, lead };
  }

  // Fallback: cek dari crm_chat_messages jika tidak ada di leads
  const targetKey = code || phone?.replace(/[^0-9]/g, '') || '';
  if (!targetKey) return { found: false, allowed: false, lead: null };
  const msgOwnerRes = await pool.query(
    `SELECT busdev_name, tracking_code, phone
       FROM crm_chat_messages
      WHERE ${code ? 'tracking_code = $1' : 'phone = $1'}
      ORDER BY created_at DESC
      LIMIT 1`,
    [targetKey]
  );
  if (!msgOwnerRes.rowCount) return { found: false, allowed: false, lead: null };
  const msgRow = msgOwnerRes.rows[0];
  const allowed = canReadLead(user, msgRow.busdev_name, null);
  return { found: true, allowed, lead: null };
}

export async function GET(req: NextRequest) {
  const auth = await requireUser(req, { write: false });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;
  const isAdmin = isAdminRole(user.role);

  const url = new URL(req.url);
  const phoneParam = url.searchParams.get('phone')?.trim();
  const codeParam = url.searchParams.get('code')?.trim();
  const leadIdParam = url.searchParams.get('leadId')?.trim();
  const busdevFilter = url.searchParams.get('busdev')?.trim();
  const qFilter = url.searchParams.get('q')?.trim()?.toLowerCase();

  const pool = getMonitorPool();

  // JIKA MEMINTA DETAIL THREAD SATU PERCAKAPAN
  if (phoneParam || codeParam || leadIdParam) {
    const leadId = leadIdParam ? parseInt(leadIdParam, 10) : null;
    const own = await resolveChatOwnership(pool, user, {
      phone: phoneParam,
      code: codeParam,
      leadId: Number.isInteger(leadId) ? leadId : null,
    });

    if (!own.found) {
      return json({ success: false, error: 'Percakapan atau lead tidak ditemukan' }, 404);
    }
    if (!own.allowed) {
      return json({ success: false, error: 'Anda tidak memiliki akses ke pesan milik sales lain' }, 403);
    }

    const targetCode = codeParam || own.lead?.tracking_code || null;
    const targetPhone = (phoneParam || own.lead?.phone || '').replace(/[^0-9]/g, '');

    const messagesRes = await withCrmRls(pool, user, (client) =>
      client.query(
        `SELECT 
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
        WHERE ($1::text IS NOT NULL AND m.phone = $1)
           OR ($2::text IS NOT NULL AND m.tracking_code = $2)
        ORDER BY m.created_at ASC
        LIMIT 200`,
        [targetPhone || null, targetCode]
      )
    );

    return json({
      success: true,
      messages: messagesRes.rows,
      lead: own.lead,
    });
  }

  // JIKA BUSDEV MENCOBA MEMFILTER PERCAKAPAN MILIK SALES LAIN
  if (!isAdmin && busdevFilter && busdevFilter !== 'all' && busdevFilter !== 'Semua' && busdevFilter.toLowerCase() !== user.name.toLowerCase()) {
    return json({ success: false, error: 'Anda hanya memiliki izin melihat kotak masuk milik Anda sendiri' }, 403);
  }

  // JIKA MEMINTA DAFTAR KOTAK MASUK (CONVERSATIONS LIST)
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
      COALESCE(NULLIF(cls.owner, ''), NULLIF(l.assigned_to, ''), rm.busdev_name, 'Unassigned') as busdev,
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
      ${isAdmin ? '' : `AND lower(COALESCE(NULLIF(cls.owner, ''), NULLIF(l.assigned_to, ''), rm.busdev_name, '')) = lower($1)`}
    ORDER BY rm.created_at DESC
    LIMIT 200
  `;

  const listRes = await withCrmRls(pool, user, (client) =>
    client.query(listQuery, isAdmin ? [] : [user.name])
  );
  let rows = listRes.rows;

  // Filter tambahan di server: Busdev hanya boleh menerima baris miliknya sendiri
  if (!isAdmin) {
    rows = rows.filter((r) => (r.busdev || '').toLowerCase() === user.name.toLowerCase());
  } else if (busdevFilter && busdevFilter !== 'all' && busdevFilter !== 'Semua') {
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
  const leadId = body?.leadId ? parseInt(String(body.leadId), 10) : null;
  const messageText = String(body?.message || '').trim();

  if (!phone || phone.length < 9) {
    return json({ success: false, error: 'Nomor telepon customer tidak valid' }, 400);
  }
  if (!messageText) {
    return json({ success: false, error: 'Pesan balasan tidak boleh kosong' }, 400);
  }

  const pool = getMonitorPool();
  const own = await resolveChatOwnership(pool, user, { phone, code: trackingCode, leadId });
  if (own.found && !own.allowed) {
    return json({ success: false, error: 'Anda tidak memiliki izin membalas pesan milik sales lain' }, 403);
  }

  const insertRes = await withCrmRls(pool, user, async (client) => {
    const res = await client.query(
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
      [trackingCode || own.lead?.tracking_code || null, phone, user.name, messageText, user.name]
    );

    // Balasan pertama busdev memindahkan Lead Masuk (traffic) -> Cold
    const codeToUpdate = trackingCode || own.lead?.tracking_code;
    if (codeToUpdate) {
      await client
        .query(
          `INSERT INTO crm_lead_state (tracking_code, stage, updated_by, updated_at)
           VALUES ($1, 'cold', $2, NOW())
           ON CONFLICT (tracking_code) DO UPDATE SET
             stage = 'cold',
             stage_changed_at = NOW(),
             updated_by = $2,
             updated_at = NOW()
           WHERE crm_lead_state.stage = 'traffic'`,
          [codeToUpdate, user.name]
        )
        .catch(() => undefined);
    }
    return res;
  });

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
  const { user } = auth;

  const body = await req.json().catch(() => null);
  const phone = String(body?.phone || '').trim().replace(/[^0-9]/g, '');
  const trackingCode = body?.tracking_code ? String(body.tracking_code).trim() : null;

  if (!phone && !trackingCode) {
    return json({ success: false, error: 'Nomor telepon atau kode lead tidak valid' }, 400);
  }

  const pool = getMonitorPool();
  const own = await resolveChatOwnership(pool, user, { phone, code: trackingCode });
  if (own.found && !own.allowed) {
    return json({ success: false, error: 'Anda tidak memiliki akses ke percakapan milik sales lain' }, 403);
  }

  await withCrmRls(pool, user, (client) =>
    client.query(
      `UPDATE crm_chat_messages 
       SET is_read = TRUE 
       WHERE ${phone ? 'phone = $1' : 'tracking_code = $1'} AND is_read = FALSE`,
      [phone || trackingCode]
    )
  );

  return json({ success: true });
}
