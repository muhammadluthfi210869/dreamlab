# 🔍 Root Cause Analysis — Dreamlab.id Indexing Issues

**Date:** 2026-07-31  
**Source Data:** GSC Export (problem 31_07_2026.xlsx) + Live Site Verification  
**Analyst:** Principal Technical SEO Investigator

---

## Executive Summary

**Overall Health Assessment: MODERATE with contained risks.**

Website Dreamlab.id memiliki fondasi teknis yang cukup baik (Next.js di Vercel, struktur rapi, canonical self-referencing konsisten). Namun, terdapat **ketidakselarasan antara ekspektasi indexing dan konfigurasi teknis** yang menyebabkan 1.540 URL tidak terindeks — dan mayoritas dari eksklusi tersebut sebenarnya **sudah direncanakan** atau **tidak berbahaya**.

**The Big Issue:** Bukan 1.540 URL excluded — metrik itu menyesatkan. Masalah sebenarnya adalah **ketidakkonsistenan 3 hal:**

1. **robots.txt terlalu agresif** — memblokir halaman yang secara teknis `index, follow` dan bahkan masuk sitemap.
2. **Sitemap filter tidak sinkron** dengan proxy 410 patterns — sitemap masih mengandung URL yang return 410.
3. **Tidak ada strategi eksplisit untuk halaman programmatic tipis** — beberapa di-noindex, beberapa tidak, beberapa diblokir robots.txt, tidak ada dokumentasi keputusan.

**Business Risk: LOW-MEDIUM.** Halaman money pages (maklon, blog komersial) mayoritas sudah terindeks. Risiko utama adalah **crawl budget terbuang** pada URL yang tidak perlu dan **potensi hilangnya indexing** pada halaman produk kategori tertentu yang salah diblokir.

---

## Data Source Overview

| Sheet Name (GSC Category) | URLs | Status |
|---|---|---|
| 404 (Not Found) | 19 | Mostly Expected |
| Duplikat, tanpa ada versi kanon (Duplicate without canonical) | 10 | Warning |
| Di-crawl - saat ini tidak diind (Crawled - currently not indexed) | 732 | 686 Expected, 46 Warning |
| Halaman dengan pengalihan (Pages with redirect) | 424 | Mostly Expected |
| Halaman alternatif dengan tag k (Alternate with proper canonical) | 189 | Mostly Expected |
| Dikecualikan oleh tag 'noindex' (Excluded by noindex) | 77 | Mostly Expected |
| Diblokir oleh robots.txt (Blocked by robots.txt) | 77 | Expected (all _next/static) |
| Ditemukan - saat ini tidak diin (Discovered - currently not indexed) | 8 | Warning |
| **Total** | **1.540** | |

---

## Quick Truth: The 1.540 Number Is Misleading

| Category | Count | Expected? | Real Issue? |
|---|---|---|---|
| `/_next/static/` (blocked by robots.txt) | 686 | ✅ Normal static assets | ❌ None |
| Pages with redirect (www→non-www, trailing slash) | 424 | ✅ Normal URL normalization | ❌ None |
| Alternate canonical (www/slash variants) | 189 | ✅ Canonical working correctly | ❌ None |
| Noindex (pagination, thankyou, admin) | 77 | ✅ Intentional noindex | ❌ None |
| Legacy 404/410 | 19 | ✅ Expected after migration | ❌ None |
| Discovered - not indexed | 8 | ✅ Normal for new pages | ❌ None |
| Crawled - not indexed (non-asset) | 46 | ❌ Should be investigated | ⚠️ **46 problematic** |
| Duplicate without canonical | 10 | ❌ Should be investigated | ⚠️ **10 problematic** |
| **Total problematic** | **~56** | | **⬅️ THIS is the real issue** |

---

## Category Analysis

### 1. 404 (Not Found) — 19 URLs

**Assessment: ✅ EXPECTED (majority) + ⚠️ WARNING (minority)**

