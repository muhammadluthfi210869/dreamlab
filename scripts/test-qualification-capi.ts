/**
 * test-qualification-capi.ts
 *
 * Verifies the 6 test scenarios defined in the server-side lead qualification specification:
 * 1. Valid lead "Rina Uji", budget 25–50 Juta -> Tier C, Qualified.
 * 2. Duplicate submission within 30 days -> Duplicate, not qualified.
 * 3. Budget < 25 Juta -> Tier D, disqualify_reason = below_min_tier.
 * 4. Name "TEST Dreamlab" -> disqualify_reason = test_or_internal.
 * 5. Invalid Indonesian number -> disqualify_reason = invalid_phone (or rejected).
 * 6. Meta CAPI error simulation -> Logged in capi_events table.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback
import pool from '../src/lib/db';
import { evaluateLeadQualification, resolveTierFromBudget, validateIndonesianMobilePhone, isTestOrInternalLead } from '../src/lib/lead-qualification';
import { sendMetaEvent, type MetaLeadPayload } from '../src/lib/meta-capi';

async function runTests() {
  console.log('=== TEST PLAN VERIFICATION: SERVER-SIDE LEAD QUALIFICATION & META CAPI ===\n');

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details ? `-> ${details}` : ''}`);
      failed++;
    }
  }

  // 1. Test tier resolver
  const tD = resolveTierFromBudget('< 25 Juta');
  assert('Tier < 25 Juta resolves to D (value 1)', tD.tier === 'D' && tD.value === 1 && tD.leadSegment === 'Starter');

  const tC = resolveTierFromBudget('25–50 Juta');
  assert('Tier 25–50 Juta resolves to C (value 3)', tC.tier === 'C' && tC.value === 3 && tC.leadSegment === 'Growth');

  const tB = resolveTierFromBudget('50–100 Juta');
  assert('Tier 50–100 Juta resolves to B (value 6)', tB.tier === 'B' && tB.value === 6 && tB.leadSegment === 'Scale');

  const tA = resolveTierFromBudget('250–500 Juta');
  assert('Tier 250–500 Juta resolves to A (value 10)', tA.tier === 'A' && tA.value === 10 && tA.leadSegment === 'Enterprise');

  // Test 1: Name "Rina Uji", valid new number, budget 25–50 Juta
  const uniquePhone1 = `+62812${Math.floor(10000000 + Math.random() * 90000000)}`;
  const cleanHp1 = uniquePhone1.replace(/^\+/, '');
  const res1 = await evaluateLeadQualification({
    fullName: 'Rina Uji',
    phoneE164: uniquePhone1,
    localHp: cleanHp1,
    budgetRange: '25–50 Juta',
    originHeader: 'https://dreamlab.id',
  });
  assert('Test 1: "Rina Uji" is qualified as Tier C', res1.qualified === true && res1.tier === 'C' && res1.disqualifyReason === null);

  // Test 2: Same number again within 30 days
  // First insert dummy lead into DB
  const trackingCode1 = `TEST-QUAL-${Date.now()}`;
  await pool.query(
    `INSERT INTO leads (tracking_code, nama, hp, whatsapp_phone_e164, is_test)
     VALUES ($1, $2, $3, $4, FALSE)`,
    [trackingCode1, 'Rina Uji', cleanHp1, uniquePhone1]
  );
  const res2 = await evaluateLeadQualification({
    fullName: 'Rina Uji Kedua',
    phoneE164: uniquePhone1,
    localHp: cleanHp1,
    budgetRange: '25–50 Juta',
    originHeader: 'https://dreamlab.id',
  });
  assert('Test 2: Duplicate number within 30 days is disqualified as duplicate', res2.qualified === false && res2.disqualifyReason === 'duplicate');

  // Clean up test lead
  await pool.query('DELETE FROM leads WHERE tracking_code = $1', [trackingCode1]);

  // Test 3: Budget < 25 Juta
  const uniquePhone3 = `+62813${Math.floor(10000000 + Math.random() * 90000000)}`;
  const res3 = await evaluateLeadQualification({
    fullName: 'Budi Hartono',
    phoneE164: uniquePhone3,
    localHp: uniquePhone3.replace(/^\+/, ''),
    budgetRange: '< 25 Juta',
    originHeader: 'https://dreamlab.id',
  });
  assert('Test 3: Budget < 25 Juta disqualified as below_min_tier', res3.qualified === false && res3.tier === 'D' && res3.disqualifyReason === 'below_min_tier');

  // Test 4: Name "TEST Dreamlab"
  const res4 = await evaluateLeadQualification({
    fullName: 'TEST Dreamlab',
    phoneE164: uniquePhone3,
    localHp: uniquePhone3.replace(/^\+/, ''),
    budgetRange: '50–100 Juta',
    originHeader: 'https://dreamlab.id',
  });
  assert('Test 4: Name with "TEST" disqualified as test_or_internal', res4.qualified === false && res4.disqualifyReason === 'test_or_internal');

  // Test 5: Invalid number 08123 (too short)
  const isMobileValid = validateIndonesianMobilePhone('+628123');
  assert('Test 5: Number "+628123" is marked invalid Indonesian mobile', isMobileValid === false);

  // Test 6: CAPI logging to database table capi_events
  const testPayload: MetaLeadPayload = {
    inquiryCode: `TEST-CAPI-${Date.now()}`,
    fullName: 'Rina Uji',
    phoneE164: '+6281234567890',
    landingUrl: 'https://dreamlab.id/skincare-face-care/metaads/',
    tier: 'C',
    leadSegment: 'Growth',
    category: 'Skincare',
    value: 3,
  };
  // Calling sendMetaEvent with mock / unset token should log skipped attempt to capi_events
  const capiRes = await sendMetaEvent(testPayload, 'QualifiedLeadForm');
  const loggedEvent = await pool.query(
    `SELECT event_name, event_id, error_message FROM capi_events WHERE event_id = $1`,
    [`${testPayload.inquiryCode}-qf`]
  );
  assert('Test 6: Attempt is recorded in capi_events table', loggedEvent.rows.length > 0 && loggedEvent.rows[0].event_name === 'QualifiedLeadForm');

  // Clean up capi_events test row
  await pool.query('DELETE FROM capi_events WHERE event_id = $1', [`${testPayload.inquiryCode}-qf`]);

  console.log(`\n=== RESULTS: ${passed} Passed, ${failed} Failed ===`);
  await pool.end();
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
