/**
 * Uji otomasi Warm (murni, tanpa database):  npx tsx scripts/test-crm-auto-warm.ts
 * Aturan: 5 percakapan = 5 pesan DUA ARAH (masuk + keluar). Tidak pernah mundur dari tahap lebih lanjut.
 */
import assert from 'node:assert/strict';
import { AUTO_WARM_MIN_MESSAGES, decideAutoWarm, warmStageForMoq } from '../src/lib/crm-auto-warm';
import { normalizeStage } from '../src/lib/crm-stages';

let n = 0;
const t = (name: string, fn: () => void) => { fn(); n++; console.log(`ok  ${name}`); };

t('ambang = 5 pesan dua arah', () => assert.equal(AUTO_WARM_MIN_MESSAGES, 5));
t('5 pesan di traffic -> warm_500 (MOQ belum diketahui)', () => {
  assert.equal(decideAutoWarm({ currentStage: 'traffic', messageCount: 5, moq: null }), 'warm_500');
});
t('4 pesan belum cukup', () => {
  assert.equal(decideAutoWarm({ currentStage: 'traffic', messageCount: 4, moq: null }), null);
});
t('pemanggil lama (inboundCount) tetap bekerja', () => {
  assert.equal(decideAutoWarm({ currentStage: 'traffic', inboundCount: 5, moq: null }), 'warm_500');
});
t('tahap kosong / lead_masuk dianggap traffic', () => {
  assert.equal(decideAutoWarm({ currentStage: null, messageCount: 9, moq: 500 }), 'warm_500');
  assert.equal(decideAutoWarm({ currentStage: 'lead_masuk', messageCount: 9, moq: 500 }), 'warm_500');
});
t('cold ikut dipindah ke Warm', () => {
  assert.equal(decideAutoWarm({ currentStage: 'cold', messageCount: 5, moq: 300 }), 'warm_500');
});
t('MOQ 501..999 -> warm_up_500; >= 1000 -> warm_1000; <= 500 -> warm_500', () => {
  assert.equal(warmStageForMoq(500), 'warm_500');
  assert.equal(warmStageForMoq(501), 'warm_up_500');
  assert.equal(warmStageForMoq(999), 'warm_up_500');
  assert.equal(warmStageForMoq(1000), 'warm_1000');
  assert.equal(warmStageForMoq(50000), 'warm_1000');
});
t('MOQ tidak sah (NaN, negatif, 0) -> warm_500', () => {
  for (const m of [NaN, -5, 0, undefined, null]) assert.equal(warmStageForMoq(m as never), 'warm_500');
});
t('lead di tahap lebih lanjut TIDAK kembali ke Warm (semua kombinasi, termasuk nama tahap lama)', () => {
  const further = ['warm_500', 'warm_up_500', 'warm_1000', 'warm', 'warm_below_500', 'warm_below_1000', 'warm_up_1000', 'hot', 'sample', 'deal', 'loker', 'tidak_jelas', 'lost'];
  for (const stage of further)
    for (const count of [0, 5, 6, 50, 1000])
      for (const moq of [null, 100, 500, 800, 5000])
        assert.equal(decideAutoWarm({ currentStage: stage, messageCount: count, moq }), null, `${stage}/${count}/${moq}`);
});
t('nama tahap lama dikenali UI (tidak jatuh ke Traffic)', () => {
  assert.equal(normalizeStage('warm_below_500'), 'warm_500');
  assert.equal(normalizeStage('warm_below_1000'), 'warm_up_500');
  assert.equal(normalizeStage('warm_up_1000'), 'warm_1000');
  assert.equal(normalizeStage('lead_masuk'), 'traffic');
  assert.equal(normalizeStage('hot'), 'hot');
});

console.log(`\n${n}/${n} lulus`);
