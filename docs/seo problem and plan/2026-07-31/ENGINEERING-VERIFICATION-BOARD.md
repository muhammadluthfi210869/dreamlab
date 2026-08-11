# 🏛️ Engineering Verification Board — Dreamlab.id

**Date:** 2026-07-31
**Board Composition:**
- Google Search Quality Engineer
- Technical SEO Architect
- Indexing Systems Engineer
- Search Infrastructure Engineer
- Information Retrieval Specialist
- Crawl Budget Specialist
- Search Quality Rater
- Technical Product Reviewer

**Mission:** Verify every recommendation against sufficient evidence before production changes.

**Constraint:** Production changes are expensive. Every recommendation must survive technical review.

---

## Executive Summary

### Scope

15 unique recommendations extracted from:
1. `SEO-PROBLEM-AND-PLAN.md` (July 29)
2. `ROOT-CAUSE-ANALYSIS-31-07-2026.md` (July 31)

### Verdict Distribution

| Decision | Count | Recommendations |
|---|---|---|
| ✅ APPROVE | 3 | Sitemap filter sync (corrected), Duplicate thankyou canonical, Submit sitemap + monitor |
| ❌ REJECT | 6 | generateStaticParams filter (-200 claim), Add noindex (-100 claim), Thin article filter (<200 words), Articles <200 merge/410, P3-as-written fix list, Author/pagination noindex (done) |
| 🔶 NEEDS MORE EVIDENCE | 8 | Fix robots.txt, Product sub-page strategy, Commercial article content improvement, Fragment URL fix, 66 titles/metas rewrite, 318 410 candidates, Remove ads/ prefix, Fix /page/2/ meta |

### Key Finding

**Most previous recommendations were based on incorrect assumptions about the data.** The board found that:
- 686 of 732 "crawled-not-indexed" are `/_next/static/` build assets — not programmatic pages
- `generateStaticParams()` filtering will NOT reduce "not indexed" count
- Product sub-page noindex is **inconsistent across categories** (babycare/decorative = noindex; skincare/bodycare/parfum/haircare = index)
- robots.txt blocks 3 product category pages that have `index, follow` AND are in the sitemap
- Sitemap currently contains **redirecting parent URLs** (`/maklon-body-care/`, `/maklon-decorative/`, etc. → 301)

---

## 1. Evidence Matrix

### R1: Fix robots.txt — Remove Disallow for /produk/babycare/, /produk/decorative/, /produk/footcare/

| Field | Value |
|---|---|
| **Problem** | robots.txt blocks 3 product category paths that have `index, follow` and are in sitemap.xml |
| **Current Evidence** | robots.txt confirmed to block them. Live: all 3 return 200 OK with `index,follow` and self-canonical. In sitemap confirmed. |
| **Missing Evidence** | Content quality audit of these pages. Business intent verification. |
| **Hypothesis A** | Migration artifact (70%) — robots.txt was copied from old WordPress site without review |
| **Hypothesis B** | Intentional blocking (20%) — business decision to hide categories, but `index,follow` meta contradicts this |
| **Hypothesis C** | Security over-aggression (60%) — developer blocked directories without checking indexability |
| **Confidence** | **75%** — high on what exists, medium on downstream impact |
| **Business Impact** | MEDIUM — product category landing pages |
| **SEO Impact** | HIGH — zero chance of indexing currently |
| **Engineering Risk** | MEDIUM — unblocking could expose thin sub-pages to crawling. Partially mitigated by existing noindex on babycare/decorative sub-pages. |
| **Implementation Cost** | LOW |
| **Rollback Difficulty** | LOW |
| **Decision** | 🔶 **NEEDS MORE EVIDENCE** |

### R2: Product Sub-page Indexing Strategy

| Field | Value |
|---|---|
| **Problem** | Inconsistent noindex across product categories with no documented strategy |
| **Current Evidence** | Babycare/decorative sub-pages = noindex (verified: `/produk/babycare/baby-oil/`, `/produk/decorative/make-up/foundation/`). Skincare/bodycare/parfum/haircare sub-pages = index (verified: `/produk/skincare/face-cream/moisturizing-cream/`, `/produk/bodycare/bar-soap/`). All self-canonical. Some decorative URLs redirect 301. |
| **Missing Evidence** | Content audit comparing noindexed vs indexed categories. Business input. |
| **Hypothesis A** | Historical accident (60%) — temporary migration measure never revisited |
| **Hypothesis B** | Deliberate tiered strategy (45%) — thinner categories hidden intentionally |
| **Hypothesis C** | Dev inconsistency (40%) — different developers, different rules |
| **Confidence** | **65%** |
| **Business Impact** | HIGH |
| **SEO Impact** | HIGH |
| **Engineering Risk** | LOW |
| **Decision** | 🔶 **NEEDS MORE EVIDENCE** |

