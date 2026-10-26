import { NextRequest, NextResponse } from 'next/server';
import pool, { queryWithRetry } from '@/lib/db';
import { convertLead } from '@/lib/round-robin-db';
import { syncLeadToKommo } from '@/lib/kommo-adapter';
import { validateAndNormalizePhone } from '@/lib/country-phone-data';
import { CountryCode } from 'libphonenumber-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export interface ProductionTierConfig {
  name: string;
  quantityPcs: number;
  segment: string;
}

export const PRODUCTION_TIERS: ProductionTierConfig[] = [
  { name: 'Brand Starter', quantityPcs: 300, segment: 'Micro Prospect' },
  { name: 'Brand Launch', quantityPcs: 500, segment: 'MOQ Fit' },
  { name: 'Brand Growth', quantityPcs: 1000, segment: 'Growth Prospect' },
  { name: 'Brand Partner', quantityPcs: 5000, segment: 'Strategic Prospect' },
];

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
      productionTierName,
      requestedQuantityPcs: rawQty,
      quantityRange,
      budgetRange,
      productionTimeline,
      businessStatus,
      fullName,
      whatsappPhone,
      phoneCountryIso2 = 'ID',
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

    // 1. Validate full name
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nama lengkap wajib diisi (minimal 2 karakter).' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // 2. Validate product category
    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json(
        { success: false, error: 'Kategori produk wajib dipilih.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // 3. Match Production Tier or fallback
    let matchedTier = PRODUCTION_TIERS.find(
      (t) =>
        t.name.toLowerCase() === (productionTierName || '').toLowerCase() ||
        t.quantityPcs === Number(rawQty)
    );

    if (!matchedTier && quantityRange) {
      if (quantityRange.includes('300')) {
        matchedTier = PRODUCTION_TIERS[0];
      } else if (quantityRange.includes('500')) {
        matchedTier = PRODUCTION_TIERS[1];
      } else if (quantityRange.includes('1.000') || quantityRange.includes('1000')) {
        matchedTier = PRODUCTION_TIERS[2];
      } else if (quantityRange.includes('5.000') || quantityRange.includes('5000')) {
        matchedTier = PRODUCTION_TIERS[3];
      }
    }

    if (!matchedTier) {
      return NextResponse.json(
        { success: false, error: 'Silakan pilih salah satu tier kuantitas produksi yang tersedia.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const resolvedTierName = matchedTier.name;
    const resolvedQtyPcs = matchedTier.quantityPcs;
    const resolvedSegment = matchedTier.segment;
    const resolvedQuantityRange = `${resolvedQtyPcs.toLocaleString('id-ID')} pcs`;

    // 4. Validate & Normalize International Phone Number (E.164)
    const phoneValidation = validateAndNormalizePhone(
      whatsappPhone,
      (phoneCountryIso2 || 'ID') as CountryCode
    );

    if (!phoneValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error:
            phoneValidation.error ||
            'Nomor WhatsApp tidak valid. Pastikan kode negara dan digit nomor sudah sesuai.',
        },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const cleanPhoneE164 = phoneValidation.e164; // e.g. +6281234567890
    const localHp = cleanPhoneE164.replace(/^\+/, ''); // e.g. 6281234567890 for backward compatibility
    const countryIso = phoneValidation.countryIso2;
    const countryDial = phoneValidation.dialCode;

    // 5. Generate references
    const inquiryRef = generateInquiryReference();
    const effectiveSource = source || channel || 'paid-ads';
    const effectiveLandingPage = landingPage || '/';

    // 6. Assign BusDev & insert initial record via existing DB engine
    let assignedSalesName = 'Annisa';
    let assignedSalesPhone = '6281952417051';
    let trackingCode = inquiryRef;

    try {
      const conv = await convertLead({
        visitorId: visitorId || inquiryRef,
        hp: localHp,
        intent: `[QUALIFIED] ${category} - ${resolvedTierName} (${resolvedQtyPcs} pcs)`,
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
      assignedSalesPhone = conv.phoneNumber
        ? conv.phoneNumber.replace(/[^0-9]/g, '')
        : assignedSalesPhone;
      trackingCode = conv.trackingCode || inquiryRef;
    } catch (dbErr) {
      console.error('[Qualify Route] convertLead warning, falling back to direct query:', dbErr);
    }

    // 7. Update lead record with complete tier & international phone attributes
    try {
      await pool.query(
        `UPDATE leads
         SET 
           production_tier_name = $1,
           requested_quantity_pcs = $2,
           lead_quantity_segment = $3,
           whatsapp_phone_e164 = $4,
           phone_country_iso2 = $5,
           phone_country_dial_code = $6,
           quantity_range = $7,
           lead_segment = $8,
           qualification_status = $9,
           inquiry_reference = $10,
           budget_range = $11,
           production_timeline = $12,
           business_status = $13,
           utm_content = $14,
           utm_term = $15,
           gclid = $16,
           fbclid = $17,
           nama = COALESCE(nama, $18),
           perusahaan = COALESCE(perusahaan, $19),
           hp = COALESCE(hp, $20),
           produk = COALESCE(produk, $21)
         WHERE tracking_code = $22 OR tracking_code = $10`,
        [
          resolvedTierName,
          resolvedQtyPcs,
          resolvedSegment,
          cleanPhoneE164,
          countryIso,
          countryDial,
          resolvedQuantityRange,
          resolvedSegment,
          'Marketing Qualified', // Quantity selection alone must never classify a prospect as Sales Qualified
          inquiryRef,
          budgetRange || '-',
          productionTimeline || '-',
          businessStatus || '-',
          utmContent || null,
          utmTerm || null,
          gclid || null,
          fbclid || null,
          fullName.trim(),
          brandOrCompany ? brandOrCompany.trim() : null,
          localHp,
          category,
          trackingCode,
        ]
      );
    } catch (updateErr) {
      console.error('[Qualify Route] Failed to update qualification columns on leads table:', updateErr);
    }

    // 8. Trigger Kommo CRM synchronization adapter
    let crmSyncStatus: 'synced' | 'pending_configuration' | 'failed' = 'pending_configuration';
    let crmContactId: string | number | undefined;
    let crmLeadId: string | number | undefined;

    try {
      const syncResult = await syncLeadToKommo({
        inquiryReference: inquiryRef,
        category,
        productionTierName: resolvedTierName,
        requestedQuantityPcs: resolvedQtyPcs,
        leadQuantitySegment: resolvedSegment,
        quantityRange: resolvedQuantityRange,
        budgetRange: budgetRange || '-',
        productionTimeline: productionTimeline || '-',
        businessStatus: businessStatus || '-',
        leadSegment: resolvedSegment,
        fullName: fullName.trim(),
        whatsappPhone: localHp,
        whatsappPhoneE164: cleanPhoneE164,
        phoneCountryIso2: countryIso,
        phoneCountryDialCode: countryDial,
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

    // 9. Generate formatted WhatsApp message delivering tier and E.164 phone to BD
    const waMessageText = [
      'Halo Dreamlab, saya ingin konsultasi produksi maklon.',
      '',
      `Nama: ${fullName.trim()}`,
      `Mau Buat Apa: ${category}`,
      `Tier Produksi: ${resolvedTierName} (${resolvedQtyPcs.toLocaleString('id-ID')} pcs)`,
      `Nomor WhatsApp: ${cleanPhoneE164}`,
      `Kode Konsultasi: ${inquiryRef}`,
      '',
      'Saya ingin melanjutkan diskusi dengan tim Business Consultant Dreamlab. Terima kasih!',
    ].join('\n');

    const whatsappUrl = `https://wa.me/${assignedSalesPhone}?text=${encodeURIComponent(waMessageText)}`;

    return NextResponse.json(
      {
        success: true,
        inquiryReference: inquiryRef,
        productionTierName: resolvedTierName,
        requestedQuantityPcs: resolvedQtyPcs,
        leadSegment: resolvedSegment,
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
    console.error('[Qualify Route] Fatal submission handler error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kesalahan sistem saat memproses kualifikasi. Silakan coba kembali.',
      },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
