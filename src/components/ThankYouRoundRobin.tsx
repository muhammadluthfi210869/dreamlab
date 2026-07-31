"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { fireConversion } from "@/lib/tracking";
import { getNextRoundRobinAgent, trackLead, type RoundRobinAgent } from "@/lib/lead-capture";
import { buildWhatsAppUrl } from "@/lib/lead-routing";
import { buildWaMessage } from "@/lib/wa-message";

type ThankYouRoundRobinProps = {
  defaultSource: string;
  title: string;
  description: string;
  message?: string;
  messageMap?: Record<string, string>;
};

export function ThankYouRoundRobin({
  defaultSource,
  title,
  description,
  message,
  messageMap,
}: ThankYouRoundRobinProps) {
  const [source, setSource] = useState(defaultSource);
  const [agent, setAgent] = useState<RoundRobinAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [navigated, setNavigated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pesan trigger per channel (dari git sebelumnya), contoh:
  // "Hi Dreamlab saya mengetahui dari Google saya ingin konsultasi..."
  // messageMap untuk source spesifik (mis. meta-parfum, meta-skincare).
  const resolvedMessage =
    messageMap?.[source] || message || buildWaMessage("produk kosmetik");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resolvedSource = params.get("source") || defaultSource;

    setSource(resolvedSource);
    fireConversion(resolvedSource);

    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', { send_to: 'AW-10940853039/hTv7CJOs-OwaEK_WgOEo' });
    }
  }, [defaultSource]);

  // Satu sumber assignment: PostgreSQL (sticky) — 1 visitor = 1 CS
  useEffect(() => {
    let cancelled = false;
    getNextRoundRobinAgent()
      .then((a) => {
        if (!cancelled) {
          setAgent(a);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const redirectToWhatsApp = useCallback(() => {
    if (!agent || navigated) return;
    setNavigated(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Catat lead ke DB (fire-and-forget) dengan source channel yang rapi
    const params = new URLSearchParams(window.location.search);
    trackLead({
      source,
      intent: title,
      pageUrl: window.location.href,
      pageTitle: document.title,
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
      assignedName: agent.name,
      assignedPhone: agent.phoneNumber,
    }).catch(() => {});

    const url = buildWhatsAppUrl(agent.phoneNumber, resolvedMessage);
    window.location.href = url;
  }, [agent, navigated, source, title, resolvedMessage]);

  useEffect(() => {
    if (!agent || navigated) return;

    timerRef.current = setTimeout(() => {
      redirectToWhatsApp();
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [agent, navigated, redirectToWhatsApp]);

  const isReady = Boolean(agent) && !navigated;

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
            <button
              type="button"
              onClick={redirectToWhatsApp}
              disabled={!isReady}
              className="btn-wa inline-flex items-center justify-center gap-3 px-10 py-5 rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg hover:scale-[1.03] active:scale-95 w-full sm:w-auto min-w-[320px]"
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              <span>KONSULTASI BRAND ANDA SEKARANG</span>
            </button>

            {loading && (
              <p className="text-xs text-neutral-400 font-medium animate-pulse">
                Menyiapkan tim kami...
              </p>
            )}

            {isReady && (
              <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs text-neutral-400 font-medium">
                  Menghubungkan Anda ke tim kami...
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
