import imageDims from "@/data/image-dims.json";

/**
 * Server-only helper untuk meng-route gambar di body artikel ke optimizer
 * next/image (`/_next/image`) dengan resize responsif (srcset) dan intrinsic
 * width/height agar CLS = 0.
 *
 * Dimensi gambar diambil dari manifest build-time (`src/data/image-dims.json`,
 * dihasilkan `scripts/gen-image-dims.mjs`) — TIDAK membaca filesystem saat
 * prerender/ISR, sehingga file-tracer Next.js tidak menarik seluruh folder
 * public ke dalam Vercel function.
 *
 * Dipakai di server component `[...slug]/page.tsx` SAAT prerender/SSG — bukan
 * client bundle, sehingga fs tidak bocor ke JS browser.
 */

const IMG_EXT_RE = /\.(png|jpe?g|webp|gif)$/i;
const OPT_WIDTHS = [480, 640, 768, 1024, 1280];
const QUALITY = 75;
const SIZES_ATTR = "(max-width: 1024px) 100vw, 704px";

type Dims = { width: number; height: number };

/** Dimensi intrinsik gambar lokal di /public (dari manifest). null kalau tidak dikenal / eksternal / SVG. */
export function getLocalImageDims(src: string): Dims | null {
  if (!/^\//.test(src) || !IMG_EXT_RE.test(src)) return null;
  return (imageDims as Record<string, Dims>)[src] ?? null;
}

function imageUrl(src: string, w: number): string {
  return `/_next/image/?url=${encodeURIComponent(src)}&w=${w}&q=${QUALITY}`;
}

function imageSrcset(src: string): string {
  return OPT_WIDTHS.map((w) => `${imageUrl(src, w)} ${w}w`).join(", ");
}

/**
 * Rewrite SEMUA <img> lokal dalam article HTML:
 * - src → /_next/image (resize + format AVIF/WebP),
 * - srcset responsif (480..1280) + sizes,
 * - width/height intrinsik (anti-CLS) + loading="lazy" decoding="async".
 * Gambar eksternal / tidak dikenal di manifest → biarkan apa adanya (return asli).
 */
export function optimizeArticleImages(html: string): string {
  return html.replace(/<img\b([^>]*)>/gi, (full, attrs: string) => {
    // Ambil URL dari src, lalu fallback ke bv-data-src / data-src (gaya WP).
    const srcM = /src=["']([^"']+)["']/i.exec(attrs);
    const dataSrcM = /(?:bv-data-src|data-src)=["']([^"']+)["']/i.exec(attrs);
    const urlMatch = srcM ?? dataSrcM;
    if (!urlMatch) return full;
    const src = urlMatch[1];
    if (/^data:/i.test(src) || /^https?:/i.test(src)) return full;

    const dims = getLocalImageDims(src);
    if (!dims) return full;

    const renderWidth = Math.min(1280, dims.width);
    const cleanAttrs = attrs
      .replace(/src=["'][^"']*["']/i, "")
      .replace(/srcset=["'][^"']*["']/gi, "")
      .replace(/sizes=["'][^"']*["']/gi, "")
      .replace(/bv-data-src=["'][^"']*["']/gi, "")
      .replace(/data-src=["'][^"']*["']/gi, "")
      .replace(/width=["']\d+["']/gi, "")
      .replace(/height=["']\d+["']/gi, "")
      .replace(/\sloading=["'][^"']*["']/gi, "")
      .replace(/\sdecoding=["'][^"']*["']/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    return (
      `<img ${cleanAttrs}` +
      ` src="${imageUrl(src, renderWidth)}"` +
      ` srcset="${imageSrcset(src)}"` +
      ` sizes="${SIZES_ATTR}"` +
      ` width="${dims.width}"` +
      ` height="${dims.height}"` +
      ` loading="lazy" decoding="async">`
    );
  });
}