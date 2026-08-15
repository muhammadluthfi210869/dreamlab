"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import {
  convertLeadCapture,
  type RoundRobinAgent,
} from "@/lib/lead-capture";
import { buildWhatsAppUrl } from "@/lib/lead-routing";

/**
 * Thank-you page eksklusif funnel Google Ads — Promo Kemerdekaan.
 *
 * Alur:
 * 1. Validasi source traffic (gclid/gbraid/wbraid, atau utm_source=google,
 *    atau utm_medium=cpc + sumber Google).
 * 2. Simpan atribusi (sessionStorage) — di-set landing page lalu diteruskan.
 * 3. Ambil nomor WA via sistem distribusi lead resmi (round-robin lead-capture).
 * 4. Konversi Google Ads dikirim HANYA bila source Google Ads valid
 *    + param `intent=whatsapp` + belum pernah terkirim (sessionStorage).
 *    Tanpa fbq / Meta Pixel di halaman ini.
 * 5. Tombol manual membatalkan auto-redirect (tipe-duluan guard navigasi).
 */

const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-10940853039";
const GOOGLE_ADS_WHATSAPP_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL || "hTv7CJOs-OwaEK_WgOEo";
const CONVERSION_SEND_TO = `${GOOGLE_ADS_ID}/${GOOGLE_ADS_WHATSAPP_LABEL}`;

const DEDUPE_KEY = "promo_kemerdekaan_googleads_conversion_sent";
const ATTRIBUTION_KEY = "promo_kemerdekaan_googleads_attribution";
const REDIRECT_DELAY_MS = 1800;

const ATTR_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "ttclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "campaign_id",
  "adgroup_id",
  "creative",
  "keyword",
  "matchtype",
  "device",
  "network",
] as const;

const BASE_MESSAGE =
  "Halo Dreamlab, saya tertarik dengan Promo Kemerdekaan Dreamlab. Saya ingin konsultasi dan mengetahui detail promo serta pilihan produk yang tersedia.";

/** Tolak nilai palsu/kosong (undefined, null, placeholder gclid=gclid, dll). */
function isValidValue(key: string, value: string | null): string | null {
  if (!value) return null;
  const v = value.trim();
  if (!v || v === "undefined" || v === "null") return null;
  if (v.toLowerCase() === key.toLowerCase()) return null;
  if (v.length <= 2) return null;
  return v;
}

/** Deteksi traffic Google Ads (kondisi salah satu harus terpenuhi). */
function isGoogleAdsSource(attr: Record<string, string>): boolean {
  const hasAdsId = Boolean(
    isValidValue("gclid", attr.gclid ?? null) ||
      isValidValue("gbraid", attr.gbraid ?? null) ||
      isValidValue("wbraid", attr.wbraid ?? null)
  );
  if (hasAdsId) return true;

  const source = (attr.utm_source ?? "").toLowerCase();
  const medium = (attr.utm_medium ?? "").toLowerCase();
  const isGoogleUtm =
    source === "google" ||
    source === "googleads" ||
    source === "google_ads" ||
    source.includes("google");

  if (source === "google") return true;
  if (medium === "cpc" && isGoogleUtm) return true;
  return false;
}

function resolveChannel(attr: Record<string, string>): string {
  if (isGoogleAdsSource(attr)) return "google-ads";
  const source = (attr.utm_source ?? "").toLowerCase();
  if (
    source.includes("meta") ||
    source.includes("facebook") ||
    source.includes("instagram")
  ) {
    return "metaads";
  }
  if (source.includes("tiktok") || source.includes("medsos")) return "medsos";
  return "organic";
}

function sourceLineFor(channel: string): string {
  if (channel === "google-ads") return "Google Ads — Promo Kemerdekaan";
  if (channel === "metaads") return "Meta Ads — Promo Kemerdekaan";
  if (channel === "medsos") return "Media Sosial — Promo Kemerdekaan";
  return "Google — Promo Kemerdekaan";
}

