import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Import codebase data using relative paths
import { skincareData } from '../src/data/products-v2/skincare';
import { bodycareData } from '../src/data/products-v2/bodycare';
import { parfumData } from '../src/data/products-v2/parfum';
import { haircareData } from '../src/data/products-v2/haircare';
import { babycareData } from '../src/data/products-v2/babycare';
import { decorativeData } from '../src/data/products-v2/decorative';
import { footcareData } from '../src/data/products-v2/footcare';
import { pkrtData } from '../src/data/products-v2/pkrt';

// Map codebase categories
const codebaseCategories = {
  skincare: skincareData,
  bodycare: bodycareData,
  parfum: parfumData,
  haircare: haircareData,
  babycare: babycareData,
  decorative: decorativeData,
  footcare: footcareData,
  pkrt: pkrtData
};

// Load parsed products from Sections CSV
const csvProducts = JSON.parse(fs.readFileSync(path.join(__dirname, '../../scratch/csv_parsed_products.json'), 'utf-8'));

// Load Revisions CSV
const revisionsContent = fs.readFileSync(path.join(__dirname, '../../plan/plan-brief-seo/Audit_Website 2025 - Revisions .csv'), 'utf-8');
const revisions = parse(revisionsContent, { columns: true, skip_empty_lines: true });

console.log("=== START AUDIT ===");
console.log("Total products in sections CSV:", csvProducts.length);

// Helper to clean/standardize product names
function cleanName(name: string) {
  if (!name) return '';
  let cleaned = name.toLowerCase()
    .replace(/^maklon\s+/g, '')
    .replace(/^jasa\s+maklon\s+/g, '')
    .replace(/^seputar\s+maklon\s+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned === 'baby care') return 'baby 2-in-1 wash';
  return cleaned;
}

// Map codebase products by their cleaned name
const codebaseProductMap = new Map();
const codebaseSubCategories = new Map();

for (const [catSlug, catData] of Object.entries(codebaseCategories)) {
  // Flat products
  for (const prod of catData.products) {
    const key = `${catSlug}:${cleanName(prod.name)}`;
    codebaseProductMap.set(key, { ...prod, categorySlug: catSlug, type: 'flat' });
  }
  // Sub-categories and their products
  if (catData.subCategories) {
    for (const sub of catData.subCategories) {
      codebaseSubCategories.set(`${catSlug}:${cleanName(sub.name)}`, { ...sub, categorySlug: catSlug });
      for (const prod of sub.products) {
        const key = `${catSlug}:${cleanName(prod.name)}`;
        codebaseProductMap.set(key, { ...prod, categorySlug: catSlug, subCategorySlug: sub.slug, type: 'subcategory' });
      }
    }
  }
}

// Compare each CSV product with codebase
const matches = [];
const mismatches = [];

