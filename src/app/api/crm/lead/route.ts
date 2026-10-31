import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { canEditLead, isStage, MOQ_MAX, NOTE_MAX, PRODUK_MAX } from '@/lib/crm-stages';

export const dynamic = 'force-dynamic';

const CODE_RE = /^[A-Za-z0-9_.:\-]{3,80}$/;

/**
 * Ubah isian CRM satu lead: Produk, MOQ, catatan, dan/atau tahap pipeline.
 *
 * Body: { codes: string[], produk_manual?, moq_manual?, note?, stage? }
 *  - `codes` = kode klik prospek ini (baris utama + baris gabungan 24 jam), supaya semuanya konsisten.
 *  - Hanya field yang dikirim yang diubah; nilai kosong ("" / null) menghapus isian manual.
 *
 * Izin DITENTUKAN SERVER dari tabel leads (bukan dari klaim klien): Head boleh semua; sales hanya lead yang
 * `assigned_to`-nya nama dirinya. Perubahan tahap dicatat di crm_stage_history.
 */
export async function PATCH(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  const body = await req.json().catch(() => null);
  const codesIn: unknown = body?.codes;
  if (!Array.isArray(codesIn) || codesIn.length === 0 || codesIn.length > 30) return json({ success: false, error: 'Kode lead tidak valid' }, 400);
  const codes = [...new Set(codesIn.map((c) => String(c).trim()))];
  if (!codes.every((c) => CODE_RE.test(c))) return json({ success: false, error: 'Kode lead tidak valid' }, 400);

  // ---- validasi isian
  const has = (k: string) => body && Object.prototype.hasOwnProperty.call(body, k);
  const patch: { produk?: string | null; moq?: number | null; note?: string | null; stage?: string } = {};
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

  const pool = getMonitorPool();
  // ---- kepemilikan
  const own = await pool.query(`SELECT tracking_code, assigned_to FROM leads WHERE tracking_code = ANY($1::text[]) AND is_test IS NOT TRUE`, [codes]);
  if (own.rowCount !== codes.length) return json({ success: false, error: 'Lead tidak ditemukan' }, 404);
  const owners = [...new Set(own.rows.map((r) => (r.assigned_to || '').trim().toLowerCase()))];
  if (!own.rows.every((r) => canEditLead(user, r.assigned_to))) {
    return json({ success: false, error: 'Anda hanya bisa mengubah lead milik Anda sendiri' }, 403);
  }
  const ownerName = owners.length === 1 ? own.rows[0].assigned_to : null;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(`SELECT tracking_code, stage FROM crm_lead_state WHERE tracking_code = ANY($1::text[]) FOR UPDATE`, [codes]);
    const prevStage = new Map<string, string>(existing.rows.map((r) => [r.tracking_code, r.stage]));

    for (const code of codes) {
      const before = prevStage.get(code) ?? 'traffic';
      const stageChanged = patch.stage !== undefined && patch.stage !== before;
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
      if (stageChanged) {
        await client.query(`INSERT INTO crm_stage_history (tracking_code, from_stage, to_stage, changed_by) VALUES ($1, $2, $3, $4)`, [code, before, patch.stage, user.name]);
      }
    }
    await client.query('COMMIT');
  } catch (e: any) {
    await client.query('ROLLBACK').catch(() => undefined);
    console.error('[crm/lead] gagal menyimpan:', e?.message);
    return json({ success: false, error: 'Gagal menyimpan, coba lagi' }, 500);
  } finally {
    client.release();
  }
  return json({ success: true });
}
