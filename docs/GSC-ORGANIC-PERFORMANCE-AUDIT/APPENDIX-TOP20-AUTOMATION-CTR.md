# APPENDIX — TOP 20 SUMMARY • WEEKLY AUTOMATION • CTR REWRITES
**dreamlab.id** | Generated 31 July 2026 | Data: Google Search Console (16 bulan, 31 Mar 2025 → 28 Jul 2026)

> Dokumen ini = 1 file pendamping audit (`executive-summary.md`, `full-analysis.md`, `recommendations.md`, `quick-wins.md`, `content-opportunities.md`).
> Berisi 3 bagian: **(1)** Tabel ringkasan Top 20, **(2)** Wiring pipeline otomatis mingguan, **(3)** Draft title & meta rewrite untuk 20 halaman CTR tertinggi.

---

# PART 1 — TOP 20 SUMMARY TABLES

## 1.1 Top 20 Quick Wins (nilai tinggi / usaha rendah)

| # | Aksi | Kategori | Effort | Dampak |
|---|---|---|---|---|
| 1 | Unblock robots.txt: hapus Disallow /produk/babycare/, /decorative/, /footcare/ | Teknis | 1 jam | Tinggi |
| 2 | Hapus URL 410 dari sitemap (sinkron sitemap.ts dengan GONE_PATTERNS) | Teknis | 2 jam | Sedang |
| 3 | Tambah canonical pada thankyou page variants (?source=...) | Teknis | 1 jam | Sedang |
| 4 | Fix konflik robots /page/2/ (index vs noindex) | Teknis | 30 mnt | Sedang |
| 5 | Request indexing 10 halaman komersial terbaru via URL Inspection | Indexing | 1 jam | Tinggi |
| 6 | Tulis ulang title+meta /cara-meracik-handbody-pemutih-alami/ (21rb imp, CTR 0.45%) | CTR | 30 mnt | Sangat Tinggi |
| 7 | Tulis ulang title+meta /perbedaan-moisturizer-gel-vs-cream/ (4.9rb imp, CTR 0.18%) | CTR | 30 mnt | Sangat Tinggi |
| 8 | Tulis ulang title+meta /jenis-alkohol-dalam-parfum/ (5rb imp, CTR 0.84%) | CTR | 30 mnt | Sangat Tinggi |
| 9 | Tulis ulang title+meta /contoh-kalimat-iklan-kosmetik-unik/ (3.9rb imp, CTR 0.44%) | CTR | 30 mnt | Tinggi |
| 10 | Tulis ulang title+meta /lulur-vs-hb-dosting/ (2.2rb imp, CTR 0.62%) | CTR | 30 mnt | Tinggi |
| 11 | Tulis ulang title+meta /parfum-inspired-peluang-bisnis/ (2.6rb imp, CTR 0.35%) | CTR | 30 mnt | Tinggi |
| 12 | Tulis ulang title+meta /urutan-pabrik-skincare-terbaik-indonesia/ (8.2rb imp, CTR 1.7%) | CTR | 30 mnt | Tinggi |
| 13 | Tulis ulang title+meta /pabrik-maklon-kosmetik-surabaya-terlengkap/ (2.8rb imp) | CTR | 30 mnt | Tinggi |
| 14 | Tulis ulang title+meta /contact-us/ — tambah 'Konsultasi Gratis' + WhatsApp | CTR | 30 mnt | Tinggi |
| 15 | Tambah FAQ schema (FAQPage JSON-LD) pada 10 halaman komersial | Schema | 4 jam | Sedang |
| 16 | Tambahkan internal links dari 10 artikel authority ke /contact-us/ + money pages | Linking | 2 jam | Tinggi |
| 17 | Redirect 3 landing tipis 0-klik ke hub sejenis (makasar, tangerang, jakarta) | Cleanup | 1 jam | Sedang |
| 18 | Perbaiki fragment URL impressions (hapus dari sitemap, perbaiki TOC) | Teknis | 2 jam | Sedang |
| 19 | Tambah Product schema + minOrderQuantity di semua product pages | Schema | 3 jam | Sedang |
| 20 | Setup dashboard mingguan (Task Scheduler + run-weekly-audit.ps1) | Ops | 1 jam | Tinggi |


## 1.2 Top 20 Highest ROI Actions

