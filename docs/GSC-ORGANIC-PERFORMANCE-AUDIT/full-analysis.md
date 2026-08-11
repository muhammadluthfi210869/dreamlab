# FULL ANALYSIS — Organic Performance Intelligence Audit
## dreamlab.id | Google Search Console | 31 Mar 2025 – 28 Jul 2026

---

## A. SITE PERFORMANCE

### A.1 Overview 16 Bulan
| Metrik | Total |
|---|---|
| Clicks | 8.885 |
| Impressions | 360.457 |
| CTR | 2.46% |
| Average Position | 8.8 |
| Distinct Queries (16m) | 4.519 |
| Distinct Pages (16m) | 965 |

### A.2 Perbandingan Windows
| Window | Clicks | Impressions | CTR % | Avg Pos |
|---|---|---|---|---|
| Last 90d (3 Mei–28 Jul) | 2.760 | 131.656 | 2.10 | 8.5 |
| Prev 90d (2 Feb–2 Mei) | 2.160 | 103.887 | 2.08 | 7.5 |
| Δ 90d | **+600 (+27.8%)** | +27.769 | +0.02pp | −1.0 |
| Last 30d (29 Jun–28 Jul) | 837 | 45.857 | 1.83 | 8.5 |
| Prev 30d (30 Mei–28 Jun) | 947 | 44.860 | 2.11 | 8.9 |
| Δ 30d | **−110 (−11.6%)** | +997 | −0.28pp | +0.4 |

> **Interpretasi:** Tren 90-hari positif, tetapi tren 30-hari negatif — penurunan terjadi di bulan Juli. Impressions tetap tinggi sementara CTR jatuh → masalah relevansi/perolehan klik, bukan kehilangan visibilitas.

### A.3 Tren Bulanan (Month-over-Month)
| Bulan | Clicks | Impressions | CTR% | Avg Pos |
|---|---|---|---|---|
| 2025-03 | 0 | 69 | 0.0 | 39.84 |
| 2025-04 | 86 | 2032 | 4.232 | 20.12 |
| 2025-05 | 127 | 2922 | 4.346 | 18.79 |
| 2025-06 | 130 | 3044 | 4.271 | 25.36 |
| 2025-07 | 131 | 2285 | 5.733 | 21.64 |
| 2025-08 | 167 | 3153 | 5.297 | 19.79 |
| 2025-09 | 204 | 5781 | 3.529 | 13.45 |
| 2025-10 | 538 | 12497 | 4.305 | 7.57 |
| 2025-11 | 1085 | 26893 | 4.035 | 6.24 |
| 2025-12 | 899 | 35731 | 2.516 | 9.17 |
| 2026-01 | 639 | 32334 | 1.976 | 10.33 |
| 2026-02 | 581 | 27901 | 2.082 | 7.83 |
| 2026-03 | 533 | 27945 | 1.907 | 8.16 |
| 2026-04 | 1033 | 47335 | 2.182 | 6.75 |
| 2026-05 | 1002 | 42998 | 2.33 | 8.16 |
| 2026-06 | 979 | 44797 | 2.185 | 8.99 |
| 2026-07 | 751 | 42740 | 1.757 | 8.48 |

---

## B. DETEKSI DAMPAK REDESIGN / PERUBAHAN BESAR

**Deteksi otomatis penurunan mingguan signifikan (baseline ≥ 60 klik/minggu, drop > 25%):**
- 22–28 Des 2025: −28.7% (musiman)
- 29 Des–4 Jan 2026: −36.9% (musiman)
- 12–18 Jan 2026: −47.6% (musiman berlanjut)
- 2–8 Feb 2026: −29.8%
- 16–22 Mar 2026: **−44.3%** (bersesuaian core update Maret 2026)
- 22–28 Jun 2026: **−27.4%** (periode migrasi WordPress→Next.js)
- 6–12 Jul 2026: **−40.0%** (pasca-deploy, masalah teknis)
- 27 Jul–2 Agu 2026: −60.5% (minggu parsial, berlanjut)

**Estimasi periode penurunan terparah:** **Juni–Juli 2026** bersamaan dengan cutover Next.js. Pemicu yang tercatat dalam audit teknis: robots.txt memblokir kategori produk, produk sub-page di-noindex, 46 halaman komersial tidak terindeks, dan pergeseran posisi query head-term.

**Folder yang paling terdampak:** `/instagram-cluster/` (−345 klik, −33%), `/service-category/` (−18, −26%).

---

## C. ANALISIS QUERY

