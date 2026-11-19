/**
 * Bandingkan record DNS antara dua nameserver (mis. Qwords vs Cloudflare) untuk domain Dreamlab.
 *
 *   node scripts/dns-compare.mjs dnsiix1.qwords.net <nameserver-cloudflare-anda>
 *   node scripts/dns-compare.mjs dnsiix1.qwords.net 1.1.1.1                 (uji skrip saja)
 *   node scripts/dns-compare.mjs <ns-A> <ns-B> --extra=mail,api.contoh     (subdomain tambahan)
 *
 * Mengirim pertanyaan LANGSUNG ke tiap nameserver (bukan lewat resolver publik), jadi bisa dipakai SEBELUM nameserver
 * di registrar diganti: zona Cloudflare yang masih "pending" sudah menjawab di nameserver yang ditetapkan Cloudflare.
 * Keluar dengan kode 1 bila ada perbedaan.
 */
import dns from 'node:dns/promises';

const DOMAIN = process.env.DNS_DOMAIN || 'dreamlab.id';
const [a, b] = process.argv.slice(2).filter((x) => !x.startsWith('--'));
if (!a || !b) { console.error('Pemakaian: node scripts/dns-compare.mjs <nameserver-A> <nameserver-B> [--extra=sub1,sub2]'); process.exit(2); }
const extra = (process.argv.find((x) => x.startsWith('--extra=')) || '').slice(8).split(',').filter(Boolean);

const SUBS = ['', 'www', '_dmarc', 'google._domainkey', '_acme-challenge', 'mail', 'webmail', 'cpanel', 'ftp', ...extra];
const TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'CAA', 'NS'];

async function resolverFor(host) {
  const ip = /^[\d.]+$/.test(host) ? host : (await dns.resolve4(host))[0];
  const r = new dns.Resolver({ timeout: 4000, tries: 2 });
  r.setServers([ip]);
  return { r, ip };
}
const norm = (type, v) => {
  if (type === 'MX') return v.map((x) => `${x.priority} ${x.exchange.toLowerCase().replace(/\.$/, '')}`).sort();
  if (type === 'TXT') return v.map((x) => x.join('')).sort();
  if (type === 'SOA') return [JSON.stringify(v)];
  if (type === 'CAA') return v.map((x) => JSON.stringify(x)).sort();
  // Alamat 64:ff9b:: adalah hasil sintetis NAT64/DNS64 dari jaringan tertentu, bukan record asli: diabaikan.
  if (type === 'AAAA') return v.filter((x) => !/^64:ff9b:/i.test(x)).map((x) => String(x).toLowerCase()).sort();
  return v.map((x) => String(x).toLowerCase().replace(/\.$/, '')).sort();
};
async function ask(r, name, type) {
  try { return norm(type, await r.resolve(name, type)); }
  catch (e) { return ['ENODATA', 'ENOTFOUND'].includes(e.code) ? [] : [`(galat: ${e.code})`]; }
}

const A = await resolverFor(a);
const B = await resolverFor(b);
console.log(`Membandingkan ${DOMAIN}:  A=${a} (${A.ip})   B=${b} (${B.ip})\n`);
let diffs = 0, same = 0;
for (const sub of SUBS) {
  const name = sub ? `${sub}.${DOMAIN}` : DOMAIN;
  for (const type of TYPES) {
    if (type === 'NS' && sub) continue; // NS hanya di apex
    const [x, y] = [await ask(A.r, name, type), await ask(B.r, name, type)];
    if (type === 'NS') continue; // NS memang berbeda antar penyedia; bukan bagian yang disalin
    if (!x.length && !y.length) continue;
    if (JSON.stringify(x) === JSON.stringify(y)) { same++; console.log(`SAMA     ${name} ${type}  ${x.join(' ; ').slice(0, 80)}`); }
    else { diffs++; console.log(`BEDA     ${name} ${type}\n           A: ${x.join(' ; ') || '(kosong)'}\n           B: ${y.join(' ; ') || '(kosong)'}`); }
  }
}
console.log(`\n${same} record sama, ${diffs} berbeda.`);
process.exit(diffs ? 1 : 0);
