# SPRINT 3 — PHASE 2
# ORGANIC EXECUTION OPERATING SYSTEM (OEOS)

**Document:** `SPRINT3-PHASE2-EXECUTION-OPERATING-SYSTEM.md`
**Date:** 2026-07-31
**Council:** Enterprise PMO Director · COO · SEO Director · RevOps Director · Agile Coach · Program Manager · Technical Lead · AI Operations Architect · Knowledge Operations Lead · Product Operations Director
**Predecessors:**
- Sprint 1: Discovery
- Sprint 2: Blueprint (Phases 1–6: Competitor Intelligence → OR-OS)
- Sprint 3 Phase 1: Organic Transformation Blueprint (WHAT to change)
- **This document: HOW to execute the change continuously, without confusion**

**KPI of this system:** Execution velocity — not rankings. The OEOS answers: *"What does each team member do today, this week, this sprint — and is it the right thing, done right, on time?"*

---

# EXECUTIVE SUMMARY

## The One-Sentence Truth

Dreamlab has world-class strategy (Sprint 2) and a surgical transformation plan (Sprint 3 Phase 1), but **strategy is dead without an operating system** — a machine of cadence, ownership, templates, and gates that converts the plan into shipped work every single week.

## What the OEOS Is (and Is Not)

| Is | Is Not |
|----|--------|
| A repeatable operating cadence (day/week/sprint/month/quarter) | A new strategy document |
| An ownership + accountability machine (RACI, DoD, decision trees) | A content plan |
| A set of copy-paste templates the team runs on | Theory or philosophy |
| A governance layer (approvals, versioning, rollback, audit) | A task list |
| A KPI tree + per-role dashboards that tell everyone what matters | A Google Ads plan |

## The Operating Loop (the heartbeat of the system)

```
VISION (12-month)
   │
   ▼
QUARTER (90 days — 1 theme, 3 goals)
   │
   ▼
MONTH (30 days — goals, capacity, experiments)
   │
   ▼
SPRINT (2 weeks — planned work, owners, DoD)
   │
   ▼
WEEKLY (Monday plan / Friday review)
   │
   ▼
DAILY (standup: what's blocked, what's shipped)
   │
   ▼
REVIEW & OPTIMIZE (data → next iteration)
```

**Every level has: Inputs → Outputs → Decision Gates → Dependencies.** If any level is missing, the loop breaks. This document specifies every level.

## The 5 Non-Negotiable Rules

1. **Nothing ships without a Definition of Done (DoD).** If it doesn't pass its checklist, it's not done — it's in progress.
2. **Nothing gets executed without an owner.** RACI names one person Responsible and one Accountable per initiative. No owner = no work.
3. **Nothing gets "improved" without a decision tree.** Rank drops, CTR drops, indexing failures all have a scripted diagnosis → action → escalation → rollback path. No improvisation under panic.
4. **Every change is reversible and versioned.** Git commit + feature flag + rollback window. If it can't be reverted, it doesn't ship.
5. **The week is the smallest unit of accountability.** Weekly cadence is the pulse; daily standups keep it beating.

## The Top 8 System Decisions (this document's backbone)

| # | Decision |
|---|----------|
| 1 | **Sprint = 2 weeks.** Cadence standard for all work (legacy + Growth Layer). Monthly = 2 sprints; quarter = 6 sprints. |
| 2 | **Weekly Monday-plan / Friday-review rhythm.** Monday: commit to the week. Friday: measure, log issues, decide. |
| 3 | **Daily 15-min standup** on execution days (Mon–Thu): shipped yesterday, doing today, blocked by whom. |
| 4 | **One Backlog, four swim-lanes** (Quick Win / Traffic Refocus / Growth Layer / Content Refresh) — mirrors Phase 1's QW/TR/GL/CR codes. |
| 5 | **AI does production, humans do judgment.** AI drafts/outlines/schema/links; SME + SEO Lead review every publishable unit. Human gates are non-negotiable for money pages and REFRESH. |
| 6 | **Lead tracking is wired in Sprint 1.** GA4/GTM events + Kommo CRM are prerequisites for every other metric. |
| 7 | **Experiments are a formal pipeline** (idea → hypothesis → measure → scale/kill) — not ad-hoc A/B tests. |
| 8 | **All decisions logged.** Decision Log + Issue Log + Risk Register live in the repo, appended every week. Audit trail = trust. |

## Baseline Metrics (the OEOS starts from)

| Metric | Baseline | Source |
|--------|----------|--------|
| Organic clicks/90d | 2,745 | GSC 2026-04-27→07-25 |
| Organic impressions/90d | 149,927 | GSC |
| CTR | 1.83% | GSC |
| Money-page clicks (top commercial) | 60–90/90d | GSC page-level |
| Non-indexed URLs | ~1,141 (incl. ~460 static assets = normal) | GSC + RCA 2026-07-31 |
| Content pages needing indexation work | ~46 | RCA 2026-07-31 |
| Structured leads | ~0/mo (WhatsApp-only) | No CRM baseline |
| Round-robin CS agents | 3 | round-robin-config.ts |
| Pilot money pages built | 8 | seo-pilot batch-1+2 |

## Confidence Assessment (Headline)

