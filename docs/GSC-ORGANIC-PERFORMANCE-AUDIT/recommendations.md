# REKOMENDASI STRATEGIS — 90-Day Organic Lead Recovery Plan
## dreamlab.id | Baseline Audit 31 Jul 2026

**Filosofi:** Jangan kejar angka total clicks. Kejar **clicks komersial** (yang menghasilkan lead maklon). Prioritas = perbaiki apa yang sudah diindeks + memiliki impressions, sebelum membuat konten baru.

---

## 1. TOP 10 AKSI BERDAMPAK TERBESAR

| Peringkat | Aksi | Target | Dampak Klik | Estimasi ROI |
|---|---|---|---|---|
| 1 | **Fix robots.txt** (unblock /produk/babycare/, /decorative/, /footcare/) | Indexing produk | +50–200 klik komersial | 2 jam kerja → aset permanen |
| 2 | **Optimasi CTR 20 halaman impressions-tinggi** | CTR 0.5%→3–5% | **+1.500–2.500 klik/bln** | 3–5 hari → Rp 300–600 jt/bln |
| 3 | **Perbaiki head-terms** (maklon parfum pos 34, maklon skincare pos 35) | Top 10 | +100–300 klik komersial/bln | konten+internal link, 4–8 minggu |
| 4 | **Indekskan 46 halaman komersial** yang crawled-not-indexed | Indexing | +50–150 klik komersial | enrich konten + request indexing |
| 5 | **Internal linking ke money pages** dari 20 artikel authority | Otoritas komersial | compounding | mingguan, murah |
| 6 | **Perbaiki kanibalisasi** 786 query | Rank consolidation | +10–30% CTR head-terms | 2–3 minggu |
| 7 | **Title/meta untuk 66 halaman impressions-0 klik** | Zero-click → klik | +200–500 klik | 5 hari |
| 8 | **Sinkronkan sitemap** dengan 410 patterns | Crawl budget | indirect | 3 jam |
| 9 | **Konten klaster handbody racikan & parfum inspired** (permintaan terbukti) | New traffic | +200–400 klik/bln | 2–4 minggu konten |
| 10 | **Optimasi mobile & speed** (LCP < 2.5s, INP < 200ms) | Mobile pos 6.7→4 | +10–20% CTR | 1–2 minggu dev |

---

## 2. AKSI YANG HARUS DIKERJAKAN MINGGU INI (Sprint 1)

### P0 — Teknis (hari 1–3)
1. **Unblock robots.txt** — hapus `Disallow: /produk/babycare/`, `/produk/decorative/`, `/produk/footcare/` dari `src/app/robots.ts`. Pertahankan `/produk/pkrt/` (410). Verifikasi live.
2. **Keputusan produk sub-page** — audite semua `/produk/*/*/`. Jika konten ≥ 500 kata unik → `index`. Jika tipis → `noindex` konsisten + canonical ke parent.
3. **Sinkron sitemap filter** dengan `GONE_PATTERNS` proxy.
4. **Request indexing** untuk halaman yang baru terindeks.

### P1 — CTR (hari 3–7)
Optimasi title (≤ 60 char) + meta description (≤ 155 char) untuk halaman berikut — **pakai pola: angka + benefit + BPOM/Halal/MOQ + kata kunci**:

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

**Contoh perbaikan title (pola):**
- `/cara-meracik-handbody-pemutih-alami/` → `"Resep Handbody Pemutih Alami Racikan Sendiri (Terbukti Cepat) — Cara, Bahan, Takaran"` — 21.162 impressions, CTR 0.45% → target 4%.
- `/perbedaan-moisturizer-gel-vs-cream/` → `"Perbedaan Moisturizer Gel vs Cream: Kandungan, Tekstur & Mana untuk Kulitmu?"` — CTR 0.18% → target 4%.
- `/jenis-alkohol-dalam-parfum/` → `"Jenis Alkohol dalam Parfum (Ethanol, SD Alcohol, Denat): Fungsi & Perbedaan"` — CTR 0.84% → target 5%.

---

## 3. AKSI 30 HARI (Sprint 2) — Konten & Internal Linking

### 3.1 Internal Linking — 20 Artikel Authority → Money Pages
Artikel dengan impressions & otoritas tertinggi harus menautkan ke money pages:

| Artikel Authority | Impressions | Pos | Tipe |
|---|---|---|---|
| /memunculkan-keranjang-reels/ | 18057 | 4.9 | article |
| /cara-meracik-handbody-pemutih-alami/ | 21162 | 8.1 | article |
| /urutan-pabrik-skincare-terbaik-indonesia/ | 8241 | 8.8 | article |
| /perbedaan-moisturizer-gel-vs-cream/ | 4911 | 7.6 | article |
| /jenis-alkohol-dalam-parfum/ | 5060 | 8.8 | article |
| /lulur-vs-hb-dosting/ | 2186 | 4.9 | article |
| /contoh-kalimat-iklan-kosmetik-unik/ | 3887 | 9.1 | article |
| /parfum-inspired-peluang-bisnis/ | 2607 | 7.8 | article |
| /pabrik-maklon-kosmetik-surabaya-terlengkap/ | 2806 | 9.7 | service_landing |
| /cara-membuat-hb-dosting-sendiri/ | 3614 | 6.6 | article |
| /contact-us/ | 2553 | 8.2 | company_or_service |
| /urutan-pabrik-skincare-terbaik-indonesia/#Daftar_5_Pabrik_… | 1081 | 7.8 | article |

