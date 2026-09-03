/**
 * SERVER-ONLY pipeline transformasi konten artikel.
 *
 * Dulu semua transform di bawah dieksekusi DI BROWSER oleh
 * `InteractiveArticleBody` saat post-hydration (DOMParser → swap innerHTML),
 * yang menyebabkan double-render CLS + beban main thread. Sekarang seluruh
 * transform digeser KE SINI, berjalan sekali saat SSG/ISR di `[...slug]/page.tsx`,
 * menghasilkan HTML final yang identik.
 */

const THANKYOU_URL = '/thankyou/google/';
const CTA_TITLE = 'YUK KONSULTASI PRODUK ANDA';
const CTA_BODY =
  'Diskusikan konsep produk, HPP produk, dan strategi brand-mu bersama tim Dreamlab.';
const CTA_BUTTON_TEXT = 'Konsultasi Gratis dengan Dreamlab';

const EMOJI_RE =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}]/gu;

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#xa0;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x2019;/gi, "'")
    .replace(/&#x201c;/gi, '"')
    .replace(/&#x201d;/gi, '"')
    .replace(/&#x2026;/gi, '...')
    .replace(/&#x2014;/gi, '--')
    .replace(/&#x2013;/gi, '-');
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ');
}

function textContentOf(nodeHtml: string): string {
  return decodeEntities(stripTags(nodeHtml)).trim().replace(/\s+/g, ' ');
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ------------------------------------------------------------------ *
 * Util: scanner elemen berkeseimbangan (setara querySelectorAll).      *
 * ------------------------------------------------------------------ */

interface ElementSpan {
  attrs: string; // full attribute string di dalam <tag ...>
  start: number; // indeks '<' pembuka
  openEnd: number; // indeks '>' pembuka (mulai isi)
  closeEnd: number; // indeks setelah '</tag>' penutup, atau -1 tj ignore
  innerStart: number; // = openEnd
  innerEnd: number; // indeks '<' dari '</tag>'
}

/** Semua tag pembuka bernama `tag` (abaikan self-closing). */
function findElementSpans(html: string, tag: string): ElementSpan[] {
  const out: ElementSpan[] = [];
  const re = new RegExp(`<${tag}\\b([^>]*)>`, 'gi');
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1] ?? '';
    const trimmed = attrs.trim();
    if (trimmed.length >= 1 && trimmed.endsWith('/')) continue; // self-closing
    out.push({
      attrs: trimmed,
      start: m.index,
      openEnd: m.index + m[0].length,
      closeEnd: -1,
      innerStart: m.index + m[0].length,
      innerEnd: -1,
    });
  }
  return out;
}

/** Cari posisi ujung `</tag>` yang menutup pembuka di openStart. */
function findBalancedEnd(html: string, tag: string, openStart: number): number {
  return balancedEnd(html, tag, openStart);
}

function balancedEnd(html: string, tag: string, openStart: number): number {
  const re = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, 'gi');
  re.lastIndex = openStart;
  let depth = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const isClose = m[0].startsWith('</');
    if (isClose) {
      depth -= 1;
      if (depth <= 0) return re.lastIndex;
    } else {
      depth += 1;
    }
  }
  return -1;
}

/** Lengkapi closeEnd/innerEnd untuk semua span tag. */
function resolveSpansAll(html: string, spans: ElementSpan[], tag: string): ElementSpan[] {
  for (const s of spans) {
    const end = findBalancedEnd(html, tag, s.start);
    s.closeEnd = end;
    s.innerEnd = end === -1 ? -1 : end - (tag.length + 3);
  }
  return spans;
}

/** Potong html dengan jumlah region yang sudah diurut membesar (end dalam hot). */
function spliceOut(html: string, ranges: Array<{ start: number; end: number }>): string {
  ranges.sort((a, b) => a.start - b.start);
  let out = '';
  let cursor = 0;
  for (const r of ranges) {
    out += html.slice(cursor, r.start);
    cursor = r.end;
  }
  out += html.slice(cursor);
  return out;
}

/**
 * Hapus semua elemen <tag> yang predicate(attrs, innerHtml) = true.
 */
function stripElements(html: string, tag: string, predicate: (attrs: string, inner: string) => boolean): string {
  let spans = findElementSpans(html, tag);
  spans = resolveSpansAll(html, spans, tag);
  const matches = spans.filter((s) => s.closeEnd !== -1);
  const ranges = matches.filter((s) => predicate(s.attrs, html.slice(s.innerStart, s.innerEnd)));
  if (!ranges.length) return html;
  return spliceOut(html, ranges.map((s) => ({ start: s.start, end: s.closeEnd })));
}

/* ------------------------------------------------------------------ *
 * 1. Normalisasi & path legasi + atribut img warisan                   *
 * ------------------------------------------------------------------ */
function renameLegacyPaths(html: string): string {
  let c = html;
  c = c.replace(
    /https?:\/\/dreamlab\.id\/wp-content\/uploads\/[^\s"'>]*\/([^\/\s"'>]+\.(?:webp|png|jpg|jpeg|svg|gif))/gi,
    '/assets/images/$1'
  );
  c = c.replace(
    /\/wp-content\/uploads\/[^\s"'>]*\/([^\/\s"'>]+\.(?:webp|png|jpg|jpeg|svg|gif))/gi,
    '/assets/images/$1'
  );
  c = c.replace(/bv-data-src=/gi, 'data-src=');
  c = c.replace(/src="data:image\/svg\+xml[^"]*"/gi, '');
  c = c.replace(/data-src=/gi, 'src=');
  c = c.replace(/bv-data-srcset="[^"]*"/gi, '');
  c = c.replace(/data-id="[^"]*"/gi, '');
  c = c.replace(/<img\s/gi, '<img loading="lazy" ');
  c = c.replace(/loading="lazy"\s+loading="lazy"/gi, 'loading="lazy"');
  c = c.replace(/<img\b([^>]*?)(\/?)>/gi, (full, attrs: string, slash: string) => {
    if (attrs.includes('/_next/image')) return full;
    const cleaned = attrs
      .replace(/srcset="[^"]*"/gi, '')
      .replace(/\s+sizes="[^"]*"/gi, '')
      .trim();
    return `<img${cleaned ? ' ' + cleaned : ''}${slash}>`;
  });
  return c;
}

/* ------------------------------------------------------------------ *
 * 2. Buang legacy ToC (ez-toc/manual) + div kosong                    *
 * ------------------------------------------------------------------ */
function removeLegacyTocs(html: string): string {
  let c = html;

  // 2a. Struktural ez-toc (regex pasti)
  c = c.replace(/<div\s+id="ez-toc-container[^>]*>[\s\S]*?<\/nav>\s*<\/div>\s*<\/div>/g, '');
  c = c.replace(/<span\s+class="ez-toc-title-toggle[^>]*>[\s\S]*?<\/span>/g, '');
  c = c.replace(/<svg[^>]*class="[^"]*(?:list-377408|arrow-unsorted|ez-toc-icon)[^"]*"[^>]*>[\s\S]*?<\/svg>/g, '');
  c = c.replace(/<div\s+id="ez-toc-container[^>]*>[\s\S]*?<\/nav>\s*<\/div>\s*<\/div>/g, '');
  c = c.replace(/<span\s+class="ez-toc-title-toggle[^>]*>[\s\S]*?<\/span>/g, '');
  c = c.replace(/<svg[^>]*class="[^"]*(?:list-377408|arrow-unsorted|ez-toc-icon)[^"]*"[^>]*>[\s\S]*?<\/svg>/g, '');

  // 2b. class/id mengandung "toc" / "daftar-isi"
  for (const tag of ['nav', 'div', 'section', 'ul', 'ol', 'span', 'p']) {
    c = stripElements(c, tag, (attrs) =>
      /(?:class|id)="[^"]*(?:ez-toc|toc|daftar-isi)[^"]*"/i.test(attrs)
    );
  }

  // 2c. Manual ToC via teks "Daftar Isi"/"Ringkasan Isi"
  for (const tag of ['nav', 'section', 'div']) {
    c = stripElements(c, tag, (_attrs, inner) => {
      const t = textContentOf(inner).toLowerCase().slice(0, 200);
      return t.includes('daftar isi') || t.includes('ringkasan isi');
    });
  }

  // 2d. Wrapper kosong
  c = c.replace(/<div\b[^>]*>\s*<\/div>/g, '');
  c = c.replace(/<p>\s*<\/p>/gi, '');
  return c;
}

/* ------------------------------------------------------------------ *
 * 3. Heading ID + Daftar Isi                                          *
 * ------------------------------------------------------------------ */

interface Heading {
  level: 2 | 3;
  id: string;
  text: string;
}

function processHeadings(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const out = html.replace(
    /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (m, lvl: string, attrs: string, inner: string) => {
      const level = lvl === '2' ? 2 : 3;
      const text = textContentOf(inner);
      const id = slugify(text);
      if (!id) return m;

      // Exclude CTA headings and chart card headings from the TOC
      const isCtaHeading =
        /article-cta/i.test(attrs) ||
        /konsultasi|diskusikan|partner selanjutnya|yuk,/i.test(text.toLowerCase());
      const isChartHeading = /penjualan 5 brand/i.test(text.toLowerCase());

      if (!isCtaHeading && !isChartHeading) {
        headings.push({ level, id, text });
      }

      const cls = level === 2 ? 'article-h2' : 'article-h3';
      const cleanAttrs = attrs.replace(/\s+id="[^"]*"/gi, '').replace(/\s+class="[^"]*"/gi, '').trim();
      return `<h${level} id="${id}" class="${cls}"${cleanAttrs ? ' ' + cleanAttrs : ''}>${inner}</h${level}>`;
    }
  );
  return { html: out, headings };
}

function buildToc(heads: Heading[]): string | null {
  const h2s = heads.filter((h) => h.level === 2 && h.id);
  if (h2s.length < 2) return null;
  const items = h2s
    .map((h) => {
      // Strip leading numbering (e.g. "1. ", "01. ", "1) ") so <ol> numbering does not double
      const label = h.text.replace(/^\d+[\.\)]\s*/, '').trim();
      return `<li><a href="#${h.id}">${esc(label)}</a></li>`;
    })
    .join('');
  return `<nav class="article-outline"><p class="article-outline-label">Daftar Isi</p><ol>${items}</ol></nav>`;
}

function injectToc(html: string, toc: string | null): string {
  if (!toc) return html;
  const idx = /<h2\b[^>]*class="article-h2"/i.exec(html);
  if (!idx) return toc + html;
  return html.slice(0, idx.index) + toc + html.slice(idx.index);
}

/* ------------------------------------------------------------------ *
 * 4. CTA: inline navy → .article-cta; auto bila tak ada                *
 * ------------------------------------------------------------------ */
function absorbInlineCtas(html: string): string {
  // Only target actual CTA container divs that have a navy background and are not already .article-cta or .data-chart-card
  const nodes = findElementSpans(html, 'div').filter((o) => {
    const isNavyBg = /(?:background|background-color):\s*[^;"]*(?:linear-gradient|#1a1a2e|#16213e|#0f3460)/i.test(o.attrs);
    const isAlreadyCta = /class="[^"]*article-cta[^"]*"/i.test(o.attrs);
    const isChart = /class="[^"]*data-chart-card[^"]*"/i.test(o.attrs);
    return isNavyBg && !isAlreadyCta && !isChart;
  });
  if (!nodes.length) return html;

  const spans = resolveSpansAll(html, nodes, 'div');
  const replacements: Array<{ start: number; end: number; html: string }> = [];
  for (const s of spans) {
    if (s.closeEnd === -1) continue;
    const inner = html.slice(s.innerStart, s.innerEnd);
    const aM = /<a\b([^>]*)>([\s\S]*?)<\/a>/i.exec(inner);
    if (!aM && !/konsultasi|hubungi|whatsapp/i.test(inner)) continue;

    const h3m = /<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/i.exec(inner);
    const ps = inner.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
    const pText = ps
      .map((p) => textContentOf(p.replace(/<p\b[^>]*>/i, '').replace(/<\/p>/i, '')))
      .filter(Boolean);
    const title = textContentOf(h3m?.[1] || '') || CTA_TITLE;
    const desc = pText.filter((t) => t !== title).join(' ') || CTA_BODY;
    const href = /href=["']([^"']*)["']/i.exec(aM?.[1] || '')?.[1] || THANKYOU_URL;
    const btnText = aM ? textContentOf(aM[2]) || CTA_BUTTON_TEXT : CTA_BUTTON_TEXT;
    replacements.push({
      start: s.start,
      end: s.closeEnd,
      html: `<div class="article-cta"><h3>${esc(title)}</h3><p>${esc(desc)}</p>` + `<a class="cta-button" href="${esc(href)}">${esc(btnText)}</a></div>`,
    });
  }
  replacements.sort((a, b) => b.start - a.start);
  let c = html;
  for (const r of replacements) c = c.slice(0, r.start) + r.html + c.slice(r.end);
  return c;
}

function buildAutoCta(): string {
  return `<div class="article-cta"><h3>${CTA_TITLE}</h3><p>${CTA_BODY}</p><a class="cta-button" href="${THANKYOU_URL}">${CTA_BUTTON_TEXT}</a></div>`;
}

function injectAutoCta(html: string): string {
  if (/(?:class="[^"]*article-cta[^"]*"|article-cta)/i.test(html)) return html;
  const cta = buildAutoCta();
  const toc = /(<nav\b[^>]*class="article-outline"[^>]*>[\s\S]*?<\/nav>)/i.exec(html);
  if (toc) return html.slice(0, toc.index + toc[0].length) + cta + html.slice(toc.index + toc[0].length);
  const firstH2 = /<h2\b[^>]*>/i.exec(html);
  if (firstH2) return html.slice(0, firstH2.index) + cta + html.slice(firstH2.index);
  const content = /<div\b[^>]*class="[^"]*elementor-widget-theme-post-content[^"]*"[^>]*>/i.exec(html);
  const pos = content ? content.index + content[0].length : html.length;
  return html.slice(0, pos) + cta + html.slice(pos);
}

/* ------------------------------------------------------------------ *
 * 5. Bersihkan paragraf kosong                                        *
 * ------------------------------------------------------------------ */
function cleanEmptyParagraphs(html: string): string {
  return html.replace(/<p\b[^>]*>(?:\s|&nbsp;|&#xa0;|\u00a0)*<\/p>/gi, '');
}

/* ------------------------------------------------------------------ *
 * 6. Anchor & gambar menuju /thankyou/google/                         *
 * ------------------------------------------------------------------ */
function rewriteAnchorsAndImages(html: string): string {
  let c = html;

  // a) WhatsApp / old forms / broken thankyou / kontak / broken text hrefs → thankyou
  c = c.replace(
    /<a\b([^>]*?)href=["'][^"']*(?:wa\.me|api\.whatsapp\.com|wa\.link|thankyoupage-google|thankyou-page|thank-you-maklon|forms\.kommo\.com|dreamlab\.id\/kontak|\/kontak|dreamlab\.id\/contact-us|\/contact-us|\s+)[^"']*["']([^>]*)>((?:(?!<\/a>)[\s\S])*?)<\/a>/gi,
    (_full, pre: string, post: string, inner: string) => {
      return `<a href="${THANKYOU_URL}"${cleanAttrs(pre + ' ' + post)}>${inner}</a>`;
    }
  );

  // b) Any anchor wrapping ANY banner/article CTA image → thankyou
  c = c.replace(
    /<a\b([^>]*?)href=["'][^"']*["']([^>]*)>((?:(?!<\/a>)[\s\S])*?<img\b[^>]*?(?:artikel-mid|artikel-cta|artikel_tengah|artikel_akhir|maklonkosmetik_artikel|legalitas|cta-wa|dreamlab_maklonkosmetik)[^>]*?>(?:(?!<\/a>)[\s\S])*?)<\/a>/gi,
    (_full, pre: string, post: string, inner: string) => {
      return `<a href="${THANKYOU_URL}"${cleanAttrs(pre + ' ' + post)}>${inner}</a>`;
    }
  );

  // c) CTA text anchors (e.g. Konsultasi, Hubungi, Mulai sekarang) pointing to homepage or external
  c = c.replace(
    /<a\b([^>]*?)href=["'][^"']*["']([^>]*)>((?:(?!<\/a>)[\s\S])*?)<\/a>/gi,
    (full, pre: string, post: string, inner: string) => {
      const text = textContentOf(inner).toLowerCase();
      const isCtaText = /^(?:konsultasi|konsultasikan|hubungi|chat|daftar|yuk,\s*mulai|mulai\s*sekarang|dapatkan\s*free\s*sample|free\s*sample)/i.test(text) ||
                        /konsultasi\s*(?:gratis|sekarang|maklon|brand|bersama|produk)/i.test(text) ||
                        /hubungi\s*(?:dreamlab|kami|tim)/i.test(text);
      if (isCtaText) {
        return `<a href="${THANKYOU_URL}"${cleanAttrs(pre + ' ' + post)}>${inner}</a>`;
      }
      return full;
    }
  );

  // d) CTA button anchors (.cta-button)
  c = c.replace(
    /<a\b([^>]*?class=["'][^"']*cta-button[^"']*["'][^>]*?)href=["'][^"']*["']([^>]*)>((?:(?!<\/a>)[\s\S])*?)<\/a>/gi,
    (_full, pre: string, post: string, inner: string) => {
      return `<a href="${THANKYOU_URL}"${cleanAttrs(pre + ' ' + post)}>${inner}</a>`;
    }
  );

  // e) Standalone banner CTA images that are not yet wrapped in <a>
  c = c.replace(/(<a\b[^>]*>[\s\S]*?<\/a>)|(<img\b[^>]*?(?:legalitas|artikel-mid|cta-wa|artikel-cta|artikel_tengah|artikel_akhir|maklonkosmetik_artikel|dreamlab_maklonkosmetik)[^>]*?\/?>)/gi, (full, aTag, imgTag) => {
    if (aTag) return aTag;
    return `<a href="${THANKYOU_URL}" style="display:block;cursor:pointer;text-decoration:none;">${imgTag}</a>`;
  });

  // f) figcaption berisi teks broken thankyou → buang
  c = c.replace(/<figcaption>([\s\S]*?)<\/figcaption>/gi, (full, inner: string) =>
    /thankyoupage-google|thankyou-page/i.test(inner) ? '' : full
  );

  // g) Bersihkan accidental nested anchors
  c = c.replace(/<a\b[^>]*href=["']([^"']*)["'][^>]*>\s*<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>\s*<\/a>/gi, (_full, _h1, h2, inner) => {
    return `<a href="${h2 || THANKYOU_URL}">${inner}</a>`;
  });

  return c;
}

function cleanAttrs(...parts: string[]): string {
  const joined = parts
    .join(' ')
    .replace(/\s*href="[^"]*"/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  return joined ? ' ' + joined : '';
}

/* ------------------------------------------------------------------ *
 * 7. FAQ: details → .article-faq + judul bila >=2                     *
 * ------------------------------------------------------------------ */
function processFaq(html: string): string {
  let c = html;
  const count = (c.match(/<details\b/gi) || []).length;
  if (count === 0) return c;

  // 7a. Class details → article-faq + buang style
  c = c.replace(/<details\b([^>]*)>/gi, (_m, attrs: string) => {
    let styleless = attrs.replace(/\s*style="[^"]*"/gi, '').trim();
    if (/class="[^"]*article-faq/.test(styleless)) {
      return `<details ${styleless.replace(/class="([^"]*)"/i, 'class="article-faq $1"')}>`;
    }
    return `<details class="article-faq"${styleless ? ' ' + styleless : ''}>`;
  });

  // 7b. summary buang style + span "+"
  c = c.replace(/<summary\b[^>]*>/gi, '<summary>');
  c = c.replace(/<summary>\s*<span[^>]*>\s*\+\s*<\/span>/gi, '<summary>');

  // 7c. judul bila FAQ >=2 tanpa heading sebelumnya
  const nFaq = (c.match(/<details class="article-faq"/g) || []).length;
  if (nFaq >= 2) {
    const firstFaq = c.indexOf('<details');
    if (firstFaq !== -1) {
      const before = c.slice(0, firstFaq);
      const prevHeading = /<h[23]\b[^>]*>[\s\S]*?<\/h[23]>\s*$/i.test(before);
      if (!prevHeading) {
        c =
          before +
          `<h2 id="pertanyaan-yang-sering-diajukan" class="article-h2">Pertanyaan yang Sering Diajukan</h2>` +
          c.slice(firstFaq);
      }
    }
  }
  return c;
}

/* ------------------------------------------------------------------ *
 * 8. Mikro clean: double br + emoji + whitespace                      *
 * ------------------------------------------------------------------ */
function microCleanup(html: string): string {
  return html
    .replace(/<br\b[^>]*\/?>\s*<br\b[^>]*\/?>/gi, '<br>')
    .replace(/<br\b[^>]*\/?>/gi, '<br>')
    .replace(EMOJI_RE, '')
    .replace(/\s{3,}/g, ' ')
    .trim();
}

/* ------------------------------------------------------------------ *
 * ENTRANCE                                                            *
 * ------------------------------------------------------------------ */
export function processArticleContent(htmlContent: string): string {
  let c = htmlContent;

  c = c.replace(/\u00a0/g, ' ').replace(/&#xa0;/g, ' ').replace(/&nbsp;/g, ' ');

  // 1. Path & attribute legacy
  c = renameLegacyPaths(c);

  // 2. Buang legacy ToC + wrapper kosong
  c = removeLegacyTocs(c);

  // 3. Heading ID/slug + Daftar Isi otomatis
  const { html: headed, headings } = processHeadings(c);
  c = injectToc(headed, buildToc(headings));

  // 4. CTA
  c = injectAutoCta(absorbInlineCtas(c));

  // 5. Paragraf kosong
  c = cleanEmptyParagraphs(c);

  // 6. Anchor & gambar thankyou
  c = rewriteAnchorsAndImages(c);

  // 7. FAQ
  c = processFaq(c);

  // 8. Mikro-clean
  return microCleanup(c);
}