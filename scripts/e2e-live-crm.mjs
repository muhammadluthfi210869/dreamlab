/**
 * Uji ujung-ke-ujung #2.1-2.4 terhadap situs LIVE (dreamlab.id) dengan data uji yang DIBERSIHKAN di akhir.
 *
 *   node scripts/e2e-live-crm.mjs          (butuh .env.local berisi DATABASE_URL untuk pembersihan + cek stage)
 *
 * Alur: klik tombol WhatsApp -> entri klik tanpa nomor -> pesan masuk berkode -> nomor tampil -> balasan lead
 * (teks + gambar) muncul di percakapan yang sama -> balasan sales -> otomatis Warm di pesan ke-5 (dua arah)
 * -> reminder tampil untuk PIC -> sales lain tidak boleh mengubah lead bukan miliknya.
 * Nomor uji 6280000099xxx (bukan nomor asli); semua baris uji dihapus lewat kode/nomor/visitor uji.
 */
import fs from 'node:fs';
import pg from 'pg';

const B = process.env.E2E_BASE || 'https://dreamlab.id';
const TS = Date.now().toString(36);
const PHONE = '6280000099' + String(Date.now()).slice(-3);
const VID = `e2e-uji-${TS}`;
const PAGE = `https://dreamlab.id/e2e-uji-${TS}`;
let pass = 0, fail = 0;
const ok = (c, name, extra = '') => { (c ? pass++ : fail++); console.log(`${c ? 'PASS' : 'FAIL'}  ${name}${extra ? '  ' + extra : ''}`); return c; };

const env = fs.readFileSync('.env.local', 'utf8');
const dbUrl = env.match(/^DATABASE_URL=(.+)$/m)[1].trim().replace(/^["']|["']$/g, '');
const db = new pg.Client({ connectionString: dbUrl, ssl: false });

async function login(name, password) {
  const r = await fetch(B + '/api/crm/auth/login', { method: 'POST', headers: { Origin: B, 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password, remember: false }) });
  const j = await r.json().catch(() => ({}));
  return { ok: j.success === true, cookie: (r.headers.getSetCookie?.() || []).map((c) => c.split(';')[0]).join('; ') };
}
const api = (cookie, path, opts = {}) => fetch(B + path, { ...opts, headers: { Origin: B, cookie, 'Content-Type': 'application/json', ...(opts.headers || {}) } });
const bridge = (body) => fetch(B + '/api/lead-capture/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-from': 'nexerp' }, body: JSON.stringify(body) }).then((r) => r.json());
const today = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
const findRow = async (cookie, code) => {
  const r = await (await api(cookie, `/api/lead-monitor/stats?startDate=${today}&endDate=${today}&tab=all&search=${encodeURIComponent(code)}&pageSize=25&_=${Date.now()}`)).json(); // _ = lewati cache respons 8 detik
  return (r.table?.rows || []).find((x) => x.tracking_code === code) || null;
};
const messages = async (cookie) => (await (await api(cookie, `/api/crm/chat?phone=${PHONE}`)).json()).messages || [];
const stageDb = async (code) => (await db.query(`SELECT stage FROM crm_lead_state WHERE tracking_code = $1`, [code])).rows[0]?.stage ?? null;

let code = null;
async function cleanup() {
  const q = (s, p) => db.query(s, p).then((r) => r.rowCount).catch((e) => `ERR ${e.message}`);
  const out = {
    followups: code ? await q(`DELETE FROM crm_followups WHERE tracking_code = $1`, [code]) : 0,
    history: code ? await q(`DELETE FROM crm_stage_history WHERE tracking_code = $1`, [code]) : 0,
    state: code ? await q(`DELETE FROM crm_lead_state WHERE tracking_code = $1`, [code]) : 0,
    chat: await q(`DELETE FROM crm_chat_messages WHERE phone = $1`, [PHONE]),
    wamids: await q(`DELETE FROM processed_webhook_messages WHERE wamid LIKE $1`, [`e2e-${TS}-%`]),
    phoneAssign: await q(`DELETE FROM phone_assignments WHERE phone_number = $1`, [PHONE]),
    visitorAssign: await q(`DELETE FROM visitor_assignments WHERE visitor_id = $1`, [VID]),
    leads: await q(`DELETE FROM leads WHERE page_url = $1 OR wa_phone = $2 OR visitor_id = $3`, [PAGE, PHONE, VID]),
  };
  const left = {
    leads: (await db.query(`SELECT COUNT(*)::int n FROM leads WHERE page_url = $1 OR wa_phone = $2 OR visitor_id = $3`, [PAGE, PHONE, VID])).rows[0].n,
    chat: (await db.query(`SELECT COUNT(*)::int n FROM crm_chat_messages WHERE phone = $1`, [PHONE])).rows[0].n,
  };
  console.log('pembersihan:', JSON.stringify(out), '| sisa:', JSON.stringify(left));
  ok(left.leads === 0 && left.chat === 0, 'data uji terhapus bersih');
}

