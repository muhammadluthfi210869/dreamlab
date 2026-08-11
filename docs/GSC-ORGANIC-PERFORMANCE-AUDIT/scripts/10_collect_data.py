"""
DREAMLAB GSC Data Collection Pipeline
Pulls 16 months of Search Console data for dreamlab.id
"""
import json, csv, os, time, sys
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPORT_ROOT = os.path.dirname(SCRIPT_DIR)

def _find_credential():
    """Search env var, then walk up parent dirs for the service account JSON."""
    candidates = []
    env = os.environ.get("GSC_SERVICE_ACCOUNT_PATH")
    if env:
        candidates.append(env)
    d = SCRIPT_DIR
    for _ in range(10):
        candidates.append(os.path.join(d, "gsc-credentials.json"))
        candidates.append(os.path.join(d, "scripts", "gsc-credentials.json"))
        candidates.append(os.path.join(d, "dreamlab-site", "scripts", "gsc-credentials.json"))
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    for c in candidates:
        if os.path.isfile(c):
            return c
    return None

CRED = _find_credential()
if not CRED:
    raise FileNotFoundError("Service account JSON not found. Set GSC_SERVICE_ACCOUNT_PATH or place gsc-credentials.json in scripts/.")
SITE = "sc-domain:dreamlab.id"
DATA = os.path.join(REPORT_ROOT, "data")
os.makedirs(DATA, exist_ok=True)

creds = service_account.Credentials.from_service_account_file(CRED, scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
svc = build("searchconsole", "v1", credentials=creds)

TODAY = datetime.now().date()

def daterange(start, end):
    return start.isoformat(), end.isoformat()

def retry(fn, tries=6, base=2.0):
    for i in range(tries):
        try:
            return fn()
        except HttpError as e:
            if e.resp.status in (429, 500, 502, 503, 504):
                wait = base * (2 ** i)
                print(f"  retry {i+1} after {wait:.1f}s ({e.resp.status})", flush=True)
                time.sleep(wait)
            else:
                raise
    raise RuntimeError("max retries exceeded")

def pull(start, end, dimensions=None, row_limit=25000, filters=None, max_rows=25000):
    """Paginated pull. Returns list of rows."""
    all_rows = []
    start_row = 0
    while True:
        body = {
            "startDate": start,
            "endDate": end,
            "rowLimit": row_limit,
            "startRow": start_row,
        }
        if dimensions:
            body["dimensions"] = dimensions
        if filters:
            body["dimensionFilterGroups"] = filters
        def do():
            return svc.searchanalytics().query(siteUrl=SITE, body=body).execute()
        resp = retry(do)
        rows = resp.get("rows", [])
        all_rows.extend(rows)
        if len(rows) < row_limit:
            break
        start_row += row_limit
        if start_row >= max_rows:
            break
        time.sleep(0.3)
    return all_rows

def save(name, rows, dims, header_extras=None):
    path = os.path.join(DATA, name)
    if not rows:
        with open(path, "w", newline="", encoding="utf-8") as f:
            f.write("no data\n")
        print(f"{name}: EMPTY")
        return
    dim = dims[0] if dims else "date"
    keys = ["clicks", "impressions", "ctr", "position"]
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        header = dims[:] + keys
        if header_extras:
            header += header_extras
        w.writerow(header)
        for r in rows:
            row = r.get("keys", [])[:len(dims)] if r.get("keys") else [""]*len(dims)
            while len(row) < len(dims):
                row.append("")
            vals = [row[i] if i < len(row) else "" for i in range(len(dims))]
            metrics = [r.get("clicks",0), r.get("impressions",0), round(r.get("ctr",0),6), round(r.get("position",0),2)]
            w.writerow(vals + metrics)
    print(f"{name}: {len(rows)} rows")

# ---------- date windows ----------
start16 = TODAY.replace(year=TODAY.year-1, month=TODAY.month-4)  # 16 months back
if start16.day > TODAY.day:
    start16 = start16 - timedelta(days=1)
s16, e16 = daterange(start16, TODAY)

c90_start = TODAY - timedelta(days=89)
p90_end = c90_start - timedelta(days=1)
p90_start = p90_end - timedelta(days=89)
c30_start = TODAY - timedelta(days=29)
p30_end = c30_start - timedelta(days=1)
p30_start = p30_end - timedelta(days=29)

print(f"16m: {s16}..{e16}")
print(f"c90: {c90_start}..{TODAY}  p90: {p90_start}..{p90_end}")
print(f"c30: {c30_start}..{TODAY}  p30: {p30_start}..{p30_end}", flush=True)

# ---------- 1. daily performance ----------
rows = pull(s16, e16, dimensions=["date"])
save("daily_16m.csv", rows, ["date"])

# ---------- 2. queries 16m top 10k ----------
rows = pull(s16, e16, dimensions=["query"], max_rows=10000)
save("queries_16m.csv", rows, ["query"])

# ---------- 3. pages 16m top 10k ----------
rows = pull(s16, e16, dimensions=["page"], max_rows=10000)
save("pages_16m.csv", rows, ["page"])

# ---------- 4. countries ----------
rows = pull(s16, e16, dimensions=["country"])
save("countries_16m.csv", rows, ["country"])

# ---------- 5. devices ----------
rows = pull(s16, e16, dimensions=["device"])
save("devices_16m.csv", rows, ["device"])

# ---------- 6. search appearance ----------
try:
    rows = pull(s16, e16, dimensions=["searchAppearance"])
    save("appearance_16m.csv", rows, ["searchAppearance"])
except Exception as e:
    print("appearance failed:", e)

# ---------- 7. query comparison windows ----------
for label, s, e in [("c90", c90_start, TODAY), ("p90", p90_start, p90_end), ("c30", c30_start, TODAY), ("p30", p30_start, p30_end)]:
    s, e = s.isoformat(), e.isoformat()
    rows = pull(s, e, dimensions=["query"], max_rows=10000)
    save(f"queries_{label}.csv", rows, ["query"])
    time.sleep(0.3)
    rows = pull(s, e, dimensions=["page"], max_rows=10000)
    save(f"pages_{label}.csv", rows, ["page"])
    time.sleep(0.3)

# ---------- 8. query+page for cannibalization (16m, top 25k) ----------
rows = pull(s16, e16, dimensions=["query", "page"], max_rows=25000)
save("query_page_16m.csv", rows, ["query", "page"])

# ---------- 9. sitemap list ----------
try:
    sms = svc.sitemaps().list(siteUrl=SITE).execute()
    with open(os.path.join(DATA, "sitemaps.json"), "w", encoding="utf-8") as f:
        json.dump(sms.get("sitemap", []), f, indent=2)
    print("sitemaps:", len(sms.get("sitemap", [])))
except Exception as e:
    print("sitemap list failed:", e)

print("ALL DONE")
