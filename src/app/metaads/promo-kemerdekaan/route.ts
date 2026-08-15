import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Landing page Promo Kemerdekaan khusus funnel META ADS.
// Konten sama dengan public/promo-kemerdekaan/index.html; JavaScript pada
// halaman memaksa CTA ke /ads/thankyou/metaads/ (route dideteksi lewat
// pathname /metaads/promo-kemerdekaan).
export function GET() {
  const filePath = path.join(process.cwd(), 'public', 'promo-kemerdekaan', 'index.html');
  try {
    const html = fs.readFileSync(filePath, 'utf-8');
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch {
    return new NextResponse('Halaman tidak ditemukan', { status: 404 });
  }
}