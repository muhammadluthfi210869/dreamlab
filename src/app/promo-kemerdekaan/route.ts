import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Menyajikan landing page promo kemerdekaan (file statis public/promo-kemerdekaan/index.html)
// di URL /promo-kemerdekaan/. Tanpa route ini, catch-all [...slug] mengalahkan
// file statis untuk URL direktori → halaman tampil sebagai 404.
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
