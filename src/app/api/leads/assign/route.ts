import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getActiveBusdev, BUSDEV_LIST } from '@/lib/busdev';
import {
  incrementGlobalCounter,
  getCachedLeadEvent,
  cacheLeadEvent,
  CachedLeadAssignment,
} from '@/lib/redis';
import {
  recordLeadAssignment,
  findAssignmentByEventId,
  assignLeadViaNeonAtomic,
  hashIp,
} from '@/lib/neon';
import {
  identifyLeadSource,
  normalizeSourceToLeadSource,
  LeadSource,
} from '@/lib/lead-source';
import { getWhatsAppMessage, buildWhatsAppLeadUrl } from '@/lib/whatsapp-messages';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

function sanitizeString(val: unknown, maxLength: number): string | null {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  if (trimmed === '') return null;
  return trimmed.slice(0, maxLength);
}

function isValidUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str
  );
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request body' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // 1. Validasi eventId
    const rawEventId = sanitizeString(body.eventId, 100);
    if (!rawEventId) {
      return NextResponse.json(
        { success: false, error: 'eventId is required' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // Gunakan eventId jika valid UUID, atau generate UUID fallback deterministik jika format tidak sesuai UUID
    const eventId = isValidUuid(rawEventId)
      ? rawEventId
      : crypto.createHash('sha256').update(rawEventId).digest('hex').slice(0, 36);

    // 2. Validasi & Sanitasi parameter input
    const landingPage = sanitizeString(body.landingPage, 1000);
    const referrer = sanitizeString(body.referrer, 1000) || req.headers.get('referer');
    const utmSource = sanitizeString(body.utmSource, 255);
    const utmMedium = sanitizeString(body.utmMedium, 255);
    const utmCampaign = sanitizeString(body.utmCampaign, 255);
    const rawMessageKey = sanitizeString(body.messageKey, 100);
    const rawSource = sanitizeString(body.source, 50);

    // 3. Normalisasi Source
    let resolvedSource: LeadSource;
    if (rawSource) {
      resolvedSource = normalizeSourceToLeadSource(rawSource);
    } else {
      resolvedSource = identifyLeadSource({
        sourceParam: rawSource,
        utmSource,
        utmMedium,
        utmCampaign,
        referrer,
        pathname: landingPage,
      });
    }

    // Message key allowlist
    const validMessageKeys = [
      'meta-parfum',
      'meta-skincare',
      'meta-haircare',
      'google-ads',
      'social-media',
      'google-organic',
      'default',
    ];
    const messageKey =
      rawMessageKey && validMessageKeys.includes(rawMessageKey)
        ? rawMessageKey
        : resolvedSource;

    // 4. CEK IDEMPOTENSI (REDIS DULU, LALU NEON)
    // Cegah double assignment akibat double click, StrictMode, atau retry
    const cachedEvent = await getCachedLeadEvent(eventId);
    if (cachedEvent) {
      return NextResponse.json(
        {
          success: true,
          assignmentId: cachedEvent.assignmentId,
          source: cachedEvent.source,
          sales: cachedEvent.sales,
          whatsappUrl: cachedEvent.whatsappUrl,
        },
        { status: 200, headers: NO_STORE_HEADERS }
      );
    }

    const existingDbRecord = await findAssignmentByEventId(eventId);
    if (existingDbRecord) {
      const messageText = getWhatsAppMessage(existingDbRecord.messageKey || messageKey);
      const whatsappUrl = buildWhatsAppLeadUrl(existingDbRecord.salesPhone, messageText);
      const assignmentPayload: CachedLeadAssignment = {
        assignmentId: existingDbRecord.id,
        source: existingDbRecord.source,
        sales: {
          id: existingDbRecord.salesId,
          name: existingDbRecord.salesName,
        },
        whatsappUrl,
      };
      // Isi kembali cache Redis jika sempat hilang
      await cacheLeadEvent(eventId, assignmentPayload).catch(() => {});

      return NextResponse.json(
        {
          success: true,
          ...assignmentPayload,
        },
        { status: 200, headers: NO_STORE_HEADERS }
      );
    }

    // 5. ROUND ROBIN ASSIGNMENT (UPSTASH REDIS ATOMIK)
    const activeBusdev = getActiveBusdev();
    let selectedSales = activeBusdev[0];
    let assignmentStatus: 'assigned' | 'fallback' = 'assigned';

    const sequence = await incrementGlobalCounter();

    if (typeof sequence === 'number' && sequence > 0) {
      // Redis INCR atomik berhasil
      const index = (sequence - 1) % activeBusdev.length;
      selectedSales = activeBusdev[index];
    } else {
      // Redis tidak merespons -> gunakan fallback atomik Neon PostgreSQL
      assignmentStatus = 'fallback';
      try {
        selectedSales = await assignLeadViaNeonAtomic();
      } catch {
        // Fallback darurat jika Neon juga bermasalah: nomor server-side tunggal (Irma)
        selectedSales = activeBusdev[0] || BUSDEV_LIST[0];
      }
    }

    const messageText = getWhatsAppMessage(messageKey);
    const whatsappUrl = buildWhatsAppLeadUrl(selectedSales.phone, messageText);
    const assignmentId = crypto.randomUUID();

    const resultPayload: CachedLeadAssignment = {
      assignmentId,
      source: resolvedSource,
      sales: {
        id: selectedSales.id,
        name: selectedSales.name,
      },
      whatsappUrl,
    };

    // 6. SIMPAN IDEMPOTENCY KE REDIS (TTL 7 hari)
    await cacheLeadEvent(eventId, resultPayload).catch(() => {});

    // 7. AUDIT LOGGING KE NEON POSTGRESQL (NON-BLOCKING KE CLIENT)
    const userAgent = req.headers.get('user-agent');
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      null;
    const ipHashed = hashIp(clientIp);

    recordLeadAssignment({
      id: assignmentId,
      eventId,
      source: resolvedSource,
      landingPage,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      messageKey,
      salesId: selectedSales.id,
      salesName: selectedSales.name,
      salesPhone: selectedSales.phone,
      status: assignmentStatus,
      userAgent,
      ipHash: ipHashed,
    }).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        assignmentId: resultPayload.assignmentId,
        source: resultPayload.source,
        sales: resultPayload.sales,
        whatsappUrl: resultPayload.whatsappUrl,
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch {
    // Fail-safe: jika terjadi error tidak terduga, jangan kembalikan 500 error kepada user
    const fallbackBusdev = BUSDEV_LIST[0];
    const defaultUrl = buildWhatsAppLeadUrl(
      fallbackBusdev.phone,
      getWhatsAppMessage('default')
    );

    return NextResponse.json(
      {
        success: true,
        assignmentId: crypto.randomUUID(),
        source: 'unknown',
        sales: {
          id: fallbackBusdev.id,
          name: fallbackBusdev.name,
        },
        whatsappUrl: defaultUrl,
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405, headers: NO_STORE_HEADERS }
  );
}
