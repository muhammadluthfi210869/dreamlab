# GSC Export CSV Audit

Tanggal inspeksi API: 2026-07-06

Sumber:

- `docs/export-csv/29-06-2026/tidak-diindeks.csv`
- `docs/export-csv/29-06-2026/pengalihan.csv`
- `docs/export-csv/29-06-2026/tag-kanonis.csv`
- `docs/export-csv/29-06-2026/Dikecualikan oleh tag noindex.csv`

Hasil inspeksi URL Inspection API disimpan di:

- `scripts/output/gsc-export-csv-inspection-2026-07-06.json`

## Ringkasan

- Total URL unik yang diinspeksi: `145`
- Submitted and indexed: `19`
- Page with redirect: `40`
- Alternate page with proper canonical tag: `16`
- Excluded by `noindex` tag: `23`
- Crawled - currently not indexed: `42`
- URL is unknown to Google: `4`
- Not found (404): `1`

## Per Bucket CSV

### `tidak-diindeks.csv`

- Total: `65`
- Crawled - currently not indexed: `39`
- Submitted and indexed: `10`
- Page with redirect: `8`
- Excluded by `noindex` tag: `2`
- URL is unknown to Google: `4`

### `pengalihan.csv`

- Total: `34`
- Page with redirect: `27`
- Submitted and indexed: `5`
- Excluded by `noindex` tag: `1`
- Not found (404): `1`

### `tag-kanonis.csv`

- Total: `25`
- Alternate page with proper canonical tag: `16`
- Page with redirect: `5`
- Submitted and indexed: `4`

### `Dikecualikan oleh tag noindex.csv`

- Total: `21`
- Excluded by `noindex` tag: `20`
- Crawled - currently not indexed: `1`

## Perubahan Paling Penting

- Tiga URL prioritas yang sebelumnya masih `Crawled - currently not indexed` sekarang sudah `Submitted and indexed`:
  - `https://dreamlab.id/biaya-maklon-parfum-moq-kecil/`
  - `https://dreamlab.id/bisnis-skincare-glow-glasskin-cystamine/`
  - `https://dreamlab.id/perbedaan-micellar-water-dan-toner/`
- Satu URL sempat kena error API saat batch, tetapi saat diinspeksi ulang hasilnya adalah:
  - `https://dreamlab.id/tren-parfum-arab-bisnis-maklon-dreamlab/`
  - status final: `Page with redirect`
  - canonical final: `https://dreamlab.id/produk-viral-tiktok/`

## URL Masih Perlu Perhatian

### `Crawled - currently not indexed`

Masih ada `42` URL di bucket ini. Sebagian adalah konten legacy, sebagian halaman struktur, dan sebagian perlu evaluasi kualitas konten atau routing.

### `URL is unknown to Google`

Masih ada `4` URL:

- `https://dreamlab.id/?wc-ajax=%25%25endpoint%25%25`
- `https://dreamlab.id/category/bisnis-skincare/feed/`
- `https://dreamlab.id/category/maklon-parfum/feed/`
- `https://dreamlab.id/category/maklon-skincare/feed/`

### `Not found (404)`

- `https://dreamlab.id/academy-beautypreneur/`

## Catatan

- Angka di atas berasal dari URL Inspection API, jadi ini lebih akurat untuk status crawl/index dibanding snapshot export mentah.
- Jika diperlukan, laporan ini bisa dipecah lagi jadi daftar URL per bucket untuk ditindaklanjuti satu per satu.
