# GSC Final Status

Tanggal: 2026-06-29

## 1. Remaining URL yang Masih Perlu Ditindaklanjuti

### A. Prioritas tertinggi: masih `Crawled - currently not indexed`

- `https://dreamlab.id/biaya-maklon-parfum-moq-kecil/`
- `https://dreamlab.id/bisnis-skincare-glow-glasskin-cystamine/`
- `https://dreamlab.id/perbedaan-micellar-water-dan-toner/`

Catatan:

- tiga URL ini adalah sisa masalah yang paling nyata
- statusnya bukan lagi problem routing utama
- fokus perbaikannya ada pada kualitas sinyal indexasi, kualitas HTML final, dan internal linking

### B. Masih perlu verifikasi live pasca deploy

- `https://dreamlab.id/privacy-policy/`
- `https://dreamlab.id/terms-of-service/`
- `https://dreamlab.id/maklon-pkrt/`
- `https://dreamlab.id/category/bisnis-men-grooming/`
- `https://dreamlab.id/news-blog/page/2/`
- `https://dreamlab.id/news-blog/page/3/`
- `https://dreamlab.id/news-blog/page/6/`
- `https://dreamlab.id/news-blog/page/7/`
- `https://dreamlab.id/produk/decorative/`
- `https://dreamlab.id/produk/parfum/`
- `https://dreamlab.id/produk/pkrt/`
- `https://dreamlab.id/produk/pkrt/floor-cleaner/`
- `https://dreamlab.id/produk/skincare/`
- `https://dreamlab.id/produk/skincare/cleansing/`
- `https://dreamlab.id/produk/skincare/face-mask/wash-off-mask/`
- `https://dreamlab.id/produk/skincare/facial-toner/`

Catatan:

- daftar ini belum tentu salah
- sebagian besar justru terlihat sebagai halaman valid yang sebelumnya masuk bucket redirect atau excluded dari snapshot lama
- yang dibutuhkan adalah verifikasi status HTTP, canonical, dan indexability setelah deploy terbaru

### C. Masih butuh keputusan editorial atau routing final

- `https://dreamlab.id/author/admin/`
- `https://dreamlab.id/atur-kosmetik-halal-dreamlab/` versi varian dash rusak
- `https://dreamlab.id/atur-kosmetik-halal-2026-dreamlab/`
- `https://dreamlab.id/state-of-beauty-2025-tren-kecantikan-pertumbuhan-industri-`

Catatan:

- `author/admin` saat ini memang `noindex, follow` secara sengaja
- slug dengan dash rusak kemungkinan akan membaik setelah normalisasi Unicode dash di edge, tetapi tetap perlu uji live
- dua slug terakhir butuh keputusan: hidupkan konten final, redirect ke URL canonical, atau `410`

## 2. Post-Deploy Verification Checklist

### Redirect dan cleanup

- cek `http://dreamlab.id/` harus redirect ke `https://dreamlab.id/`
- cek `https://www.dreamlab.id/` harus redirect ke `https://dreamlab.id/`
- cek `https://dreamlab.id/?s=%7Bsearch_term_string%7D` harus `410`
- cek `https://dreamlab.id/?wc-ajax=test` harus `410`
- cek `https://dreamlab.id/?action=googlesitekit_auth` harus `410`
- cek `https://dreamlab.id/thankyou-page/` harus menuju `/thankyou/google/`
- cek varian Unicode dash seperti `https://dreamlab.id/atur‑kosmetik‑halal‑dreamlab/` harus dinormalisasi ke slug ASCII

### Halaman prioritas indexasi

- cek 3 URL prioritas return `200`
- cek canonical masing-masing menuju URL final dirinya sendiri
- cek tidak ada empty heading yang bocor di HTML akhir
- cek tidak ada blok heading/paragraph yang terduplikasi di HTML akhir
- cek ketiganya muncul di `sitemap.xml`
- cek ketiganya muncul sebagai link internal dari homepage
- cek ketiganya ikut muncul di modul related links dari artikel kategori terkait

### Langkah GSC sesudah deploy

1. submit ulang `sitemap.xml`
2. inspect 3 URL prioritas satu per satu
3. request indexing untuk 3 URL prioritas
4. pantau status coverage dan page indexing dalam `14-28` hari

## 3. Audit 3 Artikel Prioritas

### `https://dreamlab.id/biaya-maklon-parfum-moq-kecil/`

Status audit:

- URL hidup di dataset artikel
- sudah masuk sitemap
- sudah diprioritaskan di sitemap
- sudah ditarik ke homepage
- punya category yang relevan untuk related links

Masalah yang ditemukan:

- konten artikel mengandung pengulangan blok besar yang sama beberapa kali
- section seperti `Rincian Biaya Maklon Parfum Berdasarkan Komponen`, `Apa itu MOQ dan Bagaimana Sistemnya di Dreamlab?`, dan `Maklon Parfum vs Produksi Mandiri` berulang
- pola seperti ini bisa dianggap low quality atau templated duplication oleh Google

Status solusi:

- sudah ditambahkan sanitasi runtime untuk membuang repeated heading sections dari HTML legacy sebelum dirender

### `https://dreamlab.id/bisnis-skincare-glow-glasskin-cystamine/`

Status audit:

- URL hidup di dataset artikel
- sudah masuk sitemap
- sudah diprioritaskan dari homepage

Masalah yang ditemukan:

- artikel ini juga mengandung pengulangan section besar yang identik
- section `Cystamine: Alternatif Aman Pengganti Hydroquinone`, `Langkah Sukses Memulai Bisnis Skincare Glow Glasskin`, dan `Testimoni dan Bukti Nyata Keampuhan Glow Glasskin` tampil berulang
- kontennya sangat promosi-heavy dan sinyal informational depth masih tipis dibanding panjang total

Status solusi:

- sanitasi runtime sekarang akan menghapus repeated heading sections identik
- internal linking ke URL prioritas ini diperkuat lewat modul related links lintas artikel kategori terkait

### `https://dreamlab.id/perbedaan-micellar-water-dan-toner/`

Status audit:

- URL hidup di dataset artikel
- sudah masuk sitemap
- sudah diprioritaskan dari homepage

Masalah yang ditemukan:

- ada empty heading di awal body
- ada pengulangan section `Jenis Kulit Mana yang Cocok Menggunakan Micellar Water dan Toner?`
- ada pengulangan section `Tips Formulasi Micellar Water dan Toner untuk Brand Owner`
- ada pengulangan section `Potensi Bisnis Micellar Water dan Toner di Pasaran`
- ini adalah kandidat paling kuat kenapa URL tetap gagal diindex walau technically valid

Status solusi:

- sanitasi runtime sekarang menghapus empty heading
- repeated heading sections identik dibuang sebelum render
- URL ini juga diprioritaskan dalam internal links kategori terkait

## Perubahan Teknis yang Baru Ditambahkan Hari Ini

- `src/lib/clean-html.ts`
  - hapus empty heading
  - hapus repeated heading sections identik dari HTML legacy
- `src/components/RelatedLinks.tsx`
  - prioritaskan 3 URL target indexasi agar lebih sering mendapat internal link dari artikel lain yang relevan

## Validasi Build

- `npm run build` sukses pada 2026-06-29

