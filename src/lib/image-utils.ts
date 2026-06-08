interface ImageMeta {
  category: string;
  product: string;
  descriptor: string;
}

const CATEGORY_KEYWORDS: Record<string, { label: string; keyword: string }> = {
  skincare: { label: "Skincare", keyword: "maklon skincare" },
  facecare: { label: "Face Care", keyword: "maklon face care" },
  "skincare&facecare": { label: "Skincare", keyword: "maklon skincare" },
  bodycare: { label: "Body Care", keyword: "maklon body care" },
  babycare: { label: "Baby Care", keyword: "maklon baby care" },
  "baby-care": { label: "Baby Care", keyword: "maklon baby care" },
  haircare: { label: "Hair Care", keyword: "maklon hair care" },
  "hair-care": { label: "Hair Care", keyword: "maklon hair care" },
  footcare: { label: "Foot Care", keyword: "maklon foot care" },
  "foot-care": { label: "Foot Care", keyword: "maklon foot care" },
  parfum: { label: "Parfum", keyword: "maklon parfum" },
  decorative: { label: "Decorative", keyword: "maklon decorative makeup" },
  lipcare: { label: "Lip Care", keyword: "maklon lip care" },
  makeup: { label: "Makeup", keyword: "maklon makeup" },
  pkrt: { label: "PKRT", keyword: "maklon PKRT" },
  blog: { label: "Blog", keyword: "Dreamlab Indonesia" },
  people: { label: "People", keyword: "tim Dreamlab" },
};

const PRODUCT_KEYWORDS: Record<string, string> = {
  "day cream": "day cream",
  "night cream": "night cream",
  "day-night": "day & night cream",
  "day and night": "day & night cream",
  "face mask": "face mask",
  "facial mask": "face mask",
  sunscreen: "sunscreen",
  cleansing: "cleansing series",
  "facial wash": "facial wash",
  "face wash": "facial wash",
  toner: "facial toner",
  "facial toner": "facial toner",
  serum: "serum wajah",
  "body serum": "body serum",
  "facial serum": "serum wajah",
  "massage oil": "massage oil",
  "massage cream": "massage cream",
  "body butter": "body butter",
  "body scrub": "body scrub",
  "body wash": "body wash",
  "sabun antibakteri": "sabun antibakteri",
  "anti bacterial": "sabun antibakteri",
  "shower gel": "shower gel",
  "bath salt": "bath salt",
  "sabun organik": "sabun organik",
  "organic soap": "sabun organik",
  "sabun transparan": "sabun transparan",
  "transparant soap": "sabun transparan",
  "transparent soap": "sabun transparan",
  "underarm cream": "underarm cream",
  "sabun whitening": "sabun whitening",
  "whitening soap": "sabun whitening",
  "sabun batang": "sabun batang",
  "bar soap": "sabun batang",
  "neck cream": "neck cream",
  "soothing gel": "soothing gel",
  "baby wash": "baby 2-in-1 wash",
  "baby 2in1": "baby 2-in-1 wash",
  "baby shampoo": "baby shampoo",
  "baby moisturizer": "baby moisturizer",
  "baby cologne": "baby cologne",
  "baby oil": "baby oil",
  "baby lotion": "baby lotion",
  "baby powder": "baby powder",
  "foot cream": "foot cream",
  "foot scrub": "foot scrub",
  "foot spray": "foot spray",
  "foot soak": "foot soak",
  "foot serum": "foot serum",
  shampoo: "shampoo",
  "hair conditioner": "hair conditioner",
  conditioner: "hair conditioner",
  "hair mask": "hair mask",
  "hair tonic": "hair tonic",
  "hair gel": "hair gel",
  pomade: "pomade",
  "scalp care": "scalp care",
  "beard serum": "beard serum",
  "body mist": "body mist",
  "eau de cologne": "eau de cologne",
  "eau de parfum": "eau de parfum",
  "eau de toilette": "eau de toilette",
  "extrait de parfum": "extrait de parfum",
  "minyak atsiri": "minyak atsiri",
  "essential oil": "essential oil",
  "lip care": "lip care",
  "lip cream": "lip cream",
  "lip matte": "lip matte",
  "lip balm": "lip balm",
  "tinted lip balm": "tinted lip balm",
  "lip gloss": "lip gloss",
  "lip serum": "lip serum",
  "lip scrub": "lip scrub",
  "lip blush": "lip blush",
  foundation: "foundation",
  "bb cream": "BB cream",
  "face primer": "face primer",
  "foundation serum": "foundation serum",
  highlighter: "highlighter",
  mascara: "mascara",
  "cream blush": "cream blush",
  "liquid blush": "liquid blush",
  "eyebrow gel": "eyebrow gel",
  "hand sanitizer": "hand sanitizer",
  "hand wash": "hand wash",
  "herbal soap": "herbal soap",
  "hand sanis": "hand sanitizer",
};

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\.(webp|jpg|jpeg|png|svg)$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMetaFromPath(path: string): ImageMeta {
  const lower = path.toLowerCase();

  // Extract category from path segments
  let category = "";
  let product = "";

  // Check path for category folders
  for (const [key, val] of Object.entries(CATEGORY_KEYWORDS)) {
    if (lower.includes(key)) {
      category = val.label;
      break;
    }
  }

  // Extract filename from path
  const filename = path.split("/").pop() || "";
  const normalized = normalizeName(filename);

  // Check filename for product keywords
  for (const [key, val] of Object.entries(PRODUCT_KEYWORDS)) {
    if (normalized.includes(key)) {
      product = val;
      break;
    }
  }

  // If no product found, use a cleaned version of filename
  if (!product) {
    const cleaned = normalized
      .replace(/^(card\d+|bg-|hero-|icon-)/, "")
      .replace(/\d+$/, "")
      .replace(/\s+/g, " ")
      .trim();
    if (cleaned && cleaned.length > 2) {
      product = cleaned;
    }
  }

  // Descriptor: determine what TYPE of image this is
  let descriptor = "produk";
  if (lower.includes("hero")) descriptor = "hero banner";
  else if (lower.includes("bg-") || lower.includes("background")) descriptor = "background";
  else if (lower.includes("card")) descriptor = "produk";
  else if (lower.includes("icon")) descriptor = "ikon";
  else if (lower.includes("logo")) descriptor = "logo";
  else if (lower.includes("blog") || lower.includes("article")) descriptor = "ilustrasi artikel";
  else if (lower.includes("people") || lower.includes("team") || lower.includes("foto")) descriptor = "tim";
  else if (lower.includes("certif")) descriptor = "sertifikat";
  else if (lower.includes("client") || lower.includes("brand")) descriptor = "logo klien";
  else if (lower.includes("banner")) descriptor = "banner";

  return { category, product, descriptor };
}