### R3: Sync Sitemap Filter with proxy.ts

| Field | Value |
|---|---|
| **Problem** | sitemap.ts proxyPrefixes may miss patterns from proxy.ts GONE_PATTERNS |
| **Current Evidence** | Sitemap contains 4 redirecting parent URLs: `/maklon-body-care/` → 301, `/maklon-baby-care/` → 301, `/maklon-decorative/` → 301, `/maklon-foot-care/` → 301. No 410 URLs found in sitemap during sampling. Code analysis from previous documents confirms mismatch. |
| **Missing Evidence** | Current source code of sitemap.ts (may have been partially updated). Full inventory of redirect URLs in sitemap. |
| **Confidence** | **80%** |
| **Business Impact** | LOW |
| **SEO Impact** | LOW-MEDIUM |
| **Engineering Risk** | LOW |
| **Decision** | ✅ **APPROVE (with corrected fix list)** |

**Fix scope:** Add to proxyPrefixes: `thankyou-page`, `thankyoupage-google`, `google-ads/`, `e-floating-buttons/`, `maklon-body-care/`, `maklon-baby-care/`, `maklon-decorative/`, `maklon-foot-care/`. Do NOT add `/produk/babycare/`, `/produk/decorative/`, `/produk/footcare/`.

### R4: Filter Thin Articles (<200 words) from Sitemap

| Field | Value |
|---|---|
| **Problem** | Claimed articles under 200 words should be filtered from sitemap |
| **Current Evidence** | Previous plan's own data: "Verifikasi source lokal: Artikel <200 kata: 0". The problem as stated does not exist. |
| **Missing Evidence** | None needed |
| **Confidence** | **95%** |
| **Decision** | ❌ **REJECT** |

### R5: Remove /ads/ from validRoutePrefixes

| Field | Value |
|---|---|
| **Current Evidence** | `/ads/thankyou/metaads/` confirmed in "Duplicate without canonical" GSC category. No evidence of large thin content volume under /ads/. |
| **Missing Evidence** | Full inventory of /ads/ URLs and content quality assessment |
| **Confidence** | **50%** |
| **Decision** | 🔶 **NEEDS MORE EVIDENCE** (fix thankyou canonical first via R6, then reassess) |

### R6: Fix Duplicate Thank You Pages — Add Canonical

| Field | Value |
|---|---|
| **Current Evidence** | GSC shows 10 duplicates. `/ads/thankyou/metaads/` with `?source=meta-parfum` UTM param confirmed. Template missing canonical tag. |
| **Missing Evidence** | Full list of all UTM variants. Template capability check. |
| **Confidence** | **90%** |
| **Engineering Risk** | VERY LOW |
| **Decision** | ✅ **APPROVE** |

### R7: Fix /page/2/ Conflicting Robots Meta

| Field | Value |
|---|---|
| **Current Evidence** | Live page has 3 conflicting robots tags: `<meta name="robots" content="index,follow...">` followed by two `<meta name="robots" content="noindex"/>`. No canonical tag. HTTP 200. |
| **Missing Evidence** | What generates this page (template/route)? How many `/page/N/` exist? Does this page have any business value? |
| **Confidence** | **70%** — conflicting tags confirmed, root cause uncertain |
| **Business Impact** | VERY LOW |
| **SEO Impact** | VERY LOW |
| **Decision** | 🔶 **NEEDS MORE EVIDENCE** |

### R8: Improve Content of Non-Indexed Commercial Articles