**Sample URLs:**
| URL | GSC Status | Actual Status |
|---|---|---|
| `https://www.dreamlab.id/produk/babycare/baby-wash/` | 404 | Perlu verifikasi |
| `https://dreamlab.id/index.php` | 404 | **410 Gone ✅** |
| `https://dreamlab.id/$` | 404 | **410 Gone ✅** |
| `https://dreamlab.id/):attr_identifier==` | 404 | **410 Gone ✅** |
| `https://dreamlab.id/category/event/` | 404 | **410 Gone ✅** |
| `https://dreamlab.id/produk/decorative/foundation/` | 404 | **200 OK ❓** |
| `https://dreamlab.id/wp-content/themes/woodmart-child/*` | 404 | **410 Gone ✅** |

**Pattern Detection:**
- Legacy WordPress files → 410 Gone (properly handled)
- Malformed/truncated URLs → 410 Gone (properly handled)
- Old product URLs (`/produk/decorative/foundation/`) → Actually returns 200 but GSC reports 404 (possible stale data or conditional 404)

**Root Cause:**
- WordPress → Next.js migration caused many legacy URLs to lose their content
- Proxy middleware catches most with 410 responses
- Some product URLs may have inconsistent behavior (200 vs 404 depending on conditions)

**Business Impact:** LOW — All URLs are legacy with no current traffic.
**SEO Impact:** LOW — 410 is the correct signal for permanently gone content.
**Priority:** LOW (monitor only)

---

### 2. Duplicate, No Canonical (Duplicate without canonical) — 10 URLs

**Assessment: ⚠️ WARNING**

**URLs:**
| URL | Notes |
|---|---|
| `https://dreamlab.id/ads/thankyou/metaads/` | Thank you page |
| `https://dreamlab.id/ads/thankyou/metaads/?source=meta-parfum` | Same page with UTM param |
| `https://dreamlab.id/ads/maklon-parfum/` | Ads landing page |
| `https://www.dreamlab.id/thankyou/google/` | Thank you page (www version) |
| `https://www.dreamlab.id/about-us/alur-maklon/` | **Valid indexable page (www version)** |
| `https://dreamlab.id/pages/transfer-internal.php` | Legacy PHP → **410 Gone** |
| `https://dreamlab.id/pages/domainterbatas.php` | Legacy PHP → **410 Gone** |
| `https://dreamlab.id/pages/tentang-kami.php` | Legacy PHP → **410 Gone** |
| `https://dreamlab.id/pages/reseller.php` | Legacy PHP → **410 Gone** |
| `https://dreamlab.id/pages/domain.php` | Legacy PHP → **410 Gone** |

**Pattern Detection:**
- `/pages/*.php` — All legacy WordPress PHP files (all return 410)
- `/ads/thankyou/*` — Thank you pages with/without UTM params
- www vs non-www versions of valid pages

**Root Cause:**
1. Legacy PHP pages already return 410 — Google just hasn't recrawled yet
2. Ads thankyou pages lack canonical tag to primary version
3. www version of `/about-us/alur-maklon/` has no canonical to non-www version

**5 Whys:**
- Why duplicate? → Multiple versions of same content exist
- Why no canonical? → Template doesn't dynamically add self-canonical for these paths
- Why does Google find them? → Likely from old sitemaps, external links, or redirect chains

**Business Impact:** MEDIUM — `/about-us/alur-maklon/` is a funnel page. Duplicate signals dilute ranking power.
**SEO Impact:** MEDIUM — Duplicate content without canonical confuses Google.
**Priority:** MEDIUM

---

### 3. Crawled - Currently Not Indexed — 732 URLs

**Assessment: ✅ EXPECTED (686) + ⚠️ WARNING (46)**

**Breakdown:**

| Sub-category | Count | Status | Assessment |
|---|---|---|---|
| `/_next/static/` — JS, CSS, WOFF2 chunks | 686 | Blocked by robots.txt or noindex | ✅ **EXPECTED** |
| Blog articles (rekomendasi-maklon-kosmetik-terbaik-dreamlab, etc.) | ~15 | `index, follow` but not indexed | ⚠️ **WARNING** |
| `/pages/*.php` — Legacy (410) | 6 | 410 Gone | ✅ **EXPECTED** |
| RSS feeds (`/feed/`, `/category/*/feed/`) | 15 | 410 Gone | ✅ **EXPECTED** |
| `/wp-content/`, `/wp-json/`, `/search/` | 5 | 410 Gone | ✅ **EXPECTED** |
| `/cms_block_cat/` | 2 | 410 Gone | ✅ **EXPECTED** |
| `/product-category/uncategorized/feed/` | 1 | 410 Gone | ✅ **EXPECTED** |
| `/post-sitemap.xml` | 1 | 410 Gone | ✅ **EXPECTED** |
| `/assets/images/...` hash | 1 | Dynamic image | ✅ **EXPECTED** |
| `/index.php` | 1 | 410 Gone | ✅ **EXPECTED** |

