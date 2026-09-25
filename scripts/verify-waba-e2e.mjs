/**
 * verify-waba-e2e — buktikan jalur chat-asli end-to-end untuk nomor yang ADA di WABA:
 *  1. bikin lead 'assigned' dengan kode (perilaku website, §round-robin)
 *  2. kirim payload webhook Meta (entry/changes/value) ke /api/lead-capture/confirm
 *     dengan phone_number_id nomor BusDev
 *  3. assert: status='confirmed' + wa_phone + wa_profile_name + assigned_to benar
 *  4. assert: /api/lead-monitor/stats (yang dipakai halaman /lead-monitor) menampilkannya
 *  5. assert: handshake GET (hub.verify_token) balas challenge
 *
 * Self-cleaning: semua row uji dihapus di akhir (leads + processed_webhook_messages).
 * Pakai `x-forwarded-from: nexerp` agar confirm route skip cross-post ke ERP asli.
 *
 * Jalankan: node scripts/verify-waba-e2e.mjs
 * Exit code 0 = semua assert lolos.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SITE = 'https://dreamlab.id';
const TAG = `PROBE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

// --- ambil DATABASE_URL dari .env.local tanpa mencetaknya
const envTxt = fs.readFileSync(path.resolve('.env.local'), 'utf8');
const dbUrl = (envTxt.match(/^DATABASE_URL=(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!dbUrl) throw new Error('DATABASE_URL tidak ada di .env.local');

const { default: pg } = await import('pg');
const pool = new pg.Pool({ connectionString: dbUrl, ssl: false });

const TARGETS = [
  { name: 'Irma',   phoneNumberId: '815864727920156', displayPhone: '62881027240339' },
  { name: 'Annisa', phoneNumberId: '116397311522216', displayPhone: '6281952417051'  },
  { name: 'Diaz',   phoneNumberId: '198659679989033', displayPhone: '6287776550657'  },
];

const out = { tag: TAG, steps: [], failed: [] };

function assert(ok, label, detail) {
  if (ok) return true;
  out.failed.push({ assert: label, detail });
  console.error(`FAIL  ${label}  ${JSON.stringify(detail)}`);
  return false;
}

async function monitorShows(code) {
  const r = await fetch(`${SITE}/api/lead-monitor/stats?period=all&search=${encodeURIComponent(code)}`, {
    headers: { 'cache-control': 'no-cache' },
  });
  if (!r.ok) return { http: r.status, error: `stats HTTP ${r.status}` };
  const j = await r.json();
  const lead = (j.leads || []).find((l) => l.tracking_code === code);
  return {
    http: r.status,
    foundInMonitor: Boolean(lead),
    monitorShows: lead
      ? { tracking_code: lead.tracking_code, status: lead.status, assigned_to: lead.assigned_to,
          wa_profile_name: lead.wa_profile_name, wa_phone: lead.wa_phone }
      : null,
  };
}

try {
  // ---------- STEP 1: generate kode lewat jalur produksi ----------
  for (const t of TARGETS) {
    const code = `${TAG}-${t.name.toUpperCase()}`;
    await pool.query(
      `INSERT INTO leads (tracking_code, assigned_to, assigned_phone, source, status, is_test, page_url)
       VALUES ($1,$2,$3,'probe',$4,false,'/probe')`,
      [code, t.name, t.displayPhone, 'assigned']
    );

    // ---------- STEP 2: kirim payload META ASLI (format entry/changes/value) ----------
    const senderPhone = '628111222333';
    const profileName = `PROBE ${t.name}`;
    const wamid = `wamid.PROBE.${crypto.randomUUID()}`;
    const payload = {
      object: 'whatsapp_business_account',
      entry: [{
        id: '341949621370175',
        changes: [{
          field: 'messages',
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: t.displayPhone,
              phone_number_id: t.phoneNumberId,
            },
            contacts: [{ profile: { name: profileName }, wa_id: senderPhone }],
            messages: [{
              from: senderPhone,
              id: wamid,
              timestamp: String(Math.floor(Date.now() / 1000)),
              type: 'text',
              text: { body: `Hi Dreamlab, saya mengetahui dari Google. [Kode: ${code}]` },
            }],
          },
        }],
      }],
    };

    // signature SENGAJA salah -> sekalian membuktikan signature check masih bocor
    const res = await fetch(`${SITE}/api/lead-capture/confirm`, {
      method: 'POST',
      // x-forwarded-from: nexerp -> skip cross-post ke nexerp.id (jangan kotori ERP dengan data probe)
      headers: { 'Content-Type': 'application/json', 'x-hub-signature-256': 'sha256=deadbeef', 'x-forwarded-from': 'nexerp' },
      body: JSON.stringify(payload),
    });
    const resBody = await res.json().catch(() => null);

    // ---------- STEP 3: baca hasil di DB ----------
    const db = await pool.query(
      `SELECT tracking_code, status, assigned_to, wa_phone, wa_profile_name, source, confirmed_at IS NOT NULL AS has_confirmed_at
         FROM leads WHERE tracking_code = $1`, [code]
    );

    const mon = await monitorShows(code);

    out.steps.push({
      target: t.name,
      sent: { phoneNumberId: t.phoneNumberId, displayPhone: t.displayPhone, wamid },
      webhookHttp: res.status,
      webhookBody: resBody,
      dbRow: db.rows[0] || null,
      leadMonitor: mon,
      wamidStored: (await pool.query(`SELECT count(*)::int c FROM processed_webhook_messages WHERE wamid=$1`, [wamid])).rows[0].c === 1,
    });

    // ---------- ASSERT ----------
    const row = db.rows[0] || {};
    assert(res.status === 200, `${t.name}: webhook balas 200`, { http: res.status, body: resBody });
    assert(row.status === 'confirmed', `${t.name}: lead jadi status=confirmed`, { got: row.status });
    assert(row.assigned_to === t.name, `${t.name}: assigned_to = ${t.name}`, { got: row.assigned_to });
    assert(row.wa_phone === senderPhone, `${t.name}: wa_phone tersimpan`, { got: row.wa_phone });
    assert(row.wa_profile_name === profileName, `${t.name}: wa_profile_name tersimpan`, { got: row.wa_profile_name });
    assert(row.has_confirmed_at === true, `${t.name}: confirmed_at terisi`, { got: row.has_confirmed_at });
    assert(mon.foundInMonitor, `${t.name}: muncul di /api/lead-monitor/stats`, mon);
    assert(
      mon.monitorShows?.wa_phone === senderPhone && mon.monitorShows?.wa_profile_name === profileName,
      `${t.name}: lead-monitor menampilkan nomor + display name`, mon.monitorShows
    );
  }

  // ---------- STEP 4: handshake GET webhook (verifikasi token) ----------
  const legacy = 'nex_meta_verify_2026_9Q7mK2vL5xR8cT4p';
  for (const [label, token, expectChallenge] of [
    ['legacy-hardcoded', legacy, true],
    ['random-wrong', 'not-the-token', false],
  ]) {
    const r = await fetch(`${SITE}/api/lead-capture/confirm?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(token)}&hub.challenge=PROBE`);
    const txt = await r.text();
    assert(
      expectChallenge ? txt === 'PROBE' : txt !== 'PROBE',
      `handshake ${label}: ${expectChallenge ? 'harus balas challenge' : 'tidak boleh balas challenge'}`,
      { http: r.status, body: txt.slice(0, 60) }
    );
  }
} finally {
  // ---------- CLEANUP ----------
  const codes = TARGETS.map((t) => `${TAG}-${t.name.toUpperCase()}`);
  const delLeads = await pool.query(`DELETE FROM leads WHERE tracking_code = ANY($1) RETURNING tracking_code`, [codes]);
  const delWamid = await pool.query(`DELETE FROM processed_webhook_messages WHERE wamid LIKE 'wamid.PROBE.%' RETURNING wamid`);
  out.cleanup = { deletedLeads: delLeads.rowCount, deletedWamid: delWamid.rowCount };
  await pool.end();
}

console.log(JSON.stringify(out, null, 2));
console.log(
  out.failed.length === 0
    ? `\nPASS — ${TARGETS.length} nomor tervalidasi end-to-end`
    : `\nFAIL — ${out.failed.length} assert gagal`
);
process.exit(out.failed.length === 0 ? 0 : 1);