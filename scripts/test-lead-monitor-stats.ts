/**
 * Tes untuk src/lib/lead-monitor-stats.ts (tanpa jaringan/DB).
 * Jalankan: npx tsx scripts/test-lead-monitor-stats.ts
 */
import {
  classify,
  computeKpi,
  dailySeries,
  deltaPct,
  fairness,
  filterLeads,
  groupBy,
  healthRows,
  hourlyChats,
  hourlyClicks,
  maskPhone,
  cleanName,
  mergeForMonitor,
  pagePath,
  paginate,
  perBusdev,
  quantityOf,
  referrerInfo,
  sortLeads,
  splitActive,
  stageCounts,
  tabCounts,
  topLeads,
  topReferrers,
  computeMoqOverview,
  formatWaChatLink,
  computeBusdevChannelFunnels,
  detectAdChannel,
  defaultFilters,
  type MonitorLead,
} from '../src/lib/lead-monitor-stats';

let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : '  ' + JSON.stringify(detail)}`);
};

let id = 0;
const T0 = Date.parse('2026-10-28T03:00:00Z'); // 10:00 WIB
const row = (over: Partial<MonitorLead> & Record<string, unknown> = {}): MonitorLead => ({
  id: ++id,
  tracking_code: `DL-${id}`,
  assigned_to: 'Annisa',
  source: 'meta-skincare',
  status: null,
  created_at: new Date(T0 + id * 60_000).toISOString(),
  confirmed_at: null,
  ...over,
});

const chat = (phone: string, who: string, extra: Record<string, unknown> = {}) =>
  row({
    assigned_to: who,
    status: 'confirmed',
    wa_phone: phone,
    confirmed_at: new Date(T0 + (id + 1) * 60_000 + 120_000).toISOString(),
    ...extra,
  });

const raw: MonitorLead[] = [
  chat('6281111111111', 'Annisa'),
  chat('6282222222222', 'Jessica', { production_tier_name: 'Brand Growth', requested_quantity_pcs: 1000, is_form_lead: true }),
  chat('6283333333333', 'Diaz', { production_tier_name: 'Brand Starter', requested_quantity_pcs: 300 }),
  chat('6284444444444', 'Irma'),
  row({ assigned_to: 'Annisa' }), // drop-off tanpa nomor
  row({ assigned_to: 'Jessica' }),
  row({ assigned_to: 'Diaz', hp: '08123456789', is_form_lead: true, production_tier_name: 'Brand Launch', requested_quantity_pcs: 500 }),
  row({ assigned_to: 'Irma', status: 'confirmed', wa_message: 'Memeriksa pesan baru', confirmed_at: new Date(T0).toISOString() }), // ghost -> bukan chat
  row({ assigned_to: 'Annisa', source: 'wa-direct', status: 'confirmed', wa_phone: '6285555555555', confirmed_at: new Date(T0).toISOString() }),
];
// duplikat: nomor sama klik dua kali dalam 24 jam -> 1 lead
raw.push(row({ assigned_to: 'Annisa', wa_phone: '6281111111111' }));

const leads = mergeForMonitor(raw);
check('duplikat nomor digabung (10 baris -> 9 lead)', leads.length === 9, leads.length);

const k = computeKpi(leads);
check('Chat Masuk = 4 (ghost tidak dihitung)', k.chat === 4, k);
check('Drop-off = 4', k.dropoff === 4, k);
check('Total Klik = Chat + Drop-off', k.totalClicks === k.chat + k.dropoff, k);
check('Chat langsung dihitung terpisah (1)', k.direct === 1, k);
check('Memenuhi MOQ = 2 (1.000 pcs dan 500 pcs)', k.moqMet === 2, k);

const tabs = tabCounts(leads);
check('Kartu Chat Masuk = jumlah baris tab Chat', filterLeads(leads, { ...defaultFilters, tab: 'chat' }).length === k.chat);
check('Kartu Drop-off = jumlah baris tab Drop-off', filterLeads(leads, { ...defaultFilters, tab: 'dropoff' }).length === k.dropoff);
check('Kartu Total Klik = jumlah baris tab Semua', filterLeads(leads, { ...defaultFilters, tab: 'all' }).length === k.totalClicks);
check('Tab Chat Langsung = kartu direct', filterLeads(leads, { ...defaultFilters, tab: 'direct' }).length === tabs.direct);
check('classify: wa-direct = direct', classify(raw[8]) === 'direct');

// per BusDev
const names = ['Annisa', 'Jessica', 'Diaz', 'Irma'];
const bd = perBusdev(leads, names);
const sumChat = bd.reduce((a, b) => a + b.chat, 0);
check('Jumlah chat per BusDev = kartu Chat Masuk', sumChat === k.chat, bd);
check('Porsi chat total 100%', Math.abs(bd.reduce((a, b) => a + b.share, 0) - 100) < 0.5, bd);
check('Annisa punya chat langsung terpisah', bd.find((b) => b.name === 'Annisa')!.direct === 1);

// kemerataan
const even = [{ name: 'A', chat: 25, dropoff: 0, direct: 0, clicks: 25, share: 25 }, { name: 'B', chat: 24, dropoff: 0, direct: 0, clicks: 24, share: 24 }, { name: 'C', chat: 26, dropoff: 0, direct: 0, clicks: 26, share: 26 }, { name: 'D', chat: 25, dropoff: 0, direct: 0, clicks: 25, share: 25 }];
check('Kemerataan: merata', fairness(even, ['A', 'B', 'C', 'D']).level === 'merata');
const skew = [{ name: 'A', chat: 80, dropoff: 0, direct: 0, clicks: 80, share: 0 }, { name: 'B', chat: 5, dropoff: 0, direct: 0, clicks: 5, share: 0 }, { name: 'C', chat: 5, dropoff: 0, direct: 0, clicks: 5, share: 0 }, { name: 'D', chat: 0, dropoff: 0, direct: 0, clicks: 0, share: 0 }];
check('Kemerataan: timpang', fairness(skew, ['A', 'B', 'C', 'D']).level === 'timpang');
check('Kemerataan: data sedikit = belum ada data', fairness(bd, names).level === 'belum-ada-data');

// harian
const days = dailySeries(leads, '2026-10-27', '2026-10-29');
check('Deret harian mengisi hari kosong (3 hari)', days.length === 3 && days[0].klik === 0 && days[2].klik === 0, days);
check('Deret harian: 28 Okt memuat semua klik', days[1].klik === k.totalClicks && days[1].chat === k.chat, days[1]);

// jam
const hrs = hourlyChats(leads);
check('Jam chat: total = chat + chat langsung', hrs.reduce((a, h) => a + h.chat, 0) === k.chat + k.direct, hrs.filter((h) => h.chat));

// per jam (rentang satu hari)
const hc = hourlyClicks(leads);
check('Per jam: total klik = kartu Total Klik', hc.reduce((a, h) => a + h.klik, 0) === k.totalClicks, hc.filter((h) => h.klik));
check('Per jam: total chat = kartu Chat Masuk', hc.reduce((a, h) => a + h.chat, 0) === k.chat);

// group
const src = groupBy(leads, (l) => l.source);
check('Group sumber tidak memuat chat langsung', !src.some((g) => g.key === 'wa-direct'), src);
check('pagePath membuang query & slash akhir', pagePath('https://dreamlab.id/ads/maklon-skincare/?utm=1') === '/ads/maklon-skincare');

// kuantitas & MOQ filter
check('quantityOf: nama tier form terbaru', quantityOf({ ...raw[0], production_tier_name: 'Starter Brand', requested_quantity_pcs: null }) === 500 && quantityOf({ ...raw[0], production_tier_name: 'Enterprise', requested_quantity_pcs: null }) === 5000 && quantityOf({ ...raw[0], production_tier_name: 'Strategic Partner', requested_quantity_pcs: null }) === 10000 && quantityOf({ ...raw[0], production_tier_name: 'Paket Bisnis', requested_quantity_pcs: null }) === null);
check('quantityOf memakai tier bila pcs kosong', quantityOf({ ...raw[0], production_tier_name: 'Brand Partner', requested_quantity_pcs: null }) === 5000);
check('Filter MOQ memenuhi', filterLeads(leads, { ...defaultFilters, tab: 'all', moq: 'met' }).length === 2);
check('Filter jenis form', filterLeads(leads, { ...defaultFilters, tab: 'all', kind: 'form' }).every((l) => l.is_form_lead));
check('Filter BusDev case-insensitive', filterLeads(leads, { ...defaultFilters, tab: 'all', busdev: 'diaz' }).every((l) => l.assigned_to === 'Diaz'));
check('Pencarian nomor', filterLeads(leads, { ...defaultFilters, tab: 'chat', search: '3333' }).length === 1);

// sort + pagination
const sorted = sortLeads(filterLeads(leads, { ...defaultFilters, tab: 'all' }), 'quantity', 'desc');
check('Sort kuantitas menurun', (quantityOf(sorted[0]) ?? 0) >= (quantityOf(sorted[1]) ?? 0));
const pg = paginate([1, 2, 3, 4, 5, 6, 7], 2, 3);
check('Pagination halaman 2 ukuran 3', pg.rows.join() === '4,5,6' && pg.pages === 3, pg);
check('Pagination melewati batas diklem', paginate([1, 2], 9, 5).page === 1);

// top leads
const top = topLeads(leads, T0 + 3_600_000, 5);
check('Top Leads urut skor menurun', top.every((t, i) => i === 0 || top[i - 1].score >= t.score), top);
check('Top Leads: Growth 30 + chat 30 + form 10 + cepat 10 + baru 10 = 90', top[0].score === 90 && top[0].busdev === 'Jessica', top[0]);
check('Nomor Top Leads disamarkan', top.every((t) => /^\*\*\*\d{4}$|^—$/.test(t.phone)), top.map((t) => t.phone));

// delta, mask
check('Delta vs periode lalu', deltaPct(150, 100) === 50 && deltaPct(5, 0) === null);
check('cleanName membuang isian sampah', cleanName('....') === null && cleanName(' - ') === null && cleanName(' Budi ') === 'Budi' && cleanName('Ñandé') === 'Ñandé');
check('maskPhone', maskPhone('6281234562389') === '***2389');

// kesehatan
const noon = Date.parse('2026-10-28T05:00:00Z'); // 12:00 WIB
const night = Date.parse('2026-10-28T17:00:00Z'); // 00:00 WIB
const hi = (lastMinAgo: number | null, now: number, active = true) =>
  healthRows([{ name: 'X', isActive: active, lastChatAt: lastMinAgo === null ? null : new Date(now - lastMinAgo * 60_000).toISOString(), chatsToday: 0 }], now)[0].level;
check('Kesehatan: sehat < 3 jam', hi(30, noon) === 'sehat');
check('Kesehatan: perhatian 3-24 jam di jam kerja', hi(300, noon) === 'perhatian');
check('Kesehatan: malam hari tidak alarm palsu', hi(300, night) === 'di-luar-jam-kerja');
check('Kesehatan: tidak pernah chat = tidak aktif', hi(null, noon) === 'tidak-aktif');
check('Kesehatan: sales nonaktif', hi(10, noon, false) === 'nonaktif');

// halaman asal (referrer)
const titles = (p: string) => (p === '/cara-meracik-handbody' ? 'Cara Meracik Handbody' : null);
const rA = referrerInfo('https://dreamlab.id/cara-meracik-handbody/?utm_source=x&fbclid=abc', titles);
check('Referrer artikel: judul, tanpa query', rA.kind === 'artikel' && rA.label === 'Cara Meracik Handbody' && rA.path === '/cara-meracik-handbody', rA);
check('Referrer landing iklan', referrerInfo('https://dreamlab.id/ads/maklon-parfum/?utm=1').kind === 'landing');
check('Referrer eksternal: hanya nama situs', referrerInfo('https://www.instagram.com/p/xyz?igsh=1').label === 'instagram.com');
check('Referrer kosong = langsung', referrerInfo('').kind === 'langsung' && referrerInfo(null).label === null);
check('Referrer beranda', referrerInfo('https://dreamlab.id/').kind === 'beranda');
check('Pencarian mencakup referrer', filterLeads([{ ...raw[0], referrer: 'https://dreamlab.id/artikel-unik-xyz/' } as any], { ...defaultFilters, tab: 'all', search: 'artikel-unik' }).length === 1);

// peringkat halaman asal
const art = 'https://dreamlab.id/artikel-satu/?utm_source=ig';
const rl: MonitorLead[] = [
  chat('6281000000001', 'Annisa', { referrer: art }),
  row({ assigned_to: 'Diaz', referrer: art, hp: '081000000002' }),
  row({ assigned_to: 'Irma', referrer: 'https://dreamlab.id/artikel-dua/', hp: '081000000003' }),
  chat('6281000000004', 'Jessica', { referrer: 'https://www.instagram.com/' }),
  row({ assigned_to: 'Annisa', hp: '081000000005' }), // tanpa referrer
  row({ assigned_to: 'Annisa', source: 'wa-direct', status: 'confirmed', wa_phone: '6281000000006', confirmed_at: new Date(T0).toISOString(), referrer: art }), // chat langsung: tidak dihitung
];
const tr = topReferrers(mergeForMonitor(rl), (p) => (p === '/artikel-satu' ? 'Artikel Satu' : null), 5);
check('Peringkat asal: artikel satu = 1 chat dari 2 klik (50%)', tr[0]?.label === 'Artikel Satu' && tr[0].klik === 2 && tr[0].chat === 1 && tr[0].rate === 50, tr);
check('Peringkat asal: urut chat lalu klik', tr.length === 3 && tr[1].chat === 1 && tr[2].chat === 0, tr);
check('Peringkat asal: tanpa referrer & chat langsung tidak masuk', tr.every((t) => t.label !== null) && tr[0].klik === 2, tr);

// sales nonaktif tidak ditampilkan tetapi totalnya tetap cocok
{
  const all = perBusdev(leads, ['Annisa', 'Jessica', 'Diaz', 'Irma']);
  const sp = splitActive(all, ['Annisa', 'Jessica', 'Diaz']);
  check('Sales nonaktif (Irma) tidak muncul di daftar kartu', !sp.active.some((r) => r.name === 'Irma') && sp.active.length === 3, sp.active.map((r) => r.name));
  check('Total chat kartu = chat sales aktif + rangkuman nonaktif', sp.active.reduce((a, r) => a + r.chat, 0) + sp.inactive.chat === k.chat, { sp, kchat: k.chat });
  check('Porsi chat dihitung ulang di antara sales aktif (jumlah 100%)', Math.abs(sp.active.reduce((a, r) => a + r.share, 0) - 100) < 0.5, sp.active);
  check('Rangkuman nonaktif menyebut nama Irma', sp.inactive.names.includes('Irma') && sp.inactive.chat === 1, sp.inactive);
}

// isian CRM: MOQ manual, tahap
{
  const base = { ...raw[0], requested_quantity_pcs: 300 } as MonitorLead;
  check('MOQ manual menggantikan isian form', quantityOf({ ...base, moq_manual: 1000 }) === 1000 && quantityOf({ ...base, moq_manual: null }) === 300);
  check('MOQ manual 0 dihormati (bukan dianggap kosong)', quantityOf({ ...base, moq_manual: 0 }) === 0);
  const mk = (code: string, stage: string | undefined, moq: number | null = null, extra: Record<string, unknown> = {}) =>
    ({ ...row({ tracking_code: code, hp: '08' + code.replace(/\D/g, '').padEnd(9, '1') }), crm_stage: stage, moq_manual: moq, ...extra }) as MonitorLead;
  const crmLeads = mergeForMonitor([mk('A1', undefined), mk('B2', 'hot', 800), mk('C3', 'hot'), mk('D4', 'deal', 50, { produk_manual: 'Serum Vit C' })]);
  const sc = stageCounts(crmLeads);
  check('Hitungan per tahap; tanpa isian = traffic', sc.traffic === 1 && sc.hot === 2 && sc.deal === 1, sc);
  check('Filter tahap bekerja', filterLeads(crmLeads, { ...defaultFilters, tab: 'all', stage: 'hot' }).length === 2 && filterLeads(crmLeads, { ...defaultFilters, tab: 'all', stage: 'traffic' }).length === 1);
  check('Filter tahap "all"/kosong menampilkan semua', filterLeads(crmLeads, { ...defaultFilters, tab: 'all', stage: 'all' }).length === 4 && filterLeads(crmLeads, { ...defaultFilters, tab: 'all' }).length === 4);
  check('Pencarian mencakup produk manual', filterLeads(crmLeads, { ...defaultFilters, tab: 'all', search: 'vit c' }).length === 1);
  check('Urut produk memakai isian manual', sortLeads(crmLeads, 'product', 'desc')[0].produk_manual === 'Serum Vit C');
}

// Overview Sebaran MOQ & format WA
{
  const mkLead = (pcs: number | null, src: string, page: string) =>
    row({
      requested_quantity_pcs: pcs ?? undefined,
      source: src,
      page_url: page,
      status: 'confirmed',
    }) as any;

  const sample = [
    mkLead(1000, 'meta-skincare', '/ads/maklon-skincare'),
    mkLead(500, 'meta-skincare', '/ads/maklon-skincare'),
    mkLead(300, 'google-ads', '/maklon-parfum'),
    mkLead(null, 'organic', '/'),
  ];

  const ov = computeMoqOverview(sample);
  check('Overview MOQ: 1.000+ pcs dihitung benar', ov.distribution.moq1000.count === 1 && ov.distribution.moq1000.totalPcs === 1000, ov.distribution.moq1000);
  check('Overview MOQ: 500 pcs dihitung benar', ov.distribution.moq500.count === 1 && ov.distribution.moq500.totalPcs === 500, ov.distribution.moq500);
  check('Overview MOQ: < 500 pcs dihitung benar', ov.distribution.below500.count === 1 && ov.distribution.below500.totalPcs === 300, ov.distribution.below500);
  check('Overview MOQ: Tanpa form dihitung benar', ov.distribution.noForm.count === 1, ov.distribution.noForm);
  check('Overview MOQ: Total pcs = 1800', ov.totalPcs === 1800 && ov.totalWithMoq === 3);
  check('Overview MOQ: Sumber terbanyak adalah meta-skincare', ov.topSourcesByMoq[0].source === 'meta-skincare' && ov.topSourcesByMoq[0].totalPcs === 1500);

  const waLink = formatWaChatLink('081952417051', 'Budi', 'Annisa', 'Serum Wajah');
  check('formatWaChatLink normalisasi nomor ke 6281952417051', waLink?.startsWith('https://wa.me/6281952417051') === true, waLink);
  check('formatWaChatLink memuat salam nama & sales', waLink?.includes('Budi') === true && waLink?.includes('Annisa') === true && waLink?.includes('Serum') === true, waLink);
}

// Funnel per BusDev: Meta Ads, Google Ads, Google Organic & Media Sosial
{
  const mkF = (sales: string, src: string, pcs: number, stage: string, extra: Record<string, unknown> = {}) =>
    row({
      assigned_to: sales,
      source: src,
      requested_quantity_pcs: pcs,
      crm_stage: stage,
      status: 'confirmed',
      ...extra,
    }) as any;

  const sample = [
    mkF('Annisa', 'meta-skincare', 1000, 'sample'),
    mkF('Annisa', 'meta-skincare', 500, 'warm'),
    mkF('Annisa', 'google-ads', 500, 'sample'),
    mkF('Annisa', 'google-organic', 500, 'sample'),
    mkF('Annisa', 'social-media', 1000, 'warm'),
    mkF('Jessica', 'meta-skincare', 300, 'traffic'),
    mkF('Diaz', 'google-ads', 1000, 'deal'),
  ];

  check('detectAdChannel: meta_ads terdeteksi', detectAdChannel({ source: 'meta-skincare' } as any) === 'meta_ads');
  check('detectAdChannel: google_ads terdeteksi', detectAdChannel({ source: 'google-ads' } as any) === 'google_ads');
  check('detectAdChannel: google_organic terdeteksi', detectAdChannel({ source: 'google-organic' } as any) === 'google_organic');
  check('detectAdChannel: social_media terdeteksi', detectAdChannel({ source: 'social-media' } as any) === 'social_media');

  const fRes = computeBusdevChannelFunnels(sample, ['Annisa', 'Jessica', 'Diaz']);
  const annisa = fRes.byBusdev.find((b) => b.name === 'Annisa')!;
  check('Annisa: Meta Traffic = 2, MOQ = 2, Sample = 1', annisa.meta_ads.traffic === 2 && annisa.meta_ads.moq === 2 && annisa.meta_ads.sample === 1, annisa.meta_ads);
  check('Annisa: Google Ads Traffic = 1, MOQ = 1, Sample = 1', annisa.google_ads.traffic === 1 && annisa.google_ads.moq === 1 && annisa.google_ads.sample === 1, annisa.google_ads);
  check('Annisa: Google Organik Traffic = 1, MOQ = 1, Sample = 1', annisa.google_organic.traffic === 1 && annisa.google_organic.moq === 1 && annisa.google_organic.sample === 1, annisa.google_organic);
  check('Annisa: Social Media Traffic = 1, MOQ = 1, Sample = 0', annisa.social_media.traffic === 1 && annisa.social_media.moq === 1 && annisa.social_media.sample === 0, annisa.social_media);
  check('Total Tim Meta Traffic = 3, MOQ = 2', fRes.summary.meta_ads.traffic === 3 && fRes.summary.meta_ads.moq === 2, fRes.summary.meta_ads);
}

console.log(failed === 0 ? '\nSEMUA LOLOS' : `\n${failed} GAGAL`);

process.exit(failed === 0 ? 0 : 1);