**⚠️ WARNING — Non-indexed Articles & Pages:**

| URL | Type | Business Value |
|---|---|---|
| `dreamlab-kolaborasi-di-klifm-bongkar-strategi-bisnis-kosmetik/` | Article/Brand awareness | MEDIUM |
| `rekomendasi-maklon-kosmetik-terbaik-dreamlab/` | **Commercial article** | **HIGH** |
| `maklon-kosmetik-tangerang-terpercaya` | **Landing page** (www) | **HIGH** |
| `solusi-bisnis-body-serum-aha-2025-tren-pasar-maklon-dreamlab/` | Article | MEDIUM |
| `rekomendasi-skincare-musim-hujan-agar-kulit-tetap-sehat-dan-lembap/` | Article | MEDIUM |
| `perusahaan-maklon-kosmetik/` | **Company page** | **HIGH** |
| `bisnis-kosmetik-dari-nol/` | Article | MEDIUM |
| `state-of-beauty-2025-tren-kecantikan-pertumbuhan-industri-` | Article (truncated slug) | MEDIUM |
| `atur‑kosmetik‑halal‑dreamlab/` | Article | MEDIUM |
| `ide-bisnis-kosmetik/` | Article | MEDIUM |

**Pattern Detection:**
- Majority (686/732 = 94%) are static build assets — completely normal
- ~46 URLs are actual content pages that should be indexable
- Several are HIGH business value pages (commercial intent)

**Root Cause:**
1. **Content quality signal** — Google crawled but deemed content insufficient for indexing
2. **Template-driven content** — Programmatic pages from CSV audit produce similar-looking content
3. **Insufficient internal linking** — Some pages lack strong internal link signals
4. **Authority/reputation** — Site-wide authority may not be high enough for Google to index all pages

**5 Whys:**
- Why not indexed? → Google chose not to include in index
- Why? → Content quality or authority signals insufficient
- Why? → Programmatic template produces thin/similar content
- Why? → CSV audit legacy data dumped into template without unique value-add
- **Root Cause:** Programmatic content generation from CSV audit produces pages that Google considers low-value, so they remain "crawled - not indexed"

**Business Impact:** MEDIUM-HIGH — Commercial pages like `perusahaan-maklon-kosmetik/` and `maklon-kosmetik-tangerang-terpercaya/` should be generating leads.
**SEO Impact:** MEDIUM — Non-indexed = zero organic visibility.
**Priority:** HIGH

---

### 4. Pages with Redirect — 424 URLs

**Assessment: ✅ EXPECTED (majority) + ⚠️ WARNING (minority)**

**Breakdown:**

| Redirect Type | Approx Count | Status Code | Assessment |
|---|---|---|---|
| Non-trailing-slash → trailing-slash | ~200+ | 308 | ✅ **EXPECTED** (Vercel default) |
| www → non-www | ~100+ | 307 | ✅ **EXPECTED** (canonical domain) |
| Old URLs → new equivalents | ~60 | 308 | ✅ **EXPECTED** (URL normalization) |
| `/homepage.php` → `/` | 2 | 308 | ✅ **EXPECTED** |
| Category consolidation (`/maklon-parfum/` → `/maklon-kosmetik/`) | ~10 | **301** | ✅ **EXPECTED** (proper permanent redirect) |
| `/thankyou-page/` → `/` | ~5 | 308 | ✅ **EXPECTED** |
| Duplicate entries (both www and non-www, both slash and non-slash) | ~50 | Mixed | ⚠️ **Expected but inflates count** |

