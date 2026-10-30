/**
 * round-robin-balance.ts
 *
 * Referensi algoritma pembagian sales berdasarkan CHAT MASUK (bukan klik).
 * Implementasi produksi ada di SQL (db/migrations/00024_confirmed_balance_round_robin.sql)
 * dan harus meniru logika di sini; file ini dipakai tes simulasi
 * (scripts/test-round-robin-balance.ts) untuk membuktikan perilakunya.
 *
 * Masalah yang dipecahkan: sales dipilih saat KLIK (nomor tujuan WA harus sudah
 * diketahui), padahal chat baru terjadi menit kemudian. Maka tiap klik baru
 * diberikan ke sales dengan "skor proyeksi" terendah:
 *
 *   skor = chat_masuk_sejak_balance_since + 0.4 x klik_menggantung_30_menit
 *
 * (klik menggantung = sudah dibagikan, belum chat; diperkirakan ~40% akan chat).
 *
 * Pengaman (belajar dari kegagalan "Black Hole Loop" migrasi 00021, saat satu
 * sales yang HP-nya offline terlihat "paling sedikit chat" lalu memonopoli lead):
 *  1. Batas tumpukan : sales dengan > 5 klik menggantung DAN > 1,5x rata-rata semua sales dilewati
 *                      (deteksi penumpukan relatif, bukan batas absolut, agar hari ramai tidak memicu fallback).
 *  2. Batas beruntun : tidak boleh 4 klik berturut-turut ke sales yang sama.
 *  3. Cek kesehatan  : di jam kerja, sales tanpa chat 3 jam padahal sales lain
 *                      ada chat = "degraded", hanya dapat 1 dari 8 klik (uji).
 *  4. Fallback       : tak ada kandidat / data basi / BELUM SIAP -> giliran berurutan.
 *                      'Belum siap' = di jam kerja kurang dari mayoritas sales yang terbukti menangkap chat
 *                      (mis. hanya 1 dari 4 nomor yang chatnya tertangkap). Tanpa ini balancer akan menumpuk
 *                      klik ke satu-satunya nomor yang "hidup", kebalikan dari tujuan merata.
 *  5. Saklar mode    : 'sequential' (default) | 'shadow' | 'confirmed_balance'.
 */

export type RrMode = 'sequential' | 'shadow' | 'confirmed_balance';

export interface RrAgent {
  id: number;
  name: string;
  /** Urutan tetap untuk giliran berurutan dan pemutus seri. */
  orderIndex: number;
  /** Chat masuk sejak balance_since (hitungan mulai nol saat go-live). */
  chatsSince: number;
  /** Klik yang dibagikan ke sales ini dalam 30 menit terakhir dan belum chat. */
  pending30: number;
  /** Waktu chat terakhir (ms epoch), null bila belum ada. */
  lastChatAtMs: number | null;
}

export interface RrContext {
  nowMs: number;
  agents: RrAgent[];
  /** id sales dari penugasan terbaru (yang terbaru dulu). */
  recentAssignedIds: number[];
  /** Penghitung giliran global (rr_counter). */
  counter: number;
}

export const RR_PARAMS = {
  pendingWeight: 0.4,
  pendingCap: 5,
  pileUpFactor: 1.5,
  streakCap: 3,
  degradedAfterMs: 3 * 3600_000,
  probeEvery: 8,
  staleDataMs: 60 * 60_000,
  workFromHourWib: 8,
  workToHourWib: 21,
} as const;

export type PickReason = 'balanced' | 'sequential' | 'fallback-no-candidate' | 'fallback-stale' | 'fallback-not-ready';

export interface Pick {
  agent: RrAgent;
  reason: PickReason;
}

const wibHour = (ms: number) => new Date(ms + 7 * 3600_000).getUTCHours();
export const isWorkingHours = (ms: number) => {
  const h = wibHour(ms);
  return h >= RR_PARAMS.workFromHourWib && h < RR_PARAMS.workToHourWib;
};

const byOrder = (agents: RrAgent[]) => [...agents].sort((a, b) => a.orderIndex - b.orderIndex);

/** Giliran berurutan murni berdasarkan penghitung. */
export function pickSequential(agents: RrAgent[], counter: number): RrAgent {
  const sorted = byOrder(agents);
  return sorted[((counter % sorted.length) + sorted.length) % sorted.length];
}

