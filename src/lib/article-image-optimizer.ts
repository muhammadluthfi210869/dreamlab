import path from "path";
import { existsSync, openSync, readSync, closeSync, statSync } from "fs";

/**
 * Server-only helper untuk meng-route gambar di body artikel ke optimizer
 * next/image (`/_next/image`) dengan resize responsif (srcset) dan intrinsic
 * width/height agar CLS = 0.
 *
 * Dipakai di server component `[...slug]/page.tsx` SAAT prerender/SSG — bukan
 * client bundle, sehingga fs tidak bocor ke JS browser.
 */

const IMG_EXT_RE = /\.(png|jpe?g|webp|gif)$/i;
const OPT_WIDTHS = [480, 640, 768, 1024, 1280];
const QUALITY = 75;
const SIZES_ATTR = "(max-width: 1024px) 100vw, 704px";
const MAX_HEADER_BYTES = 65536;

type Dims = { width: number; height: number };

const dimsCache = new Map<string, Dims | null>();

/** Baca header awal file di /public (cukup utk parse dimensi). */
function readHeader(src: string): Buffer | null {
  const pubPath = path.join(process.cwd(), "public", src);
  if (!existsSync(pubPath)) return null;
  const fd = openSync(pubPath, "r");
  try {
    const size = Math.min(MAX_HEADER_BYTES, statSync(pubPath).size);
    const buf = Buffer.alloc(size);
    readSync(fd, buf, 0, size, 0);
    return buf;
  } catch {
    return null;
  } finally {
    closeSync(fd);
  }
}

function pngDims(b: Buffer): Dims | null {
  if (b.length < 24 || b.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function jpegDims(b: Buffer): Dims | null {
  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    if (marker === 0xd8 || marker === 0xff) { i++; continue; }
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    const len = b.readUInt16BE(i + 2);
    i += len + 2;
  }
  return null;
}

function webpDims(b: Buffer): Dims | null {
  if (b.toString("ascii", 8, 12) !== "WEBP") return null;
  const fourcc = b.toString("ascii", 12, 16);
  if (fourcc === "VP8X") {
    const width = 1 + (b[24] | (b[25] << 8) | (b[26] << 16));
    const height = 1 + (b[27] | (b[28] << 8) | (b[29] << 16));
    return { width, height };
  }
  if (fourcc === "VP8L" && b.length >= 30) {
    const width = 1 + ((b[21] | (b[22] << 8)) & 0x3fff);
    const height = 1 + ((b[23] | (b[24] << 8)) & 0x3fff);
    return width > 0 && height > 0 ? { width, height } : null;
  }
  if (fourcc === "VP8 " && b.length >= 30) {
    return {
      width: b.readUInt16LE(26) & 0x3fff,
      height: b.readUInt16LE(28) & 0x3fff,
    };
  }
  return null;
}

function gifDims(b: Buffer): Dims | null {
  if (b.toString("ascii", 0, 3) !== "GIF") return null;
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

/** Dimensi intrinsik gambar lokal di /public. null kalau gagal / eksternal / SVG. */
export function getLocalImageDims(src: string): Dims | null {
  if (!/^\//.test(src) || !IMG_EXT_RE.test(src)) return null;
  if (dimsCache.has(src)) return dimsCache.get(src) ?? null;

  const header = readHeader(src);
  if (!header) return null;

  let dims: Dims | null = null;
  if (header.toString("ascii", 1, 4) === "PNG") dims = pngDims(header);
  else if (header[0] === 0xff && header[1] === 0xd8) dims = jpegDims(header);
  else if (header.toString("ascii", 0, 3) === "GIF") dims = gifDims(header);
  else dims = webpDims(header);

  dimsCache.set(src, dims);
  return dims;
}

function imageUrl(src: string, w: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${QUALITY}`;
}

function imageSrcset(src: string): string {
  return OPT_WIDTHS.map((w) => `${imageUrl(src, w)} ${w}w`).join(", ");
}

/**
 * Rewrite SEMUA <img> lokal dalam article HTML:
 * - src → /_next/image (resize + format AVIF/WebP),
 * - srcset responsif (480..1280) + sizes,
 * - width/height intrinsik (anti-CLS) + loading="lazy" decoding="async".
 * Gambar eksternal / tidak dapat dibaca → biarkan apa adanya (return asli).
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