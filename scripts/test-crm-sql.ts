/**
 * Uji SQL CRM di Postgres SUNGGUHAN yang berjalan di memori (PGlite): tidak menyentuh database mana pun.
 *
 *   npm run test:crm-sql
 *
 * Mencakup #2.1 (daftar percakapan tanpa duplikat, pesan dua arah), #2.2 (query + migrasi reminder),
 * dan #2.3 (otomasi Warm dua arah). Query diambil LANGSUNG dari kode route (bukan salinan) supaya yang diuji = yang jalan.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import type { Pool } from 'pg';
import { applyAutoWarm } from '../src/lib/crm-auto-warm';
import { recordChatMessage } from '../src/lib/crm-chat-capture';
import { computeReminder, REMINDER_DB_STAGES } from '../src/lib/crm-reminders';

const db = new PGlite();
const wrap = async (sql: string, params?: unknown[]) => {
  const r = await db.query(sql, params as any[]);
  return { rows: r.rows as any[], rowCount: r.affectedRows ?? r.rows.length };
};
// Adaptor tipis: bentuk yang dipakai kode produksi (pool.query / pool.connect().query/release).
const pool = { query: wrap, connect: async () => ({ query: wrap, release() { /* tidak ada pool */ } }) } as unknown as Pool;

let n = 0;
const ok = (name: string) => { n++; console.log(`ok  ${name}`); };
const read = (f: string) => fs.readFileSync(path.resolve(f), 'utf8');

async function setup() {
  await db.exec(`
    CREATE TABLE leads (id SERIAL PRIMARY KEY, tracking_code TEXT UNIQUE, wa_phone TEXT, hp TEXT, whatsapp_phone_e164 TEXT, status TEXT, is_test BOOLEAN DEFAULT FALSE,
      nama TEXT, wa_profile_name TEXT, assigned_to TEXT, produk TEXT, source TEXT, requested_quantity_pcs INT,
      perusahaan TEXT, utm_source TEXT, utm_campaign TEXT, page_title TEXT, page_url TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), confirmed_at TIMESTAMPTZ);
    CREATE TABLE crm_lead_state (tracking_code TEXT PRIMARY KEY, stage TEXT NOT NULL DEFAULT 'traffic', produk_manual TEXT, moq_manual INT, stage_changed_at TIMESTAMPTZ, updated_by TEXT, updated_at TIMESTAMPTZ, note TEXT);
    CREATE TABLE crm_stage_history (id SERIAL PRIMARY KEY, tracking_code TEXT, from_stage TEXT, to_stage TEXT NOT NULL, changed_by TEXT, changed_at TIMESTAMPTZ DEFAULT NOW());
    CREATE TABLE crm_chat_messages (id BIGSERIAL PRIMARY KEY, tracking_code TEXT, phone TEXT NOT NULL, sender_type TEXT NOT NULL, sender_name TEXT, message_text TEXT NOT NULL,
      wamid TEXT UNIQUE, status TEXT DEFAULT 'delivered', media_url TEXT, media_type TEXT, direction TEXT NOT NULL, channel TEXT DEFAULT 'whatsapp', busdev_name TEXT, is_read BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
  `);
  // migrasi reminder = berkas SQL yang sama persis dengan yang dijalankan di produksi
  await db.exec(read('db/migrations/00033_crm_followups.sql'));
}

let seq = 0;
const msg = (phone: string, direction: 'inbound' | 'outbound', count = 1, senderType?: string, at?: string) =>
  wrap(
    `INSERT INTO crm_chat_messages (phone, sender_type, message_text, direction, wamid, created_at)
     SELECT $1, $3, 'x', $2, 'w' || nextval('crm_chat_messages_id_seq')::text || '-' || $4, COALESCE($6::timestamptz, NOW()) + (g || ' seconds')::interval FROM generate_series(1, $5::int) g`,
    [phone, direction, senderType || (direction === 'inbound' ? 'customer' : 'busdev'), `${++seq}`, count, at ?? null]
  );
