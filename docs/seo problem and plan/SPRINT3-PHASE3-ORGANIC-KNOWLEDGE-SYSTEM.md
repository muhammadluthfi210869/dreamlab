# SPRINT 3 — PHASE 3
# ORGANIC KNOWLEDGE & CONTINUOUS IMPROVEMENT SYSTEM (OKCIS)

**Document:** `SPRINT3-PHASE3-ORGANIC-KNOWLEDGE-SYSTEM.md`
**Date:** 2026-07-31
**Council:** Chief Knowledge Officer · Chief Learning Officer · Enterprise PMO Director · AI Operations Architect · Knowledge Management Consultant · Revenue Operations Director · Product Operations Director · Organizational Development Consultant · Continuous Improvement Specialist · Enterprise Systems Architect
**Predecessors:**
- Sprint 1: Discovery
- Sprint 2: Blueprint (WHAT — strategy)
- Sprint 3 Phase 1: Organic Transformation Blueprint (WHAT to change)
- Sprint 3 Phase 2: Organic Execution Operating System / OEOS (HOW to execute)
- **This document: HOW THE ORGANIZATION LEARNS (the learning layer)**

**KPI of this system:** Organizational intelligence — the rate at which Dreamlab converts experience (every action, experiment, ranking change, sales call, and failure) into reusable knowledge that compounds.

---

# EXECUTIVE SUMMARY

## The One-Sentence Truth

Dreamlab's strategy (Sprint 2) is strong, and its execution machine (Sprint 3 Phase 2) is now designed — but **a team that executes without capturing what it learns rebuilds the same wheel every month.** The OKCIS closes the loop: every action leaves a trace, every trace becomes knowledge, and every piece of knowledge makes the next action cheaper, faster, and better.

## What the OKCIS Is (and Is Not)

| Is | Is Not |
|----|--------|
| The learning layer on top of the OEOS execution machine | A knowledge-base dump / wiki graveyard |
| A system where every lesson becomes a reusable playbook/prompt/template | A documentation burden that slows execution |
| A customer-intelligence loop feeding content, sales, and product | A CRM report |
| A self-improving repository with owners, versioning, and audit | A folder nobody reads |
| A maturity model + executive scorecard for the whole organic program | Theory about "learning organizations" |

## The Core Loop (the heartbeat of organizational intelligence)

```
EXPERIENCE (every action, experiment, call, ranking change, failure)
        │
        ▼
   CAPTURE ──► raw data + context (who, when, what, why, outcome)
        │
        ▼
   VALIDATE ──► SME/SEO review (is the lesson real? generalizable?)
        │
        ▼
   DOCUMENT ──► structured entry (lesson, playbook, prompt, template, data)
        │
        ▼
   DISTRIBUTE ──► right person finds it at the right moment (repo + cadence)
        │
        ▼
   APPLY ──► reused in the next action (execution gets cheaper/faster)
        │
        ▼
   IMPROVE ──► outcome measured → loop refines the knowledge
        │
        ▼
   ARCHIVE ──► obsolete knowledge retired with a note, never silently deleted
```

**This loop is Phase 1 of this document and the operating principle of every other phase.**

## The 5 Non-Negotiable Learning Rules

1. **Nothing is wasted.** Every customer question, every lost ranking, every killed experiment, every sales objection is a knowledge source. If it was observed, it is captured.
2. **Every lesson becomes a reusable artifact** — a playbook, prompt, template, checklist, or dataset. A lesson documented but not made reusable is a diary entry, not knowledge.
3. **Learning is owned, not everyone's-and-nobody's.** Every repository, playbook, prompt, and dataset has a named owner + review frequency (Phase 13).
4. **Knowledge is versioned and approved.** Nothing enters the canonical repository without passing its quality standard. The git history is the audit trail.
5. **The system must survive Dreamlab.** The ultimate test (Phase "Final Question"): if Dreamlab disappeared tomorrow, another team must be able to rebuild the entire Organic Growth System using ONLY this documentation. Every gap found must be closed in this document.

## The Top 8 System Decisions (this document's backbone)

| # | Decision |
|---|----------|
| 1 | **One canonical repository** (`docs/knowledge/` in the repo) with 19 homes (Phase 2). Every piece of knowledge has exactly one home. |
| 2 | **Lessons Learned is a formal SOP** (Phase 3) with a capture trigger on every sprint/experiment/refresh/launch/update/ranking change/call — not an afterthought at review time. |
| 3 | **Playbooks are the unit of reuse** (Phase 4): 14 playbooks covering every repeatable page type and process. A new similar task = copy the playbook, not reinvent. |
| 4 | **Prompts are versioned artifacts** (Phase 5) with a quality score, benchmark, and owner — same governance as code. |
| 5 | **Customer Intelligence is a closed loop** (Phase 6): question → sales → CRM → gap → content/money page → documentation → prompt/playbook update. Nothing wasted. |
| 6 | **Proprietary data is Dreamlab's moat** (Phase 7): pricing, MOQ, packaging, ingredients, regulations data collected monthly and published as original research. |
| 7 | **Improvement runs on PDCA** (Phase 8) and **Innovation runs on a 9-stage pipeline** (Phase 9) — every idea has a home and never disappears. |
| 8 | **A 6-domain Health Scorecard** (Phase 11) gives the Founder one number per domain, each with formula, threshold, owner, and action. |

## Baseline (where Dreamlab starts)

| Dimension | Current state | Evidence |
|-----------|---------------|----------|
| Canonical knowledge repository | None (docs scattered across files, scripts, chats) | `docs/seo problem and plan/` has 8 reports; no central knowledge home |
| Lessons Learned SOP | None | No capture triggers exist |
| Playbook library | 0 (pilot page system is implicit, not documented) | `seo-pilot/*` components exist but no playbook |
| Prompt library | 0 (AI prompts not yet stored) | `docs/ai-prompts/` was specified in OEOS but doesn't exist yet |
| Customer intelligence loop | Fragmented (WhatsApp round-robin, no categorization) | 3 CS agents; no structured question/objection taxonomy |
| Proprietary datasets | None published | No pricing/MOQ/original research publicly |
| Health scorecard | None | No executive score |
| Maturity level | Level 1 (Basic) for most domains | Assessed in Phase 10 |

## Confidence Assessment (Headline)

| Conclusion | Confidence |
|-----------|:---:|
| Knowledge capture without ownership/versioning fails (becomes a wiki graveyard) | HIGH (documented org-design failure mode) |
| Playbooks are the right reuse unit for repeatable SEO content work | HIGH (agency best practice) |
| Customer questions → content loop yields high-ROI content | HIGH (Sprint 2 journey + OR-OS evidence) |
| Proprietary data is a durable moat vs competitors | MEDIUM-HIGH (no competitor publishes data; needs monthly discipline) |
| The "disappeared tomorrow" test is the right completeness standard | HIGH (Toyota/Amazon practice) |
| Maturity/scorecard numbers below are assessments, not measurements | MEDIUM (no baseline instruments yet) |

---

# PHASE 1 — KNOWLEDGE ARCHITECTURE

## 1.1 The Eight-Stage Knowledge Flow

```
KNOWLEDGE SOURCES (where knowledge originates)
   • GSC/GA4/CRM data      • experiments      • customer questions
   • sales calls           • ranking changes  • competitor moves
   • Google updates        • content outputs  • failures & wins
        │
        ▼
KNOWLEDGE CAPTURE (raw, no filtering)
   • standup + review logs     • issue/decision logs
   • experiment results        • customer objection notes
   • SERP snapshots            • sales call notes
        │
        ▼
VALIDATION (is it real? generalizable? worth codifying?)
   • SME / SEO Lead review     • threshold check (observed ≥ 2x or high-impact 1x)
   • cross-check against data  • reject noise, keep signal
        │
        ▼
DOCUMENTATION (into its ONE home)
   • playbook / prompt / template / dataset / lesson / decision
   • written per quality standard (Phase 13)
        │
        ▼
DISTRIBUTION (right person, right moment)
   • canonical repo search     • cadence digests (weekly/monthly)
   • onboarding pack           • pre-task "check the playbook" gate
        │
        ▼
APPLICATION (used in the next action)
   • executor opens playbook → executes → outcome
        │
        ▼
IMPROVEMENT (outcome feeds back)
   • did the playbook work? → update / deprecate / note variance
        │
        ▼
ARCHIVE (retired with a note)
   • moved to /archive/ with why + date + link to successor
```

