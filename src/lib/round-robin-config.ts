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
 * Fallback darurat server-side
 */
let _fbCounter = 0;
export function pickEmergencyFallbackAgent(): Agent {
  const active = getActiveAgents();
  if (active.length > 0) {
    const picked = active[_fbCounter % active.length];
    _fbCounter = (_fbCounter + 1) >>> 0;
    return picked;
  }

  return {
    id: BUSDEV_LIST[0].id,
    name: BUSDEV_LIST[0].name,
    phone: BUSDEV_LIST[0].phone,
    active: true,
  };
}