### C.1 Query Teratas (16 bulan, berdasarkan clicks)
| Query | Clicks 16m | Impressions | CTR% | Pos | Intent |
|---|---|---|---|---|---|
| dreamlab | 848 | 3746 | 28.04 | 7.5 | brand |
| dream lab | 188 | 1349 | 22.4 | 1.7 | brand |
| pt karya impian laboratoris | 150 | 2146 | 4.97 | 22.7 | brand |
| cara menambahkan keranjang di instagram | 92 | 1666 | 6.01 | 2.5 | informational |
| dreamlab kosmetik | 84 | 876 | 12.26 | 1.0 | brand |
| cara memunculkan keranjang di instagram | 80 | 1024 | 3.47 | 2.2 | informational |
| karya impian laboratoris | 68 | 439 | 12.94 | 1.1 | brand |
| dreamlab surabaya | 66 | 777 | 12.37 | 1.1 | brand |
| maklon parfum surabaya | 62 | 1759 | 4.26 | 8.6 | commercial |
| maklon pkrt | 53 | 512 | 10.61 | 8.0 | commercial |
| data pertumbuhan industri kosmetik di indonesia 2025 | 51 | 483 | 5.81 | 5.8 | local |
| cara menambahkan keranjang di reels instagram | 40 | 411 | 12.2 | 1.9 | informational |
| cara menautkan keranjang di instagram | 39 | 795 | 5.77 | 2.4 | informational |
| syarat keranjang di instagram | 34 | 362 | 5.61 | 2.3 | informational |
| keranjang instagram | 32 | 316 | 10.0 | 3.0 | other |
| keranjang di instagram tidak muncul | 30 | 588 | 7.19 | 3.1 | other |
| fitur keranjang di instagram | 30 | 408 | 7.94 | 4.0 | other |
| maklon kosmetik surabaya | 29 | 1035 | 4.37 | 10.2 | commercial |
| perkembangan industri kecantikan di indonesia 2025 | 26 | 98 | 0.0 | nan | local |
| cara memunculkan tautan produk di instagram | 25 | 349 | 4.76 | 4.3 | informational |
| pt karya impian laboratoris surabaya | 23 | 327 | 26.67 | 1.0 | brand |
| menambahkan keranjang di instagram | 21 | 141 | 7.27 | 1.9 | other |
| maklon parfum bali | 21 | 352 | 8.55 | 4.3 | commercial |
| cara menambah keranjang di instagram | 21 | 298 | 5.81 | 2.3 | informational |
| cara menambahkan keranjang di ig | 19 | 304 | 6.9 | 2.4 | informational |

### C.2 Query Terbesar Kehilangan Klik (90d vs 90d sebelumnya)
| Query | Klik 90d | Klik Prev | Δ | Pos | Intent |
|---|---|---|---|---|---|
| data pertumbuhan industri kosmetik di indonesia 2025 | 5 | 21 | -16 | 5.8 | local |
| cara memunculkan tautan produk di instagram | 5 | 17 | -12 | 4.3 | informational |
| cara memunculkan keranjang di instagram | 7 | 18 | -11 | 2.2 | informational |
| syarat keranjang di instagram | 6 | 17 | -11 | 2.3 | informational |
| maklon pkrt | 14 | 23 | -9 | 8.0 | commercial |
| menambahkan keranjang di instagram | 4 | 13 | -9 | 1.9 | other |
| alat pengencang wajah terbaik | 2 | 9 | -7 | 5.7 | other |
| cara aktifkan keranjang di instagram | 4 | 11 | -7 | 2.9 | informational |
| maklon parfum | 1 | 7 | -6 | 34.1 | commercial |
| maklon parfum jakarta | 4 | 9 | -5 | 8.4 | commercial |
| cara menampilkan keranjang di instagram | 3 | 7 | -4 | 2.4 | informational |
| maklon parfum moq rendah | 6 | 10 | -4 | 8.2 | pricing |
| keranjang di instagram tidak muncul | 10 | 13 | -3 | 3.1 | other |
| keranjang kuning instagram | 2 | 5 | -3 | 5.4 | other |
| cara menautkan keranjang shopee di instagram | 2 | 5 | -3 | 3.1 | informational |
| cara menautkan produk di instagram | 2 | 5 | -3 | 5.7 | informational |
| pabrik parfum | 4 | 7 | -3 | 12.6 | commercial |
| kata-kata promosi skincare yang menarik | 0 | 2 | -2 | 9.1 | other |
| cara menautkan produk di reels instagram | 0 | 2 | -2 | 4.4 | informational |
| cara mengaktifkan keranjang di instagram | 4 | 6 | -2 | 2.4 | informational |
| kata-kata promosi produk kecantikan | 0 | 2 | -2 | 10.1 | other |
| data pertumbuhan industri kosmetik di indonesia | 0 | 2 | -2 | 8.0 | local |
| contoh iklan skincare yang menarik | 0 | 2 | -2 | 9.6 | other |
| daftar perusahaan maklon kosmetik | 0 | 2 | -2 | 11.0 | commercial |
| cara menautkan keranjang di instagram | 12 | 14 | -2 | 2.4 | informational |

**Pola:** Dominasi klaster Instagram (off-topic). Komersial yang turun: `maklon pkrt` (−9), `maklon parfum` (−6, pos 34!), `maklon parfum jakarta` (−5), `maklon parfum moq rendah` (−4).