export function getImageAlt(path: string, fallback?: string): string {
  const meta = extractMetaFromPath(path);

  if (meta.product && meta.category) {
    return `Maklon ${meta.product} — jasa ${meta.category.toLowerCase()} custom BPOM & Halal Dreamlab`;
  }

  if (meta.product) {
    return `Produk maklon ${meta.product} — formulasi custom BPOM Halal Dreamlab`;
  }

  if (meta.category) {
    return `Layanan maklon ${meta.category.toLowerCase()} Dreamlab — BPOM Halal siap edar`;
  }

  return fallback || "Dreamlab — jasa maklon kosmetik BPOM Halal Indonesia";
}

export function getImageTitle(path: string): string {
  const meta = extractMetaFromPath(path);

  if (meta.product && meta.category) {
    return `Jasa Maklon ${meta.product} — ${meta.category}`;
  }

  if (meta.product) {
    return `Maklon ${meta.product} Dreamlab`;
  }

  if (meta.category) {
    return `Maklon ${meta.category} Dreamlab`;
  }

  return "Dreamlab Maklon Kosmetik";
}

export function getImageProps(path: string, fallbackAlt?: string) {
  return {
    alt: getImageAlt(path, fallbackAlt),
    title: getImageTitle(path),
  };
}

export function productImageAlt(slug: string, category: string, productName?: string): string {
  const name = productName || slug.replace(/-/g, " ");
  return `Maklon ${name} — jasa maklon ${category} custom BPOM & Halal Dreamlab`;
}

export function productImageTitle(slug: string, category: string, productName?: string): string {
  const name = productName || slug.replace(/-/g, " ");
  return `Jasa Maklon ${name} — ${category} Dreamlab`;
}