**Money pages yang harus menerima link:** `/`, `/pabrik-maklon-kosmetik-surabaya-terlengkap/`, `/pabrik-parfum-surabaya/`, `/contact-us/`, `/produk/` hub, halaman layanan `/maklon/`, `/pkrt/`, `/parfum/`.

### 3.2 Perbaiki Kanibalisasi
786 query memiliki 2+ halaman. Prioritaskan yang berdampak komersial:

| Query | Halaman | Clicks | Impressions |
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

Tindakan: tentukan satu canonical page per query, 301 halaman duplikat tipis, perkuat internal link ke pemenang.

### 3.3 Indekskan Halaman Komersial Tidak Terindeks
Enrich konten (min. 500 kata unik + data) lalu request indexing untuk: `perusahaan-maklon-kosmetik/`, `maklon-kosmetik-tangerang-terpercaya/`, `rekomendasi-maklon-kosmetik-terbaik-dreamlab/`, `bisnis-kosmetik-dari-nol/`.

---

## 4. AKSI 60–90 HARI (Sprint 3) — Pertumbuhan

### 4.1 Konten Baru (permintaan terbukti dari data)
Klaster dengan impressions & intent komersial kuat:
1. **Handbody racikan** (`cara membuat handbody racikan sendiri agar cepat putih` 1.788 imp; `hb racikan sendiri` 459 imp) — buat hub + 5 sub-topik, semua menautkan ke `/cara-meracik-handbody-pemutih-alami/` dan ke halaman maklon body care.
2. **Parfum inspired** (`apa itu inspired parfum` 460 imp, `parfum inspired adalah` 275 imp) — hub + perbandingan, menautkan ke `/parfum-inspired-peluang-bisnis/` dan `/jasa-maklon-parfum-moq-rendah/`.
3. **Local maklon** (Surabaya/Jakarta/Bandung/Bali + kategori) — halaman lokal dengan data spesifik.

### 4.2 Head-Term Recovery
- `maklon parfum` (pos 34) → rebuild `/parfum/` + `/produk/parfum/` hub, kumpulkan internal link dari 20+ artikel parfum, request indexing.
- `maklon skincare` (pos 35) → same untuk cluster skincare.
- Sertakan schema Service + FAQ + LocalBusiness, perkuat dengan konten asli (kapasitas, MOQ, BPOM, halal).

### 4.3 Otoritas & Backlink (Bulan 3+)
- Guest post / kolaborasi di blog industri kecantikan Indonesia.
- Digital PR: data riset "State of Beauty Indonesia" untuk dikutip media.
- Pastikan GBP (Google Business Profile) terhubung (60%+ local search akan punya AI Overview).

---

## 5. YANG TIDAK BOLEH DILAKUKAN

| Larangan | Alasan |
|---|---|
| Jangan hapus halaman Instagram sebelum pengganti siap | Masih 699 klik/bln |
| Jangan ubah struktur URL massal saat CTR fix berjalan | Risiko rangkaian, buang momentum |
| Jangan 100+ halaman programmatic baru sebelum existing terindeks | Menambah crawled-not-indexed |
| Jangan beli backlink massal | Risiko penalti manual |
| Jangan abaikan desktop | Menandakan masalah indexing struktural |
| Jangan ubah H1 massal di 200 artikel tanpa A/B | Risiko kehilangan relevansi |

---

## 6. PROYEKSI 90 HARI

| Metrik | Baseline (Jul) | Target 90 Hari | Optimis |
|---|---|---|---|
| Clicks/bulan | 751 | 1.200 | 1.800 |
| Clicks komersial/bulan | ±500 | 1.000 | 1.600 |
| CTR keseluruhan | 1.76% | 3.0% | 4.5% |
| Indexed pages | ±180 | 250 | 320 |
| Est. revenue organik/bulan | Rp 150–450 jt | Rp 500–900 jt | Rp 1–1.5 M |

**Key assumption:** lead rate 3% klik komersial, close rate 15%, AOV Rp 50–150 jt. Validasi dengan GA4 & CRM (NexERP) — integrasi sudah terpasang.

---

## 7. MONITORING & KPI MINGGUAN
1. Clicks komersial (filter query: maklon, pabrik, jasa, harga, moq)
2. CTR halaman top-20 impressions
3. Position head-terms (maklon parfum, maklon skincare, maklon kosmetik)
4. Indexing: Crawled-not-indexed + Blocked by robots.txt
5. Kanibalisasi count
6. Zero-click pages (% halaman tanpa klik)

---

*Dibuat otomatis dari data GSC 16 bulan. Perbarui mingguan via `10_collect_data.py`.*
