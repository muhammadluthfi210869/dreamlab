/**
 * erp-bridge-server.ts — pure orchestration logic, decoupled from
 * NextRequest/NextResponse so it can be unit-tested without loading
 * the Next.js runtime. The thin route.ts file in
 * src/app/api/lead-capture/erp-track/route.ts wraps these functions
 * with Next.js request/response plumbing.
 *
 * TRUST BOUNDARY (Batch 2 §1, §2):
 *   - The browser cannot supply `websiteIntentId` / `assignedName` /
 *     `assignedPhone`. Reject with TRUST_BOUNDARY_VIOLATION when present.
 *
 * SERVER-ONLY ACTIVATION (Batch 2 §2.A, §2.B):
 *   - DREAMLAB_ERP_BRIDGE_ENABLED must be the EXACT string "true".
 *
 * FAIL-CLOSED:
 *   - VPS_CONVERT_URL / ERP_BRIDGE_URL / ERP_BRIDGE_SECRET missing → 503
 *     not-configured. NO fallback to NEXT_PUBLIC_* or hardcoded URLs.
 *
 * CALL ORDER (Batch 2 §1):
 *   - VPS /convert EXACTLY ONCE.
 *   - Then ERP bridge.
 *   - VPS failure → ERP MUST NOT be called.
 *   - ERP failure → no waDestinationPhone returned.
 */

const FORBIDDEN_FIELDS = ['websiteIntentId', 'assignedName', 'assignedPhone'] as const;
export type ForbiddenField = (typeof FORBIDDEN_FIELDS)[number];

export type BridgeDecision =
  | { kind: 'bridge-disabled' }                // 404 — flag OFF
  | { kind: 'invalid-json' }                   // 400
  | { kind: 'invalid-body' }                   // 400
  | { kind: 'trust-boundary'; field: ForbiddenField } // 400
  | { kind: 'not-configured'; missing: string } // 503
  | { kind: 'vps-failed'; detail: string }     // 502
  | { kind: 'conflict' }                       // 409
  | { kind: 'bridge-failed' }                  // 502
  | {
      kind: 'ok';
      agent: { id: string; name: string; phoneNumber: string; orderIndex: number };
      vpsTrackingCode: string;
      erpTrackingCode: string;
      leadId: string;
      created: boolean;
      waDestinationPhone: string;
    };

export interface EnvShape {
  DREAMLAB_ERP_BRIDGE_ENABLED?: string;
  VPS_CONVERT_URL?: string;
  ERP_BRIDGE_URL?: string;
  ERP_BRIDGE_SECRET?: string;
}

export interface FetchLike {
  (input: string, init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
    cache?: string;
  }): Promise<{
    ok: boolean;
    status: number;
    statusText?: string;
    json(): Promise<any>;
  }>;
}

export interface BridgeServerDeps {
  env: NodeJS.ProcessEnv | EnvShape;
  fetchImpl: FetchLike;
  /** Read the visitor cookie. Return null/undefined when absent. */
  readVisitorCookie: () => Promise<string | null>;
  /** Masked length preview for log only (never the value). */
  log: (msg: string) => void;
}

function pickOrdinaryContext(raw: any, visitorIdFromCookie: string | null) {
  for (const f of FORBIDDEN_FIELDS) {
    if (raw && Object.prototype.hasOwnProperty.call(raw, f)) {
      throw { __forbidden: f };
    }
  }
  return {
    intent: typeof raw?.intent === 'string' ? raw.intent : undefined,
    source: typeof raw?.source === 'string' ? raw.source : 'direct',
    pageUrl: typeof raw?.pageUrl === 'string' ? raw.pageUrl : undefined,
    pageTitle: typeof raw?.pageTitle === 'string' ? raw.pageTitle : undefined,
    referrer: typeof raw?.referrer === 'string' ? raw.referrer : undefined,
    utmSource: typeof raw?.utmSource === 'string' ? raw.utmSource : undefined,
    utmMedium: typeof raw?.utmMedium === 'string' ? raw.utmMedium : undefined,
    utmCampaign: typeof raw?.utmCampaign === 'string' ? raw.utmCampaign : undefined,
    // Lead attribution journey (Batch 4 §3) — pure pass-through from
    // the thank-you page. Sales identity (assignedSalesId/Name/Phone)
    // remains server-authoritative from the VPS, never browser-supplied.
    sourcePage: typeof raw?.sourcePage === 'string' ? raw.sourcePage : undefined,
    ctaType: typeof raw?.ctaType === 'string' ? raw.ctaType : undefined,
    ctaClickedAt: typeof raw?.ctaClickedAt === 'string' ? raw.ctaClickedAt : undefined,
    thankYouViewedAt: typeof raw?.thankYouViewedAt === 'string' ? raw.thankYouViewedAt : undefined,
    sessionId: typeof raw?.sessionId === 'string' ? raw.sessionId : undefined,
    utmContent: typeof raw?.utmContent === 'string' ? raw.utmContent : undefined,
    utmTerm: typeof raw?.utmTerm === 'string' ? raw.utmTerm : undefined,
    deviceType: typeof raw?.deviceType === 'string' ? raw.deviceType : undefined,
    browser: typeof raw?.browser === 'string' ? raw.browser : undefined,
    visitorId: visitorIdFromCookie,
  };
}

