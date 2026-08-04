/**
 * seo-lang.ts
 *
 * SATU-SATUNYA sumber pemetaan bahasa untuk halaman English (/en/).
 *
 * Tanggung jawab:
 *   1. getEnPath(idPath)  → konversi path Indonesia -> path English.
 *   2. buildAlternates()  → hasilkan objek `alternates` Next.js metadata
 *      berisi: canonical (self) + hreflang id/en/x-default.
 *
 * Halaman yang BELUM ada versi English TIDAK masuk EN_TRANSLATED_PATHS,
 * sehingga tidak akan diberi hreflang en (mencegah error "hreflang to
 * non-existent page").
 *
 * Format path disimpan TANPA trailing slash, konsisten dengan
 * normalizeSeoPath() di seo-url-policy.ts.
 */
import { toCanonicalUrl, normalizeSeoPath } from './seo-url-policy';

/** Halaman yang SUDAH punya versi English (/en/...). */
export const EN_TRANSLATED_PATHS = new Set<string>([
  '/',
  '/about-us',
  '/services',
  '/our-client',
  '/contact-us',
]);

/** Path English untuk path Indonesia tertentu (null kalau belum ada versi EN). */
export function getEnPath(idPath: string): string | null {
  const path = normalizeSeoPath(idPath);
  if (!EN_TRANSLATED_PATHS.has(path)) return null;
  return path === '/' ? '/en/' : `/en${path}/`;
}

/** Apakah path ini halaman English (/en/...)? */
export function isEnPath(input: string): boolean {
  return normalizeSeoPath(input).startsWith('/en');
}

/**
 * Bangun `alternates` untuk metadata Next.js.
 *
 * Dipakai di halaman Indonesia ATAU English — otomatis menghasilkan
 * canonical self + hreflang id/en/x-default yang saling menunjuk.
 *
 * @param currentPath path halaman saat ini (mis. '/about-us/' atau '/en/about-us/')
 */
export function buildAlternates(currentPath: string) {
  const normalized = normalizeSeoPath(currentPath);
  const isEn = isEnPath(normalized);

  // Path "base" = versi Indonesia (tanpa prefix /en)
  const idPath = isEn ? normalized.replace(/^\/en/, '') || '/' : normalized;
  const enPath = getEnPath(idPath);

  const canonicalUrl = toCanonicalUrl(normalized);
  const idUrl = toCanonicalUrl(idPath);

  // Halaman Indonesia tanpa versi EN -> hanya canonical (jangan tambah hreflang en)
  if (!isEn && !enPath) {
    return { canonical: canonicalUrl };
  }

  const enUrl = enPath ? toCanonicalUrl(enPath) : idUrl;

  return {
    canonical: canonicalUrl,
    languages: {
      'id-ID': idUrl,
      'en-US': enUrl,
      'x-default': idUrl,
    },
  };
}

/** True kalau halaman punya pasangan English. */
export function hasEnVersion(path: string): boolean {
  return getEnPath(path) !== null;
}

/**
 * Ubah href supaya sesuai bahasa saat ini.
 * - isEn=true & path punya versi EN -> prefix /en (mis. /about-us -> /en/about-us/)
 * - selainnya -> biarkan path asli (fallback ke halaman Indonesia)
 */
export function localizeHref(path: string, isEn: boolean): string {
  if (!isEn) return path;
  if (path === "/") return "/en/";
  const enPath = getEnPath(path);
  if (enPath) return enPath;
  // Kategori produk (/produk/...) belum punya halaman English -> arahkan ke
  // katalog English (/en/produk/) agar pengunjung tetap berada di konten English.
  if (/^\/produk(\/|$)/.test(path)) return "/en/produk/";
  return path;
}
