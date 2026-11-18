/**
 * Otomasi pindah ke Warm (tugas Web Developer Dreamlab #2.3, tenggat 23 Nov 2026).
 *
 * Aturan (asumsi yang dikunci sampai pemilik mengoreksi, lihat docs di ERP: docs/plan/CR152_RENCANA_OTONOM_2026-11-19.md §3):
 *  - "5 percakapan" = 5 PESAN MASUK dari lead (direction = inbound) di crm_chat_messages untuk nomor yang sama.
 *  - Hanya lead di tahap traffic atau cold yang dipindah. Tahap yang lebih jauh (warm_*, hot, sample, deal) TIDAK pernah
 *    kembali ke Warm; tahap manual lain (loker, tidak_jelas) tidak disentuh.
 *  - Pilihan tahap Warm: MOQ <= 500 atau belum diketahui -> warm_500; 501..999 -> warm_up_500; >= 1000 -> warm_1000.
 *
 * Fungsi keputusan murni (tanpa I/O) supaya mudah dites; `applyAutoWarm` hanya menambah, dibungkus try/catch oleh pemanggil
 * sehingga kegagalan otomasi tidak pernah menggagalkan penerimaan lead.
 */
import type { Pool } from 'pg';

export const AUTO_WARM_MIN_INBOUND = 5;
const ELIGIBLE_FROM = new Set(['traffic', 'cold']);

export type WarmStage = 'warm_500' | 'warm_up_500' | 'warm_1000';

export function warmStageForMoq(moq: number | null | undefined): WarmStage {
  if (typeof moq !== 'number' || !Number.isFinite(moq) || moq <= 500) return 'warm_500';
  if (moq < 1000) return 'warm_up_500';
  return 'warm_1000';
}

export function decideAutoWarm(input: { currentStage: string | null | undefined; inboundCount: number; moq: number | null | undefined }): WarmStage | null {
  const stage = input.currentStage || 'traffic';
  if (!ELIGIBLE_FROM.has(stage)) return null;
  if (!(input.inboundCount >= AUTO_WARM_MIN_INBOUND)) return null;
  return warmStageForMoq(input.moq);
}

/**
 * Hitung pesan masuk nomor ini; bila memenuhi syarat, pindahkan lead terkonfirmasi (terbaru) ke Warm dan catat riwayat.
 * Mengembalikan tahap tujuan bila dipindah, selain itu null.
 */
export async function applyAutoWarm(pool: Pool, normalizedPhone: string): Promise<WarmStage | null> {
  if (!normalizedPhone || normalizedPhone.length < 9) return null;
  const cnt = await pool.query(
    `SELECT COUNT(*)::int AS n FROM crm_chat_messages WHERE phone = $1 AND direction = 'inbound'`,
    [normalizedPhone]
  );
  const inboundCount: number = cnt.rows[0]?.n ?? 0;
  if (inboundCount < AUTO_WARM_MIN_INBOUND) return null;

  const lead = await pool.query(
    `SELECT tracking_code FROM leads
      WHERE (wa_phone = $1 OR hp = $1) AND status = 'confirmed' AND is_test IS NOT TRUE
      ORDER BY id DESC LIMIT 1`,
    [normalizedPhone]
  );
  const code: string | undefined = lead.rows[0]?.tracking_code;
  if (!code) return null;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const st = await client.query(`SELECT stage, moq_manual FROM crm_lead_state WHERE tracking_code = $1 FOR UPDATE`, [code]);
    const current: string | null = st.rows[0]?.stage ?? null;
    const target = decideAutoWarm({ currentStage: current, inboundCount, moq: st.rows[0]?.moq_manual ?? null });
    if (!target) {
      await client.query('ROLLBACK');
      return null;
    }
    await client.query(
      `INSERT INTO crm_lead_state (tracking_code, stage, stage_changed_at, updated_by, updated_at)
       VALUES ($1, $2, NOW(), 'sistem (otomasi Warm)', NOW())
       ON CONFLICT (tracking_code) DO UPDATE SET stage = $2, stage_changed_at = NOW(), updated_by = 'sistem (otomasi Warm)', updated_at = NOW()`,
      [code, target]
    );
    await client.query(
      `INSERT INTO crm_stage_history (tracking_code, from_stage, to_stage, changed_by) VALUES ($1, $2, $3, 'sistem (otomasi Warm)')`,
      [code, current ?? 'traffic', target]
    );
    await client.query('COMMIT');
    return target;
  } catch (e) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw e;
  } finally {
    client.release();
  }
}
