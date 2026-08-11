"""Refined insights engine: directory buckets, redesign detection (fixed), all report inputs -> insights.json"""
import pandas as pd, numpy as np, os, json, re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPORT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA = os.path.join(REPORT_ROOT, "data")
OUT = os.path.join(REPORT_ROOT, "exports")
os.makedirs(OUT, exist_ok=True)

def load(name, mul_ctr=True):
    df = pd.read_csv(os.path.join(DATA, name))
    if mul_ctr and "ctr" in df.columns: df["ctr"] = df["ctr"] * 100
    return df

# ---------- Directory buckets ----------
def bucket(url):
    u = url.replace("https://www.dreamlab.id","").replace("https://dreamlab.id","")
    parts = [p for p in u.split("/") if p]
    if not parts: return "Homepage"
    p0 = parts[0].lower()
    if p0 in ("produk",): return "/produk/ (product pages)"
    if p0 == "maklon": return "/maklon/ (service pages)"
    if p0 == "category": return "/category/ (blog categories)"
    if p0 in ("news-blog", "blog"): return "/news-blog/ (blog)"
    if p0 in ("services","about-us","contact-us","career","our-client"): return "/company/ (corporate)"
    if p0.startswith("pabrik-") or p0.startswith("jasa-") or p0.startswith("maklon-"): return "/service-landing/ (maklon landing)"
    if p0 in ("parfum","skincare","pkrt","body-care","hair-care","baby-care","foot-care","decorative","makeup"): return "/service-category/ (product category)"
    if p0.startswith("memunculkan") or "keranjang" in p0: return "/instagram-cluster/"
    return "/blog-articles/ (root level)"

c90 = load("pages_c90.csv"); p90 = load("pages_p90.csv")
c90["bucket"] = c90["page"].apply(bucket); p90["bucket"] = p90["page"].apply(bucket)
fc = c90.groupby("bucket").agg(clicks=("clicks","sum"), impressions=("impressions","sum")).reset_index()
fp = p90.groupby("bucket").agg(clicks=("clicks","sum"), impressions=("impressions","sum")).reset_index()
fb = fc.merge(fp, on="bucket", how="outer", suffixes=("_c90","_p90")).fillna(0)
fb["ctr_c90"] = (fb.clicks_c90/fb.impressions_c90*100).round(2)
fb["clicks_delta"] = (fb.clicks_c90 - fb.clicks_p90).astype(int)
fb["growth_pct"] = np.where(fb.clicks_p90>0, (fb.clicks_c90/fb.clicks_p90-1)*100, np.nan)
fb = fb.sort_values("clicks_c90", ascending=False)
fb.to_csv(os.path.join(OUT, "directory-performance.csv"), index=False, encoding="utf-8-sig")
print("=== DIRECTORY BUCKETS (90d vs prev 90d) ===")
print(fb.to_string(index=False))

# ---------- Redesign detection (corrected) ----------
d = load("daily_16m.csv", mul_ctr=False)
d["date"] = pd.to_datetime(d["date"]); d = d.sort_values("date")
# weekly aggregation
d["wk"] = d["date"].dt.to_period("W").astype(str)
w = d.groupby("wk").agg(clicks=("clicks","sum"), impressions=("impressions","sum")).reset_index()
w["ctr"] = w.clicks/w.impressions*100
w["lag4"] = w["clicks"].shift(4)
w["chg"] = (w["clicks"]-w["lag4"])/w["lag4"]*100
# meaningful drops only (baseline >= 60 clicks/wk)
drops = w[(w["lag4"] >= 60) & (w["chg"] < -25)].copy()
redesign = []
for _, r in drops.iterrows():
    redesign.append({"period": r["wk"], "week_clicks_before": int(r["lag4"]), "week_clicks_after": int(r["clicks"]), "drop_pct": round(r["chg"],1)})
print("\n=== MEANINGFUL WEEKLY DROPS (lag4 >= 60, drop > 25%) ===")
for x in redesign: print(x)

