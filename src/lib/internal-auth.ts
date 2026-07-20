import { NextRequest } from 'next/server';

/**
 * Proteksi sederhana untuk endpoint internal (statistik, perbandingan
 * Kommo, dll) yang TIDAK boleh diakses publik — bocorin data distribusi
 * lead & performa CS ke siapa saja yang tahu URL-nya.
 *
 * Cara pakai: set env INTERNAL_STATS_KEY, lalu akses endpoint dengan
 * salah satu dari:
 *   - Header:  x-internal-key: <nilai INTERNAL_STATS_KEY>
 *   - Query:   ?key=<nilai INTERNAL_STATS_KEY>
 *
 * Kalau INTERNAL_STATS_KEY belum di-set di env, endpoint DITUTUP by
 * default (bukan malah dibuka publik) — supaya lupa konfigurasi tidak
 * berakhir jadi kebocoran data.
 */
export function isInternalRequestAuthorized(req: NextRequest): boolean {
  const expected = process.env.INTERNAL_STATS_KEY;

  if (!expected) {
    console.error(
      '[internal-auth] INTERNAL_STATS_KEY belum di-set di environment variables — ' +
        'endpoint internal ditutup by default sampai key ini dikonfigurasi.'
    );
    return false;
  }

  const provided = req.headers.get('x-internal-key') ?? req.nextUrl.searchParams.get('key');

  // DEBUG SEMENTARA (2026-07-20) — hapus setelah masalah 401 ketemu.
  // Tidak nge-log value asli, cuma panjang & beberapa karakter pertama/
  // akhir, supaya aman tapi tetap bisa dipakai bandingkan typo/whitespace.
  console.error('[internal-auth][DEBUG]', {
    expectedLength: expected.length,
    expectedPreview: `${expected.slice(0, 3)}...${expected.slice(-3)}`,
    providedRaw: provided,
    providedLength: provided?.length ?? 0,
    providedPreview: provided ? `${provided.slice(0, 3)}...${provided.slice(-3)}` : null,
    match: provided === expected,
    fromHeader: Boolean(req.headers.get('x-internal-key')),
    fromQuery: Boolean(req.nextUrl.searchParams.get('key')),
  });

  return provided === expected;
}