| # | Aksi | Dampak | Upaya | Timeline | Hasil |
|---|---|---|---|---|
| 1 | Fix robots.txt + unblock 3 kategori produk | Tinggi | 2 jam | Minggu 1 | +50-200 klik komersial |
| 2 | Optimasi CTR 20 halaman impressions-tinggi | Sangat Tinggi | 3-5 hari | Minggu 1-2 | +1.500-2.500 klik/bln |
| 3 | Recovery head-term maklon parfum (pos 34) | Sangat Tinggi | 4-8 minggu | Bulan 1-2 | +100-300 klik komersial |
| 4 | Recovery head-term maklon skincare (pos 35) | Sangat Tinggi | 4-8 minggu | Bulan 1-2 | +100-300 klik komersial |
| 5 | Indekskan 46 halaman komersial crawled-not-indexed | Tinggi | 1-2 minggu | Bulan 1 | +50-150 klik komersial |
| 6 | Internal linking 20 artikel authority → money pages | Tinggi | mingguan | Berkelanjutan | Compounding |
| 7 | Konsolidasi 786 query kanibalisasi (canonical + 301) | Sedang | 2-3 minggu | Bulan 1-2 | +10-30% CTR head-terms |
| 8 | Rebuild halaman /parfum/ + /produk/parfum/ hub | Tinggi | 1-2 minggu | Bulan 1-2 | +30-80 klik |
| 9 | Rebuild halaman /produk/skincare/ hub | Tinggi | 1-2 minggu | Bulan 1-2 | +30-80 klik |
| 10 | Konten klaster handbody racikan (5 sub-halaman) | Sedang | 2-3 minggu | Bulan 2 | +200-400 klik |
| 11 | Konten klaster parfum inspired (hub + sub) | Sedang | 2 minggu | Bulan 2 | +150-300 klik |
| 12 | Halaman lokal per kota (Surabaya, Jakarta, Bali, Bandung) | Sedang | 3-4 minggu | Bulan 2-3 | +200-400 klik komersial |
| 13 | Konten 'Biaya Maklon Kosmetik 2026' (pricing) | Sedang | 1 minggu | Bulan 1 | +50-150 klik komersial |
| 14 | Refresh data industri kosmetik 2025 → 2026 | Sedang | 1 minggu | Bulan 1 | Recovery -76% clicks |
| 15 | Konten 'Syarat & Biaya BPOM 2026' (regulatory) | Sedang | 1 minggu | Bulan 1-2 | +50-100 klik |
| 16 | Studi kasus modal awal bisnis skincare (lead magnet) | Sedang | 1 minggu | Bulan 1-2 | +30-80 lead |
| 17 | Schema Service + FAQ + LocalBusiness pada money pages | Sedang | 1 minggu | Bulan 1 | +5-15% CTR |
| 18 | Optimasi mobile Core Web Vitals (LCP, INP) | Sedang | 1-2 minggu | Bulan 1 | +10-20% CTR mobile |
| 19 | Optimasi desktop position (crawl/index fix) | Sedang | 1 bulan | Bulan 2-3 | +30% desktop clicks |
| 20 | Digital PR + backlink alami dari data riset industri | Sedang | 3+ bulan | Bulan 3+ | Otoritas jangka panjang |


## 1.3 Top 20 Biggest Traffic Losses (90d vs 90d sebelumnya)

| # | Halaman | Klik 90d | Δ | CTR% | Pos |
|---|---|---|---|---|---|
| 1 | /memunculkan-keranjang-reels/ | 699 | -345 | 3.31 | 4.9 |
| 2 | /industri-kosmetik-indonesia-terus-tumbuh/ | 56 | -38 | 3.39 | 8.5 |
| 3 | /maklon-parfum-jakarta/ | 0 | -22 | 3.72 | 8.7 |
| 4 | /pkrt/ | 24 | -15 | 4.84 | 13.0 |
| 5 | /pabrik-parfum-makasar/ | 0 | -10 | 0.0 | 9.0 |
| 6 | /maklon-kosmetik-parfum-tangerang/ | 0 | -9 | 1.15 | 13.0 |
| 7 | /pabrik-parfum-surabaya/ | 37 | -8 | 2.16 | 8.3 |
| 8 | /tren-parfum-arab-bisnis-maklon-dreamlab/ | 0 | -8 | 2.38 | 5.0 |
| 9 | /state-of-beauty-2025-tren-kecantikan-pertumbuh… | 6 | -7 | 1.37 | 9.6 |
| 10 | /maklon-jakarta-terbaik/ | 4 | -7 | 5.03 | 12.8 |
| 11 | /rahasia-maklon-parfum-jakarta/ | 0 | -7 | 2.84 | 11.1 |
| 12 | /cara-bangun-brand-deodoran-sendiri/ | 0 | -6 | 0.0 | 6.3 |
| 13 | /parfum/ | 9 | -6 | 1.16 | 36.3 |
| 14 | /cara-menentukan-harga-jual-produk-kosmetik/ | 3 | -6 | 2.35 | 8.1 |
| 15 | /prediksi-tren-2026/ | 0 | -6 | 4.38 | 6.8 |
| 16 | /contoh-kalimat-iklan-kosmetik-unik/ | 17 | -6 | 0.44 | 9.1 |
| 17 | /maklon-skincare-surabaya-umkm/ | 0 | -4 | 1.48 | 12.7 |
| 18 | /tren-sunscreen-2025-6-produk-yang-siap-jadi-bi… | 0 | -4 | 0.0 | 6.2 |
| 19 | /alat-pengencang-wajah/ | 18 | -4 | 0.9 | 6.6 |
| 20 | /jasa-maklon-sabun-mandi-batang/ | 0 | -3 | 1.4 | 11.4 |

## 1.4 Top 20 Biggest Traffic Winners

| # | Halaman | Klik 90d | Δ | CTR% | Pos |
|---|---|---|---|---|---|
| 1 | / | 486 | 205 | 7.74 | 8.1 |
| 2 | /cara-meracik-handbody-pemutih-alami/ | 106 | 95 | 0.45 | 8.1 |
| 3 | /urutan-pabrik-skincare-terbaik-indonesia/ | 140 | 73 | 1.7 | 8.8 |
| 4 | /cara-membuat-hb-dosting-sendiri/ | 82 | 64 | 2.27 | 6.6 |
| 5 | /pabrik-maklon-kosmetik-surabaya-terlengkap/ | 64 | 39 | 1.15 | 9.7 |
| 6 | /tren-cleanical-beauty-produk-skincare-paling-d… | 29 | 29 | 2.69 | 6.2 |
| 7 | /pabrik-parfum-jakarta/ | 37 | 29 | 1.4 | 17.0 |
| 8 | /panduan-maklon-deodorant-bpom/ | 23 | 21 | 1.65 | 10.2 |
| 9 | /jasa-maklon-parfum-moq-rendah/ | 36 | 16 | 2.28 | 12.4 |
| 10 | /contact-us/ | 44 | 15 | 1.24 | 8.2 |
| 11 | /jasa-maklon-parfum-bali-terbaik-terlengkap/ | 48 | 14 | 2.21 | 31.4 |
| 12 | /cara-hitunghpp-produk-kosmeti/ | 20 | 14 | 2.36 | 6.1 |
| 13 | /pabrik-maklon-parfum-bekasi/ | 13 | 13 | 3.09 | 16.9 |
| 14 | /maklon-parfum-makassar/ | 17 | 13 | 2.42 | 7.7 |
| 15 | /career/ | 25 | 13 | 7.84 | 7.8 |
| 16 | /maklon-hairmist/ | 16 | 13 | 8.0 | 16.2 |
| 17 | /jenis-alkohol-dalam-parfum/ | 32 | 12 | 0.84 | 8.8 |
| 18 | /jasa-maklon-lipstik-bpom-terpercaya/ | 13 | 12 | 2.65 | 16.0 |
| 19 | /produk/babycare/ | 12 | 12 | 4.29 | 22.8 |
| 20 | /produk/parfum/ | 11 | 11 | 1.77 | 26.4 |

