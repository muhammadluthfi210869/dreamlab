import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const busdevFilter = url.searchParams.get('busdev') || 'Annisa';
  const period = url.searchParams.get('period') || 'today';
  const search = url.searchParams.get('search') || '';

  let client;
  try {
    client = await pool.connect();
    // 1. Filter waktu (Asia/Jakarta boundary)
    let timeClause = '';
    if (period === 'today') {
      timeClause = `AND created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date`;
    } else if (period === '7d') {
      timeClause = `AND created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date - INTERVAL '7 days'`;
    } else if (period === '30d') {
      timeClause = `AND created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date - INTERVAL '30 days'`;
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

    // 3. Filter Search
    let searchClause = '';
    if (search) {
      searchClause = `AND (
        tracking_code ILIKE $${paramIndex}
        OR wa_profile_name ILIKE $${paramIndex}
        OR wa_phone ILIKE $${paramIndex}
        OR page_url ILIKE $${paramIndex}
      )`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // A. Query KPI Summary untuk BusDev terpilih
    const kpiQuery = `
      SELECT 
        COUNT(*)::int AS total_clicks,
        COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed_chats,
        COUNT(*) FILTER (WHERE status IS NULL OR status != 'confirmed')::int AS dropoff_clicks
      FROM leads
      WHERE is_test IS NOT TRUE
        ${timeClause}
        ${busdevClause}
        ${searchClause}
    `;
    const kpiRes = await client.query(kpiQuery, queryParams);
    const kpi = kpiRes.rows[0] || { total_clicks: 0, confirmed_chats: 0, dropoff_clicks: 0 };
    const convRate = kpi.total_clicks > 0 
      ? Number(((kpi.confirmed_chats / kpi.total_clicks) * 100).toFixed(1)) 
      : 0;

    // B. Query Breakdown Per Semua BusDev (untuk tab counter)
    const breakdownQuery = `
      SELECT 
        COALESCE(assigned_to, 'Unassigned') AS busdev_name,
        COUNT(*)::int AS total_clicks,
        COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed_chats,
        COUNT(*) FILTER (WHERE status IS NULL OR status != 'confirmed')::int AS dropoff_clicks
      FROM leads
      WHERE is_test IS NOT TRUE
        ${timeClause}
      GROUP BY assigned_to
      ORDER BY total_clicks DESC
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
        wa_profile_name,
        wa_phone,
        wa_message,
        created_at,
        confirmed_at
      FROM leads
      WHERE is_test IS NOT TRUE
        ${timeClause}
        ${busdevClause}
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
          period,
          search,
        },
        kpi: {
          totalClicks: kpi.total_clicks,
          confirmedChats: kpi.confirmed_chats,
          dropoffClicks: kpi.dropoff_clicks,
          conversionRate: convRate,
        },
        busdevBreakdown: breakdownRes.rows,
        leads: listRes.rows,
        serverTime: new Date().toISOString(),
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (err: any) {
    console.error('[lead-monitor/stats] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch lead stats' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}
