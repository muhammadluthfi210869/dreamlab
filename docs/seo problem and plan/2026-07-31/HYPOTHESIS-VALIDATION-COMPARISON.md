# Hypothesis Validation: SEO-PROBLEM-AND-PLAN.md vs ROOT-CAUSE-ANALYSIS-31-07-2026.md

**Date:** 2026-07-31  
**Goal:** Compare every claim, identify contradictions, determine implementation changes, classify validity of each hypothesis.

---

## 1. Implementation Changes Between Documents

Since both documents were created within 2-3 days of each other (July 29–31, 2026), **no meaningful code deployment has occurred**. The live website state during RCA verification (July 31) is functionally identical to when the previous analysis was written (July 29).

**Evidence of no change:**
| Aspect | Previous Analysis Claim | RCA Live Check (July 31) | Changed? |
|---|---|---|---|
| robots.txt | Contains aggressive Disallow rules | Same rules still present | ❌ No change |
| Product sub-page noindex | Not mentioned | `/produk/babycare/baby-oil/` → `noindex, follow` | ❌ No change (was already deployed) |
| Author archives noindex | "✅ SUDAH FIX di Phase 1" | `/author/admin/` → `noindex, follow` | ✅ Fix confirmed deployed earlier |
| Pagination noindex | "✅ SUDAH FIX di Phase 1" | `/news-blog/page/2/` → `noindex, follow` | ✅ Fix confirmed deployed earlier |
| Sitemap URL count | Internal inconsistency (302 vs 424) | Live sitemap = 302 URLs | ⚠️ Unclear which was accurate |

**Conclusion:** Only the Phase 1 fixes (author archives noindex, pagination noindex) were already deployed before both documents. No new changes occurred between July 29 and July 31.

---

## 2. Hypothesis-by-Hypothesis Comparison

### H1: "1,540 Not Indexed is KRITIS — target reduce to ~600 in 30 days"

| Source | Claim |
|---|---|
| **Previous Plan** | Status KRITIS, target 1,540 → ~600 |
| **RCA** | 1,540 is misleading; ~1,400 are expected; only ~56 truly problematic |

**Status: ❌ CONTRADICTED — HYPOTHESIS INVALID**

**Evidence:**
- RCA analysis shows 686 of 732 "crawled-not-indexed" are `/_next/static/` assets (expected)
- 424 redirects + 189 alt canonical + 77 noindex + 77 robots.txt-blocked = largely expected
- Only **56 URLs** are truly problematic (46 non-indexed + 10 duplicate without canonical)
- GSC counts each URL variant (www + non-www, slash + non-slash) separately, inflating the number

**Verdict:** The 1,540 target is the WRONG metric to optimize. Fixing it would require removing valid redirects and noindex tags, which would be harmful. **The previous plan's core framing is invalid.**

---

### H2: "generateStaticParams() over-exposure causes +400 thin pages discovered by Google"

| Source | Claim |
|---|---|
| **Previous Plan** | 226 CSV slugs + 185 articles = 411 static params → Google discovers ~400 thin pages → crawled-not-indexed |
| **RCA** | 686 of 732 crawled-not-indexed are `/_next/static/` build assets; only 46 are actual content pages |

**Status: ❌ CONTRADICTED — HYPOTHESIS INVALID**

**Evidence from RCA:**
- Live crawl of the 732 "crawled-not-indexed" URLs shows:
  - 686 = `/_next/static/chunks/*.js`, `/_next/static/chunks/*.css`, `/_next/static/media/*.woff2`
  - These are **build output files** that change hash with every deployment
  - The +399 increase observed between July 20–29 is likely new build hashes, not new catch-all pages
  - Only 46 URLs are actual content pages (articles, landing pages, etc.)

**Root cause of misdiagnosis:**
The previous plan assumed "crawled-not-indexed" entries were programmatic pages from CSV slugs. In reality, most entries are static build assets. The +399 spike was likely caused by a new deployment generating new `_next/static` hashes, which Google discovered and added to the "crawled-not-indexed" bucket.

**Verdict:** generateStaticParams() filtering will NOT significantly reduce "crawled-not-indexed" because the bulk of that category is static assets, not catch-all pages.

