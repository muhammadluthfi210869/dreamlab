/**
 * Uji otomasi Warm (murni, tanpa database):  npx tsx scripts/test-crm-auto-warm.ts
 */
import assert from 'node:assert/strict';
import { AUTO_WARM_MIN_INBOUND, decideAutoWarm, warmStageForMoq } from '../src/lib/crm-auto-warm';

let n = 0;
const t = (name: string, fn: () => void) => { fn(); n++; console.log(`ok  ${name}`); };

t('5 pesan masuk di traffic -> warm_500 (MOQ belum diketahui)', () => {
  assert.equal(decideAutoWarm({ currentStage: 'traffic', inboundCount: 5, moq: null }), 'warm_500');
});
t('4 pesan masuk belum cukup', () => {
  assert.equal(decideAutoWarm({ currentStage: 'traffic', inboundCount: 4, moq: null }), null);
});
t('tahap kosong dianggap traffic', () => {
  assert.equal(decideAutoWarm({ currentStage: null, inboundCount: 9, moq: 500 }), 'warm_500');
});
t('cold ikut dipindah ke Warm', () => {
  assert.equal(decideAutoWarm({ currentStage: 'cold', inboundCount: 5, moq: 300 }), 'warm_500');
});
t('MOQ 501..999 -> warm_up_500; >= 1000 -> warm_1000', () => {
  assert.equal(warmStageForMoq(501), 'warm_up_500');
  assert.equal(warmStageForMoq(999), 'warm_up_500');
  assert.equal(warmStageForMoq(1000), 'warm_1000');
  assert.equal(warmStageForMoq(50000), 'warm_1000');
});
t('MOQ tidak sah (NaN, negatif, 0) -> warm_500', () => {
  for (const m of [NaN, -5, 0, undefined, null]) assert.equal(warmStageForMoq(m as never), 'warm_500');
});
t('lead di tahap lebih lanjut TIDAK kembali ke Warm (semua kombinasi)', () => {
  for (const stage of ['warm_500', 'warm_up_500', 'warm_1000', 'warm', 'hot', 'sample', 'deal', 'loker', 'tidak_jelas'])
    for (const count of [0, 5, 6, 50, 1000])
      for (const moq of [null, 100, 500, 800, 5000])
        assert.equal(decideAutoWarm({ currentStage: stage, inboundCount: count, moq }), null, `${stage}/${count}/${moq}`);
});
t('ambang = 5', () => assert.equal(AUTO_WARM_MIN_INBOUND, 5));

console.log(`\n${n}/${n} lulus`);
