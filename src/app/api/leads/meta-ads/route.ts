import { NextRequest, NextResponse } from 'next/server';
import pool, { queryWithRetry } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

// Normalize Indonesian phone numbers to 628...
function normalizeIndonesianPhone(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.startsWith('08')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

// Qualification Logic
function getQualification(quantity: string): { tier: string; priority: string } {
  const q = quantity.replace(/[^\d]/g, '');
  const num = parseInt(q, 10);

  if (num >= 5000) {
    return {
      tier: num >= 10000 ? 'ENTERPRISE' : 'SCALE',
      priority: 'HIGH PRIORITY',
    };
  } else if (num >= 1000) {
    return {
      tier: 'GROWTH',
      priority: 'MEDIUM PRIORITY',
    };
  } else {
    return {
      tier: 'STARTER',
      priority: 'EARLY STAGE',
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, any> = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const {
      name,
      phone,
      production_quantity,
      product_category,
      other_product_category = '',
      business_stage = '',
      production_timeline = '',
      utm_source = '',
      utm_medium = '',
      utm_campaign = '',
      utm_content = '',
      utm_term = '',
      fbclid = '',
    } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nama lengkap wajib diisi' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Nomor WhatsApp wajib diisi' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const normalizedPhone = normalizeIndonesianPhone(phone);
    // Basic Indonesian phone check: length 10-15 digits, starts with 628
    if (!/^628\d{8,12}$/.test(normalizedPhone)) {
      return NextResponse.json(
        { success: false, error: 'Nomor WhatsApp Indonesia tidak valid (contoh: 081234567890)' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (!production_quantity) {
      return NextResponse.json(
        { success: false, error: 'Target produksi wajib dipilih' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (!product_category) {
      return NextResponse.json(
        { success: false, error: 'Kategori produk wajib dipilih' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const { tier, priority } = getQualification(production_quantity);

    const leadPayload = {
      name: name.trim(),
      phone: normalizedPhone,
      production_quantity: String(production_quantity),
      production_tier: tier,
      lead_priority: priority,
      product_category: product_category === 'Lainnya' && other_product_category ? `Lainnya: ${other_product_category.trim()}` : product_category,
      business_stage: business_stage || 'Belum ditentukan',
      production_timeline: production_timeline || 'Belum ditentukan',
      utm_source: utm_source || 'meta',
      utm_medium: utm_medium || 'cpc',
      utm_campaign: utm_campaign || '',
      utm_content: utm_content || '',
      utm_term: utm_term || '',
      fbclid: fbclid || '',
      created_at: new Date().toISOString(),
      source: 'meta-ads-maklon-kosmetik',
    };

    // 1. Send to CRM Webhook if configured
    const crmWebhookUrl = process.env.CRM_WEBHOOK_URL;
    let crmSynced = false;

    if (crmWebhookUrl) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const webhookRes = await fetch(crmWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        crmSynced = webhookRes.ok;
      } catch (webhookErr) {
        console.error('[CRM_WEBHOOK_ERROR]', webhookErr);
      }
    } else {
      console.log('[DEMO_MODE] CRM_WEBHOOK_URL not configured. Lead payload recorded:', leadPayload);
    }

    // 2. Persist to Postgres database if available
    let dbSaved = false;
    let leadId: string | null = null;
    try {
      if (pool) {
        const insertQuery = `
          INSERT INTO lead_inquiries (
            inquiry_reference, full_name, whatsapp_phone, category,
            production_tier_name, requested_quantity_pcs, business_status,
            production_timeline, utm_source, utm_medium, utm_campaign,
            utm_content, utm_term, fbclid, status, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW()
          ) RETURNING id, inquiry_reference;
        `;
        const randRef = `DL-META-${Date.now().toString(36).toUpperCase()}`;
        const qtyNum = parseInt(production_quantity.replace(/[^\d]/g, ''), 10) || 1000;
        const dbRes = await queryWithRetry(insertQuery, [
          randRef,
          leadPayload.name,
          leadPayload.phone,
          leadPayload.product_category,
          tier,
          qtyNum,
          leadPayload.business_stage,
          leadPayload.production_timeline,
          leadPayload.utm_source,
          leadPayload.utm_medium,
          leadPayload.utm_campaign,
          leadPayload.utm_content,
          leadPayload.utm_term,
          leadPayload.fbclid,
          'NEW',
        ]);
        if (dbRes?.rows?.length > 0) {
          dbSaved = true;
          leadId = dbRes.rows[0].inquiry_reference || dbRes.rows[0].id;
        }
      }
    } catch (dbErr) {
      // Don't fail customer submission if DB error occurs
      console.warn('[DB_INSERT_OPTIONAL_NOTICE]', dbErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Lead berhasil dicatat',
        lead_id: leadId || `DL-${Date.now()}`,
        crm_synced: crmSynced,
        db_saved: dbSaved,
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (err: any) {
    console.error('[META_ADS_LEAD_ERROR]', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat memproses formulir' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
