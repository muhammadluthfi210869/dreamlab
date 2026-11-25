"use client";

import Image from "next/image";
import { Palette } from "lucide-react";
import { useInView } from "@/lib/use-in-view";

interface ProductPackagingGridProps {
  categorySlug: string;
  subCategorySlug?: string;
  productSlug?: string;
  bottleOptions?: string[];
}

const packagingOptionImageMap: Record<string, string> = {
  "Glass Bottle": "maklon-kosmetik-Glass-botol.svg",
  "Frosted Bottle": "maklon-kosmetik-Glass-botol.svg",
  "Amber Glass": "maklon-kosmetik-Glass-botol.svg",
  "Clear Glass": "maklon-kosmetik-Glass-botol.svg",
  "Blue Glass": "maklon-kosmetik-Glass-botol.svg",
  "Glass Bottle Premium": "maklon-kosmetik-Glass-botol.svg",
  "Glass Bottle Luxury": "maklon-kosmetik-Glass-botol.svg",
  "Crystal Bottle": "maklon-kosmetik-Glass-botol.svg",
  "PET Clear Bottle": "maklon-kosmetik-Glass-botol.svg",
  "Clear PET Bottle": "maklon-kosmetik-Glass-botol.svg",
  "Boston Round": "maklon-kosmetik-Glass-botol.svg",
  "Reed Stick Bottle": "maklon-kosmetik-Glass-botol.svg",

  "Spray Bottle": "maklon-kosmetik-spray-botol.svg",
  "Misting Spray": "maklon-kosmetik-spray-botol.svg",
  "Trigger Spray": "maklon-kosmetik-spray-botol.svg",
  "Splash Bottle": "maklon-kosmetik-spray-botol.svg",

  "Pump Bottle": "maklon-kosmetik-pump-botol.svg",
  "Airless Pump Bottle": "maklon-kosmetik-airless-pump.svg",
  "Airless Pump": "maklon-kosmetik-airless-pump.svg",
  "Pump Jar": "maklon-kosmetik-jar.svg",
  "Shaker Bottle": "maklon-kosmetik-pump-botol.svg",
  "Dispenser": "maklon-kosmetik-pump-botol.svg",

  "Flip Top Bottle": "maklon-kosmetik-fliptop-botol.svg",
  "Flip Top": "maklon-kosmetik-fliptop-botol.svg",

  "Dropper Bottle": "maklon-kosmetik-dropper-botol.svg",
  "Dropper": "maklon-kosmetik-dropper-botol.svg",
  "Serum Dropper Bottle": "maklon-kosmetik-dropper-botol.svg",

  "Roll-on": "maklon-kosmetik-roll-on-botol.svg",
  "Roller Bottle": "maklon-kosmetik-roll-on-botol.svg",

  "Tube": "maklon-kosmetik-tube.svg",
  "Squeeze Tube": "maklon-kosmetik-tube.svg",
  "Flat Tube": "maklon-kosmetik-tube.svg",
  "Soft Matte Tube": "maklon-kosmetik-tube.svg",
  "Lotion Tube": "maklon-kosmetik-tube.svg",
  "Tube with Nozzle": "maklon-kosmetik-tube.svg",
  "Lip Cream Tube": "maklon-kosmetik-tube.svg",
  "Lip Gloss Tube": "maklon-kosmetik-tube.svg",
  "Lip Balm Tube": "maklon-kosmetik-tube.svg",
  "Applicator Tube": "maklon-kosmetik-tube.svg",

  "Jar": "maklon-kosmetik-jar.svg",
  "Jar isi kapsul": "maklon-kosmetik-jar.svg",
  "Jar / Pot": "maklon-kosmetik-jar.svg",
  "Pot": "maklon-kosmetik-jar.svg",
  "Sifter Jar": "maklon-kosmetik-jar.svg",

  "Standing Pouch": "maklon-kosmetik-standing-pouch.svg",
  "Pouch": "maklon-kosmetik-standing-pouch.svg",
  "Blister": "custom-kemasan- dreamlab-maklon-kosmetik .png",
  "Sachet": "maklon-kosmetik-standing-pouch.svg",
  "Sachet (Booties)": "maklon-kosmetik-standing-pouch.svg",
  "Refill Pouch": "maklon-kosmetik-standing-pouch.svg",
  "Refill Pack": "maklon-kosmetik-standing-pouch.svg",

  "Stick": "maklon-kosmetik-stick.svg",
  "Stick Packaging": "maklon-kosmetik-stick.svg",
  "Lipstick Case": "maklon-kosmetik-stick.svg",

  "Cushion Case": "bb-cream.webp",
  "Compact Case": "bb-cream.webp",

  "Mascara Tube": "mascara.webp",

  "Classic Cologne": "maklon-kosmetik-spray-botol.svg",
  "Modern Sleek": "maklon-kosmetik-Glass-botol.svg",
  "Family Size": "maklon-kosmetik-Glass-botol.svg",
  "Crystal Square": "maklon-kosmetik-Glass-botol.svg",
  "Artisan Round": "maklon-kosmetik-Glass-botol.svg",
  "Limited Edition": "maklon-kosmetik-Glass-botol.svg",

  "Puff Case": "maklon-kosmetik-pump-botol.svg",

  "Trigger Bottle": "maklon-kosmetik-spray-botol.svg",
  "Tin": "custom-kemasan- dreamlab-maklon-kosmetik .png",
  "Pump": "maklon-kosmetik-pump-botol.svg",
  "Soft Touch": "maklon-kosmetik-tube.svg",
  "Spray": "maklon-kosmetik-spray-botol.svg",
  "Jerigen": "custom-kemasan- dreamlab-maklon-kosmetik .png",

  "Sheet Mask": "custom-kemasan- dreamlab-maklon-kosmetik .png",

  "Custom Exclusive Packaging": "custom-kemasan- dreamlab-maklon-kosmetik .png",
  "Bar Wrap": "custom-kemasan- dreamlab-maklon-kosmetik .png",
  "Bar Wrap / Box": "custom-kemasan- dreamlab-maklon-kosmetik .png",
  "Bar": "custom-kemasan- dreamlab-maklon-kosmetik .png",
  "Wrapper": "custom-kemasan- dreamlab-maklon-kosmetik .png",
  "Box": "custom-kemasan- dreamlab-maklon-kosmetik .png",
  "Kraft Box": "custom-kemasan- dreamlab-maklon-kosmetik .png",
  "Paper Box": "custom-kemasan- dreamlab-maklon-kosmetik .png",
  "Shrink Wrap": "custom-kemasan- dreamlab-maklon-kosmetik .png",

  // Parfum PNG images
  "Glass Parfum Bottle": "maklon-kosmetik-botol-parfum-kaca.png",
  "Roll-On Parfum Bottle": "maklon-kosmetik-roll-on-botol.png",
  "Spray Parfum Bottle": "maklon-kosmetik-spray-botol-plastik.png",

  // Lip PNG images
  "Lip Roll Bottle": "maklon-kosmetik-botol-lip-roll.png",
  "Doe Foot Applicator Bottle": "maklon-kosmetik-botol-dengan-aplikator-doe-foot.png",

  // Footcare
  "Botol Spray": "maklon-kosmetik-spray-botol-plastik.png",
  "Bottle Spray": "maklon-kosmetik-spray-botol-plastik.png",
  "Tub": "maklon-kosmetik-tube.svg",
};