---

### H3: "Sitemap Proxy Filter Mismatch"

| Source | Claim |
|---|---|
| **Previous Plan** | sitemap.ts proxyPrefixes missing ~4 patterns from GONE_PATTERNS in proxy.ts |
| **RCA** | Confirms mismatch exists; adds detail that the recommended fix in P3 would block indexable product categories |

**Status: ⚠️ PARTIALLY VALID — CONCLUSION VALID, FIX DIRECTION CONTRADICTED**

**Agreed:** The mismatch exists and should be fixed.

**Critical contradiction in fix direction:**
- Previous plan's P3 recommends adding `/produk/babycare/`, `/produk/decorative/`, `/produk/footcare/` to sitemap filter
- RCA found these paths have `index, follow` and should be REMOVED from robots.txt Disallow instead
- FIXING P3 AS WRITTEN would permanently prevent these product categories from being indexed

**Verdict:** The bug exists. But the recommended fix in the previous plan would cause **collateral damage** to indexable product pages. The diagnosis is partially correct but incomplete.

---

### H4: "Thin Programmatic Pages from CSV (226 slugs)"

| Source | Claim |
|---|---|
| **Previous Plan** | ~226 CSV slugs produce thin content; 70% zero-click rate; 397 medium-confidence 410 candidates |
| **RCA** | Only 46 non-indexed content pages found; many "/produk/" sub-pages have intentional noindex (not thin content issue) |

**Status: ⚠️ OVERSTATED — SCALE INVALID, CORE CONCEPT VALID**

**Evidence:**
- 46 actual non-indexed content pages (not 200+)
- Product sub-pages are noindexed by **intentional configuration**, not because Google chose not to index them
- The 70% zero-click rate is real but the causes are mixed: some are thin content, some are intentional noindex, some are blocked by robots.txt

**Verdict:** Thin content exists but affects ~46 pages, not ~200 pages. The previous plan conflated "Google doesn't index these" with "Google chose not to index these due to thin content" — when in many cases, Google couldn't index them due to robots.txt blocking or explicit noindex tags.

---

### H5: "P1 — Filter generateStaticParams() → -200 "not indexed""

| Source | Claim |
|---|---|
| **Previous Plan** | Filtering generateStaticParams() to only articles will reduce "not indexed" by 200 |
| **RCA** | generateStaticParams() filtering will not affect _next/static assets (686 URLs) or product pages (blocked by noindex/robots.txt) |

**Status: ❌ INVALID — RECOMMENDED FIX WILL NOT ACHIEVE STATED IMPACT**

**Evidence:**
- The 686 `/_next/static/` URLs in crawled-not-indexed are NOT generated by generateStaticParams()
- They're generated by Next.js build process independently
- Filtering generateStaticParams() would only affect the ~46 actual content pages in crawled-not-indexed
- Even for those 46, they're not indexed due to content quality, not because they're in generateStaticParams()

**Verdict:** The fix may be good for build hygiene but will NOT reduce "not indexed" by 200. The expected impact was based on an incorrect understanding of what causes the 732 crawled-not-indexed entries.

---

### H6: "P2 — Add noindex to thin programmatic pages → -100 "not indexed""

| Source | Claim |
|---|---|
| **Previous Plan** | Add noindex to thin programmatic pages to reduce "not indexed" by 100 |
| **RCA** | Many product sub-pages ALREADY have noindex; adding more noindex would just move URLs between GSC categories, not reduce total |

**Status: ❌ INVALID — MISUNDERSTANDS GSC CATEGORIZATION**

**Evidence:**
- Product sub-pages like `/produk/babycare/baby-oil/` already have `noindex, follow`
- These pages are already in "Excluded by noindex" (77 URLs)
- Adding noindex to more pages would INCREASE "Excluded by noindex" count but NOT reduce total "not indexed"
- The previous plan's P2 would have zero net effect on the 1,540 total

**Verdict:** This fix would simply re-categorize URLs within GSC, not reduce the total excluded count. The previous plan misunderstood that "not indexed" includes "excluded by noindex" as a subset.

