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
 *   - Kalau /next gagal → fallback ke daftar AGENTS (7 CS) via localStorage
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

const FALLBACK_COUNTER_KEY = "dreamlab_wa_fallback_index";

/** Ambil CS berikutnya. Prioritas: PostgreSQL (internal) → fallback AGENTS. */
export async function getNextRoundRobinAgent(): Promise<RoundRobinAgent> {
  try {
    const res = await fetch("/api/lead-capture/next", {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("lead-capture/next " + res.statusText);
    const data = await res.json();
    return {
      id: String(data.id),
      name: data.name,
      phoneNumber: data.phoneNumber,
      orderIndex: Number(data.orderIndex ?? 0),
    };
  } catch (err) {
    console.error("[lead-capture] /next gagal, pakai fallback AGENTS:", err);

    const active = AGENTS.filter((a) => a.active);
    let index = 0;
    if (typeof window !== "undefined") {
      index = parseInt(localStorage.getItem(FALLBACK_COUNTER_KEY) || "0", 10) || 0;
    }
    const agent = active[index % active.length];

    if (typeof window !== "undefined") {
      localStorage.setItem(FALLBACK_COUNTER_KEY, String((index + 1) % active.length));
    }

    return {
      id: agent.id,
      name: agent.name || agent.id,
      phoneNumber: normalizePhone(agent.phone),
      orderIndex: index % active.length,
    };
  }
}

export interface TrackLeadData {
  intent?: string;
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
    const res = await fetch("/api/lead-capture/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
