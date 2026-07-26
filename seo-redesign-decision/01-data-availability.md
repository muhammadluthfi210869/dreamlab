# Data Availability Report

Generated: 2026-07-21

## Assessment

| Dataset | Tersedia | Periode | Jumlah row | Dapat digunakan | Kekurangan |
| ------- | -------- | ------- | ---------: | --------------- | ---------- |
| GSC Performance Pages (7v7) | Ya | 7 days before/after baseline | 338 rows | Ya - top-level page loss identification | Hanya 7 hari window, bukan 28 hari equal-period |
| GSC Performance Queries (7v7) | Ya | 7 days before/after baseline | 200+ rows | Ya - query-level loss identification | Window pendek |
| GSC Daily Trend | Ya | 90 days | ~90 rows | Ya - trend analysis | Tidak ada breakdown per page per hari |
| GSC Page Indexing - Crawled Not Indexed | Partial | 2026-06-29 snapshot | 66 rows (tidak-diindeks.csv) | Terbatas - hanya sampel not full 505 | Export UI GSC hanya mencakup 66 URL crawled-not-indexed dari 505 yang dilaporkan |
| GSC Page Indexing - Redirect | Partial | 2026-06-29 snapshot | 35 rows (pengalihan.csv) | Terbatas | Export hanya sampel dari 338 |
| GSC Page Indexing - Canonical | Partial | 2026-06-29 snapshot | 25 rows (tag-kanonis.csv) | Terbatas | Export hanya sampel dari 173 |
| GSC Page Indexing - Noindex | Partial | 2026-06-29 snapshot | 22 rows | Terbatas | Export hanya sampel dari 73 |
| GSC Page Indexing - 404 | Partial | Tidak ada export terpisah | Sample dalam url-inspection-samples.csv | Minimal | Tidak ada full list |
| GSC Coverage Bagian/Masalah | Ya | 2026-06-25 | 3 CSV files | Terbatas untuk overview | Metadata saja, bukan URL list |
| Live Sitemap URLs | Ya | 2026-07-21 | 331 URLs | Ya - current indexable universe | File teks saja tanpa SEO metadata |
| Live URL Checks | Ya | 2026-07-21 | 94 URLs | Ya - detailed HTTP/SEO checks | Tidak mencakup seluruh 331 sitemap |
| Old-vs-New URL Map | Ya | 2026-07-21 | 199 rows | Ya - migration mapping | Banyak status NOT_CHECKED |
| URL Inspection Samples | Ya | 2026-07-13 | 328 rows | Ya - indexing status samples | Sampel, bukan full population |
| SEO Audit Export (old) | Ya | 2026 | Daftar URL lama | Referensi | Struktur berbeda dengan data baru |
| SEO Mapping JSON | Ya | 2026 | ~100 entries | Ya - redirect/canonical mapping | Tidak mencakup semua URL |
| GA4 Data API | TIDAK | - | - | Tidak | Credential GA4 tidak ditemukan |
| GA4 Organic Landing Pages Export | TIDAK | - | - | Tidak | Belum diexport |
| GA4 Lead Events Export | TIDAK | - | - | Tidak | Belum diexport |
| Backlink Data | TIDAK | - | - | Tidak | Belum dikumpulkan |
| Old Internal Link Graph | TIDAK | - | - | Tidak | Pre-redesign crawl tidak tersedia |
| Full WordPress HTML Backup | TIDAK | - | - | Tidak | Hanya metadata parsial |
| Next.js Config Redirect | Ya | Current | Full config | Ya | Perlu parsing dari next.config.ts |
| SEO URL Policy Code | Ya | Current | Full source | Ya | src/lib/seo-url-policy.ts |
| GSC Performance 90d Pages | Ya | 90 days | 709 rows | Ya | Hanya yang muncul di performa |
| GSC Country/Device/Appearance | Ya | 7v7 window | Multiple CSVs | Ya | Breakdown tambahan |
| Crawl Baseline (scripts) | Ya | Snapshot | Unknown | Referensi | Output dari script crawl |

## Key Gaps

1. **Full GSC Page Indexing export (505 crawled-not-indexed, 338 redirect, 173 canonical, 73 noindex, 20 404, 3 Google-chose-canonical)**: Data tidak lengkap. Export CSV dari GSC UI hanya mencakup ~66 crawled-not-indexed dari 505. Tanpa full export, tidak mungkin triage seluruh 505 URL secara individual.

2. **GA4 lead/conversion data**: Credential tidak tersedia. Tidak dapat memverifikasi apakah organic leads benar-benar turun atau hanya tracking regression.

3. **Backlink profile**: Tidak tersedia. Tidak dapat menilai apakah legacy URL memiliki backlink yang perlu dipertimbangkan sebelum redirect/delete.

4. **Pre-redesign internal link graph**: Tidak tersedia. Perbandingan internal link equity sebelum/sesudah tidak dapat dilakukan secara kuantitatif.

5. **Full content body comparison**: Tidak tersedia. Tidak dapat membandingkan word count, H1, title pre/post secara massal.

## Conclusions for Analysis

- Analysis must rely on GSC Performance data (7v7 and 90d) as primary evidence source
- URL-level triage for crawled-not-indexed limited to sample available; full triage requires GSC UI manual export
- GA4 lead impact assessment is inferential only, not data-driven
- Redirect and canonical decisions can be made from live URL checks + next.config.ts
- Internal link recommendations based on current crawl only, not pre/post comparison
- Backlink considerations will be noted as "DATA MISSING - verify before implementation"
