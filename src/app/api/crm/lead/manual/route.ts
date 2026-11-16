import { NextRequest } from 'next/server';
import { requireUser, isAuthFailure, json } from '@/lib/crm-auth';
import { isAdminRole, normalizeStage, PIPELINE_STAGES, CRM_SOURCES, type PipelineStage } from '@/lib/crm-stages';
import { getMonitorPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

function normalizePhoneToE164(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('0')) {
    return '+62' + digits.slice(1);
  }
  if (digits.startsWith('62')) {
    return '+' + digits;
  }
  if (digits.startsWith('8')) {
    return '+62' + digits;
  }
  if (raw.trim().startsWith('+') && digits.length >= 7) {
    return '+' + digits;
  }
  return null;
}

/**
 * GET /api/crm/lead/manual?check_phone=08123...
 * Cek duplikasi nomor & deteksi pemilik lama (sticky owner) sebelum form disubmit
 */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;

  const sp = new URL(req.url).searchParams;
  const rawPhone = sp.get('check_phone') || '';
  if (!rawPhone.trim()) {
    return json({ success: true, exists: false });
  }

  const e164 = normalizePhoneToE164(rawPhone);
  if (!e164) {
    return json({ success: false, error: 'Format nomor tidak valid' }, 400);
  }

  const pool = getMonitorPool();
  // Cek di crm_leads
  const res = await pool.query(
    `SELECT cl.id, cl.name, cl.phone, cl.stage, cl.brand, cl.owner_sales_id, s.name AS owner_name
     FROM crm_leads cl
     LEFT JOIN sales s ON s.id = cl.owner_sales_id
     WHERE cl.phone = $1
     LIMIT 1`,
    [e164]
  );

  if (res.rows.length > 0) {
    const row = res.rows[0];
    return json({
      success: true,
      exists: true,
      lead: {
        id: row.id,
        name: row.name,
        phone: row.phone,
        stage: row.stage,
        brand: row.brand,
        owner_name: row.owner_name || null,
        owner_sales_id: row.owner_sales_id,
      },
    });
  }

  // Cek fallback di tabel leads lama
  const digits = e164.replace(/\D/g, '');
  const alt = '0' + digits.slice(2);
  const oldRes = await pool.query(
    `SELECT l.id, l.nama, l.hp, l.wa_phone, l.assigned_to, l.created_at
     FROM leads l
     WHERE (l.whatsapp_phone_e164 = $1 OR l.wa_phone = $1 OR l.wa_phone = $2 OR l.hp = $1 OR l.hp = $2)
       AND l.is_test IS NOT TRUE
     ORDER BY l.id DESC
     LIMIT 1`,
    [e164, alt]
  );

  if (oldRes.rows.length > 0) {
    const o = oldRes.rows[0];
    return json({
      success: true,
      exists: true,
      lead: {
        id: o.id,
        name: o.nama,
        phone: e164,
        stage: 'lead_masuk',
        brand: null,
        owner_name: o.assigned_to || null,
        owner_sales_id: null,
      },
    });
  }

  return json({ success: true, exists: false, phone: e164 });
}

/**
 * POST /api/crm/lead/manual
 * Tambah lead manual: nama*, nomor WA*, brand, produk, MOQ, source*, campaign, tanggal masuk, stage, catatan
 */