| Conclusion | Confidence |
|-----------|:---:|
| The week is the correct smallest accountability unit | HIGH (standard operating practice) |
| 2-week sprints fit Dreamlab's team size and async work | HIGH (4–6 person execution team) |
| AI draft + human gate is the right split for quality+velocity | HIGH (Reforge/Google practice) |
| GA4/Kommo wiring must precede other metrics | HIGH (you cannot manage what you can't measure) |
| RACI + DoD + decision trees materially reduce execution error | HIGH (PMO standard) |
| Velocity targets below are estimates, not commitments | MEDIUM (no historical team-throughput data) |

---

# PHASE 1 — EXECUTION ARCHITECTURE

## 1.1 The Architecture (Full Stack)

| Level | Cadence | Input | Output | Decision Gate | Owner |
|-------|---------|-------|--------|---------------|-------|
| **VISION** | 12-month | Sprint 2 blueprints + Sprint 3 Phase 1 | 12-month north-star targets (5,000 clicks/mo, 50 leads/mo, authority 90/100) | Founder + Council sign-off | Founder |
| **QUARTER** | 90 days | Vision + last quarter's review | 1 theme + 3 goals + 3 initiatives + capacity plan | Quarterly business review (QBR) | Program Manager |
| **MONTH** | 30 days | Quarter goals + last month's review | Monthly goals + experiments + capacity allocation | Monthly review (MR) | Program Manager |
| **SPRINT** | 2 weeks | Monthly goals + backlog | Sprint plan (selected items, owners, DoD) | Sprint planning session | SEO Lead |
| **WEEK** | 7 days | Sprint backlog | Monday commitment + Friday review | Weekly review (WR) | SEO Lead |
| **DAY** | 1 day | Weekly plan | Shipped work + blockers | Daily standup | Developer/Writer |
| **REVIEW** | continuous | GSC + GA4 + CRM + logs | Data → next iteration | Data review in each cadence | Rev Ops |

## 1.2 Inputs / Outputs / Gates / Dependencies — Detailed

### VISION Level
- **Inputs:** Sprint 2 Phase 1–6 (competitor intel, reverse engineering, SERP, journey, knowledge architecture, OR-OS); Sprint 3 Phase 1 (transformation blueprint); GSC/GA4 baselines; Founder's business goals.
- **Outputs:** The north-star KPI tree (Phase 10), 12-month roadmap (Phase 1 Part I), the "definition of winning" for the whole program.
- **Decision gates:** What is the 1 metric that matters? What must be true in 12 months for the program to be called a success?
- **Dependencies:** Founder availability for 2-hour strategy session per quarter. No other dependency — vision is the root node.

### QUARTER Level
- **Inputs:** Vision; last QBR outcomes; team capacity (Phase 2).
- **Outputs:** 1 theme (e.g., "Money Page Dominance" / "Authority Layer" / "Revenue Flywheel"), 3 measurable goals, 3 prioritized initiatives with owners, capacity plan.
- **Decision gates:** Stop / continue / pivot each initiative based on MR data. Reallocate capacity between lanes.
- **Dependencies:** Capacity plan (Phase 2) → RACI (Phase 3) → Dependency Map (Phase 4).

### MONTH Level
- **Inputs:** Quarter goals; MR data; experiment results; backlog.
- **Outputs:** 2–3 sprint goals; experiment pipeline for the month; content calendar; capacity allocation (who does what).
- **Decision gates:** Kill/scale experiments (Phase 13); approve REFRESH/MERGE/ARCHIVE actions per Phase 1 decision framework (Part H).
- **Dependencies:** Lead tracking & dashboards (QW5) must be live or monthly decisions are blind.

### SPRINT Level (2 weeks)
- **Inputs:** Monthly goals; prioritized backlog (Phase 8); team availability.
- **Outputs:** Sprint plan: 5–12 items (depending on lane), each with owner, DoD, acceptance criteria, hours.
- **Decision gates:** Sprint planning picks items; sprint review ships/demo; retrospective feeds next sprint.
- **Dependencies:** RACI matrix (who); DoD (done means what); decision trees (how to react mid-sprint).

### WEEK Level
- **Inputs:** Sprint backlog; last week's review; issue log.
- **Outputs:** Monday plan (committed items), Friday review (metrics, issues, decisions), weekly experiment data.
- **Decision gates:** Re-scope mid-week if blocked; Friday decides what carries to next week.
- **Dependencies:** Daily standup keeps the week honest.

### DAY Level
- **Inputs:** Weekly plan; standup status.
- **Outputs:** Shipped work; updated backlog status; raised blockers.
- **Decision gates:** If blocked > 4 hrs, escalate to SEO Lead (who owns unblocking).
- **Dependencies:** Access to templates (Phase 12), decision trees (Phase 7), DoD (Phase 5).

### REVIEW Level
- **Inputs:** GSC (clicks/impressions/indexation), GA4 (events/conversions), CRM (leads), issue/decision/risk logs.
- **Outputs:** Data-driven adjustments to every level above; updated risk register.
- **Decision gates:** Any change to a PROTECT page requires the Phase 1 decision framework gate.
- **Dependencies:** QW5 (GA4/GTM) + CRM wiring completed in first sprint.

---

# PHASE 2 — CAPACITY PLANNING

## 2.1 Role Inventory & Assumptions

Dreamlab's execution team is lean. The OEOS assumes a **core team of ~6 people with multi-hatting**. Weekly capacity is modeled at a realistic 60% utilization (async, meetings, admin, context-switching).

| Role | Who (typical) | Available hrs/wk (60%) | Core responsibilities |
|------|---------------|:---:|----------------------|
| **SEO Lead** | Internal / agency | 20–25 | Strategy, prioritization, money-page QA, GSC/GA4 analysis, decision trees |
| **Developer** | Internal / contractor | 25–30 | Next.js implementation, Growth Layer routes, schema, tracking, CI |
| **Writer (Content)** | Internal / freelance | 20–30 (per writer) | Article refresh, Growth Layer copy, case studies, glossary |
| **Designer** | Shared | 5–10 | Landing page visuals, pricing tables, infographics, case study layouts |
| **Reviewer/SME** | Internal (formulation/R&D, BPOM) | 3–5 | Technical fact-check: formulas, claims, regulations, certifications |
| **Founder** | Founder | 2–3 | Vision, quarterly sign-offs, MERGE/ARCHIVE approval, PR intro |
| **Sales/CS** | 3 CS agents | partial | Lead qualification, CRM hygiene, WhatsApp nurturing |
| **Operations/Program Mgr** | Internal | 10–15 | Cadence, backlog, RACI, dashboards, issue/risk logs |

## 2.2 Required Hours by Workstream (per month, steady state)

| Workstream | SEO | Dev | Writer | Designer | SME | Total |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| Quick Wins / Hygiene | 4 | 8 | 0 | 0 | 0 | 12 |
| Traffic Refocus (bridges+links) | 8 | 4 | 6 | 0 | 0 | 18 |
| Growth Layer (2 pages/mo) | 12 | 20 | 16 | 6 | 2 | 56 |
| Content Refresh (5 articles/mo) | 6 | 2 | 30 | 2 | 4 | 44 |
| Technical SEO (indexation, schema, sitemap) | 10 | 10 | 0 | 0 | 0 | 20 |
| Digital PR (3 outreach/mo) | 6 | 0 | 4 | 2 | 1 | 13 |
| Lead Tracking + CRM | 2 | 6 | 0 | 0 | 0 | 8 |
| Reviews + cadence (all levels) | 6 | 3 | 2 | 1 | 1 | 13 |
| **TOTAL (per month)** | **54** | **53** | **58** | **11** | **8** | **184** |

## 2.3 Bottlenecks (honest assessment)

| Bottleneck | Where it hits | Severity | Evidence / Reasoning |
|-----------|---------------|:---:|----------------------|
| **Writer capacity** | Content Refresh + Growth Layer copy | 🔴 HIGH | 58 hrs/mo required; one internal writer at 30 hrs = deficit of ~28 hrs → need freelance pool OR reduce cadence to 3 refresh + 1.5 Growth pages |
| **SME/reviewer** | Fact-check gates for commercial/claims content | 🟡 MEDIUM | Only 8 hrs/mo needed but only 3–5 available; claims/BROM content must batch reviews (2 articles/week max) |
| **Developer** | Growth Layer routes + schema + tracking all land on one dev | 🟡 MEDIUM | 53 hrs/mo near the 25–30 available → Growth Layer must be staged (2 pages/mo, not 4) or a second dev for 1 month |
| **Founder** | MERGE/ARCHIVE approvals, PR intros | 🟢 LOW | Only 2–3 hrs/wk needed; batch approvals monthly to avoid stalls |
| **Designer** | Landing/pricing visuals | 🟡 MEDIUM | 11 hrs/mo but shared across the org → reuse pilot component library to minimize design dependence |

## 2.4 Scaling Strategy

| Trigger | Action |
|---------|--------|
| Writer deficit > 4 consecutive weeks | Add 1 freelance writer (200–400k IDR/article) OR reduce refresh cadence to 3/mo |
| Backlog of Growth Layer > 3 pages unstarted | Add 1 contractor developer for 1–2 months OR cut Growth to 1 page/sprint |
| Lead volume > 20/mo | Add 4th round-robin CS agent (config, 10 min) + CRM automation |
| Lead volume > 50/mo | Dedicated RevOps/SDR for qualification + nurturing sequences |
| SME review queue > 2 weeks | Batch SME reviews twice a week; pre-approve common claim templates |

## 2.5 Capacity Guardrails

1. **Weekly load limit per person: ≤ 60%** — beyond that, quality and cadence degrade. The Friday review checks load, not just output.
2. **No lane can consume > 50% of total team hours in a month** — prevents Growth Layer from starving hygiene/refresh (and vice versa).
3. **SME reviews are batched, not ad-hoc** — R&D/formulation reviewer gives 2 fixed slots/week.
4. **Founder decisions are batched monthly** — MERGE/ARCHIVE/PR decisions collected into a monthly approval list.

---

# PHASE 3 — RACI MATRIX

**Legend:** R = Responsible (does the work) · A = Accountable (owns the outcome, sign-off) · C = Consulted (input before) · I = Informed (notified after)

## 3.1 RACI by Initiative (Phase 1 codes)

| Initiative (code) | SEO Lead | Developer | Writer | Designer | SME | Founder | Sales/CS | Ops/PM |
|-------------------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| QW1 Breadcrumb + schema | R | R | — | — | — | I | — | A |
| QW2 Article CTA retarget | C | R | — | — | — | I | C | A |
| QW3 Sitemap/proxy sync | A | R | — | — | — | I | — | I |
| QW4 robots.txt verify | A | R | — | — | — | I | — | I |
| QW5 GA4/GTM + lead events | A | R | — | — | — | I | C | I |
| QW6 Canonical fixes | A | R | — | — | — | I | — | I |
| TR1 DIY→money bridges | A | R | R | — | — | I | — | I |
| TR5 Header/services enrichment | A | R | C | — | — | I | — | I |
| GL1 Pricing Hub | A | R | R | C | C | I | C | C |
| GL2 Location Hub (Surabaya/Jakarta) | A | R | R | C | C | C | C | C |
| GL3 Maklon vs ODM vs PL | A | R | R | C | C | I | C | I |
| GL4 Glossary | R | R | R | — | C | I | — | I |
| GL5 MOQ/Budget planner | A | R | C | C | C | I | — | I |
| GL7 Launch checklist (lead capture) | A | R | R | C | C | I | C | C |
| CR1 Refresh top-5 commercial | A | C | R | — | C | I | C | I |
| CR3 MERGE bangun-brand-skincare | A | R | C | — | — | **C (approve)** | — | C |
| Digital PR / outreach | A | — | R | C | C | **C (intro)** | — | C |
| Lead tracking + CRM | A | R | — | — | — | I | R | C |

## 3.2 RACI Rules

1. **Every initiative has exactly ONE (A).** If two people are Accountable, nobody is.
2. **R and A cannot be the same person** unless the work is trivial (e.g., QW3). Keep separation for accountability.
3. **C is limited to 3 max** per initiative. Excess "consulted" = decision paralysis.
4. **I is broadcast via weekly review + log**, not via chat pings.
5. **Sales/CS is Consulted on anything affecting lead flow** (QW2, QW5, GL1, GL7, TR1) — they feel the conversion impact first.
6. **Founder is Consulted (approve) ONLY on: MERGE/ARCHIVE/DELETE, PR intros, quarterly pivots, budget.** Everything else is delegated.

---

# PHASE 4 — DEPENDENCY MAP

## 4.1 The Master Dependency Chain

```
TECH FOUNDATION (Sprint 1)
  QW5 GA4/GTM + lead events ───────────────┐
  QW2 CTA retarget ────────────────────────┤
  QW1 Breadcrumb + schema ─────────────────┤
  QW3/QW4 sitemap/robots ─────────────────┤
                                           ▼
TRAFFIC REFOCUS (Sprint 1–2)
  TR5 Header/services ──┐
  TR3 RelatedLinks ─────┤
  TR1 DIY→money bridges ─┤──► money-page clicks rise
                                           ▼
GROWTH LAYER (Sprint 1–3)
  GL1 Pricing Hub ──► needs ──► GL5 Calculator
  GL2 Location Hub ──► feeds ──► money pages (Surabaya/Jakarta)
  GL3 Comparison ──► links ──► private-label + jasa-maklon
  GL4 Glossary ──► entity reinforcement for ALL money pages
  GL7 Checklist ──► captures email ──► CRM
                                           ▼
LEAD SYSTEM (Sprint 1, then continuous)
  Lead tracking events ──► Kommo CRM ──► lead scoring ──► nurturing
                                           ▼
DASHBOARD (Sprint 1–2)
  GA4 + GSC + CRM ──► monthly reports ──► QBR decisions
```

## 4.2 Critical Path (what must happen before what)

| Order | Item | Blocks | Blocked-by |
|:---:|------|--------|-----------|
| 1 | QW5 GA4/GTM events | All conversion metrics, dashboards, experiment measurement | — |
| 2 | QW2 CTA retarget | TR1 refocus effectiveness, money-page clicks | — |
| 3 | QW1 Breadcrumb | Rich-result signals, internal-link hygiene | — |
| 4 | TR1 bridges | Money-page clicks | QW2 (links must point to real CTAs) |
| 5 | GL2 Location Hub | Money-page local rankings | QW4 (indexability), QW3 (sitemap) |
| 6 | GL1 Pricing Hub | GL5 calculator embed, conversion | QW2, QW5 |
| 7 | GL7 checklist | Email leads → CRM | QW5 |
| 8 | GL5 calculator | Pricing Hub conversion, MOQ validation | GL1 |
| 9 | CRM + scoring | Lead quality, nurturing | QW5, GL7 |
| 10 | Dashboard | QBR, monthly decisions | QW5 + CRM + GSC |

## 4.3 Dependency Rules

1. **Nothing in a lower node ships before its prerequisite node is green.** E.g., Pricing Hub conversion tests don't start until GA4 events fire.
2. **Dependencies are declared at sprint planning** — each backlog item lists its blockers. If a blocker is red, the item doesn't enter the sprint.
3. **Parallel lanes allowed:** Hygiene, Growth Layer, Content Refresh run in parallel as long as their dependencies are met. Only the critical path items serialize.
4. **The Dependency Map is reviewed monthly** in the MR; the council can re-order if data says the chain is wrong.

---

# PHASE 5 — DEFINITION OF DONE (DoD)

**Universal rule: an item is "Done" only when ALL checklist items pass.** Partial = "In Progress." The DoD is checked at sprint review by the Accountable owner; the reviewer is the SEO Lead for anything that touches rankings.

## 5.1 DoD — Article (REFRESH or new)

| # | Checklist item | Who verifies |
|---|----------------|--------------|
| 1 | URL unchanged (REFRESH) or in Growth Layer namespace (new) | SEO Lead |
| 2 | Title ≤ 60 chars, meta description ≤ 160 chars, includes primary keyword naturally | SEO Lead |
| 3 | H1 unique, matches intent; H2/H3 hierarchy reflects the query's answer pattern | SEO Lead |
| 4 | Word count meets target band (from OPTIMASI-21/SERP analysis) | SEO Lead |
| 5 | Opens with direct answer (position-0 style) for the primary query | SEO Lead |
| 6 | 1 decision block or commercial bridge CTA present (money-page or WhatsApp link) | SEO Lead |
| 7 | 3–5 internal links: 1 money page + 1–2 cluster siblings + 1 hub | SEO Lead |
| 8 | FAQ schema present (if 2+ questions), Article schema present | Dev |
| 9 | Fact-checked by SME for claims/formulas/regulations | SME |
| 10 | AI-generated content reviewed & edited by human writer (no pure AI publish) | Writer |
| 11 | Image(s) optimized: WebP/AVIF, alt text, proper filename | Writer/Dev |
| 12 | No legacy HTML debris (elementor/ez-toc classes removed in body) | Writer |
| 13 | Indexed check: live, no 5xx, canonical self-referencing | Dev |
| 14 | Submitted/recrawled (manual for top-10 priority) | SEO Lead |
| 15 | Entry made in Backlog log + Decision Log (if any judgment call) | Ops/PM |

## 5.2 DoD — Landing Page / Money Page (pilot/Growth Layer)

| # | Checklist item | Who verifies |
|---|----------------|--------------|
| 1 | URL in approved namespace; trailing slash; self-canonical | Dev |
| 2 | Title/meta/H1 per keyword mapping (no duplication with existing page) | SEO Lead |
| 3 | Hero answers the query; quick-answers block (3–5 bullets) | SEO Lead |
| 4 | Decision box / comparison table present (per OR-OS conversion stack) | SEO Lead |
| 5 | Pricing or estimation content (no fake numbers; ranges with caveats) | SME + Rev Ops |
| 6 | Primary CTA: round-robin WhatsApp + (where designed) lead form | Dev |
| 7 | MaklonCalculator embedded where relevant | Dev |
| 8 | 2–4 internal links in from legacy/hub pages (not orphaned) | SEO Lead |
| 9 | FAQ schema + Breadcrumb schema + Organization schema | Dev |
| 10 | GA4 events: view, scroll, CTA click, form submit | Dev |
| 11 | Mobile tested (visual QA on 375px) | Dev |
| 12 | Indexed & appearing in GSC within 2 weeks | SEO Lead |
| 13 | SME-reviewed for claims (BPOM/Halal/CPKB accuracy) | SME |
| 14 | Loaded in < 2.5s LCP (CWV green) | Dev |

## 5.3 DoD — Hub (Pricing/Location/Knowledge/Glossary)

| # | Checklist item | Who verifies |
|---|----------------|--------------|
| 1 | Pillar page links to ≥ 3 cluster children AND they link back | SEO Lead |
| 2 | Hub intro explains what to choose, not just lists | SEO Lead |
| 3 | Every cluster child linked from hub + footer (where relevant) | SEO Lead |
| 4 | Hub is linked from ≥ 1 money page + homepage-relevant nav | SEO Lead |
| 5 | Schema (CollectionPage/ItemList) where applicable | Dev |
| 6 | CTA present on pillar (consult/bridge to money page) | SEO Lead |
| 7 | All children indexed; no orphan pages in the hub | Dev |
| 8 | Breadcrumb trail on every hub page | Dev |

## 5.4 DoD — Calculator / Tool

| # | Checklist item | Who verifies |
|---|----------------|--------------|
| 1 | Works on mobile + desktop, no console errors | Dev |
| 2 | Numbers validated against real cost drivers (SME sign-off) | SME |
| 3 | Result screen has a CTA (WhatsApp/pre-fill message) | Dev + SEO |
| 4 | GA4 event fires on calculation + on CTA click | Dev |
| 5 | URL stable, indexable, canonical | Dev |
| 6 | Clear disclaimer (estimates not quotes) | SEO Lead |

## 5.5 DoD — Case Study

| # | Checklist item | Who verifies |
|---|----------------|--------------|
| 1 | Client permission obtained + NDA-safe | Sales + Founder |
| 2 | Real, verifiable numbers (MOQ, timeline, outcome) — no invented results | SME + Sales |
| 3 | Problem → approach → result structure; result tied to a metric | SEO Lead |
| 4 | Links to relevant money page + our-client hub | SEO Lead |
| 5 | Schema (Article + Product/Service reference) | Dev |
| 6 | CTA: "start your brand like this" → WhatsApp/consult | SEO Lead |

## 5.6 DoD — Schema / Technical SEO task

| # | Checklist item | Who verifies |
|---|----------------|--------------|
| 1 | Valid JSON-LD (validator passes) | Dev |
| 2 | Correct entity types; no conflicting schema on page | Dev |
| 3 | Canonical, robots, hreflang (n/a) consistent | Dev |
| 4 | Rendered in source (not client-only) for schema | Dev |
| 5 | No impact on existing rich results (checked in GSC) | SEO Lead |

## 5.7 DoD — Internal Linking change

| # | Checklist item | Who verifies |
|---|----------------|--------------|
| 1 | Anchor text is descriptive, not "klik disini" | SEO Lead |
| 2 | Link target is live, relevant, not a 301 | SEO Lead |
| 3 | ≤ 8 outbound links per article (focus) | SEO Lead |
| 4 | No link on a PROTECT page that could hurt relevance (A/B monitored) | SEO Lead |
| 5 | Logged in the link-change log with date + rationale | Ops/PM |

## 5.8 DoD — Content Refresh

| # | Checklist item | Who verifies |
|---|----------------|--------------|
| 1 | Original URL + H1 kept (unless REFRESH protocol approved differently) | SEO Lead |
| 2 | publishDate updated + updatedAt set; change noted | SEO Lead |
| 3 | SERP re-checked before rewrite (current top-10 answer pattern) | SEO Lead |
| 4 | Content length raised to target band; thin sections expanded | Writer |
| 5 | Old claims updated (year, data, trends → 2026) | Writer + SME |
| 6 | CTA/money link added/reinforced | SEO Lead |
| 7 | Schema refreshed; internal links updated | Dev |
| 8 | Monitored 14 days: CTR/position not down >10% | SEO Lead |

---

# PHASE 6 — AI WORKFLOW

## 6.1 The AI Production Pipeline (with human gates)

```
RESEARCH ──► OUTLINE ──► DRAFT ──► SME REVIEW ──► SEO REVIEW ──► FACT CHECK
    │            │          │            │             │              │
   (AI+SEO)    (AI+SEO)   (AI)        (HUMAN)      (HUMAN)       (HUMAN+AI)
    │            │          │            │             │              │
    ▼            ▼          ▼            ▼             ▼              ▼
 SCHEMA ──► INTERNAL LINKING ──► PUBLISH ──► MONITOR
    │              │               │             │
  (AI+DEV)      (AI+SEO)        (DEV)       (SEO/REVOPS)
```

## 6.2 Who Does What (task-level split)

| Step | AI does | Human does | Human gate mandatory? |
|------|---------|-----------|:---:|
| **Research** | Gather SERP data, extract answer patterns, competitor angles, cluster gaps, query intents | SEO Lead defines the query set and validates strategic fit | Yes (SEO Lead) |
| **Outline** | Propose H2/H3 structure from top-10 answer patterns + FAQ mining | SEO Lead edits to match intent + money-page strategy | Yes (SEO Lead) |
| **Draft** | First draft from outline + research (factual skeleton, Indonesian tone) | Writer rewrites/edits for voice, brand, readability, originality | **YES (non-negotiable)** |
| **SME Review** | Flag claims that need verification (ingredients, BPOM, Halal, CPKB, trends) | SME validates all technical/regulatory claims; marks approve/fix | Yes (claims only) |
| **SEO Review** | Suggest meta title/desc, schema fields, internal-link candidates | SEO Lead approves title/desc, links, DoD sign-off | Yes (SEO Lead) |
| **Fact Check** | Cross-check numbers/trends against indexed sources; flag discrepancies | Writer/SME confirms; adds sources where claims are contested | Yes (disputed claims) |
| **Schema** | Generate JSON-LD (Article/FAQ/Breadcrumb/Service) from page data | Dev validates + deploys; checks render | Yes (Dev) |
| **Internal Linking** | Recommend 3–5 link candidates from hub/money/cluster graph | SEO Lead approves; no orphan links | Yes (SEO Lead) |
| **Publish** | (n/a) | Dev deploys; Writer + SEO check live page | Yes |
| **Monitor** | Weekly GSC/GA4 anomaly detection (drops in clicks/CTR/impressions) | SEO Lead reads alerts, runs decision trees | Yes (SEO Lead) |

## 6.3 AI Usage Rules (governance)

1. **AI is a production tool, never the accountable party.** Every publishable unit has a named human Responsible (writer) and Accountable (SEO Lead).
2. **Pure AI text is banned on: money pages, pricing content, regulatory/claims content, case studies.** These require SME + human writer.
3. **AI drafting is allowed for: glossary definitions, cluster support articles, FAQ answers, meta descriptions (with review), internal-link suggestions, schema generation.**
4. **Every AI-drafted article gets an originality/quality pass** by the human writer — no copy-paste publish.
5. **AI Research must be labeled "AI-assisted research" in the Research Log** if used for competitor/SERP claims; never present AI output as measured GSC data.
6. **No AI tool auto-publishes.** Deployment is always a human git commit with a review.

## 6.4 AI Prompt Library (starter; stored in repo `/docs/ai-prompts/`)

| Prompt | Purpose |
|--------|---------|
| `serp-answer-pattern.md` | Extract top-10 answer patterns + PAA from a query |
| `outline-from-intent.md` | Build H2/H3 outline from query + search intent |
| `draft-indonesian-article.md` | Indonesian first draft, brand voice, factual skeleton |
| `faq-schema-jsonld.md` | Generate FAQ JSON-LD from page content |
| `internal-links-suggest.md` | Recommend links from money/cluster/hub graph |
| `meta-title-desc.md` | Title ≤60 + description ≤160 from content |
| `refresh-diff.md` | Diff current article vs target band; propose additions |
| `claim-factcheck.md` | Flag claims needing SME verification before publish |

---

# PHASE 7 — DECISION TREES (SOP)

Each tree: **Trigger → Diagnosis → Action → Escalation → Rollback.** These are followed under time pressure — no improvisation.

## 7.1 Ranking Drop

| Step | SOP |
|------|-----|
| **Trigger** | A money page drops ≥ 5 positions for its primary keyword, sustained 7+ days |
| **Diagnosis (≤ 48h)** | 1) GSC: impressions down? clicks down? CTR down? 2) SERP: competitor entered? feature (AI Overview/FAQ/Video) appeared? 3) Site: was the page touched in last 14 days? 4) Canonical/redirects intact? |
| **Action** | If touched recently → review diff, revert risky change. If AI Overview took the position → optimize for featured snippet + add comparison data. If competitor new → refresh content with updated data + more depth. If technical → fix, request recrawl. |
| **Escalation** | If drop > 10 positions or money-page traffic loss > 30% → escalate to SEO Lead + Founder within 24h. |
| **Rollback** | If caused by our change → git revert + restore previous version + 14-day monitor. |

