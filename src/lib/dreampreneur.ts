export const DREAMPRENEUR_WHATSAPP_NUMBER = "62881027240339";

const META_PIXEL_ID = "1178862663474674";

export const DREAMPRENEUR_WHATSAPP_MESSAGE =
  "Saya ingin mendaftar Dreampreneur Batch 2. Mohon informasi selanjutnya mengenai pembayaran dan detail acaranya.";

export const DREAMPRENEUR_WHATSAPP_URL =
  `https://wa.me/${DREAMPRENEUR_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    DREAMPRENEUR_WHATSAPP_MESSAGE
  )}`;

export const DREAMPRENEUR_LANDING_PATH = "/dreampreneur-batch-2/";
export const DREAMPRENEUR_THANKYOU_PATH = "/dreampreneur-batch-2/thankyou/";

const CONTENT_NAME = "Dreampreneur Batch 2";
const CAMPAIGN = "dreampreneur-batch-2";
const CAMPAIGN_SNAKE = "dreampreneur_batch_2";
const EVENT_VALUE = 189000;
const EVENT_CURRENCY = "IDR";

/** Parameter atribusi yang diteruskan landing → thank-you (hanya nilai valid). */
const DREAMPRENEUR_ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "fbclid",
  "gclid",
  "ttclid",
] as const;

function isValidAttributionValue(key: string, value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  // Anti placeholder palsu seperti fbclid=fbclid (nilai sama persis nama param).
  if (v.toLowerCase() === key.toLowerCase()) return false;
  if (key === "fbclid" && v.length < 8) return false; // fbclid asli jauh lebih panjang
  return true;
}

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

function fbqEvent(name: string, params?: Record<string, unknown>, options?: Record<string, unknown>) {
  const fbq = w().fbq;
  if (typeof fbq === "function") {
    if (options) fbq("track", name, params, options);
    else fbq("track", name, params);
  }
}

function fbqCustom(name: string, params: Record<string, unknown>, options?: Record<string, unknown>) {
  const fbq = w().fbq;
  if (typeof fbq === "function") {
    if (options) fbq("trackCustom", name, params, options);
    else fbq("trackCustom", name, params);
  }
}

function ttqEvent(name: string, params: Record<string, unknown>) {
  const ttq = w().ttq;
  if (ttq && typeof ttq.track === "function") ttq.track(name, params);
}

/**
 * Pastikan queue Meta Pixel (window.fbq) langsung tersedia begitu halaman
 * terbuka — tanpa menunggu scroll atau interaksi pertama — sehingga event
 * tidak pernah drop. Idempotent: kalau PixelsOnInteraction sudah/config sedang
 * memuat, fungsi ini tidak memuat script dobel.
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

/**
 * Bangun URL thank-you page dengan meneruskan parameter atribusi valid dari
 * query string landing page:
 *   utm_source/medium/campaign/content/term/id, fbclid (valid), gclid, ttclid.
 * Nilai kosong / placeholder (mis. fbclid=fbclid) tidak diikutkan.
 * `eventID` (opsional) ditambahkan sebagai `event_id` untuk dedup eksternal
 * (dipakai thank-you page sbg eventID tetap bila disediakan).
 */
export function buildDreampreneurThankyouUrl(eventID?: string): string {
  if (typeof window === "undefined") return DREAMPRENEUR_THANKYOU_PATH;
  const current = new URLSearchParams(window.location.search);
  const next = new URLSearchParams();
  for (const key of DREAMPRENEUR_ATTRIBUTION_PARAMS) {
    const raw = current.get(key);
    if (raw === null) continue;
    const val = raw.trim();
    if (isValidAttributionValue(key, val)) next.set(key, val);
  }
  if (eventID) next.set("event_id", eventID);
  const qs = next.toString();
  return qs ? `${DREAMPRENEUR_THANKYOU_PATH}?${qs}` : DREAMPRENEUR_THANKYOU_PATH;
}

/** ViewContent — dikirim sekali saat landing page dibuka. */
export function trackDreampreneurView() {
  if (typeof window === "undefined") return;
  const base = { campaign: CAMPAIGN, content_name: CONTENT_NAME };
  pushDataEvent("view_content", base);
  gtagEvent("view_content", base);
  fbqEvent("ViewContent", { ...base, content_category: "Event Registration" });
  ttqEvent("view_content", base);
}

let lastCtaClickAt = 0;

/**
 * Klik CTA daftar di landing page → navigasi ke thank-you. Hanya analytics
 * (dataLayer/GA4/TikTok), TANPA event conversion Meta: Lead/AddToCart/Purchase
 * tidak boleh terkirim di sini — konversi dicatat di thank-you page saat
 * pengguna sampai (event Contact + DreampreneurWhatsAppRedirect).
 */
export function trackDreampreneurCtaClick(ctaLabel: string) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastCtaClickAt < 1000) return;
  lastCtaClickAt = now;

  const base = { campaign: CAMPAIGN, cta_label: ctaLabel };
  pushDataEvent("cta_click", base);
  gtagEvent("cta_click", base);
  ttqEvent("cta_click", base);
}