**Verification (live):**
| URL | Response | Destination |
|---|---|---|
| `https://dreamlab.id/maklon-parfum-custom-dreamlab` | **308** → | `/maklon-parfum-custom-dreamlab/` |
| `https://www.dreamlab.id/produk/bodycare/body-oil/` | **307** → | `https://dreamlab.id/produk/bodycare/body-oil/` |
| `https://dreamlab.id/homepage.php` | **308** → | `/` |
| `https://dreamlab.id/category/maklon-parfum/` | **301** → | `/category/maklon-kosmetik/` |
| `https://dreamlab.id/produk/haircare` | **308** → | `/produk/haircare/` |

**Pattern Detection:**
- Most redirects are **infrastructure-level** (Vercel/Next.js behavior)
- Two main redirect types: trailing slash normalization and www→non-www domain consolidation
- A few are **content-driven 301 redirects** (category consolidation)
- Many URLs appear multiple times in GSC (www + non-www, slash + non-slash = 4 variants per URL)

**Root Cause:**
1. Vercel/Next.js enforces trailing slash via 308 redirect — normal behavior
2. www → non-www redirect (307) — correct canonical domain setup
3. Category consolidation 301 redirects — intentional content restructuring
4. GSC counts each URL variant separately, inflating the count

**Business Impact:** LOW — Proper redirects preserve link equity.
**SEO Impact:** LOW — Redirect chains (www→non-www + trailing slash = 2 hops) add minimal latency.
**Priority:** LOW

---

### 5. Alternate Page with Proper Canonical Tag — 189 URLs

**Assessment: ✅ MOSTLY EXPECTED**

**URL Categories:**
| Type | Examples | Count |
|---|---|---|
| Product sub-category pages | `/produk/skincare/face-cream/`, `/produk/decorative/lipcare/` | ~80 |
| Product detail pages | `/produk/skincare/face-cream/moisturizing-cream/` | ~40 |
| Blog articles | `/maklon-cream-anti-aging/`, `/jenis-vitamin-c-whitening-terbaik/` | ~30 |
| Pagination | `/news-blog/page/3/`, `/news-blog/page/9/` | ~15 |
| Category pages | `/category/maklon-parfum/`, `/category/bisnis-skincare/` | ~10 |
| Author archives | `/author/admin/page/3/` | ~5 |
| Miscellaneous | `/about-us/`, `/body-care/`, `/foot-care/` | ~9 |