## 7.2 Traffic Drop (site-wide)

| Step | SOP |
|------|-----|
| **Trigger** | Total clicks drop > 25% vs 4-week average for 2 consecutive weeks |
| **Diagnosis** | 1) Was there a Google core update (track algorithm news)? 2) Indexation drop (GSC coverage)? 3) Site-wide technical issue (5xx, robots, canonical)? 4) Seasonality? 5) Recent mass change? |
| **Action** | Technical issue → fix + verify:all. Core update → do NOT panic-change; run helpful-content audit; wait 2 weeks then targeted fixes. Mass change → review the change batch, roll back anything high-risk. |
| **Escalation** | Immediate to SEO Lead + Program Manager. Founder briefed if > 40% loss. |
| **Rollback** | Mass change → revert batch to last deploy + verify. |

## 7.3 CTR Drop (page-level)

| Step | SOP |
|------|-----|
| **Trigger** | CTR down > 25% with impressions stable (position same) |
| **Diagnosis** | 1) Title/meta changed? 2) SERP feature appeared (AI Overview, PAA, video)? 3) Brand queries lost? 4) Position 1–3 → re-ranked? |
| **Action** | Title/meta → rewrite with hook + keyword (A/B via title experimentation if available). SERP feature → adjust to capture PAA/AI Overview. Keep impressions; focus on click-worthy snippet. |
| **Escalation** | If money page CTR < 1% for 3 weeks → SEO Lead intervention. |
| **Rollback** | Revert title/meta to previous if change caused the drop. |