export default function PromoKemerdekaanThankYouGoogleAds() {
  const [agent, setAgent] = useState<RoundRobinAgent | null>(null);
  const [ready, setReady] = useState(false);
  const navigatedRef = useRef(false);
  const waUrlRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelRef = useRef("google-ads");

  const openWhatsApp = useCallback(() => {
    if (navigatedRef.current || !waUrlRef.current) return;
    navigatedRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    window.location.href = waUrlRef.current;
  }, []);

  const handleManualClick = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    openWhatsApp();
  }, [openWhatsApp]);

  // Pastikan tag gtag AW (conversion) tersedia — tanpa mengubah global lain.
  const ensureGoogleAdsTag = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as Record<string, unknown>;
    (w as any).dataLayer = (w as any).dataLayer || [];
    if (typeof (w as any).gtag !== "function") {
      (w as any).gtag = function () {
        (w as any).dataLayer.push(arguments);
      };
    }
    if (!document.getElementById(`gads-${GOOGLE_ADS_ID}`)) {
      const s = document.createElement("script");
      s.id = `gads-${GOOGLE_ADS_ID}`;
      s.async = true;
      s.defer = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
      document.head.appendChild(s);
      s.onload = () => {
        try {
          (w as any).gtag("config", GOOGLE_ADS_ID, {
            linker: { domains: ["dreamlab.id"] },
          });
        } catch {
          // non-kritis
        }
      };
    }
  }, []);

  // Kirim konversi Google Ads + GA4 + dataLayer. Sekali per sesi (dedup
  // sessionStorage). Tanpa Meta Pixel / tanpa event purchase.
  const fireGoogleAdsConversion = useCallback(
    (onSent: () => void) => {
      if (typeof sessionStorage === "undefined") return;
      if (sessionStorage.getItem(DEDUPE_KEY) === "1") return;
      sessionStorage.setItem(DEDUPE_KEY, "1");

      ensureGoogleAdsTag();
      const w = window as any;
      if (typeof w.gtag === "function") {
        w.gtag("event", "conversion", {
          send_to: CONVERSION_SEND_TO,
          event_callback: onSent,
        });
        w.gtag("event", "generate_lead", {
          campaign_name: "promo_kemerdekaan",
          lead_source: "google_ads",
          contact_method: "whatsapp",
        });
      }
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: "promo_kemerdekaan_whatsapp",
        campaign: "promo_kemerdekaan",
        source: "google_ads",
        contact_method: "whatsapp",
      });
    },
    [ensureGoogleAdsTag]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    // 1) Kumpulkan atribusi: sessionStorage (dari landing page) + URL saat ini.
    const query = new URLSearchParams(window.location.search);
    const attr: Record<string, string> = {};
    try {
      const stored = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}");
      if (stored && typeof stored === "object") {
        for (const key of ATTR_PARAMS) {
          const v = isValidValue(key, String((stored as Record<string, string>)[key] ?? ""));
          if (v) attr[key] = v;
        }
      }
    } catch {
      // sessionStorage korup — lanjut dari URL saja
    }
    for (const key of ATTR_PARAMS) {
      const v = isValidValue(key, query.get(key));
      if (v) attr[key] = v;
    }
    try {
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attr));
    } catch {
      // non-kritis
    }

    // 2) Validasi source.
    const isGoogleAds = isGoogleAdsSource(attr);
    const channel = isGoogleAds ? "google-ads" : resolveChannel(attr);
    channelRef.current = channel;
    const intent = query.get("intent");

    // 3) Ambil nomor WA resmi (round-robin lead distribution Dreamlab).
    convertLeadCapture({
      source: channel,
      intent: "promo kemerdekaan google ads",
      pageUrl: window.location.href,
      pageTitle: document.title,
      utmSource: attr.utm_source,
      utmMedium: attr.utm_medium,
      utmCampaign: attr.utm_campaign,
    })
      .then((r) => {
        if (cancelled) return;
        const message = `${BASE_MESSAGE}\n\nSumber: ${sourceLineFor(channel)}\n\n[Kode: ${r.trackingCode}]`;
        waUrlRef.current = buildWhatsAppUrl(r.agent.phoneNumber, message);
        setAgent(r.agent);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setReady(true);
      });

    // 4) Konversi Google Ads — hanya bila source Google Ads + intent valid.
    if (isGoogleAds && intent === "whatsapp") {
      ensureGoogleAdsTag();
      const t = setTimeout(() => {
        if (cancelled) return;
        fireGoogleAdsConversion(openWhatsApp);
      }, 250);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 5) Auto-redirect ~1.8s setelah status siap (WA terbuka max sekali).
  useEffect(() => {
    if (!ready) return;
    timerRef.current = setTimeout(() => {
      openWhatsApp();
    }, REDIRECT_DELAY_MS);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [ready, openWhatsApp]);

  return (
    <div className="promo-ga-thankyou min-h-screen bg-white text-brand-black font-sans overflow-x-hidden relative">
      {/* Subtle red-white background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 8% 0%, rgba(224,52,42,0.06), transparent 40%), radial-gradient(circle at 96% 90%, rgba(245,130,31,0.07), transparent 42%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-2"
          style={{
            background:
              "linear-gradient(90deg, #e0342a 0%, #f5821f 45%, #ffffff 50%, #f5821f 55%, #e0342a 100%)",
          }}
        />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Card */}
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_24px_60px_rgba(11,37,64,0.08)] p-6 sm:p-8 text-center space-y-6">
            <div className="flex justify-center">
              <Image
                src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
                alt="Dreamlab Maklon Kosmetik"
                width={160}
                height={52}
                priority
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-orange/25 bg-brand-orange/5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-black tracking-[0.18em] text-brand-orange uppercase">
                Promo Kemerdekaan Dreamlab
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-[26px] sm:text-3xl font-black text-brand-black tracking-tight leading-[1.12] uppercase font-display">
                Sebentar, Kami Sedang{" "}
                <span className="text-[#e0342a]">Menghubungkanmu</span> ke Tim
                Dreamlab
              </h1>
              <p className="text-sm sm:text-[15px] text-neutral-500 leading-relaxed max-w-sm mx-auto font-medium">
                Kamu akan diarahkan ke WhatsApp untuk berkonsultasi dan
                mendapatkan informasi lengkap mengenai Promo Kemerdekaan
                Dreamlab.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleManualClick}
                disabled={!ready}
                className="w-full inline-flex items-center justify-center gap-3 min-h-[48px] sm:min-h-[56px] px-6 rounded-[50px] font-extrabold text-sm sm:text-base uppercase tracking-wider text-white transition-all duration-300 shadow-lg enabled:hover:scale-[1.02] enabled:active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#25d366", boxShadow: "0 8px 24px rgba(37,211,102,0.35)" }}
              >
                {ready ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
                )}
                <span>Lanjut Konsultasi via WhatsApp</span>
              </button>

              {!ready ? (
                <p className="text-xs text-neutral-400 font-medium animate-pulse">
                  Menyiapkan WhatsApp konsultasi...
                </p>
              ) : (
                <p className="text-xs text-neutral-400 font-medium">
                  WhatsApp tidak terbuka otomatis? Tekan tombol di atas.
                </p>
              )}
            </div>

            <div className="pt-1">
              <Link
                href="/promo-kemerdekaan/"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-orange hover:text-brand-black transition-colors"
              >
                <span aria-hidden="true">←</span> Kembali ke halaman promo
              </Link>
            </div>
          </div>

          <footer className="mt-8 text-center space-y-1">
            <Image
              src="/assets/images/cropped-Logo-Dreamlab-Maklon-Kosmetik-.webp"
              alt="Dreamlab"
              width={90}
              height={26}
              className="h-5 w-auto mx-auto object-contain opacity-70"
            />
            <p className="text-[9px] font-medium text-brand-black/35 uppercase tracking-wide">
              © PT Karya Impian Laboratoris. All Rights Reserved.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}