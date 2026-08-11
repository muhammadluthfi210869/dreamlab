# 🏗️ Implementation Blueprint — Dreamlab.id

**Date:** 2026-07-31
**Author:** Principal Technical SEO Architect & Search Infrastructure Lead
**Status:** ENGINEERING BLUEPRINT — NOT YET EXECUTED
**Audit Phase:** ✅ CLOSED
**Implementation Phase:** 📋 PLANNING COMPLETE

---

## Document Structure

| Section | Description |
|---|---|
| 1. Executive Summary | Strategic overview, expected outcomes, success definition |
| 2. Master Implementation List | Every approved recommendation with full specification |
| 3. Implementation Priority Matrix | Ranked by business impact, effort, risk |
| 4. Dependency Diagram | Visual execution order with gates |
| 5. Sprint Roadmap | 6 sprints with independently deployable units |
| 6. Engineering Task List | Atomic task breakdown per sprint |
| 7. Pre-Implementation Checklist | Baseline verification before any deployment |
| 8. Deployment Checklist | Per-sprint go/no-go checklist |
| 9. Post-Deployment Verification | Per-sprint verification protocol |
| 10. Rollback Plan | Every sprint's recovery procedure |
| 11. Measurement Dashboard | Business metrics baseline + targets |
| 12. Risk Matrix | Probability × severity for every task |
| 13. Validation Gates | Prerequisites for each sprint progression |
| 14. Success Criteria & Definition of Done | When is this project finished? |

---

# 1. Executive Summary

## Context

The audit phase identified **1,540 excluded URLs** in GSC. After investigation, ~1,400 are expected/normal. The real problems are:

| # | Problem | Root Cause | Business Impact |
|---|---|---|---|
| 1 | 3 product categories blocked by robots.txt | Over-aggressive config from migration | Lost commercial landing pages |
| 2 | ~70 legacy URL duplication (/maklon-/ vs /produk-/) | Migration artifact, both URL spaces active | Diluted link equity, split signals |
| 3 | ~46 articles not indexed | Content quality below Google threshold | Lost organic lead gen |
| 4 | 10 duplicate thankyou pages | Missing canonical on UTM variants | Minor crawl hygiene |
| 5 | Sitemap contains redirecting URLs | sitemap.ts not synced with proxy.ts | Crawl budget waste |
| 6 | /page/2/ conflicting robots | Unknown root cause | Zero business impact |

## Strategic Approach

This implementation follows **Marginal Gain Analysis** from Google Internal Evaluation:

| Rank | Action | Pages Affected | Index Gain | Effort | ROI |
|---|---|---|---|---|---|
| #1 | Fix robots.txt | ~50 | 0%→60-85% | 15 min | 🔴 CRITICAL |
| #2 | Legacy URL consolidation | ~70 | 50%→85% | 30 min | 🟡 HIGH |
| #3 | Sync sitemap filter | ~10 | Crawl hygiene | 15 min | 🟡 MEDIUM |
| #4 | Thankyou canonical | ~10 | Duplicate resolution | 15 min | 🔵 LOW |
| #5 | Improve top 5 articles | 5 | 40%→65% | 20 hours | 🔵 LOW-MED |
| #6 | Improve all 46 articles | 46 | 40%→60% | 100+ hours | 🔵 LOW |

## Expected Business Outcomes

| Metric | Current Baseline | 30-Day Target | 90-Day Target |
|---|---|---|---|
| Commercial pages indexed | ~456 | 500-520 | 540-580 |
| Product category pages indexed | 4 (bodycare/skincare/parfum/haircare) | 7 (all categories) | 7 (all categories) |
| Crawl accessibility (blocked → accessible) | 3 categories blocked | 0 blocked | 0 blocked |
| Legacy URL duplication | ~70 conflicting URLs | 0 (resolved via canonical + redirect) | 0 |
| Organic impressions | Baseline (from GSC) | +10-15% | +20-30% |
| Organic leads | Baseline | Monitor | +15-25% (est.) |

## What We Are NOT Doing

| Action | Reason |
|---|---|
| Filter generateStaticParams() for SEO | Evidence shows 686/732 CNI = static assets, not programmatic pages |
| Add noindex to reduce "excluded" count | Misunderstands GSC categorization |
| Filter articles <200 words | Problem does not exist (0 articles in that range) |
| Bulk 410 verification (318 candidates) | Cannot evaluate without URL list and backlink data |
| Chase fragment URLs as high priority | Google handles via canonical; previous analysis downgraded |

---

# 2. Master Implementation List

Every recommendation approved or conditionally approved from all previous reports.

## Group A — Approved (Safe to Implement)

| ID | Title | Source |
|---|---|---|
| **A1** | Sync sitemap.ts proxyPrefixes with proxy.ts GONE_PATTERNS | Engineering Verification Board ✅ |
| **A2** | Add self-canonical to /ads/thankyou/metaads/ template | Engineering Verification Board ✅ |
| **A3** | Submit sitemap to GSC + establish weekly monitoring | Engineering Verification Board ✅ |

## Group B — Requires Validation Before Implementation

| ID | Title | Source | Evidence Needed |
|---|---|---|---|
| **B1** | Fix robots.txt — remove 3 Disallow rules | Google Internal Eval, RCA | E1, E2 (content audit + business sign-off) |
| **B2** | Product sub-page indexing strategy | Engineering Verification Board | E1, E2 (content audit + business decision) |
| **B3** | Fix /page/2/ conflicting robots meta | Engineering Verification Board | E12 (root cause investigation) |

## Group C — Requires Experimentation

| ID | Title | Source | Evidence Needed |
|---|---|---|---|
| **C1** | Improve content of ~46 non-indexed articles | Google Internal Eval, RCA | E3, E4, E5 (SERP comparison, depth audit, internal links) |
| **C2** | Rewrite 66 titles/metas | Engineering Verification Board | E7 (SERP positions + competitor analysis) |
| **C3** | Remove /ads/ from validRoutePrefixes | Engineering Verification Board | E6 (full /ads/ URL inventory), depends on A2 completion |

## Evidence Registry (from Engineering Verification Board)

| ID | Evidence Needed | Method | Owner | ETA |
|---|---|---|---|---|
| E1 | Content audit of /produk/babycare/, /decorative/, /footcare/ | Manual page review + compare to indexed categories | SEO Lead | Sprint 0 |
| E2 | Business decision on product sub-page indexing | Stakeholder meeting | Product Owner | Sprint 0 |
| E3 | SERP comparison for 5 priority non-indexed articles | Manual SERP analysis | Content Lead | Sprint 0 |
| E4 | Content depth audit for 46 non-indexed pages | Word count + entity audit (sample 10 pages) | Content Lead | Sprint 0 |
| E5 | Internal link profile for 46 non-indexed pages | Crawl tool or GSC internal links report | SEO Lead | Sprint 0 |
| E6 | Full inventory of /ads/ URLs | GSC filter + site crawl | SEO Lead | Sprint 0 |
| E7 | Current SERP positions for 66 zero-click pages | GSC Performance export | SEO Lead | Sprint 0 |
| E12 | Root cause of /page/2/ generation | Code inspection of catch-all routes | Engineering Lead | Sprint 0 |

---

# 3. Implementation Priority Matrix

## Business Impact vs Effort