### C.3 Query Terbesar Penambahan Klik
| Query | Klik 90d | Klik Prev | Δ | Pos | Intent |
|---|---|---|---|---|---|
| dreamlab | 182 | 113 | 69 | 7.5 | brand |
| dream lab | 56 | 30 | 26 | 1.7 | brand |
| maklon kosmetik surabaya | 20 | 7 | 13 | 10.2 | commercial |
| dreamlab kosmetik | 26 | 14 | 12 | 1.0 | brand |
| maklon reed diffuser | 10 | 1 | 9 | 7.8 | commercial |
| pt karya impian laboratoris | 19 | 10 | 9 | 22.7 | brand |
| maklon parfum surabaya | 29 | 21 | 8 | 8.6 | commercial |
| maklon deodorant | 10 | 2 | 8 | 17.1 | commercial |
| maklon skincare surabaya | 13 | 5 | 8 | 5.2 | commercial |
| cara membuat hb dosting | 7 | 0 | 7 | 5.7 | informational |
| maklon skincare terbaik | 10 | 4 | 6 | 7.5 | commercial |
| cara membuat handbody racikan sendiri agar cepat putih | 6 | 0 | 6 | 8.0 | informational |
| cara menambahkan keranjang kuning di instagram | 8 | 3 | 5 | 3.0 | informational |
| cara menambahkan keranjang di reels instagram | 15 | 10 | 5 | 1.9 | informational |
| maklon parfum terbaik | 7 | 2 | 5 | 7.0 | commercial |
| maklon skincare terbaik di indonesia | 6 | 1 | 5 | 4.8 | commercial |
| cara menyematkan keranjang di instagram | 6 | 2 | 4 | 2.7 | informational |
| dreamlab indonesia | 4 | 0 | 4 | 1.2 | brand |
| cara membuat keranjang kuning di instagram | 4 | 0 | 4 | 2.6 | informational |
| pabrik skincare surabaya | 4 | 0 | 4 | 5.3 | commercial |
| jasa maklon kosmetik | 3 | 0 | 3 | 18.8 | commercial |
| cara meracik hb dosting sendiri | 3 | 0 | 3 | 6.5 | informational |
| maklon kosmetik terdekat | 3 | 0 | 3 | 7.7 | commercial |
| hb dosting adalah | 3 | 0 | 3 | 3.9 | other |
| maklon kosmetik | 6 | 3 | 3 | 15.4 | commercial |

**Pola:** Brand queries tumbuh (dreamlab +69, dream lab +26, pt karya impian +9). Komersial tumbuh dari basis kecil: `maklon kosmetik surabaya` (+13, pos 10.2), `maklon reed diffuser` (+9), `maklon parfum surabaya` (+8), `maklon skincare surabaya` (+8, pos 5.2), `maklon deodorant` (+8).

### C.4 Query Hampir Masuk Top 3 (posisi 4–7)
| Query | Impressions | Klik | Pos | CTR% | Intent |
|---|---|---|---|---|---|
| cara membuat hb dosting | 355 | 7 | 5.7 | 1.97 | informational |
| pheromone adalah | 276 | 0 | 6.3 | 0.0 | other |
| parfum inspired adalah | 275 | 0 | 7.0 | 0.0 | other |
| maklon skincare surabaya | 267 | 13 | 5.2 | 4.87 | commercial |
| cara meracik hb dosting sendiri | 238 | 3 | 6.5 | 1.26 | informational |
| maklon parfum terbaik | 235 | 7 | 7.0 | 2.98 | commercial |
| cara buat hb dosting sendiri | 205 | 0 | 5.9 | 0.0 | informational |
| parfum inspired artinya | 202 | 0 | 6.7 | 0.0 | other |
| alat pengencang wajah terbaik | 145 | 2 | 5.7 | 1.38 | other |
| cara menambahkan link produk di reels instagram | 141 | 6 | 6.0 | 4.26 | informational |
| maklon surabaya | 136 | 6 | 4.9 | 4.41 | commercial |
| inspired parfum artinya | 130 | 1 | 6.5 | 0.77 | other |
| maklon kosmetik jawa timur | 122 | 3 | 7.0 | 2.46 | commercial |
| copywriting kosmetik | 120 | 0 | 6.3 | 0.0 | other |
| maklon parfum bali | 117 | 10 | 4.3 | 8.55 | commercial |

