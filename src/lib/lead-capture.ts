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

const FALLBACK_COUNTER_KEY = "dreamlab_wa_fallback_index";
const CLIENT_VID_KEY = "dreamlab_vid_client";

/**
 * Sticky assignment versi client (localStorage, per visitor).
 * Dipakai saat /next gagal (DB down) supaya visitor yang sama tetap dapat CS
 * yang SAMA di klik/reload berikutnya — tidak melompat ke CS lain.
 * Setiap kali /next sukses, pilihan server disimpan di sini juga, sehingga
 * kalau server sempat turun setelahnya, sticky tetap konsisten.
 */
function stickyKeyFor(vid: string): string {
  return `dreamlab_wa_sticky_${vid}`;
}

function readStickyAgent(vid: string): RoundRobinAgent | null {
  if (!vid || typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(stickyKeyFor(vid));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === "string" && parsed.phoneNumber) {
      return {
        id: parsed.id,
        name: parsed.name || parsed.id,
        phoneNumber: parsed.phoneNumber,
        orderIndex: Number(parsed.orderIndex ?? 0),
      };
    }
    return null;
  } catch {
    return null; // korup -> biarkan di-assign ulang
  }
}

function saveStickyAgent(vid: string, agent: RoundRobinAgent): void {
  if (!vid || typeof window === "undefined") return;
  try {
    localStorage.setItem(stickyKeyFor(vid), JSON.stringify(agent));
  } catch {
    // localStorage penuh / privat -> abaikan, tidak kritis
  }
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
 * 1) kalau visitor sudah punya sticky (localStorage) & agent masih aktif → CS yang SAMA
 * 2) kalau baru → rotasi counter lokal dari AGENTS config, simpan sebagai sticky
 */
function localFallbackAgent(vid: string): RoundRobinAgent {
  const active = AGENTS.filter((a) => a.active);
  if (active.length === 0) throw new Error("lead-capture: tidak ada agent aktif untuk fallback");

  const sticky = readStickyAgent(vid);
  if (sticky && active.some((a) => a.id === sticky.id)) {
    return sticky;
  }

  let index = 0;
  if (typeof window !== "undefined") {
    index = parseInt(localStorage.getItem(FALLBACK_COUNTER_KEY) || "0", 10) || 0;
  }
  const agent = active[index % active.length];

  if (typeof window !== "undefined") {
    localStorage.setItem(FALLBACK_COUNTER_KEY, String((index + 1) % active.length));
  }

  const fallbackAgent: RoundRobinAgent = {
    id: agent.id,
    name: agent.name || agent.id,
    phoneNumber: normalizePhone(agent.phone),
    orderIndex: index % active.length,
  };
  saveStickyAgent(vid, fallbackAgent);
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
    saveStickyAgent(vid, agent);
    return agent;
  } catch (err) {
    console.error("[lead-capture] /next gagal, pakai fallback sticky lokal:", err);
    return localFallbackAgent(vid);
  }
}

export interface ConvertLeadCaptureResult {
  agent: RoundRobinAgent;
  trackingCode: string;
  waUrl: string;
}

/**
 * Endpoint round-robin VPS (Biznet). Round-robin TIDAK lagi lewat Vercel →
 * DB (jalur itu tidak andal). Browser memanggil layanan lead di VPS langsung
 * lewat HTTPS — layanan ini berada di mesin yang sama dengan database, jadi
 * assign + simpan lead cepat & andal.
 *
 * Bisa di-override via env NEXT_PUBLIC_LEAD_API_URL (tanpa trailing slash).
 */
const LEAD_API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_LEAD_API_URL) ||
  "https://nexerp.id/lead";

/**
 * Alur TERCEPAT (dipakai halaman thankyou): assign CS + simpan lead dalam
 * SATU panggilan ke layanan VPS. Pengganti dua langkah lama (getNextRoundRobinAgent
 * lalu trackLead) → 1 request + 1 query DB (lokal di VPS).
 * Kalau VPS gagal → fallback lokal + kode LOCAL-... (chat tetap jalan).
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
    saveStickyAgent(vid, agent);

    return {
      agent,
      trackingCode: json.trackingCode || "LOCAL",
      waUrl: json.waUrl || "",
    };
  } catch (err) {
    console.error("[lead-capture] /convert gagal, pakai fallback lokal:", err);
    const agent = localFallbackAgent(vid);
    const trackingCode = "LOCAL-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    const waUrl = agent.phoneNumber ? `https://wa.me/${agent.phoneNumber}` : "";
    return { agent, trackingCode, waUrl };
  }
}

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