const lead = (code: string, phone: string, extra: Partial<{ status: string; is_test: boolean; hp: string; qty: number; assigned: string }> = {}) =>
  wrap(`INSERT INTO leads (tracking_code, wa_phone, hp, status, is_test, requested_quantity_pcs, assigned_to, nama) VALUES ($1, $2, $3, $4, $5, $6, $7, $1)`,
    [code, extra.hp ? null : phone, extra.hp ?? null, extra.status ?? 'confirmed', extra.is_test ?? false, extra.qty ?? null, extra.assigned ?? 'Diaz']);
const stageOf = async (code: string) => (await wrap(`SELECT stage FROM crm_lead_state WHERE tracking_code = $1`, [code])).rows[0]?.stage ?? null;
const history = async (code: string) => (await wrap(`SELECT from_stage, to_stage, changed_by FROM crm_stage_history WHERE tracking_code = $1 ORDER BY id`, [code])).rows;

async function main() {
  await setup();
  ok('skema + migrasi 00033 (crm_followups) berjalan di Postgres');

  // ======================================================= #2.3 otomasi Warm dua arah
  await lead('DL-A', '6281000000001');
  await msg('6281000000001', 'inbound', 3);
  await msg('6281000000001', 'outbound', 1);
  assert.equal(await applyAutoWarm(pool, '6281000000001'), null);
  assert.equal(await stageOf('DL-A'), null);
  ok('4 pesan dua arah (3 masuk + 1 keluar): belum pindah');
  await msg('6281000000001', 'outbound', 1);
  assert.equal(await applyAutoWarm(pool, '6281000000001'), 'warm_500');
  assert.equal(await stageOf('DL-A'), 'warm_500');
  assert.deepEqual(await history('DL-A'), [{ from_stage: 'traffic', to_stage: 'warm_500', changed_by: 'sistem (otomasi Warm)' }]);
  ok('pesan ke-5 (3 masuk + 2 keluar): otomatis Warm + riwayat tercatat oleh sistem');

  assert.equal(await applyAutoWarm(pool, '6281000000001'), null);
  assert.equal((await history('DL-A')).length, 1);
  ok('dipanggil lagi: tidak ada perpindahan ganda');

  await lead('DL-B', '6281000000002');
  await msg('6281000000002', 'inbound', 5);
  assert.equal(await applyAutoWarm(pool, '6281000000002'), 'warm_500');
  ok('5 pesan masuk semua: tetap terhitung (total dua arah)');

  await lead('DL-C', '6281000000003');
  await msg('6281000000003', 'inbound', 3);
  await msg('6281000000003', 'outbound', 6, 'salesbot');
  await msg('6281000000003', 'inbound', 6, 'system');
  assert.equal(await applyAutoWarm(pool, '6281000000003'), null);
  ok('pesan salesbot/sistem tidak dihitung');

  await wrap(`INSERT INTO crm_lead_state (tracking_code, stage, stage_changed_at) VALUES ('DL-D', 'cold', NOW())`);
  await lead('DL-D', '6281000000004');
  await msg('6281000000004', 'inbound', 5);
  assert.equal(await applyAutoWarm(pool, '6281000000004'), 'warm_500');
  assert.equal((await history('DL-D'))[0].from_stage, 'cold');
  ok('Cold -> Warm');

  for (const [i, st] of ['warm_up_500', 'warm_1000', 'hot', 'sample', 'deal', 'warm_below_500', 'warm_up_1000'].entries()) {
    const code = `DL-F${i}`, phone = `62810000001${i}0`;
    await wrap(`INSERT INTO crm_lead_state (tracking_code, stage, stage_changed_at) VALUES ($1, $2, NOW())`, [code, st]);
    await lead(code, phone);
    await msg(phone, 'inbound', 8);
    await msg(phone, 'outbound', 8);
    assert.equal(await applyAutoWarm(pool, phone), null, st);
    assert.equal(await stageOf(code), st, st);
    assert.equal((await history(code)).length, 0, st);
  }
  ok('lead di Warm Up 500 / Warm 1000 / Hot / Sample / Deal / nama lama TIDAK pernah kembali ke Warm');

  await lead('DL-M1', '6281000000021'); await wrap(`INSERT INTO crm_lead_state (tracking_code, stage, moq_manual) VALUES ('DL-M1', 'traffic', 800)`);
  await msg('6281000000021', 'inbound', 5);
  assert.equal(await applyAutoWarm(pool, '6281000000021'), 'warm_up_500');
  await lead('DL-M2', '6281000000022', { qty: 1200 });
  await msg('6281000000022', 'inbound', 5);
  assert.equal(await applyAutoWarm(pool, '6281000000022'), 'warm_1000');
  await lead('DL-M3', '6281000000023', { qty: 1200 }); await wrap(`INSERT INTO crm_lead_state (tracking_code, stage, moq_manual) VALUES ('DL-M3', 'traffic', 300)`);
  await msg('6281000000023', 'inbound', 5);
  assert.equal(await applyAutoWarm(pool, '6281000000023'), 'warm_500');
  ok('pilihan Warm dari MOQ: manual 800 -> Up 500; form 1200 -> 1000; manual menang atas form');

  await lead('DL-T', '6281000000031', { is_test: true });
  await msg('6281000000031', 'inbound', 6);
  assert.equal(await applyAutoWarm(pool, '6281000000031'), null);
  await lead('DL-S', '6281000000032', { status: 'assigned' });
  await msg('6281000000032', 'inbound', 6);
  assert.equal(await applyAutoWarm(pool, '6281000000032'), null);
  ok('lead uji dan lead yang belum terkonfirmasi (hanya klik) diabaikan');

  await lead('DL-H', '', { hp: '081000000041' });
  await msg('6281000000041', 'inbound', 5);
  assert.equal(await applyAutoWarm(pool, '6281000000041'), 'warm_500');
  ok('nomor form 0812.. cocok dengan nomor chat 62812..');

  // ======================================================= #2.1 penyimpanan pesan + daftar percakapan
  const phoneX = '6281000000051';
  assert.equal(await recordChatMessage(pool, { phone: phoneX, direction: 'inbound', text: '[Gambar]', wamid: 'wx1', trackingCode: 'DL-X1', senderName: 'Rina' }), true);
  assert.equal(await recordChatMessage(pool, { phone: phoneX, direction: 'inbound', text: '[Gambar]', wamid: 'wx1' }), false);
  assert.equal(await recordChatMessage(pool, { phone: phoneX, direction: 'outbound', text: 'Baik kak', wamid: 'wx2', busdevName: 'Diaz' }), true);
  ok('pesan masuk + keluar tersimpan, wamid kembar tidak ganda');

  for (const code of ['DL-X1', 'DL-X2', 'DL-X3']) await lead(code, phoneX, { assigned: 'Diaz' });
  await msg('6281000000052', 'inbound', 2); // nomor tanpa lead sama sekali
  const src = read('src/app/api/crm/chat/route.ts');
  const listSql = src.match(/const listQuery = `([\s\S]*?)`;/)![1];
  const list = (await wrap(listSql)).rows;
  const phones = list.map((r) => r.phone);
  assert.equal(new Set(phones).size, phones.length, 'daftar percakapan memuat nomor ganda');
  assert.equal(phones.filter((p) => p === phoneX).length, 1);
  const row = list.find((r) => r.phone === phoneX)!;
  assert.equal(row.last_message, 'Baik kak');
  assert.equal(row.last_direction, 'outbound');
  assert.equal(row.busdev, 'Diaz');
  assert.equal(Number(row.unread_count), 1);
  assert.equal(list.find((r) => r.phone === '6281000000052')!.customer_name, 'Calon Klien');
  ok('daftar percakapan: satu baris per nomor walau ada 3 lead; pesan terakhir, PIC, belum-dibaca benar; nomor tanpa lead tetap tampil');

  const threadSql = src.match(/const threadQuery = `([\s\S]*?)`;/)![1].replace("${phoneParam ? 'm.phone = $1' : 'm.tracking_code = $1'}", 'm.phone = $1');
  assert.deepEqual((await wrap(threadSql, [phoneX])).rows.map((m) => m.direction), ['inbound', 'outbound']);
  await msg(phoneX, 'inbound', 400);
  const long = (await wrap(threadSql, [phoneX])).rows;
  assert.equal(long.length, 300);
  assert.ok(long.every((m, i) => i === 0 || new Date(m.created_at) >= new Date(long[i - 1].created_at)));
  ok('thread: urut naik; percakapan panjang menampilkan 300 pesan TERBARU');

  let leadSql = src.match(/const leadQuery = `([\s\S]*?)`;/)![1];
  leadSql = leadSql.replace(/\$\{phoneParam\s*\?\s*"([^"]*)"\s*:\s*'[^']*'\}/, '$1');
  const detail = (await wrap(leadSql, [phoneX, phoneX])).rows[0];
  assert.equal(detail.tracking_code, 'DL-X3'); // lead terkonfirmasi terbaru
  const noLead = (await wrap(leadSql, ['6281000000052', '6281000000052'])).rows[0];
  assert.equal(noLead.phone, '6281000000052');
  assert.equal(noLead.tracking_code, null);
  ok('panel detail: satu lead per nomor; nomor tanpa lead tetap mengembalikan nomornya');

  // ======================================================= #2.2 reminder Warm & Hot
  const remSql = read('src/app/api/crm/reminders/route.ts').match(/`(SELECT cls\.tracking_code[\s\S]*?)`/)![1];
  // Hanya lead milik bagian ini (RM-*): lead uji Warm di atas memang ikut muncul di query yang sama (ini membuktikan lead hasil otomasi masuk daftar).
  const run = async (pic: string | null) => (await wrap(remSql, [REMINDER_DB_STAGES, pic])).rows.filter((r) => String(r.tracking_code).startsWith('RM-'));
  const rawAll = async () => (await wrap(remSql, [REMINDER_DB_STAGES, null])).rows;
  const days = (d: number) => `${Math.round(d * 24)} hours`;
  const mk = async (code: string, stage: string, pic: string, ago: number) => {
    await lead(code, `628199${String(++seq).padStart(7, '0')}`, { assigned: pic });
    await wrap(`INSERT INTO crm_lead_state (tracking_code, stage, stage_changed_at, moq_manual) VALUES ($1, $2, NOW() - $3::interval, NULL)`, [code, stage, days(ago)]);
  };
  await mk('RM-W500', 'warm_500', 'Annisa', 5);
  await mk('RM-WUP', 'warm_up_500', 'Annisa', 1);
  await mk('RM-W1000', 'warm_1000', 'Diaz', 2);
  await mk('RM-HOT', 'hot', 'Annisa', 3);
  await mk('RM-LEGACY', 'warm_below_500', 'Jessica', 4);
  await mk('RM-COLD', 'cold', 'Annisa', 9);
  await mk('RM-SAMPLE', 'sample', 'Annisa', 9);
  await mk('RM-DEAL', 'deal', 'Annisa', 9);
  await lead('RM-TEST', '6281990000000', { is_test: true, assigned: 'Annisa' });
  await wrap(`INSERT INTO crm_lead_state (tracking_code, stage) VALUES ('RM-TEST', 'hot')`);

  const all = await run(null);
  const codes = all.map((r) => r.tracking_code).sort();
  assert.deepEqual(codes, ['RM-HOT', 'RM-LEGACY', 'RM-W1000', 'RM-W500', 'RM-WUP']);
  assert.ok((await rawAll()).some((r) => r.tracking_code === 'DL-A' && r.stage === 'warm_500'), 'lead hasil otomasi Warm tidak muncul di daftar reminder');
  ok('query reminder: SEMUA tahap Warm (500, Up 500, 1000+, nama lama) dan Hot; Cold/Sample/Deal/lead uji tidak ikut');

  const annisa = (await run('annisa ')).map((r) => r.tracking_code).sort();
  assert.deepEqual(annisa, ['RM-HOT', 'RM-W500', 'RM-WUP']);
  assert.deepEqual((await run('Diaz')).map((r) => r.tracking_code), ['RM-W1000']);
  ok('PIC hanya melihat lead miliknya (tanpa peduli huruf besar/kecil/spasi); Head (tanpa filter) melihat semua');

  const now = new Date();
  const byCode = (rows: any[], c: string) => rows.find((r) => r.tracking_code === c)!;
  const stateOf = (r: any) =>
    computeReminder({ stage: r.stage, lastActivityAt: r.last_activity_at ? new Date(r.last_activity_at) : null, manualDueAt: r.manual_due_at ? new Date(r.manual_due_at) : null, now })!;
  assert.equal(stateOf(byCode(all, 'RM-W500')).state, 'overdue'); // 5 hari lalu, selang Warm 3 hari
  assert.equal(stateOf(byCode(all, 'RM-WUP')).state, 'upcoming'); // 1 hari lalu -> jatuh tempo 2 hari lagi
  assert.equal(stateOf(byCode(all, 'RM-HOT')).state, 'overdue'); // 3 hari lalu, selang Hot 1 hari
  ok('status jadwal dari data nyata: Warm 5 hari tanpa kontak = terlambat; Warm 1 hari = mendatang; Hot 3 hari = terlambat');

  // pesan baru (dua arah) memajukan jadwal otomatis
  const phoneW = (await wrap(`SELECT wa_phone FROM leads WHERE tracking_code = 'RM-W500'`)).rows[0].wa_phone;
  await msg(phoneW, 'outbound', 1);
  assert.equal(stateOf(byCode(await run(null), 'RM-W500')).state, 'upcoming');
  ok('ada pesan baru dari/ke lead: jadwal otomatis maju (tidak lagi terlambat)');

  // reminder manual + selesai
  await wrap(`INSERT INTO crm_followups (tracking_code, due_at, note, created_by) VALUES ('RM-HOT', NOW() + interval '4 days', 'tawarkan sampel', 'Annisa')`);
  let hot = byCode(await run(null), 'RM-HOT');
  assert.equal(hot.reminder_note, 'tawarkan sampel');
  assert.equal(stateOf(hot).source, 'manual');
  assert.equal(stateOf(hot).state, 'upcoming');
  await assert.rejects(() => wrap(`INSERT INTO crm_followups (tracking_code, due_at, created_by) VALUES ('RM-HOT', NOW(), 'X')`), /duplicate|unique/i);
  ok('reminder manual menggantikan jadwal otomatis; hanya satu reminder terbuka per lead (dijaga database)');

  await wrap(`UPDATE crm_followups SET completed_at = NOW(), completed_by = 'Annisa' WHERE tracking_code = 'RM-HOT' AND completed_at IS NULL`);
  hot = byCode(await run(null), 'RM-HOT');
  assert.equal(hot.manual_due_at, null);
  assert.equal(stateOf(hot).source, 'otomatis');
  assert.equal(stateOf(hot).state, 'upcoming'); // "sudah follow-up" barusan -> jadwal berikutnya 1 hari lagi
  ok('"Sudah follow-up": reminder ditutup dan jadwal otomatis mulai dihitung dari saat itu');

  console.log(`\n${n} kelompok uji lulus`);
}

main()
  .catch((e) => { console.error('GAGAL', e); process.exitCode = 1; })
  .finally(() => db.close());
