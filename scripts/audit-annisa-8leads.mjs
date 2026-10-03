#!/usr/bin/env node
// scripts/audit-annisa-8leads.mjs
// Mendiagnosis kenapa leads Annisa "hari ini" semuanya dropoff:
//  - Apakah processed_webhook_messages punya rows? (= apakah webhook
//    pernah benar-benar dipanggil, dari Meta atau NexERP forward)
//  - Apakah stats endpoint secara internal benar query leads hari ini
//    + Annisa → apakah match dengan apa yang user lihat di /lead-monitor
//  - Detail 8 leads: kapan create, page apa, ada wa_* attribute belum
//  - Ada atau tidak test-flag yang sengaja di-exclude

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const txt = fs.readFileSync(envPath, 'utf8');
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
  }
}

if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL not set');
  process.exit(2);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    console.log('======================================================================');
    console.log(' 1. processed_webhook_messages — TOTAL rows (semua wamid) dan ROWS');
    console.log('    hari ini UTC. Kalau 0 → webhook tidak pernah menerima payload.');
    console.log('======================================================================');
    const totalP = await pool.query(`SELECT COUNT(*)::int AS n FROM processed_webhook_messages`);
    console.log(`total processed_webhook_messages: ${totalP.rows[0].n}`);

    const todayP = await pool.query(`
      SELECT COUNT(*)::int AS n,
             MIN(processed_at) AS first,
             MAX(processed_at) AS last
        FROM processed_webhook_messages
       WHERE processed_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date
    `);
    console.log(`today (Jakarta) processed_webhook_messages: ${todayP.rows[0].n}`);
    if (todayP.rows[0].n > 0) {
      console.log(`  range: ${todayP.rows[0].first?.toISOString?.()} → ${todayP.rows[0].last?.toISOString?.()}`);
    }

    console.log();
    console.log('======================================================================');
    console.log(' 2. leads dengan status=\'confirmed\' — TOTAL dan TOTAL hari ini (Annisa only).');
    console.log('    Angka 0 = handler confirm tidak pernah match.');
    console.log('======================================================================');
    const confAll = await pool.query(`SELECT COUNT(*)::int AS n FROM leads WHERE status = 'confirmed'`);
    console.log(`status='confirmed' (all):     ${confAll.rows[0].n}`);
    const confA = await pool.query(`
      SELECT COUNT(*)::int AS n
        FROM leads
       WHERE status = 'confirmed'
         AND assigned_to ILIKE 'Annisa'
         AND created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date
    `);
    console.log(`status='confirmed' Annisa today: ${confA.rows[0].n}`);

    console.log();
    console.log('======================================================================');
    console.log(' 3. Simulasi persis query /api/lead-monitor/stats');
    console.log('    filter busdev=Annisa, period=today, search=\'\'');
    console.log('======================================================================');
    const kpiSim = await pool.query(`
      SELECT
        COUNT(*)::int AS total_clicks,
        COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed_chats,
        COUNT(*) FILTER (WHERE status IS NULL OR status != 'confirmed')::int AS dropoff_clicks
      FROM leads
      WHERE is_test IS NOT TRUE
        AND created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date
        AND (assigned_to ILIKE $1 OR assigned_to ILIKE '%' || $1 || '%')
    `, ['Annisa']);
    console.log('KPI Annisa today:', kpiSim.rows[0]);

    const leadsSim = await pool.query(`
      SELECT
        id,
        tracking_code,
        assigned_to,
        assigned_phone,
        source,
        page_url,
        status,
        wa_profile_name,
        wa_phone,
        LEFT(wa_message, 60) AS wa_message_preview,
        created_at,
        confirmed_at
      FROM leads
      WHERE is_test IS NOT TRUE
        AND created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date
        AND (assigned_to ILIKE $1 OR assigned_to ILIKE '%' || $1 || '%')
      ORDER BY created_at DESC
      LIMIT 150
    `, ['Annisa']);
    console.log(`Annisa leads visible in UI today: ${leadsSim.rowCount}`);
    for (const row of leadsSim.rows) {
      console.log(`  id=${row.id} tcode=${row.tracking_code} status=${row.status} src=${row.source} ph=${row.assigned_phone} url=${row.page_url} wa_name=${row.wa_profile_name || '—'} wa_msg=${row.wa_message_preview || '—'} created=${row.created_at?.toISOString?.()}`);
    }

    console.log();
    console.log('======================================================================');
    console.log(' 4. Cek flag is_test — ada berapa leads Annisa today yang is_test=TRUE?');
    console.log('======================================================================');
    const testA = await pool.query(`
      SELECT COUNT(*)::int AS n
        FROM leads
       WHERE is_test IS TRUE
         AND assigned_to ILIKE 'Annisa'
         AND created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date
    `);
    console.log(`Annisa test-flagged leads today: ${testA.rows[0].n}`);

    console.log();
    console.log('======================================================================');
    console.log(' 5. Ada atau tidak kolom tracking di leads yang membedakan click vs chat');
    console.log('======================================================================');
    const cols = await pool.query(`
      SELECT column_name, data_type
        FROM information_schema.columns
       WHERE table_name = 'leads'
         AND column_name IN ('wa_clicked_at', 'wa_redirected_at', 'clicked_at', 'redirected_at', 'wa_phone', 'wa_message')
       ORDER BY column_name
    `);
    for (const c of cols.rows) {
      console.log(`  ${c.column_name}  (${c.data_type})`);
    }
    if (cols.rowCount === 0) {
      console.log('  (no dedicated WA-click column — clicks tidak tercatat sebagai event terpisah)');
    }
  } catch (e) {
    console.error('FATAL:', e?.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
