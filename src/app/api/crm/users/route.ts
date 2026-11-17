import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { generateRandomPin, hashPassword, isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { normalizePhoneE164Digits } from '@/lib/crm-round-robin';
import { normalizeRole } from '@/lib/crm-stages';

export const dynamic = 'force-dynamic';

/** Daftar akun & info sales (khusus Admin). Tidak pernah mengembalikan hash kata sandi atau token. */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req, { role: 'admin' });
  if (isAuthFailure(auth)) return auth;
  const res = await getMonitorPool().query(
    `SELECT u.id, u.name, u.role, u.is_active, u.must_change_password AS using_initial_password,
            (u.locked_until IS NOT NULL AND u.locked_until > NOW()) AS is_locked,
            u.last_login_at, u.password_changed_at,
            s.wa_number, s.is_active AS rr_active, s.off_reason, s.off_until, s.rr_order, s.deleted_at,
            (SELECT COUNT(*)::int FROM crm_sessions cs WHERE cs.user_id = u.id AND cs.expires_at > NOW()) AS sessions
       FROM crm_users u
       LEFT JOIN sales s ON lower(s.name) = lower(u.name)
      ORDER BY (s.deleted_at IS NOT NULL) ASC, (u.role IN ('admin', 'head')) DESC, u.is_active DESC, COALESCE(s.rr_order, 999), u.name`
  );
  return json({
    success: true,
    users: res.rows.map((u) => ({ ...u, role: normalizeRole(u.role) })),
  });
}

/** Tambah akun & sales baru (khusus Admin). Menghasilkan PIN sementara acak 6 digit yang wajib diganti saat login pertama. */
export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { role: 'admin', write: true });
  if (isAuthFailure(auth)) return auth;
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 40) : '';
  const role = normalizeRole(body?.role);
  const waRaw = typeof body?.wa_number === 'string' ? body.wa_number.trim() : '';
  const waDigits = waRaw ? normalizePhoneE164Digits(waRaw) : null;

  if (!/^[\p{L}][\p{L}\p{N} .'-]{1,39}$/u.test(name)) {
    return json({ success: false, error: 'Nama tidak valid (2–40 karakter)' }, 400);
  }
  if (role === 'busdev' && !waDigits) {
    return json({ success: false, error: 'Nomor WhatsApp BusDev wajib diisi dengan format valid (mis. 0812... / 62812...)' }, 400);
  }

  const pool = getMonitorPool();
  const tempPin = generateRandomPin();
  const pwHash = hashPassword(tempPin);

  let dbRole: string = role;
  const chk = await pool.query(
    `SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conname = 'crm_users_role_check'`
  );
  const def = String(chk.rows[0]?.def || '');
  if (!def.includes("'admin'")) {
    dbRole = role === 'admin' ? 'head' : 'sales';
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const r = await client.query(
      `INSERT INTO crm_users (name, role, password_hash, must_change_password)
       VALUES ($1, $2, $3, TRUE)
       ON CONFLICT ((lower(name))) DO NOTHING
       RETURNING id`,
      [name, dbRole, pwHash]
    );
    if (!r.rowCount) {
      await client.query('ROLLBACK');
      return json({ success: false, error: 'Nama sudah dipakai' }, 409);
    }

    const userId = Number(r.rows[0].id);

    if (role === 'busdev' && waDigits) {
      const localPhone = waDigits.startsWith('62') ? '0' + waDigits.slice(2) : waDigits;
      await client.query(
        `INSERT INTO busdevs (name, phone, is_active)
         VALUES ($1, $2, TRUE)
         ON CONFLICT (name) DO UPDATE SET phone = EXCLUDED.phone, is_active = TRUE`,
        [name, localPhone]
      ).catch(() => undefined);
    }

    const maxOrderRes = await client.query(`SELECT COALESCE(MAX(rr_order), 0)::int + 1 AS next_order FROM sales`);
    const nextOrder = Number(maxOrderRes.rows[0]?.next_order || 1);

    await client.query(
      `INSERT INTO sales (name, wa_number, role, password_hash, must_change_password, is_active, rr_order)
       VALUES ($1, $2, $3, $4, TRUE, TRUE, $5)
       ON CONFLICT (name) DO UPDATE SET
         wa_number = COALESCE(EXCLUDED.wa_number, sales.wa_number),
         role = EXCLUDED.role,
         password_hash = EXCLUDED.password_hash,
         must_change_password = TRUE,
         is_active = TRUE,
         deleted_at = NULL,
         updated_at = NOW()`,
      [name, waDigits, role, pwHash, nextOrder]
    );

    await client.query('COMMIT');
    return json({ success: true, id: userId, tempPin });
  } catch (e: any) {
    await client.query('ROLLBACK').catch(() => undefined);
    console.error('[crm/users] gagal tambah sales:', e?.message);
    return json({ success: false, error: 'Gagal menambahkan sales, coba lagi' }, 500);
  } finally {
    client.release();
  }
}
