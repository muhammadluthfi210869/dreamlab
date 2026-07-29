# 🏗️ SEO Problem & Plan: dreamlab.id

**Tanggal:** 2026-07-29  
**Status:** 🔴 KRITIS — 1.540 halaman tidak terindeks  
**Target:** Turunkan "Not Indexed" dari 1.540 → ~600 dalam 30 hari  

---

## Review Strategis SEO/AEO/GEO — 2026-07-29

**Skor ketepatan plan saat ini: 72/100.**

Rinciannya:

| Area | Skor | Catatan |
|---|:---:|---|
| Diagnosis arah besar | 80% | Benar bahwa masalah utama adalah URL inventory, low-value/legacy URLs, sitemap hygiene, canonical/noindex, dan content quality. |
| Akurasi data teknis | 62% | Beberapa angka stale/overstated. Verifikasi lokal menunjukkan `generateStaticParams()` unik sekitar 305 URL, bukan 411. Sitemap produksi/lokal saat review berisi 302 URL, bukan 424. |
| Prioritas eksekusi | 70% | Prioritas clean-up benar, tapi `generateStaticParams()` bukan sumber discovery Google secara langsung. Sitemap, internal link, redirect, backlink, dan histori crawl lebih menentukan discovery. |
| Proyeksi 30 hari | 50% | Target total "Not Indexed" turun ke 600 terlalu agresif dan memakai KPI yang kurang tepat. `noindex` dan `410` sering tetap muncul sebagai excluded/not indexed di GSC selama beberapa minggu/bulan. |
| SEO/AEO/GEO alignment | 78% | Fokus crawlability, helpful content, canonical, sitemap, dan entity clarity sudah benar. Jangan mengejar schema/FAQ/AI markup sebagai shortcut. Google generative AI Search tetap bertumpu pada SEO fundamentals. |

### Koreksi besar terhadap plan

1. **Jangan jadikan total "Not Indexed" sebagai KPI utama.**  
   KPI yang lebih benar:
   - `Crawled - currently not indexed` untuk URL indexable harus turun.
   - Sitemap hanya berisi URL 200, indexable, self-canonical.
   - URL komersial penting naik impressions/clicks/leads.
   - Legacy 404/410/redirect terklasifikasi rapi, bukan hilang instan dari GSC.

2. **`generateStaticParams()` bukan penyebab utama Google menemukan URL.**  
   Ia memengaruhi static build footprint. Google menemukan URL dari sitemap, internal link, redirect, external link, histori WordPress, dan canonical signals. Tetap boleh difilter, tapi jangan klaim expected impact `-200 not indexed` hanya dari P1.

3. **Angka inventory perlu diperbarui.**  
   Verifikasi source lokal:
   - CSV records: 226
   - CSV valid params: 225
   - Artikel: 185
   - Unique static params saat ini: ~305
   - CSV-only static params: ~120
   - Artikel <200 kata: 0
   - Artikel 200-499 kata: 22
   - Artikel >=500 kata: 163
   - Sitemap lokal/produksi saat review: 302 URL

4. **Jangan otomatis 410 artikel hanya karena pendek/zero-click.**  
   Zero-click + low impressions belum cukup untuk 410. Untuk halaman dengan commercial intent, lebih baik improve/merge/redirect daripada delete. 410 hanya untuk URL yang tidak relevan, tidak punya backlink, tidak punya conversion intent, dan tidak punya parent yang cocok.

5. **P10 harus diubah.**  
   Tidak ada artikel <200 kata berdasarkan source lokal. Prioritas yang benar adalah audit 22 artikel 200-499 kata dan perbaiki hanya yang punya search intent/conversion intent jelas.

6. **P8 fragment URLs bukan High priority.**  
   Fragment `#...` normalnya tidak dikirim ke server sebagai request path. Jika canonical sudah self-canonical ke halaman utama, ini lebih tepat dianggap Low/monitoring kecuali GSC menunjukkan duplicate cluster yang nyata.

7. **FAQ schema jangan dijadikan rich-result tactic untuk situs komersial.**  
   FAQ content boleh ditambahkan jika membantu user dan konversi. Tetapi jangan klaim rich result atau AI citation benefit. Google membatasi FAQ rich results terutama untuk government/health authority sites.