```
                          HIGH EFFORT
                              │
                              │
                   C1 (46 articles)    C2 (66 titles)
                   ┌──────────────────┐
                   │                  │
                   │   LOW IMPACT     │   HIGH IMPACT
                   │                  │
                   └──────────────────┘
                   B2 (strategy)      B1 (robots.txt)
                   A2 (canonical)     A1 (sitemap)
                   A3 (submit)        B3 (/page/2/)
                   C3 (/ads/)
                              │
                              │
                          LOW EFFORT
```

## Ranked Priority List

| Rank | ID | Action | Impact | Effort | Risk | Sprint |
|---|---|---|---|---|---|---|
| 1 | B1 | Fix robots.txt | HIGH | 15 min | MEDIUM | Sprint 1 |
| 2 | A1 | Sync sitemap filter | MEDIUM | 15 min | LOW | Sprint 1 |
| 3 | A2 | Thankyou canonical | MEDIUM | 15 min | VERY LOW | Sprint 1 |
| 4 | A3 | Submit sitemap + monitor | MEDIUM | 30 min | NONE | Sprint 1 |
| 5 | B2 | Product sub-page strategy | HIGH | 2-4 hours | LOW | Sprint 2 |
| 6 | B3 | Fix /page/2/ | LOW | 30 min | VERY LOW | Sprint 2 |
| 7 | C1 | Improve top 5 articles | MED-HIGH | 20 hours | LOW-MED | Sprint 3 |
| 8 | C1 | Improve remaining articles | MEDIUM | 80+ hours | LOW | Sprint 4 |
| 9 | C2 | Rewrite 66 titles/metas | LOW-MED | 8 hours | LOW | Sprint 5 |
| 10 | C3 | Remove /ads/ from prefixes | LOW | 15 min | LOW | After A2 |

---

# 4. Dependency Diagram

```
Sprint 0: FOUNDATION
┌─────────────────────────────────────────────┐
│  Gather Evidence (E1-E12)                   │
│  Establish Baselines (measurements)         │
│  Backup Current Configs                     │
└──────────┬──────────────────────────────────┘
           │
           ▼
Sprint 1: INFRASTRUCTURE + INDEXABILITY
┌─────────────────────────────────────────────┐
│  A1: Sync sitemap filter                    │
│  A2: Add thankyou canonical                 │
│  A3: Submit sitemap + monitoring            │
│  B1: Fix robots.txt (if evidence passes)    │
└──────────┬──────────────────────────────────┘
           │
           ▼
Sprint 2: CONSOLIDATION
┌─────────────────────────────────────────────┐
│  B2: Product sub-page strategy              │
│  B3: Fix /page/2/                           │
│  Legacy URL canonical/redirect plan         │
└──────────┬──────────────────────────────────┘
           │
           ▼
Sprint 3: CONTENT (PRIORITY)
┌─────────────────────────────────────────────┐
│  C1: Improve top 5 commercial articles      │
│  Request indexing via GSC                   │
│  Monitor index status                       │
└──────────┬──────────────────────────────────┘
           │
           ▼
Sprint 4: CONTENT (SCALE)
┌─────────────────────────────────────────────┐
│  C1: Improve remaining 41 articles          │
│  Internal link optimization                 │
│  Content gap analysis implementation        │
└──────────┬──────────────────────────────────┘
           │
           ▼
Sprint 5: OPTIMIZATION
┌─────────────────────────────────────────────┐
│  C2: Rewrite 66 titles/metas                │
│  C3: Remove /ads/ from prefixes (if ready)  │
│  Final monitoring + reporting               │
└─────────────────────────────────────────────┘
```

## Gate Requirements

| Gate | From → To | Must Be True |
|---|---|---|
| G1 | Sprint 0 → Sprint 1 | Evidence E1, E2 gathered. Baselines recorded. |
| G2 | Sprint 1 → Sprint 2 | All Sprint 1 deployments verified. No regressions. |
| G3 | Sprint 2 → Sprint 3 | Product strategy decided. Canonical mapping documented. |
| G4 | Sprint 3 → Sprint 4 | Top 5 articles improved AND either indexed or submitted for indexing. |
| G5 | Sprint 4 → Sprint 5 | 46 articles complete. SERP positions improving or stable. |
| G6 | Sprint 5 → DONE | All implementations verified. Measurement dashboard populated. |

---

# 5. Sprint Roadmap

## Sprint 0: Foundation & Evidence Gathering

**Goal:** Establish baselines, gather missing evidence, prepare for safe implementation.

**Duration:** 2-3 days
**Dependencies:** None (starting from zero)
**Risk:** NONE (no production changes)

### Tasks

| Task | Description | Owner | ETA |
|---|---|---|---|
| S0.1 | Read current robots.txt and save backup | Eng Lead | Day 1 |
| S0.2 | Read current sitemap.ts source code | Eng Lead | Day 1 |
| S0.3 | Read current proxy.ts GONE_PATTERNS | Eng Lead | Day 1 |
| S0.4 | Export current GSC Performance data (full 16-month) | SEO Lead | Day 1 |
| S0.5 | Export current GSC Page Indexing data | SEO Lead | Day 1 |
| S0.6 | Record baseline indexed pages count | SEO Lead | Day 1 |
| S0.7 | Record baseline organic impressions (30-day avg) | SEO Lead | Day 1 |
| S0.8 | Record baseline organic clicks (30-day avg) | SEO Lead | Day 1 |
| S0.9 | Record baseline commercial keyword rankings (top 20) | SEO Lead | Day 1 |
| S0.10 | Record baseline organic leads (from CRM) | Product Owner | Day 1 |
| S0.11 | **E1:** Content audit of /produk/babycare/, /decorative/, /footcare/ vs indexed categories | SEO Lead | Day 2 |
| S0.12 | **E2:** Business meeting — product sub-page indexing decision | Product Owner | Day 2 |
| S0.13 | **E3:** SERP comparison for 5 priority non-indexed articles | Content Lead | Day 2 |
| S0.14 | **E4:** Content depth audit for 10 sample non-indexed pages | Content Lead | Day 2 |
| S0.15 | **E5:** Internal link profile for 46 non-indexed pages | SEO Lead | Day 2 |
| S0.16 | **E6:** Full inventory of /ads/ URLs | SEO Lead | Day 2 |
| S0.17 | **E7:** SERP positions for 66 zero-click pages | SEO Lead | Day 2 |
| S0.18 | **E12:** Investigate /page/2/ generation (code inspection) | Eng Lead | Day 2 |
| S0.19 | Document current sitemap URL count and contents | SEO Lead | Day 2 |
| S0.20 | Document current redirect chain for /maklon-*/ paths | Eng Lead | Day 2 |
| S0.21 | Create Measurement Dashboard (spreadsheet or tracking doc) | SEO Lead | Day 2 |

### Sprint 0 Deliverables

1. ✅ Baseline metrics recorded
2. ✅ Evidence E1-E7, E12 gathered
3. ✅ Robots.txt backed up
4. ✅ Sitemap.ts and proxy.ts snapshots saved
5. ✅ Business sign-off obtained for product sub-page strategy
6. ✅ Measurement dashboard created
7. ✅ Gate G1 passed (can proceed to Sprint 1)

---

## Sprint 1: Infrastructure & Indexability

**Goal:** Fix robots.txt, sync sitemap filter, add thankyou canonical, establish monitoring.

