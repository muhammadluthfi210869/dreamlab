import { NextRequest } from 'next/server';
import { isAuthFailure, json, REMEMBER_MS, renewSession, requireUser, setSessionCookie } from '@/lib/crm-auth';

export const dynamic = 'force-dynamic';

/** Siapa yang sedang masuk. Sesi "ingat saya" diperpanjang 30 hari lagi bila tinggal kurang dari 25 hari (pengguna aktif tidak perlu masuk ulang). */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req, { allowMustChange: true });
  if (isAuthFailure(auth)) return auth;
  const { user, token } = auth;

  const res = json({ success: true, user: { id: user.id, name: user.name, role: user.role }, mustChange: user.mustChange, remember: user.remember });
  if (user.remember && user.expiresAt.getTime() - Date.now() < REMEMBER_MS - 5 * 86_400_000) {
    try {
      const expires = await renewSession(token);
      setSessionCookie(res, token, expires);
    } catch {
      /* gagal memperpanjang tidak boleh menggagalkan pengecekan */
    }
  }
  return res;
}
