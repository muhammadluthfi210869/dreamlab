import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getMonitorPool } from '@/lib/db';
import { assignNextSalesTx, normalizePhoneE164Digits } from '@/lib/crm-round-robin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/wa/rotator?src=...&campaign=...&text=...
 * Endpoint rotator untuk tombol WhatsApp di website:
 *  - Memilih sales aktif berikutnya lewat transaksi Round Robin (SELECT ... FOR UPDATE)
 *  - Mencatat klik di tabel `leads` + log penugasan di `crm_lead_assignments`
 *  - Redirect 302 ke `https://wa.me/<nomor_sales>?text=<pesan + kode referensi>`
 */
export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const src = sp.get('src')?.trim() || sp.get('source')?.trim() || 'Website/SEO';
  const campaign = sp.get('campaign')?.trim() || sp.get('utm_campaign')?.trim() || null;
  const customText = sp.get('text')?.trim() || 'Halo Dreamlab, saya ingin konsultasi maklon produk.';
  const trackingCode = `DL-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

  const pool = getMonitorPool();
  const client = await pool.connect();

  let targetPhone = '6287776550657'; // fallback jika belum ada nomor WA sales
  let assignedName = 'Antrean';

  try {
    await client.query('BEGIN');
    const res = await assignNextSalesTx(client, {
      trackingCode,
      source: src,
    });

    if (res.sales) {
      assignedName = res.sales.name;
      const norm = normalizePhoneE164Digits(res.sales.wa_number);
      if (norm) targetPhone = norm;
    }

    await client.query(
      `INSERT INTO leads (tracking_code, assigned_to, status, source, utm_campaign, page_url, referrer, created_at)
       VALUES ($1, $2, 'pending', $3, $4, $5, $6, NOW())
       ON CONFLICT (tracking_code) DO NOTHING`,
      [
        trackingCode,
        assignedName,
        src,
        campaign,
        sp.get('landing_path')?.trim() || req.headers.get('referer') || '/api/wa/rotator',
        req.headers.get('referer') || null,
      ]
    );

    await client.query('COMMIT');
  } catch (e: any) {
    await client.query('ROLLBACK').catch(() => undefined);
    console.error('[wa/rotator] error:', e?.message);
  } finally {
    client.release();
  }

  const finalText = `${customText}\n[Ref: ${trackingCode}]`;
  const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(finalText)}`;

  return NextResponse.redirect(waUrl, { status: 302 });
}
