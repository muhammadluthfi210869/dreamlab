/**
 * Tes unit relay webhook Convia → NexERP (tanpa jaringan).
 * Jalankan: npx tsx scripts/test-convia-relay.ts
 */
import { DEFAULT_NEXERP_CONVIA_URL, relayHeaders, relayTarget, relayToNexerp } from '../src/lib/convia-relay';

let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : '  ' + JSON.stringify(detail)}`);
};
const headers = (h: Record<string, string>) => ({ get: (n: string) => h[n.toLowerCase()] ?? null });

async function main() {
  check('default ke ERP produksi', relayTarget({}) === DEFAULT_NEXERP_CONVIA_URL);
  check('bisa dimatikan (off)', relayTarget({ NEXERP_CONVIA_RELAY: 'off' }) === null);
  check('URL non-https ditolak', relayTarget({ NEXERP_CONVIA_RELAY_URL: 'http://x' }) === null);
  check('URL kustom https dipakai', relayTarget({ NEXERP_CONVIA_RELAY_URL: 'https://a.test/x' }) === 'https://a.test/x');

  const h = relayHeaders(headers({ 'x-webhook-signature': 'sha256=abc', cookie: 'rahasia', authorization: 'x' }));
  check('tanda tangan + penanda relay ikut', h['x-webhook-signature'] === 'sha256=abc' && h['x-convia-relay'] === 'dreamlab-site', h);
  check('cookie/authorization tidak ikut', !('cookie' in h) && !('authorization' in h), h);

  let seen: { url?: string; body?: string; headers?: any } = {};
  const okFetch = (async (url: string, init: any) => {
    seen = { url, body: init.body, headers: init.headers };
    return new Response('{}', { status: 200 });
  }) as unknown as typeof fetch;
  const raw = '{"event_type":"message.sent","data":{"content":"halo"}}';
  const r = await relayToNexerp(raw, headers({ 'x-webhook-signature': 'sha256=abc' }), { env: {}, fetchImpl: okFetch });
  check('badan mentah diteruskan byte-per-byte', r.sent && seen.body === raw && seen.url === DEFAULT_NEXERP_CONVIA_URL, { r, seen });

  const boom = (async () => { throw new Error('ECONNREFUSED'); }) as unknown as typeof fetch;
  const r2 = await relayToNexerp(raw, headers({}), { env: {}, fetchImpl: boom });
  check('galat jaringan ditelan (tidak melempar)', r2.sent === false);

  const hang = ((_u: string, init: any) => new Promise((_res, rej) => init.signal.addEventListener('abort', () => rej(Object.assign(new Error('aborted'), { name: 'AbortError' }))))) as unknown as typeof fetch;
  const t0 = Date.now();
  const r3 = await relayToNexerp(raw, headers({}), { env: {}, fetchImpl: hang, timeoutMs: 50 });
  check('timeout memutus kiriman yang menggantung', r3.sent === false && Date.now() - t0 < 2000);

  const r4 = await relayToNexerp(raw, headers({}), { env: { NEXERP_CONVIA_RELAY: 'off' }, fetchImpl: okFetch });
  check('relay off tidak mengirim apa pun', r4.sent === false && r4.error === 'relay off');

  console.log(failed ? `\n${failed} GAGAL` : '\nSEMUA LULUS');
  process.exit(failed ? 1 : 0);
}
main();
