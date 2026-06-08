import { readFileSync } from "fs";

const content = readFileSync("src/data/maklon-faq.ts", "utf-8");

// Check for actual typos - standalone 'aklon' not inside 'maklon'
const lines = content.split(/\r?\n/);
const aklonLines = lines.filter(l => {
  const afterQuote = l.indexOf('answer: "');
  if (afterQuote < 0) return false;
  const answerPart = l.substring(afterQuote + 9);
  // Check if the answer starts with lowercase 'aklon' (not 'Maklon')
  return answerPart.startsWith('aklon');
});
console.log('Lines with lowercase aklon:', aklonLines.length);

// Check other issues
console.log('Has 3  bulan:', content.includes('3  bulan'));
console.log('Has WhatsAppuntuk:', content.includes('WhatsAppuntuk'));
console.log('Has extracted newlines:', content.includes('\\n'));
console.log('Has truncated konsul:', content.includes('"konsul"'));

// Count paths with /maklon- pattern
const paths = content.match(/"[^"]*maklon[^"]*":\s*\[/g);
console.log('Categories:', paths ? paths.length : 0);
