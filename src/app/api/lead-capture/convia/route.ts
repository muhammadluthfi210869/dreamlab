import { NextRequest, NextResponse } from 'next/server';
import { POST as confirmLead } from '../confirm/route';
import {
  normalizeConviaEvent,
  skipReason,
  verifyConviaSignature,
} from '@/lib/convia-webhook';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

const reply = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status, headers: NO_STORE_HEADERS });

/**
 * GET /api/lead-capture/convia
 * Health check (tanpa data sensitif) supaya endpoint bisa dicek dari browser.
 */
export async function GET() {
  return reply({ status: 'ok', message: 'Convia webhook receiver active' });
}

/**
 * POST /api/lead-capture/convia
 *
 * Menerima webhook Convia (WhatsApp Coexistence) untuk nomor yang tidak punya
 * jalur webhook Meta langsung ke situs ini (mis. Jessica). Setelah tanda tangan
 * terverifikasi, pesan masuk diubah ke format bridge dan diteruskan ke logika
 * konfirmasi yang sama dengan jalur Meta (/api/lead-capture/confirm), jadi aturan
 * ghost-notification, hanya-chat-pertama-berkode, dan dedup wamid/nomor 24 jam
 * berlaku identik.
 *
 * Status balasan: 2xx untuk semua event yang sah (termasuk yang dilewati),
 * supaya Convia tidak mengulang kiriman dan tidak menonaktifkan webhook.
 * 401 hanya untuk tanda tangan salah; 5xx hanya untuk kegagalan yang layak diulang.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CONVIA_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[convia] CONVIA_WEBHOOK_SECRET belum di-set; semua event ditolak.');
    return reply({ success: false, error: 'webhook secret not configured' }, 500);
  }

  const rawBody = await req.text();
  if (!verifyConviaSignature(rawBody, req.headers, secret)) {
    return reply({ success: false, error: 'invalid signature' }, 401);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return reply({ success: true, ignored: true, reason: 'body bukan JSON' });
  }

  const ev = normalizeConviaEvent(body);
  if (!ev) {
    // Termasuk payload "Test" dari dashboard Convia.
    return reply({ success: true, ignored: true, reason: 'bentuk payload tidak dikenal / test event' });
  }

  const skip = skipReason(ev);
  const tag = `[convia] ${ev.shape} ${ev.eventType} ...${(ev.businessPhone || '').replace(/\D/g, '').slice(-4)}`;
  if (skip) {
    console.log(`${tag} dilewati: ${skip}`);
    return reply({ success: true, ignored: true, reason: skip });
  }

  // Dedup wamid dilakukan di confirmLead (tabel processed_webhook_messages), jadi
  // pesan yang sama yang juga datang lewat jalur Meta/ERP tidak terhitung dua kali.
  const bridgePayload = {
    phone: ev.phone,
    waName: ev.name,
    message: ev.text,
    wamid: ev.wamid || (ev.messageId ? `convia:${ev.messageId}` : null),
    destinationPhone: ev.businessPhone,
    phoneNumberId: ev.phoneNumberId,
  };

  const bridgeReq = new NextRequest(new URL('/api/lead-capture/confirm', req.url), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      // Melewati cek signature Meta (sudah diverifikasi di atas) dan mencegah
      // forward balik ke NexERP.
      'x-forwarded-from': 'nexerp',
    },
    body: JSON.stringify(bridgePayload),
  });

  const res = await confirmLead(bridgeReq);
  const result: any = await res.json().catch(() => ({}));

  if (res.status >= 500) {
    console.error(`${tag} confirm gagal (${res.status}):`, result?.error);
    return reply({ success: false, error: 'confirm failed' }, 500);
  }

  console.log(
    `${tag} -> ${result?.ignored ? `abaikan (${String(result.reason || '').slice(0, 60)})` : result?.dedup ? 'dedup' : 'confirmed'}`
  );
  return reply({
    success: true,
    ignored: !!result?.ignored,
    dedup: !!result?.dedup,
    assignedTo: result?.assignedTo ?? null,
  });
}