# ---------- Key loser/gainer lists for reports ----------
pp = pd.read_csv(os.path.join(OUT, "page-performance.csv"))
pp["clicks_delta"] = pd.to_numeric(pp["clicks_delta"], errors="coerce")
pp["potential_opportunity"] = pd.to_numeric(pp["potential_opportunity"], errors="coerce")
pp["priority_score"] = pd.to_numeric(pp["priority_score"], errors="coerce")
pp["current_clicks"] = pd.to_numeric(pp["current_clicks"], errors="coerce")
pp["current_ctr_pct"] = pd.to_numeric(pp["current_ctr_pct"], errors="coerce")
pp["current_position"] = pd.to_numeric(pp["current_position"], errors="coerce")
pp["c90_impressions"] = pd.to_numeric(pp["c90_impressions"], errors="coerce")

qp = pd.read_csv(os.path.join(OUT, "query-performance.csv"))
for col in ["clicks_delta","impressions_c90","position_c90","ctr_c90_pct","clicks_c90","clicks_p90","impressions_p90"]:
    qp[col] = pd.to_numeric(qp[col], errors="coerce")

ins = {}
ins["page_biggest_losers"] = pp.sort_values("clicks_delta").head(25)[["url","current_clicks","clicks_delta","current_ctr_pct","current_position","page_type","business_intent"]].to_dict("records")
ins["page_biggest_winners"] = pp.sort_values("clicks_delta", ascending=False).head(25)[["url","current_clicks","clicks_delta","current_ctr_pct","current_position","page_type"]].to_dict("records")
ins["page_top_opportunities"] = pp.sort_values("potential_opportunity", ascending=False).head(30)[["url","c90_impressions","current_clicks","current_ctr_pct","current_position","potential_opportunity","page_type","business_intent"]].to_dict("records")
ins["query_biggest_losers"] = qp.sort_values("clicks_delta").head(25)[["query","clicks_c90","clicks_p90","clicks_delta","position_c90","business_intent"]].to_dict("records")
ins["query_biggest_winners"] = qp.sort_values("clicks_delta", ascending=False).head(25)[["query","clicks_c90","clicks_p90","clicks_delta","position_c90","business_intent"]].to_dict("records")
ins["query_top_opportunities"] = qp[(qp["impressions_c90"]>=150) & (qp["position_c90"].between(4,20)) & (qp["ctr_c90_pct"]<6)].sort_values("impressions_c90", ascending=False).head(40)[["query","impressions_c90","clicks_c90","ctr_c90_pct","position_c90","business_intent"]].to_dict("records")

# Commercial queries with most potential
comm = qp[(qp["business_intent"]=="commercial") & (qp["impressions_c90"]>0)].sort_values("impressions_c90", ascending=False)
ins["commercial_queries"] = comm.head(40)[["query","impressions_c90","clicks_c90","position_c90","ctr_c90_pct"]].to_dict("records")

# CTR quick wins (high impressions, low CTR, top-ish positions)
ctrw = pp[(pp["c90_impressions"]>=2000) & (pp["current_ctr_pct"]<2)].sort_values("c90_impressions", ascending=False)
ins["ctr_quick_wins"] = ctrw.head(30)[["url","c90_impressions","current_clicks","current_ctr_pct","current_position"]].to_dict("records")

# Content decay = pages declining both windows
dec = pp[(pp["clicks_delta"]<0)].sort_values("clicks_delta")
ins["content_decay"] = dec.head(30)[["url","current_clicks","clicks_delta","current_ctr_pct","current_position"]].to_dict("records")

# Money pages (commercial intent, highest priority)
money = pp[(pp["money_page"]==True)].sort_values("priority_score", ascending=False)
ins["money_pages"] = money.head(30)[["url","current_clicks","c90_impressions","current_ctr_pct","current_position","potential_opportunity","priority_score"]].to_dict("records")

# Near-top-3 pages
near = pp[(pp["current_position"].between(4,8)) & (pp["c90_impressions"]>=1000)].sort_values("c90_impressions", ascending=False)
ins["near_top3_pages"] = near.head(25)[["url","c90_impressions","current_clicks","current_position","current_ctr_pct"]].to_dict("records")

# Cannibalization top
cann = pd.read_csv(os.path.join(OUT, "cannibalization.csv"))
ins["cannibalization_top"] = cann.head(20).to_dict("records")

with open(os.path.join(OUT, "insights.json"), "w", encoding="utf-8") as f:
    json.dump(ins, f, indent=1, default=str)
print("\ninsights.json written:", {k: len(v) for k, v in ins.items()})
