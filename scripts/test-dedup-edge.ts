// test-dedup-edge.ts — uji edge case dedup (intent beda, page_url kosong)
import { Pool } from 'pg';
import { insertLead } from '../src/lib/round-robin-db.ts';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  console.log('-- EDGE CASE DEDUP --');
  await pool.query('TRUNCATE leads RESTART IDENTITY');

  // Skenario: visitor sama, intent BEDA, pageUrl KOSONG (klik tombol WA tanpa data page)
  const a = await insertLead({ intent: 'Produk A', visitorId: 'dedup-edge', pageUrl: '' });
  const b = await insertLead({ intent: 'Produk B', visitorId: 'dedup-edge', pageUrl: '' });

  console.log('  lead 1 (Produk A, page kosong): ' + a.trackingCode);
  console.log('  lead 2 (Produk B, page kosong): ' + b.trackingCode);
  console.log(b.trackingCode !== a.trackingCode
    ? '  [PASS] Intent beda -> lead BARU (dedup tidak salah)'
    : '  [FAIL] Intent beda tapi page kosong -> SALAH dedup (lead B hilang, dianggap kunjungan ulang)');

  // Skenario kontrol: intent BEDA + page BEDA -> harus lead baru (sudah diuji, konfirmasi ulang)
  await pool.query('TRUNCATE leads RESTART IDENTITY');
  const c = await insertLead({ intent: 'X', visitorId: 'dedup-ctrl', pageUrl: '/x' });
  const d = await insertLead({ intent: 'Y', visitorId: 'dedup-ctrl', pageUrl: '/y' });
  console.log(d.trackingCode !== c.trackingCode
    ? '  [PASS] Kontrol: intent+page beda -> lead baru'
    : '  [FAIL] Kontrol gagal');

  // Skenario double-click (intent & page SAMA) -> dedup (benar)
  await pool.query('TRUNCATE leads RESTART IDENTITY');
  const e = await insertLead({ intent: 'Sama', visitorId: 'dedup-2x', pageUrl: '/p' });
  const f = await insertLead({ intent: 'Sama', visitorId: 'dedup-2x', pageUrl: '/p' });
  console.log(f.trackingCode === e.trackingCode
    ? '  [PASS] Double-click intent+page sama -> dedup (visit_count++)'
    : '  [FAIL] Double-click tidak ter-dedup');
  await pool.end();
}
main().catch((e) => { console.error('FATAL:', e); process.exit(2); });
