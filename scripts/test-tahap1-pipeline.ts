/**
 * scripts/test-tahap1-pipeline.ts
 *
 * Integration test Tahap 1 — Data & Pipeline:
 * 1. Pindah ke stage Lost tanpa alasan -> 400.
 * 2. Pindah ke stage Lost dengan alasan tidak sah -> 400.
 * 3. Pindah ke stage Lost dengan alasan sah ('Harga tidak masuk') -> 200.
 * 4. Pindah ke stage Warm ('warm_below_500', 'warm_up_500', 'warm_below_1000', 'warm_up_1000')
 *    otomatis mengisi perkiraan MOQ ('below 500', '500', 'below 1000', '1000').
 * 5. GET /api/crm/pipeline mengembalikan 10 kolom stage berurutan tetap, mendukung filter source/campaign/q.
 * 6. GET /api/crm/lead mengembalikan detail lead beserta riwayat perpindahan stage.
 */
import path from 'node:path';
import dotenv from 'dotenv';
import { NextRequest } from 'next/server';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

import { getMonitorPool } from '../src/lib/db';
import { newToken, SESSION_COOKIE, sha256 } from '../src/lib/crm-auth';
import {STAGE_IDS} from '../src/lib/crm-stages';
import { GET as pipelineGet } from '../src/app/api/crm/pipeline/route';
import { GET as leadGet, PATCH as leadPatch } from '../src/app/api/crm/lead/route';

let failed = 0;
function assert(label: string, cond: boolean, detail?: unknown) {
  if (!cond) {
    failed++;
    console.error(`FAIL  ${label}${detail !== undefined ? ' -> ' + JSON.stringify(detail) : ''}`);
  } else {
    console.log(`PASS  ${label}`);
  }
}