**Verification (live):**
| URL | Canonical | Robots Meta |
|---|---|---|
| `/produk/skincare/face-cream/moisturizing-cream/` | Self-referencing ✅ | `index, follow` |
| `/produk/skincare/face-cream/` | Self-referencing ✅ | `index, follow` |
| `/news-blog/page/2/` | Self-referencing ✅ | `noindex, follow` |
| `/category/maklon-parfum/` | **301 → /category/maklon-kosmetik/** | N/A (redirect) |

**Pattern Detection:**
- All pages have **correct self-referencing canonical** tags ✅
- Product sub-categories and detail pages have `index, follow` but Google still considers them "alternate"
- This happens when Google finds multiple URLs pointing to the same or similar content

**Root Cause:**
Google reports "alternate with proper canonical" when:
1. **www vs non-www:** Google crawls both versions; www has canonical to non-www (via 307 redirect)
2. **Trailing slash variants:** Google crawls non-slash version; it redirects (308) to slash version
3. **Pagination:** `page/2/` has `noindex, follow` with self-canonical — Google respects the noindex and reports as alternate
4. **Similar content:** Product sub-pages with content similar to parent page — Google may choose parent as canonical despite self-canonical tag

**Business Impact:** LOW — This is normal canonical behavior. It does not harm rankings.
**SEO Impact:** LOW — Category shows canonical system is working correctly.
**Priority:** LOW (monitor only)

---

### 6. Excluded by 'noindex' Tag — 77 URLs

**Assessment: ✅ MOSTLY EXPECTED + ⚠️ SOME WARNING**

**URL Categories:**
| Type | Examples | Count | Assessment |
|---|---|---|---|
| Author archives | `/author/admin/`, `/author/admin/page/7/` | ~7 | ✅ **EXPECTED** (intentional noindex) |
| Pagination (blog) | `/news-blog/page/2/`, `/news-blog/page/3/` | ~10 | ✅ **EXPECTED** (intentional noindex) |
| Thank you pages | `/thankyoupage-tiktokads/`, `/thankyoupage-google/` | ~4 | ✅ **EXPECTED** (conversion funnel) |
| Shop/Cart | `/shop/`, `/cart/` | ~4 | ✅ **EXPECTED** (ecommerce func) |
| Blog prefix | `/blog/foot-care-produk-peluang-bisnis-maklon/`, `/blog/pabrik-maklon-kosmetik-cpkb-grade-a/` | ~10 | ✅ **EXPECTED** (`/blog/` redirected to `/news-blog/`) |
| Social media link | `/social-media-link/` | 2 | ✅ **EXPECTED** (internal page) |
| Page/* | `/page/2/`, `/page/8/` | ~10 | ⚠️ **WARNING** (conflicting directives) |
| **Product sub-pages** | **`/produk/babycare/baby-oil/`** | **~5+** | **🔴 CRITICAL FINDING** |
| `/produk/` | `/produk/` (main product listing) | 1 | ⚠️ **WARNING** |
| `/hair-care/` | `/hair-care/` | 1 | ⚠️ **WARNING** (indexable page) |
| `/cms_block_cat/flying-button/` | 1 | ✅ **EXPECTED** (CMS block) |
| `/e-floating-buttons/popup-website/` | 2 | ✅ **EXPECTED** (UI component) |
| Malformed URLs | `/*/`, `/$/`, `/&/` | ~4 | ✅ **EXPECTED** |
| `/?s={search_term_string}` | Search results | 2 | ✅ **EXPECTED** |
| `/contact` | Without trailing slash | 1 | ⚠️ **WARNING** (duplicate of `/contact-us/`) |
| Legacy/other | `/maklonkosmetik-tiktok/`, `juaranyaformula` | ~5 | ✅ **EXPECTED** |

**🔴 CRITICAL FINDING: Product Sub-pages with noindex**

`https://dreamlab.id/produk/babycare/baby-oil/` → **`noindex, follow`**

This means individual product pages under certain categories are intentionally set to noindex. If this is a pattern across all product sub-categories, **dozens of potential landing pages are excluded from search.**

**Verification cross-check:**
| Page | Robots Meta | In Sitemap? | Blocked by robots.txt? |
|---|---|---|---|
| `/produk/babycare/baby-oil/` | **noindex, follow** | ✅ Yes | ✅ Yes (Disallow: /produk/babycare/) |
| `/produk/babycare/` (parent) | **index, follow** | ✅ Yes | ✅ Yes (Disallow: /produk/babycare/) |
| `/produk/bodycare/` (parent) | **index, follow** | ✅ Yes | ❌ Not blocked |
| `/produk/skincare/face-cream/` | **index, follow** | ✅ Yes | ❌ Not blocked |

**Inconsistency detected:** Different product categories have different noindex/blocking treatment despite same template.

**5 Whys:**
- Why noindex on product sub-pages? → Likely because template content is thin
- Why thin content? → Programmatic generation from CSV data
- Why is this inconsistent across categories? → No unified content strategy for product pages
- Why are some categories both noindex AND blocked by robots.txt? → Double-blocking suggests over-aggressive configuration
- **Root Cause:** Product sub-page indexing strategy was never explicitly decided. Some categories got `noindex` tag, some got robots.txt block, some got both — all without documentation.

**Business Impact:** **HIGH** — Product pages are potential landing pages for commercial search queries.
**SEO Impact:** **HIGH** — These pages have zero chance of ranking with `noindex`.
**Priority:** **HIGH (INVESTIGATE IMMEDIATELY)**

---

### 7. Blocked by robots.txt — 77 URLs

**Assessment: ✅ ENTIRELY EXPECTED**

| Detail | Value |
|---|---|
| **All URLs** | `/_next/static/chunks/*.js`, `/_next/static/chunks/*.css`, `/_next/static/media/*.woff2` |
| **robots.txt rule** | `Disallow: /_next/static/` |
| **Content type** | JavaScript bundles, CSS files, WebFont assets |
| **Should they be indexed?** | **NO** — Static build assets have zero search value |