8. **Jangan gunakan "request indexing via GSC API" sebagai mitigasi umum.**  
   Search Console API bisa submit sitemap, tetapi request indexing API publik Google tidak tersedia untuk normal web pages umum. Indexing API resmi terbatas untuk tipe tertentu seperti JobPosting/BroadcastEvent. Gunakan URL Inspection manual untuk sampel prioritas, bukan mass request indexing.

### Rekomendasi plan terbaik

#### Sprint 0 — Validasi data dulu (0.5 hari)

1. Export GSC Page Indexing detail by category.
2. Gabungkan dengan sitemap live, source route, status code, canonical, robots, clicks, impressions, backlinks/internal links.
3. Kelompokkan URL menjadi:
   - Keep + improve
   - Keep + noindex
   - 301 redirect
   - 410 gone
   - Ignore/monitor

#### Sprint 1 — Sitemap harus 100% bersih (Hari 1-2)

1. Pastikan sitemap hanya berisi URL 200, indexable, self-canonical.
2. Hapus semua URL redirect dari sitemap. Verifikasi terbaru menemukan 5 issue sitemap produksi:
   - `https://dreamlab.id/maklon-skincare/face-cream/` missing canonical
   - `https://dreamlab.id/maklon-body-care/` redirect in sitemap
   - `https://dreamlab.id/maklon-baby-care/` redirect in sitemap
   - `https://dreamlab.id/maklon-foot-care/` redirect in sitemap
   - `https://dreamlab.id/maklon-decorative/` redirect in sitemap
3. Sync `sitemap.ts`, `proxy.ts`, `next.config.ts`, dan `seo-url-policy.ts` agar satu source of truth.

#### Sprint 2 — URL inventory control (Hari 2-5)

1. Filter `generateStaticParams()` untuk mengurangi static bloat, tapi ukur sebagai build/crawl hygiene, bukan direct GSC discovery fix.
2. Untuk CSV-only routes:
   - Jika punya commercial intent dan bisa dikembangkan: keep + improve.
   - Jika duplicate/legacy dengan parent relevan: 301.
   - Jika dead/no value/no equivalent: 410.
   - Jika perlu user flow tapi bukan search landing page: noindex, follow.

#### Sprint 3 — Conversion SEO content upgrade (Hari 5-21)

1. Prioritaskan halaman maklon/produk dengan buying intent tinggi, bukan semua zero-click pages.
2. Tambahkan proof yang menaikkan trust dan conversion:
   - MOQ, lead time, BPOM/Halal/CPKB proof
   - proses produksi
   - formulasi/R&D capability
   - case-use atau product category examples
   - CTA konsultasi yang sesuai intent
   - internal links ke parent/child service pages
3. Untuk AEO/GEO: buat jawaban eksplisit di halaman, tetapi tetap user-first. Jangan overfocus ke `llms.txt`, special AI schema, atau FAQ schema sebagai shortcut.

#### Sprint 4 — Monitoring 30 hari

Monitor:
- Sitemap issue count = 0
- Redirect/noindex URL di sitemap = 0
- `Crawled - currently not indexed` untuk URL indexable turun
- Indexed valuable pages naik
- Organic leads/WA clicks dari landing pages naik
- Top query CTR dari halaman komersial naik

### Revised target 30 hari

| Metrik | Target realistis |
|---|---|
| Sitemap indexability issues | 5 → 0 |
| Sitemap URL count | Tetap ramping, hanya 200/indexable/self-canonical |
| Crawled - currently not indexed untuk URL indexable | Turun 20-35% |
| Total "Not Indexed" GSC | Tidak wajib turun besar dalam 30 hari; bisa tetap tinggi karena 410/noindex/redirect masih dilaporkan |
| Indexed valuable pages | Naik bertahap +20 sampai +60 jika content upgrade kuat |
| Conversion SEO | Fokus kenaikan impressions/clicks/leads di halaman maklon/produk prioritas |

---

