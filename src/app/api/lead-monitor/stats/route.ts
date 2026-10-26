import { NextRequest, NextResponse } from 'next/server';
import pool, { resetPool } from '@/lib/db';
import { mergeLeads, matchesStatusView, type MergeableLead } from '@/lib/lead-merge';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

// Baris mentah yang diambil sebelum digabung per nomor, dan jumlah baris yang ditampilkan.
const RAW_ROW_CAP = 800;
const DISPLAY_ROW_CAP = 150;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

// Kolom hasil form kualifikasi (migrasi 00022 & 00023). Belum tentu sudah ada di
// database live, jadi dideteksi dulu: kalau belum ada, monitor tetap jalan
// (kolomnya dikembalikan NULL) dan UI menampilkan peringatan migrasi.
const QUALIFICATION_COLUMNS: Record<string, string> = {
  production_tier_name: 'text',
  lead_segment: 'text',
  requested_quantity_pcs: 'int',
  inquiry_reference: 'text',
  qualification_status: 'text',
  crm_sync_status: 'text',
  wa_clicked_at: 'timestamptz',
  whatsapp_phone_e164: 'text',
  phone_country_iso2: 'text',
};

let columnCache: { at: number; cols: Set<string> } | null = null;
const COLUMN_CACHE_MS = 60_000;

