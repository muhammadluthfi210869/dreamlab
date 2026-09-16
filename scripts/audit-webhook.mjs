#!/usr/bin/env node
// scripts/audit-webhook.mjs
// Live verification of /api/lead-capture/confirm against dreamlab.id.
// Generates unique tracking_code per run to avoid collision with real leads.
// Cleanup: rows with tracking_code LIKE 'AUDIT-TS-%' should be DELETEd after.
//
// Usage:  node scripts/audit-webhook.mjs [--prod|--local]
// Default: production.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const target = args.includes('--local') ? 'http://localhost:3000' : 'https://dreamlab.id';

const ts = Date.now();
const trackingCode = `AUDIT-TS-${ts}`;
const wamid = `wamid.AUDIT-${ts}`;
const entryId = `AUDIT-ENTRY-${ts}`;

const templatePath = path.join(__dirname, 'audit-meta-payload.json');
const raw = fs.readFileSync(templatePath, 'utf8')
  .replace(/AUDIT_ENTRY_PLACEHOLDER/g, entryId)
  .replace(/AUDIT_MSG_PLACEHOLDER/g, wamid)
  .replace(/AUDIT_TRACKING_PLACEHOLDER/g, trackingCode);
const payload = raw;

console.log(`\n=== AUDIT WEBHOOK ===`);
console.log(`target:    ${target}`);
console.log(`tracking:  ${trackingCode}`);
console.log(`wamid:     ${wamid}`);
console.log(`expected:  waName=AUDIT TEST USER, phone=6281234560001`);

const url = `${target}/api/lead-capture/confirm`;
const t0 = Date.now();
let res, text, json;
try {
  res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  });
  text = await res.text();
  json = JSON.parse(text);
} catch (e) {
  console.log(`FAIL  fetch error: ${e?.message}`);
  process.exit(2);
}
const dt = Date.now() - t0;

console.log(`\n--- HTTP ${res.status} (${dt}ms) ---`);
console.log(JSON.stringify(json, null, 2));

// Assertions on happy path
let pass = true;
const check = (cond, msg) => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${msg}`);
  if (!cond) pass = false;
};
check(res.status === 200, 'status 200');
check(json.success === true, 'success=true');
check(json.waName === 'AUDIT TEST USER', `waName='AUDIT TEST USER' (got '${json.waName}')`);
check(json.phone === '6281234560001', `phone=6281234560001 (got '${json.phone}')`);
check(json.status === 'confirmed', `status=confirmed (got '${json.status}')`);
check(json.trackingCode === trackingCode, `trackingCode echo (got '${json.trackingCode}')`);

// Negative test: idempotency
console.log(`\n--- NEGATIVE: idempotency (re-POST same payload) ---`);
const t1 = Date.now();
const res2 = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: payload,
});
const json2 = await res2.json();
const dt2 = Date.now() - t1;
console.log(`HTTP ${res2.status} (${dt2}ms): ${JSON.stringify(json2)}`);
// Without dedup fix, both POSTs succeed (200) — NexERP cross-post fires twice.
// We just note this; the cleanup is the DB row to delete after.

console.log(`\n=== ${pass ? 'AUDIT PASS' : 'AUDIT FAIL'} ===`);
console.log(`cleanup hint: DELETE FROM leads WHERE tracking_code = '${trackingCode}';`);
process.exit(pass ? 0 : 1);