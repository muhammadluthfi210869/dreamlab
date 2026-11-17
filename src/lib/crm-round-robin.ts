import type { Pool, PoolClient } from 'pg';

export interface RoundRobinSalesRow {
  id: number;
  name: string;
  wa_number: string | null;
  role: string;
  is_active: boolean;
  off_reason: string | null;
  rr_order: number;
  deleted_at: string | Date | null;
}

export interface PickNextResult {
  sales: RoundRobinSalesRow | null;
  skippedSales: string[];
  queued: boolean;
}

/**
 * Fungsi murni (pure) untuk memilih sales berikutnya setelah `lastSalesId`.
 * Melewati sales yang OFF (`is_active = false`) dan mencatat daftar `skippedSales`.
 * Jika semua sales OFF / tidak ada yang aktif, mengembalikan `queued: true, sales: null`.
 */
export function pickNextRoundRobinSales(
  salesList: RoundRobinSalesRow[],
  lastSalesId: number | null
): PickNextResult {
  const ordered = salesList
    .filter((s) => s.role === 'busdev' && !s.deleted_at)
    .sort((a, b) => a.rr_order - b.rr_order || a.id - b.id);

  if (ordered.length === 0) {
    return { sales: null, skippedSales: [], queued: true };
  }

  const lastIdx = lastSalesId !== null ? ordered.findIndex((s) => Number(s.id) === Number(lastSalesId)) : -1;
  const skippedSales: string[] = [];

  for (let step = 1; step <= ordered.length; step++) {
    const idx = (lastIdx + step) % ordered.length;
    const candidate = ordered[idx];
    if (candidate.is_active) {
      return { sales: candidate, skippedSales, queued: false };
    }
    skippedSales.push(candidate.name);
  }

  return { sales: null, skippedSales, queued: true };
}

export function normalizePhoneE164Digits(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  else if (digits.startsWith('8')) digits = '62' + digits;
  return digits.length >= 8 ? digits : null;
}

export interface AssignNextOpts {
  leadId?: number | null;
  trackingCode?: string | null;
  phone?: string | null;
  leadName?: string | null;
  source?: string | null;
  forceMethod?: 'round_robin' | 'sticky' | 'manual';
}

export interface AssignNextResult {
  sales: RoundRobinSalesRow | null;
  method: 'round_robin' | 'sticky' | 'queue' | 'manual';
  skippedSales: string[];
  queued: boolean;
}

/**
 * Menjalankan pembagian lead dalam transaksi menggunakan `SELECT ... FOR UPDATE` pada `rr_state`
 * agar dua lead yang masuk pada detik yang sama tidak pernah jatuh ke sales yang sama.
 */
export async function assignNextSalesTx(
  client: PoolClient,
  opts: AssignNextOpts = {}
): Promise<AssignNextResult> {
  const stateRes = await client.query(
    `SELECT last_sales_id, sticky_enabled
       FROM rr_state
      WHERE id = 1
      FOR UPDATE`
  );
  const lastSalesId = stateRes.rows[0]?.last_sales_id ? Number(stateRes.rows[0].last_sales_id) : null;
  const stickyEnabled = stateRes.rows[0]?.sticky_enabled !== false;

  const salesRes = await client.query(
    `SELECT id, name, wa_number, role, is_active, off_reason, rr_order, deleted_at
       FROM sales
      WHERE role = 'busdev' AND deleted_at IS NULL
      ORDER BY rr_order ASC, id ASC`
  );
  const allBusdevs: RoundRobinSalesRow[] = salesRes.rows.map((r: any) => ({
    ...r,
    id: Number(r.id),
    rr_order: Number(r.rr_order || 0),
  }));

  const normPhone = normalizePhoneE164Digits(opts.phone);

  // 1. Cek Sticky Owner jika diaktifkan dan ada nomor WA
  if (stickyEnabled && normPhone && opts.forceMethod !== 'round_robin') {
    const withPlus = '+' + normPhone;
    const stickyLead = await client.query(
      `SELECT COALESCE(NULLIF(cls.owner, ''), l.assigned_to) AS owner_name
         FROM leads l
         LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
        WHERE l.is_test IS NOT TRUE
          AND (l.whatsapp_phone_e164 IN ($1, $2) OR l.wa_phone IN ($1, $2) OR l.hp IN ($1, $2))
          AND COALESCE(NULLIF(cls.owner, ''), l.assigned_to) IS NOT NULL
          AND COALESCE(NULLIF(cls.owner, ''), l.assigned_to) <> 'Unassigned'
        ORDER BY l.confirmed_at DESC NULLS LAST, l.created_at DESC
        LIMIT 1`,
      [normPhone, withPlus]
    );

    let stickyOwnerName: string | null = stickyLead.rows[0]?.owner_name || null;

    if (!stickyOwnerName) {
      const pa = await client
        .query(`SELECT assigned_to FROM phone_assignments WHERE phone = $1 OR phone = $2 LIMIT 1`, [normPhone, withPlus])
        .catch(() => ({ rows: [] as any[] }));
      stickyOwnerName = pa.rows[0]?.assigned_to || null;
    }

    if (stickyOwnerName) {
      const activeMatch = allBusdevs.find(
        (s) => s.name.toLowerCase() === stickyOwnerName!.toLowerCase() && s.is_active
      );
      if (activeMatch) {
        await client.query(
          `INSERT INTO crm_lead_assignments (lead_id, sales_id, sales_name, tracking_code, lead_name, customer_phone, source, method, skipped_sales)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'sticky', '{}')`,
          [
            opts.leadId ?? null,
            activeMatch.id,
            activeMatch.name,
            opts.trackingCode ?? null,
            opts.leadName ?? null,
            normPhone,
            opts.source ?? null,
          ]
        );
        return { sales: activeMatch, method: 'sticky', skippedSales: [], queued: false };
      }
    }
  }

  // 2. Pilih giliran Round Robin berikutnya
  const picked = pickNextRoundRobinSales(allBusdevs, lastSalesId);

  if (picked.queued || !picked.sales) {
    await client.query(
      `INSERT INTO crm_lead_assignments (lead_id, sales_id, sales_name, tracking_code, lead_name, customer_phone, source, method, skipped_sales)
       VALUES ($1, NULL, 'Antrean', $2, $3, $4, $5, 'queue', $6)`,
      [
        opts.leadId ?? null,
        opts.trackingCode ?? null,
        opts.leadName ?? null,
        normPhone,
        opts.source ?? null,
        picked.skippedSales,
      ]
    );
    return { sales: null, method: 'queue', skippedSales: picked.skippedSales, queued: true };
  }

  await client.query(
    `UPDATE rr_state SET last_sales_id = $1, updated_at = NOW() WHERE id = 1`,
    [picked.sales.id]
  );

  await client.query(
    `INSERT INTO crm_lead_assignments (lead_id, sales_id, sales_name, tracking_code, lead_name, customer_phone, source, method, skipped_sales)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'round_robin', $8)`,
    [
      opts.leadId ?? null,
      picked.sales.id,
      picked.sales.name,
      opts.trackingCode ?? null,
      opts.leadName ?? null,
      normPhone,
      opts.source ?? null,
      picked.skippedSales,
    ]
  );

  return {
    sales: picked.sales,
    method: 'round_robin',
    skippedSales: picked.skippedSales,
    queued: false,
  };
}

