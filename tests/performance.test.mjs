import test from 'node:test';
import assert from 'node:assert/strict';

function computePerformanceMetrics({ spend, otherCosts = 0, leads, warmPlus, sample, deal, revenue }) {
  return {
    spend,
    leads,
    cpl: leads > 0 ? Math.round(spend / leads) : 0,
    warmPlus,
    costPerWarmPlus: warmPlus > 0 ? Math.round(spend / warmPlus) : 0,
    sample,
    costPerSample: sample > 0 ? Math.round(spend / sample) : 0,
    deal,
    cacAd: deal > 0 ? Math.round(spend / deal) : 0,
    cacFull: deal > 0 ? Math.round((spend + otherCosts) / deal) : 0,
    revenue,
    roas: spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0,
  };
}

function resolveSpendConflict(rows) {
  const autoKeys = new Set();
  for (const r of rows) {
    if (r.input_type === 'auto') autoKeys.add(`${r.tanggal}::${r.source}::${r.campaign_key || ''}`);
  }
  return rows.map((r) => ({
    ...r,
    overriddenByAuto: r.input_type === 'manual' && autoKeys.has(`${r.tanggal}::${r.source}::${r.campaign_key || ''}`),
  }));
}

test('Hitungan CPL, Cost/Sample, CAC Iklan, CAC Penuh, dan ROAS sesuai hitungan manual', () => {
  const m = computePerformanceMetrics({
    spend: 3_000_000,
    otherCosts: 1_000_000,
    leads: 100,
    warmPlus: 40,
    sample: 10,
    deal: 2,
    revenue: 15_000_000,
  });
  assert.equal(m.cpl, 30_000);
  assert.equal(m.costPerWarmPlus, 75_000);
  assert.equal(m.costPerSample, 300_000);
  assert.equal(m.cacAd, 1_500_000);
  assert.equal(m.cacFull, 2_000_000);
  assert.equal(m.roas, 5);
});

test('Aturan bentrok: data auto mengalahkan manual pada (tanggal, source, campaign_key) yang sama', () => {
  const resolved = resolveSpendConflict([
    { tanggal: '2026-11-10', source: 'Meta Ads', campaign_key: 'mof-parfum', input_type: 'manual', amount: 500_000 },
    { tanggal: '2026-11-10', source: 'Meta Ads', campaign_key: 'mof-parfum', input_type: 'auto', amount: 650_000 },
    { tanggal: '2026-11-10', source: 'TikTok', campaign_key: 'tt-live', input_type: 'manual', amount: 300_000 },
  ]);

  assert.equal(resolved[0].overriddenByAuto, true);
  assert.equal(resolved[1].overriddenByAuto, false);
  assert.equal(resolved[2].overriddenByAuto, false);

  const effectiveTotal = resolved.filter((r) => !r.overriddenByAuto).reduce((s, r) => s + r.amount, 0);
  assert.equal(effectiveTotal, 950_000);
});
