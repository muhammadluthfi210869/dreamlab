#!/usr/bin/env python3
"""Standardize CTA → .article-cta/.cta-button class format + FAQ → <details> accordion across all articles."""

import json, re

with open('src/data/articles.ts', 'rb') as f:
    raw = f.read()

# ── Parse JSON array ────────────────────────────────────────────────
decl = b'export const articles: Article[] = ['
arr_start = raw.find(decl)
fb = raw.find(b'[', arr_start)
sb = raw.find(b'[', fb + 1)

def fm(data, s):
    d=0;i=s
    while i<len(data):
        b=data[i]
        if b==ord('"'):
            i+=1
            while i<len(data):
                if data[i]==ord('\\'): i+=2
                elif data[i]==ord('"'): break
                else: i+=1
        elif b==ord('['): d+=1
        elif b==ord(']'):
            d-=1
            if d==0: return i+1
        i+=1
    return -1

cl = fm(raw, sb)
ab = raw[sb:cl]
t = ab.decode('utf-8', errors='replace')
tc = re.sub(r',(\s*[\]}])', r'\1', t)
articles = json.loads(tc)

CTA_CHANGED = 0
FAQ_CHANGED = 0

# ═══════════════════════════════════════════════════════════════════
# NEW CTA HTML (uses existing .article-cta / .cta-button CSS classes)
# ═══════════════════════════════════════════════════════════════════
NEW_CTA = (
    '<div class="article-cta">'
    '<h3>YUK KONSULTASI BRAND ANDA SEKARANG</h3>'
    '<p>Diskusikan HPP, formula, dan strategi brand serum-mu tanpa komitmen awal.</p>'
    '<a href="https://dreamlab.id/thankyou/google/" class="cta-button">'
    'Konsultasi Gratis dengan Dreamlab'
    '</a>'
    '</div>'
)