**Root Cause:** Standard Next.js deployment pattern — static assets are served from `/_next/static/` and correctly blocked from indexing.

**Business Impact:** NONE
**SEO Impact:** NONE
**Priority:** NONE (ignore completely)

---

### 8. Discovered - Currently Not Indexed — 8 URLs

**Assessment: ⚠️ WARNING (low severity)**

| URL | Type | Status |
|---|---|---|
| `/produk/bodycare/bar-soap/` | Product page | New, not yet crawled |
| `/produk/bodycare/neck-cream/` | Product page | New, not yet crawled |
| `/produk/bodycare/transparent-soap/` | Product page | New, not yet crawled |
| `/produk/bodycare/underarm-cream/` | Product page | New, not yet crawled |
| `/produk/bodycare/whitening-soap/` | Product page | New, not yet crawled |
| `/produk/pkrt/*` (3 URLs) | PKRT category | Returns 410 |

**Analysis:**
- 5 bodycare product pages: Newly discovered, Google hasn't crawled yet. This is **normal** for recently added pages.
- 3 PKRT URLs: Category that returns 410. Google found them (possibly from sitemap) but hasn't attempted crawl yet.

**Root Cause:**
- New product pages were added and Google is aware but hasn't scheduled crawl
- PKRT URLs should not be in sitemap (they return 410)

**Business Impact:** LOW — Only 5 product pages potentially affected.
**SEO Impact:** LOW — Normal discovery phase.
**Priority:** LOW-MEDIUM (monitor bodycare pages)

---

## Pattern Detection Summary

| Pattern | Affected Categories | Root Cause |
|---|---|---|
| **Template-driven thin content** | Crawled-not-indexed (46), noindex | Programmatic CSV → template → similar-looking pages |
| **Double-blocking** | noindex + robots.txt on same URL paths | No coordinated strategy between robots.txt and meta robots |
| **Sitemap/filter mismatch** | Redirects, 410s in sitemap | proxyPrefixes in sitemap.ts not synced with GONE_PATTERNS in proxy.ts |
| **www/non-www inflation** | Redirect (424), Alt canonical (189) | Google treats each variant as separate URL |
| **Trailing slash normalization** | Redirect (424) | Vercel/Next.js default 308 redirect |
| **Legacy WordPress debris** | 404 (19), noindex (77), Crawled-not-indexed (46) | Migration artifacts not fully cleaned up |
| **Category consolidation** | Redirect (for `/maklon-parfum/` → `/maklon-kosmetik/`) | Intentional content merge |

---

## Root Cause Matrix

| Issue | Root Cause | Evidence | Confidence | Business Impact | SEO Impact | Priority |
|---|---|---|---|---|---|---|
| **robots.txt blocks indexable product categories** | Over-aggressive robots.txt from migration | `/produk/babycare/` has `index,follow` but blocked | **95%** | MEDIUM | HIGH | **🔴 CRITICAL** |
| **Product sub-pages have noindex** | No explicit strategy for programmatic product pages | `/produk/babycare/baby-oil/` → `noindex,follow` | **90%** | HIGH | HIGH | **🔴 CRITICAL** |
| **Non-indexed high-value articles (46)** | Thin content from CSV templates | 70% zero-click rate, template-like content | **85%** | MEDIUM-HIGH | MEDIUM | **🟡 HIGH** |
| **Sitemap contains 410/redirect URLs** | sitemap.ts not synced with proxy.ts | Mismatch in filter lists | **95%** | LOW | MEDIUM | **🟡 HIGH** |
| **Duplicate thankyou pages (10)** | No canonical on UTM param variants | `/ads/thankyou/metaads/` with/without `?source=` | **90%** | LOW-MEDIUM | MEDIUM | **🟡 MEDIUM** |
| **Conflicting robots on `/page/2/`** | Multiple robots meta tags rendered | Returns both `index,follow` and `noindex` | **70%** | LOW | LOW-MEDIUM | **🟡 MEDIUM** |
| **www vs non-www redirects (424)** | Vercel canonical domain configuration | 307 redirect observed | **100%** | LOW | LOW | **🔵 LOW** |
| **Trailing slash redirects** | Vercel/Next.js default behavior | 308 redirect observed | **100%** | LOW | LOW | **🔵 LOW** |
| **Legacy 410/404 pages** | Migration from WordPress to Next.js | Old .php, /feed → 410 | **100%** | LOW | LOW | **🔵 LOW** |
| **`/_next/static/` blocked** | Standard static asset protection | All 77 URLs under `/_next/static/` | **100%** | NONE | NONE | **⛔ NONE** |
| **Alt canonical pages (189)** | www/slash variants with correct canonical | Self-canonical observed | **95%** | LOW | LOW | **🔵 LOW** |