---

### H7: "P3 — Sync sitemap proxy filter → -30 "not indexed""

| Source | Claim |
|---|---|
| **Previous Plan** | Fix sitemap filter → -30 URLs from sitemap |
| **RCA** | Confirms mismatch exists; but previously discussed critical contradiction in what to filter |

**Status: ⚠️ PARTIALLY VALID — BUG EXISTS, BUT FIX LIST CONTRADICTS RCA FINDINGS**

**Agreed:** The mismatch exists and should be fixed.

**Contradiction:** The previous plan's recommended fix list for P3 includes paths that RCA found should be **indexable** (`/produk/babycare/`, etc.). If applied literally, this fix would prevent indexing of product categories.

**Verdict:** The diagnostic is correct. The treatment (fix implementation) is potentially harmful. Needs correction.

---

### H8: "P4 — Filter thin articles from sitemap"

| Source | Claim |
|---|---|
| **Previous Plan** | Articles < 200 words should be filtered from sitemap |
| **RCA** | Previous plan itself acknowledges: "Artikel <200 kata: 0" (zero articles under 200 words) |

**Status: ❌ INVALID — PROBLEM DOES NOT EXIST**

**Evidence from previous plan itself:**
```
Verifikasi source lokal:
- Artikel <200 kata: 0
- Artikel 200-499 kata: 22
- Artikel >=500 kata: 163
```

The previous plan acknowledges there are ZERO articles under 200 words but still lists P4 as a fix. This is a **self-contradiction within the previous plan**.

**Verdict:** The problem does not exist. The 22 articles between 200-499 words may need improvement, but the 200-word threshold is a non-issue.

---

### H9: "P5 — /ads/ in validRoutePrefixes risk"

| Source | Claim |
|---|---|
| **Previous Plan** | ads/ prefix could expose thin pages in sitemap |
| **RCA** | Confirms `/ads/thankyou/metaads/` is in "Duplicate without canonical" category |

**Status: ✅ VALID — DIAGNOSIS CORRECT**

**Evidence:** The `/ads/` prefix is generating duplicate URL issues (UTM parameter variants). This is a real but lower-severity issue than the previous plan assessed (MEDIUM vs HIGH).

**Verdict:** The risk is real. The severity was overestimated (duplicates are MEDIUM impact, not HIGH).

---

### H10: "P6 — Author Archives not noindexed"

| Source | Claim |
|---|---|
| **Previous Plan** | "✅ SUDAH FIX di Phase 1" |
| **RCA** | Confirmed: `/author/admin/` → `noindex, follow` |

**Status: ✅ OBSOLETE — ALREADY FIXED**

**Verdict:** No action needed. Already deployed.

---

### H11: "P7 — Pagination Pages not noindexed"

| Source | Claim |
|---|---|
| **Previous Plan** | "✅ SUDAH FIX di Phase 1" |
| **RCA** | Confirmed: `/news-blog/page/2/` → `noindex, follow` |

**Status: ✅ OBSOLETE — ALREADY FIXED**

**Verdict:** No action needed. Already deployed.

---

### H12: "P8 — Fragment URLs (#) Still in Articles"

| Source | Claim |
|---|---|
| **Previous Plan** | 81 fragment URLs in GSC; claims HIGH severity |
| **RCA** | Did not investigate fragment URLs; no separate category in GSC export |

**Status: 🔴 REQUIRES FRESH EVIDENCE**

**Why:** The GSC export (Excel) does not have a "Fragment URLs" sheet. The 81 fragment URLs cited in the previous plan cannot be verified from the available data.

**Also:** The previous plan's own review section says "P8 fragment URLs bukan High priority" — contradicting its own P8 label. And it says "Fragment `#...` normalnya tidak dikirim ke server sebagai request path."

**Verdict:** Cannot confirm or deny from current evidence. Needs fresh GSC export filtered by URLs containing `#`.

---

### H13: "P9 — 66 Page Titles/Meta Descriptions Need Fix"

| Source | Claim |
|---|---|
| **Previous Plan** | 66 pages with zero clicks need title/meta improvement |
| **RCA** | Did not address CTR optimization; focused on indexability |

