import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (stat.isFile() && /\.(ts|tsx|js|jsx|json)$/.test(file)) {
      callback(filePath);
    }
  }
}

console.log('🔍 Scanning src/ directory for legacy assets/produk paths...\n');

let matchCount = 0;
walkDir(SRC_DIR, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = /assets\/produk|public\/assets\/produk/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    matchCount++;
    const lineNum = content.substring(0, match.index).split('\n').length;
    console.log(`Match found in ${filePath.replace(process.cwd(), '')} at line ${lineNum}:`);
    const line = content.split('\n')[lineNum - 1].trim();
    console.log(`  > ${line}\n`);
  }
});

console.log(`Scan completed. Total matches: ${matchCount}`);