/**
 * Saat ada sales berubah menjadi ON, bagi otomatis lead yang masih berada di antrean.
 */
export async function drainQueuedLeadsTx(client: PoolClient): Promise<number> {
  const queuedLeads = await client.query(
    `SELECT l.tracking_code, l.nama, l.wa_profile_name,
            COALESCE(NULLIF(l.whatsapp_phone_e164, ''), NULLIF(l.wa_phone, ''), NULLIF(l.hp, '')) AS phone,
            l.source
       FROM leads l
       LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
      WHERE l.is_test IS NOT TRUE
        AND (l.assigned_to IS NULL OR l.assigned_to IN ('Antrean', 'Unassigned', ''))
        AND COALESCE(cls.stage, 'lead_masuk') NOT IN ('deal', 'lost')
      ORDER BY l.created_at ASC
      LIMIT 100`
  );

  let count = 0;
  for (const row of queuedLeads.rows) {
    const res = await assignNextSalesTx(client, {
      trackingCode: row.tracking_code,
      phone: row.phone,
      leadName: row.nama || row.wa_profile_name || null,
      source: row.source || null,
    });
    if (!res.queued && res.sales) {
      await client.query(`UPDATE leads SET assigned_to = $2 WHERE tracking_code = $1`, [
        row.tracking_code,
        res.sales.name,
      ]);
      await client.query(
        `INSERT INTO crm_lead_state (tracking_code, owner, owner_sales_id, updated_by, updated_at)
         VALUES ($1, $2, $3, 'auto_queue', NOW())
         ON CONFLICT (tracking_code) DO UPDATE SET
           owner = EXCLUDED.owner,
           owner_sales_id = EXCLUDED.owner_sales_id,
           updated_by = 'auto_queue',
           updated_at = NOW()`,
        [row.tracking_code, res.sales.name, res.sales.id]
      );
      count++;
    }
  }
  return count;
}

export async function getNextRoundRobinPreview(pool: Pool): Promise<{
  nextSalesId: number | null;
  nextSalesName: string | null;
  stickyEnabled: boolean;
  lastSalesId: number | null;
}> {
  const [stateRes, salesRes] = await Promise.all([
    pool.query(`SELECT last_sales_id, sticky_enabled FROM rr_state WHERE id = 1`),
    pool.query(
      `SELECT id, name, wa_number, role, is_active, off_reason, rr_order, deleted_at
         FROM sales
        WHERE role = 'busdev' AND deleted_at IS NULL
        ORDER BY rr_order ASC, id ASC`
    ),
  ]);
  const lastSalesId = stateRes.rows[0]?.last_sales_id ? Number(stateRes.rows[0].last_sales_id) : null;
  const stickyEnabled = stateRes.rows[0]?.sticky_enabled !== false;
  const allBusdevs: RoundRobinSalesRow[] = salesRes.rows.map((r: any) => ({
    ...r,
    id: Number(r.id),
    rr_order: Number(r.rr_order || 0),
  }));
  const picked = pickNextRoundRobinSales(allBusdevs, lastSalesId);
  return {
    nextSalesId: picked.sales?.id ?? null,
    nextSalesName: picked.sales?.name ?? null,
    stickyEnabled,
    lastSalesId,
  };
}
