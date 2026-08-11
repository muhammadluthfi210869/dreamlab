"""Quick auth + sitelist test for Google Search Console."""
import json, sys
from google.oauth2 import service_account
from googleapiclient.discovery import build

CRED = r"C:\GAWE\Web Dev\Porto Aureon\CRAWL WEBSITE DREAMLAB\dreamlab-site\scripts\gsc-credentials.json"

creds = service_account.Credentials.from_service_account_file(
    CRED,
    scopes=["https://www.googleapis.com/auth/webmasters.readonly"],
)
service = build("searchconsole", "v1", credentials=creds)
sites = service.sites().list().execute()
print("SITES:")
for s in sites.get("siteEntry", []):
    print("  ", s.get("siteUrl"), "|", s.get("permissionLevel"))
print("DONE")