## 1.5 Top 20 Money Pages to Prioritize

| # | Halaman | Klik | Impressions | CTR% | Pos | Priority |
|---|---|---|---|---|---|---|
| 1 | /urutan-pabrik-skincare-terbaik-indonesia/ | 140 | 8241 | 1.7 | 8.8 | 73.5 |
| 2 | / | 486 | 6955 | 7.74 | 8.1 | 67.3 |
| 3 | /lulur-vs-hb-dosting/ | 12 | 2186 | 0.62 | 4.9 | 65.8 |
| 4 | /pabrik-maklon-kosmetik-surabaya-terlengkap/ | 64 | 2806 | 1.15 | 9.7 | 65.1 |
| 5 | /parfum-inspired-peluang-bisnis/ | 9 | 2607 | 0.35 | 7.8 | 65.0 |
| 6 | /pabrik-parfum-surabaya/ | 37 | 1391 | 2.16 | 8.3 | 60.4 |
| 7 | /cysteamine-alternatif-hydroquinone/ | 13 | 1291 | 1.01 | 8.6 | 60.3 |
| 8 | /affiliate-kol-brand-skincare/ | 6 | 1167 | 0.51 | 9.9 | 59.8 |
| 9 | /pabrik-parfum-jakarta/ | 37 | 1337 | 1.4 | 17.0 | 59.7 |
| 10 | /urutan-pabrik-skincare-terbaik-indonesia/#Daft… | 0 | 1081 | 0.0 | 7.8 | 59.5 |
| 11 | /services/ | 15 | 1049 | 0.74 | 7.8 | 59.1 |
| 12 | /jasa-maklon-parfum-bali-terbaik-terlengkap/ | 48 | 1089 | 2.21 | 31.4 | 58.4 |
| 13 | /rekomendasi-sunscreen-lokal/ | 4 | 978 | 0.41 | 10.5 | 58.3 |
| 14 | /pabrik-parfum-malang-dreamlab/ | 17 | 811 | 1.1 | 8.5 | 57.6 |
| 15 | /biaya-maklon-parfum-moq-kecil/ | 13 | 785 | 0.84 | 11.4 | 57.1 |
| 16 | /jasa-maklon-parfum-moq-rendah/ | 36 | 819 | 2.28 | 12.4 | 57.1 |
| 17 | /jadwalkanvisitmeeting.php | 7 | 779 | 0.9 | 10.1 | 57.1 |
| 18 | /maklon-kosmetik-parfum-tangerang/ | 0 | 0 | 1.15 | 13.0 | 57.0 |
| 19 | /ide-bisnis-kosmetik-2026/ | 5 | 663 | 0.75 | 7.7 | 56.6 |
| 20 | /panduan-maklon-deodorant-bpom/ | 23 | 718 | 1.65 | 10.2 | 56.5 |

## 1.6 Top 20 Commercial Keywords

| # | Query | Impressions | Klik | Pos | CTR% |
|---|---|---|---|---|---|
| 1 | maklon parfum surabaya | 681 | 29 | 8.6 | 4.26 |
| 2 | maklon skincare terbaik | 515 | 10 | 7.5 | 1.94 |
| 3 | pabrik skincare | 488 | 1 | 14.9 | 0.2 |
| 4 | maklon kosmetik surabaya | 458 | 20 | 10.2 | 4.37 |
| 5 | pabrik kosmetik surabaya | 401 | 2 | 14.2 | 0.5 |
| 6 | maklon parfum | 372 | 1 | 34.1 | 0.27 |
| 7 | pabrik parfum | 369 | 4 | 12.6 | 1.08 |
| 8 | maklon kosmetik | 366 | 6 | 15.4 | 1.64 |
| 9 | maklon skincare | 309 | 3 | 35.3 | 0.97 |
| 10 | maklon skincare surabaya | 267 | 13 | 5.2 | 4.87 |
| 11 | pabrik kosmetik | 264 | 0 | 22.2 | 0.0 |
| 12 | maklon parfum terbaik | 235 | 7 | 7.0 | 2.98 |
| 13 | maklon kosmetik terbaik | 217 | 3 | 14.8 | 1.38 |
| 14 | maklon skincare bandung | 208 | 1 | 13.5 | 0.48 |
| 15 | pabrik parfum surabaya | 190 | 4 | 10.9 | 2.11 |
| 16 | maklon parfum jakarta | 161 | 4 | 8.4 | 2.48 |
| 17 | maklon body care | 160 | 2 | 13.0 | 1.25 |
| 18 | maklon kosmetik bandung | 151 | 2 | 11.6 | 1.32 |
| 19 | maklon skincare baby | 138 | 1 | 8.1 | 0.72 |
| 20 | maklon surabaya | 136 | 6 | 4.9 | 4.41 |

