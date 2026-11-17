import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { isAdminRole, normalizeStage } from '@/lib/crm-stages';
import { computeBusinessSeconds, computeFuStatus } from '@/lib/crm-automation';

export const dynamic = 'force-dynamic';

/**
 * GET /api/crm/reminder?startDate=...&endDate=...
 * Mengembalikan KPI Kecepatan Balas (SLA), daftar "Perlu dibalas sekarang",
 * daftar FU 1 & FU 2 (dan Saran Lost), serta tabel per sales (Admin saja).
 */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;
  const isAdmin = isAdminRole(user.role);

  const sp = req.nextUrl.searchParams;
  const nowWib = new Date(Date.now() + 7 * 3600_000);
  const todayStr = nowWib.toISOString().slice(0, 10);
  const startDate = sp.get('startDate')?.trim() || `${todayStr.slice(0, 7)}-01`;
  const endDate = sp.get('endDate')?.trim() || todayStr;

  const pool = getMonitorPool();

  const [settingsRes, rtRes, leadsChatRes] = await Promise.all([
    pool.query(`SELECT * FROM automation_settings WHERE id = 1`),
    pool.query(
      `SELECT sales_name, business_seconds, is_first
         FROM response_times
        WHERE reply_at >= (($1::date)::timestamp AT TIME ZONE 'Asia/Jakarta')
          AND reply_at <  ((($2::date + 1))::timestamp AT TIME ZONE 'Asia/Jakarta')
          ${isAdmin ? '' : 'AND lower(sales_name) = lower($3)'}`,
      isAdmin ? [startDate, endDate] : [startDate, endDate, user.name]
    ),
    pool.query(
      `SELECT l.id, l.tracking_code, COALESCE(NULLIF(l.nama, ''), l.wa_profile_name) AS lead_name,
              COALESCE(NULLIF(l.whatsapp_phone_e164, ''), NULLIF(l.wa_phone, ''), l.hp) AS phone,
              COALESCE(NULLIF(cls.owner, ''), l.assigned_to, 'Unassigned') AS sales_name,
              COALESCE(cls.stage, 'lead_masuk') AS stage,
              last_msg.direction AS last_direction,
              last_msg.created_at AS last_msg_at,
              last_msg.message_text AS last_text,
              first_unanswered.created_at AS waiting_since
         FROM leads l
         LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
         LEFT JOIN LATERAL (
           SELECT direction, created_at, message_text
             FROM crm_chat_messages m
            WHERE (m.tracking_code = l.tracking_code OR m.phone = COALESCE(NULLIF(l.whatsapp_phone_e164, ''), NULLIF(l.wa_phone, ''), l.hp))
              AND COALESCE(m.sender_type, '') <> 'flow'
            ORDER BY m.created_at DESC
            LIMIT 1
         ) last_msg ON TRUE
         LEFT JOIN LATERAL (
           SELECT m.created_at
             FROM crm_chat_messages m
            WHERE (m.tracking_code = l.tracking_code OR m.phone = COALESCE(NULLIF(l.whatsapp_phone_e164, ''), NULLIF(l.wa_phone, ''), l.hp))
              AND m.direction = 'inbound'
              AND m.created_at > COALESCE(
                (SELECT MAX(m2.created_at) FROM crm_chat_messages m2
                  WHERE (m2.tracking_code = l.tracking_code OR m2.phone = COALESCE(NULLIF(l.whatsapp_phone_e164, ''), NULLIF(l.wa_phone, ''), l.hp))
                    AND m2.direction = 'outbound'
                    AND COALESCE(m2.sender_type, '') <> 'flow'),
                '1970-01-01'::timestamptz
              )
            ORDER BY m.created_at ASC
            LIMIT 1
         ) first_unanswered ON TRUE
        WHERE l.is_test IS NOT TRUE
          AND COALESCE(cls.stage, 'lead_masuk') NOT IN ('deal', 'lost')
          AND last_msg.created_at IS NOT NULL
          ${isAdmin ? '' : 'AND lower(COALESCE(NULLIF(cls.owner, \'\'), l.assigned_to, \'\')) = lower($1)'}
        ORDER BY last_msg.created_at ASC
        LIMIT 300`,
      isAdmin ? [] : [user.name]
    ),
  ]);

  const settings = settingsRes.rows[0] || {
    work_start: '08:00',
    work_end: '20:00',
    sla_minutes: 15,
    sla_enabled: true,
    fu1_days: 1,
    fu2_days: 3,
    lost_suggest_days: 7,
  };

  const slaSec = Number(settings.sla_minutes || 15) * 60;
  const now = new Date();

  const waitingList: any[] = [];
  const fu1List: any[] = [];
  const fu2List: any[] = [];
  const salesMap = new Map<string, any>();

  const ensureSales = (name: string) => {
    let s = salesMap.get(name);
    if (!s) {
      s = {
        sales_name: name,
        replyCount: 0,
        firstSumSec: 0,
        firstCount: 0,
        allSumSec: 0,
        withinTargetCount: 0,
        waitingCount: 0,
        lateCount: 0,
        fu1Count: 0,
        fu2Count: 0,
      };
      salesMap.set(name, s);
    }
    return s;
  };

  for (const r of rtRes.rows) {
    const sec = Number(r.business_seconds || 0);
    const s = ensureSales(r.sales_name);
    s.replyCount++;
    s.allSumSec += sec;
    if (r.is_first) {
      s.firstSumSec += sec;
      s.firstCount++;
    }
    if (sec <= slaSec) s.withinTargetCount++;
  }

  let totalReplies = 0;
  let firstReplySum = 0;
  let firstReplyCount = 0;
  let allReplySum = 0;
  let withinSlaCount = 0;

  for (const r of rtRes.rows) {
    const sec = Number(r.business_seconds || 0);
    totalReplies++;
    allReplySum += sec;
    if (r.is_first) {
      firstReplySum += sec;
      firstReplyCount++;
    }
    if (sec <= slaSec) withinSlaCount++;
  }

  for (const row of leadsChatRes.rows) {
    const stage = normalizeStage(row.stage);
    const s = ensureSales(row.sales_name);

    if (row.last_direction === 'inbound' && row.waiting_since) {
      const waitSec = computeBusinessSeconds(
        new Date(row.waiting_since),
        now,
        settings.work_start,
        settings.work_end
      );
      const waitMin = Math.round(waitSec / 60);
      const isLate = Boolean(settings.sla_enabled) && waitSec > slaSec;
      s.waitingCount++;
      if (isLate) s.lateCount++;
      waitingList.push({
        id: Number(row.id),
        tracking_code: row.tracking_code,
        lead_name: row.lead_name || row.phone || row.tracking_code,
        phone: row.phone,
        sales_name: row.sales_name,
        stage,
        waiting_minutes: waitMin,
        is_late: isLate,
        last_text: row.last_text,
      });
    } else if (row.last_direction === 'outbound' && row.last_msg_at) {
      const fu = computeFuStatus({
        stage,
        lastMessageDirection: 'outbound',
        lastSalesMsgAt: new Date(row.last_msg_at),
        now,
        fu1Days: Number(settings.fu1_days || 1),
        fu2Days: Number(settings.fu2_days || 3),
        lostDays: Number(settings.lost_suggest_days || 7),
      });
      if (fu === 'FU 1') {
        s.fu1Count++;
        fu1List.push({ ...row, stage, fu_status: fu });
      } else if (fu === 'FU 2' || fu === 'Saran Lost') {
        s.fu2Count++;
        fu2List.push({ ...row, stage, fu_status: fu });
      }
    }
  }

  waitingList.sort((a, b) => b.waiting_minutes - a.waiting_minutes);

  const lateCount = waitingList.filter((w) => w.is_late).length;
  const actionNeededCount = waitingList.length + fu1List.length + fu2List.length;

  return json({
    success: true,
    settings,
    kpi: {
      avgFirstReplyMin: firstReplyCount > 0 ? Math.round(firstReplySum / firstReplyCount / 60) : 0,
      avgAllReplyMin: totalReplies > 0 ? Math.round(allReplySum / totalReplies / 60) : 0,
      withinTargetPct: totalReplies > 0 ? Math.round((withinSlaCount / totalReplies) * 100) : 100,
      waitingCount: waitingList.length,
      lateCount,
      fu1Count: fu1List.length,
      fu2Count: fu2List.length,
      actionNeededCount,
    },
    waitingList,
    fu1List,
    fu2List,
    perSales: isAdmin
      ? Array.from(salesMap.values()).map((s) => ({
          sales_name: s.sales_name,
          replyCount: s.replyCount,
          avgFirstMin: s.firstCount > 0 ? Math.round(s.firstSumSec / s.firstCount / 60) : 0,
          avgAllMin: s.replyCount > 0 ? Math.round(s.allSumSec / s.replyCount / 60) : 0,
          withinTargetPct: s.replyCount > 0 ? Math.round((s.withinTargetCount / s.replyCount) * 100) : 100,
          waitingCount: s.waitingCount,
          lateCount: s.lateCount,
          fu1Count: s.fu1Count,
          fu2Count: s.fu2Count,
        }))
      : null,
  });
}