### C.5 Query Posisi 11–20 (perlu dorongan)
| Query | Impressions | Klik | Pos | CTR% | Intent |
|---|---|---|---|---|---|
| pabrik skincare | 488 | 1 | 14.9 | 0.2 | commercial |
| pabrik kosmetik surabaya | 401 | 2 | 14.2 | 0.5 | commercial |
| pabrik parfum | 369 | 4 | 12.6 | 1.08 | commercial |
| maklon kosmetik | 366 | 6 | 15.4 | 1.64 | commercial |
| maklon kosmetik terbaik | 217 | 3 | 14.8 | 1.38 | commercial |
| maklon skincare bandung | 208 | 1 | 13.5 | 0.48 | commercial |
| edt adalah | 206 | 0 | 11.3 | 0.0 | other |
| perbedaan edt dan edp | 174 | 0 | 11.6 | 0.0 | comparison |
| maklon body care | 160 | 2 | 13.0 | 1.25 | commercial |
| maklon kosmetik bandung | 151 | 2 | 11.6 | 1.32 | commercial |
| cysteamine adalah | 142 | 0 | 11.7 | 0.0 | other |
| pabrik maklon kosmetik surabaya | 111 | 0 | 11.2 | 0.75 | commercial |
| perusahaan kosmetik di surabaya | 110 | 2 | 16.7 | 1.82 | local |
| edp itu apa | 110 | 0 | 12.3 | 0.0 | informational |
| apa itu edp | 103 | 0 | 11.7 | 0.0 | informational |

### C.6 Query Komersial (peluang konversi)
| Query | Impressions | Klik | Pos | CTR% |
|---|---|---|---|---|
| maklon parfum surabaya | 681 | 29 | 8.6 | 4.26 |
| maklon skincare terbaik | 515 | 10 | 7.5 | 1.94 |
| pabrik skincare | 488 | 1 | 14.9 | 0.2 |
| maklon kosmetik surabaya | 458 | 20 | 10.2 | 4.37 |
| pabrik kosmetik surabaya | 401 | 2 | 14.2 | 0.5 |
| maklon parfum | 372 | 1 | 34.1 | 0.27 |
| pabrik parfum | 369 | 4 | 12.6 | 1.08 |
| maklon kosmetik | 366 | 6 | 15.4 | 1.64 |
| maklon skincare | 309 | 3 | 35.3 | 0.97 |
| maklon skincare surabaya | 267 | 13 | 5.2 | 4.87 |
| pabrik kosmetik | 264 | 0 | 22.2 | 0.0 |
| maklon parfum terbaik | 235 | 7 | 7.0 | 2.98 |
| maklon kosmetik terbaik | 217 | 3 | 14.8 | 1.38 |
| maklon skincare bandung | 208 | 1 | 13.5 | 0.48 |
| pabrik parfum surabaya | 190 | 4 | 10.9 | 2.11 |
| maklon parfum jakarta | 161 | 4 | 8.4 | 2.48 |
| maklon body care | 160 | 2 | 13.0 | 1.25 |
| maklon kosmetik bandung | 151 | 2 | 11.6 | 1.32 |
| maklon skincare baby | 138 | 1 | 8.1 | 0.72 |
| maklon surabaya | 136 | 6 | 4.9 | 4.41 |
| maklon pkrt | 132 | 14 | 8.0 | 10.61 |
| maklon lipstik | 130 | 0 | 10.0 | 0.0 |
| jasa maklon parfum | 127 | 0 | 34.8 | 0.56 |
| maklon kosmetik jawa timur | 122 | 3 | 7.0 | 2.46 |
| maklon terbaik di indonesia | 120 | 2 | 7.4 | 1.67 |
| maklon parfum bali | 117 | 10 | 4.3 | 8.55 |
| pabrik maklon kosmetik surabaya | 111 | 0 | 11.2 | 0.75 |
| maklon skincare sidoarjo | 108 | 0 | 34.7 | 0.56 |
| pabrik maklon skincare | 103 | 0 | 16.5 | 0.0 |
| maklon skincare terbaik di indonesia | 102 | 6 | 4.8 | 5.88 |
| maklon bodycare | 99 | 2 | 9.2 | 2.02 |
| jasa maklon skincare | 96 | 0 | 34.6 | 0.0 |
| maklon shampoo | 94 | 3 | 25.0 | 3.19 |
| maklon sabun baby | 93 | 0 | 16.0 | 0.0 |
| maklon skincare jakarta | 88 | 1 | 19.0 | 1.14 |
| pabrik parfum jakarta | 86 | 2 | 7.4 | 2.33 |
| maklon hair care | 84 | 0 | 23.3 | 0.16 |
| maklon reed diffuser | 78 | 10 | 7.8 | 12.82 |
| maklon kosmetik tangerang | 78 | 0 | 17.9 | 0.0 |
| maklon sunscreen | 77 | 2 | 11.5 | 2.6 |

