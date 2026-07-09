"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { fireConversion } from "@/lib/tracking";
import { useLeadAssignment } from "@/hooks/useLeadAssignment";
import {
  buildWhatsAppUrl,
  createWhatsAppRedirectController,
} from "@/lib/lead-routing";

type ThankYouRoundRobinProps = {
  routeKey: string;
  defaultSource: string;
  title: string;
  description: string;
  message: string;
  messageMap?: Record<string, string>;
  ctaLabels?: [string, string, string];
};

const DEFAULT_CTA_LABELS: [string, string, string] = [
  "Chat Sekarang",
  "Minta Konsultasi",
  "Hubungi Tim",
];

export function ThankYouRoundRobin({
  routeKey,
  defaultSource,
  title,
  description,
  message,
  messageMap,
  ctaLabels = DEFAULT_CTA_LABELS,
}: ThankYouRoundRobinProps) {
  const [source, setSource] = useState(defaultSource);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resolvedSource = params.get("source") || defaultSource;

    setSource(resolvedSource);
    fireConversion(resolvedSource);
  }, [defaultSource]);

  const assignment = useLeadAssignment({
    routeKey,
    source,
  });

  const resolvedMessage = messageMap?.[source] || message;

  const controller = useMemo(
    () =>
      createWhatsAppRedirectController({
        phone: assignment.phone,
        message: resolvedMessage,
      }),
    [assignment.phone, resolvedMessage]
  );

  const navigateToWhatsApp = useCallback(() => {
    const url = controller.click();
    if (!url) return;

    setHasNavigated(true);
    window.location.assign(url);
  }, [controller]);

  const labels = ctaLabels.length === 3 ? ctaLabels : DEFAULT_CTA_LABELS;

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

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full mx-auto text-center space-y-8">
          <div className="w-20 h-20 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-brand-orange" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-black tracking-tight leading-[1.1] uppercase font-display">
              {title}
            </h1>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed max-w-md mx-auto font-medium">
              {description}
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange font-onest">
              Lead masuk ke nomor yang dipilih otomatis secara round robin
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {labels.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={navigateToWhatsApp}
                  className="btn-wa inline-flex items-center justify-center gap-2 px-5 py-4 rounded-[50px] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-lg hover:scale-[1.03] active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500/60 animate-pulse" />
              <span className="text-[10px] text-neutral-400 font-bold tracking-[0.2em] uppercase font-onest">
                {assignment.origin === "api"
                  ? "Nomor aktif siap dihubungi via WhatsApp"
                  : "Nomor cadangan aktif, menunggu assignment terbaru"}
              </span>
              <span className="text-[10px] text-neutral-400 font-bold tracking-[0.2em] uppercase font-onest">
                Sumber: {source}
              </span>
              <span className="text-[10px] text-neutral-400 font-bold tracking-[0.2em] uppercase font-onest">
                Nomor aktif: {assignment.phone}
              </span>
            </div>
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
          padding: 15px 25px;
          background-color: #25d366;
          color: white;
          border-radius: 50px;
          font-weight: bold;
          border: none;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .btn-wa:hover {
          background-color: #1da851;
        }
      `}</style>
    </div>
  );
}