export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;
  const isAdmin = isAdminRole(user.role);

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const rawPhone = typeof body?.phone === 'string' ? body.phone.trim() : '';
  const brand = typeof body?.brand === 'string' ? body.brand.trim() : null;
  const product = typeof body?.product === 'string' ? body.product.trim() : null;
  const moq = typeof body?.moq === 'string' ? body.moq.trim() : null;
  const moqNumeric = body?.moq_numeric ? Number(body.moq_numeric) : null;
  const source = typeof body?.source === 'string' ? body.source.trim() : 'Referral';
  const campaign = typeof body?.campaign === 'string' ? body.campaign.trim() : null;
  const rawDate = typeof body?.entry_date === 'string' ? body.entry_date.trim() : '';
  const stageInput = typeof body?.stage === 'string' ? body.stage.trim() : 'lead_masuk';
  const stage = normalizeStage(stageInput);
  const note = typeof body?.note === 'string' ? body.note.trim() : null;
  const targetSalesId = body?.sales_id ? Number(body.sales_id) : null;

  if (!name) {
    return json({ success: false, error: 'Nama lead wajib diisi' }, 400);
  }
  if (!rawPhone) {
    return json({ success: false, error: 'Nomor WhatsApp wajib diisi' }, 400);
  }

  const phone = normalizePhoneToE164(rawPhone);
  if (!phone) {
    return json({ success: false, error: 'Format nomor WhatsApp tidak valid (contoh: 08123456789 atau 628123456789)' }, 400);
  }

  // Validasi tanggal: default hari ini WIB, boleh mundur, tidak boleh masa depan
  const nowWib = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
  let entryDate = nowWib;
  if (rawDate) {
    if (rawDate > nowWib) {
      return json({ success: false, error: 'Tanggal masuk tidak boleh di masa depan' }, 400);
    }
    entryDate = rawDate;
  }

  const pool = getMonitorPool();

  // 1. Cek apakah nomor sudah ada (sticky owner)
  const existingRes = await pool.query(
    `SELECT id, owner_sales_id, stage, name FROM crm_leads WHERE phone = $1 LIMIT 1`,
    [phone]
  );

  let ownerSalesId: number | null = null;
  let assignmentMethod: 'manual' | 'sticky' | 'round_robin' = 'manual';

  // Jika BusDev yang input, wajib miliknya sendiri
  if (!isAdmin) {
    ownerSalesId = user.id;
  } else {
    // Admin input
    if (existingRes.rows.length > 0 && existingRes.rows[0].owner_sales_id) {
      // Sticky ke pemilik lama
      ownerSalesId = existingRes.rows[0].owner_sales_id;
      assignmentMethod = 'sticky';
    } else if (targetSalesId && targetSalesId > 0) {
      ownerSalesId = targetSalesId;
      assignmentMethod = 'manual';
    } else {
      // Round robin default
      const rrRes = await pool.query(
        `SELECT id FROM sales WHERE is_active = TRUE AND role = 'busdev' ORDER BY rr_order ASC LIMIT 1`
      );
      ownerSalesId = rrRes.rows[0]?.id || null;
      assignmentMethod = 'round_robin';
    }
  }

  // Buat tracking code manual
  const trackingCode = `DL-M${Date.now().toString().slice(-6)}`;

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertRes = await client.query(
        `INSERT INTO crm_leads (
          tracking_code, name, phone, brand, product, moq, moq_numeric,
          source, campaign, stage, owner_sales_id, note, is_manual, created_by,
          created_at, stage_changed_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, TRUE, $13,
          ($14::date + current_time), NOW(), NOW()
        )
        ON CONFLICT (phone) DO UPDATE SET
          name = EXCLUDED.name,
          brand = COALESCE(EXCLUDED.brand, crm_leads.brand),
          product = COALESCE(EXCLUDED.product, crm_leads.product),
          moq = COALESCE(EXCLUDED.moq, crm_leads.moq),
          moq_numeric = COALESCE(EXCLUDED.moq_numeric, crm_leads.moq_numeric),
          note = COALESCE(EXCLUDED.note, crm_leads.note),
          updated_at = NOW()
        RETURNING *`,
        [
          trackingCode, name, phone, brand, product, moq, moqNumeric,
          source, campaign, stage, ownerSalesId, note, user.name,
          entryDate
        ]
      );

      const lead = insertRes.rows[0];

      // Catat ke crm_lead_assignments
      if (ownerSalesId) {
        await client.query(
          `INSERT INTO crm_lead_assignments (lead_id, sales_id, method, assigned_at)
           VALUES ($1, $2, $3, NOW())`,
          [lead.id, ownerSalesId, assignmentMethod]
        );
      }

      // Catat ke stage_history
      await client.query(
        `INSERT INTO stage_history (lead_id, from_stage, to_stage, by_user, at)
         VALUES ($1, 'lead_masuk', $2, $3, NOW())`,
        [lead.id, stage, user.name]
      );

      await client.query('COMMIT');
      return json({ success: true, lead, assignmentMethod });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err: any) {
    return json({ success: false, error: err?.message || 'Gagal menyimpan lead manual' }, 500);
  }
}

