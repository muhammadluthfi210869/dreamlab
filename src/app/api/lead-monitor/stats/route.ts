import { NextRequest, NextResponse } from 'next/server';
import pool, { resetPool } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const busdevFilter = url.searchParams.get('busdev') || 'all';
  const statusFilter = url.searchParams.get('status') || 'all';
  const period = url.searchParams.get('period') || 'today';
  const startDate = url.searchParams.get('startDate') || '';
  const endDate = url.searchParams.get('endDate') || '';
  const search = url.searchParams.get('search') || '';

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

    // 3. Filter Status (all, confirmed, dropoff)
    let statusClause = '';
    if (statusFilter === 'confirmed') {
      statusClause = "AND status = 'confirmed'";
    } else if (statusFilter === 'dropoff') {
      statusClause = "AND (status IS NULL OR status != 'confirmed') AND source != 'wa-direct'";
    }

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

    // A. Query KPI Summary untuk BusDev terpilih
    const kpiQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE source != 'wa-direct')::int AS total_clicks,
        COUNT(*) FILTER (WHERE status = 'confirmed' AND source != 'wa-direct')::int AS confirmed_chats,
        COUNT(*) FILTER (WHERE (status IS NULL OR status != 'confirmed') AND source != 'wa-direct')::int AS dropoff_clicks,
        COUNT(*) FILTER (WHERE source = 'wa-direct')::int AS direct_chats
      FROM leads
      WHERE is_test IS NOT TRUE
        ${timeClause}
        ${busdevClause}
        ${searchClause}
    `;
    const kpiRes = await client.query(kpiQuery, queryParams);
    const kpi = kpiRes.rows[0] || { total_clicks: 0, confirmed_chats: 0, dropoff_clicks: 0, direct_chats: 0 };
    const convRate = kpi.total_clicks > 0 
      ? Number(((kpi.confirmed_chats / kpi.total_clicks) * 100).toFixed(1)) 
      : 0;

    // B. Query Breakdown Per Semua BusDev (dengan status aktif/nonaktif dari tabel busdevs)
    const breakdownTimeClause = timeClause ? timeClause.replace(/created_at/g, 'l.created_at') : '';
    const breakdownQuery = `
      SELECT 
        b.name AS busdev_name,
        b.is_active,
        COUNT(l.id) FILTER (WHERE l.source != 'wa-direct')::int AS total_clicks,
        COUNT(l.id) FILTER (WHERE l.status = 'confirmed' AND l.source != 'wa-direct')::int AS confirmed_chats,
        COUNT(l.id) FILTER (WHERE (l.status IS NULL OR l.status != 'confirmed') AND l.source != 'wa-direct')::int AS dropoff_clicks,
        COUNT(l.id) FILTER (WHERE l.source = 'wa-direct')::int AS direct_chats
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

    // C. Query Daftar Detail Leads (terbaru ke terlama, limit 150)
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
        ${statusClause}
        ${searchClause}
      ORDER BY created_at DESC
      LIMIT 150
    `;
    const listRes = await client.query(listQuery, queryParams);

    return NextResponse.json(
      {
        success: true,
        filter: {
          busdev: busdevFilter,
          status: statusFilter,
          period,
          startDate: validStart,
          endDate: validEnd,
          search,
        },
        kpi: {
          totalClicks: kpi.total_clicks,
          confirmedChats: kpi.confirmed_chats,
          dropoffClicks: kpi.dropoff_clicks,
          directChats: kpi.direct_chats || 0,
          conversionRate: convRate,
        },
        busdevBreakdown: breakdownRes.rows,
        leads: listRes.rows,
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
