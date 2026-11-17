import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import {
  drainQueuedLeadsTx,
  getNextRoundRobinPreview,
} from '@/lib/crm-round-robin';

export const dynamic = 'force-dynamic';

const OFF_REASONS = ['Cuti', 'Sakit', 'Libur', 'Off shift'] as const;

/**
 * GET /api/crm/round-robin (Admin saja)
 * Mengembalikan kartu tiap sales (status, nomor WA, total lead, hari ini, aktif, deal),
 * penanda "giliran berikutnya", sticky_enabled, serta log penugasan terbaru.
 */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req, { role: 'admin' });
  if (isAuthFailure(auth)) return auth;

  const pool = getMonitorPool();

  const [preview, salesRes, metricsRes, queueRes, logsRes] = await Promise.all([
    getNextRoundRobinPreview(pool),
    pool.query(
      `SELECT id, name, wa_number, role, is_active, off_reason, off_until, rr_order, deleted_at
         FROM sales
        WHERE role = 'busdev'
        ORDER BY (deleted_at IS NOT NULL) ASC, rr_order ASC, id ASC`
    ),
    pool.query(
      `SELECT
         lower(COALESCE(NULLIF(cls.owner, ''), l.assigned_to, '')) AS owner_key,
         COUNT(*)::int AS total_leads,
         COUNT(*) FILTER (
           WHERE (l.created_at AT TIME ZONE 'Asia/Jakarta')::date = (NOW() AT TIME ZONE 'Asia/Jakarta')::date
         )::int AS today_leads,
         COUNT(*) FILTER (
           WHERE COALESCE(cls.stage, 'lead_masuk') NOT IN ('deal', 'lost')
         )::int AS active_leads,
         COUNT(*) FILTER (
           WHERE cls.stage = 'deal'
         )::int AS deal_leads
       FROM leads l
       LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
      WHERE l.is_test IS NOT TRUE
        AND COALESCE(NULLIF(cls.owner, ''), l.assigned_to) IS NOT NULL
      GROUP BY 1`
    ),
    pool.query(
      `SELECT COUNT(*)::int AS queued_count
         FROM leads l
         LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
        WHERE l.is_test IS NOT TRUE
          AND (l.assigned_to IS NULL OR l.assigned_to IN ('Antrean', 'Unassigned', ''))
          AND COALESCE(cls.stage, 'lead_masuk') NOT IN ('deal', 'lost')`
    ),
    pool.query(
      `SELECT a.id, a.tracking_code, a.lead_name, a.customer_phone, a.source,
              COALESCE(a.sales_name, s.name, 'Antrean') AS sales_name,
              a.method, a.skipped_sales, a.assigned_at
         FROM crm_lead_assignments a
         LEFT JOIN sales s ON s.id = a.sales_id
        ORDER BY a.assigned_at DESC
        LIMIT 80`
    ),
  ]);

  const metricMap = new Map<string, any>();
  for (const m of metricsRes.rows) {
    metricMap.set(m.owner_key, m);
  }

  const cards = salesRes.rows.map((s: any) => {
    const m = metricMap.get(String(s.name).toLowerCase()) || {};
    return {
      id: Number(s.id),
      name: s.name,
      wa_number: s.wa_number,
      is_active: Boolean(s.is_active),
      off_reason: s.off_reason,
      off_until: s.off_until,
      rr_order: Number(s.rr_order || 0),
      is_archived: Boolean(s.deleted_at),
      is_next: preview.nextSalesId === Number(s.id),
      total_leads: Number(m.total_leads || 0),
      today_leads: Number(m.today_leads || 0),
      active_leads: Number(m.active_leads || 0),
      deal_leads: Number(m.deal_leads || 0),
    };
  });

  return json({
    success: true,
    sticky_enabled: preview.stickyEnabled,
    next_sales_id: preview.nextSalesId,
    next_sales_name: preview.nextSalesName,
    queued_count: Number(queueRes.rows[0]?.queued_count || 0),
    cards,
    logs: logsRes.rows,
  });
}

