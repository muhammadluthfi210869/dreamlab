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
