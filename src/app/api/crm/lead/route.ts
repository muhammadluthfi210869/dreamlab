import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser, withCrmRls } from '@/lib/crm-auth';
import {
  canEditLead,
  canReadLead,
  CRM_SOURCES,
  formatLandingOrigin,
  getWarmStageMoq,
  isAdminRole,
  isLostReason,
  isStage,
  LOST_REASONS,
  MOQ_MAX,
  normalizeCrmSource,
  normalizeStage,
  NOTE_MAX,
  PRODUK_MAX,
} from '@/lib/crm-stages';

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

  const baseSelect = `
    SELECT l.id, l.tracking_code, l.assigned_to, l.nama, l.wa_profile_name, l.name_source, l.name_original, l.name_updated_by, l.name_updated_at,
           l.hp, l.wa_phone, l.whatsapp_phone_e164,
           l.produk, l.requested_quantity_pcs, l.source, l.utm_source, l.utm_medium, l.utm_campaign, l.page_url, l.referrer,
           l.created_at, l.confirmed_at,
           cls.stage, cls.produk_manual, cls.moq_manual, cls.note, cls.owner, cls.stage_changed_at,
           u_own.id AS owner_sales_id
      FROM leads l
      LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
      LEFT JOIN crm_users u_own ON lower(u_own.name) = lower(COALESCE(NULLIF(cls.owner, ''), l.assigned_to))
  `;

  if (idParam) {
    const idNum = parseInt(idParam, 10);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return json({ success: false, error: 'ID lead tidak valid' }, 400);
    }
    const r = await pool.query(`${baseSelect} WHERE l.id = $1 AND l.is_test IS NOT TRUE LIMIT 1`, [idNum]);
    leadRow = r.rows[0] ?? null;
  } else if (codeParam) {
    if (!CODE_RE.test(codeParam)) {
      return json({ success: false, error: 'Kode lead tidak valid' }, 400);
    }
    const r = await pool.query(`${baseSelect} WHERE l.tracking_code = $1 AND l.is_test IS NOT TRUE LIMIT 1`, [codeParam]);
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

  // Ambil kolom tambahan Tahap 1 jika sudah ada di crm_lead_state
  let extraState: { brand?: string | null; moq_label?: string | null; source_manual?: string | null; lost_reason?: string | null } = {};
  try {
    const ext = await pool.query(
      `SELECT brand, moq_label, source_manual, lost_reason FROM crm_lead_state WHERE tracking_code = $1 LIMIT 1`,
      [leadRow.tracking_code]
    );
    if (ext.rows[0]) extraState = ext.rows[0];
  } catch {
    // abaikan jika kolom migrasi 00033 belum ditambahkan
  }

  const historyRes = await pool.query(
    `SELECT from_stage, to_stage, changed_by, changed_at
       FROM crm_stage_history
      WHERE tracking_code = $1
      ORDER BY changed_at DESC
      LIMIT 50`,
    [leadRow.tracking_code]
  );

  let auditHistory: any[] = [];
  try {
    const auditRes = await pool.query(
      `SELECT action, summary, old_value, new_value, actor, created_at
         FROM crm_lead_audit_log
        WHERE tracking_code = $1
        ORDER BY created_at DESC
        LIMIT 30`,
      [leadRow.tracking_code]
    );
    auditHistory = auditRes.rows;
  } catch {
    // abaikan jika tabel audit belum ada
  }

  const normalizedStage = normalizeStage(leadRow.stage);
  const srcInfo = normalizeCrmSource({
    source: extraState.source_manual || leadRow.source,
    utm_source: leadRow.utm_source,
    utm_medium: leadRow.utm_medium,
    utm_campaign: leadRow.utm_campaign,
    page_url: leadRow.page_url,
    referrer: leadRow.referrer,
  });
  const warmMoq = getWarmStageMoq(normalizedStage);
  const numericMoq = leadRow.moq_manual ?? leadRow.requested_quantity_pcs ?? (warmMoq ? warmMoq.numeric : null);
  const moqLabel = extraState.moq_label || (warmMoq ? warmMoq.label : numericMoq ? String(numericMoq) : null);

  return json({
    success: true,
    lead: {
      id: Number(leadRow.id),
      tracking_code: leadRow.tracking_code,
      name: leadRow.nama || leadRow.wa_profile_name || null,
      name_source: leadRow.name_source || (leadRow.nama ? 'form' : leadRow.wa_profile_name ? 'whatsapp' : null),
      name_original: leadRow.name_original || null,
      name_updated_by: leadRow.name_updated_by || null,
      name_updated_at: leadRow.name_updated_at || null,
      phone: leadRow.whatsapp_phone_e164 || leadRow.wa_phone || leadRow.hp || null,
      brand: extraState.brand ?? null,
      assigned_to: effectiveOwnerName,
      owner_sales_id: effectiveOwnerId,
      stage: normalizedStage,
      lost_reason: extraState.lost_reason ?? null,
      produk: leadRow.produk_manual || leadRow.produk || null,
      moq: numericMoq,
      moq_label: moqLabel,
      note: leadRow.note || null,
      source: srcInfo.source,
      source_raw: leadRow.source || null,
      campaign: leadRow.utm_campaign || null,
      detection_method: srcInfo.detectionMethod,
      landing_path: formatLandingOrigin(leadRow.page_url, leadRow.referrer),
      page_url: leadRow.page_url || null,
      referrer: leadRow.referrer || null,
      created_at: leadRow.created_at,
      stage_changed_at: leadRow.stage_changed_at || leadRow.created_at,
    },
    history: historyRes.rows.map((h: any) => ({
      from_stage: normalizeStage(h.from_stage),
      to_stage: normalizeStage(h.to_stage),
      changed_by: h.changed_by,
      changed_at: h.changed_at,
    })),
    audit_history: auditHistory,
  });
}

