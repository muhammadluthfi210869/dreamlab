import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Pure algorithm mirror of pickNextRoundRobinSales from src/lib/crm-round-robin.ts
 * + simulated transactional concurrency test for 20 parallel leads.
 */
function pickNextRoundRobinSales(salesList, lastSalesId) {
  const ordered = salesList
    .filter((s) => s.role === 'busdev' && !s.deleted_at)
    .sort((a, b) => a.rr_order - b.rr_order || a.id - b.id);

  if (ordered.length === 0) {
    return { sales: null, skippedSales: [], queued: true };
  }

  const lastIdx = lastSalesId !== null ? ordered.findIndex((s) => Number(s.id) === Number(lastSalesId)) : -1;
  const skippedSales = [];

  for (let step = 1; step <= ordered.length; step++) {
    const idx = (lastIdx + step) % ordered.length;
    const candidate = ordered[idx];
    if (candidate.is_active) {
      return { sales: candidate, skippedSales, queued: false };
    }
    skippedSales.push(candidate.name);
  }

  return { sales: null, skippedSales, queued: true };
}

test('Round robin melewati sales OFF dan mencatat skipped_sales', () => {
  const sales = [
    { id: 1, name: 'Jessica', role: 'busdev', is_active: true, rr_order: 1, deleted_at: null },
    { id: 2, name: 'Annisa', role: 'busdev', is_active: false, rr_order: 2, deleted_at: null },
    { id: 3, name: 'Diaz', role: 'busdev', is_active: true, rr_order: 3, deleted_at: null },
  ];

  const r1 = pickNextRoundRobinSales(sales, 1); // after Jessica -> skip Annisa -> Diaz
  assert.equal(r1.queued, false);
  assert.equal(r1.sales.name, 'Diaz');
  assert.deepEqual(r1.skippedSales, ['Annisa']);

  const r2 = pickNextRoundRobinSales(sales, 3); // after Diaz -> wrap to Jessica
  assert.equal(r2.queued, false);
  assert.equal(r2.sales.name, 'Jessica');
  assert.deepEqual(r2.skippedSales, []);
});

test('Semua sales OFF -> masuk antrean (queued = true)', () => {
  const sales = [
    { id: 1, name: 'Jessica', role: 'busdev', is_active: false, rr_order: 1, deleted_at: null },
    { id: 2, name: 'Annisa', role: 'busdev', is_active: false, rr_order: 2, deleted_at: null },
    { id: 3, name: 'Diaz', role: 'busdev', is_active: false, rr_order: 3, deleted_at: null },
  ];

  const r = pickNextRoundRobinSales(sales, 1);
  assert.equal(r.queued, true);
  assert.equal(r.sales, null);
  assert.equal(r.skippedSales.length, 3);
});

test('Sales yang diarsipkan (deleted_at != null) keluar dari giliran', () => {
  const sales = [
    { id: 1, name: 'Jessica', role: 'busdev', is_active: true, rr_order: 1, deleted_at: null },
    { id: 4, name: 'Irma', role: 'busdev', is_active: true, rr_order: 2, deleted_at: '2026-10-31T00:00:00Z' },
    { id: 3, name: 'Diaz', role: 'busdev', is_active: true, rr_order: 3, deleted_at: null },
  ];

  const r = pickNextRoundRobinSales(sales, 1);
  assert.equal(r.sales.name, 'Diaz');
  assert.deepEqual(r.skippedSales, []);
});

test('Simulasi konkurensi 20 lead paralel terbagi merata dengan kunci transaksi', async () => {
  const sales = [
    { id: 1, name: 'Jessica', role: 'busdev', is_active: true, rr_order: 1, deleted_at: null },
    { id: 3, name: 'Diaz', role: 'busdev', is_active: true, rr_order: 2, deleted_at: null },
  ];

  let lastSalesId = null;
  let lock = Promise.resolve();
  const counts = { Jessica: 0, Diaz: 0 };

  const assignSerialized = () => {
    const run = lock.then(async () => {
      const picked = pickNextRoundRobinSales(sales, lastSalesId);
      lastSalesId = picked.sales.id;
      counts[picked.sales.name]++;
      return picked.sales.name;
    });
    lock = run.catch(() => undefined);
    return run;
  };

  await Promise.all(Array.from({ length: 20 }, () => assignSerialized()));
  assert.equal(counts.Jessica, 10);
  assert.equal(counts.Diaz, 10);
});
