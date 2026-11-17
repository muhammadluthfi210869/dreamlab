import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Landing page Promo Kemerdekaan khusus funnel GOOGLE ADS.
// Konten sama dengan public/promo-kemerdekaan/index.html; JavaScript pada
// halaman memaksa CTA ke /promo-kemerdekaan/thankyou-googleads/ (route
// dideteksi lewat pathname /google-ads/promo-kemerdekaan).
export function GET() {
  const filePath = path.join(process.cwd(), 'public', 'promo-kemerdekaan', 'index.html');
  try {
    let html = fs.readFileSync(filePath, 'utf-8');
    html = html
      .replace(
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="robots" content="noindex, nofollow">'
      )
      .replace(
        '<title>Promo Kemerdekaan Dreamlab — Merdeka dari MOQ Tinggi, Mulai dari 200 Set</title>',
        '<title>Promo Kemerdekaan Maklon Kosmetik (Google Ads) | Dreamlab</title>'
      )
      .replace(
        '<meta property="og:title" content="Promo Kemerdekaan Dreamlab — Merdeka dari MOQ Tinggi">',
        '<meta property="og:title" content="Promo Kemerdekaan Maklon Kosmetik (Google Ads) | Dreamlab">'
      );
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch {
    return new NextResponse('Halaman tidak ditemukan', { status: 404 });
  }
}