# ═══════════════════════════════════════════════════════════════════
# Process each article
# ═══════════════════════════════════════════════════════════════════
for art in articles:
    content = art.get('content', '')
    slug = art.get('slug', '')
    modified = False
    cta_modified = False
    faq_modified = False

    # ── 1. STANDARDIZE CTA ─────────────────────────────────────────
    # Remove any existing CTA blocks at the end of content
    
    # a) Remove my old inline-style CTA (the one I added earlier)
    old_cta = re.search(
        r'<div style="text-align:center;margin:\d+px\s*\d*">'
        r'\s*<a href="https://dreamlab\.id/thankyou/google/"[^>]*>.*?</a>'
        r'\s*</div>\s*$',
        content, re.DOTALL
    )
    if old_cta:
        content = content[:old_cta.start()].rstrip()
    
    # b) Remove any .article-cta at the end
    existing_cta = re.search(r'\s*<div class="article-cta">.*?</div>\s*$', content, re.DOTALL)
    if existing_cta:
        content = content[:existing_cta.start()].rstrip()
    
    # c) Remove image-only CTA at end (figure with thankyou link)
    img_cta = re.search(
        r'\s*<figure[^>]*>\s*<a href="https://dreamlab\.id/thankyou[^"]*"[^>]*>\s*'
        r'<img[^>]*>\s*</a>\s*</figure>\s*$',
        content, re.DOTALL
    )
    if img_cta:
        content = content[:img_cta.start()].rstrip()
    
    # d) Remove <p> with thankyou link at end
    p_cta = re.search(
        r'\s*<p>\s*(?:<strong>\s*)?<a href="https://dreamlab\.id/thankyou[^"]*"[^>]*>.*?</a>'
        r'(?:\s*</strong>)?\s*</p>\s*$',
        content, re.DOTALL
    )
    if p_cta:
        content = content[:p_cta.start()].rstrip()
    
    # e) Remove <p> with wa.me link at end
    wa_cta = re.search(
        r'\s*<p>\s*(?:<strong>\s*)?<a href="https://api\.whatsapp\.com[^"]*"[^>]*>.*?</a>'
        r'(?:\s*</strong>)?\s*</p>\s*$',
        content, re.DOTALL
    )
    if wa_cta:
        content = content[:wa_cta.start()].rstrip()
    
    # Check if the new CTA is already present
    if 'YUK KONSULTASI BRAND ANDA SEKARANG' not in content:
        content = content.rstrip() + '\n\n\n' + NEW_CTA
        modified = True
        cta_modified = True

    # ── 2. STANDARDIZE FAQ ─────────────────────────────────────────
    # Find FAQ H2 section and content after it
    faq_h2 = re.search(
        r'<h2[^>]*>.*?[Ff][Aa][Qq].*?</h2>', content, re.DOTALL
    )
    
    if faq_h2:
        faq_h2_end = faq_h2.end()
        # Find where FAQ section ends (next H2, or article-cta, or end)
        next_h2 = re.search(r'<h2[^>]*>', content[faq_h2_end:])
        cta_pos = content.find('<div class="article-cta"', faq_h2_end)
        section_end = len(content)
        if next_h2:
            section_end = min(section_end, faq_h2_end + next_h2.start())
        if cta_pos > 0:
            section_end = min(section_end, cta_pos)
        
        faq_body = content[faq_h2_end:section_end]
        
        # Check if already using <details class="article-faq">
        if 'class="article-faq"' in faq_body:
            pass  # already good
        else:
            new_faq_parts = []
            
            # Pattern 1: <ol><li><strong>Q</strong>[<br>]A</li></ol>
            ol_match = re.search(r'<ol[^>]*>(.*?)</ol>', faq_body, re.DOTALL)
            if ol_match:
                lis = re.findall(r'<li>(.*?)</li>', ol_match.group(1), re.DOTALL)
                for li in lis:
                    q_match = re.search(r'<strong>(.*?)</strong>', li)
                    if q_match:
                        q_text = re.sub(r'<[^>]+>', '', q_match.group(1)).strip()
                        q_text = re.sub(r'&#xa0;|\u00a0', ' ', q_text).strip()
                        q_text = re.sub(r'^\d+[\.\s]+', '', q_text).strip()
                        a_text = re.sub(r'<[^>]+>', '', li[q_match.end():]).strip()
                        a_text = re.sub(r'&#xa0;|\u00a0', ' ', a_text).strip()
                        a_text = re.sub(r'^[\s<br>\\/]+', '', a_text).strip()
                        if q_text and a_text:
                            new_faq_parts.append(
                                f'<details class="article-faq">'
                                f'<summary>{q_text}</summary>'
                                f'<p>{a_text}</p>'
                                f'</details>'
                            )
            
            # Pattern 2: <h3>Q</h3><p>A</p> (with optional <span> inside)
            if not new_faq_parts:
                h3s = re.findall(
                    r'<h3[^>]*>(.*?)</h3>\s*<p[^>]*>(.*?)</p>',
                    faq_body, re.DOTALL
                )
                for q_html, a_html in h3s:
                    q_text = re.sub(r'<[^>]+>', '', q_html).strip()
                    q_text = re.sub(r'&#xa0;|\u00a0', ' ', q_text).strip()
                    q_text = re.sub(r'^\d+[\.\s]+', '', q_text).strip()
                    a_text = re.sub(r'<[^>]+>', '', a_html).strip()
                    a_text = re.sub(r'&#xa0;|\u00a0', ' ', a_text).strip()
                    a_text = re.sub(r'^Jawaban\s*[:]\s*', '', a_text).strip()
                    if q_text and a_text:
                        new_faq_parts.append(
                            f'<details class="article-faq">'
                            f'<summary>{q_text}</summary>'
                            f'<p>{a_text}</p>'
                            f'</details>'
                        )
            
            # Pattern 3: <ul><li><strong>Q</strong> A</li></ul>
            if not new_faq_parts:
                ul_match = re.search(r'<ul[^>]*>(.*?)</ul>', faq_body, re.DOTALL)
                if ul_match:
                    lis = re.findall(r'<li>(.*?)</li>', ul_match.group(1), re.DOTALL)
                    for li in lis:
                        q_match = re.search(r'<strong>(.*?)</strong>', li)
                        if q_match:
                            q_text = re.sub(r'<[^>]+>', '', q_match.group(1)).strip()
                            q_text = re.sub(r'&#xa0;|\u00a0', ' ', q_text).strip()
                            a_text = re.sub(r'<[^>]+>', '', li[q_match.end():]).strip()
                            a_text = re.sub(r'&#xa0;|\u00a0', ' ', a_text).strip()
                            a_text = re.sub(r'^[\s<br>\\/]+', '', a_text).strip()
                            if q_text and a_text:
                                new_faq_parts.append(
                                    f'<details class="article-faq">'
                                    f'<summary>{q_text}</summary>'
                                    f'<p>{a_text}</p>'
                                    f'</details>'
                                )
            
            # Pattern 4: <p><strong>Q:</strong> ... </p><p><strong>A:</strong> ...</p>
            if not new_faq_parts:
                qa_pairs = re.findall(
                    r'<p>\s*(?:<strong>\s*)?[Qq]\s*[:]\s*(.*?)(?:\s*</strong>)?\s*</p>\s*'
                    r'<p>\s*(?:<strong>\s*)?[Aa]\s*[:]\s*(.*?)(?:\s*</strong>)?\s*</p>',
                    faq_body, re.DOTALL
                )
                for q_html, a_html in qa_pairs:
                    q_text = re.sub(r'<[^>]+>', '', q_html).strip()
                    q_text = re.sub(r'&#xa0;|\u00a0', ' ', q_text).strip()
                    a_text = re.sub(r'<[^>]+>', '', a_html).strip()
                    a_text = re.sub(r'&#xa0;|\u00a0', ' ', a_text).strip()
                    if q_text and a_text:
                        new_faq_parts.append(
                            f'<details class="article-faq">'
                            f'<summary>{q_text}</summary>'
                            f'<p>{a_text}</p>'
                            f'</details>'
                        )
            
            # Pattern 5: <p><strong>Q:</strong> ... <strong>A:</strong> ...</p> (inline)
            if not new_faq_parts:
                inline_qas = re.findall(
                    r'<p>\s*(?:<strong>\s*)?[Qq]\s*[:]\s*(.*?)'
                    r'\s*(?:</strong>)?\s*(?:<strong>\s*)?[Aa]\s*[:]\s*(.*?)\s*</p>',
                    faq_body, re.DOTALL
                )
                for q_html, a_html in inline_qas:
                    q_text = re.sub(r'<[^>]+>', '', q_html).strip()
                    q_text = re.sub(r'&#xa0;|\u00a0', ' ', q_text).strip()
                    a_text = re.sub(r'<[^>]+>', '', a_html).strip()
                    a_text = re.sub(r'&#xa0;|\u00a0', ' ', a_text).strip()
                    if q_text and a_text:
                        new_faq_parts.append(
                            f'<details class="article-faq">'
                            f'<summary>{q_text}</summary>'
                            f'<p>{a_text}</p>'
                            f'</details>'
                        )
            
            # Pattern 6: <details> with inline styles → convert to class="article-faq"
            if not new_faq_parts:
                inline_details = re.findall(
                    r'<details[^>]*>(.*?)</details>', faq_body, re.DOTALL
                )
                for det in inline_details:
                    s_match = re.search(r'<summary>(.*?)</summary>', det, re.DOTALL)
                    p_match = re.search(r'<p>(.*?)</p>', det, re.DOTALL)
                    if s_match and p_match:
                        q_text = re.sub(r'<[^>]+>', '', s_match.group(1)).strip()
                        a_text = re.sub(r'<[^>]+>', '', p_match.group(1)).strip()
                        if q_text and a_text:
                            new_faq_parts.append(
                                f'<details class="article-faq">'
                                f'<summary>{q_text}</summary>'
                                f'<p>{a_text}</p>'
                                f'</details>'
                            )
            
            # Pattern 7: <p> Q: ...</p>\n<p>Answer...</p> (MOQ-style, no A: marker)
            if not new_faq_parts:
                # Find all <p> Q: ...</p> ... <p>answer</p> pairs
                q_matches = list(re.finditer(
                    r'<p>\s*[Qq]\s*[:]\s*(.*?)</p>', faq_body, re.DOTALL
                ))
                if q_matches:
                    for qi, qm in enumerate(q_matches):
                        q_text = re.sub(r'<[^>]+>', '', qm.group(1)).strip()
                        q_text = re.sub(r'&#xa0;|\u00a0', ' ', q_text).strip()
                        
                        # A is everything after this </p> until next <p>Q: or end
                        a_start = qm.end()
                        if qi + 1 < len(q_matches):
                            a_end = q_matches[qi+1].start()
                        else:
                            a_end = len(faq_body)
                        
                        a_raw = faq_body[a_start:a_end]
                        a_text = re.sub(r'<[^>]+>', '', a_raw).strip()
                        a_text = re.sub(r'&#xa0;|\u00a0', ' ', a_text).strip()
                        
                        if q_text and a_text:
                            new_faq_parts.append(
                                f'<details class="article-faq">'
                                f'<summary>{q_text}</summary>'
                                f'<p>{a_text}</p>'
                                f'</details>'
                            )
            
            if new_faq_parts:
                new_faq_html = '\n\n'.join(new_faq_parts)
                content = content[:faq_h2_end] + '\n\n' + new_faq_html + '\n\n' + content[section_end:]
                modified = True
                faq_modified = True
    
    if modified:
        art['content'] = content
        if cta_modified:
            CTA_CHANGED += 1
        if faq_modified:
            FAQ_CHANGED += 1

# ── Write back ──────────────────────────────────────────────────────
new_json = json.dumps(articles, indent=2, ensure_ascii=False)
before = raw[:sb]
after = raw[cl:]
new_raw = before + new_json.encode('utf-8') + after

with open('src/data/articles.ts', 'wb') as f:
    f.write(new_raw)

print(f"CTA updated: {CTA_CHANGED} articles")
print(f"FAQ converted: {FAQ_CHANGED} articles")
print(f"Total articles: {len(articles)}")

# Quick verify
v = new_raw.decode('utf-8', errors='replace')
yuk_count = v.count('YUK KONSULTASI BRAND ANDA SEKARANG')
cta_class_count = v.count('class="article-cta"')
print(f"\n'YUK KONSULTASI BRAND ANDA SEKARANG' occurrences: {yuk_count}")
print(f"'.article-cta' occurrences: {cta_class_count}")
faq_pattern = '<details class="article-faq">'
print(f"'details.article-faq' occurrences: {v.count(faq_pattern)}")
