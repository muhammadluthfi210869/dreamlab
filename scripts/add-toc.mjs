import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/article-overrides.ts';
const src = readFileSync(filePath, 'utf8');

const marker = '/trend-aroma-parfum-disukai-market-2026';
const es = src.indexOf(marker);
const ck = src.indexOf('content: "', es);
const cs = src.indexOf('"<div', ck);
const ce = src.indexOf('",\n    faqs:', cs);
const raw = src.slice(cs, ce + 1);
const content = JSON.parse(raw);

// Get H2s for ToC
const h2Regex = /<h2[^>]*>[\s\S]*?<\/h2>/g;
const h2s = content.match(h2Regex);

const tocLinks = h2s.map(h2 => {
  const id = h2.match(/id="([^"]+)"/)?.[1] || '';
  const text = h2.replace(/<[^>]*>/g, '').trim();
  return `<li><a href="#${id}" style="color:#4a6fa5">${text}</a></li>`;
}).join('\n');

const tocHtml = `
<nav style="background:#FFF9F0;border:1px solid #E8D5B7;border-radius:12px;padding:24px 32px;margin:32px 0">
<p style="font-weight:800;font-size:16px;margin:0 0 12px 0;color:#333">Daftar Isi</p>
<ol style="margin:0;padding-left:20px">
${tocLinks}
</ol>
</nav>
`;

// Insert ToC before the Instagram embed wrapper
const instagramDiv = '<div class="instagram-embed-wrapper">';
const newContent = content.replace(instagramDiv, tocHtml.trim() + '\n\n' + instagramDiv);

// Verify
const hasKenapa = newContent.includes('Kenapa Aroma');
const hasToC = newContent.includes('Daftar Isi');
const hasKeptFaq = newContent.includes('Apa saja langkah membuat parfum brand sendiri');
const hasNewH2 = newContent.includes('Rubah dari Ide ke Eksekusi');
const h2sAfter = newContent.match(/<h2[^>]*>[\s\S]*?<\/h2>/g);
const faqPos = newContent.indexOf('pertanyaan-yang-sering-diajukan');
const ctaPos = newContent.indexOf('konsultasikan-konsep-aroma-parfum-brand-kamu');

console.log('Has Kenapa Aroma:', hasKenapa);
console.log('Has ToC (Daftar Isi):', hasToC);
console.log('Has kept FAQ:', hasKeptFaq);
console.log('Has new H2:', hasNewH2);
console.log('H2 count:', h2sAfter?.length || 0);
console.log('FAQ after CTA?', faqPos > ctaPos);

// Write back
const escaped = JSON.stringify(newContent);
const inner = escaped.slice(1, -1);
const newSrc = src.slice(0, cs) + '"' + inner + '"' + src.slice(ce + 1);
writeFileSync(filePath, newSrc, 'utf8');
console.log('Done!');