**Duration:** 1 day
**Dependencies:** Sprint 0 complete (evidence E1, E2 gathered)
**Risk:** LOW-MEDIUM
**Business Impact:** HIGH (unblocks 50 pages)

### Tasks

| ID | Task | Description | Est. Time |
|---|---|---|---|
| **A1.1** | Open sitemap.ts | Read current proxyPrefixes array | 5 min |
| **A1.2** | Add missing patterns to proxyPrefixes | Add: `thankyou-page`, `thankyoupage-google`, `google-ads/`, `e-floating-buttons/`, `maklon-body-care/`, `maklon-baby-care/`, `maklon-decorative/`, `maklon-foot-care/`. Do NOT add `/produk/babycare/`, `/produk/decorative/`, `/produk/footcare/`. | 5 min |
| **A1.3** | Deploy sitemap.ts change | Vercel deploy | 5 min |
| **A1.4** | Verify sitemap.xml after deploy | Check no redirecting/410 URLs remain | 5 min |
| **A1.5** | Submit updated sitemap to GSC | Manual submission | 2 min |
| | | | |
| **A2.1** | Locate thankyou page template | Find template for /ads/thankyou/metaads/ | 10 min |
| **A2.2** | Add canonical tag to template | `<link rel="canonical" href="https://dreamlab.id/ads/thankyou/metaads/" />` in `<head>` | 5 min |
| **A2.3** | Verify canonical renders on live page | Curl / check rendered HTML | 5 min |
| | | | |
| **A3.1** | Submit sitemap to GSC (if not done) | GSC → Sitemaps → Add sitemap URL | 2 min |
| **A3.2** | Set up weekly GSC monitoring schedule | Calendar recurrence every Monday | 5 min |
| **A3.3** | Create GSC monitoring checklist | What to check each week (see Section 11) | 15 min |
| | | | |
| **B1.1** | Review E1 and E2 evidence | Confirm content audit passed AND business signed off | 5 min |
| **B1.2** | Open robots.txt | Read current file | 2 min |
| **B1.3** | Remove Disallow lines for 3 product paths | Remove: `Disallow: /produk/babycare/`, `Disallow: /produk/decorative/`, `Disallow: /produk/footcare/`. Keep: `Disallow: /produk/pkrt/`. Keep: `Disallow: /_next/static/`. | 2 min |
| **B1.4** | Validate robots.txt syntax | Use Google's robots.txt tester or tool | 3 min |
| **B1.5** | Deploy robots.txt | Vercel deploy | 5 min |
| **B1.6** | Verify robots.txt live | Curl robots.txt, confirm rules removed | 3 min |
| **B1.7** | Submit updated robots.txt to GSC | GSC → Settings → robots.txt → Submit | 2 min |
| **B1.8** | Request indexing for unblocked category pages | GSC URL Inspection → Request Indexing for /produk/babycare/, /produk/decorative/, /produk/footcare/ | 3 min |

### Expected Result After Sprint 1

| Metric | Before | After (30 min post-deploy) |
|---|---|---|
| Product categories blocked by robots.txt | 3 | 0 |
| Sitemap redirecting parent URLs | 4+ | 0 |
| Thankyou duplicate without canonical | 10 | 0 (consolidated) |
| Sitemap submitted to GSC | Maybe | Yes |
| Monitoring established | No | Yes |

### Sprint 1 Gate (G2)

✅ All deployments verified (Section 9)
✅ No regressions found
✅ Can proceed to Sprint 2

---

## Sprint 2: Consolidation & Cleanup

**Goal:** Resolve legacy URL duplication, product sub-page strategy, fix /page/2/.

**Duration:** 1-2 days
**Dependencies:** Sprint 1 complete, B2 evidence (E1, E2) complete
**Risk:** LOW

### Tasks

| ID | Task | Description | Est. Time |
|---|---|---|---|
| **B2.1** | If decision = INDEX sub-pages: | Remove noindex from babycare/decorative sub-pages | 15 min |
| **B2.2** | If decision = NOINDEX sub-pages: | Document decision, ensure parent categories are canonical | 15 min |
| **B2.3** | Add canonical from /maklon-*/ child to /produk-*/ child | For all /maklon-*/ page that has a /produk-*/ equivalent | 30 min |
| **B2.4** | Verify no conflicting meta on any product page | Crawl all /produk/*/*/ pages, check robots meta | 15 min |
| | | | |
| **B3.1** | Implement fix based on E12 investigation | Either: add to GONE_PATTERNS (if catch-all artifact), fix template (if template bug), or add proper noindex + canonical | 15 min |
| **B3.2** | Verify fix | Curl /page/2/, check robots meta | 5 min |
| | | | |
| **B2.5** | Document canonical mapping | Create mapping table: /maklon-*/*/ → /produk-*/*/ | 15 min |
| **B2.6** | Deploy all changes | Vercel deploy | 5 min |

### Expected Result After Sprint 2

