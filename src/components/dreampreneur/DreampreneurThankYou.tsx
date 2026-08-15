"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import {
  DREAMPRENEUR_WHATSAPP_URL,
  DREAMPRENEUR_LANDING_PATH,
  ensureMetaPixelQueue,
  preconnectWhatsApp,
  trackDreampreneurContact,
} from "@/lib/dreampreneur";

const REDIRECT_DELAY_MS = 700;

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function DreampreneurThankYou() {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    ensureMetaPixelQueue();
    preconnectWhatsApp();
    trackDreampreneurContact();

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      window.location.replace(DREAMPRENEUR_WHATSAPP_URL);
    }, REDIRECT_DELAY_MS);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const cancelAutoRedirect = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-[#250a3d] text-white font-sans overflow-hidden flex items-center justify-center px-4 py-10 relative">
      {/* gradient ambient */}
      <div aria-hidden className="absolute -top-40 -right-40 w-[34rem] h-[34rem] rounded-full bg-[#E11D8F]/40 blur-3xl" />
      <div aria-hidden className="absolute -bottom-48 -left-32 w-[30rem] h-[30rem] rounded-full bg-[#8B5CF6]/40 blur-3xl" />
      <div aria-hidden className="absolute top-1/3 -left-20 w-[20rem] h-[20rem] rounded-full bg-[#C026D3]/25 blur-3xl" />

      <div className="relative w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <Image
            src="/assets/images/cropped-Logo-dreamlab-maklon-kosmetik-1.webp"
            alt="Dreamlab"
            width={56}
            height={56}
            className="w-14 h-14 rounded-2xl bg-white/10 p-2 object-contain mx-auto shadow-lg"
          />
          <p className="mt-3 text-[11px] font-black tracking-[0.3em] text-[#F472B6] uppercase">
            Dreampreneur Batch 2
          </p>
        </div>

        <div className="rounded-[28px] bg-white/[0.07] border border-white/15 backdrop-blur p-7 sm:p-9 shadow-[0_30px_80px_-30px_rgba(139,92,246,0.6)] text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] animate-pulse">
            <WhatsAppIcon className="drop-shadow-md" />
          </div>

          <h1
            className="mt-6 text-[26px] sm:text-[30px] font-black text-white leading-tight [font-family:var(--font-viga),sans-serif]"
          >
            Menghubungkanmu ke Tim Dreampreneur
          </h1>

          <p className="mt-3 text-sm text-white/75 leading-relaxed">
            Tunggu sebentar. Kamu akan diarahkan ke WhatsApp untuk melanjutkan pendaftaran dan
            mendapatkan informasi pembayaran.
          </p>

          <div className="mt-6 rounded-2xl bg-black/20 border border-white/10 p-4 text-left space-y-2.5">
            <p className="flex items-center gap-2.5 text-[13px] font-semibold text-white/85">
              <CalendarDays className="w-4 h-4 text-[#F472B6] shrink-0" />
              29 Agustus 2026
            </p>
            <p className="flex items-center gap-2.5 text-[13px] font-semibold text-white/85">
              <Clock className="w-4 h-4 text-[#F472B6] shrink-0" />
              11.00–17.00 WIB
            </p>
            <p className="flex items-center gap-2.5 text-[13px] font-semibold text-white/85">
              <MapPin className="w-4 h-4 text-[#F472B6] shrink-0" />
              Excotel Design Hotel, Surabaya
            </p>
            <p className="flex items-center gap-2.5 text-[13px] font-semibold text-white/85">
              <span className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="text-[#F9A8D4]">Early Bird Rp189.000</span>
                <span className="text-white/40 line-through ml-2">Rp250.000</span>
              </span>
            </p>
          </div>

          <a
            href={DREAMPRENEUR_WHATSAPP_URL}
            onClick={cancelAutoRedirect}
            className="mt-7 w-full inline-flex items-center justify-center gap-2.5 rounded-[50px] bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-extrabold text-sm sm:text-[15px] uppercase tracking-wider px-6 py-4 shadow-[0_16px_40px_-10px_rgba(37,211,102,0.55)] hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Lanjut ke WhatsApp Sekarang
          </a>

          <p className="mt-3 text-xs text-white/50 leading-relaxed">
            WhatsApp tidak terbuka otomatis? Tekan tombol di atas.
          </p>

          <Link
            href={DREAMPRENEUR_LANDING_PATH}
            className="mt-5 inline-block text-xs font-bold text-[#C4B5FD] underline underline-offset-4 hover:text-white transition-colors"
          >
            Kembali ke halaman Dreampreneur
          </Link>
        </div>

        <p className="mt-5 text-center text-[11px] text-white/40 font-medium">
          Dreamlab · Maklon Kosmetik &amp; Parfum
        </p>
      </div>
    </div>
  );
}