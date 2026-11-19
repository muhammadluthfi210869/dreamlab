/**
 * Uji #2.5 Distribusi round robin pada fungsi database PRODUKSI, di dalam transaksi yang SELALU di-ROLLBACK
 * (lead, counter, dan perubahan status sales yang dibuat selama uji hilang; diverifikasi di akhir).
 *
 *   npx tsx scripts/test-round-robin-live-txn.ts      (membaca DATABASE_URL dari .env.local)
 *
 * Kriteria: beberapa lead baru berturut-turut dibagikan BERGILIRAN ke sales aktif, MELEWATI sales nonaktif,
 * dan SATU PIC per lead.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Client } from 'pg';

const envTxt = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';
const url = process.env.DATABASE_URL || (envTxt.match(/^DATABASE_URL=(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!url) { console.error('DATABASE_URL tidak ada'); process.exit(2); }

let n = 0;
const ok = (name: string) => { n++; console.log(`ok  ${name}`); };
const RUN = Date.now().toString(36);
let vseq = 0;
const visitor = () => `rrchk${RUN}_${++vseq}`; // sengaja BUKAN diawali "test_" supaya counter benar-benar berputar

async function newLead(c: Client, vid: string) {
  const r = await c.query(
    `SELECT agent_name, tracking_code FROM assign_and_insert_lead($1, 'wa-click', 'google-ads', 'https://dreamlab.id/rrchk', 'rrchk', '', '', '', '', 'desktop', 'chrome', $1, NULL, NULL, NULL, NULL, FALSE)`,
    [vid]
  );
  return r.rows[0] as { agent_name: string; tracking_code: string };
}

async function main() {
  const probe = new Client({ connectionString: url, ssl: false });
  await probe.connect();
  const before = (await probe.query(`SELECT current_index FROM rr_counter WHERE id = 1`)).rows[0].current_index;
  const busdevsBefore = JSON.stringify((await probe.query(`SELECT id, is_active FROM busdevs ORDER BY id`)).rows);
  const leadsBefore = (await probe.query(`SELECT COUNT(*)::int AS n FROM leads`)).rows[0].n;

  const c = new Client({ connectionString: url, ssl: false });
  await c.connect();
  try {
    await c.query('BEGIN');

    const active = (await c.query(
      `SELECT name FROM busdevs WHERE is_active = TRUE ORDER BY CASE WHEN name ILIKE '%Annisa%' THEN 1 WHEN name ILIKE '%Diaz%' THEN 2 WHEN name ILIKE '%Jessica%' THEN 3 ELSE 99 END, id`
    )).rows.map((r) => r.name as string);
    const inactive = (await c.query(`SELECT name FROM busdevs WHERE is_active = FALSE`)).rows.map((r) => r.name as string);
    assert.ok(active.length >= 3, `butuh >= 3 sales aktif, ada ${active.length}`);
    console.log(`    sales aktif: ${active.join(', ')} | nonaktif: ${inactive.join(', ') || '-'}`);

    // ---- 1. 3 putaran penuh, pengunjung baru semua
    const seq: string[] = [];
    const codes: string[] = [];
    for (let i = 0; i < active.length * 3; i++) {
      const l = await newLead(c, visitor());
      seq.push(l.agent_name);
      codes.push(l.tracking_code);
    }
    assert.ok(seq.every((a) => active.includes(a)), `ada sales di luar daftar aktif: ${seq.join(',')}`);
    for (const a of active) assert.equal(seq.filter((x) => x === a).length, 3, `${a} tidak mendapat jatah sama`);
    for (let i = 0; i + 1 < seq.length; i++) {
      assert.equal(seq[i + 1], active[(active.indexOf(seq[i]) + 1) % active.length], `urutan putus di langkah ${i}: ${seq.join(' > ')}`);
    }
    console.log(`    urutan: ${seq.join(' > ')}`);
    ok(`${seq.length} lead berturut-turut: bergiliran ${active.join(' > ')}, jatah sama rata (3 putaran)`);

    for (const nm of inactive) assert.ok(!seq.includes(nm), `sales nonaktif ${nm} kebagian lead`);
    ok(`sales nonaktif (${inactive.join(', ') || 'tidak ada'}) dilewati`);

    // ---- 2. satu PIC per lead
    const rows = (await c.query(`SELECT tracking_code, assigned_to, visitor_id FROM leads WHERE tracking_code = ANY($1::text[])`, [codes])).rows;
    assert.equal(rows.length, codes.length);
    assert.ok(rows.every((r) => !!r.assigned_to), 'ada lead tanpa PIC');
    assert.equal(new Set(rows.map((r) => r.tracking_code)).size, codes.length);
    ok('setiap lead punya tepat satu PIC (assigned_to terisi) dan kode unik');

    // ---- 3. pengunjung yang sama kembali: PIC tetap, tidak membuat lead ganda, counter tidak maju
    const vid = visitor();
    const first = await newLead(c, vid);
    const idxAfterFirst = (await c.query(`SELECT current_index FROM rr_counter WHERE id = 1`)).rows[0].current_index;
    const again1 = await newLead(c, vid);
    const again2 = await newLead(c, vid);
    const idxAfterAgain = (await c.query(`SELECT current_index FROM rr_counter WHERE id = 1`)).rows[0].current_index;
    assert.equal(again1.agent_name, first.agent_name);
    assert.equal(again2.agent_name, first.agent_name);
    assert.equal(again1.tracking_code, first.tracking_code, 'klik ulang membuat lead baru');
    assert.equal(idxAfterAgain, idxAfterFirst, 'counter maju untuk pengunjung yang sama');
    assert.equal((await c.query(`SELECT COUNT(*)::int AS n FROM leads WHERE visitor_id = $1`, [vid])).rows[0].n, 1);
    ok('pengunjung yang sama klik ulang: tetap PIC yang sama, 1 lead, counter tidak maju');

    // ---- 4. nonaktifkan satu sales aktif di tengah jalan -> dilewati, PIC lama dialihkan
    const victim = active[1];
    const stickyVid = visitor();
    let stickyLead = await newLead(c, stickyVid);
    for (let i = 0; i < active.length && stickyLead.agent_name !== victim; i++) {
      stickyLead = await newLead(c, (() => { const v = visitor(); return v; })()); // cari pengunjung yang kebagian korban
      if (stickyLead.agent_name === victim) break;
    }
    await c.query(`UPDATE busdevs SET is_active = FALSE WHERE name = $1`, [victim]);
    const remaining = active.filter((a) => a !== victim);
    const seq2: string[] = [];
    for (let i = 0; i < remaining.length * 4; i++) seq2.push((await newLead(c, visitor())).agent_name);
    assert.ok(!seq2.includes(victim), `${victim} nonaktif tapi masih kebagian: ${seq2.join(',')}`);
    for (const a of remaining) assert.equal(seq2.filter((x) => x === a).length, 4, `${a} jatah tidak sama: ${seq2.join(',')}`);
    for (let i = 0; i + 1 < seq2.length; i++) assert.notEqual(seq2[i], seq2[i + 1]);
    console.log(`    setelah ${victim} dinonaktifkan: ${seq2.join(' > ')}`);
    ok(`${victim} dinonaktifkan: dilewati, ${remaining.join(' & ')} bergiliran dengan jatah sama`);

    // pengunjung lama yang tadinya milik sales yang kini nonaktif harus dialihkan ke sales aktif
    const reroute = await newLead(c, stickyVid);
    assert.ok(reroute.agent_name !== victim && remaining.includes(reroute.agent_name), `PIC lama nonaktif tidak dialihkan: ${reroute.agent_name}`);
    ok('pengunjung lama milik sales yang nonaktif dialihkan ke sales aktif (tidak menggantung)');

    await c.query('ROLLBACK');
  } finally {
    await c.end().catch(() => undefined);
  }

  // ---- 5. rollback benar-benar menghapus semua jejak uji
  const after = (await probe.query(`SELECT current_index FROM rr_counter WHERE id = 1`)).rows[0].current_index;
  assert.equal(after, before, 'counter produksi berubah');
  assert.equal(JSON.stringify((await probe.query(`SELECT id, is_active FROM busdevs ORDER BY id`)).rows), busdevsBefore, 'status sales produksi berubah');
  assert.equal((await probe.query(`SELECT COUNT(*)::int AS n FROM leads`)).rows[0].n, leadsBefore, 'jumlah lead produksi berubah');
  assert.equal((await probe.query(`SELECT COUNT(*)::int AS n FROM leads WHERE page_url = 'https://dreamlab.id/rrchk'`)).rows[0].n, 0);
  await probe.end();
  ok('ROLLBACK terbukti: counter, status sales, dan jumlah lead produksi identik dengan sebelum uji');

  console.log(`\n${n} kelompok uji lulus`);
}

main().catch((e) => { console.error('GAGAL', e); process.exit(1); });
