/**
 * Simulasi pembagian sales berdasarkan chat masuk.
 * Jalankan: npx tsx scripts/test-round-robin-balance.ts
 *
 * Model: klik datang acak sepanjang jam kerja; tiap klik ke sales yang sehat
 * berubah jadi chat dengan peluang p setelah 1-10 menit; sales "mati" (nomor tidak
 * menangkap chat) peluangnya 0. Mode confirmed_balance dibandingkan dengan sequential.
 */
import { decide, RR_PARAMS, type RrAgent, type RrMode } from '../src/lib/round-robin-balance';

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

const NAMES = ['Annisa', 'Jessica', 'Diaz', 'Irma'];
const START = Date.parse('2026-10-28T03:00:00Z'); // 10:00 WIB

interface Result {
  clicks: number[];
  chats: number[];
}

function simulate(opts: { mode: RrMode; clicks: number; spanMin: number; conv: number[]; seed: number; burst?: boolean }): Result {
  const rand = rng(opts.seed);
  // tiap klik: waktu klik + waktu chat (null = tidak pernah chat)
  const log: { t: number; c: number | null }[][] = NAMES.map(() => []);
  const recent: number[] = [];
  let counter = 0;

  const times: number[] = [];
  for (let i = 0; i < opts.clicks; i++) times.push(opts.burst ? START + rand() * 2 * 60_000 : START + rand() * opts.spanMin * 60_000);
  times.sort((a, b) => a - b);

  for (const now of times) {
    const agents: RrAgent[] = NAMES.map((name, i) => {
      const done = log[i].filter((x) => x.c !== null && x.c <= now);
      return {
        id: i + 1,
        name,
        orderIndex: i,
        chatsSince: done.length,
        // klik menggantung = dibagikan < 30 menit lalu dan belum chat (termasuk yang tidak akan pernah chat)
        pending30: log[i].filter((x) => now - x.t <= 30 * 60_000 && (x.c === null || x.c > now)).length,
        lastChatAtMs: done.length ? Math.max(...done.map((x) => x.c as number)) : null,
      };
    });
    const d = decide(opts.mode, { nowMs: now, agents, recentAssignedIds: recent, counter });
    const ag = d.chosen.id - 1;
    counter++;
    recent.unshift(d.chosen.id);
    if (recent.length > 10) recent.pop();
    log[ag].push({ t: now, c: rand() < opts.conv[ag] ? now + (1 + rand() * 9) * 60_000 : null });
  }
  return {
    clicks: log.map((l) => l.length),
    chats: log.map((l) => l.filter((x) => x.c !== null).length),
  };
}

const pct = (arr: number[]) => {
  const s = arr.reduce((a, b) => a + b, 0) || 1;
  return arr.map((v) => Math.round((v / s) * 1000) / 10);
};

// 1) Semua sehat
for (const seed of [1, 2, 3]) {
  const r = simulate({ mode: 'confirmed_balance', clicks: 300, spanMin: 600, conv: [0.35, 0.35, 0.35, 0.35], seed });
  const cs = pct(r.chats);
  const ks = pct(r.clicks);
  check(`Semua sehat (seed ${seed}): porsi chat tiap sales 15-35%`, cs.every((v) => v >= 15 && v <= 35), { chats: cs, clicks: ks });
  check(`Semua sehat (seed ${seed}): tidak ada sales > 35% klik`, ks.every((v) => v <= 35), ks);
}

// 2) Satu sales mati (Jessica, nomor tidak menangkap chat)
for (const seed of [11, 12, 13]) {
  // hari ramai kampanye (300 klik) 
  const r = simulate({ mode: 'confirmed_balance', clicks: 300, spanMin: 600, conv: [0.35, 0, 0.35, 0.35], seed });
  const ks = pct(r.clicks);
  const cs = pct(r.chats);
  check(`Satu sales mati (seed ${seed}): sales mati tidak memonopoli klik (<= 15%)`, ks[1] <= 15, ks);
  check(`Satu sales mati (seed ${seed}): tidak ada sales sehat > 45% klik`, [ks[0], ks[2], ks[3]].every((v) => v <= 45), ks);
  check(`Satu sales mati (seed ${seed}): tiga sales sehat porsi chat 25-40%`, [cs[0], cs[2], cs[3]].every((v) => v >= 25 && v <= 40), cs);
}

