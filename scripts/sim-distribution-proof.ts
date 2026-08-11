/**
 * sim-distribution-proof.ts
 * Bukti distribusi merata ke 6 CS + sticky saat visitor kembali.
 * Dipakai untuk verifikasi (tidak menulis ke produksi — hanya dreamlab_test).
 */
import { Pool } from 'pg';
import { getNextAgentFromDb } from '../src/lib/round-robin-db.ts';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function reset() {
  await pool.query('TRUNCATE leads RESTART IDENTITY');
  await pool.query('TRUNCATE visitor_assignments');
  await pool.query('UPDATE rr_counter SET current_index=0, updated_at=now() WHERE id=1');
}

async function main() {
  await reset();

  // 120 visitor unik -> rotasi murni
  const first: Record<string, number> = {};
  for (let i = 0; i < 120; i++) {
    const a = await getNextAgentFromDb('vis-' + i);
    first[a.name] = (first[a.name] || 0) + 1;
  }
  console.log('=== 120 visitor unik (rotasi murni) ===');
  for (const [k, v] of Object.entries(first).sort()) {
    console.log(`  ${k}: ${v} (${((v / 120) * 100).toFixed(1)}%)`);
  }
  const uniq = Object.keys(first).length;
  console.log(`  CS unik terpakai: ${uniq}/6`);
  console.log(`  Sebaran: max-min = ${Math.max(...Object.values(first)) - Math.min(...Object.values(first))} (ideal 0)`);

  // 120 visitor yang sama kembali lagi -> harus di CS yang sama (sticky)
  const second: Record<string, number> = {};
  for (let i = 0; i < 120; i++) {
    const a = await getNextAgentFromDb('vis-' + i);
    second[a.name] = (second[a.name] || 0) + 1;
  }
  const identical = Object.entries(first).every(([k, v]) => second[k] === v);
  console.log('\n=== 120 visitor SAMA kembali lagi (sticky 30 hari) ===');
  console.log(`  Distribusi identik dengan kunjungan pertama: ${identical ? 'YA ✅' : 'TIDAK ❌'}`);
  for (const [k, v] of Object.entries(second).sort()) {
    console.log(`  ${k}: ${v}`);
  }
  const ctr = await pool.query('SELECT current_index FROM rr_counter WHERE id=1');
  console.log(`  counter akhir: ${ctr.rows[0].current_index} (harus 0 — repeat visitor tidak memajukan counter)`);

  await pool.end();
}

main().catch((e) => { console.error('GAGAL:', e.message); process.exit(1); });
