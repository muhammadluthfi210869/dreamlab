/**
 * Update code references after image rename
 * Reads image-rename-mapping.json and updates all source files
 * Usage: node scripts/update-image-refs.mjs --dry-run   (preview)
 *        node scripts/update-image-refs.mjs --execute     (apply)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');

const DRY_RUN = process.argv.includes('--dry-run');
const EXECUTE = process.argv.includes('--execute');

if (!DRY_RUN && !EXECUTE) {
  console.log('Usage: node scripts/update-image-refs.mjs [--dry-run|--execute]');
  process.exit(0);
}

// Load mapping
const mapping = JSON.parse(readFileSync(join(ROOT, 'image-rename-mapping.json'), 'utf-8'));
const entries = Object.entries(mapping);

// Build replacement map: old path patterns → new path
const replacements = [];
for (const [oldRaw, newRaw] of entries) {
  const oldBase = oldRaw.split('/').pop();
  const newBase = newRaw.split('/').pop();
  
  // Skip if base name didn't change (extension-only changes for assets/images/ and assets/produk/)
  // We only want to rename files that actually changed their names
  if (oldBase.toLowerCase().replace(/\.\w+$/, '') === newBase.toLowerCase().replace(/\.\w+$/, '')) {
    // Only replace if extension changed to .webp
    if (newBase.endsWith('.webp') && !oldBase.endsWith('.webp')) {
      replacements.push({ oldPattern: oldBase, newPattern: newBase, oldPath: oldRaw, newPath: newRaw, extensionOnly: true });
    }
    continue;
  }
  
  replacements.push({ oldPattern: oldBase, newPattern: newBase, oldPath: oldRaw, newPath: newRaw, extensionOnly: false });
}

// Also add extension-only replacements for files not in the mapping (direct .jpg/.png → .webp)
// Check for common extension patterns used in code

console.log(`Total replacements to apply: ${replacements.length}`);
console.log(`  Name changes: ${replacements.filter(r => !r.extensionOnly).length}`);
console.log(`  Extension only: ${replacements.filter(r => r.extensionOnly).length}\n`);

// Walk all source files
function findAllSourceFiles(dir) {
  const files = [];
  function walk(d) {
    try {
      const entries = readdirSync(d, { withFileTypes: true });
      for (const e of entries) {
        const p = join(d, e.name);
        if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
          walk(p);
        } else if (e.isFile() && ['.ts', '.tsx'].includes(extname(e.name))) {
          files.push(p);
        }
      }
    } catch {}
  }
  walk(dir);
  return files;
}

const srcFiles = findAllSourceFiles(SRC);
console.log(`Source files to scan: ${srcFiles.length}\n`);

let totalChanges = 0;
const changesPerFile = {};

for (const filePath of srcFiles) {
  let content = readFileSync(filePath, 'utf-8');
  let fileChanges = 0;
  let fileContent = content;
  
  for (const { oldPattern, newPattern, extensionOnly } of replacements) {
    if (!content.includes(oldPattern)) continue;
    
    // For the replace, be smart about it:
    // - Replace full filename occurrences (not partial matches)
    const regex = new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const before = content;
    content = content.replace(regex, newPattern);
    const matchCount = (before.match(regex) || []).length;
    if (matchCount > 0) {
      fileChanges += matchCount;
    }
  }
  
  if (fileChanges > 0) {
    changesPerFile[filePath] = fileChanges;
    totalChanges += fileChanges;
    
    if (EXECUTE) {
      writeFileSync(filePath, content, 'utf-8');
    }
    console.log(`  ${DRY_RUN ? '[PREVIEW]' : '[UPDATED]'} ${filePath.replace(ROOT, '').replace(/\\/g, '/')}: ${fileChanges} changes`);
  }
}

console.log(`\nTotal: ${totalChanges} changes across ${Object.keys(changesPerFile).length} files`);

if (DRY_RUN) {
  console.log('\nRun with --execute to apply changes.');
}
