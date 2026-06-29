# GSC Fix Audit

Tanggal audit: 2026-06-29

## Tujuan

Audit ini membandingkan:

- masalah yang tercatat di `docs/export-csv/29-06-2026`
- snapshot inspeksi GSC di `scripts/output/gsc-coverage-2026-06-25.json`
- implementasi aktual di codebase saat ini

Status yang dipakai:

- `Solved`: ada handler teknis yang jelas di repo saat ini
- `Partial`: ada sinyal perbaikan, tetapi belum cukup untuk menyatakan masalah selesai
- `Unsolved`: belum ada solusi teknis yang memadai di repo

## Progress

### Progress keseluruhan

- Total URL unik yang sedang di-track lintas semua bucket: `217`
- URL yang sudah punya penanganan teknis yang jelas di repo: `137`
- Progress keseluruhan: `63.1%`

### Progress untuk bucket actionable utama

- Total actionable: `103`
- Solved secara teknis: `90`
- Progress actionable: `87.4%`

Bucket actionable yang dipakai:

- `404`
- `Crawled - currently not indexed`
- `Tidak diindeks`
- `Excluded by noindex`

## Hasil per Kategori

| Kategori | Total | Solved | Status |
|----------|------:|-------:|--------|
| CSV tidak diindeks | 65 | 57 | Partial |
| CSV pengalihan | 34 | 21 | Partial |
| CSV tag kanonis | 25 | 25 | Solved |
| CSV noindex | 21 | 20 | Partial |
| Inspection 404 | 1 | 1 | Solved |
| Inspection crawled-not-indexed | 9 | 6 | Partial |
| Inspection redirect | 79 | 24 | Partial |
| Inspection noindex | 7 | 6 | Partial |
| Inspection canonical | 1 | 1 | Solved |

## Solved

### Kategori yang sudah kuat

- `404` utama `https://dreamlab.id/academy-beautypreneur/`
- canonical issue hasil host normalization
- mayoritas URL WordPress struktural seperti:
- `wp-json`
- `wp-content`
- `feed`
- `product-category`
- `shop`
- `cart`
- `checkout`
- `my-account`
- `blog`
- `search`
- `cgi-sys`
- `cms_block_cat`
- banyak legacy slug yang sudah diarahkan ke URL hidup dengan `301`

### Perubahan teknis yang mendukung status solved

- `src/proxy.ts`
- `next.config.ts`
- `src/app/sitemap.ts`
- `src/lib/schema-generator.ts`
- `src/app/page.tsx`

## Partial

### 1. Redirect bucket masih perlu verifikasi live

Masalah redirect belum layak disebut selesai penuh karena:

- banyak URL di snapshot inspeksi adalah hasil crawl sebelum Google melihat deploy terbaru
- beberapa kasus adalah normalisasi host/protocol/trailing slash yang butuh recrawl ulang untuk keluar dari bucket
- sebagian redirect memang sengaja dipertahankan untuk transfer equity

Contoh yang sekarang punya arah perbaikan tapi belum bisa diklaim final:

- `http://dreamlab.id/`
- `http://www.dreamlab.id/`
- `https://dreamlab.id/privacy-policy/`
- `https://dreamlab.id/terms-of-service/`
- `https://dreamlab.id/prediksi-tren-2026/`

### 2. Noindex hampir selesai, tetapi belum bersih 100%

Masih ada noise yang butuh diverifikasi pasca deploy:

- `https://dreamlab.id/?s=%7Bsearch_term_string%7D`
- `https://dreamlab.id/author/admin/`

`?s=` sekarang sudah ditangani di edge, tetapi perlu verifikasi live setelah deploy.

### 3. Tiga artikel prioritas masih belum cukup sinyal indexasi

Masih unresolved di bucket `Crawled - currently not indexed`:

- `https://dreamlab.id/biaya-maklon-parfum-moq-kecil/`
- `https://dreamlab.id/bisnis-skincare-glow-glasskin-cystamine/`
- `https://dreamlab.id/perbedaan-micellar-water-dan-toner/`

Yang sudah dilakukan untuk membantu:

- URL tetap hidup dan canonical
- artikel tetap ada di sitemap
- prioritas sitemap dinaikkan
- artikel ditarik ke homepage untuk menambah internal discovery

Tetapi ini tetap `Partial`, bukan `Solved`, sampai Google benar-benar mengindex ulang.

## Unsolved

### URL yang masih perlu tindakan lanjutan

- `https://dreamlab.id/biaya-maklon-parfum-moq-kecil/`
- `https://dreamlab.id/bisnis-skincare-glow-glasskin-cystamine/`
- `https://dreamlab.id/perbedaan-micellar-water-dan-toner/`
- `https://dreamlab.id/atur‑kosmetik‑halal‑2026‑dreamlab/`
- `https://dreamlab.id/atur‑kosmetik‑halal‑dreamlab/`
- `https://dreamlab.id/category/bisnis-men-grooming/`
- `https://dreamlab.id/category/dreampreneur-beauty-academy/`
- `https://dreamlab.id/maklon-pkrt/`

Catatan:

- dua slug `atur-kosmetik-halal` kemungkinan butuh keputusan editorial: hidupkan, redirect, atau 410
- beberapa URL kategori atau landing page butuh keputusan apakah tetap menjadi halaman indexable atau sebaiknya diarahkan ke struktur baru

## Apakah perubahan yang sudah dibuat solutif?

Jawaban singkat: `ya, tetapi belum penuh`.

Yang benar-benar solutif:

- cleanup legacy WordPress
- 410 untuk endpoint dan URL struktural yang tidak bernilai
- 301 untuk slug lama yang punya padanan
- filtering sitemap
- schema cleanup
- host normalization
- query noise cleanup

Yang belum cukup solutif:

- penyelesaian final bucket redirect tanpa verifikasi live
- penyelesaian final 3 artikel yang masih `crawled - currently not indexed`
- keputusan editorial untuk beberapa slug yang masih menggantung

## Next Step yang Direkomendasikan

1. Deploy perubahan terbaru.
2. Jalankan pengecekan live untuk URL:
   - `www -> non-www`
   - `http -> https`
   - `?s=`
   - `?wc-ajax=`
3. Submit sitemap ulang.
4. Request reindex untuk 3 artikel prioritas.
5. Pantau ulang GSC setelah `14-28 hari`.
