"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { fireConversion } from "@/lib/tracking";
import { convertLeadCapture, type RoundRobinAgent } from "@/lib/lead-capture";
import { buildWhatsAppUrl } from "@/lib/lead-routing";
import { buildChannelPrefixedMessage, buildWaMessage } from "@/lib/wa-message";
import { normalizeLeadSource } from "@/lib/lead-source";

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
  message,
  messageMap,
  channelLabel,
  ctaLabel = "KONSULTASI BRAND ANDA SEKARANG",
}: ThankYouRoundRobinProps) {
  const [source, setSource] = useState(defaultSource);
  const [agent, setAgent] = useState<RoundRobinAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [navigated, setNavigated] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pesan trigger per channel (dari git sebelumnya), contoh:
  // "Hi Dreamlab saya mengetahui dari Google saya ingin konsultasi..."
  // messageMap untuk source spesifik (mis. meta-parfum, meta-skincare).
  // Fallback buildWaMessage ikut channel hasil resolve (source state).
  //
  // CTA (floating/button) bisa mengirim:
  //  - ?msg= → custom message lengkap, di-prefix channel otomatis
  //  - ?ctx= → konteks produk utk buildWaMessage (mis. "produk parfum")
  const qs =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const qMsg = qs.get("msg");
  const qCtx = qs.get("ctx");
  // Urutan prioritas pesan:
  //  1. ?msg=  → custom message dari CTA (artikel/brief form), di-prefix channel
  //  2. messageMap → pesan produk-spesifik (mis. meta-parfum dari landing CTA)
  //  3. ?ctx=  → konteks produk dari floating button (mis. "produk skincare")
  //  4. message prop / generic
  const resolvedMessage = qMsg
    ? buildChannelPrefixedMessage(qMsg, source, channelLabel)
    : messageMap?.[source]
      ? messageMap[source]
      : qCtx
        ? buildWaMessage(qCtx, source, channelLabel)
        : message || buildWaMessage("produk kosmetik", source, channelLabel);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resolvedSource = params.get("source") || defaultSource;

    setSource(resolvedSource);
    fireConversion(resolvedSource);

    // Google Ads conversion hanya untuk channel google-ads (jangan polusi data
    // konversi Ads dari traffic organik / medsos / meta). gclid terbaca otomatis
    // oleh gtag dari URL thankyou yang sudah meneruskan param gclid.
    if (normalizeLeadSource(resolvedSource) === 'google-ads' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', { send_to: 'AW-10940853039/hTv7CJOs-OwaEK_WgOEo' });
    }
  }, [defaultSource]);

  // SATU panggilan (POST /api/lead-capture/convert): assign CS (sticky/rotasi)
  // + simpan lead + tracking code, langsung sekaligus. Alur ini menggantikan
  // dua langkah lama (getNextRoundRobinAgent lalu trackLead) → latency jauh
  // lebih rendah. Kalau server/DB gagal, convertLeadCapture otomatis pakai
  // fallback lokal (CS + kode LOCAL-...), jadi tombol tetap aktif.
  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams(window.location.search);
    const resolvedSource = params.get("source") || defaultSource;
    const intentCtx = params.get("ctx");
    const intentMsg = params.get("msg");
    const intentSource = params.get("source") || "";
    const productIntent =
      intentCtx || (messageMap?.[intentSource] ? intentSource : "") || intentMsg || title;

    convertLeadCapture({
      source: normalizeLeadSource(resolvedSource),
      intent: productIntent,
      pageUrl: window.location.href,
      pageTitle: document.title,
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
    })
      .then((r) => {
        if (cancelled) return;
        setAgent(r.agent);
        setTrackingCode(r.trackingCode);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSource, messageMap, title]);

  const redirectToWhatsApp = useCallback(async () => {
    if (!agent || navigated) return;
    setNavigated(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // trackingCode diisi bersamaan dengan agent oleh convertLeadCapture, jadi
    // sudah tersedia saat redirect (400ms kemudian). "LOCAL" hanya jaga-jaga.
    const code = trackingCode || "LOCAL";

    const url = buildWhatsAppUrl(
      agent.phoneNumber,
      `${resolvedMessage}\n\n[Kode: ${code}]`
    );
    window.location.href = url;
  }, [agent, navigated, trackingCode, resolvedMessage]);

  useEffect(() => {
    if (!agent || navigated) return;

    // Redirect cepat (400ms) setelah agent siap — bukan 1 detik. Kalau tracking
    // code belum sempat terisi, redirectToWhatsApp tetap meng-await promise
    // trackLead (bounded oleh timeout client) sehingga kode DL-... selalu masuk
    // ke pesan WA tanpa menahan user terlalu lama.
    timerRef.current = setTimeout(() => {
      redirectToWhatsApp();
    }, 400);

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
              <span>{ctaLabel}</span>
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