async function main() {
  await db.connect();
  const admin = await login('Admin', 'password123');
  if (!ok(admin.ok, 'login Admin')) return;

  // ---------------- 2.4 klik tombol WhatsApp -> entri klik
  const click = await (await fetch(B + '/api/lead-capture/convert', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId: VID, intent: 'wa-click', source: 'google-ads', pageUrl: PAGE, pageTitle: 'E2E uji', deviceType: 'desktop', browser: 'node' }),
  })).json();
  code = click.trackingCode;
  ok(!!code && !!click.name && click.isTest === false, 'klik tombol WA: kode tracking + PIC dari round robin', `kode=${code} PIC=${click.name}`);
  const phoneBefore = await findRow(admin.cookie, code);
  ok(!!phoneBefore && !phoneBefore.display_phone, 'entri klik tampil di CRM, belum ada nomor (sebelum pesan masuk)', phoneBefore ? `status=${phoneBefore.status}` : 'baris tidak ditemukan');
  // jadikan PIC = Annisa agar uji "PIC melihat reminder" bisa memakai akun yang tersedia
  await db.query(`UPDATE leads SET assigned_to = 'Annisa' WHERE tracking_code = $1`, [code]);

  // ---------------- 2.4 pesan masuk berkode -> nomor tampil
  const c1 = await bridge({ trackingCode: code, phone: PHONE, waName: 'E2E Uji', message: `Halo Dreamlab saya mau maklon [Kode: ${code}]`, wamid: `e2e-${TS}-1`, destinationPhone: '081952417051' });
  ok(c1.success === true && !c1.ignored, 'pesan masuk berkode diterima & lead terkonfirmasi', JSON.stringify(c1).slice(0, 90));
  const after = await findRow(admin.cookie, code);
  ok(after?.display_phone === PHONE && after?.phone_from === 'WA' && after?.status === 'confirmed', 'NOMOR LEAD TAMPIL di CRM setelah pesan masuk (sumber WA)', `nomor=${after?.display_phone} status=${after?.status}`);

  // ---------------- 2.1 balasan lead muncul di percakapan yang sesuai
  const list0 = await (await api(admin.cookie, '/api/crm/chat')).json();
  ok(list0.conversations.filter((c) => c.phone === PHONE).length === 1, 'percakapan lead ada tepat 1 kali di daftar');
  const r2 = await bridge({ phone: PHONE, waName: 'E2E Uji', message: 'Balasan kedua dari lead', wamid: `e2e-${TS}-2` });
  const r3 = await bridge({ phone: PHONE, waName: 'E2E Uji', message: 'Berapa MOQ-nya?', wamid: `e2e-${TS}-3` });
  ok(r2.success && r3.success, 'balasan lanjutan lead (tanpa kode) diterima');
  let msgs = await messages(admin.cookie);
  ok(msgs.filter((m) => m.direction === 'inbound').length === 3, 'ketiga pesan masuk muncul di percakapan nomor itu', `inbound=${msgs.filter((m) => m.direction === 'inbound').length}`);
  ok(msgs.every((m) => m.phone === PHONE), 'tidak ada pesan nyasar dari nomor lain di percakapan');
  ok((await stageDb(code)) === null, '3 pesan: belum pindah Warm');

  // gambar tanpa teks (format Meta)
  const meta = (extra) => fetch(B + '/api/lead-capture/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-from': 'nexerp' }, body: JSON.stringify({ object: 'whatsapp_business_account', ...extra }) }).then((r) => r.json());
  const img = await meta({ entry: [{ changes: [{ field: 'messages', value: { metadata: { display_phone_number: '6281952417051' }, contacts: [{ profile: { name: 'E2E Uji' } }], messages: [{ from: PHONE, id: `e2e-${TS}-4`, type: 'image', image: { id: 'x' } }] } }] }] });
  msgs = await messages(admin.cookie);
  ok(msgs.some((m) => m.message_text === '[Gambar]' && m.direction === 'inbound'), 'balasan lead berupa GAMBAR tampil di percakapan ("[Gambar]")', JSON.stringify(img).slice(0, 80));
  ok((await stageDb(code)) === null, '4 pesan (semua masuk): belum pindah Warm');

  // ---------------- 2.3 pesan ke-5 (keluar dari sales, dua arah) -> Warm
  const send = await (await api(admin.cookie, '/api/crm/chat', { method: 'POST', body: JSON.stringify({ phone: PHONE, tracking_code: code, message: 'Halo kak, MOQ mulai 500 pcs ya.' }) })).json();
  ok(send.success === true, 'balasan sales tersimpan di percakapan');
  const st = await stageDb(code);
  ok(st === 'warm_500', 'PESAN KE-5 (4 masuk + 1 keluar): lead otomatis masuk Warm', `stage=${st}`);
  const hist = (await db.query(`SELECT from_stage,to_stage,changed_by FROM crm_stage_history WHERE tracking_code = $1`, [code])).rows;
  ok(hist.length === 1 && hist[0].changed_by === 'sistem (otomasi Warm)', 'riwayat perpindahan dicatat oleh sistem', JSON.stringify(hist));
  // echo sales dari WhatsApp Business (Meta coexistence) ikut tercatat dan tidak menarik lead mundur
  const echo = await meta({ entry: [{ changes: [{ field: 'smb_message_echoes', value: { metadata: { display_phone_number: '6281952417051' }, message_echoes: [{ from: '6281952417051', to: PHONE, id: `e2e-${TS}-5`, type: 'text', text: { body: 'Baik kak, saya kirim penawarannya.' } }] } }] }] });
  msgs = await messages(admin.cookie);
  ok(echo.recorded === true && msgs.some((m) => m.direction === 'outbound' && /penawarannya/.test(m.message_text)), 'balasan sales dari WhatsApp Business (echo) ikut tercatat di percakapan');
  ok((await stageDb(code)) === 'warm_500', 'pesan berikutnya: tetap Warm (tidak mundur / tidak ganda)');
  await db.query(`UPDATE crm_lead_state SET stage = 'hot' WHERE tracking_code = $1`, [code]);
  await bridge({ phone: PHONE, message: 'lagi 1', wamid: `e2e-${TS}-6` });
  await bridge({ phone: PHONE, message: 'lagi 2', wamid: `e2e-${TS}-7` });
  ok((await stageDb(code)) === 'hot', 'lead yang sudah Hot TIDAK kembali ke Warm walau ada pesan baru');
  await db.query(`UPDATE crm_lead_state SET stage = 'warm_500' WHERE tracking_code = $1`, [code]);

  // ---------------- 2.2 reminder untuk PIC
  const annisa = await login('Annisa', 'password123');
  ok(annisa.ok, 'login Annisa (PIC)');
  const rem = await (await api(annisa.cookie, '/api/crm/reminders')).json();
  const mine = (rem.reminders || []).find((r) => r.tracking_code === code);
  ok(rem.success && !!mine, 'PIC melihat jadwal reminder untuk lead Warm miliknya', mine ? `${mine.stage} | ${mine.due_source} | ${mine.state}` : JSON.stringify(rem).slice(0, 120));
  ok((rem.reminders || []).every((r) => (r.pic || '').toLowerCase() === 'annisa'), 'PIC hanya melihat lead miliknya', `${(rem.reminders || []).length} lead`);
  const due = new Date(Date.now() + 2 * 86400e3 + 7 * 3600e3).toISOString().slice(0, 10);
  const sch = await (await api(annisa.cookie, '/api/crm/reminders', { method: 'POST', body: JSON.stringify({ tracking_code: code, due_at: due, note: 'kirim penawaran' }) })).json();
  const rem2 = (await (await api(annisa.cookie, '/api/crm/reminders')).json()).reminders.find((r) => r.tracking_code === code);
  ok(sch.success && rem2?.due_source === 'manual' && rem2?.note === 'kirim penawaran' && rem2?.state === 'upcoming', 'PIC menjadwalkan reminder manual, tampil di daftar');
  const done = await (await api(annisa.cookie, '/api/crm/reminders', { method: 'PATCH', body: JSON.stringify({ tracking_code: code, action: 'done' }) })).json();
  const rem3 = (await (await api(annisa.cookie, '/api/crm/reminders')).json()).reminders.find((r) => r.tracking_code === code);
  ok(done.success && rem3?.due_source === 'otomatis', '"Sudah follow-up": jadwal otomatis berjalan lagi');
  const adm = await (await api(admin.cookie, '/api/crm/reminders')).json();
  ok(adm.success && adm.reminders.some((r) => r.tracking_code === code), 'Head/Admin melihat reminder semua PIC', `${adm.reminders.length} lead, PIC: ${adm.pics.join(', ')}`);
  const others = adm.reminders.find((r) => (r.pic || '').toLowerCase() !== 'annisa');
  if (others) {
    const forb = await api(annisa.cookie, '/api/crm/reminders', { method: 'PATCH', body: JSON.stringify({ tracking_code: others.tracking_code, action: 'done' }) });
    ok(forb.status === 403, 'sales TIDAK bisa mengubah reminder lead milik PIC lain (403)', `status=${forb.status}`);
  } else console.log('SKIP  tidak ada lead PIC lain di daftar untuk uji izin (ditutup oleh uji SQL/unit)');
  const noAuth = await fetch(B + '/api/crm/reminders');
  ok(noAuth.status === 401, 'tanpa login ditolak (401)');
  await fetch(B + '/api/crm/auth/logout', { method: 'POST', headers: { Origin: B, cookie: annisa.cookie } });
  await fetch(B + '/api/crm/auth/logout', { method: 'POST', headers: { Origin: B, cookie: admin.cookie } });
}

main()
  .catch((e) => { fail++; console.error('GAGAL', e); })
  .finally(async () => { try { await cleanup(); } catch (e) { console.error('cleanup error', e); } await db.end().catch(() => {}); console.log(`\n${pass} lulus, ${fail} gagal`); process.exit(fail ? 1 : 0); });