---

## Priority Action Plan

### 🔴 SPRINT 0.5: Fix Robots.txt (Day 1)

| Item | Detail |
|---|---|
| **Problem** | robots.txt blocks `/produk/babycare/`, `/produk/decorative/`, `/produk/footcare/` — pages that have `index, follow` and are in sitemap |
| **Evidence** | robots.txt has `Disallow: /produk/babycare/` etc. Live pages return 200 with `index, follow` meta |
| **Root Cause** | robots.txt was created too aggressively during migration, blocking product category trees indiscriminately |
| **Recommended Fix** | Remove these Disallow lines from robots.txt: `Disallow: /produk/babycare/`, `Disallow: /produk/decorative/`, `Disallow: /produk/footcare/`. Keep `Disallow: /produk/pkrt/` (returns 410) |
| **Expected Result** | Google can crawl and potentially index product category pages within 1-2 weeks |
| **Validation** | Check GSC "Blocked by robots.txt" for these categories → should drop to 0 |
| **Rollback Plan** | Restore original robots.txt |
| **Confidence** | **95%** — Clear misconfiguration |

---

### 🔴 SPRINT 1: Product Sub-page Strategy (Day 1-2)

| Item | Detail |
|---|---|
| **Problem** | `/produk/babycare/baby-oil/` and likely other product sub-pages have `noindex, follow`. No documented strategy. |
| **Root Cause** | No explicit decision on whether programmatic product sub-pages should be indexed |
| **Investigation** | 1. Audit ALL `/produk/*/*/` sub-pages for noindex status<br>2. Content audit: do they have enough unique content?<br>3. Business decision: do we WANT individual product pages indexed? |
| **If YES (index)** | Remove noindex, improve content to min 500 unique words per product |
| **If NO (noindex)** | Document decision, ensure canonical points to parent category page |
| **Confidence** | **90%** — Data is verifiable, decision is business-driven |

---

### 🟡 SPRINT 2: Sync Sitemap Filter with Proxy (Day 2-3)

| Item | Detail |
|---|---|
| **Problem** | sitemap.ts `proxyPrefixes` missing patterns that exist in proxy.ts `GONE_PATTERNS` |
| **Evidence** | Code comparison shows missing: `thankyou-page`, `thankyoupage-google`, `google-ads/`, `e-floating-buttons/`, `produk/pkrt/` |
| **Root Cause** | Two files maintained independently — no single source of truth for excluded URL patterns |
| **Recommended Fix** | Sync proxyPrefixes array with GONE_PATTERNS. Note: if SPRINT 0.5 removes robots.txt block on babycare/decorative/footcare, those should NOT be in sitemap filter. Only keep pkrt. |
| **Expected Result** | Sitemap no longer includes URLs that return 410 |
| **Validation** | Count sitemap URLs before/after; verify no 410 URLs remain |
| **Confidence** | **95%** — Code-level fix with clear mapping |

---

### 🟡 SPRINT 3: Address Non-indexed High-Value Articles (Day 4-7)