// 2b) Hari normal (120 klik) dan hari sangat ramai (800 klik) dengan satu sales mati
for (const [clicks, label] of [[120, 'hari normal'], [800, 'hari sangat ramai']] as const) {
  for (const seed of [41, 42]) {
    const r = simulate({ mode: 'confirmed_balance', clicks, spanMin: 600, conv: [0.35, 0, 0.35, 0.35], seed });
    const ks = pct(r.clicks);
    check(`Satu sales mati, ${label} (seed ${seed}): sales mati <= 20% klik (contoh kecil, teoritis ~12,5%)`, ks[1] <= 20, ks);
    check(`Satu sales mati, ${label} (seed ${seed}): tiap sales sehat >= 15% klik`, [ks[0], ks[2], ks[3]].every((v) => v >= 15), ks);
  }
}

// 3) Bandingkan dengan giliran berurutan: balancer harus lebih setara pada chat saat ada timpang konversi
{
  const conv = [0.5, 0.2, 0.2, 0.2];
  const seq = pct(simulate({ mode: 'sequential', clicks: 800, spanMin: 600, conv, seed: 21 }).chats);
  const bal = pct(simulate({ mode: 'confirmed_balance', clicks: 800, spanMin: 600, conv, seed: 21 }).chats);
  const spread = (a: number[]) => Math.max(...a) - Math.min(...a);
  check('Konversi timpang: selisih porsi chat balancer < giliran berurutan', spread(bal) < spread(seq), { seq, bal });
}

// 4) Lonjakan 40 klik dalam 2 menit tanpa konfirmasi: harus menyebar
{
  const r = simulate({ mode: 'confirmed_balance', clicks: 40, spanMin: 2, conv: [0.35, 0.35, 0.35, 0.35], seed: 31, burst: true });
  const ks = pct(r.clicks);
  check('Lonjakan klik: tidak ada sales > 35%', ks.every((v) => v <= 35), ks);
}

// 5) Mode default tidak mengubah perilaku
{
  const ctx = {
    nowMs: START,
    counter: 5,
    recentAssignedIds: [],
    agents: NAMES.map((name, i): RrAgent => ({ id: i + 1, name, orderIndex: i, chatsSince: i === 1 ? 0 : 99, pending30: 0, lastChatAtMs: START - 60_000 })),
  };
  const seq = decide('sequential', ctx);
  check('Mode sequential: memilih berdasarkan penghitung (5 % 4 = urutan ke-1)', seq.chosen.name === 'Jessica' && seq.reason === 'sequential', seq.chosen.name);
  const sh = decide('shadow', ctx);
  check('Mode shadow: tetap memilih giliran berurutan', sh.chosen.name === seq.chosen.name);
  check('Mode shadow: mencatat pilihan balancer', !!sh.shadow);
}

