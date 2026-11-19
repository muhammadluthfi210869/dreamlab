/**
 * Otomasi pindah ke Warm (tugas Web Developer Dreamlab #2.3, tenggat 23 Nov 2026).
 *
 * Aturan (dikonfirmasi pemilik 2026-11-19):
 *  - "5 percakapan" = 5 PESAN DUA ARAH: pesan masuk dari lead DAN pesan keluar dari sales dihitung bersama
 *    (crm_chat_messages, sender_type customer/busdev, untuk nomor yang sama). Pesan sistem/salesbot tidak dihitung.
 *  - Hanya lead di tahap traffic / cold (atau belum punya tahap) yang dipindah. Tahap yang lebih jauh
 *    (warm_*, hot, sample, deal) TIDAK pernah kembali ke Warm; tahap manual lain (loker, tidak_jelas) tidak disentuh.
 *  - Pilihan tahap Warm dari MOQ (isian manual, atau jumlah yang diminta di form): MOQ <= 500 atau belum diketahui
 *    -> warm_500 ("Warm under 500"); 501..999 -> warm_up_500 ("Warm up 500"); >= 1000 -> warm_1000.
 *    (ASUMSI, belum dikonfirmasi atasan; ubah di warmStageForMoq bila aturan berbeda.)
 *
 * Fungsi keputusan murni (tanpa I/O) supaya mudah dites; `applyAutoWarm` dibungkus try/catch oleh pemanggil
 * sehingga kegagalan otomasi tidak pernah menggagalkan penerimaan pesan.
 */
import type { Pool } from 'pg';

export const AUTO_WARM_MIN_MESSAGES = 5;
/** @deprecated nama lama (dulu hanya pesan masuk); dipertahankan agar impor lama tidak rusak. */
export const AUTO_WARM_MIN_INBOUND = AUTO_WARM_MIN_MESSAGES;
const ELIGIBLE_FROM = new Set(['traffic', 'cold', 'lead_masuk']);
const ACTOR = 'sistem (otomasi Warm)';

export type WarmStage = 'warm_500' | 'warm_up_500' | 'warm_1000';

export function warmStageForMoq(moq: number | null | undefined): WarmStage {
  if (typeof moq !== 'number' || !Number.isFinite(moq) || moq <= 500) return 'warm_500';
  if (moq < 1000) return 'warm_up_500';
  return 'warm_1000';
}

export function decideAutoWarm(input: {
  currentStage: string | null | undefined;
  /** Jumlah pesan dua arah (masuk + keluar). Nama `inboundCount` dipertahankan demi kompatibilitas pemanggil lama. */
  inboundCount?: number;
  messageCount?: number;
  moq: number | null | undefined;
}): WarmStage | null {
  const stage = input.currentStage || 'traffic';
  if (!ELIGIBLE_FROM.has(stage)) return null;
  const n = input.messageCount ?? input.inboundCount ?? 0;
  if (!(n >= AUTO_WARM_MIN_MESSAGES)) return null;
  return warmStageForMoq(input.moq);
}

/**
 * Hitung pesan dua arah nomor ini; bila memenuhi syarat, pindahkan lead terkonfirmasi (terbaru) ke Warm dan catat riwayat.
 * Mengembalikan tahap tujuan bila dipindah, selain itu null.
 */
export async function applyAutoWarm(pool: Pool, normalizedPhone: string): Promise<WarmStage | null> {
  if (!normalizedPhone || normalizedPhone.length < 9) return null;
  const cnt = await pool.query(
    `SELECT COUNT(*)::int AS n FROM crm_chat_messages WHERE phone = $1 AND sender_type IN ('customer', 'busdev')`,
    [normalizedPhone]
  );
  const messageCount: number = cnt.rows[0]?.n ?? 0;
  if (messageCount < AUTO_WARM_MIN_MESSAGES) return null;

  const lead = await pool.query(
    `SELECT tracking_code, requested_quantity_pcs
       FROM leads
      WHERE (wa_phone = $1 OR hp = $1 OR whatsapp_phone_e164 = $1 OR regexp_replace(COALESCE(hp, ''), '^0', '62') = $1)
        AND status = 'confirmed' AND is_test IS NOT TRUE
      ORDER BY id DESC LIMIT 1`,
    [normalizedPhone]
  );
  const code: string | undefined = lead.rows[0]?.tracking_code;
  if (!code) return null;
  const formQty = Number(lead.rows[0]?.requested_quantity_pcs);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const st = await client.query(`SELECT stage, moq_manual FROM crm_lead_state WHERE tracking_code = $1 FOR UPDATE`, [code]);
    const current: string | null = st.rows[0]?.stage ?? null;
    const moq = st.rows[0]?.moq_manual ?? (Number.isFinite(formQty) && formQty > 0 ? formQty : null);
    const target = decideAutoWarm({ currentStage: current, messageCount, moq });
    if (!target) {
      await client.query('ROLLBACK');
      return null;
    }
    await client.query(
      `INSERT INTO crm_lead_state (tracking_code, stage, stage_changed_at, updated_by, updated_at)
       VALUES ($1, $2, NOW(), $3, NOW())
       ON CONFLICT (tracking_code) DO UPDATE SET stage = $2, stage_changed_at = NOW(), updated_by = $3, updated_at = NOW()`,
      [code, target, ACTOR]
    );
    await client.query(
      `INSERT INTO crm_stage_history (tracking_code, from_stage, to_stage, changed_by) VALUES ($1, $2, $3, $4)`,
      [code, current ?? 'traffic', target, ACTOR]
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
