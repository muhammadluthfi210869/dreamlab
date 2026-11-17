import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { isAdminRole } from '@/lib/crm-stages';
import { evaluateStageAutomation, parseFormMessage } from '@/lib/crm-automation';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;
  if (!isAdminRole(auth.user.role)) {
    return json({ success: false, error: 'Hanya Admin yang boleh mengelola otomasi stage' }, 403);
  }

  const pool = getMonitorPool();
  const [settingsRes, triggersRes] = await Promise.all([
    pool.query(`SELECT * FROM automation_settings WHERE id = 1`),
    pool.query(`SELECT id, phrase, label, target_stage, is_active, sort FROM automation_triggers ORDER BY sort ASC, id ASC`),
  ]);

  return json({
    success: true,
    settings: settingsRes.rows[0] || null,
    triggers: triggersRes.rows,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  if (!isAdminRole(auth.user.role)) {
    return json({ success: false, error: 'Hanya Admin yang boleh menjalankan aksi otomasi' }, 403);
  }

  const body = await req.json().catch(() => null);
  const pool = getMonitorPool();

  // Simulasi "Coba aturan" tanpa mengubah database
  if (body?.action === 'simulate') {
    const currentStage = String(body?.currentStage || 'lead_masuk');
    const sampleChat = String(body?.messageText || '');
    const direction = body?.direction === 'outbound' ? 'outbound' : 'inbound';
    const totalBubbles = Number(body?.totalBubbles || 1);
    const hasSalesRepliedBefore = Boolean(body?.hasSalesRepliedBefore);

    const [settingsRes, triggersRes] = await Promise.all([
      pool.query(`SELECT rules, chat_threshold FROM automation_settings WHERE id = 1`),
      pool.query(`SELECT phrase, label, target_stage, is_active FROM automation_triggers ORDER BY sort ASC, id ASC`),
    ]);

    const st = settingsRes.rows[0] || {
      rules: { form_to_cold: true, reply_to_warm: true, chat_count_to_warm: true, first_sales_reply_to_cold: false },
      chat_threshold: 5,
    };

    const parsedForm = parseFormMessage(sampleChat);
    const result = evaluateStageAutomation({
      currentStage,
      direction,
      messageText: sampleChat,
      totalBubbles,
      hasSalesRepliedBefore,
      moq: parsedForm.moq ?? null,
      rules: { ...(st.rules || {}), chat_threshold: Number(st.chat_threshold || 5) },
      triggers: triggersRes.rows,
    });

    return json({ success: true, simulation: result, parsedForm });
  }

  // Update pengaturan aturan & angka
  if (body?.action === 'save_settings') {
    await pool.query(
      `UPDATE automation_settings
          SET rules = $1::jsonb,
              chat_threshold = $2,
              updated_at = NOW()
        WHERE id = 1`,
      [JSON.stringify(body.rules || {}), Math.max(1, Number(body.chat_threshold || 5))]
    );
    return json({ success: true });
  }

  // Tambah / ubah trigger frasa
  if (body?.action === 'save_trigger') {
    const phrase = String(body?.phrase || '').trim();
    const label = String(body?.label || '').trim();
    const targetStage = String(body?.target_stage || '').trim();
    const isActive = body?.is_active !== false;
    if (!phrase || !label || !targetStage) {
      return json({ success: false, error: 'Frasa, label, dan stage tujuan wajib diisi' }, 400);
    }
    if (body?.id) {
      await pool.query(
        `UPDATE automation_triggers SET phrase = $2, label = $3, target_stage = $4, is_active = $5 WHERE id = $1`,
        [Number(body.id), phrase, label, targetStage, isActive]
      );
    } else {
      await pool.query(
        `INSERT INTO automation_triggers (phrase, label, target_stage, is_active, sort) VALUES ($1, $2, $3, $4, 99)`,
        [phrase, label, targetStage, isActive]
      );
    }
    return json({ success: true });
  }

  if (body?.action === 'delete_trigger' && body?.id) {
    await pool.query(`DELETE FROM automation_triggers WHERE id = $1`, [Number(body.id)]);
    return json({ success: true });
  }

  return json({ success: false, error: 'Aksi tidak dikenal' }, 400);
}
