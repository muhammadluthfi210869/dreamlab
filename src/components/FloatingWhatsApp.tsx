"use client";

import { useCallback, useState } from "react";
import { MessageCircle } from "lucide-react";
import { getNextRoundRobinAgent, trackLead } from "@/lib/lead-capture";
import { buildWaMessage, getPageContext } from "@/lib/wa-message";

export default function FloatingWhatsApp() {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const agent = await getNextRoundRobinAgent();
      const pageUrl = window.location.href;

      const params = new URLSearchParams(window.location.search);
      const us = params.get("utm_source");
      const um = params.get("utm_medium");
      const uc = params.get("utm_campaign");

      const trackData: any = {
        intent: document.title || "produk kosmetik",
        source: us || "wa-button",
        pageUrl,
        pageTitle: document.title || "",
        referrer: document.referrer || undefined,
        assignedName: agent.name,
        assignedPhone: agent.phoneNumber,
      };
      if (us) trackData.utmSource = us;
      if (um) trackData.utmMedium = um;
      if (uc) trackData.utmCampaign = uc;

      await trackLead(trackData);
      const text = encodeURIComponent(buildWaMessage(getPageContext(pageUrl)));

      window.open(`https://wa.me/${agent.phoneNumber}?text=${text}`, "_blank");
    } catch (err) {
      // Round-robin gagal → jangan buka WA ke nomor fallback
      console.error("RR failed, no fallback:", err);
      alert("Maaf, sistem sedang sibuk. Silakan klik lagi.");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <div className="fixed bottom-8 right-8 z-50 wa-float">
      <button
        onClick={handleClick}
        className="flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform group cursor-pointer border-0"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="w-8 h-8 fill-current" />

        <span className="absolute right-20 bg-white text-brand-black px-4 py-2 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
          Konsultasi Gratis
        </span>
      </button>
      <style>{`
        .wa-float {
          animation: wa-appear 0.4s ease-out 1s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .wa-float {
            animation: none;
          }
        }
        @keyframes wa-appear {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}