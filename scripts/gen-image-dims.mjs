import { readdirSync, openSync, readSync, closeSync, statSync, existsSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Scan seluruh gambar pada /public, parse dimensi intrinsik dari header file
 * (PNG/JPEG/WebP/GIF), lalu tulis manifest ke `src/data/image-dims.json`.
 *
 * Manifest dipakai oleh `article-image-optimizer` (server) supaya dimensi
 * gambar tersedia TANPA membaca filesystem saat prerender/ISR. Ini menghindari
 * file-tracer Next.js menarik SELURUH folder public ke dalam Vercel function.
 *
 * Jalankan: `node scripts/gen-image-dims.mjs` (otomatis lewat `npm run build`).
 */

const IMG_EXT_RE = /\.(png|jpe?g|webp|gif)$/i;
const MAX_HEADER_BYTES = 65536;
const PUBLIC_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public",
);
const OUT_FILE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/data/image-dims.json",
);

if (!existsSync(PUBLIC_DIR)) {
  console.error("[gen-image-dims] public/ tidak ditemukan");
  process.exit(1);
}

/** Scan rekursif, kembalikan daftar path absolut semua file di public/. */
function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) files.push(...walk(full));
    else if (st.isFile()) files.push(full);
  }
  return files;
}

/** Baca header file (maks 64KB) untuk parsing dimensi. */
function readHeader(file) {
  const size = Math.min(MAX_HEADER_BYTES, statSync(file).size);
  const buf = Buffer.alloc(size);
  const fd = openSync(file, "r");
  try {
    readSync(fd, buf, 0, size, 0);
    return buf;
  } finally {
    closeSync(fd);
  }
}

function pngDims(b) {
  if (b.length < 24 || b.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function jpegDims(b) {
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

function webpDims(b) {
  if (b.toString("ascii", 8, 12) !== "WEBP") return null;
  const fourcc = b.toString("ascii", 12, 16);
  if (fourcc === "VP8X") {
    return {
      width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)),
      height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)),
    };
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

function gifDims(b) {
  if (b.toString("ascii", 0, 3) !== "GIF") return null;
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

function dimsOf(file) {
  const buf = readHeader(file);
  let dims = null;
  if (buf.toString("ascii", 1, 4) === "PNG") dims = pngDims(buf);
  else if (buf[0] === 0xff && buf[1] === 0xd8) dims = jpegDims(buf);
  else if (buf.toString("ascii", 0, 3) === "GIF") dims = gifDims(buf);
  else dims = webpDims(buf);
  return dims;
}

let ok = 0;
let fail = 0;
const manifest = {};

for (const file of walk(PUBLIC_DIR)) {
  if (!IMG_EXT_RE.test(file)) continue;
  const rel = path.relative(PUBLIC_DIR, file).split(path.sep).join("/");
  const url = `/${rel}`;
  const dims = dimsOf(file);
  if (dims) {
    manifest[url] = dims;
    ok++;
  } else {
    fail++;
    console.warn(`[gen-image-dims] gagal parse: ${url}`);
  }
}

writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2));
console.log(
  `[gen-image-dims] ${ok} gambar ter-manifest (${fail} gagal parse) -> ${OUT_FILE.replace(process.cwd() + "/", "")} (${(statSync(OUT_FILE).size / 1024).toFixed(1)} KB)`,
);