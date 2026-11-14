import { NextRequest } from 'next/server';
import { json, login, sameOrigin, setSessionCookie } from '@/lib/crm-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ success: false, error: 'Origin tidak diizinkan' }, 403);
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const remember = body?.remember !== false; // bawaan: ingat 30 hari

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  let result;
  try {
    result = await login(name, password, remember, req.headers.get('user-agent'), ip);
  } catch (e: any) {
    console.error('[crm/login] error:', e?.message);
    return json({ success: false, error: 'Layanan login tidak tersedia, coba lagi' }, 503);
  }

  if (!result.ok) {
    if (result.reason === 'rate_limit') {
      const sec = Math.max(1, result.retryAfterSec ?? 30);
      return json(
        {
          success: false,
          error: `Terlalu banyak permintaan login. Tunggu ${sec} detik lalu coba lagi.`,
          retryAfterSec: sec,
        },
        429
      );
    }
    if (result.reason === 'locked') {
      const sec = Math.max(1, result.retryAfterSec ?? 30);
      return json(
        {
          success: false,
          error: `Akun dikunci sementara selama ${sec} detik karena 5x salah memasukkan PIN/kata sandi.`,
          retryAfterSec: sec,
        },
        429
      );
    }
    return json({ success: false, error: 'Nama atau PIN/kata sandi salah' }, 401);
  }

  const res = json({ success: true, user: result.user, mustChange: result.mustChange });
  // Ingat saya => cookie 30 hari; tanpa itu => cookie sesi (hilang saat browser ditutup) dan 12 jam di server.
  setSessionCookie(res, result.token, result.remember ? result.expiresAt : null);
  return res;
}
