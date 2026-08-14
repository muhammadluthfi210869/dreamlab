export const DREAMPRENEUR_WHATSAPP_NUMBER = "62881027240339";

const META_PIXEL_ID = "1178862663474674";

export const DREAMPRENEUR_WHATSAPP_MESSAGE =
  "Halo Dreamlab, saya ingin mendaftar Dreampreneur Batch 2. Mohon informasi selanjutnya mengenai pembayaran dan detail acaranya.";

export const DREAMPRENEUR_WHATSAPP_URL =
  `https://wa.me/${DREAMPRENEUR_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    DREAMPRENEUR_WHATSAPP_MESSAGE
  )}`;

const CONTENT_NAME = "Dreampreneur Batch 2";
const CAMPAIGN = "dreampreneur-batch-2";

const w = () =>
  window as unknown as {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void };
  };

function pushDataEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  (w().dataLayer = w().dataLayer || []).push({
    event: name,
    page: window.location.pathname,
    ...params,
  });
}

function gtagEvent(name: string, params: Record<string, unknown>) {
  const gtag = w().gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}

function fbqEvent(name: string, params?: Record<string, unknown>) {
  const fbq = w().fbq;
  if (typeof fbq === "function") fbq("track", name, params);
}

function fbqCustom(name: string, params: Record<string, unknown>) {
  const fbq = w().fbq;
  if (typeof fbq === "function") fbq("trackCustom", name, params);
}

function ttqEvent(name: string, params: Record<string, unknown>) {
  const ttq = w().ttq;
  if (ttq && typeof ttq.track === "function") ttq.track(name, params);
}

/**
 * Pastikan queue Meta Pixel (window.fbq) langsung tersedia begitu landing
 * page terbuka — tanpa menunggu scroll atau interaksi pertama — sehingga
 * event ViewContent/Lead tidak pernah drop. Idempotent: kalau PixelsOnInteraction
 * sudah/config sedang memuat, fungsi ini tidak memuat script dobel.
 */
export function ensureMetaPixelQueue() {
  if (typeof window === "undefined") return;
  const win = window as unknown as Record<string, unknown>;
  if (win.fbq) return;

  const fbq = (...args: unknown[]) => {
    const self = win.fbq as unknown as {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[][];
    };
    if (self.callMethod) self.callMethod.apply(window, args);
    else self.queue?.push(args);
  };

  win.fbq = fbq;
  win._fbq = fbq;
  (fbq as unknown as Record<string, unknown>).push = fbq;
  (fbq as unknown as Record<string, unknown>).loaded = true;
  (fbq as unknown as Record<string, unknown>).version = "2.0";
  (fbq as unknown as Record<string, unknown>).queue = [];

  const s = document.createElement("script");
  s.async = true;
  s.defer = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  s.onload = () => {
    (win.fbq as (...args: unknown[]) => void)("init", META_PIXEL_ID);
    (win.fbq as (...args: unknown[]) => void)("track", "PageView");
  };
}

/** ViewContent — dikirim sekali saat halaman dibuka. */
export function trackDreampreneurView() {
  if (typeof window === "undefined") return;
  const base = { campaign: CAMPAIGN, content_name: CONTENT_NAME };
  pushDataEvent("view_content", base);
  gtagEvent("view_content", base);
  fbqEvent("ViewContent", { ...base, content_category: "Event Registration" });
  ttqEvent("view_content", base);
}

let lastWhatsAppClickAt = 0;

/**
 * SATU-SATUNYA helper tracking klik WhatsApp Dreampreneur. Dipakai seluruh CTA
 * (hero, sticky, pricing, final, floating) supaya konversi tidak terkirim dobel
 * akibat rerender/bubbling/klik ganda. Terdapat guard jeda 1 detik untuk klik
 * berulang dalam waktu singkat. Tidak memanggil AddToCart.
 */
export function trackDreampreneurWhatsAppClick(ctaLabel: string) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastWhatsAppClickAt < 1000) return;
  lastWhatsAppClickAt = now;

  pushDataEvent("generate_lead", {
    campaign: CAMPAIGN,
    content_name: CONTENT_NAME,
    conversion_type: "whatsapp_click",
    cta_label: ctaLabel,
  });
  fbqEvent("Lead", {
    content_name: CONTENT_NAME,
    content_category: "Event Registration",
    campaign: CAMPAIGN,
    conversion_type: "whatsapp_click",
    cta_label: ctaLabel,
  });
  fbqCustom("DreampreneurWhatsAppClick", {
    content_name: CONTENT_NAME,
    campaign: CAMPAIGN,
    cta_label: ctaLabel,
  });
}

/** Klik scroll (mis. Meet Our Mentors) — tanpa event conversion Meta. */
export function trackDreampreneurScroll(label: string) {
  if (typeof window === "undefined") return;
  const base = { campaign: CAMPAIGN, cta_label: label };
  pushDataEvent("cta_click", base);
  gtagEvent("cta_click", base);
  ttqEvent("cta_click", base);
}