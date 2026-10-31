import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';

export const dynamic = 'force-dynamic';

/**
 * Tindakan Head atas satu akun:
 *   reset-password : kembalikan ke kata sandi awal (= nama akun) dan wajibkan ganti saat masuk; mencabut semua sesi
 *   deactivate     : nonaktifkan + cabut semua sesi
 *   activate       : aktifkan lagi
 *   unlock         : buka kunci akibat salah kata sandi
 *   logout-all     : cabut semua sesi akun
 */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req, { role: 'head', write: true });
  if (isAuthFailure(auth)) return auth;
  const { id } = await ctx.params;
  const uid = parseInt(id, 10);
  if (!Number.isInteger(uid) || uid <= 0) return json({ success: false, error: 'ID tidak valid' }, 400);
  const body = await req.json().catch(() => null);
  const action = typeof body?.action === 'string' ? body.action : '';

  const pool = getMonitorPool();
  const target = await pool.query(`SELECT id, name, role, is_active FROM crm_users WHERE id = $1`, [uid]);
  const t = target.rows[0];
  if (!t) return json({ success: false, error: 'Akun tidak ditemukan' }, 404);

  switch (action) {
    case 'reset-password': {
      await pool.query(
        `UPDATE crm_users SET password_hash = NULL, must_change_password = TRUE, password_changed_at = NULL, failed_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE id = $1`,
        [uid]
      );
      await pool.query(`DELETE FROM crm_sessions WHERE user_id = $1`, [uid]);
      return json({ success: true, name: t.name });
    }
    case 'deactivate': {
      if (uid === auth.user.id) return json({ success: false, error: 'Tidak bisa menonaktifkan akun sendiri' }, 400);
      await pool.query(`UPDATE crm_users SET is_active = FALSE, updated_at = NOW() WHERE id = $1`, [uid]);
      await pool.query(`DELETE FROM crm_sessions WHERE user_id = $1`, [uid]);
      return json({ success: true });
    }
    case 'activate':
      await pool.query(`UPDATE crm_users SET is_active = TRUE, updated_at = NOW() WHERE id = $1`, [uid]);
      return json({ success: true });
    case 'unlock':
      await pool.query(`UPDATE crm_users SET failed_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE id = $1`, [uid]);
      return json({ success: true });
    case 'logout-all':
      await pool.query(`DELETE FROM crm_sessions WHERE user_id = $1`, [uid]);
      return json({ success: true });
    default:
      return json({ success: false, error: 'Tindakan tidak dikenal' }, 400);
  }
}
