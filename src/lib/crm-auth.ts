import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import type { Pool, PoolClient } from 'pg';
import { getMonitorPool } from '@/lib/db';
import { isAdminRole, normalizeRole, rolesMatch, type CrmRole, type CrmUserInfo } from '@/lib/crm-stages';

/**
 * Login per orang untuk Lead Monitor / CRM internal (nama + kata sandi / PIN).
 *
 *  - Kata sandi / PIN disimpan ter-hash (scrypt memory-hard KDF + salt acak 16 byte, juga mendukung format bcrypt).
 *    Server tidak pernah menyimpan atau mencatat kata sandi / PIN dalam bentuk teks biasa.
 *  - Kredensial awal dibuat melalui `scripts/init-crm-pins.mjs` (PIN acak sekali jalan di terminal)
 *    dengan `must_change_password = TRUE` (wajib diganti saat login pertama). Akun dengan `password_hash IS NULL`
 *    ditolak sampai PIN dibuat.
 *  - Sesi: token acak 32 byte di cookie httpOnly; di database hanya hash SHA-256 token.
 *    "Ingat saya" = 30 hari (cookie persisten); tanpa itu = 12 jam (cookie sesi). Bisa dicabut kapan saja.
 *  - Rate limit login per IP + 5 kali salah beruntun mengunci akun sementara selama 30 detik.
 *  - Semua halaman /lead-monitor/* dan semua endpoint CRM wajib login (requireUser() => 401 tanpa sesi sah).
 */

export const SESSION_COOKIE = 'dl_crm';
export const REMEMBER_DAYS = 30;
export const REMEMBER_MS = REMEMBER_DAYS * 86_400_000;
export const SHORT_SESSION_MS = 12 * 3600_000;
export const MAX_FAILED = 5;
export const LOCK_MS = 30_000; // 30 detik setelah 5x salah

export const PASSWORD_MIN = 6; // Mendukung PIN 6 digit maupun password >= 6 karakter
export const PASSWORD_MAX = 100;

const q = (text: string, params: unknown[] = []) => getMonitorPool().query(text, params);

// ---------------------------------------------------------------- rate limit per IP
const RATE_WINDOW_MS = 30_000;
const RATE_MAX_REQUESTS = 15;
const ipHits = new Map<string, { count: number; resetAt: number }>();

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const key = (ip || 'unknown').trim().slice(0, 80);
  const now = Date.now();
  if (ipHits.size > 2000) {
    for (const [k, v] of ipHits) {
      if (v.resetAt <= now) ipHits.delete(k);
    }
  }
  const cur = ipHits.get(key);
  if (!cur || cur.resetAt <= now) {
    ipHits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }
  cur.count += 1;
  if (cur.count > RATE_MAX_REQUESTS) {
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((cur.resetAt - now) / 1000)) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

export function resetLoginRateLimit(): void {
  ipHits.clear();
}

