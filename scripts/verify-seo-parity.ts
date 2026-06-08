/**
 * VERIFY SEO PARITY
 * 
 * Membandingkan metadata build vs seo-audit-export.csv
 * 
 * Usage:
 *   npx tsx scripts/verify-seo-parity.ts
 * 
 * Prerequisite: Next.js harus running (npm run build dulu, lalu npm start)
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface AuditRow {
  url: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  canonical: string;
  h1: string;
  word_count: string;
}

interface CheckResult {
  slug: string;
  status: 'pass' | 'fail' | 'error';
  issues: string[];
  live_title: string | null;
  expected_title: string | null;
  live_description: string | null;
  expected_description: string | null;
  live_canonical: string | null;
  expected_canonical: string | null;
}

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function fetchPage(url: string): Promise<{ status: number; html: string } | { status: number; error: string }> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000), redirect: 'manual' });
    const html = await response.text();
    return { status: response.status, html };
  } catch (err: any) {
    return { status: 0, error: err.message };
  }
}

function extractMeta(html: string, tag: string, attr: string, attrValue: string, contentAttr: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*${attr}=["']${attrValue}["'][^>]*${contentAttr}=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  if (match) return match[1].trim();
  
  // Try reversed attribute order
  const regex2 = new RegExp(`<${tag}[^>]*${contentAttr}=["']([^"']*)["'][^>]*${attr}=["']${attrValue}["']`, 'i');
  const match2 = html.match(regex2);
  return match2 ? match2[1].trim() : null;
}

function extractCanonical(html: string): string | null {
  const match = html.match(/<link\s+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  return match ? match[1].trim() : null;
}

async function main() {
  console.log('=== SEO Parity Verification ===\n');
  console.log(`Testing against: ${BASE_URL}\n`);

  // Load CSV
  const csvPath = path.join(process.cwd(), 'src', 'data', 'seo-audit-export.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records: AuditRow[] = parse(csvContent, { columns: true, skip_empty_lines: true });

  console.log(`CSV entries: ${records.length}\n`);

  // Test a sample first to check server is running
  const homeCheck = await fetchPage(BASE_URL);
  if ('error' in homeCheck) {
    console.log(`❌ Cannot reach ${BASE_URL}: ${homeCheck.error}`);
    console.log('   Make sure Next.js is running (npm run build && npm start)');
    process.exit(1);
  }
  console.log(`✅ Server reachable (HTTP ${homeCheck.status})\n`);

  // Test all URLs
  const results: CheckResult[] = [];
  const errors: string[] = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const slug = record.slug?.replace(/\/$/, '') || '/';
    const url = `${BASE_URL}${slug}/`;

    process.stdout.write(`   [${i + 1}/${records.length}] ${slug}... `);

    const result = await fetchPage(url);
    
    if ('error' in result) {
      console.log(`❌ ${result.error}`);
      errors.push(`${slug}: ${result.error}`);
      results.push({ slug, status: 'error', issues: [`Fetch error: ${result.error}`], live_title: null, expected_title: record.meta_title, live_description: null, expected_description: record.meta_description, live_canonical: null, expected_canonical: record.canonical });
      continue;
    }

    if (result.status === 301 || result.status === 308 || result.status === 302) {
      console.log(`↪️ ${result.status} (redirect)`);
      continue;
    }

    if (result.status !== 200) {
      console.log(`⚠️ ${result.status}`);
      errors.push(`${slug}: HTTP ${result.status}`);
      continue;
    }

    const html = result.html;
    const issues: string[] = [];

    const liveTitle = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1]?.trim() || null;
    const liveDesc = extractMeta(html, 'meta', 'name', 'description', 'content') || 
                     extractMeta(html, 'meta', 'name', 'Description', 'content') || null;
    const liveCanonical = extractCanonical(html);
    const ogLocale = extractMeta(html, 'meta', 'property', 'og:locale', 'content');

    // Compare title
    const expectedTitle = (record.meta_title || '').trim();
    if (expectedTitle && liveTitle && liveTitle.trim() !== expectedTitle) {
      issues.push(`Title mismatch: expected "${expectedTitle}", got "${liveTitle}"`);
    }
    if (!liveTitle) issues.push('Missing title tag');

    // Compare meta description
    const expectedDesc = (record.meta_description || '').trim();
    if (expectedDesc && liveDesc && liveDesc.trim() !== expectedDesc) {
      issues.push(`Description mismatch: expected "${expectedDesc.substring(0, 50)}...", got "${liveDesc.substring(0, 50)}..."`);
    }
    if (!liveDesc && expectedDesc) issues.push('Missing meta description');

    // Check canonical
    const expectedCanonical = (record.canonical || `https://dreamlab.id${slug}/`).replace(/\/?$/, '/');
    if (!liveCanonical) issues.push('Missing canonical URL');
    else if (liveCanonical !== expectedCanonical) issues.push(`Canonical mismatch: expected "${expectedCanonical}", got "${liveCanonical}"`);

    // Check OG locale
    if (ogLocale && ogLocale !== 'id_ID') issues.push(`OG locale is "${ogLocale}" not "id_ID"`);

    const status = issues.length === 0 ? 'pass' : 'fail';
    if (status === 'fail') {
      console.log(`⚠️ ${issues.length} issue(s)`);
    } else {
      console.log('✅');
    }

    results.push({
      slug,
      status,
      issues,
      live_title: liveTitle,
      expected_title: expectedTitle,
      live_description: liveDesc,
      expected_description: expectedDesc,
      live_canonical: liveCanonical,
      expected_canonical: expectedCanonical,
    });
  }

  // Summary
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const errored = results.filter(r => r.status === 'error').length;

  console.log('\n=== VERIFICATION REPORT ===');
  console.log(`📊 Total checked: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Failed: ${failed}`);
  console.log(`❌ Errors: ${errored}`);

  if (failed > 0) {
    console.log('\n--- FAILED PAGES ---');
    const failedPages = results.filter(r => r.status === 'fail');
    for (const page of failedPages.slice(0, 20)) {
      console.log(`\n${page.slug}:`);
      for (const issue of page.issues) {
        console.log(`  • ${issue}`);
      }
    }
    if (failedPages.length > 20) {
      console.log(`\n... and ${failedPages.length - 20} more failed pages`);
    }
  }

  if (errors.length > 0) {
    console.log('\n--- FETCH ERRORS ---');
    for (const err of errors.slice(0, 10)) {
      console.log(`  • ${err}`);
    }
  }

  // Save report
  const outputDir = path.join(process.cwd(), 'scripts', 'output');
  fs.mkdirSync(outputDir, { recursive: true });
  
  const report = {
    verification_date: new Date().toISOString(),
    base_url: BASE_URL,
    csv_entries: records.length,
    summary: { passed, failed, errored, total: results.length },
    results: results.filter(r => r.status !== 'pass'), // Only failures for brevity
  };
  fs.writeFileSync(path.join(outputDir, 'seo-verification-report.json'), JSON.stringify(report, null, 2));
  console.log(`\n📁 Report saved: scripts/output/seo-verification-report.json`);

  if (failed === 0 && errored === 0) {
    console.log('\n✨ GREEN LIGHT: 100% SEO Parity!');
  }
}

main().catch(console.error);
