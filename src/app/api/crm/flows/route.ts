import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { isAdminRole } from '@/lib/crm-stages';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;
  if (!isAdminRole(auth.user.role)) {
    return json({ success: false, error: 'Hanya Admin yang boleh mengelola Flow Journey' }, 403);
  }

  const pool = getMonitorPool();
  const [flowsRes, stepsRes, runsRes] = await Promise.all([
    pool.query(`SELECT id, name, is_active, trigger, quiet_hours, created_at FROM flows ORDER BY id ASC`),
    pool.query(`SELECT id, flow_id, position, type, config FROM flow_steps ORDER BY flow_id ASC, position ASC`),
    pool.query(
      `SELECT flow_id,
              COUNT(*) FILTER (WHERE status = 'running')::int AS running_count,
              COUNT(*) FILTER (WHERE status = 'done')::int AS done_count
         FROM flow_runs
        GROUP BY flow_id`
    ),
  ]);

  const runMap = new Map<number, { running: number; done: number }>();
  for (const r of runsRes.rows) {
    runMap.set(Number(r.flow_id), { running: Number(r.running_count || 0), done: Number(r.done_count || 0) });
  }

  const stepMap = new Map<number, any[]>();
  for (const s of stepsRes.rows) {
    const fid = Number(s.flow_id);
    const arr = stepMap.get(fid) || [];
    arr.push({ id: Number(s.id), position: Number(s.position), type: s.type, config: s.config });
    stepMap.set(fid, arr);
  }

  return json({
    success: true,
    flows: flowsRes.rows.map((f: any) => {
      const fid = Number(f.id);
      const counts = runMap.get(fid) || { running: 0, done: 0 };
      return {
        id: fid,
        name: f.name,
        is_active: Boolean(f.is_active),
        trigger: f.trigger,
        quiet_hours: Boolean(f.quiet_hours),
        steps: stepMap.get(fid) || [],
        running_count: counts.running,
        done_count: counts.done,
      };
    }),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  if (!isAdminRole(auth.user.role)) {
    return json({ success: false, error: 'Hanya Admin yang boleh mengubah Flow Journey' }, 403);
  }

  const body = await req.json().catch(() => null);
  const pool = getMonitorPool();

  if (body?.action === 'toggle' && body?.id) {
    await pool.query(`UPDATE flows SET is_active = $2 WHERE id = $1`, [Number(body.id), Boolean(body.is_active)]);
    return json({ success: true });
  }

  if (body?.action === 'save_steps' && body?.id) {
    const fid = Number(body.id);
    const steps: Array<{ type: string; config: Record<string, any> }> = Array.isArray(body.steps) ? body.steps : [];
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`DELETE FROM flow_steps WHERE flow_id = $1`, [fid]);
      for (let i = 0; i < steps.length; i++) {
        await client.query(
          `INSERT INTO flow_steps (flow_id, position, type, config) VALUES ($1, $2, $3, $4::jsonb)`,
          [fid, i + 1, steps[i].type, JSON.stringify(steps[i].config || {})]
        );
      }
      await client.query('COMMIT');
      return json({ success: true });
    } catch (e: any) {
      await client.query('ROLLBACK').catch(() => undefined);
      return json({ success: false, error: e?.message || 'Gagal menyimpan langkah flow' }, 500);
    } finally {
      client.release();
    }
  }

  if (body?.action === 'create') {
    const name = String(body?.name || '').trim();
    if (!name) return json({ success: false, error: 'Nama flow wajib diisi' }, 400);
    const r = await pool.query(
      `INSERT INTO flows (name, is_active, trigger, quiet_hours) VALUES ($1, FALSE, $2::jsonb, $3) RETURNING id`,
      [name, JSON.stringify(body?.trigger || { type: 'new_lead' }), body?.quiet_hours !== false]
    );
    return json({ success: true, id: Number(r.rows[0].id) });
  }

  return json({ success: false, error: 'Aksi tidak dikenal' }, 400);
}
