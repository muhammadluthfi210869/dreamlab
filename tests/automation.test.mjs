import test from 'node:test';
import assert from 'node:assert/strict';

function computeBusinessSeconds(startDate, endDate, workStart = '08:00', workEnd = '20:00') {
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  if (endMs <= startMs) return 0;
  const [sh, sm] = workStart.split(':').map(Number);
  const [eh, em] = workEnd.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const WIB = 7 * 3600_000;
  const startWib = startMs + WIB;
  const endWib = endMs + WIB;
  const d0 = Math.floor(startWib / 86_400_000) * 86_400_000;
  const d1 = Math.floor(endWib / 86_400_000) * 86_400_000;
  let total = 0;
  for (let d = d0; d <= d1; d += 86_400_000) {
    const oStart = Math.max(startWib, d + startMin * 60_000);
    const oEnd = Math.min(endWib, d + endMin * 60_000);
    if (oEnd > oStart) total += oEnd - oStart;
  }
  return Math.round(total / 1000);
}

function computeFuStatus({ stage, lastMessageDirection, lastSalesMsgAt, now }) {
  const warmOrHot = new Set(['warm_below_500', 'warm_up_500', 'warm_below_1000', 'warm_up_1000', 'hot']);
  if (!warmOrHot.has(stage) || lastMessageDirection !== 'outbound' || !lastSalesMsgAt) return null;
  const WIB = 7 * 3600_000;
  const diffDays = Math.floor((now.getTime() + WIB) / 86_400_000) - Math.floor((lastSalesMsgAt.getTime() + WIB) / 86_400_000);
  if (diffDays >= 7) return 'Saran Lost';
  if (diffDays >= 3) return 'FU 2';
  if (diffDays >= 1) return 'FU 1';
  return null;
}

function mergeCrmSegmentTag(existingTags, segmentTag, shouldHave) {
  const nonCrm = existingTags.filter((t) => !t.startsWith('crm-'));
  const otherCrm = existingTags.filter((t) => t.startsWith('crm-') && t !== segmentTag);
  const next = [...nonCrm, ...otherCrm];
  if (shouldHave) next.push(segmentTag);
  return next;
}

test('Waktu balas jam kerja: chat 19:50 WIB dibalas 08:10 WIB besok = 20 menit (1200 detik)', () => {
  const t1 = new Date('2026-11-16T19:50:00+07:00');
  const t2 = new Date('2026-11-17T08:10:00+07:00');
  assert.equal(computeBusinessSeconds(t1, t2), 1200);
});

test('Follow-up FU 1 (H+1), FU 2 (H+3), Saran Lost (H+7), dan bukan FU jika pesan terakhir dari pelanggan', () => {
  const now = new Date('2026-11-17T10:00:00+07:00');
  assert.equal(
    computeFuStatus({ stage: 'hot', lastMessageDirection: 'outbound', lastSalesMsgAt: new Date('2026-11-16T09:00:00+07:00'), now }),
    'FU 1'
  );
  assert.equal(
    computeFuStatus({ stage: 'warm_up_500', lastMessageDirection: 'outbound', lastSalesMsgAt: new Date('2026-11-14T15:00:00+07:00'), now }),
    'FU 2'
  );
  assert.equal(
    computeFuStatus({ stage: 'hot', lastMessageDirection: 'outbound', lastSalesMsgAt: new Date('2026-11-10T10:00:00+07:00'), now }),
    'Saran Lost'
  );
  assert.equal(
    computeFuStatus({ stage: 'hot', lastMessageDirection: 'inbound', lastSalesMsgAt: new Date('2026-11-14T10:00:00+07:00'), now }),
    null
  );
});

test('Sinkron tag segmen crm-* tidak menyentuh tag non-crm', () => {
  const res = mergeCrmSegmentTag(['vip', 'nexerp-sync', 'crm-lama'], 'crm-sample-nov', true);
  assert.deepEqual(res, ['vip', 'nexerp-sync', 'crm-lama', 'crm-sample-nov']);
});