const bodycarePackagingMap: Record<string, string[]> = {
  "massage-oil": ["Pump Bottle", "Flip Top Bottle", "Frosted Bottle", "PET Clear Bottle", "Spray Bottle"],
  "body-butter": ["Tube", "Jar", "Custom Exclusive Packaging"],
  "body-scrub": ["Jar", "Tube", "Custom Exclusive Packaging"],
  "body-wash": ["Pump Bottle", "Flip Top Bottle", "Custom Exclusive Packaging"],
  "body-lotion": ["Pump Bottle", "Flip Top Bottle", "Custom Exclusive Packaging"],
  "body-oil": ["Amber Glass", "Clear Glass", "Dropper Bottle"],
  "anti-bacterial-soap": ["Pump Bottle", "Tube", "Custom Exclusive Packaging"],
  "shower-gel": ["Pump Bottle", "Flip Top Bottle", "Soft Touch", "Custom Exclusive Packaging"],
  "bath-salt": ["Jar", "Standing Pouch", "Glass Bottle"],
  "organic-soap": ["Bar Wrap", "Kraft Box"],
  "body-serum": ["Airless Pump Bottle", "Dropper Bottle"],
  "transparent-soap": ["Bar Wrap", "Box"],
  "underarm-cream": ["Jar", "Tube"],
  "whitening-soap": ["Bar Wrap", "Box", "Pump Bottle"],
  "bar-soap": ["Bar Wrap", "Kraft Box"],
  "massage-cream": ["Jar / Pot", "Tube"],
  "soothing-gel": ["Jar", "Tube"],
  "neck-cream": ["Jar", "Tube", "Airless Pump"],
  "deodorant": ["Spray Bottle", "Roll On Bottle", "Dropper Bottle", "Custom"],
  "deodorant-spray": ["Spray Bottle", "Custom"],
  "deodorant-roll-on": ["Roll On Bottle", "Custom"],
  "deodorant-dry-serum": ["Dropper Bottle", "Roll On Bottle", "Custom"],
  "deodorant-balm": ["Stick Tube", "Custom"],
};

