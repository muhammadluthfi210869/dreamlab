function normalizeSectionKey(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#xa0;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#x201[2349];/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function dedupeHeadingSections(html: string): string {
  const headingRegex = /<h([2-4])[^>]*>[\s\S]*?<\/h\1>/gi;
  const matches = Array.from(html.matchAll(headingRegex));

  if (matches.length < 2) {
    return html;
  }

  const intro = html.slice(0, matches[0].index ?? 0);
  const seen = new Set<string>();
  const sections: string[] = [];

  for (let i = 0; i < matches.length; i += 1) {
    const start = matches[i].index ?? 0;
    const end = i + 1 < matches.length ? (matches[i + 1].index ?? html.length) : html.length;
    const sectionHtml = html.slice(start, end).trim();
    const key = normalizeSectionKey(sectionHtml);

    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    sections.push(sectionHtml);
  }

  return `${intro}${sections.join('\n\n')}`;
}

export function cleanWordPressHtml(html: string): string {
  let c = html;

  // 1. Strip ez-toc containers entirely
  c = c.replace(/<div\s+id="ez-toc-container[^>]*>[\s\S]*?<\/nav>\s*<\/div>\s*<\/div>/g, '');

  // 2. Remove WordPress UI inline SVGs within ez-toc
  c = c.replace(/<svg[^>]*class="[^"]*(?:list-377408|arrow-unsorted|ez-toc-icon)[^"]*"[^>]*>[\s\S]*?<\/svg>/g, '');

  // 3. Remove ez-toc title toggle
  c = c.replace(/<span\s+class="ez-toc-title-toggle[^>]*>[\s\S]*?<\/span>/g, '');

  // 4. Strip elementor/ez-toc class values
  c = c.replace(/\s+class="[^"]*\belementor[^"]*"/gi, '');
  c = c.replace(/\s+class="[^"]*\bez-toc[^"]*"/gi, '');
  c = c.replace(/\s+data-id="[^"]*"/gi, '');
  c = c.replace(/\s+data-element_type="[^"]*"/gi, '');
  c = c.replace(/\s+data-e-type="[^"]*"/gi, '');
  c = c.replace(/\s+data-widget_type="[^"]*"/gi, '');

  // 5. Remove empty wrapper divs/p
  c = c.replace(/<div>\s*<\/div>/g, '');
  c = c.replace(/<p>\s*<\/p>/g, '');
  c = c.replace(/<h[1-6][^>]*>\s*(?:<span[^>]*><\/span>\s*)*<\/h[1-6]>/gi, '');

  // 5b. Normalize legacy internal URLs before HTML reaches crawlers
  c = c.replace(/https?:\/\/www\.dreamlab\.id/gi, 'https://dreamlab.id');
  c = c.replace(/https?:\/\/dreamlab\.id\/thankyoupage-google\/?/gi, '/thankyou/google/');
  c = c.replace(/https?:\/\/dreamlab\.id\/thankyou-page\/?/gi, '/thankyou/google/');
  c = c.replace(/https?:\/\/dreamlab\.id\/thank-you-maklon\/?/gi, '/thankyou/google/');
  c = c.replace(/https?:\/\/dreamlab\.id\/contact-us\/?/gi, '/contact-us/');

  // 5c. Remove exact repeated heading sections from legacy imports.
  c = dedupeHeadingSections(c);

  // 6. Normalize whitespace
  c = c.replace(/\n{3,}/g, '\n\n');
  c = c.replace(/\s{2,}/g, ' ');

  // 7. Unescape common HTML entities
  c = c.replace(/&#x2014;/g, '--');
  c = c.replace(/&#x2013;/g, '-');
  c = c.replace(/&#x2019;/g, "'");
  c = c.replace(/&#x201c;/g, '"');
  c = c.replace(/&#x201d;/g, '"');
  c = c.replace(/&#x2026;/g, '...');

  return c.trim();
}
