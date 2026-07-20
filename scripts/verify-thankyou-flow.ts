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

  // Komponen disederhanakan jadi 1 tombol CTA utama di commit 45db811
  // (2026-07-15, "sederhanakan jadi 1 tombol CTA") — assertion ini
  // sebelumnya masih ngecek 3 tombol dari desain lama, bikin verify:all
  // selalu gagal walau komponennya sendiri sudah benar.
  const buttonCount = (html.match(/<button\b/g) || []).length;
  assert.equal(buttonCount, 1, 'Thank you flow must render exactly 1 CTA button (desain saat ini: satu tombol utama)');
  assert(html.includes('Menyiapkan tim kami') || html.includes('Menghubungkan Anda'), 'Komponen harus menampilkan status assignment CS');
  console.log('✅ ThankYouRoundRobin render: OK');
}

function main() {
  verifyWhatsAppUrlBuilder();
  verifyComponentShell();
  console.log('\n✅ Semua verifikasi lolos.');
}

main();
