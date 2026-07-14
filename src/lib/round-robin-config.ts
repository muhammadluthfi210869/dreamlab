/**

 * round-robin-config.ts

 *

 * SATU-SATUNYA sumber data agent/CS untuk seluruh sistem round-robin.

 * Jangan duplikasi list ini di file lain — kalau perlu tambah/kurangi CS,

 * cukup edit array ini. Tidak perlu reset counter manual karena rotasi

 * dihitung ulang dari `activeAgents` setiap request (lihat roundRobin.ts).

 */

export interface Agent {

  id: string;      // identifier stabil, JANGAN diubah setelah dipakai (dipakai di cookie)

  phone: string;   // format lokal, akan dinormalisasi ke format internasional saat dipakai

  name?: string;

  active: boolean; // set false untuk CS yang cuti/nonaktif tanpa menghapus dari array

}

export const AGENTS: Agent[] = [

  { id: 'cs1', phone: '087712232389', name: 'CS 1', active: true },

  { id: 'cs2', phone: '081952417051', name: 'CS 2', active: true },

  { id: 'cs3', phone: '087776550657', name: 'CS 3', active: true },

  // Tambah CS baru di sini kapan saja, contoh:

  // { id: 'cs4', phone: '08xxxxxxxxxx', name: 'CS 4', active: true },

];

export function getActiveAgents(): Agent[] {

  const active = AGENTS.filter((a) => a.active);

  if (active.length === 0) {

    throw new Error('Tidak ada agent aktif di AGENTS config');

  }

  return active;

}
