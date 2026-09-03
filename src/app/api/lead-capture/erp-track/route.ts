/**
 * POST /api/lead-capture/erp-track
 *
 * Batch 2 — Server-orchestrated ERP bridge. Thin Next.js wrapper around
 * the pure orchestration logic in `@/lib/erp-bridge-server` so the route
 * can be unit-tested without spinning up the Next.js runtime.
 *
 * TRUST BOUNDARY (Batch 2 §1):
 *   - The browser is NOT authoritative for `websiteIntentId`,
 *     `assignedName`, or `assignedPhone`. Those three fields are forbidden
 *     in the request body and the server route returns HTTP 400 if any of
 *     them is supplied.
 *
 * ACTIVATION FLAG (Batch 2 §2):
 *   - DREAMLAB_ERP_BRIDGE_ENABLED must be EXACTLY the string "true"
 *     (case-sensitive). Anything else short-circuits to a 404 with zero
 *     VPS or ERP calls.
 *
 * FAIL-CLOSED:
 *   - VPS_CONVERT_URL / ERP_BRIDGE_URL / ERP_BRIDGE_SECRET missing → 503
 *     not-configured. NO hardcoded production URL fallbacks.
 *
 * CALL ORDER (Batch 2 §1):
 *   - Browser → /api/lead-capture/erp-track  EXACTLY ONCE.
 *   - Server → POST <VPS_CONVERT_URL>/convert   EXACTLY ONCE.
 *   - Server → POST <ERP_BRIDGE_URL>/lead-capture/website-bridge/track.
 *
 * The browser NEVER sees the ERP secret. The VPS URL/auth lives only on
 * the server.
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decideBridge } from '@/lib/erp-bridge-server';

export const dynamic = 'force-dynamic';

async function readVisitorCookie(): Promise<string | null> {
  try {
    const store = await cookies();
    const v = store.get('dreamlab_vid')?.value;
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let raw: any;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid-json' }, { status: 400 });
  }

  const decision = await decideBridge(raw, {
    env: process.env,
    fetchImpl: fetch.bind(globalThis) as any,
    readVisitorCookie,
    log: (msg) => console.warn(msg),
  });

  switch (decision.kind) {
    case 'bridge-disabled':
      return new NextResponse(null, { status: 404 });
    case 'invalid-json':
      return NextResponse.json({ ok: false, error: 'invalid-json' }, { status: 400 });
    case 'invalid-body':
      return NextResponse.json({ ok: false, error: 'invalid-body' }, { status: 400 });
    case 'trust-boundary':
      console.warn(`[lead-capture/erp-track] trust-boundary reject: ${decision.field}`);
      return NextResponse.json(
        { ok: false, error: 'trust-boundary', field: decision.field },
        { status: 400 },
      );
    case 'not-configured':
      return NextResponse.json(
        { ok: false, error: 'not-configured', missing: decision.missing },
        { status: 503 },
      );
    case 'vps-failed':
      return NextResponse.json(
        { ok: false, error: 'vps-failed', detail: decision.detail },
        { status: 502 },
      );
    case 'conflict':
      return NextResponse.json(
        { ok: false, code: 'IDEMPOTENCY_CONFLICT' },
        { status: 409 },
      );
    case 'bridge-failed':
      return NextResponse.json(
        { ok: false, error: 'bridge-failed' },
        { status: 502 },
      );
    case 'ok':
      return NextResponse.json(
        {
          ok: true,
          agent: decision.agent,
          vpsTrackingCode: decision.vpsTrackingCode,
          erpTrackingCode: decision.erpTrackingCode,
          trackingCode: decision.erpTrackingCode,
          waDestinationPhone: decision.waDestinationPhone,
          leadId: decision.leadId,
          created: decision.created,
        },
        {
          headers: {
            // Every call is a fresh orchestration — no caching.
            'Cache-Control': 'no-store, max-age=0',
          },
        },
      );
    default:
      return NextResponse.json({ ok: false, error: 'unreachable' }, { status: 500 });
  }
}
