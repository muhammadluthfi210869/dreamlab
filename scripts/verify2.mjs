import { readFileSync } from "fs";

const content = readFileSync("src/components/ProductPageV2/ProductFAQ.tsx", "utf-8");
const lines = content.split(/\r?\n/);

// Count category keys
const catKeys = lines.filter(l => {
  const trimmed = l.trim();
  return trimmed.startsWith('"') && trimmed.endsWith('": [') && !trimmed.startsWith('"use ');
});
console.log("ProductFAQ categories:", catKeys.length);

// Check for specific required keys
const requiredKeys = [
  "skincare", "bodycare", "babycare", "haircare", "parfum", "decorative",
  "skincare-day-night-cream", "skincare-face-mask", "skincare-sunscreen",
  "skincare-cleansing", "skincare-facial-wash", "skincare-facial-toner", "skincare-facial-serum",
  "bodycare-massage-oil", "bodycare-body-butter", "bodycare-body-scrub", "bodycare-shower-gutest",
  "footcare-foot-cream", "haircare-shampoo", "parfum-body-mist",
  "decorative-lip-cream", "decorative-foundation"
];

for (const key of requiredKeys) {
  if (content.includes(`"${key}": [`)) {
    console.log(`  ✓ ${key}`);
  } else {
    console.log(`  ✗ MISSING: ${key}`);
  }
}

// Check no old content remains (haircare with technical content)
if (content.includes("Apakah Dreamlab berpengalaman memformulasikan produk haircare")) {
  console.log("\n✗ STILL HAS OLD HAIRCARE CONTENT");
} else {
  console.log("\n✓ Old haircare content removed");
}

if (content.includes("Bagaimana standar keamanan formulasi produk perawatan bayi")) {
  console.log("✗ STILL HAS OLD BABYCARE CONTENT");
} else {
  console.log("✓ Old babycare content removed");
}

// Verify function is intact
if (content.includes("export default function ProductFAQ")) {
  console.log("✓ Function export intact");
}

// Verify closing
if (content.trim().endsWith("}")) {
  console.log("✓ File ends correctly");
}
