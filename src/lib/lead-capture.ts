"use client";

import { AGENTS } from "./round-robin-config";

/**
 * lead-capture.ts
 *
 * Alur baru (2026-07-31): TIDAK lagi memanggil server ERP (nexerp.id).
 * Tombol WA memakai endpoint internal di Vercel:
 *   - GET  /api/lead-capture/next  → ambil CS berikutnya dari PostgreSQL dedicated
 *   - POST /api/lead-capture/track → simpan lead ke PostgreSQL dedicated
 *
 * Anti-gagal (resilience):
 *   - Kalau /next gagal → fallback ke daftar AGENTS (6 CS) via localStorage
 *     round-robin, supaya tombol WA TETAP terbuka.
 *   - Kalau /track gagal → generate kode lokal (LOCAL-...) supaya chat tetap
 *     jalan; lead tidak memblokir pengalaman user.
 */

export interface RoundRobinAgent {
  id: string;
  name: string;
  phoneNumber: string;
  orderIndex: number;
}

function normalizePhone(phone: string): string {
  let cleaned = (phone ?? "").replace(/[\s\-\(\)\+]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Fail-fast client: batasi waktu tunggu fetch supaya saat DB/server lambat atau
 * mati, fallback lokal aktif cepat (bukan menunggu timeout server 8 detik).
 * Nilai disesuaikan sedikit di atas connectionTimeoutMillis server (3 detik)
 * supaya respons 500 server sempat tiba sebelum client abort.
 */
const CLIENT_FETCH_TIMEOUT_MS = 4000;

/** AbortSignal dengan timeout, kompatibel browser lama (fallback AbortController). */
function timeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
}

const CLIENT_VID_KEY = "dreamlab_vid_client";

function saveStickyAgent(): void {
  // No-op: round-robin state is managed globally on the server (Upstash Redis + Neon)
}

/**
 * Visitor ID dari sisi client (localStorage, stabil antar klik/halaman).
 * Dikirim ke server sebagai ?vid= → mencegah race double-click ketika
 * cookie belum sempat ter-set. Server tetap prioritas cookie kalau sudah ada.
 */
function getClientVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let vid = localStorage.getItem(CLIENT_VID_KEY);
    if (!vid) {
      vid =
        (window.crypto && typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : "v_" + Math.random().toString(36).slice(2) + Date.now().toString(36));
      localStorage.setItem(CLIENT_VID_KEY, vid);
    }
    return vid;
  } catch {
    return "";
  }
}

/**
 * Fallback lokal saat server/DB tidak terjangkau:
 * Fallback CS pertama yang aktif tanpa manipulasi counter browser.
 */
function localFallbackAgent(): RoundRobinAgent {
  const active = AGENTS.filter((a) => a.active);
  if (active.length === 0) throw new Error("lead-capture: tidak ada agent aktif untuk fallback");

  // Fallback server-side tunggal tanpa counter localStorage dan tanpa Math.random()
  const agent = active[0];

  const fallbackAgent: RoundRobinAgent = {
    id: agent.id,
    name: agent.name || agent.id,
    phoneNumber: normalizePhone(agent.phone),
    orderIndex: 0,
  };
  return fallbackAgent;
}

/** Ambil CS berikutnya. Prioritas: PostgreSQL (internal) → fallback sticky lokal → fallback AGENTS. */
export async function getNextRoundRobinAgent(): Promise<RoundRobinAgent> {
  const vid = getClientVisitorId();

  try {
    const res = await fetch(
      `/api/lead-capture/next/${vid ? `?vid=${encodeURIComponent(vid)}` : ""}`,
      {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        signal: timeoutSignal(CLIENT_FETCH_TIMEOUT_MS),
      }
    );
    if (!res.ok) throw new Error("lead-capture/next " + res.statusText);
    const data = await res.json();

    const agent: RoundRobinAgent = {
      id: String(data.id),
      name: data.name,
      phoneNumber: data.phoneNumber,
      orderIndex: Number(data.orderIndex ?? 0),
    };
    // Sinkronkan sticky lokal dengan keputusan server (untuk masa DB down nanti).
    saveStickyAgent();
    return agent;
  } catch (err) {
    console.error("[lead-capture] /next gagal, pakai fallback sticky lokal:", err);
    return localFallbackAgent();
  }
}

export interface ConvertLeadCaptureResult {
  agent: RoundRobinAgent;
  trackingCode: string;
  waUrl: string;
  /** True when Batch 2 ERP bridge produced this result (vs legacy VPS-only). */
  erpBridge?: boolean;
  /** Canonical ERP tracking code, distinct from the legacy VPS code. */
  erpTrackingCode?: string;
  /** Resolved WhatsApp destination from ERP (env-driven device). */
  waDestinationPhone?: string;
}