## 1.7 Top 20 Pages Requiring Immediate Attention (CTR Opportunity)

| # | Halaman | Impressions | Klik | CTR% | Pos | Potensi +klik |
|---|---|---|---|---|---|---|
| 1 | /cara-meracik-handbody-pemutih-alami/ | 21162 | 106 | 0.45 | 8.1 | 962.8 |
| 2 | /urutan-pabrik-skincare-terbaik-indonesia/ | 8241 | 140 | 1.7 | 8.8 | 272.1 |
| 3 | /perbedaan-moisturizer-gel-vs-cream/ | 4911 | 9 | 0.18 | 7.6 | 236.5 |
| 4 | /jenis-alkohol-dalam-parfum/ | 5060 | 32 | 0.84 | 8.8 | 210.5 |
| 5 | /lulur-vs-hb-dosting/ | 2186 | 12 | 0.62 | 4.9 | 205.1 |
| 6 | /contoh-kalimat-iklan-kosmetik-unik/ | 3887 | 17 | 0.44 | 9.1 | 177.3 |
| 7 | /parfum-inspired-peluang-bisnis/ | 2607 | 9 | 0.35 | 7.8 | 121.4 |
| 8 | /pabrik-maklon-kosmetik-surabaya-terlengkap/ | 2806 | 64 | 1.15 | 9.7 | 108.1 |
| 9 | /cara-membuat-hb-dosting-sendiri/ | 3614 | 82 | 2.27 | 6.6 | 98.7 |
| 10 | /contact-us/ | 2553 | 44 | 1.24 | 8.2 | 96.1 |
| 11 | /urutan-pabrik-skincare-terbaik-indonesia/#Daft… | 1081 | 0 | 0.0 | 7.8 | 54.0 |
| 12 | /affiliate-kol-brand-skincare/ | 1167 | 6 | 0.51 | 9.9 | 52.4 |
| 13 | /cysteamine-alternatif-hydroquinone/ | 1291 | 13 | 1.01 | 8.6 | 51.5 |
| 14 | /urutan-pabrik-skincare-terbaik-indonesia/#Bera… | 1007 | 0 | 0.0 | 7.7 | 50.4 |
| 15 | /services/ | 1049 | 15 | 0.74 | 7.8 | 44.7 |
| 16 | /cara-membuka-offline-store-kosmetik-2026/ | 1008 | 13 | 0.65 | 8.1 | 43.9 |
| 17 | /alat-pengencang-wajah/ | 1003 | 18 | 0.9 | 6.6 | 41.1 |
| 18 | /pabrik-parfum-surabaya/ | 1391 | 37 | 2.16 | 8.3 | 39.5 |
| 19 | /cara-hitunghpp-produk-kosmeti/ | 1473 | 20 | 2.36 | 6.1 | 38.9 |
| 20 | /8-tren-kecantikan-2026-smart-formula/ | 872 | 12 | 0.73 | 9.1 | 37.3 |

## 1.8 Top 20 CTR Improvement Targets
> Sama dengan 1.7 — kolom **"Potensi +klik"** adalah estimasi klik tambahan per 90 hari jika CTR dinaikkan ke benchmark posisi (top-3 ≈ 18%, 4–5 ≈ 10%, 6–10 ≈ 5%).

## 1.9 Top 20 Content Refresh Candidates (Content Decay)

| # | Halaman | Klik | Δ | CTR% | Pos |
|---|---|---|---|---|---|
| 1 | /memunculkan-keranjang-reels/ | 699 | -345 | 3.31 | 4.9 |
| 2 | /industri-kosmetik-indonesia-terus-tumbuh/ | 56 | -38 | 3.39 | 8.5 |
| 3 | /maklon-parfum-jakarta/ | 0 | -22 | 3.72 | 8.7 |
| 4 | /pkrt/ | 24 | -15 | 4.84 | 13.0 |
| 5 | /pabrik-parfum-makasar/ | 0 | -10 | 0.0 | 9.0 |
| 6 | /maklon-kosmetik-parfum-tangerang/ | 0 | -9 | 1.15 | 13.0 |
| 7 | /pabrik-parfum-surabaya/ | 37 | -8 | 2.16 | 8.3 |
| 8 | /tren-parfum-arab-bisnis-maklon-dreamlab/ | 0 | -8 | 2.38 | 5.0 |
| 9 | /state-of-beauty-2025-tren-kecantikan-pertumbuh… | 6 | -7 | 1.37 | 9.6 |
| 10 | /maklon-jakarta-terbaik/ | 4 | -7 | 5.03 | 12.8 |
| 11 | /rahasia-maklon-parfum-jakarta/ | 0 | -7 | 2.84 | 11.1 |
| 12 | /cara-bangun-brand-deodoran-sendiri/ | 0 | -6 | 0.0 | 6.3 |
| 13 | /parfum/ | 9 | -6 | 1.16 | 36.3 |
| 14 | /cara-menentukan-harga-jual-produk-kosmetik/ | 3 | -6 | 2.35 | 8.1 |
| 15 | /prediksi-tren-2026/ | 0 | -6 | 4.38 | 6.8 |
| 16 | /contoh-kalimat-iklan-kosmetik-unik/ | 17 | -6 | 0.44 | 9.1 |
| 17 | /maklon-skincare-surabaya-umkm/ | 0 | -4 | 1.48 | 12.7 |
| 18 | /tren-sunscreen-2025-6-produk-yang-siap-jadi-bi… | 0 | -4 | 0.0 | 6.2 |
| 19 | /alat-pengencang-wajah/ | 18 | -4 | 0.9 | 6.6 |
| 20 | /jasa-maklon-sabun-mandi-batang/ | 0 | -3 | 1.4 | 11.4 |

