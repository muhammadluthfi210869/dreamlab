import { NextRequest } from 'next/server';
import { clearSessionCookie, destroySession, json, SESSION_COOKIE, sameOrigin } from '@/lib/crm-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ success: false, error: 'Origin tidak diizinkan' }, 403);
  await destroySession(req.cookies.get(SESSION_COOKIE)?.value).catch(() => undefined);
  const res = json({ success: true });
  clearSessionCookie(res);
  return res;
}
