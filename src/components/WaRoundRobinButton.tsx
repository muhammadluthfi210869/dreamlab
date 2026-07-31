"use client";

import { useCallback, useState } from "react";
import { getNextRoundRobinAgent, trackLead } from "@/lib/lead-capture";
import { buildWaMessage } from "@/lib/wa-message";
import { getLeadSource } from "@/lib/lead-source";

interface WaRoundRobinButtonProps {
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

function getDeviceInfo() {
  if (typeof window === "undefined") return { deviceType: "unknown", browser: "unknown" };
  const ua = navigator.userAgent;
  return {
    deviceType: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ? "mobile" : "desktop",
    browser: ua.includes("Chrome") ? "chrome" : ua.includes("Firefox") ? "firefox" : "unknown",
  };
}

/**
 * WhatsApp button with round-robin agent assignment + lead tracking.
 * Uses page-aware pre-fill message from the `message` prop or defaults to page context.
 */
export default function WaRoundRobinButton({ message, className, children }: WaRoundRobinButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const agent = await getNextRoundRobinAgent();
      const device = getDeviceInfo();

      const intent = message || document.title || "produk Dreamlab";

      const params = new URLSearchParams(window.location.search);
      const us = params.get("utm_source");
      const um = params.get("utm_medium");
      const uc = params.get("utm_campaign");

      const trackData: any = {
        intent: intent,
        source: getLeadSource(window.location.pathname),
        pageUrl: window.location.href,
        pageTitle: document.title,
        referrer: document.referrer || undefined,
        assignedName: agent.name,
        assignedPhone: agent.phoneNumber,
        ...device,
      };
      if (us) trackData.utmSource = us;
      if (um) trackData.utmMedium = um;
      if (uc) trackData.utmCampaign = uc;

      await trackLead(trackData);
      // Pesan bersih: kalau `message` prop sudah kalimat utuh, pakai itu;
      // kalau tidak, bangun dari konteks (tanpa tracking code).
      const text = encodeURIComponent(message ? message : buildWaMessage(intent));

      window.open(`https://wa.me/${agent.phoneNumber}?text=${text}`, "_blank");
    } catch (err) {
      // Round-robin gagal → jangan buka WA ke nomor fallback
      // Agar distribusi lead tetap akurat, lebih baik user klik ulang
      console.error("RR failed, no fallback:", err);
      alert("Maaf, sistem sedang sibuk. Silakan klik lagi.");
    } finally {
      setLoading(false);
    }
  }, [message, loading]);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? "Memproses..." : children}
    </button>
  );
}
