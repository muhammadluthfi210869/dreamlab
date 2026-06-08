export { parfumData } from "./parfum";
export { skincareData } from "./skincare";
export { bodycareData } from "./bodycare";
export { haircareData } from "./haircare";
export { babycareData } from "./babycare";
export { decorativeData } from "./decorative";
export { footcareData } from "./footcare";
export { pkrtData } from "./pkrt";

import { parfumData } from "./parfum";
import { skincareData } from "./skincare";
import { bodycareData } from "./bodycare";
import { haircareData } from "./haircare";
import { babycareData } from "./babycare";
import { decorativeData } from "./decorative";
import { footcareData } from "./footcare";
import { pkrtData } from "./pkrt";
import { ProductCategoryV2, SubCategoryV2 } from "@/types/product-v2";

export const productDataV2: Record<string, ProductCategoryV2> = {
  parfum: parfumData,
  skincare: skincareData,
  bodycare: bodycareData,
  haircare: haircareData,
  babycare: babycareData,
  decorative: decorativeData,
  footcare: footcareData,
  pkrt: pkrtData,
};

export function getProductDataV2(category: string): ProductCategoryV2 | null {
  return productDataV2[category] || null;
}

export function getAllCategories(): ProductCategoryV2[] {
  return Object.values(productDataV2);
}

export function getAllProductPages(): { category: string; slug: string; name: string; }[] {
  const pages: { category: string; slug: string; name: string; }[] = [];
  
  for (const [categoryKey, categoryData] of Object.entries(productDataV2)) {
    for (const product of categoryData.products) {
      pages.push({
        category: categoryKey,
        slug: product.slug,
        name: product.name,
      });
    }
  }
  
  return pages;
}

export function generateAllStaticParams(): { category: string; product: string }[] {
  const params: { category: string; product: string }[] = [];
  
  for (const [categoryKey, categoryData] of Object.entries(productDataV2)) {
    for (const product of categoryData.products) {
      params.push({
        category: categoryKey,
        product: product.slug,
      });
    }
  }
  
  return params;
}

// ─── Sub-Category Helpers ───

export function getAllSubCategories(): { category: string; subCategory: string; name: string }[] {
  const subs: { category: string; subCategory: string; name: string }[] = [];
  
  for (const [categoryKey, categoryData] of Object.entries(productDataV2)) {
    if (categoryData.subCategories) {
      for (const sub of categoryData.subCategories) {
        subs.push({
          category: categoryKey,
          subCategory: sub.slug,
          name: sub.name,
        });
      }
    }
  }
  
  return subs;
}

export function getSubCategory(category: string, subCategory: string): SubCategoryV2 | null {
  const categoryData = productDataV2[category];
  if (!categoryData || !categoryData.subCategories) return null;
  
  return categoryData.subCategories.find(s => s.slug === subCategory) || null;
}

export function getProductFromSubCategory(category: string, subCategory: string, productSlug: string) {
  const sub = getSubCategory(category, subCategory);
  if (!sub) return null;
  
  return sub.products.find(p => p.slug === productSlug) || null;
}

export function getAllSubCategoryProductPages(): { category: string; subCategory: string; product: string }[] {
  const pages: { category: string; subCategory: string; product: string }[] = [];
  
  for (const [categoryKey, categoryData] of Object.entries(productDataV2)) {
    if (categoryData.subCategories) {
      for (const sub of categoryData.subCategories) {
        for (const product of sub.products) {
          pages.push({
            category: categoryKey,
            subCategory: sub.slug,
            product: product.slug,
          });
        }
      }
    }
  }
  
  return pages;
}

export function findProductInCategory(category: string, productSlug: string) {
  const categoryData = productDataV2[category];
  if (!categoryData) return null;
  
  // Check flat products
  const flatProduct = categoryData.products.find(p => p.slug === productSlug);
  if (flatProduct) return flatProduct;
  
  // Check sub-category products
  if (categoryData.subCategories) {
    for (const sub of categoryData.subCategories) {
      const subProduct = sub.products.find(p => p.slug === productSlug);
      if (subProduct) return subProduct;
    }
  }
  
  return null;
}

export function findSubCategoryForProduct(category: string, productSlug: string): SubCategoryV2 | null {
  const categoryData = productDataV2[category];
  if (!categoryData || !categoryData.subCategories) return null;
  
  for (const sub of categoryData.subCategories) {
    if (sub.products.some(p => p.slug === productSlug)) {
      return sub;
    }
  }
  
  return null;
}

export function getFlatCategoryProductPages(): { category: string; product: string }[] {
  const pages: { category: string; product: string }[] = [];
  
  for (const [categoryKey, categoryData] of Object.entries(productDataV2)) {
    // Only include categories WITHOUT sub-categories
    if (!categoryData.subCategories || categoryData.subCategories.length === 0) {
      for (const product of categoryData.products) {
        pages.push({
          category: categoryKey,
          product: product.slug,
        });
      }
    }
  }
  
  return pages;
}