async function getLeadColumns(client: { query: (q: string) => Promise<{ rows: any[] }> }): Promise<Set<string>> {
  if (columnCache && Date.now() - columnCache.at < COLUMN_CACHE_MS) return columnCache.cols;
  const res = await client.query(
    `SELECT column_name FROM information_schema.columns
      WHERE table_name = 'leads' AND table_schema = current_schema()`
  );
  const cols = new Set<string>(res.rows.map((r) => r.column_name));
  columnCache = { at: Date.now(), cols };
  return cols;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const busdevFilter = url.searchParams.get('busdev') || 'all';
  const statusFilter = url.searchParams.get('status') || 'all';
  const period = url.searchParams.get('period') || 'today';
  const startDate = url.searchParams.get('startDate') || '';
  const endDate = url.searchParams.get('endDate') || '';
  const search = url.searchParams.get('search') || '';
  const kindParam = url.searchParams.get('kind') || 'all';
  const kindFilter = ['all', 'form', 'click'].includes(kindParam) ? kindParam : 'all';

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const validStart = dateRegex.test(startDate) ? startDate : null;
  const validEnd = dateRegex.test(endDate) ? endDate : null;

  let client;
  let hasError = false;
  try {
    try {
      client = await pool.connect();
    } catch (connErr: any) {
      console.warn('[lead-monitor/stats] Stale pooled connection, resetting and retrying...', connErr?.message);
      resetPool();
      client = await pool.connect();
    }
    const leadCols = await getLeadColumns(client);
    const hasQualificationColumns = leadCols.has('inquiry_reference') && leadCols.has('production_tier_name');
    const col = (name: string) => (leadCols.has(name) ? name : `NULL::${QUALIFICATION_COLUMNS[name]} AS ${name}`);

    // Lead dari form kualifikasi: punya inquiry_reference, atau (sebelum migrasi
    // dijalankan) intent diawali "[QUALIFIED]" yang ditulis route /api/leads/qualify.
    const formExpr = leadCols.has('inquiry_reference')
      ? `(inquiry_reference IS NOT NULL OR intent LIKE '[QUALIFIED]%')`
      : `(intent LIKE '[QUALIFIED]%')`;
    const kindClause =
      kindFilter === 'form'
        ? `AND ${formExpr}`
        : kindFilter === 'click'
          ? `AND NOT COALESCE(${formExpr}, FALSE)`
          : '';

    // 1. Filter waktu (Asia/Jakarta boundary yang presisi untuk timestamptz)
    // Titik awal sistem tracking baru MacroDroid + Confirmed Round Robin resmi aktif: 06 Okt 2026 00:00 WIB
    const SYSTEM_LAUNCH_DATE = "'2026-10-06 00:00:00+07'::timestamptz";

    let timeClause = '';
    if (period === 'today') {
      timeClause = `AND created_at >= (date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'Asia/Jakarta')`;
    } else if (period === 'yesterday') {
      timeClause = `AND created_at >= (date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'Asia/Jakarta') - INTERVAL '1 day' AND created_at < (date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'Asia/Jakarta')`;
    } else if (period === 'since_new_system') {
      timeClause = `AND created_at >= ${SYSTEM_LAUNCH_DATE}`;
    } else if (period === '7d') {
      // Clamp ke launch date agar tidak menarik data bias sebelum sistem terpasang
      timeClause = `AND created_at >= GREATEST((date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'Asia/Jakarta') - INTERVAL '7 days', ${SYSTEM_LAUNCH_DATE})`;
    } else if (period === '30d') {
      timeClause = `AND created_at >= GREATEST((date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'Asia/Jakarta') - INTERVAL '30 days', ${SYSTEM_LAUNCH_DATE})`;
    } else if (period === 'all') {
      timeClause = `AND created_at >= ${SYSTEM_LAUNCH_DATE}`;
    } else if (validStart && validEnd) {
      timeClause = `AND created_at >= ('${validStart} 00:00:00+07'::timestamptz) AND created_at < (('${validEnd}'::date + 1) || ' 00:00:00+07')::timestamptz`;
    } else if (validStart) {
      timeClause = `AND created_at >= ('${validStart} 00:00:00+07'::timestamptz)`;
    } else if (validEnd) {
      timeClause = `AND created_at < (('${validEnd}'::date + 1) || ' 00:00:00+07')::timestamptz`;
    } else {
      timeClause = `AND created_at >= (date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'Asia/Jakarta')`;
    }

    // 2. Filter BusDev
    let busdevClause = '';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (busdevFilter && busdevFilter.toLowerCase() !== 'all') {
      busdevClause = `AND (
        assigned_to ILIKE $${paramIndex}
        OR assigned_to ILIKE '%' || $${paramIndex} || '%'
      )`;
      queryParams.push(busdevFilter);
      paramIndex++;
    }

    // 3. Filter Status (valid, all, confirmed, dropoff) diterapkan SETELAH baris digabung per nomor,
    // supaya prospek yang sama (klik + chat + form) dinilai sebagai satu lead.
    const statusView = ['valid', 'all', 'confirmed', 'dropoff'].includes(statusFilter) ? statusFilter : 'all';

    // 4. Filter Search
    let searchClause = '';
    if (search) {
      searchClause = `AND (
        tracking_code ILIKE $${paramIndex}
        OR wa_profile_name ILIKE $${paramIndex}
        OR wa_phone ILIKE $${paramIndex}
        OR hp ILIKE $${paramIndex}
        OR nama ILIKE $${paramIndex}
        OR page_url ILIKE $${paramIndex}
      )`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // A. Query KPI Summary untuk BusDev terpilih (Menghitung Manusia / Nomor HP Unik)
    const kpiQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE source != 'wa-direct')::int AS total_clicks,
        COUNT(DISTINCT COALESCE(NULLIF(wa_phone, ''), NULLIF(hp, ''), tracking_code)) 
          FILTER (
            WHERE status = 'confirmed' 
              AND source != 'wa-direct'
              AND (wa_message IS NULL OR wa_message NOT ILIKE '%memeriksa pesan baru%')
              AND (wa_message IS NULL OR wa_message NOT ILIKE '%legalitas sertifikasi bpom%')
          )::int AS confirmed_chats,
        COUNT(*) FILTER (WHERE (status IS NULL OR status != 'confirmed') AND source != 'wa-direct')::int AS dropoff_clicks,
        COUNT(DISTINCT COALESCE(NULLIF(wa_phone, ''), NULLIF(hp, ''), tracking_code)) 
          FILTER (WHERE source = 'wa-direct')::int AS direct_chats
      FROM leads
      WHERE is_test IS NOT TRUE
        ${timeClause}
        ${busdevClause}
        ${searchClause}
        ${kindClause}
    `;
    const kpiRes = await client.query(kpiQuery, queryParams);
    const kpi = kpiRes.rows[0] || { total_clicks: 0, confirmed_chats: 0, dropoff_clicks: 0, direct_chats: 0 };
    const convRate = kpi.total_clicks > 0 
      ? Number(((kpi.confirmed_chats / kpi.total_clicks) * 100).toFixed(1)) 
      : 0;

    // B. Query Breakdown Per Semua BusDev (Menghitung Manusia / Nomor HP Unik)
    const breakdownTimeClause = timeClause ? timeClause.replace(/created_at/g, 'l.created_at') : '';
    const breakdownQuery = `
      SELECT 
        b.name AS busdev_name,
        b.is_active,
        COUNT(l.id) FILTER (WHERE l.source != 'wa-direct')::int AS total_clicks,
        COUNT(DISTINCT COALESCE(NULLIF(l.wa_phone, ''), NULLIF(l.hp, ''), l.tracking_code)) 
          FILTER (
            WHERE l.status = 'confirmed' 
              AND l.source != 'wa-direct'
              AND (l.wa_message IS NULL OR l.wa_message NOT ILIKE '%memeriksa pesan baru%')
              AND (l.wa_message IS NULL OR l.wa_message NOT ILIKE '%legalitas sertifikasi bpom%')
          )::int AS confirmed_chats,
        COUNT(l.id) FILTER (WHERE (l.status IS NULL OR l.status != 'confirmed') AND l.source != 'wa-direct')::int AS dropoff_clicks,
        COUNT(DISTINCT COALESCE(NULLIF(l.wa_phone, ''), NULLIF(l.hp, ''), l.tracking_code)) 
          FILTER (WHERE l.source = 'wa-direct')::int AS direct_chats
      FROM busdevs b
      LEFT JOIN leads l ON (
        (l.assigned_to = b.name OR l.assigned_phone = regexp_replace(b.phone, '[^0-9]', '', 'g'))
        AND l.is_test IS NOT TRUE
        ${breakdownTimeClause}
      )
      GROUP BY b.name, b.is_active, b.id
      ORDER BY b.is_active DESC, total_clicks DESC, b.id ASC
    `;
    const breakdownRes = await client.query(breakdownQuery);

    // C. Query Daftar Detail Leads (terbaru ke terlama, digabung per nomor lalu dipotong DISPLAY_ROW_CAP)
    const listQuery = `
      SELECT 
        id,
        tracking_code,
        assigned_to,
        assigned_phone,
        source,
        page_url,
        page_title,
        status,
        nama,
        hp,
        wa_profile_name,
        wa_phone,
        COALESCE(wa_phone, hp) AS display_phone,
        wa_message,
        produk,
        utm_source,
        utm_campaign,
        COALESCE(${formExpr}, FALSE) AS is_form_lead,
        ${col('production_tier_name')},
        ${col('lead_segment')},
        ${col('requested_quantity_pcs')},
        ${col('inquiry_reference')},
        ${col('qualification_status')},
        ${col('crm_sync_status')},
        ${col('wa_clicked_at')},
        ${col('whatsapp_phone_e164')},
        ${col('phone_country_iso2')},
        created_at,
        confirmed_at,
        CASE 
          WHEN confirmed_at IS NOT NULL 
          THEN ROUND(EXTRACT(EPOCH FROM (confirmed_at - created_at)))::int
          ELSE NULL
        END AS latency_seconds
      FROM leads
      WHERE is_test IS NOT TRUE
        ${timeClause}
        ${busdevClause}
        ${searchClause}
        ${kindClause}
      ORDER BY created_at DESC
      LIMIT ${RAW_ROW_CAP}
    `;
    const listRes = await client.query(listQuery, queryParams);

    const rawRows = listRes.rows as MergeableLead[];
    const mergedAll = mergeLeads(rawRows);
    const tabCounts = {
      valid: mergedAll.filter((l) => matchesStatusView(l, 'valid')).length,
      confirmed: mergedAll.filter((l) => matchesStatusView(l, 'confirmed')).length,
      dropoff: mergedAll.filter((l) => matchesStatusView(l, 'dropoff')).length,
      all: mergedAll.length,
    };
    const visibleLeads = mergedAll.filter((l) => matchesStatusView(l, statusView)).slice(0, DISPLAY_ROW_CAP);

    // D. Ringkasan form kualifikasi (tidak ikut filter status/kind agar angkanya
    // selalu menggambarkan funnel form untuk periode + BusDev terpilih).
    // Dibungkus try/catch: kegagalan di sini tidak boleh mematikan monitor utama.
    let qualification: Record<string, unknown> | null = null;
    try {
      const scope = `FROM leads WHERE is_test IS NOT TRUE AND ${formExpr} ${timeClause} ${busdevClause} ${searchClause}`;
      const has = (c: string) => leadCols.has(c);

      const summaryRes = await client.query(
        `SELECT
           COUNT(*)::int AS form_total,
           COUNT(*) FILTER (WHERE status = 'confirmed')::int AS form_confirmed,
           ${has('wa_clicked_at') ? `COUNT(*) FILTER (WHERE wa_clicked_at IS NOT NULL)::int` : '0'} AS form_wa_clicked,
           ${has('crm_sync_status') ? `COUNT(*) FILTER (WHERE crm_sync_status = 'synced')::int` : '0'} AS crm_synced,
           ${has('crm_sync_status') ? `COUNT(*) FILTER (WHERE crm_sync_status = 'pending_configuration')::int` : '0'} AS crm_pending,
           ${has('crm_sync_status') ? `COUNT(*) FILTER (WHERE crm_sync_status = 'failed')::int` : '0'} AS crm_failed,
           MAX(created_at) AS last_form_at
         ${scope}`,
        queryParams
      );

      const tierRes = has('production_tier_name')
        ? await client.query(
            `SELECT production_tier_name AS tier,
                    COUNT(*)::int AS total,
                    COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed
             ${scope} AND production_tier_name IS NOT NULL
             GROUP BY production_tier_name`,
            queryParams
          )
        : { rows: [] };

      const categoryRes = await client.query(
        `SELECT COALESCE(NULLIF(produk, ''), 'Tidak diisi') AS category, COUNT(*)::int AS total
         ${scope}
         GROUP BY 1 ORDER BY total DESC LIMIT 6`,
        queryParams
      );

      const pageRes = await client.query(
        `SELECT COALESCE(NULLIF(page_url, ''), '(tidak diketahui)') AS page, COUNT(*)::int AS total
         ${scope}
         GROUP BY 1 ORDER BY total DESC LIMIT 8`,
        queryParams
      );

      qualification = {
        ...summaryRes.rows[0],
        tiers: tierRes.rows,
        categories: categoryRes.rows,
        pages: pageRes.rows,
      };
    } catch (qualErr: any) {
      console.error('[lead-monitor/stats] Qualification summary failed:', qualErr?.message);
    }

    return NextResponse.json(
      {
        success: true,
        qualificationColumnsReady: hasQualificationColumns,
        qualification,
        filter: {
          busdev: busdevFilter,
          status: statusFilter,
          period,
          startDate: validStart,
          endDate: validEnd,
          search,
          kind: kindFilter,
        },
        kpi: {
          totalClicks: kpi.total_clicks,
          confirmedChats: kpi.confirmed_chats,
          dropoffClicks: kpi.dropoff_clicks,
          directChats: kpi.direct_chats || 0,
          conversionRate: convRate,
        },
        busdevBreakdown: breakdownRes.rows,
        leads: visibleLeads,
        listMeta: {
          rawRows: rawRows.length,
          mergedAway: rawRows.length - mergedAll.length,
          rawCapped: rawRows.length >= RAW_ROW_CAP,
          tabCounts,
        },
        serverTime: new Date().toISOString(),
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (err: any) {
    hasError = true;
    console.error('[lead-monitor/stats] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch lead stats' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  } finally {
    if (client) {
      client.release(hasError);
    }
  }
}
