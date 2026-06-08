/**
 * CLEANUP SEO MAPPING
 * 
 * 1. Remove duplicates (keep first occurrence)
 * 2. Remove entries with URL-encoded descriptions in source
 * 3. Validate all destinations are valid paths
 */

import fs from 'fs';
import path from 'path';

interface SeoMappingItem {
  source: string;
  destination: string;
  permanent: boolean;
  _metadata?: {
    original_title: string;
    original_h1?: string;
  };
}

function isValidSlug(s: string): boolean {
  if (!s || s === '/' || s.startsWith('http')) return true;
  if (s.length > 200) return false;
  if (s.includes('%20') || s.includes(' ') || s.includes(':')) return false;
  if (s.includes('\\')) return false;
  return true;
}

function main() {
  const mappingPath = path.join(process.cwd(), 'src', 'data', 'seo-mapping.json');
  const raw = fs.readFileSync(mappingPath, 'utf-8');
  const data: SeoMappingItem[] = JSON.parse(raw);

  console.log(`Total entries before cleanup: ${data.length}`);

  // Filter out invalid slugs first
  const valid = data.filter(item => isValidSlug(item.source));
  const invalidCount = data.length - valid.length;
  console.log(`Removed ${invalidCount} entries with invalid sources (URL-encoded, spaces, etc)`);

  // Deduplicate by source — keep first occurrence
  const seen = new Map<string, SeoMappingItem>();
  const duplicates: string[] = [];

  for (const item of valid) {
    const key = item.source.replace(/\/$/, ''); // normalize trailing slash
    if (seen.has(key)) {
      duplicates.push(key);
    } else {
      seen.set(key, item);
    }
  }

  console.log(`Removed ${duplicates.length} duplicate entries`);

  // Validate destinations
  const final = Array.from(seen.values());
  let fixedDestinations = 0;

  for (const item of final) {
    // Normalize destination to trailing slash
    if (item.destination && !item.destination.endsWith('/') && !item.destination.includes('.')) {
      item.destination = item.destination + '/';
      fixedDestinations++;
    }
    // Ensure all entries have permanent: true
    if (item.permanent === undefined) {
      item.permanent = true;
    }
  }

  // Sort by source for readability
  final.sort((a, b) => a.source.localeCompare(b.source));

  // Write back
  fs.writeFileSync(mappingPath, JSON.stringify(final, null, 2), 'utf-8');

  console.log(`Fixed trailing slash on ${fixedDestinations} destinations`);
  console.log(`\nFinal entries: ${final.length}`);
  console.log(`\nDuplicates removed:`);
  for (const d of duplicates) {
    console.log(`  - ${d}`);
  }

  // Also save the root version for reference
  const rootPath = path.join(process.cwd(), '..', 'seo-mapping.json');
  if (fs.existsSync(rootPath)) {
    const rootData = JSON.parse(fs.readFileSync(rootPath, 'utf-8'));
    // Fix CHANGEME in root if needed
    let changed = 0;
    for (const item of rootData) {
      if (item.destination && item.destination.includes('CHANGEME_NEW_URL')) {
        item.destination = item.destination.replace('CHANGEME_NEW_URL', 'https://dreamlab.id');
        changed++;
      }
    }
    if (changed > 0) {
      fs.writeFileSync(rootPath, JSON.stringify(rootData, null, 2), 'utf-8');
      console.log(`\nFixed ${changed} CHANGEME_NEW_URL entries in root seo-mapping.json`);
    }
  }
}

main();
