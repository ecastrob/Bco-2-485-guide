import sharp from "../node_modules/sharp/lib/index.js";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 630;
const svg = Buffer.from(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffe062"/>
      <stop offset="1" stop-color="#ffbd00"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#050505"/>
  <path d="M0 0h145L90 58H0Z" fill="url(#gold)"/>
  <path d="M0 64h99l25-24h515" fill="none" stroke="#ffcc01" stroke-width="3"/>
  <g opacity=".25" stroke="#ffcc01" stroke-width="1">
    <path d="M925 0v190M988 0v190M1051 0v190M1114 0v190M1177 0v190"/>
    <path d="M900 28h300M900 88h300M900 148h300"/>
    <path d="M0 480v150M63 480v150M126 480v150M189 480v150M252 480v150"/>
    <path d="M0 518h380M0 576h380M0 624h380"/>
  </g>
  <text x="122" y="236" font-family="Arial, Helvetica, sans-serif" font-size="126" font-weight="900" fill="url(#gold)">DELTA RAYS</text>
  <text x="122" y="388" font-family="Arial, Helvetica, sans-serif" font-size="150" font-weight="900" fill="#ffffff">3-323</text>
  <text x="548" y="388" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="900" fill="#ffffff">SOLDIER GUIDE</text>
  <path d="M122 466h1006" stroke="#ffcc01" stroke-width="4"/>
  <text x="122" y="530" font-family="Arial, Helvetica, sans-serif" font-size="39" font-weight="700" fill="#ffffff">Administrative, digital-access, and readiness resources</text>
  <path d="M792 630l65-64h343v64Z" fill="url(#gold)"/>
</svg>`);

await sharp(svg).png({ compressionLevel: 9 }).toFile(fileURLToPath(new URL("../public/og.png", import.meta.url)));
