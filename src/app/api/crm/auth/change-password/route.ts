import { NextRequest } from 'next/server';
import { changePassword, isAuthFailure, json, requireUser } from '@/lib/crm-auth';

export const dynamic = 'force-dynamic';

/** Ganti kata sandi sendiri. Boleh dipanggil saat masih memakai kata sandi awal (wajib ganti). Sesi di perangkat lain dicabut. */
export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { write: true, allowMustChange: true });
  if (isAuthFailure(auth)) return auth;

  const body = await req.json().catch(() => null);
  const current = typeof body?.current === 'string' ? body.current : '';
  const next = typeof body?.next === 'string' ? body.next : '';
  if (!current || !next || current.length > 200 || next.length > 200) return json({ success: false, error: 'Isian tidak lengkap' }, 400);

  try {
    const r = await changePassword(auth.user.id, current, next, auth.token);
    if (!r.ok) return json({ success: false, error: r.message }, r.reason === 'locked' ? 429 : r.reason === 'wrong-current' ? 401 : 400);
    return json({ success: true });
  } catch (e: any) {
    console.error('[crm/change-password] error:', e?.message);
    return json({ success: false, error: 'Layanan tidak tersedia, coba lagi' }, 503);
  }
}
