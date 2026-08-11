import { Pool } from 'pg';
import { getNextAgentFromDb } from '../src/lib/round-robin-db.ts';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 20 });

async function main() {
  console.log('-- CONCURRENCY TEST (state dibersihkan) --');

  // Jumlah CS aktif diambil dari DB (dinamis — jangan hardcode).
  const agentCount = Number(
    (await pool.query('SELECT count(*)::int AS c FROM busdevs WHERE is_active = true')).rows[0].c
  );
  const expectedPerAgent = Math.floor(20 / agentCount);

  // Test 1: 20 visitor BEDA paralel -> rotasi harus maju 20, semua CS terpakai merata
  await pool.query('TRUNCATE visitor_assignments RESTART IDENTITY');
  await pool.query('UPDATE rr_counter SET current_index = 0 WHERE id = 1');
  const distinct = Array.from({ length: 20 }, (_, i) => 'par-' + i);
  const results = await Promise.all(distinct.map((v) => getNextAgentFromDb(v)));
  const after = Number((await pool.query('SELECT current_index FROM rr_counter WHERE id=1')).rows[0].current_index);
  const counts = {};
  for (const r of results) counts[r.id] = (counts[r.id] ?? 0) + 1;
  console.log('  CS aktif: ' + agentCount + ' | counter akhir: ' + after + ' (' + 20 + ' mod ' + agentCount + ' = ' + (20 % agentCount) + ')');
  console.log('  CS unik: ' + Object.keys(counts).length + ' dari ' + agentCount);
  console.log('  distribusi: ' + JSON.stringify(counts));
  const ok = after === 20 % agentCount && Object.keys(counts).length === agentCount && Object.values(counts).every((c) => c === expectedPerAgent);
  console.log(ok ? '  [PASS] 20 paralel visitor berbeda: counter +20, ' + agentCount + ' CS rata (' + expectedPerAgent + '/CS)' : '  [FAIL] ' + JSON.stringify({ after, counts }));

  // Test 2: 10 paralel visitor SAMA -> semua CS sama, counter TIDAK maju, 1 sticky row
  await pool.query('TRUNCATE visitor_assignments RESTART IDENTITY');
  const before = Number((await pool.query('SELECT current_index FROM rr_counter WHERE id=1')).rows[0].current_index);
  const same = 'par-same';
  const sameResults = await Promise.all(Array.from({ length: 10 }, () => getNextAgentFromDb(same)));
  const after2 = Number((await pool.query('SELECT current_index FROM rr_counter WHERE id=1')).rows[0].current_index);
  const sameIds = new Set(sameResults.map((r) => r.id));
  const stickyRows = Number((await pool.query('SELECT count(*) AS c FROM visitor_assignments WHERE visitor_id=$1', [same])).rows[0].c);
  console.log('  counter: ' + before + ' -> ' + after2 + ' (10 visitor sama, harus 1 maju saja utk visitor pertama)');
  console.log('  CS unik dari 10 paralel: ' + sameIds.size);
  console.log('  sticky rows: ' + stickyRows);
  const ok2 = sameIds.size === 1 && stickyRows === 1;
  console.log(ok2 ? '  [PASS] 10 paralel visitor sama: 1 CS, 1 sticky row' : '  [FAIL] ' + JSON.stringify({ sameIds: [...sameIds], stickyRows }));
  await pool.end();
}
main().catch((e) => { console.error('FATAL:', e); process.exit(2); });
