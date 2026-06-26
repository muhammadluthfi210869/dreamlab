import https from 'https';

const url = 'https://www.dreamlab.id/biaya-maklon-parfum-moq-kecil/';
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('=== PAGE SIZE BREAKDOWN ===');
    console.log('Total HTML size:', (d.length / 1024).toFixed(0) + 'KB');
    
    // Script tags size
    const scriptRe = /<script[\s\S]*?<\/script>/g;
    let totalScript = 0;
    let scriptCount = 0;
    let m;
    while ((m = scriptRe.exec(d)) !== null) {
      totalScript += m[0].length;
      scriptCount++;
    }
    console.log('Scripts (' + scriptCount + '):', (totalScript / 1024).toFixed(0) + 'KB');

    // Style tags
    const styleRe = /<style[\s\S]*?<\/style>/g;
    let totalStyle = 0;
    let styleCount = 0;
    while ((m = styleRe.exec(d)) !== null) {
      totalStyle += m[0].length;
      styleCount++;
    }
    console.log('Styles (' + styleCount + '):', (totalStyle / 1024).toFixed(0) + 'KB');

    // JSON-LD blocks
    const jsonRe = /<script type="application\/ld\+json"[\s\S]*?<\/script>/g;
    let totalJson = 0;
    let jsonCount = 0;
    while ((m = jsonRe.exec(d)) !== null) {
      totalJson += m[0].length;
      jsonCount++;
    }
    console.log('JSON-LD (' + jsonCount + '):', (totalJson / 1024).toFixed(0) + 'KB');

    // Inline images (base64)
    const base64Re = /data:image[^"']+/g;
    let totalB64 = 0;
    let b64Count = 0;
    while ((m = base64Re.exec(d)) !== null) {
      totalB64 += m[0].length;
      b64Count++;
    }
    console.log('Base64 images (' + b64Count + '):', (totalB64 / 1024).toFixed(0) + 'KB');

    // Check for hidden content (display:none)
    const hiddenRe = /display\s*:\s*none/gi;
    let hiddenCount = 0;
    while ((m = hiddenRe.exec(d)) !== null) hiddenCount++;
    console.log('Elements with display:none:', hiddenCount);

    // Check for duplicate content
    const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log('Total text length:', (text.length / 1024).toFixed(0) + 'KB');
    
    // Check text vs HTML ratio
    const textRatio = (text.length / d.length * 100).toFixed(1);
    console.log('Text-to-HTML ratio:', textRatio + '%');

    // Check for duplicate paragraphs
    const lines = text.split('. ');
    console.log('Total sentences:', lines.length);
    
    // Check body content
    const bodyMatch = d.match(/<body[\s\S]*?<\/body>/i);
    if (bodyMatch) {
      console.log('Body size:', (bodyMatch[0].length / 1024).toFixed(0) + 'KB');
    }

    // Check if there's a large article body
    const innerHtmlRe = /innerHTML\s*=/gi;
    let innerHtmlCount = 0;
    while ((m = innerHtmlRe.exec(d)) !== null) innerHtmlCount++;
    console.log('innerHTML assignments:', innerHtmlCount);
    
    // Check largest chunk - maybe next.js hydration data?
    const nextDataRe = /__NEXT_DATA__/g;
    if (nextDataRe.test(d)) {
      const nextMatch = d.match(/<script[^>]*>[\s\S]*?__NEXT_DATA__[\s\S]*?<\/script>/);
      if (nextMatch) {
        console.log('__NEXT_DATA__ size:', (nextMatch[0].length / 1024).toFixed(0) + 'KB');
      }
    }
  });
});