/** Klik scroll (mis. Meet Our Mentors) — tanpa event conversion Meta. */
export function trackDreampreneurScroll(label: string) {
  if (typeof window === "undefined") return;
  const base = { campaign: CAMPAIGN, cta_label: label };
  pushDataEvent("cta_click", base);
  gtagEvent("cta_click", base);
  ttqEvent("cta_click", base);
}

/**
 * Klik eksplorasi (CTA scroll hero/sticky "Lihat Detail Acara") — analytics
 * saja tanpa event conversion Meta (Lead/Contact/AddToCart/Purchase) dan tanpa
 * redirect ke WhatsApp. Event yang dikirim: dreampreneur_explore_click.
 */
export function trackDreampreneurExplore(label: string) {
  if (typeof window === "undefined") return;
  const base = { campaign: CAMPAIGN, cta_label: label };
  pushDataEvent("dreampreneur_explore_click", base);
  gtagEvent("dreampreneur_explore_click", base);
  ttqEvent("dreampreneur_explore_click", base);
}

const CONTACT_STORAGE_KEY = "dreamlab_dp2_contact_sent";
let lastContactAt = 0;

/**
 * Panasi koneksi ke domain WhatsApp (wa.me / api / web) lebih awal supaya saat
 * redirect ke WA tidak menunggu DNS + TLS lagi. Idempotent per halaman.
 */
export function preconnectWhatsApp() {
  if (typeof window === "undefined") return;
  const win = window as unknown as { __dreamlabDp2WaPreconnect?: boolean };
  if (win.__dreamlabDp2WaPreconnect) return;
  win.__dreamlabDp2WaPreconnect = true;

  const hosts = [
    "https://wa.me",
    "https://api.whatsapp.com",
    "https://web.whatsapp.com",
  ];
  for (const host of hosts) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = host;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    const dns = document.createElement("link");
    dns.rel = "dns-prefetch";
    dns.href = host;
    document.head.appendChild(dns);
  }
}

function makeEventId(): string {
  let id = "dp2_";
  try {
    const uuid = (crypto as { randomUUID?: () => string } | undefined)?.randomUUID?.();
    if (uuid) id += uuid;
    else id += `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  } catch {
    id += `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
  return id;
}

/**
 * Browser events yang DIJALANKAN DI THANK-YOU PAGE — terkirim TEPAT SATU KALI
 * per kunjungan (guard sessionStorage anti-refresh). Halaman thankyou dirender
 * dulu (~700ms) sebelum redirect ke WhatsApp, jadi beacon Meta sempat terflush
 * dan Meta dapat membaca konversi. Tidak memanggil AddToCart / Purchase / Lead.
 *
 * - dataLayer: dreampreneur_whatsapp_redirect
 * - Meta standard: Contact (dengan eventID utk dedup)
 * - Meta custom:   DreampreneurWhatsAppRedirect (dengan eventID)
 * eventID diambil dari `?event_id=` (diteruskan CTA landing utk dedup CAPI)
 * atau digenerate baru.
 */
export function trackDreampreneurContact() {
  if (typeof window === "undefined") return;
  ensureMetaPixelQueue();

  try {
    if (window.sessionStorage.getItem(CONTACT_STORAGE_KEY)) return;
    window.sessionStorage.setItem(CONTACT_STORAGE_KEY, "1");
  } catch {
    // sessionStorage tidak tersedia (private mode) → fallback guard in-memory
  }
  const now = Date.now();
  if (now - lastContactAt < 2000) return;
  lastContactAt = now;

  const urlEventId = new URLSearchParams(window.location.search).get("event_id");
  const eventID = (urlEventId && urlEventId.trim()) || makeEventId();
  const options = { eventID };

  pushDataEvent("dreampreneur_whatsapp_redirect", {
    campaign: CAMPAIGN_SNAKE,
    destination: "whatsapp",
    value: EVENT_VALUE,
    currency: EVENT_CURRENCY,
  });
  fbqEvent(
    "Contact",
    {
      content_name: CONTENT_NAME,
      content_category: "Event Registration",
      value: EVENT_VALUE,
      currency: EVENT_CURRENCY,
    },
    options
  );
  fbqCustom(
    "DreampreneurWhatsAppRedirect",
    {
      destination: "whatsapp",
      campaign: CAMPAIGN_SNAKE,
    },
    options
  );
}

/**
 * Klik Checkout ke Scalev.
 * Event: dreampreneur_checkout_click
 * Parameters:
 *   event: "Dreampreneur Batch 2"
 *   price: 189000
 *   currency: "IDR"
 *   destination: "Scalev"
 */
export function trackDreampreneurCheckoutClick() {
  if (typeof window === "undefined") return;

  const base = {
    campaign: CAMPAIGN,
    dreampreneur_event: "Dreampreneur Batch 2",
    price: EVENT_VALUE,
    currency: EVENT_CURRENCY,
    destination: "Scalev",
  };

  pushDataEvent("dreampreneur_checkout_click", base);
  gtagEvent("dreampreneur_checkout_click", base);
  
  fbqEvent("InitiateCheckout", {
    content_name: CONTENT_NAME,
    content_category: "Event Registration",
    value: EVENT_VALUE,
    currency: EVENT_CURRENCY,
  });

  ttqEvent("InitiateCheckout", {
    value: EVENT_VALUE,
    currency: EVENT_CURRENCY,
  });
}