/**
 * PUT /api/crm/round-robin (Admin saja)
 * Mengatur:
 *  - sticky_enabled: boolean
 *  - order: number[] (urutan sales.id)
 *  - toggle: { sales_id, is_active, off_reason?, off_until? }
 */
export async function PUT(req: NextRequest) {
  const auth = await requireUser(req, { role: 'admin', write: true });
  if (isAuthFailure(auth)) return auth;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return json({ success: false, error: 'Payload tidak valid' }, 400);
  }

  const pool = getMonitorPool();
  const client = await pool.connect();
  let drainedCount = 0;

  try {
    await client.query('BEGIN');

    if (typeof body.sticky_enabled === 'boolean') {
      await client.query(
        `UPDATE rr_state SET sticky_enabled = $1, updated_at = NOW() WHERE id = 1`,
        [body.sticky_enabled]
      );
    }

    if (Array.isArray(body.order) && body.order.length > 0) {
      for (let i = 0; i < body.order.length; i++) {
        const sid = parseInt(String(body.order[i]), 10);
        if (Number.isInteger(sid) && sid > 0) {
          await client.query(`UPDATE sales SET rr_order = $2, updated_at = NOW() WHERE id = $1`, [sid, i + 1]);
        }
      }
    }

    if (body.toggle && typeof body.toggle === 'object') {
      const sid = parseInt(String(body.toggle.sales_id), 10);
      const nextActive = Boolean(body.toggle.is_active);
      const offReason = typeof body.toggle.off_reason === 'string' && body.toggle.off_reason.trim()
        ? body.toggle.off_reason.trim()
        : null;
      const offUntil = typeof body.toggle.off_until === 'string' && body.toggle.off_until.trim()
        ? body.toggle.off_until.trim()
        : null;

      if (!Number.isInteger(sid) || sid <= 0) {
        await client.query('ROLLBACK');
        return json({ success: false, error: 'ID sales tidak valid' }, 400);
      }
      if (!nextActive && offReason && !(OFF_REASONS as readonly string[]).includes(offReason)) {
        await client.query('ROLLBACK');
        return json({ success: false, error: 'Alasan OFF harus Cuti, Sakit, Libur, atau Off shift' }, 400);
      }

      const targetRes = await client.query(`SELECT id, name, deleted_at FROM sales WHERE id = $1`, [sid]);
      const target = targetRes.rows[0];
      if (!target) {
        await client.query('ROLLBACK');
        return json({ success: false, error: 'Sales tidak ditemukan' }, 404);
      }
      if (target.deleted_at) {
        await client.query('ROLLBACK');
        return json({ success: false, error: 'Sales yang sudah diarsipkan tidak dapat diaktifkan di round robin' }, 400);
      }

      await client.query(
        `UPDATE sales
            SET is_active = $2,
                off_reason = CASE WHEN $2 THEN NULL ELSE COALESCE($3, 'Off shift') END,
                off_until = CASE WHEN $2 THEN NULL ELSE $4 END,
                updated_at = NOW()
          WHERE id = $1`,
        [sid, nextActive, offReason, offUntil]
      );
      await client.query(
        `UPDATE busdevs SET is_active = $2 WHERE lower(name) = lower($1)`,
        [target.name, nextActive]
      ).catch(() => undefined);

      if (nextActive) {
        drainedCount = await drainQueuedLeadsTx(client);
      }
    }

    await client.query('COMMIT');
    return json({ success: true, drainedCount });
  } catch (e: any) {
    await client.query('ROLLBACK').catch(() => undefined);
    console.error('[crm/round-robin] error:', e?.message);
    return json({ success: false, error: 'Gagal memperbarui pengaturan round robin' }, 500);
  } finally {
    client.release();
  }
}
