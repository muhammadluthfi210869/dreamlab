"""Page-level analysis: builds page-performance.csv + page-opportunities.csv"""
import pandas as pd, numpy as np, os, re, json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPORT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA = os.path.join(REPORT_ROOT, "data")
OUT = os.path.join(REPORT_ROOT, "exports")
os.makedirs(OUT, exist_ok=True)

def load(name):
    p = os.path.join(DATA, name)
    df = pd.read_csv(p)
    if "ctr" in df.columns:
        df["ctr"] = df["ctr"] * 100  # GSC returns fraction
    return df

c90 = load("pages_c90.csv"); p90 = load("pages_p90.csv")
c30 = load("pages_c30.csv"); p30 = load("pages_p30.csv")
all16 = load("pages_16m.csv")

# normalize page urls (strip www and trailing slash for joining)
def norm(u):
    if not isinstance(u, str): return u
    u = u.replace("https://www.dreamlab.id", "https://dreamlab.id").replace("http://", "https://")
    return u.rstrip("/")

for df in [c90, p90, c30, p30, all16]:
    df["page_n"] = df["page"].apply(norm)

# Build union of pages (dedupe by normalized page, keep canonical display URL with max impressions)
def dedupe(df):
    g = df.groupby("page_n").agg(
        clicks=("clicks", "sum"), impressions=("impressions", "sum"),
        ctr=("ctr", "mean"), position=("position", "mean"),
        page=("page", "first"),
    ).reset_index()
    return g

c90 = dedupe(c90); p90 = dedupe(p90); c30 = dedupe(c30); p30 = dedupe(p30); all16 = dedupe(all16)

c90m = c90.set_index("page_n"); p90m = p90.set_index("page_n")
c30m = c30.set_index("page_n"); p30m = p30.set_index("page_n")
a16m = all16.set_index("page_n")

pages = a16m.index.union(c90m.index).union(p90m.index).union(c30m.index).union(p30m.index)

def col(idx, src, key, default=0):
    if idx not in src.index:
        return default
    v = src.loc[idx, key]
    if pd.isna(v):
        return default
    return v

