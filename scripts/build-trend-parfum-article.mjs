import { readFileSync, writeFileSync } from 'fs';

const markdown = readFileSync(
  '/Users/revitayustianawati/Library/Application Support/Claude/local-agent-mode-sessions/e074311c-ce6c-431d-a9e0-ef7cc01363c6/33ec7346-b43d-462e-8cfd-b335c83f5995/local_6da874a8-1759-4ebe-84e4-b9e55b906d63/outputs/2-trend-aroma-parfum-disukai-market.md',
  'utf8'
);

// Split front matter from body
const parts = markdown.split('\n\n---\n\n');
const frontMatter = parts[0];
const body = parts[1];

// Remove trailing sections after --- (Internal Link, Sumber, FAQPage Schema)
let contentBody = body;
const endMarker = '\n\n---\n\n## FAQPage JSON-LD Schema';
const endIdx = contentBody.indexOf(endMarker);
if (endIdx !== -1) {
  contentBody = contentBody.substring(0, endIdx);
}
// Also remove "Internal Link Suggestions" and "Sumber" sections
contentBody = contentBody.replace(/\n\n## Internal Link Suggestions[\s\S]*$/, '');
contentBody = contentBody.replace(/\n\n## Sumber[\s\S]*$/, '');

// Parse front matter for title
const lines = markdown.split('\n');
let metaTitle = '';
let metaDesc = '';
let slug = '';
for (const line of lines) {
  if (line.startsWith('Meta Title: ')) metaTitle = line.slice('Meta Title: '.length).trim();
  if (line.startsWith('Meta Description: ')) metaDesc = line.slice('Meta Description: '.length).trim();
  if (line.startsWith('Slug: ')) slug = line.slice('Slug: '.length).trim();
}

// Extract H1
const h1Match = contentBody.match(/^# (.+)$/m);
const h1 = h1Match ? h1Match[1].trim() : '';

// Function to escape for TS double-quoted string
function esc(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

// Build HTML content
let html = '<div class="elementor-element elementor-element-4cdeffb8 elementor-widget elementor-widget-theme-post-content">\n';

// Process body: split by sections
const sectionRegex = /^## (.+)$/gm;
let lastIdx = 0;
let match;
const sections = [];

while ((match = sectionRegex.exec(contentBody)) !== null) {
  if (match.index > 0) {
    const prevContent = contentBody.substring(lastIdx, match.index).trim();
    if (prevContent) sections.push({ type: 'text', content: prevContent });
  }
  const sectionStart = match.index;
  const sectionTitle = match[1].trim();
  const nextSectionEnd = contentBody.indexOf('\n## ', sectionStart + match[0].length);
  const sectionContent = nextSectionEnd === -1 
    ? contentBody.substring(sectionStart + match[0].length).trim()
    : contentBody.substring(sectionStart + match[0].length, nextSectionEnd).trim();
  
  sections.push({ type: 'heading', title: sectionTitle, content: sectionContent });
  lastIdx = sectionStart + match[0].length;
}

// Append any remaining text after last heading
const remaining = contentBody.substring(lastIdx).trim();
if (remaining) sections.push({ type: 'text', content: remaining });

function convertInlineMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#4a6fa5" target="_blank" rel="noopener">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function textToParagraphs(text) {
  // Split by double newlines (paragraphs)
  const paras = text.split(/\n\n+/);
  return paras
    .filter(p => p.trim())
    .map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('<blockquote') || trimmed.startsWith('<figure') || 
          trimmed.startsWith('<div') || trimmed.startsWith('<details') ||
          trimmed.startsWith('<nav') || trimmed.startsWith('<table') ||
          trimmed.startsWith('<script') || trimmed.startsWith('<h2') ||
          trimmed.startsWith('<h3')) {
        return trimmed;
      }
      // Check if it's a list
      if (trimmed.match(/^[\d]+\.\s/m)) {
        // Numbered list
        const items = trimmed.split('\n').filter(l => l.trim());
        const lis = items.map(item => {
          const clean = item.replace(/^\d+\.\s+/, '');
          return `<li>${convertInlineMarkdown(clean)}</li>`;
        }).join('');
        return `<ol>${lis}</ol>`;
      }
      if (trimmed.match(/^- /m)) {
        // Bullet list
        const items = trimmed.split('\n').filter(l => l.trim());
        const lis = items.map(item => {
          const clean = item.replace(/^- /, '');
          return `<li>${convertInlineMarkdown(clean)}</li>`;
        }).join('');
        return `<ul class="wp-block-list">${lis}</ul>`;
      }
      // Check for table
      if (trimmed.startsWith('|')) {
        const rows = trimmed.split('\n').filter(l => l.trim());
        const headerRow = rows[0];
        const headerCells = headerRow.split('|').filter(c => c.trim()).map(c => convertInlineMarkdown(c.trim()));
        let tHead = `<thead><tr>${headerCells.map(c => `<th>${c}</th>`).join('')}</tr></thead>`;
        let tBody = '';
        for (let i = 2; i < rows.length; i++) {
          const cells = rows[i].split('|').filter(c => c.trim()).map(c => convertInlineMarkdown(c.trim()));
          tBody += `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
        }
        return `<div class="article-table-wrap"><table class="article-comparison-table"><thead>${tHead}</thead><tbody>${tBody}</tbody></table></div>`;
      }
      return `<p>${convertInlineMarkdown(trimmed)}</p>`;
    })
    .join('\n');
}

function processSectionContent(content) {
  // Process Instagram embed
  if (content.includes('<blockquote class="instagram-media"')) {
    const instaMatch = content.match(/<blockquote[\s\S]*?<\/blockquote>\s*<script[\s\S]*?<\/script>/);
    if (instaMatch) {
      return '<div class="instagram-embed-wrapper">\n' + instaMatch[0] +
             '\n<p style="font-size:13px;color:#666;margin-top:8px;text-align:center">Lihat postingan asli di <a href="https://www.instagram.com/p/DbNaHubSc4f/?hl=en" target="_blank" rel="noopener" style="color:#4a6fa5">Instagram @dreamlab_official</a></p>\n</div>';
    }
  }
  return textToParagraphs(content);
}

for (const section of sections) {
  if (section.type === 'text') {
    // Check if it contains the Instagram embed
    if (section.content.includes('<blockquote')) {
      const instaStart = section.content.indexOf('<blockquote');
      const parts = [
        textToParagraphs(section.content.substring(0, instaStart).trim()),
        processSectionContent(section.content.substring(instaStart))
      ];
      html += '\n' + parts.filter(p => p).join('\n') + '\n';
    } else {
      html += '\n' + textToParagraphs(section.content) + '\n';
    }
  } else if (section.type === 'heading') {
    const id = section.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    // Special handling for FAQ section
    if (section.title === 'Pertanyaan yang Sering Diajukan') {
      html += `\n<h2 id="${id}">${section.title}</h2>\n`;
      // Parse FAQ items from content
      const faqItems = section.content.split('\n\n').filter(b => b.trim());
      for (const item of faqItems) {
        const qMatch = item.match(/^\*\*(.+?)\*\*$/m);
        if (qMatch) {
          const question = qMatch[1];
          const answer = item.replace(/^\*\*.+?\*\*\s*/, '').trim();
          html += `<details class="article-faq">\n<summary>${question}</summary>\n<p>${convertInlineMarkdown(answer)}</p>\n</details>\n`;
        } else {
          // Try parsing as Q: ... A: ... pattern
          const lines2 = item.split('\n').filter(l => l.trim());
          if (lines2.length >= 2) {
            const question = lines2[0].replace(/^\*\*(.+?)\*\*$/, '$1').trim();
            const answer = lines2.slice(1).join(' ').trim();
            if (question && answer) {
              html += `<details class="article-faq">\n<summary>${question}</summary>\n<p>${convertInlineMarkdown(answer)}</p>\n</details>\n`;
            }
          }
        }
      }
    } else {
      html += `\n<h2 id="${id}">${section.title}</h2>\n`;
      html += processSectionContent(section.content) + '\n';
    }
  }
}

// CTA section
html += `
<div style="text-align:center;margin:48px 0;padding:40px 24px;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:16px">
<h3 style="color:#ffffff;font-size:24px;font-weight:800;margin:0 0 12px 0">Konsultasikan Konsep Aroma Parfum Brand Kamu</h3>
<p style="color:rgba(255,255,255,0.85);font-size:16px;max-width:600px;margin:0 auto 28px auto">Tahu tren aromanya adalah langkah awal — meraciknya jadi formula yang benar-benar sesuai karakter brand kamu adalah langkah berikutnya. Kamu bisa mulai dengan konsultasi gratis bersama tim Dreamlab maklon kosmetik untuk konsep parfum dan dapatkan sampelnya.</p>
<a href="/thankyou/google/" style="display:inline-block;background:#D98A00;color:#ffffff;padding:16px 40px;border-radius:50px;font-weight:800;font-size:18px;text-decoration:none;box-shadow:0 8px 24px rgba(217,138,0,0.35);transition:all 0.3s ease">Konsultasi Gratis Sekarang</a>
<p style="color:rgba(255,255,255,0.65);font-size:13px;margin-top:16px">Diskusikan HPP, formula, dan strategi brand parfum-mu tanpa komitmen awal.</p>
</div>`;

html += '\n\t\t\t\t</div>';

// Build the complete article entry
const entry = {
  slug: '/trend-aroma-parfum-disukai-market-2026',
  title: '2 Trend Aroma Parfum yang Disukai Market Sekarang',
  publishDate: '2026-07-26T00:00:00+00:00',
  author: 'Dreamlab Maklon Kosmetik',
  categories: ['Maklon Parfum'],
  tags: ['Maklon Parfum', 'Trend Aroma', 'Custom Parfum', '2026'],
  featuredImage: 'Trend_parfum_2026_Gourmand.png',
  excerpt: 'Kenali 2 trend aroma parfum yang paling disukai market 2026 versi Dreamlab, sebelum kamu bikin brand parfum sendiri. Konsultasi gratis, cek di sini.',
  content: html,
  seo: {
    title: '2 Trend Aroma Parfum yang Disukai Market Sekarang',
    description: 'Kenali 2 trend aroma parfum yang paling disukai market 2026 versi Dreamlab, sebelum kamu bikin brand parfum sendiri. Konsultasi gratis, cek di sini.'
  }
};

// Let's output it as JSON first to see if it's valid
const jsonEntry = JSON.stringify(entry, null, 2);
writeFileSync('/Users/revitayustianawati/dreamlab/scripts/trend-parfum-output.json', jsonEntry);
console.log('Generated JSON output to scripts/trend-parfum-output.json');
console.log('Content length:', html.length);
