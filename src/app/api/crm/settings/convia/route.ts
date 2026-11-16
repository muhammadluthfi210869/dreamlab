import { NextRequest } from 'next/server';
import { requireUser, isAuthFailure, json } from '@/lib/crm-auth';
import { isAdminRole } from '@/lib/crm-stages';
import { convia } from '@/lib/convia';
import { getMonitorPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/crm/settings/convia
 * Mengambil status health, daftar nomor dari DB convia_numbers, dan daftar sales
 */
export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  if (!isAdminRole(user.role)) {
    return json({ success: false, error: 'Akses ditolak: hanya admin' }, 403);
  }

  const pool = getMonitorPool();

  const [health, numbersRes, salesRes] = await Promise.all([
    convia.health(),
    pool.query(`
      SELECT cn.convia_id, cn.display_phone_number, cn.verified_name, cn.quality_rating,
             cn.is_primary, cn.sales_id, cn.is_shared, cn.synced_at,
             s.name AS sales_name
      FROM convia_numbers cn
      LEFT JOIN sales s ON s.id = cn.sales_id
      ORDER BY cn.is_primary DESC, cn.display_phone_number ASC
    `),
    pool.query(`
      SELECT id, name, wa_number, role, is_active
      FROM sales
      ORDER BY id ASC
    `),
  ]);

  return json({
    success: true,
    health,
    numbers: numbersRes.rows,
    sales: salesRes.rows,
  });
}

/**
 * POST /api/crm/settings/convia (Sync nomor Convia)
 * Memanggil GET /phone-numbers Convia dan melakukan upsert ke tabel convia_numbers
 */
export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  if (!isAdminRole(user.role)) {
    return json({ success: false, error: 'Akses ditolak: hanya admin' }, 403);
  }

  const listRes = await convia.listPhoneNumbers();
  if (!listRes.ok) {
    return json({ success: false, error: listRes.error || 'Gagal sinkronisasi nomor Convia' }, 500);
  }

  const pool = getMonitorPool();
  let syncedCount = 0;

  for (const p of listRes.phoneNumbers) {
    await pool.query(
      `INSERT INTO convia_numbers (convia_id, display_phone_number, verified_name, quality_rating, is_primary, synced_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (convia_id) DO UPDATE SET
         display_phone_number = EXCLUDED.display_phone_number,
         verified_name = EXCLUDED.verified_name,
         quality_rating = EXCLUDED.quality_rating,
         is_primary = EXCLUDED.is_primary,
         synced_at = NOW()`,
      [p.id, p.display_phone_number, p.verified_name || null, p.quality_rating, p.is_primary || false]
    );
    syncedCount++;
  }

  return json({ success: true, count: syncedCount });
}

/**
 * PUT /api/crm/settings/convia (Update pemetaan nomor ke sales / nomor bersama)
 * Body: { convia_id, sales_id: number | null, is_shared: boolean }
 */
export async function PUT(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;

  if (!isAdminRole(user.role)) {
    return json({ success: false, error: 'Akses ditolak: hanya admin' }, 403);
  }

  const body = await req.json().catch(() => null);
  const conviaId = String(body?.convia_id || '').trim();
  const salesId = body?.sales_id !== undefined && body?.sales_id !== null && body?.sales_id !== ''
    ? Number(body.sales_id)
    : null;
  const isShared = Boolean(body?.is_shared);

  if (!conviaId) {
    return json({ success: false, error: 'convia_id wajib diisi' }, 400);
  }

  const pool = getMonitorPool();
  try {
    await pool.query(
      `UPDATE convia_numbers
       SET sales_id = $1, is_shared = $2
       WHERE convia_id = $3`,
      [isShared ? null : salesId, isShared, conviaId]
    );

    // Sinkronkan juga balik ke tabel sales.phone_number_id jika dipetakan ke sales tertentu
    if (!isShared && salesId) {
      await pool.query(
        `UPDATE sales SET phone_number_id = $1, convia_phone_id = $1 WHERE id = $2`,
        [conviaId, salesId]
      );
    }

    return json({ success: true });
  } catch (err: any) {
    return json({ success: false, error: err?.message || 'Gagal menyimpan pemetaan nomor' }, 500);
  }
}
