import fs from 'fs';
import path from 'path';
import { productDataV2 } from '../src/data/products-v2';
import { getCardImagePath } from '../src/data/product-card-images';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

interface RelatedProductAuditResult {
  relatedProductName: string;
  relatedProductSlug: string;
  resolvedImagePath: string;
  issue: 'old_asset' | 'dummy_asset' | 'missing_file' | 'none';
}

interface PageAuditResult {
  pageUrl: string;
  productName: string;
  category: string;
  subCategory?: string;
  relatedProducts: RelatedProductAuditResult[];
}

function checkPathIssue(imagePath: string): 'old_asset' | 'dummy_asset' | 'missing_file' | 'none' {
  if (!imagePath) return 'none';
  
  // Clean path for checking existence
  let checkPath = imagePath;
  if (checkPath.startsWith('/')) {
    checkPath = checkPath.substring(1);
  }
  // Decode URL encoded characters (like %20 for space)
  try {
    checkPath = decodeURIComponent(checkPath);
  } catch (e) {
    checkPath = checkPath.replace(/%20/g, ' ');
  }
  
  const absolutePath = path.join(PUBLIC_DIR, checkPath);
  const exists = fs.existsSync(absolutePath);
  
  if (!exists) {
    return 'missing_file';
  }
  
  if (imagePath.includes('/assets/produk') || imagePath.includes('assets/produk/')) {
    return 'old_asset';
  }
  
  if (imagePath.includes('bg-lands-card1.webp')) {
    return 'dummy_asset';
  }
  
  return 'none';
}

function runAudit() {
  console.log('🔍 Starting Related Products Image Audit...\n');
  const results: PageAuditResult[] = [];
  
  // 1. Process all subcategory products (slug.length === 2)
  for (const [categoryKey, categoryData] of Object.entries(productDataV2)) {
    if (categoryData.subCategories) {
      for (const sub of categoryData.subCategories) {
        for (const product of sub.products) {
          const pageUrl = `/produk/${categoryKey}/${sub.slug}/${product.slug}`;
          
          // Build subcategory-specific related products from sibling products (replicates CatchAllPage logic)
          const subCategoryRelatedProducts = sub.products
            .filter(p => p.slug !== product.slug)
            .slice(0, 4)
            .map(p => ({
              name: p.name,
              slug: p.slug,
              image: getCardImagePath(p.slug, categoryKey) || p.heroImage,
              category: categoryData.name,
              categorySlug: categoryKey,
              subCategorySlug: sub.slug,
            }));
            
          const resolvedRelated = subCategoryRelatedProducts.length > 0 
            ? subCategoryRelatedProducts 
            : categoryData.relatedProducts;
            
          const relatedAudits = resolvedRelated.map(r => ({
            relatedProductName: r.name,
            relatedProductSlug: r.slug,
            resolvedImagePath: r.image,
            issue: checkPathIssue(r.image)
          }));
          
          results.push({
            pageUrl,
            productName: product.name,
            category: categoryKey,
            subCategory: sub.slug,
            relatedProducts: relatedAudits
          });
        }
      }
    }
  }
  
  // 2. Process all top-level products (slug.length === 1)
  for (const [categoryKey, categoryData] of Object.entries(productDataV2)) {
    // Flat products (or hybrid top-level products)
    for (const product of categoryData.products) {
      const pageUrl = `/produk/${categoryKey}/${product.slug}`;
      
      // Related products for flat category is always categoryData.relatedProducts
      const resolvedRelated = categoryData.relatedProducts || [];
      
      const relatedAudits = resolvedRelated.map(r => ({
        relatedProductName: r.name,
        relatedProductSlug: r.slug,
        resolvedImagePath: r.image,
        issue: checkPathIssue(r.image)
      }));
      
      results.push({
        pageUrl,
        productName: product.name,
        category: categoryKey,
        relatedProducts: relatedAudits
      });
    }
  }
  
  // Print summary
  let totalIssues = 0;
  let oldAssetCount = 0;
  let dummyAssetCount = 0;
  let missingFileCount = 0;
  
  const issuePages: PageAuditResult[] = [];
  const uniqueIssues = new Set<string>();
  
  results.forEach(res => {
    const badRelated = res.relatedProducts.filter(r => r.issue !== 'none');
    if (badRelated.length > 0) {
      issuePages.push(res);
      badRelated.forEach(r => {
        totalIssues++;
        uniqueIssues.add(`${r.resolvedImagePath} (${r.issue})`);
        if (r.issue === 'old_asset') oldAssetCount++;
        if (r.issue === 'dummy_asset') dummyAssetCount++;
        if (r.issue === 'missing_file') missingFileCount++;
      });
    }
  });
  
  console.log(`=== AUDIT SUMMARY ===`);
  console.log(`Total Pages Audited: ${results.length}`);
  console.log(`Pages with Issues: ${issuePages.length}`);
  console.log(`Total Issue Instances in Related Sections: ${totalIssues}`);
  console.log(`  - Old Asset (/assets/produk/): ${oldAssetCount}`);
  console.log(`  - Dummy Asset (bg-lands-card1.webp): ${dummyAssetCount}`);
  console.log(`  - Missing Files on Disk: ${missingFileCount}`);
  console.log(`======================\n`);
  
  console.log(`=== UNIQUE ISSUE PATHS IDENTIFIED ===`);
  Array.from(uniqueIssues).forEach(issue => console.log(`- ${issue}`));
  console.log(`======================\n`);
  
  console.log(`=== DETAILED PAGE REPORT ===`);
  issuePages.forEach(res => {
    console.log(`\nPage: https://www.dreamlab.id${res.pageUrl}`);
    console.log(`Product: ${res.productName} (${res.category}${res.subCategory ? ` / ${res.subCategory}` : ''})`);
    console.log(`Issues in 'Produk Lainnya':`);
    res.relatedProducts.forEach(r => {
      if (r.issue !== 'none') {
        console.log(`  ⚠️  [${r.issue.toUpperCase()}] ${r.relatedProductName} (${r.relatedProductSlug})`);
        console.log(`      Path: "${r.resolvedImagePath}"`);
      }
    });
  });
}

runAudit();