const parfumPackagingMap: Record<string, string[]> = {
  "eau-de-parfum": ["Glass Parfum Bottle", "Roll-On Parfum Bottle", "Spray Parfum Bottle", "Custom Exclusive Packaging"],
  "eau-de-toilette": ["Glass Parfum Bottle", "Roll-On Parfum Bottle", "Spray Parfum Bottle", "Custom Exclusive Packaging"],
  "eau-de-cologne": ["Glass Parfum Bottle", "Roll-On Parfum Bottle", "Spray Parfum Bottle", "Custom Exclusive Packaging"],
  "extrait-de-parfum": ["Glass Parfum Bottle", "Roll-On Parfum Bottle", "Spray Parfum Bottle", "Custom Exclusive Packaging"],
  "body-mist": ["Glass Parfum Bottle", "Roll-On Parfum Bottle", "Spray Parfum Bottle", "Custom Exclusive Packaging"],
  "minyak-atsiri": ["Amber Glass", "Blue Glass", "Roll-on"],
};

const haircarePackagingMap: Record<string, string[]> = {
  "shampoo": ["Pump Bottle", "Flip Top Bottle", "Squeeze Tube", "Custom Exclusive Packaging"],
  "hair-mask": ["Jar", "Tube with Nozzle", "Sachet"],
  "hair-serum": ["Dropper Bottle", "Spray Bottle", "Pump Bottle"],
  "hair-tonic": ["Dropper Bottle", "Spray Bottle", "Pump Bottle"],
  "hair-gel": ["Tube", "Flip Top Bottle", "Pump Bottle"],
  "scalp-care": ["Dropper Bottle", "Spray Bottle", "Pump Bottle"],
  "beard-serum": ["Dropper Bottle", "Pump Bottle", "Roll-on"],
  "pomade": ["Jar", "Tube", "Tin"],
  "hair-conditioner": ["Tube", "Flip Top Bottle", "Pump Bottle"],
  "hair-mist": ["Spray Bottle"],
};

const babycarePackagingMap: Record<string, string[]> = {
  "baby-lotion": ["Pump Bottle", "Tube", "Flip Top"],
  "baby-shampoo": ["Pump Bottle", "Flip Top"],
  "baby-wash": ["Pump Bottle", "Flip Top Bottle", "Custom Exclusive Packaging"],
  "baby-powder": ["Shaker Bottle", "Jar"],
  "baby-cologne": ["Glass Bottle", "Custom Exclusive Packaging"],
};

const footcarePackagingMap: Record<string, string[]> = {
  "foot-cream": ["Tube", "Jar", "Bottle Spray", "Custom Exclusive Packaging"],
  "foot-scrub": ["Jar", "Tube", "Standing Pouch", "Custom Exclusive Packaging"],
  "foot-mask": ["Sachet (Booties)", "Tube", "Jar"],
  "foot-spray": ["Spray Bottle", "Custom Exclusive Packaging"],
  "foot-soak": ["Jar", "Standing Pouch", "Custom Exclusive Packaging"],
  "foot-serum": ["Dropper Bottle", "Tube", "Custom Exclusive Packaging"],
  "foot-anti-bacterial": ["Spray Bottle", "Pump Bottle", "Lotion Tube"],
};

const pkrtPackagingMap: Record<string, string[]> = {
  "hand-sanitizer": ["Flip Top Bottle", "Custom Exclusive Packaging"],
  "hand-wash": ["Pump Bottle", "Refill Pouch", "Flip Top"],
  "disinfectant-spray": ["Refill Pouch"],
  "floor-cleaner": ["Jerigen", "Refill Pouch"],
  "room-spray": ["Custom Exclusive Packaging"],
  "bar-soap-pkrt": ["Bar", "Wrapper"],
};

const packagingMaps: Record<string, Record<string, string[]>> = {
  bodycare: bodycarePackagingMap,
  parfum: parfumPackagingMap,
  haircare: haircarePackagingMap,
  babycare: babycarePackagingMap,
  footcare: footcarePackagingMap,
  pkrt: pkrtPackagingMap,
};

