import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

/**
 * GET /api/health/round-robin
 * Health check untuk infrastruktur round-robin & lead capture.
 *
 * Yang dicek:
 *   1. DB PostgreSQL terjangkau (query ringan)
 *   2. Latensi query DB (kalau > ALERT_SLOW_MS → dianggap lambat)
 *   3. Ada CS aktif (busdevs)
 *   4. Fungsi assign_and_insert_lead sudah di-migrate
 *
 * Auth (opsional): kalau env HEALTH_CHECK_KEY di-set, wajib kirim
 *   header `x-health-key: <nilai>` atau `?key=<nilai>`. Vercel Cron
 *   otomatis lolos lewat `Authorization: Bearer $CRON_SECRET`.
 *
 * Alert (opsional): kalau env HEALTH_ALERT_WEBHOOK_URL di-set dan status
 *   tidak sehat, dikirim POST JSON (mis. Slack/Telegram) — best-effort,
 *   tidak memblokir respons. Vercel Cron sendiri juga mengirim email
 *   notifikasi kalau cron gagal (rencana Pro).
 */

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.HEALTH_CHECK_KEY;
  if (!expected) return true; // key belum di-set → endpoint terbuka

  const provided =
    req.headers.get('x-health-key') ??
    req.headers.get('x-internal-key') ??
    req.nextUrl.searchParams.get('key');
  if (provided && provided === expected) return true;

  // Vercel Cron mengirim Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.get('authorization') === `Bearer ${cronSecret}`) return true;

  return false;
}

async function notify(webhookUrl: string, payload: unknown): Promise<void> {
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error('[health/round-robin] Gagal kirim alert webhook:', (err as Error).message);
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const checkedAt = new Date().toISOString();
  const slowMs = Number(process.env.HEALTH_SLOW_MS ?? 2000);
  let db: { activeBusdevs: number; hasConvertFn: boolean } | null = null;
  let latencyMs = -1;
  let error: string | null = null;

  const t0 = Date.now();
  try {
    const res = await pool.query<{
      active_busdevs: number;
      has_convert_fn: boolean;
    }>(
      `SELECT
         (SELECT count(*)::int FROM busdevs WHERE is_active) AS active_busdevs,
         EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'assign_and_insert_lead') AS has_convert_fn`
    );
    latencyMs = Date.now() - t0;
    db = {
      activeBusdevs: res.rows[0]?.active_busdevs ?? 0,
      hasConvertFn: Boolean(res.rows[0]?.has_convert_fn),
    };
  } catch (err) {
    error = (err as Error).message;
    latencyMs = Date.now() - t0;
  }

  const healthy =
    !error &&
    db !== null &&
    db.activeBusdevs > 0 &&
    db.hasConvertFn &&
    latencyMs <= slowMs;

  const body = {
    status: healthy ? 'ok' : 'error',
    checkedAt,
    latencyMs,
    slowThresholdMs: slowMs,
    db: db ?? null,
    error,
  };

  if (!healthy) {
    console.error('[health/round-robin] TIDAK SEHAT:', JSON.stringify(body));
    const webhookUrl = process.env.HEALTH_ALERT_WEBHOOK_URL;
    if (webhookUrl) {
      await notify(webhookUrl, {
        text: `🚨 [Dreamlab] Round-robin TIDAK SEHAT!\n• status: ${error ? 'DB error' : db?.activeBusdevs === 0 ? 'tidak ada CS aktif' : !db?.hasConvertFn ? 'migration belum diterapkan' : `lambat (${latencyMs}ms)`}\n• latency: ${latencyMs}ms (threshold ${slowMs}ms)\n• waktu: ${checkedAt}`,
      });
    }
  }

  return NextResponse.json(body, {
    status: healthy ? 200 : 500,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}