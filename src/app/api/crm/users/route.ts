import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';

export const dynamic = 'force-dynamic';

/** Daftar akun (khusus Head). Tidak pernah mengembalikan hash kata sandi atau token. */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req, { role: 'head' });
  if (isAuthFailure(auth)) return auth;
  const res = await getMonitorPool().query(
    `SELECT id, name, role, is_active, must_change_password AS using_initial_password,
            (locked_until IS NOT NULL AND locked_until > NOW()) AS is_locked,
            last_login_at, password_changed_at,
            (SELECT COUNT(*)::int FROM crm_sessions s WHERE s.user_id = crm_users.id AND s.expires_at > NOW()) AS sessions
       FROM crm_users ORDER BY (role = 'head') DESC, is_active DESC, name`
  );
  return json({ success: true, users: res.rows });
}

/** Tambah akun baru (khusus Head). Nama sales harus sama dengan nama di daftar BusDev. */
export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { role: 'head', write: true });
  if (isAuthFailure(auth)) return auth;
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 40) : '';
  const role = body?.role === 'head' ? 'head' : 'sales';
  if (!/^[\p{L}][\p{L}\p{N} .'-]{1,39}$/u.test(name)) return json({ success: false, error: 'Nama tidak valid' }, 400);

  const pool = getMonitorPool();
  if (role === 'sales') {
    const bd = await pool.query(`SELECT 1 FROM busdevs WHERE lower(name) = lower($1)`, [name]);
    if (!bd.rowCount) return json({ success: false, error: 'Nama sales tidak ada di daftar BusDev. Tambahkan dulu di daftar BusDev.' }, 400);
  }
  const r = await pool.query(`INSERT INTO crm_users (name, role) VALUES ($1, $2) ON CONFLICT ((lower(name))) DO NOTHING RETURNING id`, [name, role]);
  if (!r.rowCount) return json({ success: false, error: 'Nama sudah dipakai' }, 409);
  return json({ success: true, id: Number(r.rows[0].id) });
}
