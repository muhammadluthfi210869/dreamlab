"""Folder/directory analysis + monthly/daily trends + redesign detection + cannibalization + dashboard"""
import pandas as pd, numpy as np, os, json, re
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPORT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA = os.path.join(REPORT_ROOT, "data")
OUT = os.path.join(REPORT_ROOT, "exports")
os.makedirs(OUT, exist_ok=True)

def load(name, mul_ctr=True):
    df = pd.read_csv(os.path.join(DATA, name))
    if mul_ctr and "ctr" in df.columns: df["ctr"] = df["ctr"] * 100
    return df

# ---------- 1. Folder / directory performance ----------
c90 = load("pages_c90.csv"); p90 = load("pages_p90.csv")

def folder_of(url):
    u = url.replace("https://www.dreamlab.id","").replace("https://dreamlab.id","")
    parts = [p for p in u.split("/") if p]
    if not parts: return "/"
    top = "/" + parts[0] + "/"
    return top

c90["folder"] = c90["page"].apply(folder_of)
p90["folder"] = p90["page"].apply(folder_of)

fc = c90.groupby("folder").agg(clicks=("clicks","sum"), impressions=("impressions","sum")).reset_index()
fp = p90.groupby("folder").agg(clicks=("clicks","sum"), impressions=("impressions","sum")).reset_index()
f = fc.merge(fp, on="folder", how="outer", suffixes=("_c90","_p90")).fillna(0)
f["ctr_c90"] = (f.clicks_c90 / f.impressions_c90 * 100).round(2)
f["ctr_p90"] = (f.clicks_p90 / f.impressions_p90 * 100).round(2)
f["clicks_delta"] = (f.clicks_c90 - f.clicks_p90).astype(int)
f["clicks_growth_pct"] = np.where(f.clicks_p90 > 0, (f.clicks_c90/f.clicks_p90 - 1) * 100, np.nan)
f = f.sort_values("clicks_c90", ascending=False)
f.columns = ["folder","clicks_c90","impressions_c90","clicks_p90","impressions_p90","ctr_c90","ctr_p90","clicks_delta","clicks_growth_pct"]
f.to_csv(os.path.join(OUT, "folder-performance.csv"), index=False, encoding="utf-8-sig")
print("folder-performance.csv:", len(f), "rows")
print(f.to_string(index=False))

# ---------- 2. Monthly + daily trends ----------
d = load("daily_16m.csv", mul_ctr=False)
d["date"] = pd.to_datetime(d["date"])
d["ym"] = d["date"].dt.to_period("M").astype(str)
m = d.groupby("ym").agg(clicks=("clicks","sum"), impressions=("impressions","sum")).reset_index()
m["ctr"] = (m.clicks/m.impressions*100).round(3)
pos = d.assign(w=(d.position*d.impressions)).groupby("ym").agg(wp=("w","sum"), imp=("impressions","sum")).reset_index()
m["avg_position"] = (pos.wp/pos.imp).round(2)
m.to_csv(os.path.join(OUT, "monthly-trend.csv"), index=False, encoding="utf-8-sig")

d["date"] = d["date"].dt.strftime("%Y-%m-%d")
d.to_csv(os.path.join(OUT, "daily-trend.csv"), index=False, encoding="utf-8-sig")
print("monthly-trend + daily-trend written")
print(m.to_string(index=False))

# ---------- 3. Redesign impact detection (change-point) ----------
dd = load("daily_16m.csv", mul_ctr=False)
dd["date"] = pd.to_datetime(dd["date"])
dd = dd.sort_values("date")
window = 14
dd["roll_clicks"] = dd["clicks"].rolling(window).mean()
dd["roll_imp"] = dd["impressions"].rolling(window).mean()
dd["roll_ctr"] = (dd["clicks"].rolling(window).sum()/dd["impressions"].rolling(window).sum()*100)
# detect biggest drops: compare each week vs 4 weeks prior
dd["lag28"] = dd["clicks"].shift(28)
dd["chg28"] = (dd["clicks"] - dd["lag28"]) / dd["lag28"] * 100
big = dd[(dd["chg28"] < -30)].copy()
redesign = []
if len(big) > 0:
    first = big.iloc[0]
    redesign.append({
        "detected": True,
        "approx_period": str(first["date"].date()),
        "weekly_drop_pct": round(first["chg28"],1),
        "clicks_before": int(first["lag28"]),
        "clicks_after": int(first["clicks"]),
    })
    print("REDESIGN/LOSS detected near:", first["date"].date(), "drop", round(first["chg28"],1), "%")
