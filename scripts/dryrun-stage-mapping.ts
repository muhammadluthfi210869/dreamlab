/**
 * scripts/dryrun-stage-mapping.ts
 *
 * Script dry-run (hanya-baca secara default) untuk memeriksa jumlah lead per stage lama
 * dan hasil pemetaannya ke 10 stage baru di `crm_leads` (berdasarkan nomor WA E.164 unik).
 *
 * Cara pakai:
 *   npx tsx scripts/dryrun-stage-mapping.ts
 *   npx tsx scripts/dryrun-stage-mapping.ts --warm500=warm_below_500
 *   npx tsx scripts/dryrun-stage-mapping.ts --apply
 */
import path from 'node:path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const apply = process.argv.includes('--apply');
const warm500Target = process.argv.find((a) => a.startsWith('--warm500='))?.split('=')[1] === 'warm_below_500'
  ? 'warm_below_500'
  : 'warm_up_500';

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
const u = new URL(url);
const pool = new Pool({
  host: u.hostname,
  port: Number(u.port || 5432),
  database: decodeURIComponent(u.pathname.replace(/^\//, '')),
  user: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  connectionTimeoutMillis: 15000,
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query("SELECT set_config('app.current_user_role', 'admin', false)");
    console.log(`\n=== DRY-RUN PEMETAAN STAGE LAMA -> STAGE BARU CRM (warm_500 -> ${warm500Target}) ===\n`);

    // 1. Ringkasan seluruh baris leads vs yang memiliki nomor HP
    const overview = await client.query(`
    SELECT
      COUNT(*)::int AS total_rows,
      COUNT(*) FILTER (WHERE COALESCE(NULLIF(trim(whatsapp_phone_e164),''), NULLIF(trim(wa_phone),''), NULLIF(trim(hp),'')) IS NOT NULL)::int AS rows_with_phone,
      COUNT(*) FILTER (WHERE COALESCE(NULLIF(trim(whatsapp_phone_e164),''), NULLIF(trim(wa_phone),''), NULLIF(trim(hp),'')) IS NULL)::int AS click_only_rows
    FROM leads
    WHERE is_test IS NOT TRUE
  `);
  console.log('1. Ringkasan Tabel `leads` (Log Klik Website):');
  console.table(overview.rows);

  // 1B. Ringkasan seluruh baris `crm_lead_state` (Stage Pipeline Eksisting)
  const clsRes = await client.query(
    `
    SELECT
      cls.stage AS "Stage Lama (crm_lead_state)",
      CASE
        WHEN cls.stage = 'traffic' THEN 'lead_masuk (Lead Masuk)'
        WHEN cls.stage = 'cold' THEN 'cold (Cold)'
        WHEN cls.stage = 'traffic_below_500' THEN 'warm_below_500 (Warm below 500)'
        WHEN cls.stage IN ('warm', 'traffic_500') AND COALESCE(cls.moq_manual, l.requested_quantity_pcs, 500) <= 500
          THEN $1::text
        WHEN cls.stage IN ('warm', 'traffic_500', 'warm_up_500')
          THEN 'warm_up_500 (Warm up 500)'
        WHEN cls.stage IN ('traffic_1000', 'warm_up_1000')
          THEN 'warm_up_1000 (Warm up 1000)'
        WHEN cls.stage = 'hot' THEN 'hot (Hot)'
        WHEN cls.stage = 'sample' THEN 'sample (Sample)'
        WHEN cls.stage = 'deal' THEN 'deal (Deal)'
        WHEN cls.stage = 'lost' THEN 'lost (Lost)'
        ELSE cls.stage
      END AS "Stage Baru (Hasil Pemetaan)",
      COUNT(*)::int AS "Jumlah Baris crm_lead_state"
    FROM crm_lead_state cls
    LEFT JOIN leads l ON l.tracking_code = cls.tracking_code
    GROUP BY 1, 2
    ORDER BY 3 DESC
    `,
    [warm500Target === 'warm_below_500' ? 'warm_below_500 (Warm below 500)' : 'warm_up_500 (Warm up 500)']
  );
  console.log('1B. Hasil Pemetaan Tabel `crm_lead_state` (Semua Stage Eksisting):');
  console.table(clsRes.rows);

  // 2. Hasil pemetaan per nomor E.164 unik (calon isi tabel `crm_leads`)
  const mappingRes = await client.query(
    `
    WITH norm AS (
      SELECT
        l.id,
        l.tracking_code,
        cls.stage AS manual_stage,
        COALESCE(cls.moq_manual, l.requested_quantity_pcs) AS eff_moq,
        l.quantity_range,
        l.production_tier_name,
        CASE
          WHEN regexp_replace(COALESCE(NULLIF(trim(l.whatsapp_phone_e164),''), NULLIF(trim(l.wa_phone),''), NULLIF(trim(l.hp),'')), '[^0-9]', '', 'g') ~ '^0[0-9]{8,14}$'
            THEN '+62' || substr(regexp_replace(COALESCE(NULLIF(trim(l.whatsapp_phone_e164),''), NULLIF(trim(l.wa_phone),''), NULLIF(trim(l.hp),'')), '[^0-9]', '', 'g'), 2)
          WHEN regexp_replace(COALESCE(NULLIF(trim(l.whatsapp_phone_e164),''), NULLIF(trim(l.wa_phone),''), NULLIF(trim(l.hp),'')), '[^0-9]', '', 'g') ~ '^62[0-9]{8,14}$'
            THEN '+' || regexp_replace(COALESCE(NULLIF(trim(l.whatsapp_phone_e164),''), NULLIF(trim(l.wa_phone),''), NULLIF(trim(l.hp),'')), '[^0-9]', '', 'g')
          WHEN regexp_replace(COALESCE(NULLIF(trim(l.whatsapp_phone_e164),''), NULLIF(trim(l.wa_phone),''), NULLIF(trim(l.hp),'')), '[^0-9]', '', 'g') ~ '^8[0-9]{7,13}$'
            THEN '+62' || regexp_replace(COALESCE(NULLIF(trim(l.whatsapp_phone_e164),''), NULLIF(trim(l.wa_phone),''), NULLIF(trim(l.hp),'')), '[^0-9]', '', 'g')
          ELSE NULL
        END AS phone_e164,
        CASE
          WHEN cls.stage IS NOT NULL AND cls.stage <> '' THEN cls.stage
          WHEN COALESCE(cls.moq_manual, l.requested_quantity_pcs) IS NULL OR COALESCE(cls.moq_manual, l.requested_quantity_pcs) <= 0 THEN 'traffic'
          WHEN COALESCE(cls.moq_manual, l.requested_quantity_pcs) < 500 THEN 'cold'
          WHEN COALESCE(cls.moq_manual, l.requested_quantity_pcs) = 500 THEN 'warm_500'
          WHEN COALESCE(cls.moq_manual, l.requested_quantity_pcs) < 1000 THEN 'warm_up_500'
          ELSE 'warm_1000'
        END AS old_stage,
        l.created_at
      FROM leads l
      LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
      WHERE l.is_test IS NOT TRUE
    ),
    dedup AS (
      SELECT DISTINCT ON (phone_e164)
        phone_e164,
        old_stage,
        eff_moq,
        quantity_range,
        production_tier_name
      FROM norm
      WHERE phone_e164 IS NOT NULL
      ORDER BY phone_e164, (old_stage <> 'traffic') DESC, created_at DESC
    )
    SELECT
      old_stage AS "Stage Lama",
      CASE old_stage
        WHEN 'traffic' THEN 'lead_masuk (Lead Masuk)'
        WHEN 'cold' THEN 'cold (Cold)'
        WHEN 'warm_500' THEN $1::text
        WHEN 'warm_up_500' THEN 'warm_up_500 (Warm up 500)'
        WHEN 'warm_1000' THEN 'warm_up_1000 (Warm up 1000)'
        WHEN 'hot' THEN 'hot (Hot)'
        WHEN 'sample' THEN 'sample (Sample)'
        ELSE 'lead_masuk (Lead Masuk)'
      END AS "Stage Baru (Hasil Pemetaan)",
      CASE old_stage
        WHEN 'cold' THEN 'below 500'
        WHEN 'warm_500' THEN CASE WHEN $1::text LIKE 'warm_below_500%' THEN 'below 500' ELSE '500' END
        WHEN 'warm_up_500' THEN '500'
        WHEN 'warm_1000' THEN '1000'
        ELSE '-'
      END AS "MOQ Baru",
      COUNT(*)::int AS "Jumlah Lead Unik (E.164)"
    FROM dedup
    GROUP BY 1, 2, 3
    ORDER BY MIN(CASE old_stage
      WHEN 'traffic' THEN 1
      WHEN 'cold' THEN 2
      WHEN 'warm_500' THEN 3
      WHEN 'warm_up_500' THEN 4
      WHEN 'warm_1000' THEN 5
      WHEN 'hot' THEN 6
      WHEN 'sample' THEN 7
      ELSE 8
    END)
    `,
    [warm500Target === 'warm_below_500' ? 'warm_below_500 (Warm below 500)' : 'warm_up_500 (Warm up 500)']
  );

  console.log('2. Hasil Pemetaan Lead Unik Ber-Nomor HP (E.164) ke `crm_leads`:');
  console.table(mappingRes.rows);

  // 3. Detail khusus "Warm 500 pcs" lama untuk dicek user
  const warm500Detail = await client.query(`
    SELECT
      COALESCE(cls.moq_manual, l.requested_quantity_pcs) AS eff_moq,
      l.quantity_range,
      l.production_tier_name,
      COUNT(*)::int AS total_rows
    FROM leads l
    LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
    WHERE l.is_test IS NOT TRUE
      AND COALESCE(cls.moq_manual, l.requested_quantity_pcs) BETWEEN 300 AND 999
    GROUP BY 1, 2, 3
    ORDER BY 1, 4 DESC
  `);
  console.log('3. Rincian Baris dengan MOQ 300–999 pcs (Cold vs Warm 500 pcs lama):');
  console.table(warm500Detail.rows);

  if (!apply) {
    console.log('Status: DRY-RUN SELESAI (Tidak ada data yang ditulis ke `crm_leads`).');
  }
  } finally {
    client.release();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => pool.end());