## 1.2 Stage Specifications (Input / Process / Output / Owner)

| Stage | Input | Process | Output | Owner |
|-------|-------|---------|--------|-------|
| **Sources** | All org activity | Nothing filtered at source; capture everything machine-readable | Raw event stream | Everyone (culture) |
| **Capture** | Raw events | Templates: standup, weekly, experiment, issue, decision, call notes | Structured raw records | Ops/PM |
| **Validation** | Raw records | SME/SEO review; ≥2x rule; impact test | Validated lessons | SEO Lead + SME |
| **Documentation** | Validated lessons | Write into one home (Phase 2) per quality standard | Canonical artifacts | Ops/PM + owners |
| **Distribution** | Canonical artifacts | Search, digests, onboarding, pre-task gate | Pulled-by-need + pushed-by-cadence | Ops/PM |
| **Application** | Artifacts | Executor uses playbook/prompt/template | Executed work + outcome data | Executors |
| **Improvement** | Outcome data | Compare vs expected; update artifact | Version bump or deprecation | Owners |
| **Archive** | Deprecated artifacts | Move + note successor | Archive with audit trail | Ops/PM |

## 1.3 The Flow Rules

1. **Capture is cheap, validation is the gate.** Never skip capture (it's free); always validate before codifying (or the repo fills with noise).
2. **Every artifact has exactly ONE home** (Phase 2). If it doesn't have a home, it doesn't exist — it's in someone's head or chat.
3. **Application always consults the playbook first.** "Check the playbook" is a pre-task gate in the OEOS sprint flow (Phase 2, 8.5).
4. **Improvement is mandatory, not optional.** Every artifact has a review frequency; if it's never reviewed, it becomes obsolete and misleads.
5. **Archiving is respectful** — never silent deletion. A note explains why and links the successor.

---

# PHASE 2 — KNOWLEDGE REPOSITORY

## 2.1 The Repository Map (19 homes)

Root: **`docs/knowledge/`** in the Dreamlab repo (single source of truth, git-versioned, searchable). Subdirectories are the 19 homes. Every piece of knowledge lives in exactly one home.

| # | Home | Contents | Owner | Review freq. |
|---|------|----------|-------|:---:|
| 1 | `seo/` | Ranking data, SERP analyses, keyword maps, GSC learnings, search intent studies | SEO Lead | Monthly |
| 2 | `content/` | Published assets, refresh records, content performance, style guide | Writer/Content Ops | Monthly |
| 3 | `sales/` | Objection handling, lead qualification learnings, sales call notes (anonymized), conversion scripts | Sales/CS Lead | Weekly |
| 4 | `technical/` | Schema patterns, sitemap/proxy changes, CWV fixes, deployment learnings | Developer | Monthly |
| 5 | `products/` | Product data, formulation info, category performance, product-level learnings | SME/R&D | Quarterly |
| 6 | `pricing/` | Pricing ranges, cost drivers, quote learnings, pricing experiments | Rev Ops + SME | Monthly |
| 7 | `experiments/` | All experiments (X1–X7+), results, scale/kill decisions | SEO Lead | Weekly |
| 8 | `serp/` | SERP snapshots, feature appearance, AI Overview tracking | SEO Lead | Monthly |
| 9 | `competitors/` | Competitor pages, positions, moves, reverse-engineering notes | SEO Lead | Monthly |
| 10 | `google-updates/` | Core update log, impact assessment, response actions | SEO Lead | On event |
| 11 | `customer-questions/` | Categorized customer questions, FAQ mining, journey insights | Sales + SEO | Weekly |
| 12 | `lead-objections/` | Lead/sales objections taxonomy + responses | Sales | Weekly |
| 13 | `case-studies/` | Client stories, numbers, permissions, outcomes | Sales + SEO | Quarterly |
| 14 | `digital-pr/` | Outreach records, placements, backlink outcomes, pitch templates | Digital PR | Monthly |
| 15 | `ai-prompts/` | Versioned prompt library + benchmarks | AI Ops | Monthly |
| 16 | `templates/` | All OEOS templates (Phase 12 of Phase 2 doc) | Ops/PM | Quarterly |
| 17 | `playbooks/` | The 14 playbooks (Phase 4) | SEO Lead | Quarterly |
| 18 | `lessons-learned/` | Structured lessons with source + validation + reuse link | Ops/PM | Weekly |
| 19 | `governance/` | Decision log, issue log, risk register, knowledge governance rules | Ops/PM | Continuous |

## 2.2 Naming Convention (Phase 13 detail)

`YYYY-MM-DD -- topic -- type.md` (e.g., `2026-08-14 -- pricing-hub -- playbook.md`). Machine-sortable, human-readable.

## 2.3 Repository Rules

1. **One canonical copy.** Derivatives (dashboards, docs, presentations) link to the canonical, never duplicate it.
2. **Every file has a header block:** owner, created, last-reviewed, quality standard passed, status (draft/approved/deprecated).
3. **Searchability over curation:** naming + full-text search (git) beats perfect taxonomy. If you can find it in 2 searches, it's distributed.
4. **Empty homes are red flags.** A home with no entries means the flow isn't being captured — review cadence catches it.
5. **Repository health is a scorecard input** (Phase 11 — "Knowledge" score).

## 2.4 Repository Starter Content (Sprint 0 — migrate what exists)

| From | Into home |
|------|-----------|
| `docs/seo problem and plan/*` (Sprint 1–3 reports) | `seo/`, `content/`, `experiments/` (as approved standards) |
| `OPTIMASI-21-ARTIKEL-TIPIS.md` | `content/` (refresh triage as a playbook input) |
| `src/data/seo-pilot/*` page patterns | `playbooks/` (extract the implicit playbook) |
| OEOS templates (Phase 2 doc 12.x) | `templates/` |
| GSC exports + audits | `seo/` (raw + interpreted) |
| Round-robin / lead config | `technical/`, `sales/` |
| `docs/ai-prompts/` (to be created) | `ai-prompts/` |

---

# PHASE 3 — LESSONS LEARNED SYSTEM

## 3.1 The Lesson SOP (extract → validate → document → reuse)

```
TRIGGER (an event that demands a lesson)
   │
   ▼
1. EXTRACT — who/what/when/why/outcome, in the moment (≤24h)
   │
   ▼
2. VALIDATE — ≥2x rule OR high-impact-1x rule; SME/SEO check
   │
   ▼
3. DOCUMENT — structured lesson card into lessons-learned/
   │
   ▼
4. REUSE — which playbook/prompt/template/dataset does it update?
   │
   ▼
5. LINK — lesson card links its successor artifact + reverse link
```

## 3.2 Capture Triggers (mandatory)

| Trigger | Who captures | When | Template |
|---------|-------------|------|----------|
| Sprint ends | Ops/PM | Sprint review day | 3.4 card |
| Experiment ends | SEO Lead | Decision gate day | 3.4 + Experiment template |
| Content refresh completes | Writer + SEO | On DoD pass | 3.4 |
| Page/campaign launches | Dev + SEO | 14 days post-launch | 3.4 |
| Google core update | SEO Lead | 2 weeks after announcement | 3.4 + 10.5 |
| Ranking loss (decision tree 7.1 fired) | SEO Lead | At resolution | 3.4 + Issue Log |
| Ranking gain (notable) | SEO Lead | When observed | 3.4 |
| Customer feedback (notable) | Sales | Same day | 3.4 + Customer loop (Phase 6) |
| Sales call (won/lost, 30+ min) | Sales | Same day | 3.4 + call notes |
| Killed experiment | SEO Lead | At kill | 3.4 (kills are gold) |
| Technical incident | Dev | At resolution | 3.4 + postmortem (if P0/P1) |
| Competitor launch | SEO Lead | At detection | 3.4 + competitors/ |

## 3.3 The ≥2x / High-Impact-1x Validation Rule

| Observation | Validated? |
|-------------|-----------|
| Seen 2+ times (e.g., two customers ask the same question) | YES → codify |
| Seen once but high impact (e.g., a formula claim issue) | YES → codify (SME sign-off) |
| Seen once, low impact, anecdotal | Capture raw, don't codify (keep in source log) |

## 3.4 Lesson Card (template)

```markdown
# LESSON — [ID] — [short title]
- Date: [ ] | Source trigger: [sprint/experiment/refresh/launch/update/rank/call/...]
- Who extracted: [ ] | Who validated: [ ] (SME/SEO)
- WHAT happened: [ ] | Context (what changed, when, sample size): [ ]
- WHY it happened: [root cause, not symptom]
- OUTCOME: [data / metric before vs after]
- LESSON (generalizable, 1–2 sentences): [ ]
- REUSE → updates: [playbook/prompt/template/dataset IDs]
- Status: DRAFT / VALIDATED / APPLIED / ARCHIVED
- Reviewed: [date] | Next review: [date]
```

## 3.5 Weekly Lesson Review (part of OEOS weekly review)

- Ops/PM lists all lesson cards created that week (validated + raw).
- SEO Lead confirms validation status; assigns REUSE targets.
- Anything not captured that should have been → logged as a process gap (the system self-corrects).
- Monthly: the Monthly Review promotes validated lessons into playbook/prompt updates.

## 3.6 Reuse Rule (the point of lessons)

- A lesson that doesn't update a playbook/prompt/template/dataset within 30 days is either (a) not yet generalizable, or (b) a process failure. The Monthly Review forces the call.
- **Every playbook version notes which lessons drove the change** (traceability).

---

# PHASE 4 — PLAYBOOK LIBRARY

## 4.1 What a Playbook Contains (the universal structure)

Every playbook = Goal · Inputs · Steps · Checklist · Examples · Mistakes · KPIs.

| Field | Definition |
|-------|-----------|
| **Goal** | The outcome + the KPI it moves (from KPI tree) |
| **Inputs** | Data, research, approvals, dependencies needed before start |
| **Steps** | Numbered sequence (1..n) — do exactly this |
| **Checklist** | Final verification (often = a DoD from OEOS Phase 5) |
| **Examples** | 1–2 real Dreamlab examples (from lessons/artifacts) |
| **Mistakes** | Known failure modes (from lessons learned) |
| **KPIs** | Success + guardrail metrics |

## 4.2 The 14 Playbooks (with owner + reuse trigger)

| # | Playbook | Owner | Used when | Links |
|---|----------|-------|-----------|-------|
| P1 | **Pricing Page** | Rev Ops + SEO | Building any pricing/estimasi page | GL1, GL5, X4 |
| P2 | **Money Page** | SEO Lead | Any conversion-first page (pabrik, jasa, private-label) | GL1–GL8, 5.2 DoD |
| P3 | **Location Page** | SEO Lead | Any city/maklon-lokasi page | GL2, X5 |
| P4 | **Comparison Page** | SEO Lead | Any perbandingan/maklon-vs page | GL3 |
| P5 | **Glossary** | Writer + SEO | Adding glossary terms/entities | GL4 |
| P6 | **FAQ** | Writer + SEO | FAQ sections + FAQ schema | QW8, 5.6 DoD |
| P7 | **Case Study** | SEO + Sales | Any client story | GL8, 5.5 DoD |
| P8 | **Digital PR** | Digital PR | Any outreach/backlink campaign | Phase 1 Part G |
| P9 | **Content Refresh** | SEO + Writer | Any REFRESH (CR1–CR5) | 5.8 DoD |
| P10 | **Internal Linking** | SEO Lead | Any link change / refocus | TR1, TR3, 5.7 DoD |
| P11 | **Topic Cluster** | SEO Lead | Building any pillar+cluster | Sprint 2 Phase 5 |
| P12 | **Knowledge Hub** | SEO Lead | Any hub (pricing/location/glossary) | GL1–GL4, 5.3 DoD |
| P13 | **Authority Building** | SEO + PR | Any authority/E-E-A-T/backlink play | Phase 1 Part G, GL8 |
| P14 | **Lead Capture / CTA** | Rev Ops + SEO | Any CTA/lead form/WhatsApp flow | QW2, GL7, OR-OS |

## 4.3 Playbook Lifecycle

1. **Create** — from a validated lesson or a proven implicit pattern (e.g., extract from `seo-pilot` components).
2. **Approve** — SEO Lead (content/SEO) or Rev Ops (sales/conversion); quality standard check (Phase 13).
3. **Use** — executor opens the playbook at the pre-task gate (OEOS 8.5).
4. **Update** — every Quarterly Evolution (Phase 12) + on new lessons.
5. **Deprecate** — when obsolete; move to archive with successor note.

## 4.4 Playbook Starter Set (Sprint 0)

Extract 2 playbooks from existing code/data on day 1 to prove the pattern:
- **P2 Money Page** — from `seo-pilot` batch-1/2 page configs (hero, quick answers, decision box, table, FAQ, CTA, schema).
- **P9 Content Refresh** — from `OPTIMASI-21-ARTIKEL-TIPIS.md` triage (SERP check → intent ladder → word-count target → decision block → links).

**This proves the system works before scaling to all 14.**

---

# PHASE 5 — AI PROMPT GOVERNANCE

## 5.1 Prompts Are Code-Grade Artifacts

Prompts are treated like code: versioned, reviewed, tested, benchmarked, and owned. The `docs/knowledge/ai-prompts/` library (also referenced as `docs/ai-prompts/` in the OEOS) is the canonical home.

## 5.2 Prompt Lifecycle

```
IDEA ──► DRAFT ──► TEST ──► BENCHMARK ──► APPROVE ──► PUBLISH ──► USE
                                        │
                                        ▼
                                  (feedback loop)
                                        │
                                        ▼
                            VERSION BUMP / DEPRECATE
```

| Stage | Who | Rule |
|-------|-----|------|
| Idea | Anyone | Log in prompt backlog (never lost — innovation pipeline, Phase 9) |
| Draft | AI Ops + owner | Write prompt to library with metadata header |
| Test | AI Ops | Run against 3 sample tasks; capture outputs |
| Benchmark | AI Ops + SEO | Score outputs (below); compare vs current best |
| Approve | SEO Lead (SEO prompts) / Rev Ops (sales prompts) | Quality standard gate |
| Publish | AI Ops | Versioned file + changelog |
| Use | Executors | Executor loads the approved version only |
| Improve | Owner | On feedback; version bump; never edit silently |

## 5.3 Prompt Quality Score (1–10, computed per benchmark)

| Dimension | Weight | What's scored |
|-----------|:---:|---------------|
| Output accuracy | 30% | Factual correctness, no hallucination |
| Intent alignment | 25% | Does it match the query intent/answer pattern? |
| Brand/voice fit | 15% | Reads like Dreamlab (Indonesian, trustworthy, expert) |
| Structure utility | 15% | Usable structure (outline/table/FAQ/schema-ready) |
| Reproducibility | 15% | Stable quality across runs/samples |

**Gate:** a prompt publishes at score ≥ 7.0; below that it stays in draft. A prompt is deprecated at score < 6.0 or when superseded.

## 5.4 Prompt Metadata Header (every prompt file)

```markdown
# PROMPT — [ID] — [name]
- Version: v1.0 | Owner: [ ] | Approver: [ ]
- Created: [date] | Last benchmarked: [date] | Score: [x/10]
- Status: DRAFT / APPROVED / DEPRECATED
- Purpose: [which playbook/task it serves]
- Related playbook: [P#] | Related lessons: [lesson IDs]
- Inputs required: [data/research it needs]
- Known failure modes: [ ]
```

## 5.5 Prompt Versioning Rules

1. **Never edit an approved prompt in place** — create v1.1, benchmark, then swap.
2. **Changelog is mandatory** — what changed, why, which lessons drove it.
3. **Deprecation note** links the successor. Old versions remain searchable (audit trail).
4. **Benchmark quarterly** (or on new model/tooling) — prompts decay as models/tools change.
5. **Ownership** — one named owner per prompt; an unowned prompt is deleted in the next quarterly review.

## 5.6 Starter Prompt Library (8 prompts from OEOS Phase 6)

`serp-answer-pattern.md`, `outline-from-intent.md`, `draft-indonesian-article.md`, `faq-schema-jsonld.md`, `internal-links-suggest.md`, `meta-title-desc.md`, `refresh-diff.md`, `claim-factcheck.md` — each created with the metadata header on day 1.

---

# PHASE 6 — CUSTOMER INTELLIGENCE LOOP

## 6.1 The Loop (nothing wasted)

```
CUSTOMER QUESTION (WhatsApp, email, call, comment, review)
        │
        ▼
1. SALES/CS captures (template: source, verbatim question, context, outcome)
        │
        ▼
2. CRM records (Kommo: question field, lead stage, source)
        │
        ▼
3. CATEGORIZE (weekly) — taxonomy: product type / process / pricing / regulation / MOQ /
   packaging / BPOM / comparison / objection / other
        │
        ▼
4. KNOWLEDGE GAP check — do we have a page/FAQ/answer for this? (repo search)
        │
        ├── YES → ensure sales has the answer artifact + FAQ schema updated
        │
        └── NO → GAP logged (customer-questions/ + FAQ backlog)
                    │
                    ▼
5. CONTENT — new article / FAQ addition / money-page answer (via content backlog)
        │
        ▼
6. MONEY PAGE — if the question is commercial (pricing/MOQ/BPOM), update money page
        │
        ▼
7. PRODUCT — if it's a formulation/regulatory signal, R&D/SME logs product opportunity
        │
        ▼
8. DOCUMENTATION — lesson card + FAQ template updated
        │
        ▼
9. PROMPT UPDATE — drafting prompt improved with the new answer pattern
        │
        ▼
10. PLAYBOOK UPDATE — P6 FAQ / P2 Money Page updated with the new pattern
```

## 6.2 Capture Template (Sales/CS, 30 seconds)

```markdown
- Date: [ ] | Source: [WhatsApp/email/call/IG/comment]
- Verbatim question: [ ]
- Customer stage: [new/research/comparing/ready]
- Outcome: [answered/lead/converted/no answer]
- Category: [from taxonomy]
- Notable objection: [if any]
```

## 6.3 Weekly Categorization (part of OEOS weekly review)

- Sales/CS Lead categorizes the week's questions (≤30 min).
- SEO Lead runs the gap check against the repo.
- Gaps go into the content backlog (as FAQ/refresh/new page items) + FAQ backlog.
- **The weekly review's Customer segment** — top 3 questions of the week get answers fast (48h for FAQ additions).

## 6.4 The Objection Taxonomy (starter — lives in `lead-objections/`)

| Objection category | Examples (anonymized) |
|--------------------|----------------------|
| Pricing | "Too expensive" / "what's the minimum order cost?" |
| MOQ | "MOQ too high" / "can I start with 100 pcs?" |
| Trust | "How do I know quality?" / "Show me BPOM/Halal cert" |
| Timeline | "How long until launch?" / "production too slow" |
| Risk | "What if formula fails?" / "what if sales are bad?" |
| Comparison | "Why you vs competitor X?" |
| Location | "Can I meet in Jakarta?" / "do you deliver to Bandung?" |
| Regulation | "Do you handle BPOM?" / "is it halal certified?" |

**Each objection gets: a response script (sales), a content answer (SEO), and a money-page CTA (conversion).** The loop closes three times per question — that's the point.

## 6.5 Rules

1. **Every question is captured, even the silly ones.** "Silly" questions are often the earliest funnel signal.
2. **Verbatim beats paraphrase** — customer language is the exact language of content/SERP mining.
3. **Questions that recur 2+ times = validated lesson** (≥2x rule) → codify.
4. **The loop is weekly, not ad-hoc.** Categorization happens in the weekly review; nothing waits for a "data month."

---

# PHASE 7 — ORGANIC DATA STRATEGY (Proprietary Datasets)

## 7.1 Why Proprietary Data Is the Moat

Sprint 2 found: **no maklon competitor publishes pricing, MOQ, or industry data.** Original research + proprietary datasets are the single most durable authority signal Google can't copy from competitors (E-E-A-T + uniqueness + citation magnet). The Data Strategy makes data collection a **monthly operating habit**, not a one-off report.

## 7.2 The 12 Proprietary Datasets

| # | Dataset | What's collected | Source | Monthly refresh | Publication |
|---|---------|------------------|--------|:---:|-------------|
| D1 | **Pricing ranges** | Realistic ranges by product type/MOQ/packaging | Internal quotes (anonymized) | Yes | Pricing Hub + reports |
| D2 | **MOQ benchmarks** | Minimums by category, trend | Sales data | Yes | Pricing Hub + articles |
| D3 | **Packaging costs** | Cost drivers, MOQ by packaging type | R&D + suppliers | Quarterly | Glossary + pricing |
| D4 | **Ingredient cost indexes** | Key ingredient price trends | R&D + suppliers | Quarterly | Industry reports |
| D5 | **Regulation changes** | BPOM/Halal/CPKB updates | SME monitoring | Monthly | Articles + alerts |
| D6 | **Manufacturing timelines** | Average lead times by product | Ops data | Quarterly | Money pages + FAQ |
| D7 | **Lead objections** | Objection frequency + conversion rates | CRM + sales | Monthly | Internal + playbooks |
| D8 | **Sales objections** | Same, sales-specific | Sales | Monthly | Internal |
| D9 | **Competitor gaps** | What competitors lack (pricing, location, data) | SERP + competitor scans | Monthly | Strategy + PR |
| D10 | **Search trends** | Query volume shifts, new intents | GSC + keyword tools | Monthly | Content calendar |
| D11 | **FAQ bank** | All customer questions, categorized, with answer status | Customer loop (Phase 6) | Weekly | FAQ pages + schema |
| D12 | **Industry statistics** | Market size, growth, trends (with sources) | Public research + SME | Quarterly | Industry reports + PR |

## 7.3 Dataset Lifecycle (collection → validation → storage → publication → refresh)

```
COLLECT (monthly/quarterly per dataset schedule)
   ▼
VALIDATE (SME checks numbers; no invented data — every figure has a source)
   ▼
STORE (docs/knowledge/ + optionally supabase for structured data; versioned CSV/JSON)
   ▼
PUBLISH (as original research on money pages / /riset/ / PR) — ONLY after validation
   ▼
REFRESH (calendar-triggered; stale data is worse than no data → auto-flag if >2x interval)
```

## 7.4 Data Rules

1. **Never publish unvalidated data.** The quality standard: every published figure has a source + date. Confidence label where estimated.
2. **Anonymize internal data** (quotes, MOQ) — protect real client numbers.
3. **Stale data auto-flags** — each dataset has a refresh interval; the repository health check (Phase 11) scores freshness.
4. **Original research is a backlink magnet** — each published dataset becomes a Digital PR pitch (Phase 1 Part G, P8 playbook).

---

# PHASE 8 — CONTINUOUS IMPROVEMENT FRAMEWORK (PDCA)

## 8.1 The PDCA Loop, Applied to Dreamlab's Domains

```
PLAN (choose the improvement, define expected outcome + KPI)
  │
  ▼
DO (implement at small scale — experiment or single change)
  │
  ▼
CHECK (measure against expected KPI; guardrail intact?)
  │
  ▼
ACT (scale / adjust / revert; document as lesson → playbook update)
  │
  └───────────► back to PLAN (next improvement)
```

## 8.2 PDCA by Domain (what enters the loop, who runs it)

| Domain | Example improvement | PDCA driver | Cadence | Output |
|--------|---------------------|-------------|---------|--------|
| **SEO** | New internal-link pattern | SEO Lead | Continuous | Link playbook update |
| **Content** | New article structure | Writer + SEO | Monthly | P2/P9 update |
| **AI** | New prompt / prompt tweak | AI Ops | Monthly | Prompt version bump |
| **Sales** | New objection script | Sales Lead | Weekly | Objection playbook |
| **Products** | New formulation signal from questions | SME/R&D | Quarterly | Product backlog |
| **Technical** | CWV fix pattern | Developer | Monthly | Technical playbook |
| **Authority** | New backlink acquisition pattern | Digital PR | Monthly | P8/P13 update |
| **Conversion** | New CTA layout | Rev Ops + SEO | Monthly | P14 update |

## 8.3 PDCA Rules

1. **Every improvement enters the loop — no exceptions.** A "one-off improvement" that isn't looped becomes tribal knowledge and is lost.
2. **CHECK uses the KPI tree (Phase 10, Phase 2 doc).** If it doesn't connect to a KPI node, it's not an improvement — it's activity.
3. **ACT always documents** (lesson card → playbook/prompt/template update). PDCA without documentation is a treadmill.
4. **Small, frequent loops beat big, rare ones.** One improvement per domain per month = 8 domains × 12 months = 96 improvements/year compounding.

---

# PHASE 9 — INNOVATION PIPELINE

## 9.1 The 9-Stage Pipeline (ideas never disappear)

```
IDEA (anyone, anywhere — logged, never lost)
  │
  ▼
VALIDATION (does it serve a KPI? is it novel? evidence?)
  │
  ▼
EXPERIMENT (X-format; falsifiable hypothesis + KPI + guardrail)
  │
  ▼
PROTOTYPE (minimal implementation)
  │
  ▼
DEPLOY (shipped to production at small scale)
  │
  ▼
MEASURE (data vs expected)
  │
  ▼
SCALE (roll wider if KPI met + guardrail intact)
  │
  ▼
STANDARDIZE (write the playbook/template/prompt)
  │
  ▼
KNOWLEDGE BASE (promote to canonical repo; lesson linked)
```

## 9.2 Idea Intake (never lost)

| Intake channel | Where ideas land | Who reviews |
|----------------|------------------|-------------|
| Weekly review "ideas" segment | Innovation backlog | Ops/PM |
| Retrospective | Innovation backlog | Ops/PM |
| Customer question insight | Customer gap log → innovation backlog | SEO Lead |
| Experiment learning | Experiment log → innovation backlog | SEO Lead |
| Founder/team brainstorms | Innovation backlog | Ops/PM |
| Competitor observation | competitors/ → innovation backlog | SEO Lead |

**Rule:** every idea gets an ID and a status (backlog / validating / experimenting / scaling / standardized / killed). Nothing disappears — even a killed idea stays with its learning. The innovation backlog is reviewed monthly in the Monthly Review; the top idea per quarter moves to experiment.

## 9.3 Innovation Pipeline Rules

1. **Ideas are free; focus is expensive.** Validation filters ideas against KPI tree + capacity (Phase 2 of OEOS). Not all ideas become experiments — that's correct.
2. **One idea per quarter gets promoted to a full experiment** (capacity rule). The rest stay visible in the backlog.
3. **A killed idea is documented** (learning), never silently dropped.
4. **Standardization is the goal** — an idea that works but isn't standardized is a fluke, not an improvement.

## 9.4 Innovation Backlog (starter entries from Sprint 2/3)

| Idea | Source | Status |
|------|--------|--------|
| Interactive MOQ/budget planner (GL5) | Sprint 2 Phase 6 | Experiment (X4/X5 adjacent) |
| Industry report as backlink magnet (D12) | Phase 7 data strategy | Backlog |
| Packaging visualizer tool | Sprint 2 gap | Backlog |
| Location hub → 10 cities | Sprint 2 Phase 1/2 | Scaling |
| WhatsApp nurturing sequence | Sprint 2 Phase 6 | Backlog |
| Pricing transparency hub | Sprint 2 Phase 1 | Experiment (X4) |
| AI-assisted FAQ mining from customer questions | Phase 6 loop | Backlog |

---

# PHASE 10 — ORGANIC MATURITY MODEL

## 10.1 The 5 Levels

| Level | Name | Definition |
|:---:|------|-----------|
| 1 | **Basic** | Ad-hoc. Work happens; knowledge lives in heads; no documentation; no cadence; results not attributed. |
| 2 | **Structured** | Processes documented; templates exist; cadence runs; some knowledge captured; partial attribution. |
| 3 | **Scalable** | Playbooks/prompts systematized; team can grow without re-teaching; knowledge reuse is normal; attribution reliable. |
| 4 | **Optimized** | Data-driven improvement loops (PDCA + innovation) run continuously; knowledge auto-updates; performance compounding. |
| 5 | **World Class** | Self-learning organization; new team can rebuild from docs; innovations standardize weekly; industry authority. |

## 10.2 Maturity Assessment per Domain (Dreamlab baseline, 2026-07-31)

| Domain | Level | Evidence / Reasoning |
|--------|:---:|----------------------|
| **SEO** | 2 | Strategy documented (Sprint 2); no playbook library yet; no data-driven improvement loop running |
| **Execution** | 2 | OEOS designed (Phase 2 doc) but not yet running; templates not yet created |
| **Knowledge** | 1 | No canonical repository; lessons not captured; scattered docs |
| **Authority** | 2 | Strong certs/500+ brands (real E-E-A-T), but no original research/backlink engine yet |
| **AI** | 1 | AI prompts not yet library-governed; usage ad-hoc |
| **Operations** | 2 | Round-robin/lead infra working; no CRM attribution baseline |
| **Revenue** | 1 | No structured leads; no attribution; WhatsApp-only |
| **Technical** | 3 | Next.js architecture sound; sitemap/robots/proxy structured; schema partial — few systems automated |
| **Leadership** | 2 | Vision + strategy clear; cadence not yet institutionalized |
| **People** | 2 | Small skilled team; no onboarding pack; knowledge in heads |

**Overall baseline: Level 2 (Structured) with Knowledge/AI/Revenue at Level 1.**

## 10.3 Level-Up Levers (how each domain advances)

| Domain | Level 2 → 3 | Level 3 → 4 |
|--------|-------------|-------------|
| SEO | 14 playbooks live + used | PDCA loops auto-update playbooks |
| Execution | Weekly cadence institutionalized | Cadence self-tunes via review data |
| Knowledge | Repository live + 100% capture triggers | Knowledge auto-distributed (digests, pre-task gates) |
| Authority | 1 industry report + 10 data datasets | Monthly original research; citation rate tracked |
| AI | Prompt library versioned + benchmarked | Prompts auto-improve from output feedback |
| Operations | CRM + dashboards live | Forecast + lead scoring automated |
| Revenue | 5–50 leads/mo attributed | Attribution multi-touch; revenue in dashboards |
| Technical | Schema/sitemap automated + tested | CWV monitoring auto-alerts; self-healing |
| Leadership | QBR + monthly cadence held | Org makes data-driven pivots proactively |
| People | Onboarding pack exists | Team can scale 2× without founder teaching |

## 10.4 Maturity Review

- **Quarterly (QBR):** re-score all 10 domains. Trend = the organization's learning rate.
- **Target:** Level 3 across all domains by month 6; Level 4 in Revenue/SEO/Knowledge by month 12.
- **Confidence in targets:** MEDIUM — depends on cadence discipline (the OEOS Phase 2 recommendation) + data wiring (QW5/CRM).

---

# PHASE 11 — ORGANIC HEALTH SCORECARD

## 11.1 The 9-Domain Executive Score (0–100)

Each domain scores 0–100 via a formula from measurable inputs. The composite is the single "Organic Health Score" the Founder sees quarterly. Every score has: weight, formula, threshold, owner, actions.

| Domain | Weight | Formula (0–100) | Threshold (healthy) | Owner | Actions if below |
|--------|:---:|-----------------|:---:|-------|------------------|
| **Knowledge** | 10% | Repository health: homes populated (≥80%) × artifacts current (≤1× refresh interval stale) × lesson capture rate (≥90% triggers logged) | ≥70 | Ops/PM | Run capture gaps; clear stale queue |
| **Execution** | 15% | Sprint completion rate × weekly review adherence × DoD pass rate | ≥80 | Ops/PM | Re-train cadence; clear DoD debt |
| **Authority** | 15% | Authority score (Sprint 2 Phase 5 model: 20→90) | ≥40 by M6, ≥70 by M12 | SEO Lead | Original research + backlinks |
| **Revenue** | 20% | Qualified leads/mo vs target × conversion rate vs target × attribution coverage | ≥70 | Rev Ops | Fix funnel; wire CRM; nurturing |
| **Technical** | 10% | Indexation health × CWV green % × sitemap/robots consistency × schema validity | ≥80 | Developer | Fix flagged items; CI checks |
| **AI** | 5% | Prompt library versioning compliance × avg prompt score × adoption rate | ≥70 | AI Ops | Re-benchmark; simplify prompts |
| **Innovation** | 5% | Ideas logged × experiments run × standardized rate | ≥60 | SEO Lead | Open pipeline; promote an idea |
| **Learning** | 10% | Lessons captured × validated × reused (30-day reuse rate) | ≥70 | Ops/PM | Enforce lesson SOP |
| **Customer Intelligence** | 10% | Questions captured × gaps closed (content/money-page updates) | ≥70 | Sales + SEO | Run the loop weekly |

**Composite = Σ (domain score × weight).** Target ≥ 70 = healthy, ≥ 80 = strong, ≥ 60 = watch.

## 11.2 Scorecard Mechanics

| Aspect | Rule |
|--------|------|
| **Weight** | Fixed annually (or on Founder direction). Revenue is the heaviest — the scorecard is a business instrument, not a vanity dashboard. |
| **Formula** | Each domain's inputs come from the repo/logs/dashboards (Phases 2, 10 of this doc + OEOS dashboards). No subjective scoring — every input is a measured field. |
| **Threshold** | Red < 60 · Yellow 60–70 · Green ≥ 70 (per domain). Composite same bands. |
| **Owner** | Named per domain (above). Owner presents their domain in the QBR. |
| **Actions** | Below-threshold domain triggers a PDCA cycle (Phase 8) + a QBR action item with owner + date. |

## 11.3 Scorecard Cadence & Output

- **Monthly:** data feeds (automated where possible — GA4/GSC/CRM/backlog). Ops/PM computes.
- **Quarterly (QBR):** full review — score, trend vs last quarter, top-2 actions per low domain, next-quarter targets.
- **Output:** a one-page scorecard (Appendix: template) the Founder reads in 5 minutes. Trend line = organizational learning rate.

## 11.4 Scorecard Rules

1. **No subjective scoring.** Every input maps to a field in a log/repo/dashboard. If it can't be measured, it doesn't enter the formula.
2. **Scores move quarterly at most** — weekly noise is not a score change.
3. **Low score is a signal, not a failure** — it triggers a PDCA action, never blame.
4. **Composite trend is the north metric** for the "organizational intelligence" KPI this document serves.

---

# PHASE 12 — QUARTERLY EVOLUTION PROCESS

## 12.1 Nothing Stays Static (the quarterly refresh)

```
REVIEW (QBR: scorecard, maturity, lessons, experiment results, roadmap)
  │
  ▼
LESSONS (validated lessons promoted to artifacts)
  │
  ▼
PLAYBOOK UPDATES (14 playbooks re-verified; version bumps)
  │
  ▼
PROMPT UPDATES (re-benchmark; version bumps; deprecate stale)
  │
  ▼
TEMPLATE UPDATES (OEOS 12.x templates revised if process changed)
  │
  ▼
DASHBOARD UPDATES (KPI tree + scorecard formulas if goals changed)
  │
  ▼
KPI UPDATES (targets re-based on actuals; north-star confirmed)
  │
  ▼
ROADMAP UPDATES (next quarter theme + 3 goals + initiatives)
```

## 12.2 Quarterly Evolution Checklist (the QBR agenda)

| # | Item | Owner | Output |
|---|------|-------|--------|
| 1 | Organic Health Scorecard (Phase 11) | Ops/PM | Score + trend + low-domain actions |
| 2 | Maturity re-score (Phase 10) | Ops/PM | 10-domain levels + trend |
| 3 | Lessons review (Phase 3) | Ops/PM | Promoted lessons list |
| 4 | Playbook review (Phase 4) | SEO Lead | Version bumps + deprecations |
| 5 | Prompt review (Phase 5) | AI Ops | Re-benchmarks + version bumps |
| 6 | Template review (Phase 12 of OEOS) | Ops/PM | Revisions |
| 7 | Dashboard/KPI review | Rev Ops + SEO | Target re-baselining |
| 8 | Roadmap update | Program Mgr | Next-quarter theme + 3 goals |
| 9 | Capacity + staffing | Program Mgr | Re-capacity plan (OEOS Phase 2) |
| 10 | MERGE/ARCHIVE/PR approval batch | Founder | Approved actions |

## 12.3 Quarterly Evolution Rules

1. **Quarterly is the floor for artifact refresh.** Playbooks/prompts/templates re-verified every quarter even if unchanged.
2. **Version bumps are visible in git** — the changelog tells the story of what the org learned.
3. **KPI re-baselining is data-driven** — targets move toward actuals (never down without a written rationale).
4. **The evolution process is itself in the scorecard** (Execution domain: "roadmap updated quarterly" = a field). The system audits its own evolution.

---

# PHASE 13 — KNOWLEDGE GOVERNANCE

## 13.1 Ownership

| Artifact type | Owner | Approver | Review freq. |
|---------------|-------|----------|:---:|
| Playbooks | SEO Lead | SEO Lead (or Rev Ops for sales) | Quarterly |
| Prompts | AI Ops | SEO Lead / Rev Ops | Quarterly |
| Templates | Ops/PM | Program Mgr | Quarterly |
| Datasets | Data owners (Phase 7) | SME | Per dataset interval |
| Lessons | Extractor | Ops/PM (validation via SEO/SME) | Weekly |
| Decision/Issue/Risk logs | Ops/PM | Program Mgr | Continuous |
| Repository as a whole | Ops/PM | Program Mgr | Monthly |

## 13.2 Permissions & Version Control

| Rule | Detail |
|------|--------|
| Read | Everyone (searchable, open by default) |
| Write (create/edit) | Named owners + anyone via PR (draft) |
| Approve (publish to canonical) | Approver per type (above) |
| Delete/archive | Only Ops/PM; always with a note + git history |
| Version control | Git — every artifact is a file; every change is a commit with a message referencing the artifact ID |
| Branch/PR flow | Draft → PR → review → merge (approved). Same as code. |

## 13.3 Naming Convention

- Files: `YYYY-MM-DD -- topic -- type.md` (sortable by date).
- Artifact IDs: `P#` (playbook), `PRM#` (prompt), `T#` (template), `DS#` (dataset), `L#` (lesson), `X#` (experiment), `IDEA#` (idea), `DC#` (decision), `ISS#` (issue), `RK#` (risk).
- Cross-links: every artifact references related IDs (e.g., a lesson links the playbook it updates).

## 13.4 Review Frequency & Quality Standards

| Standard | Rule |
|----------|------|
| Artifact quality gate | Must pass its DoD/quality standard before publishing (Phase 5 DoD for content, Phase 5.3 for prompts, Phase 4.1 for playbooks) |
| Freshness | Every artifact has a next-review date; stale artifacts auto-flag in repository health |
| Accuracy | Every data figure has a source + date; confidence label where estimated |
| Completeness | Every artifact has the header block (owner, created, reviewed, status) |
| Noise control | Validation gate (Phase 3.3) keeps the repo signal-dense |

## 13.5 Archiving & Retention

| Rule | Detail |
|------|--------|
| Archive trigger | Deprecated, superseded, or stale > 2 review cycles |
| Archive process | Move to `/archive/` + note: why, date, successor link |
| Retention | Keep forever (git history). "Archived" = not in search results, still recoverable |
| Audit | Git log is the audit trail; quarterly governance audit confirms all logs current |

## 13.6 Knowledge Lifecycle Summary

`CREATE → APPROVE → PUBLISH → USE → REVIEW → UPDATE/VERSION → DEPRECATE → ARCHIVE`
Every artifact passes through this lifecycle. The lifecycle status is in the artifact header; the repository health score (Phase 11 Knowledge domain) tracks how many artifacts are at each stage.

---

# PHASE 14 — TRANSFERABILITY SYSTEM

## 14.1 The Framework Must Be Reusable

The OKCIS is designed to be Dreamlab's permanent intelligence system — and, if Dreamlab ever becomes an agency/product offering, a reusable delivery model. This phase separates **what always stays the same** from **what changes per client/project**.

## 14.2 What Changes Per Client / Per Project

| Layer | What changes | Example (client A vs client B) |
|-------|--------------|-------------------------------|
| **Strategy inputs** | Market, competitors, keywords, journeys | Different SERP, different competitor set |
| **Content** | Language, topics, data | Different industry/region |
| **Datasets (D1–D12)** | Values collected | Different pricing/timelines |
| **Playbook examples** | Real Dreamlab examples | Swapped per client |
| **Scorecard targets** | KPI thresholds | Different revenue baselines |
| **RACI names** | Actual people | Different team names |
| **Backlog** | Initiatives | Different priorities |
| **Templates (values)** | Filled instances | Different content |

## 14.3 What NEVER Changes (the reusable core)

| Layer | Reusable artifact |
|-------|-------------------|
| **SOP** | The 8-stage Knowledge Flow (Phase 1) — identical |
| **Repository structure** | The 19-home map (Phase 2) — identical |
| **Lesson SOP** | Phase 3 trigger→extract→validate→document→reuse — identical |
| **Playbook structure** | Goal/Inputs/Steps/Checklist/Examples/Mistakes/KPIs — identical |
| **Prompt governance** | Lifecycle + quality score + versioning — identical |
| **Customer loop** | Question→sales→CRM→gap→content→doc→prompt→playbook — identical |
| **PDCA** | Plan/Do/Check/Act — identical |
| **Innovation pipeline** | 9-stage — identical |
| **Maturity model** | 5 levels × 10 domains — identical |
| **Scorecard** | 9 domains × weight × formula × threshold — identical (targets vary) |
| **Quarterly evolution** | 10-item QBR checklist — identical |
| **Governance** | Ownership/permissions/versioning/naming/archive — identical |
| **Dashboards** | Role-scoped views (OEOS Phase 11) — identical structure |
| **KPI tree** | Revenue→…→CWV hierarchy — identical (targets vary) |
| **Templates** | The 12 OEOS templates + this doc's 3.4/5.4/6.2 cards — identical (blank) |

**The reusability test:** copy the `docs/knowledge/` folder (structure + blank templates + playbook skeletons), swap the strategy inputs, and a new team is operational in a week, not a quarter.

## 14.4 Agency Delivery Model (if Dreamlab scales this as a service)

| Component | Delivery mode |
|-----------|---------------|
| Onboarding pack | Standard: repository + OEOS + scorecard walkthrough (1 day) |
| Cadence | Same weekly/monthly/quarterly rhythm per client (OEOS Phase 9) |
| Playbooks | Client playbook library instantiated from the 14 skeletons |
| Prompt library | Reused; per-client data swapped; re-benchmarked |
| Scorecard | One per client; same domains/weights |
| Templates | The same 12 + 3 cards |
| KPIs | Per-client targets from their baseline |
| Reporting | Per-client monthly report = scorecard + dashboard + lessons |

**Why this model works:** Dreamlab already has the hard-to-copy asset — real manufacturing data (pricing, MOQ, BPOM, formulations). The transferability system means the *methodology* transfers, while the *data moat* stays with Dreamlab. This is a defensible agency/product position.

---

# FINAL RECOMMENDATION

## If Dreamlab can stand up only ONE learning mechanism first...

**Build the Canonical Knowledge Repository with the Lesson Card SOP — and wire the weekly review to it (capture → validate → reuse, every single week).**

### Why this, above everything else?

Every other phase of the OKCIS (playbooks, prompts, datasets, scorecards, maturity) is downstream of ONE primitive: **captured, validated, reusable knowledge.** Without a repository + a lesson-capture habit, there is nothing to build playbooks from, nothing to re-benchmark prompts against, no data strategy, no scorecard inputs, no quarterly evolution. The repository + lesson SOP is the root node of the entire learning system.

| Criterion | Assessment |
|-----------|-----------|
| **Long-term ROI** | Knowledge compounds. A repository that captures 10 lessons/week for 12 months = 500+ validated lessons → dozens of playbook/prompt updates → every subsequent action gets cheaper and better. This is the single highest-leverage "learning rate" investment. |
| **Lowest risk** | Zero ranking risk. Zero technical risk beyond creating a folder structure + 1 template. The main "cost" is a 15–20 min weekly discipline (part of the already-mandatory weekly review). |
| **Evidence it's needed** | The baseline audit (this document): no canonical repo, no lesson SOP, knowledge scattered across 8 reports + scripts + chats + 3 CS agents' heads. Maturity = Level 1 in Knowledge. The gap is not strategic — it's the absence of a capture home + habit. |
| **Mechanism** | Sprint 0 (OEOS): create `docs/knowledge/` (19 folders) + the Lesson Card template (3.4) + the Capture Triggers list (3.2). Wire into the weekly review: Ops/PM lists the week's cards; SEO Lead validates + assigns reuse; monthly promotes to playbook/prompt updates. |
| **Cost** | ~8 hours to build the structure + templates + migrate existing reports (Sprint 0). Then 15–20 min/week ongoing (inside the weekly review). Zero spend. |
| **Confidence** | HIGH. The failure mode (knowledge in heads + scattered docs) is well-documented; the fix (canonical repo + capture habit + ownership) is standard knowledge-management practice (Toyota/Atlassian). |
| **Stops it ever being "later"** | Every week without capture is a week of experience permanently lost (no one will remember it in 6 months). Start Sprint 0; the repository is the seed of every later phase. |

### Why NOT something else this quarter?

- **Not the playbook library** — playbooks need validated lessons to be written from. Repository first, then playbooks.
- **Not the prompt governance** — prompts improve via benchmarked lessons. Repository first.
- **Not the data strategy** — datasets publish into the repository; they need the home to exist.
- **Not the scorecard** — the scorecard reads repository health + logs; without the repository it measures nothing.
- **Not the maturity/transferability** — both are *outputs* of a working knowledge system; they don't exist meaningfully before it.

### The ordering that follows

1. **Sprint 0:** Create `docs/knowledge/` (19 homes) + Lesson Card template + migrate existing reports. First weekly lesson review.
2. **Sprint 1:** Extract P2 + P9 playbooks from existing code (prove the pattern). Wire capture triggers into the OEOS weekly review.
3. **Sprint 2:** Stand up the prompt library (8 prompts, metadata headers). First customer-question loop pass.
4. **Quarter 1+:** Playbooks (14), datasets (D1–D12 monthly cadence), scorecard — each building on the repository that exists.

**One repository → one capture habit → every experience becomes knowledge → the organization gets permanently smarter every week.**

---

# THE FINAL QUESTION: THE "DISAPPEARED TOMORROW" TEST

## Q: If Dreamlab disappeared tomorrow, could another team rebuild the entire Organic Growth System using ONLY this documentation (Sprint 1–3)?

**Short answer: NEARLY, but not yet — and this section closes every gap it can.**

## Gap Audit (what a stranger would find vs what they'd need)

| # | Rebuild requirement | Covered by | Gap? | Closure (this document) |
|---|--------------------|-----------|------|--------------------------|
| 1 | Why we're doing this (north star) | Sprint 2 Phase 6 OR-OS + this doc Exec Summary | No gap | — |
| 2 | Market/competitors/keywords | Sprint 2 Phase 1–3 | No gap | — |
| 3 | What to change | Sprint 3 Phase 1 (classification + plan) | No gap | — |
| 4 | How to execute | Sprint 3 Phase 2 (OEOS) | No gap | — |
| 5 | How to learn | Sprint 3 Phase 3 (this doc) | No gap | — |
| 6 | **Actual data values (pricing, MOQ, etc.)** | Phase 7 datasets D1–D12 | **GAP — datasets not yet collected** | Closure: Phase 7 defines collection; collection starts Sprint 1; published data follows |
| 7 | **Real GSC/GA4/CRM numbers** | Baselines referenced | **GAP — live data requires the actual accounts** | Closure: QW5 (GA4) + GSC + CRM wiring in OEOS Sprint 0–1; documented as "wire from live accounts" |
| 8 | **Playbook content (steps, examples, mistakes)** | Phase 4 playbook skeletons | **GAP — only P2/P9 patterns exist in code, not yet written as playbooks** | Closure: Phase 4 defines structure + Sprint 0 extracts P2/P9; 14 written by quarter 1 |
| 9 | **Prompt content (full text)** | Phase 5 + OEOS Phase 6 (8 prompts listed) | Partial — prompt files don't exist yet | Closure: Sprint 0–1 creates the 8 prompt files with metadata headers |
| 10 | **Template content** | OEOS Phase 12 (12 templates) + this doc (3.4/5.4/6.2) | No gap (templates are fully specified in Phase 2 doc) | — |
| 11 | **Scorecard inputs (logs, dashboards)** | Phase 11 + OEOS Phase 11 | Gap: logs empty until cadence runs | Closure: cadence defined; logs are created by running it |
| 12 | **Decision trees (10 SOPs)** | OEOS Phase 7 | No gap | — |
| 13 | **RACI / ownership names** | OEOS Phase 3 | Gap: named people (not roles) unknown | Closure: roles are stable; names are a Sprint 0 fill-in (2 min) |
| 14 | **Access/credentials to systems** | N/A | Gap by nature (secrets) | Closure: documented in the repo as "see internal env file" — not part of this docs set |
| 15 | **Customer question history** | Phase 6 | Gap: not yet captured (starts Sprint 1) | Closure: capture starts with the weekly loop |
| 16 | **Case study data** | Phase 4 P7 + Phase 2 home 13 | Gap: no cases documented yet | Closure: permission-gated; Sprint 2–3 |
| 17 | **Backlink inventory** | Referenced | Gap: no external tool data | Closure: run external tool at Sprint 0 (noted in OEOS Appendix B) |

## Closure Verdict

**The STRUCTURE is fully rebuildable from Sprint 1–3 documentation** — every SOP, template, playbook skeleton, prompt list, decision tree, RACI, KPI tree, scorecard formula, and governance rule is written down in this 3-sprint set. A new team could stand up the *system* in a week.

**The DATA is not yet rebuildable** — datasets (pricing/MOQ), live metrics, captured lessons, and customer history are in the real business, not the docs. These are not documentation gaps; they are *inventory gaps* the system will fill in its first weeks/months of operation. That is expected and correct: a knowledge system's job is to capture and compound data from the point it starts running.

**Remaining genuine documentation gaps closed by THIS document:**
- The knowledge home structure (19 folders) → so data has a place from day 1.
- The lesson/prompt/playbook/dataset/customer-loop mechanisms → so the data that comes in is converted to reusable knowledge, not dumped.
- The scorecard + maturity model → so "is the system working?" is measurable.
- The transferability core (14.3) → so the reusable skeleton is distinct from per-client data.

**What the stranger would need that no documentation can provide:** live account access (GSC/GA4/CRM/domain) + the current market data + 30–60 days of operation to populate datasets. With those, the rebuild is not just possible — it is *scripted*.

**Verdict: PASS with inventory-condition.** The Enterprise Organic Growth Operating System (Sprint 1 → Sprint 3 Phase 3) is now complete and documentation-complete for rebuild.

---

# APPENDIX A — CONFIDENCE ASSESSMENT (Full)

| Conclusion | Confidence | Basis |
|-----------|:---:|-------|
| Repository + lesson SOP is the root learning primitive | HIGH | KM standard; every other phase depends on it |
| Capture triggers + weekly review make lessons real | HIGH | OEOS cadence already mandates weekly review |
| Playbooks are the right reuse unit | HIGH | Agency best practice |
| Prompt quality score (7.0 gate) prevents prompt rot | MED-HIGH | Validated by AI ops practice |
| Customer loop yields high-ROI content | HIGH | Sprint 2 journey evidence |
| Proprietary data is a durable moat | MEDIUM-HIGH | No competitor publishes data; needs discipline |
| Maturity baseline (L2, Knowledge L1) | MEDIUM | Assessed from repo/code inspection |
| Scorecard formulas measurable from logs | MEDIUM | Depends on logs being populated (cadence) |
| Transferability core is reusable | HIGH | Structure is data-independent by design |
| "Disappeared tomorrow" rebuild in ~1 week (system) + 30–60 days (data) | MEDIUM-HIGH | System fully scripted; data is inventory |

# APPENDIX B — OPEN ITEMS / DATA GAPS

1. **Datasets D1–D12 are empty** — collection starts Sprint 1 per Phase 7 schedule. First publication target: Pricing Hub launch (GL1).
2. **Live GA4/GSC/CRM accounts** — wiring per OEOS QW5 + Sprint 0. Not a docs gap.
3. **Backlink inventory** — external tool run at Sprint 0 (no tool data in this environment).
4. **Prompt files (8) don't exist yet** — Sprint 0–1 creates them with metadata headers.
5. **Playbooks 1–14 written, only P2/P9 patterns in code** — Sprint 0 extracts P2/P9; rest by quarter 1.
6. **RACI names** — roles are fixed; actual names are a 2-minute Sprint 0 fill-in.
7. **Case study data** — permission-gated; Sprint 2–3 with Sales.
8. **Lesson capture has zero history** — the system's first output will be its first lessons; expected.

# APPENDIX C — REPOSITORY BOOTSTRAP CHECKLIST (Sprint 0)

- [ ] Create `docs/knowledge/` + 19 subfolders (Phase 2 map)
- [ ] Copy OEOS templates (Phase 2 doc 12.1–12.12) into `templates/`
- [ ] Create Lesson Card template (3.4) into `lessons-learned/`
- [ ] Create Prompt metadata header (5.4) + 8 prompt files into `ai-prompts/`
- [ ] Create Playbook skeleton (4.1) into `playbooks/`; extract P2 + P9 from `seo-pilot/` + `OPTIMASI-21`
- [ ] Create Customer Question capture template (6.2) into `customer-questions/` + `lead-objections/`
- [ ] Create Dataset registry (12 datasets, owners, refresh dates) into `data-strategy/` (or a `datasets/` home)
- [ ] Create Scorecard template (Phase 11) into `governance/`
- [ ] Migrate Sprint 1–3 reports into `seo/`, `content/`, `experiments/`
- [ ] Wire capture triggers (3.2) into the OEOS weekly review agenda
- [ ] Assign named owners + review dates to every artifact type (Phase 13)
- [ ] Run the first weekly lesson review

# APPENDIX D — GLOSSARY

| Term | Meaning |
|------|---------|
| OKCIS | Organic Knowledge & Continuous Improvement System (this document) |
| Knowledge Flow | The 8-stage loop: sources → capture → validate → document → distribute → apply → improve → archive |
| Lesson Card | The structured lesson record (Phase 3.4) |
| ≥2x rule | Observation validated when seen 2+ times or 1 high-impact time |
| Playbook | Reusable procedure: Goal/Inputs/Steps/Checklist/Examples/Mistakes/KPIs |
| Prompt Quality Score | 1–10 composite; publishes ≥7.0, deprecates <6.0 |
| Customer Intelligence Loop | Question → sales → CRM → gap → content/money page → doc → prompt → playbook |
| Dataset (D#) | Proprietary data series with collection/validation/publication/refresh lifecycle |
| PDCA | Plan/Do/Check/Act improvement loop |
| Innovation Pipeline | 9-stage idea → knowledge-base pipeline; ideas never disappear |
| Maturity Model | 5 levels (Basic→World Class) × 10 domains |
| Health Scorecard | 9-domain 0–100 composite score; quarterly |
| Quarterly Evolution | The QBR-driven refresh of lessons/playbooks/prompts/templates/KPIs/roadmap |
| Transferability Core | The data-independent reusable layer (SOPs, structure, templates) |

---

*End of SPRINT-3-PHASE3-ORGANIC-KNOWLEDGE-SYSTEM.md — the complete Organic Knowledge & Continuous Improvement System.*
*This completes the Enterprise Organic Growth Operating System (Sprint 1 → Sprint 3 Phase 3).*