## 1.10 Top 20 Internal Linking Sources (Artikel Authority → Money Pages)

| # | Artikel Authority | Impressions | Klik | Pos | Intent |
|---|---|---|---|---|---|
| 1 | /cara-meracik-handbody-pemutih-alami/ | 21162 | 106 | 8.1 | informational |
| 2 | /memunculkan-keranjang-reels/ | 18057 | 699 | 4.9 | informational |
| 3 | /urutan-pabrik-skincare-terbaik-indonesia/ | 8241 | 140 | 8.8 | commercial |
| 4 | /jenis-alkohol-dalam-parfum/ | 5060 | 32 | 8.8 | informational |
| 5 | /perbedaan-moisturizer-gel-vs-cream/ | 4911 | 9 | 7.6 | informational |
| 6 | /contoh-kalimat-iklan-kosmetik-unik/ | 3887 | 17 | 9.1 | informational |
| 7 | /cara-membuat-hb-dosting-sendiri/ | 3614 | 82 | 6.6 | informational |
| 8 | /parfum-inspired-peluang-bisnis/ | 2607 | 9 | 7.8 | commercial |
| 9 | /lulur-vs-hb-dosting/ | 2186 | 12 | 4.9 | commercial |
| 10 | /perbedaan-edp-edt/ | 1984 | 0 | 30.4 | informational |
| 11 | /industri-kosmetik-indonesia-terus-tumbuh/ | 1653 | 56 | 8.5 | local |
| 12 | /cara-hitunghpp-produk-kosmeti/ | 1473 | 20 | 6.1 | informational |
| 13 | /cysteamine-alternatif-hydroquinone/ | 1291 | 13 | 8.6 | commercial |
| 14 | /tren-cleanical-beauty-produk-skincare-paling-d… | 1196 | 29 | 6.2 | informational |
| 15 | /affiliate-kol-brand-skincare/ | 1167 | 6 | 9.9 | commercial |
| 16 | /manfaat-hair-tonic-ginseng-rambut/ | 1104 | 2 | 16.6 | informational |
| 17 | /urutan-pabrik-skincare-terbaik-indonesia/#Daft… | 1081 | 0 | 7.8 | commercial |
| 18 | /services/ | 1049 | 15 | 7.8 | commercial |
| 19 | /cara-membuka-offline-store-kosmetik-2026/ | 1008 | 13 | 8.1 | informational |
| 20 | /urutan-pabrik-skincare-terbaik-indonesia/#Bera… | 1007 | 0 | 7.7 | brand |

## 1.11 Top 20 Technical Risks

