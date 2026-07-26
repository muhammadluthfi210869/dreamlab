#!/usr/bin/env python3
import json, re

with open('src/data/articles.ts', 'rb') as f:
    raw = f.read()

idx = raw.find(b'Memulai&#xa0;bisnis&#xa0;skincare&#xa0;memerlukan')
cf = raw.rfind(b'"content": "', 0, idx) + 11  # position of opening " of JSON string
ce = raw.find(b'",\n    "seo"', idx)  # position of closing "

content_bytes = raw[cf:ce+1]  # include closing "
html = json.loads(content_bytes.decode('utf-8'))

# Fix 1: Replace &nbsp; with space
html = html.replace('&#xa0;', ' ')

# Fix 2: Remove has-fixed-layout
html = html.replace('has-fixed-layout', '')

# Fix 3: Replace ez-toc ToC with clean H2-only ToC
toc_start = html.find('<div id="ez-toc-container"')
nav_end = html.find('</nav>', toc_start)
toc_end = html.find('</div>', nav_end) + 6

h2_ids = []
for m in re.finditer(r'<h2[^>]*>.*?</h2>', html, re.DOTALL):
    idm = re.search(r'id="([^"]+)"', m.group())
    if idm:
        h2_ids.append(idm.group(1))

print(f'H2 IDs: {len(h2_ids)}')

toc_items = ''.join(
    f'<li><a href="#{eid}" style="color:#4a6fa5">{eid.replace("_", " ")}</a></li>'
    for eid in h2_ids
)
new_toc = (
    '<nav style="background:#FFF9F0;border:1px solid #E8D5B7;border-radius:12px;padding:24px 32px;margin:32px 0">'
    '<p style="font-weight:800;font-size:16px;margin:0 0 12px 0;color:#333">Daftar Isi</p>'
    '<ol style="margin:0;padding-left:20px">'
    + toc_items +
    '</ol></nav>'
)

html = html[:toc_start] + new_toc + html[toc_end:]

new_json = json.dumps(html, ensure_ascii=False)
new_bytes = new_json.encode('utf-8')
# Replace the old content (including its outer quotes) with new JSON string (which also has outer quotes)
new_raw = raw[:cf] + new_bytes + raw[ce+1:]

with open('src/data/articles.ts', 'wb') as f:
    f.write(new_raw)

# Verify
verify = new_raw[cf:cf + len(new_bytes)]
assert b'ez-toc-container' not in verify, 'FAIL: old toc still present'
assert b'has-fixed-layout' not in verify, 'FAIL: has-fixed-layout still present'
assert b'Daftar Isi' in verify, 'FAIL: new toc missing'
print('All checks passed!')