| Field | Value |
|---|---|
| **Current Evidence** | 46 pages confirmed not indexed despite correct technical signals. Sample high-value pages: `/perusahaan-maklon-kosmetik/` (200 OK, index,follow, self-canonical — but not indexed). Zero-click audit: 70% zero-click rate, 66 pages identified as "needs content fix". |
| **Missing Evidence** | SERP comparison vs Top 3 competitors. Content depth audit (word count, uniqueness, entity coverage). Internal link analysis. Search intent match verification. |
| **Hypothesis A** | Thin content (65%) — articles lack depth, originality, or expertise signals |
| **Hypothesis B** | Low authority (55%) — site-wide domain authority insufficient |
| **Hypothesis C** | Internal linking deficiency (45%) — articles lack link equity from high-authority pages |
| **Hypothesis D** | Crawl budget prioritization (35%) — Google prioritizes other pages |
| **Confidence** | **65%** |
| **Business Impact** | MEDIUM-HIGH |
| **SEO Impact** | MEDIUM |
| **Decision** | 🔶 **NEEDS MORE EVIDENCE** |

### R9: Fragment URL Fix

| Field | Value |
|---|---|
| **Current Evidence** | Previous plan states 81 fragment URLs exist but own correction says LOW priority. Current GSC export has no fragment URL sheet. |
| **Missing Evidence** | GSC export filtered by URLs containing `#` |
| **Confidence** | **30%** |
| **Decision** | 🔶 **NEEDS MORE EVIDENCE** |

### R10: Rewrite 66 Titles/Metas

| Field | Value |
|---|---|
| **Current Evidence** | Previous plan data only (66 pages with >0 impressions, 0 clicks). No SERP position data in current analysis. |
| **Missing Evidence** | Current SERP positions. Competitor title/meta analysis. Search intent verification. |
| **Confidence** | **40%** |
| **Decision** | 🔶 **NEEDS MORE EVIDENCE** |

### R11: 410 Verification (318 Candidates)

| Field | Value |
|---|---|
| **Current Evidence** | Previous plan data only (318 pages with <50 impressions, 0 clicks). Current GSC export lacks performance data. URL list not available for cross-reference. |
| **Missing Evidence** | Complete URL list. Current status check (how many already 410?). Backlink profile. Business value assessment. |
| **Confidence** | **25%** |
| **Decision** | ❌ **REJECT (for now)** — cannot evaluate without URL list |

### R12: Filter generateStaticParams() — Only Articles

| Field | Value |
|---|---|
| **Problem** | Claimed -200 from "not indexed" by filtering generateStaticParams() |
| **Current Evidence** | 686/732 crawled-not-indexed are `/_next/static/` build assets NOT affected by this change. Only 46 content pages in crawled-not-indexed. The -200 impact claim is unsupported by evidence. |
| **Confidence in stated impact** | **25%** |
| **Decision** | ❌ **REJECT (as stated SEO impact)** — filtering may be valid for build hygiene but NOT for the stated GSC impact |

### R13: Add Noindex to Thin Programmatic Pages

| Field | Value |
|---|---|
| **Problem** | Claimed -100 from "not indexed" by adding noindex |
| **Current Evidence** | Product sub-pages in babycare/decorative ALREADY have noindex. "Excluded by noindex" = 77 URLs. Adding noindex does NOT reduce total "not indexed" — it just moves URLs between GSC sub-categories. |
| **Confidence** | **95%** |
| **Decision** | ❌ **REJECT** — fundamentally misunderstands GSC categorization |

### R14: Author Archives Noindex / Pagination Noindex

**Decision:** ❌ **REJECT (already deployed)** — confirmed live: `/author/admin/` → noindex, `/news-blog/page/2/` → noindex

### R15: Submit Sitemap to GSC / Weekly Monitoring

**Decision:** ✅ **APPROVE**

---

## 2. Technical Verification — Indexability Grid

