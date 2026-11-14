/**
 * Tes logika login (kata sandi) dan aturan edit CRM (tanpa jaringan/DB).
 * Jalankan: npx tsx scripts/test-crm.ts
 */
import { NextRequest } from 'next/server';
import { hashPassword, matchesInitialPassword, newToken, sameOrigin, serviceTokenOk, sha256, validateNewPassword, verifyPassword } from '../src/lib/crm-auth';
import { canEditLead, getWarmStageMoq, isLostReason, isStage, LOST_REASONS, normalizeCrmSource, normalizeStage, PIPELINE_STAGES, STAGE_IDS, stageLabel } from '../src/lib/crm-stages';

let failed = 0;
const check = (label: string, ok: boolean, detail?: unknown) => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : '  ' + JSON.stringify(detail)}`);
};

// ---------- kata sandi
const h1 = hashPassword('Kopi-Susu-27!');
const h2 = hashPassword('Kopi-Susu-27!');
check('Kata sandi benar lolos verifikasi', verifyPassword('Kopi-Susu-27!', h1));
check('Kata sandi salah / beda huruf besar kecil ditolak', !verifyPassword('kopi-susu-27!', h1) && !verifyPassword('Kopi-Susu-27', h1) && !verifyPassword('', h1));
check('Hash tidak memuat kata sandi asli', !h1.includes('Kopi') && h1.startsWith('scrypt$'));
check('Dua hash kata sandi yang sama berbeda (salt acak)', h1 !== h2 && verifyPassword('Kopi-Susu-27!', h2));
check('Hash rusak / kosong ditolak tanpa error', !verifyPassword('x', null) && !verifyPassword('x', '') && !verifyPassword('x', 'abc') && !verifyPassword('', 'scrypt$zz$zz') && !verifyPassword('apa saja', 'scrypt$zz$zz'));

// kata sandi awal = nama (huruf besar/kecil tidak dibedakan)
check('Kata sandi awal: nama akun diterima tanpa peduli huruf besar/kecil/spasi', matchesInitialPassword('annisa', 'Annisa') && matchesInitialPassword(' ANNISA ', 'Annisa') && matchesInitialPassword('Annisa', 'Annisa'));
check('Kata sandi awal: tebakan lain ditolak', !matchesInitialPassword('diaz', 'Annisa') && !matchesInitialPassword('annis', 'Annisa') && !matchesInitialPassword('annisaa', 'Annisa') && !matchesInitialPassword('', 'Annisa') && !matchesInitialPassword('password', 'Annisa'));

// aturan kata sandi baru
check('Kata sandi baru: yang baik diterima', validateNewPassword('Kopi-Susu-27!', 'Annisa') === null && validateNewPassword('langitbiru88', 'Diaz') === null);
check('Kata sandi baru: kurang dari 8 karakter ditolak', validateNewPassword('abc123', 'Annisa') !== null && validateNewPassword('1234567', 'Annisa') !== null);
check('Kata sandi baru: tidak boleh sama dengan / memuat nama', validateNewPassword('annisa', 'Annisa') !== null && validateNewPassword('Annisa12345', 'Annisa') !== null && validateNewPassword('xxJESSICAxx', 'Jessica') !== null);
check('Kata sandi baru: terlalu umum / berulang ditolak', validateNewPassword('password', 'Diaz') !== null && validateNewPassword('12345678', 'Diaz') !== null && validateNewPassword('aaaaaaaaaa', 'Diaz') !== null && validateNewPassword('dreamlab123', 'Diaz') !== null);
check('Kata sandi baru: terlalu panjang ditolak', validateNewPassword('a1'.repeat(60), 'Diaz') !== null);

// ---------- token
const t1 = newToken();
const t2 = newToken();
check('Token sesi acak, cukup panjang, dan unik', t1 !== t2 && t1.length >= 40 && /^[A-Za-z0-9_-]+$/.test(t1));
check('Yang disimpan hanya hash SHA-256 token', sha256(t1).length === 64 && sha256(t1) !== t1 && sha256(t1) === sha256(t1));

// ---------- aturan edit
const head = { name: 'Head', role: 'head' as const };
const annisa = { name: 'Annisa', role: 'sales' as const };
check('Head boleh mengedit lead siapa pun', canEditLead(head, 'Diaz') && canEditLead(head, 'Annisa') && canEditLead(head, null));
check('Sales boleh mengedit lead miliknya (tanpa peduli huruf besar/kecil/spasi)', canEditLead(annisa, 'Annisa') && canEditLead(annisa, ' annisa ') && canEditLead(annisa, 'ANNISA'));
check('Sales TIDAK boleh mengedit lead sales lain', !canEditLead(annisa, 'Diaz') && !canEditLead(annisa, 'Jessica'));
check('Sales tidak boleh mengedit lead tanpa pemilik', !canEditLead(annisa, null) && !canEditLead(annisa, ''));
check('Nama mirip bukan pemilik (Annisa vs Annisaa)', !canEditLead(annisa, 'Annisaa') && !canEditLead(annisa, 'Annis'));

// ---------- tahap (Tahap 1: 10 stage tetap)
check('Ada 10 tahap sesuai spesifikasi Tahap 1, Lead Masuk paling kiri', PIPELINE_STAGES.length === 10 && PIPELINE_STAGES[0].id === 'lead_masuk', STAGE_IDS);
check(
  'Urutan 10 tahap tetap: Lead Masuk -> Cold -> Warm below 500 -> Warm up 500 -> Warm below 1000 -> Warm up 1000 -> Hot -> Sample -> Deal -> Lost',
  STAGE_IDS.join(',') === 'lead_masuk,cold,warm_below_500,warm_up_500,warm_below_1000,warm_up_1000,hot,sample,deal,lost',
  STAGE_IDS
);
check(
  'Pemetaan stage lama ke baru sesuai aturan (Traffic->Lead Masuk, Warm 500->Warm up 500, Warm 1000->Warm up 1000)',
  normalizeStage('traffic') === 'lead_masuk' &&
    normalizeStage('warm_500') === 'warm_up_500' &&
    normalizeStage('warm_up_500') === 'warm_up_500' &&
    normalizeStage('warm_1000') === 'warm_up_1000' &&
    normalizeStage('deal') === 'deal' &&
    normalizeStage('lost') === 'lost'
);
check('isStage menerima 10 stage baru + alias lama dan menolak nilai asing', isStage('hot') && isStage('cold') && isStage('warm_below_500') && isStage('warm_up_500') && isStage('deal') && isStage('lost') && !isStage('HOT') && !isStage('') && !isStage(null) && !isStage("traffic'; DROP TABLE leads;--"));
check('Label tahap; tahap kosong/lama dipetakan ke label baru', stageLabel('warm_500') === 'Warm up 500' && stageLabel('warm_below_500') === 'Warm below 500' && stageLabel(undefined) === 'Lead Masuk' && stageLabel('xx') === 'Lead Masuk');
check(
  'Pindah ke stage Warm mengisi perkiraan MOQ otomatis (below 500, 500, below 1000, 1000)',
  getWarmStageMoq('warm_below_500')?.label === 'below 500' &&
    getWarmStageMoq('warm_up_500')?.label === '500' &&
    getWarmStageMoq('warm_below_1000')?.label === 'below 1000' &&
    getWarmStageMoq('warm_up_1000')?.label === '1000' &&
    getWarmStageMoq('hot') === null
);
check(
  'Alasan Lost wajib salah satu dari 5 alasan resmi',
  LOST_REASONS.length === 5 &&
    isLostReason('Harga tidak masuk') &&
    isLostReason('MOQ terlalu besar') &&
    isLostReason('Tidak respons') &&
    isLostReason('Pilih pabrik lain') &&
    isLostReason('Belum siap modal') &&
    !isLostReason('Alasan ngawur')
);
check(
  'Deteksi source otomatis mengenali Google Ads, Meta Ads, Instagram, dan TikTok',
  normalizeCrmSource({ page_url: '/google-ads/maklon-parfum' }).source === 'Google Ads' &&
    normalizeCrmSource({ page_url: '/metaads/serum' }).source === 'Meta Ads' &&
    normalizeCrmSource({ referrer: 'https://l.instagram.com/' }).source === 'Instagram' &&
    normalizeCrmSource({ referrer: 'https://www.tiktok.com/' }).source === 'TikTok'
);

// ---------- Origin
const mk = (origin: string | null, host = 'dreamlab.id') =>
  new NextRequest('https://dreamlab.id/api/crm/lead', { method: 'PATCH', headers: { ...(origin ? { origin } : {}), host } });
check('Origin sama dengan host diterima', sameOrigin(mk('https://dreamlab.id')));
check('Origin situs lain ditolak (CSRF)', !sameOrigin(mk('https://evil.example')) && !sameOrigin(mk('https://dreamlab.id.evil.example')));
check('Origin rusak ditolak', !sameOrigin(mk('not a url')));
check('Tanpa Origin (non-browser) diterima; tetap wajib cookie sesi', sameOrigin(mk(null)));

// ---------- token layanan ERP (hanya-baca)
{
  const good = 'tok_' + 'a1b2c3d4e5'.repeat(4);
  const withAuth = (v?: string) => new NextRequest('https://dreamlab.id/api/lead-monitor/stats', { headers: v ? { authorization: v } : {} });
  delete process.env.LEAD_MONITOR_TOKEN;
  check('Token layanan: env belum diisi => tertutup (fail-closed), walau header ada', !serviceTokenOk(withAuth('Bearer ' + good)) && !serviceTokenOk(withAuth('Bearer ')));
  process.env.LEAD_MONITOR_TOKEN = 'pendek';
  check('Token layanan: env terlalu pendek (< 24) tetap tertutup', !serviceTokenOk(withAuth('Bearer pendek')));
  process.env.LEAD_MONITOR_TOKEN = good;
  check('Token layanan: token benar diterima', serviceTokenOk(withAuth('Bearer ' + good)) && serviceTokenOk(withAuth('bearer ' + good)));
  check('Token layanan: salah / tanpa header / skema lain ditolak', !serviceTokenOk(withAuth('Bearer ' + good + 'x')) && !serviceTokenOk(withAuth('Bearer ' + good.slice(0, -1))) && !serviceTokenOk(withAuth()) && !serviceTokenOk(withAuth('Basic ' + good)) && !serviceTokenOk(withAuth(good)));
  delete process.env.LEAD_MONITOR_TOKEN;
}

console.log(failed === 0 ? '\nSEMUA LOLOS' : `\n${failed} GAGAL`);
process.exit(failed === 0 ? 0 : 1);