## 7.4 Indexing Failure

| Step | SOP |
|------|-----|
| **Trigger** | A money page (or Growth Layer page) not indexed within 14 days of publish |
| **Diagnosis** | 1) robots meta/robots.txt blocking? 2) Canonical pointing elsewhere? 3) Crawled-not-indexed (quality) vs discovered-not-indexed (link depth)? 4) In sitemap? 5) Internal links pointing in? |
| **Action** | Technical block → fix + request indexing via GSC URL inspection. Quality (crawled-not-indexed) → improve content depth + add 2–3 internal links from authority pages + update date. Link depth (discovered-not-indexed) → add internal links from homepage-adjacent pages. |
| **Escalation** | If after 2 corrective cycles still not indexed → SEO Lead reviews the page's value; possibly merge/redirect instead of forcing. |
| **Rollback** | n/a (no rollback; it's additive). |

## 7.5 Google Core Update

| Step | SOP |
|------|-----|
| **Trigger** | Google announces a core update (official); watch 2–4 weeks of data |
| **Diagnosis** | After 2 weeks: which segments moved? Money pages? DIY? Indexation? |
| **Action** | Winners: reinforce (links, freshness). Losers: do NOT rapidly change; apply helpful-content criteria (E-E-A-T, original value, user intent). Refresh thin/outdated pages in affected clusters. |
| **Escalation** | Program-level review at next MR; monthly cadence covers it. |
| **Rollback** | None (site-wide); mitigation is content quality, not revert. |

## 7.6 AI Overview Changes

| Step | SOP |
|------|-----|
| **Trigger** | AI Overview appears/shrinks for a money keyword; clicks drop while impressions hold |
| **Diagnosis** | Is the money query now answered in AI Overview? Which source is cited? |
| **Action** | Optimize to be the cited source: clear definitional answer up top, data tables, citations, original research. Build the definitive-content page (Sprint 2 authority play). |
| **Escalation** | Track monthly share of AI Overview impact; report in MR. |
| **Rollback** | n/a (adaptive). |

## 7.7 Competitor Launch

| Step | SOP |
|------|-----|
| **Trigger** | Competitor publishes page targeting a money keyword; their position rises past Dreamlab |
| **Diagnosis** | What's their page? (Sprint 2 reverse-engineering playbook). Where's Dreamlab's gap: content depth? conversion? freshness? backlinks? |
| **Action** | If gap is content → refresh + deepen + add proprietary data. If gap is freshness → update + date. If gap is conversion → add decision block + pricing. Do NOT copy; out-authority. |
| **Escalation** | If competitor gains top-3 on 3+ money keywords → monthly strategy review adds a counter-initiative. |
| **Rollback** | n/a (competitive response). |

## 7.8 Content Cannibalization

| Step | SOP |
|------|-----|
| **Trigger** | Two Dreamlab pages ranking for the same keyword (both top-30, same intent) |
| **Diagnosis** | GSC: which page has better CTR/position? Which has more authority/backlinks? |
| **Action** | Merge (Phase 1 classification) OR differentiate intent (change one page's angle/query target). Add canonical if truly duplicates. |
| **Escalation** | If both pages are money pages → Founder approval for MERGE per Phase 1 Part H. |
| **Rollback** | 301 merge is permanent-ish; keep old URL accessible for 30 days with redirect + monitor. |

## 7.9 Lost Featured Snippet

| Step | SOP |
|------|-----|
| **Trigger** | Page loses position-0 for a target query |
| **Diagnosis** | New snippet owner? Format changed (table vs list vs para)? |
| **Action** | Match the format Google now rewards; strengthen the direct-answer block; add definitional first paragraph + sub-bullets + table. |
| **Escalation** | If snippet is on a money page → track; retake within 4 weeks or refocus. |
| **Rollback** | Revert answer block if CTR worsens. |

## 7.10 Lost Backlink

| Step | SOP |
|------|-----|
| **Trigger** | Quality backlink disappears (monitored via backlink tool) |
| **Diagnosis** | Page removed? Site down? Link removed manually? |
| **Action** | Outreach to site owner (restore), or build 1–2 replacement links from Digital PR activity. |
| **Escalation** | If > 5 quality links lost in a month → Digital PR review. |
| **Rollback** | n/a. |

## 7.11 Decision Tree Rulebook

1. **Every tree starts at the trigger, not at the hypothesis.** Gather data first.
2. **Diagnosis is time-boxed (24–48h).** No analysis paralysis.
3. **Escalation thresholds are explicit and pre-agreed.** Nobody waits for permission in a crisis.
4. **Rollback is always a git revert + monitor.** Every change keeps a revert path.
5. **Log every tree execution in the Issue Log** (template in Phase 12).

---

# PHASE 8 — SPRINT PLANNING SYSTEM

## 8.1 The Sprint Lifecycle

```
BACKLOG ──► PRIORITY ──► SPRINT PLANNING ──► EXECUTION ──► REVIEW ──► RETRO ──► NEXT SPRINT
 (all      (monthly    (day 1 of           (14 days)    (day 14    (day 14    (immediately
 ideas)    scoring)    sprint)                           demo +     process)   plans)
                                                         metrics)
```

## 8.2 Backlog (single source of truth)

| Field | Description |
|-------|-------------|
| ID | e.g., `GL1`, `TR3`, `CR2` (Phase 1 codes) or new `GL9`, `CR5` |
| Title | Actionable title |
| Lane | Quick Win / Traffic Refocus / Growth Layer / Content Refresh / Tech / PR / Lead |
| Priority | P0 (this sprint) / P1 (next) / P2 (this month) / P3 (backlog) |
| Owner (R) / Accountable (A) | From RACI |
| Dependencies | From Dependency Map |
| Est. hours | From Capacity Planning |
| DoD reference | Which DoD checklist |
| Status | To Do / In Progress / In Review / Done / Blocked |
| Value score | Revenue × SEO − Risk × Difficulty (Phase 1 scoring, recomputed monthly) |
| Confidence | MED/LOW/HIGH |

**Where it lives:** `docs/seo problem and plan/backlog/` as a single CSV or Markdown table maintained by Ops/PM. Git-tracked.

## 8.3 Priority Scoring (recompute monthly)

`Score = (Revenue Impact × 0.4) + (SEO Impact × 0.3) − (Risk × 0.2) − (Difficulty × 0.1)` — the Phase 1 Part G formula. Re-score at each MR; backlog re-sorts.

## 8.4 Sprint Planning (Day 1 of sprint, 45–60 min)

| Step | Action |
|------|--------|
| 1 | Review monthly goals + last sprint's unfinished items |
| 2 | Pull top-priority items that fit capacity (from Phase 2) |
| 3 | For each item: confirm dependencies green, assign owner, confirm DoD |
| 4 | Commit sprint goal (1 sentence) + capacity plan |
| 5 | Record in Sprint Board (Phase 12 template) |

**Sprint capacity rule:** total estimated hours ≤ 80% of available team hours (buffer for the unexpected).

## 8.5 Execution (Days 1–13)

- Daily standup (15 min): shipped yesterday, doing today, blocked by whom.
- Blocked > 4h → escalate to SEO Lead (unblocker) immediately.
- Mid-sprint scope change → only with SEO Lead + owner consent; never silently drop a DoD item.

## 8.6 Sprint Review (Day 14, 30 min)

| Step | Action |
|------|--------|
| 1 | Demo/verify each Done item against its DoD (SEO Lead checks) |
| 2 | Read sprint metrics: shipped vs committed, cycle time, blocked hours |
| 3 | Log issues/decisions |
| 4 | Confirm items moved to Done; incomplete items return to backlog with reason |

## 8.7 Retrospective (Day 14, 30 min — immediately after review)

Format: **Start / Stop / Continue.** Three votes on the highest-leverage change for next sprint. Output feeds next sprint planning. Every retro produces ≤ 2 concrete action items, each with an owner.

## 8.8 How Tasks Move (the state machine)

```
To Do ──► In Progress (owner starts) ──► In Review (owner marks ready)
            │                                 │
            │ (blocked >4h: raise)            │ (SEO Lead checks DoD)
            ▼                                 ▼
        Blocked ──► (escalate)          Done (DoD passed, logged)
                                           │
        (DoD fail: back to In Progress with comments)
```

**Rule: nothing enters Done without DoD pass + log entry. Nothing is "done-ish."**

---

# PHASE 9 — REVIEW CADENCE

## 9.1 The Full Cadence

| Cadence | When | Purpose | Metrics | Participants | Outputs | Actions |
|---------|------|---------|---------|--------------|---------|---------|
| **Daily standup** | 15 min, Mon–Thu | Unblock execution | What shipped / what's blocked | Developer, Writer, SEO Lead | Standup log | Escalate blockers > 4h |
| **Weekly Review** | Fri, 30 min | Week accountability + data check | Clicks, money-page CTR, indexation of new pages, shipped items | SEO Lead, Dev, Writer, Ops | Weekly report; issue/decision log; next-week plan | Re-scope sprint, log decisions |
| **Monthly Review** | Last Fri of month, 1 hr | Goals, capacity, experiments, backlog | Monthly KPIs, experiment results, refresh progress, backlog scores | Full team + Founder (brief) | Monthly report; backlog re-sort; experiment scale/kill | Approve MERGE/ARCHIVE batch; reallocate capacity |
| **Quarterly Review (QBR)** | Every 90 days, 2 hr | Theme, goals, strategy, capacity | Quarter KPIs vs vision, authority score, lead growth | Founder + Council | QBR deck; next quarter theme + 3 goals | Pivot/continue initiatives; budget approval |
| **Annual Review** | Every 12 months, 4 hr | Vision refresh, roadmap, org | Year KPIs vs north star, authority score | Founder + Council + Sales | Annual roadmap; next-year theme | Set new vision targets |

## 9.2 What each review MUST produce (no empty meetings)

| Cadence | Must produce | If missing |
|---------|--------------|-----------|
| Daily | Blockers surfaced + unblocked | Standup = status theater; cancel it |
| Weekly | Decision Log entry + Issue Log entry + next-week commit | Work drifts without accountability |
| Monthly | Backlog re-sorted + experiment scale/kill + capacity check | Priorities rot |
| Quarterly | 3 goals + 3 initiatives + capacity plan | Strategy becomes "keep doing what we did" |
| Annual | North-star refresh + roadmap | The system loses its why |

## 9.3 Meeting Discipline Rules

1. **No meeting without an agenda + a "must produce" output** (from above).
2. **Weekly review is the mandatory minimum.** If the team can only do one cadence, it's the weekly.
3. **Records are written to the repo** (`docs/ops/`) — meetings without written outputs didn't happen.
4. **Founder attends monthly (15-min brief) + quarterly (full).** Not weekly — protects founder time.
5. **Cadence stops if the backlog is empty and nothing ships** — the system's job is to surface that, too.

---

# PHASE 10 — KPI TREE

## 10.1 The Hierarchy (everything connects upward)

```
                                   REVENUE (Rp/mo from organic)
                                         │
                                         ▼
                             QUALIFIED LEADS (count/mo)
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
            CONVERSION RATE       MONEY-PAGE VISITS       LEAD QUALITY
            (visit→lead %)        (sessions/mo)          (SQL/lead %)
                    │                    │                    │
                    ▼                    ▼                    │
            MICRO-CONVERSIONS     MONEY-PAGE CTR     ┌───────┴───────┐
            (CTA clicks,          (clicks/imp.)      ▼               ▼
             form fills)                │        CRM HYGIENE    NURTURING
                    │                    │        (data quality)  (reply speed)
                    ▼                    ▼
            INTERNAL CLICK RATE   RANKING
            (inbound link CTR)   (money kw positions)
                    │                    │
                    └────────┬───────────┘
                             ▼
                       IMPRESSIONS (visibility)
                             │
                             ▼
                       INDEXING (pages indexed)
                             │
                             ▼
                       CWV + TECHNICAL HEALTH
```

## 10.2 KPI Definitions & Targets (12-month trajectory)

| KPI | Definition | Baseline | Month 3 | Month 6 | Month 12 | Confidence |
|-----|-----------|----------|---------|---------|----------|:---:|
| Revenue from organic | Qualified deals attributed to organic (CRM) | ~0 (unmeasured) | TBD | Growing | Primary north star | MED |
| Qualified leads/mo | Lead scoring ≥ MQL (OR-OS Phase 6) | ~0 structured | 5–10 | 20–30 | 50+ | MED |
| Conversion rate | MQL / money-page visits | ~0% | 1% | 2% | 3% | MED |
| Money-page visits | Sessions on GL/PL/jasa/estimasi/pabrik pages | ~150/mo (est.) | 400 | 1,000 | 2,500 | MED |
| Money-page CTR | Avg CTR of money pages | ~3–6% (top pages) | 5% | 6% | 8% | MED-HIGH |
| Internal click rate | CTR on internal links (GA4 link click events) | n/a | Establish | Improve 20% | Improve 50% | MED |
| Ranking (money kw) | Avg position top-20 money keywords | 5–13 | 4–8 | 3–6 | 1–3 | MED |
| Impressions | Total organic impressions/mo | ~50k/mo | 75k | 120k | 180k | MED |
| Indexing | Indexed content pages / total | ~1,141 excluded (mostly expected) | <700 excluded | <600 | <600 | HIGH |
| CWV | LCP < 2.5s, CLS < 0.1, INP < 200ms | Partial (verify) | Green on money pages | Green sitewide | Green sitewide | MED-HIGH |

## 10.3 KPI Rules

1. **The tree is causal, not just visual.** Improving a lower node moves the node above it — that's the theory of change. If money-page CTR improves but conversion doesn't, the problem is the page (conversion), not the tree.
2. **Monthly: read the whole left spine** (revenue → leads → conversion → CTR → ranking → impressions → indexing). This is the "traffic light" review.
3. **Weekly: read only the fast-moving nodes** — money-page CTR, indexing of new pages, internal link CTR, experiment KPIs.
4. **Every KPI has a target + an owner.** Unowned KPIs don't move.

---

# PHASE 11 — EXECUTION DASHBOARD

## 11.1 Design Principle: Role-Scoped Views

Each role sees ONLY what they can act on. The dashboard is one GA4/GSC/CRM/Looker Studio layer with 6 scoped views. No role sees 40 charts; each sees 5–10 relevant metrics.

## 11.2 Role Views

### Founder View (monthly, strategy)
| Metric | Why it matters | Source |
|--------|---------------|--------|
| Qualified leads/mo | Revenue engine | CRM |
| Revenue attributed to organic | The point | CRM + GA4 |
| Money-page clicks trend | Growth trajectory | GSC |
| Indexation health (money pages) | Foundation | GSC |
| Experiment wins/losses | Are we learning? | Experiment log |
| Capacity utilization | Team healthy? | Ops |

### SEO Lead View (weekly, tactical)
| Metric | Why it matters | Source |
|--------|---------------|--------|
| Money-page positions (top 20 kw) | Core KPI | GSC |
| Money-page CTR | Click-worthiness | GSC |
| Indexing status of new pages | Publish→index speed | GSC |
| Internal-link CTR | Refocus working? | GA4 |
| Cannibalization flags | Duplicate intent | GSC (semi-auto) |
| Backlog status | Velocity | Ops board |

### Developer View (daily, technical)
| Metric | Why it matters | Source |
|--------|---------------|--------|
| CWV (LCP/CLS/INP) money pages | Core Web Vitals | PSI/GA4 |
| 4xx/5xx / crawl errors | Technical health | GSC |
| Deploy success + rollback count | Stability | CI/CD |
| Schema validity | Rich results | Validator + GSC |
| Sitemap/proxy consistency | Hygiene | verify:sitemap |

### Writer View (sprint, content)
| Metric | Why it matters | Source |
|--------|---------------|--------|
| Refresh completion vs plan | Cadence | Ops board |
| Content DoD pass rate | Quality | Ops board |
| Article CTR/position after refresh | Effect of work | GSC |
| SME approval cycle time | Feedback loop | Ops board |

### Sales View (weekly, leads)
| Metric | Why it matters | Source |
|--------|---------------|--------|
| New leads this week | Pipeline input | CRM |
| Lead source (organic/paid/other) | Quality mix | CRM/GA4 |
| Lead → qualified call rate | Lead quality | CRM |
| Response time | Speed-to-lead | CRM |

### Marketing View (monthly, brand+content)
| Metric | Why it matters | Source |
|--------|---------------|--------|
| Organic clicks + impressions | Visibility | GSC |
| Top pages by clicks | What's working | GSC |
| Authority/backlinks | Trust | Backlink tool |
| Content published + refreshed | Velocity | Ops board |
| Brand query volume | Brand health | GSC |

## 11.3 Dashboard Build Order

| Step | Build | Tool | When |
|------|-------|------|------|
| 1 | GA4 events + conversions wired | GA4/GTM | Sprint 1 (QW5) |
| 2 | GSC link in GA4 + custom reports | GA4 | Sprint 1 |
| 3 | Kommo CRM + lead source fields | Kommo | Sprint 1–2 |
| 4 | Looker Studio (or GA4 Explore) master dashboard | Looker Studio | Sprint 2 |
| 5 | Role-scoped views (6 views) | Looker Studio | Sprint 2–3 |
| 6 | Ops board (backlog/sprint) | GitHub Projects / Notion | Sprint 1 |

## 11.4 Dashboard Rules

1. **One source of truth per metric** — no two dashboards disagreeing. GSC = rankings/impressions; GA4 = events/conversions; CRM = leads/revenue; Ops board = work.
2. **Weekly refresh, monthly deep read.** The dashboard is read in every WR and MR.
3. **Alerts (manual checkpoints) on:** money-page CTR drop >25%, indexing failure of new page >14d, 4xx spike, lead spike (capacity check).
4. **Every metric links to the KPI tree node** it feeds (Phase 10) — so a movement is always traceable to "why."

---

# PHASE 12 — TEMPLATES

All templates are stored in the repo at `docs/ops/templates/` and are the ONLY sanctioned formats. If a template doesn't exist for a task, the task doesn't start until Ops/PM creates one.

## 12.1 Content Refresh Template

```markdown
# Content Refresh — [Article URL]
- Owner (R): [Writer] | Accountable (A): [SEO Lead]
- Original URL: [ ] | H1 kept: [ ] | publishDate updated: [ ]
- SERP re-check date: [ ] | Answer pattern found: [ ]
- Word count: [before] → [target] → [after]
- Claims updated to 2026: [ ] | SME review date: [ ]
- Money link added: [URL] | Internal links: [3–5 URLs]
- Schema refreshed: [ ] | 14-day monitor start: [date]
- DoD checklist result: PASS / FAIL (list failed items)
```

## 12.2 Sprint Planning Template

```markdown
# Sprint [XX] — [dates]
- Sprint goal: [one sentence]
- Capacity: [hours by role]
- Items: (ID | Title | Owner | Hours | Dependencies | DoD ref | Status)
  1. GL1 | Pricing Hub | [Owner] | 40h | QW2, QW5 | 5.2 | To Do
  ...
- Unfinished from last sprint: [...]
- Retro actions carried in: [...]
```

## 12.3 Weekly Review Template

```markdown
# Weekly Review — W[#] [date]
- Shipped: [list with DoD status]
- Metrics: money-page CTR [%] (Δ), indexation of new pages [...], lead count [...]
- Issues raised: [...] | Decisions logged: [...]
- Blockers: [...] | Capacity check: [load %]
- Next week commit: [...]
- Decision Log entry appended: [ID]
```

## 12.4 Monthly Review Template

```markdown
# Monthly Review — [Month]
- KPI tree read (left spine): revenue / leads / conversion / CTR / ranking / impressions / indexing / CWV
- Goals: met / missed (why)
- Experiments: scale / kill / continue (Phase 13)
- Backlog re-sorted: [new top 5]
- Capacity: utilization / bottlenecks
- MERGE/ARCHIVE batch for Founder: [...]
- Next month: 2–3 goals + 2–3 sprint goals
```

## 12.5 Experiment Template

```markdown
# Experiment — [ID] [title]
- Hypothesis: [if we change X, then Y will happen, because Z]
- Change: [what/where]
- Expected KPI: [primary + guardrail] | Target: [value]
- Cost: [hours/Rp] | Risk: [low/med/high] | Confidence: [low/med/high]
- Duration: [weeks] | Sample: [pages/traffic]
- Pre-period baseline: [data]
- Go/No-go decision date: [date]
- Result: [data] | Decision: SCALE / KILL / CONTINUE
```

## 12.6 Issue Log Template

```markdown
# Issue Log — [ID]
- Date: [ ] | Severity: [P0/P1/P2/P3]
- Description: [ ]
- Which decision tree triggered: [7.x]
- Diagnosis: [ ] | Action taken: [ ]
- Escalated to: [ ] at [date/time]
- Rollback performed: [yes/no + detail]
- Status: OPEN / RESOLVED / MONITORING
```

## 12.7 Decision Log Template

```markdown
# Decision Log — [ID]
- Date: [ ] | Decision: [what]
- Rationale: [why]
- Evidence: [data/code]
- Alternatives considered: [ ]
- Owner: [A] | KPI to validate: [ ]
- Stop condition: [when to reverse]
- Status: ACTIVE / REVERSED / COMPLETE
```

## 12.8 Risk Register Template

```markdown
# Risk Register — [ID]
- Risk: [description]
- Category: [SEO/Business/Political/Technical/Revenue/Operational]
- Probability (1–5): [ ] | Impact (1–5): [ ] | Exposure: [P×I]
- Mitigation: [ ] | Owner: [ ]
- Status: OPEN / MITIGATED / CLOSED / MATERIALIZED
- Review date: [monthly]
```

## 12.9 Roadmap Template

```markdown
# Roadmap — [Quarter]
- Theme: [ ] | 3 goals: [ ]
- Initiatives: (code | title | owner | dependency | target date)
- Key dates: [sprint boundaries, reviews, experiments]
- Known risks: [ ]
```

## 12.10 Backlog Template

```markdown
# Backlog — [Month]
| ID | Title | Lane | Priority | R/A | Dep | Hrs | DoD | Status | Value | Conf |
|----|-------|------|----------|-----|-----|-----|-----|--------|-------|------|
```

## 12.11 Retrospective Template

```markdown
# Retrospective — Sprint [XX]
- START: [do more of]
- STOP: [stop doing]
- CONTINUE: [keep]
- Top 2 action items: [1. item | owner] [2. item | owner]
```

## 12.12 Deployment Checklist Template

```markdown
# Deployment Checklist — [release]
- [ ] Build passes (`npm run build`)
- [ ] verify:all green (redirects, lead-flow, round-robin, SEO, assets, sitemap)
- [ ] Rollback plan defined (git revert / feature flag)
- [ ] Affected pages smoke-tested (status 200, no 5xx)
- [ ] Schema validated on affected pages
- [ ] GA4 events verified (preview mode) where changed
- [ ] Change logged in Decision Log
- [ ] 14-day monitoring owner assigned
```

---

# PHASE 13 — EXPERIMENT OPERATING SYSTEM

## 13.1 The Experiment Pipeline

```
IDEA ──► HYPOTHESIS ──► IMPLEMENT ──► MEASURE ──► DECIDE ──► SCALE or KILL
 (all)    (validated)    (ship)      (data)    (gate)     (feed KPI tree)
```

## 13.2 Experiment Governance

| Stage | Rule |
|-------|------|
| **Idea** | Anyone can submit (backlog). No filtering at idea stage — log everything. |
| **Hypothesis** | Must be falsifiable: "If [change] on [pages], then [KPI] will [direction] by [threshold], because [mechanism]." No hypothesis = no experiment. |
| **Implementation** | Single variable changed at a time; control group (or pre-period baseline); reversible change. |
| **Measurement** | Pre-registered KPI (primary + guardrail) before launch; no post-hoc metric shopping. |
| **Decision gate** | At pre-set date: data → SCALE / KILL / CONTINUE. Decision logged. |
| **Scale** | If primary KPI met + guardrail intact → roll to wider scope, log as a decision. |
| **Kill** | If KPI not met or guardrail broken → stop, log learning. Killing is success (saved budget). |

## 13.3 Experiment Card (what every experiment must include)

| Field | Required? |
|-------|:---:|
| Expected KPI (primary + guardrail) | YES |
| Cost (hours + any spend) | YES |
| Risk (low/med/high + rollback) | YES |
| Confidence (low/med/high) | YES |
| Duration (weeks) | YES |
| Sample (pages/traffic segment) | YES |
| Owner (R + A) | YES |
| Hypothesis (falsifiable) | YES |
| Baseline data (pre-period) | YES |

## 13.4 First Experiment Batch (pre-loaded, Sprint 1–2)

| Exp | Hypothesis (condensed) | KPI | Cost | Risk | Conf | Duration |
|-----|------------------------|-----|:---:|:---:|:---:|:---:|
| X1 | Re-enabling breadcrumbs on top-20 pages → CWV/engagement stable + breadcrumb schema present | No CTR loss + schema valid | 4h | LOW | HIGH | 2 wk |
| X2 | Article CTA retarget (QW2) → money-page referral clicks rise | Money-page clicks +10% | 4h | LOW | HIGH | 4 wk |
| X3 | DIY→money bridges on top-5 DIY pages → money-page clicks rise w/o DIY CTR loss | Money clicks +20%, DIY CTR stable | 10h | MED | MED-HIGH | 6 wk |
| X4 | Pricing Hub live → money-page conversion rate up | Conversion +1% absolute | 40h | MED | MED | 8 wk |
| X5 | Location Hub (Surabaya/Jakarta) → local money keyword impressions up | Local impressions +30% | 40h | MED | MED-HIGH | 8 wk |
| X6 | Launch checklist download → email leads >0 | 10 emails captured | 8h | LOW | HIGH | 4 wk |
| X7 | Refresh top-5 thin commercial → their positions +2 avg | Avg position +2 | 40h | MED | HIGH | 8 wk |

## 13.5 Rules

1. **Max 3 concurrent experiments.** More than 3 and you can't attribute the KPI movements.
2. **Experiments are logged in the Experiment Log**; results feed the Monthly Review.
3. **A killed experiment is a win** — it saved future budget. Never punish a kill; punish a non-logged result.
4. **Guardrails are sacred** — if a guardrail (e.g., DIY CTR) breaks, the experiment stops regardless of primary KPI.

---

# PHASE 14 — EXECUTION GOVERNANCE

## 14.1 Approval Workflow

| Action | Approver | Notes |
|--------|----------|-------|
| PROTECT/ENHANCE changes (links, schema, breadcrumb) | SEO Lead | Pre-approved (Phase 1 Part H) |
| Growth Layer new route | SEO Lead + Dev | Within hub namespaces |
| REFRESH article | SEO Lead | DoD 5.8 |
| MERGE / ARCHIVE / DELETE (>0 clicks in 90d) | Founder | Backlink check + Phase 1 gate |
| URL structure change | Founder | Banned this quarter (Phase 1) |
| Budget (freelance, ads, PR spend) | Founder | Monthly |
| Experiment scale-up (beyond pilot scope) | SEO Lead + Ops | Data-backed |
| Rollback execution | Dev (initiates) + SEO Lead (approves) | Any time, no wait |

## 14.2 Documentation

| Doc | Location | Maintained by | Cadence |
|-----|----------|--------------|---------|
| Backlog | `docs/ops/backlog/` | Ops/PM | Continuous |
| Sprint board | `docs/ops/sprints/` | Ops/PM | Per sprint |
| Weekly/Monthly reports | `docs/ops/reviews/` | Ops/PM | Weekly/Monthly |
| Decision Log | `docs/ops/decisions/` | Ops/PM | Continuous |
| Issue Log | `docs/ops/issues/` | SEO Lead | Continuous |
| Risk Register | `docs/ops/risks/` | Ops/PM | Monthly |
| Experiment Log | `docs/ops/experiments/` | SEO Lead | Continuous |
| AI prompts | `docs/ai-prompts/` | SEO Lead | Continuous |
| Templates | `docs/ops/templates/` | Ops/PM | On change |

## 14.3 Version Control

- **All docs + code in the Dreamlab repo** (single source of truth). Docs live with the code they describe.
- **Every change is a git commit with a message referencing the initiative code** (e.g., `GL1: add pricing hub page`).
- **Templates, DoD, and decision trees change only via PR + review** — they are living standards, not static docs. Version history is the audit trail.

## 14.4 Knowledge Management

- **Single wiki/home** (`docs/README.md`) linking the OEOS, Phase 1 blueprint, and Sprint 2 blueprints.
- **Postmortems** for every P0/P1 issue (Issue Log → postmortem if materialized risk).
- **"Tribal knowledge" rule:** anything explained more than twice becomes a doc; anything done twice becomes a template.
- **Onboarding:** new team members read: this OEOS + Phase 1 blueprint + 3 templates of their role + RACI.

## 14.5 Rollback Strategy

| Change type | Rollback method | Window |
|-------------|-----------------|--------|
| Content/refresh | git revert to previous content + reindex | 14 days |
| Route/page | remove route + 301 to parent | 30 days |
| Schema | remove JSON-LD | 7 days |
| CTA/link change | revert component change (feature flag) | 14 days |
| Tracking | keep GA4 (non-destructive) | — |
| Experiment | stop experiment (revert change) | immediate |

**Rollback rule:** every deploy carries a documented rollback plan (Deployment Checklist 12.12). If a rollback is executed, log it in Issue Log + Decision Log.

## 14.6 Ownership & Audit Trail

- **Every doc/log has a last-edited-by + date.** The audit trail is the git history — never overwrite without a commit message.
- **Quarterly governance audit:** Ops/PM verifies all logs are current, DoD compliance > 90%, and the Risk Register is updated. Outcome reported to Founder in QBR.
- **No one owns nothing:** every backlog item, KPI, and experiment has R + A. If you can't name the owner, it's not tracked — fix that first.

---

# QUICK WINS

## QW1 — Sprint 0 (Week 1): Stand up the Operating System itself

| # | Action | Owner | Hours | DoD | Success criteria |
|---|--------|-------|:---:|-----|------------------|
| 1 | Create `docs/ops/` folders + templates (12.1–12.12) | Ops/PM | 4 | Templates exist | All 12 templates usable |
| 2 | Wire GA4/GTM conversion events on money pages | Dev | 6 | 5.6/5.2 | Events fire in preview |
| 3 | Re-enable Breadcrumb + schema | Dev | 4 | 5.6 | Visible on top pages |
| 4 | Article CTA retarget (QW2 Phase 1) | Dev | 4 | 5.2 | No article CTA → legacy URL |
| 5 | Backlog seeded with Phase 1 codes (QW/TR/GL/CR) | Ops/PM | 2 | 8.2 | 20+ items scored |
| 6 | First weekly review held + Decision Log entry | Ops/PM | 1 | 12.3 | Log entry exists |

**Impact:** The machine starts turning in week 1. Every later initiative rides on these rails.

---

# 30 DAYS

## Month 1 Objectives
- OEOS running (backlog, sprints, weekly reviews, logs).
- Measurement live (GA4 events, GSC link, dashboard v1).
- First safe wins shipped (Phase 1 QW1–QW6).
- First Growth Layer pages live (GL1 Pricing Hub, GL2 Location Hub Surabaya/Jakarta).
- First experiments running (X1–X3).

## Deliverables
| Item | Owner | Dependency | DoD |
|------|-------|-----------|-----|
| Sprint 0 OS setup | Ops/PM | — | 12.x |
| QW1–QW6 hygiene | Dev + SEO | — | 5.x |
| TR5 + TR3 (nav/links) | Dev + SEO | QW2 | 5.7 |
| GL2 Location Hub (2 cities) | SEO + Dev + Writer | QW3/QW4 | 5.3 |
| GL1 Pricing Hub | SEO + Dev + Writer | QW2, QW5 | 5.2 |
| GL7 Checklist (email capture) | Rev Ops + Dev | QW5 | 5.2 |
| CR1 refresh top-5 commercial | Writer + SEO | — | 5.8 |
| Experiments X1–X3 launched | SEO Lead | QW5 | 13.3 |

## Month 1 KPIs
- Money-page clicks: +20% vs baseline
- GA4 events firing on all money pages
- 3 Growth Layer pages indexed
- 5 articles refreshed, URLs intact, DoD pass
- Backlog ≥ 20 items scored; weekly reviews on cadence

## Risks to watch
- Writer capacity (bottleneck) → freelance add if refresh slips.
- GA4 wiring delay → blocks all experiment measurement (guardrail).

---

# 90 DAYS

## Month 2–3 Objectives
- Growth Layer becomes a visible cluster (6–8 pages).
- Traffic refocus scaled across top-40 articles.
- Refresh cadence established (5/mo).
- Lead system producing first structured leads.
- Experiment decisions made (scale/kill X1–X7).

## Deliverables
| Item | Owner | Dependency | DoD |
|------|-------|-----------|-----|
| GL3 Comparison page | SEO + Writer | GL1 | 5.2 |
| GL6 BPOM guide | SEO + Writer + SME | — | 5.1 |
| GL5 MOQ/calculator upgrade | Dev + SME | GL1 | 5.4 |
| TR1 refocus across 40 articles | SEO + Writer | QW2 | 5.7 |
| CR2 next 5 refreshes | Writer | — | 5.8 |
| Pricing tables on money pages | Rev Ops + Dev | GL1 | 5.2 |
| Case Study #1 | SEO + Sales | Client approval | 5.5 |
| Dashboard role views (6) | Dev + Ops | QW5 + CRM | 11.3 |
| Experiment gate: scale/kill | SEO Lead | data | 13.2 |

## 90-Day KPIs
- Money-page clicks +50% vs baseline
- 6–8 Growth Layer pages indexed
- Structured leads: 5–10/mo
- 46 non-indexed content pages → −50%
- Top DIY pages hold CTR/position (guardrail)
- ≥ 2 experiments scaled OR cleanly killed (learning logged)

## Risks to watch
- SME queue (batch reviews, pre-approved claim templates).
- Conversion rate stagnant → the problem is page quality, escalate to content/deep dive.

---

# 180 DAYS

## Month 4–6 Objectives
- Consolidate (MERGE/ARCHIVE per Phase 1).
- Hubs expand to full clusters.
- Authority work begins (industry report, backlinks).
- CRM scoring + nurturing live.
- OEOS self-sustaining (no council hand-holding).

## Deliverables
| Item | Owner | Dependency | DoD |
|------|-------|-----------|-----|
| CR3 MERGE + CR4 ARCHIVE | SEO + Founder | backlink check | 5.8 |
| Location Hub → 10 cities | SEO + Dev + Writer | GL2 | 5.3 |
| Glossary live (30 terms) | Writer + SEO | — | 5.3 |
| Case Study Hub → 3 cases | SEO + Sales | permissions | 5.5 |
| Resource Center (3 assets) | Rev Ops | GL7 | 5.2 |
| Industry report draft | SEO + SME + Founder | data | 5.1 |
| CRM scoring + nurturing v1 | Sales Ops + Dev | QW5 + GL7 | 5.2 |
| Backlinks: 3–5 quality | Digital PR | report | PR DoD |
| Indexation target < 600 | Technical SEO | QW3/QW4 | 5.6 |

## 180-Day KPIs
- Non-indexed URLs < 600
- Money-page clicks +100% vs baseline
- Structured leads 20–30/mo
- Authority score 40/100
- Backlinks +5
- OEOS audit: DoD compliance > 90%

## Risks to watch
- Scope creep on hub expansion → capacity guardrails (Phase 2.5).
- MERGE/ARCHIVE stakeholder friction → communication plan (Phase 1 Part E).
- Data attribution still weak → CRM hygiene review.

---

# FINAL RECOMMENDATION

## If Dreamlab can operationalize only ONE thing this quarter...

**Stand up the Weekly Operating Rhythm — and make the Friday Weekly Review non-negotiable.**

### Why this, above everything else?

Every other element of the OEOS — the backlog, RACI, DoD, decision trees, experiments, dashboards — is machinery. Machinery is useless if it isn't run on a schedule. The Weekly Review is the single point where the whole system is checked, tuned, and re-committed. It is the heartbeat.

| Criterion | Assessment |
|-----------|-----------|
| **Long-term ROI** | The weekly review is the forcing function that makes the backlog real, the RACI accountable, the DoD enforced, and the decision trees used. A team that holds a disciplined 30-minute weekly review for 12 months will out-execute a team with better strategy but no rhythm. This is the compounding engine. |
| **Lowest risk** | Zero ranking risk. Zero technical risk. It's a meeting that produces written outputs. The only "risk" is organizational (consistency) — which is precisely what this recommendation institutionalizes. |
| **Evidence it's needed** | Dreamlab has 5 strategic documents and zero execution cadence documented. The gap between "strategy" and "ship" is not knowledge — it's rhythm. The OEOS's Phase 8–9 make this explicit. |
| **Mechanism** | Friday, 30 min, mandatory: 1) shipped vs committed, 2) 3 metrics (money-page CTR, indexation of new pages, leads), 3) issue/decision log entries, 4) next-week commit. Produces a written weekly report. Runs every week regardless of workload. |
| **Cost** | ~6 person-hours/week (30 min × ~12 attendees max, realistically 5–6 people = 3 hrs/wk). Zero spend. |
| **Confidence** | HIGH. Operating rhythm is the single most validated lever in execution management (Toyota/Scrum/PMO consensus). |
| **Stops it ever being "later"** | Cadence is the one thing that can't be "added later" cheaply — it must exist from the first week or habits form without it. Start Sprint 0. |