### C.7 Query High Impressions Low CTR
| Query | Impressions | Klik | CTR% | Pos | Intent |
|---|---|---|---|---|---|
| cara membuat handbody racikan sendiri agar cepat putih | 1788 | 6 | 0.34 | 8.0 | informational |
| maklon skincare terbaik | 515 | 10 | 1.94 | 7.5 | commercial |
| pabrik skincare | 488 | 1 | 0.2 | 14.9 | commercial |
| cara membuat handbody racikan dosis tinggi | 480 | 1 | 0.21 | 8.7 | informational |
| apa itu inspired parfum | 460 | 0 | 0.0 | 9.6 | informational |
| hb racikan sendiri | 459 | 2 | 0.44 | 9.2 | other |
| pabrik kosmetik surabaya | 401 | 2 | 0.5 | 14.2 | commercial |
| maklon parfum | 372 | 1 | 0.27 | 34.1 | commercial |
| pabrik parfum | 369 | 4 | 1.08 | 12.6 | commercial |
| maklon kosmetik | 366 | 6 | 1.64 | 15.4 | commercial |
| cara membuat hb dosting | 355 | 7 | 1.97 | 5.7 | informational |
| maklon skincare | 309 | 3 | 0.97 | 35.3 | commercial |
| inspired parfum adalah | 302 | 0 | 0.0 | 8.8 | other |
| cara membuat handbody racikan putih permanen | 301 | 2 | 0.66 | 7.9 | informational |

### C.8 Segmentasi Intent (16 bulan)
- **Brand queries:** 60 query, ±1.427 klik (16% dari total) — didominasi "dreamlab", "dream lab", "pt karya impian laboratoris".
- **Non-brand:** 4.459 query (98.7%).
- **Informational:** 847 query.
- **Commercial:** 770 query.
- **Local:** 313 query.
- **Comparison:** 119 query.
- **Pricing:** 73 query.

---

## D. ANALISIS HALAMAN

### D.1 Halaman Teratas
| Halaman | Klik | Impressions | CTR% | Pos | Tipe | Intent |
|---|---|---|---|---|---|---|
| /memunculkan-keranjang-reels/ | 699 | 18057 | 3.31 | 4.9 | article | informational |
| / | 486 | 6955 | 7.74 | 8.1 | homepage | brand_nav |
| /urutan-pabrik-skincare-terbaik-indonesia/ | 140 | 8241 | 1.7 | 8.8 | article | commercial |
| /cara-meracik-handbody-pemutih-alami/ | 106 | 21162 | 0.45 | 8.1 | article | informational |
| /cara-membuat-hb-dosting-sendiri/ | 82 | 3614 | 2.27 | 6.6 | article | informational |
| /pabrik-maklon-kosmetik-surabaya-terlengkap/ | 64 | 2806 | 1.15 | 9.7 | service_landing | commercial |
| /industri-kosmetik-indonesia-terus-tumbuh/ | 56 | 1653 | 3.39 | 8.5 | article | local |
| /jasa-maklon-parfum-bali-terbaik-terlengkap/ | 48 | 1089 | 2.21 | 31.4 | service_landing | commercial |
| /contact-us/ | 44 | 2553 | 1.24 | 8.2 | company_or_service | company |
| /pabrik-parfum-surabaya/ | 37 | 1391 | 2.16 | 8.3 | service_landing | commercial |
| /pabrik-parfum-jakarta/ | 37 | 1337 | 1.4 | 17.0 | service_landing | commercial |
| /jasa-maklon-parfum-moq-rendah/ | 36 | 819 | 2.28 | 12.4 | service_landing | commercial |
| /jenis-alkohol-dalam-parfum/ | 32 | 5060 | 0.84 | 8.8 | article | informational |
| /tren-cleanical-beauty-produk-skincare-paling-dicari-tahun-… | 29 | 1196 | 2.69 | 6.2 | article | informational |
| /career/ | 25 | 432 | 7.84 | 7.8 | company_or_service | company |
| /pkrt/ | 24 | 258 | 4.84 | 13.0 | company_or_service | commercial |
| /panduan-maklon-deodorant-bpom/ | 23 | 718 | 1.65 | 10.2 | article | commercial |
| /cara-hitunghpp-produk-kosmeti/ | 20 | 1473 | 2.36 | 6.1 | article | informational |
| /alat-pengencang-wajah/ | 18 | 1003 | 0.9 | 6.6 | article | informational |
| /contoh-kalimat-iklan-kosmetik-unik/ | 17 | 3887 | 0.44 | 9.1 | article | informational |

### D.2 100 Besar Pemenang & Pecundang
- **Top 100 Winners:** `top-100-winners.csv` — didominasi homepage (+205), halaman handbody racikan (+95/+64), listicle pabrik skincare (+73).
- **Top 100 Losers:** `top-100-losers.csv` — didominasi halaman Instagram (−345), artikel tren lama, dan beberapa landing komersial yang jatuh ke 0 klik.

### D.3 Page Type Breakdown (jumlah & klik 90d)
| Page Type | Jumlah | Clicks 90d |
|---|---|---|
| article (knowledge) | ±450 | ±791 (root blog) |
| service_landing | ±70 | 499 |
| product | ±80 | 75 |
| company_or_service | ±25 | 99 |
| category | ±15 | 19 |

### D.4 Fragment URLs — Anomali
Terdeteksi halaman fragment (`#Daftar_5_Pabr`, `#Berapa_MOQ`) dengan impressions 500–1.100 tapi **0 klik**. Google tidak menampilkan fragment URL. Ini membuang impressions dan menandakan kebutuhan anchor/toc yang benar. Dikaitkan dengan 173 error "alternate proper canonical".

