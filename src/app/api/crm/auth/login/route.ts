import { NextRequest } from 'next/server';
import { json, login, sameOrigin, setSessionCookie } from '@/lib/crm-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ success: false, error: 'Origin tidak diizinkan' }, 403);
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const remember = body?.remember !== false; // bawaan: ingat 30 hari

  let result;
  try {
    result = await login(name, password, remember, req.headers.get('user-agent'));
  } catch (e: any) {
    console.error('[crm/login] error:', e?.message);
    return json({ success: false, error: 'Layanan login tidak tersedia, coba lagi' }, 503);
  }

  if (!result.ok) {
    if (result.reason === 'locked') {
      const min = Math.max(1, Math.ceil((result.retryAfterSec ?? 900) / 60));
      return json({ success: false, error: `Terlalu banyak percobaan salah. Coba lagi dalam ${min} menit, atau minta Head membuka kunci.` }, 429);
    }
    return json({ success: false, error: 'Nama atau kata sandi salah' }, 401);
  }

  const res = json({ success: true, user: result.user, mustChange: result.mustChange });
  // Ingat saya => cookie 30 hari; tanpa itu => cookie sesi (hilang saat browser ditutup) dan 12 jam di server.
  setSessionCookie(res, result.token, result.remember ? result.expiresAt : null);
  return res;
}