| Page | Status | Canonical | Meta Robots | robots.txt | In Sitemap | Indexable? |
|---|---|---|---|---|---|---|
| `/produk/babycare/` | 200 | Self | index,follow | **BLOCKED** | Yes | ❌ (blocked) |
| `/produk/decorative/` | 200 | Self | index,follow | **BLOCKED** | Yes | ❌ (blocked) |
| `/produk/footcare/` | 200 | Self | index,follow | **BLOCKED** | Yes | ❌ (blocked) |
| `/produk/babycare/baby-oil/` | 200 | Self | **noindex** | BLOCKED | Yes | ❌ (both) |
| `/produk/babycare/baby-lotion/` | 200 | Self | **noindex** | BLOCKED | Yes | ❌ (both) |
| `/produk/decorative/make-up/` | 200 | Self | **noindex** | BLOCKED | Yes | ❌ (both) |
| `/produk/decorative/make-up/foundation/` | 200 | Self | **noindex** | BLOCKED | Yes | ❌ (both) |
| `/produk/skincare/face-cream/` | 200 | Self | index,follow | NOT blocked | Yes | ✅ |
| `/produk/skincare/face-cream/moisturizing-cream/` | 200 | Self | index,follow | NOT blocked | Yes | ✅ |
| `/produk/bodycare/bar-soap/` | 200 | Self | index,follow | NOT blocked | Yes | ✅ |
| `/produk/parfum/body-mist/` | 200 | Self | index,follow | NOT blocked | Yes | ✅ |
| `/produk/haircare/shampoo/` | 200 | Self | index,follow | NOT blocked | Yes | ✅ |
| `/perusahaan-maklon-kosmetik/` | 200 | Self | index,follow | NOT blocked | Yes | ✅ (not indexed) |
| `/bisnis-kosmetik-dari-nol/` | 200 | Self | index,follow | NOT blocked | Yes | ✅ (not indexed) |
| `/maklon-body-care/` (parent) | **301** | N/A | N/A | NOT blocked | **Yes** | ❌ (redirect) |
| `/maklon-body-care/massage-oil/` (child) | 200 | Self | index,follow | NOT blocked | Yes | ✅ (child OK) |
| `/maklon-baby-care/` (parent) | **301** | N/A | N/A | NOT blocked | **Yes** | ❌ (redirect) |
| `/maklon-decorative/` (parent) | **301** | N/A | N/A | NOT blocked | **Yes** | ❌ (redirect) |
| `/maklon-decorative/makeup/` (child) | 200 | Self | index,follow | NOT blocked | Yes | ✅ (child OK) |
| `/maklon-foot-care/` (parent) | **301** | N/A | N/A | NOT blocked | **Yes** | ❌ (redirect) |
| `/produk/decorative/bb-cream/` | **301** | N/A | N/A | BLOCKED | — | ❌ (redirect) |
| `/produk/decorative/foundation/` | **301** | N/A | N/A | BLOCKED | — | ❌ (redirect) |
| `/page/2/` | 200 | **MISSING** | **CONFLICTING** | NOT blocked | No | ❌ (broken) |
| `/ads/thankyou/metaads/` | 200 | Unknown | Unknown | NOT blocked | Yes | Unknown |
| `/produk/pkrt/` | **410** | N/A | N/A | BLOCKED | No | ❌ (gone) |

---

## 3. Alternative Hypothesis Table

