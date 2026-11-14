import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser, withCrmRls } from '@/lib/crm-auth';
import { canEditLead, canReadLead, isAdminRole, isStage, MOQ_MAX, NOTE_MAX, PRODUK_MAX } from '@/lib/crm-stages';

export const dynamic = 'force-dynamic';

const CODE_RE = /^[A-Za-z0-9_.:\-]{3,80}$/;

/**
 * GET /api/crm/lead?id=<leadId>&code=<trackingCode>
 * Mengambil detail satu lead beserta riwayat stage.
 * Busdev hanya boleh mengambil lead dengan owner_sales_id / assigned_to = dirinya.
 * Jika Busdev A mencoba mengambil lead Busdev B lewat API langsung -> 403.
 */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req, { write: false });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  const sp = new URL(req.url).searchParams;
  const idParam = sp.get('id')?.trim();
  const codeParam = sp.get('code')?.trim();

  if (!idParam && !codeParam) {
    return json({ success: false, error: 'Parameter id atau code wajib diisi' }, 400);
  }

  const pool = getMonitorPool();
  let leadRow: any = null;

  if (idParam) {
    const idNum = parseInt(idParam, 10);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return json({ success: false, error: 'ID lead tidak valid' }, 400);
    }
    const r = await pool.query(
      `SELECT l.id, l.tracking_code, l.assigned_to, l.nama, l.wa_profile_name, l.hp, l.wa_phone, l.whatsapp_phone_e164,
              l.produk, l.requested_quantity_pcs, l.source, l.utm_source, l.utm_medium, l.utm_campaign, l.page_url, l.referrer,
              l.created_at, l.confirmed_at,
              cls.stage, cls.produk_manual, cls.moq_manual, cls.note, cls.owner, cls.stage_changed_at,
              u_own.id AS owner_sales_id
         FROM leads l
         LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
         LEFT JOIN crm_users u_own ON lower(u_own.name) = lower(COALESCE(NULLIF(cls.owner, ''), l.assigned_to))
        WHERE l.id = $1 AND l.is_test IS NOT TRUE
        LIMIT 1`,
      [idNum]
    );
    leadRow = r.rows[0] ?? null;
  } else if (codeParam) {
    if (!CODE_RE.test(codeParam)) {
      return json({ success: false, error: 'Kode lead tidak valid' }, 400);
    }
    const r = await pool.query(
      `SELECT l.id, l.tracking_code, l.assigned_to, l.nama, l.wa_profile_name, l.hp, l.wa_phone, l.whatsapp_phone_e164,
              l.produk, l.requested_quantity_pcs, l.source, l.utm_source, l.utm_medium, l.utm_campaign, l.page_url, l.referrer,
              l.created_at, l.confirmed_at,
              cls.stage, cls.produk_manual, cls.moq_manual, cls.note, cls.owner, cls.stage_changed_at,
              u_own.id AS owner_sales_id
         FROM leads l
         LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
         LEFT JOIN crm_users u_own ON lower(u_own.name) = lower(COALESCE(NULLIF(cls.owner, ''), l.assigned_to))
        WHERE l.tracking_code = $1 AND l.is_test IS NOT TRUE
        LIMIT 1`,
      [codeParam]
    );
    leadRow = r.rows[0] ?? null;
  }

  if (!leadRow) {
    return json({ success: false, error: 'Lead tidak ditemukan' }, 404);
  }

  const effectiveOwnerName = leadRow.owner || leadRow.assigned_to || null;
  const effectiveOwnerId = leadRow.owner_sales_id ? Number(leadRow.owner_sales_id) : null;

  if (!canReadLead(user, effectiveOwnerName, effectiveOwnerId)) {
    return json({ success: false, error: 'Anda tidak memiliki akses ke lead milik sales lain' }, 403);
  }

  const historyRes = await pool.query(
    `SELECT from_stage, to_stage, changed_by, changed_at
       FROM crm_stage_history
      WHERE tracking_code = $1
      ORDER BY changed_at DESC
      LIMIT 50`,
    [leadRow.tracking_code]
  );

  return json({
    success: true,
    lead: {
      id: Number(leadRow.id),
      tracking_code: leadRow.tracking_code,
      name: leadRow.nama || leadRow.wa_profile_name || null,
      phone: leadRow.whatsapp_phone_e164 || leadRow.wa_phone || leadRow.hp || null,
      assigned_to: effectiveOwnerName,
      owner_sales_id: effectiveOwnerId,
      stage: leadRow.stage || 'traffic',
      produk: leadRow.produk_manual || leadRow.produk || null,
      moq: leadRow.moq_manual ?? leadRow.requested_quantity_pcs ?? null,
      note: leadRow.note || null,
      source: leadRow.source || null,
      utm_campaign: leadRow.utm_campaign || null,
      page_url: leadRow.page_url || null,
      referrer: leadRow.referrer || null,
      created_at: leadRow.created_at,
      stage_changed_at: leadRow.stage_changed_at,
    },
    history: historyRes.rows,
  });
}

