import https from 'https';

const URLS = [
  'https://www.dreamlab.id/biaya-maklon-parfum-moq-kecil/',
  'https://www.dreamlab.id/bisnis-skincare-glow-glasskin-cystamine/',
  'https://www.dreamlab.id/hero-ingredients-2025/',
  'https://www.dreamlab.id/maklon-shampoo-psoriasis-formula-juara/',
  'https://www.dreamlab.id/perbedaan-micellar-water-dan-toner/',
  'https://www.dreamlab.id/potensi-bisnis-babycare/',
  'https://www.dreamlab.id/produk-haircare-yang-sedang-tren/',
];

async function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

function extractMeta(html: string, tag: string, attr: string): string[] {
  const results: string[] = [];
  const regex = new RegExp(`<${tag}[^>]*${attr}=["']([^"']*)["']`, 'gi');
  let m;
  while ((m = regex.exec(html)) !== null) results.push(m[1]);
  return results;
}

async function main() {
  console.log('=== CRAWLED-NOT-INDEXED — CONTENT ANALYSIS ===\n');
  
  for (const url of URLS) {
    const html = await fetchHtml(url);
    
    // Extract info
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || '-';
    const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || 
                        html.match(/<meta name="description" content='([^']*)'/i)?.[1] || '-';
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = text.split(/\s+/).length;
    const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim() || '(no h1)';
    const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
    const schemaCount = (html.match(/application\/ld\+json/gi) || []).length;
    const images = (html.match(/<img[^>]+>/gi) || []).length;
    const links = (html.match(/<a\s+/gi) || []).length;
    const hasNoindex = html.includes('noindex');
    const robotsMeta = html.match(/<meta name="robots" content="([^"]*)"/i)?.[1] || 'index, follow';
    
    console.log(`📄 ${url.replace('https://www.dreamlab.id', '')}`);
    console.log(`   Title: ${title.substring(0, 80)}`);
    console.log(`   Word count: ${wordCount}`);
    console.log(`   H1: ${h1.substring(0, 60)}`);
    console.log(`   H2: ${h2Count} | H3: ${h3Count}`);
    console.log(`   Schema blocks: ${schemaCount}`);
    console.log(`   Images: ${images} | Links: ${links}`);
    console.log(`   Robots: ${robotsMeta}${hasNoindex ? ' ⚠️ CONTAINS NOINDEX' : ''}`);
    console.log(`   Meta desc: ${description.substring(0, 80)}...`);
    
    // Issues detection
    const issues: string[] = [];
    if (wordCount < 500) issues.push(`🔴 Konten terlalu tipis (${wordCount} kata, minimal 1000+)`);
    else if (wordCount < 1000) issues.push(`🟡 Konten agak tipis (${wordCount} kata, ideal 1500+)`);
    if (h2Count < 3) issues.push(`🟡 Hanya ${h2Count} heading (H2), minimal 4-5 untuk struktur`);
    if (!description || description.length < 50) issues.push('🟡 Meta description terlalu pendek');
    if (hasNoindex) issues.push('🔴 Ada noindex tag!');
    if (images < 2) issues.push('🟡 Kurang gambar');
    if (schemaCount === 0) issues.push('🟡 Tidak ada schema markup');
    
    if (issues.length > 0) {
      console.log(`   Issues:`);
      for (const issue of issues) console.log(`     ${issue}`);
    } else {
      console.log(`   ✅ No major issues detected`);
    }
    console.log('');
  }
}

main().catch(console.error);