---

## E. ANALISIS DIREKTORI (90d vs 90d sebelumnya)
| Direktori | Klik 90d | Imp 90d | Klik Prev | Δ | CTR% | Growth% |
|---|---|---|---|---|---|---|
| /memunculkan-keranjang-reels/ | 699.0 | 18057.0 | 1044.0 | -345 | 3.87 | -33.04597701149425 |
| / | 486.0 | 6955.0 | 281.0 | 205 | 6.99 | 72.95373665480427 |
| /urutan-pabrik-skincare-terbaik-indonesia/ | 140.0 | 11863.0 | 67.0 | 73 | 1.18 | 108.955223880597 |
| /cara-meracik-handbody-pemutih-alami/ | 106.0 | 21602.0 | 11.0 | 95 | 0.49 | 863.6363636363636 |
| /cara-membuat-hb-dosting-sendiri/ | 82.0 | 3950.0 | 18.0 | 64 | 2.08 | 355.55555555555554 |
| /produk/ | 75.0 | 3532.0 | 0.0 | 75 | 2.12 | nan |
| /pabrik-maklon-kosmetik-surabaya-terlengkap/ | 64.0 | 3078.0 | 25.0 | 39 | 2.08 | 156.0 |
| /industri-kosmetik-indonesia-terus-tumbuh/ | 56.0 | 1653.0 | 94.0 | -38 | 3.39 | -40.42553191489362 |
| /jasa-maklon-parfum-bali-terbaik-terlengkap/ | 48.0 | 1633.0 | 34.0 | 14 | 2.94 | 41.176470588235304 |
| /contact-us/ | 44.0 | 2553.0 | 29.0 | 15 | 1.72 | 51.72413793103448 |
| /pabrik-parfum-surabaya/ | 37.0 | 1391.0 | 45.0 | -8 | 2.66 | -17.777777777777782 |
| /pabrik-parfum-jakarta/ | 37.0 | 1337.0 | 8.0 | 29 | 2.77 | 362.5 |
| /jasa-maklon-parfum-moq-rendah/ | 36.0 | 915.0 | 20.0 | 16 | 3.93 | 80.0 |
| /jenis-alkohol-dalam-parfum/ | 32.0 | 5060.0 | 20.0 | 12 | 0.63 | 60.00000000000001 |
| /tren-cleanical-beauty-produk-skincare-paling-dicari-tahun-… | 29.0 | 1196.0 | 0.0 | 29 | 2.42 | nan |
| /career/ | 25.0 | 432.0 | 12.0 | 13 | 5.79 | 108.33333333333334 |
| /pkrt/ | 24.0 | 258.0 | 39.0 | -15 | 9.3 | -38.46153846153846 |
| /panduan-maklon-deodorant-bpom/ | 23.0 | 718.0 | 2.0 | 21 | 3.2 | 1050.0 |
| /cara-hitunghpp-produk-kosmeti/ | 20.0 | 1506.0 | 6.0 | 14 | 1.33 | 233.33333333333334 |
| /category/ | 19.0 | 1592.0 | 9.0 | 10 | 1.19 | 111.11111111111111 |

---

## F. ANALISIS DEVICE, NEGARA, SEARCH APPEARANCE

### F.1 Device
| Device | Clicks | Impressions | CTR % | Avg Pos |
|---|---|---|---|---|
| MOBILE | 5490 | 237808 | 2.31 | 6.68 |
| DESKTOP | 3327 | 119829 | 2.78 | 13.03 |
| TABLET | 68 | 2820 | 2.41 | 8.26 |

> **Mobile-first wajib.** Desktop avg position 13.0 → di luar halaman 1. Optimasi desktop (crawl, schema, internal link) memiliki upside besar.

### F.2 Negara
| Negara | Clicks | Impressions | CTR % | Avg Pos |
|---|---|---|---|---|
| IDN | 8740 | 321172 | 2.72 | 8.39 |
| SGP | 25 | 702 | 3.56 | 8.25 |
| AUS | 22 | 457 | 4.81 | 10.39 |
| USA | 15 | 20527 | 0.07 | 10.82 |
| HKG | 13 | 394 | 3.3 | 7.8 |
| MYS | 12 | 1054 | 1.14 | 18.62 |
| KHM | 10 | 259 | 3.86 | 7.2 |
| CHN | 7 | 1439 | 0.49 | 9.39 |
| JPN | 6 | 611 | 0.98 | 9.17 |
| TWN | 4 | 412 | 0.97 | 9.06 |

> Indonesia = 98.4% klik. US punya 20.527 impressions tapi CTR 0.07% (query mismatch / traffic AI).

### F.3 Search Appearance
Tidak ada rich result signifikan (hanya AMP legacy: 14 klik, 1.681 impressions). **Peluang besar:** belum ada sitelinks/rich result/FAQ schema yang menangkap impression share.

---

## G. ANALISIS OPORTUNITAS INTERNAL