**Status: 🔴 REQUIRES SEPARATE ANALYSIS**

**Why:** This is a different dimension (click-through optimization) from indexability (what RCA analyzed). The RCA's scope was "why are URLs not indexed" not "why are indexed URLs not getting clicks."

**Verdict:** Neither confirmed nor denied. Requires a separate CTR/content analysis.

---

### H14: "P10 — Thin Articles (< 200 Words) Need Merge or 410"

| Source | Claim |
|---|---|
| **Previous Plan** | Audit word count; merge < 200 word articles |
| **RCA** | Previous plan's own data shows zero articles under 200 words |

**Status: ❌ INVALID — PROBLEM DOES NOT EXIST**

**Evidence from previous plan:**
- Section 3 (Koreksi besar): "Tidak ada artikel <200 kata berdasarkan source lokal. Prioritas yang benar adalah audit 22 artikel 200-499 kata"
- Section 5 (P10): Still lists "Artikel < 200 kata: merge ke artikel induk atau 410"

**Self-contradiction within previous plan:** One section correctly identifies zero articles under 200 words, while another section still prescribes a fix for non-existent articles.

**Verdict:** The problem does not exist. The real issue is 22 articles between 200-499 words (which the previous plan's own correction acknowledges).

---

### H15: "P11 — 318 Medium-Confidence 410 Candidates"

| Source | Claim |
|---|---|
| **Previous Plan** | 318 pages with < 50 impressions and 0 clicks in 90 days |
| **RCA** | Did not cross-reference the 410 candidates list |

**Status: 🔴 REQUIRES FRESH EVIDENCE**

**Why:** The 318 candidates were identified from a separate zero-click audit, not from the GSC indexing export. Without the actual URL list, RCA cannot verify whether these are already in expected exclusion categories or truly need action.

**Verdict:** The claim is plausible but unverified. The 318 URLs need to be cross-checked against current robots.txt blocks, noindex tags, and redirect status before any action.

---

### H16: "P12 — Submit Sitemap to GSC"

| Source | Claim |
|---|---|
| **Previous Plan** | Sitemap not yet submitted to GSC |
| **RCA** | Did not verify GSC sitemap submission status |

**Status: 🔴 REQUIRES FRESH EVIDENCE**

**Verdict:** Cannot confirm whether this was done. Need to check GSC.

---

### H17: "P13 — Monitor GSC Coverage Weekly"

| Source | Claim |
|---|---|
| **Previous Plan** | Weekly monitoring needed |
| **RCA** | Agrees in principle |

**Status: ✅ VALID (NON-CONTROVERSIAL)**

**Verdict:** Standard best practice. No contradiction.

---

### H18: "Estimated Distribution of Not Indexed (Table)"

| Category | Previous Plan Estimate | RCA Actual Count | Delta | Status |
|---|---|---|---|---|
| Crawled - Not Indexed | ~550-600 | 732 (686 + 46) | +132 to +182 | ⚠️ Overestimated problematic count |
| Page with redirect | ~300-350 | 424 | +74 to +124 | ⚠️ Underestimated |
| Alternate proper canonical | ~150-200 | 189 | -11 to +39 | ✅ Roughly accurate |
| Excluded by noindex | ~100-150 | 77 | -23 to -73 | ⚠️ Overestimated |
| Not Found (404/410) | ~50-80 | 19 | -31 to -61 | ⚠️ Overestimated |
| Discovered - Not Indexed | ~50-100 | 8 | -42 to -92 | ❌ Significantly overestimated |
| Duplicate without/with diff canonical | ~30 | 10 | -20 | ⚠️ Overestimated |
| Blocked by robots.txt | (not estimated) | 77 | — | ➕ Missing category |
| **Total** | **~1.540** | **1.536** | **~-4** | ✅ Total roughly matches |

**Status: ⚠️ CATEGORY DISTRIBUTION INACCURATE**

**Verdict:** The total estimate was correct (~1,540) but the distribution was wrong for nearly every category. The previous plan overestimated problematic URLs (crawled-not-indexed, discovered, not found, duplicates) and missed the robots.txt blocked category entirely.

---

## 3. Major Omissions in the Previous Plan

### Omission 1: robots.txt Blocks Indexable Product Categories

| Detail | Value |
|---|---|
| **Identified by** | RCA (live verification) |
| **Severity** | 🔴 CRITICAL |
| **Evidence** | robots.txt `Disallow: /produk/babycare/`, `/produk/decorative/`, `/produk/footcare/` while these pages have `index, follow` and are in sitemap |
| **Why missed** | Previous plan assumed robots.txt was only protecting admin/paths; never verified product category paths |

### Omission 2: Product Sub-pages Have Intentional noindex

| Detail | Value |
|---|---|
| **Identified by** | RCA (live verification) |
| **Severity** | 🔴 CRITICAL |
| **Evidence** | `/produk/babycare/baby-oil/` → `noindex, follow`; inconsistent across categories |
| **Why missed** | Previous plan assumed "thin programmatic pages" were a content quality issue; never checked meta robots tags |

### Omission 3: Some "404" URLs Actually Return 200

| Detail | Value |
|---|---|
| **Identified by** | RCA (live verification) |
| **Severity** | 🟡 MEDIUM |
| **Evidence** | `/produk/decorative/foundation/` reported as 404 in GSC but returns 200 OK live |
| **Why missed** | Previous plan took GSC data at face value without live verification |

### Omission 4: `/produk/pkrt/` Returns 410

| Detail | Value |
|---|---|
| **Identified by** | RCA (live verification) |
| **Severity** | 🟡 MEDIUM |
| **Evidence** | `/produk/pkrt/` and its sub-pages return 410 Gone |
| **Why missed** | Previous plan didn't individually verify HTTP status codes for product categories |

### Omission 5: _next/static Dominates Crawled-Not-Indexed

| Detail | Value |
|---|---|
| **Identified by** | RCA (Excel analysis + live verification) |
| **Severity** | 🟢 LOW (informational) |
| **Evidence** | 686 of 732 crawled-not-indexed URLs are `/_next/static/` assets |
| **Why missed** | Previous plan did not analyze individual URL patterns in the crawled-not-indexed category |

---

## 4. Mistaken Assumptions in the Previous Plan

| # | Assumption | Why Wrong | Evidence |
|---|---|---|---|
| 1 | "Total 'Not Indexed' is the right KPI" | Hides signal in noise; most excluded URLs are expected | ~1,400 of ~1,536 are normal/expected |
| 2 | "generateStaticParams causes +400 crawled-not-indexed" | The 732 crawled-not-indexed are mostly build assets | 686/732 = `/_next/static/` |
| 3 | "Adding noindex reduces 'not indexed'" | noindex just moves URLs between GSC categories | "Excluded by noindex" is a subset of "not indexed" |
| 4 | "Thin content is the main cause" | robots.txt blocking and explicit noindex are bigger factors | Product categories blocked, sub-pages noindexed |
| 5 | "Sitemap filter should block product paths" | Those paths have indexable content | `/produk/babycare/` → `index,follow`, blocked by robots.txt |
| 6 | "Articles under 200 words exist" | Self-contradicted within same document | "Artikel <200 kata: 0" |
| 7 | "410 candidates should be bulk-removed" | 410 is correct for legacy URLs; they're already handled | Legacy .php, /feed URLs already return 410 |
| 8 | "P3 fix is independent of robots.txt" | They're related: P3 would block what robots.txt also blocks | Both affect product category crawlability |
| 9 | "+399 spike is from catch-all pages" | Spike is likely from new deployment build hashes | `_next/static` URLs change with every deployment |

---

## 5. Valid Conclusions That Remain Valid

| Conclusion | Document | Evidence |
|---|---|---|
| **Sitemap.ts and proxy.ts are out of sync** | Both | Code comparison shows mismatched filter lists |
| **Author archives should be noindex** | Both | Already deployed |
| **Pagination should be noindex** | Both | Already deployed |
| **Thin programmatic content is a real issue** | Both | 46 non-indexed articles; some product pages have thin template content |
| **Duplicate thankyou pages need canonical** | Both | `/ads/thankyou/metaads/` variants lack canonical |
| **Legacy WordPress URLs need 410** | Both | Already implemented |
| **Conversion SEO content improvement needed** | Both | High-value commercial pages not indexed |
| **Sitemap should only contain indexable URLs** | Both | Standard best practice |

---

## 6. Conclusions That Are Now Obsolete

| Conclusion | Why Obsolete | Replacement |
|---|---|---|
| **1,540 → ~600 in 30 days target** | Wrong KPI; most excluded URLs are expected | Track "crawled-not-indexed for indexable URLs" instead |
| **generateStaticParams() filtering = -200 impact** | Won't affect _next/static assets or product pages | Focus on fixing robots.txt and noindex inconsistencies instead |
| **Add noindex to thin pages = -100 impact** | Many pages already noindexed; won't reduce total | Focus on making valuable pages indexable instead |
| **Articles < 200 words need merge/410** | Zero articles under 200 words exist | Focus on 22 articles 200-499 words instead |
| **P6 High severity (author archives)** | Already fixed | No action needed |
| **P7 High severity (pagination)** | Already fixed | No action needed |
| **P3 fix list includes product paths** | Would block indexable pages | Fix list must exclude indexable product categories |

---

## 7. Conclusions Requiring Fresh Evidence

| Conclusion | What's Missing | How to Get It |
|---|---|---|
| **81 fragment URLs in GSC** | No fragment URL data in current export | Run new GSC export filtered by URLs containing `#` |
| **318 medium-confidence 410 candidates** | No cross-reference with current URL patterns | Get the URL list and check each against robots.txt, noindex, redirect status |
| **66 pages need title/meta improvement** | Requires CTR analysis, not indexability analysis | Separate audit of indexed pages with low CTR |
| **Sitemap submitted to GSC?** | Need GSC access | Check GSC Sitemaps report |
| **+399 spike cause (build hash vs new pages)** | Deployment history between July 20-29 | Check Vercel deployment log for that period |
| **Product sub-pages across ALL categories** | Only `/produk/babycare/baby-oil/` verified | Crawl all `/produk/*/*/` paths and check meta robots |
| **www vs non-www canonical on all pages** | Only spot-checked | Bulk check all sitemap URLs for canonical consistency |

---

## 8. Summary: Validity Scorecard

| Hypothesis/Claim | Status |
|---|---|
| 1,540 target as KPI | ❌ INVALID |
| generateStaticParams() = main cause | ❌ INVALID |
| Sitemap filter mismatch exists | ✅ VALID |
| Sitemap filter fix list is correct | ❌ INVALID (would block indexable pages) |
| Thin content from CSV = 200+ pages | ❌ INVALID (~46 pages, not 200+) |
| Filter generateStaticParams() → -200 | ❌ INVALID |
| Add noindex → -100 | ❌ INVALID |
| Author archives noindex | ✅ OBSOLETE (already fixed) |
| Pagination noindex | ✅ OBSOLETE (already fixed) |
| Fragment URLs (#) issue | 🔴 REQUIRES EVIDENCE |
| 66 titles/meta need fix | 🔴 REQUIRES SEPARATE ANALYSIS |
| Articles < 200 words | ❌ INVALID (does not exist) |
| 318 410 candidates | 🔴 REQUIRES EVIDENCE |
| Submit sitemap to GSC | 🔴 REQUIRES EVIDENCE |
| Weekly monitoring | ✅ VALID |
| Category distribution estimates | ⚠️ PARTIALLY INACCURATE |
| robots.txt blocks indexable pages | ➕ MISSING from previous plan |
| Product sub-pages have noindex | ➕ MISSING from previous plan |
| _next/static dominates crawled-not-indexed | ➕ MISSING from previous plan |

**Overall previous plan accuracy score: ~35-40%** — Most core hypotheses (cause, scale, fix impact) were incorrect. The plan correctly identified some technical issues (sitemap mismatch, legacy cleanup) but missed the two most critical issues (robots.txt blocking, product page noindex) and fundamentally misunderstood what drives the 1,540 number.
