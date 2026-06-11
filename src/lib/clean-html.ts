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