/**
 * Endpoint round-robin Next.js internal / VPS.
 * Default ke `/api/lead-capture` (internal Next.js API route) yang terhubung ke PostgreSQL.
 * Bisa di-override via env NEXT_PUBLIC_LEAD_API_URL jika memakai external service.
 */
const LEAD_API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_LEAD_API_URL) ||
  "/api/lead-capture";

/**
 * Alur TERCEPAT (dipakai halaman thankyou): assign CS + simpan lead dalam
 * SATU panggilan ke layanan API. Pengganti dua langkah lama (getNextRoundRobinAgent
 * lalu trackLead) → 1 request + 1 query DB.
 * Kalau API gagal → fallback lokal + kode LOCAL-... (chat tetap jalan secara merata).
 */
export async function convertLeadCapture(data: TrackLeadData): Promise<ConvertLeadCaptureResult> {
  const vid = getClientVisitorId();

  try {
    const res = await fetch(`${LEAD_API_BASE}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vid ? { ...data, visitorId: vid } : data),
      signal: timeoutSignal(CLIENT_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error("lead-capture/convert " + res.statusText);
    const json = await res.json();

    const agent: RoundRobinAgent = {
      id: String(json.id),
      name: json.name,
      phoneNumber: json.phoneNumber,
      orderIndex: Number(json.orderIndex ?? 0),
    };
    saveStickyAgent();

    return {
      agent,
      trackingCode: json.trackingCode || "LOCAL",
      waUrl: json.waUrl || "",
    };
  } catch (err) {
    console.error("[lead-capture] /convert gagal, pakai fallback lokal:", err);
    const agent = localFallbackAgent();
    const trackingCode = "LOCAL-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    const waUrl = agent.phoneNumber ? `https://wa.me/${agent.phoneNumber}` : "";
    return { agent, trackingCode, waUrl };
  }
}

/**
 * Batch 2 — final cross-repo closure.
 *
 * The real implementation lives in `./bridge-client.ts` — a standalone
 * module that does NOT import round-robin-config (so it stays unit-testable
 * under Node 22 `--experimental-strip-types` without a transpiler hook).
 * This file re-exports the public surface for backward compatibility with
 * existing consumers like `ThankYouRoundRobin.tsx`.
 *
 * Behavior contract (unchanged):
 *
 *   - The BROWSER calls the website server route EXACTLY ONCE. The browser
 *     MUST NOT independently call the VPS /convert endpoint when bridge
 *     mode is enabled.
 *   - On any failure (network, 4xx, 5xx, 409, route 404) the function
 *     THROWS — the caller MUST NOT fall back to a non-bridged WA URL.
 *   - 409 IDEMPOTENCY_CONFLICT surfaces as `BridgeConflictError`.
 */
export {
  convertLeadCaptureWithErpBridge,
  BridgeConflictError,
  type ConvertWithErpInput,
  type ConvertBridgeResult,
} from './bridge-client';

// Local-view of the bridge result — kept here so existing imports of
// `convertLeadCaptureWithErpBridge` continue to see a `ConvertLeadCaptureResult`-
// shaped response (with `erpBridge`, `erpTrackingCode`, `waDestinationPhone`).
export type ConvertLeadCaptureResultWithBridge = {
  agent: RoundRobinAgent;
  trackingCode: string;
  waUrl: string;
  erpBridge?: boolean;
  erpTrackingCode?: string;
  waDestinationPhone?: string;
};

export interface TrackLeadData {
  intent?: string;
  source?: string; // channel: organic | google-ads | metaads | medsos | direct | wa-button
  pageUrl?: string;
  pageTitle?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceType?: string;
  browser?: string;
  sessionId?: string;
  assignedName?: string;
  assignedPhone?: string;
}

export async function trackLead(
  data: TrackLeadData
): Promise<{ trackingCode: string; waUrl: string }> {
  try {
    const vid = getClientVisitorId();
    const res = await fetch("/api/lead-capture/track/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vid ? { ...data, visitorId: vid } : data),
      signal: timeoutSignal(CLIENT_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error("lead-capture/track " + res.statusText);
    return await res.json();
  } catch (err) {
    console.error("[lead-capture] /track gagal, pakai kode lokal:", err);
    const trackingCode = "LOCAL-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    const waUrl = data.assignedPhone
      ? `https://wa.me/${normalizePhone(data.assignedPhone)}`
      : "";
    return { trackingCode, waUrl };
  }
}
