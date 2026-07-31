/**
 * wa-message.ts
 *
 * SATU-SATUNYA sumber template pesan WA untuk SEMUA tombol/trigger.
 * Tujuan: pesan bersih & konsisten (tanpa tracking code, tanpa teks
 * per-channel di depan customer). Atribusi channel disimpan di DB
 * (kolom `leads.source` + utm_*), bukan di pesan.
 */

/** Konteks produk berdasarkan URL halaman (era lama yang disukai user). */
export function getPageContext(url?: string): string {
  if (!url) return 'produk Dreamlab';
  if (url.includes('/maklon/')) return 'jasa maklon kosmetik';
  if (url.includes('/produk/parfum')) return 'produk parfum';
  if (url.includes('/produk/hair')) return 'produk haircare';
  if (url.includes('/produk/skin') || url.includes('/skincare')) return 'produk skincare';
  if (url.includes('/produk/')) return 'produk kosmetik';
  if (url.includes('/category/')) return 'informasi maklon';
  if (url.includes('/about-us')) return 'profil perusahaan';
  if (url.includes('/services')) return 'layanan maklon';
  return 'produk Dreamlab';
}

/** Pesan WA standar yang tampil di chat customer. */
export function buildWaMessage(context?: string): string {
  const c = (context || 'produk Dreamlab').trim();
  return `Halo Dreamlab! Saya tertarik dengan ${c}. Bisa dibantu?`;
}
