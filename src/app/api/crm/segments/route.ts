import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { isAdminRole, normalizeCrmSource, normalizeStage } from '@/lib/crm-stages';
import { convia } from '@/lib/convia';

export const dynamic = 'force-dynamic';

/**
 * Helper: memfilter tag sehingga tag non-`crm-` tidak pernah disentuh/dihapus.
 */
export function mergeCrmSegmentTag(existingTags: string[], segmentTag: string, shouldHave: boolean): string[] {
  const nonCrm = existingTags.filter((t) => !t.startsWith('crm-'));
  const otherCrm = existingTags.filter((t) => t.startsWith('crm-') && t !== segmentTag);
  const next = [...nonCrm, ...otherCrm];
  if (shouldHave) next.push(segmentTag);
  return next.slice(0, 20);
}

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (isAuthFailure(auth)) return auth;
  const { user } = auth;
  const isAdmin = isAdminRole(user.role);

  const pool = getMonitorPool();
  const [segRes, leadsRes] = await Promise.all([
    pool.query(
      `SELECT id, name, filters, owner_name, last_synced_at, last_synced_count, created_at
         FROM crm_segments
        ${isAdmin ? '' : 'WHERE lower(owner_name) = lower($1)'}
        ORDER BY created_at DESC`,
      isAdmin ? [] : [user.name]
    ),
    pool.query(
      `SELECT l.id, l.tracking_code, COALESCE(NULLIF(l.nama, ''), l.wa_profile_name) AS name,
              COALESCE(NULLIF(l.whatsapp_phone_e164, ''), NULLIF(l.wa_phone, ''), l.hp) AS phone,
              l.source, l.utm_source, l.utm_medium, l.utm_campaign, l.page_url, l.referrer,
              l.produk, cls.produk_manual, cls.brand, COALESCE(cls.stage, 'lead_masuk') AS stage,
              COALESCE(NULLIF(cls.owner, ''), l.assigned_to) AS sales_name,
              l.fu_status, l.confirmed_at, l.opt_out, l.created_at
         FROM leads l
         LEFT JOIN crm_lead_state cls ON cls.tracking_code = l.tracking_code
        WHERE l.is_test IS NOT TRUE
          AND COALESCE(l.opt_out, FALSE) = FALSE
          ${isAdmin ? '' : 'AND lower(COALESCE(NULLIF(cls.owner, \'\'), l.assigned_to, \'\')) = lower($1)'}
        ORDER BY l.created_at DESC
        LIMIT 500`,
      isAdmin ? [] : [user.name]
    ),
  ]);

  const contacts = leadsRes.rows.map((r: any) => ({
    id: Number(r.id),
    tracking_code: r.tracking_code,
    name: r.name || 'Calon Klien',
    phone: r.phone || '',
    brand: r.brand || '',
    produk: r.produk_manual || r.produk || '',
    stage: normalizeStage(r.stage),
    source: normalizeCrmSource(r).source,
    campaign: r.utm_campaign || '',
    sales_name: r.sales_name || '',
    fu_status: r.fu_status || null,
    has_chatted: Boolean(r.confirmed_at),
    created_at: r.created_at,
  }));

  return json({ success: true, segments: segRes.rows, contacts });
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;

  const body = await req.json().catch(() => null);
  const pool = getMonitorPool();

  if (body?.action === 'save') {
    const name = String(body?.name || '').trim().slice(0, 40);
    if (!name) return json({ success: false, error: 'Nama segmen wajib diisi' }, 400);
    const res = await pool.query(
      `INSERT INTO crm_segments (name, filters, owner_name) VALUES ($1, $2::jsonb, $3) RETURNING *`,
      [name, JSON.stringify(body?.filters || {}), auth.user.name]
    );
    return json({ success: true, segment: res.rows[0] });
  }

  if (body?.action === 'sync_convia') {
    const segmentName = String(body?.name || 'segmen').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    const tag = `crm-${segmentName}`.slice(0, 50);
    const phones: string[] = Array.isArray(body?.phones) ? body.phones.filter(Boolean) : [];
    let synced = 0;

    for (const p of phones.slice(0, 50)) {
      const r = await convia.upsertCustomer({
        phone_number: p,
        tags: [tag],
      });
      if (r.ok) synced++;
    }

    if (body?.segmentId) {
      await pool.query(
        `UPDATE crm_segments SET last_synced_at = NOW(), last_synced_count = $2 WHERE id = $1`,
        [Number(body.segmentId), synced]
      );
    }
    return json({ success: true, tag, synced });
  }

  return json({ success: false, error: 'Aksi tidak dikenal' }, 400);
}