else:
    redesign.append({"detected": False})
print("redesign:", json.dumps(redesign))

# ---------- 4. Cannibalization ----------
qp = load("query_page_16m.csv", mul_ctr=True)
qp["page_n"] = qp["page"].apply(lambda u: u.replace("https://www.dreamlab.id","https://dreamlab.id").rstrip("/"))
g = qp.groupby("query").agg(n_pages=("page_n","nunique"), clicks=("clicks","sum"), impressions=("impressions","sum")).reset_index()
cann = g[g["n_pages"] > 1].sort_values("impressions", ascending=False)
cann.to_csv(os.path.join(OUT, "cannibalization.csv"), index=False, encoding="utf-8-sig")
print("cannibalization.csv:", len(cann), "queries with 2+ pages")

# ---------- 5. Dashboard ----------
ddx = load("daily_16m.csv", mul_ctr=False)
ddx["date"] = pd.to_datetime(ddx["date"])
# last full 90 vs prev 90
c90d = ddx[ddx["date"] >= (ddx["date"].max() - pd.Timedelta(days=89))]
p90e = c90d["date"].min() - pd.Timedelta(days=1)
p90d = ddx[(ddx["date"] >= p90e - pd.Timedelta(days=89)) & (ddx["date"] <= p90e)]
c30d = ddx[ddx["date"] >= (ddx["date"].max() - pd.Timedelta(days=29))]
p30e = c30d["date"].min() - pd.Timedelta(days=1)
p30d = ddx[(ddx["date"] >= p30e - pd.Timedelta(days=29)) & (ddx["date"] <= p30e)]

def agg(x):
    c = x.clicks.sum(); i = x.impressions.sum()
    return {"clicks": int(c), "impressions": int(i), "ctr": round(c/i*100,2),
            "avg_position": round((x.position*x.impressions).sum()/i,1)}

dash = {
    "site": "dreamlab.id",
    "generated": datetime.now().isoformat(),
    "period": {"start": str(ddx.date.min().date()), "end": str(ddx.date.max().date())},
    "overall_16m": agg(ddx),
    "last_90d": agg(c90d), "prev_90d": agg(p90d),
    "last_30d": agg(c30d), "prev_30d": agg(p30d),
    "redesign_detection": redesign,
    "device": load("devices_16m.csv").to_dict("records"),
    "country_top": load("countries_16m.csv").sort_values("clicks", ascending=False).head(20).to_dict("records"),
    "appearance": load("appearance_16m.csv").to_dict("records"),
    "monthly": m.to_dict("records"),
    "folders": f.head(20).to_dict("records"),
    "cannibalization_count": len(cann),
}
with open(os.path.join(OUT, "dashboard.json"), "w", encoding="utf-8") as fp:
    json.dump(dash, fp, indent=2, default=str)

# dashboard.csv (flat key metrics)
flat = []
for k, v in [("overall_16m", dash["overall_16m"]), ("last_90d", dash["last_90d"]), ("prev_90d", dash["prev_90d"]),
             ("last_30d", dash["last_30d"]), ("prev_30d", dash["prev_30d"])]:
    r = {"metric": k}
    r.update(v)
    flat.append(r)
pd.DataFrame(flat).to_csv(os.path.join(OUT, "dashboard.csv"), index=False, encoding="utf-8-sig")
print("dashboard.json + dashboard.csv written")
print("DONE FOLDERS+DASH")