### G.1 Halaman High Impressions Low CTR (CTR Quick Wins)
| Halaman | Impressions | Klik | CTR% | Pos |
|---|---|---|---|---|
| /cara-meracik-handbody-pemutih-alami/ | 21162 | 106 | 0.45 | 8.1 |
| /urutan-pabrik-skincare-terbaik-indonesia/ | 8241 | 140 | 1.7 | 8.8 |
| /jenis-alkohol-dalam-parfum/ | 5060 | 32 | 0.84 | 8.8 |
| /perbedaan-moisturizer-gel-vs-cream/ | 4911 | 9 | 0.18 | 7.6 |
| /contoh-kalimat-iklan-kosmetik-unik/ | 3887 | 17 | 0.44 | 9.1 |
| /pabrik-maklon-kosmetik-surabaya-terlengkap/ | 2806 | 64 | 1.15 | 9.7 |
| /parfum-inspired-peluang-bisnis/ | 2607 | 9 | 0.35 | 7.8 |
| /contact-us/ | 2553 | 44 | 1.24 | 8.2 |
| /lulur-vs-hb-dosting/ | 2186 | 12 | 0.62 | 4.9 |

### G.2 Halaman Hampir Top 3 (posisi 4–8, impressions ≥ 1.000)
| Halaman | Impressions | Klik | Pos | CTR% |
|---|---|---|---|---|
| /memunculkan-keranjang-reels/ | 18057 | 699 | 4.9 | 3.31 |
| /perbedaan-moisturizer-gel-vs-cream/ | 4911 | 9 | 7.6 | 0.18 |
| /cara-membuat-hb-dosting-sendiri/ | 3614 | 82 | 6.6 | 2.27 |
| /parfum-inspired-peluang-bisnis/ | 2607 | 9 | 7.8 | 0.35 |
| /lulur-vs-hb-dosting/ | 2186 | 12 | 4.9 | 0.62 |
| /cara-hitunghpp-produk-kosmeti/ | 1473 | 20 | 6.1 | 2.36 |
| /tren-cleanical-beauty-produk-skincare-paling-dicari-tahun-… | 1196 | 29 | 6.2 | 2.69 |
| /urutan-pabrik-skincare-terbaik-indonesia/#Daftar_5_Pabrik_… | 1081 | 0 | 7.8 | 0.0 |
| /services/ | 1049 | 15 | 7.8 | 0.74 |
| /urutan-pabrik-skincare-terbaik-indonesia/#Berapa_MOQ_di_DR… | 1007 | 0 | 7.7 | 0.0 |
| /alat-pengencang-wajah/ | 1003 | 18 | 6.6 | 0.9 |

### G.3 Kanibalisasi (786 query dengan 2+ halaman)
| Query | Jml Halaman | Clicks | Impressions |
|---|---|---|---|
| dreamlab | 127 | 859 | 16495 |
| dreamlab kosmetik | 80 | 89 | 5222 |
| pt karya impian laboratoris | 119 | 150 | 5072 |
| dreamlab surabaya | 55 | 71 | 4865 |
| dream lab | 19 | 188 | 2894 |
| maklon skincare terbaik | 13 | 14 | 2518 |
| maklon parfum surabaya | 15 | 62 | 1861 |
| parfum inspired artinya | 7 | 0 | 1830 |
| inspired parfum artinya | 7 | 2 | 1466 |
| inspired parfum adalah | 7 | 0 | 1372 |
| maklon kosmetik surabaya | 9 | 29 | 1365 |
| karya impian laboratoris | 22 | 68 | 1283 |

---

## H. SEARCH INTENT & BISNIS

### H.1 Money Pages Prioritas
| Halaman | Klik | Impressions | CTR% | Pos | Priority |
|---|---|---|---|---|---|
| /urutan-pabrik-skincare-terbaik-indonesia/ | 140 | 8241 | 1.7 | 8.8 | 73.5 |
| / | 486 | 6955 | 7.74 | 8.1 | 67.3 |
| /lulur-vs-hb-dosting/ | 12 | 2186 | 0.62 | 4.9 | 65.8 |
| /pabrik-maklon-kosmetik-surabaya-terlengkap/ | 64 | 2806 | 1.15 | 9.7 | 65.1 |
| /parfum-inspired-peluang-bisnis/ | 9 | 2607 | 0.35 | 7.8 | 65.0 |
| /pabrik-parfum-surabaya/ | 37 | 1391 | 2.16 | 8.3 | 60.4 |
| /cysteamine-alternatif-hydroquinone/ | 13 | 1291 | 1.01 | 8.6 | 60.3 |
| /affiliate-kol-brand-skincare/ | 6 | 1167 | 0.51 | 9.9 | 59.8 |
| /pabrik-parfum-jakarta/ | 37 | 1337 | 1.4 | 17.0 | 59.7 |
| /urutan-pabrik-skincare-terbaik-indonesia/#Daftar_5_Pabrik_… | 0 | 1081 | 0.0 | 7.8 | 59.5 |
| /services/ | 15 | 1049 | 0.74 | 7.8 | 59.1 |
| /jasa-maklon-parfum-bali-terbaik-terlengkap/ | 48 | 1089 | 2.21 | 31.4 | 58.4 |
| /rekomendasi-sunscreen-lokal/ | 4 | 978 | 0.41 | 10.5 | 58.3 |
| /pabrik-parfum-malang-dreamlab/ | 17 | 811 | 1.1 | 8.5 | 57.6 |
| /biaya-maklon-parfum-moq-kecil/ | 13 | 785 | 0.84 | 11.4 | 57.1 |