## Daftar Isi
- [1. Ringkasan Eksekutif](#1-ringkasan-eksekutif)
- [2. Data Terkini & Perbandingan](#2-data-terkini--perbandingan)
- [3. Root Cause Analysis](#3-root-cause-analysis)
- [4. Semua Problem Teridentifikasi](#4-semua-problem-teridentifikasi)
  - [🔴 Critical: Stop Google Menemukan Halaman Baru yang Tidak Layak](#-critical-stop-google-menemukan-halaman-baru-yang-tidak-layak)
  - [🟡 High: Sitemap & Crawl Budget](#-high-sitemap--crawl-budget)
  - [🟡 High: Canonical & Noindex Hygiene](#-high-canonical--noindex-hygiene)
  - [🟢 Medium: Content Quality](#-medium-content-quality)
  - [🔵 Low: Monitoring & Maintenance](#-low-monitoring--maintenance)
- [5. Action Plan 30 Hari](#5-action-plan-30-hari)
- [6. Proyeksi Hasil](#6-proyeksi-hasil)
- [7. Lampiran: Data Teknis](#7-lampiran-data-teknis)

---

## 1. Ringkasan Eksekutif

### Situasi Saat Ini

| Metrik | Sebelum (20 Juli) | Sekarang (29 Juli) | Delta |
|--------|:-----------------:|:------------------:|:-----:|
| **Total indexed** | ~456 | ~456 | **0** |
| **Total tidak terindeks** | ~1.141 | ~1.540 | **+399 🔴** |
| Sitemap size | ~448 URLs | ~424 URLs | -24 ✅ |
| Artikel aktif | 185 | 185 | 0 |
| Static params (catch-all) | ~411 | ~411 | 0 |

### Diagnosis 30 Detik

**Kenaikan 399 "not indexed" BUKAN karena bug kode.** Ini efek dari Google yang menemukan ~400 halaman baru dari situs via `[...slug]` catch-all route yang menghasilkan 411 halaman statis (226 dari legacy CSV + 185 artikel). Sebagian besar halaman programmatic ini kontennya tipis — Google crawl tapi tidak layak indeks.

**Kabaiik:** 456 halaman yang sudah terindeks tetap stabil. Foundation teknis baik. Yang perlu dilakukan adalah **mengurangi jumlah halaman yang diekspos ke Google** — hanya pertahankan yang punya konten layak indeks.

---

## 2. Data Terkini & Perbandingan

### Perbandingan Sitemap: Before vs After Perubahan

| Komponen Sitemap | Sebelum (v0) | Sesudah (v1) | Perubahan |
|-----------------|:------------:|:------------:|:---------:|
| Static routes | ~15 | ~15 | 0 |
| Articles | 185 | 185 | 0 |
| Audit CSV (match articles) | ~105 | ~105 | 0 |
| Audit CSV (programmatic) | ~18 | ~18 | 0 |
| Product routes (ALL) | ~55 | — | -31 |
| Product routes (non-thin only) | — | ~24 | +24 |
| Maklon routes (ALL) | ~75 | — | -75 |
| Maklon routes (≥3 sections) | — | ~71 | +71 |
| Pilot batch routes | 0 | 10 | +10 |
| **Total** | **~448** | **~424** | **-24** |

> **Catatan:** Perubahan saya REDUKSI 24 URL. Tidak mungkin menyebabkan +399 not indexed.

### Distribusi "Not Indexed" (Estimasi)

| Kategori GSC | Estimasi Kontribusi | Keterangan |
|-------------|:------------------:|------------|
| Crawled - Not Indexed | ~550-600 | Halaman programmatic tipis, artikel pendek |
| Page with redirect | ~300-350 | Legacy WordPress URLs, www → non-www |
| Alternate proper canonical | ~150-200 | Variasi URL (trailing slash, fragment, dll) |
| Excluded by noindex | ~100-150 | Pagination, author archives, thankyou pages |
| Not Found (404/410) | ~50-80 | Legacy pages, thankyou (sekarang 410) |
| Discovered - Not Indexed | ~50-100 | Baru ditemukan, belum di-crawl |
| Duplicate without/with diff canonical | ~30 | Duplicate content issues |
| **Total** | **~1.540** | |

---

## 3. Root Cause Analysis

### Diagram Alir Masalah

```
Sitemap ~424 URL ──────────────────────────────────┐
                                                    ├──→ Google Discover → Crawl
Catch-all [...slug] generateStaticParams() ─────────┘         │
  ├── 185 article slugs (valid, konten baik)                  │
  └── 226 CSV audit slugs (legacy, konten tipis) ────────────┘
                                                              │
                                                    ┌─────────▼─────────┐
                                                    │ Google evaluates   │
                                                    │ content quality    │
                                                    └─────────┬─────────┘
                                                              │
                                            ┌─────────────────┼─────────────────┐
                                            ▼                 ▼                 ▼
                                      Layak Indeks      Tidak Layak       Error/Redirect
                                      (~456 pages)      (~900 pages)      (~600 pages)
```

### 3 Akar Masalah Utama

#### Masalah #1: Over-Exposure (Paling Kritis)
**Akar:** `generateStaticParams()` di `[...slug]/page.tsx` menghasilkan 411 halaman statis dari semua slug CSV + artikel. Google menemukan semua halaman ini melalui sitemap dan internal linking.

**Dampak:** +400 halaman tipis dikenali Google dalam 1-2 minggu terakhir → langsung masuk "crawled - not indexed".

**Bukti:**
```
generateStaticParams():
  - getAllSlugs() = ~226 slug dari CSV audit (legacy WordPress)
  - getArticles() = 185 slug artikel
  - Total: ~411 unique params → 411 halaman statis dibuild
```

#### Masalah #2: Mismatch Sitemap Proxy Filter
**Akar:** Sitemap.ts punya daftar `proxyPrefixes` sendiri yang TIDAK SAMA dengan `GONE_PATTERNS` di proxy.ts. Beberapa URL yang return 410 dari proxy tetap masuk sitemap karena filter sitemap tidak menangkapnya.

**Dampak:** Google crawl URL → dapet 410 → bingung → masuk "not found (410)" di GSC.

**Bukti:**
```typescript
// proxy.ts GONE_PATTERNS (lengkap):
'/thankyou-page', '/thankyoupage-google', '/google-ads/', '/e-floating-buttons/', 
'/.help/dhl/', '/wp-content/', '/wp-admin/', '/wp-json/', '/pages/', 
'/product-category/', '/shop/', '/cms_block_cat/', '/cgi-sys/', '/checkout/', 
'/cart/', '/my-account/', '/blog/', '/post-sitemap', '/search/', 
'/juaranyaformula/', '/produk/pkrt/', '/produk/footcare/', '/produk/babycare/', '/produk/decorative/'

// sitemap.ts proxyPrefixes (TIDAK LENGKAP — MISSING 4 pattern):
'wp-content/', 'wp-admin/', 'wp-json/', '.help/dhl/',
'product-category/', 'shop/', 'cms_block_cat/', 'cgi-sys/',
'checkout/', 'cart/', 'my-account/', 'blog/',
'post-sitemap', 'search/', 'juaranyaformula/'
// MISSING: thankyou-page, thankyoupage-google, google-ads, e-floating-buttons
// MISSING: semua GONE_EXACT (.php, /feed, attr_identifier)
```

#### Masalah #3: Thin Programmatic Pages
**Akar:** Sebagian besar halaman programmatic dari CSV audit (226 slug) kontennya tipis — hanya template kosmetik dengan sedikit teks.

**Dampak:** Google anggap "low quality" → tidak diindeks.

**Bukti:** Dari zero-click audit, 504 dari 726 halaman (70%) punya 0 klik. 397 di antaranya "medium confidence 410 candidate".

---

## 4. Semua Problem Teridentifikasi

### 🔴 CRITICAL: Stop Google Menemukan Halaman Baru yang Tidak Layak

#### P1. generateStaticParams Terlalu Banyak

**Lokasi:** `src/app/[...slug]/page.tsx` — `generateStaticParams()`  
**Severity:** 🔴 CRITICAL  
**Dampak:** 411 halaman statis dibuild, ~200 di antaranya konten tipis

**Evidence:**
```typescript
export async function generateStaticParams() {
  const slugs = getAllSlugs(); // ← 226 CSV slug — INI MASALAH!
  // ...
  const articleParams = articlesList.map(a => ({...}));
  // Total: ~411 params
}
```

**Fix:**
```typescript
export async function generateStaticParams() {
  const articlesList = await getArticles();
  
  // HANYA generate untuk artikel asli, bukan semua CSV slug
  const articleParams = articlesList
    .filter(a => a.slug && a.content && a.content.trim().length > 200)
    .map(a => ({
      slug: a.slug.replace(/^\//, '').replace(/\/$/, '').split('/').filter(Boolean)
    }));
  
  // Tambah spesifik halaman programmatic yang TERBUKTI punya traffic
  const highValueSlugs = [
    'maklon/kosmetik',
    'maklon/skincare',
    'maklon/parfum',
    // ...tambah manual hanya yang penting
  ];
  const programmaticParams = highValueSlugs.map(s => ({
    slug: s.replace(/^\//, '').replace(/\/$/, '').split('/').filter(Boolean)
  }));
  
  return [...articleParams, ...programmaticParams];
}
```

**Expected impact:** -200 dari "not indexed" (Google stop menemukan thin pages baru)

---

#### P2. Halaman Programmatic Tipis Tidak Di-noindex

**Lokasi:** `src/app/[...slug]/page.tsx` — `generateMetadata()`  
**Severity:** 🔴 CRITICAL  
**Dampak:** Halaman programmatic tanpa konten cukup tetap di-index oleh Google

**Evidence:** Halaman programmatic dari CSV hanya punya template content — tidak ada artikel unik. Tapi `robots: 'index, follow'` selalu.

**Fix:** Tambah logic deteksi thin content:
```typescript
// Di generateMetadata()
const isThinProgrammatic = !article && seoData && (
  !seoData.content || 
  seoData.content.length < 500 ||
  (!maklonPage && !seoData.data_table_json)
);

const robots = isThinProgrammatic
  ? 'noindex, follow'
  : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
```

**Expected impact:** -100 dari "not indexed" (pindah ke excluded/noindex — yang sebenarnya lebih sehat)

---

### 🟡 HIGH: Sitemap & Crawl Budget

#### P3. Sitemap Proxy Filter Tidak Sync dengan proxy.ts

**Lokasi:** `src/app/sitemap.ts` — array `proxyPrefixes`  
**Severity:** 🟡 HIGH  
**Dampak:** Sitemap includes URL yang return 410 → Google buang waktu crawl

**Evidence:**
```typescript
// CURRENT (incomplete):
const proxyPrefixes = [
  'wp-content/', 'wp-admin/', 'wp-json/', '.help/dhl/',
  'product-category/', 'shop/', 'cms_block_cat/', 'cgi-sys/',
  'checkout/', 'cart/', 'my-account/', 'blog/',
  'post-sitemap', 'search/', 'juaranyaformula/',
];

// SHOULD BE (sync with proxy.ts GONE_PATTERNS):
const proxyPrefixes = [
  '.help/dhl/', 'wp-content/', 'wp-admin/', 'wp-json/',
  'pages/', 'product-category/', 'shop/', 'cms_block_cat/',
  'cgi-sys/', 'checkout/', 'cart/', 'my-account/', 'blog/',
  'post-sitemap', 'search/', 'juaranyaformula/',
  'produk/pkrt/', 'produk/footcare/', 'produk/babycare/', 'produk/decorative/',
  'thankyou-page', 'thankyoupage-google', 'google-ads/', 'e-floating-buttons/',
];
```

**Expected impact:** -30 dari sitemap (URL yang return 410 dihapus dari sitemap)

---

#### P4. Article Thin Content di Sitemap

**Lokasi:** `src/app/sitemap.ts` — article routes  
**Severity:** 🟡 HIGH  
**Dampak:** Artikel dengan < 200 kata konten tetap masuk sitemap → Google buang waktu +添 ke "not indexed"

**Fix:** Di sitemap.ts, filter articles:
```typescript
const MIN_ARTICLE_WORDS = 300;

const articleRoutes = articles
  .filter(a => a.slug && a.content)
  .filter(a => {
    const wordCount = a.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    return wordCount >= MIN_ARTICLE_WORDS;
  })
  .map(article => ({...}));
```

**Expected impact:** Bervariasi — perlu audit word count dulu

---

#### P5. `/ads/` di validRoutePrefixes Risk

**Lokasi:** `src/app/sitemap.ts` — line 51  
**Severity:** 🟡 HIGH  
**Dampak:** Jika ada slug dengan prefix `ads/` di CSV → masuk sitemap → Google crawl → kemungkinan thin/noindex

**Fix:** Hapus `'ads/'` dari `validRoutePrefixes` kecuali benar-benar ada halaman ads yang berkualitas.

---

### 🟡 HIGH: Canonical & Noindex Hygiene

#### P6. Author Archives Tidak Di-noindex

**Lokasi:** `src/app/author/[author]/page.tsx`  
**Severity:** 🟡 HIGH  
**Dampak:** Author archive pages (yang kontennya hanya list artikel) tetap index — menyebabkan duplicate content dengan halaman artikel itu sendiri

**Status:** ✅ SUDAH FIX di Phase 1 (`noindex, follow`)

#### P7. Pagination Pages Tidak Di-noindex

**Lokasi:** `src/app/news-blog/page/[num]/page.tsx`  
**Severity:** 🟡 HIGH  
**Dampak:** Halaman pagination (page/2, page/3, dll) tidak punya konten unik

**Status:** ✅ SUDAH FIX di Phase 1 (`noindex, follow`)

#### P8. Fragment URLs (#) Masih di Artikel

**Lokasi:** Semua artikel dengan heading anchors  
**Severity:** 🟡 HIGH  
**Dampak:** 81 fragment URLs di GSC — Google melihat URL dengan # sebagai halaman terpisah

**Fix:** 
1. Hapus anchor links dari artikel yang menggunakan `href="#..."` 
2. Atau pastikan canonical tetap ke halaman utama (sudah dilakukan di catch-all route)

**Status:** Sebagian sudah difix via canonical di catch-all route

---

### 🟢 MEDIUM: Content Quality

#### P9. 66 Page Titles/Meta Descriptions Perlu Diperbaiki

**Lokasi:** Data GSC — pages dengan impressions > 0 tapi 0 clicks  
**Severity:** 🟢 MEDIUM  
**Dampak:** Halaman muncul di search tapi tidak diklik — biasanya karena title/meta description tidak menarik

**Data:**
```
Dari zero-click audit:
- 504 halaman zero-click
- 66 halaman teridentifikasi "butuh perbaikan konten"
- Sebagian besar artikel blog dengan < 50 impressions
```

**Fix:**  
1. Rewrite titles — tambahkan USP, angka, dan keyword komersial  
2. Rewrite meta descriptions — buat compelling dengan CTA  
3. Tambahkan FAQ schema untuk rich results

---

#### P10. Thin Articles (< 200 Words) Perlu Dimerger atau Di-410

**Lokasi:** `src/data/articles.ts`  
**Severity:** 🟢 MEDIUM  
**Dampak:** Artikel pendek tidak memberi nilai cukup untuk diindeks

**Action:**
1. Audit word count semua 185 artikel  
2. Artikel < 200 kata: merge ke artikel induk atau 410  
3. Artikel 200-500 kata: tambah konten minimal 500 kata  
4. Artikel > 500 kata: optimasi internal linking dan schema

---

#### P11. 318 Medium-Confidence 410 Candidates

**Lokasi:** Data zero-click audit  
**Severity:** 🟢 MEDIUM  
**Dampak:** 318 halaman dengan < 50 impressions dan 0 clicks dalam 90 hari — tidak memberikan traffic

**Action:**
1. Verifikasi manual 50 halaman pertama  
2. 410 untuk halaman yang benar-benar tidak punya potensi  
3. Redirect ke halaman induk untuk yang masih relevan

---

### 🔵 LOW: Monitoring & Maintenance

#### P12. Submit Sitemap ke GSC

**Lokasi:** `scripts/submit-sitemap.mjs`  
**Severity:** 🔵 LOW  
**Dampak:** Sitemap terbaru belum disubmit → Google masih pakai sitemap lama

**Action:** `node scripts/submit-sitemap.mjs`

#### P13. Pantau GSC Coverage Mingguan

**Severity:** 🔵 LOW  
**Dampak:** Tidak ada monitoring rutin → perubahan tidak terdeteksi dini

**Action:** Cek GSC setiap hari Senin pagi untuk:
- Total indexed vs not indexed
- Tren error categories
- Performance (clicks & impressions)

---

## 5. Action Plan 30 Hari

### Sprint 1: Stop the Bleeding (Hari 1-3)

| # | Task | File | Effort | Impact |
|:-:|------|------|:------:|:------:|
| 1 | Filter `generateStaticParams()` — HANYA artikel | `src/app/[...slug]/page.tsx` | 15 menit | 🟢 -200 not indexed |
| 2 | Tambah `noindex` untuk thin programmatic | `src/app/[...slug]/page.tsx` | 15 menit | 🟢 -100 not indexed |
| 3 | Sync proxy filter di sitemap.ts | `src/app/sitemap.ts` | 10 menit | 🟡 -30 URL sitemap |
| 4 | Deploy ke Vercel | — | 5 menit | — |
| 5 | Submit sitemap ke GSC | `scripts/submit-sitemap.mjs` | 5 menit | 🔵 Akselerasi recrawl |

**Target Sprint 1:** -300 "not indexed" dalam 7-14 hari setelah deploy

### Sprint 2: Sitemap & Crawl Budget (Hari 4-7)

| # | Task | File | Effort | Impact |
|:-:|------|------|:------:|:------:|
| 6 | Audit word count 185 artikel | Script | 30 menit | 🟡 Data untuk decision |
| 7 | Filter thin articles dari sitemap | `src/app/sitemap.ts` | 15 menit | 🟡 Bervariasi |
| 8 | Hapus `ads/` dari validRoutePrefixes | `src/app/sitemap.ts` | 5 menit | 🟡 Preventif |
| 9 | Deploy + submit sitemap | — | 10 menit | — |

**Target Sprint 2:** -50 "not indexed" tambahan

### Sprint 3: Content Quality (Hari 8-21)

| # | Task | Effort | Impact |
|:-:|------|:------:|:------:|
| 10 | Rewrite 66 titles/meta descriptions | 4-6 jam | 🟢 Bervariasi |
| 11 | Merge/410 artikel < 200 kata | 2-3 jam | 🟢 -50 not indexed |
| 12 | Tambah konten ke artikel 200-500 kata | 8-10 jam | 🟢 Potensial naik indexed |
| 13 | Verifikasi 50 medium-confidence 410 candidates | 2 jam | 🟢 -50 not indexed |
| 14 | Deploy + submit sitemap | — | — |

**Target Sprint 3:** -100 "not indexed" + potensial +50 "indexed"

### Sprint 4: Monitoring (Hari 22-30)

| # | Task | Effort | Impact |
|:-:|------|:------:|:------:|
| 15 | Cek GSC coverage — evaluasi perubahan | 30 menit | 🔵 Data |
| 16 | Cek performance (clicks & impressions) | 30 menit | 🔵 Data |
| 17 | Adjust strategy based on data | 1-2 jam | 🔵 Iterasi |
| 18 | Update dokumen ini dengan hasil aktual | 15 menit | 🔵 Dokumentasi |

---

## 6. Proyeksi Hasil

### Target 30 Hari

| Skenario | Not Indexed | Indexed | Target |
|:---------|:-----------:|:-------:|:------:|
| **Saat ini** | **1.540** | **456** | **🎯** |
| Setelah Sprint 1 (H-7) | ~1.200-1.300 | ~456 → ~470 | 🟡 Sedang |
| Setelah Sprint 2 (H-14) | ~1.100-1.200 | ~470 → ~490 | 🟡 Sedang |
| Setelah Sprint 3 (H-21) | ~900-1.000 | ~490 → ~520 | 🟢 Baik |
| **Setelah 30 hari** | **~700-800** | **~520-550** | **🟩 Target** |

### Risiko & Mitigasi

| Risiko | Probabilitas | Mitigasi |
|--------|:-----------:|----------|
| Google lambat recrawl (>2 minggu) | Medium | Submit sitemap + request indexing via GSC API |
| 410 menyebabkan error spike sementara | Tinggi | Jelaskan ke head marketing — ini NORMAL |
| Artikel merge menyebabkan traffic turun sementara | Rendah | 301 redirect ke artikel induk |
| Beberapa halaman terlanjur diindex Google susah dihapus | Rendah | 410 + GSC removal tool |

---

## 7. Lampiran: Data Teknis

### 7.1 Inventaris Halaman

| Jenis Halaman | Jumlah | Di Sitemap | Di Static Params | Kualitas Konten |
|--------------|:------:|:----------:|:----------------:|:---------------:|
| Articles (blog) | 185 | ✅ Ya | ✅ Ya | Bervariasi |
| Programmatic (CSV) | ~226 | ~123 | ✅ Ya | ❌ Tipis (rata-rata) |
| Static pages | ~15 | ✅ Ya | ❌ Tidak | ✅ Baik |
| Product categories | 8 | ~4 (non-thin) | ❌ Tidak | ✅ Baik |
| Product sub-pages | ~47 | ~20 (non-thin) | ❌ Tidak | ❌ Tipis |
| Maklon pages | 75 | ~71 | ❌ Tidak | 🟡 Variatif |
| Pilot batch | 10 | ✅ Ya | ❌ Tidak | ✅ Baru |

### 7.2 Sitemap Filter Saat Ini

```typescript
// Valid route prefixes (agar CSV slug masuk sitemap)
const validRoutePrefixes = [
  'category/', 'produk/', 'maklon/',
  'news-blog/', 'about-us/', 'ads/',  // ← 'ads/' risk!
];

// Known article slugs (dari articles.ts)
const knownArticleSlugs = new Set(/* 185 slug */);

// Filter: isSlugInCurrentSite() = knownArticleSlugs.has(slug) || startsWith(validRoutePrefixes)

// Proxy caught (MISMATCH dengan proxy.ts!)
const proxyPrefixes = [/* 12 pattern, MISSING 4+ */];
```

### 7.3 Proxy.ts GONE Patterns Lengkap

```typescript
// 25 pattern — digunakan untuk 410 response
const GONE_PATTERNS = [
  '/.help/dhl/', '/wp-content/', '/wp-admin/', '/wp-json/',
  '/pages/', '/product-category/', '/shop/', '/cms_block_cat/',
  '/cgi-sys/', '/checkout/', '/cart/', '/my-account/', '/blog/',
  '/post-sitemap', '/search/', '/juaranyaformula/',
  '/produk/pkrt/', '/produk/footcare/', '/produk/babycare/', '/produk/decorative/',
  '/thankyou-page', '/thankyoupage-google', '/google-ads/', '/e-floating-buttons/',
];

// Exact patterns — catch .php, /feed, attr_identifier, dll
const GONE_EXACT = [
  { type: 'includes', value: '):attr_identifier' },
  { type: 'includes', value: '%29:attr_identifier' },
  { type: 'includes', value: '.php' },
  { type: 'includes', value: '/feed' },
  { type: 'includes', value: '/feed/' },
  { type: 'includes', value: '/$/' },
  { type: 'includes', value: '/$' },
  { type: 'includes', value: '/&/' },
  { type: 'includes', value: '/&' },
];
```

### 7.4 Zero-Click Audit Highlights

Dari 726 halaman yang dianalisis (90 hari GSC performance data):

| Metrik | Value |
|--------|:-----:|
| Total halaman | 726 |
| Total clicks | 2.730 |
| Total impressions | 149.313 |
| Zero-click pages | 505 (70%) |
| Pages dengan clicks | 221 (30%) |
| **High-confidence 410 candidates** | **40** |
| **Medium-confidence 410 candidates** | **397** |
| **Needs content fix** | **68** |

### 7.5 File yang Perlu Diubah

| File | Prioritas | Perubahan |
|------|:---------:|-----------|
| `src/app/[...slug]/page.tsx` | 🔴 P1 | Filter generateStaticParams() + noindex thin |
| `src/app/sitemap.ts` | 🟡 P3 | Sync proxyPrefixes + filter thin articles + hapus ads/ |
| `scripts/submit-sitemap.mjs` | 🔵 P12 | Run setelah deploy |

---

*Dokumen ini dibuat berdasarkan analisis data GSC, audit kode, dan framework World-Class SEO Growth.  
Update berikutnya: 7 hari setelah deploy Sprint 1.*