const categoryIconOverrides: Record<string, string[]> = {
  bodycare: ["bottle.webp", "custom-kemasan- dreamlab-maklon-kosmetik .png"],
  haircare: ["bottle.webp", "custom-kemasan- dreamlab-maklon-kosmetik .png"],
  babycare: ["bottle.webp", "custom-kemasan- dreamlab-maklon-kosmetik .png"],
  footcare: ["maklon-kosmetik-tube.svg", "maklon-kosmetik-jar.svg", "maklon-kosmetik-spray-botol-plastik.png", "custom-kemasan- dreamlab-maklon-kosmetik .png"],
  pkrt: ["bottle.webp", "custom-kemasan- dreamlab-maklon-kosmetik .png"],
  parfum: ["bottle.webp", "custom-kemasan- dreamlab-maklon-kosmetik .png"],
};

type SubCategoryTab = { slug: string; folder: string; label: string };

const skincareSubCategoryTabs: SubCategoryTab[] = [
  { slug: "face-cream", folder: "cream", label: "Face Cream" },
  { slug: "face-mask", folder: "face-mask", label: "Face Mask" },
  { slug: "sunscreen", folder: "sunscreen", label: "Sunscreen" },
  { slug: "cleansing", folder: "cleansing", label: "Cleanser & Micellar" },
  { slug: "facial-wash", folder: "face-wash", label: "Facial Wash" },
  { slug: "facial-toner", folder: "facial-toner", label: "Facial Toner" },
  { slug: "facial-serum", folder: "facial-serum", label: "Facial Serum" },
];

const decorativeSubCategoryTabs: SubCategoryTab[] = [
  { slug: "make-up", folder: "make-up", label: "Make Up" },
  { slug: "lipcare", folder: "lipcare", label: "Lip Care" },
];

const skincareIconFiles: Record<string, string[]> = {
  cream: ["maklon-kosmetik-jar.svg", "maklon-kosmetik-tube.svg", "maklon-kosmetik-airless-pump.svg"],
  "face-mask": ["bottle.webp"],
  sunscreen: ["bottle.webp"],
  cleansing: ["bottle.webp"],
  "face-wash": ["bottle.webp"],
  "facial-toner": ["bottle.webp"],
  "facial-serum": ["bottle.webp"],
};

const decorativeIconFiles: Record<string, string[]> = {
  "make-up": ["bb-cream.webp", "foundation-serum.webp", "face-primer.webp", "mascara.webp", "eyebrow-gel.webp", "liquid-blush.webp", "cream-blush.webp", "liquid-highlighter1.webp", "foundatio.webp"],
  "lipcare": ["custom-kemasan- dreamlab-maklon-kosmetik .png"],
};

const CUSTOM_ICON = "custom-kemasan- dreamlab-maklon-kosmetik .png";

const addCustomOnce = (arr: string[]): string[] => {
  return arr.includes(CUSTOM_ICON) ? arr : [...arr, CUSTOM_ICON];
};

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/\.(jpg|png|svg|webp)$/i, "")
    .replace(/^body-/, "")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const customDisplayOverrides: Record<string, string> = {
  "custom-kemasan- dreamlab-maklon-kosmetik .png": "Custom",
  "Custom Kemasan Dreamlab Maklon Kosmetik": "Custom",
  "Custom Exclusive Packaging": "Custom",
  "Custom Product": "Custom",
  "Custom Design": "Custom",
  "Maklon Kosmetik Spray Botol Plastik": "Bottle Spray",
};

const getDisplayLabel = (value: string) => {
  if (customDisplayOverrides[value]) return customDisplayOverrides[value];
  const lower = value.toLowerCase();
  if (lower.includes("custom") && lower.includes("kemasan")) return "Custom";
  if (lower === "custom exclusive packaging" || lower === "custom product" || lower === "custom design" || lower === "custom") return "Custom";
  return value;
};

const categoryDisplayNames: Record<string, string> = {
  skincare: "Skincare",
  decorative: "Makeup",
  parfum: "Parfum",
  bodycare: "Body Care",
  haircare: "Hair Care",
  babycare: "Baby Care",
  footcare: "Foot Care",
  pkrt: "PKRT",
};

interface CategoryPackagingCardProps {
  iconName: string;
  index: number;
}

