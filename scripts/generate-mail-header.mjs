import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const width = 1120;
const height = 420;
const out = path.resolve("public/slimes/slimescore-mail-header-v3.png");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#073b8f"/>
      <stop offset="0.42" stop-color="#064b55"/>
      <stop offset="0.68" stop-color="#12a866"/>
      <stop offset="1" stop-color="#f26a1b"/>
    </linearGradient>
    <linearGradient id="icon" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a8ff83"/>
      <stop offset="1" stop-color="#10b96b"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="28%" r="80%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.38"/>
      <stop offset="0.54" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#061a3c" stop-opacity="0.24"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-25%" width="140%" height="155%">
      <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#061122" flood-opacity="0.45"/>
    </filter>
    <filter id="smallShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#061122" flood-opacity="0.42"/>
    </filter>
  </defs>

  <rect width="1120" height="420" rx="54" fill="url(#bg)"/>
  <rect width="1120" height="420" rx="54" fill="url(#glow)"/>
  <rect x="12" y="12" width="1096" height="396" rx="46" fill="none" stroke="#7cff9b" stroke-width="8" opacity="0.92"/>
  <path d="M0 346 C230 286 344 374 536 318 C760 252 880 312 1120 250 L1120 420 L0 420 Z" fill="#071b38" opacity="0.18"/>

  <g filter="url(#shadow)">
    <rect x="86" y="76" width="160" height="160" rx="40" fill="url(#icon)" stroke="#0d4b37" stroke-width="8"/>
    <rect x="97" y="87" width="138" height="138" rx="32" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.22"/>
    <circle cx="166" cy="156" r="50" fill="#f7fbff" stroke="#14213d" stroke-width="4"/>
    <polygon points="166,126 187,142 179,168 153,168 145,142" fill="#111827"/>
    <path d="M146 142 L127 136 M187 142 L204 136 M153 168 L140 190 M179 168 L192 190 M166 126 L166 105" stroke="#111827" stroke-width="7" stroke-linecap="round"/>
    <path d="M127 136 Q121 154 127 174 M204 136 Q211 154 204 174 M140 190 Q166 206 192 190" stroke="#111827" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
  </g>

  <g filter="url(#shadow)">
    <rect x="300" y="70" width="728" height="124" rx="62" fill="#061a3c" stroke="#eaf6ff" stroke-width="8"/>
    <rect x="314" y="84" width="700" height="96" rx="48" fill="none" stroke="#60f47c" stroke-width="3" opacity="0.32"/>
    <text x="354" y="154" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="900" font-style="italic" letter-spacing="-4" filter="url(#smallShadow)">
      <tspan fill="#ffffff">Slime</tspan><tspan fill="#ffc72c">Score</tspan><tspan fill="#dff5ff" font-size="39" letter-spacing="-1">.com</tspan>
    </text>
  </g>

  <text x="560" y="260" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="900" letter-spacing="10" fill="#ffffff" filter="url(#smallShadow)">WK 2026 VRIENDENPOULE</text>
  <rect x="214" y="296" width="692" height="68" rx="34" fill="#061a3c" opacity="0.84" stroke="#ffffff" stroke-opacity="0.22"/>
  <text x="560" y="344" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="900" fill="#ffffff" filter="url(#smallShadow)">Voorspel. Deel. Win de poule.</text>
</svg>`;

await mkdir(path.dirname(out), { recursive: true });
await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true })
  .toFile(out);

const metadata = await sharp(out).metadata();
console.log(JSON.stringify({ out, width: metadata.width, height: metadata.height, size: metadata.size }, null, 2));
