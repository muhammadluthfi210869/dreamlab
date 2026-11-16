import { NextRequest, NextResponse } from 'next/server';
import { getMonitorPool } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

const reply200 = (body: Record<string, unknown>) =>
  NextResponse.json(body, { status: 200, headers: NO_STORE_HEADERS });

let tableEnsured = false;

async function ensureLogTable() {
  if (tableEnsured) return;
  const pool = getMonitorPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS convia_webhook_log (
      id          BIGSERIAL PRIMARY KEY,
      event_type  TEXT,
      headers     JSONB,
      payload     JSONB,
      raw_body    TEXT NOT NULL DEFAULT '',
      received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  tableEnsured = true;
}

/**
 * GET /api/crm/convia/webhook
 * Health check publik (selalu membalas 200).
 */
export async function GET() {
  return reply200({
    ok: true,
    status: 'active',
    endpoint: '/api/crm/convia/webhook',
  });
}

/**
 * POST /api/crm/convia/webhook
 * Menerima POST dari Convia, menyimpan isi data mentah ke tabel `convia_webhook_log`,
 * dan selalu membalas status 200 tanpa memproses bisnis logika dulu.
 */
export async function POST(req: NextRequest) {
  let rawBody = '';
  try {
    rawBody = await req.text();
  } catch {
    rawBody = '';
  }

  let parsedPayload: Record<string, unknown> | null = null;
  let eventType: string | null = null;
  if (rawBody) {
    try {
      const json = JSON.parse(rawBody);
      if (json && typeof json === 'object') {
        parsedPayload = json as Record<string, unknown>;
        const rawEvt =
          (json as any).event_type ??
          (json as any).type ??
          (json as any).event ??
          req.headers.get('x-webhook-event') ??
          req.headers.get('x-convia-event');
        if (typeof rawEvt === 'string' && rawEvt.trim()) {
          eventType = rawEvt.trim();
        }
      }
    } catch {
      parsedPayload = null;
    }
  }

  // Simpan metadata header non-rahasia (termasuk nama header signature untuk inspeksi format)
  const safeHeaders: Record<string, string> = {};
  const headerKeys = [
    'content-type',
    'user-agent',
    'x-webhook-signature',
    'x-convia-signature',
    'x-hub-signature-256',
    'x-webhook-event',
    'x-convia-event',
    'x-webhook-id',
    'x-Webhook-timestamp',
  ];
  for (const k of headerKeys) {
    const v = req.headers.get(k);
    if (v) safeHeaders[k.toLowerCase()] = v;
  }

  try {
    await ensureLogTable();
    const pool = getMonitorPool();
    await pool.query(
      `INSERT INTO convia_webhook_log (event_type, headers, payload, raw_body, received_at)
       VALUES ($1, $2::jsonb, $3::jsonb, $4, NOW())`,
      [
        eventType,
        JSON.stringify(safeHeaders),
        parsedPayload ? JSON.stringify(parsedPayload) : null,
        rawBody,
      ]
    );
  } catch (err: any) {
    // Tetap balas 200 agar Convia tidak menonaktifkan webhook
    console.error('[crm/convia/webhook] gagal menyimpan log:', err?.message);
  }

  return reply200({
    ok: true,
    received: true,
    event_type: eventType,
  });
}

