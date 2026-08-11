"""Query-level analysis: query-performance.csv + query-opportunities.csv + segmentation"""
import pandas as pd, numpy as np, os, re, json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPORT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA = os.path.join(REPORT_ROOT, "data")
OUT = os.path.join(REPORT_ROOT, "exports")
os.makedirs(OUT, exist_ok=True)

def load(name):
    df = pd.read_csv(os.path.join(DATA, name))
    if "ctr" in df.columns:
        df["ctr"] = df["ctr"] * 100
    return df

c90 = load("queries_c90.csv"); p90 = load("queries_p90.csv")
c30 = load("queries_c30.csv"); p30 = load("queries_p30.csv")
all16 = load("queries_16m.csv")

c90m = c90.set_index("query"); p90m = p90.set_index("query")
c30m = c30.set_index("query"); p30m = p30.set_index("query")
a16m = all16.set_index("query")

def col(idx, src, key, default=0):
    if idx not in src.index: return default
    v = src.loc[idx, key]
    if isinstance(v, pd.Series): v = v.iloc[0]
    if pd.isna(v): return default
    return v

queries = a16m.index.union(c90m.index).union(p90m.index).union(c30m.index).union(p30m.index)

rows = []
for q in queries:
    c_c, c_i = col(q, c90m, "clicks"), col(q, c90m, "impressions")
    p_c, p_i = col(q, p90m, "clicks"), col(q, p90m, "impressions")
    c_ctr = col(q, c90m, "ctr"); p_ctr = col(q, p90m, "ctr")
    c_pos = col(q, c90m, "position"); p_pos = col(q, p90m, "position")
    c30_c = col(q, c30m, "clicks"); p30_c = col(q, p30m, "clicks")
    i16 = col(q, a16m, "impressions"); c16 = col(q, a16m, "clicks")
    if c_ctr == 0 and c_i > 0 and q in c90m.index:
        c_ctr = col(q, a16m, "ctr")

    ql = q.lower()
    COMMERCIAL = ["maklon","jasa","harga","moq","pabrik","produksi","oem","private label","privatelabel","bpom","halal",
                  "supplier","distributor","bisnis","brand","custom","kerjasama","odm","kontrak","pengemasan","maklon"]
    COMPARE = [" vs ","perbedaan","atau","privatelabel vs odm","comparison","banding"]
    PRICING = ["harga","biaya","tarif","cost","costum","price","murah","moq rendah","minim order","modal"]
    LOCAL = ["surabaya","jakarta","bali","malang","tangerang","bandung","semarang","yogyakarta","medan","makassar","bekasi","depok","indonesia","jawa"]
    INFO = ["cara","apa","mengapa","kenapa","bagaimana","jenis","manfaat","tips","tutorial","syarat","review","tren","trend","data","panduan"]
    BRAND = ["dreamlab","dream lab","karya impian laboratoris","pt karya impian"]

    if any(b in ql for b in BRAND): intent = "brand"
    elif any(cc in ql for cc in COMPARE): intent = "comparison"
    elif any(pp in ql for pp in PRICING): intent = "pricing"
    elif any(cc in ql for cc in COMMERCIAL): intent = "commercial"
    elif any(ll in ql for ll in LOCAL): intent = "local"
    elif any(ii in ql for ii in INFO): intent = "informational"
    else: intent = "other"

    traffic_delta = c_c - p_c
    pct = (traffic_delta / p_c * 100) if p_c > 0 else (np.nan if c_c == 0 else 100)

    rows.append({
        "query": q, "clicks_c90": int(c_c), "clicks_p90": int(p_c), "clicks_delta": int(traffic_delta),
        "clicks_pct_change": round(pct,1) if pct==pct else "",
        "impressions_c90": int(c_i), "impressions_p90": int(p_i), "impressions_delta": int(c_i - p_i),
        "ctr_c90_pct": round(c_ctr,2) if c_ctr else 0, "ctr_p90_pct": round(p_ctr,2) if p_ctr else 0,
        "ctr_delta_pp": round((c_ctr - p_ctr),2) if (c_ctr and p_ctr) else "",
        "position_c90": round(c_pos,1) if c_pos else "", "position_p90": round(p_pos,1) if p_pos else "",
        "position_delta": round((c_pos - p_pos),1) if (c_pos and p_pos) else "",
        "c30_clicks": int(c30_c), "p30_clicks": int(p30_c),
        "clicks_16m": int(c16), "impressions_16m": int(i16),
        "trend": "growing" if c30_c > p30_c * 1.2 else ("declining" if c30_c < p30_c * 0.8 else "stable"),
        "business_intent": intent,
        "brand": any(b in ql for b in BRAND),
    })

df = pd.DataFrame(rows)
df["clicks_delta"] = pd.to_numeric(df["clicks_delta"], errors="coerce")
df["impressions_c90"] = pd.to_numeric(df["impressions_c90"], errors="coerce")
df["position_c90"] = pd.to_numeric(df["position_c90"], errors="coerce")
df["position_p90"] = pd.to_numeric(df["position_p90"], errors="coerce")
df["ctr_c90_pct"] = pd.to_numeric(df["ctr_c90_pct"], errors="coerce")
df.to_csv(os.path.join(OUT, "query-performance.csv"), index=False, encoding="utf-8-sig")
print("query-performance.csv:", len(df), "rows")

# ---------- Segmentation CSV outputs ----------
def seg(df, cond, name):
    s = df[cond].copy()
    s.to_csv(os.path.join(OUT, name), index=False, encoding="utf-8-sig")
    print(f"{name}: {len(s)} rows")

seg(df, df["clicks_delta"] < 0, "queries-losing-clicks.csv")
seg(df, df["clicks_pct_change"].replace("", "0").astype(float) < -20, "queries-losing-ctr.csv")
seg(df, (df["position_c90"].fillna(50) > df["position_p90"].fillna(50)) & (df["position_c90"].fillna(50) > 0), "queries-losing-rankings.csv")
seg(df, df["impressions_c90"] > df["impressions_p90"], "queries-gaining-impressions.csv")
seg(df, (df["impressions_c90"] >= 300) & (df["ctr_c90_pct"] < 2), "queries-high-impressions-low-ctr.csv")
seg(df, df["position_c90"].between(4, 15), "queries-position-4-15.csv")
seg(df, df["position_c90"].between(11, 20), "queries-position-11-20.csv")
seg(df, df["position_c90"].between(4, 7), "queries-near-top-3.csv")
seg(df, df["business_intent"] == "commercial", "queries-commercial.csv")
seg(df, df["business_intent"] == "informational", "queries-informational.csv")
seg(df, df["business_intent"] == "comparison", "queries-comparison.csv")
seg(df, df["business_intent"] == "pricing", "queries-pricing.csv")
seg(df, df["business_intent"] == "local", "queries-local.csv")
seg(df, df["business_intent"] == "brand", "queries-brand.csv")
seg(df, df["business_intent"] != "brand", "queries-non-brand.csv")

# Query opportunities = high impressions, low CTR, position 4-20, meaningful intent
opp = df[(df["impressions_c90"] >= 100) & (df["position_c90"].between(4, 20)) & (df["ctr_c90_pct"] < 6)]
opp = opp.sort_values("impressions_c90", ascending=False)
opp.to_csv(os.path.join(OUT, "query-opportunities.csv"), index=False, encoding="utf-8-sig")
print("query-opportunities.csv:", len(opp), "rows")
print("DONE QUERIES")
