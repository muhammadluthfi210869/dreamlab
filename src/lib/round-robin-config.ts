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

/**
 * Fallback darurat dipakai lead-assignment.ts kalau getNextAgent() (Redis)
 * gagal DAN getActiveAgents() juga gagal (semua agent kebetulan di-set
 * active: false — biasanya salah konfigurasi, bukan disengaja).
 *
 * Daripada funnel WA mati total (500 error) karena Error di atas tidak
 * pernah di-catch dua kali, fungsi ini SELALU mengembalikan satu Agent
 * kalau AGENTS tidak kosong — kalaupun harus mengabaikan flag `active`
 * sebagai upaya terakhir. Ini prioritaskan "lead tetap sampai ke manusia"
 * di atas "distribusi tetap rapi", karena skenario ini seharusnya sangat
 * jarang terjadi dan butuh perhatian manual segera (makanya di-log
 * sebagai error kritis).
 */
export function pickEmergencyFallbackAgent(): Agent {
  const active = AGENTS.filter((a) => a.active);
  if (active.length > 0) {
    return active[Math.floor(Math.random() * active.length)];
  }

  if (AGENTS.length === 0) {
    throw new Error(
      'AGENTS kosong total di round-robin-config.ts — tidak ada nomor CS yang bisa dipakai sama sekali.'
    );
  }

  console.error(
    '[round-robin-config] KRITIS: semua agent di AGENTS berstatus nonaktif (active: false). ' +
      'Fallback darurat ke AGENTS[0] sambil abaikan flag active, supaya lead tetap tersalurkan. ' +
      'Segera cek/perbaiki round-robin-config.ts.'
  );
  return AGENTS[0];
}