for (const csvProd of csvProducts) {
  const cat = csvProd.category.toLowerCase();
  const prodName = (csvProd.name || '').toLowerCase();
  
  // Find which codebase category matches this CSV category
  let catSlug = '';
  if (prodName.includes('baby')) catSlug = 'babycare';
  else if (prodName.includes('foot')) catSlug = 'footcare';
  else if (cat.includes('skincare')) catSlug = 'skincare';
  else if (cat.includes('body')) catSlug = 'bodycare';
  else if (cat.includes('parfum')) catSlug = 'parfum';
  else if (cat.includes('makeup') || cat.includes('decorative')) catSlug = 'decorative';
  else if (cat.includes('lip')) catSlug = 'decorative';
  else if (cat.includes('foot')) catSlug = 'footcare';
  else if (cat.includes('hair')) catSlug = 'haircare';
  else if (cat.includes('baby')) catSlug = 'babycare';
  else if (cat.includes('pkrt')) catSlug = 'pkrt';
  
  if (!catSlug) {
    const subcat = (csvProd.name || '').toLowerCase();
    // Try to guess by subcategory name
    if (subcat.includes('parfum')) catSlug = 'parfum';
    else if (subcat.includes('baby')) catSlug = 'babycare';
    else if (subcat.includes('foot')) catSlug = 'footcare';
    else catSlug = 'bodycare'; // fallback
  }

  const cleanedCsvName = cleanName(csvProd.name);
  const key = `${catSlug}:${cleanedCsvName}`;
  
  // Try to find matching product or subcategory
  let found = codebaseProductMap.get(key) || codebaseSubCategories.get(key);
  
  // Try matching with containing string if exact match fails
  if (!found && cleanedCsvName) {
    for (const [k, v] of codebaseProductMap.entries()) {
      if (k.startsWith(`${catSlug}:`) && (k.includes(cleanedCsvName) || cleanedCsvName.includes(k.split(':')[1]))) {
        found = v;
        break;
      }
    }
  }
  if (!found && cleanedCsvName) {
    for (const [k, v] of codebaseSubCategories.entries()) {
      if (k.startsWith(`${catSlug}:`) && (k.includes(cleanedCsvName) || cleanedCsvName.includes(k.split(':')[1]))) {
        found = v;
        break;
      }
    }
  }

  if (found) {
    matches.push({ csvProd, found, catSlug });
  } else {
    mismatches.push({ csvProd, catSlug, key });
  }
}

console.log(`\nMatched: ${matches.length} products`);
console.log(`Mismatched (not found in codebase by clean name): ${mismatches.length}`);
mismatches.forEach(m => {
  console.log(`  - CSV Cat: "${m.csvProd.category}" | Product Name: "${m.csvProd.name}" -> Guess Key: "${m.key}"`);
});

// Let's write the detailed discrepancies report
const report = [];

report.push("# Detailed Audit & Discrepancies Report");
report.push("\nGenerated automatically by comparing: ");
report.push("1. `plan/plan-brief-seo/Audit_Website 2025 - Sections .csv` (Brief)");
report.push("2. `plan/plan-brief-seo/Audit_Website 2025 - Revisions .csv` (Revisions)");
report.push("3. TypeScript data files in `src/data/products-v2/` (Codebase)");

report.push("\n## 1. Custom Design Grid 'custom.webp' Typo Bug Analysis");
report.push(`
- **Root Cause**: In [ProductPackagingGrid.tsx](file:///c:/GAWE/Web%20Dev/Porto%20Aureon/CRAWL%20WEBSITE%20DREAMLAB/dreamlab-site/src/components/ProductPageV2/ProductPackagingGrid.tsx), the helper function \`toTitleCase\` only strips extensions matching \`\\.(jpg|png|svg)$\` (case-insensitive). It does **not** strip \`.webp\`.
- **Result**: When \`custom.webp\` is appended as a custom option in the skincare/makeup grid on line 227, it gets formatted as **"Custom.webp"** as the visible text label in the UI instead of a friendly name.
- **Typo in "Custom Design" asset**: The file on disk is named \`costum-packing-deisgn.png\` (note the typos "costum" and "deisgn"). The codebase maps this to the label "Custom Design" for flat product pages, but for category/subcategory pages, it formats the filename directly using \`toTitleCase("costum-packing-deisgn.png")\`, which prints **"Costum Packing Deisgn"** in the UI.
`);

report.push("\n## 2. Product and Packaging Discrepancies from CSV Revisions");
report.push("Here is a comparison of what is defined in the Revisions CSV and what exists in the codebase:\n");