rows = []
for pg in pages:
    url = a16m.loc[pg]["page"] if pg in a16m.index else (c90m.loc[pg]["page"] if pg in c90m.index else pg)
    c_c, c_i = col(pg, c90m, "clicks"), col(pg, c90m, "impressions")
    p_c, p_i = col(pg, p90m, "clicks"), col(pg, p90m, "impressions")
    c_ctr, p_ctr = c90m.reindex([pg])["ctr"].fillna(0).iloc[0] if pg in c90m.index else 0.0, p90m.reindex([pg])["ctr"].fillna(0).iloc[0] if pg in p90m.index else 0.0
    c_pos, p_pos = c90m.reindex([pg])["position"].fillna(np.nan).iloc[0] if pg in c90m.index else np.nan, p90m.reindex([pg])["position"].fillna(np.nan).iloc[0] if pg in p90m.index else np.nan
    c30_c, c30_i = col(pg, c30m, "clicks"), col(pg, c30m, "impressions")
    p30_c, p30_i = col(pg, p30m, "clicks"), col(pg, p30m, "impressions")
    i16, c16 = col(pg, a16m, "impressions"), col(pg, a16m, "clicks")

    # fallback ctr/position from 16m if no c90
    if pg not in c90m.index and pg in a16m.index:
        c_ctr = a16m.reindex([pg])["ctr"].fillna(0).iloc[0]
        c_pos = a16m.reindex([pg])["position"].iloc[0]

    traffic_delta = c_c - p_c
    pct_delta = (traffic_delta / p_c * 100) if p_c > 0 else (np.nan if c_c == 0 else 100)

    # ---- business intent & page type classification ----
    path = re.sub(r"^https://(www\.)?dreamlab\.id", "", url).strip("/")
    slug = path.lower()

    COMMERCIAL = ["maklon","jasa","harga","moq","pabrik","produksi","oem","private label","privatelabel","bpom",
                  "halal","supplier","distributor","bisnis","brand","custom","kerjasama","odm","kontrak","pengemasan","maklon-"]
    INFO = ["cara","apa","mengapa","kenapa","bagaimana","jenis","manfaat","tips","tutorial","syarat","review","perbedaan",
            "tren","trend","panduan","contoh","alat","cara-membuat","membuat","memunculkan","menambahkan","menautkan",
            "mengaktifkan","menampilkan","data","state-of","prediksi","urutan","musim"]
    LOCAL = ["surabaya","jakarta","bali","malang","tangerang","bandung","semarang","yogyakarta","medan","makassar","bekasi","depok","indonesia"]
    BRAND = ["dreamlab","dream lab","karya impian"]

    if slug == "" or slug in ["about-us","contact-us","career"]:
        intent = "brand_nav" if slug == "" else "company"
    else:
        words = slug.replace("-", " ")
        if any(b in words for b in BRAND): intent = "brand"
        elif any(c in words for c in COMMERCIAL): intent = "commercial"
        elif any(l in words for l in LOCAL): intent = "local"
        elif any(i in words for i in INFO): intent = "informational"
        else: intent = "commercial"  # service pages default

    # page type
    if slug == "": ptype = "homepage"
    elif slug.startswith("produk"): ptype = "product"
    elif slug.startswith("maklon"): ptype = "service"
    elif slug.startswith("category"): ptype = "category"
    elif slug.startswith(("news-blog", "blog")): ptype = "blog"
    elif slug.startswith(("pabrik", "jasa-")): ptype = "service_landing"
    elif slug in ["contact-us", "about-us", "career", "pkrt", "parfum", "skincare", "baby-care", "body-care", "hair-care", "foot-care"]: ptype = "company_or_service"
    else: ptype = "article"

    is_money = ptype in ["product", "service", "service_landing", "category", "homepage"] or intent == "commercial"
    is_blog = ptype in ["blog", "article"]
    is_category = ptype == "category"
    is_landing = ptype in ["service_landing", "company_or_service"]
    is_knowledge = ptype == "article"

    # ---- opportunity model ----
    pos = c_pos if c_pos == c_pos else 12.0
    imp = c_i if c_i > 0 else i16
    # benchmark CTR by position bucket
    if pos <= 3: bench = 0.18
    elif pos <= 5: bench = 0.10
    elif pos <= 10: bench = 0.05
    elif pos <= 20: bench = 0.025
    else: bench = 0.012
    ctr = c_ctr / 100.0  # c_ctr already in percent
    est_potential = imp * max(0.0, bench - min(ctr, bench))  # incremental clicks if CTR normalized
    est_top3 = imp * max(0.0, bench - min(ctr, bench))  # simplified

    value_mult = 1.6 if is_money else (1.1 if is_category else 0.8)
    opportunity = round(min(est_potential, 5000), 1)
    priority = round(min(100, (np.log10(max(imp,1))/np.log10(100000)) * 55 + min(est_potential/50, 30) + (25 if is_money else 5)), 1)

    rows.append({
        "url": url, "page_path": "/" + path + "/" if path else "/",
        "current_clicks": int(c_c), "previous_clicks": int(p_c), "clicks_delta": int(traffic_delta),
        "clicks_pct_change": round(pct_delta,1) if pct_delta==pct_delta else "",
        "current_ctr_pct": round(c_ctr,2), "previous_ctr_pct": round(p_ctr,2), "ctr_delta_pp": round(c_ctr - p_ctr,2),
        "current_position": round(pos,1) if pos==pos else "", "previous_position": round(p_pos,1) if p_pos==p_pos else "",
        "position_delta": round(pos - p_pos,1) if (pos==pos and p_pos==p_pos) else "",
        "c30_clicks": int(c30_c), "p30_clicks": int(p30_c), "c30_impressions": int(c30_i),
        "c90_impressions": int(c_i), "p90_impressions": int(p_i),
        "clicks_16m": int(c16), "impressions_16m": int(i16),
        "traffic_delta": int(traffic_delta),
        "potential_opportunity": opportunity,
        "priority_score": priority,
        "business_intent": intent, "page_type": ptype,
        "money_page": is_money, "blog": is_blog, "category_page": is_category,
        "landing_page": is_landing, "knowledge_page": is_knowledge,
    })

df = pd.DataFrame(rows)
df = df.sort_values("priority_score", ascending=False)
df.to_csv(os.path.join(OUT, "page-performance.csv"), index=False, encoding="utf-8-sig")
print("page-performance.csv:", len(df), "rows")

# Top lists
df["priority_score"] = pd.to_numeric(df["priority_score"], errors="coerce")
df["potential_opportunity"] = pd.to_numeric(df["potential_opportunity"], errors="coerce")
df["clicks_delta"] = pd.to_numeric(df["clicks_delta"], errors="coerce")
pct = pd.to_numeric(df["clicks_pct_change"], errors="coerce")
winners = df[pct.fillna(0) > 0].sort_values("clicks_delta", ascending=False).head(100)
losers = df.sort_values("clicks_delta").head(100)
opps = df.sort_values("potential_opportunity", ascending=False).head(100)
winners.to_csv(os.path.join(OUT, "top-100-winners.csv"), index=False)
losers.to_csv(os.path.join(OUT, "top-100-losers.csv"), index=False)
opps.to_csv(os.path.join(OUT, "page-opportunities.csv"), index=False, encoding="utf-8-sig")
print("winners/losers/opps written")

# Save intermediate for later steps
df.to_json(os.path.join(DATA, "_page_analysis.json"), orient="records", date_format="iso")
print("DONE PAGES")