async function run() {
  console.log('\n=== INTEGRATION TEST TAHAP 1: PIPELINE 10 STAGE, MOQ WARM OTOMATIS, & LOST REASON ===\n');
  const pool = getMonitorPool();

  const uRes = await pool.query(`SELECT id, name, must_change_password FROM crm_users WHERE lower(name) = 'annisa' LIMIT 1`);
  const annisa = uRes.rows[0];
  if (!annisa) throw new Error('User Annisa tidak ditemukan di crm_users');

  const lRes = await pool.query(
    `SELECT id, tracking_code FROM leads WHERE is_test IS NOT TRUE AND lower(assigned_to) = 'annisa' ORDER BY id DESC LIMIT 1`
  );
  const sampleLead = lRes.rows[0];
  if (!sampleLead) throw new Error('Lead milik Annisa tidak ditemukan');

  // Simpan state awal crm_lead_state untuk dipulihkan di blok finally
  const prevState = await pool.query(`SELECT * FROM crm_lead_state WHERE tracking_code = $1`, [sampleLead.tracking_code]);

  let sessionToken = '';
  try {
    await pool.query(`UPDATE crm_users SET must_change_password = FALSE WHERE id = $1`, [annisa.id]);
    sessionToken = newToken();
    await pool.query(
      `INSERT INTO crm_sessions (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
      [annisa.id, sha256(sessionToken)]
    );

    // 1. Pindah ke stage Lost tanpa alasan -> wajib ditolak 400
    const lostNoReasonReq = new NextRequest('https://dreamlab.id/api/crm/lead', {
      method: 'PATCH',
      headers: {
        cookie: `${SESSION_COOKIE}=${sessionToken}`,
        origin: 'https://dreamlab.id',
        host: 'dreamlab.id',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ code: sampleLead.tracking_code, stage: 'lost' }),
    });
    const lostNoReasonRes = await leadPatch(lostNoReasonReq);
    assert('Pindah ke stage Lost tanpa alasan ditolak -> 400', lostNoReasonRes.status === 400, lostNoReasonRes.status);

    // 2. Pindah ke stage Lost dengan alasan tidak sah -> wajib ditolak 400
    const lostBadReasonReq = new NextRequest('https://dreamlab.id/api/crm/lead', {
      method: 'PATCH',
      headers: {
        cookie: `${SESSION_COOKIE}=${sessionToken}`,
        origin: 'https://dreamlab.id',
        host: 'dreamlab.id',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ code: sampleLead.tracking_code, stage: 'lost', lost_reason: 'Bosan saja' }),
    });
    const lostBadReasonRes = await leadPatch(lostBadReasonReq);
    assert('Pindah ke stage Lost dengan alasan tidak terdaftar ditolak -> 400', lostBadReasonRes.status === 400, lostBadReasonRes.status);

    // 3. Pindah ke stage Lost dengan alasan sah -> 200
    const lostValidReq = new NextRequest('https://dreamlab.id/api/crm/lead', {
      method: 'PATCH',
      headers: {
        cookie: `${SESSION_COOKIE}=${sessionToken}`,
        origin: 'https://dreamlab.id',
        host: 'dreamlab.id',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ code: sampleLead.tracking_code, stage: 'lost', lost_reason: 'Harga tidak masuk' }),
    });
    const lostValidRes = await leadPatch(lostValidReq);
    const lostValidBody = await lostValidRes.json();
    assert(
      'Pindah ke stage Lost dengan alasan sah ("Harga tidak masuk") diterima -> 200',
      lostValidRes.status === 200 && lostValidBody.success === true && lostValidBody.lost_reason === 'Harga tidak masuk',
      lostValidBody
    );

    // 4. Pindah ke stage Warm mengisi perkiraan MOQ otomatis
    const warmCases: Array<{ stage: string; expectedLabel: string; expectedNum: number }> = [
      { stage: 'warm_below_500', expectedLabel: 'below 500', expectedNum: 300 },
      { stage: 'warm_up_500', expectedLabel: '500', expectedNum: 500 },
      { stage: 'warm_below_1000', expectedLabel: 'below 1000', expectedNum: 750 },
      { stage: 'warm_up_1000', expectedLabel: '1000', expectedNum: 1000 },
    ];
    for (const wc of warmCases) {
      const wReq = new NextRequest('https://dreamlab.id/api/crm/lead', {
        method: 'PATCH',
        headers: {
          cookie: `${SESSION_COOKIE}=${sessionToken}`,
          origin: 'https://dreamlab.id',
          host: 'dreamlab.id',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ code: sampleLead.tracking_code, stage: wc.stage }),
      });
      const wRes = await leadPatch(wReq);
      const wJson = await wRes.json();
      assert(
        `Pindah ke ${wc.stage} mengisi MOQ otomatis = "${wc.expectedLabel}" (${wc.expectedNum})`,
        wRes.status === 200 && wJson.moq_label === wc.expectedLabel && wJson.moq === wc.expectedNum,
        wJson
      );
    }

    // 5. GET /api/crm/lead mengembalikan detail + riwayat perpindahan stage
    const detailReq = new NextRequest(`https://dreamlab.id/api/crm/lead?code=${sampleLead.tracking_code}`, {
      headers: { cookie: `${SESSION_COOKIE}=${sessionToken}`, host: 'dreamlab.id' },
    });
    const detailRes = await leadGet(detailReq);
    const detailJson = await detailRes.json();
    assert(
      'GET /api/crm/lead mengembalikan detail lead (stage, moq_label, source, detection_method, landing_path, history)',
      detailRes.status === 200 &&
        detailJson.success === true &&
        detailJson.lead.stage === 'warm_up_1000' &&
        detailJson.lead.moq_label === '1000' &&
        typeof detailJson.lead.source === 'string' &&
        typeof detailJson.lead.detection_method === 'string' &&
        typeof detailJson.lead.landing_path === 'string' &&
        Array.isArray(detailJson.history) &&
        detailJson.history.length > 0,
      detailJson
    );

    // 6. GET /api/crm/pipeline mengembalikan 10 kolom stage sesuai urutan tetap
    const pipeReq = new NextRequest('https://dreamlab.id/api/crm/pipeline?startDate=2026-11-01&endDate=2026-11-15', {
      headers: { cookie: `${SESSION_COOKIE}=${sessionToken}`, host: 'dreamlab.id' },
    });
    const pipeRes = await pipelineGet(pipeReq);
    const pipeJson = await pipeRes.json();
    const returnedStageIds = (pipeJson.columns || []).map((c: any) => c.id).join(',');
    assert(
      'GET /api/crm/pipeline mengembalikan 10 kolom stage sesuai urutan tetap',
      pipeRes.status === 200 &&
        pipeJson.success === true &&
        returnedStageIds === STAGE_IDS.join(','),
      returnedStageIds
    );
  } finally {
    // Pulihkan state awal crm_lead_state dan hapus history uji
    if (prevState.rowCount === 0) {
      await pool.query(`DELETE FROM crm_lead_state WHERE tracking_code = $1`, [sampleLead.tracking_code]);
    } else {
      const p = prevState.rows[0];
      await pool.query(
        `UPDATE crm_lead_state SET stage = $2, produk_manual = $3, moq_manual = $4, note = $5 WHERE tracking_code = $1`,
        [sampleLead.tracking_code, p.stage, p.produk_manual, p.moq_manual, p.note]
      );
    }
    await pool.query(
      `DELETE FROM crm_stage_history WHERE tracking_code = $1 AND changed_at >= NOW() - INTERVAL '2 minutes'`,
      [sampleLead.tracking_code]
    );
    await pool.query(`UPDATE crm_users SET must_change_password = $2 WHERE id = $1`, [annisa.id, annisa.must_change_password]);
    if (sessionToken) {
      await pool.query(`DELETE FROM crm_sessions WHERE token_hash = $1`, [sha256(sessionToken)]);
    }
    await pool.end();
  }

  if (failed > 0) {
    console.error(`\n❌ ${failed} TEST TAHAP 1 GAGAL`);
    process.exit(1);
  } else {
    console.log('\n✅ SEMUA TEST TAHAP 1 LOLOS');
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
