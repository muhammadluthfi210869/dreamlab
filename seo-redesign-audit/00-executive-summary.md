# Executive Summary

Audit generated: 2026-07-21T04:42:00.872Z
Evidence folder: seo-redesign-audit/raw-evidence

## Jawaban wajib

1. Redesign belum terbukti sebagai penyebab tunggal. Yang terbukti: GSC impressions turun -21.6% pada window setara 28 hari (45876 -> 35958), tetapi window 7 hari sekitar 2026-07-13 turun hanya -4.9% dan clicks naik 144 -> 171.
2. Tanggal penurunan mulai: dari data harian, penurunan sudah terlihat sebelum patch 20-21 Juli; periode 2026-06-21..2026-07-18 lebih rendah dari 2026-05-24..2026-06-20. Tanggal pasti inflection 32%: TIDAK DAPAT DIVERIFIKASI dari data API yang tersedia.
3. Bagian penurunan dari URL berubah/hilang: TIDAK DAPAT DIVERIFIKASI penuh. Dalam top 7v7 page losses, beberapa www/produk dan legacy URL muncul, tetapi losses terbesar justru artikel yang masih mendapat impression dan posisi stabil.
4. Dari 1.140/1.141 non-indexed, yang pasti masalah tidak boleh dihitung semua. Dari data UI user: 505 crawled-not-indexed dan 19 discovered-not-indexed perlu triage; 338 redirect, 173 alternate canonical, dan 73 noindex sebagian besar expected bila legacy/duplicate/ads.
5. URL penting yang sekarang tidak diindeks: TIDAK DAPAT DIVERIFIKASI penuh tanpa export GSC Page Indexing lengkap. Sample 2026-07-13: 5 crawled-not-indexed, 1 404, 32 redirect, 12 noindex dari 328 inspected; service utama sampled live final 200/indexable.
6. Status dominan: Crawled - currently not indexed (505) menurut angka GSC UI user.
7. Accidental noindex/robots/canonical/redirect error: robots block dan redirect error tidak terbukti. Noindex yang sampled dominan author/page/ads/landing dan tampak expected. Masalah sitemap lama/legacy redirect terbukti sebelumnya dan current sitemap production tampak sudah dibersihkan.
8. Google dapat melihat konten website baru pada sampled live HTML: title, H1, body besar, canonical, dan links muncul server-side/final HTML.
9. Halaman lama dengan traffic sudah sebagian dipetakan via src/data/seo-mapping.json dan redirects next.config.ts, tetapi relevansi beberapa destination masih perlu review, terutama /maklon-parfum/ -> /google-ads/maklon-parfum/.
10. Sitemap current production: 331 URL, tidak memuat pola legacy bermasalah yang dicek; ini sudah jauh lebih benar dibanding snapshot sebelum fix.
11. Internal linking melemah: belum terbukti kuantitatif karena graph lama tidak tersedia. Ada perubahan nav/blog category 18-19 Juli yang berpotensi mengubah link equity.
12. Artikel lama: ditemukan 199 URL mapping/182 artikel di data baru; indikasi 179 artikel lama perlu klasifikasi KEEP/UPDATE/MERGE/REDIRECT, tapi tidak boleh mass delete/noindex tanpa traffic/backlink evidence.
13. GA4 tracking regression: TIDAK DAPAT DIVERIFIKASI karena credential GA4 Data API/property tidak ditemukan. Kode GTM/TrackingScripts ada, tetapi event leads tidak bisa diaudit dari API.
14. Lima penyebab terbesar: migration/index bloat legacy, sitemap lama mengirim URL redirect/noindex, content quality/consolidation untuk 505 crawled-not-indexed, internal linking/category consolidation risk, GA4 lead attribution gap.
15. 24-72 jam: validasi sitemap live di GSC, inspect top service pages + top loss pages, review redirect destination money URLs, export Page Indexing penuh, audit GA4/GTM conversion events.
16. Jangan dilakukan dahulu: jangan noindex/delete massal 1.140 URL, jangan redirect semua 404 ke homepage, jangan buat artikel baru/backlink sebelum migration regression selesai, jangan request indexing untuk URL redirect/noindex/ads.

## Angka kunci

| Metric | Nilai | Bukti |
|---|---:|---|
| GSC 90d pages | 709 | raw-evidence/gsc-pages-90d.csv |
| GSC 90d clicks | 2828 | GSC API |
| GSC 90d impressions | 148791 | GSC API |
| Latest 28d impressions | 35958 | raw-evidence/gsc-daily.csv |
| Previous 28d impressions | 45876 | raw-evidence/gsc-daily.csv |
| Current live sitemap URLs | 331 | raw-evidence/live-sitemap-urls.txt |
| Live priority checks | 94 | raw-evidence/live-url-checks.csv |
