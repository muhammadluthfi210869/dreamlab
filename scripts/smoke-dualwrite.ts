import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { insertLead } from '../src/lib/round-robin-db';
import { Pool } from 'pg';

const code = 'DL-20260914-SMOKE1';
const base = {
  trackingCode: code,
  source: 'google-ads',
  pageUrl: '/ads/thankyou/google/',
  intent: 'smoke',
  visitorId: 'smoke-event-0001',
  sessionId: 'smoke-event-0001',
  assignedName: 'Jessica',
  assignedPhone: '6287712232389',
} as const;

(async () => {
  const a = await insertLead({ ...base });
  const b = await insertLead({ ...base }); // replay -> harus return kode sama, tanpa baris baru
  console.log('first:', JSON.stringify(a));
  console.log('replay:', JSON.stringify(b));
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const rows = await pool.query(
    'SELECT tracking_code, assigned_to, assigned_phone, source FROM leads WHERE tracking_code = $1',
    [code],
  );
  console.log('rows in leads:', JSON.stringify(rows.rows));
  const del = await pool.query('DELETE FROM leads WHERE tracking_code = $1', [code]);
  console.log('cleanup deleted:', del.rowCount);
  await pool.end();
})().catch((e) => {
  console.error('FAIL', e.message);
  process.exit(1);
});
