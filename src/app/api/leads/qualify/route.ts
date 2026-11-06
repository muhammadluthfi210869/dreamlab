import crypto from 'node:crypto';
import { NextRequest, NextResponse, after } from 'next/server';
import pool from '@/lib/db';
import { convertLead, normalizePhone } from '@/lib/round-robin-db';
import { pickEmergencyFallbackAgent } from '@/lib/round-robin-config';
import { syncLeadToKommo } from '@/lib/kommo-adapter';
import { validateAndNormalizePhone } from '@/lib/country-phone-data';
import { CountryCode } from 'libphonenumber-js';
import { evaluateLeadQualification } from '@/lib/lead-qualification';
import {
  sendMetaEvents,
  type MetaCapiEventInput,
  type MetaUserDataInput,
} from '@/lib/meta-capi';

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
  { name: 'STARTER', quantityPcs: 500, segment: 'Starter Prospect' },
  { name: 'GROWTH', quantityPcs: 1000, segment: 'Growth Prospect' },
  { name: 'SCALE', quantityPcs: 5000, segment: 'Enterprise Prospect' },
  { name: 'ENTERPRISE', quantityPcs: 10000, segment: 'Strategic Prospect' },
  // Backward compatibility legacy names
  { name: 'Paket Bisnis', quantityPcs: 300, segment: 'Micro Prospect' },
  { name: 'Starter Brand', quantityPcs: 500, segment: 'Starter Prospect' },
  { name: 'Growth Brand', quantityPcs: 1000, segment: 'Growth Prospect' },
  { name: 'Enterprise', quantityPcs: 5000, segment: 'Enterprise Prospect' },
  { name: 'Strategic Partner', quantityPcs: 10000, segment: 'Strategic Prospect' },
];

function generateInquiryReference(): string {
  const d = new Date();
  const ym = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `DL-${ym}-${rand}`;
}

