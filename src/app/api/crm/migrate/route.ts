import { NextRequest } from 'next/server';
import { getMonitorPool } from '@/lib/db';
import { isAuthFailure, json, requireUser } from '@/lib/crm-auth';
import { isAdminRole } from '@/lib/crm-stages';
import { normalizePhoneE164Digits } from '@/lib/crm-round-robin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/crm/migrate (Admin saja)
 * Tahap 5: Dry-run atau import satu kali kontak Convia / Kommo API v4.
 * Cek duplikat berdasarkan nomor E.164 sebelum menulis ke database.
 */
export async function POST(req: NextRequest) {
  const auth = await requireUser(req, { write: true });
  if (isAuthFailure(auth)) return auth;
  if (!isAdminRole(auth.user.role)) {
    return json({ success: false, error: 'Hanya Admin yang boleh menjalankan migrasi data' }, 403);
  }

  const body = await req.json().catch(() => null);
  const dryRun = body?.dryRun !== false;
  const sourceSystem = body?.sourceSystem === 'kommo' ? 'kommo' : 'convia';

  const pool = getMonitorPool();
  const existingPhonesRes = await pool.query(
    `SELECT COALESCE(NULLIF(whatsapp_phone_e164, ''), NULLIF(wa_phone, ''), hp) AS phone
       FROM leads
      WHERE COALESCE(NULLIF(whatsapp_phone_e164, ''), NULLIF(wa_phone, ''), hp) IS NOT NULL`
  );
  const existingSet = new Set<string>();
  for (const r of existingPhonesRes.rows) {
    const p = normalizePhoneE164Digits(r.phone);
    if (p) existingSet.add(p);
  }

  const candidates: Array<{ name: string; phone: string; owner?: string; source?: string }> = [];

  if (sourceSystem === 'convia') {
    const apiKey = (process.env.CONVIA_API_KEY || '').trim();
    const base = (process.env.CONVIA_API_BASE || 'https://api.convia.id/api/v1/public').replace(/\/+$/, '');
    if (!apiKey) {
      return json({ success: false, error: 'CONVIA_API_KEY belum terkonfigurasi di environment' }, 400);
    }
    const res = await fetch(`${base}/customers?limit=100`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const j = await res.json().catch(() => ({}));
    const list = Array.isArray(j?.data) ? j.data : [];
    for (const c of list) {
      const p = normalizePhoneE164Digits(c.phone_number || c.phone);
      if (p) candidates.push({ name: c.name || p, phone: p, source: 'WhatsApp organik' });
    }
  } else {
    const kommoDomain = (process.env.KOMMO_SUBDOMAIN || '').trim();
    const kommoToken = (process.env.KOMMO_ACCESS_TOKEN || '').trim();
    if (!kommoDomain || !kommoToken) {
      return json({
        success: false,
        error: 'KOMMO_SUBDOMAIN / KOMMO_ACCESS_TOKEN belum diisi di environment Vercel',
      }, 400);
    }
    const res = await fetch(`https://${kommoDomain}.kommo.com/api/v4/leads?with=contacts&limit=50`, {
      headers: { Authorization: `Bearer ${kommoToken}` },
    });
    const j = await res.json().catch(() => ({}));
    const leads = Array.isArray(j?._embedded?.leads) ? j._embedded.leads : [];
    for (const l of leads) {
      const p = normalizePhoneE164Digits(String(l.name || '').match(/08\d+|628\d+/)?.[0]);
      if (p) candidates.push({ name: l.name || p, phone: p, source: 'Kommo Import' });
    }
  }

  const toInsert = candidates.filter((c) => !existingSet.has(c.phone));
  const duplicates = candidates.length - toInsert.length;

  if (dryRun) {
    return json({
      success: true,
      dryRun: true,
      sourceSystem,
      totalFetched: candidates.length,
      newLeads: toInsert.length,
      duplicatesSkipped: duplicates,
      preview: toInsert.slice(0, 15),
    });
  }

  let inserted = 0;
  for (const item of toInsert) {
    const code = `IMP-${sourceSystem.toUpperCase()}-${item.phone.slice(-6)}-${Date.now().toString(36).slice(-4)}`;
    await pool.query(
      `INSERT INTO leads (tracking_code, nama, wa_phone, whatsapp_phone_e164, status, source, name_source, name_original, confirmed_at, created_at)
       VALUES ($1, $2, $3, $3, 'confirmed', $4, 'manual', $2, NOW(), NOW())
       ON CONFLICT (tracking_code) DO NOTHING`,
      [code, item.name, item.phone, item.source || 'Import']
    );
    inserted++;
  }

  return json({
    success: true,
    dryRun: false,
    sourceSystem,
    inserted,
    duplicatesSkipped: duplicates,
  });
}
