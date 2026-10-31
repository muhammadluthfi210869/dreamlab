/**
 * Simulasi pembagian sales berdasarkan chat masuk (aturan batas putaran).
 * Jalankan: npx tsx scripts/test-round-robin-balance.ts
 *
 * Model: klik datang acak sepanjang jam kerja satu hari; tiap klik ke sales berubah jadi chat
 * dengan peluang p (konversi) setelah 1-10 menit; sales "macet" (nomor tidak menangkap chat)
 * peluangnya 0. Mode confirmed_balance dibandingkan dengan sequential.
 * Tiga sales aktif: Annisa, Jessica, Diaz (Irma dinonaktifkan 31 Okt 2026).
 */
import { decide, RR_PARAMS, wibHour, type RrAgent, type RrMode } from '../src/lib/round-robin-balance';

let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : '  ' + JSON.stringify(detail)}`);
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = ['Annisa', 'Diaz', 'Jessica'];
const START = Date.parse('2026-10-28T01:00:00Z'); // 08:00 WIB

interface Result {
  clicks: number[];
  chats: number[];
  maxGap: number;
  ceilingViolations: number;
}

function simulate(opts: { mode: RrMode; clicks: number; spanMin: number; conv: number[]; seed: number; roundSize?: number; carry?: number[] }): Result {
  const rand = rng(opts.seed);
  const log: { id: number; t: number; c: number | null }[][] = NAMES.map(() => []);
  let counter = 0;
  const times: number[] = [];
  for (let i = 0; i < opts.clicks; i++) times.push(START + rand() * opts.spanMin * 60_000);
  times.sort((a, b) => a - b);

  let maxGap = 0;
  let ceilingViolations = 0;
  let tick = 1000;
  for (const now of times) {
    tick++;
    const agents: RrAgent[] = NAMES.map((name, i) => {
      const done = log[i].filter((x) => x.c !== null && x.c <= now);
      const lastChat = done.length ? Math.max(...done.map((x) => x.c as number)) : null;
      return {
        id: i + 1,
        name,
        orderIndex: i,
        chatsToday: done.length,
        clicksSinceChat: log[i].filter((x) => lastChat === null || x.t > lastChat).length + (lastChat === null ? opts.carry?.[i] ?? 0 : 0),
        lastChatAtMs: lastChat,
        lastClickId: log[i].length ? log[i][log[i].length - 1].id : 0,
      };
    });
    const d = decide(opts.mode, { nowMs: now, agents, counter: counter % NAMES.length, tick }, opts.roundSize ? { roundSize: opts.roundSize } : {});
    const ag = d.chosen.id - 1;
    if (opts.mode === 'confirmed_balance' && d.reason === 'balanced' && d.ceiling !== undefined && d.chosen.chatsToday >= d.ceiling) ceilingViolations++;
    counter++;
    log[ag].push({ id: tick, t: now, c: rand() < opts.conv[ag] ? now + (1 + rand() * 9) * 60_000 : null });
    const cs = NAMES.map((_, i) => log[i].filter((x) => x.c !== null && x.c <= now).length);
    maxGap = Math.max(maxGap, Math.max(...cs) - Math.min(...cs));
  }
  return {
    clicks: log.map((l) => l.length),
    chats: log.map((l) => l.filter((x) => x.c !== null).length),
    maxGap,
    ceilingViolations,
  };
}

const pct = (arr: number[]) => {
  const s = arr.reduce((a, b) => a + b, 0) || 1;
  return arr.map((v) => Math.round((v / s) * 1000) / 10);
};
const spread = (a: number[]) => Math.max(...a) - Math.min(...a);

// 1) Semua sehat, konversi realistis ~12%
for (const seed of [1, 2, 3, 4]) {
  const r = simulate({ mode: 'confirmed_balance', clicks: 240, spanMin: 780, conv: [0.12, 0.12, 0.12], seed });
  check(`Semua sehat (seed ${seed}): chat tiap sales 25-42%`, pct(r.chats).every((v) => v >= 25 && v <= 42), { chats: r.chats, clicks: r.clicks });
  check(`Semua sehat (seed ${seed}): tidak pernah memberi klik ke sales yang sudah di batas putaran`, r.ceilingViolations === 0, r.ceilingViolations);
}

// 2) Konversi timpang (Annisa 3x): balancer harus jauh lebih setara pada CHAT daripada giliran berurutan
for (const seed of [21, 22, 23]) {
  const conv = [0.24, 0.08, 0.08];
  const seq = simulate({ mode: 'sequential', clicks: 400, spanMin: 780, conv, seed });
  const bal = simulate({ mode: 'confirmed_balance', clicks: 400, spanMin: 780, conv, seed });
  check(`Konversi timpang (seed ${seed}): selisih chat balancer < giliran berurutan`, spread(bal.chats) < spread(seq.chats), { seq: seq.chats, bal: bal.chats });
  check(`Konversi timpang (seed ${seed}): selisih chat antar sales di akhir hari <= 6`, spread(bal.chats) <= 6, bal.chats);
  check(`Konversi timpang (seed ${seed}): sales yang konversinya tinggi mendapat klik lebih sedikit`, bal.clicks[0] < bal.clicks[1] && bal.clicks[0] < bal.clicks[2], bal.clicks);
}

// 3) Satu sales macet (Jessica: nomor tidak menangkap chat): sales sehat jangan ikut menunggu
for (const seed of [31, 32, 33]) {
  // Hari pertama: 40 klik pertama ke nomor itu sebelum terdeteksi macet (biaya sekali) + klik uji 1 dari 8.
  const r = simulate({ mode: 'confirmed_balance', clicks: 240, spanMin: 780, conv: [0.15, 0.15, 0], seed });
  const ks = pct(r.clicks);
  const cs = pct(r.chats);
  check(`Satu sales macet, hari pertama (seed ${seed}): sales macet <= 32% klik (biaya deteksi sekali)`, ks[2] <= 32, ks);
  check(`Satu sales macet, hari pertama (seed ${seed}): dua sales sehat chat 40-60%`, cs[0] >= 40 && cs[0] <= 60, cs);
  // Hari berikutnya: sudah terdeteksi (klik sejak chat terakhir terbawa) -> hanya klik uji ~12,5%.
  const r2 = simulate({ mode: 'confirmed_balance', clicks: 240, spanMin: 780, conv: [0.15, 0.15, 0], seed, carry: [0, 0, 60] });
  const k2 = pct(r2.clicks);
  check(`Satu sales macet, hari berikutnya (seed ${seed}): hanya klik uji (<= 15%)`, k2[2] <= 15, k2);
  check(`Satu sales macet, hari berikutnya (seed ${seed}): dua sales sehat selisih chat <= 6`, Math.abs(r2.chats[0] - r2.chats[1]) <= 6, r2.chats);
}

// 4) Batas putaran persis seperti contoh Head: Annisa 5, Jessica 3, Diaz 3 (Q = 5)
{
  const mk = (chats: number[], over: Partial<RrAgent>[] = []): RrAgent[] =>
    NAMES.map((name, i) => ({ id: i + 1, name, orderIndex: i, chatsToday: chats[i], clicksSinceChat: 5, lastChatAtMs: START - 60_000, lastClickId: 10 + i, ...over[i] }));
  const noon = START + 4 * 3600_000;
  const run = (chats: number[]) => {
    const last = [10, 11, 12];
    const out: string[] = [];
    for (let t = 1; t <= 12; t++) {
      const agents = mk(chats).map((a, i) => ({ ...a, lastClickId: last[i] }));
      const d = decide('confirmed_balance', { nowMs: noon, agents, counter: t % 3, tick: 1000 + t }, { roundSize: 5 });
      last[d.chosen.id - 1] = 1000 + t;
      out.push(d.chosen.name);
    }
    return out;
  };
  const r1 = run([5, 3, 3]);
  check('Contoh Head (Q=5): Annisa 5 vs Diaz 3 vs Jessica 3 -> Annisa berhenti, Diaz dan Jessica bergantian', !r1.includes('Annisa') && r1.filter((x) => x === 'Diaz').length === 6, r1);
  const r2 = run([5, 5, 5]);
  check('Contoh Head (Q=5): semua sudah 5 -> putaran baru, ketiganya menerima merata (4/4/4)', ['Annisa', 'Diaz', 'Jessica'].every((n) => r2.filter((x) => x === n).length === 4), r2);
  const lag = decide('confirmed_balance', { nowMs: noon, agents: mk([5, 5, 2]), counter: 0, tick: 1001 }, { roundSize: 5 });
  check('Dua sales di batas, satu tertinggal: klik ke yang tertinggal', lag.chosen.name === 'Jessica', lag.chosen.name);
}

// 5) Pemutus seri adil: dua sales eligible, bergantian (bukan dominasi salah satu)
{
  const noon = START + 4 * 3600_000;
  let last = [0, 0, 0];
  const seen: string[] = [];
  for (let t = 1; t <= 12; t++) {
    const agents: RrAgent[] = NAMES.map((name, i) => ({ id: i + 1, name, orderIndex: i, chatsToday: i === 0 ? 2 : 1, clicksSinceChat: 3, lastChatAtMs: noon - 60_000, lastClickId: last[i] }));
    const d = decide('confirmed_balance', { nowMs: noon, agents, counter: t % 3, tick: 2000 + t * 3 + 1 });
    last[d.chosen.id - 1] = 2000 + t;
    seen.push(d.chosen.name);
  }
  const diaz = seen.filter((x) => x === 'Diaz').length;
  check('Seri antara 2 sales: bergantian merata (6/6), Annisa di batas tidak ikut', diaz === 6 && !seen.includes('Annisa'), seen);
}

// 6) Mode default tidak mengubah perilaku
{
  const ctx = {
    nowMs: START,
    counter: 2,
    tick: 5,
    agents: NAMES.map((name, i): RrAgent => ({ id: i + 1, name, orderIndex: i, chatsToday: i === 1 ? 0 : 9, clicksSinceChat: 2, lastChatAtMs: START - 60_000, lastClickId: i })),
  };
  const seq = decide('sequential', ctx);
  check('Mode sequential: memilih berdasarkan penghitung (posisi 2 = Jessica)', seq.chosen.name === 'Jessica' && seq.reason === 'sequential', seq.chosen.name);
  const sh = decide('shadow', ctx);
  check('Mode shadow: tetap memilih giliran berurutan', sh.chosen.name === seq.chosen.name);
  check('Mode shadow: mencatat pilihan balancer (Diaz, chat paling sedikit)', sh.shadow?.balanced.name === 'Diaz', sh.shadow);
}

// 7) Pengaman satu per satu
{
  const noon = START + 4 * 3600_000; // 12:00 WIB
  const night = Date.parse('2026-10-28T17:00:00Z'); // 00:00 WIB
  const base = (over: Partial<RrAgent>[], now = noon): RrAgent[] =>
    NAMES.map((name, i) => ({ id: i + 1, name, orderIndex: i, chatsToday: 3, clicksSinceChat: 4, lastChatAtMs: now - 600_000, lastClickId: 10 + i, ...over[i] }));

  // macet: Jessica 0 chat dari 45 klik; di luar giliran uji tidak dipilih, di giliran uji dapat 1 klik
  const stuckA = base([{}, {}, { chatsToday: 0, clicksSinceChat: 45, lastChatAtMs: null }]);
  const normal = decide('confirmed_balance', { nowMs: noon, agents: stuckA, counter: 2, tick: 1001 });
  check('Macet: sales dengan 0 chat dari 40+ klik tidak dipilih di luar giliran uji', normal.chosen.name !== 'Jessica' && normal.reason === 'balanced', normal);
  const probe = decide('confirmed_balance', { nowMs: noon, agents: stuckA, counter: 1, tick: 1000 + RR_PARAMS.probeEvery - (1000 % RR_PARAMS.probeEvery) });
  check('Macet: tetap dapat klik uji tiap 8 klik', probe.chosen.name === 'Jessica' && probe.reason === 'probe', probe);

  // sales sehat tidak menunggu yang macet: Annisa 4, Diaz 3 -> batas 4 (Q=2: min 3 -> batas 4), Annisa 4 berhenti, Diaz jalan
  const hold = decide('confirmed_balance', { nowMs: noon, agents: base([{ chatsToday: 4 }, { chatsToday: 3 }, { chatsToday: 0, clicksSinceChat: 45, lastChatAtMs: null }]), counter: 0, tick: 1001 });
  check('Sales macet tidak menahan putaran: klik tetap jalan ke sales sehat yang tertinggal', hold.chosen.name === 'Diaz', hold);

  // data basi: jam kerja tanpa chat dari siapa pun 7 jam -> giliran berurutan
  const stale = decide('confirmed_balance', { nowMs: noon, agents: base([{ lastChatAtMs: noon - 7 * 3600_000 }, { lastChatAtMs: null }, { lastChatAtMs: noon - 8 * 3600_000 }]), counter: 1, tick: 1001 });
  check('Data basi (7 jam tanpa chat di jam kerja): fallback giliran berurutan', stale.reason === 'fallback-stale' && stale.chosen.name === 'Diaz', stale);

  // malam hari: tidak ada alarm basi
  const nt = decide('confirmed_balance', { nowMs: night, agents: base([{ lastChatAtMs: night - 9 * 3600_000 }, { lastChatAtMs: night - 9 * 3600_000, chatsToday: 1 }, { lastChatAtMs: night - 9 * 3600_000 }], night), counter: 0, tick: 1001 });
  check('Malam hari: tanpa alarm basi, sales dengan chat paling sedikit dipilih', nt.reason === 'balanced' && nt.chosen.name === 'Diaz' && wibHour(night) === 0, nt);

  // belum siap: dua dari tiga sales macet -> hanya 1 yang terbukti, jangan menumpuk
  const nr = decide('confirmed_balance', { nowMs: noon, agents: base([{ chatsToday: 6 }, { chatsToday: 0, clicksSinceChat: 50, lastChatAtMs: null }, { chatsToday: 0, clicksSinceChat: 50, lastChatAtMs: null }]), counter: 1, tick: 1001 });
  check('Belum siap (hanya 1 sales yang terbukti menangkap chat): fallback giliran berurutan', nr.reason === 'fallback-not-ready' && nr.chosen.name === 'Diaz', nr);
}

console.log(failed === 0 ? '\nSEMUA LOLOS' : `\n${failed} GAGAL`);
process.exit(failed === 0 ? 0 : 1);
