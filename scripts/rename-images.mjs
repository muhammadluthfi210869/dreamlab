/**
 * Batch Rename + WebP Conversion Script for Dreamlab Image Assets
 * 
 * Usage:
 *   node scripts/rename-images.mjs --dry-run    (preview changes only)
 *   node scripts/rename-images.mjs --backup      (execute with originals backed up)
 *   node scripts/rename-images.mjs --execute     (execute without backup)
 * 
 * Strategy (per directory):
 *   new asset/     — Full rename (spaces→kebab-case) + convert (.jpg/.png→.webp)
 *   assets/produk/ — Format convert only (.jpg/.jpeg→.webp, keep names)
 *   assets/images/ — Format convert only (.jpg/.png→.webp, keep names)
 * 
 * Preserves:
 *   - bg-lands-card*, bg-ports-card*, bg-landss-card*, bg-portss-card* (code references)
 *   - WordPress numeric-ID based names (used in blog HTML content)
 *   - _transparent.png → keeps .png extension for alpha channel
 */

import { readdirSync, statSync, renameSync, mkdirSync, copyFileSync, unlinkSync, existsSync, writeFileSync } from 'fs';
import { join, dirname, relative, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', 'public');

const DRY_RUN = process.argv.includes('--dry-run');
const BACKUP = process.argv.includes('--backup');
const EXECUTE = process.argv.includes('--execute');

if (!DRY_RUN && !BACKUP && !EXECUTE) {
  console.log('Usage: node scripts/rename-images.mjs [--dry-run|--backup|--execute]');
  process.exit(0);
}

function toKebabCase(str) {
  return str
    .replace(/&/g, '-and-')
    .replace(/\s*\(\d+\)\s*/g, '-')
    .replace(/[^a-zA-Z0-9\u00C0-\u024F\-]/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const isBgCardName = (name) => /^bg-(lands|ports?|landss|portss)-card\d+$/i.test(name);
const isWordPressId = (name) => /^\d+(-\d+)*(-\d+x\d+)?$/.test(name);
const isTransparent = (name) => name.toLowerCase().includes('_transparent');
const isSvg = (path) => path.toLowerCase().endsWith('.svg');

// ─── NEW ASSET rename rules (aggressive) ─────────────────────────────────────
function computeNewAssetName(oldPath) {
  const ext = extname(oldPath).toLowerCase();
  const base = basename(oldPath, ext);
  
  if (isSvg(oldPath)) {
    return `${toKebabCase(base)}.svg`;
  }
  
  if (isTransparent(base)) {
    const clean = base.replace(/_transparent$/i, '');
    return `${toKebabCase(clean)}-alpha.png`;
  }
  
  return `${toKebabCase(base)}.webp`;
}

// ─── PRODUK/IMAGES convert-only rules ────────────────────────────────────────
function computeConvertOnlyName(oldPath) {
  if (isSvg(oldPath)) return null;
  if (isBgCardName(basename(oldPath, extname(oldPath)))) return null;
  
  const ext = extname(oldPath).toLowerCase();
  if (ext === '.webp') return null;
  if (ext === '.svg') return null;
  
  const base = basename(oldPath, ext);
  if (isTransparent(base)) return null;
  
  const newExt = '.webp';
  return `${base}${newExt}`;
}

function findAllImageFiles(rootDir) {
  const files = [];
  const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
  
  function walk(dir) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!entry.name.startsWith('_') && !entry.name.startsWith('.')) {
            walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = extname(entry.name).toLowerCase();
          if (validExts.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (e) {
      console.error(`  Error reading ${dir}: ${e.message}`);
    }
  }
  
  walk(rootDir);
  return files;
}

const operations = [];

console.log('\n=== Dreamlab Image Rename/Convert Tool v2 ===\n');
console.log(`Mode: ${DRY_RUN ? 'DRY RUN (preview)' : (BACKUP ? 'EXECUTE + BACKUP' : 'EXECUTE')}`);
console.log(`Strategy: new asset/ = rename+convert | produk/ & images/ = convert only\n`);

// ─── NEW ASSET ──────────────────────────────────────────────────────────────
const newAssetDir = join(ROOT, 'new asset');
if (existsSync(newAssetDir)) {
  const files = findAllImageFiles(newAssetDir);
  console.log(`[new asset/] ${files.length} files`);
  let count = 0;
  for (const oldPath of files) {
    const newName = computeNewAssetName(oldPath);
    if (!newName) continue;
    const oldName = basename(oldPath);
    if (oldName === newName) continue;
    const newPath = join(dirname(oldPath), newName);
    count++;
    operations.push({ oldPath, newPath, oldName, newName, type: 'rename+convert', dir: 'new asset/' });
  }
  console.log(`  → ${count} files need rename+convert`);
}

// ─── PRODUK ─────────────────────────────────────────────────────────────────
const produkDir = join(ROOT, 'assets', 'produk');
if (existsSync(produkDir)) {
  const files = findAllImageFiles(produkDir);
  console.log(`[assets/produk/] ${files.length} files`);
  let count = 0;
  for (const oldPath of files) {
    const newName = computeConvertOnlyName(oldPath);
    if (!newName) continue;
    const oldName = basename(oldPath);
    if (oldName === newName) continue;
    const newPath = join(dirname(oldPath), newName);
    count++;
    operations.push({ oldPath, newPath, oldName, newName, type: 'convert-only', dir: 'assets/produk/' });
  }
  console.log(`  → ${count} files need format conversion`);
}

// ─── IMAGES ─────────────────────────────────────────────────────────────────
const imagesDir = join(ROOT, 'assets', 'images');
if (existsSync(imagesDir)) {
  const files = findAllImageFiles(imagesDir);
  console.log(`[assets/images/] ${files.length} files`);
  let count = 0;
  let skippedBg = 0;
  let skippedWp = 0;
  for (const oldPath of files) {
    const newName = computeConvertOnlyName(oldPath);
    if (!newName) {
      const base = basename(oldPath, extname(oldPath));
      if (isBgCardName(base)) skippedBg++;
      continue;
    }
    const oldName = basename(oldPath);
    if (oldName === newName) continue;
    const newPath = join(dirname(oldPath), newName);
    count++;
    operations.push({ oldPath, newPath, oldName, newName, type: 'convert-only', dir: 'assets/images/' });
  }
  console.log(`  → ${count} files need format conversion (${skippedBg} bg-card files preserved)`);
}

console.log(`\nTotal operations: ${operations.length}`);

if (DRY_RUN) {
  const byDir = {};
  for (const op of operations) {
    if (!byDir[op.dir]) byDir[op.dir] = [];
    byDir[op.dir].push(op);
  }
  
  for (const [dir, ops] of Object.entries(byDir)) {
    console.log(`\n─── ${dir} (${ops.length} changes) ───`);
    for (const op of ops.slice(0, 25)) {
      const flag = op.type === 'rename+convert' ? '[RENAME+CONVERT]' : '[CONVERT]';
      console.log(`  ${flag}  ${op.oldName}  →  ${op.newName}`);
    }
    if (ops.length > 25) {
      console.log(`  ... and ${ops.length - 25} more`);
    }
  }
  
  const mapping = {};
  for (const op of operations) {
    mapping[relative(ROOT, op.oldPath).replace(/\\/g, '/')] = relative(ROOT, op.newPath).replace(/\\/g, '/');
  }
  
  const mappingPath = join(__dirname, '..', 'image-rename-mapping.json');
  writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`\nMapping saved to image-rename-mapping.json`);
  console.log('Run with --backup or --execute to apply changes.');
  process.exit(0);
}

// ─── EXECUTION ──────────────────────────────────────────────────────────────
const backupRoot = join(ROOT, '_backup');
const mapping = {};
const errors = [];
let processed = 0;

for (const op of operations) {
  try {
    if (BACKUP) {
      const backupDir = join(backupRoot, relative(ROOT, dirname(op.oldPath)));
      mkdirSync(backupDir, { recursive: true });
      copyFileSync(op.oldPath, join(backupDir, op.oldName));
    }
    
    const isConversion = op.type === 'rename+convert' || op.type === 'convert-only';
    const ext = extname(op.oldPath).toLowerCase();
    const needsTranscode = isConversion && ext !== '.webp' && ext !== '.svg' && !op.newName.endsWith('.png');
    
    if (needsTranscode) {
      try {
        await sharp(op.oldPath, { failOn: 'none' })
          .webp({ quality: 85, effort: 4 })
          .toFile(op.newPath);
        if (op.oldPath !== op.newPath) unlinkSync(op.oldPath);
      } catch {
        copyFileSync(op.oldPath, op.newPath);
        if (op.oldPath !== op.newPath) unlinkSync(op.oldPath);
        console.log(`  [!] Fallback copy: ${op.oldName}`);
      }
    } else if (op.newName.endsWith('.png') && op.type === 'rename+convert') {
      copyFileSync(op.oldPath, op.newPath);
      if (op.oldPath !== op.newPath) unlinkSync(op.oldPath);
    } else {
      mkdirSync(dirname(op.newPath), { recursive: true });
      renameSync(op.oldPath, op.newPath);
    }
    
    mapping[relative(ROOT, op.oldPath).replace(/\\/g, '/')] = relative(ROOT, op.newPath).replace(/\\/g, '/');
    processed++;
    if (processed % 25 === 0) console.log(`  ${processed}/${operations.length}...`);
  } catch (e) {
    errors.push({ file: op.oldName, error: e.message });
  }
}

console.log(`\nDone! ${processed}/${operations.length} files processed.`);
if (errors.length) {
  console.log(`\n${errors.length} errors:`);
  errors.forEach(e => console.log(`  ${e.file}: ${e.error}`));
}

const mappingPath = join(__dirname, '..', 'image-rename-mapping.json');
writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
console.log(`Mapping saved to image-rename-mapping.json`);
