// Cutout-script voor slime-avatars: bron-art op (nagenoeg) witte achtergrond ->
// transparante, geoptimaliseerde WebP. Gebruikt een edge-connected flood-fill
// vanaf de rand, zodat witte vlakken BINNEN het onderwerp (bijv. een voetbal)
// niet per ongeluk worden weggeknipt.
//
// Gebruik: node scripts/cutout-slime.mjs <input> <output.webp> [maat] [drempel]
//   maat    : vierkante uitvoer in px (default 700)
//   drempel : afstand-tot-wit waaronder een pixel als achtergrond telt (default 32)

import sharp from "sharp";

const [, , inPath, outPath, sizeArg, thArg] = process.argv;
if (!inPath || !outPath) {
  console.error("Gebruik: node scripts/cutout-slime.mjs <input> <output.webp> [maat] [drempel]");
  process.exit(1);
}
const SIZE = Number(sizeArg ?? 700);
const TH = Number(thArg ?? 32);

const { data, info } = await sharp(inPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info; // channels = 4 (RGBA)
const at = (x, y) => (y * width + x) * channels;
const isBg = (i) => data[i] >= 255 - TH && data[i + 1] >= 255 - TH && data[i + 2] >= 255 - TH;

const visited = new Uint8Array(width * height);
const stack = [];
const seed = (x, y) => {
  const p = y * width + x;
  if (!visited[p] && isBg(at(x, y))) {
    visited[p] = 1;
    stack.push(p);
  }
};
for (let x = 0; x < width; x++) {
  seed(x, 0);
  seed(x, height - 1);
}
for (let y = 0; y < height; y++) {
  seed(0, y);
  seed(width - 1, y);
}
while (stack.length) {
  const p = stack.pop();
  const x = p % width;
  const y = (p - x) / width;
  data[at(x, y) + 3] = 0; // transparant
  if (x > 0) seed(x - 1, y);
  if (x < width - 1) seed(x + 1, y);
  if (y > 0) seed(x, y - 1);
  if (y < height - 1) seed(x, y + 1);
}

await sharp(data, { raw: { width, height, channels } })
  .resize({ width: SIZE, height: SIZE, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 90 })
  .toFile(outPath);

console.log(`OK -> ${outPath} (${SIZE}x${SIZE}, drempel ${TH})`);
