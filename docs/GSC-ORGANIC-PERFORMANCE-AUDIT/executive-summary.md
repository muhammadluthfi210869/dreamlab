# EXECUTIVE SUMMARY — Organic Performance Intelligence Audit
## dreamlab.id | Maklon Kosmetik & Skincare (Surabaya)

**Tanggal laporan:** 31 July 2026  
**Sumber data:** Google Search Console API (Service Account) — 16 bulan (31 Mar 2025 → 28 Jul 2026)  
**Properti:** sc-domain:dreamlab.id (domain-level, includes www + non-www)

---

## 1. VERDICT EKSEKUTIF

> **Dreamlab sedang terjebak dalam "pertumbuhan tanpa panen".** Impressions berada di level tertinggi sepanjang masa (~42–47 ribu/bulan) tetapi clicks menurun dari puncak 1.085 (Nov 2025) menjadi 751 (Jul 2026). **CTR organik runtuh dari 4.0%+ menjadi 1.76%** — artinya Google semakin banyak menampilkan situs ini, tetapi semakin sedikit pengguna yang mengklik. Sebagian besar traffic ini juga **tidak komersial**: satu halaman off-topic (tutorial keranjang Instagram) menyumbang 1/3 dari seluruh klik.

**Angka paling penting:**

| Metrik | Nilai | Implikasi |
|---|---|---|
| Clicks 16 bulan | 8.885 | Volume kecil (skala bisnis kontraktor B2B) |
| Impressions 16 bulan | 360.457 | Potensi pasar jelas ada |
| CTR keseluruhan | 2.46% | Jauh di bawah benchmark 5–8% |
| Avg Position | 8.8 | Bertahan di halaman 1 bawah |
| **CTR bulan ini (Jul 2026)** | **1.76%** | **Terendah dalam 16 bulan** |
| **Clicks 30 hari terakhir vs 30 hari sebelumnya** | **837 vs 947 (−11.6%)** | **Tren penurunan AKTIF** |
| Mobile vs Desktop avg position | **6.7 vs 13.0** | Desktop hampir tidak terlihat |

---

## 2. APA YANG TERJADI (Timeline 16 Bulan)

| Bulan | Clicks | Impressions | CTR % | Avg Pos | Peristiwa |
|---|---|---|---|---|---|
| Mar 2025 | 0 | 69 | 0.0 | 39.8 | Peluncuran / minimal terindeks |
| Apr–Sep 2025 | 86–204 | 2–5.8rb | 4.2–5.7 | 13–25 | Tahap pembangunan otoritas |
| **Okt–Nov 2025** | **538 → 1.085** | 12.5–26.9rb | 4.0 | **6.2** | **PUNCAK — puncak clicks** |
| Des 2025 – Mar 2026 | 899 → 533 | 27.9–35.7rb | 1.9–2.5 | 8–10 | Penurunan musiman + core update |
| **Apr 2026** | **1.033** | **47.335 (rekor)** | 2.2 | **6.75** | **Pemulihan kuat** |
| Mei–Jun 2026 | 1.002 / 979 | 43–45rb | 2.2–2.3 | 8.2–9.0 | Stabil, posisi merosot |
| **Jul 2026** | **751** | 42.740 | **1.76** | 8.5 | **Penurunan terbaru — IMPRESSIONS TINGGI, KLIK RENDAH** |

**Deteksi penurunan signifikan (mingguan, baseline ≥ 60 klik/minggu):**

| Periode | Klik sebelum | Klik sesudah | Penurunan |
|---|---|---|---|
| 22–28 Des 2025 | 247 | 176 | −28.7% |
| 29 Des – 4 Jan 2026 | 260 | 164 | −36.9% |
| 12–18 Jan 2026 | 206 | 108 | −47.6% |
| 2–8 Feb 2026 | 178 | 125 | −29.8% |
| 16–22 Mar 2026 | 149 | 83 | −44.3% |
| 22–28 Jun 2026 | 252 | 183 | −27.4% |
| **6–12 Jul 2026** | **240** | **144** | **−40.0%** |
| **27 Jul – 2 Agu 2026** | **205** | **81** | **−60.5% (minggu parsial)** |

> Penurunan Maret 2026 (−44%) bersesuaian dengan periode core update Google Maret 2026. Penurunan Jun–Jul 2026 bersesuaian dengan periode migrasi WordPress → Next.js dan koreksi teknis (robots.txt, noindex, canonical). **Bulan Juli menunjukkan tren penurunan paling agresif.**

