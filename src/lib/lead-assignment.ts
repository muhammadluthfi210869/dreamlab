/**

 * lead-assignment.ts

 *

 * FIX UTAMA #3: Sticky assignment via cookie DIHITUNG SEBELUM manggil

 * getNextAgent(). Ini mencegah bug "double increment" — kalau user yang

 * sama refresh halaman / klik tombol WA lebih dari sekali, mereka TIDAK

 * boleh menghabiskan slot rotasi baru. Counter Redis hanya boleh

 * bertambah SATU KALI per lead/user baru, bukan per page view atau per

 * klik.

 *

 * FIX UTAMA #4: Fallback saat error TIDAK LAGI hardcode ke satu nomor

 * statis. Kalau Redis/lookup gagal, fallback sekarang random di antara

 * agent aktif — jadi kalaupun ada gangguan, error itu tidak numpuk ke

 * satu CS saja.

 *

 * Fungsi ini adalah SATU-SATUNYA entry point yang boleh dipanggil, baik

 * dari API route untuk client hook maupun dari redirect route WA. Jangan

 * ada logic assignment lain di luar file ini.

 */

import { cookies } from 'next/headers';

import { getNextAgent } from './roundRobin';

import { AGENTS, getActiveAgents, Agent } from './round-robin-config';

const COOKIE_NAME = 'dreamlab_cs';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari, sesuai behavior lama

export interface AssignmentResult {

  agent: Agent;

  source: 'sticky' | 'rotation' | 'fallback';

}

export async function getOrAssignAgent(): Promise<AssignmentResult> {

  const cookieStore = await cookies();

  const existingId = cookieStore.get(COOKIE_NAME)?.value;

  // 1) Kalau user ini sudah punya assignment sebelumnya (cookie 7 hari)

  //    dan CS itu masih aktif, PAKAI ULANG — jangan konsumsi rotasi baru.

  if (existingId) {

    const stickyAgent = AGENTS.find((a) => a.id === existingId && a.active);

    if (stickyAgent) {

      return { agent: stickyAgent, source: 'sticky' };

    }

    // Kalau CS lama sudah nonaktif, lanjut ke rotasi baru di bawah.

  }

  // 2) User baru -> ambil giliran berikutnya dari rotasi (atomic).

  try {

    const agent = await getNextAgent();

    cookieStore.set(COOKIE_NAME, agent.id, {

      maxAge: COOKIE_MAX_AGE,

      httpOnly: true,

      secure: true,

      sameSite: 'lax',

      path: '/',

    });

    return { agent, source: 'rotation' };

  } catch (err) {

    // 3) Rotasi gagal (Redis down, dll) -> fallback RANDOM, bukan statis.

    console.error('[lead-assignment] getNextAgent gagal, pakai fallback random:', err);

    const active = getActiveAgents();

    const fallbackAgent = active[Math.floor(Math.random() * active.length)];

    cookieStore.set(COOKIE_NAME, fallbackAgent.id, {

      maxAge: COOKIE_MAX_AGE,

      httpOnly: true,

      secure: true,

      sameSite: 'lax',

      path: '/',

    });

    return { agent: fallbackAgent, source: 'fallback' };

  }

}
