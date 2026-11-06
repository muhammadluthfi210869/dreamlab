import assert from 'node:assert/strict';
import {
  calcHpp,
  calcHppQuick,
  budgetBucket,
  waLine,
} from '../src/components/HppCalculator';

// 1. Quick mode: Rp100.000, 30%, 500 pcs → targetHpp 30.000, total 15.000.000, sisa 70.000, budget "< 25 Juta"
const quick500 = calcHppQuick({
  price: 100000,
  hppPct: 30,
  qty: 500,
});
assert.equal(quick500.targetHpp, 30000, 'Expected quick targetHpp = 30000');
assert.equal(quick500.total, 15000000, 'Expected quick total (500 pcs) = 15000000');
assert.equal(quick500.sisaPerUnit, 70000, 'Expected quick sisaPerUnit = 70000');
assert.equal(budgetBucket(quick500.total), '< 25 Juta', 'Expected budget "< 25 Juta"');

// 2. Quick mode: Rp100.000, 30%, 1.000 pcs → total 30.000.000, budget "25–50 Juta"
const quick1000 = calcHppQuick({
  price: 100000,
  hppPct: 30,
  qty: 1000,
});
assert.equal(quick1000.targetHpp, 30000, 'Expected quick targetHpp = 30000');
assert.equal(quick1000.total, 30000000, 'Expected quick total (1000 pcs) = 30000000');
assert.equal(budgetBucket(quick1000.total), '25–50 Juta', 'Expected budget "25–50 Juta"');

// 3. Detail mode defaults → targetHpp 33.000, modal 33.000.000, labaPerPcs 30.000, budget "25–50 Juta"
const defaults = calcHpp({
  price: 100000,
  channelCut: 12,
  marketing: 20,
  ops: 5,
  margin: 30,
  qty: 1000,
});

assert.equal(defaults.net, 88000, 'Expected net = 88000');
assert.equal(defaults.hpp, 33000, 'Expected hpp = 33000');
assert.equal(defaults.ratio, 0.33, 'Expected ratio = 0.33');
assert.equal(defaults.modal, 33000000, 'Expected modal = 33000000');
assert.equal(defaults.labaPerPcs, 30000, 'Expected labaPerPcs = 30000');
assert.equal(defaults.valid, true, 'Expected valid = true');
assert.equal(
  budgetBucket(defaults.modal),
  '25–50 Juta',
  'Expected budgetBucket = "25–50 Juta"'
);
assert.equal(
  waLine('Body Lotion', 100000, defaults.hpp, 1000),
  'Simulasi HPP: Body Lotion, harga jual Rp100.000, target HPP Rp33.000/pcs, 1.000 pcs.'
);

// 4. Invalid combination (margin 50%, marketing 40%, channel 12%, ops 5% => >100%)
const exceeded = calcHpp({
  price: 100000,
  channelCut: 12,
  marketing: 40,
  ops: 5,
  margin: 50,
  qty: 1000,
});
assert.equal(exceeded.valid, false, 'Expected valid = false when costs + margin exceed price');
assert.ok(exceeded.hpp <= 0, 'Expected hpp <= 0 when costs + margin exceed price');

console.log('[test-hpp-calculator] PASS: All quick mode, detail mode, budgetBucket, and waLine assertions passed.');