---

## 3. KENAPA INI TERJADI (Root Cause — 5 Faktor Utama)

### 3.1 Sumber traffic #1 adalah halaman OFF-TOPIC dan sedang membusuk
`/memunculkan-keranjang-reels/` (tutorial keranjang belanja Instagram) menyumbang **2.937 klik (33% dari seluruh klik 16 bulan)**. Dalam 90 hari terakhir, halaman ini **kehilangan 345 klik (−33%)** karena:
- Topik tidak terkait bisnis maklon — tidak menghasilkan lead.
- Volume pencarian "keranjang Instagram" mereda setelah fitur menjadi umum.
- Google mendeprioritaskan konten yang tidak selaras dengan entitas utama situs.

**Implikasi bisnis:** 33% traffic situs ini tidak pernah menghasilkan revenue. Angka total clicks (751/bulan) **menyesatkan** — traffic komersial sebenarnya jauh lebih kecil.

### 3.2 CTR runtuh — judul & meta description tidak menjual
Impressions naik 12x sejak awal (2rb → 43rb/bulan) tetapi CTR turun dari 4.3% → 1.76%. Halaman dengan impressions tertinggi justru CTR terburuk:

| Halaman | Impressions 90d | Clicks | CTR % | Posisi |
|---|---|---|---|---|
| /cara-meracik-handbody-pemutih-alami/ | 21.162 | 106 | 0.45 | 8.1 |
| /memunculkan-keranjang-reels/ | 18.057 | 699 | 3.31 | 4.9 |
| /urutan-pabrik-skincare-terbaik-indonesia/ | 8.241 | 140 | 1.70 | 8.8 |
| /perbedaan-moisturizer-gel-vs-cream/ | 4.911 | 9 | 0.18 | 7.6 |
| /jenis-alkohol-dalam-parfum/ | 5.060 | 32 | 0.84 | 8.8 |
| /contoh-kalimat-iklan-kosmetik-unik/ | 3.887 | 17 | 0.44 | 9.1 |

> **Jika halaman-halaman ini mencapai CTR normal (5% untuk posisi 5–10), situs menambahkan ±3.000 clicks/bulan** — 3x lipat total traffic saat ini — tanpa mengubah ranking satu posisi pun.

### 3.3 Kata kunci komersial (money keywords) ranking jauh di bawah
| Query | Impressions 90d | Clicks 90d | Posisi |
|---|---|---|---|
| maklon parfum surabaya | 681 | 29 | 8.6 |
| maklon skincare terbaik | 515 | 10 | 7.5 |
| pabrik skincare | 488 | 1 | 14.9 |
| maklon kosmetik surabaya | 458 | 20 | 10.2 |
| pabrik kosmetik surabaya | 401 | 2 | 14.2 |
| **maklon parfum** | **372** | **1** | **34.1** ⚠️ |
| pabrik parfum | 369 | 4 | 12.6 |
| maklon kosmetik | 366 | 6 | 15.4 |
| **maklon skincare** | **309** | **3** | **35.3** ⚠️ |

> **Query head-terms utama (maklon parfum, maklon skincare) terlempar ke halaman 3–4 (posisi 34–35).** Ini adalah kehilangan komersial terbesar — query inilah yang diharapkan mengirim calon pelanggan maklon. Ada pergeseran besar sejak migrasi.

### 3.4 Desktop hampir tidak terlihat
- **Mobile:** 5.490 klik, avg position **6.7**
- **Desktop:** 3.327 klik, avg position **13.0** (di luar halaman 1)
- Tablet: 68 klik
- 98.4% traffic berasal dari Indonesia.

### 3.5 Isu teknis pasca-migrasi (Next.js)
Berdasarkan audit teknis internal (31 Jul 2026) + data coverage GSC:
- **robots.txt memblokir 3 kategori produk** yang seharusnya di-index (`/produk/babycare/`, `/produk/decorative/`, `/produk/footcare/`).
- **Produk sub-page di-noindex** tanpa strategi yang terdokumentasi.
- **±46 halaman bernilai komersial tidak terindeks** (`perusahaan-maklon-kosmetik/`, `maklon-kosmetik-tangerang-terpercaya/`, `rekomendasi-maklon-kosmetik-terbaik-dreamlab/`).
- **786 query mengalami kanibalisasi** (2+ halaman bersaing untuk query yang sama).
- Sitemap masih berisi URL 410.

---

## 4. DI MANA TRAFFIC HILANG / BERTAMBAH (90 Hari Terakhir)

