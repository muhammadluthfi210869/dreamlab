/**
 * Uji SQL otomasi Warm di Postgres LOKAL dalam skema sementara (dibuang di akhir).
 *   TEST_DATABASE_URL=postgresql://...@localhost:5433/<db> npx tsx scripts/test-crm-auto-warm-sql.ts
 * Menolak database non-lokal.
 */
import assert from 'node:assert/strict';
import { Pool } from 'pg';
import { applyAutoWarm } from '../src/lib/crm-auto-warm';

const url = process.env.TEST_DATABASE_URL;
if (!url || !/@(localhost|127\.0\.0\.1)[:/]/.test(url)) {
  console.error('Set TEST_DATABASE_URL ke Postgres LOKAL.');
  process.exit(2);
}
const SCHEMA = `zz_warm_${Date.now().toString(36)}`;
const admin = new Pool({ connectionString: url });
let pool: Pool;

async function setup() {
  await admin.query(`CREATE SCHEMA ${SCHEMA}`);
  pool = new Pool({ connectionString: url, options: `-c search_path=${SCHEMA}` });
  await pool.query(`
    CREATE TABLE leads (id SERIAL PRIMARY KEY, tracking_code TEXT, wa_phone TEXT, hp TEXT, status TEXT, is_test BOOLEAN DEFAULT FALSE);
    CREATE TABLE crm_lead_state (tracking_code TEXT PRIMARY KEY, stage TEXT NOT NULL DEFAULT 'traffic', moq_manual INT, stage_changed_at TIMESTAMPTZ, updated_by TEXT, updated_at TIMESTAMPTZ DEFAULT NOW());
    CREATE TABLE crm_stage_history (id SERIAL PRIMARY KEY, tracking_code TEXT, from_stage TEXT, to_stage TEXT NOT NULL, changed_by TEXT, changed_at TIMESTAMPTZ DEFAULT NOW());
    CREATE TABLE crm_chat_messages (id BIGSERIAL PRIMARY KEY, phone TEXT NOT NULL, direction TEXT NOT NULL, message_text TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
  `);
}
const inbound = (phone: string, n: number, dir = 'inbound') => pool.query(`INSERT INTO crm_chat_messages (phone, direction, message_text) SELECT $1, $2, 'x' FROM generate_series(1, $3)`, [phone, dir, n]);
const stageOf = async (code: string) => (await pool.query(`SELECT stage FROM crm_lead_state WHERE tracking_code=$1`, [code])).rows[0]?.stage ?? null;
const history = async (code: string) => (await pool.query(`SELECT from_stage, to_stage, changed_by FROM crm_stage_history WHERE tracking_code=$1 ORDER BY id`, [code])).rows;

let passed = 0;
const ok = (name: string) => { passed++; console.log(`ok  ${name}`); };

async function main() {
  await setup();
  await pool.query(`INSERT INTO leads (tracking_code, wa_phone, status) VALUES ('DL-A','6281111111111','confirmed'), ('DL-B','6282222222222','confirmed'), ('DL-C','6283333333333','confirmed'), ('DL-T','6284444444444','confirmed')`);
  await pool.query(`UPDATE leads SET is_test = TRUE WHERE tracking_code='DL-T'`);

  // 4 pesan masuk: belum
  await inbound('6281111111111', 4);
  assert.equal(await applyAutoWarm(pool, '6281111111111'), null);
  assert.equal(await stageOf('DL-A'), null);
  ok('4 pesan masuk: tidak berpindah, tidak ada baris state');

  // pesan ke-5: pindah
  await inbound('6281111111111', 1);
  assert.equal(await applyAutoWarm(pool, '6281111111111'), 'warm_500');
  assert.equal(await stageOf('DL-A'), 'warm_500');
  assert.deepEqual(await history('DL-A'), [{ from_stage: 'traffic', to_stage: 'warm_500', changed_by: 'sistem (otomasi Warm)' }]);
  ok('pesan ke-5: pindah ke warm_500 dan riwayat tercatat');

  // pesan keluar (balasan BusDev) tidak dihitung; panggilan ulang tidak menggandakan riwayat
  await inbound('6281111111111', 10, 'outbound');
  assert.equal(await applyAutoWarm(pool, '6281111111111'), null);
  assert.equal((await history('DL-A')).length, 1);
  ok('pesan keluar tidak dihitung; panggilan ulang idempoten');

  // lead yang sudah Hot tidak kembali ke Warm
  await inbound('6282222222222', 8);
  await pool.query(`INSERT INTO crm_lead_state (tracking_code, stage) VALUES ('DL-B','hot')`);
  assert.equal(await applyAutoWarm(pool, '6282222222222'), null);
  assert.equal(await stageOf('DL-B'), 'hot');
  ok('lead di Hot tidak mundur ke Warm');

  // MOQ 800 -> warm_up_500
  await inbound('6283333333333', 6);
  await pool.query(`INSERT INTO crm_lead_state (tracking_code, stage, moq_manual) VALUES ('DL-C','cold',800)`);
  assert.equal(await applyAutoWarm(pool, '6283333333333'), 'warm_up_500');
  ok('cold + MOQ 800 -> warm_up_500');

  // lead uji (is_test) dan nomor tak dikenal tidak disentuh
  await inbound('6284444444444', 9);
  assert.equal(await applyAutoWarm(pool, '6284444444444'), null);
  await inbound('6289999999999', 9);
  assert.equal(await applyAutoWarm(pool, '6289999999999'), null);
  assert.equal(await applyAutoWarm(pool, ''), null);
  ok('lead uji, nomor tanpa lead, dan nomor kosong diabaikan');
}

main()
  .then(() => console.log(`\n${passed}/${passed} lulus`))
  .catch((e) => { console.error('GAGAL', e); process.exitCode = 1; })
  .finally(async () => {
    await pool?.end().catch(() => undefined);
    await admin.query(`DROP SCHEMA IF EXISTS ${SCHEMA} CASCADE`).catch(() => undefined);
    await admin.end();
  });
