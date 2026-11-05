import assert from 'node:assert/strict';
import { calcHpp, budgetBucket, waLine } from '../src/components/HppCalculator';

// 1. Default values test per specification
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
assert.equal(budgetBucket(defaults.modal), '25–50 Juta', 'Expected budgetBucket = "25–50 Juta"');
assert.equal(
  waLine('Body Lotion', 100000, defaults.hpp, 1000),
  'Simulasi HPP: Body Lotion, harga jual Rp100.000, target HPP Rp33.000/pcs, 1.000 pcs.'
);

// 2. Invalid combination (margin 50%, marketing 40%, channel 12%, ops 5% => >100%)
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

console.log('[test-hpp-calculator] PASS: All calcHpp, budgetBucket, and waLine assertions passed.');