/**
 * PATCH /api/crm/lead
 * Ubah isian CRM satu lead:
 *  - stage (10 stage tetap; pindah ke Warm mengisi perkiraan MOQ otomatis; pindah ke Lost wajib alasan)
 *  - lost_reason (Harga tidak masuk | MOQ terlalu besar | Tidak respons | Pilih pabrik lain | Belum siap modal)
 *  - brand, produk_manual, moq_manual, moq_label, source (koreksi manual), note
 *  - owner_sales_id / sales (khusus Admin)
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

  const has = (k: string) => body && Object.prototype.hasOwnProperty.call(body, k);
  const patch: {
    name?: string;
    phone?: string;
    brand?: string | null;
    produk?: string | null;
    moq?: number | null;
    moqLabel?: string | null;
    sourceManual?: string | null;
    lostReason?: string | null;
    note?: string | null;
    stage?: string;
    newOwnerName?: string;
    newOwnerId?: number;
  } = {};

  if (has('name') || has('nama')) {
    const rawName = String(has('name') ? body.name ?? '' : body.nama ?? '').trim();
    if (rawName.length < 2 || rawName.length > 60) {
      return json({ success: false, error: 'Nama lead harus 2–60 karakter' }, 400);
    }
    patch.name = rawName;
  }

  if (has('phone')) {
    if (!isAdmin) {
      return json({ success: false, error: 'Hanya Admin yang boleh mengoreksi nomor WA lead' }, 403);
    }
    let digits = String(body.phone || '').replace(/\D/g, '');
    if (digits.startsWith('0')) digits = '62' + digits.slice(1);
    else if (digits.startsWith('8')) digits = '62' + digits;
    if (digits.length < 9 || digits.length > 15) {
      return json({ success: false, error: 'Nomor WhatsApp harus 9–15 digit dalam format E.164 (mis. 628123456789)' }, 400);
    }
    const dup = await pool.query(
      `SELECT id, tracking_code, nama, wa_profile_name
         FROM leads
        WHERE tracking_code <> ALL($1::text[])
          AND is_test IS NOT TRUE
          AND (whatsapp_phone_e164 IN ($2, $3) OR wa_phone IN ($2, $3) OR hp IN ($2, $3))
        LIMIT 1`,
      [codes, digits, '+' + digits]
    );
    if (dup.rowCount) {
      const d = dup.rows[0];
      return json(
        {
          success: false,
          error: `Nomor ${digits} sudah terdaftar pada lead ${d.nama || d.wa_profile_name || d.tracking_code}`,
        },
        409
      );
    }
    patch.phone = digits;
  }

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

  if (has('brand')) {
    const v = body.brand;
    if (v === null || v === '') patch.brand = null;
    else if (typeof v === 'string' && v.trim().length <= PRODUK_MAX) patch.brand = v.trim();
    else return json({ success: false, error: `Nama brand maksimal ${PRODUK_MAX} karakter` }, 400);
  }

  if (has('produk_manual') || has('product')) {
    const v = has('produk_manual') ? body.produk_manual : body.product;
    if (v === null || v === '') patch.produk = null;
    else if (typeof v === 'string' && v.trim().length <= PRODUK_MAX) patch.produk = v.trim();
    else return json({ success: false, error: `Produk maksimal ${PRODUK_MAX} karakter` }, 400);
  }

  if (has('moq_manual') || has('moq')) {
    const v = has('moq_manual') ? body.moq_manual : body.moq;
    if (v === null || v === '') {
      patch.moq = null;
      patch.moqLabel = null;
    } else if (typeof v === 'string' && ['below 500', '500', 'below 1000', '1000'].includes(v.trim())) {
      const label = v.trim();
      patch.moqLabel = label;
      patch.moq = label === 'below 500' ? 300 : label === '500' ? 500 : label === 'below 1000' ? 750 : 1000;
    } else {
      const n = typeof v === 'number' ? v : parseInt(String(v).replace(/[^\d]/g, ''), 10);
      if (!Number.isInteger(n) || n < 0 || n > MOQ_MAX) return json({ success: false, error: 'MOQ harus angka pcs yang wajar' }, 400);
      patch.moq = n;
      patch.moqLabel = String(n);
    }
  }

  if (has('source')) {
    const v = body.source;
    if (v === null || v === '') patch.sourceManual = null;
    else if (typeof v === 'string' && (CRM_SOURCES as readonly string[]).includes(v.trim())) {
      patch.sourceManual = v.trim();
    } else {
      return json({ success: false, error: 'Source tidak valid' }, 400);
    }
  }

  if (has('note')) {
    const v = body.note;
    if (v === null || v === '') patch.note = null;
    else if (typeof v === 'string' && v.trim().length <= NOTE_MAX) patch.note = v.trim();
    else return json({ success: false, error: `Catatan maksimal ${NOTE_MAX} karakter` }, 400);
  }

  if (has('lost_reason')) {
    const v = body.lost_reason;
    if (v === null || v === '') {
      patch.lostReason = null;
    } else if (isLostReason(v)) {
      patch.lostReason = v.trim();
    } else {
      return json(
        {
          success: false,
          error: `Alasan Lost wajib salah satu dari: ${LOST_REASONS.join(', ')}`,
        },
        400
      );
    }
  }

  if (has('stage')) {
    if (!isStage(body.stage)) return json({ success: false, error: 'Tahap tidak dikenal' }, 400);
    const normStage = normalizeStage(body.stage);
    patch.stage = normStage;

    // Pindah ke stage Lost WAJIB menyertakan lost_reason
    if (normStage === 'lost' && !patch.lostReason) {
      return json(
        {
          success: false,
          error: `Pindah ke stage Lost wajib memilih alasan (${LOST_REASONS.join(', ')})`,
        },
        400
      );
    }

    // Pindah ke stage Warm otomatis mengisi perkiraan MOQ (below 500, 500, below 1000, 1000)
    const warmMoq = getWarmStageMoq(normStage);
    if (warmMoq && patch.moq === undefined) {
      patch.moq = warmMoq.numeric;
      patch.moqLabel = warmMoq.label;
    }
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
      const prevStage = new Map<string, string>(existing.rows.map((r) => [r.tracking_code, normalizeStage(r.stage)]));

      const colCheck = await client.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'crm_lead_state'`
      );
      const stateCols = new Set<string>(colCheck.rows.map((r) => r.column_name));
      const hasOwnerSalesIdCol = stateCols.has('owner_sales_id');
      const hasTahap1Cols = stateCols.has('lost_reason') && stateCols.has('brand');

      for (const code of codes) {
        const before = prevStage.get(code) ?? 'lead_masuk';
        const stageChanged = patch.stage !== undefined && patch.stage !== before;

        if (hasOwnerSalesIdCol && hasTahap1Cols) {
          await client.query(
            `INSERT INTO crm_lead_state (
               tracking_code, stage, produk_manual, moq_manual, moq_label, brand, source_manual, lost_reason,
               note, owner, owner_sales_id, stage_changed_at, updated_by, updated_at
             )
             VALUES ($1, COALESCE($2, 'lead_masuk'), $3, $4, $13, $14, $15, $16, $5, $6, $12, CASE WHEN $7 THEN NOW() ELSE NOW() END, $8, NOW())
             ON CONFLICT (tracking_code) DO UPDATE SET
               stage            = COALESCE($2, crm_lead_state.stage),
               produk_manual    = CASE WHEN $9  THEN $3 ELSE crm_lead_state.produk_manual END,
               moq_manual       = CASE WHEN $10 THEN $4 ELSE crm_lead_state.moq_manual END,
               moq_label        = CASE WHEN $10 THEN $13 ELSE crm_lead_state.moq_label END,
               brand            = CASE WHEN $17 THEN $14 ELSE crm_lead_state.brand END,
               source_manual    = CASE WHEN $18 THEN $15 ELSE crm_lead_state.source_manual END,
               lost_reason      = CASE WHEN $19 THEN $16 WHEN $2 IS NOT NULL AND $2 <> 'lost' THEN NULL ELSE crm_lead_state.lost_reason END,
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
              patch.moqLabel ?? null,
              patch.brand ?? null,
              patch.sourceManual ?? null,
              patch.lostReason ?? null,
              patch.brand !== undefined,
              patch.sourceManual !== undefined,
              patch.lostReason !== undefined,
            ]
          );
        } else if (hasOwnerSalesIdCol) {
          await client.query(
            `INSERT INTO crm_lead_state (tracking_code, stage, produk_manual, moq_manual, note, owner, owner_sales_id, stage_changed_at, updated_by, updated_at)
             VALUES ($1, COALESCE($2, 'lead_masuk'), $3, $4, $5, $6, $12, CASE WHEN $7 THEN NOW() END, $8, NOW())
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
             VALUES ($1, COALESCE($2, 'lead_masuk'), $3, $4, $5, $6, CASE WHEN $7 THEN NOW() END, $8, NOW())
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

        if (patch.name !== undefined) {
          const prevRes = await client.query(
            `SELECT id, COALESCE(NULLIF(TRIM(nama), ''), NULLIF(TRIM(wa_profile_name), ''), '-') AS old_name
               FROM leads WHERE tracking_code = $1 LIMIT 1`,
            [code]
          );
          const oldName = prevRes.rows[0]?.old_name || '-';
          const leadIdVal = prevRes.rows[0]?.id ? Number(prevRes.rows[0].id) : null;
          await client.query(
            `UPDATE leads
                SET nama = $2,
                    name_source = 'manual',
                    name_original = COALESCE(name_original, NULLIF(TRIM(nama), ''), NULLIF(TRIM(wa_profile_name), ''), $2),
                    name_updated_by = $3,
                    name_updated_at = NOW()
              WHERE tracking_code = $1`,
            [code, patch.name, user.name]
          );
          if (oldName !== patch.name) {
            await client
              .query(
                `INSERT INTO crm_lead_audit_log (tracking_code, lead_id, action, summary, old_value, new_value, actor)
                 VALUES ($1, $2, 'update_name', $3, $4, $5, $6)`,
                [
                  code,
                  leadIdVal,
                  `Nama diubah dari ${oldName} menjadi ${patch.name} oleh ${user.name}`,
                  oldName,
                  patch.name,
                  user.name,
                ]
              )
              .catch(() => undefined);
          }
        }

        if (patch.phone !== undefined) {
          const prevRes = await client.query(
            `SELECT id, COALESCE(NULLIF(whatsapp_phone_e164, ''), NULLIF(wa_phone, ''), NULLIF(hp, ''), '-') AS old_phone
               FROM leads WHERE tracking_code = $1 LIMIT 1`,
            [code]
          );
          const oldPhone = prevRes.rows[0]?.old_phone || '-';
          const leadIdVal = prevRes.rows[0]?.id ? Number(prevRes.rows[0].id) : null;
          await client.query(
            `UPDATE leads
                SET whatsapp_phone_e164 = $2,
                    wa_phone = $2,
                    hp = CASE WHEN hp IS NOT NULL AND hp <> '' THEN $2 ELSE hp END
              WHERE tracking_code = $1`,
            [code, patch.phone]
          );
          if (oldPhone !== patch.phone) {
            await client
              .query(
                `INSERT INTO crm_lead_audit_log (tracking_code, lead_id, action, summary, old_value, new_value, actor)
                 VALUES ($1, $2, 'update_phone', $3, $4, $5, $6)`,
                [
                  code,
                  leadIdVal,
                  `Nomor diubah dari ${oldPhone} menjadi ${patch.phone} oleh ${user.name}`,
                  oldPhone,
                  patch.phone,
                  user.name,
                ]
              )
              .catch(() => undefined);
          }
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

  return json({
    success: true,
    name: patch.name,
    phone: patch.phone,
    stage: patch.stage,
    moq_label: patch.moqLabel,
    moq: patch.moq,
    lost_reason: patch.lostReason,
    owner: patch.newOwnerName,
  });
}
