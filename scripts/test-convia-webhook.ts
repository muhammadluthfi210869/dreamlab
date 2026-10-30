/**
 * Tes unit untuk src/lib/convia-webhook.ts (tanpa jaringan, tanpa DB).
 * Jalankan: npx tsx scripts/test-convia-webhook.ts
 * Payload contoh diambil dari docs.convia.id (developers & gateway-events-api).
 */
import crypto from 'node:crypto';
import { normalizeConviaEvent, skipReason, verifyConviaSignature } from '../src/lib/convia-webhook';

let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : '  ' + JSON.stringify(detail)}`);
};

const SECRET = 'test-secret-123';
const headers = (h: Record<string, string>) => ({ get: (n: string) => h[n.toLowerCase()] ?? null });
const sign = (raw: string) => crypto.createHmac('sha256', SECRET).update(raw).digest('hex');

const crm = (over: Record<string, unknown> = {}, top: Record<string, unknown> = {}) => ({
  event_type: 'message.received',
  event_id: 'uuid-1',
  schema_version: '1.1.0',
  data: {
    message_id: 'cm_abc',
    customer_phone: '6281234567890',
    customer_name: 'Budi',
    direction: 'inbound',
    message_type: 'text',
    content: 'Halo kak [Kode: DL-ABC123]',
    channel: 'whatsapp',
    business_phone: '+62 877-1223-2389',
    wam_id: 'wamid.XYZ',
    is_history_message: false,
    ...over,
  },
  ...top,
});

// --- tanda tangan
const raw = JSON.stringify(crm());
check('CRM: sha256=<hex> valid', verifyConviaSignature(raw, headers({ 'x-webhook-signature': 'sha256=' + sign(raw) }), SECRET));
check('Forwarding: hex polos valid', verifyConviaSignature(raw, headers({ 'x-convia-signature': sign(raw) }), SECRET));
check('tanda tangan salah ditolak', !verifyConviaSignature(raw, headers({ 'x-webhook-signature': 'sha256=' + '0'.repeat(64) }), SECRET));
check('body diubah 1 karakter ditolak', !verifyConviaSignature(raw + ' ', headers({ 'x-webhook-signature': 'sha256=' + sign(raw) }), SECRET));
check('tanpa header ditolak', !verifyConviaSignature(raw, headers({}), SECRET));
check('secret kosong = gagal-tertutup', !verifyConviaSignature(raw, headers({ 'x-webhook-signature': 'sha256=' + sign(raw) }), ''));
check('header panjang beda tidak melempar error', !verifyConviaSignature(raw, headers({ 'x-webhook-signature': 'sha256=abc' }), SECRET));

// --- normalisasi CRM
const n = normalizeConviaEvent(crm());
check('CRM dinormalisasi', !!n && n.shape === 'crm' && n.phone === '6281234567890' && n.wamid === 'wamid.XYZ' && n.businessPhone === '+62 877-1223-2389', n);
check('CRM chat berkode diproses', !!n && skipReason(n) === null);

// --- normalisasi Forwarding (contoh dari docs)
const fwd = {
  id: 'evt_01', type: 'message.received',
  source: { channel: 'whatsapp', identifier: '747476801793002', identifierDisplay: '+62 877-1223-2389' },
  data: { contact: { id: '628987654321', name: 'Customer' }, message: { id: 'wamid.F1', type: 'text', text: 'CHECK [Kode: DL-1]' } },
};
const f = normalizeConviaEvent(fwd);
check('Forwarding dinormalisasi', !!f && f.shape === 'forwarding' && f.phoneNumberId === '747476801793002' && f.phone === '628987654321', f);
check('Forwarding diproses', !!f && skipReason(f) === null);

// --- yang harus dilewati
const reason = (e: unknown) => { const x = normalizeConviaEvent(e); return x ? skipReason(x) : 'unknown-shape'; };
check('pesan riwayat (coexistence sync) dilewati', reason(crm({ is_history_message: true })) === 'history-sync');
check('pesan keluar dilewati', reason(crm({ direction: 'outbound' })) === 'not-inbound');
check('event status dilewati', reason(crm({}, { event_type: 'message.delivered' })) === 'not-message-received');
check('Instagram dilewati', reason(crm({ channel: 'instagram' })) === 'not-whatsapp');
check('revoke dilewati', reason(crm({ message_type: 'revoke', content: null })) === 'non-chat-message');
check('edit dilewati', reason(crm({ message_type: 'edit' })) === 'non-chat-message');
check('pesan kosong dilewati', reason(crm({ content: null })) === 'empty');
check('payload test/tidak dikenal -> null', normalizeConviaEvent({ hello: 'world' }) === null && normalizeConviaEvent(null) === null);

console.log(failed === 0 ? '\nSEMUA LOLOS' : `\n${failed} GAGAL`);
process.exit(failed === 0 ? 0 : 1);
