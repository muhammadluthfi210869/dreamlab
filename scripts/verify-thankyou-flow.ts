import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThankYouRoundRobin } from '../src/components/ThankYouRoundRobin';
import {
  buildLeadAssignmentKey,
  buildWhatsAppUrl,
  createLeadAssignmentRecord,
  createWhatsAppRedirectController,
  getSessionLeadAssignment,
  readLeadAssignment,
  writeLeadAssignment,
} from '../src/lib/lead-routing';
import {
  ROUND_ROBIN_BUSDEVS,
  getFallbackBusdev,
  resolveRoundRobinIndex,
} from '../src/lib/round-robin-config';

type MemoryStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function createMemoryStorage(): MemoryStorage {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}

function verifyRoundRobinSpread() {
  const counts = [0, 0, 0];

  for (let i = 0; i < 3000; i += 1) {
    counts[resolveRoundRobinIndex(i, ROUND_ROBIN_BUSDEVS.length)] += 1;
  }

  assert.deepEqual(counts, [1000, 1000, 1000], 'Round robin distribution must stay even');
}

function verifyFallbackAndCache() {
  const storage = createMemoryStorage();
  const key = buildLeadAssignmentKey('ads/thankyou/google', 'google-ads');
  const fallback = getFallbackBusdev();
  const record = createLeadAssignmentRecord(fallback, {
    source: 'google-ads',
    routeKey: 'ads/thankyou/google',
    origin: 'fallback',
    assignedAt: Date.now(),
  });

  writeLeadAssignment(storage, key, record);

  const parsed = readLeadAssignment(storage, key);
  assert(parsed, 'Lead assignment should round-trip through storage');
  assert.equal(parsed?.phone, fallback.phone);
  assert.equal(parsed?.routeKey, 'ads/thankyou/google');
  assert.equal(parsed?.source, 'google-ads');

  const fresh = getSessionLeadAssignment(storage, key);
  assert(fresh, 'Fresh assignment should be reusable from cache');
}

function verifyControllerLogic() {
  const phone = ROUND_ROBIN_BUSDEVS[0].phone;
  const message = 'Halo Dreamlab, saya ingin konsultasi maklon. Bisa dibantu?';
  const controller = createWhatsAppRedirectController({
    phone,
    message,
    autoRedirectMs: 3000,
  });

  const expectedUrl = buildWhatsAppUrl(phone, message);
  assert.equal(controller.getUrl(), expectedUrl, 'Controller must generate the expected WA URL');

  const manual = controller.click();
  assert.equal(manual, expectedUrl, 'Manual click should navigate to the same WA URL');
  assert.equal(controller.autoRedirect(), null, 'Auto redirect must stop after manual click');

  const secondController = createWhatsAppRedirectController({
    phone,
    message,
    autoRedirectMs: 3000,
  });
  assert.equal(secondController.autoRedirect(), expectedUrl, 'Auto redirect should work when there is no click');
  assert.equal(secondController.click(), null, 'Manual click should be consumed after auto redirect');
}

function verifyComponentShell() {
  const html = renderToStaticMarkup(
    React.createElement(ThankYouRoundRobin, {
      routeKey: 'ads/thankyou/google',
      defaultSource: 'google-ads',
      title: 'Terima Kasih!',
      description: 'Kami sudah menerima minat Anda.',
      message: 'Hi Dreamlab saya mengetahui dari Google saya ingin konsultasi untuk brand saya, apakah bisa dibantu?',
    })
  );

  const buttonCount = (html.match(/<button\b/g) || []).length;
  assert.equal(buttonCount, 3, 'Thank you flow must render exactly 3 CTA buttons');
  assert(html.includes('Auto redirect aktif setelah 3 detik'), 'Thank you flow should expose the 3 second timeout copy');
}

function main() {
  verifyRoundRobinSpread();
  verifyFallbackAndCache();
  verifyControllerLogic();
  verifyComponentShell();

  console.log('Thank-you lead flow verification passed.');
}

main();
