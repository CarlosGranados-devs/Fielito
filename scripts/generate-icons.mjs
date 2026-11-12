/**
 * Genera los íconos PNG de Fielito sin dependencias externas.
 * Uso: npm run icons
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "icons");
mkdirSync(OUT, { recursive: true });

const AMBER_LIGHT = [251, 191, 36];
const AMBER = [245, 158, 11];
const AMBER_DARK = [217, 119, 6];
const WHITE = [255, 255, 255];
const SS = 4; // supersampling

function mix(a, b, t) {
  return a.map((value, index) => Math.round(value + (b[index] - value) * t));
}

function insideRoundedRect(x, y, size, radius) {
  const r = radius;
  if (x >= r && x <= size - r) return true;
  if (y >= r && y <= size - r) return true;
  const corners = [
    [r, r],
    [size - r, r],
    [r, size - r],
    [size - r, size - r],
  ];
  return corners.some(([cx, cy]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r);
}

function insideRoundedBar(x, y, x0, y0, x1, y1, radius) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const r = Math.min(radius, (x1 - x0) / 2, (y1 - y0) / 2);
  if (x >= x0 + r && x <= x1 - r) return true;
  if (y >= y0 + r && y <= y1 - r) return true;
  const corners = [
    [x0 + r, y0 + r],
    [x1 - r, y0 + r],
    [x0 + r, y1 - r],
    [x1 - r, y1 - r],
  ];
  return corners.some(([cx, cy]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r);
}

function drawIcon(size, { maskable = false } = {}) {
  const big = size * SS;
  const buffer = new Uint8ClampedArray(big * big * 4);
  const radius = maskable ? big / 2.2 : big * 0.28;
  const contentScale = maskable ? 0.72 : 1;
  const offset = (big - big * contentScale) / 2;

  const barW = big * 0.1;
  const fX = offset + big * 0.3;
  const fTop = offset + big * 0.27;
  const fBottom = offset + big * 0.74;
  const fRight = offset + big * 0.69;
  const dotCx = offset + big * 0.72;
  const dotCy = offset + big * 0.715;
  const dotR = big * 0.048;

  for (let y = 0; y < big; y += 1) {
    for (let x = 0; x < big; x += 1) {
      const index = (y * big + x) * 4;
      const inShape = maskable ? true : insideRoundedRect(x, y, big, radius);
      if (!inShape) {
        buffer[index + 3] = 0;
        continue;
      }

      const t = Math.min(Math.max((x / big) * 0.55 + (y / big) * 0.45, 0), 1);
      let color = t < 0.55 ? mix(AMBER_LIGHT, AMBER, t / 0.55) : mix(AMBER, AMBER_DARK, (t - 0.55) / 0.45);

      const inVertical = insideRoundedBar(x, y, fX, fTop, fX + barW, fBottom, barW / 2);
      const inTop = insideRoundedBar(
        x,
        y,
        fX,
        fTop,
        fRight,
        fTop + barW,
        barW / 2,
      );
      const inMiddle = insideRoundedBar(
        x,
        y,
        fX,
        fTop + (fBottom - fTop) * 0.42,
        fX + barW * 2.55,
        fTop + (fBottom - fTop) * 0.42 + barW,
        barW / 2,
      );
      const inDot = (x - dotCx) ** 2 + (y - dotCy) ** 2 <= dotR * dotR;

      if (inVertical || inTop || inMiddle || inDot) color = WHITE;

      buffer[index] = color[0];
      buffer[index + 1] = color[1];
      buffer[index + 2] = color[2];
      buffer[index + 3] = 255;
    }
  }

  // Downsample (box filter)
  const out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let dy = 0; dy < SS; dy += 1) {
        for (let dx = 0; dx < SS; dx += 1) {
          const index = ((y * SS + dy) * big + (x * SS + dx)) * 4;
          r += buffer[index];
          g += buffer[index + 1];
          b += buffer[index + 2];
          a += buffer[index + 3];
        }
      }
      const count = SS * SS;
      const outIndex = (y * size + x) * 4;
      out[outIndex] = Math.round(r / count);
      out[outIndex + 1] = Math.round(g / count);
      out[outIndex + 2] = Math.round(b / count);
      out[outIndex + 3] = Math.round(a / count);
    }
  }
  return out;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeBuffer = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function encodePng(size, pixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    raw[y * (size * 4 + 1)] = 0;
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const outputs = [
  ["icon-512.png", 512, false],
  ["icon-192.png", 192, false],
  ["maskable-512.png", 512, true],
  ["apple-touch-icon.png", 180, false],
  ["favicon-32.png", 32, false],
];

for (const [name, size, maskable] of outputs) {
  const pixels = drawIcon(size, { maskable });
  writeFileSync(join(OUT, name), encodePng(size, pixels));
  console.log(`✓ ${name}`);
}
