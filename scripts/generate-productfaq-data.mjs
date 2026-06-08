import { readFileSync, writeFileSync } from "fs";

const content = readFileSync("src/data/maklon-faq.ts", "utf-8");
const lines = content.split(/\r?\n/);

const pathMap = {};
let currentPath = null;
let currentQAs = [];

for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim();
  
  if (trimmed.startsWith('"') && trimmed.endsWith('": [')) {
    const m = trimmed.match(/^"(\/[^"]+\/)":\s*\[\s*$/);
    if (m) {
      currentPath = m[1];
      currentQAs = [];
      continue;
    }
  }
  
  if (currentPath && (trimmed === "]," || trimmed === "]")) {
    pathMap[currentPath] = currentQAs;
    currentPath = null;
    continue;
  }
  
  if (currentPath && trimmed.startsWith("{") && (trimmed.includes('question: "') || trimmed.includes('question:"'))) {
    const hasSpace = trimmed.includes('question: "');
    const qStart = trimmed.indexOf(hasSpace ? 'question: "' : 'question:"') + (hasSpace ? 11 : 10);
    const qEnd = trimmed.indexOf('"', qStart);
    const question = trimmed.substring(qStart, qEnd);
    
    const aStart = trimmed.indexOf(hasSpace ? 'answer: "' : 'answer:"') + (hasSpace ? 9 : 8);
    const aEndMarker = trimmed.lastIndexOf('"');
    const answer = trimmed.substring(aStart, aEndMarker);
    
    currentQAs.push({
      question: question.replace(/\\u2014/g, '\u2014').replace(/\\n/g, ' '),
      answer: answer.replace(/\\u2014/g, '\u2014').replace(/\\n/g, ' ')
    });
  }
}

function pathToKey(path) {
  const parts = path.replace(/^\/|\/$/g, "").split("/");

  const mainCatMap = {
    "maklon-skincare": "skincare",
    "maklon-body-care": "bodycare",
    "maklon-baby-care": "babycare",
    "maklon-foot-care": "footcare",
    "maklon-hair-care": "haircare",
    "maklon-parfum": "parfum",
    "maklon-decorative": "decorative",
  };

  if (parts.length === 1) {
    return mainCatMap[parts[0]] || parts[0];
  }

  const category = mainCatMap[parts[0]] || parts[0];
  const rest = parts.slice(1).join("/");
  
  const slugMap = {
    "day-night-cream": "day-night-cream",
    "masker-wajah": "face-mask",
    "sunscreen": "sunscreen",
    "cleansing-series": "cleansing",
    "facial-wash": "facial-wash",
    "facial-toner": "facial-toner",
    "serum-wajah": "facial-serum",
    "massage-oil": "massage-oil",
    "body-butter": "body-butter",
    "body-scrub": "body-scrub",
    "sabun-antibakteri": "anti-bacterial-soap",
    "shower-gel": "shower-gel",
    "bath-salt": "bath-salt",
    "sabun-organik": "organic-soap",
    "body-serum": "body-serum",
    "sabun-transparan": "transparent-soap",
    "underarm-cream": "underarm-cream",
    "sabun-whitening": "whitening-soap",
    "sabun-batang": "bar-soap",
    "massage-cream": "massage-cream",
    "soothing-gel": "soothing-gel",
    "neck-cream": "neck-cream",
    "baby-2in1-wash": "baby-2in1-wash",
    "foot-cream": "foot-cream",
    "foot-scrub": "foot-scrub",
    "foot-spray": "foot-spray",
    "foot-soak": "foot-soak",
    "foot-serum": "foot-serum",
    "shampoo": "shampoo",
    "hair-conditioner": "hair-conditioner",
    "hair-mask": "hair-mask",
    "hair-tonic": "hair-tonic",
    "hair-gel": "hair-gel",
    "pomade": "pomade",
    "scalp-care": "scalp-care",
    "beard-serum": "beard-serum",
    "body-mist": "body-mist",
    "eau-de-cologne": "eau-de-cologne",
    "eau-de-parfum": "eau-de-parfum",
    "eau-de-toilette": "eau-de-toilette",
    "extrait-de-parfum": "extrait-de-parfum",
    "minyak-atsiri": "minyak-atsiri",
    "lip-care": "lip-care",
    "lip-care/lip-cream": "lip-cream",
    "lip-care/lip-matte": "lip-matte",
    "lip-care/lip-balm": "lip-balm",
    "lip-care/tinted-lip-balm": "tinted-lip-balm",
    "lip-care/lip-gloss": "lip-gloss",
    "lip-care/lip-serum": "lip-serum",
    "lip-care/lip-scrub": "lip-scrub",
    "lip-care/lip-blush": "lip-blush",
    "makeup/foundation": "foundation",
    "makeup/bb-cream": "bb-cream",
    "makeup/face-primer": "face-primer",
    "makeup/foundation-serum": "foundation-serum",
    "makeup/highlighter": "highlighter",
    "makeup/mascara": "mascara",
    "makeup/cream-blush": "cream-blush",
    "makeup/liquid-blush": "liquid-blush",
    "makeup/eyebrow-gel": "eyebrow-gel",
  };

  const mappedSlug = slugMap[rest] || rest.replace(/\//g, "-");
  return `${category}-${mappedSlug}`;
}

// Generate output
let output = "  const categoryFaqs: Record<string, { question: string; answer: string; }[]> = {";

const sortedPaths = Object.keys(pathMap).sort((a, b) => {
  const aParts = a.replace(/^\/|\/$/g, "").split("/");
  const bParts = b.replace(/^\/|\/$/g, "").split("/");
  if (aParts.length !== bParts.length) return aParts.length - bParts.length;
  return a.localeCompare(b);
});

for (const path of sortedPaths) {
  const key = pathToKey(path);
  const qas = pathMap[path];
  
  if (path.match(/^\/maklon-(skincare|body-care|baby-care|foot-care|hair-care|parfum|decorative)\/$/)) {
    const catName = path.replace(/^\/|\/$/g, "").replace(/^maklon-/, "").replace(/-/g, " ").toUpperCase();
    output += `\n\n  // ─── ${catName} ───`;
  }
  
  output += `\n  "${key}": [\n`;
  for (const qa of qas) {
    output += `    {\n      question: "${qa.question}",\n      answer: "${qa.answer}"\n    },\n`;
  }
  output += `  ],`;
}

output += "\n};";

writeFileSync("scripts/output/productfaq-data.txt", output);
console.log("Output written to scripts/output/productfaq-data.txt");
console.log("Total categories:", Object.keys(pathMap).length);
