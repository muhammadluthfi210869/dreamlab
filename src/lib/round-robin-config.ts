/**
 * round-robin-config.ts
 *
 * Meneruskan konfigurasi resmi dari BUSDEV_LIST (src/lib/busdev.ts).
 * Menjaga kompatibilitas ke fungsi-fungsi sistem dan script verifikasi.
 */

import { BUSDEV_LIST, getActiveBusdev } from './busdev';

export interface Agent {
  id: string;
  phone: string;
  name?: string;
  active: boolean;
}

export const AGENTS: Agent[] = BUSDEV_LIST.map((b) => ({
  id: b.id,
  phone: b.phone,
  name: b.name,
  active: b.active,
}));

export function getActiveAgents(): Agent[] {
  return getActiveBusdev().map((b) => ({
    id: b.id,
    phone: b.phone,
    name: b.name,
    active: b.active,
  }));
}

/**
 * Fallback darurat server-side.
 *
 * `seed` (eventId / visitorId) → pilihan deterministik via hash hex, sehingga
 * pembagian merata antar instance serverless TANPA perlu state bersama
 * (counter in-process lama tidak dibagikan antar instance). Tanpa seed,
 * tetap pakai rotasi counter lokal sebagai pilihan terakhir.
 */
let _fbCounter = 0;
export function pickEmergencyFallbackAgent(seed?: string | null): Agent {
  const active = getActiveAgents();
  if (active.length > 0) {
    let idx: number;
    if (seed) {
      const hex = seed.replace(/[^0-9a-fA-F]/g, '').slice(0, 8) || '0';
      idx = parseInt(hex, 16) % active.length;
    } else {
      idx = _fbCounter % active.length;
      _fbCounter = (_fbCounter + 1) >>> 0;
    }
    return active[idx];
  }

  return {
    id: BUSDEV_LIST[0].id,
    name: BUSDEV_LIST[0].name,
    phone: BUSDEV_LIST[0].phone,
    active: true,
  };
}