async function callVpsConvertOnce(
  deps: BridgeServerDeps,
  payload: any,
): Promise<
  | { ok: true; id: string; name: string; phoneNumber: string; orderIndex: number; trackingCode: string }
  | { ok: false; error: 'not-configured' | 'network' | 'http' | 'invalid'; status?: number }
> {
  const url = deps.env.VPS_CONVERT_URL;
  if (!url || (typeof url === 'string' && url.length === 0)) {
    return { ok: false, error: 'not-configured' };
  }
  try {
    const res = await deps.fetchImpl(`${(url as string).replace(/\/+$/, '')}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    if (!res.ok) {
      return { ok: false, error: 'http', status: res.status };
    }
    const json: any = await res.json();
    if (
      !json ||
      typeof json.id !== 'string' ||
      typeof json.name !== 'string' ||
      typeof json.phoneNumber !== 'string' ||
      typeof json.trackingCode !== 'string'
    ) {
      return { ok: false, error: 'invalid' };
    }
    return {
      ok: true,
      id: json.id,
      name: json.name,
      phoneNumber: json.phoneNumber,
      orderIndex: Number(json.orderIndex ?? 0),
      trackingCode: json.trackingCode,
    };
  } catch (err) {
    return { ok: false, error: 'network' };
  }
}

async function callErpBridge(deps: BridgeServerDeps, body: any): Promise<
  | { ok: true; trackingCode: string; waDestinationPhone: string; leadId: string; created: boolean }
  | { ok: false; error: 'not-configured' | 'network' | 'http-error' | 'invalid-response' | 'conflict'; status?: number }
> {
  const url = deps.env.ERP_BRIDGE_URL;
  const secret = deps.env.ERP_BRIDGE_SECRET;
  if (
    !url || (typeof url === 'string' && url.length === 0) ||
    !secret || (typeof secret === 'string' && secret.length === 0)
  ) {
    return { ok: false, error: 'not-configured' };
  }
  if (
    (typeof url === 'string' && url.startsWith('NEXT_PUBLIC_')) ||
    (typeof secret === 'string' && secret.startsWith('NEXT_PUBLIC_'))
  ) {
    return { ok: false, error: 'not-configured' };
  }
  try {
    const res = await deps.fetchImpl(`${(url as string).replace(/\/+$/, '')}/lead-capture/website-bridge/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-dreamlab-bridge-secret': secret as string,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    if (res.status === 409) {
      return { ok: false, error: 'conflict', status: 409 };
    }
    if (!res.ok) {
      return { ok: false, error: 'http-error', status: res.status };
    }
    const json: any = await res.json();
    if (
      !json ||
      typeof json.trackingCode !== 'string' ||
      typeof json.waDestinationPhone !== 'string' ||
      typeof json.created !== 'boolean'
    ) {
      return { ok: false, error: 'invalid-response' };
    }
    return {
      ok: true,
      trackingCode: json.trackingCode,
      waDestinationPhone: json.waDestinationPhone,
      leadId: typeof json.leadId === 'string' ? json.leadId : '',
      created: json.created,
    };
  } catch (err) {
    return { ok: false, error: 'network' };
  }
}

/**
 * Decide what the bridge route should return for a parsed JSON body.
 * Pure function — all external state (env, fetch, cookies) is injected
 * via `deps`.
 */
