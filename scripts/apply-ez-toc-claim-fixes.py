#!/usr/bin/env python3
"""Replace all old ez-toc ToCs with clean H2-only Daftar Isi + remove unverified claims.

Parses the whole article array as JSON, modifies each article, then writes back.
"""

import json, re

RAW_PATH = 'src/data/articles.ts'

with open(RAW_PATH, 'rb') as f:
    raw = f.read()

# ── Find the article array boundary ─────────────────────────────────
decl = b'export const articles: Article[] = ['
arr_start = raw.find(decl)
# Find the SECOND '[' after decl (first is for Article[])
first_bracket = raw.find(b'[', arr_start)
second_bracket = raw.find(b'[', first_bracket + 1)

def find_matching_bracket(data, start):
    depth = 0
    i = start
    while i < len(data):
        b = data[i]
        # Skip string literals properly
        if b == ord('"'):
            i += 1
            while i < len(data):
                if data[i] == ord('\\'):
                    i += 2  # skip escaped char
                elif data[i] == ord('"'):
                    break
                else:
                    i += 1
        elif b == ord('['):
            depth += 1
        elif b == ord(']'):
            depth -= 1
            if depth == 0:
                return i + 1  # position AFTER closing bracket
        i += 1
    return -1

closing_bracket = find_matching_bracket(raw, second_bracket)
print(f"Array bracket: {second_bracket} -> {closing_bracket}")

if closing_bracket < 0:
    print("ERROR: could not find array closing bracket")
    exit(1)

# ── Extract and parse the array as JSON ────────────────────────────
array_bytes = raw[second_bracket:closing_bracket]
# JSON doesn't allow trailing commas - remove them
text = array_bytes.decode('utf-8', errors='replace')
text_clean = re.sub(r',(\s*[\]}])', r'\1', text)  # remove trailing commas

articles = json.loads(text_clean)
print(f"Parsed {len(articles)} articles")

# ── Process each article ────────────────────────────────────────────
CHANGES = []

for art in articles:
    slug = art.get('slug', '')
    content = art.get('content', '')
    modified = False
    toc_replaced = False
    claims_fixed = False

    # ── 1. Replace ez-toc ToC ──────────────────────────────────────
    toc_div = content.find('<div id="ez-toc-container"')
    if toc_div >= 0:
        nav_end = content.find('</nav>', toc_div)
        if nav_end >= 0:
            toc_end = content.find('</div>', nav_end) + 6
        else:
            toc_end = toc_div

        h2_ids = []
        for m in re.finditer(r'<h2[^>]*>.*?</h2>', content, re.DOTALL):
            idm = re.search(r'id="([^"]+)"', m.group())
            if idm:
                h2_ids.append(idm.group(1))

        if h2_ids and toc_end > toc_div:
            toc_items = ''.join(
                f'<li><a href="#{eid}" style="color:#4a6fa5">{eid.replace("_", " ")}</a></li>'
                for eid in h2_ids
            )
            new_toc = (
                '<nav style="background:#FFF9F0;border:1px solid #E8D5B7;'
                'border-radius:12px;padding:24px 32px;margin:32px 0">'
                '<p style="font-weight:800;font-size:16px;margin:0 0 12px 0;'
                'color:#333">Daftar Isi</p>'
                '<ol style="margin:0;padding-left:20px">'
                + toc_items +
                '</ol></nav>'
            )
            content = content[:toc_div] + new_toc + content[toc_end:]
            modified = True
            toc_replaced = True

    # ── 2. Remove unverified claims ────────────────────────────────
    for old, new in [
        ('500+ brand', 'banyak brand'),
        ('500+', 'banyak'),
        ('lebih dari 500', 'banyak'),
        ('1000+ brand', 'banyak brand'),
        ('1000+', 'banyak'),
        ('15+ negara', 'berbagai negara'),
        ('15 negara', 'berbagai negara'),
    ]:
        if old in content:
            content = content.replace(old, new)
            modified = True
            claims_fixed = True

    if modified:
        art['content'] = content
        tags = []
        if toc_replaced:
            tags.append("ToC")
        if claims_fixed:
            tags.append("Claims")
        CHANGES.append(f"  /{slug} [{' + '.join(tags)}]")

print(f"Articles modified: {len(CHANGES)}")

# ── Write back ──────────────────────────────────────────────────────
new_json = json.dumps(articles, indent=2, ensure_ascii=False)
# Reformat to match original TS (4-space indent inside objects)
# The original uses specific formatting, but json.dumps with indent=2 is close enough
# Let's rebuild the TS file
before = raw[:second_bracket]
after = raw[closing_bracket:]

new_raw = before + new_json.encode('utf-8') + after

with open(RAW_PATH, 'wb') as f:
    f.write(new_raw)

print(f"File written ({len(new_raw)} bytes)")

# ── Quick verify ────────────────────────────────────────────────────
if b'ez-toc-container' in new_raw:
    count = new_raw.count(b'ez-toc-container')
    print(f"WARNING: {count} ez-toc-container remaining!")
else:
    print("✅ All ez-toc-container removed successfully!")
    
if b'500+ brand' in new_raw or b'1000+ brand' in new_raw:
    print("WARNING: Some claim patterns may remain")
else:
    print("✅ Claims removed successfully!")

if CHANGES:
    print("\nChanges:")
    for c in CHANGES:
        print(c)