// 6) Pengaman satu per satu
{
  const base = (over: Partial<RrAgent>[]): RrAgent[] =>
    NAMES.map((name, i) => ({ id: i + 1, name, orderIndex: i, chatsSince: 10, pending30: 0, lastChatAtMs: START - 600_000, ...over[i] }));

  // batas tumpukan: Annisa paling sedikit chat tapi punya 6 klik menggantung (> 1,5x rata-rata) -> dilewati
  const a = decide('confirmed_balance', { nowMs: START, counter: 1, recentAssignedIds: [], agents: base([{ chatsSince: 0, pending30: 6 }, {}, {}, {}]) });
  check('Batas tumpukan: sales dengan > 5 klik menggantung dilewati', a.chosen.name !== 'Annisa', a.chosen.name);

  // batas beruntun
  const b = decide('confirmed_balance', { nowMs: START, counter: 1, recentAssignedIds: [1, 1, 1], agents: base([{ chatsSince: 0 }, {}, {}, {}]) });
  check('Batas beruntun: 3 klik terakhir ke Annisa -> klik berikut ke sales lain', b.chosen.name !== 'Annisa', b.chosen.name);

  // degraded: Jessica tanpa chat 4 jam di jam kerja, yang lain baru chat
  const c = decide('confirmed_balance', {
    nowMs: START, counter: 3, recentAssignedIds: [],
    agents: base([{}, { chatsSince: 0, lastChatAtMs: START - 4 * 3600_000 }, {}, {}]),
  });
  check('Degraded: sales tanpa chat 3 jam tidak dipilih di luar giliran uji', c.chosen.name !== 'Jessica', c.chosen.name);
  const probe = decide('confirmed_balance', {
    nowMs: START, counter: RR_PARAMS.probeEvery, recentAssignedIds: [],
    agents: base([{}, { chatsSince: 0, lastChatAtMs: START - 4 * 3600_000 }, {}, {}]),
  });
  check('Degraded: tetap dapat 1 klik uji per putaran', probe.chosen.name === 'Jessica', probe.chosen.name);

  // data basi: tidak ada chat > 60 menit di jam kerja -> giliran berurutan
  const d = decide('confirmed_balance', {
    nowMs: START, counter: 2, recentAssignedIds: [],
    agents: base([{ lastChatAtMs: START - 3 * 3600_000 }, { lastChatAtMs: null }, { lastChatAtMs: START - 2 * 3600_000 }, { lastChatAtMs: null }]),
  });
  check('Data basi: fallback giliran berurutan', d.reason === 'fallback-stale' && d.chosen.name === 'Diaz', d);

  // semua kena batas tumpukan -> fallback
  const e = decide('confirmed_balance', { nowMs: START, counter: 0, recentAssignedIds: [1, 1, 1], agents: [base([{}])[0]] });
  check('Tanpa kandidat (sales tunggal kena batas beruntun): fallback giliran berurutan', e.reason === 'fallback-no-candidate' && e.chosen.name === 'Annisa', e);

  // semua sales sama-sama ramai (hari kampanye): bukan penumpukan, jadi tidak jatuh ke fallback
  const busy = decide('confirmed_balance', { nowMs: START, counter: 1, recentAssignedIds: [], agents: base([{ pending30: 9 }, { pending30: 9 }, { pending30: 9 }, { pending30: 9 }]) });
  check('Semua sales ramai merata: tetap memakai balancer, bukan fallback', busy.reason === 'balanced', busy);


  // belum siap: hanya 1 dari 4 nomor yang chatnya tertangkap -> jangan menumpuk ke yang satu itu
  const old = START - 5 * 3600_000;
  const nr = decide('confirmed_balance', {
    nowMs: START, counter: 2, recentAssignedIds: [],
    agents: base([{ chatsSince: 40, lastChatAtMs: START - 600_000 }, { chatsSince: 0, lastChatAtMs: old }, { chatsSince: 0, lastChatAtMs: null }, { chatsSince: 1, lastChatAtMs: old }]),
  });
  check('Belum siap (1 dari 4 nomor menangkap chat): fallback giliran berurutan', nr.reason === 'fallback-not-ready' && nr.chosen.name === 'Diaz', nr);
  // di luar jam kerja pemeriksaan kesiapan dijeda
  const nn = decide('confirmed_balance', {
    nowMs: Date.parse('2026-10-28T17:00:00Z'), counter: 2, recentAssignedIds: [],
    agents: base([{ chatsSince: 40, lastChatAtMs: START }, { chatsSince: 0, lastChatAtMs: old }, { chatsSince: 0, lastChatAtMs: null }, { chatsSince: 1, lastChatAtMs: old }]),
  });
  check('Malam hari: pemeriksaan kesiapan dijeda', nn.reason === 'balanced', nn);

  // malam hari: tidak ada penilaian degraded/basi
  const night = Date.parse('2026-10-28T17:00:00Z'); // 00:00 WIB
  const f = decide('confirmed_balance', {
    nowMs: night, counter: 3, recentAssignedIds: [],
    agents: base([{ chatsSince: 5, lastChatAtMs: night - 9 * 3600_000 }, { chatsSince: 0, lastChatAtMs: night - 9 * 3600_000 }, { chatsSince: 5, lastChatAtMs: night - 9 * 3600_000 }, { chatsSince: 5, lastChatAtMs: night - 9 * 3600_000 }]),
  });
  check('Malam hari: tetap seimbang tanpa alarm palsu (sales dengan chat paling sedikit dipilih)', f.chosen.name === 'Jessica' && f.reason === 'balanced', f);
}

console.log(failed === 0 ? '\nSEMUA LOLOS' : `\n${failed} GAGAL`);
process.exit(failed === 0 ? 0 : 1);
