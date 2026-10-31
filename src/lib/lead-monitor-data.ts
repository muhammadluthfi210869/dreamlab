import type { Pool } from 'pg';

/**
 * Pemuatan data bersama untuk endpoint Lead Monitor / CRM (stats, pipeline).
 */

// Kolom hasil form kualifikasi (migrasi 00022 & 00023). Belum tentu sudah ada di database live,
// jadi dideteksi dulu; kalau belum ada dikembalikan NULL.
export const QUALIFICATION_COLUMNS: Record<string, string> = {
  production_tier_name: 'text',
  requested_quantity_pcs: 'int',
  inquiry_reference: 'text',
  phone_country_iso2: 'text',
  whatsapp_phone_e164: 'text',
};

let columnCache: { at: number; cols: Set<string> } | null = null;
const COLUMN_CACHE_MS = 60_000;

export async function getLeadColumns(pool: Pool): Promise<Set<string>> {
  if (columnCache && Date.now() - columnCache.at < COLUMN_CACHE_MS) return columnCache.cols;
  const res = await pool.query(
    `SELECT column_name FROM information_schema.columns
      WHERE table_name = 'leads' AND table_schema = current_schema()`
  );
  const cols = new Set<string>(res.rows.map((r) => r.column_name));
  columnCache = { at: Date.now(), cols };
  return cols;
}

export const colExpr = (cols: Set<string>, name: string): string =>
  cols.has(name) ? name : `NULL::${QUALIFICATION_COLUMNS[name]} AS ${name}`;

export const GHOST_SQL = `(wa_message ~* 'memeriksa pesan baru|legalitas sertifikasi bpom')`;

import { resolveTrafficStageByMoq } from '@/lib/crm-stages';

export interface CrmAnnotated {
  tracking_code: string;
  merged_tracking_codes?: string[];
  crm_stage?: string;
  has_manual_stage?: boolean;
  produk_manual?: string | null;
  moq_manual?: number | null;
  note?: string | null;
  [key: string]: any;
}

/**
 * Menempelkan isian CRM (tahap + Produk/MOQ/catatan manual) ke prospek. Satu prospek bisa gabungan beberapa
 * kode klik; yang dipakai adalah isian yang terakhir diubah.
 * Bila belum ada perubahan tahap manual, otomatis diklasifikasikan ke stage traffic yang sesuai berdasarkan MOQ.
 */
export async function attachCrmState(pool: Pool, leads: CrmAnnotated[]): Promise<void> {
  const allCodes = leads.flatMap((l) => [l.tracking_code, ...(l.merged_tracking_codes ?? [])]).filter(Boolean);
  const st = allCodes.length
    ? await pool
        .query(`SELECT tracking_code, stage, produk_manual, moq_manual, note, updated_at FROM crm_lead_state WHERE tracking_code = ANY($1::text[])`, [allCodes])
        .catch(() => ({ rows: [] as any[] })) // tabel baru ada setelah migrasi 00025
    : { rows: [] as any[] };
  const byCode = new Map<string, any>(st.rows.map((r: any) => [r.tracking_code, r]));
  for (const l of leads) {
    let best: any = null;
    for (const c of [l.tracking_code, ...(l.merged_tracking_codes ?? [])]) {
      const r = byCode.get(c);
      if (r && (!best || new Date(r.updated_at) > new Date(best.updated_at))) best = r;
    }
    l.produk_manual = best?.produk_manual ?? null;
    l.moq_manual = best?.moq_manual ?? null;
    l.note = best?.note ?? null;
    l.has_manual_stage = !!best?.stage;

    if (best?.stage) {
      l.crm_stage = best.stage;
    } else {
      // Hitung MOQ efektif untuk menentukan stage awal
      const rawMoq = typeof l.moq_manual === 'number' ? l.moq_manual : (l.requested_quantity_pcs ?? null);
      l.crm_stage = resolveTrafficStageByMoq(rawMoq);
    }
  }
}