function CategoryPackagingCard({ iconName }: CategoryPackagingCardProps) {
  const imagePath = `/new asset/new-icon-packing-design/${iconName}`;
  const label = getDisplayLabel(toTitleCase(iconName));
  const isCustom = label === "Custom";

  return (
    <div className="group flex flex-col h-full">
      <div
        className={`relative aspect-square w-full rounded-[18px] overflow-hidden flex items-center justify-center mb-3 transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:transform-none ${
          isCustom
            ? "bg-[#FFF3E2]/45 border-2 border-[#F39200]"
            : "bg-[#F2EEE9]"
        }`}
      >
        <div className="relative w-4/5 h-4/5 flex items-center justify-center">
          <Image
            src={imagePath}
            alt={`Kemasan ${toTitleCase(iconName)} — opsi packaging maklon kosmetik`}
            title={`Kemasan ${toTitleCase(iconName)} — Maklon Kosmetik Dreamlab`}
            fill
            sizes="(max-width: 768px) 46vw, 250px"
            loading="lazy"
            decoding="async"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
          />
        </div>
      </div>
      <h4 className="font-sans !font-semibold text-[14px] sm:text-[15px] text-[#212120] leading-snug">
        {label}
      </h4>
    </div>
  );
}

interface FlatPackagingCardProps {
  label: string;
  imageFile: string;
  index: number;
}

function FlatPackagingCard({ label, imageFile }: FlatPackagingCardProps) {
  const imagePath = `/new asset/new-icon-packing-design/${imageFile}`;
  const displayLabel = getDisplayLabel(label);
  const isCustom = displayLabel === "Custom";

  return (
    <div className="group flex flex-col h-full">
      <div
        className={`relative aspect-square w-full rounded-[18px] overflow-hidden flex items-center justify-center mb-3 transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:transform-none ${
          isCustom
            ? "bg-[#FFF3E2]/45 border-2 border-[#F39200]"
            : "bg-[#F2EEE9]"
        }`}
      >
        <div className="relative w-4/5 h-4/5 flex items-center justify-center">
          <Image
            src={imagePath}
            alt={`Kemasan ${label} — opsi packaging maklon kosmetik`}
            title={`Kemasan ${label} — Maklon Kosmetik Dreamlab`}
            fill
            sizes="(max-width: 768px) 46vw, 250px"
            loading="lazy"
            decoding="async"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
          />
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <h4 className="font-sans !font-semibold text-[14px] sm:text-[15px] text-[#212120] leading-snug">
          {displayLabel}
        </h4>
        <p className="text-[12.5px] text-[#6B6762] mt-0.5 leading-relaxed">
          {getDisplayLabel(toTitleCase(label))}
        </p>
      </div>
    </div>
  );
}

