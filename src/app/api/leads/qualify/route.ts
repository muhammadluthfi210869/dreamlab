import { NextRequest, NextResponse } from 'next/server';
import pool, { queryWithRetry } from '@/lib/db';
import { convertLead } from '@/lib/round-robin-db';
import { syncLeadToKommo } from '@/lib/kommo-adapter';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

function normalizePhone(phone: string): string {
  let cleaned = (phone || '').replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

function computeLeadSegment(quantityRange: string): string {
  if (quantityRange.includes('100–499') || quantityRange.includes('100-499')) {
    return 'Micro Prospect';
  }
  if (quantityRange.includes('500–999') || quantityRange.includes('500-999')) {
    return 'MOQ Fit';
  }
  if (
    quantityRange.includes('1.000–4.999') ||
    quantityRange.includes('1000-4999') ||
    quantityRange.includes('1.000-4.999')
  ) {
    return 'Growth Prospect';
  }
  if (quantityRange.includes('5.000+') || quantityRange.includes('5000+')) {
    return 'Strategic Prospect';
  }
  return 'Unclassified';
}

function generateInquiryReference(): string {
  const d = new Date();
  const ym = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `DL-${ym}-${rand}`;
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
      category,
      quantityRange,
      budgetRange,
      productionTimeline,
      businessStatus,
      fullName,
      whatsappPhone,
      brandOrCompany,
      source,
      channel,
      landingPage,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      gclid,
      fbclid,
      visitorId,
      eventId,
    } = body;

    // 1. Server-side validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nama lengkap wajib diisi (minimal 2 karakter)' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const cleanPhone = normalizePhone(whatsappPhone);
    if (!cleanPhone || cleanPhone.length < 9 || cleanPhone.length > 16) {
      return NextResponse.json(
        { success: false, error: 'Nomor WhatsApp tidak valid (contoh: 081234567890)' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Kategori produk wajib dipilih' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (!quantityRange) {
      return NextResponse.json(
        { success: false, error: 'Rencana kuantitas produksi wajib dipilih' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (!budgetRange) {
      return NextResponse.json(
        { success: false, error: 'Estimasi budget produksi wajib dipilih' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (!productionTimeline) {
      return NextResponse.json(
        { success: false, error: 'Timeline produksi wajib dipilih' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (!businessStatus) {
      return NextResponse.json(
        { success: false, error: 'Status bisnis wajib dipilih' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // 2. Segment and references
    const leadSegment = computeLeadSegment(quantityRange);
    const inquiryRef = generateInquiryReference();
    const effectiveSource = source || channel || 'paid-ads';
    const effectiveLandingPage = landingPage || '/';

    // 3. Atomically assign BusDev & insert initial record via existing DB engine
    let assignedSalesName = 'Annisa';
    let assignedSalesPhone = '6281952417051';
    let trackingCode = inquiryRef;

    try {
      const conv = await convertLead({
        visitorId: visitorId || inquiryRef,
        hp: cleanPhone,
        intent: `[QUALIFIED] ${category} - ${quantityRange}`,
        source: effectiveSource,
        pageUrl: effectiveLandingPage,
        referrer: referrer || undefined,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        sessionId: eventId || inquiryRef,
        nama: fullName.trim(),
        perusahaan: brandOrCompany ? brandOrCompany.trim() : undefined,
        produk: category,
        trackingCode: inquiryRef,
      });

      assignedSalesName = conv.name || assignedSalesName;
      assignedSalesPhone = conv.phoneNumber ? normalizePhone(conv.phoneNumber) : assignedSalesPhone;
      trackingCode = conv.trackingCode || inquiryRef;
    } catch (dbErr) {
      console.error('[Qualify Route] convertLead warning, falling back to direct query:', dbErr);
    }

    // 4. Update the lead record with complete qualification attributes
    try {
      await pool.query(
        `UPDATE leads
         SET 
           quantity_range = $1,
           budget_range = $2,
           production_timeline = $3,
           business_status = $4,
           lead_segment = $5,
           qualification_status = $6,
           inquiry_reference = $7,
           utm_content = $8,
           utm_term = $9,
           gclid = $10,
           fbclid = $11,
           nama = COALESCE(nama, $12),
           perusahaan = COALESCE(perusahaan, $13),
           hp = COALESCE(hp, $14),
           produk = COALESCE(produk, $15)
         WHERE tracking_code = $16 OR tracking_code = $7`,
        [
          quantityRange,
          budgetRange,
          productionTimeline,
          businessStatus,
          leadSegment,
          'Marketing Qualified',
          inquiryRef,
          utmContent || null,
          utmTerm || null,
          gclid || null,
          fbclid || null,
          fullName.trim(),
          brandOrCompany ? brandOrCompany.trim() : null,
          cleanPhone,
          category,
          trackingCode,
        ]
      );
    } catch (updateErr) {
      console.error('[Qualify Route] Failed to update qualification columns on leads table:', updateErr);
    }

    // 5. Trigger Kommo CRM synchronization adapter
    let crmSyncStatus: 'synced' | 'pending_configuration' | 'failed' = 'pending_configuration';
    let crmContactId: string | number | undefined;
    let crmLeadId: string | number | undefined;

    try {
      const syncResult = await syncLeadToKommo({
        inquiryReference: inquiryRef,
        category,
        quantityRange,
        budgetRange,
        productionTimeline,
        businessStatus,
        leadSegment,
        fullName: fullName.trim(),
        whatsappPhone: cleanPhone,
        brandOrCompany: brandOrCompany ? brandOrCompany.trim() : undefined,
        sourceChannel: channel || 'paid-ads',
        campaign: utmCampaign,
        landingPage: effectiveLandingPage,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        gclid,
        fbclid,
        assignedSalesName,
      });

      crmSyncStatus = syncResult.status;
      crmContactId = syncResult.contactId;
      crmLeadId = syncResult.leadId;

      // Persist CRM synchronization status into DB
      await pool.query(
        `UPDATE leads
         SET crm_sync_status = $1,
             crm_synced_at = NOW(),
             crm_contact_id = $2,
             crm_lead_id = $3
         WHERE inquiry_reference = $4 OR tracking_code = $5`,
        [
          crmSyncStatus,
          crmContactId ? String(crmContactId) : null,
          crmLeadId ? String(crmLeadId) : null,
          inquiryRef,
          trackingCode,
        ]
      );
    } catch (crmErr) {
      console.error('[Qualify Route] Kommo sync adapter error:', crmErr);
      crmSyncStatus = 'failed';
    }

    // 6. Generate formatted WhatsApp message per Section 9 specs
    // Note: No financial info is exposed in the prefilled message!
    const waMessageText = [
      'Halo Dreamlab, saya sudah mengisi formulir konsultasi produksi.',
      '',
      `Kode konsultasi: ${inquiryRef}`,
      `Kategori produk: ${category}`,
      `Estimasi produksi: ${quantityRange}`,
      '',
      'Saya ingin melanjutkan konsultasi dengan tim Dreamlab. Terima kasih.',
    ].join('\n');

    const whatsappUrl = `https://wa.me/${assignedSalesPhone}?text=${encodeURIComponent(waMessageText)}`;

    return NextResponse.json(
      {
        success: true,
        inquiryReference: inquiryRef,
        leadSegment,
        assignedSales: {
          name: assignedSalesName,
          phone: assignedSalesPhone,
        },
        whatsappUrl,
        crmSyncStatus,
      },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (err: any) {
    console.error('[Qualify Route] Critical error processing lead qualification:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Terjadi kesalahan sistem saat memproses kualifikasi.',
      },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
