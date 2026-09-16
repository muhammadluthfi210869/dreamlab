#!/usr/bin/env node
// scripts/audit-db-helper.mjs
// DB utilities for lead-monitor audit. Reads DATABASE_URL from .env.local
// (loads via dotenv if available, else expects env already set).
//
//   node scripts/audit-db-helper.mjs cleanup <tracking_code>
//   node scripts/audit-db-helper.mjs inspect <tracking_code>
//   node scripts/audit-db-helper.mjs fuzzy-prepare  -- prepare SHORT / VERYSHORTLONGNAME rows
//   node scripts/audit-db-helper.mjs fuzzy-inspect  -- show how many rows matched by substring
//   node scripts/audit-db-helper.mjs status        -- show leads.confirmed count and recent AUDIT- rows

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (avoid dotenv dependency)
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
  console.error('FATAL: DATABASE_URL not set (load from .env.local or env)');
  process.exit(2);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const cmd = process.argv[2];
const arg = process.argv[3];

async function cleanup(trackingCode) {
  const r = await pool.query(
    `DELETE FROM leads WHERE tracking_code = $1 RETURNING id, tracking_code`,
    [trackingCode]
  );
  console.log(`deleted ${r.rowCount} row(s):`, r.rows);
}

async function inspect(trackingCode) {
  const r = await pool.query(
    `SELECT id, tracking_code, assigned_to, status, wa_profile_name, wa_phone, wa_message, created_at, confirmed_at
       FROM leads WHERE tracking_code ILIKE $1 ORDER BY created_at DESC LIMIT 20`,
    [`%${trackingCode}%`]
  );
  console.log(`matches for '%${trackingCode}%':`);
  for (const row of r.rows) {
    console.log(`  id=${row.id} tracking=${row.tracking_code} status=${row.status} wa=${row.wa_profile_name} phone=${row.wa_phone} confirmed=${row.confirmed_at?.toISOString?.() || row.confirmed_at}`);
  }
  console.log(`total: ${r.rowCount}`);
}

async function fuzzyPrepare() {
  // Two rows: AUDITFUZZ (exact match) and AUDITFUZZY (substring match risk).
  // When webhook arrives with trackingCode='AUDITFUZZ', handler's WHERE clause
  //   WHERE tracking_code = 'AUDITFUZZ' OR tracking_code ILIKE '%AUDITFUZZ%'
  // matches BOTH rows.
  await pool.query(`DELETE FROM leads WHERE tracking_code IN ('AUDITFUZZ','AUDITFUZZY')`);
  const ins1 = await pool.query(
    `INSERT INTO leads (tracking_code, assigned_to, status, source, page_url, session_id, created_at)
     VALUES ('AUDITFUZZY','Jessica','assigned','WEBSITE','/p/a','audit-fuzzy-victim', NOW() - INTERVAL '1 hour')
     RETURNING id, tracking_code`
  );
  const ins2 = await pool.query(
    `INSERT INTO leads (tracking_code, assigned_to, status, source, page_url, session_id, created_at)
     VALUES ('AUDITFUZZ','Annisa','assigned','WEBSITE','/p/b','audit-fuzzy-target', NOW() - INTERVAL '30 minutes')
     RETURNING id, tracking_code`
  );
  console.log('prepared:', ins1.rows[0], ins2.rows[0]);
}

async function fuzzyInspect() {
  const r = await pool.query(
    `SELECT id, tracking_code, status, wa_profile_name, wa_message, confirmed_at
       FROM leads
      WHERE tracking_code = 'AUDITFUZZ'
         OR tracking_code ILIKE '%AUDITFUZZ%'
      ORDER BY tracking_code`
  );
  console.log('fuzzy match (exact + substring AUDITFUZZ):');
  for (const row of r.rows) {
    console.log(`  id=${row.id} tracking=${row.tracking_code} status=${row.status} wa_msg=${row.wa_message?.slice(0,50)} confirmed=${row.confirmed_at?.toISOString?.() || row.confirmed_at}`);
  }
  console.log(`total: ${r.rowCount}`);
}

async function status() {
  const total = await pool.query(`SELECT COUNT(*)::int AS n FROM leads`);
  const confirmed = await pool.query(`SELECT COUNT(*)::int AS n FROM leads WHERE status = 'confirmed'`);
  const auditRows = await pool.query(
    `SELECT id, tracking_code, status, wa_profile_name, created_at
       FROM leads WHERE tracking_code LIKE 'AUDIT-%' ORDER BY created_at DESC LIMIT 20`
  );
  console.log(`leads total:      ${total.rows[0].n}`);
  console.log(`leads confirmed:  ${confirmed.rows[0].n}`);
  console.log(`audit-prefixed rows (${auditRows.rowCount}):`);
  for (const row of auditRows.rows) {
    console.log(`  id=${row.id} tracking=${row.tracking_code} status=${row.status} wa=${row.wa_profile_name} created=${row.created_at?.toISOString?.()}`);
  }
}

(async () => {
  try {
    if (cmd === 'cleanup' && arg) await cleanup(arg);
    else if (cmd === 'inspect' && arg) await inspect(arg);
    else if (cmd === 'fuzzy-prepare') await fuzzyPrepare();
    else if (cmd === 'fuzzy-inspect') await fuzzyInspect();
    else if (cmd === 'status') await status();
    else {
      console.log('usage: cleanup|inspect|fuzzy-prepare|fuzzy-inspect|status [arg]');
    }
  } catch (e) {
    console.error('FATAL:', e?.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();