### Why NOT something else this quarter?

- **Not the dashboard** — a dashboard without a weekly rhythm is decoration. The rhythm defines what the dashboard must show.
- **Not the Growth Layer** — it's the highest *revenue* potential, but it's exactly the kind of work that stalls without a cadence forcing incremental shipping. Rhythm first, then Growth Layer on rails.
- **Not the experiments** — experiments need the weekly review to be read and decided. The review is their decision point.
- **Not the decision trees** — trees only get used when the review forces people to ask "which tree applies?"

### The ordering that follows

1. **Sprint 0:** Build templates + hold the first Weekly Review (even with 2 items on the board).
2. **Sprint 1:** Wire measurement (GA4) so the weekly review reads real data.
3. **Sprint 2:** Seed the backlog with Phase 1 initiatives and let the cadence pull work through.
4. **Quarter 1+:** Everything — Growth Layer, refresh, experiments, authority — gets pulled through the same weekly machine.

**One habit → one cadence → every initiative shipped, measured, and iterated → the entire OEOS becomes real.**

---

# APPENDIX A — CONFIDENCE ASSESSMENT (Full)

| Conclusion | Confidence | Basis |
|-----------|:---:|-------|
| Weekly rhythm is the highest-leverage operating lever | HIGH | PMO/Agile/Toyota consensus |
| 2-week sprints fit a 4–6 person async team | HIGH | Standard sizing |
| RACI + DoD + decision trees reduce execution error | HIGH | PMO standard |
| AI draft + human gate is the right quality/velocity split | HIGH | Reforge/Google practice |
| GA4/CRM wiring precedes other metrics | HIGH | You can't manage what you can't measure |
| Writer is the primary capacity bottleneck | MED-HIGH | 58h required vs 30h available (modeled) |
| Lead volume targets (5→50/mo) | MED | No CRM baseline exists; modeled |
| Revenue from organic attribution within 12 months | MED | Depends on CRM adoption + nurturing |
| Authority 90/100 in 12 months | MED | Sprint 2 Phase 5 trajectory model |
| CWV currently green | MED | Not fully verified in production |
| Team can sustain 60% utilization weekly | MED | No historical throughput data |
| Experiment attribution reliable with ≤3 concurrent | HIGH | Standard experimental hygiene |

