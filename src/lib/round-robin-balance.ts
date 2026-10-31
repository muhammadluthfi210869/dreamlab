/**
 * round-robin-balance.ts
 *
 * Referensi algoritma pembagian sales berdasarkan CHAT MASUK (bukan klik).
 * Implementasi produksi ada di SQL (db/migrations/00024_confirmed_balance_round_robin.sql,
 * fungsi rr_choose_agent) dan harus meniru logika di sini; file ini dipakai tes simulasi
 * (scripts/test-round-robin-balance.ts) untuk membuktikan perilakunya.
 *
 * Aturan (murni chat masuk berkode; klik yang belum chat TIDAK ikut dihitung):
 *  1. Hitung chat masuk tiap sales HARI INI (reset tengah malam WIB).
 *  2. Batas putaran = (chat sales terendah / Q + 1) x Q, Q = roundSize.
 *     Contoh Q=5: Annisa 5, Jessica 3, Diaz 3 -> batas 5 -> Annisa berhenti dapat klik
 *     sampai Jessica dan Diaz juga 5, lalu batas naik ke 10.
 *  3. Klik baru -> sales di bawah batas dengan chat paling sedikit.
 *     Seri: yang paling lama tidak kebagian klik, lalu urutan giliran.
 *
 * Pengaman (belajar dari "Black Hole Loop" migrasi 00021, saat satu sales yang HP-nya
 * offline terlihat "paling sedikit chat" lalu memonopoli lead):
 *  a. MACET   : sales dengan >= stuckClicks klik sejak chat terakhir dan nol chat hari ini
 *               dikeluarkan dari hitungan batas (sales sehat tidak ikut menunggu) dan hanya
 *               dapat 1 dari probeEvery klik (klik uji) agar bisa pulih.
 *  b. Fallback: giliran berurutan bila jam kerja tanpa satu chat pun dari siapa pun selama
 *               staleMs, atau kurang dari 2 sales yang tidak macet, atau tak ada kandidat.
 *  c. Saklar  : 'sequential' (default) | 'shadow' | 'confirmed_balance'.
 */

export type RrMode = 'sequential' | 'shadow' | 'confirmed_balance';

export interface RrAgent {
  id: number;
  name: string;
  /** Urutan tetap untuk giliran berurutan dan pemutus seri terakhir. */
  orderIndex: number;
  /** Chat masuk berkode hari ini (sejak tengah malam WIB / sejak balancer dinyalakan). */
  chatsToday: number;
  /** Klik yang dibagikan ke sales ini sejak chat terakhirnya (atau sejak awal jendela bila belum pernah chat). */
  clicksSinceChat: number;
  /** Waktu chat terakhir (ms epoch), null bila belum ada. */
  lastChatAtMs: number | null;
  /** Id klik terakhir yang dibagikan ke sales ini (0 = belum pernah). Dipakai pemutus seri. */
  lastClickId: number;
}

export interface RrContext {
  nowMs: number;
  agents: RrAgent[];
  /** Posisi giliran berurutan (rr_counter), 0-based. BUKAN penghitung yang terus naik. */
  counter: number;
  /** Penghitung yang terus naik 1 per klik (di SQL: id lead terakhir). Untuk ritme klik uji. */
  tick: number;
}

export const RR_PARAMS = {
  roundSize: 2,
  stuckClicks: 40,
  staleMs: 6 * 3600_000,
  probeEvery: 8,
  workStartHour: 8,
  workEndHour: 21,
} as const;

export type RrParams = { -readonly [K in keyof typeof RR_PARAMS]: number };

export interface RrDecision {
  chosen: RrAgent;
  reason: 'sequential' | 'balanced' | 'probe' | 'fallback-stale' | 'fallback-not-ready' | 'fallback-no-candidate';
  /** Hanya mode shadow: pilihan balancer yang dicatat (sales yang benar-benar dipilih tetap giliran berurutan). */
  shadow?: { balanced: RrAgent; reason: RrDecision['reason'] };
  ceiling?: number;
}

export function wibHour(ms: number): number {
  return new Date(ms + 7 * 3600_000).getUTCHours();
}

function balanced(ctx: RrContext, p: RrParams): { agent: RrAgent; reason: RrDecision['reason']; ceiling?: number } {
  const agents = [...ctx.agents].sort((a, b) => a.orderIndex - b.orderIndex);
  const n = agents.length;
  const seq = agents[ctx.counter % n];
  const working = (() => {
    const h = wibHour(ctx.nowMs);
    return h >= p.workStartHour && h < p.workEndHour;
  })();

  const anyRecent = agents.some((a) => a.lastChatAtMs !== null && ctx.nowMs - a.lastChatAtMs <= p.staleMs);
  const stale = working && !anyRecent;
  const stuck = agents.map(
    (a) => a.chatsToday === 0 && a.clicksSinceChat >= p.stuckClicks && (a.lastChatAtMs === null || ctx.nowMs - a.lastChatAtMs > p.staleMs)
  );
  const okCount = stuck.filter((s) => !s).length;

  const minChats = Math.min(...agents.filter((_, i) => !stuck[i]).map((a) => a.chatsToday), Infinity);
  const ceiling = (Math.floor((Number.isFinite(minChats) ? minChats : 0) / p.roundSize) + 1) * p.roundSize;
  const eligible = agents.map((a, i) => !stuck[i] && a.chatsToday < ceiling);

  if (stale) return { agent: seq, reason: 'fallback-stale', ceiling };
  if (okCount < 2) return { agent: seq, reason: 'fallback-not-ready', ceiling };
  if (!eligible.some(Boolean)) return { agent: seq, reason: 'fallback-no-candidate', ceiling };

  if (ctx.tick % p.probeEvery === 0) {
    const stuckIdx = agents.map((_, i) => i).filter((i) => stuck[i]);
    if (stuckIdx.length > 0) {
      return { agent: agents[stuckIdx[Math.floor(ctx.tick / p.probeEvery) % stuckIdx.length]], reason: 'probe', ceiling };
    }
  }

  let best: RrAgent | null = null;
  let bestK = 0;
  agents.forEach((a, i) => {
    if (!eligible[i]) return;
    const k = (i - (ctx.counter % n) + n) % n;
    if (
      best === null ||
      a.chatsToday < best.chatsToday ||
      (a.chatsToday === best.chatsToday && (a.lastClickId < best.lastClickId || (a.lastClickId === best.lastClickId && k < bestK)))
    ) {
      best = a;
      bestK = k;
    }
  });
  return { agent: best as unknown as RrAgent, reason: 'balanced', ceiling };
}

export function decide(mode: RrMode, ctx: RrContext, params: Partial<RrParams> = {}): RrDecision {
  const p: RrParams = { ...RR_PARAMS, ...params };
  const agents = [...ctx.agents].sort((a, b) => a.orderIndex - b.orderIndex);
  const seq = agents[ctx.counter % agents.length];
  if (mode === 'sequential') return { chosen: seq, reason: 'sequential' };

  const b = balanced(ctx, p);
  if (mode === 'shadow') {
    return { chosen: seq, reason: 'sequential', shadow: { balanced: b.agent, reason: b.reason }, ceiling: b.ceiling };
  }
  return { chosen: b.agent, reason: b.reason, ceiling: b.ceiling };
}