// ---------------------------------------------------------------- hash
export function hashPassword(pw: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pw, salt, 32, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(pw: string, stored: string | null | undefined): boolean {
  if (!stored || typeof pw !== 'string' || pw.length === 0) return false;
  const [scheme, saltHex, hashHex] = stored.split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  // Format baku: salt 16 byte, hash 32 byte. Selain itu dianggap rusak (hash kosong tidak boleh cocok dengan apa pun).
  if (salt.length !== 16 || expected.length !== 32) return false;
  const actual = crypto.scryptSync(pw, salt, expected.length, { N: 16384, r: 8, p: 1 });
  return crypto.timingSafeEqual(actual, expected);
}

export const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');
export const newToken = () => crypto.randomBytes(32).toString('base64url');

/** Membuat PIN sementara acak 6 digit yang aman secara kriptografis (tidak pernah diawali 0). */
export function generateRandomPin(): string {
  return String(crypto.randomInt(100_000, 1_000_000));
}

/**
 * Helper kompatibilitas lama untuk tes unit perbandingan string waktu-konstan.
 * TIDAK dipakai lagi untuk mengizinkan login tanpa password_hash.
 */
export function matchesInitialPassword(input: string, name: string): boolean {
  if (!input || !name) return false;
  const a = Buffer.from(input.trim().toLowerCase());
  const b = Buffer.from(name.trim().toLowerCase());
  const len = Math.max(a.length, b.length, 1);
  const pa = Buffer.alloc(len);
  const pb = Buffer.alloc(len);
  a.copy(pa);
  b.copy(pb);
  return crypto.timingSafeEqual(pa, pb) && a.length === b.length;
}

const COMMON = new Set([
  'password',
  'password1',
  'kata sandi',
  'katasandi',
  '123456',
  '654321',
  '12345678',
  '123456789',
  '1234567890',
  'qwertyui',
  'qwerty123',
  '111111',
  '000000',
  '11111111',
  '00000000',
  'abcdefgh',
  'dreamlab',
  'dreamlab1',
  'dreamlab123',
  'maklon123',
]);

/** Aturan kata sandi / PIN baru. Mengembalikan pesan galat, atau null bila boleh dipakai. */
export function validateNewPassword(pw: string, name: string, minLen = 8): string | null {
  if (typeof pw !== 'string') return 'Kata sandi / PIN tidak valid';
  const isSixDigitPin = /^\d{6}$/.test(pw);
  const effectiveMin = isSixDigitPin ? 6 : minLen;
  if (pw.length < effectiveMin) return `Kata sandi minimal ${minLen} karakter (atau PIN 6 digit angka)`;
  if (pw.length > PASSWORD_MAX) return `Kata sandi maksimal ${PASSWORD_MAX} karakter`;
  const low = pw.trim().toLowerCase();
  const nm = name.trim().toLowerCase();
  if (low === nm || (nm.length >= 3 && low.includes(nm))) return 'Kata sandi tidak boleh memuat nama Anda';
  if (COMMON.has(low) || '01234567890'.includes(low) || '9876543210'.includes(low)) return 'Kata sandi / PIN terlalu mudah ditebak';
  if (/^(.)\1+$/.test(pw)) return 'Kata sandi / PIN tidak boleh angka/huruf berulang';
  return null;
}

// ---------------------------------------------------------------- login
export type LoginResult =
  | { ok: true; token: string; user: CrmUserInfo; mustChange: boolean; remember: boolean; expiresAt: Date }
  | { ok: false; reason: 'invalid' | 'locked' | 'rate_limit'; retryAfterSec?: number };

const DUMMY_HASH = 'scrypt$00000000000000000000000000000000$' + '00'.repeat(32);

/** Memeriksa kata sandi / PIN sebuah akun. Wajib memiliki password_hash di database. */
function passwordMatches(u: { name: string; password_hash: string | null }, input: string): boolean {
  if (!u.password_hash) {
    verifyPassword(input, DUMMY_HASH);
    return false;
  }
  return verifyPassword(input, u.password_hash);
}

async function registerFailure(u: { id: number | string; failed_attempts: number }): Promise<LoginResult> {
  const failed = (u.failed_attempts || 0) + 1;
  if (failed >= MAX_FAILED) {
    await q(`UPDATE crm_users SET failed_attempts = 0, locked_until = NOW() + ($2 || ' milliseconds')::interval, updated_at = NOW() WHERE id = $1`, [u.id, String(LOCK_MS)]);
    return { ok: false, reason: 'locked', retryAfterSec: Math.ceil(LOCK_MS / 1000) };
  }
  await q(`UPDATE crm_users SET failed_attempts = $2, updated_at = NOW() WHERE id = $1`, [u.id, failed]);
  return { ok: false, reason: 'invalid' };
}

export async function login(name: string, password: string, remember: boolean, userAgent: string | null, clientIp?: string | null): Promise<LoginResult> {
  if (clientIp) {
    const rl = checkLoginRateLimit(clientIp);
    if (!rl.allowed) {
      return { ok: false, reason: 'rate_limit', retryAfterSec: rl.retryAfterSec };
    }
  }

  const nm = name.trim();
  if (!nm || nm.length > 60 || !password || password.length > 200) return { ok: false, reason: 'invalid' };

  const res = await q(
    `SELECT id, name, role, password_hash, must_change_password, is_active, failed_attempts, locked_until FROM crm_users WHERE lower(name) = lower($1)`,
    [nm]
  );
  const u = res.rows[0];
  // Kerjakan scrypt walau akun tidak ada supaya waktu respons tidak membedakan nama yang valid.
  if (!u) {
    verifyPassword(password, DUMMY_HASH);
    return { ok: false, reason: 'invalid' };
  }
  if (!u.is_active) {
    verifyPassword(password, DUMMY_HASH);
    return { ok: false, reason: 'invalid' };
  }
  if (u.locked_until && new Date(u.locked_until).getTime() > Date.now()) {
    return { ok: false, reason: 'locked', retryAfterSec: Math.max(1, Math.ceil((new Date(u.locked_until).getTime() - Date.now()) / 1000)) };
  }
  if (!passwordMatches(u, password)) return registerFailure(u);

  const token = newToken();
  const ttl = remember ? REMEMBER_MS : SHORT_SESSION_MS;
  await q(`UPDATE crm_users SET failed_attempts = 0, locked_until = NULL, last_login_at = NOW(), updated_at = NOW() WHERE id = $1`, [u.id]);
  const s = await q(
    `INSERT INTO crm_sessions (token_hash, user_id, remember, expires_at, user_agent) VALUES ($1, $2, $3, NOW() + ($4 || ' milliseconds')::interval, $5) RETURNING expires_at`,
    [sha256(token), u.id, remember, String(ttl), (userAgent || '').slice(0, 200)]
  );
  // Rapikan sesi kedaluwarsa (murah, sekali per login).
  await q(`DELETE FROM crm_sessions WHERE expires_at < NOW()`).catch(() => undefined);
  return {
    ok: true,
    token,
    user: { id: Number(u.id), name: u.name, role: normalizeRole(u.role) },
    mustChange: !!u.must_change_password,
    remember,
    expiresAt: new Date(s.rows[0].expires_at),
  };
}

// ---------------------------------------------------------------- ganti kata sandi / PIN
export type ChangeResult = { ok: true } | { ok: false; reason: 'wrong-current' | 'weak' | 'locked' | 'same'; message: string };

/** Ganti kata sandi / PIN sendiri. Sesi lain milik akun ini dicabut; sesi yang sedang dipakai (`keepToken`) dipertahankan. */
export async function changePassword(userId: number, current: string, next: string, keepToken: string): Promise<ChangeResult> {
  const res = await q(`SELECT id, name, password_hash, failed_attempts, locked_until FROM crm_users WHERE id = $1 AND is_active = TRUE`, [userId]);
  const u = res.rows[0];
  if (!u) return { ok: false, reason: 'wrong-current', message: 'Akun tidak ditemukan' };
  if (u.locked_until && new Date(u.locked_until).getTime() > Date.now()) {
    const sec = Math.max(1, Math.ceil((new Date(u.locked_until).getTime() - Date.now()) / 1000));
    return { ok: false, reason: 'locked', message: `Terlalu banyak percobaan salah. Coba lagi dalam ${sec} detik.` };
  }
  if (!passwordMatches(u, current)) {
    const r = await registerFailure(u);
    return !r.ok && r.reason === 'locked'
      ? { ok: false, reason: 'locked', message: `Terlalu banyak percobaan salah. Akun dikunci ${Math.ceil(LOCK_MS / 1000)} detik.` }
      : { ok: false, reason: 'wrong-current', message: 'Kata sandi / PIN saat ini salah' };
  }
  const weak = validateNewPassword(next, u.name);
  if (weak) return { ok: false, reason: 'weak', message: weak };
  if (passwordMatches(u, next)) return { ok: false, reason: 'same', message: 'Kata sandi / PIN baru harus berbeda dari yang lama' };

  await q(
    `UPDATE crm_users SET password_hash = $2, must_change_password = FALSE, password_changed_at = NOW(), failed_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE id = $1`,
    [userId, hashPassword(next)]
  );
  await q(`DELETE FROM crm_sessions WHERE user_id = $1 AND token_hash <> $2`, [userId, sha256(keepToken)]);
  return { ok: true };
}

// ---------------------------------------------------------------- sesi
export interface SessionUser extends CrmUserInfo {
  expiresAt: Date;
  remember: boolean;
  mustChange: boolean;
  guest?: boolean;
}

/**
 * TAHAP 0 KEAMANAN: Mode tamu ditutup permanen.
 * Semua halaman /lead-monitor/* dan semua API wajib login.
 */
export const OPEN_VIEW = false;

export async function getUserByToken(token: string | undefined | null): Promise<SessionUser | null> {
  if (!token || token.length < 20 || token.length > 200) return null;
  const res = await q(
    `SELECT u.id, u.name, u.role, u.must_change_password, s.expires_at, s.remember
       FROM crm_sessions s JOIN crm_users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > NOW() AND u.is_active = TRUE`,
    [sha256(token)]
  );
  const r = res.rows[0];
  return r
    ? {
        id: Number(r.id),
        name: r.name,
        role: normalizeRole(r.role),
        expiresAt: new Date(r.expires_at),
        remember: !!r.remember,
        mustChange: !!r.must_change_password,
      }
    : null;
}

export async function destroySession(token: string | undefined | null): Promise<void> {
  if (!token) return;
  await q(`DELETE FROM crm_sessions WHERE token_hash = $1`, [sha256(token)]);
}

/** Perpanjang sesi "ingat saya" 30 hari lagi (dipanggil saat pengguna aktif) dan kembalikan kedaluwarsa baru. */
export async function renewSession(token: string): Promise<Date> {
  const res = await q(
    `UPDATE crm_sessions SET expires_at = NOW() + ($2 || ' milliseconds')::interval, last_seen_at = NOW() WHERE token_hash = $1 AND remember = TRUE RETURNING expires_at`,
    [sha256(token), String(REMEMBER_MS)]
  );
  return new Date(res.rows[0]?.expires_at ?? Date.now() + REMEMBER_MS);
}

/** `expires` kosong = cookie sesi (hilang saat browser ditutup). */
export function setSessionCookie(res: NextResponse, token: string, expires: Date | null): void {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...(expires ? { expires } : {}),
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
}

// ---------------------------------------------------------------- guard untuk route handler
const NO_STORE = { 'Cache-Control': 'no-store' };

export const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: NO_STORE });

