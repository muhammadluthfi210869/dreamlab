import type { Pool } from 'pg';
import { getWarmStageMoq, normalizeStage, resolveTrafficStageByMoq } from '@/lib/crm-stages';

/**
 * Pemuatan data bersama untuk endpoint Lead Monitor / CRM (stats, pipeline).
 */

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

export interface CrmAnnotated {
  tracking_code: string;
  merged_tracking_codes?: string[];
  crm_stage?: string;
  has_manual_stage?: boolean;
  produk_manual?: string | null;
  moq_manual?: number | null;
  moq_label?: string | null;
  brand?: string | null;
  source_manual?: string | null;
  lost_reason?: string | null;
  stage_changed_at?: string | null;
  owner_override?: string | null;
  note?: string | null;
  [key: string]: any;
}

/**
 * Menempelkan isian CRM (tahap + Produk/MOQ/Brand/Source/Alasan Lost/catatan manual) ke prospek.
 * Satu prospek bisa gabungan beberapa kode klik; yang dipakai adalah isian yang terakhir diubah.
 * Bila belum ada perubahan tahap manual, otomatis diklasifikasikan ke stage yang sesuai berdasarkan MOQ.
 */
export async function attachCrmState(pool: Pool, leads: CrmAnnotated[]): Promise<void> {
  const allCodes = leads.flatMap((l) => [l.tracking_code, ...(l.merged_tracking_codes ?? [])]).filter(Boolean);
  if (!allCodes.length) return;

  let stRows: any[] = [];
  try {
    const st = await pool.query(
      `SELECT tracking_code, stage, produk_manual, moq_manual, note, owner, stage_changed_at, updated_at,
              brand, moq_label, source_manual, lost_reason
         FROM crm_lead_state
        WHERE tracking_code = ANY($1::text[])`,
      [allCodes]
    );
    stRows = st.rows;
  } catch {
    // Fallback jika migrasi 00033 belum dijalankan di DB
    const st = await pool
      .query(
        `SELECT tracking_code, stage, produk_manual, moq_manual, note, owner, stage_changed_at, updated_at
           FROM crm_lead_state
          WHERE tracking_code = ANY($1::text[])`,
        [allCodes]
      )
      .catch(() => ({ rows: [] as any[] }));
    stRows = st.rows;
  }

  const byCode = new Map<string, any>(stRows.map((r: any) => [r.tracking_code, r]));
  for (const l of leads) {
    let best: any = null;
    for (const c of [l.tracking_code, ...(l.merged_tracking_codes ?? [])]) {
      const r = byCode.get(c);
      if (r && (!best || new Date(r.updated_at) > new Date(best.updated_at))) best = r;
    }
    l.produk_manual = best?.produk_manual ?? null;
    l.moq_manual = best?.moq_manual ?? null;
    l.brand = best?.brand ?? null;
    l.source_manual = best?.source_manual ?? null;
    l.lost_reason = best?.lost_reason ?? null;
    l.stage_changed_at = best?.stage_changed_at ?? l.created_at ?? null;
    l.owner_override = best?.owner ?? null;
    if (best?.owner) {
      l.assigned_to = best.owner;
    }
    l.note = best?.note ?? null;
    l.has_manual_stage = !!best?.stage;

    if (best?.stage) {
      l.crm_stage = normalizeStage(best.stage);
    } else {
      const rawMoq = typeof l.moq_manual === 'number' ? l.moq_manual : (l.requested_quantity_pcs ?? null);
      l.crm_stage = resolveTrafficStageByMoq(rawMoq);
    }

    const warmMoq = getWarmStageMoq(l.crm_stage);
    l.moq_label =
      best?.moq_label ??
      (warmMoq ? warmMoq.label : typeof l.moq_manual === 'number' ? String(l.moq_manual) : l.requested_quantity_pcs ? String(l.requested_quantity_pcs) : null);
  }
}
