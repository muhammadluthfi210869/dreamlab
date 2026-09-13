import { NextRequest, NextResponse, after } from 'next/server';
import crypto from 'crypto';
import { getActiveBusdev, BUSDEV_LIST } from '@/lib/busdev';
import {
  atomicReserveAndAssignLeadEvent,
  cacheLeadEvent,
  CachedLeadAssignment,
} from '@/lib/redis';
import {
  recordLeadAssignment,
  findAssignmentByEventId,
  assignAndRecordLeadViaNeonAtomic,
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

/**
 * Menjalankan background task yang didukung runtime Vercel (via Next.js after).
 * Jika dijalankan di luar request scope (misalnya di integration test scripts),
 * fallback mengeksekusi promise secara langsung.
 */
function safeBackground(task: () => Promise<void>) {
  try {
    after(task);
  } catch {
    task().catch((err) => {
      console.error('[Assign Route] Background task error:', err);
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request body' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // 1. Validasi ketat eventId: Wajib ada dan wajib berformat UUID v4
    let rawEventId = sanitizeString(body.eventId, 100);
    if (!rawEventId) {
      return NextResponse.json(
        { success: false, error: 'eventId is required' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (rawEventId.startsWith('meta_')) {
      rawEventId = rawEventId.slice(5);
    }

    if (!isValidUuid(rawEventId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid eventId: must be a valid UUID v4' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const eventId = rawEventId.toLowerCase();

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
      'meta-deodorant',
      'meta-babycare',
      'meta-bodycare',
      'google-ads',
      'google-parfum',
      'google-skincare',
      'google-haircare',
      'google-deodorant',
      'google-kosmetik',
      'google-bodycare',
      'social-media',
      'google-organic',
      'default',
    ];
    const messageKey =
      rawMessageKey && validMessageKeys.includes(rawMessageKey)
        ? rawMessageKey
        : resolvedSource;

    const userAgent = req.headers.get('user-agent');
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      null;
    const ipHashed = hashIp(clientIp);

    const activeBusdev = getActiveBusdev();
    const assignmentId = crypto.randomUUID();

    const tStart = performance.now();

    // 4. ATOMIC RESERVATION (UPSTASH REDIS LUA / SET NX)
    // Menjamin eventId yang sama tidak pernah menaikkan counter lebih dari sekali
    const tRedisStart = performance.now();
    const reserveRes = await atomicReserveAndAssignLeadEvent(eventId);
    const redisDurationMs = Math.round(performance.now() - tRedisStart);

    if (reserveRes.status === 'CACHED') {
      const totalDurationMs = Math.round(performance.now() - tStart);
      return NextResponse.json(
        {
          success: true,
          assignmentId: reserveRes.assignment.assignmentId,
          source: reserveRes.assignment.source,
          sales: reserveRes.assignment.sales,
          whatsappUrl: reserveRes.assignment.whatsappUrl,
          auditLogStatus: 'cached',
          timing: {
            redisMs: redisDurationMs,
            totalMs: totalDurationMs,
          },
        },
        {
          status: 200,
          headers: {
            ...NO_STORE_HEADERS,
            'X-Dreamlab-Assignment-Backend': 'redis-cache',
            'X-Dreamlab-Audit-Status': 'cached',
            'X-Dreamlab-Duration-Redis-Ms': String(redisDurationMs),
            'X-Dreamlab-Duration-Total-Ms': String(totalDurationMs),
            'Server-Timing': `redis;dur=${redisDurationMs}, total;dur=${totalDurationMs}`,
          },
        }
      );
    }

    if (
      reserveRes.status === 'ASSIGNED' ||
      reserveRes.status === 'RESERVED_SEQUENCE'
    ) {
      const sequence = reserveRes.sequence;
      const index = (sequence - 1) % activeBusdev.length;
      const selectedSales = activeBusdev[index];

      const messageText = getWhatsAppMessage(messageKey);
      const whatsappUrl = buildWhatsAppLeadUrl(selectedSales.phone, messageText);

      const resultPayload: CachedLeadAssignment = {
        assignmentId,
        source: resolvedSource,
        sales: {
          id: selectedSales.id,
          name: selectedSales.name,
          phone: selectedSales.phone,
        },
        whatsappUrl,
      };

      // Jalankan caching Redis dan pencatatan audit log Neon di background
      // menggunakan Next.js after() yang didukung Vercel tanpa menahan redirect user.
      safeBackground(async () => {
        try {
          await cacheLeadEvent(eventId, resultPayload).catch(() => {});
          const auditResult = await recordLeadAssignment({
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
            status: 'assigned',
            userAgent,
            ipHash: ipHashed,
          });

          if (!auditResult.success) {
            console.error('[Assign Route] Neon background audit log failed:', {
              eventId,
              error: auditResult.error,
            });
          }
        } catch (bgErr) {
          console.error('[Assign Route] Background execution error:', bgErr);
        }
      });

      const totalDurationMs = Math.round(performance.now() - tStart);

      return NextResponse.json(
        {
          success: true,
          assignmentId: resultPayload.assignmentId,
          source: resultPayload.source,
          sales: resultPayload.sales,
          whatsappUrl: resultPayload.whatsappUrl,
          auditLogStatus: 'recorded',
          timing: {
            redisMs: redisDurationMs,
            totalMs: totalDurationMs,
          },
        },
        {
          status: 200,
          headers: {
            ...NO_STORE_HEADERS,
            'X-Dreamlab-Assignment-Backend': 'redis-atomic',
            'X-Dreamlab-Audit-Status': 'recorded',
            'X-Dreamlab-Duration-Redis-Ms': String(redisDurationMs),
            'X-Dreamlab-Duration-Total-Ms': String(totalDurationMs),
            'Server-Timing': `redis;dur=${redisDurationMs}, total;dur=${totalDurationMs}`,
          },
        }
      );
    }

    // 5. FALLBACK ATOMIK NEON POSTGRESQL (Saat Upstash Redis tidak merespons)
    // Pemilihan BusDev DAN penyimpanan wajib terjadi dalam 1 transaksi & advisory lock sebelum COMMIT
    try {
      // Cek DB apakah sudah ada record eventId
      const existingDb = await findAssignmentByEventId(eventId);
      if (existingDb) {
        const messageText = getWhatsAppMessage(existingDb.messageKey || messageKey);
        const whatsappUrl = buildWhatsAppLeadUrl(existingDb.salesPhone, messageText);
        return NextResponse.json(
          {
            success: true,
            assignmentId: existingDb.id,
            source: existingDb.source,
            sales: {
              id: existingDb.salesId,
              name: existingDb.salesName,
            },
            whatsappUrl,
            auditLogStatus: 'recorded',
          },
          {
            status: 200,
            headers: {
              ...NO_STORE_HEADERS,
              'X-Dreamlab-Assignment-Backend': 'neon-transaction-lock',
              'X-Dreamlab-Audit-Status': 'recorded',
            },
          }
        );
      }

      const neonAssignment = await assignAndRecordLeadViaNeonAtomic({
        id: assignmentId,
        eventId,
        source: resolvedSource,
        landingPage,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        messageKey,
        userAgent,
        ipHash: ipHashed,
      });

      const messageText = getWhatsAppMessage(neonAssignment.record.messageKey || messageKey);
      const whatsappUrl = buildWhatsAppLeadUrl(neonAssignment.record.salesPhone, messageText);

      return NextResponse.json(
        {
          success: true,
          assignmentId: neonAssignment.record.id,
          source: neonAssignment.record.source,
          sales: {
            id: neonAssignment.record.salesId,
            name: neonAssignment.record.salesName,
          },
          whatsappUrl,
          auditLogStatus: 'recorded',
        },
        {
          status: 200,
          headers: {
            ...NO_STORE_HEADERS,
            'X-Dreamlab-Assignment-Backend': 'neon-transaction-lock',
            'X-Dreamlab-Audit-Status': 'recorded',
          },
        }
      );
    } catch (neonErr: unknown) {
      const errMsg = neonErr instanceof Error ? neonErr.message : String(neonErr);
      console.error('[Assign Route] Neon fallback failed:', errMsg);

      // Server-side emergency fallback (saat Redis DAN Neon keduanya tidak dapat diakses)
      const emergencyBusdev = activeBusdev[0] || BUSDEV_LIST[0];
      const defaultUrl = buildWhatsAppLeadUrl(
        emergencyBusdev.phone,
        getWhatsAppMessage(messageKey)
      );

      return NextResponse.json(
        {
          success: true,
          assignmentId,
          source: resolvedSource,
          sales: {
            id: emergencyBusdev.id,
            name: emergencyBusdev.name,
          },
          whatsappUrl: defaultUrl,
          auditLogStatus: 'failed',
        },
        {
          status: 200,
          headers: {
            ...NO_STORE_HEADERS,
            'X-Dreamlab-Assignment-Backend': 'emergency_fallback',
            'X-Dreamlab-Audit-Status': 'failed',
          },
        }
      );
    }
  } catch (unexpectedErr: unknown) {
    const errMsg = unexpectedErr instanceof Error ? unexpectedErr.message : String(unexpectedErr);
    console.error('[Assign Route] Unexpected error:', errMsg);

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
        auditLogStatus: 'failed',
      },
      {
        status: 200,
        headers: {
          ...NO_STORE_HEADERS,
          'X-Dreamlab-Assignment-Backend': 'emergency_fallback',
          'X-Dreamlab-Audit-Status': 'failed',
        },
      }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405, headers: NO_STORE_HEADERS }
  );
}
