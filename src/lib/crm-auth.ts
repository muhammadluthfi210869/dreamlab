import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import type { CrmRole, CrmUserInfo } from '@/lib/crm-stages';

/**
 * Login per orang untuk Lead Monitor / CRM internal (nama + kata sandi).
 *
 *  - Kata sandi disimpan ter-hash (scrypt + salt acak). Server tidak pernah menyimpan atau mencatat kata sandi.
 *  - Kata sandi AWAL: password_hash NULL = belum pernah diganti, kata sandinya = nama akun (huruf besar/kecil
 *    tidak dibedakan) dan WAJIB diganti pada login pertama (must_change_password).
 *  - Sesi: token acak 32 byte di cookie httpOnly; di database hanya hash SHA-256 token.
 *    "Ingat saya" = 30 hari (cookie persisten); tanpa itu = 12 jam (cookie sesi). Bisa dicabut kapan saja.
 *  - 5 kali salah beruntun mengunci akun 15 menit.
 *  - Semua endpoint CRM wajib memanggil requireUser(); tanpa sesi sah => 401.
 */

export const SESSION_COOKIE = 'dl_crm';
export const REMEMBER_DAYS = 30;
export const REMEMBER_MS = REMEMBER_DAYS * 86_400_000;
export const SHORT_SESSION_MS = 12 * 3600_000;
const MAX_FAILED = 5;
const LOCK_MS = 15 * 60_000;

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 100;

const q = (text: string, params: unknown[] = []) => getMonitorPool().query(text, params);

// ---------------------------------------------------------------- hash
export function hashPassword(pw: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pw, salt, 32, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(pw: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
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

/** Kata sandi awal (belum pernah diganti) = nama akun, tanpa membedakan huruf besar/kecil. Perbandingan waktu-konstan. */
export function matchesInitialPassword(input: string, name: string): boolean {
  const a = Buffer.from(input.trim().toLowerCase());
  const b = Buffer.from(name.trim().toLowerCase());
  const len = Math.max(a.length, b.length, 1);
  const pa = Buffer.alloc(len);
  const pb = Buffer.alloc(len);
  a.copy(pa);
  b.copy(pb);
  return crypto.timingSafeEqual(pa, pb) && a.length === b.length;
}

const COMMON = new Set(['password', 'password1', 'kata sandi', 'katasandi', '12345678', '123456789', '1234567890', 'qwertyui', 'qwerty123', '11111111', '00000000', 'abcdefgh', 'dreamlab', 'dreamlab1', 'dreamlab123', 'maklon123']);

/** Aturan kata sandi baru. Mengembalikan pesan galat, atau null bila boleh dipakai. */
export function validateNewPassword(pw: string, name: string): string | null {
  if (typeof pw !== 'string') return 'Kata sandi tidak valid';
  if (pw.length < PASSWORD_MIN) return `Kata sandi minimal ${PASSWORD_MIN} karakter`;
  if (pw.length > PASSWORD_MAX) return `Kata sandi maksimal ${PASSWORD_MAX} karakter`;
  const low = pw.trim().toLowerCase();
  const nm = name.trim().toLowerCase();
  if (low === nm || (nm.length >= 3 && low.includes(nm))) return 'Kata sandi tidak boleh memuat nama Anda';
  if (COMMON.has(low)) return 'Kata sandi terlalu mudah ditebak';
  if (/^(.)\1+$/.test(pw)) return 'Kata sandi terlalu mudah ditebak';
  return null;
}

// ---------------------------------------------------------------- login
export type LoginResult =
  | { ok: true; token: string; user: CrmUserInfo; mustChange: boolean; remember: boolean; expiresAt: Date }
  | { ok: false; reason: 'invalid' | 'locked'; retryAfterSec?: number };

const DUMMY_HASH = 'scrypt$00000000000000000000000000000000$' + '00'.repeat(32);

/** Memeriksa kata sandi sebuah akun (kata sandi awal atau hasil ganti). */
function passwordMatches(u: { name: string; password_hash: string | null }, input: string): boolean {
  return u.password_hash ? verifyPassword(input, u.password_hash) : matchesInitialPassword(input, u.name);
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

export async function login(name: string, password: string, remember: boolean, userAgent: string | null): Promise<LoginResult> {
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
  if (!u.is_active) return { ok: false, reason: 'invalid' };
  if (u.locked_until && new Date(u.locked_until).getTime() > Date.now()) {
    return { ok: false, reason: 'locked', retryAfterSec: Math.ceil((new Date(u.locked_until).getTime() - Date.now()) / 1000) };
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
    user: { id: Number(u.id), name: u.name, role: u.role as CrmRole },
    mustChange: !!u.must_change_password,
    remember,
    expiresAt: new Date(s.rows[0].expires_at),
  };
}

// ---------------------------------------------------------------- ganti kata sandi
export type ChangeResult = { ok: true } | { ok: false; reason: 'wrong-current' | 'weak' | 'locked' | 'same'; message: string };

/** Ganti kata sandi sendiri. Sesi lain milik akun ini dicabut; sesi yang sedang dipakai (`keepToken`) dipertahankan. */
export async function changePassword(userId: number, current: string, next: string, keepToken: string): Promise<ChangeResult> {
  const res = await q(`SELECT id, name, password_hash, failed_attempts, locked_until FROM crm_users WHERE id = $1 AND is_active = TRUE`, [userId]);
  const u = res.rows[0];
  if (!u) return { ok: false, reason: 'wrong-current', message: 'Akun tidak ditemukan' };
  if (u.locked_until && new Date(u.locked_until).getTime() > Date.now()) {
    return { ok: false, reason: 'locked', message: 'Terlalu banyak percobaan salah. Coba lagi nanti.' };
  }
  if (!passwordMatches(u, current)) {
    const r = await registerFailure(u);
    return !r.ok && r.reason === 'locked'
      ? { ok: false, reason: 'locked', message: 'Terlalu banyak percobaan salah. Akun dikunci 15 menit.' }
      : { ok: false, reason: 'wrong-current', message: 'Kata sandi saat ini salah' };
  }
  const weak = validateNewPassword(next, u.name);
  if (weak) return { ok: false, reason: 'weak', message: weak };
  if (passwordMatches(u, next)) return { ok: false, reason: 'same', message: 'Kata sandi baru harus berbeda dari yang lama' };

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
}

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
    ? { id: Number(r.id), name: r.name, role: r.role as CrmRole, expiresAt: new Date(r.expires_at), remember: !!r.remember, mustChange: !!r.must_change_password }
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
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  let user: SessionUser | null = null;
  try {
    user = await getUserByToken(token);
  } catch (e: any) {
    console.error('[crm-auth] gagal membaca sesi:', e?.message);
    return json({ success: false, error: 'Layanan login tidak tersedia, coba lagi' }, 503);
  }
  if (!user || !token) return json({ success: false, error: 'Belum masuk' }, 401);
  // Kata sandi awal (= nama) harus diganti dulu sebelum data apa pun bisa diakses.
  if (user.mustChange && !opts.allowMustChange) return json({ success: false, error: 'Ganti kata sandi dulu', code: 'must_change' }, 403);
  if (opts.role && user.role !== opts.role) return json({ success: false, error: 'Tidak punya izin' }, 403);
  return { user, token };
}

export const isAuthFailure = (v: unknown): v is NextResponse => v instanceof NextResponse;