// Analyze each item in Revisions CSV
revisions.forEach((rev: any) => {
  const url = rev.Url || '';
  const note = rev.Note || '';
  if (!url) return;
  
  // Extract category and products from URL
  // e.g. https://dreamlab-preview-v2.vercel.app/produk/skincare/face-mask/
  const match = url.match(/\/produk\/([^/]+)\/([^/]+)\/?([^/]+)?/);
  if (match) {
    const cat = match[1];
    const subcat = match[2];
    const prod = match[3];
    
    report.push(`### URL: [${url}](${url})`);
    report.push(`- **Brief Revision Note**: ${note}`);
    
    if (cat === 'skincare') {
      if (subcat === 'face-mask') {
        // Codebase check for face mask packaging
        const packIcons = skincareData.subCategories?.find(s => s.slug === 'face-mask')?.products;
        report.push(`- **Codebase State**: \`skincareIconFiles["face-mask"]\` is currently: \`["botol-pump.svg", "body-jar-1.svg", "tube.svg", "bottle.svg"]\`.`);
        report.push(`- **Discrepancy**: The revision states "pilihan kemasan dihapus botol pump dan bottle dan tambahkan custom dengan tulisan custom". The codebase still includes \`botol-pump.svg\` and \`bottle.svg\`.`);
      } else if (subcat === 'cleansing') {
        if (!prod) {
          report.push(`- **Codebase State**: \`skincareIconFiles["cleansing"]\` is currently: \`["botol-pump.svg", "bottle.webp", "tube.svg", "dropper-bottle.svg", "bottle.svg"]\`.`);
          report.push(`- **Discrepancy**: The revision states "Bottle pump, tube , jar , Airless Bottle,custom". The codebase has no jar or airless bottle inside \`skincareIconFiles["cleansing"]\`.`);
        } else {
          // Check specific cleansing products
          const productObj = skincareData.subCategories?.find(s => s.slug === 'cleansing')?.products.find(p => p.slug === prod);
          if (productObj) {
            report.push(`- **Codebase State for ${productObj.name}**: Varian kemasan in product is \`${JSON.stringify(productObj.bottleOptions || [])}\`.`);
          }
        }
      } else if (subcat === 'facial-wash') {
        report.push(`- **Codebase State**: \`skincareIconFiles["face-wash"]\` is currently: \`["tube.svg", "botol-pump.svg", "bottle.svg", "bottle.webp"]\`.`);
        report.push(`- **Discrepancy**: The revision states "ada 2 botol dinamain botol 1 dan 2 untuk botol pump tetap. Tumbe, Botol pump, botol 1, botol 2 , custom". The codebase does not have botol 1, botol 2, or custom defined for face-wash.`);
      }
    } else if (cat === 'bodycare') {
      if (subcat === 'body-lotion') {
        const bodyLotionPack = bodycareData.products.find(p => p.slug === 'body-lotion')?.bottleOptions;
        report.push(`- **Codebase State**: Body Lotion packaging is \`${JSON.stringify(bodyLotionPack || [])}\`.`);
      }
    }
    report.push("");
  }
});

report.push("\n## 3. Discrepancies between Sections CSV and Codebase Packaging Mapping");
report.push("Below is the comparison between the original Sections CSV and codebase packaging options for matched products:\n");

matches.forEach(m => {
  const csvPack = m.csvProd.kemasan || [];
  let codePack = [];
  
  if (m.found.bottleOptions) {
    codePack = m.found.bottleOptions;
  } else if (m.found.products) {
    // If it's a subcategory, gather all packaging options from its products
    const opts = new Set();
    m.found.products.forEach((p: any) => {
      if (p.bottleOptions) p.bottleOptions.forEach((o: any) => opts.add(o));
    });
    codePack = Array.from(opts);
  }
  
  // Sort and compare
  const csvSorted = [...csvPack].sort();
  const codeSorted = [...codePack].sort();
  const isMatch = JSON.stringify(csvSorted) === JSON.stringify(codeSorted);
  
  if (!isMatch) {
    report.push(`### Product/Subcategory: **${m.found.name}** (Category: ${m.catSlug})`);
    report.push(`- **CSV Defined**: \`${JSON.stringify(csvPack)}\``);
    report.push(`- **Codebase Defined**: \`${JSON.stringify(codePack)}\``);
    report.push(`- **Status**: ⚠️ Discrepancy Found!`);
    report.push("");
  }
});

fs.writeFileSync(path.join(__dirname, '../../scratch/discrepancies_report.md'), report.join('\n'));
console.log("Saved detailed report to scratch/discrepancies_report.md");