export async function decideBridge(
  raw: any,
  deps: BridgeServerDeps,
): Promise<BridgeDecision> {
  // 1. Server-only activation flag (case-sensitive exact 'true').
  if (deps.env.DREAMLAB_ERP_BRIDGE_ENABLED !== 'true') {
    return { kind: 'bridge-disabled' };
  }

  // 2. Body shape.
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { kind: 'invalid-body' };
  }

  // 3. Trust boundary: forbidden fields.
  try {
    pickOrdinaryContext(raw, null);
  } catch (e: any) {
    if (e && e.__forbidden) {
      return { kind: 'trust-boundary', field: e.__forbidden };
    }
    throw e;
  }

  // 4. Required env (fail-closed, no hardcoded fallback).
  for (const required of ['VPS_CONVERT_URL', 'ERP_BRIDGE_URL', 'ERP_BRIDGE_SECRET'] as const) {
    const v = deps.env[required];
    if (!v || (typeof v === 'string' && v.length === 0)) {
      return { kind: 'not-configured', missing: required };
    }
  }
  if (
    typeof deps.env.ERP_BRIDGE_URL === 'string' && deps.env.ERP_BRIDGE_URL.startsWith('NEXT_PUBLIC_') ||
    typeof deps.env.ERP_BRIDGE_SECRET === 'string' && deps.env.ERP_BRIDGE_SECRET.startsWith('NEXT_PUBLIC_')
  ) {
    return { kind: 'not-configured', missing: 'ERP_BRIDGE_URL_or_SECRET' };
  }

  // 5. Single VPS call.
  const visitorId = await deps.readVisitorCookie();
  const ordinary = pickOrdinaryContext(raw, visitorId);
  const vps = await callVpsConvertOnce(deps, ordinary);
  if (!vps.ok) {
    if (vps.error === 'not-configured') {
      return { kind: 'not-configured', missing: 'VPS_CONVERT_URL' };
    }
    deps.log(`[erp-bridge-server] VPS failed (${vps.error})`);
    return { kind: 'vps-failed', detail: vps.error };
  }

  // 6. ERP call with VPS-derived authority fields.
  // The VPS is the source of truth for the Sales assignment
  // (`vps.id` is the stable identity e.g. cs1/cs2/cs3/irma).
  // Journey timestamps + sourcePage come from the thank-you page
  // (already-sanitized via pickOrdinaryContext above).
  const erp = await callErpBridge(deps, {
    websiteIntentId: vps.trackingCode,
    assignedSalesId: vps.id,
    assignedName: vps.name,
    assignedPhone: vps.phoneNumber,
    pageUrl: ordinary.pageUrl ?? null,
    utmSource: ordinary.utmSource ?? null,
    utmMedium: ordinary.utmMedium ?? null,
    utmCampaign: ordinary.utmCampaign ?? null,
    utmContent: ordinary.utmContent ?? null,
    utmTerm: ordinary.utmTerm ?? null,
    referrer: ordinary.referrer ?? null,
    sourcePage: ordinary.sourcePage ?? null,
    ctaType: ordinary.ctaType ?? null,
    ctaClickedAt: ordinary.ctaClickedAt ?? null,
    thankYouViewedAt: ordinary.thankYouViewedAt ?? null,
    sessionId: ordinary.sessionId ?? null,
    deviceType: ordinary.deviceType ?? null,
    browser: ordinary.browser ?? null,
  });
  if (!erp.ok) {
    if (erp.error === 'conflict') return { kind: 'conflict' };
    if (erp.error === 'not-configured') return { kind: 'not-configured', missing: 'ERP_BRIDGE_URL_or_SECRET' };
    return { kind: 'bridge-failed' };
  }

  return {
    kind: 'ok',
    agent: {
      id: vps.id,
      name: vps.name,
      phoneNumber: vps.phoneNumber,
      orderIndex: vps.orderIndex,
    },
    vpsTrackingCode: vps.trackingCode,
    erpTrackingCode: erp.trackingCode,
    leadId: erp.leadId,
    created: erp.created,
    waDestinationPhone: erp.waDestinationPhone,
  };
}

export const __test__ = {
  FORBIDDEN_FIELDS,
  pickOrdinaryContext,
  callVpsConvertOnce,
  callErpBridge,
};
