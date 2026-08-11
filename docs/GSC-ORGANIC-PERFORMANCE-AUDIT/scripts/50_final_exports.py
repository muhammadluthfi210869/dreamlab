"""Final exports: countries/devices/appearance CSVs + README + data manifest"""
import os, json, pandas as pd
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REP = os.path.dirname(SCRIPT_DIR)
DATA = os.path.join(REP, "data")
OUT = os.path.join(REP, "exports")

def load(name, mul_ctr=True):
    df = pd.read_csv(os.path.join(DATA, name))
    if mul_ctr and "ctr" in df.columns: df["ctr"] = df["ctr"] * 100
    return df

for src, dst in [("countries_16m.csv","countries-performance.csv"), ("devices_16m.csv","devices-performance.csv"), ("appearance_16m.csv","search-appearance-performance.csv")]:
    df = load(src)
    df.columns = [c.lower().replace("country","country_code") for c in df.columns]
    df.to_csv(os.path.join(OUT, dst), index=False, encoding="utf-8-sig")
    print(dst, len(df))

# Copy sitemap data
sm = json.load(open(os.path.join(DATA, "sitemaps.json"), encoding="utf-8"))
with open(os.path.join(OUT, "sitemaps.json"), "w", encoding="utf-8") as f:
    json.dump(sm, f, indent=2)

# README
readme = f"""# DREAMLAB.IS — Organic Performance Intelligence Audit
**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}
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
```

## Notes & limitations
- **Search type (Web/Image/Video/News) is not exposed via the GSC API** — it is UI-only. Search-appearance dimension is included instead.
- GSC data has ~2-3 day reporting lag; the last complete day in this pull is 2026-07-28.
- Revenue projections are models with stated assumptions (lead rate 3%, close rate 15%, AOV Rp 50-150jt) — validate against GA4 + CRM.
- CTR benchmarks are industry-standard approximations (top-3 ≈ 18%, 4-5 ≈ 10%, 6-10 ≈ 5%).
"""

with open(os.path.join(REP, "README.md"), "w", encoding="utf-8") as f:
    f.write(readme)
print("README.md written")
