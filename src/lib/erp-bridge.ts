/**
 * erp-bridge.ts — Batch 2.
 *
 * SERVER-ONLY module. Never imported from a "use client" file. Reads
 * `ERP_BRIDGE_URL` and `ERP_BRIDGE_SECRET` from `process.env` (Vercel
 * server runtime). The companion public flag `NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED`
 * decides whether the client even attempts to call this bridge.
 *
 * Contract:
 *   callErpBridge({ websiteIntentId, assignedName, assignedPhone, ... })
 *     → POST <ERP_BRIDGE_URL>/lead-capture/website-bridge/track
 *       header `x-dreamlab-bridge-secret: <secret>`
 *     → returns { ok, trackingCode, waDestinationPhone, leadId, created }
 *     → returns { ok: false, error } on any non-2xx / network / parse failure
 *
 * Failures are surfaced as structured results, NOT thrown — the caller
 * decides UX (typically: do NOT open WhatsApp on failure).
 *
 * Logging rules:
 *   - We NEVER log the secret, the full request body, or the full
 *     destination phone. We MAY log the masked destination last-4 and a
 *     short correlation id (websiteIntentId), since those are already
 *     needed for ops correlation.
 */

const DEFAULT_TIMEOUT_MS = 5000;

export interface ErpBridgeInput {
  websiteIntentId: string;
  assignedName: string;
  assignedPhone?: string | null;
  /** Stable VPS Sales identity (cs1/cs2/cs3/irma). Persisted on the lead. */
  assignedSalesId?: string | null;
  pagePath?: string | null;
  pageUrl?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  referrer?: string | null;
  // ── Lead attribution journey (Batch 4) ──
  /** Original source page URL (e.g. /jasa-maklon-kosmetik/). */
  sourcePage?: string | null;
  /** Type of CTA that triggered the journey. */
  ctaType?: string | null;
  /** ISO timestamp of the CTA click on the source page. */
  ctaClickedAt?: string | null;
  /** ISO timestamp of thank-you page view. */
  thankYouViewedAt?: string | null;
  /** Optional session id from the website. */
  sessionId?: string | null;
  /** Optional device/browser hints (server can ignore if already inferred). */
  deviceType?: string | null;
  browser?: string | null;
}

export interface ErpBridgeSuccess {
  ok: true;
  leadId: string;
  trackingCode: string;
  waDestinationPhone: string;
  created: boolean;
}

export interface ErpBridgeFailure {
  ok: false;
  error:
    | 'not-configured'     // env missing
    | 'timeout'
    | 'network'
    | 'http-error'
    | 'invalid-response'
    | 'conflict';          // 409 IDEMPOTENCY_CONFLICT from ERP
  status?: number;
  correlationId?: string;  // websiteIntentId for ops correlation
}

/** Read bridge config from env. Returns null when not configured. */
function readConfig(): { url: string; secret: string } | null {
  const url = process.env.ERP_BRIDGE_URL;
  const secret = process.env.ERP_BRIDGE_SECRET;
  if (!url || !secret || url.length === 0 || secret.length === 0) {
    return null;
  }
  // Defensive: never let NEXT_PUBLIC_ leak here by mistake.
  if (url.startsWith('NEXT_PUBLIC_') || secret.startsWith('NEXT_PUBLIC_')) {
    return null;
  }
  return { url: url.replace(/\/+$/, ''), secret };
}

/** Mask a phone to its last 4 digits only — for safe logging. */
function maskLast4(phone: string | null | undefined): string {
  if (!phone) return '****';
  const digits = String(phone).replace(/[^0-9]/g, '');
  if (digits.length < 4) return '****';
  return `****${digits.slice(-4)}`;
}

export async function callErpBridge(
  input: ErpBridgeInput,
): Promise<ErpBridgeSuccess | ErpBridgeFailure> {
  const cfg = readConfig();
  if (!cfg) {
    return { ok: false, error: 'not-configured' };
  }

  // Server-side trim/normalize — keep payload small and stable.
  const body = JSON.stringify({
    websiteIntentId: input.websiteIntentId,
    assignedSalesId: input.assignedSalesId ?? null,
    assignedName: input.assignedName,
    assignedPhone: input.assignedPhone ?? null,
    pagePath: input.pagePath ?? null,
    pageUrl: input.pageUrl ?? null,
    utmSource: input.utmSource ?? null,
    utmMedium: input.utmMedium ?? null,
    utmCampaign: input.utmCampaign ?? null,
    utmContent: input.utmContent ?? null,
    utmTerm: input.utmTerm ?? null,
    referrer: input.referrer ?? null,
    sourcePage: input.sourcePage ?? null,
    ctaType: input.ctaType ?? null,
    ctaClickedAt: input.ctaClickedAt ?? null,
    thankYouViewedAt: input.thankYouViewedAt ?? null,
    sessionId: input.sessionId ?? null,
    deviceType: input.deviceType ?? null,
    browser: input.browser ?? null,
  });

  let res: Response;
  try {
    res = await fetch(`${cfg.url}/lead-capture/website-bridge/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-dreamlab-bridge-secret': cfg.secret,
      },
      body,
      // AbortSignal.timeout requires Node 17+ — Vercel runtimes support it.
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      cache: 'no-store',
    });
  } catch (err: any) {
    const isTimeout =
      err?.name === 'TimeoutError' || err?.name === 'AbortError';
    console.warn(
      `[erp-bridge] ${isTimeout ? 'timeout' : 'network'} for ${input.websiteIntentId}`,
    );
    return {
      ok: false,
      error: isTimeout ? 'timeout' : 'network',
      correlationId: input.websiteIntentId,
    };
  }

  if (res.status === 409) {
    return {
      ok: false,
      error: 'conflict',
      status: 409,
      correlationId: input.websiteIntentId,
    };
  }

  if (!res.ok) {
    console.warn(
      `[erp-bridge] http ${res.status} for ${input.websiteIntentId}`,
    );
    return {
      ok: false,
      error: 'http-error',
      status: res.status,
      correlationId: input.websiteIntentId,
    };
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    return {
      ok: false,
      error: 'invalid-response',
      correlationId: input.websiteIntentId,
    };
  }

  if (
    !json ||
    typeof json.trackingCode !== 'string' ||
    typeof json.waDestinationPhone !== 'string' ||
    typeof json.created !== 'boolean'
  ) {
    return {
      ok: false,
      error: 'invalid-response',
      correlationId: input.websiteIntentId,
    };
  }

  // Sanity log — masked destination only.
  console.log(
    `[erp-bridge] ok created=${json.created} code=${json.trackingCode} dest=${maskLast4(json.waDestinationPhone)}`,
  );

  return {
    ok: true,
    leadId: typeof json.leadId === 'string' ? json.leadId : '',
    trackingCode: json.trackingCode,
    waDestinationPhone: json.waDestinationPhone,
    created: json.created,
  };
}

/** True when the public feature flag is explicitly 'true'. Default false. */
export function isErpBridgePubliclyEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED === 'true';
}