# APPENDIX B — OPEN ITEMS / DATA GAPS

1. **No GA4 production event data** — conversion baselines are modeled. Wire QW5 first.
2. **No CRM lead history** — actual WhatsApp lead volume unknown. Sales to export baseline in Sprint 0.
3. **Exact per-article word counts for all 187** — compute once (script `scripts/check-article-words.mjs`); OPTIMASI-21 covers the 21 priority thin articles.
4. **Live sitemap URL count (~334)** — verify post QW3; GSC sitemap report is ground truth.
5. **Backlink inventory** — no Ahrefs/Semrush data in-environment; required before any MERGE/ARCHIVE.
6. **CWV in production** — run PSI snapshot (`scripts/pagespeed-snapshot.ts`) in Sprint 0 for baseline.
7. **Team capacity reality check** — the Phase 2 capacity table assumes ~6 people at 60%; confirm with actual team during Sprint 0 before committing to cadence targets.

# APPENDIX C — GLOSSARY

| Term | Meaning |
|------|---------|
| OEOS | Organic Execution Operating System (this document) |
| DoD | Definition of Done — checklist that gates "done" |
| RACI | Responsible/Accountable/Consulted/Informed ownership matrix |
| Sprint | 2-week execution cycle |
| WR / MR / QBR | Weekly Review / Monthly Review / Quarterly Business Review |
| Lane | One of 4 backlog streams: Quick Win / Traffic Refocus / Growth Layer / Content Refresh |
| Growth Layer | New routes independent of legacy content (Phase 1 Part D) |
| Traffic Refocus | Repointing existing visitor intent toward money pages (no URL changes) |
| Money Page | A page whose primary job is conversion (pabrik, jasa, harga, estimasi) |
| Experiment | Falsifiable change with pre-registered KPI + decision gate |
| Guardrail | A KPI that must not regress (stops an experiment regardless) |
| P0–P3 | Priority: this sprint / next / this month / backlog |

---

*End of SPRINT-3-PHASE2-EXECUTION-OPERATING-SYSTEM.md — the complete Organic Execution Operating System.*
*Next: SPRINT-3-PHASE3 when council approval is granted.*