export default function ProductPackagingGrid({ categorySlug, subCategorySlug, productSlug, bottleOptions }: ProductPackagingGridProps) {
  const displayName = categoryDisplayNames[categorySlug] || categorySlug;
  const hasCategories = categorySlug === "skincare" || categorySlug === "decorative";

  const tabs: SubCategoryTab[] = categorySlug === "skincare" ? skincareSubCategoryTabs : decorativeSubCategoryTabs;
  const iconFilesMap = categorySlug === "skincare" ? skincareIconFiles : decorativeIconFiles;
  const packagingMap = packagingMaps[categorySlug];

  // ─── SUBCATEGORY/CATEGORY VIEW (Skincare & Decorative) ───────────────────
  if (hasCategories && !productSlug) {
    const activeTab = subCategorySlug
      ? tabs.find((t) => t.slug === subCategorySlug)
      : null;

    const filteredIcons = activeTab
      ? (iconFilesMap[activeTab.folder] || [])
      : Object.values(iconFilesMap).flat().filter((v, i, a) => a.indexOf(v) === i);

    const filteredIconsWithCustom = addCustomOnce(filteredIcons);

    if (filteredIconsWithCustom.length === 0) return null;

    return (
      <section className="relative z-10 bg-white py-[64px] sm:py-[104px] overflow-hidden">
        <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
          <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-[12px]">
              Studio Kemasan
            </span>
            <h2 className="font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120]">
              Pilihan Kemasan{" "}
              <span className="text-[#F39200]">{displayName} Premium</span>
            </h2>
            <p className="mt-[14px] text-[15px] sm:text-[16px] leading-[1.6] text-[#6B6762]">
              Jelajahi koleksi kemasan {displayName.toLowerCase()} berkualitas
              tinggi yang siap dikustomisasi penuh dengan logo, warna, dan
              cetakan brand Anda.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[12px] gap-y-[24px] sm:gap-[24px] w-full">
            {filteredIconsWithCustom.map((iconName, index) => (
              <CategoryPackagingCard
                key={iconName}
                iconName={iconName}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ─── FLAT GRID VIEW (Parfum, Bodycare, Haircare, Babycare, Footcare, PKRT) ──
  const isProductPage = !!productSlug;
  const categoryIcons = !isProductPage ? categoryIconOverrides[categorySlug] : undefined;

  const packagingOptions = categoryIcons
    ? []
    : isProductPage
      ? (bottleOptions || (packagingMap ? packagingMap[productSlug] : undefined) || [])
      : (packagingMap
          ? Object.values(packagingMap).flat().filter((v, i, a) => a.indexOf(v) === i)
          : []);

  const filteredPackagingOptions = categoryIcons
    ? []
    : packagingOptions.filter((opt) => packagingOptionImageMap[opt]);

  const packagingOptionsWithCustom = categoryIcons
    ? addCustomOnce(categoryIcons)
    : filteredPackagingOptions.length > 0
      ? (filteredPackagingOptions.includes("Custom Exclusive Packaging") || filteredPackagingOptions.includes("Custom Design"))
        ? filteredPackagingOptions
        : [...filteredPackagingOptions, "Custom Exclusive Packaging"]
      : filteredPackagingOptions;

  type DedupedOption = { label: string; imageFile: string };

  const dedupedOptions: DedupedOption[] = categoryIcons
    ? []
    : (() => {
        const imageToOptions = new Map<string, string[]>();
        for (const opt of packagingOptionsWithCustom) {
          const img = packagingOptionImageMap[opt];
          if (!img) continue;
          if (!imageToOptions.has(img)) imageToOptions.set(img, []);
          imageToOptions.get(img)!.push(opt);
        }
        return Array.from(imageToOptions.entries()).map(([img, opts]) => ({
          label: opts.join(" / "),
          imageFile: img,
        }));
      })();

  // ─── SOAP 1-CARD OVERRIDE ───────────────────────────────────────────────
  const soapSlugs = ["transparent-soap", "whitening-soap", "bar-soap"];
  const isSoapProduct = !!productSlug && soapSlugs.includes(productSlug);

  if (isSoapProduct) {
    dedupedOptions.length = 0;
    dedupedOptions.push({
      label: "Bar Wrap / Kraft Box / Custom Exclusive Packaging",
      imageFile: "custom-kemasan- dreamlab-maklon-kosmetik .png",
    });
  }
  // ────────────────────────────────────────────────────────────────────────

  const allIconFiles = categoryIcons
    ? addCustomOnce(categoryIcons)
    : [];

  if (!categoryIcons && dedupedOptions.length === 0) return null;
  if (categoryIcons && allIconFiles.length === 0) return null;

  const isIconView = !!categoryIcons;

  return (
    <section className="relative z-10 bg-white py-[64px] sm:py-[104px] overflow-hidden">
      <div className="mx-auto max-w-[1240px] px-[16px] sm:px-[40px]">
        <div className="text-center max-w-[680px] mx-auto mb-[32px] sm:mb-[48px]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C86400] mb-[12px]">
            Studio Kemasan
          </span>
          <h2 className="font-display font-normal text-[clamp(28px,3.2vw,40px)] leading-[1.12] tracking-[-0.01em] text-[#212120]">
            Pilihan Kemasan{" "}
            <span className="text-[#F39200]">{displayName} Premium</span>
          </h2>
          <p className="mt-[14px] text-[15px] sm:text-[16px] leading-[1.6] text-[#6B6762]">
            Jelajahi koleksi kemasan {displayName.toLowerCase()} berkualitas
            tinggi yang siap dikustomisasi penuh dengan logo, warna, dan cetakan
            brand Anda.
          </p>
        </div>

        {isIconView ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[12px] gap-y-[24px] sm:gap-[24px] w-full">
            {allIconFiles.map((iconName, index) => (
              <CategoryPackagingCard
                key={iconName}
                iconName={iconName}
                index={index}
              />
            ))}
          </div>
        ) : dedupedOptions.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[12px] gap-y-[24px] sm:gap-[24px] w-full">
            {dedupedOptions.map((item, index) => (
              <FlatPackagingCard
                key={item.imageFile}
                label={item.label}
                imageFile={item.imageFile}
                index={index}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-[#9A958F]">
            Pilih varian produk terlebih dahulu.
          </p>
        )}
      </div>
    </section>
  );
}