| Problem | Hypothesis A | Conf | Hypothesis B | Conf | Hypothesis C | Conf | Hypothesis D | Conf |
|---|---|---|---|---|---|---|---|---|
| **robots.txt blocks indexable pages** | Migration artifact (robots.txt copied from old WP) | **70%** | Security over-aggression (blocked directories without checking) | **60%** | Intentional blocking (business decision) | **20%** | — | — |
| **Product sub-page noindex inconsistency** | Historical accident (temp measure never revisited) | **60%** | Deliberate tiered strategy (thin categories hidden) | **45%** | Dev inconsistency (different developers) | **40%** | — | — |
| **46 articles not indexed** | Thin content (lacks depth/originality) | **65%** | Low authority (domain-wide) | **55%** | Internal linking deficiency | **45%** | Crawl budget | **35%** |
| **Sitemap has redirecting URLs** | Partial filter update (some patterns added, some missed) | **55%** | Intentional inclusion (sub-pages are valid 200s) | **40%** | Code bug (conditionals fail for certain patterns) | **30%** | — | — |
| **Duplicate thankyou pages** | Developer oversight (forgot canonical) | **70%** | Template limitation (can't inject canonical) | **60%** | Intentional tracking (marketing wants separate URLs) | **10%** | — | — |
| **/page/2/ conflicting meta** | WordPress artifact (leftover from migration) | **75%** | Next.js catch-all misconfiguration | **60%** | Plugin injection (extra meta tags) | **20%** | — | — |
| **732 crawled-not-indexed** | Static build assets dominate (94%) | **95%** | New deployment hashes (cause +399 spike) | **70%** | Programmatic pages (CSV slugs) | **30%** | — | — |

---

## 4. Risk Matrix

| Change | What Could Break? | Probability | Severity | Overall Risk |
|---|---|---|---|---|
| **Fix robots.txt** (remove disallow) | Google crawls and indexes thin product sub-pages | MEDIUM | LOW-MEDIUM | **MEDIUM** |
| **Fix robots.txt** (remove disallow) | Temporary crawl budget spike on newly unblocked URLs | HIGH | LOW | **LOW** |
| **Sync sitemap filter** | Accidentally filtering valid pages if fix list is wrong | LOW | MEDIUM | **LOW** |
| **Thankyou canonical fix** | Template logic error breaks thankyou page rendering | VERY LOW | HIGH | **LOW** |
| **Content improvement** (articles) | Investment in wrong pages if selection criteria are wrong | MEDIUM | MEDIUM | **MEDIUM** |
| **Fragment URL fix** | Breaking heading anchors users rely on for navigation | LOW | LOW | **LOW** |
| **Filter generateStaticParams** | Removing needed pages from build | LOW | MEDIUM | **LOW** |
| **410 verification (318 candidates)** | Removing pages with backlinks = lost link equity | MEDIUM | MEDIUM-HIGH | **MEDIUM-HIGH** |
| **/page/2/ fix** | Very low — broken page with no traffic | VERY LOW | VERY LOW | **NEGLIGIBLE** |

---

## 5. Engineering Decision Matrix

| Recommendation | Evidence Score | Business Value | SEO Value | Risk | Confidence | Decision |
|---|---|---|---|---|---|---|
| R3: Sync sitemap filter | 85 | LOW | MEDIUM | LOW | 80% | ✅ APPROVE |
| R6: Thankyou canonical | 90 | LOW-MED | MEDIUM | VERY LOW | 90% | ✅ APPROVE |
| R15: Submit + monitor | 90 | LOW-MED | LOW-MED | NONE | 90% | ✅ APPROVE |
| R1: Fix robots.txt | 75 | MEDIUM | HIGH | MEDIUM | 75% | 🔶 NEEDS EVIDENCE |
| R2: Product strategy | 65 | HIGH | HIGH | LOW | 65% | 🔶 NEEDS EVIDENCE |
| R8: Article improvement | 55 | MED-HIGH | MEDIUM | LOW-MED | 65% | 🔶 NEEDS EVIDENCE |
| R5: Remove ads/ | 50 | LOW-MED | LOW | LOW | 50% | 🔶 NEEDS EVIDENCE |
| R7: Fix /page/2/ | 70 | VERY LOW | VERY LOW | VERY LOW | 70% | 🔶 NEEDS EVIDENCE |
| R9: Fragment URLs | 30 | LOW | LOW | LOW | 30% | 🔶 NEEDS EVIDENCE |
| R10: Rewrite 66 titles | 40 | MEDIUM | LOW-MED | LOW | 40% | 🔶 NEEDS EVIDENCE |
| R4: Filter thin articles | 95 | NONE | NONE | NONE | 95% | ❌ REJECT |
| R11: 410 candidates | 25 | VARIES | VARIES | MED-HIGH | 25% | ❌ REJECT |
| R12: generateStatic | 25 | LOW | LOW | LOW | 25% | ❌ REJECT |
| R13: Add noindex | 5 | NONE | NONE | NONE | 95% | ❌ REJECT |
| R14: Auth/pag noindex | — | — | — | — | — | ❌ REJECT (done) |

---

## 6. Final Engineering Verdict

### GROUP A — Safe to Implement Immediately

| # | Action | Rationale |
|---|---|---|
| **A1** | Sync sitemap.ts proxyPrefixes with proxy.ts GONE_PATTERNS | Confirmed bug. Low risk. Add: `thankyou-page`, `thankyoupage-google`, `google-ads/`, `e-floating-buttons/`, `maklon-body-care/`, `maklon-baby-care/`, `maklon-decorative/`, `maklon-foot-care/`. Do NOT add `/produk/babycare/`, `/produk/decorative/`, `/produk/footcare/`. |
| **A2** | Add self-canonical to `/ads/thankyou/metaads/` template | Low risk. Clear duplicate issue. Ensure all UTM variants inherit canonical to base URL. |
| **A3** | Submit current sitemap to GSC if not done | Standard operational task. Establish weekly monitoring routine. |

### GROUP B — Implement After Validation

| # | Action | Required Validation |
|---|---|---|
| **B1** | Fix robots.txt (remove disallow for 3 product paths) | Content audit confirming index-worthiness. Business confirmation. |
| **B2** | Decide product sub-page indexing strategy | Content audit comparing noindexed vs indexed categories. Business input. |
| **B3** | Fix `/page/2/` conflicting robots | Identify what generates this page. If catch-all artifact, add to GONE_PATTERNS. If template bug, fix logic. |

### GROUP C — Requires Experimentation

| # | Action | Required Experiment |
|---|---|---|
| **C1** | Improve content of ~46 non-indexed articles | SERP comparison for 3-5 priority articles first. Content gap analysis. Then A/B test on 1-2 articles. |
| **C2** | Rewrite 66 titles/metas | Separate CTR project. Requires SERP position data, competitor analysis, search intent mapping. |
| **C3** | Remove `/ads/` from validRoutePrefixes | Audit all `/ads/` URLs first. Fix thankyou duplicates via A2 first. Then reassess. |

### GROUP D — Reject

| # | Reason for Rejection |
|---|---|
| **D1** | Filter generateStaticParams() for SEO: -200 impact claim unsupported by evidence. (May be valid for build hygiene but not for SEO.) |
| **D2** | Add noindex for SEO: product pages already noindexed. Will not reduce total "not indexed" — only shifts between GSC sub-categories. |
| **D3** | Filter articles <200 words: problem does not exist (0 articles under 200 words). |
| **D4** | Merge/410 articles <200 words: same as D3 — problem does not exist. |
| **D5** | 410 verification (318 candidates): cannot evaluate without URL list. Previous analysis suggests many are already in expected categories. |
| **D6** | Author/pagination noindex: already deployed and confirmed live. |

---

## 7. Missing Evidence Registry

| ID | Evidence Needed | How to Obtain |
|---|---|---|
| **E1** | Content audit of `/produk/babycare/`, `/produk/decorative/`, `/produk/footcare/` pages | Manual page review + comparison to already-indexed `/produk/skincare/` and `/produk/bodycare/` |
| **E2** | Business decision on product sub-page indexing strategy | Meeting with business stakeholders + content quality assessment |
| **E3** | SERP comparison for 5 priority non-indexed articles | Manual SERP analysis: search each article's target query, compare Dreamlab vs Top 3 |
| **E4** | Content depth audit for 46 non-indexed pages | Automated word count + manual entity audit for sample of 10 pages |
| **E5** | Internal link profile for 46 non-indexed pages | Crawl tool (Screaming Frog, Sitebulb) or GSC internal links report |
| **E6** | Current GSC export filtered by URLs containing `#` | GSC → Page indexing → Filter by `#` |
| **E7** | Current SERP positions for 66 zero-click pages | GSC Performance report → Pages → Export with position data |
| **E8** | Complete URL list of 318 410 candidates | Locate the zero-click audit data file referenced in previous plan |
| **E9** | Backlink profile for top 20 410 candidates | Ahrefs / Majestic / Semrush backlink check |
| **E10** | Current sitemap.ts source code | Read `src/app/sitemap.ts` to verify proxyPrefixes state |
| **E11** | Current proxy.ts GONE_PATTERNS | Read `src/proxy.ts` to verify current patterns |
| **E12** | Vercel deployment log between July 20-29 | Vercel dashboard → Deployments → Check if new build was deployed |

---

## 8. Board Sign-Off

| Role | Verdict |
|---|---|
| Google Search Quality Engineer | 3 APPROVED, 8 NEED EVIDENCE, 6 REJECTED |
| Technical SEO Architect | GROUP A safe. GROUP B needs validation. GROUP C needs experiments. |
| Indexing Systems Engineer | No changes will degrade indexing. Most "issues" are non-issues. |
| Search Infrastructure Engineer | Sitemap filter sync is the only infrastructure change. Low risk. |
| Information Retrieval Specialist | Content improvement requires SERP evidence before investment. |
| Crawl Budget Specialist | Fixing robots.txt is the single highest-impact crawl budget improvement. |
| Search Quality Rater | No evidence of spam or quality violations. Site quality adequate. |
| Technical Product Reviewer | Business decisions needed before any product page changes. |

---

**Effective immediately:** GROUP A recommendations may proceed to implementation. All other recommendations require additional evidence as specified in the Missing Evidence Registry (section 7). No further SEO analysis is needed before GROUP A implementation.
