"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { fireAssignedLeadTracking } from "@/lib/tracking";
import {
  assignLeadViaClient,
  type LeadAssignmentResponse,
} from "@/lib/lead-assignment-client";

type ThankYouRoundRobinProps = {
  defaultSource: string;
  title: string;
  description: string;
  message?: string;
  messageMap?: Record<string, string>;
  channelLabel?: string;
  ctaLabel?: string;
};

export function ThankYouRoundRobin({
  defaultSource,
  title,
  description,
  messageMap,
  ctaLabel = "KONSULTASI BRAND ANDA SEKARANG",
}: ThankYouRoundRobinProps) {
  const [assignment, setAssignment] = useState<LeadAssignmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [navigated, setNavigated] = useState(false);

  // Assignment via POST /api/leads/assign -> Tracking lengkap -> Immediate redirect
  useEffect(() => {
    let cancelled = false;
    const tStart = performance.now();

    const params = new URLSearchParams(window.location.search);
    const resolvedSource = params.get("source") || defaultSource;
    const intentSource = params.get("source") || "";
    const fromParam = params.get("from") || undefined;
    let eventIdParam = params.get("event_id") || undefined;

    // Jika URL belum memiliki event_id, generate UUID v4 baru dan simpan ke URL
    // via replaceState agar saat user refresh (F5), event_id tetap sama (idempotent).
    if (!eventIdParam && typeof window !== "undefined") {
      const freshId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : undefined;
      if (freshId) {
        eventIdParam = freshId;
        params.set("event_id", freshId);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, "", newUrl);
      }
    }

    // Tentukan messageKey jika cocok dengan map
    let messageKey: string | undefined = undefined;
    if (intentSource && messageMap && messageMap[intentSource]) {
      messageKey = intentSource;
    }

    setError(null);
    setLoading(true);

    assignLeadViaClient({
      eventId: eventIdParam,
      source: resolvedSource,
      landingPage: fromParam || window.location.pathname,
      referrer: document.referrer,
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      messageKey,
    })
      .then((res) => {
        if (cancelled) return;
        setAssignment(res);
        setLoading(false);

        const tAssignment = performance.now();
        const assignmentDuration = Math.round(tAssignment - tStart);

        // Firing seluruh event konversi SEBELUM redirect:
        // - Meta Pixel Lead (eventID matching untuk dedup CAPI)
        // - Google Ads conversion via gtag
        // - GA4 generate_lead via gtag
        // - GTM dataLayer (lead_assigned & conversion)
        // - TikTok Pixel Lead
        // - NexERP CRM via navigator.sendBeacon
        const tTrackingStart = performance.now();
        const trackingResult = fireAssignedLeadTracking({
          source: res.source || resolvedSource,
          eventId: eventIdParam || res.assignmentId,
          assignmentId: res.assignmentId,
          sales: res.sales,
          whatsappUrl: res.whatsappUrl,
          landingPage: fromParam || window.location.pathname,
          utmSource: params.get("utm_source") || undefined,
          utmMedium: params.get("utm_medium") || undefined,
          utmCampaign: params.get("utm_campaign") || undefined,
        });

        const tTracking = performance.now();
        const trackingDuration = Math.round(tTracking - tTrackingStart);
        const totalDuration = Math.round(tTracking - tStart);

        if (!trackingResult.success) {
          console.warn(
            "[Tracking] Sebagian tracking gagal dicatat, tetapi alur redirect tetap berlanjut:",
            trackingResult.errors
          );
        }

        // Catat metrik durasi funnel ke dataLayer untuk audit
        if (typeof window !== "undefined") {
          const win = window as any;
          win.dataLayer = win.dataLayer || [];
          win.dataLayer.push({
            event: "funnel_performance",
            timing: {
              assignmentMs: assignmentDuration,
              serverRedisMs: res.timing?.redisMs,
              serverTotalMs: res.timing?.totalMs,
              trackingMs: trackingDuration,
              totalUntilRedirectMs: totalDuration,
            },
          });
        }

        // Langsung redirect ke URL WhatsApp sales tanpa delay buatan 500ms
        if (res.whatsappUrl) {
          setNavigated(true);
          window.location.href = res.whatsappUrl;
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoading(false);
        const msg =
          err instanceof Error
            ? err.message
            : "Gagal menghubungkan ke Business Development";
        setError(msg);
      });

    return () => {
      cancelled = true;
    };
  }, [defaultSource, messageMap, retryCount]);

  const isReady = Boolean(assignment) && Boolean(assignment?.whatsappUrl);

  const handleManualClick = () => {
    if (!isReady || !assignment?.whatsappUrl) return;
    setNavigated(true);
    if (typeof window !== "undefined") {
      const win = window as any;
      if (win.dataLayer) {
        win.dataLayer.push({
          event: "whatsapp_manual_click",
          sales_id: assignment.sales.id,
          assignment_id: assignment.assignmentId,
        });
      }
    }
    window.location.href = assignment.whatsappUrl;
  };

  return (
    <div className="landing-page-ads min-h-screen bg-[#FAF9F6] text-brand-black font-sans selection:bg-brand-orange selection:text-white flex flex-col">
      <header className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
              alt="Dreamlab Logo"
              width={160}
              height={52}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16 md:py-20">
        <div className="max-w-lg w-full mx-auto text-center space-y-6 md:space-y-8">
          <div className="w-20 h-20 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-brand-orange" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display">
              {title}
            </h1>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed max-w-md mx-auto font-medium">
              {description}
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {!error && (
              <button
                type="button"
                onClick={handleManualClick}
                disabled={!isReady}
                className="btn-wa inline-flex items-center justify-center gap-3 px-10 py-5 rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:scale-[1.03] active:scale-95 w-full sm:w-auto min-w-[320px]"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>{ctaLabel}</span>
              </button>
            )}

            {loading && (
              <p className="text-xs text-neutral-400 font-medium animate-pulse">
                Menyiapkan tim kami...
              </p>
            )}

            {error && (
              <div className="space-y-4 pt-2">
                <button
                  type="button"
                  onClick={() => setRetryCount((c) => c + 1)}
                  className="btn-wa inline-flex items-center justify-center gap-3 px-10 py-5 rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:scale-[1.03] active:scale-95 text-white min-w-[320px]"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span>Hubungi WhatsApp (Coba Hubungkan Ulang)</span>
                </button>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <p className="text-xs text-neutral-400 font-medium">
                    Sistem round-robin lambat?
                  </p>
                  <button
                    type="button"
                    onClick={() => setRetryCount((c) => c + 1)}
                    className="text-xs text-brand-orange font-bold hover:underline"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            )}

            {isReady && (
              <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs text-neutral-400 font-medium">
                  {navigated
                    ? "Mengarahkan ke WhatsApp..."
                    : "Menghubungkan Anda ke tim kami..."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-gray-100 bg-white/50">
        <div className="container-custom text-center space-y-3">
          <Image
            src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
            alt="Dreamlab Logo"
            width={100}
            height={32}
            className="h-7 w-auto mx-auto object-contain"
          />
          <p className="text-[9px] font-medium text-brand-black/30 tracking-wide uppercase">
            © PT Karya Impian Laboratoris. All Rights Reserved.
          </p>
        </div>
      </footer>

      <style>{`
        .btn-wa {
          display: inline-flex;
          padding: 18px 32px;
          background-color: #25d366;
          color: white;
          border-radius: 50px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.35);
        }
        .btn-wa:hover:not(:disabled) {
          background-color: #1da851;
          box-shadow: 0 6px 28px rgba(37, 211, 102, 0.45);
        }
        .btn-wa:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
