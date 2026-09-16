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
import { convertLead } from '@/lib/round-robin-db';
import { pickEmergencyFallbackAgent } from '@/lib/round-robin-config';
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
 * Hash eventId (UUID hex) → indeks BusDev, untuk emergency fallback yang
 * merata antar instance serverless tanpa state bersama. Tanpa seed, fallback
 * lama (counter in-process) tetap dipakai.
 */
function emergencyPick(seed: string | null, active: readonly { id: string; name: string; phone: string }[]) {
  if (seed) {
    const hex = seed.replace(/[^0-9a-fA-F]/g, '').slice(0, 8) || '0';
    const idx = parseInt(hex, 16) % active.length;
    const picked = active[idx];
    return { id: picked.id, name: picked.name, phone: picked.phone };
  }
  const fallback = pickEmergencyFallbackAgent();
  return { id: fallback.id, name: fallback.name || fallback.id, phone: fallback.phone };
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

    // Fingerprint visitor stabil dari client (localStorage). Bila tidak ada,
    // pakai eventId supaya tetap ada kunci visitor_id untuk dedup 24 jam.
    const visitorId = sanitizeString(body.visitorId, 100) || eventId;

    // Flag test: selaraskan dengan heuristik deteksi test di PostgreSQL
    // (p_is_test / intent / page_url / visitor_id 'test_%').
    const isTest =
      body.test === true ||
      body.test_rr === true ||
      /test/i.test(visitorId) ||
      /test/i.test(landingPage || '') ||
      /test/i.test(referrer || '');

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

    // Sequence Redis (bila reservasi berhasil) — HANYA dipakai untuk rotasi
    // fallback saat engine PG mati.
    const sequence =
      reserveRes.status === 'ASSIGNED' || reserveRes.status === 'RESERVED_SEQUENCE'
        ? reserveRes.sequence
        : null;

    // 5. PRIMARY: PG WAVE ENGINE (assign_and_insert_lead)
    // Pemilihan BusDev + sticky + dedup 24 jam + INSERT ke tabel `leads`
    // terjadi atomik di database (advisory lock + Strict Spread Guard).
    // Redis di route ini HANYA idempotency guard untuk eventId — pemilihan
    // BusDev bukan lagi rotasi buta `(seq-1)%n` yang hasilnya di-dual-write
    // dan mengotori daily_leads (akar penyebab ketimpangan sebelum 00014).
    try {
      const conv = await convertLead({
        visitorId,
        intent: messageKey ?? resolvedSource,
        source: resolvedSource,
        pageUrl: landingPage || undefined,
        referrer: referrer || undefined,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        sessionId: eventId,
        isTest,
      });

      const messageText = getWhatsAppMessage(messageKey);
      const trackingSuffix = conv.trackingCode ? ` [Kode: ${conv.trackingCode}]` : '';
      const whatsappUrl = buildWhatsAppLeadUrl(conv.phoneNumber, `${messageText}${trackingSuffix}`);

      const resultPayload: CachedLeadAssignment = {
        assignmentId,
        source: resolvedSource,
        sales: {
          id: conv.id,
          name: conv.name,
          phone: conv.phoneNumber,
        },
        whatsappUrl,
      };

      // Caching Redis (idempotensi replay) + audit log Neon di background via
      // after() — tidak pernah menahan redirect user. Traffic test tidak
      // di-cache ke Redis agar Redis tetap bersih.
      safeBackground(async () => {
        try {
          if (!isTest) {
            await cacheLeadEvent(eventId, resultPayload).catch(() => {});
          }
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
            salesId: conv.id,
            salesName: conv.name,
            salesPhone: conv.phoneNumber,
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
          trackingCode: conv.trackingCode,
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
            'X-Dreamlab-Assignment-Backend': 'pg-wave',
            'X-Dreamlab-Audit-Status': 'recorded',
            'X-Dreamlab-Duration-Redis-Ms': String(redisDurationMs),
            'X-Dreamlab-Duration-Total-Ms': String(totalDurationMs),
            'Server-Timing': `redis;dur=${redisDurationMs}, total;dur=${totalDurationMs}`,
          },
        }
      );
    } catch (pgErr: unknown) {
      const pgErrMsg = pgErr instanceof Error ? pgErr.message : String(pgErr);
      console.error(
        '[Assign Route] PG wave engine gagal, lanjut ke rotasi Redis:',
        pgErrMsg
      );
    }

    // 6. FALLBACK A — PG mati: rotasi Redis dari sequence atomik.
    // Masih merata (urutan bergilir), tapi TANPA wave guard; lead tidak
    // tertulis ke tabel `leads` sampai PG sehat kembali (tidak ada lagi
    // dual-write buta yang mengotori daily_leads).
    if (sequence !== null) {
      const index = (sequence - 1) % activeBusdev.length;
      const selectedSales = activeBusdev[index];

      const messageText = getWhatsAppMessage(messageKey);
      const trackingSuffix = eventId ? ` [Kode: ${eventId}]` : '';
      const whatsappUrl = buildWhatsAppLeadUrl(selectedSales.phone, `${messageText}${trackingSuffix}`);

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
            'X-Dreamlab-Assignment-Backend': 'redis-wave-fallback',
            'X-Dreamlab-Audit-Status': 'recorded',
            'X-Dreamlab-Duration-Redis-Ms': String(redisDurationMs),
            'X-Dreamlab-Duration-Total-Ms': String(totalDurationMs),
            'Server-Timing': `redis;dur=${redisDurationMs}, total;dur=${totalDurationMs}`,
          },
        }
      );
    }

    // 7. FALLBACK B — ATOMIK NEON POSTGRESQL (Saat Redis DAN PG utama sama-sama tidak merespons)
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

      // Catatan: TIDAK ada dual-write ke PG di sini — jalur ini hanya aktif
      // saat PG utama mati, dan assignment buta yang ditulis belakangan justru
      // mengotori daily_leads wave engine. Neon di sini murni audit/rekaman.

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

      // Server-side emergency fallback (saat Redis, PG, DAN Neon tidak dapat
      // diakses). Hash eventId → merata tanpa state bersama antar instance,
      // bukan selalu index 0 (yang dulu menumpuk lead ke BusDev pertama).
      const emergencyPool = activeBusdev.length > 0 ? activeBusdev : BUSDEV_LIST;
      const emergencyBusdev = emergencyPick(eventId, emergencyPool);
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

    // Emergency merata: hash seed acak (unexpected error = tidak ada eventId
    // yang dijamin tersedia di scope ini).
    const unexpectedSeed = crypto.randomUUID();
    const fallbackBusdev = emergencyPick(unexpectedSeed, BUSDEV_LIST);
    const defaultUrl = buildWhatsAppLeadUrl(
      fallbackBusdev.phone,
      getWhatsAppMessage('default')
    );

    return NextResponse.json(
      {
        success: true,
        assignmentId: unexpectedSeed,
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
