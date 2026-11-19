import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { canEditLead } from '@/lib/crm-stages';
import { computeReminder, parseDueInput, REMINDER_DB_STAGES, type Reminder } from '@/lib/crm-reminders';

export const dynamic = 'force-dynamic';

const CODE_RE = /^[A-Za-z0-9_.:\-]{3,80}$/;
const NOTE_MAX = 300;

/**
 * Jadwal reminder follow-up untuk lead di SEMUA tahap Warm dan Hot (tugas #2.2).
 *
 *  GET   : sales melihat lead miliknya sendiri (PIC = assigned_to); Head/Admin melihat semua dan boleh memfilter ?pic=Nama.
 *  POST  : { tracking_code, due_at, note? } jadwalkan / jadwalkan ulang reminder manual (satu terbuka per lead).
 *  PATCH : { tracking_code, action: 'done' | 'snooze', days? } catat sudah follow-up (jadwal otomatis mulai lagi) / tunda.
 *
 * Izin ditentukan server dari tabel leads: Head semua, sales hanya lead miliknya.
 */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req, { write: false });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  const picParam = new URL(req.url).searchParams.get('pic')?.trim() || '';
  const pic = user.role === 'head' ? (picParam && picParam !== 'all' ? picParam : null) : user.name;

  const pool = getMonitorPool();
  const res = await pool.query(
    `SELECT cls.tracking_code, cls.stage, cls.stage_changed_at, cls.moq_manual, cls.note AS lead_note,
            l.nama, l.wa_profile_name, COALESCE(NULLIF(l.wa_phone, ''), NULLIF(l.hp, '')) AS phone,
            l.assigned_to, l.source, l.produk,
            GREATEST(
              COALESCE((SELECT MAX(m.created_at) FROM crm_chat_messages m
                         WHERE m.tracking_code = cls.tracking_code
                            OR m.phone = ANY(ARRAY[l.wa_phone, l.whatsapp_phone_e164, regexp_replace(COALESCE(l.hp, ''), '^0', '62')])), 'epoch'::timestamptz),
              COALESCE((SELECT MAX(f.completed_at) FROM crm_followups f WHERE f.tracking_code = cls.tracking_code), 'epoch'::timestamptz),
              COALESCE(cls.stage_changed_at, 'epoch'::timestamptz)
            ) AS last_activity_at,
            mr.id AS reminder_id, mr.due_at AS manual_due_at, mr.note AS reminder_note
       FROM crm_lead_state cls
       JOIN leads l ON l.tracking_code = cls.tracking_code AND l.is_test IS NOT TRUE
       LEFT JOIN LATERAL (
         SELECT f.id, f.due_at, f.note FROM crm_followups f
          WHERE f.tracking_code = cls.tracking_code AND f.completed_at IS NULL
          ORDER BY f.due_at ASC LIMIT 1
       ) mr ON TRUE
      WHERE cls.stage = ANY($1::text[])
        AND ($2::text IS NULL OR lower(btrim(l.assigned_to)) = lower(btrim($2)))
      LIMIT 2000`,
    [REMINDER_DB_STAGES, pic]
  );

  const now = new Date();
  const items = res.rows
    .map((r) => {
      const last = r.last_activity_at ? new Date(r.last_activity_at) : null;
      const lastReal = last && last.getUTCFullYear() > 1971 ? last : null; // 'epoch' = tidak ada aktivitas tercatat
      const rem: Reminder | null = computeReminder({
        stage: r.stage,
        lastActivityAt: lastReal,
        manualDueAt: r.manual_due_at ? new Date(r.manual_due_at) : null,
        now,
      });
      if (!rem) return null;
      return {
        tracking_code: r.tracking_code,
        name: r.nama || r.wa_profile_name || 'Calon Klien',
        phone: r.phone || null,
        pic: r.assigned_to || null,
        stage: rem.stage,
        source: r.source || null,
        produk: r.produk || null,
        moq: r.moq_manual ?? null,
        last_activity_at: lastReal ? lastReal.toISOString() : null,
        due_at: rem.dueAt.toISOString(),
        due_source: rem.source,
        state: rem.state,
        interval_days: rem.intervalDays,
        reminder_id: r.reminder_id ? Number(r.reminder_id) : null,
        note: r.reminder_note || null,
        can_edit: canEditLead(user, r.assigned_to),
        _due: rem.dueAt,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a._due.getTime() - b._due.getTime())
    .map(({ _due, ...rest }) => rest);

  const counts = { overdue: 0, today: 0, upcoming: 0, total: items.length };
  for (const i of items) counts[i.state]++;
  const pics = user.role === 'head' ? [...new Set(items.map((i) => i.pic).filter((p): p is string => !!p))].sort() : [user.name];

  return json({ success: true, reminders: items, counts, pics, viewer: { name: user.name, role: user.role } });
}

async function loadLead(code: string) {
  const r = await getMonitorPool().query(`SELECT tracking_code, assigned_to FROM leads WHERE tracking_code = $1 AND is_test IS NOT TRUE`, [code]);
  return r.rows[0] as { tracking_code: string; assigned_to: string | null } | undefined;
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  const body = await req.json().catch(() => null);
  const code = typeof body?.tracking_code === 'string' ? body.tracking_code.trim() : '';
  if (!CODE_RE.test(code)) return json({ success: false, error: 'Kode lead tidak valid' }, 400);
  const due = parseDueInput(body?.due_at);
  if (!due) return json({ success: false, error: 'Tanggal jadwal tidak valid (maksimal 1 tahun ke depan)' }, 400);
  const note = typeof body?.note === 'string' && body.note.trim() ? body.note.trim().slice(0, NOTE_MAX) : null;

  const lead = await loadLead(code);
  if (!lead) return json({ success: false, error: 'Lead tidak ditemukan' }, 404);
  if (!canEditLead(user, lead.assigned_to)) return json({ success: false, error: 'Anda hanya bisa menjadwalkan lead milik Anda sendiri' }, 403);

  const pool = getMonitorPool();
  const upd = await pool.query(`UPDATE crm_followups SET due_at = $2, note = $3 WHERE tracking_code = $1 AND completed_at IS NULL RETURNING id`, [code, due, note]);
  if (upd.rowCount) return json({ success: true, id: Number(upd.rows[0].id), updated: true });
  const ins = await pool.query(
    `INSERT INTO crm_followups (tracking_code, due_at, note, created_by) VALUES ($1, $2, $3, $4) RETURNING id`,
    [code, due, note, user.name]
  );
  return json({ success: true, id: Number(ins.rows[0].id), updated: false });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  const body = await req.json().catch(() => null);
  const code = typeof body?.tracking_code === 'string' ? body.tracking_code.trim() : '';
  const action = body?.action;
  if (!CODE_RE.test(code) || (action !== 'done' && action !== 'snooze')) return json({ success: false, error: 'Permintaan tidak valid' }, 400);

  const lead = await loadLead(code);
  if (!lead) return json({ success: false, error: 'Lead tidak ditemukan' }, 404);
  if (!canEditLead(user, lead.assigned_to)) return json({ success: false, error: 'Anda hanya bisa mengubah lead milik Anda sendiri' }, 403);

  const pool = getMonitorPool();
  if (action === 'done') {
    // Tutup reminder terbuka; bila tidak ada, catat sebagai follow-up yang sudah dilakukan (me-restart jadwal otomatis).
    const closed = await pool.query(
      `UPDATE crm_followups SET completed_at = NOW(), completed_by = $2 WHERE tracking_code = $1 AND completed_at IS NULL RETURNING id`,
      [code, user.name]
    );
    if (!closed.rowCount) {
      await pool.query(
        `INSERT INTO crm_followups (tracking_code, due_at, note, created_by, completed_at, completed_by)
         VALUES ($1, NOW(), 'Follow-up dicatat', $2, NOW(), $2)`,
        [code, user.name]
      );
    }
    return json({ success: true });
  }

  const days = Number(body?.days);
  if (!Number.isInteger(days) || days < 1 || days > 30) return json({ success: false, error: 'Tunda 1 sampai 30 hari' }, 400);
  const due = new Date(Date.now() + days * 86_400_000);
  const upd = await pool.query(`UPDATE crm_followups SET due_at = $2 WHERE tracking_code = $1 AND completed_at IS NULL RETURNING id`, [code, due]);
  if (!upd.rowCount) {
    await pool.query(`INSERT INTO crm_followups (tracking_code, due_at, note, created_by) VALUES ($1, $2, 'Ditunda', $3)`, [code, due, user.name]);
  }
  return json({ success: true, due_at: due.toISOString() });
}