### H.2 Halaman Yang Perlu Diperbaiki Dulu
1. `/urutan-pabrik-skincare-terbaik-indonesia/` — 8.241 impressions, CTR 1.7%, pos 8.8 (potensi +272 klik)
2. `/cara-meracik-handbody-pemutih-alami/` — 21.162 impressions, CTR 0.45% (potensi +962 klik)
3. `/perbedaan-moisturizer-gel-vs-cream/` — 4.911 impressions, CTR 0.18% (potensi +236 klik)
4. `/jenis-alkohol-dalam-parfum/` — 5.060 impressions, CTR 0.84%
5. `/lulur-vs-hb-dosting/` — 2.186 impressions, CTR 0.62%
6. `/contoh-kalimat-iklan-kosmetik-unik/` — 3.887 impressions, CTR 0.44%
7. `/parfum-inspired-peluang-bisnis/` — 2.607 impressions, CTR 0.35%

### H.3 Halaman Untuk Diabaikan / Dimerger
- `/pabrik-parfum-makasar/`, `/maklon-kosmetik-parfum-tangerang/`, `/maklon-parfum-jakarta/` — landing tipis dengan 0 klik; merge/redirect ke hub yang lebih kuat.
- 223+ artikel low-demand (< 50 impressions) — biarkan sebagai supporting authority, jangan hapus massal.

---

## I. SEO HEALTH SUMMARY

| Aspek | Status | Bukti |
|---|---|---|
| CTR | 🔴 KRITIS | 1.76% (terendah 16 bulan) |
| Position | 🟡 MENURUN | 6.24 (Nov) → 8.48 (Jul); head-terms di pos 34–35 |
| Indexing | 🔴 KRITIS | 46 halaman komersial tidak terindeks; 3 kategori produk diblokir robots.txt |
| Kanibalisasi | 🟠 TINGGI | 786 query multi-halaman |
| Content Decay | 🟠 TINGGI | Instagram cluster −33%, artikel tren lama turun |
| Opportunity Clusters | 🟢 BESAR | handbody racikan, parfum inspired, brand queries |
| Rich Results | 🟠 KOSONG | Tidak ada schema-driven rich result |

---

## J. PRIORITY MATRIX

| ID | Isu | Impact Bisnis | Impact SEO | Kesulitan | Estimasi Waktu | Confidence | Prioritas |
|---|---|---|---|---|---|---|---|
| P0-1 | robots.txt memblokir 3 kategori produk | TINGGI | TINGGI | Rendah | 2 jam | 95% | **P0 KRITIS** |
| P0-2 | Produk sub-page noindex | TINGGI | TINGGI | Sedang | 1–2 hari | 90% | **P0 KRITIS** |
| P1-1 | CTR collapse (title/meta 20 halaman) | SANGAT TINGGI | TINGGI | Rendah | 3–5 hari | 85% | **P1 TINGGI** |
| P1-2 | Head-terms (maklon parfum/skincare) pos 34–35 | SANGAT TINGGI | TINGGI | Sedang | 4–8 minggu | 60% | **P1 TINGGI** |
| P1-3 | 46 halaman komersial tidak terindeks | TINGGI | TINGGI | Sedang | 1–2 minggu | 75% | **P1 TINGGI** |
| P2-1 | Sinkron sitemap dengan 410 | RENDAH | SEDANG | Rendah | 3 jam | 95% | P2 |
| P2-2 | Kanibalisasi (786 query) | SEDANG | SEDANG | Sedang | 2–3 minggu | 70% | P2 |
| P2-3 | Duplicate canonical thankyou pages | RENDAH-SEDANG | SEDANG | Rendah | 1 hari | 90% | P2 |
| P2-4 | Fragment URL impressions | RENDAH | SEDANG | Rendah | 2 hari | 85% | P2 |
| P3-1 | Desktop position 13 | SEDANG | SEDANG | Tinggi | 2–3 bulan | 50% | P3 |
| P3-2 | Backlink/authority building | SEDANG | SEDANG | Tinggi | 3+ bulan | 40% | P3 |

---

*Seluruh file data: `page-performance.csv`, `query-performance.csv`, `page-opportunities.csv`, `query-opportunities.csv`, `folder-performance.csv`, `directory-performance.csv`, `cannibalization.csv`, `monthly-trend.csv`, `daily-trend.csv`, `dashboard.json`.*