| # | Risiko | Severitas | Confidence | Aksi |
|---|---|---|---|
| 1 | robots.txt memblokir 3 kategori produk (babycare, decorative, footcare) | KRITIS | 95% | Unblock + verify 2-6 minggu |
| 2 | Produk sub-page di-noindex tanpa strategi terdokumentasi | KRITIS | 90% | Keputusan bisnis + audit konten |
| 3 | 46 halaman komersial crawled-not-indexed | TINGGI | 85% | Enrich konten + request indexing |
| 4 | 786 query mengalami kanibalisasi (2+ halaman) | TINGGI | 70% | Canonical + 301 + internal link |
| 5 | Sitemap berisi URL 410 / redirect | TINGGI | 95% | Sinkron sitemap.ts dengan GONE_PATTERNS |
| 6 | Head-terms maklon parfum & skincare jatuh ke pos 34-35 | TINGGI | 60% | Rebuild hub + internal link |
| 7 | Fragment URL (#heading) tercatat sebagai impressions 0-klik | SEDANG | 85% | Hapus dari sitemap + perbaiki TOC |
| 8 | Duplicate canonical pada thankyou pages (?source=) | SEDANG | 90% | Tambah canonical tag |
| 9 | Konflik robots meta pada /page/2/ (index vs noindex) | SEDANG | 70% | Seragamkan noindex,follow |
| 10 | Desktop avg position 13 (di luar halaman 1) | SEDANG | 50% | Perbaikan crawl/index + linking |
| 11 | Schema rich result kosong (tidak ada sitelinks/FAQ) | SEDANG | 60% | Implementasi schema bertingkat |
| 12 | 223+ artikel low-demand (1-49 impressions) tanpa arah | RENDAH | 80% | Audit nilai + internal link atau noindex |
| 13 | Zero-click pages ±70% dari total terindeks | SEDANG | 75% | CTR title/meta program |
| 14 | www vs non-www redirect (307) membuat 4 varian URL | RENDAH | 100% | Verifikasi 301 permanen |
| 15 | Trailing slash redirect (308) Vercel default | RENDAH | 100% | Monitor saja |
| 16 | Legacy WordPress debris (404/410 .php, /feed/) | RENDAH | 100% | Monitor recrawl |
| 17 | US impressions 20.527 dengan CTR 0.07% (query mismatch) | RENDAH | 60% | Cek query internasional / AI traffic |
| 18 | Ketergantungan traffic pada 1 halaman off-topic (Instagram) | TINGGI | 80% | Ganti dengan konten komersial |
| 19 | Tidak ada strategi content kalender berdasar data query | SEDANG | 70% | Gunakan query-opportunities.csv |
| 20 | Tidak ada monitoring KPI mingguan | SEDANG | 90% | Aktifkan run-weekly-audit.ps1 |


## 1.12 Top 20 Strategic Recommendations

| # | Rekomendasi | Prioritas | Timeline |
|---|---|---|
| 1 | Kejar clicks komersial, bukan total clicks | P0 | Bulan 1 |
| 2 | Fix indexing P0 dulu sebelum konten baru (robots.txt + noindex) | P0 | Minggu 1 |
| 3 | CTR program 20 halaman = ROI tercepat (+3.000 klik/bln) | P1 | Minggu 1-2 |
| 4 | Bangun internal linking silo komersial (hub & spoke) | P1 | Berkelanjutan |
| 5 | Recovery head-terms maklon parfum & skincare | P1 | Bulan 1-2 |
| 6 | Indekskan halaman komersial yang belum terindeks | P1 | Bulan 1 |
| 7 | Konsolidasi kanibalisasi (786 query) | P2 | Bulan 1-2 |
| 8 | Refresh konten decaying (data 2026) | P2 | Bulan 1 |
| 9 | Konten klaster dengan permintaan terbukti (handbody, parfum inspired, local) | P2 | Bulan 2 |
| 10 | Pricing & regulatory konten (biaya maklon, BPOM) | P2 | Bulan 1-2 |
| 11 | Perluas desktop visibility melalui indexing fix | P2 | Bulan 2-3 |
| 12 | Monitor AI Overviews / zero-click (impressions vs clicks gap) | P2 | Mingguan |
| 13 | Bangun otoritas via riset data + digital PR | P3 | Bulan 3+ |
| 14 | Kurangi ketergantungan halaman off-topic | P3 | Bulan 2-3 |
| 15 | A/B test title di halaman impressions terbesar | P3 | Bulan 2 |
| 16 | Integrasikan GSC + GA4 + CRM untuk atribusi lead | P3 | Bulan 1-2 |
| 17 | Weekly KPI dashboard otomatis | P3 | Minggu 1 |
| 18 | Audit konten programmatic tipis | P3 | Bulan 2 |
| 19 | Build local presence (GBP) untuk maklon Surabaya | P3 | Bulan 2-3 |
| 20 | Quarterly full re-audit | P3 | Kuartalan |


---

# PART 2 — WEEKLY AUTOMATED PIPELINE

## 2.1 Yang dilakukan otomatis
Menjalankan ulang seluruh audit (pull GSC API 16 bulan + window 30/90 hari → analisis halaman/query/direktori → dashboard → 5 laporan markdown) lalu **mengarsip snapshot mingguan** agar riwayat tren terekam.

## 2.2 File pipeline
| File | Peran |
|---|---|
| `scripts/10_collect_data.py` | Pull data GSC API (16 bulan + c30/p30/c90/p90) |
| `scripts/20_analysis_pages.py` | Analisis halaman (759) + top-100 winners/losers + opportunities |
| `scripts/21_analysis_queries.py` | Analisis query (4.519) + 15 segment CSV |
| `scripts/22_folders_dashboard.py` | Direktori, tren bulanan/harian, deteksi redesign, kanibalisasi, dashboard.json |
| `scripts/23_insights.py` | Input data untuk laporan |
| `scripts/40–42_report_*.py` | Generate executive-summary, full-analysis, recommendations, quick-wins, content-opportunities |
| `scripts/50_final_exports.py` | Export dimensi + README |
| **`scripts/run-weekly-audit.ps1`** | **Runner utama (9 langkah + arsip snapshot)** |
| `scripts/run-weekly-audit.bat` | Double-click wrapper |

**Persyaratan:** Python 3.13 + `pip install google-auth google-api-python-client pandas` + file kredensial di `dreamlab-site/scripts/gsc-credentials.json`.

## 2.3 Setup Windows Task Scheduler (rekomendasi lokal)
1. Buka **Task Scheduler** → Create Basic Task → nama `Dreamlab-Weekly-GSC-Audit`.
2. Trigger: **Weekly**, pilih hari (mis. Senin 07:00).
3. Action: **Start a program**
   - Program/script: `powershell.exe`
   - Arguments: `-ExecutionPolicy Bypass -File "C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLABeport\scriptsun-weekly-audit.ps1"`
4. **Run whether user is logged on or not** (butuh kredensial Windows). Pastikan PC/Laptop menyala saat jadwal.
5. Cek hasil di `report\weekly-snapshots\<tanggal>\` dan `run-<tanggal>.log`.

> **Catatan:** Jika PC tidak selalu menyala, gunakan GitHub Actions (2.4) di server cloud, atau Vercel Cron + serverless script.

## 2.4 GitHub Actions (opsional, cloud — tidak butuh PC nyala)
Buat file `.github/workflows/weekly-gsc-audit.yml` di repo `dreamlab-site`:

```yaml
name: Weekly GSC Audit
on:
  schedule:
    - cron: "0 1 * * 1"   # Senin 01:00 UTC
  workflow_dispatch:
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.13"
      - run: pip install google-auth google-api-python-client pandas
      - name: Write credentials
        run: |
          mkdir -p scripts
          echo "${{ secrets.GSC_SERVICE_ACCOUNT_JSON }}" > scripts/gsc-credentials.json
      - run: |
          cd report/scripts
          python 10_collect_data.py && python 20_analysis_pages.py && python 21_analysis_queries.py && python 22_folders_dashboard.py && python 23_insights.py && python 40_report_exec.py && python 41_report_full.py && python 42_report_actions.py && python 50_final_exports.py
      - name: Upload reports
        uses: actions/upload-artifact@v4
        with:
          name: gsc-audit-${{ github.run_number }}
          path: report/exports/*.csv
```

**Langkah:** Settings → Secrets → New repository secret → `GSC_SERVICE_ACCOUNT_JSON` = isi isi file `gsc-credentials.json`. Artifact laporan bisa diunduh dari tab Actions setiap minggu.

## 2.5 Yang direview mingguan (≤ 15 menit)
1. `executive-summary.md` → angka kunci + perubahan CTR/posisi.
2. `dashboard.json` → perbandingan 30d vs 30d sebelumnya.
3. `monthly-trend.csv` → arah tren.
4. `page-opportunities.csv` → halaman baru yang layak optimasi CTR.
5. `query-performance.csv` filter `business_intent=commercial` → pergerakan kata kunci komersial.
6. Log `run-<tanggal>.log` → pastikan 9 langkah sukses (gagal biasanya kredensial/quota).

## 2.6 Monitoring KPI mingguan
| KPI | Target | Sumber |
|---|---|---|
| Clicks komersial/bulan | +10% MoM | query-performance.csv (commercial) |
| CTR keseluruhan | → 3.0% (dari 1.76%) | dashboard.json |
| Position maklon parfum | 34 → <10 | query-performance.csv |
| Position maklon skincare | 35 → <10 | query-performance.csv |
| Blocked by robots.txt | → 0 | GSC UI Coverage |
| Crawled-not-indexed (non-asset) | 46 → <20 | GSC UI Coverage |
| Zero-click pages | 70% → <50% | page-performance.csv |

---

# PART 3 — TITLE & META REWRITES (TOP 20 CTR PAGES)

## 3.1 Formula
- **Title (≤ 60 char):** `[Kata Kunci Utama] — [Benefit/angka] ([trust: BPOM/Halal/MOQ])`
- **Meta (≤ 155 char):** `[jawaban langsung] + [USP] + [CTA]`
- Aturan: 1 H1 per halaman, jangan exact-match keyword di meta (hindari over-optimization), gunakan angka & entitas.

## 3.2 Draft Rewrite (20 halaman)

| # | Halaman | CTR Sekarang | Title Saat Ini | Title Baru | Meta Description Baru |
|---|---|---|---|---|---|
| 1 | `/cara-meracik-handbody-pemutih-alami/` | _lihat tabel 1.8_ | Cara Meracik Handbody Pemutih Kulit Bahan Alami & Tips Bisnis | **Cara Meracik Handbody Pemutih Alami: 5 Resep + Takaran Bahan (Terbukti)** | Resep handbody racikan pemutih dengan takaran pasti: bahan, dosis, cara pakai. Cocok untuk bisnis skincare rumahan. Konsultasi maklon gratis di Dreamlab. |
| 2 | `/urutan-pabrik-skincare-terbaik-indonesia/` | _lihat tabel 1.8_ | Urutan Pabrik Skincare Terbaik di Indonesia 2026 \| Maklon No. 1 | **Urutan 5 Pabrik Skincare Terbaik Indonesia 2026: MOQ, BPOM & Estimasi Biaya** | Urutan pabrik skincare terbaik Indonesia 2026 lengkap dengan MOQ, sertifikasi BPOM/CPKB & estimasi biaya. Bandingkan sebelum memilih jasa maklon. |
| 3 | `/perbedaan-moisturizer-gel-vs-cream/` | _lihat tabel 1.8_ | Perbedaan moisturizer Gel vs Cream \| Mana yang Lebih Cocok? | **Perbedaan Moisturizer Gel vs Cream: Kandungan, Tekstur & Pilih Mana?** | Gel atau cream untuk kulitmu? Simak perbedaan tekstur, kandungan, hasil akhir & rekomendasi jenis kulit pada panduan lengkap ini. |
| 4 | `/jenis-alkohol-dalam-parfum/` | _lihat tabel 1.8_ | 5 Jenis Alkohol yang Digunakan pada Parfum | **Jenis Alkohol dalam Parfum: Ethanol, SD Alcohol & Denat (Fungsi + Perbedaan)** | Kenali jenis alkohol yang dipakai dalam parfum — ethanol, SD alcohol, denatured — fungsi, konsentrasi & pengaruhnya pada ketahanan aroma. |
| 5 | `/lulur-vs-hb-dosting/` | _lihat tabel 1.8_ | Perbedaan Lulur vs HB Dosting Mana Lebih Efektif | **Lulur vs HB Dosting: Mana Lebih Efektif untuk Kulit Putih?** | Lulur atau HB dosting untuk kulit cerah? Bandingkan cara kerja, hasil, kecepatan & efek samping sebelum Anda memilih produk. |
| 6 | `/contoh-kalimat-iklan-kosmetik-unik/` | _lihat tabel 1.8_ | Kalimat Iklan Kosmetik Unik & Menarik – Contoh Copywriting | **30+ Contoh Kalimat Iklan Kosmetik yang Unik & Menjual (Copywriting 2026)** | Kumpulan contoh kalimat iklan kosmetik unik untuk skincare, parfum & makeup. Template siap pakai yang terbukti meningkatkan konversi. |
| 7 | `/parfum-inspired-peluang-bisnis/` | _lihat tabel 1.8_ | 5 Tren Parfum Inspired dan Peluang Bisnisny | **Bisnis Parfum Inspired 2026: Peluang, Modal Awal & Cara Maklon** | Peluang bisnis parfum inspired 2026: tren pasar, rincian modal, dan cara produksi maklon dengan MOQ fleksibel + BPOM Halal. |
| 8 | `/pabrik-maklon-kosmetik-surabaya-terlengkap/` | _lihat tabel 1.8_ | Pabrik Maklon Kosmetik Surabaya Terlengkap | **Pabrik Maklon Kosmetik Surabaya Terlengkap: BPOM, Halal & MOQ Fleksibel** | Pabrik maklon kosmetik Surabaya terlengkap: formulasi custom, BPOM & Halal, MOQ fleksibel. Konsultasi gratis — wujudkan brand Anda. |
| 9 | `/cara-membuat-hb-dosting-sendiri/` | _lihat tabel 1.8_ | Membuat HB Dosting BPOM Sendiri untuk Bisnis Pemula | **Cara Membuat HB Dosting Sendiri: Resep, Takaran & Syarat BPOM** | Panduan membuat HB dosting sendiri: resep, takaran bahan, cara pengemasan & syarat BPOM. Ideal untuk bisnis skincare pemula. |
| 10 | `/contact-us/` | _lihat tabel 1.8_ | DREAMLAB \| Jasa Maklon Kosmetik Surabaya Jawa Timur | **Hubungi Dreamlab — Konsultasi Maklon Kosmetik Gratis (WhatsApp)** | Konsultasi gratis maklon kosmetik, skincare & parfum. Dapatkan penawaran formulasi, MOQ & estimasi biaya dalam 1x24 jam. |
| 11 | `/affiliate-kol-brand-skincare/` | _lihat tabel 1.8_ | Affiliate dan KOL untuk Brand skincare - Dreamlab | **Strategi Affiliate & KOL untuk Brand Skincare: Kriteria + Contoh** | Cara memilih affiliate & KOL untuk brand skincare: kriteria, komisi, kontrak & studi kasus. Bangun distribusi tanpa iklan mahal. |
| 12 | `/cysteamine-alternatif-hydroquinone/` | _lihat tabel 1.8_ | Cysteamine Pengganti Hydroquinone hiperpigmentasi | **Cysteamine vs Hydroquinone: Alternatif Aman untuk Flek Hitam?** | Cysteamine sebagai alternatif hydroquinone: efektivitas, keamanan, perbandingan & rekomendasi pemakaian untuk mengatasi flek hitam. |
| 13 | `/services/` | _lihat tabel 1.8_ | DREAMLAB \| Maklon Skincare BPOM Untuk Brand Suksesmu | **Layanan Maklon Kosmetik: Skincare, Parfum, Body Care & PKRT (BPOM)** | Layanan maklon kosmetik lengkap dari formulasi sampai distribusi: skincare, parfum, body care, PKRT. BPOM & Halal, MOQ fleksibel. |
| 14 | `/cara-membuka-offline-store-kosmetik-2026/` | _lihat tabel 1.8_ | Cara Sukses Membuka Offline Store Kosmetik 2026 | **Cara Membuka Offline Store Kosmetik 2026: Modal, Lokasi & Strategi** | Panduan buka toko kosmetik offline 2026: rincian modal, pilih lokasi, supplier maklon & strategi agar cepat balik modal. |
| 15 | `/alat-pengencang-wajah/` | _lihat tabel 1.8_ | 5 Alat Pengencang Wajah Yang Wajib Punya | **5 Alat Pengencang Wajah Terbaik 2026: Manfaat & Cara Pakai** | Rekomendasi alat pengencang wajah terbaik: ice roller, gua sha, LED mask & lainnya — manfaat, harga & cara pakai yang benar. |
| 16 | `/pabrik-parfum-surabaya/` | _lihat tabel 1.8_ | Pabrik Parfum Surabaya terbaik Solusi Brand Parfum | **Pabrik Parfum Surabaya: Jasa Maklon Parfum BPOM, MOQ Mulai 1.000** | Pabrik parfum Surabaya untuk brand Anda: maklon parfum BPOM & Halal, formulasi custom, MOQ mulai 1.000 pcs. Konsultasi gratis. |
| 17 | `/cara-hitunghpp-produk-kosmeti/` | _lihat tabel 1.8_ | Cara Hitung HPP Produk Kosmetik Agar Profit Maksimal | **Cara Hitung HPP Produk Kosmetik: Rumus + Contoh Angka (2026)** | Rumus & contoh menghitung HPP produk kosmetik: bahan, kemasan, jasa maklon & margin. Pastikan harga jual Anda profit maksimal. |
| 18 | `/8-tren-kecantikan-2026-smart-formula/` | _lihat tabel 1.8_ | 8 Tren Kecantikan 2026 Inovasi Smart Formula | **8 Tren Kecantikan 2026 & Inovasi Smart Formula (Data Industri)** | 8 tren kecantikan 2026 yang diprediksi menguasai pasar: smart formula, bahan aktif & peluang bisnis maklon kosmetik. |
| 19 | `/pabrik-parfum-jakarta/` | _lihat tabel 1.8_ | Pabrik Parfum Jakarta | **Pabrik Parfum Jakarta: Jasa Maklon Parfum BPOM Terpercaya** | Pabrik parfum Jakarta untuk brand Anda: formulasi custom, BPOM & Halal, MOQ fleksibel. Konsultasi gratis — mulai bisnis parfum sendiri. |
| 20 | `/biaya-maklon-parfum-moq-kecil/` | _lihat tabel 1.8_ | Biaya Maklon Parfum MOQ Kecil | **Biaya Maklon Parfum MOQ Kecil: Simulasi Harga + Cara Hemat** | Rincian biaya maklon parfum dengan MOQ kecil: simulasi harga, komponen biaya & tips hemat untuk pemula. Konsultasi gratis di Dreamlab. |


## 3.3 Checklist implementasi
- [ ] Terapkan di CMS/Next.js (`seo-mapping.json` / data source of truth).
- [ ] Konfirmasi panjang title ≤ 60 & meta ≤ 155 karakter.
- [ ] Setelah deploy, **request indexing** via GSC untuk 10 halaman teratas.
- [ ] Ukur CTR di GSC setelah **14 hari**; iterasi jika CTR < 3%.
- [ ] Jangan ubah H1 tanpa A/B — mulai dari title/meta saja.

---

*Seluruh data pendukung: `page-performance.csv`, `query-performance.csv`, `page-opportunities.csv`, `query-opportunities.csv`, `folder-performance.csv`, `monthly-trend.csv`, `daily-trend.csv`, `dashboard.json`.*
