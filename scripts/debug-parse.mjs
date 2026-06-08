import { readFileSync, writeFileSync } from "fs";

const content = readFileSync("src/data/maklon-faq.ts", "utf-8");
const lines = content.split(/\r?\n/);

const pathMap = {};
let currentPath = null;
let currentQAs = [];

for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim();
  
  // Match path keys:   "/maklon-skincare/": [
  if (trimmed.startsWith('"') && trimmed.endsWith('": [')) {
    const m = trimmed.match(/^"(\/[^"]+\/)":\s*\[\s*$/);
    if (m) {
      currentPath = m[1];
      currentQAs = [];
      continue;
    }
  }
  
  // End of array: "]," or just "]" (last item has no comma)
  if (currentPath && (trimmed === "]," || trimmed === "]")) {
    pathMap[currentPath] = currentQAs;
    currentPath = null;
    continue;
  }
  
  // QA line: { question: "...", answer: "..." },
  if (currentPath && trimmed.startsWith("{") && trimmed.includes('question:"') && trimmed.includes('answer:"')) {
    const qStart = trimmed.indexOf('question:"') + 10;
    const qEnd = trimmed.indexOf('"', qStart);
    const question = trimmed.substring(qStart, qEnd);
    
    const aStart = trimmed.indexOf('answer:"') + 8;
    // Find the closing quote - it's before " },"
    const aEndMarker = trimmed.lastIndexOf('"');
    const answer = trimmed.substring(aStart, aEndMarker);
    
    currentQAs.push({
      question: question.replace(/\\u2014/g, '\u2014').replace(/\\n/g, ' '),
      answer: answer.replace(/\\u2014/g, '\u2014').replace(/\\n/g, ' ')
    });
  }
  // Also try with space after colon
  else if (currentPath && trimmed.startsWith("{") && trimmed.includes('question: "') && trimmed.includes('answer: "')) {
    const qStart = trimmed.indexOf('question: "') + 11;
    const qEnd = trimmed.indexOf('"', qStart);
    const question = trimmed.substring(qStart, qEnd);
    
    const aStart = trimmed.indexOf('answer: "') + 9;
    const aEndMarker = trimmed.lastIndexOf('"');
    const answer = trimmed.substring(aStart, aEndMarker);
    
    currentQAs.push({
      question: question.replace(/\\u2014/g, '\u2014').replace(/\\n/g, ' '),
      answer: answer.replace(/\\u2014/g, '\u2014').replace(/\\n/g, ' ')
    });
  }
}

console.log("Total categories:", Object.keys(pathMap).length);
for (const [path, qas] of Object.entries(pathMap)) {
  console.log(`  ${path}: ${qas.length} QA`);
}