**Dirugikan (losses 90d):**
| Halaman | Klik (90d) | Δ Klik | CTR % | Pos | Tipe |
|---|---|---|---|---|---|
| /memunculkan-keranjang-reels/ | 699 | -345 | 3.31 | 4.9 | article |
| /industri-kosmetik-indonesia-terus-tumbuh/ | 56 | -38 | 3.39 | 8.5 | article |
| /maklon-parfum-jakarta/ | 0 | -22 | 3.72 | 8.7 | service |
| /pkrt/ | 24 | -15 | 4.84 | 13.0 | company_or_service |
| /pabrik-parfum-makasar/ | 0 | -10 | 0.0 | 9.0 | service_landing |
| /maklon-kosmetik-parfum-tangerang/ | 0 | -9 | 1.15 | 13.0 | service |
| /pabrik-parfum-surabaya/ | 37 | -8 | 2.16 | 8.3 | service_landing |
| /tren-parfum-arab-bisnis-maklon-dreamlab/ | 0 | -8 | 2.38 | 5.0 | article |
| /state-of-beauty-2025-tren-kecantikan-pertumbuhan-industri-ko… | 6 | -7 | 1.37 | 9.6 | article |
| /maklon-jakarta-terbaik/ | 4 | -7 | 5.03 | 12.8 | service |

**Pendapatan baru (gains 90d):**
| Halaman | Klik (90d) | Δ Klik | CTR % | Pos | Tipe |
|---|---|---|---|---|---|
| / | 486 | 205 | 7.74 | 8.1 | homepage |
| /cara-meracik-handbody-pemutih-alami/ | 106 | 95 | 0.45 | 8.1 | article |
| /urutan-pabrik-skincare-terbaik-indonesia/ | 140 | 73 | 1.7 | 8.8 | article |
| /cara-membuat-hb-dosting-sendiri/ | 82 | 64 | 2.27 | 6.6 | article |
| /pabrik-maklon-kosmetik-surabaya-terlengkap/ | 64 | 39 | 1.15 | 9.7 | service_landing |
| /tren-cleanical-beauty-produk-skincare-paling-dicari-tahun-20… | 29 | 29 | 2.69 | 6.2 | article |
| /pabrik-parfum-jakarta/ | 37 | 29 | 1.4 | 17.0 | service_landing |
| /panduan-maklon-deodorant-bpom/ | 23 | 21 | 1.65 | 10.2 | article |
| /jasa-maklon-parfum-moq-rendah/ | 36 | 16 | 2.28 | 12.4 | service_landing |
| /contact-us/ | 44 | 15 | 1.24 | 8.2 | company_or_service |

**Performance per direktori (90d vs 90d sebelumnya):**
| Direktori | Klik | Impressions | Δ | CTR% | Growth |
|---|---|---|---|---|---|
| /blog-articles/ (root level) | 791 | 93732 | 340 | 0.84 | 75% |
| /instagram-cluster/ | 699 | 18057 | -345 | 3.87 | -33% |
| /service-landing/ (maklon landing) | 499 | 19086 | 204 | 2.61 | 69% |
| Homepage | 486 | 6955 | 205 | 6.99 | 73% |
| /company/ (corporate) | 99 | 5076 | 45 | 1.95 | 83% |
| /produk/ (product pages) | 75 | 3532 | 75 | 2.12 |  |
| /service-category/ (product category) | 52 | 2014 | -18 | 2.58 | -26% |
| /category/ (blog categories) | 19 | 1592 | 10 | 1.19 | 111% |
| /news-blog/ (blog) | 5 | 450 | 3 | 1.11 | 150% |

> **Poin kunci:** Traffic komersial (service landing +69%, homepage +73%) sedang tumbuh dari basis kecil, sementara traffic off-topic terbesar (Instagram cluster −33%) menyusut. **Struktur traffic sedang berubah ke arah yang lebih sehat, tetapi perlu percepatan.**

---

## 5. OPORTUNITAS TERBESAR

