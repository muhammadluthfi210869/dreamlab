const SITE_ORIGIN = 'https://dreamlab.id';

const redirectOnlyPaths = [
  '/thankyou-page',
  '/thankyoupage-google',
  '/contact-form-dreamlab',
  '/cms_block_cat/pop-up-form',
  '/e-floating-buttons/popup-website',
  '/https-dreamlab-id-dreamlab-visit-ici-2026',
  '/maklon-kosmetik-terbaik-english',
  '/jadwalkanvisitmeeting.php',
  '/homepage.php',
  '/Homepage',
  '/result-body-lotion-a',
  '/thank-you-maklon',
  '/dreampreneur-id-konfirmasi-pembayaran',
  '/academy-beautypreneur',
  '/advantages-and-challenges-in-registering-hki-products-and-bpom-maklon-kosmetik',
  '/menghadapi-tantangan-dalam-industri-maklon-kosmetik',
  '/career-2',
  '/career-3',
  '/newest-innovations-in-the-world-of-skincare-opportunities-for-women-careers',
  '/perbedaan-moisturizer-gel-vs-cream/dreamlab',
  '/category/bisnis-kosmetik/page/4',
  '/news-blog/page/8',
  '/memunculkan-keranjang-reels',
  '/pabrik-parfum-surabaya',
  '/maklon-shampoo-psoriasis-formula-juara',
  '/dupe-parfum-nagita-slavina-tahan-lama',
  '/state-of-beauty-2025-tren-kecantikan-pertumbuhan-industri',
  '/potensi-bisnis-babycare',
  '/maklon-face-mist',
  '/solusi-bisnis-body-serum-aha-2025-tren-pasar-maklon-dreamlab',
  '/maklon-skinacre-lptiktok',
  '/maklon-moisturizer-bpom-dreamlab',
  '/omset-moisturizer-naik-tajam-dreamlab-bisnis-skincare',
  '/hero-ingredients-2025',
  '/flywheel-marketing-brand-skincare',
  '/produk-haircare-yang-sedang-tren',
  '/tentang-dreamlab/alur-maklon',
  '/ide-bisnis-kosmetik',
  '/babycare-masa-kini-sentuhan-lembut-dan-ilmu-pengetahuan',
  '/maklon-kosmetik-terbaik',
  '/category/bisnis-kosmetik/page/2',
  '/shop',
  '/cart',
  '/my-account',
  '/aturâ€‘kosmetikâ€‘halalâ€‘dreamlab',
  '/aturâ€‘kosmetikâ€‘halalâ€‘2026â€‘dreamlab',
  '/skincare-face-care',
  '/body-care',
  '/baby-care',
  '/foot-care',
  '/hair-care',
  '/parfum',
  '/maklon-haircare',
  '/decorative',
  '/pkrt',
  '/product',
  '/maklon-parfum',
  '/maklon-skincare',
  '/maklon-hair-care',
  '/thankyou-maklon',
  '/linktree',
  '/links',
  '/tips-sukses-bisnis-parfum',
  '/maklon-scalp-haircare-bisnis-produk-rambut-sehat',
  '/tren-parfum-arab-bisnis-maklon-dreamlab',
  '/maklon-skincare-untuk-brand-baru',
  '/prediksi-tren-2026',
  '/pabrik-parfum-makasar',
  '/cara-bisnis-skincare-dari-nol',
  '/pabrik-parfum-surabaya-biaya-2026',
  '/maklon-parfum-bpom-indonesia-strategi-bisnis',
  '/maklon-kosmetik-parfum-tangerang',
  '/maklon-kosmetik-jakarta-dreamlab-2026',
  '/maklon-skincare-surabaya-umkm',
  '/jasa-maklon-sabun-mandi-batang',
  '/bahan-aktif-untuk-mengatasi-jerawat',
  '/maklon-parfum-jakarta',
  '/rahasia-maklon-parfum-jakarta',
  '/body-care-2',
  '/cara-membuat-masker-wajah-organik-praktis-aman-dan-cocok-untuk-ide-bisnis-skincare',
  '/berapa-biaya-membuat-brand-serum',
  '/biaya-membuat-brand-serum',
  '/rincian-biaya-produksi-serum',
  '/category/maklon-skincare',
  '/category/maklon-haircare',
  '/category/maklon-bodycare',
  '/category/maklon-parfum',
  '/category/bisnis-kosmetik',
  '/category/bisnis-skincare',
  '/category/tips-trick',
  '/category/bisnis-men-grooming',
  '/category/bisnis-kosmetik/page/2',
  '/category/bisnis-kosmetik/page/3',
  '/category/maklon-parfum/page/2',
  '/category/dreamlabpedia/page/2',
  '/category/maklon-skincare/page/2',
];

const noindexOnlyPaths = [
  '/thankyou',
  '/thankyou-medsos',
  '/ads/thankyou',
  '/metaads',
  '/google-ads',
  '/landing',
  '/author/admin/page',
  '/news-blog/page',
];

export function normalizeSeoPath(input: string): string {
  let value = input.trim();
  if (!value) return '/';

  if (value.startsWith(SITE_ORIGIN)) {
    value = value.slice(SITE_ORIGIN.length);
  }
  value = value.split('#')[0].split('?')[0];
  value = value.startsWith('/') ? value : `/${value}`;
  value = value.replace(/\/+$/, '');
  return value || '/';
}

export function toCanonicalUrl(input: string): string {
  const path = normalizeSeoPath(input);
  return `${SITE_ORIGIN}${path === '/' ? '/' : `${path}/`}`;
}

export function isRedirectOnlyPath(input: string): boolean {
  const path = normalizeSeoPath(input);
  return redirectOnlyPaths.some(source => path === normalizeSeoPath(source));
}

export function isNoindexOnlyPath(input: string): boolean {
  const path = normalizeSeoPath(input);
  return noindexOnlyPaths.some(source => path === normalizeSeoPath(source) || path.startsWith(`${normalizeSeoPath(source)}/`));
}

export function isIndexableSitemapPath(input: string): boolean {
  return !isRedirectOnlyPath(input) && !isNoindexOnlyPath(input);
}
