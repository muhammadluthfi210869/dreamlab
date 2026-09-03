"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { fireConversion } from "@/lib/tracking";
import {
  convertLeadCapture,
  convertLeadCaptureWithErpBridge,
  BridgeConflictError,
  type RoundRobinAgent,
} from "@/lib/lead-capture";
import { buildWhatsAppUrl } from "@/lib/lead-routing";
import { buildChannelPrefixedMessage, buildWaMessage } from "@/lib/wa-message";
import { normalizeLeadSource } from "@/lib/lead-source";
import { buildTrackingCodeFragment } from "@/lib/tracking-code";

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
  const [bridgeError, setBridgeError] = useState<string | null>(null);
  const [erpTrackingCode, setErpTrackingCode] = useState<string | null>(null);
  const [erpDestinationPhone, setErpDestinationPhone] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Batch 2 — feature flag is public-readonly (allowed per spec §30) so the
  // client can branch. The SECRET stays server-side.
  const erpBridgeEnabled =
    process.env.NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED === "true";

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
    // eventID di-`?event_id=` diteruskan landing CTA (metaads) → reuse utk dedup
    // sama seperti pola Dreampreneur: browser beacon Lead & server sebenarnya
    // satu konversi, bukan duplikat.
    fireConversion(resolvedSource, params.get("event_id") || undefined);

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
  //
  // Batch 2 — ketika NEXT_PUBLIC_DREAMLAB_ERP_BRIDGE_ENABLED=true, panggil
  // versi with-Erp-bridge: VPS assign CS → server-side bridge ke ERP → kalau
  // bridge gagal, JANGAN tampilkan tombol (no untracked WA open).
  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams(window.location.search);
    const resolvedSource = params.get("source") || defaultSource;
    const intentCtx = params.get("ctx");
    const intentMsg = params.get("msg");
    const intentSource = params.get("source") || "";
    const productIntent =
      intentCtx || (messageMap?.[intentSource] ? intentSource : "") || intentMsg || title;

    // Lead attribution journey (Batch 4 §3). The CTA forwarded:
    //   ?from=<source page path>   → bridge → ERP sourcePage
    //   ?cta=<cta identifier>      → bridge → ERP ctaType
    //   ctaClickedAt / thankYouViewedAt stamped HERE (UTC ISO) — both
    //   recorded against the same journey, not the CTA click which lives
    //   on the source page.
    const fromParam = params.get("from") || undefined;
    const ctaParam = params.get("cta") || undefined;
    const thankYouViewedAtIso = new Date().toISOString();

    const basePayload = {
      source: normalizeLeadSource(resolvedSource),
      intent: productIntent,
      pageUrl: window.location.href,
      pageTitle: document.title,
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      sourcePage: fromParam,
      ctaType: ctaParam,
      thankYouViewedAt: thankYouViewedAtIso,
    };

    const run = erpBridgeEnabled
      ? convertLeadCaptureWithErpBridge(basePayload)
      : convertLeadCapture(basePayload);

    run
      .then((r) => {
        if (cancelled) return;
        setAgent(r.agent);
        if (erpBridgeEnabled && r.erpBridge) {
          setErpTrackingCode(r.erpTrackingCode ?? null);
          setErpDestinationPhone(r.waDestinationPhone ?? null);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        // Batch 2: pada mode bridge, error = JANGAN buka WA. Tampilkan pesan.
        if (erpBridgeEnabled) {
          if (err instanceof BridgeConflictError) {
            setBridgeError("IDEMPOTENCY_CONFLICT");
          } else {
            setBridgeError("BRIDGE_FAILED");
          }
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSource, messageMap, title, erpBridgeEnabled]);

  const redirectToWhatsApp = useCallback(async () => {
    if (!agent || navigated) return;
    if (erpBridgeEnabled && (!erpTrackingCode || !erpDestinationPhone)) return;
    setNavigated(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Lead attribution journey (Batch 4 §3): fire-and-forget WA click
    // recording. Self QR will later bind this journey to the inbound
    // chat by matching [Kode: <erpTrackingCode>] in the message body.
    // ERP_BRIDGE_URL is server-only — use the VPS /whatsapp-click route
    // on the website side OR direct ERP public route. We hit the ERP
    // public route when known; fall back silently if not configured.
    if (erpTrackingCode) {
      try {
        const erpBase = (process as any)?.env?.NEXT_PUBLIC_ERP_BASE_URL;
        if (erpBase) {
          fetch(`${String(erpBase).replace(/\/+$/, '')}/lead-capture/whatsapp-click/${encodeURIComponent(erpTrackingCode)}`, {
            method: 'POST',
            cache: 'no-store',
          }).catch(() => { /* fire-and-forget */ });
        }
      } catch {
        // never block redirect
      }
    }

    // Batch 2: pesan WhatsApp HARUS memuat [Kode: <ERP trackingCode>] supaya
    // inbound Wablas bisa match ke lead yang sama.
    const baseMessage = erpBridgeEnabled && erpTrackingCode
      ? `${resolvedMessage}\n\n${buildTrackingCodeFragment(erpTrackingCode)}`
      : resolvedMessage;
    const destinationPhone = erpBridgeEnabled && erpDestinationPhone
      ? erpDestinationPhone
      : agent.phoneNumber;

    const url = buildWhatsAppUrl(destinationPhone, baseMessage);
    window.location.href = url;
  }, [
    agent,
    navigated,
    resolvedMessage,
    erpBridgeEnabled,
    erpTrackingCode,
    erpDestinationPhone,
  ]);

  useEffect(() => {
    if (!agent || navigated) return;
    // Batch 2 — when ERP bridge is enabled, gate the auto-redirect on the
    // ERP canonical tracking code + destination having landed. Otherwise
    // we may open WhatsApp without [Kode: ...] in the message and the
    // inbound Wablas match would fail. Spec §19.
    if (erpBridgeEnabled && (!erpTrackingCode || !erpDestinationPhone)) return;

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
  }, [
    agent,
    navigated,
    redirectToWhatsApp,
    erpBridgeEnabled,
    erpTrackingCode,
    erpDestinationPhone,
  ]);

  const isReady = Boolean(agent) && !navigated
    && (!erpBridgeEnabled || Boolean(erpTrackingCode && erpDestinationPhone));

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
            {bridgeError ? (
              // Batch 2: bridge failure — generic Indonesian retry message,
              // NO fallback to legacy untracked WA URL.
              <p
                role="alert"
                className="text-sm text-neutral-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3"
              >
                WhatsApp belum dapat dibuka. Silakan coba lagi.
              </p>
            ) : (
              <button
                type="button"
                onClick={redirectToWhatsApp}
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
