/**
 * Kompres asset gambar di folder blog — format-preserving (tanpa ubah nama file)
 * supaya SEMUA referensi HTML/og/meta/renderer tetap valid.
 *
 * Cara pakai:
 *   node scripts/compress-blog-images.mjs             # kompres sekali
 *   node scripts/compress-blog-images.mjs --check     # simulasi / laporan saja
 *
 * Strategi per format:
 *   - .webp → re-encode quality 76 + resize maxWidth 1600
 *   - .jpg  → re-encode quality 80 (mozjpeg) + resize maxWidth 1600
 *   - .png  → resize maxWidth 1600 + compress PNG (palette untuk yang reducible).
 *             Foto PNG besar biasanya tersisa di atas target — dicatat di
 *             ringkasan; saat disaji browser sudah melewati /_next/image (AVIF).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "assets", "images", "blog");
const MAX_WIDTH = 1600;
const TARGET_KB = 200;
const CHECK_ONLY = process.argv.includes("--check");

const EXTS = [".png", ".jpg", ".jpeg", ".webp"];

function walkFiles(dir, acc) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name);
    const st = fs.statSync(fp);
    if (st.isDirectory()) walkFiles(fp, acc);
    else if (EXTS.some((e) => name.toLowerCase().endsWith(e))) acc.push(fp);
  }
  return acc;
}

const sizeKb = (bytes) => Math.round((bytes / 1024) * 10) / 10;

async function reencode(p) {
  const image = sharp(p, { failOn: "none" });
  const md = await image.metadata();
  if (!md.width || !md.height) return null;
  const resized = image.resize({ width: Math.min(md.width, MAX_WIDTH), withoutEnlargement: true });
  switch (md.format) {
    case "webp":
      return resized.webp({ quality: 76, effort: 6 }).toBuffer();
    case "jpeg":
      return resized.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    case "png": {
      const lossless = await resized.clone().png({ compressionLevel: 9 }).toBuffer();
      const losslessKb = sizeKb(lossless.length);
      if (losslessKb >= 400) return null; // hasil masih besar → tanpa kompres raw (tetap disaji via optimizer)
      const paletteBuf = await resized.clone().png({ compressionLevel: 9, palette: true, adaptiveFiltering: true }).toBuffer();
      const paletteKb = sizeKb(paletteBuf.length);
      if (paletteKb < 250 && paletteKb <= losslessKb * 0.5) return paletteBuf;
      return lossless;
    }
    default:
      return null;
  }
}

async function main() {
  const files = walkFiles(ROOT, []);
  const rows = [];
  let totalSaved = 0;

  for (const f of files) {
    const before = sizeKb(fs.statSync(f).size);
    // stat dihitung ulang setelah penulis
    let after = before, note = "skip";
    if (before >= TARGET_KB) {
      let buf;
      try {
        buf = await reencode(f);
      } catch (e) {
        note = "ERR " + e.message;
      }
      if (buf) {
        const newKb = sizeKb(buf.length);
        if (newKb < before) {
          if (!CHECK_ONLY) fs.writeFileSync(f, buf);
          totalSaved += before - newKb;
          after = newKb;
          note = newKb >= TARGET_KB ? "big-remain" : "ok";
        } else {
          note = "no-gain";
        }
      }
    }
    rows.push({ f, before, after, note });
  }

  const written = rows.filter(r => r.note === "ok").length;
  console.log(`\nFiles total: ${rows.length}`);
  console.log(`Terkompres: ${written}  (total hemat ${Math.round(totalSaved)} KB)`);

  console.log(`\nDetail (before → after):`);
  rows
    .filter(r => r.before >= TARGET_KB)
    .sort((a, b) => b.before - a.before)
    .forEach((r) => {
      const flag = r.note === "ok" ? "" : ` [${r.note}]`;
      console.log(`  ${r.before} → ${r.after} KB  ${path.basename(r.f)}${flag}`);
    });

  const stillBig = rows.filter(r => r.after >= TARGET_KB);
  console.log(`\nMasih >= ${TARGET_KB}KB (${stillBig.length} file):`);
  stillBig
    .sort((a, b) => b.after - a.after)
    .forEach((r) => console.log(`  ${r.after} KB  ${path.basename(r.f)}`));

  if (CHECK_ONLY) console.log("\n--check mode: TIDAK ada file yang ditulis.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});