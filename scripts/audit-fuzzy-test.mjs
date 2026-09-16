#!/usr/bin/env node
// scripts/audit-fuzzy-test.mjs
// Sends a webhook with tracking_code='AUDIT-SHORT' and checks whether the
// substring 'AUDIT-SHORT' accidentally matches AUDIT-VERYSHORTLONGNAME.
//
// Pre-condition: AUDIT-SHORT and AUDIT-VERYSHORTLONGNAME rows must exist.
// Run `node scripts/audit-db-helper.mjs fuzzy-prepare` first.

const args = process.argv.slice(2);
const target = args.includes('--local') ? 'http://localhost:3000' : 'https://dreamlab.id';

console.log(`target: ${target}`);
console.log(`trackingCode sent: AUDITFUZZ`);
console.log(`expected: only AUDITFUZZ row updated; AUDITFUZZY row stays 'assigned'`);

const url = `${target}/api/lead-capture/confirm`;
const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    trackingCode: 'AUDITFUZZ',
    phone: '6281234560003',
    waName: 'AUDIT FUZZY TARGET',
    waMessage: 'fuzzy-match-test',
    destinationPhone: '62881027240339',
    phoneNumberId: '815864727920156',
  }),
});
const json = await res.json();
console.log(`\nHTTP ${res.status}: ${JSON.stringify(json, null, 2)}`);
process.exit(res.status === 200 ? 0 : 1);