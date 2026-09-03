/**
 * bridge-client.ts — Batch 2 final.
 *
 * Isolated client-side bridge function. Lives in its own module so it can
 * be unit-tested WITHOUT pulling in the entire `lead-capture.ts` transitive
 * dependency graph (which includes `round-robin-config.ts` etc. that the
 * Node 22 `--experimental-strip-types` resolver wouldn't auto-resolve).
 *
 * `lead-capture.ts` re-exports `convertLeadCaptureWithErpBridge` from here
 * so existing consumers (e.g. `ThankYouRoundRobin`) keep working.
 *
 * Contract (mirrors `decideBridge` on the server side):
 *
 *   - The BROWSER MUST NOT independently call VPS /convert when bridge
 *     mode is enabled. The website server route is the SINGLE source of
 *     orchestration authority — it derives `websiteIntentId`,
 *     `assignedName`, and `assignedPhone` server-side from VPS.
 *   - This function calls the website bridge route EXACTLY ONCE.
 *   - On any failure (network, 4xx, 5xx, 409, 404 flag-off), it THROWS.
 *     The caller MUST NOT fall back to a non-bridged WA URL.
 *
 * Logging rules: never log ERP secrets, never log the full phone. We
 * MAY log a masked last-4 correlation token (already in PUBLIC view
 * because the page constructs the WA URL).
 */

export interface ConvertWithErpInput {
  intent?: string;
  source?: string;
  pageUrl?: string;
  pageTitle?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  // Lead attribution journey (Batch 4)
  /** Original source page URL the CTA was clicked from. */
  sourcePage?: string;
  /** Type of CTA that triggered the journey. */
  ctaType?: string;
  /** ISO timestamp of the CTA click on the source page. */
  ctaClickedAt?: string;
  /** ISO timestamp of thank-you page view (auto-set by TYRR on mount). */
  thankYouViewedAt?: string;
  /** Optional session id. */
  sessionId?: string;
}

export interface ConvertBridgeResult {
  agent: { id: string; name: string; phoneNumber: string; orderIndex: number };
  trackingCode: string;
  waUrl: string;          // intentionally empty — caller builds it
  erpBridge: true;
  erpTrackingCode: string;
  waDestinationPhone: string;
}

export class BridgeConflictError extends Error {
  constructor() {
    super('IDEMPOTENCY_CONFLICT');
    this.name = 'BridgeConflictError';
  }
}

// ───────────────────────────────────────────────────────────────────────
//  Local-only helpers (browser-safe; NO imports from round-robin-config)
// ───────────────────────────────────────────────────────────────────────

const CLIENT_VID_KEY = 'dreamlab_vid_client';
const STICKY_KEY_PREFIX = 'dreamlab_wa_sticky_';

function getClientVisitorId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let vid = window.localStorage.getItem(CLIENT_VID_KEY);
    if (!vid) {
      vid = (window.crypto && typeof window.crypto.randomUUID === 'function')
        ? window.crypto.randomUUID()
        : 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.localStorage.setItem(CLIENT_VID_KEY, vid);
    }
    return vid;
  } catch {
    return '';
  }
}

function saveStickyAgent(vid: string, agent: { id: string; name: string; phoneNumber: string; orderIndex: number }): void {
  if (!vid || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STICKY_KEY_PREFIX + vid,
      JSON.stringify(agent),
    );
  } catch {
    // quota / private mode — non-fatal
  }
}

function timeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms);
  }
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
}

const CLIENT_FETCH_TIMEOUT_MS = 4000;

// ───────────────────────────────────────────────────────────────────────
//  Main entry point
// ───────────────────────────────────────────────────────────────────────

export interface ConvertBridgeOptions {
  fetchImpl?: typeof fetch;
  baseUrl?: string;
  timeoutMs?: number;
}

export async function convertLeadCaptureWithErpBridge(
  data: ConvertWithErpInput,
  opts: ConvertBridgeOptions = {},
): Promise<ConvertBridgeResult> {
  const f = opts.fetchImpl ?? (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
  if (!f) {
    throw new Error('BRIDGE_FAILED_NO_FETCH');
  }

  // Defensive scrub of any forbidden authority fields.
  const safeBody: Record<string, unknown> = {
    intent: data.intent,
    source: data.source,
    pageUrl: data.pageUrl,
    pageTitle: data.pageTitle,
    referrer: data.referrer,
    utmSource: data.utmSource,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
    // Lead attribution journey (Batch 4 §3). These are derived from the
    // thank-you page's URL/search params and forwarded to ERP. The browser
    // does NOT supply Sales identity — that comes from VPS server-side.
    sourcePage: data.sourcePage,
    ctaType: data.ctaType,
    ctaClickedAt: data.ctaClickedAt,
    thankYouViewedAt: data.thankYouViewedAt,
    sessionId: data.sessionId,
  };
  for (const k of Object.keys(safeBody)) {
    if (safeBody[k] === undefined) delete safeBody[k];
  }

  const url = (opts.baseUrl ?? '') + '/api/lead-capture/erp-track';
  const res = await f(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(safeBody),
    signal: timeoutSignal(opts.timeoutMs ?? CLIENT_FETCH_TIMEOUT_MS),
    cache: 'no-store',
  });

  if (res.status === 404) {
    throw new Error('BRIDGE_DISABLED');
  }
  if (res.status === 409) {
    throw new BridgeConflictError();
  }
  if (!res.ok) {
    throw new Error('BRIDGE_FAILED');
  }

  const json: any = await res.json();
  if (!json || json.ok !== true) {
    throw new Error('BRIDGE_INVALID_RESPONSE');
  }

  const agent = {
    id: String(json.agent?.id ?? ''),
    name: String(json.agent?.name ?? ''),
    phoneNumber: String(json.agent?.phoneNumber ?? ''),
    orderIndex: Number(json.agent?.orderIndex ?? 0),
  };
  if (!agent.id || !agent.name || !agent.phoneNumber) {
    throw new Error('BRIDGE_INVALID_RESPONSE');
  }
  if (
    typeof json.trackingCode !== 'string' ||
    typeof json.waDestinationPhone !== 'string' ||
    !json.trackingCode ||
    !json.waDestinationPhone
  ) {
    throw new Error('BRIDGE_INVALID_RESPONSE');
  }

  const vid = getClientVisitorId();
  saveStickyAgent(vid, agent);

  return {
    agent,
    trackingCode: json.trackingCode,
    waUrl: '',
    erpBridge: true,
    erpTrackingCode: json.trackingCode,
    waDestinationPhone: json.waDestinationPhone,
  };
}