/** Sales degraded: jam kerja, tanpa chat >= 3 jam, sementara minimal satu sales lain punya chat dalam 3 jam. */
export function degradedIds(ctx: RrContext): Set<number> {
  const out = new Set<number>();
  if (!isWorkingHours(ctx.nowMs)) return out;
  const recent = (a: RrAgent) => a.lastChatAtMs !== null && ctx.nowMs - a.lastChatAtMs < RR_PARAMS.degradedAfterMs;
  const anyoneRecent = (self: RrAgent) => ctx.agents.some((o) => o.id !== self.id && recent(o));
  for (const a of ctx.agents) if (!recent(a) && anyoneRecent(a)) out.add(a.id);
  return out;
}

/** True bila RR_PARAMS.streakCap klik terakhir semuanya ke sales ini. */
function streakBlocked(ctx: RrContext, agentId: number): boolean {
  const n = RR_PARAMS.streakCap;
  const last = ctx.recentAssignedIds.slice(0, n);
  return last.length >= n && last.every((id) => id === agentId);
}

/** Data konfirmasi basi: jam kerja dan tidak ada satu pun chat masuk dalam 60 menit. */
function dataStale(ctx: RrContext): boolean {
  if (!isWorkingHours(ctx.nowMs)) return false;
  return ctx.agents.every((a) => a.lastChatAtMs === null || ctx.nowMs - a.lastChatAtMs > RR_PARAMS.staleDataMs);
}

export function pickBalanced(ctx: RrContext): Pick {
  const agents = byOrder(ctx.agents);
  if (agents.length === 0) throw new Error('No active agents');

  if (dataStale(ctx)) return { agent: pickSequential(agents, ctx.counter), reason: 'fallback-stale' };

  // Belum siap: di jam kerja, mayoritas sales harus terbukti menangkap chat (chat < 3 jam lalu).
  if (isWorkingHours(ctx.nowMs)) {
    const healthy = agents.filter((a) => a.lastChatAtMs !== null && ctx.nowMs - a.lastChatAtMs < RR_PARAMS.degradedAfterMs).length;
    if (healthy * 2 <= agents.length) return { agent: pickSequential(agents, ctx.counter), reason: 'fallback-not-ready' };
  }

  const degraded = degradedIds(ctx);
  const probeTurn = ctx.counter % RR_PARAMS.probeEvery === 0;

  const meanPending = agents.reduce((sum, a) => sum + a.pending30, 0) / agents.length;
  const eligible = agents.filter((a) => {
    if (a.pending30 > RR_PARAMS.pendingCap && a.pending30 > RR_PARAMS.pileUpFactor * meanPending) return false;
    if (streakBlocked(ctx, a.id)) return false;
    if (degraded.has(a.id) && !probeTurn) return false;
    return true;
  });
  if (eligible.length === 0) return { agent: pickSequential(agents, ctx.counter), reason: 'fallback-no-candidate' };

  // Giliran probe: beri ke sales degraded (bila ada yang layak) supaya kesehatannya bisa terbukti.
  if (probeTurn) {
    // Bergiliran antar sales degraded, supaya sales sehat yang sempat sepi tetap punya kesempatan pulih.
    const probe = eligible.filter((a) => degraded.has(a.id));
    if (probe.length > 0) {
      const turn = Math.floor(ctx.counter / RR_PARAMS.probeEvery);
      return { agent: probe[turn % probe.length], reason: 'balanced' };
    }
  }

  const pool = probeTurn ? eligible : eligible.filter((a) => !degraded.has(a.id));
  const score = (a: RrAgent) => a.chatsSince + RR_PARAMS.pendingWeight * a.pending30;
  const best = Math.min(...pool.map(score));
  const tied = pool.filter((a) => Math.abs(score(a) - best) < 1e-9);

  // Pemutus seri: urutan tetap mulai dari posisi penghitung, supaya seri tidak selalu jatuh ke sales pertama.
  const start = ((ctx.counter % agents.length) + agents.length) % agents.length;
  const ranked = agents.map((a, idx) => ({ a, k: (idx - start + agents.length) % agents.length }));
  const winner = ranked.filter((r) => tied.includes(r.a)).sort((x, y) => x.k - y.k)[0].a;
  return { agent: winner, reason: 'balanced' };
}

export interface Decision {
  chosen: RrAgent;
  reason: PickReason;
  /** Hanya di mode shadow: apa yang akan dipilih balancer (untuk dicatat). */
  shadow?: Pick;
}

export function decide(mode: RrMode, ctx: RrContext): Decision {
  if (mode === 'confirmed_balance') {
    const p = pickBalanced(ctx);
    return { chosen: p.agent, reason: p.reason };
  }
  const seq = pickSequential(ctx.agents, ctx.counter);
  if (mode === 'shadow') return { chosen: seq, reason: 'sequential', shadow: pickBalanced(ctx) };
  return { chosen: seq, reason: 'sequential' };
}
