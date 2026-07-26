# SEARCHLIGHT DECISION AUDIT — DREAMLAB
# Generated: 2026-07-21


========================================
=== 00-final-diagnosis.md ===
========================================

# Final Diagnosis — Dreamlab SEO Recovery

Generated: 2026-07-21
Data sources: GSC Performance 7v7, 90d, GSC Coverage snapshot, Live URL checks, Sitemap, Old-vs-New URL Map, URL Inspection samples, next.config.ts, Source code analysis

## 1. Apakah redesign menyebabkan penurunan impression?

**Fakta:** 
- GSC 28-day equal window: 45,876 → 35,958 (-21.6%)
- GSC 7v7 window (latest complete): 10,134 → 9,274 (-8.5%)
- Clicks actually increased: 142 → 169 (+19%) in 7v7 window

**Inferensi:**
- Penurunan impressions terbukti secara temporal, namun magnitude bervariasi tergantung window.
- Peningkatan clicks di tengah impression turun menunjukkan CTR improvement atau query mix shift, bukan pure ranking loss.
- Tanggal penurunan tidak dapat diikat ke satu event redesign karena:
  - Sitemap cleanup sudah dilakukan bertahap (commit 2026-07-13, 2026-07-20, 2026-07-21)
  - Category consolidation terjadi 2026-07-18/19
  - Impression sudah rendah sebelum 2026-07-13 berdasarkan data harian
- **Keputusan: Redesign berkontribusi tetapi bukan penyebab tunggal.** Kontribusi pasti tidak dapat diisolasi tanpa data harian page-level pra-redesign.

## 2. Berapa persen penurunan yang dapat dijelaskan?

Dari total penurunan 860 impressions (7v7 window):

| Penyebab | Estimated contribution | Confidence | Evidence |
| -------- | --------------------: | ---------- | -------- |
| Legacy URL redirect/noindex loss | ~15-20% (130-170) | Medium | www URLs lost impressions (www.dreamlab.id/produk/skincare/sunscreen/ -47, www.dreamlab.id/about-us/ -32) |
| Content intent/quality shift | ~25-30% (215-260) | Low-Medium | Top loss pages are articles with stable positions but fewer impressions |
| Demand/query mix change | ~20-25% (170-215) | Low-Medium | Non-brand query shifts visible |
| Internal link equity change | ~10-15% (85-130) | Low | Category consolidation July 18-19 may affect |
| Cannibalization | ~5-10% (43-86) | Low | Multiple similar article slugs |
| Competition/SERP feature | ~5-10% (43-86) | Low | Cannot verify from available data |
| Tracking/data issue | ~0-5% (0-43) | Low | Some GSC data lag expected |
| **Explained total** | **~55-70%** | - | - |
| **Unexplained** | **~30-45%** | - | - |

## 3. Berapa URL non-indexed yang merupakan exclusion normal?

| GSC Status | Total | Expected Normal | Needs Triage |
| ---------- | ----: | --------------: | -----------: |
| Page with redirect (338) | 338 | ~280 (legacy URLs, www variants, pagination) | ~58 (money pages like /maklon-parfum/) |
| Alternate canonical (173) | 173 | ~150 (www/non-www, parameter variants) | ~23 (content consolidation needed) |
| Excluded by noindex (73) | 73 | ~60 (author pages, ads landing, utility) | ~13 (accidental noindex candidates) |
| Crawled not indexed (505) | 505 | ~350 (feeds, legacy, low-quality, duplicate) | ~155 (potentially important) |
| Discovered not indexed (19) | 19 | ~10 (orphan/low-link) | ~9 |
| Not found 404 (20) | 20 | ~12 (legacy WP paths, typo URLs) | ~8 (has traffic/backlinks) |
| Duplicate no canonical (10) | 10 | ~5 | ~5 |
| Google chose canonical (3) | 3 | ~2 | ~1 |
| **Total** | **1,141** | **~869 (76%)** | **~272 (24%)** |

## 4. Berapa URL penting yang benar-benar bermasalah?

| Priority | Count | Description |
| -------- | ----: | ----------- |
| Money pages with redirect issues | 5-7 | /maklon-parfum/, /maklon-face-mist/, /pabrik-parfum-surabaya/, etc. |
| Money pages with canonical issues | 2-3 | /produk/skincare/, /produk/parfum/ |
| Articles with indexing issues | 15-25 | Crawled-not-indexed articles with historical traffic |
| Legacy service URLs not migrated | 3-5 | Old WordPress service pages |
| Accidental noindex | 2-5 | Category pages that should be indexable |
| 404 with recovery potential | 3-5 | URLs with backlinks or traffic |
| **Total important problems** | **~30-50** | - |

## 5. Berapa URL yang perlu technical fix?

| Fix type | Count | Examples |
| -------- | ----: | -------- |
| Redirect destination fix | 5-8 | /maklon-parfum/ → should go to /parfum/ not /google-ads/maklon-parfum/ |
| Canonical fix | 3-5 | Add self-canonical to product pages missing it |
| Remove noindex from important pages | 2-5 | /category/dreampreneur-beauty-academy/ has noindex |
| Fix 404 to proper redirect | 3-5 | Restore or redirect old URLs with backlinks/traffic |
| Sitemap inclusion fix | 5-10 | Add important product sub-pages not in sitemap |
| **Total technical fixes** | **~18-33** | - |

## 6. Berapa URL yang perlu content improvement?

| Type | Count | Notes |
| ---- | ----: | ----- |
| Articles needing B2B commercial intent | 10-15 | Informational articles need commercial path to service pages |
| Articles needing update/freshness | 15-20 | Old articles with 2025 dates declining |
| Content consolidation (merge) | 5-10 | Duplicate content clusters |
| **Total content improvements** | **~30-45** | - |

## 7. Berapa URL yang perlu merge dan redirect?

| Type | Count | Examples |
| ---- | ----: | -------- |
| Duplicate article consolidation | 5-10 | Similar topics, same intent |
| Legacy-to-new URL consolidation | 10-20 | Old article slugs to new canonical |
| Category consolidation | 3-5 | /category/maklon-skincare/ → /category/maklon-kosmetik/ (already redirected) |
| **Total merge candidates** | **~18-35** | - |

## 8. Berapa URL yang boleh tetap noindex?

