"use client";

const NEXERP_API =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? process.env.NEXT_PUBLIC_NEXERP_API_URL || "http://localhost:3002"
    : process.env.NEXT_PUBLIC_NEXERP_API_URL || "https://nexerp.id/api";

export interface RoundRobinAgent {
  id: string;
  name: string;
  phoneNumber: string;
  orderIndex: number;
}

export async function getNextRoundRobinAgent(): Promise<RoundRobinAgent> {
  const res = await fetch(`${NEXERP_API}/lead-capture/round-robin/next`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to get agent: " + res.statusText);
  return res.json();
}

export async function trackLead(data: {
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
}): Promise<{ trackingCode: string; waUrl: string }> {
  const res = await fetch(`${NEXERP_API}/lead-capture/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to track lead: " + res.statusText);
  return res.json();
}