### 5.1 Perbaikan CTR pada halaman impressions-tinggi (potensi +3.000 klik/bulan)
| Halaman | Impressions | Klik | CTR% | Pos | Potensi Klik | Tipe |
|---|---|---|---|---|---|---|
| /memunculkan-keranjang-reels/ | 18057 | 699 | 3.31 | 4.9 | 1207.3 | article |
| /cara-meracik-handbody-pemutih-alami/ | 21162 | 106 | 0.45 | 8.1 | 962.8 | article |
| /urutan-pabrik-skincare-terbaik-indonesia/ | 8241 | 140 | 1.7 | 8.8 | 272.1 | article |
| /perbedaan-moisturizer-gel-vs-cream/ | 4911 | 9 | 0.18 | 7.6 | 236.5 | article |
| /jenis-alkohol-dalam-parfum/ | 5060 | 32 | 0.84 | 8.8 | 210.5 | article |
| /lulur-vs-hb-dosting/ | 2186 | 12 | 0.62 | 4.9 | 205.1 | article |
| /contoh-kalimat-iklan-kosmetik-unik/ | 3887 | 17 | 0.44 | 9.1 | 177.3 | article |
| /parfum-inspired-peluang-bisnis/ | 2607 | 9 | 0.35 | 7.8 | 121.4 | article |
| /pabrik-maklon-kosmetik-surabaya-terlengkap/ | 2806 | 64 | 1.15 | 9.7 | 108.1 | service_landing |
| /cara-membuat-hb-dosting-sendiri/ | 3614 | 82 | 2.27 | 6.6 | 98.7 | article |

### 5.2 Kata kunci komersial dengan potensi konversi (position 4–15)
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

### 5.3 Pasar mobile (62% klik) — fokus optimasi mobile-first
### 5.4 Kategori produk yang diblokir robots.txt — unblock = landing pages baru
### 5.5 Konten baru dengan permintaan terbukti (cluster handbody racikan, parfum inspired)

---

## 6. REKOMENDASI TOP (Urutan Eksekusi)

| # | Aksi | Dampak | Upaya | Timeline |
|---|---|---|---|---|
| 1 | **Fix robots.txt** — unblock 3 kategori produk | +indexing produk | 2 jam | Minggu 1 |
| 2 | **Decide produk sub-page strategy** (index/noindex) | +landing komersial | 1 hari | Minggu 1 |
| 3 | **Optimasi CTR 20 halaman impressions-tinggi** (title+meta) | **+1.500–2.500 klik/bln** | 3–5 hari | Minggu 1–2 |
| 4 | **Perbaiki 2 query head-term** (maklon parfum, maklon skincare pos 34–35) | +capture komersial | konten+link | Minggu 2–4 |
| 5 | **Sinkronkan sitemap dengan 410 patterns** | crawl budget | 3 jam | Minggu 2 |
| 6 | **Internal linking dari konten authority ke money pages** | +otoritas komersial | mingguan | Berkelanjutan |
| 7 | **Kurangi ketergantungan halaman Instagram** — ganti dengan konten komersial | keberlanjutan | strategi konten | Bulan 2–3 |

---

## 7. PROYEKSI DAMPAK & ROI

**Model konservatif (asumsi: maklon B2B, AOV Rp 50–150 juta/order, lead rate 3% klik komersial, close rate 15%):**

| Skenario | Klik komersial/bln | Lead/bln | Deal/bln | Revenue/bln |
|---|---|---|---|---|
| **Saat ini** | ±500 | 15 | 2–3 | **Rp 150–450 juta** |
| **Setelah CTR fix (+2.000 klik/bln)** | ±1.200 | 36 | 5–6 | **Rp 500–900 juta** |
| **+ posisi head-term naik ke top 10** | ±2.000 | 60 | 9–10 | **Rp 900 juta – 1.5 Miliar** |

> **Batas bawah dampak 90 hari: memulihkan 1.000+ klik komersial/bulan setara Rp 300–600 juta revenue organik bulanan.** Biaya utamanya adalah waktu tim internal (bukan iklan). ROI organik sangat tinggi karena ini aset permanen.

**Yang TIDAK boleh dilakukan:**
1. Jangan menghapus halaman Instagram sebelum ada pengganti traffic (masih menyumbang 699 klik).
2. Jangan sekaligus mengubah struktur URL / redirect saat optimasi CTR berjalan (risiko rangkaian).
3. Jangan membeli backlink massal untuk mengejar posisi — risiko penalti; fokus pada topik & otoritas.
4. Jangan membuat 100+ halaman programmatic baru sebelum halaman existing terindeks dengan baik.
5. Jangan mengabaikan desktop — meski mobile dominan, desktop position 13 mengindikasikan masalah crawl/index yang sama.

---

*Data lengkap tersedia di: `page-performance.csv`, `query-performance.csv`, `page-opportunities.csv`, `query-opportunities.csv`, `folder-performance.csv`, `monthly-trend.csv`, `daily-trend.csv`, `dashboard.json`.*
