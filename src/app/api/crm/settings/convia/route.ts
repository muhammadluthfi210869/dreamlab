import { NextRequest, NextResponse } from 'next/server';
import { requireUser, isAuthFailure, json } from '@/lib/crm-auth';
import { isAdminRole } from '@/lib/crm-stages';
import { checkConviaHealth, fetchConviaPhoneNumbers } from '@/lib/convia-client';
import { getMonitorPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  if (!isAdminRole(user.role)) {
    return json({ success: false, error: 'Akses ditolak: hanya admin' }, 403);
  }

  const pool = getMonitorPool();

  const [health, phoneData, salesRes] = await Promise.all([
    checkConviaHealth(),
    fetchConviaPhoneNumbers(),
    pool.query(`
      SELECT id, name, wa_number, role, is_active, convia_phone_id
      FROM sales
      ORDER BY id ASC
    `),
  ]);

  return json({
    success: true,
    convia: {
      health,
      phoneNumbers: phoneData.phoneNumbers,
      phoneError: phoneData.error || null,
    },
    sales: salesRes.rows,
  });
}

export async function PUT(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  if (!isAdminRole(user.role)) {
    return json({ success: false, error: 'Akses ditolak: hanya admin' }, 403);
  }

  const body = await req.json().catch(() => null);
  const salesId = Number(body?.sales_id);
  const conviaPhoneId = body?.convia_phone_id !== undefined ? (body.convia_phone_id ? String(body.convia_phone_id).trim() : null) : undefined;

  if (!salesId || isNaN(salesId)) {
    return json({ success: false, error: 'sales_id wajib diisi' }, 400);
  }

  const pool = getMonitorPool();
  try {
    await pool.query(
      `UPDATE sales SET convia_phone_id = $1, updated_at = NOW() WHERE id = $2`,
      [conviaPhoneId, salesId]
    );
    return json({ success: true });
  } catch (err: any) {
    return json({ success: false, error: err?.message || 'Gagal menyimpan pemetaan' }, 500);
  }
}
