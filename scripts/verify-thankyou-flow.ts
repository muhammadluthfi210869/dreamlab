/**
 * verify-thankyou-flow.ts
 *
 * Verifikasi komponen ThankYouRoundRobin dengan props minimal.
 */

import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThankYouRoundRobin } from '../src/components/ThankYouRoundRobin';
import {
  buildWhatsAppUrl,
} from '../src/lib/lead-routing';

function verifyWhatsAppUrlBuilder() {
  const phone = '6287712232389';
  const message = 'Halo, saya tertarik dengan jasa maklon Dreamlab.';
  const url = buildWhatsAppUrl(phone, message);
  assert(url.startsWith('https://wa.me/'), 'WA URL harus mulai dengan wa.me');
  assert(url.includes(phone), 'WA URL harus mengandung nomor');
  assert(url.includes(encodeURIComponent(message)), 'WA URL harus mengandung pesan ter-encode');
  console.log('✅ buildWhatsAppUrl: OK');
}

function verifyComponentShell() {
  const html = renderToStaticMarkup(
    React.createElement(ThankYouRoundRobin, {
      defaultSource: 'google-ads',
      title: 'Terima Kasih!',
      description: 'Kami sudah menerima minat Anda.',
      message: 'Hi Dreamlab saya mengetahui dari Google saya ingin konsultasi untuk brand saya, apakah bisa dibantu?',
    })
  );

  const buttonCount = (html.match(/<button\b/g) || []).length;
  assert.equal(buttonCount, 3, 'Thank you flow must render exactly 3 CTA buttons');
  assert(html.includes('Nomor aktif'), 'Komponen harus menampilkan status nomor');
  console.log('✅ ThankYouRoundRobin render: OK');
}

function main() {
  verifyWhatsAppUrlBuilder();
  verifyComponentShell();
  console.log('\n✅ Semua verifikasi lolos.');
}

main();
