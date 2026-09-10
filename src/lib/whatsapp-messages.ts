/**
 * whatsapp-messages.ts
 *
 * Pemetaan pesan WhatsApp berdasarkan channel/source dan produk.
 */

export const WHATSAPP_MESSAGES: Record<string, string> = {
  "meta-parfum":
    "Halo Dreamlab, saya melihat iklan Meta Ads parfum dan ingin konsultasi membuat brand parfum. Bisa dibantu?",

  "meta-skincare":
    "Halo Dreamlab, saya melihat iklan Meta Ads skincare dan ingin konsultasi membuat brand skincare. Bisa dibantu?",

  "meta-haircare":
    "Halo Dreamlab, saya melihat iklan Meta Ads haircare dan ingin konsultasi membuat brand haircare. Bisa dibantu?",

  "meta-deodorant":
    "Halo Dreamlab, saya melihat iklan Meta Ads deodorant dan ingin konsultasi membuat brand deodorant. Bisa dibantu?",

  "meta-babycare":
    "Halo Dreamlab, saya melihat iklan Meta Ads baby care dan ingin konsultasi membuat brand baby care. Bisa dibantu?",

  "google-ads":
    "Halo Dreamlab, saya mengetahui Dreamlab dari Google Ads dan ingin konsultasi mengenai brand saya. Bisa dibantu?",

  "social-media":
    "Halo Dreamlab, saya mengetahui Dreamlab dari media sosial dan ingin konsultasi produk lebih lanjut.",

  "google-organic":
    "Halo Dreamlab, saya menemukan Dreamlab melalui Google dan ingin konsultasi mengenai brand saya. Bisa dibantu?",

  default:
    "Halo Dreamlab, saya ingin konsultasi untuk membuat brand produk saya. Bisa dibantu?",
};

export function getWhatsAppMessage(key?: string | null): string {
  if (key && WHATSAPP_MESSAGES[key]) {
    return WHATSAPP_MESSAGES[key];
  }
  return WHATSAPP_MESSAGES.default;
}

export function buildWhatsAppLeadUrl(phone: string, text: string): string {
  let cleaned = (phone ?? '').replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}