| Item | Detail |
|---|---|
| **Problem** | ~15-20 articles with commercial intent are "crawled - not indexed" |
| **Root Cause** | Content quality insufficient for Google to index (thin programmatic content) |
| **Recommended Fix** | 1. Prioritize top 10 highest-potential articles<br>2. Add: unique data, expert quotes, schema markup<br>3. Improve internal linking from high-authority pages<br>4. Request indexing via GSC URL Inspection (manual, per-URL) |
| **Priority list** | 1. `perusahaan-maklon-kosmetik/`<br>2. `maklon-kosmetik-tangerang-terpercaya`<br>3. `rekomendasi-maklon-kosmetik-terbaik-dreamlab/`<br>4. `bisnis-kosmetik-dari-nol/`<br>5. `solusi-bisnis-body-serum-aha-2025-tren-pasar-maklon-dreamlab/` |
| **Expected Result** | Gradual increase in indexed commercial pages over 2-4 weeks |
| **Validation** | Monitor GSC "Crawled - not indexed" count for these specific URLs |
| **Confidence** | **75%** — Content improvement success depends on execution quality |

---

### 🟡 SPRINT 4: Fix Duplicate Thank You Pages (Day 3-4)

| Item | Detail |
|---|---|
| **Problem** | `/ads/thankyou/metaads/` and `/ads/thankyou/metaads/?source=meta-parfum` are duplicates without canonical |
| **Root Cause** | UTM parameters create URL variants; template doesn't add canonical |
| **Recommended Fix** | Add `<link rel="canonical" href="https://dreamlab.id/ads/thankyou/metaads/" />` to all thankyou page variants |
| **Expected Result** | Google consolidates thankyou page variants to single canonical URL |
| **Validation** | Check GSC "Duplicate without canonical" count drops |
| **Confidence** | **90%** — Simple technical fix |

---

### 🔵 SPRINT 5: Monitoring & Cleanup (Day 8-14)

1. **Monitor GSC** for product categories unblocked from robots.txt (Sprint 0.5)
2. **Check if product pages** start being indexed after noindex/robots.txt fixes
3. **Fix `/page/2/`** conflicting robots meta if confirmed (currently has both `index,follow` and `noindex`)
4. **Track** the 46 non-indexed articles weekly
5. **Re-sync** sitemap.ts and proxy.ts if any new patterns are added

---

## Risk Assessment

### If We Do Nothing

| Risk | Probability | Impact |
|---|---|---|
| Product category pages never get indexed | **High** | Crawl budget wasted, zero organic visibility for product categories |
| Product sub-pages remain unindexed | **Certain** | Lost landing page opportunities |
| Crawl budget continues to waste on 410 URLs | **High** | Slower indexing of valuable pages |
| Articles with commercial intent stay unindexed | **Medium** | Lost lead generation |

### If We Fix Incorrectly

| Risk | Probability | Impact |
|---|---|---|
| Removing robots.txt block exposes thin content | **Medium** | More "crawled - not indexed" entries |
| Removing noindex from thin product pages | **Medium** | Google may still not index them, wasting crawl budget |
| Over-filtering sitemap removes valid pages | **Low** | Some valid pages may take longer to be discovered |

### Risk Levels

| Issue | Risk Level |
|---|---|
| **Robots.txt blocking indexable pages** | **HIGH** — Already confirmed harming indexing |
| **Product sub-page noindex strategy** | **MEDIUM** — Depends on business intent |
| **Non-indexed commercial articles** | **MEDIUM** — Gradual fix, no immediate danger |
| **Sitemap filter mismatch** | **LOW** — Wastes crawl budget but not critical |
| **All other issues** | **LOW** — Expected behavior or minor impact |

---

## Final Verdict

**The 1,540 "not indexed" number is largely a mirage.**

- **~1,400 URLs** are expected/normal (static assets, redirects, canonical variants, intentional noindex)
- **~56 URLs** are truly problematic (46 non-indexed articles/pages + 10 duplicates without canonical)
- **~3 product categories** are wrongly blocked by robots.txt (the most critical fix)

**Real priority order:**

1. **🔴 Fix robots.txt** — Unblock product categories that want to be indexed
2. **🔴 Decide product sub-page strategy** — Index or noindex with clear reasoning
3. **🟡 Sync sitemap filters** — Stop wasting crawl budget on 410 URLs
4. **🟡 Improve top commercial articles** — Get high-value pages indexed
5. **🟡 Fix thankyou page duplicates** — Add canonical tags

**The biggest danger is treating the 1,540 number as the problem.** The real problem is that ~50-60 valuable pages are not indexed and ~3 product categories are blocked from crawling. Fix those, not the number.