| Metric | Before | After |
|---|---|---|
| URL duplication (maklon-*/ vs produk-*/) | ~70 conflicting | Resolved via canonical + redirect |
| Product sub-page strategy | Inconsistent | Documented and consistent |
| /page/2/ meta | Conflicting | Clean (or 410'd) |
| Canonical mapping | Undocumented | Documented |

### Sprint 2 Gate (G3)

✅ Product strategy decided and documented
✅ Canonical mapping documented
✅ All deployments verified
✅ Can proceed to Sprint 3

---

## Sprint 3: Content — Priority Articles

**Goal:** Improve top 5 highest-potential articles and get them indexed.

**Duration:** 1 week
**Dependencies:** Sprint 2 complete, evidence E3, E4, E5 gathered
**Risk:** LOW-MEDIUM (time investment risk)

### Priority Articles (from RCA + Google Internal Eval)

| Rank | URL | Current Index | Search Intent | Business Value |
|---|---|---|---|---|
| 1 | /perusahaan-maklon-kosmetik/ | NOT indexed | Commercial — company research | HIGH |
| 2 | /maklon-kosmetik-tangerang-terpercaya | NOT indexed | Commercial — local search | HIGH |
| 3 | /rekomendasi-maklon-kosmetik-terbaik-dreamlab/ | NOT indexed | Commercial — comparison (needs objective data) | HIGH |
| 4 | /bisnis-kosmetik-dari-nol/ | NOT indexed | Informational → Commercial | MEDIUM |
| 5 | /solusi-bisnis-body-serum-aha-2025-tren-pasar-maklon-dreamlab/ | NOT indexed | Trend → Commercial | MEDIUM |

### Tasks

| ID | Task | Description | Est. Time |
|---|---|---|---|
| **C1.1** | SERP gap analysis for each priority article | Compare Dreamlab vs Top 3 competitors for target query | 2 hours |
| **C1.2** | Content rewrite plan per article | Outline: word count target, entities to add, trust signals, schema | 1 hour |
| **C1.3** | Rewrite Article #1 | /perusahaan-maklon-kosmetik/ — target: 1500+ words, company profile, certifications, process, testimonials, FAQ | 4 hours |
| **C1.4** | Rewrite Article #2 | /maklon-kosmetik-tangerang-terpercaya/ — target: local-specific content, testimonials, nearby facilities | 4 hours |
| **C1.5** | Rewrite Article #3 | /rekomendasi-maklon-kosmetik-terbaik-dreamlab/ — add objective comparison data (not just self-promotion) | 3 hours |
| **C1.6** | Rewrite Article #4 | /bisnis-kosmetik-dari-nol/ — comprehensive startup guide | 3 hours |
| **C1.7** | Rewrite Article #5 | /solusi-bisnis-body-serum-aha-2025/ — update with latest data | 3 hours |
| **C1.8** | Add schema markup | Organization, Article, FAQ schema where applicable | 1 hour |
| **C1.9** | Improve internal linking | Link from homepage, services, and category pages to these articles | 30 min |
| **C1.10** | Deploy content changes | Vercel deploy | 5 min |
| **C1.11** | Request indexing via GSC | GSC URL Inspection → Request Indexing for each article | 5 min |

### Expected Result After Sprint 3

| Metric | Before | After (2-4 weeks) |
|---|---|---|
| Priority articles indexed | 0/5 | 2-3/5 |
| Organic impressions for target queries | Baseline | +10-20% |
| Content depth (avg word count) | ~500-800 words | ~1500+ words |

### Sprint 3 Gate (G4)

✅ Top 5 articles rewritten and deployed
✅ Indexing requested via GSC
✅ Can proceed to Sprint 4

---

## Sprint 4: Content — Scale

**Goal:** Apply content improvements to remaining 41 non-indexed articles.

**Duration:** 2-3 weeks
**Dependencies:** Sprint 3 complete, lessons learned applied
**Risk:** MEDIUM (significant time investment)

### Tasks

| ID | Task | Description | Est. Time |
|---|---|---|---|
| **C1.12** | Categorize remaining 41 articles by priority | Commercial > Informational > Thin | 1 hour |
| **C1.13** | Set minimum content standards | Target: 1000+ words, unique entity coverage, trust signals | 30 min |
| **C1.14** | Batch 1 (10 articles — commercial+educational) | Rewrite to standards | 20 hours |
| **C1.15** | Batch 2 (10 articles) | Rewrite to standards | 20 hours |
| **C1.16** | Batch 3 (10 articles) | Rewrite to standards | 20 hours |
| **C1.17** | Batch 4 (11 articles) | Rewrite to standards | 22 hours |
| **C1.18** | Index check for batch 1 articles | GSC URL Inspection | 10 min |
| **C1.19** | Request indexing for improved articles | GSC bulk inspection | 30 min |
| **C1.20** | Monitor index rate | Track weekly in dashboard | Ongoing |

### Expected Result After Sprint 4

| Metric | Before | After (4-8 weeks) |
|---|---|---|
| Non-indexed articles | 46 | 15-25 |
| Indexed articles (from previously non-indexed) | 0 | 21-31 |
| Organic impressions (article queries) | Baseline | +20-40% |

### Sprint 4 Gate (G5)

✅ All 46 articles improved to minimum standards
✅ Indexing requested for all improved articles
✅ Can proceed to Sprint 5

---

## Sprint 5: Optimization

**Goal:** Title/meta rewrites, /ads/ cleanup, final monitoring.

**Duration:** 3-5 days
**Dependencies:** Sprint 4 complete, evidence E7 (SERP positions) available
**Risk:** VERY LOW

### Tasks

| ID | Task | Description | Est. Time |
|---|---|---|---|
| **C2.1** | Analyze SERP position data for 66 zero-click pages | Identify which have Top 10 potential | 1 hour |
| **C2.2** | Competitor title/meta analysis | Compare Dreamlab titles vs Top 3 for target queries | 2 hours |
| **C2.3** | Search intent mapping | Ensure title matches user intent (informational, commercial, transactional) | 1 hour |
| **C2.4** | Batch rewrite 33 titles/metas (highest potential) | Write compelling, intent-aligned titles | 2 hours |
| **C2.5** | Deploy title/meta changes | Vercel deploy | 5 min |
| **C2.6** | Monitor CTR change | Track in GSC Performance (2-week observation) | Ongoing |
| **C2.7** | If positive CTR delta: rewrite remaining 33 | Repeat C2.4-C2.6 | 2 hours |
| **C2.8** | If no CTR delta: stop, document finding | Not every title change improves CTR | 30 min |
| | | | |
| **C3.1** | Audit all /ads/ URLs (E6 data) | Confirm which have content vs. are disposable | 30 min |
| **C3.2** | Add /ads/ to proxyPrefixes (if approved) | sitemap.ts update | 5 min |
| **C3.3** | Verify /ads/ URLs return proper status | 200 (if has content) or 410 (if disposable) | 10 min |

### Expected Result After Sprint 5

| Metric | Before | After |
|---|---|---|
| Titles/metas optimized for CTR | 66 with 0 clicks | Improved CTR expectation |
| /ads/ URLs in sitemap | Present (if any) | Resolved |
| Overall organic clicks | Baseline | +5-15% (if titles successful) |

### Sprint 5 Gate (G6)

✅ All implementations verified
✅ Measurement dashboard populated with final data
✅ Definition of Done evaluated

---

# 6. Engineering Task List (Atomic)

## A1: Sync Sitemap Filter

```
A1.1 [5 min] Read current sitemap.ts proxyPrefixes array
  └─ File: src/app/sitemap.ts
  └─ Verify current state against proxy.ts GONE_PATTERNS

A1.2 [5 min] Add missing patterns to proxyPrefixes
  └─ Add: 'thankyou-page'
  └─ Add: 'thankyoupage-google'
  └─ Add: 'google-ads/'
  └─ Add: 'e-floating-buttons/'
  └─ Add: 'maklon-body-care/'
  └─ Add: 'maklon-baby-care/'
  └─ Add: 'maklon-decorative/'
  └─ Add: 'maklon-foot-care/'
  └─ DO NOT ADD: /produk/babycare/
  └─ DO NOT ADD: /produk/decorative/
  └─ DO NOT ADD: /produk/footcare/

A1.3 [5 min] Deploy sitemap.ts change
  └─ git add src/app/sitemap.ts
  └─ git commit -m "fix(sitemap): sync proxyPrefixes with GONE_PATTERNS"
  └─ git push (auto-deploy on Vercel)

A1.4 [5 min] Verify sitemap.xml after deploy
  └─ curl https://dreamlab.id/sitemap.xml | grep -i "maklon-body-care"
  └─ curl https://dreamlab.id/sitemap.xml | grep -i "maklon-baby-care"
  └─ curl https://dreamlab.id/sitemap.xml | grep -i "thankyou"
  └─ Assert: all patterns above should NOT appear in sitemap

A1.5 [2 min] Submit updated sitemap to GSC
  └─ GSC → Sitemaps → Enter sitemap URL
  └─ Confirm "Submitted" status
```

## A2: Thankyou Page Canonical

```
A2.1 [10 min] Locate thankyou page template
  └─ Search codebase for template rendering /ads/thankyou/
  └─ File likely: src/app/ads/thankyou/*/page.tsx or similar

A2.2 [5 min] Add canonical tag
  └─ Insert in <head>:
       <link rel="canonical" href="https://dreamlab.id/ads/thankyou/metaads/" />

A2.3 [5 min] Verify
  └─ curl -s https://dreamlab.id/ads/thankyou/metaads/ | grep canonical
  └─ curl -s "https://dreamlab.id/ads/thankyou/metaads/?source=meta-parfum" | grep canonical
  └─ Assert: both return same canonical URL
```

## A3: Submit Sitemap + Monitoring

```
A3.1 [2 min] Submit sitemap
  └─ GSC → Property: dreamlab.id (or www.dreamlab.id) → Sitemaps
  └─ Add: https://dreamlab.id/sitemap.xml

A3.2 [5 min] Create weekly monitoring schedule
  └─ Calendar recurrence: Every Monday, 9:00 AM
  └─ Checklist to review:
       ├─ GSC → Index → Page indexing: check "not indexed" trend
       ├─ GSC → Performance: check impressions/clicks trend
       ├─ GSC → Sitemaps: confirm sitemap status
       ├─ GSC → URL Inspection: spot-check 3 recent pages
       └─ robots.txt: confirm no unexpected changes

A3.3 [15 min] Create monitoring document
  └─ Location: docs/seo problem and plan/WEEKLY-MONITORING-CHECKLIST.md
```

## B1: Fix Robots.txt

```
B1.1 [5 min] Review evidence E1 and E2
  └─ E1: Content audit confirms pages are index-worthy
  └─ E2: Business sign-off obtained
  └─ IF EITHER FAILS: HALT. Do not proceed. Escalate.

B1.2 [2 min] Open robots.txt
  └─ File: public/robots.txt (or root)

B1.3 [2 min] Remove Disallow lines
  └─ Remove: Disallow: /produk/babycare/
  └─ Remove: Disallow: /produk/decorative/
  └─ Remove: Disallow: /produk/footcare/
  └─ KEEP:   Disallow: /produk/pkrt/
  └─ KEEP:   Disallow: /_next/static/
  └─ KEEP:   All other existing rules

B1.4 [3 min] Validate syntax
  └─ Use: https://support.google.com/webmasters/answer/6062598
  └─ Or: https://toolbox.googleapps.com/apps/robots-tester/

B1.5 [5 min] Deploy robots.txt
  └─ git add public/robots.txt
  └─ git commit -m "fix(robots): unblock produk/babycare, decorative, footcare"
  └─ git push

B1.6 [3 min] Verify live
  └─ curl https://dreamlab.id/robots.txt
  └─ Assert: Disallow: /produk/babycare/ NOT present
  └─ Assert: Disallow: /produk/decorative/ NOT present
  └─ Assert: Disallow: /produk/footcare/ NOT present
  └─ Assert: Disallow: /produk/pkrt/ STILL present
  └─ Assert: Disallow: /_next/static/ STILL present

B1.7 [2 min] Submit updated robots.txt to GSC
  └─ GSC → Settings → Crawling → robots.txt → Submit

B1.8 [3 min] Request indexing for unblocked pages
  └─ GSC → URL Inspection → Enter: https://dreamlab.id/produk/babycare/
  └─ GSC → URL Inspection → Enter: https://dreamlab.id/produk/decorative/
  └─ GSC → URL Inspection → Enter: https://dreamlab.id/produk/footcare/
  └─ Click "Request Indexing" for each
```

## B2: Product Sub-page Strategy

```
B2.1 [15 min] If decision = INDEX sub-pages:
  └─ Remove noindex from /produk/babycare/*/ pages
  └─ Remove noindex from /produk/decorative/*/ pages
  └─ Ensure index,follow on all sub-pages

B2.2 [15 min] If decision = NOINDEX sub-pages:
  └─ Document the decision in docs/seo strategy/
  └─ Ensure all noindexed sub-pages have canonical to parent category
  └─ Add canonical: /produk/babycare/baby-oil/ → /produk/babycare/

B2.3 [30 min] Add canonical from /maklon-*/ to /produk-*/
  └─ Mapping table (all /maklon-*/ URLs → /produk-*/ equivalent)
  └─ Implement in template/page logic

B2.4 [15 min] Verify no conflicting meta
  └─ Crawl 5+ /produk/*/*/ pages via curl
  └─ Assert: all have consistent robots meta
```

## B3: Fix /page/2/

```
B3.1 [15 min] Implement fix based on E12
  └─ If catch-all artifact: add to GONE_PATTERNS in proxy.ts
  └─ If template bug: fix conditional rendering
  └─ If no purpose: add 410 in proxy.ts

B3.2 [5 min] Verify
  └─ curl -s https://dreamlab.id/page/2/ | grep robots
  └─ Assert: clean meta robots (either noindex or index,follow — not both)
```

## C1: Improve Non-Indexed Articles

```
C1.1 [2 hours] SERP gap analysis
  └─ For each of 5 priority articles:
       ├─ Search target query
       ├─ Record Top 3 competitors
       ├─ Compare: word count, entities, schema, trust signals
       └─ Document gap analysis

C1.2 [1 hour] Content rewrite plan
  └─ Per article:
       ├─ Target word count
       ├─ Key entities to cover
       ├─ Trust signals to add
       ├─ Schema types
       └─ Internal link targets

C1.3-C1.7 [17 hours] Rewrite articles
  └─ Article #1: 4 hours
  └─ Article #2: 4 hours
  └─ Article #3: 3 hours
  └─ Article #4: 3 hours
  └─ Article #5: 3 hours

C1.8 [1 hour] Add schema markup
  └─ Organization schema on company pages
  └─ Article schema on blog content
  └─ FAQ schema where applicable

C1.9 [30 min] Improve internal linking
  └─ Link from high-authority pages (homepage, services, about)
  └─ Link from related commercial articles

C1.10-C1.11 [10 min] Deploy + request indexing
```

## C2: Rewrite 66 Titles/Metas

```
C2.1 [1 hour] Analyze E7 data
  └─ Identify which 66 pages have >0 impressions, 0 clicks
  └─ Categorize by: search intent, current title quality, competition level

C2.2 [2 hours] Competitor analysis
  └─ Sample 10 competitor titles for target queries
  └─ Identify patterns: length, keyword placement, value prop, CTAs

C2.3 [1 hour] Search intent mapping
  └─ For each title: does it match searcher intent?
  └─ Category: Informational | Commercial | Transactional | Navigational

C2.4 [2 hours] Rewrite 33 titles (highest potential)
  └─ Apply: compelling value prop, keyword in natural position, 50-60 chars

C2.6 [Ongoing] Monitor CTR
  └─ Track in GSC Performance
  └─ Evaluate after 2 weeks
```

## C3: Remove /ads/ from Valid Route Prefixes

```
C3.1 [30 min] Audit /ads/ URLs
  └─ Review E6 data (full inventory)
  └─ Confirm which have content vs. disposable

C3.2 [5 min] Add /ads/ to proxyPrefixes (if approved)
  └─ sitemap.ts: add 'ads/' to proxyPrefixes array

C3.3 [10 min] Verify
  └─ Check sitemap: ads/ URLs removed
  └─ Check live: /ads/ URLs return proper status
```

---

# 7. Pre-Implementation Checklist

Before ANY deployment in ANY sprint, verify:

## A. Current Backup

| Item | Status | Notes |
|---|---|---|
| Current robots.txt backed up | ☐ | Location: `docs/seo problem and plan/backups/robots.txt.bak` |
| Current sitemap.ts backed up | ☐ | Location: `docs/seo problem and plan/backups/sitemap.ts.bak` |
| Current proxy.ts backed up | ☐ | Location: `docs/seo problem and plan/backups/proxy.ts.bak` |

## B. Current Sitemap

| Item | Status | Notes |
|---|---|---|
| Current sitemap URL count recorded | ☐ | Count: ____ |
| Sitemap downloaded and saved | ☐ | Location: `docs/seo problem and plan/backups/sitemap.xml` |

## C. Current robots.txt

| Item | Status | Notes |
|---|---|---|
| Current robots.txt rules documented | ☐ | See backup file |

## D. Canonical Mapping

| Item | Status | Notes |
|---|---|---|
| Current canonical strategy documented | ☐ | Self-canonical for most pages |
| Known redirect chains documented | ☐ | www → non-www, trailing slash |

## E. Current GSC Status

| Item | Status | Notes |
|---|---|---|
| Total indexed pages recorded | ☐ | Current: ____ |
| Total "not indexed" recorded | ☐ | Current: ____ |
| Total "blocked by robots.txt" recorded | ☐ | Current: ____ |
| Total "duplicate without canonical" recorded | ☐ | Current: ____ |

## F. Current Organic Traffic

| Item | Status | Notes |
|---|---|---|
| 30-day organic impressions baseline | ☐ | Number: ____ |
| 30-day organic clicks baseline | ☐ | Number: ____ |
| 30-day organic CTR baseline | ☐ | Percent: ____ |
| 30-day average position baseline | ☐ | Position: ____ |

## G. Current Rankings (Top 20 Commercial Keywords)

| Item | Status | Notes |
|---|---|---|
| Top 20 keyword positions recorded | ☐ | See measurement dashboard |

## H. Current Leads

| Item | Status | Notes |
|---|---|---|
| 30-day organic lead count baseline | ☐ | Number: ____ (from CRM) |
| 30-day organic lead value baseline | ☐ | Value: ____ (if tracked) |

---

# 8. Deployment Checklist (Per Sprint)

## Before Deployment

| Item | Check |
|---|---|
| All code changes reviewed | ☐ |
| All evidence gates passed (see Section 13) | ☐ |
| Pre-implementation checklist completed | ☐ |
| Rollback plan prepared (see Section 10) | ☐ |
| Business sign-off obtained (if sprint requires it) | ☐ |
| Deployment window: low-traffic time selected | ☐ |
| No other deployments in progress | ☐ |

## During Deployment

| Item | Check |
|---|---|
| git add all changed files | ☐ |
| git commit with descriptive message | ☐ |
| git push to trigger Vercel auto-deploy | ☐ |
| Monitor Vercel deploy status | ☐ |
| Confirm deploy successful (green) | ☐ |

## After Deployment

| Item | Check |
|---|---|
| Post-deployment verification passed (Section 9) | ☐ |
| Rollback not needed | ☐ |
| Measurement metrics updated | ☐ |

---

# 9. Post-Deployment Verification (Per Sprint)

## Universal Checks (Every Sprint)

| Check | Method | Expected | Actual |
|---|---|---|---|
| robots.txt | `curl https://dreamlab.id/robots.txt` | No unexpected changes | ☐ |
| sitemap.xml | `curl https://dreamlab.id/sitemap.xml \| head -50` | Valid XML, correct URLs | ☐ |
| Status code | `curl -o /dev/null -s -w '%{http_code}' https://dreamlab.id/` | 200 | ☐ |
| Canonical | `curl -s https://dreamlab.id/ \| grep canonical` | Self-referencing | ☐ |
| Meta robots | `curl -s https://dreamlab.id/ \| grep -i "name=\"robots\""` | index, follow | ☐ |
| No broken links | Spot check 3 internal links | 200 OK | ☐ |
| Redirect chain | Check 3 known redirect paths | Max 1 hop | ☐ |
| Duplicate URLs | Check www → non-www for 3 pages | Consistent | ☐ |
| Server response | `curl -s -o /dev/null -w '%%{time_total}' https://dreamlab.id/` | < 2s | ☐ |

## Sprint 1 Specific Verification

| Check | Method | Expected |
|---|---|---|
| robots.txt no longer blocks product cats | `curl https://dreamlab.id/robots.txt \| grep -i "produk/babycare"` | NOT FOUND |
| Sitemap no longer contains redirecting parents | `curl https://dreamlab.id/sitemap.xml \| grep -i "maklon-body-care"` | NOT FOUND |
| Thankyou page has canonical | `curl -s https://dreamlab.id/ads/thankyou/metaads/ \| grep canonical` | Present + self |
| Sitemap submitted to GSC | GSC → Sitemaps | Status: "Submitted" |

## Sprint 2 Specific Verification

| Check | Method | Expected |
|---|---|---|
| No conflicting robots meta on any product page | Curl 5 random /produk/*/*/ pages | Single meta robots tag |
| /page/2/ meta clean | `curl -s https://dreamlab.id/page/2/ \| grep robots` | Single clear directive |
| Maklon-* test page redirects to canonical | `curl -I https://dreamlab.id/maklon-body-care/` | 301 Location: /produk/bodycare/ |

## Sprint 3-4 Specific Verification

| Check | Method | Expected |
|---|---|---|
| Improved articles show updated content | View rendered HTML | Longer, richer content |
| Schema markup present | `curl -s [article-url] \| grep "application/ld+json"` | Present |
| Internal links added | Check article for links from homepage/services | Links present |
| Indexing requested | GSC URL Inspection | "Requested" status |

## Sprint 5 Specific Verification

| Check | Method | Expected |
|---|---|---|
| Updated titles visible | `curl -s [page-url] \| grep -i "<title"` | New title text |
| Meta descriptions updated | `curl -s [page-url] \| grep -i "name=\"description\""` | New meta text |
| /ads/ removed from sitemap (if applicable) | `curl https://dreamlab.id/sitemap.xml \| grep "ads/"` | NOT FOUND |

---

# 10. Rollback Plan

## General Rollback Procedure

**Rollback Trigger (ANY of these):**
- 404 errors on pages that were previously 200
- 500 errors after deployment
- robots.txt incorrectly blocks previously accessible pages
- Sitemap returns errors or invalid XML
- Canonical tags point to wrong URLs
- GSC reports sharp drop in indexed pages (>10% in 24 hours)
- Organic traffic drops >20% in 48 hours

**Rollback Steps:**

| Step | Action | Max Time |
|---|---|---|
| 1 | Identify the commit to revert | 2 min |
| 2 | `git revert <commit-hash>` | 1 min |
| 3 | Resolve conflicts (if any) | 5 min |
| 4 | `git push` to trigger Vercel deploy | 2 min |
| 5 | Verify rollback via Post-Deployment Verification | 5 min |
| 6 | Notify stakeholders | 2 min |
| **Total** | | **17 min** |

**Maximum Recovery Time:** 30 minutes
**Business Risk during rollback:** LOW — reverting to previous known-good state
**SEO Risk during rollback:** LOW — 30 min window is negligible for Google

## Sprint-Specific Rollback

### Sprint 1 Rollback

| Change | Rollback Method | Time |
|---|---|---|
| A1: sitemap.ts change | Revert commit: `git revert <sitemap-commit>` | 17 min |
| A2: thankyou canonical | Revert commit: `git revert <canonical-commit>` | 17 min |
| A3: sitemap submission | No code rollback needed. GSC submission is reversible by submitting old sitemap. | 2 min |
| B1: robots.txt change | **CRITICAL** If unblocking causes crawl issues: revert robots.txt immediately | 17 min |

### Sprint 2 Rollback

| Change | Rollback Method | Time |
|---|---|---|
| B2: sub-page strategy | Revert noindex/canonical changes | 17 min |
| B3: /page/2/ fix | Revert proxy.ts or template change | 17 min |

### Sprint 3-5 Rollback

| Change | Rollback Method | Time |
|---|---|---|
| C1: Content changes | Revert content commits. Note: content is hard to "un-see" by Google once crawled. | 17 min |
| C2: Title changes | Revert title/meta commits | 17 min |
| C3: /ads/ prefix change | Revert sitemap.ts commit | 17 min |

## Rollback Risk Assessment

| Sprint | Rollback Complexity | SEO Risk During Rollback | Business Risk |
|---|---|---|---|
| Sprint 1 | LOW | LOW (changes are reversible) | LOW |
| Sprint 2 | LOW | LOW (no content changes) | LOW |
| Sprint 3 | MEDIUM (content) | LOW-MED (Google may have cached improved content) | LOW |
| Sprint 4 | MEDIUM (content) | LOW-MED | LOW |
| Sprint 5 | LOW | LOW | LOW |

---

# 11. Measurement Dashboard

## Business Metrics

| Metric | Baseline (Sprint 0) | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 | Target |
|---|---|---|---|---|---|---|---|
| Indexed pages (GSC) | ____ | ____ | ____ | ____ | ____ | ____ | 540-580 |
| Total "not indexed" | ____ | ____ | ____ | ____ | ____ | ____ | <100 (excl. static assets) |
| Blocked by robots.txt | ____ | ____ | ____ | ____ | ____ | ____ | 77 (static only) |
| Duplicate without canonical | ____ | ____ | ____ | ____ | ____ | ____ | 0 |
| Organic impressions (30d) | ____ | ____ | ____ | ____ | ____ | ____ | +20-30% |
| Organic clicks (30d) | ____ | ____ | ____ | ____ | ____ | ____ | +15-25% |
| Organic CTR | ____ | ____ | ____ | ____ | ____ | ____ | +1-2% |
| Avg SERP position | ____ | ____ | ____ | ____ | ____ | ____ | Stable or improve |
| Organic leads (30d) | ____ | ____ | ____ | ____ | ____ | ____ | +15-25% |
| Top 20 keyword avg position | ____ | ____ | ____ | ____ | ____ | ____ | Top 10 |

## Technical Metrics

| Metric | Baseline | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 | Target |
|---|---|---|---|---|---|---|---|
| robots.txt blocked product cats | 3 | ____ | ____ | ____ | ____ | ____ | 0 |
| Sitemap redirecting parent URLs | 4+ | ____ | ____ | ____ | ____ | ____ | 0 |
| Product pages with noindex (unintentional) | ~23 | ____ | ____ | ____ | ____ | ____ | 0 |
| /page/2/ meta clean | No | ____ | ____ | ____ | ____ | ____ | Yes |
| /maklon-*/ → /produk-*/ canonical | None | ____ | ____ | ____ | ____ | ____ | All mapped |
| Non-indexed articles | 46 | ____ | ____ | ____ | ____ | ____ | 10-20 |
| 66 zero-click pages improved | 0 | ____ | ____ | ____ | ____ | ____ | 33-66 |

## Weekly Monitoring Checklist (for A3.3)

Every Monday:
- [ ] Check GSC → Index → Page indexing: any anomalies?
- [ ] Check GSC → Performance: impressions, clicks, CTR trends
- [ ] Check GSC → Sitemaps: status OK?
- [ ] Check GSC → URL Inspection: spot-check 3 pages
- [ ] Check robots.txt: no unexpected changes
- [ ] Check sitemap.xml: no unexpected URLs
- [ ] Check indexed pages count: stable or growing?
- [ ] Document findings in weekly log

---

# 12. Risk Matrix

## Per-Task Risk Assessment

| ID | Task | Risk | Probability | Severity | Overall | Mitigation | Fallback |
|---|---|---|---|---|---|---|---|
| A1 | Sync sitemap filter | Accidentally filter valid pages | LOW (15%) | MEDIUM | LOW | Review fix list twice before deploy | Revert commit |
| A2 | Thankyou canonical | Template logic error breaks page | VERY LOW (5%) | MEDIUM | LOW | Test on staging if available | Revert commit |
| A3 | Submit sitemap | None | NONE | NONE | NONE | N/A | N/A |
| B1 | Fix robots.txt | Google crawls thin sub-pages | MEDIUM (35%) | LOW-MED | MEDIUM | Implement after content audit confirms | Revert robots.txt |
| B1 | Fix robots.txt | Crawl budget spike on unblocked URLs | HIGH (60%) | LOW | LOW | Expected transient behavior | Monitor, no action needed |
| B2 | Sub-page strategy | Remove noindex from thin pages, Google still won't index | MEDIUM (40%) | LOW | LOW | Wasted crawl budget only | Add noindex back |
| B3 | Fix /page/2/ | Fix doesn't resolve root cause | LOW (15%) | VERY LOW | NEGLIGIBLE | Non-critical page | No action needed |
| C1 | Article improvement | Improve wrong pages (selection error) | MEDIUM (30%) | MEDIUM | MEDIUM | Start with 5 priority articles, A/B test | Revert content, keep originals |
| C2 | Title rewrites | Titles don't improve CTR | MEDIUM (40%) | LOW | LOW | A/B test on first 33 before scaling | Revert titles |
| C3 | Remove /ads/ | Accidentally remove accessible /ads/ landing pages | LOW (10%) | MEDIUM | LOW | Audit all /ads/ URLs first | Revert commit |

## Cross-Cutting Risks

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Vercel deploy fails | Delayed implementation | LOW (5%) | Check build logs, fix error, redeploy |
| Google algorithm update during implementation | Confounds measurement | LOW (10%) | Run control period before Sprint 0, document external factors |
| Business changes priority mid-implementation | Incomplete sprints | MEDIUM (25%) | Sprints are independently deployable |
| Content audit reveals babycare/decorative are truly thin | B1 blocked, need content work first | MEDIUM (40%) | Already accounted for — Sprint 0 evidence gate catches this |

---

# 13. Validation Gates

## Gate G1: Sprint 0 → Sprint 1

| Condition | Required | Status |
|---|---|---|
| E1: Content audit of blocked product categories complete | YES | ☐ |
| E2: Business decision on product sub-page strategy | YES | ☐ |
| Baseline measurements recorded (Section 11) | YES | ☐ |
| All configs backed up | YES | ☐ |
| If E1 shows thin content: B1 is BLOCKED until content improved | CONTINGENT | ☐ |
| If E2 decides NOINDEX: B2 proceeds with canonical strategy | CONTINGENT | ☐ |
| **Gate Decision** | **ALL MET → Proceed** | **☐** |

## Gate G2: Sprint 1 → Sprint 2

| Condition | Required | Status |
|---|---|---|
| All Sprint 1 deployments verified (Section 9) | YES | ☐ |
| No regressions in crawl accessibility | YES | ☐ |
| robots.txt correctly updated | YES | ☐ |
| Sitemap correctly filtered | YES | ☐ |
| Thankyou canonical correctly added | YES | ☐ |
| **Gate Decision** | **ALL MET → Proceed** | **☐** |

## Gate G3: Sprint 2 → Sprint 3

| Condition | Required | Status |
|---|---|---|
| Product sub-page strategy documented | YES | ☐ |
| Canonical mapping documented | YES | ☐ |
| /page/2/ resolved (or no action needed) | YES | ☐ |
| E3: SERP comparison for 5 articles complete | YES | ☐ |
| E4: Content depth audit complete | YES | ☐ |
| E5: Internal link profile complete | YES | ☐ |
| **Gate Decision** | **ALL MET → Proceed** | **☐** |

## Gate G4: Sprint 3 → Sprint 4

| Condition | Required | Status |
|---|---|---|
| Top 5 articles rewritten and deployed | YES | ☐ |
| Indexing requested via GSC | YES | ☐ |
| Content lessons learned documented (for batch application in Sprint 4) | YES | ☐ |
| No unexpected index drops during Sprint 3 | YES | ☐ |
| **Gate Decision** | **ALL MET → Proceed** | **☐** |

## Gate G5: Sprint 4 → Sprint 5

| Condition | Required | Status |
|---|---|---|
| All 46 articles improved to minimum standards | YES | ☐ |
| Indexing requested for all improved articles | YES | ☐ |
| E7: SERP positions for 66 zero-click pages available | YES | ☐ |
| Sprint 3 articles showing index progress (or at least no regression) | ✅ PREFERRED | ☐ |
| **Gate Decision** | **ALL MET → Proceed** | **☐** |

## Gate G6: Sprint 5 → DONE

| Condition | Required | Status |
|---|---|---|
| All implementations verified (Section 9, final row) | YES | ☐ |
| Measurement dashboard fully populated | YES | ☐ |
| Final documented delivered to stakeholders | YES | ☐ |
| No open regressions | YES | ☐ |
| **Gate Decision** | **ALL MET → Project Complete** | **☐** |

---

# 14. Success Criteria & Definition of Done

## Project Success Criteria

| # | Criterion | Measurement | Target |
|---|---|---|---|
| 1 | All product categories crawlable by Google | GSC "Blocked by robots.txt" | 0 product category URLs blocked |
| 2 | No unintentional noindex on indexable product pages | Crawl of all /produk/*/*/ pages | 0 pages with noindex |
| 3 | Sitemap free of redirecting and 410 URLs | Sitemap URL audit | 0 redirecting/410 URLs |
| 4 | Legacy URL duplication resolved | Canonical mapping verified | All /maklon-/ pages pointed to /produk-/ equivalents |
| 5 | Thankyou duplicates consolidated | GSC "Duplicate without canonical" | < 5 (expected for other pages) |
| 6 | /page/2/ has clean meta | Curl verification | Single robots directive |
| 7 | Top 5 commercial articles indexed | GSC URL Inspection | 3/5 indexed within 4 weeks |
| 8 | 46 non-indexed articles improved | Word count + entity audit | All >1000 words, unique content |
| 9 | Monitoring established | Weekly cadence documented | Active checklist |
| 10 | Measurement baseline recorded | Dashboard populated | All metrics recorded |

## Definition of Done

The project is considered DONE when:

1. ✅ All Sprint Gates (G1-G6) have been passed
2. ✅ All 9 APPROVED + evidence-based recommendations are either:
   - Implemented and verified (Group A, B)
   - Implemented and measured (Group C)
   - Explicitly rejected based on evidence (if decision was to not proceed)
3. ✅ Measurement dashboard shows:
   - Pre-implementation baselines
   - Current values for all metrics
   - Delta from baseline
4. ✅ No regressions from pre-implementation state
5. ✅ Final stakeholder report delivered

## What Success Looks Like (Business Narrative)

> *"Dreamlab.id has 540-580 indexed pages including all 7 product categories. Google can crawl every product page. There is no URL duplication between /maklon-/ and /produk-/ paths. The sitemap only contains 200 OK, indexable URLs. Blog articles with commercial intent are progressively being indexed as content quality improves. Weekly monitoring ensures any anomalies are caught within 24 hours. Organic traffic and leads are growing as more commercial pages enter the index."*

## What Failure Looks Like (Warning Signs)

> *"Robots.txt change caused crawl budget spike on thin sub-pages (→ more crawled-not-indexed). Business didn't approve product strategy (→ B2 blocked). Content improvements didn't change index status (→ article improvement was wrong hypothesis). Title rewrites didn't improve CTR (→ hypothesis wrong)."*

Each failure scenario has a corresponding rollback plan (Section 10) and mitigation strategy (Section 12).

---

# Appendix A: Summary of All Rejected Recommendations

For transparency, these were explicitly evaluated and rejected:

| Recommendation | Reason for Rejection | Source |
|---|---|---|
| Filter generateStaticParams() for SEO | -200 impact claim unsupported. 686/732 CNI are static assets, not programmatic pages. | EV Board |
| Add noindex to reduce "excluded" count | Fundamentally misunderstands GSC categorization. Already noindexed. Won't reduce total. | EV Board |
| Filter articles <200 words from sitemap | Problem does not exist (0 articles under 200 words). | EV Board |
| Merge/410 articles <200 words | Same as above — problem does not exist. | EV Board |
| 410 verification (318 candidates) | Cannot evaluate without URL list. Previous analysis suggests many are already expected. | EV Board |
| Author/pagination noindex | Already deployed and confirmed live. | EV Board |
| Chase fragment URLs as HIGH priority | Previous analysis already downgraded to LOW. Google handles via canonical. | EV Board + Google Eval |

---

# Appendix B: Evidence Collection Results

*(To be filled during Sprint 0)*

| ID | Evidence | Result | Pass/Fail |
|---|---|---|---|
| E1 | Content audit of /produk/babycare/, /decorative/, /footcare/ | | ☐ |
| E2 | Business decision on product sub-page indexing | | ☐ |
| E3 | SERP comparison for 5 priority articles | | ☐ |
| E4 | Content depth audit for 10 sample pages | | ☐ |
| E5 | Internal link profile for 46 non-indexed pages | | ☐ |
| E6 | Full inventory of /ads/ URLs | | ☐ |
| E7 | SERP positions for 66 zero-click pages | | ☐ |
| E12 | Root cause of /page/2/ generation | | ☐ |

---

# Appendix C: Current Config Snapshots

*(To be recorded during Sprint 0 — paste actual content)*

## robots.txt (Current)
```
[Paste current robots.txt content here]
```

## sitemap.ts proxyPrefixes (Current)
```
[Paste current proxyPrefixes array here]
```

## proxy.ts GONE_PATTERNS (Current)
```
[Paste current GONE_PATTERNS array here]
```

---

# Appendix D: Implementation Sign-Off

| Role | Name | Sign-Off Date |
|---|---|---|
| Principal Technical SEO Architect | | ☐ |
| Engineering Lead | | ☐ |
| Product Owner | | ☐ |
| Content Lead | | ☐ |
| SEO Lead | | ☐ |
| QA Lead | | ☐ |

---

**End of Implementation Blueprint**

*This document is the execution blueprint. Every task has been specified to be independently executable. No further SEO analysis is required before implementation. Begin with Sprint 0: Foundation & Evidence Gathering.*
