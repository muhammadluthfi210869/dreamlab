import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { isAdminRole } from '@/lib/crm-stages';

export const dynamic = 'force-dynamic';

const VALID_METRICS = ['traffic', 'cold', 'prospecting', 'sample', 'deal', 'lost'] as const;

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;

  const month = req.nextUrl.searchParams.get('month') || '';
  const pool = getMonitorPool();

  const [ovRes, logRes] = await Promise.all([
    pool.query(
      `SELECT month, sales_name, week_index, metric, value, auto_value_saat_itu, reason, created_by, created_at
         FROM dashboard_overrides
        ${month ? 'WHERE month = $1' : ''}
        ORDER BY sales_name, week_index, metric`,
      month ? [month] : []
    ),
    pool.query(
      `SELECT id, month, sales_name, week_index, metric, action, from_value, to_value, reason, actor, created_at
         FROM dashboard_override_log
        ${month ? 'WHERE month = $1' : ''}
        ORDER BY created_at DESC
        LIMIT 100`,
      month ? [month] : []
    ),
  ]);

  return json({
    success: true,
    overrides: ovRes.rows,
    logs: logRes.rows,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  if (!isAdminRole(auth.user.role)) {
    return json({ success: false, error: 'Akses ditolak: hanya Admin yang dapat mengoreksi angka dashboard' }, 403);
  }

  const body = await req.json().catch(() => null);
  const month = typeof body?.month === 'string' ? body.month.trim() : '';
  const salesName = typeof body?.sales_name === 'string' ? body.sales_name.trim() : '';
  const reason = typeof body?.reason === 'string' ? body.reason.trim() : '';
  const items: Array<{ week_index: number; metric: string; value: number; auto_value: number }> = Array.isArray(body?.items)
    ? body.items
    : body?.week_index && body?.metric !== undefined
      ? [{ week_index: Number(body.week_index), metric: String(body.metric), value: Number(body.value), auto_value: Number(body.auto_value ?? 0) }]
      : [];

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return json({ success: false, error: 'Format bulan harus YYYY-MM' }, 400);
  }
  if (!salesName) {
    return json({ success: false, error: 'Nama BD wajib dipilih' }, 400);
  }
  if (!reason || reason.length < 3) {
    return json({ success: false, error: 'Alasan koreksi wajib diisi (minimal 3 karakter)' }, 400);
  }
  if (items.length === 0) {
    return json({ success: false, error: 'Tidak ada angka koreksi yang dikirim' }, 400);
  }

  for (const it of items) {
    if (!Number.isInteger(it.week_index) || it.week_index < 1 || it.week_index > 5) {
      return json({ success: false, error: 'Minggu harus 1–5' }, 400);
    }
    if (!(VALID_METRICS as readonly string[]).includes(it.metric)) {
      return json({ success: false, error: `Metrik tidak valid: ${it.metric}` }, 400);
    }
    if (!Number.isInteger(it.value) || it.value < 0) {
      return json({ success: false, error: 'Nilai koreksi harus bilangan bulat >= 0' }, 400);
    }
  }

  const pool = getMonitorPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const salesRes = await client.query(`SELECT id FROM sales WHERE lower(name) = lower($1) LIMIT 1`, [salesName]);
    const salesId = salesRes.rows[0]?.id ? Number(salesRes.rows[0].id) : null;

    for (const it of items) {
      const prevRes = await client.query(
        `SELECT value FROM dashboard_overrides WHERE month = $1 AND sales_name = $2 AND week_index = $3 AND metric = $4`,
        [month, salesName, it.week_index, it.metric]
      );
      const fromVal = prevRes.rows[0] ? Number(prevRes.rows[0].value) : Number(it.auto_value || 0);

      await client.query(
        `INSERT INTO dashboard_overrides (month, sales_id, sales_name, week_index, metric, value, auto_value_saat_itu, reason, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
         ON CONFLICT (month, sales_name, week_index, metric) DO UPDATE SET
           value = EXCLUDED.value,
           auto_value_saat_itu = EXCLUDED.auto_value_saat_itu,
           reason = EXCLUDED.reason,
           created_by = EXCLUDED.created_by,
           created_at = NOW()`,
        [month, salesId, salesName, it.week_index, it.metric, it.value, Number(it.auto_value || 0), reason, auth.user.name]
      );

      await client.query(
        `INSERT INTO dashboard_override_log (month, sales_name, week_index, metric, action, from_value, to_value, reason, actor)
         VALUES ($1, $2, $3, $4, 'override', $5, $6, $7, $8)`,
        [month, salesName, it.week_index, it.metric, fromVal, it.value, reason, auth.user.name]
      );
    }

    await client.query('COMMIT');
    return json({ success: true, count: items.length });
  } catch (e: any) {
    await client.query('ROLLBACK').catch(() => undefined);
    console.error('[dashboard-overrides] POST error:', e?.message);
    return json({ success: false, error: 'Gagal menyimpan koreksi angka' }, 500);
  } finally {
    client.release();
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  if (!isAdminRole(auth.user.role)) {
    return json({ success: false, error: 'Akses ditolak: hanya Admin yang dapat mengembalikan angka otomatis' }, 403);
  }

  const sp = req.nextUrl.searchParams;
  const month = sp.get('month')?.trim() || '';
  const salesName = sp.get('sales_name')?.trim() || '';

  if (!/^\d{4}-\d{2}$/.test(month) || !salesName) {
    return json({ success: false, error: 'Parameter month (YYYY-MM) dan sales_name wajib diisi' }, 400);
  }

  const pool = getMonitorPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const delRes = await client.query(
      `DELETE FROM dashboard_overrides WHERE month = $1 AND sales_name = $2 RETURNING week_index, metric, value, auto_value_saat_itu`,
      [month, salesName]
    );
    if (delRes.rowCount && delRes.rowCount > 0) {
      await client.query(
        `INSERT INTO dashboard_override_log (month, sales_name, week_index, metric, action, from_value, to_value, reason, actor)
         VALUES ($1, $2, NULL, NULL, 'reset', NULL, NULL, $3, $4)`,
        [month, salesName, `Kembalikan ke otomatis (${delRes.rowCount} sel)`, auth.user.name]
      );
    }
    await client.query('COMMIT');
    return json({ success: true, removed: delRes.rowCount || 0 });
  } catch (e: any) {
    await client.query('ROLLBACK').catch(() => undefined);
    console.error('[dashboard-overrides] DELETE error:', e?.message);
    return json({ success: false, error: 'Gagal mengembalikan ke angka otomatis' }, 500);
  } finally {
    client.release();
  }
}
