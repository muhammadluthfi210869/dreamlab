/**
 * busdev.ts
 *
 * Konfigurasi resmi dan tunggal untuk seluruh BusDev aktif di Dreamlab.
 * Urutan rotasi round-robin: Annisa -> Diaz -> Jessica -> Annisa.
 * Nomor telepon menggunakan format internasional tanpa tanda '+', spasi, atau tanda hubung.
 */

export interface BusDevItem {
  readonly id: string;
  readonly name: string;
  readonly phone: string;
  readonly active: boolean;
  readonly order: number;
}

export const BUSDEV_LIST: readonly BusDevItem[] = [
  {
    id: "annisa",
    name: "Annisa",
    phone: "6281952417051",
    active: true,
    order: 1,
  },
  {
    id: "diaz",
    name: "Diaz",
    phone: "6287776550657",
    active: true,
    order: 2,
  },
  {
    id: "jessica",
    name: "Jessica",
    phone: "6287712232389",
    active: true,
    order: 3,
  },
] as const;

export type BusDev = (typeof BUSDEV_LIST)[number];

/**
 * Mengambil seluruh BusDev yang berstatus aktif, diurutkan berdasarkan field order.
 */
export function getActiveBusdev(): BusDevItem[] {
  const active = BUSDEV_LIST.filter((sales) => sales.active).sort((a, b) => a.order - b.order);
  if (active.length === 0) {
    // Fallback darurat jika seluruh BusDev tidak sengaja di-set nonaktif
    return [BUSDEV_LIST[0]];
  }
  return active;
}