/**
 * PUT /api/crm/reminder (Admin saja) — Update target SLA & hari FU 1 / FU 2 / Saran Lost
 */
export async function PUT(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  if (!isAdminRole(auth.user.role)) {
    return json({ success: false, error: 'Hanya Admin yang boleh mengubah pengaturan SLA & FU' }, 403);
  }

  const body = await req.json().catch(() => null);
  const slaMinutes = parseInt(String(body?.sla_minutes ?? 15), 10);
  const slaEnabled = body?.sla_enabled !== false;
  const fu1Days = parseInt(String(body?.fu1_days ?? 1), 10);
  const fu2Days = parseInt(String(body?.fu2_days ?? 3), 10);
  const lostDays = parseInt(String(body?.lost_suggest_days ?? 7), 10);

  if (fu2Days <= fu1Days) {
    return json({ success: false, error: 'Hari FU 2 harus lebih besar dari FU 1' }, 400);
  }

  await getMonitorPool().query(
    `UPDATE automation_settings
        SET sla_minutes = $1,
            sla_enabled = $2,
            fu1_days = $3,
            fu2_days = $4,
            lost_suggest_days = $5,
            updated_at = NOW()
      WHERE id = 1`,
    [Math.max(1, slaMinutes), slaEnabled, Math.max(1, fu1Days), fu2Days, Math.max(fu2Days + 1, lostDays)]
  );

  return json({ success: true });
}
