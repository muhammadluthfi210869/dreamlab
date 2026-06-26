import https from 'https';

const url = 'https://www.dreamlab.id/biaya-maklon-parfum-moq-kecil/';
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // Remove ALL scripts and styles (including their content)
    let clean = d
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      // Remove all HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Remove extra whitespace
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    console.log('=== ACTUAL RENDERED TEXT ===');
    console.log('Total text length:', clean.length, 'chars');
    const words = clean.split(/\s+/).filter(w => w.length > 0);
    console.log('Word count:', words.length);
    
    // Check for minimum content
    console.log('\nIs content sufficient for indexing?');
    if (words.length < 300) console.log('🔴 Sangat tipis (<300 kata)');
    else if (words.length < 800) console.log('🟡 Cukup tapi masih tipis (300-800 kata)');
    else if (words.length < 1500) console.log('🟢 Lumayan (800-1500 kata)');
    else console.log('✅ Sangat cukup (>1500 kata)');

    // Show first 100 words
    console.log('\nFirst 150 chars:', clean.substring(0, 150));
    
    // Now check ARTICLE content specifically - find the article body
    // Look for rich text content with paragraph tags
    const articleMatch = d.match(/<div[^>]*class="[^"]*article-content[^"]*"[^>]*>[\s\S]*?<\/div>/i) 
      || d.match(/<article[\s\S]*?<\/article>/i)
      || d.match(/class="[^"]*post-content[^"]*"/i);
    console.log('\nArticle content container found:', articleMatch ? 'YES' : 'NO');
    if (articleMatch) {
      const articleHtml = articleMatch[0];
      const articleText = articleHtml
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const articleWords = articleText.split(/\s+/).filter(w => w.length > 0);
      console.log('Article container word count:', articleWords.length);
      console.log('Article container text preview:', articleText.substring(0, 200));
    }
  });
});
