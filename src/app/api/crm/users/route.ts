import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { generateRandomPin, hashPassword, isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { normalizeRole } from '@/lib/crm-stages';

export const dynamic = 'force-dynamic';

/** Daftar akun (khusus Admin). Tidak pernah mengembalikan hash kata sandi atau token. */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req, { role: 'admin' });
  if (isAuthFailure(auth)) return auth;
  const res = await getMonitorPool().query(
    `SELECT id, name, role, is_active, must_change_password AS using_initial_password,
            (locked_until IS NOT NULL AND locked_until > NOW()) AS is_locked,
            last_login_at, password_changed_at,
            (SELECT COUNT(*)::int FROM crm_sessions s WHERE s.user_id = crm_users.id AND s.expires_at > NOW()) AS sessions
       FROM crm_users ORDER BY (role IN ('admin', 'head')) DESC, is_active DESC, name`
  );
  return json({
    success: true,
    users: res.rows.map((u) => ({ ...u, role: normalizeRole(u.role) })),
  });
}

/** Tambah akun baru (khusus Admin). Menghasilkan PIN sementara acak 6 digit yang wajib diganti saat login pertama. */
export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { role: 'admin', write: true });
  if (isAuthFailure(auth)) return auth;
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 40) : '';
  const role = normalizeRole(body?.role);
  if (!/^[\p{L}][\p{L}\p{N} .'-]{1,39}$/u.test(name)) return json({ success: false, error: 'Nama tidak valid' }, 400);

  const pool = getMonitorPool();
  if (role === 'busdev') {
    const bd = await pool.query(`SELECT 1 FROM busdevs WHERE lower(name) = lower($1)`, [name]);
    if (!bd.rowCount) {
      return json({ success: false, error: 'Nama sales tidak ada di daftar BusDev. Tambahkan dulu di daftar BusDev.' }, 400);
    }
  }

  const tempPin = generateRandomPin();
  const pwHash = hashPassword(tempPin);

  // Gunakan nilai role yang sesuai dengan constraint DB saat ini
  let dbRole: string = role;
  const chk = await pool.query(
    `SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conname = 'crm_users_role_check'`
  );
  const def = String(chk.rows[0]?.def || '');
  if (!def.includes("'admin'")) {
    dbRole = role === 'admin' ? 'head' : 'sales';
  }

  const r = await pool.query(
    `INSERT INTO crm_users (name, role, password_hash, must_change_password)
     VALUES ($1, $2, $3, TRUE)
     ON CONFLICT ((lower(name))) DO NOTHING
     RETURNING id`,
    [name, dbRole, pwHash]
  );
  if (!r.rowCount) return json({ success: false, error: 'Nama sudah dipakai' }, 409);
  return json({ success: true, id: Number(r.rows[0].id), tempPin });
}