export async function POST(req: NextRequest) {
  const submitMs = Date.now();
  const submitUnixSec = Math.floor(submitMs / 1000);

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
      landingUrl: rawLandingUrl,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      gclid,
      fbclid,
      eventId,
      simulationNote,
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

    // 3. Validate & Normalize International Phone Number (E.164)
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
    const localHp = cleanPhoneE164.replace(/^\+/, ''); // e.g. 6281234567890
    const countryIso = phoneValidation.countryIso2;
    const countryDial = phoneValidation.dialCode;

    // 4. Server-side qualification & tier computation (strictly from budgetRange on server)
    const qualEval = await evaluateLeadQualification({
      fullName: fullName.trim(),
      phoneE164: cleanPhoneE164,
      localHp,
      budgetRange,
    });

    // Map server-resolved tier to internal production tier metadata (do not trust browser tier fields)
    const tierToProductionTier: Record<string, ProductionTierConfig> = {
      D: PRODUCTION_TIERS[0], // STARTER (500)
      C: PRODUCTION_TIERS[1], // GROWTH (1000)
      B: PRODUCTION_TIERS[2], // SCALE (5000)
      A: PRODUCTION_TIERS[3], // ENTERPRISE (10000)
    };
    const matchedTier = tierToProductionTier[qualEval.tier] || PRODUCTION_TIERS[0];
    const resolvedTierName = matchedTier.name;
    const resolvedQtyPcs = Number(rawQty) > 0 ? Number(rawQty) : matchedTier.quantityPcs;
    const resolvedSegment = qualEval.leadSegment;
    const isPaketBisnis = (productionTierName || '').toLowerCase().includes('paket bisnis');
    const resolvedQuantityRange =
      quantityRange || (isPaketBisnis ? 'Paket Bisnis' : `${resolvedQtyPcs.toLocaleString('id-ID')} pcs`);

    // 5. Generate inquiry reference, resolve eventId & extract click identifiers
    const inquiryRef = generateInquiryReference();
    const resolvedEventId =
      typeof eventId === 'string' && eventId.trim()
        ? eventId.trim()
        : crypto.randomUUID();
    const effectiveSource = source || channel || 'paid-ads';
    const effectiveChannel = channel || source || 'metaads';
    const effectiveLandingPage = landingPage || '/';

    const cookieHeader = req.headers.get('cookie') || '';
    const cookiesMap = new Map<string, string>();
    cookieHeader.split(';').forEach((c) => {
      const parts = c.split('=');
      const k = parts[0]?.trim();
      const v = parts.slice(1).join('=').trim();
      if (k && v) {
        try {
          cookiesMap.set(k, decodeURIComponent(v));
        } catch {
          cookiesMap.set(k, v);
        }
      }
    });

    let fbc = cookiesMap.get('_fbc') || null;
    const fbp = cookiesMap.get('_fbp') || null;
    if (!fbc && fbclid) {
      fbc = `fb.1.${submitMs}.${fbclid}`;
    }

    const xForwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = xForwardedFor
      ? xForwardedFor.split(',')[0].trim()
      : req.headers.get('x-real-ip')?.trim() || null;
    const userAgent = req.headers.get('user-agent') || null;
    const refererHeader = req.headers.get('referer');

    let fullLandingUrl = 'https://dreamlab.id/';
    if (typeof rawLandingUrl === 'string' && rawLandingUrl.startsWith('http')) {
      fullLandingUrl = rawLandingUrl;
    } else if (typeof landingPage === 'string' && landingPage.startsWith('http')) {
      fullLandingUrl = landingPage;
    } else if (refererHeader && refererHeader.startsWith('http')) {
      fullLandingUrl = refererHeader;
    } else if (typeof landingPage === 'string' && landingPage.trim()) {
      const path = landingPage.startsWith('/') ? landingPage : `/${landingPage}`;
      fullLandingUrl = `https://dreamlab.id${path}`;
    }

    const adId = (body.adId || body.ad_id || null) as string | null;
    const isTestLead = qualEval.disqualifyReason === 'test_or_internal';

    const leadIntent = budgetRange
      ? `[QUALIFIED] ${category} - Budget: ${budgetRange}`
      : isPaketBisnis
      ? `[QUALIFIED] ${category} - Paket Bisnis`
      : `[QUALIFIED] ${category} - ${resolvedTierName} (${resolvedQtyPcs} pcs)`;

    // 6. Assign BusDev & insert initial record via existing DB engine
    const fallbackAgent = pickEmergencyFallbackAgent(inquiryRef);
    let assignedSalesName = fallbackAgent.name || 'Annisa';
    let assignedSalesPhone = normalizePhone(fallbackAgent.phone) || '6281952417051';
    let trackingCode = inquiryRef;
    let leadDbId: number | null = null;

    try {
      const conv = await convertLead({
        visitorId: inquiryRef,
        hp: localHp,
        intent: leadIntent,
        source: effectiveSource,
        pageUrl: effectiveLandingPage,
        referrer: referrer || undefined,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        sessionId: resolvedEventId,
        nama: fullName.trim(),
        perusahaan: brandOrCompany ? brandOrCompany.trim() : undefined,
        produk: category,
        trackingCode: inquiryRef,
        isTest: isTestLead,
      });

      assignedSalesName = conv.name || assignedSalesName;
      assignedSalesPhone = conv.phoneNumber
        ? conv.phoneNumber.replace(/[^0-9]/g, '')
        : assignedSalesPhone;
      trackingCode = conv.trackingCode || inquiryRef;
    } catch (dbErr) {
      console.error('[Qualify Route] convertLead failed, will insert lead directly:', dbErr);
    }

    // 7. Update newly inserted lead row (or insert a dedicated row if convertLead hit 24h dedup / failed)
    try {
      const updateRes = await pool.query(
        `UPDATE leads
         SET 
           tier = $1,
           lead_segment = $2,
           qualified = $3,
           disqualify_reason = $4,
           inquiry_code = $5,
           qualified_at = $6,
           duplicate_of_id = $7,
           fbc = $8,
           fbp = $9,
           client_ip = $10,
           user_agent = $11,
           landing_url = $12,
           ad_id = $13,
           production_tier_name = $14,
           requested_quantity_pcs = $15,
           lead_quantity_segment = $16,
           whatsapp_phone_e164 = $17,
           phone_country_iso2 = $18,
           phone_country_dial_code = $19,
           quantity_range = $20,
           qualification_status = $21,
           inquiry_reference = $22,
           budget_range = $23,
           production_timeline = $24,
           business_status = $25,
           utm_source = COALESCE(utm_source, $26),
           utm_medium = COALESCE(utm_medium, $27),
           utm_campaign = COALESCE(utm_campaign, $28),
           utm_content = $29,
           utm_term = $30,
           gclid = $31,
           fbclid = $32,
           nama = COALESCE(nama, $33),
           perusahaan = COALESCE(perusahaan, $34),
           hp = COALESCE(hp, $35),
           produk = COALESCE(produk, $36),
           is_test = COALESCE(is_test, $37)
         WHERE (tracking_code = $38 OR tracking_code = $5)
           AND ($7::bigint IS NULL OR id <> $7::bigint)
           AND (inquiry_code IS NULL OR inquiry_code = $5)
         RETURNING id`,
        [
          qualEval.tier,
          qualEval.leadSegment,
          qualEval.qualified,
          qualEval.disqualifyReason,
          inquiryRef,
          qualEval.qualified ? new Date(submitMs) : null,
          qualEval.duplicateOfId,
          fbc,
          fbp,
          clientIp,
          userAgent,
          fullLandingUrl,
          adId,
          resolvedTierName,
          resolvedQtyPcs,
          resolvedSegment,
          cleanPhoneE164,
          countryIso,
          countryDial,
          resolvedQuantityRange,
          qualEval.qualified ? 'Sales Qualified' : 'Marketing Qualified',
          inquiryRef,
          budgetRange || '-',
          productionTimeline || '-',
          businessStatus || '-',
          utmSource || null,
          utmMedium || null,
          utmCampaign || null,
          utmContent || null,
          utmTerm || null,
          gclid || null,
          fbclid || null,
          fullName.trim(),
          brandOrCompany ? brandOrCompany.trim() : null,
          localHp,
          category,
          isTestLead,
          trackingCode,
        ]
      );

      if (updateRes.rows[0]?.id) {
        leadDbId = Number(updateRes.rows[0].id);
      } else {
        // When convertLead hit 24-hour dedup on a duplicate submission (or failed),
        // insert a distinct row for this submission so duplicates are saved without overwriting the original lead.
        const insertRes = await pool.query(
          `INSERT INTO leads
             (tracking_code, assigned_to, assigned_phone, source, page_url, referrer,
              utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid,
              session_id, intent, visitor_id, visit_count, nama, perusahaan, hp, produk, is_test,
              tier, lead_segment, qualified, disqualify_reason, inquiry_code, qualified_at,
              duplicate_of_id, fbc, fbp, client_ip, user_agent, landing_url, ad_id,
              production_tier_name, requested_quantity_pcs, lead_quantity_segment,
              whatsapp_phone_e164, phone_country_iso2, phone_country_dial_code,
              quantity_range, qualification_status, inquiry_reference,
              budget_range, production_timeline, business_status)
           VALUES (
             $1,$2,$3,$4,$5,$6,
             $7,$8,$9,$10,$11,$12,$13,
             $14,$15,$1,$16,$17,$18,$19,$20,$21,
             $22,$23,$24,$25,$1,$26,
             $27,$28,$29,$30,$31,$32,$33,
             $34,$35,$36,
             $37,$38,$39,
             $40,$41,$1,
             $42,$43,$44
           )
           ON CONFLICT (tracking_code) DO NOTHING
           RETURNING id`,
          [
            inquiryRef,
            assignedSalesName,
            assignedSalesPhone,
            effectiveSource,
            effectiveLandingPage,
            referrer || null,
            utmSource || null,
            utmMedium || null,
            utmCampaign || null,
            utmContent || null,
            utmTerm || null,
            gclid || null,
            fbclid || null,
            resolvedEventId,
            leadIntent,
            1,
            fullName.trim(),
            brandOrCompany ? brandOrCompany.trim() : null,
            localHp,
            category,
            isTestLead,
            qualEval.tier,
            qualEval.leadSegment,
            qualEval.qualified,
            qualEval.disqualifyReason,
            qualEval.qualified ? new Date(submitMs) : null,
            qualEval.duplicateOfId,
            fbc,
            fbp,
            clientIp,
            userAgent,
            fullLandingUrl,
            adId,
            resolvedTierName,
            resolvedQtyPcs,
            resolvedSegment,
            cleanPhoneE164,
            countryIso,
            countryDial,
            resolvedQuantityRange,
            qualEval.qualified ? 'Sales Qualified' : 'Marketing Qualified',
            budgetRange || '-',
            productionTimeline || '-',
            businessStatus || '-',
          ]
        );
        if (insertRes.rows[0]?.id) {
          leadDbId = Number(insertRes.rows[0].id);
        }
      }
    } catch (saveErr) {
      console.error('[Qualify Route] Failed to save qualification columns on leads table:', saveErr);
    }

    // 8. Build server-side Meta CAPI events per spec:
    // - qualification_completed: every successful submit (eventId = resolvedEventId)
    // - Lead: every successful submit EXCEPT duplicates within 30 days (eventId = inquiryRef)
    // - QualifiedLeadForm: only if qualified (eventId = <inquiryRef>-qf)
    const metaUserData: MetaUserDataInput = {
      inquiryReference: inquiryRef,
      fullName: fullName.trim(),
      phoneE164: cleanPhoneE164,
      fbc,
      fbp,
      clientIp,
      userAgent,
    };

    const metaEvents: MetaCapiEventInput[] = [
      {
        leadId: leadDbId,
        eventName: 'qualification_completed',
        eventId: resolvedEventId,
        eventTime: submitUnixSec,
        eventSourceUrl: fullLandingUrl,
        actionSource: 'website',
        userData: metaUserData,
        customData: {
          lead_segment: qualEval.leadSegment,
          category,
          channel: effectiveChannel,
        },
      },
    ];

    if (!qualEval.isDuplicate) {
      metaEvents.push({
        leadId: leadDbId,
        eventName: 'Lead',
        eventId: inquiryRef,
        eventTime: submitUnixSec,
        eventSourceUrl: fullLandingUrl,
        actionSource: 'website',
        userData: metaUserData,
        customData: {
          category,
        },
      });
    }

    if (qualEval.qualified) {
      metaEvents.push({
        leadId: leadDbId,
        eventName: 'QualifiedLeadForm',
        eventId: `${inquiryRef}-qf`,
        eventTime: submitUnixSec,
        eventSourceUrl: fullLandingUrl,
        actionSource: 'website',
        userData: metaUserData,
        customData: {
          lead_segment: qualEval.leadSegment,
          tier: qualEval.tier,
          category,
          value: qualEval.value,
          currency: 'IDR',
        },
      });
    }

    // 9. Dispatch Meta CAPI & Kommo CRM sync asynchronously via after() so response is never slowed down.
    //    If syncLeadToKommo() fails, Meta events still send, and vice versa.
    const runBackgroundTasks = async () => {
      const capiPromise = sendMetaEvents(metaEvents).catch((capiErr) => {
        console.error('[Qualify Route] Meta CAPI dispatch error:', capiErr?.message || capiErr);
      });

      const kommoPromise = (async () => {
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
            sourceChannel: effectiveChannel,
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

          await pool.query(
            `UPDATE leads
             SET crm_sync_status = $1,
                 crm_synced_at = NOW(),
                 crm_contact_id = $2,
                 crm_lead_id = $3
             WHERE id = $4 OR inquiry_reference = $5`,
            [
              syncResult.status,
              syncResult.contactId ? String(syncResult.contactId) : null,
              syncResult.leadId ? String(syncResult.leadId) : null,
              leadDbId,
              inquiryRef,
            ]
          );
        } catch (crmErr: any) {
          console.error('[Qualify Route] Kommo sync adapter error:', crmErr?.message || crmErr);
          try {
            await pool.query(
              `UPDATE leads SET crm_sync_status = 'failed' WHERE id = $1 OR inquiry_reference = $2`,
              [leadDbId, inquiryRef]
            );
          } catch {
            /* ignore */
          }
        }
      })();

      await Promise.allSettled([capiPromise, kommoPromise]);
    };

    try {
      after(runBackgroundTasks);
    } catch {
      void runBackgroundTasks();
    }

    // 10. Generate formatted WhatsApp message delivering lead details and budget to BD
    const cleanSimNote =
      typeof simulationNote === 'string' && simulationNote.trim()
        ? simulationNote.trim()
        : null;
    const waMessageText = [
      'Halo Dreamlab, saya ingin konsultasi produksi maklon.',
      '',
      `Nama: ${fullName.trim()}`,
      `No. WhatsApp: ${cleanPhoneE164}`,
      `Kategori Produk: ${category}`,
      `Rencana Budget: ${budgetRange || '-'}`,
      ...(cleanSimNote ? [cleanSimNote] : []),
      `Kode Konsultasi: [Kode: ${inquiryRef}]`,
      '',
      'Saya ingin diskusi lebih lanjut dengan tim Business Consultant Dreamlab. Terima kasih!',
    ].join('\n');

    const whatsappUrl = `https://wa.me/${assignedSalesPhone}?text=${encodeURIComponent(waMessageText)}`;

    return NextResponse.json(
      {
        success: true,
        eventId: resolvedEventId,
        inquiryReference: inquiryRef,
        productionTierName: resolvedTierName,
        requestedQuantityPcs: resolvedQtyPcs,
        leadSegment: qualEval.leadSegment,
        tier: qualEval.tier,
        qualified: qualEval.qualified,
        disqualifyReason: qualEval.disqualifyReason,
        isDuplicate: qualEval.isDuplicate,
        assignedSales: {
          name: assignedSalesName,
          phone: assignedSalesPhone,
        },
        whatsappUrl,
        redirectUrl: whatsappUrl,
      },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (err: any) {
    console.error('[Qualify Route] Fatal submission handler error:', err?.message || err);
    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kesalahan sistem saat memproses kualifikasi. Silakan coba kembali.',
      },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