| Category | Count | Notes |
| -------- | ----: | ----- |
| Author page/pagination | ~12 | /author/admin/page/* |
| Feed URLs | ~15 | /feed/, /rss/ |
| Utility/system pages | ~10 | /cart/, /my-account/, /checkout/ |
| Ads landing pages (intentionally) | ~6 | /google-ads/*, /metaads/* |
| Thank you pages | ~4 | /thankyou/* |
| Search results | ~3 | /?s=... |
| Legacy WP paths | ~5 | /wp-content/*, /wp-json/* |
| **Total keep noindex** | **~55** | - |

## 9. Berapa URL yang boleh tetap 404 atau 410?

| Type | Count | Examples |
| ---- | ----: | -------- |
| 404 - no traffic/backlinks | 8-10 | /category/event/, /dreampreneur-beauty-academy-surabaya-2026/ |
| 410 - confirmed deprecated | 5-8 | Old PHP pages, unused taxonomy feeds |
| **Total keep 404/410** | **~13-18** | - |

## 10. Money page mana yang paling membutuhkan recovery?

| Page | Problem | Priority | Impact |
| ---- | ------- | -------- | ------ |
| /maklon-parfum/ | Redirects to ads landing page | P0 | Lost organic equity for primary service |
| /maklon-face-mist/ | Redirects to /produk/skincare/ | P0 | Lost dedicated service page |
| /pabrik-parfum-surabaya/ | Redirects to /produk/parfum/ | P0 | Lost location-specific landing page |
| /maklon-kosmetik-jakarta-dreamlab-2026/ | Redirects to generic page | P0 | Lost Jakarta-specific landing |
| /maklon-kosmetik-parfum-tangerang/ | Redirects to generic page | P0 | Lost Tangerang-specific landing |
| /pabrik-maklon-kosmetik-surabaya-terlengkap/ | Stable but losing impressions | P1 | High-value money page |
| /produk/parfum/ | Google canonical not verified | P1 | Key product category page |
| /produk/skincare/ | Google canonical not verified | P1 | Key product category page |

## 11. Redirect mana yang salah atau meragukan?

| Old URL | Current Destination | Problem | Recommendation |
| ------- | ------------------ | ------- | -------------- |
| /maklon-parfum/ | /google-ads/maklon-parfum/ | Ads landing page ≠ organic service page | Redirect to /parfum/ or restore as standalone |
| /maklon-face-mist/ | /produk/skincare/ | Destination terlalu umum, kehilangan specific intent | Redirect to /maklon/face-mist/ or standalone restore |
| /pabrik-parfum-surabaya/ | /produk/parfum/ | Location intent hilang | Redirect to location-specific page if exists, else /parfum/ |
| /maklon-kosmetik-jakarta-dreamlab-2026/ | /maklon-jakarta-terbaik/ | Acceptable but URL had date that now looks outdated | Accept if /maklon-jakarta-terbaik/ covers same intent |
| /maklon-kosmetik-parfum-tangerang/ | /maklon-kosmetik-tangerang-terpercaya/ | Acceptable redirect | Verify content intent match |
| /maklon-moisturizer-bpom-dreamlab/ | /produk/skincare/ | Too generic | Better to have dedicated page or /maklon/skincare/ |

## 12. Apakah 505 crawled-not-indexed didominasi quality, duplicate, legacy, atau technical issue?

Berdasarkan sampel yang tersedia (66 dari 505):

| Category | Estimate | Confidence |
| -------- | -------: | ---------- |
| Legacy WordPress URLs (feeds, WP paths, PHP) | ~150 (30%) | High |
| Low-quality duplicate/parameters | ~120 (24%) | Medium |
| Pagination (author, blog page) | ~30 (6%) | High |
| Quality/content too thin | ~100 (20%) | Medium |
| Technical (orphan, no internal links) | ~50 (10%) | Low |
| Potentially important content | ~55 (11%) | Low |
| **Total** | **~505** | - |

**Keputusan: Dominasi legacy dan low-quality URLs.** Sekitar 55-80 URL mungkin penting, sisanya expected exclusion.

## 13. Apakah internal linking melemah?

**Fakta:** Pre-redesign internal link graph tidak tersedia.
**Inferensi:** Category consolidation pada 2026-07-18/19 mengubah struktur blog yang berpotensi mengurangi internal links dari category hubs ke artikel individual. Namun tanpa baseline, tidak dapat diverifikasi secara kuantitatif.
**Keputusan:** Internal linking perlu diperkuat berdasarkan analisis current graph, bukan karena terbukti melemah.

## 14. Apakah organic leads benar-benar turun?

**Fakta:** GA4 data tidak tersedia. Tidak dapat diverifikasi.
**Inferensi:** Berdasarkan GSC data, organic clicks tidak turun signifikan (142→169 di 7v7 window, +19%). Impression turun tapi clicks naik. Ini menunjukkan traffic ke website tidak berkurang drastis.
**Keputusan: Tidak dapat disimpulkan.** Prioritas: export GA4 organic landing page + lead events untuk verifikasi.

## 15. Apakah terdapat tracking regression?

**Fakta:** Kode tracking (GTM/Clarity) ada di src/components/TrackingScripts.tsx dan src/app/layout.tsx. Tidak ada perubahan tracking yang terdeteksi dari git log snapshot.
**Inferensi:** Tracking mungkin utuh, tetapi tanpa GA4 data tidak dapat diverifikasi.
**Keputusan: Tidak dapat diverifikasi.** Audit GTM container diperlukan.

## 16. Apa lima tindakan dengan impact terbesar?

1. **Fix redirect money pages** (/maklon-parfum/, /maklon-face-mist/, /pabrik-parfum-surabaya/) → redirect ke halaman yang tepat dengan intent match
2. **Recover important 404 → 301 redirect** untuk URLs with historical traffic
3. **Add internal links** dari service pages ke supporting articles dan sebaliknya
4. **Request indexing untuk important crawled-not-indexed articles** yang sudah 200/indexable
5. **Fix canonical issues** pada product category pages

## 17. Apa yang harus dikerjakan dalam 24 jam?

See priority roadmap for details. Summary:
1. Fix redirect /maklon-parfum/ destination
2. Fix redirect /maklon-face-mist/ destination  
3. Request indexing for top 5 money pages in GSC
4. Export full GA4 organic landing page + lead data
5. Validate current sitemap submission in GSC

## 18. Apa yang harus ditunda?

- Noindex/delete massal 1,141 excluded URLs
- Content rewrite/creation for articles without proof of regression
- Backlink building
- Schema markup expansion beyond critical fixes
- New article creation beyond consolidation needs

## 19. KPI recovery apa yang harus dipantau?

| KPI | Target | Timeline | Measurement |
| --- | ------ | -------- | ----------- |
| Money page indexed status | All money pages "Submitted and indexed" | 7 days | GSC URL Inspection |
| GSC 28d impressions recovery | Stabilize or positive trend | 28 days | GSC Performance |
| Money page position for primary queries | Return to pre-redesign positions | 28-60 days | GSC Performance |
| Crawled-not-indexed count | Decrease by 50+ | 30 days | GSC Page Indexing |
| Organic leads (GA4) | Restore to pre-redesign baseline | 60 days | GA4 |

## 20. Kapan hasil perbaikan mulai dapat dievaluasi?

| Action | Expected first results | Full evaluation |
| ------ | ---------------------- | --------------- |
| Redirect fix | 3-7 days (Google recrawl) | 14-28 days |
| Indexing request | 3-14 days | 21-28 days |
| Internal link addition | 7-21 days | 28-60 days |
| Content improvement | 14-28 days | 60-90 days |
| Canonical fix | 7-14 days | 21-28 days |


========================================
=== 01-data-availability.md ===
========================================

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


========================================
=== 14-root-cause-tree.md ===
========================================

# Root Cause Tree — Dreamlab Impression Loss

## Impression turun (-21.6% 28d, -8.5% 7v7)

### ├── Demand/query mix (~25%)
│   Evidence:
│   - Top loss query "/cara-meracik-handbody-pemutih-alami/" (-375) has stable position (7.9→7.7)
│   - Clicks actually increased 6→8 despite impression drop
│   - Multiple "hb dosting" queries declining across the board
│   - This suggests seasonal/trend-based demand decline for DIY skincare content
│   Affected URLs: /cara-meracik-handbody-pemutih-alami/, /perbedaan-moisturizer-gel-vs-cream/, /cara-membuat-hb-dosting-sendiri/
│   Impact: ~200-250 impressions lost
│   Confidence: Medium
│   Action: No direct fix needed; monitor trend; ensure B2B commercial path exists
│
### ├── Ranking loss (~30%)
│   ├── Content regression (partial)
│   │   Evidence: Several articles lost ranking positions (manfaat-hair-tonic 9.5→10.5, pabrik-parfum-malang 8.7→11.7)
│   │   Affected URLs: /manfaat-hair-tonic-ginseng-rambut/, /pabrik-parfum-malang-dreamlab/, /cara-membuat-lulur-ampas-kopi/
│   │   Impact: ~100-150 impressions lost
│   │   Confidence: Medium
│   │   Action: UPDATE_CONTENT freshness for declining articles
│   │
│   ├── Internal link loss (not proven)
│   │   Evidence: Category consolidation 2026-07-18/19 is a plausible risk but no pre-redesign graph
│   │   Affected URLs: Potentially all articles in consolidated categories
│   │   Impact: Cannot quantify
│   │   Confidence: Low
│   │   Action: ADD_INTERNAL_LINKS from service pages to supporting articles
│   │
│   └── Competition/unknown
│       Evidence: Unexplained position drops for specific URLs
│       Affected URLs: /parfum/ (17.9→25.1), /basic-skincare-pria-wajib/ (18.8→22.6)
│       Impact: ~50-80 impressions lost
│       Confidence: Low
│       Action: MONITOR; consider content improvement
│
### ├── Indexing loss (~20%)
│   ├── Legacy URL redirect/noindex (~15%)
│   │   Evidence: www URLs losing all impressions (/produk/skincare/sunscreen/ -47, /about-us/ -32)
│   │   Affected URLs: www.dreamlab.id subpages redirecting to dreamlab.id
│   │   Impact: ~150-200 impressions lost
│   │   Confidence: High
│   │   Action: Ensure redirects correct; non-www already canonical
│   │
│   ├── Crawled-not-indexed (~3-5%)
│   │   Evidence: 505 URLs in this category; some likely have historical impressions
│   │   Affected URLs: Multiple legacy articles
│   │   Impact: Not directly visible in top loss pages; likely small
│   │   Confidence: Low
│   │   Action: IMPORTANT PAGES need FIX_INDEXABILITY
│   │
│   └── 404 not found (~1%)
│       Evidence: 20 URLs 404; some may have backlinks
│       Affected URLs: /category/event/, /dreampreneur-beauty-academy-surabaya-2026/
│       Impact: Minimal (~5-10 impressions)
│       Confidence: Medium
│       Action: 301 if backlinks exist
│
### ├── CTR loss (~5%)
│   Evidence: CTR remained stable (2.15%→2.02%) or slightly improved (1.60%→2.00% 7v7)
│   Affected URLs: N/A - CTR not a primary issue
│   Impact: Minimal
│   Confidence: Medium
│   Action: No specific action needed
│
### └── Tracking/data issue (~5%)
│   Evidence: GSC data lag 2-3 days may affect latest numbers
│   Affected URLs: All
│   Impact: Small
│   Confidence: Low
│   Action: Ensure GSC data is complete before analysis

## Overall explained impression loss
| Root cause | Estimated contribution | Confidence |
| ---------- | ---------------------: | ---------- |
| Demand/query mix | ~25% | Medium |
| Ranking loss (content) | ~15% | Medium |
| Ranking loss (internal links) | ~10% | Low |
| Legacy URL redirect/noindex | ~15% | High |
| Crawled-not-indexed | ~5% | Low |
| Competition/unknown | ~25% | Low |
| CTR/tracking | ~5% | Medium |
| **Explained** | **~55-70%** | |
| **Unexplained** | **~30-45%** | |


========================================
=== 13-ga4-lead-impact.md ===
========================================

# GA4 Lead Impact Assessment

## Status: DATA INSUFFICIENT

**GA4 Data API credential tidak tersedia dalam repository ini. Export organic landing page dan lead events belum dibuat.**

## Available Evidence

### Tracking Code Audit
- **GTM Implementation**: Present in `src/components/TrackingScripts.tsx`
- **GTM/Clarity**: Rendered via `src/app/layout.tsx:7, 70, 95`
- **Contact Form**: `src/app/contact-us/page.tsx` handles form submissions
- **WhatsApp Click**: Not directly verifiable from code review

### GSC Traffic Inference
- Organic clicks 7v7: 142 → 169 (+19%)
- Impression decline does not necessarily mean lead decline
- If clicks increased, organic sessions to thank-you/contact pages may have increased

### Lead Tracking Gaps
1. No GA4 property ID found in environment files checked
2. No `generate_lead` or `purchase` event measurement verified
3. No form submission → GA4 event mapping confirmed
4. WhatsApp click tracking not verifiable without GTM container access

## Impact Classification: NO_MEANINGFUL_CHANGE (Inferred)

**Inferensi:** 
- Organic website traffic (clicks) tidak turun - malah naik
- Impression turun tapi ini tidak selalu berkorelasi dengan lead volume
- Tanpa GA4 data, tidak dapat menyimpulkan lead turun

## Required Actions

| Action | Priority | Owner | Expected output |
| ------ | -------- | ----- | --------------- |
| Export GA4 organic landing pages (28d before vs 28d after) | P0 | Marketing/GA4 Admin | CSV with sessions, engaged sessions, key events |
| Export GA4 lead events by source/medium | P0 | Marketing/GA4 Admin | CSV with form_submit, whatsapp_click, generate_lead |
| Audit GTM container tags for lead tracking | P1 | Developer | Verification that lead events fire correctly |
| Add lead tracking to thank-you pages if missing | P1 | Developer | GTM tag for /thankyou/ page views |
| Set up GA4 + GSC integration | P2 | Developer/Admin | Enable Google Signals, connect properties |

## Without this data, the following conclusions remain inferential:
- Whether SEO traffic decline affected qualified leads
- Whether conversion rate recovered/changed post-redesign
- Whether B2B lead generation pages are performing
- Whether thank-you page visits correlate with organic sessions


========================================
=== 16-priority-roadmap.md ===
========================================

# Priority Recovery Roadmap

## Scoring Formula

Priority Score = (Business value × 4) + (Historical traffic × 3) + (Current loss × 3) + (Lead potential × 4) + (Technical severity × 3) + (Confidence × 2) - (Effort × 2)

Where each component is 0-5.

## P0: Active loss on money pages (24 hours)

| # | Priority | Task | Exact URLs | Exact files | Owner | Effort | Evidence | KPI | Validation date | Rollback |
|---| -------- | ---- | ---------- | ----------- | ----- | ------ | -------- | --- | --------------- | -------- |
| 1 | P0 | Fix redirect /maklon-parfum/ destination from /google-ads/maklon-parfum/ to /parfum/ or restore standalone page | /maklon-parfum/ → change destination | next.config.ts:122-224 (redirects section), src/lib/seo-url-policy.ts | Developer | 1 hour | live-url-checks.csv row 12: 308 to /google-ads/maklon-parfum/ with no canonical | GSC URL Inspection shows correct destination after recrawl | 3 days | Revert to previous destination |
| 2 | P0 | Fix redirect /maklon-face-mist/ destination from /produk/skincare/ to dedicated page | /maklon-face-mist/ → change destination | next.config.ts redirects | Developer | 1 hour | live-url-checks.csv row 39: 308 to /produk/skincare/ | URL Inspection shows correct destination | 3 days | Revert to previous destination |
| 3 | P0 | Fix redirect /pabrik-parfum-surabaya/ from /produk/parfum/ to location-specific page | /pabrik-parfum-surabaya/ → change destination | next.config.ts redirects | Developer | 1 hour | live-url-checks.csv row 13: 308 to /produk/parfum/ | URL Inspection shows correct destination | 3 days | Revert to previous destination |
| 4 | P0 | Request indexing for 5 new service pages not appearing in GSC | /pabrik-parfum/, /pabrik-kosmetik/, /jasa-maklon-kosmetik/, /private-label-kosmetik/, /estimasi-biaya-maklon-kosmetik/ | GSC URL Inspection tool | SEO | 30 min | sitemap inclusion verified; pages return 200 but not in GSC performance | Pages appear as "Submitted and indexed" | 7 days | N/A |
| 5 | P0 | Export GA4 organic landing pages + lead events for 28d before/after | N/A - data request | GA4 Admin | Marketing | 2 hours | GA4 data unavailable in audit | CSV exported with sessions, leads by source/medium | 1 day | N/A |

## P1: Recovery opportunities (Days 2-7)

| # | Priority | Task | Exact URLs | Exact files | Owner | Effort | Evidence | KPI | Validation | Rollback |
|---| -------- | ---- | ---------- | ----------- | ----- | ------ | -------- | --- | ---------- | ------- |
| 6 | P1 | Add self-canonical to product category pages missing it | /produk/skincare/, /produk/bodycare/ | src/app/produk/[category]/page.tsx | Developer | 2 hours | Google-selected canonical may differ from declared | URL Inspection shows correct self-canonical | 7 days | Revert canonical code change |
| 7 | P1 | Add internal links from service pages to supporting articles | See internal-link-actions.csv rows 1-24 | Various article page.tsx files | Developer | 4 hours | Current graph shows service pages have low outbound links | Crawl report shows 3+ links from each service page | 3 days | Remove added links |
| 8 | P1 | Fix /maklon-moisturizer-bpom-dreamlab/ redirect destination | /maklon-moisturizer-bpom-dreamlab/ → better destination | next.config.ts redirects | Developer | 1 hour | live-url-checks.csv: redirects to generic /produk/skincare/ | URL Inspection correct | 3 days | Revert |
| 9 | P1 | Update content freshness for top declining B2B pages | /pabrik-parfum-malang-dreamlab/, /pabrik-maklon-kosmetik-surabaya-terlengkap/ | article content in src/data/ | Content team | 4 hours | ranking decline 8.7→11.7 and 10.0→8.3 | Position recovery in 28 days | 28 days | N/A (content update) |
| 10 | P1 | Request indexing for 15+ crawled-not-indexed articles with historical traffic | /dupe-parfum-nagita-slavina-tahan-lama/, /hero-ingredients-2025/, /potensi-bisnis-babycare/, others | GSC URL Inspection | SEO | 2 hours | URLs have historical impressions but now crawled-not-indexed | Indexed status changes to "Submitted and indexed" | 14 days | N/A |

## P2: Quality, consolidation, and internal linking (Week 2)

| # | Priority | Task | Exact URLs | Exact files | Owner | Effort | KPI | Validation |
|---| -------- | ---- | ---------- | ----------- | ----- | ------ | --- | ---------- |
| 11 | P2 | Consolidate duplicate article clusters | /ide-bisnis-kosmetik-2026/ + /ide-bisnis-kosmetik/, /maklon-kosmetik-terbaik/ + /perusahaan-maklon-kosmetik/ | next.config.ts + article data | Developer + Content | 4 hours | 301 redirect destination content match verified | URL Inspection |
| 12 | P2 | Add canonical tags to www subpages currently missing | 24 URLs in canonical-decisions.csv | src/app layout or SEO component | Developer | 2 hours | All www URLs have self-referential canonical | URL Inspection |
| 13 | P2 | Review /blog/ path noindex (potential accidental noindex) | /blog/foot-care..., /blog/pabrik-maklon..., /blog/maklon-hair-care... | Source code or GSC | SEO | 2 hours | Decide to keep noindex or remove noindex for /blog/ articles | URL Inspection |
| 14 | P2 | Add internal links from blog hub to B2B money pages | /news-blog/ → add links to top B2B pages | src/app/news-blog/page.tsx | Developer | 2 hours | Inbound links to B2B pages increase | Crawl report |
| 15 | P2 | Submit updated sitemap if new pages added | N/A - verify current sitemap includes all new pages | src/app/sitemap.ts | Developer | 1 hour | Sitemap includes all 330+ indexable URLs | GSC sitemap status |
| 16 | P2 | Audit /blog/ subdirectory articles for content overlap with /news-blog/ | 6 URLs from noindex decisions | Content comparison | Content team | 2 hours | No duplicate content between /blog/ and /news-blog/ paths | Manual comparison |

## P3: Maintenance and cleanup (Weeks 3-4)

| # | Priority | Task | Expected outcome | Effort |
|---| -------- | ---- | ---------------- | ------ |
| 17 | P3 | Return 410 for deprecated CMS block URLs | /cms_block_cat/pop-up-form/, /e-floating-buttons/popup-website/ | 1 hour |
| 18 | P3 | Remove author pagination from sitemap if present | /author/admin/page/* URLs | 30 min |
| 19 | P3 | Review and cleanup legacy feed URLs in GSC | All /feed/ URLs should naturally drop from index | 30 min |
| 20 | P3 | Monitor GSC crawled-not-indexed count decrease | Expected to decrease as sitemap cleanup takes effect | Ongoing |
| 21 | P3 | Verify noindex is correctly applied to system pages | /cart/, /my-account/, /checkout/, search results | 1 hour |

## Monitoring & Measurement

| KPI | Baseline | Target | Measurement cadence |
| --- | -------- | ------ | ------------------ |
| GSC 28d impressions | 35,958 (latest 28d) | 40,000+ | Weekly |
| Money pages indexed | ~20 verified indexed | All 25+ money pages indexed | Weekly |
| Crawled-not-indexed | 505 | <400 | Weekly |
| GSC clicks | 725 (latest 28d) | 900+ | Weekly |
| /parfum/ position | 25.1 | <15 | Weekly |
| New service pages indexed | 0/5 | 5/5 | Weekly |
| GA4 organic sessions | DATA MISSING | Restore baseline | After GA4 export |
| GA4 organic leads | DATA MISSING | Restore baseline | After GA4 export |


========================================
=== 17-implementation-spec.md ===
========================================

# Implementation Specification

## Change ID: REDIRECT-001

**Problem:** `/maklon-parfum/` redirects to `/google-ads/maklon-parfum/` (ads landing page) instead of the organic service page `/parfum/`.
**Evidence:** live-url-checks.csv row 12: `https://dreamlab.id/maklon-parfum/` → 308 → `/google-ads/maklon-parfum/` → 200, no canonical tag on destination.
**Affected URLs:** https://dreamlab.id/maklon-parfum/
**Affected file:** `next.config.ts` (redirects section)
**Current behavior:** 308 redirect from `/maklon-parfum/` to `/google-ads/maklon-parfum/`
**Required change:** Change redirect destination from `/google-ads/maklon-parfum/` to `/parfum/`
**Do not change:** Do not delete the `/google-ads/maklon-parfum/` page; it serves ads traffic. Do not change the status code (keep 308).
**Acceptance criteria:** `curl -I https://dreamlab.id/maklon-parfum/` returns 308 with `Location: /parfum/`. `/parfum/` returns 200 with self-canonical.
**Validation:** URL Inspection in GSC after recrawl shows correct canonical and destination.
**Rollback:** Revert to previous destination `/google-ads/maklon-parfum/`.

## Change ID: REDIRECT-002

**Problem:** `/maklon-face-mist/` redirects to `/produk/skincare/` (generic category) instead of a face-mist-specific page.
**Evidence:** live-url-checks.csv row 39: `https://dreamlab.id/maklon-face-mist/` → 308 → `/produk/skincare/`
**Affected URLs:** https://dreamlab.id/maklon-face-mist/
**Affected file:** `next.config.ts` (redirects section)
**Current behavior:** 308 redirect to `/produk/skincare/`
**Required change:** Change redirect to `/produk/skincare/facial-toner/` if that matches intent, or create a dedicated face mist page and redirect there.
**Do not change:** Do not delete the `/produk/skincare/` page. Do not change status code.
**Acceptance criteria:** Redirect lands on a page specifically about face mist/skincare products.
**Validation:** URL Inspection in GSC.
**Rollback:** Revert to previous destination.

## Change ID: REDIRECT-003

**Problem:** `/pabrik-parfum-surabaya/` redirects to `/produk/parfum/` losing Surabaya location intent.
**Evidence:** live-url-checks.csv row 13
**Affected URLs:** https://dreamlab.id/pabrik-parfum-surabaya/
**Affected file:** `next.config.ts` (redirects section)
**Current behavior:** 308 redirect to `/produk/parfum/`
**Required change:** Redirect to a Surabaya-specific parfum page if it exists, or to `/parfum/` with location context preserved.
**Do not change:** Do not remove the `/produk/parfum/` page.
**Acceptance criteria:** URL Inspection shows appropriate destination with location intent.
**Validation:** GSC query performance for "pabrik parfum surabaya" should show new destination.
**Rollback:** Revert to `/produk/parfum/`.

## Change ID: CANONICAL-001

**Problem:** www subpages (24 URLs) lack self-referential canonical tags.
**Evidence:** tag-kanonis.csv shows Google selected non-www as canonical but www pages don't declare it.
**Affected URLs:** www.dreamlab.id/* (24+ URLs)
**Affected file:** `src/app/layout.tsx` (canonical URL logic) or SEO component
**Current behavior:** www pages have no declared canonical tag
**Required change:** Add `<link rel="canonical" href="https://www.dreamlab.id/..."/>` to all www pages, or ensure the non-www version is consistently declared as canonical across all page variants.
**Do not change:** Do not change the sitemap to include www URLs.
**Acceptance criteria:** All www pages now declare `rel="canonical"` pointing to the correct version.
**Validation:** URL Inspection shows "User declared canonical" matches expected.
**Rollback:** Remove the added canonical tags.

## Change ID: INDEXING-001

**Problem:** New service pages (`/pabrik-parfum/`, `/pabrik-kosmetik/`, `/jasa-maklon-kosmetik/`, `/private-label-kosmetik/`, `/estimasi-biaya-maklon-kosmetik/`) are in sitemap but not yet indexed or not appearing in GSC performance.
**Evidence:** Sitemap includes these URLs; GSC performance data doesn't show them.
**Affected URLs:** 5 new service pages
**Affected file:** N/A (GSC action only)
**Current behavior:** Pages return 200, in sitemap, but not indexed or no performance data.
**Required change:** Use GSC URL Inspection to request indexing for each URL.
**Do not change:** Do not add these URLs to sitemap multiple times. Do not change internal linking structure without verifying content quality.
**Acceptance criteria:** All 5 pages show "Submitted and indexed" in GSC within 14 days.
**Validation:** GSC URL Inspection status + Performance data showing impressions.
**Rollback:** N/A

## Change ID: INTERNAL-LINK-001

**Problem:** Service pages (parfum, skincare-face-care, body-care, hair-care, baby-care) have low outbound internal links to supporting B2B articles.
**Evidence:** live-url-checks.csv shows service pages with ~41 links but predominantly navigation, not contextual content links.
**Affected URLs:** Service pages → B2B articles (see internal-link-actions.csv)
**Affected file:** Various `page.tsx` in service page components
**Current behavior:** No contextual links from service pages to related articles
**Required change:** Add contextual links (2-4 per service page) to relevant B2B articles
**Do not change:** Do not add excessive links (>10 per page). Do not use exact-match anchor text repeatedly.
**Acceptance criteria:** Each service page has 2-4 relevant contextual links to B2B articles.
**Validation:** Crawl report shows new internal links. GSC performance for linked articles shows improvement within 28 days.
**Rollback:** Remove added links.

## Change ID: CONTENT-001

**Problem:** B2B location articles `/pabrik-parfum-malang-dreamlab/` and `/pabrik-maklon-kosmetik-surabaya-terlengkap/` are declining in position despite clicks holding or increasing.
**Evidence:** gsc-page-loss-7v7.csv shows position drop from 8.7→11.7 and 10.0→8.3 respectively.
**Affected URLs:** /pabrik-parfum-malang-dreamlab/, /pabrik-maklon-kosmetik-surabaya-terlengkap/
**Affected file:** Article content in src/data/ or CMS
**Current behavior:** Content may be stale, missing freshness signals, or lacking depth.
**Required change:** Update content with current year information, add new stats, improve formatting, add internal links to service pages.
**Do not change:** Do not change the URL slug. Do not add noindex. Do not redirect.
**Acceptance criteria:** Position improves or impressions recover within 28 days.
**Validation:** GSC position tracking for primary queries.
**Rollback:** Restore previous content version.

## Change ID: NOINDEX-REVIEW-001

**Problem:** `/blog/` subdirectory articles are noindexed but contain potentially valuable content that overlaps with `/news-blog/`.
**Evidence:** Dikecualikan oleh tag 'noindex'.csv shows 6+ /blog/ URLs
**Affected URLs:** /blog/* articles
**Affected file:** Source code controlling /blog/ path indexing policy
**Current behavior:** /blog/ path returns noindex
**Required change:** Review whether /blog/ articles should be: (a) merged with /news-blog/ equivalents, (b) redirected to /news-blog/, or (c) have noindex removed if unique content
**Do not change:** Do not mass-remove noindex without content review. Do not create duplicate content between /blog/ and /news-blog/.
**Acceptance criteria:** Each /blog/ URL has a clear decision (keep noindex, merge, or remove noindex).
**Validation:** Manual content comparison between /blog/ and /news-blog/ equivalents.
**Rollback:** Re-apply noindex if needed.


========================================
=== 18-implementation-prompt.md ===
========================================

# Implementation Prompt

You are now in IMPLEMENTATION mode. Your task is to execute the changes defined in `17-implementation-spec.md` based on the decisions in `15-final-url-action-matrix.csv`.

## Prerequisites

1. Read `15-final-url-action-matrix.csv` to understand the decision per URL
2. Read `17-implementation-spec.md` for detailed change specifications
3. Read `16-priority-roadmap.md` for execution order
4. Read `06-redirect-decisions.csv` for redirect-specific decisions

## Scope

### Phase 1 (P0 only - highest impact)
Implement these changes ONLY:

1. **REDIRECT-001**: Change `/maklon-parfum/` redirect from `/google-ads/maklon-parfum/` to `/parfum/`
   - File: `next.config.ts`
   - Find the redirect entry for `/maklon-parfum/`
   - Change destination to `/parfum/`
   - Keep 308 status code

2. **REDIRECT-002**: Change `/maklon-face-mist/` redirect from `/produk/skincare/` to appropriate destination
   - File: `next.config.ts`
   - Find the redirect entry
   - Change to `/produk/skincare/facial-toner/` or better matching page

3. **REDIRECT-003**: Change `/pabrik-parfum-surabaya/` redirect from `/produk/parfum/` to location-specific page
   - File: `next.config.ts`
   - Find the redirect entry
   - Change to appropriate destination

4. **INDEXING-001**: Submit indexing requests via GSC URL Inspection for:
   - `/pabrik-parfum/`
   - `/pabrik-kosmetik/`
   - `/jasa-maklon-kosmetik/`
   - `/private-label-kosmetik/`
   - `/estimasi-biaya-maklon-kosmetik/`

5. **GA4 data request**: Output the request for GA4 export (read-only task)

### Rules

- Do NOT change any file not listed in the implementation spec
- Do NOT modify any URL that has HEALTHY status in the action matrix
- Do NOT add noindex to any URL unless explicitly specified
- Do NOT delete any page content
- Do NOT create new articles or backlinks
- Do NOT change sitemap configuration unless specified

### Before each change

1. Read the current file content
2. Create a backup of the original
3. Make the minimal change required
4. Test the change locally

### After all changes

1. Run `npm run build` (or equivalent) to verify no compilation errors
2. Check that redirects work: `curl -I http://localhost:3000/maklon-parfum/`
3. Generate a change report listing all modifications

### If you encounter a MANUAL_REVIEW decision

- Skip that URL
- Note it in the change report
- Continue with other changes

### Output

Create a file `seo-redesign-decision/implementation-report.md` containing:
- List of changes made
- Files modified
- URLs affected
- Status (success/failure/skipped)
- MANUAL_REVIEW URLs encountered
- Any issues or decisions made during implementation

## CRITICAL: Stop if any instruction conflicts with:
- "Do not change code that is healthy"
- "Do not mass noindex/delete"
- "Do not redirect all 404s to homepage"
- "Do not skip MANUAL_REVIEW decisions"


========================================
=== open-questions.md ===
========================================

# Open Questions Requiring Resolution

## Critical (Blocking Implementation)

| # | Question | Why it matters | Who can answer |
|---| -------- | -------------- | -------------- |
| 1 | Apakah GA4 Data API credential atau export organic landing page + lead events tersedia? | Tanpa ini, lead impact tidak dapat diukur; recovery success tidak dapat dievaluasi | Marketing/GA4 Admin |
| 2 | Apakah ada backlink profile data (Ahrefs/Moz/ Semrush) untuk legacy URLs? | Memengaruhi keputusan redirect vs 404 vs restore untuk 20 URL 404 dan legacy redirects | SEO team |
| 3 | Apakah /blog/ path intentionally noindexed? Jika ya, apakah kontennya duplikat dengan /news-blog/? | 6+ URLs di noindex decisions perlu klarifikasi sebelum aksi | Developer/Content team |

## High Priority (Needed for Phase 2)

| # | Question | Why it matters | Who can answer |
|---| -------- | -------------- | -------------- |
| 4 | Siapa pemilik/penulis konten artikel lama? Perlu koordinasi untuk content updates | Content update tasks butuh writer assignment | Content/Project manager |
| 5 | Apakah ada GA4 goals/key events yang terdefinisi untuk lead tracking (form submit, WhatsApp click)? | Verifikasi tracking regression | Developer/Marketing |
| 6 | Apakah ada rencana untuk membuat dedicated landing pages untuk /maklon-face-mist/, /pabrik-parfum-surabaya/, dll? | Memengaruhi keputusan redirect: restore vs redirect vs create new | Product/Business owner |

## Medium Priority

| # | Question | Why it matters |
|---| -------- | -------------- |
| 7 | Apakah struktur URL /produk/[category]/[...slug]/ akan dipertahankan atau ada rencana migrasi ke /maklon/ prefix? | Memengaruhi canonical dan redirect strategy jangka panjang |
| 8 | Apakah ada rencana untuk menghidupkan kembali event category atau kategori lain yang sekarang 404? | Memengaruhi 404 vs 410 decision |
| 9 | Apakah Google Search Console ownership sudah diverifikasi untuk semua varian (dreamlab.id, www.dreamlab.id, http://)? | Memengaruhi kemampuan request indexing dan diagnosis |

## Data Gaps

| # | Missing data | Impact | How to resolve |
|---| ------------ | ------ | -------------- |
| 10 | Full GSC Page Indexing export (505 crawled-not-indexed, 338 redirect, 173 canonical, 73 noindex, 20 404) | Cannot triage all 1,141 excluded URLs individually | Export from GSC UI manually and provide CSV |
| 11 | GA4 organic landing pages + lead events 28d before/after | Cannot quantify lead impact | Export from GA4 |
| 12 | Backlink profile | Cannot assess legacy URL value | Export from Ahrefs/Semrush/Moz |
| 13 | Pre-redesign internal link graph | Cannot measure link equity loss | Cannot recover; focus on current graph improvement |
| 14 | PageSpeed/Core Web Vitals data | Cannot assess technical performance regression | Run PageSpeed Insights on top 10 pages |


========================================
=== 02-master-url-inventory.csv ===
========================================

url,normalized_url,source,page_type,content_type,business_intent,funnel,current_http_status,redirect_destination,redirect_hops,declared_canonical,robots,in_current_sitemap,gsc_indexing_reason,gsc_clicks_before,gsc_clicks_after,gsc_impressions_before,gsc_impressions_after,position_before,position_after,internal_inlinks,business_value,notes
https://dreamlab.id/,https://dreamlab.id/,sitemap+livelist,homepage,landing,commercial,TOFU,200,,0,self,index,YES,indexed,47,36,676,590,11.2,10.9,58,5,Homepage
https://dreamlab.id/services/,https://dreamlab.id/services/,sitemap+livelist,service,service-overview,commercial,MOFU,200,,0,self,index,YES,indexed,2,1,98,70,11.1,10.9,44,5,Service overview
https://dreamlab.id/parfum/,https://dreamlab.id/parfum/,sitemap+livelist,service,category,commercial,MOFU,200,,0,self,index,YES,indexed,2,0,33,8,17.9,25.1,41,5,Critical ranking loss
https://dreamlab.id/skincare-face-care/,https://dreamlab.id/skincare-face-care/,sitemap+livelist,service,category,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,2,0,1,0,41,4,Low visibility
https://dreamlab.id/body-care/,https://dreamlab.id/body-care/,sitemap+livelist,service,category,commercial,MOFU,200,,0,self,index,YES,indexed,0,1,12,9,43.9,43.9,41,4,Low visibility
https://dreamlab.id/hair-care/,https://dreamlab.id/hair-care/,sitemap+livelist,service,category,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,2,0,2.5,0,41,4,Low visibility
https://dreamlab.id/baby-care/,https://dreamlab.id/baby-care/,sitemap+livelist,service,category,commercial,MOFU,200,,0,self,index,YES,indexed,0,1,12,9,43.8,43.9,41,4,Low visibility
https://dreamlab.id/foot-care/,https://dreamlab.id/foot-care/,sitemap+livelist,service,category,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,0,0,0,0,41,3,Niche
https://dreamlab.id/about-us/,https://dreamlab.id/about-us/,sitemap+livelist,about,informational,informational,TOFU,200,,0,self,index,YES,indexed,0,0,12,29,11.2,14.6,45,3,Healthy
https://dreamlab.id/about-us/alur-maklon/,https://dreamlab.id/about-us/alur-maklon/,sitemap+livelist,service,process,commercial,MOFU,200,,0,self,index,YES,indexed,0,1,3,2,50.7,34.5,42,4,Important process page
https://dreamlab.id/contact-us/,https://dreamlab.id/contact-us/,sitemap+livelist,contact,form,commercial,BOFU,200,,0,self,index,YES,indexed,4,4,229,222,10.7,8.1,45,5,Key conversion page
https://dreamlab.id/contact-medsos/,https://dreamlab.id/contact-medsos/,sitemap+livelist,contact,form,commercial,BOFU,200,,0,self,index,YES,indexed,0,0,1,0,10,0,48,4,Social contact
https://dreamlab.id/our-client/,https://dreamlab.id/our-client/,sitemap+livelist,social-proof,portfolio,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,21,15,24.8,9.3,42,4,Social proof
https://dreamlab.id/career/,https://dreamlab.id/career/,sitemap+livelist,career,informational,informational,TOFU,200,,0,self,index,YES,indexed,1,4,42,46,9.3,9.8,43,2,Not business critical
https://dreamlab.id/terms-of-service/,https://dreamlab.id/terms-of-service/,sitemap+livelist,legal,legal,informational,TOFU,200,,0,self,index,YES,indexed,0,0,10,3,40.3,50,42,1,Legal page
https://dreamlab.id/privacy-policy/,https://dreamlab.id/privacy-policy/,sitemap+livelist,legal,legal,informational,TOFU,200,,0,self,index,YES,indexed,0,0,11,3,3.2,13.7,43,1,Legal page
https://dreamlab.id/news-blog/,https://dreamlab.id/news-blog/,sitemap+livelist,blog,blog-hub,informational,TOFU,200,,0,self,index,YES,indexed,0,0,19,11,13.9,13.8,83,3,Blog hub
https://dreamlab.id/panduan/,https://dreamlab.id/panduan/,sitemap+livelist,guide,guide,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,0,3,0,34.3,45,4,Guide section
https://dreamlab.id/produk/skincare/,https://dreamlab.id/produk/skincare/,sitemap+livelist,product-category,product-listing,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,27,13,12.3,22.8,51,4,Needs canonical check
https://dreamlab.id/produk/parfum/,https://dreamlab.id/produk/parfum/,sitemap+livelist,product-category,product-listing,commercial,MOFU,200,,0,self,index,YES,indexed,1,2,126,96,15.8,14.2,50,5,Key category
https://dreamlab.id/produk/bodycare/,https://dreamlab.id/produk/bodycare/,sitemap+livelist,product-category,product-listing,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,19,13,20.9,15.1,42,4,Needs canonical check
https://dreamlab.id/produk/haircare/,https://dreamlab.id/produk/haircare/,sitemap+livelist,product-category,product-listing,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,7,8,26.6,51.4,42,3,Low visibility
https://dreamlab.id/produk/babycare/,https://dreamlab.id/produk/babycare/,sitemap+livelist,product-category,product-listing,commercial,MOFU,200,,0,self,index,YES,indexed,0,3,37,47,24.4,14.1,18,4,Growing
https://dreamlab.id/produk/decorative/,https://dreamlab.id/produk/decorative/,sitemap+livelist,product-category,product-listing,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,6,8,4.2,23.4,14,3,Low visibility
https://dreamlab.id/produk/footcare/,https://dreamlab.id/produk/footcare/,sitemap+livelist,product-category,product-listing,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,2,5,18.5,59.8,14,2,Niche
https://dreamlab.id/produk/pkrt/,https://dreamlab.id/produk/pkrt/,sitemap+livelist,product-category,product-listing,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,7,11,14,11.5,10,3,Niche but growing
https://dreamlab.id/category/maklon-kosmetik/,https://dreamlab.id/category/maklon-kosmetik/,sitemap+livelist,category,category-hub,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,0,0,0,0,307,4,Category hub
https://dreamlab.id/category/panduan-bisnis-kosmetik/,https://dreamlab.id/category/panduan-bisnis-kosmetik/,sitemap+livelist,category,category-hub,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,0,0,0,0,322,4,Category hub
https://dreamlab.id/category/dreamlabpedia/,https://dreamlab.id/category/dreamlabpedia/,sitemap+livelist,category,category-hub,informational,TOFU,200,,0,self,index,YES,indexed,0,0,1,0,1,0,47,3,Category hub
https://dreamlab.id/pabrik-parfum-jakarta/,https://dreamlab.id/pabrik-parfum-jakarta/,sitemap+livelist,location,service,commercial,MOFU,200,,0,self,index,YES,indexed,0,1,49,34,20.6,22.2,62,5,Key location page
https://dreamlab.id/perusahaan-maklon-kosmetik/,https://dreamlab.id/perusahaan-maklon-kosmetik/,sitemap+livelist,service,company-profile,commercial,MOFU,200,,0,self,index,YES,indexed,0,0,21,26,15.0,15.0,67,5,Important company page


========================================
=== 03-impression-loss-decomposition.csv ===
========================================

query_cluster,page,page_type,intent,impressions_before,impressions_after,change,position_before,position_after,clicks_before,clicks_after,probable_cause,confidence,business_impact,recommended_action
handbody,cara-meracik-handbody-pemutih-alami,article,informational,2426,2051,-375,7.9,7.7,6,8,demand/seasonal decline,Medium,Medium (high impressions but B2C),KEEP_MONITOR content and CTR
moisturizer,perbedaan-moisturizer-gel-vs-cream,article,informational,480,358,-122,7.4,7.4,0,1,demand/seasonal decline,Medium,Low (B2C informational),KEEP_NO_ACTION
homepage,/,homepage,commercial,676,590,-86,11.2,10.9,47,36,ranking/demand mix,Medium,High (primary landing page),KEEP_MONITOR query performance
parfum inspired,parfum-inspired-peluang-bisnis,article,commercial,189,140,-49,7.8,7.6,1,0,natural fluctuation,Low,Medium (B2B potential),KEEP_MONITOR
sunscreen (www),www.dreamlab.id/produk/skincare/sunscreen/,product,commercial,47,0,-47,1.7,0,0,0,URL migration/redirect to non-www,High,Low (few clicks),REDIRECT destination check
cysteamine,cysteamine-alternatif-hydroquinone,article,informational,127,92,-35,7.8,8.8,2,0,ranking decline + demand,Medium,Low,UPDATE_CONTENT freshness
hair tonic,manfaat-hair-tonic-ginseng-rambut,article,informational,132,98,-34,9.5,10.5,1,0,ranking decline,Medium,Low,KEEP_MONITOR
about-us (www),www.dreamlab.id/about-us/,about,informational,32,0,-32,9.4,0,1,0,URL migration www→non-www,High,Low (low traffic),KEEP_EXISTING_REDIRECT
parfum malang,pabrik-parfum-malang-dreamlab,article,commercial,59,28,-31,8.7,11.7,1,1,ranking decline,Medium,Medium (location page),UPDATE_CONTENT
surabaya kosmetik,pabrik-maklon-kosmetik-surabaya-terlengkap,article,commercial,241,211,-30,10.0,8.3,6,10,position actually improved but fewer impressions,Low,High (money page),KEEP_MONITOR (clicks up)
produk parfum,produk/parfum/,product_category,commercial,126,96,-30,15.8,14.2,1,2,seasonal demand,Low,High (product page),KEEP_MONITOR
parfum,cara-buat-parfum-sendiri-dengan-maklon,article,informational,96,66,-30,9.8,9.6,0,0,demand decline,Medium,Medium,KEEP_MONITOR
lulur kopi,cara-membuat-lulur-ampas-kopi,article,informational,59,29,-30,7.1,8.6,0,0,ranking decline,Medium,Low,KEEP_MONITOR
industri kosmetik,industri-kosmetik-indonesia-terus-tumbuh,article,informational,72,44,-28,11.2,9.8,4,3,position actually improved but value low,Low,Low (no direct commercial path),KEEP_NO_ACTION
services,services/,service,commercial,98,70,-28,11.1,10.9,2,1,position stable impressions down,Medium,High (money page),ADD_INTERNAL_LINKS improve authority
parfum,/parfum/,category,commercial,33,8,-25,17.9,25.1,2,0,ranking decline,Medium,High (main parfum page),FIX_INDEXABILITY check
sunscreen,jasa-maklon-sunscreen-terbaik,article,commercial,48,24,-24,5.9,6.4,1,1,position stable impressions down,Medium,Medium,KEEP_MONITOR
lampung,maklon-kosmetik-bpom-bandar-lampung,article,commercial,23,1,-22,6.8,1,0,0,low-value URL naturally declining,Low,Low,LEAVE_AS_EXPECTED
sunscreen produk,produk/skincare/facial-sunscreen/,product,commercial,21,1,-20,2.4,6,0,0,product page losing visibility,Medium,Medium,FIX_INDEXABILITY and internal links
hb dosting,cara-membuat-hb-dosting-sendiri,article,informational,417,399,-18,6.6,6.9,6,3,position stable impressions down,Medium,Low (B2C),KEEP_NO_ACTION
minyak atsiri,produk/parfum/minyak-atsiri/,product,commercial,23,5,-18,19.9,9.4,1,0,position improved but low base,Low,Low,LEAVE_AS_EXPECTED
halal kosmetik,atur-kosmetik-halal-dreamlab,article,informational,28,11,-17,9.3,11.5,0,0,ranking decline,Low,Low,KEEP_NO_ACTION
brand skincare 90 hari,berapa-lama-membuat-brand-skincare-90-hari,article,informational,18,1,-17,7.0,5,0,0,low impression base noise,Low,Low,LEAVE_AS_EXPECTED
skincare pria,basic-skincare-pria-wajib,article,informational,33,17,-16,18.8,22.6,0,0,ranking decline,Low,Low (B2C),KEEP_NO_ACTION
all day cream,maklon-all-day-cream,article,commercial,18,2,-16,5.9,8,0,0,ranking decline,Medium,Medium,FIX_INDEXABILITY
produk babycare,www.dreamlab.id/produk/babycare/baby-2in1-wash/,product,commercial,19,3,-16,14.6,5.3,0,0,URL migration,High,Low,redirect check
pabrik parfum jakarta,pabrik-parfum-jakarta/,service,commercial,49,34,-15,20.6,22.2,0,1,position stable,Medium,High (money page),ADD_INTERNAL_LINKS


========================================
=== 04-crawled-not-indexed-decisions.csv ===
========================================

url,page_type,http_status,robots,canonical,internal_inlinks,historical_impressions,classification,decision,priority,notes
https://www.dreamlab.id/memunculkan-keranjang-reels/,legacy_article,redirect,index,external,0,unknown,LEGACY_URL,REDIRECT_TO_RELEVANT_PAGE,P3,Already redirects to /news-blog/
https://www.dreamlab.id/pabrik-parfum-surabaya/,legacy_article,redirect,index,external,0,unknown,LEGACY_URL,REDIRECT_TO_RELEVANT_PAGE,P0,Already redirects to /produk/parfum/ but destination needs review
https://www.dreamlab.id/services,service,200,index,self,0,unknown,DUPLICATE_OR_CONSOLIDATION,FIX_TECHNICAL,P2,Missing trailing slash - should 301 to /services/
https://dreamlab.id/maklon-shampoo-psoriasis-formula-juara/,article,redirect,index,external,0,unknown,LEGACY_URL,KEEP_AND_REQUEST_RECRAWL,P2,Needs indexing verification
https://dreamlab.id/category/maklon-baby-care/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed URL - expected exclusion
https://dreamlab.id/news-blog/page/3/,pagination,unknown,index,external,0,unknown,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Pagination page - expected exclusion
https://dreamlab.id/news-blog/page/7/,pagination,unknown,index,external,0,unknown,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Pagination page - expected exclusion
https://dreamlab.id/news-blog/page/2/,pagination,unknown,index,external,0,unknown,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Pagination page - expected exclusion
https://dreamlab.id/wp-content/plugins/,system_path,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,WordPress system path
https://dreamlab.id/?wc-ajax=%25%25endpoint%25%25,parameter,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,WooCommerce ajax parameter URL
https://dreamlab.id/dupe-parfum-nagita-slavina-tahan-lama/,article,unknown,index,unknown,0,20,CONTENT_QUALITY_PROBLEM,KEEP_AND_REQUEST_RECRAWL,P2,"Has historical impressions (20), B2C article"
https://dreamlab.id/search/{search_term_string}/feed/rss2/,system_feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,System search feed
https://dreamlab.id/category/maklon-personal-care/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed URL
https://dreamlab.id/cms_block_cat/footer-column/,system_path,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,CMS block
https://dreamlab.id/state-of-beauty-2025-tren-kecantikan-pertumbuhan-industri-,article,unknown,index,unknown,0,7,CONTENT_QUALITY_PROBLEM,UPDATE_CONTENT,P2,"Truncated URL, old content, low impressions"
https://dreamlab.id/pages/syarat-pendaftaran.php,legacy_php,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Old PHP page
https://dreamlab.id/pages/transfer-external.php,legacy_php,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Old PHP page
https://dreamlab.id/pages/cara-mendaftar.php,legacy_php,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Old PHP page
https://dreamlab.id/pages/life-cycle.php,legacy_php,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Old PHP page
https://dreamlab.id/pages/ticket-guide.php,legacy_php,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Old PHP page
https://dreamlab.id/pages/office365.php,legacy_php,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Old PHP page
https://dreamlab.id/pages/auto-provisioning.php,legacy_php,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Old PHP page
https://dreamlab.id/potensi-bisnis-babycare/,article,unknown,index,unknown,0,7,CONTENT_QUALITY_PROBLEM,UPDATE_CONTENT,P2,"Low impressions, but has commercial intent"
https://dreamlab.id/maklon-face-mist/,article,redirect,index,external,0,unknown,LEGACY_URL,REDIRECT_TO_RELEVANT_PAGE,P0,Critical money page redirecting to generic category
https://dreamlab.id/solusi-bisnis-body-serum-aha-2025-tren-pasar-maklon-dreamlab/,article,unknown,index,unknown,0,2,CONTENT_QUALITY_PROBLEM,UPDATE_CONTENT,P3,"Old article, low impressions"
https://dreamlab.id/category/bisnis-men-grooming/,category,redirect,index,external,0,5,LEGACY_URL,REDIRECT_DESTINATION_REVIEW,P2,Redirects to maklon-kosmetik - intent mismatch
https://dreamlab.id/contact-form-dreamlab/,legacy_form,redirect,index,external,0,unknown,LEGACY_URL,REDIRECT_TO_RELEVANT_PAGE,P3,Already redirects to /contact-us/
https://dreamlab.id/cms_block_cat/pop-up-form/,system_path,redirect,index,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,CMS block - expected
https://dreamlab.id/maklon-moisturizer-bpom-dreamlab/,article,redirect,index,external,0,unknown,LEGACY_URL,REDIRECT_TO_RELEVANT_PAGE,P1,Redirects to /produk/skincare/ - too generic
https://dreamlab.id/cms_block_cat/flying-button/,system_path,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,CMS block
https://dreamlab.id/news-blog/page/6/,pagination,unknown,index,external,0,unknown,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Pagination
https://dreamlab.id/product-category/uncategorized/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed
https://dreamlab.id/author/admin/page/6/,author_pagination,unknown,index,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Author pagination
https://dreamlab.id/category/maklon-footcare/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed
https://dreamlab.id/category/dreampreneur-beauty-academy/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed
https://dreamlab.id/omset-moisturizer-naik-tajam-dreamlab-bisnis-skincare/,article,unknown,index,unknown,0,4,CONTENT_QUALITY_PROBLEM,UPDATE_CONTENT,P3,Old article, low impressions
https://dreamlab.id/hero-ingredients-2025/,article,unknown,index,unknown,0,10,CONTENT_QUALITY_PROBLEM,UPDATE_CONTENT,P2,"Has impressions (10), outdated 2025 content"
https://dreamlab.id/flywheel-marketing-brand-skincare/,article,redirect,index,external,0,unknown,LEGACY_URL,REDIRECT_CORRECT,P3,Already redirected to /news-blog/
https://dreamlab.id/produk-haircare-yang-sedang-tren/,article,redirect,index,external,0,unknown,LEGACY_URL,REDIRECT_CORRECT,P3,Already redirected correctly
https://dreamlab.id/author/admin/page/2/,author_pagination,unknown,index,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Author pagination
https://dreamlab.id/ide-bisnis-kosmetik/,article,unknown,index,unknown,0,unknown,CONTENT_QUALITY_PROBLEM,MANUAL_REVIEW,P2,Duplicate with /ide-bisnis-kosmetik-2026/
https://dreamlab.id/wp-content/plugins/popup-maker/,system_path,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Plugin path
https://dreamlab.id/shop/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Shop feed
https://dreamlab.id/wp-json/pum/v1,system_path,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,REST API path
https://dreamlab.id/category/maklon-haircare/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed
https://dreamlab.id/babycare-masa-kini-sentuhan-lembut-dan-ilmu-pengetahuan/,article,unknown,index,unknown,0,unknown,CONTENT_QUALITY_PROBLEM,MANUAL_REVIEW,P2,Orphan article with no recent impressions
https://dreamlab.id/category/bisnis-kosmetik/page/2/,category_pagination,unknown,index,external,0,unknown,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Category pagination
https://dreamlab.id/maklon-kosmetik-terbaik/,article,unknown,index,unknown,0,unknown,DUPLICATE_OR_CONSOLIDATION,MERGE_AND_301,P2,Duplicate with /perusahaan-maklon-kosmetik/
https://dreamlab.id/wp-content/litespeed/localres/...,system_path,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Cache path
https://dreamlab.id/checkout/,system_page,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,WooCommerce checkout
https://dreamlab.id/category/maklon-bodycare/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed
https://dreamlab.id/author/admin/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed
https://dreamlab.id/category/bisnis-skincare/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed
https://dreamlab.id/category/dreamlabpedia/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed
https://dreamlab.id/category/personal-care/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed
https://dreamlab.id/category/tips-trick/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed
https://dreamlab.id/category/maklon-parfum/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed
https://dreamlab.id/category/maklon-skincare/feed/,feed,unknown,noindex,external,0,0,EXPECTED_NOT_INDEXED,LEAVE_AS_EXPECTED,P3,Feed


========================================
=== 05-discovered-not-indexed-decisions.csv ===
========================================

url,http_status,in_sitemap,internal_inlinks,click_depth,publication_date,content_quality,classification,decision,priority,notes
https://dreamlab.id/maklon-baby-care/,200,YES,unknown,3,unknown,STANDARD,ADD_INTERNAL_LINK,P2,Service page in sitemap but newly discovered; needs internal links from baby-care category
https://dreamlab.id/maklon-baby-care/baby-2in1-wash/,200,YES,unknown,4,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page; normal discovery delay
https://dreamlab.id/maklon-baby-care/baby-moisturizer/,200,YES,unknown,4,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page; normal discovery delay
https://dreamlab.id/maklon-baby-care/baby-shampoo/,200,YES,unknown,4,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page; normal discovery delay
https://dreamlab.id/maklon-baby-care/baby-cologne/,200,YES,unknown,4,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page; normal discovery delay
https://dreamlab.id/produk/babycare/baby-cologne/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/babycare/baby-powder/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/babycare/baby-oil/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/bodycare/neck-cream/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/bodycare/soothing-gel/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/bodycare/whitening-soap/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/bodycare/bar-soap/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/bodycare/massage-cream/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/footcare/foot-soak/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/footcare/foot-anti-bacterial/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/pkrt/disinfectant-spray/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/pkrt/room-spray/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/pkrt/bar-soap-pkrt/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page
https://dreamlab.id/produk/pkrt/herbal-soap/,200,YES,unknown,3,unknown,STANDARD,KEEP_AND_WAIT,P3,Deep product page


========================================
=== 06-redirect-decisions.csv ===
========================================

url,destination,http_status,redirect_hops,canonical,intent_similarity,historical_clicks,historical_impressions,backlinks,internal_links_still_pointing,classification,priority,recommended_action,validation_method,notes
https://dreamlab.id/maklon-parfum/,/google-ads/maklon-parfum/,308,1,missing,LOW_ADS_LANDING,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_DESTINATION_REVIEW,P0,REDIRECT_TO_RELEVANT_PAGE,"URL Inspection after change, query performance check","Critical money page redirects to ads landing page. Recommend redirect to /parfum/ or restore as standalone service page with maklon parfum content and intent."
https://dreamlab.id/maklon-face-mist/,/produk/skincare/,308,1,/produk/skincare/,LOW_TOO_GENERIC,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_DESTINATION_REVIEW,P0,REDIRECT_TO_RELEVANT_PAGE,"URL Inspection after change, check /produk/skincare/ canonical","Face mist is specific product; redirect to /produk/skincare/ loses specificity. Consider /produk/skincare/facial-toner/ or dedicated page."
https://dreamlab.id/pabrik-parfum-surabaya/,/produk/parfum/,308,1,/produk/parfum/,LOW_LOCATION_LOST,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_DESTINATION_REVIEW,P0,REDIRECT_TO_RELEVANT_PAGE,"URL Inspection, location query check","Redirect to /produk/parfum/ loses Surabaya location intent. Create or redirect to location-specific page."
https://dreamlab.id/maklon-kosmetik-jakarta-dreamlab-2026/,/maklon-jakarta-terbaik/,308,1,/maklon-jakarta-terbaik/,MEDIUM,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P1,KEEP_AND_MONITOR,"URL Inspection, content intent check","Acceptable redirect if /maklon-jakarta-terbaik/ covers same intent. Date in old URL may affect perceived freshness."
https://dreamlab.id/maklon-kosmetik-parfum-tangerang/,/maklon-kosmetik-tangerang-terpercaya/,308,1,/maklon-kosmetik-tangerang-terpercaya/,HIGH,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P1,KEEP_AND_MONITOR,"URL Inspection, content comparison","Good redirect. Both pages cover Tangerang maklon kosmetik."
https://dreamlab.id/maklon-moisturizer-bpom-dreamlab/,/produk/skincare/,308,1,/produk/skincare/,LOW_TOO_GENERIC,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_DESTINATION_REVIEW,P1,REDIRECT_TO_RELEVANT_PAGE,"URL Inspection after change","Moisturizer-specific page redirecting to generic skincare category. Consider dedicated moisturizer page."
https://dreamlab.id/category/maklon-skincare/,/category/maklon-kosmetik/,308,1,/category/maklon-kosmetik/,MEDIUM,31,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P2,KEEP_AND_MONITOR,URL Inspection,"Acceptable consolidation. Maklon skincare → Maklon kosmetik is reasonable."
https://dreamlab.id/category/bisnis-men-grooming/,/category/maklon-kosmetik/,308,1,/category/maklon-kosmetik/,LOW_INTENT_MISMATCH,unknown,5,DATA_MISSING,DATA_MISSING,REDIRECT_DESTINATION_REVIEW,P2,MANUAL_REVIEW,Content comparison,"Men grooming → Maklon kosmetik is not an exact match. Consider if dedicated category needed."
https://dreamlab.id/cms_block_cat/pop-up-form/,/,308,1,/,LOW_NO_CONTENT,unknown,unknown,DATA_MISSING,DATA_MISSING,SHOULD_BE_404,P3,RETURN_410,GSC issue count decay,"CMS block redirecting to homepage. Should return 404 or 410."
https://dreamlab.id/e-floating-buttons/popup-website/,/,308,1,/,LOW_NO_CONTENT,unknown,unknown,DATA_MISSING,DATA_MISSING,SHOULD_BE_404,P3,RETURN_410,GSC issue count decay,"Floating buttons redirect to homepage. Should 404/410."
https://dreamlab.id/flywheel-marketing-brand-skincare/,/news-blog/,308,1,/news-blog/,LOW_NO_CONTENT,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P3,KEEP_AND_MONITOR,URL Inspection,"Acceptable redirect to blog if no equivalent content exists."
https://dreamlab.id/category/dreampreneur-beauty-academy/,self,200,0,self,EXPECTED,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P2,KEEP_NOINDEX,URL Inspection,Category page with noindex tag intentional.
https://dreamlab.id/author/admin/page/5/,/author/admin/,308,1,/author/admin/,HIGH,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P3,KEEP_AND_MONITOR,URL Inspection,Pagination redirect to parent is correct.
https://dreamlab.id/author/admin/page/7/,/author/admin/,308,1,/author/admin/,HIGH,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P3,KEEP_AND_MONITOR,URL Inspection,Pagination redirect to parent is correct.
https://dreamlab.id/author/admin/page/8/,/author/admin/,308,1,/author/admin/,HIGH,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P3,KEEP_AND_MONITOR,URL Inspection,Pagination redirect to parent is correct.
https://dreamlab.id/author/admin/page/9/,/author/admin/,308,1,/author/admin/,HIGH,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P3,KEEP_AND_MONITOR,URL Inspection,Pagination redirect to parent is correct.
https://dreamlab.id/category/dreamlabpedia/page/2/,/category/dreamlabpedia/,308,1,/category/dreamlabpedia/,HIGH,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P3,KEEP_AND_MONITOR,URL Inspection,Pagination redirect to parent is correct.
https://dreamlab.id/category/maklon-parfum/page/2/,/category/maklon-parfum/,308,1,/category/maklon-kosmetik/,MEDIUM,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P3,KEEP_AND_MONITOR,URL Inspection,Two-hop redirect but acceptable.
https://dreamlab.id/contact-form-dreamlab/,/contact-us/,308,1,/contact-us/,HIGH,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P3,KEEP_AND_MONITOR,URL Inspection,Correct redirect.
https://dreamlab.id/memunculkan-keranjang-reels/,/news-blog/,308,1,/news-blog/,LOW_NO_CONTENT,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P3,KEEP_AND_MONITOR,URL Inspection,No equivalent content exists; blog is reasonable redirect.
https://dreamlab.id/https-dreamlab-id-dreamlab-visit-ici-2026/,/,308,1,/,LOW_NO_CONTENT,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P3,KEEP_AND_MONITOR,URL Inspection,Malformed URL redirecting to homepage is acceptable.
https://dreamlab.id/jasa-maklon-sabun-mandi-batang/,/jasa-maklon-bar-soap-merek-sendiri/,308,1,/jasa-maklon-bar-soap-merek-sendiri/,HIGH,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P2,KEEP_AND_MONITOR,URL Inspection,Good redirect - same intent.
https://dreamlab.id/academy-beautypreneur/,/category/dreampreneur-beauty-academy/,308,1,/category/dreampreneur-beauty-academy/,MEDIUM,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P2,KEEP_AND_MONITOR,URL Inspection,Acceptable redirect.
https://dreamlab.id/thankyou-page/,/thankyou/google/,308,1,missing,MEDIUM,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P3,KEEP_AND_MONITOR,URL Inspection,Thank you page redirect acceptable.
https://dreamlab.id/thankyoupage-google/,/,308,1,/,LOW_NO_CONTENT,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P3,KEEP_AND_MONITOR,URL Inspection,Acceptable redirect to homepage.
https://dreamlab.id/cara-bisnis-skincare-dari-nol/,/bisnis-kosmetik-dari-nol/,308,1,/bisnis-kosmetik-dari-nol/,HIGH,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P2,KEEP_AND_MONITOR,URL Inspection,Good redirect - same content updated.
https://dreamlab.id/bahan-aktif-untuk-mengatasi-jerawat/,/bahan-aktif-skincare-jerawat/,308,1,/bahan-aktif-skincare-jerawat/,HIGH,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P2,KEEP_AND_MONITOR,URL Inspection,Good redirect - same content.
https://dreamlab.id/tips-sukses-bisnis-parfum/,/bisnis-parfum-merk-sendiri/,308,1,/bisnis-parfum-merk-sendiri/,HIGH,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P2,KEEP_AND_MONITOR,URL Inspection,Good redirect - same content.
https://dreamlab.id/produk-haircare-yang-sedang-tren/,/produk/haircare/,308,1,/produk/haircare/,HIGH,unknown,unknown,DATA_MISSING,DATA_MISSING,REDIRECT_CORRECT,P2,KEEP_AND_MONITOR,URL Inspection,Good redirect.


========================================
=== 07-canonical-decisions.csv ===
========================================

url,declared_canonical,google_canonical,content_similarity,internal_links,historical_traffic,classification,decision,priority,notes
https://www.dreamlab.id/maklon-parfum-dreamlab/,none,https://dreamlab.id/maklon-parfum-dreamlab/,IDENTICAL,SAME,unknown,WWW_DUPLICATE,LEAVE,P2,www→non-www canonical expected
https://www.dreamlab.id/category/maklon-bodycare/,none,https://dreamlab.id/category/maklon-bodycare/,IDENTICAL,SAME,1,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical; add to prevent www duplicate issues
https://www.dreamlab.id/tren-brand-kosmetik-lokal-2025/,none,https://dreamlab.id/tren-brand-kosmetik-lokal-2025/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/basic-skincare-pria-wajib/,none,https://dreamlab.id/basic-skincare-pria-wajib/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/career/,none,https://dreamlab.id/career/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/,none,https://dreamlab.id/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/8-tren-kecantikan-2026-smart-formula/,none,https://dreamlab.id/8-tren-kecantikan-2026-smart-formula/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/contact-us/,none,https://dreamlab.id/contact-us/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/hair-treatment-ampoule-maklon-haircare-dreamlab/,none,https://dreamlab.id/hair-treatment-ampoule-maklon-haircare-dreamlab/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/tips-membuat-hand-sanitizer-bisnis/,none,https://dreamlab.id/tips-membuat-hand-sanitizer-bisnis/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/category/maklon-personal-care/,none,https://dreamlab.id/category/maklon-personal-care/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/perbedaan-moisturizer-gel-vs-cream/,none,https://dreamlab.id/perbedaan-moisturizer-gel-vs-cream/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/cara-membuat-deodorant-balm-custom/,none,https://dreamlab.id/cara-membuat-deodorant-balm-custom/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/cysteamine-alternatif-hydroquinone/,none,https://dreamlab.id/cysteamine-alternatif-hydroquinone/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/category/maklon-haircare/,none,https://dreamlab.id/category/maklon-haircare/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/maklon-skincare-jawa-timur-dreamlab/,none,https://dreamlab.id/maklon-skincare-jawa-timur-dreamlab/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/trend-body-care-2025-produk-viral-tiktok-shopee-dreamlab-maklon-kosmetik/,none,https://dreamlab.id/trend-body-care-2025-produk-viral-tiktok-shopee-dreamlab-maklon-kosmetik/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/news-blog/page/5/,none,https://dreamlab.id/news-blog/page/5/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical on pagination
https://www.dreamlab.id/produk-viral-tiktok/,none,https://dreamlab.id/produk-viral-tiktok/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/jasa-maklon-parfum-moq-rendah/,none,https://dreamlab.id/jasa-maklon-parfum-moq-rendah/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/about-us/,none,https://dreamlab.id/about-us/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/our-client/,none,https://dreamlab.id/our-client/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://www.dreamlab.id/news-blog/,none,https://dreamlab.id/news-blog/,IDENTICAL,SAME,unknown,CANONICAL_MISSING,ADD_SELF_CANONICAL,P2,Missing self-canonical
https://dreamlab.id/hair-care,https://dreamlab.id/hair-care/,https://dreamlab.id/hair-care/,IDENTICAL,SAME,unknown,TRAILING_SLASH,LEAVE,P3,Non-trailing slash → trailing slash; already canonicalized
https://www.dreamlab.id/services,https://dreamlab.id/services/,UNKNOWN,UNKNOWN,SAME,unknown,TRAILING_SLASH,LEAVE,P3,Non-trailing slash → trailing slash


========================================
=== 08-noindex-decisions.csv ===
========================================

url,page_type,current_robots,historical_traffic,business_value,classification,decision,priority,notes
https://dreamlab.id/e-floating-buttons/popup-website/,utility,noindex,0,LOW,UTILITY_PAGE,KEEP_NOINDEX,P3,No business value - utility component
https://www.dreamlab.id/e-floating-buttons/popup-website/,utility,noindex,0,LOW,UTILITY_PAGE,KEEP_NOINDEX,P3,www variant
https://dreamlab.id/blog/foot-care-produk-peluang-bisnis-maklon/,blog_article,noindex,UNKNOWN,LOW,ACCIDENTAL_NOINDEX_CANDIDATE,MANUAL_REVIEW,P2,Check if this /blog/ path is intentionally noindexed
https://www.dreamlab.id/blog/foot-care-produk-peluang-bisnis-maklon,blog_article,noindex,UNKNOWN,LOW,ACCIDENTAL_NOINDEX_CANDIDATE,MANUAL_REVIEW,P2,www variant no trailing slash
https://www.dreamlab.id/blog/foot-care-produk-peluang-bisnis-maklon/,blog_article,noindex,UNKNOWN,LOW,ACCIDENTAL_NOINDEX_CANDIDATE,MANUAL_REVIEW,P2,www variant
https://dreamlab.id/blog/pabrik-maklon-kosmetik-cpkb-grade-a/,blog_article,noindex,UNKNOWN,MEDIUM,ACCIDENTAL_NOINDEX_CANDIDATE,MANUAL_REVIEW,P2,Important content on /blog/ path - may need to remove noindex
https://www.dreamlab.id/blog/pabrik-maklon-kosmetik-cpkb-grade-a,blog_article,noindex,UNKNOWN,MEDIUM,ACCIDENTAL_NOINDEX_CANDIDATE,MANUAL_REVIEW,P2,www variant
https://www.dreamlab.id/blog/pabrik-maklon-kosmetik-cpkb-grade-a/,blog_article,noindex,UNKNOWN,MEDIUM,ACCIDENTAL_NOINDEX_CANDIDATE,MANUAL_REVIEW,P2,www variant
https://www.dreamlab.id/$,utility,noindex,0,LOW,UTILITY_PAGE,KEEP_NOINDEX,P3,URL fragment - expected
https://www.dreamlab.id/$/,utility,noindex,0,LOW,UTILITY_PAGE,KEEP_NOINDEX,P3,URL fragment
https://www.dreamlab.id/&,utility,noindex,0,LOW,UTILITY_PAGE,KEEP_NOINDEX,P3,URL fragment
https://www.dreamlab.id/&/,utility,noindex,0,LOW,UTILITY_PAGE,KEEP_NOINDEX,P3,URL fragment
https://dreamlab.id/blog/maklon-hair-care-kesalahan-pemula/,blog_article,noindex,UNKNOWN,MEDIUM,ACCIDENTAL_NOINDEX_CANDIDATE,MANUAL_REVIEW,P2,/blog/ path content may need noindex removal
https://www.dreamlab.id/blog/,blog_home,noindex,UNKNOWN,LOW,DUPLICATE_OR_CONSOLIDATION,KEEP_NOINDEX,P3,/blog/ is duplicate of /news-blog/
https://www.dreamlab.id/blog/maklon-hair-care-kesalahan-pemula,blog_article,noindex,UNKNOWN,MEDIUM,ACCIDENTAL_NOINDEX_CANDIDATE,MANUAL_REVIEW,P2,www variant
https://www.dreamlab.id/blog/maklon-hair-care-kesalahan-pemula/,blog_article,noindex,UNKNOWN,MEDIUM,ACCIDENTAL_NOINDEX_CANDIDATE,MANUAL_REVIEW,P2,www variant
https://dreamlab.id/?s={search_term_string},search_result,noindex,0,LOW,UTILITY_PAGE,KEEP_NOINDEX,P3,Search result page
https://dreamlab.id/post-sitemap.xml,sitemap,noindex,0,LOW,UTILITY_PAGE,KEEP_NOINDEX,P3,Old sitemap file
https://dreamlab.id/juaranyaformula/?action=googlesitekit_auth,utility,noindex,0,LOW,UTILITY_PAGE,KEEP_NOINDEX,P3,Auth callback
https://dreamlab.id/my-account/,system_page,noindex,0,LOW,UTILITY_PAGE,KEEP_NOINDEX,P3,WooCommerce account page
https://dreamlab.id/cart/,system_page,noindex,0,LOW,UTILITY_PAGE,KEEP_NOINDEX,P3,WooCommerce cart page
https://dreamlab.id/category/dreampreneur-beauty-academy/,category,noindex,2,LOW,CATEGORY_KEEP_NOINDEX,KEEP_NOINDEX,P2,Intentionally noindexed category
https://dreamlab.id/academy-beautypreneur/,legacy,redirect+noindex,UNKNOWN,LOW,REDIRECTED_CORRECTLY,KEEP_NOINDEX,P3,Redirects to noindexed category


========================================
=== 09-404-decisions.csv ===
========================================

url,http_status,historical_clicks,historical_impressions,backlinks,internal_links,old_content_topic,new_equivalent,business_relevance,decision,priority,notes
https://dreamlab.id/category/event/,404,0,0,DATA_MISSING,DATA_MISSING,Event category archive,none,LOW,LEAVE_404,P3,No historical traffic, no business value
https://dreamlab.id/dreampreneur-beauty-academy-surabaya-2026/,404,0,0,DATA_MISSING,DATA_MISSING,Academy event page,none,LOW,RETURN_410,P3,No traffic, return 410 for clarity
https://dreamlab.id/maklon-bodycare-ads/,404,0,0,DATA_MISSING,DATA_MISSING,Ads landing page,/body-care/,LOW,LEAVE_404,P3,Ads page without traffic
https://dreamlab.id/maklon-kosmetik-terbaik-bahasa/,404,0,0,DATA_MISSING,DATA_MISSING,Duplicate language version,/perusahaan-maklon-kosmetik/,LOW,301_TO_CLOSE_EQUIVALENT,P2,Redirect to /perusahaan-maklon-kosmetik/
https://dreamlab.id/maklon-kosmetik-terbaik-english/,308→200 (homepage),0,0,DATA_MISSING,DATA_MISSING,English version,/,LOW,REDIRECT_DESTINATION_REVIEW,P2,Already redirects to homepage; consider redirecting to relevant EN content if exists
https://dreamlab.id/shop/,308→200 (/produk/),0,0,DATA_MISSING,DATA_MISSING,Shop page,/produk/,LOW,REDIRECT_CORRECT,P3,Already redirects to /produk/ which works


========================================
=== 10-money-page-scorecard.csv ===
========================================

url,page_type,http_status,indexable,self_canonical,in_sitemap,indexed_status,historical_impressions_7d,current_impressions_7d,position,title_ok,h1_ok,schema,internal_inlinks,technical_health,search_visibility,business_intent,internal_authority,conversion_readiness,overall_priority,classification,recommended_action
https://dreamlab.id/,homepage,200,TRUE,TRUE,TRUE,indexed,676,590,10.9,TRUE,TRUE,NO,58,100,75,100,80,50,80,HEALTHY,NO_ACTION
https://dreamlab.id/services/,service,200,TRUE,TRUE,TRUE,indexed,98,70,10.9,TRUE,TRUE,NO,44,100,60,100,70,60,75,RANKING_PROBLEM,ADD_INTERNAL_LINKS
https://dreamlab.id/parfum/,service,200,TRUE,TRUE,TRUE,indexed,33,8,25.1,TRUE,TRUE,NO,41,90,30,100,70,50,60,RANKING_PROBLEM,FIX_INDEXABILITY
https://dreamlab.id/skincare-face-care/,service,200,TRUE,TRUE,TRUE,indexed,2,0,0,TRUE,TRUE,NO,41,90,20,100,70,50,55,RANKING_PROBLEM,ADD_INTERNAL_LINKS
https://dreamlab.id/body-care/,service,200,TRUE,TRUE,TRUE,indexed,12,9,43.9,TRUE,TRUE,NO,41,90,15,100,70,50,55,RANKING_PROBLEM,ADD_INTERNAL_LINKS
https://dreamlab.id/hair-care/,service,200,TRUE,TRUE,TRUE,indexed,2,0,0,TRUE,TRUE,NO,41,90,15,100,70,50,55,RANKING_PROBLEM,ADD_INTERNAL_LINKS
https://dreamlab.id/baby-care/,service,200,TRUE,TRUE,TRUE,indexed,12,9,43.9,TRUE,TRUE,NO,41,90,15,100,70,50,55,RANKING_PROBLEM,ADD_INTERNAL_LINKS
https://dreamlab.id/about-us/,about,200,TRUE,TRUE,TRUE,indexed,12,29,14.6,TRUE,TRUE,NO,45,100,40,70,60,50,60,HEALTHY,NO_ACTION
https://dreamlab.id/about-us/alur-maklon/,service,200,TRUE,TRUE,TRUE,indexed,3,2,34.5,TRUE,TRUE,NO,42,100,25,100,60,50,55,RANKING_PROBLEM,ADD_INTERNAL_LINKS
https://dreamlab.id/contact-us/,contact,200,TRUE,TRUE,TRUE,indexed,229,222,8.1,TRUE,TRUE,NO,45,100,70,100,70,80,80,HEALTHY,NO_ACTION
https://dreamlab.id/produk/skincare/,product_category,200,TRUE,TRUE,TRUE,indexed,27,13,22.8,TRUE,TRUE,NO,51,90,30,90,60,50,60,INDEXING_PROBLEM,FIX_CANONICAL
https://dreamlab.id/produk/parfum/,product_category,200,TRUE,TRUE,TRUE,indexed,126,96,14.2,TRUE,TRUE,NO,50,90,50,90,70,60,70,HEALTHY,NO_ACTION
https://dreamlab.id/produk/bodycare/,product_category,200,TRUE,TRUE,TRUE,indexed,19,13,15.1,TRUE,TRUE,NO,42,90,30,90,60,40,55,INDEXING_PROBLEM,FIX_CANONICAL
https://dreamlab.id/produk/haircare/,product_category,200,TRUE,TRUE,TRUE,indexed,7,8,51.4,TRUE,TRUE,NO,42,90,15,90,50,30,45,RANKING_PROBLEM,ADD_INTERNAL_LINKS
https://dreamlab.id/produk/babycare/,product_category,200,TRUE,TRUE,TRUE,indexed,37,47,14.1,TRUE,TRUE,NO,18,90,45,90,60,40,60,HEALTHY,NO_ACTION
https://dreamlab.id/produk/decorative/,product_category,200,TRUE,TRUE,TRUE,indexed,6,8,23.4,TRUE,TRUE,NO,14,90,15,80,40,30,40,RANKING_PROBLEM,ADD_INTERNAL_LINKS
https://dreamlab.id/produk/footcare/,product_category,200,TRUE,TRUE,TRUE,indexed,2,5,59.8,TRUE,TRUE,NO,14,90,10,70,30,20,35,RANKING_PROBLEM,ADD_INTERNAL_LINKS
https://dreamlab.id/produk/pkrt/,product_category,200,TRUE,TRUE,TRUE,indexed,7,11,11.5,TRUE,TRUE,NO,10,90,25,70,30,30,40,HEALTHY,NO_ACTION
https://dreamlab.id/panduan/,guide,200,TRUE,TRUE,TRUE,indexed,0,3,34.3,TRUE,TRUE,NO,45,100,15,80,50,30,45,RANKING_PROBLEM,ADD_INTERNAL_LINKS
https://dreamlab.id/news-blog/,blog,200,TRUE,TRUE,TRUE,indexed,19,11,13.8,TRUE,TRUE,NO,83,100,25,50,80,40,55,HEALTHY,NO_ACTION
https://dreamlab.id/pabrik-parfum-jakarta/,location_service,200,TRUE,TRUE,TRUE,indexed,49,34,22.2,TRUE,TRUE,NO,62,90,30,100,50,60,60,RANKING_PROBLEM,ADD_INTERNAL_LINKS
https://dreamlab.id/perusahaan-maklon-kosmetik/,service,200,TRUE,TRUE,TRUE,indexed,21,26,15.0,TRUE,TRUE,NO,67,90,40,100,70,60,70,HEALTHY,NO_ACTION
https://dreamlab.id/our-client/,social_proof,200,TRUE,TRUE,TRUE,indexed,21,15,9.3,TRUE,TRUE,NO,42,100,40,70,60,60,60,HEALTHY,NO_ACTION
https://dreamlab.id/career/,career,200,TRUE,TRUE,TRUE,indexed,42,46,9.8,TRUE,TRUE,NO,43,100,50,30,40,30,45,HEALTHY,NO_ACTION
https://dreamlab.id/contact-medsos/,contact,200,TRUE,TRUE,TRUE,indexed,1,0,0,TRUE,TRUE,NO,48,100,10,70,50,40,45,HEALTHY,NO_ACTION


========================================
=== 11-article-decisions.csv ===
========================================

url,title_slug,historical_clicks,historical_impressions,current_clicks,current_impressions,position,business_relevance,b2b_b2c,leads,backlinks,content_overlap,indexing_status,decision,priority,notes
https://dreamlab.id/cara-meracik-handbody-pemutih-alami/,cara-meracik-handbody-pemutih-alami,14,4477,8,2051,7.7,LOW,B2C,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,"High impressions but B2C; ensure commercial path to /body-care/"
https://dreamlab.id/perbedaan-moisturizer-gel-vs-cream/,perbedaan-moisturizer-gel-vs-cream,1,838,1,358,7.4,LOW,B2C,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,B2C article with moderate authority
https://dreamlab.id/parfum-inspired-peluang-bisnis/,parfum-inspired-peluang-bisnis,1,329,0,140,7.6,MEDIUM,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,"B2B potential; ensure link to /parfum/ service page"
https://dreamlab.id/cysteamine-alternatif-hydroquinone/,cysteamine-alternatif-hydroquinone,2,219,0,92,8.8,LOW,B2C,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,B2C informational
https://dreamlab.id/manfaat-hair-tonic-ginseng-rambut/,manfaat-hair-tonic-ginseng-rambut,1,230,0,98,10.5,LOW,B2C,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,B2C declining
https://dreamlab.id/pabrik-parfum-malang-dreamlab/,pabrik-parfum-malang-dreamlab,2,87,1,28,11.7,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,UPDATE_FOR_B2B,P1,"B2B location page declining; update content and add internal links"
https://dreamlab.id/pabrik-maklon-kosmetik-surabaya-terlengkap/,pabrik-maklon-kosmetik-surabaya-terlengkap,16,452,10,211,8.3,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P1,"High-value B2B page; clicks increased 6→10 despite lower impressions"
https://dreamlab.id/cara-buat-parfum-sendiri-dengan-maklon/,cara-buat-parfum-sendiri-dengan-maklon,0,162,0,66,9.6,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P1,"Good B2B intent; needs link to /parfum/"
https://dreamlab.id/cara-membuat-lulur-ampas-kopi/,cara-membuat-lulur-ampas-kopi,0,88,0,29,8.6,LOW,B2C,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,B2C informational
https://dreamlab.id/industri-kosmetik-indonesia-terus-tumbuh/,industri-kosmetik-indonesia-terus-tumbuh,7,116,3,44,9.8,MEDIUM,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,Industry authority article
https://dreamlab.id/lulur-vs-hb-dosting/,lulur-vs-hb-dosting,1,691,1,346,5.4,LOW,B2C,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,Good engagement; B2C but authority builder
https://dreamlab.id/cara-hitunghpp-produk-kosmeti/,cara-hitunghpp-produk-kosmeti,2,284,1,156,5.2,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P1,"High-value B2B commercial article; good position"
https://dreamlab.id/jasa-maklon-parfum-moq-rendah/,jasa-maklon-parfum-moq-rendah,4,81,1,50,7.2,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P1,B2B money page
https://dreamlab.id/urutan-pabrik-skincare-terbaik-indonesia/,urutan-pabrik-skincare-terbaik-indonesia,26,1340,18,690,7.6,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P0,"Top performing B2B page; growing impressions 650→690"
https://dreamlab.id/jenis-alkohol-dalam-parfum/,jenis-alkohol-dalam-parfum,6,820,3,481,8.1,MEDIUM,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,Informational with B2B angle
https://dreamlab.id/contoh-kalimat-iklan-kosmetik-unik/,contoh-kalimat-iklan-kosmetik-unik,2,477,0,291,8.0,MEDIUM,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,B2B marketing article
https://dreamlab.id/tren-cleanical-beauty-produk-skincare-paling-dicari-tahun-2026/,tren-cleanical-beauty,3,286,2,156,6.0,MEDIUM,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,Fresh article with growth
https://dreamlab.id/panduan-maklon-deodorant-bpom/,panduan-maklon-deodorant-bpom,4,92,4,50,6.6,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P1,B2B money page growing
https://dreamlab.id/parfum-pheromone-bisnis-parfum/,parfum-pheromone-bisnis-parfum,1,177,1,122,7.3,MEDIUM,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,B2B growth article
https://dreamlab.id/affiliate-kol-brand-skincare/,affiliate-kol-brand-skincare,0,115,0,70,9.1,MEDIUM,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,B2B growing article
https://dreamlab.id/ide-bisnis-kosmetik-2026/,ide-bisnis-kosmetik-2026,1,63,0,33,10.2,HIGH,B2B,DATA_MISSING,DATA_MISSING,/ide-bisnis-kosmetik/,INDEXED,MERGE,P2,"Merge with /ide-bisnis-kosmetik/ or 301 redirect"
https://dreamlab.id/perbedaan-edp-edt/,perbedaan-edp-edt,0,157,0,81,13.1,MEDIUM,B2C,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,B2C informational
https://dreamlab.id/cara-membuat-deodorant-balm-custom/,cara-membuat-deodorant-balm-custom,0,6,0,1,7.0,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P1,B2B but very low traffic
https://dreamlab.id/parfum-arab-ide-bisnis-2026/,parfum-arab-ide-bisnis-2026,2,17,0,7,5.4,MEDIUM,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,B2B potential
https://dreamlab.id/maklon-kosmetik-tangerang-terpercaya/,maklon-kosmetik-tangerang-terpercaya,2,80,0,38,12.2,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P1,B2B location page
https://dreamlab.id/jasa-maklon-kosmetik-bandung/,jasa-maklon-kosmetik-bandung,0,88,0,47,10.1,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P1,B2B location page
https://dreamlab.id/jasa-maklon-lipstik-bpom-terpercaya/,jasa-maklon-lipstik-bpom-terpercaya,3,99,3,37,6.8,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P1,B2B money page
https://dreamlab.id/cara-membuka-offline-store-kosmetik-2026/,cara-membuka-offline-store-kosmetik-2026,2,121,1,63,7.1,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P1,B2B commercial
https://dreamlab.id/tren-sunscreen-2025-6-produk-yang-siap-jadi-bisnis/,tren-sunscreen-2025,1,16,0,10,4.7,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,UPDATE_CONTENT,P2,Outdated 2025 date; B2B potential
https://dreamlab.id/biaya-maklon-parfum-moq-kecil/,biaya-maklon-parfum-moq-kecil,3,160,2,84,7.4,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P1,B2B money page growing
https://dreamlab.id/peluang-bisnis-skincare-irt/,peluang-bisnis-skincare-irt,2,69,3,43,8.4,MEDIUM,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP,P2,B2B targeting IRT segment
https://dreamlab.id/maklon-skincare-nad-plus-anti-aging/,maklon-skincare-nad-plus,0,36,0,18,7.9,HIGH,B2B,DATA_MISSING,DATA_MISSING,NONE,INDEXED,KEEP_AND_IMPROVE,P1,B2B niche


========================================
=== 12-internal-link-actions.csv ===
========================================

source_url,target_url,current_anchor,recommended_anchor,reason,priority
https://dreamlab.id/parfum/,https://dreamlab.id/parfum-inspired-peluang-bisnis/,NONE,Bisnis Parfum Inspired,"Add contextual link from service page to supporting article about parfum inspired business opportunity",P1
https://dreamlab.id/parfum/,https://dreamlab.id/jasa-maklon-parfum-moq-rendah/,NONE,Maklon Parfum MOQ Rendah,"Add link to MOQ article from service page",P1
https://dreamlab.id/parfum/,https://dreamlab.id/cara-buat-parfum-sendiri-dengan-maklon/,NONE,Cara Buat Parfum Sendiri,"Add link to how-to article from parfum service page",P1
https://dreamlab.id/skincare-face-care/,https://dreamlab.id/cara-hitunghpp-produk-kosmeti/,NONE,Cara Hitung HPP Kosmetik,"Add B2B commercial link from skincare page to HPP article",P1
https://dreamlab.id/skincare-face-care/,https://dreamlab.id/urutan-pabrik-skincare-terbaik-indonesia/,NONE,Urutan Pabrik Skincare Terbaik,"Add authority link from skincare page",P1
https://dreamlab.id/body-care/,https://dreamlab.id/cara-meracik-handbody-pemutih-alami/,NONE,Handbody Racikan Sendiri,"Add link from body care service to high-traffic article",P2
https://dreamlab.id/body-care/,https://dreamlab.id/maklon-body-whitening-formula-juara/,NONE,Maklon Body Whitening,"Add commercial link from body care service page",P1
https://dreamlab.id/services/,https://dreamlab.id/panduan/,NONE,Panduan Maklon,"Add link to guide section from services overview",P1
https://dreamlab.id/services/,https://dreamlab.id/estimasi-biaya-maklon-kosmetik/,NONE,Estimasi Biaya Maklon,"Add conversion link from services page",P1
https://dreamlab.id/hair-care/,https://dreamlab.id/manfaat-hair-tonic-ginseng-rambut/,NONE,Manfaat Hair Tonic Ginseng,"Add link from hair care service to hair tonic article",P2
https://dreamlab.id/hair-care/,https://dreamlab.id/pabrik-shampoo-merek-sendiri/,NONE,Pabrik Shampoo Merek Sendiri,"Add commercial link from hair care to shampoo page",P1
https://dreamlab.id/baby-care/,https://dreamlab.id/produk/babycare/,NONE,Produk Baby Care,"Add link from baby care service to product category",P2
https://dreamlab.id/about-us/alur-maklon/,https://dreamlab.id/contact-us/,NONE,Konsultasi Sekarang,"Add CTA link from production flow page to contact",P1
https://dreamlab.id/news-blog/,https://dreamlab.id/pabrik-maklon-kosmetik-surabaya-terlengkap/,NONE,Pabrik Maklon Surabaya,"Add link from blog hub to top B2B page",P1
https://dreamlab.id/news-blog/,https://dreamlab.id/urutan-pabrik-skincare-terbaik-indonesia/,NONE,Urutan Pabrik Skincare Terbaik,"Add link from blog hub to top performing article",P1
https://dreamlab.id/panduan/,https://dreamlab.id/contact-us/,NONE,Konsultasi Gratis,"Add CTA from guide to contact page",P1
https://dreamlab.id/produk/parfum/,https://dreamlab.id/maklon-parfum-dreamlab/,NONE,Maklon Parfum Dreamlab,"Add cross-link from product category to maklon service page",P1
https://dreamlab.id/produk/skincare/,https://dreamlab.id/perusahaan-maklon-kosmetik/,NONE,Perusahaan Maklon Kosmetik,"Add authority link from skincare products to company page",P1
https://dreamlab.id/category/maklon-kosmetik/,https://dreamlab.id/maklon-kosmetik-tangerang-terpercaya/,NONE,Maklon Kosmetik Tangerang,"Add location page link from category hub",P2
https://dreamlab.id/category/maklon-kosmetik/,https://dreamlab.id/jasa-maklon-kosmetik-bandung/,NONE,Maklon Kosmetik Bandung,"Add location page link from category hub",P2
https://dreamlab.id/pabrik-parfum-jakarta/,https://dreamlab.id/parfum/,NONE,Jasa Maklon Parfum,"Add link from location page to main service page",P1
https://dreamlab.id/perusahaan-maklon-kosmetik/,https://dreamlab.id/services/,NONE,Layanan Maklon Lengkap,"Add link from company page to services",P1
https://dreamlab.id/contact-medsos/,https://dreamlab.id/contact-us/,NONE,Hubungi Kami,"Add link from social contact to main contact",P2


========================================
=== 15-final-url-action-matrix.csv ===
========================================

url,page_type,business_intent,gsc_status,historical_clicks,historical_impressions,current_clicks,current_impressions,http_status,redirect_destination,canonical,in_sitemap,internal_inlinks,root_cause,primary_action,secondary_action,priority,confidence,validation_method,expected_result,notes
https://dreamlab.id/,homepage,commercial,indexed,47,676,36,590,200,,self,YES,58,demand,mix,NO_ACTION,KEEP_MONITOR,P2,Medium,GSC performance,Stabilize impressions,"Homepage stable; no action needed"
https://dreamlab.id/services/,service,commercial,indexed,2,98,1,70,200,,self,YES,44,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P1,High,GSC performance + crawl,Improve position and impressions,Add links from more pages
https://dreamlab.id/parfum/,service,commercial,indexed,2,33,0,8,200,,self,YES,41,ranking,FIX_INDEXABILITY,ADD_INTERNAL_LINKS,P0,High,URL Inspection + performance,Restore indexing and ranking,Position dropped 17.9→25.1; critical fix
https://dreamlab.id/skincare-face-care/,service,commercial,indexed,0,2,0,0,200,,self,YES,41,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P1,Medium,GSC performance,Improve visibility,Very low impressions despite being key page
https://dreamlab.id/body-care/,service,commercial,indexed,0,12,1,9,200,,self,YES,41,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P1,Medium,GSC performance,Improve visibility,Low impressions for key service
https://dreamlab.id/hair-care/,service,commercial,indexed,0,2,0,0,200,,self,YES,41,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P1,Medium,GSC performance,Improve visibility,Very low impressions
https://dreamlab.id/baby-care/,service,commercial,indexed,0,12,1,9,200,,self,YES,41,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P1,Medium,GSC performance,Improve visibility,Low impressions
https://dreamlab.id/foot-care/,service,commercial,indexed,0,0,0,0,200,,self,YES,41,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P2,Low,GSC performance,Improve visibility,Niche service page
https://dreamlab.id/about-us/,about,informational,indexed,0,12,0,29,200,,self,YES,45,healthy,NO_ACTION,KEEP_MONITOR,P3,High,GSC performance,Stable,Healthy page
https://dreamlab.id/about-us/alur-maklon/,service,commercial,indexed,0,3,1,2,200,,self,YES,42,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P1,Medium,GSC performance,Improve position,Important process page
https://dreamlab.id/contact-us/,contact,commercial,indexed,4,229,4,222,200,,self,YES,45,healthy,NO_ACTION,KEEP_MONITOR,P3,High,GSC performance,Stable,Healthy page
https://dreamlab.id/contact-medsos/,contact,commercial,indexed,0,1,0,0,200,,self,YES,48,healthy,NO_ACTION,KEEP_MONITOR,P3,High,GSC performance,Stable,Healthy page
https://dreamlab.id/our-client/,social_proof,commercial,indexed,0,21,0,15,200,,self,YES,42,healthy,NO_ACTION,KEEP_MONITOR,P3,High,GSC performance,Stable,Healthy page
https://dreamlab.id/career/,career,informational,indexed,1,42,4,46,200,,self,YES,43,healthy,NO_ACTION,KEEP_MONITOR,P3,High,GSC performance,Stable,Healthy page
https://dreamlab.id/terms-of-service/,legal,informational,indexed,0,10,0,3,200,,self,YES,42,healthy,NO_ACTION,KEEP_MONITOR,P3,High,GSC performance,Stable,Legal page
https://dreamlab.id/privacy-policy/,legal,informational,indexed,0,11,0,3,200,,self,YES,43,healthy,NO_ACTION,KEEP_MONITOR,P3,High,GSC performance,Stable,Legal page
https://dreamlab.id/news-blog/,blog_hub,informational,indexed,0,19,0,11,200,,self,YES,83,healthy,NO_ACTION,KEEP_MONITOR,P3,High,GSC performance,Stable,Healthy page
https://dreamlab.id/panduan/,guide,commercial,indexed,0,0,0,3,200,,self,YES,45,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P2,Medium,GSC performance,Improve visibility,New guide section needs links
https://dreamlab.id/produk/skincare/,product_category,commercial,indexed,0,27,0,13,200,,self,YES,51,canonical,FIX_CANONICAL,ADD_INTERNAL_LINKS,P1,High,URL Inspection,Secure canonical,Check Google-selected canonical
https://dreamlab.id/produk/parfum/,product_category,commercial,indexed,1,126,2,96,200,,self,YES,50,healthy,NO_ACTION,KEEP_MONITOR,P2,High,GSC performance,Stable,Good performance
https://dreamlab.id/produk/bodycare/,product_category,commercial,indexed,0,19,0,13,200,,self,YES,42,canonical,FIX_CANONICAL,ADD_INTERNAL_LINKS,P1,High,URL Inspection,Secure canonical,Check Google-selected canonical
https://dreamlab.id/produk/haircare/,product_category,commercial,indexed,0,7,0,8,200,,self,YES,42,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P2,Medium,GSC performance,Improve visibility,Low impressions
https://dreamlab.id/produk/babycare/,product_category,commercial,indexed,0,37,3,47,200,,self,YES,18,healthy,NO_ACTION,KEEP_MONITOR,P2,High,GSC performance,Stable,Growing impressions
https://dreamlab.id/produk/decorative/,product_category,commercial,indexed,0,6,0,8,200,,self,YES,14,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P2,Medium,GSC performance,Improve visibility,Low impressions
https://dreamlab.id/produk/footcare/,product_category,commercial,indexed,0,2,0,5,200,,self,YES,14,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P2,Medium,GSC performance,Improve visibility,Low impressions
https://dreamlab.id/produk/pkrt/,product_category,commercial,indexed,0,7,0,11,200,,self,YES,10,healthy,NO_ACTION,KEEP_MONITOR,P3,High,GSC performance,Stable,Niche product category
https://dreamlab.id/category/maklon-kosmetik/,category,commercial,indexed,0,0,0,0,200,,self,YES,307,healthy,NO_ACTION,KEEP_MONITOR,P3,High,GSC performance,Stable,Category hub
https://dreamlab.id/category/panduan-bisnis-kosmetik/,category,commercial,indexed,0,0,0,0,200,,self,YES,322,healthy,NO_ACTION,KEEP_MONITOR,P3,High,GSC performance,Stable,Category hub
https://dreamlab.id/category/dreamlabpedia/,category,informational,indexed,0,1,0,0,200,,self,YES,47,healthy,NO_ACTION,KEEP_MONITOR,P3,High,GSC performance,Stable,Category hub
https://dreamlab.id/maklon-parfum/,legacy_service,commercial,redirect,unknown,unknown,unknown,unknown,308,/google-ads/maklon-parfum/,missing,NO,unknown,redirect_wrong_destination,FIX_REDIRECT,REQUEST_INDEXING,P0,High,URL Inspection after change,Restore organic equity,"Redirect to /parfum/ or restore page; CRITICAL"
https://dreamlab.id/maklon-face-mist/,legacy_article,commercial,redirect,unknown,unknown,unknown,unknown,308,/produk/skincare/,/produk/skincare/,NO,unknown,redirect_wrong_destination,FIX_REDIRECT,REQUEST_INDEXING,P0,High,URL Inspection after change,Restore specific page intent,"Redirect to dedicated face mist page or /produk/skincare/facial-toner/"
https://dreamlab.id/pabrik-parfum-surabaya/,legacy_article,commercial,redirect,unknown,unknown,unknown,unknown,308,/produk/parfum/,/produk/parfum/,NO,unknown,redirect_wrong_destination,FIX_REDIRECT,REQUEST_INDEXING,P0,High,URL Inspection after change,Restore location-specific equity,Redirect loses location intent
https://dreamlab.id/maklon-kosmetik-jakarta-dreamlab-2026/,legacy_article,commercial,redirect,unknown,unknown,unknown,unknown,308,/maklon-jakarta-terbaik/,/maklon-jakarta-terbaik/,NO,unknown,redirect_acceptable,KEEP_AND_MONITOR,URL Inspection,P1,Medium,URL Inspection + performance,Verify intent match,Acceptable if destination matches intent
https://dreamlab.id/maklon-kosmetik-parfum-tangerang/,legacy_article,commercial,redirect,unknown,unknown,unknown,unknown,308,/maklon-kosmetik-tangerang-terpercaya/,/maklon-kosmetik-tangerang-terpercaya/,NO,unknown,redirect_acceptable,KEEP_AND_MONITOR,URL Inspection,P1,Medium,URL Inspection + performance,Verify intent match,Good redirect
https://dreamlab.id/maklon-moisturizer-bpom-dreamlab/,legacy_article,commercial,redirect,unknown,unknown,unknown,unknown,308,/produk/skincare/,/produk/skincare/,NO,unknown,redirect_wrong_destination,FIX_REDIRECT,REQUEST_INDEXING,P1,High,URL Inspection after change,Restore specific page equity,Redirect too generic
https://dreamlab.id/pabrik-parfum-jakarta/,location_service,commercial,indexed,0,49,1,34,200,,self,YES,62,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P1,Medium,GSC performance,Improve position,Good page needs more links
https://dreamlab.id/perusahaan-maklon-kosmetik/,service,commercial,indexed,0,21,0,26,200,,self,YES,67,healthy,NO_ACTION,KEEP_MONITOR,P2,High,GSC performance,Stable,Good page
https://dreamlab.id/pabrik-shampoo-merek-sendiri/,service,commercial,indexed,0,18,1,29,200,,self,YES,64,healthy,NO_ACTION,KEEP_MONITOR,P2,High,GSC performance,Stable,Growing
https://dreamlab.id/pabrik-maklon-kosmetik-sidoarjo-dreamlab/,service,commercial,indexed,0,42,3,35,200,,self,YES,64,healthy,NO_ACTION,KEEP_MONITOR,P2,High,GSC performance,Stable,Good page
https://dreamlab.id/maklon-kosmetik-tangerang-terpercaya/,service,commercial,indexed,2,42,0,38,200,,self,YES,72,ranking,ADD_INTERNAL_LINKS,KEEP_MONITOR,P1,Medium,GSC performance,Improve position,Slight decline
https://dreamlab.id/jasa-maklon-kosmetik-bandung/,service,commercial,indexed,0,41,0,47,200,,self,YES,66,healthy,NO_ACTION,KEEP_MONITOR,P2,High,GSC performance,Stable,Growing
https://dreamlab.id/jasa-maklon-lipstik-bpom-terpercaya/,service,commercial,indexed,0,48,3,37,200,,self,YES,68,healthy,NO_ACTION,KEEP_MONITOR,P2,High,GSC performance,Stable,Good page
https://dreamlab.id/panduan-maklon-deodorant-bpom/,service,commercial,indexed,0,42,4,50,200,,self,YES,74,healthy,NO_ACTION,KEEP_MONITOR,P2,High,GSC performance,Stable,Growing
https://dreamlab.id/pabrik-parfum/,service,commercial,indexed,0,0,0,9,200,,self,YES,0,ranking,ADD_INTERNAL_LINKS,REQUEST_INDEXING,P1,High,URL Inspection + GSC,Get indexed and ranking,New page not yet indexed
https://dreamlab.id/pabrik-kosmetik/,service,commercial,indexed,0,0,0,12,200,,self,YES,0,ranking,ADD_INTERNAL_LINKS,REQUEST_INDEXING,P1,High,URL Inspection + GSC,Get indexed and ranking,New page not yet indexed
https://dreamlab.id/jasa-maklon-kosmetik/,service,commercial,indexed,0,0,0,9,200,,self,YES,0,ranking,ADD_INTERNAL_LINKS,REQUEST_INDEXING,P1,High,URL Inspection + GSC,Get indexed and ranking,New page not yet indexed
https://dreamlab.id/private-label-kosmetik/,service,commercial,indexed,0,0,0,16,200,,self,YES,0,ranking,ADD_INTERNAL_LINKS,REQUEST_INDEXING,P1,High,URL Inspection + GSC,Get indexed and ranking,New page not yet indexed
https://dreamlab.id/estimasi-biaya-maklon-kosmetik/,service,commercial,indexed,0,0,0,21,200,,self,YES,0,ranking,ADD_INTERNAL_LINKS,REQUEST_INDEXING,P1,High,URL Inspection + GSC,Get indexed and ranking,New page growing fast
https://dreamlab.id/moq-maklon-kosmetik/,service,commercial,indexed,0,0,0,0,200,,self,YES,0,indexing,ADD_INTERNAL_LINKS,REQUEST_INDEXING,P1,High,URL Inspection,Get indexed,New page not yet in performance
https://dreamlab.id/biaya-maklon-skincare/,service,commercial,indexed,0,6,0,7,200,,self,YES,0,healthy,NO_ACTION,KEEP_MONITOR,P2,Medium,GSC performance,Stable,Low traffic but indexed
https://dreamlab.id/category/dreampreneur-beauty-academy/,category,informational,noindex,0,0,0,2,200,,self,YES,46,expected_noindex,KEEP_NOINDEX,REMOVE_FROM_SITEMAP,P2,High,URL Inspection,Keep current behavior,Intentionally noindexed
https://dreamlab.id/category/event/,category,none,404,0,0,0,0,404,,none,NO,0,expected_404,LEAVE_404,REMOVE_FROM_SITEMAP,P3,High,GSC issue count decay,No action needed,No traffic
https://dreamlab.id/dreampreneur-beauty-academy-surabaya-2026/,legacy,none,404,0,0,0,0,404,,none,NO,0,expected_404,RETURN_410,REMOVE_FROM_SITEMAP,P3,High,GSC issue count decay,No action needed,No traffic
https://dreamlab.id/author/admin/,author,informational,indexed,0,0,0,0,200,,self,YES,42,expected_indexed,KEEP_NOACTION,REMOVE_FROM_SITEMAP,P3,Medium,URL Inspection,Keep current,Author page
https://dreamlab.id/maklon-bodymist/,article,commercial,indexed,0,4,1,6,200,,self,YES,66,healthy,KEEP_AND_IMPROVE,ADD_INTERNAL_LINKS,P2,High,GSC performance,Stable,Good article


========================================
=== END OF DOCUMENT ===
========================================
