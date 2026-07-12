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
  "Jar / Pot": "maklon-kosmetik-jar.svg",
  "Pot": "maklon-kosmetik-jar.svg",
  "Sifter Jar": "maklon-kosmetik-jar.svg",

  "Standing Pouch": "maklon-kosmetik-standing-pouch.svg",
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

function CategoryPackagingCard({ iconName, index }: CategoryPackagingCardProps) {
  const { ref, isInView } = useInView();
  const imagePath = `/new asset/new-icon-packing-design/${iconName}`;

  return (
    <div
      ref={ref as any}
      className={`group flex flex-col bg-white p-4 rounded-[28px] border border-gray-100 transition-all duration-700 hover:shadow-xl hover:shadow-brand-orange/5 hover:-translate-y-1.5 h-full ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-square w-full rounded-[20px] overflow-hidden flex items-center justify-center mb-4 bg-[#FAF9F6] border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-100/5 via-transparent to-transparent" />
        <div className="relative w-4/5 h-4/5 transition-transform duration-500 group-hover:scale-108 flex items-center justify-center">
          <Image
            src={imagePath}
            alt={`Kemasan ${toTitleCase(iconName)} — opsi packaging maklon kosmetik`}
            title={`Kemasan ${toTitleCase(iconName)} — Maklon Kosmetik Dreamlab`}
            fill
            sizes="(max-width: 768px) 50vw, 250px"
            loading="lazy"
            decoding="async"
            className="object-contain p-2 transition-transform"
          />
        </div>
      </div>
      <div className="flex flex-col flex-grow">
        <h4 className="font-onest text-sm md:text-base font-bold text-[#212120] leading-snug tracking-tight flex-grow transition-colors group-hover:text-brand-orange">
          {getDisplayLabel(toTitleCase(iconName))}
        </h4>
      </div>
    </div>
  );
}

interface FlatPackagingCardProps {
  label: string;
  imageFile: string;
  index: number;
}

function FlatPackagingCard({ label, imageFile, index }: FlatPackagingCardProps) {
  const { ref, isInView } = useInView();
  const imagePath = `/new asset/new-icon-packing-design/${imageFile}`;

  return (
    <div
      ref={ref as any}
      className={`group flex flex-col bg-white p-4 rounded-[28px] border border-gray-100 transition-all duration-700 hover:shadow-xl hover:shadow-brand-orange/5 hover:-translate-y-1.5 h-full ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-square w-full rounded-[20px] overflow-hidden flex items-center justify-center mb-4 bg-[#FAF9F6] border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-100/5 via-transparent to-transparent" />
        <div className="relative w-4/5 h-4/5 transition-transform duration-500 group-hover:scale-108 flex items-center justify-center">
          <Image
            src={imagePath}
            alt={`Kemasan ${label} — opsi packaging maklon kosmetik`}
            title={`Kemasan ${label} — Maklon Kosmetik Dreamlab`}
            fill
            sizes="(max-width: 768px) 50vw, 250px"
            loading="lazy"
            decoding="async"
            className="object-contain p-2 transition-transform"
          />
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <h4 className="font-onest text-sm md:text-base font-bold text-[#212120] leading-snug tracking-tight flex-grow transition-colors group-hover:text-brand-orange">
          {getDisplayLabel(label)}
        </h4>
        <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">
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
      <section className="relative z-10 bg-gradient-to-b from-white via-[#FAF9F6] to-white py-16 lg:py-24 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-brand-orange/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-brand-orange/3 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="flex flex-col gap-10 w-full">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-orange/10 rounded-full border border-brand-orange/20">
                <Palette className="w-3.5 h-3.5 text-brand-orange" />
                <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em]">Studio Kemasan</span>
              </div>
              <h2 className="font-display text-[28px] md:text-[36px] lg:text-[42px] font-normal text-[#212120] leading-tight">
                Pilihan Kemasan <span className="text-brand-orange font-bold">{displayName} Premium</span>
              </h2>
              <p className="text-sm text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
                Jelajahi koleksi kemasan {displayName.toLowerCase()} berkualitas tinggi yang siap dikustomisasi penuh dengan logo, warna, dan cetakan brand Anda.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 xl:gap-8 w-full">
              {filteredIconsWithCustom.map((iconName, index) => (
                <CategoryPackagingCard
                  key={iconName}
                  iconName={iconName}
                  index={index}
                />
              ))}
            </div>
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
    <section className="relative z-10 bg-gradient-to-b from-white via-[#FAF9F6] to-white py-16 lg:py-24 overflow-hidden border-b border-gray-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-brand-orange/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-brand-orange/3 rounded-full blur-3xl" />
      </div>
      <div className="container-custom relative z-10">
        <div className="flex flex-col gap-10 w-full">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-orange/10 rounded-full border border-brand-orange/20">
              <Palette className="w-3.5 h-3.5 text-brand-orange" />
              <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em]">Studio Kemasan</span>
            </div>
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[42px] font-normal text-[#212120] leading-tight">
              Pilihan Kemasan <span className="text-brand-orange font-bold">{displayName} Premium</span>
            </h2>
            <p className="text-sm text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
              Jelajahi koleksi kemasan {displayName.toLowerCase()} berkualitas tinggi yang siap dikustomisasi penuh dengan logo, warna, dan cetakan brand Anda.
            </p>
          </div>

          {isIconView ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 xl:gap-8 w-full">
              {allIconFiles.map((iconName, index) => (
                <CategoryPackagingCard
                  key={iconName}
                  iconName={iconName}
                  index={index}
                />
              ))}
            </div>
          ) : dedupedOptions.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 xl:gap-8 w-full">
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
            <p className="text-center text-gray-400">Pilih varian produk terlebih dahulu.</p>
          )}
        </div>
      </div>
    </section>
  );
}
