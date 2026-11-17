import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { generateRandomPin, hashPassword, isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { assignNextSalesTx, drainQueuedLeadsTx, normalizePhoneE164Digits } from '@/lib/crm-round-robin';

export const dynamic = 'force-dynamic';

const OFF_REASONS = ['Cuti', 'Sakit', 'Libur', 'Off shift'] as const;

/**
 * Tindakan Admin atas satu akun / sales:
 *   reset-password : buat PIN sementara acak baru (6 digit), simpan hash-nya, wajibkan ganti saat masuk, cabut semua sesi
 *   deactivate     : nonaktifkan akun login + cabut semua sesi
 *   activate       : aktifkan akun login lagi
 *   unlock         : buka kunci akibat salah kata sandi / PIN
 *   logout-all     : cabut semua sesi akun
 *   update-sales   : ubah nomor WA, status ON/OFF round-robin + alasan (Cuti/Sakit/Libur/Off shift), off_until
 *   archive        : arsipkan sales (soft-delete, tidak bisa login, keluar dari giliran; pilih bagi ulang lead aktif atau tetap)
 */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req, { role: 'admin', write: true });
  if (isAuthFailure(auth)) return auth;
  const { id } = await ctx.params;
  const uid = parseInt(id, 10);
  if (!Number.isInteger(uid) || uid <= 0) return json({ success: false, error: 'ID tidak valid' }, 400);
  const body = await req.json().catch(() => null);
  const action = typeof body?.action === 'string' ? body.action : '';

  const pool = getMonitorPool();
  const target = await pool.query(`SELECT id, name, role, is_active FROM crm_users WHERE id = $1`, [uid]);
  const t = target.rows[0];
  if (!t) return json({ success: false, error: 'Akun tidak ditemukan' }, 404);

  switch (action) {
    case 'reset-password': {
      const tempPin = generateRandomPin();
      const pwHash = hashPassword(tempPin);
      await pool.query(
        `UPDATE crm_users SET password_hash = $2, must_change_password = TRUE, password_changed_at = NULL, failed_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE id = $1`,
        [uid, pwHash]
      );
      await pool.query(`DELETE FROM crm_sessions WHERE user_id = $1`, [uid]);
      return json({ success: true, name: t.name, tempPin });
    }
    case 'deactivate': {
      if (uid === auth.user.id) return json({ success: false, error: 'Tidak bisa menonaktifkan akun sendiri' }, 400);
      await pool.query(`UPDATE crm_users SET is_active = FALSE, updated_at = NOW() WHERE id = $1`, [uid]);
      await pool.query(`DELETE FROM crm_sessions WHERE user_id = $1`, [uid]);
      return json({ success: true });
    }
    case 'activate':
      await pool.query(`UPDATE crm_users SET is_active = TRUE, updated_at = NOW() WHERE id = $1`, [uid]);
      return json({ success: true });
    case 'unlock':
      await pool.query(`UPDATE crm_users SET failed_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE id = $1`, [uid]);
      return json({ success: true });
    case 'logout-all':
      await pool.query(`DELETE FROM crm_sessions WHERE user_id = $1`, [uid]);
      return json({ success: true });

    case 'update-sales': {
      const nextActive = typeof body?.rr_active === 'boolean' ? body.rr_active : undefined;
      const offReason = typeof body?.off_reason === 'string' && body.off_reason.trim() ? body.off_reason.trim() : null;
      const offUntil = typeof body?.off_until === 'string' && body.off_until.trim() ? body.off_until.trim() : null;
      const waRaw = typeof body?.wa_number === 'string' ? body.wa_number.trim() : undefined;
      const waDigits = waRaw !== undefined ? (waRaw === '' ? null : normalizePhoneE164Digits(waRaw)) : undefined;

      if (nextActive === false && offReason && !(OFF_REASONS as readonly string[]).includes(offReason)) {
        return json({ success: false, error: 'Alasan OFF harus salah satu: Cuti, Sakit, Libur, Off shift' }, 400);
      }
      if (waRaw && !waDigits) {
        return json({ success: false, error: 'Format nomor WhatsApp tidak valid' }, 400);
      }

      const client = await pool.connect();
      let drainedCount = 0;
      try {
        await client.query('BEGIN');

        await client.query(
          `INSERT INTO sales (name, wa_number, role, is_active, off_reason, off_until)
           VALUES ($1, $2, CASE WHEN $3 IN ('admin', 'head') THEN 'admin' ELSE 'busdev' END, COALESCE($4, TRUE), $5, $6)
           ON CONFLICT (name) DO UPDATE SET
             wa_number = CASE WHEN $7 THEN $2 ELSE sales.wa_number END,
             is_active = COALESCE($4, sales.is_active),
             off_reason = CASE WHEN COALESCE($4, sales.is_active) = TRUE THEN NULL ELSE COALESCE($5, sales.off_reason) END,
             off_until = CASE WHEN COALESCE($4, sales.is_active) = TRUE THEN NULL ELSE COALESCE($6, sales.off_until) END,
             updated_at = NOW()`,
          [t.name, waDigits ?? null, t.role, nextActive ?? null, offReason, offUntil, waDigits !== undefined]
        );

        if (nextActive !== undefined) {
          await client.query(
            `UPDATE busdevs SET is_active = $2 WHERE lower(name) = lower($1)`,
            [t.name, nextActive]
          ).catch(() => undefined);
        }

        if (waDigits) {
          const localPhone = waDigits.startsWith('62') ? '0' + waDigits.slice(2) : waDigits;
          await client.query(
            `UPDATE busdevs SET phone = $2 WHERE lower(name) = lower($1)`,
            [t.name, localPhone]
          ).catch(() => undefined);
        }

        if (nextActive === true) {
          drainedCount = await drainQueuedLeadsTx(client);
        }

        await client.query('COMMIT');
        return json({ success: true, drainedCount });
      } catch (e: any) {
        await client.query('ROLLBACK').catch(() => undefined);
        console.error('[crm/users/[id]] update-sales error:', e?.message);
        return json({ success: false, error: 'Gagal memperbarui status sales' }, 500);
      } finally {
        client.release();
      }
    }

    case 'archive': {
      if (uid === auth.user.id) {
        return json({ success: false, error: 'Tidak bisa mengarsipkan akun sendiri' }, 400);
      }
      const archiveMode = body?.archiveMode === 'redistribute' ? 'redistribute' : 'keep';
      const client = await pool.connect();
      let redistributed = 0;
      try {
        await client.query('BEGIN');

        await client.query(
          `UPDATE crm_users SET is_active = FALSE, updated_at = NOW() WHERE id = $1`,
          [uid]
        );
        await client.query(`DELETE FROM crm_sessions WHERE user_id = $1`, [uid]);
        await client.query(
          `UPDATE sales SET is_active = FALSE, deleted_at = NOW(), updated_at = NOW() WHERE lower(name) = lower($1)`,
          [t.name]
        );
        await client.query(
          `UPDATE busdevs SET is_active = FALSE WHERE lower(name) = lower($1)`,
          [t.name]
        ).catch(() => undefined);

        if (archiveMode === 'redistribute') {
          const activeLeads = await client.query(
            `SELECT l.tracking_code, l.nama, l.wa_profile_name,
                    COALESCE(NULLIF(l.whatsapp_phone_e164, ''), NULLIF(l.wa_phone, ''), NULLIF(l.hp, '')) AS phone,
                    l.source
               FROM leads l
               LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
              WHERE l.is_test IS NOT TRUE
                AND lower(COALESCE(NULLIF(cls.owner, ''), l.assigned_to, '')) = lower($1)
                AND COALESCE(cls.stage, 'lead_masuk') NOT IN ('deal', 'lost')
              ORDER BY l.created_at ASC`,
            [t.name]
          );

          for (const lead of activeLeads.rows) {
            const next = await assignNextSalesTx(client, {
              trackingCode: lead.tracking_code,
              phone: lead.phone,
              leadName: lead.nama || lead.wa_profile_name || null,
              source: lead.source || null,
              forceMethod: 'round_robin',
            });
            const nextOwner = next.sales ? next.sales.name : 'Antrean';
            const nextId = next.sales ? next.sales.id : null;
            await client.query(`UPDATE leads SET assigned_to = $2 WHERE tracking_code = $1`, [lead.tracking_code, nextOwner]);
            await client.query(
              `INSERT INTO crm_lead_state (tracking_code, owner, owner_sales_id, updated_by, updated_at)
               VALUES ($1, $2, $3, $4, NOW())
               ON CONFLICT (tracking_code) DO UPDATE SET
                 owner = EXCLUDED.owner,
                 owner_sales_id = EXCLUDED.owner_sales_id,
                 updated_by = EXCLUDED.updated_by,
                 updated_at = NOW()`,
              [lead.tracking_code, nextOwner, nextId, auth.user.name]
            );
            if (next.sales) redistributed++;
          }
        }

        await client.query('COMMIT');
        return json({ success: true, archived: true, archiveMode, redistributed });
      } catch (e: any) {
        await client.query('ROLLBACK').catch(() => undefined);
        console.error('[crm/users/[id]] archive error:', e?.message);
        return json({ success: false, error: 'Gagal mengarsipkan sales' }, 500);
      } finally {
        client.release();
      }
    }

    default:
      return json({ success: false, error: 'Tindakan tidak dikenal' }, 400);
  }
}
