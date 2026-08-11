# DREAMLAB.IS — Organic Performance Intelligence Audit
**Generated:** 2026-07-31 09:18
**Data source:** Google Search Console API (service account `dreamlab@sunny-idiom-499103-g6.iam.gserviceaccount.com`)
**Property:** sc-domain:dreamlab.id
**Analysis window:** 2025-03-31 → 2026-07-28 (16 months)

## Report set

| File | Content |
|---|---|
| `executive-summary.md` | CEO / Head of Organic Growth view — what happened, why, where, what to do first, ROI |
| `full-analysis.md` | Complete technical analysis — queries, pages, folders, devices, cannibalization, priority matrix |
| `recommendations.md` | 90-day recovery plan — top actions, sprints, what NOT to do, projections |
| `quick-wins.md` | 20 fast high-value actions |
| `content-opportunities.md` | Data-backed content roadmap |
| `APPENDIX-TOP20-AUTOMATION-CTR.md` | **Single appendix:** Top-20 summary tables + weekly automation setup + title/meta rewrites for top-20 CTR pages |

## Data exports (exports/)

| File | Content |
|---|---|
| `page-performance.csv` | 759 pages: clicks/CTR/position current vs previous, intent, page type, priority, opportunity |
| `query-performance.csv` | 4,519 queries: same deltas, intent classification, trend |
| `page-opportunities.csv` | Top 100 opportunity pages (high impressions, low CTR) |
| `query-opportunities.csv` | 64 opportunity queries |
| `top-100-winners.csv` / `top-100-losers.csv` | Biggest gainers/losers |
| `folder-performance.csv` | Per-path performance (raw) |
| `directory-performance.csv` | Bucketed directory performance |
| `monthly-trend.csv` / `daily-trend.csv` | Site performance trends |
| `countries-performance.csv` / `devices-performance.csv` / `search-appearance-performance.csv` | Audience dims |
| `cannibalization.csv` | 786 queries with 2+ ranking pages |
| `queries-*.csv` | Query segments (commercial, informational, comparison, pricing, local, brand, position 4-15, 11-20, near-top-3, losing clicks/ctr/rankings, gaining impressions) |
| `dashboard.json` / `dashboard.csv` | Machine-readable dashboard |

## Raw API data (data/)
Pulled from GSC API: daily_16m, queries_16m, pages_16m, comparison windows (c90/p90/c30/p30), query+page, countries, devices, appearance, sitemaps.

## Re-running
```bash
python scripts/10_collect_data.py      # pulls GSC API data (needs credentials at ../dreamlab-site/scripts/gsc-credentials.json)
python scripts/20_analysis_pages.py    # page analysis
python scripts/21_analysis_queries.py  # query analysis + segments
python scripts/22_folders_dashboard.py # folders, trends, redesign, cannibalization, dashboard
python scripts/23_insights.py          # report inputs
python scripts/40_report_exec.py       # executive-summary.md
python scripts/41_report_full.py       # full-analysis.md
python scripts/42_report_actions.py    # recommendations / quick-wins / content-opportunities
python scripts/60_appendix.py          # APPENDIX-TOP20-AUTOMATION-CTR.md
```

### One-click weekly run (automation)
- **Local:** double-click `scripts/run-weekly-audit.bat` or run `scripts/run-weekly-audit.ps1` (9 steps + weekly snapshot archive to `weekly-snapshots/<date>/`).
- **Scheduled:** Windows Task Scheduler → run `run-weekly-audit.ps1` weekly (see APPENDIX Part 2.3).
- **Cloud:** GitHub Actions workflow (see APPENDIX Part 2.4).

## Notes & limitations
- **Search type (Web/Image/Video/News) is not exposed via the GSC API** — it is UI-only. Search-appearance dimension is included instead.
- GSC data has ~2-3 day reporting lag; the last complete day in this pull is 2026-07-28.
- Revenue projections are models with stated assumptions (lead rate 3%, close rate 15%, AOV Rp 50-150jt) — validate against GA4 + CRM.
- CTR benchmarks are industry-standard approximations (top-3 ≈ 18%, 4-5 ≈ 10%, 6-10 ≈ 5%).
