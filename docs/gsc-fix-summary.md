# GSC Fix Summary

Tanggal revisi: 2026-06-29

## Status Singkat

Dokumen ini menggantikan versi sebelumnya yang terlalu optimistis.

Setelah dibandingkan dengan:

- export GSC di `docs/export-csv/29-06-2026`
- snapshot inspeksi di `scripts/output/gsc-coverage-2026-06-25.json`
- rule yang benar-benar ada di `next.config.ts`, `src/proxy.ts`, `src/app/sitemap.ts`, dan `src/lib/schema-generator.ts`

progress yang lebih defensible adalah:

- `87.4%` selesai untuk bucket actionable utama:
- `404`
- `crawled - currently not indexed`
- `tidak diindeks`
- `noindex`
- `63.1%` selesai jika dihitung terhadap seluruh URL unik bermasalah yang sedang kita track lintas semua bucket, termasuk `redirect`, `canonical`, dan `unknown to Google`

## Apa yang Memang Sudah Terselesaikan

### Benar-benar solutif di codebase

- Banyak URL WordPress legacy sekarang sudah ditangani lewat `301` atau `410`
- URL teknis seperti `wp-json`, `wp-content`, `feed`, `cart`, `checkout`, `shop`, `search`, `cgi-sys`, dan `cms_block_cat` sudah diblok atau dibersihkan lewat `src/proxy.ts`
- Sitemap sudah memfilter slug yang ditangkap proxy dan hanya memasukkan slug yang masih valid di app lewat `src/app/sitemap.ts`
- `404` utama `academy-beautypreneur` sudah punya redirect
- Banyak slug lama yang sebelumnya `crawled-not-indexed` sekarang sudah dipetakan ke halaman hidup
- Host `www.dreamlab.id` sekarang dinormalisasi ke `dreamlab.id`
- Query noise seperti `?wc-ajax=`, `?s=`, dan `action=googlesitekit_auth` sekarang ditangani di edge

### Perbaikan teknis tambahan pada revisi ini

- tambah normalisasi `http -> https`
- tambah normalisasi `www -> non-www`
- tambah cleanup untuk varian `/$` dan `/&`
- naikkan prioritas sitemap untuk 3 artikel yang masih `crawled - currently not indexed`
- tampilkan 3 artikel prioritas itu di homepage agar internal discovery lebih kuat
- rapikan schema product untuk `applicableCountry` dan absolute `primaryImageOfPage`

## Apa yang Belum Selesai

### Masih unresolved

- `https://dreamlab.id/biaya-maklon-parfum-moq-kecil/`
- `https://dreamlab.id/bisnis-skincare-glow-glasskin-cystamine/`
- `https://dreamlab.id/perbedaan-micellar-water-dan-toner/`

Ketiga URL ini masih berada di bucket `Crawled - currently not indexed`. Ini bukan noise teknis, jadi redirect atau 410 bukan solusi yang benar. Masalahnya kemungkinan ada di kualitas sinyal indexasi: internal link, prioritas crawl, atau evaluasi kualitas halaman oleh Google.

### Masih partial

- beberapa bucket `Page with redirect` dari snapshot inspeksi tetap terlihat tinggi karena snapshot diambil sebelum perubahan ini diverifikasi live oleh Google
- beberapa URL `redirect` di export sebenarnya kemungkinan hanya varian slash / host / protocol yang akan dinormalkan oleh framework atau edge, jadi perlu re-crawl setelah deploy
- canonical issue tidak lagi darurat, tetapi tetap perlu dicek setelah normalisasi host live berjalan

## Koreksi Atas Klaim Versi Sebelumnya

- Klaim `Crawled-not-indexed 65 -> ~2` tidak bisa dibuktikan dari kode saat ini
- Klaim `Pages with redirect 34 -> ~0` juga terlalu agresif
- Klaim `generateMetadata` memanggil `notFound()` pada `src/app/produk/[category]/page.tsx` tidak akurat; `notFound()` ada di page component, sedangkan `generateMetadata` mengembalikan metadata `noindex`
- Klaim `build 0 errors` tidak saya jadikan patokan audit karena build lokal saya terhambat fetch Google Fonts dari jaringan

## Penilaian Akhir

Perubahan yang sudah dilakukan bukan kosmetik. Sebagian besar cleanup legacy URL memang nyata dan membantu. Namun perubahan itu belum cukup untuk menyatakan seluruh masalah GSC sudah selesai.

Kesimpulan yang lebih akurat:

- cleanup teknis legacy: kuat
- cleanup sitemap dan crawl noise: kuat
- host / query normalization: sekarang lebih kuat
- penyelesaian isu indexasi konten penting: belum tuntas

## Referensi

- daftar masalah lengkap: `docs/GSC_ISSUES_MASTER_PLAN_2026-06-29.md`
- audit status per kategori: `docs/GSC_FIX_AUDIT_2026-06-29.md`
