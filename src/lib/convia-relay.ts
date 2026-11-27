/**
 * Relay webhook Convia ke NexERP (CR-185 R08, opsi B).
 *
 * Situs ini tetap penerima utama webhook Convia. Setelah tanda tangan lolos, badan mentah + tanda tangan ASLI
 * diteruskan apa adanya ke ERP dengan header `x-convia-relay: dreamlab-site`. ERP memverifikasi ulang tanda tangan
 * yang sama dan hanya mencatat percakapan (pesan pelanggan + balasan owner/sales) ke Chat WABA ERP; ERP tidak
 * membuat lead atau membagi BusDev dari salinan ini.
 *
 * Aman untuk jalur utama: dijalankan lewat after() (tidak menahan balasan ke Convia), batas waktu 5 detik,
 * semua galat ditelan. Matikan dengan env NEXERP_CONVIA_RELAY=off.
 */

export const DEFAULT_NEXERP_CONVIA_URL = 'https://nexerp.id/api/lead-monitor/public/lead-capture/convia';
const SIGNATURE_HEADERS = ['x-webhook-signature', 'x-convia-signature', 'x-webhook-event', 'content-type'] as const;

type Env = Record<string, string | undefined>;
type HeaderBag = { get(name: string): string | null };

/** URL tujuan relay, atau null bila relay dimatikan. */
export function relayTarget(env: Env = process.env): string | null {
  const flag = (env.NEXERP_CONVIA_RELAY || '').trim().toLowerCase();
  if (flag === 'off' || flag === '0' || flag === 'false') return null;
  const url = (env.NEXERP_CONVIA_RELAY_URL || '').trim() || DEFAULT_NEXERP_CONVIA_URL;
  return /^https:\/\//i.test(url) ? url : null;
}

/** Header yang ikut diteruskan: hanya tanda tangan + jenis konten, ditambah penanda relay. */
export function relayHeaders(src: HeaderBag): Record<string, string> {
  const out: Record<string, string> = { 'x-convia-relay': 'dreamlab-site' };
  for (const k of SIGNATURE_HEADERS) {
    const v = src.get(k);
    if (v) out[k] = v;
  }
  if (!out['content-type']) out['content-type'] = 'application/json';
  return out;
}

export async function relayToNexerp(
  rawBody: string,
  headers: HeaderBag,
  opts: { env?: Env; fetchImpl?: typeof fetch; timeoutMs?: number } = {}
): Promise<{ sent: boolean; status?: number; error?: string }> {
  const url = relayTarget(opts.env);
  if (!url) return { sent: false, error: 'relay off' };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 5000);
  try {
    const res = await (opts.fetchImpl ?? fetch)(url, {
      method: 'POST',
      headers: relayHeaders(headers),
      body: rawBody,
      signal: ctrl.signal,
      cache: 'no-store',
    });
    if (!res.ok) console.warn(`[convia/relay-nexerp] ERP membalas ${res.status}`);
    return { sent: true, status: res.status };
  } catch (e: any) {
    console.warn('[convia/relay-nexerp] gagal meneruskan:', e?.name === 'AbortError' ? 'timeout' : e?.message || e);
    return { sent: false, error: String(e?.message || e) };
  } finally {
    clearTimeout(timer);
  }
}