/**
 * PATCH /api/crm/lead
 * Ubah isian CRM satu lead: Produk, MOQ, catatan, tahap pipeline, dan (khusus Admin) pindah sales pemilik.
 *
 * Izin DITENTUKAN SERVER dari database:
 *  - Admin boleh mengubah semua lead dan memindahkan lead antar sales (`owner` / `owner_sales_id`).
 *  - Busdev HANYA boleh mengubah lead dengan `owner_sales_id = user.id` (atau `assigned_to = user.name`),
 *    dan TIDAK boleh memindahkan lead ke sales lain.
 */
export async function PATCH(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;
  const isAdmin = isAdminRole(user.role);

  const body = await req.json().catch(() => null);
  let codesIn: unknown = body?.codes;
  if (!codesIn && typeof body?.code === 'string') codesIn = [body.code];

  const pool = getMonitorPool();

  // Mendukung pemanggilan via { id: number } maupun { codes: string[] }
  if ((!Array.isArray(codesIn) || codesIn.length === 0) && body?.id !== undefined) {
    const idNum = parseInt(String(body.id), 10);
    if (!Number.isInteger(idNum) || idNum <= 0) return json({ success: false, error: 'ID lead tidak valid' }, 400);
    const r = await pool.query(`SELECT tracking_code FROM leads WHERE id = $1 AND is_test IS NOT TRUE`, [idNum]);
    if (!r.rowCount) return json({ success: false, error: 'Lead tidak ditemukan' }, 404);
    codesIn = [r.rows[0].tracking_code];
  }

  if (!Array.isArray(codesIn) || codesIn.length === 0 || codesIn.length > 30) {
    return json({ success: false, error: 'Kode lead tidak valid' }, 400);
  }
  const codes = [...new Set(codesIn.map((c) => String(c).trim()))];
  if (!codes.every((c) => CODE_RE.test(c))) return json({ success: false, error: 'Kode lead tidak valid' }, 400);

  // ---- validasi isian
  const has = (k: string) => body && Object.prototype.hasOwnProperty.call(body, k);
  const patch: {
    produk?: string | null;
    moq?: number | null;
    note?: string | null;
    stage?: string;
    newOwnerName?: string;
    newOwnerId?: number;
  } = {};

  if (has('owner_sales_id') || has('sales') || has('assigned_to')) {
    if (!isAdmin) {
      return json({ success: false, error: 'Hanya Admin yang boleh memindahkan lead antar sales' }, 403);
    }
    const targetSales = body.owner_sales_id ?? body.sales ?? body.assigned_to;
    const uRes = await pool.query(
      typeof targetSales === 'number' || /^\d+$/.test(String(targetSales))
        ? `SELECT id, name FROM crm_users WHERE id = $1 AND is_active = TRUE`
        : `SELECT id, name FROM crm_users WHERE lower(name) = lower($1) AND is_active = TRUE`,
      [targetSales]
    );
    if (!uRes.rowCount) {
      return json({ success: false, error: 'Sales tujuan tidak ditemukan atau nonaktif' }, 400);
    }
    patch.newOwnerId = Number(uRes.rows[0].id);
    patch.newOwnerName = uRes.rows[0].name;
  }

  if (has('produk_manual')) {
    const v = body.produk_manual;
    if (v === null || v === '') patch.produk = null;
    else if (typeof v === 'string' && v.trim().length <= PRODUK_MAX) patch.produk = v.trim();
    else return json({ success: false, error: `Produk maksimal ${PRODUK_MAX} karakter` }, 400);
  }
  if (has('moq_manual')) {
    const v = body.moq_manual;
    if (v === null || v === '') patch.moq = null;
    else {
      const n = typeof v === 'number' ? v : parseInt(String(v).replace(/[^\d]/g, ''), 10);
      if (!Number.isInteger(n) || n < 0 || n > MOQ_MAX) return json({ success: false, error: 'MOQ harus angka pcs yang wajar' }, 400);
      patch.moq = n;
    }
  }
  if (has('note')) {
    const v = body.note;
    if (v === null || v === '') patch.note = null;
    else if (typeof v === 'string' && v.trim().length <= NOTE_MAX) patch.note = v.trim();
    else return json({ success: false, error: `Catatan maksimal ${NOTE_MAX} karakter` }, 400);
  }
  if (has('stage')) {
    if (!isStage(body.stage)) return json({ success: false, error: 'Tahap tidak dikenal' }, 400);
    patch.stage = body.stage;
  }
  if (Object.keys(patch).length === 0) return json({ success: false, error: 'Tidak ada yang diubah' }, 400);

  // ---- kepemilikan (wajib dicek di server sebelum mutasi)
  const own = await pool.query(
    `SELECT l.tracking_code, l.assigned_to, cls.owner, u_own.id AS owner_sales_id
       FROM leads l
       LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
       LEFT JOIN crm_users u_own ON lower(u_own.name) = lower(COALESCE(NULLIF(cls.owner, ''), l.assigned_to))
      WHERE l.tracking_code = ANY($1::text[]) AND l.is_test IS NOT TRUE`,
    [codes]
  );
  if (own.rowCount !== codes.length) return json({ success: false, error: 'Lead tidak ditemukan' }, 404);

  if (
    !own.rows.every((r) =>
      canEditLead(user, r.owner || r.assigned_to, r.owner_sales_id ? Number(r.owner_sales_id) : null)
    )
  ) {
    return json({ success: false, error: 'Anda hanya bisa mengubah lead milik Anda sendiri' }, 403);
  }

  const owners = [...new Set(own.rows.map((r) => (r.owner || r.assigned_to || '').trim().toLowerCase()))];
  const ownerName = patch.newOwnerName ?? (owners.length === 1 ? own.rows[0].owner || own.rows[0].assigned_to : null);
  const ownerSalesId =
    patch.newOwnerId ??
    (own.rows[0]?.owner_sales_id ? Number(own.rows[0].owner_sales_id) : !isAdmin ? user.id : null);

  try {
    await withCrmRls(pool, user, async (client) => {
      const existing = await client.query(
        `SELECT tracking_code, stage FROM crm_lead_state WHERE tracking_code = ANY($1::text[]) FOR UPDATE`,
        [codes]
      );
      const prevStage = new Map<string, string>(existing.rows.map((r) => [r.tracking_code, r.stage]));

      // Cek apakah kolom owner_sales_id sudah ada di crm_lead_state (kompatibel sebelum & sesudah migrasi 00032)
      const colCheck = await client.query(
        `SELECT 1 FROM information_schema.columns WHERE table_name = 'crm_lead_state' AND column_name = 'owner_sales_id'`
      );
      const hasOwnerSalesIdCol = (colCheck.rowCount ?? 0) > 0;

      for (const code of codes) {
        const before = prevStage.get(code) ?? 'traffic';
        const stageChanged = patch.stage !== undefined && patch.stage !== before;
        if (hasOwnerSalesIdCol) {
          await client.query(
            `INSERT INTO crm_lead_state (tracking_code, stage, produk_manual, moq_manual, note, owner, owner_sales_id, stage_changed_at, updated_by, updated_at)
             VALUES ($1, COALESCE($2, 'traffic'), $3, $4, $5, $6, $12, CASE WHEN $7 THEN NOW() END, $8, NOW())
             ON CONFLICT (tracking_code) DO UPDATE SET
               stage            = COALESCE($2, crm_lead_state.stage),
               produk_manual    = CASE WHEN $9  THEN $3 ELSE crm_lead_state.produk_manual END,
               moq_manual       = CASE WHEN $10 THEN $4 ELSE crm_lead_state.moq_manual END,
               note             = CASE WHEN $11 THEN $5 ELSE crm_lead_state.note END,
               owner            = COALESCE($6, crm_lead_state.owner),
               owner_sales_id   = COALESCE($12, crm_lead_state.owner_sales_id),
               stage_changed_at = CASE WHEN $7 THEN NOW() ELSE crm_lead_state.stage_changed_at END,
               updated_by       = $8,
               updated_at       = NOW()`,
            [
              code,
              patch.stage ?? null,
              patch.produk ?? null,
              patch.moq ?? null,
              patch.note ?? null,
              ownerName,
              stageChanged,
              user.name,
              patch.produk !== undefined,
              patch.moq !== undefined,
              patch.note !== undefined,
              ownerSalesId,
            ]
          );
        } else {
          await client.query(
            `INSERT INTO crm_lead_state (tracking_code, stage, produk_manual, moq_manual, note, owner, stage_changed_at, updated_by, updated_at)
             VALUES ($1, COALESCE($2, 'traffic'), $3, $4, $5, $6, CASE WHEN $7 THEN NOW() END, $8, NOW())
             ON CONFLICT (tracking_code) DO UPDATE SET
               stage            = COALESCE($2, crm_lead_state.stage),
               produk_manual    = CASE WHEN $9  THEN $3 ELSE crm_lead_state.produk_manual END,
               moq_manual       = CASE WHEN $10 THEN $4 ELSE crm_lead_state.moq_manual END,
               note             = CASE WHEN $11 THEN $5 ELSE crm_lead_state.note END,
               owner            = COALESCE($6, crm_lead_state.owner),
               stage_changed_at = CASE WHEN $7 THEN NOW() ELSE crm_lead_state.stage_changed_at END,
               updated_by       = $8,
               updated_at       = NOW()`,
            [
              code,
              patch.stage ?? null,
              patch.produk ?? null,
              patch.moq ?? null,
              patch.note ?? null,
              ownerName,
              stageChanged,
              user.name,
              patch.produk !== undefined,
              patch.moq !== undefined,
              patch.note !== undefined,
            ]
          );
        }

        if (patch.newOwnerName) {
          await client.query(`UPDATE leads SET assigned_to = $2 WHERE tracking_code = $1`, [code, patch.newOwnerName]);
        }

        if (stageChanged) {
          await client.query(
            `INSERT INTO crm_stage_history (tracking_code, from_stage, to_stage, changed_by) VALUES ($1, $2, $3, $4)`,
            [code, before, patch.stage, user.name]
          );
        }
      }
    });
  } catch (e: any) {
    console.error('[crm/lead] gagal menyimpan:', e?.message);
    return json({ success: false, error: 'Gagal menyimpan, coba lagi' }, 500);
  }

  return json({ success: true });
}