/** Tolak permintaan tulis lintas-situs: Origin (bila ada) harus sama dengan host. */
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // permintaan non-browser tidak membawa Origin; tetap wajib cookie sesi
  try {
    return new URL(origin).host === (req.headers.get('x-forwarded-host') || req.headers.get('host'));
  } catch {
    return false;
  }
}

export async function requireUser(
  req: NextRequest,
  opts: { role?: CrmRole; write?: boolean; allowMustChange?: boolean } = {}
): Promise<{ user: SessionUser; token: string } | NextResponse> {
  if (opts.write && !sameOrigin(req)) return json({ success: false, error: 'Origin tidak diizinkan' }, 403);

  // Jalur ERP (server-ke-server): token layanan + `X-Acting-User: <nama akun CRM>`.
  const acting = req.headers.get('x-acting-user');
  if (acting && serviceTokenOk(req)) {
    try {
      const res = await q(`SELECT id, name, role FROM crm_users WHERE lower(name) = lower($1) AND is_active = TRUE`, [acting.trim().slice(0, 60)]);
      const r = res.rows[0];
      if (!r) return json({ success: false, error: 'Akun CRM untuk pengguna ini tidak ditemukan / nonaktif' }, 403);
      const normRole = normalizeRole(r.role);
      if (opts.role && !rolesMatch(normRole, opts.role)) return json({ success: false, error: 'Tidak punya izin' }, 403);
      return {
        user: {
          id: Number(r.id),
          name: r.name,
          role: normRole,
          expiresAt: new Date(Date.now() + 60_000),
          remember: false,
          mustChange: false,
        },
        token: '',
      };
    } catch (e: any) {
      console.error('[crm-auth] gagal membaca akun layanan:', e?.message);
      return json({ success: false, error: 'Layanan login tidak tersedia, coba lagi' }, 503);
    }
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  let user: SessionUser | null = null;
  try {
    user = await getUserByToken(token);
  } catch (e: any) {
    console.error('[crm-auth] gagal membaca sesi:', e?.message);
    return json({ success: false, error: 'Layanan login tidak tersedia, coba lagi' }, 503);
  }
  if (!user || !token) return json({ success: false, error: 'Belum masuk. Silakan login terlebih dahulu.' }, 401);
  // PIN / kata sandi sementara wajib diganti dulu sebelum data apa pun bisa diakses.
  if (user.mustChange && !opts.allowMustChange) return json({ success: false, error: 'Ganti PIN / kata sandi sementara Anda terlebih dahulu', code: 'must_change' }, 403);
  if (opts.role && !rolesMatch(user.role, opts.role)) return json({ success: false, error: 'Hanya Admin yang memiliki akses ke fitur ini' }, 403);
  return { user, token };
}

/**
 * Menjalankan operasi database dengan konteks sesi PostgreSQL Row Level Security (RLS):
 *   - app.current_user_id   = ID user CRM
 *   - app.current_user_role = 'admin' | 'busdev'
 *   - app.current_user_name = nama sales / user
 */
export async function withCrmRls<T>(
  pool: Pool,
  user: Pick<CrmUserInfo, 'id' | 'name' | 'role'>,
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const roleNorm = isAdminRole(user.role) ? 'admin' : 'busdev';
    await client.query(
      `SELECT
         set_config('app.current_user_id', $1, true),
         set_config('app.current_user_role', $2, true),
         set_config('app.current_user_name', $3, true)`,
      [String(user.id || 0), roleNorm, user.name || '']
    );
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Akses mesin-ke-mesin (ERP) HANYA-BACA ke statistik: header `Authorization: Bearer <LEAD_MONITOR_TOKEN>`.
 */
export function serviceTokenOk(req: NextRequest): boolean {
  const expected = process.env.LEAD_MONITOR_TOKEN;
  if (!expected || expected.length < 24) return false;
  const m = /^Bearer\s+(.+)$/i.exec(req.headers.get('authorization') || '');
  if (!m) return false;
  const provided = Buffer.from(m[1].trim());
  const want = Buffer.from(expected);
  return provided.length === want.length && crypto.timingSafeEqual(provided, want);
}

export const isAuthFailure = (v: unknown): v is NextResponse => v instanceof NextResponse;
