/**
 * Renders every brand icon from one vector source.
 *
 * The mark is a location pin inside an "around" ring that closes into a solid
 * arrowhead. Geometry lives here (a 64-unit square) and is shared by the web
 * favicon/PWA icons and both Expo apps, so the icon can never drift between
 * surfaces. Colours are the design tokens in src/styles.css.
 *
 *   node scripts/generate-brand-icons.mjs
 *
 * Re-run after changing the geometry or the brand palette, then commit the
 * generated PNGs (they ship as static assets).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const NAVY = "#0B2545"; // --primary
const TEAL = "#14B8A6"; // --accent
const WHITE = "#F8FAFC"; // --primary-foreground

/** Ring arc: rounded cap at 17°, clockwise all the way round into the arrowhead. */
const RING = "M49.16 37.25A17.94 17.94 0 1 1 49.84 30.13";
const RING_WIDTH = 3;
/** Solid arrowhead; its apex sits on the ring's mid-radius at 6°. */
const ARROW = "M47 27.38H55.13L49.84 33.88Z";
/** Teardrop pin: tangent lines from the tip up to an 8.2-radius head. */
const PIN = "M32 42 25.51 33.61A8.2 8.2 0 1 1 38.49 33.61Z";
const DOT = { cx: 32, cy: 28.6, r: 3.56 };

/**
 * @param {object} opts
 * @param {number} [opts.pad] extra units around the 64-unit mark (breathing room
 *   for maskable/adaptive icons, whose safe zone is the middle ~80%).
 * @param {string|null} [opts.background] tile colour, or null for transparent.
 * @param {number} [opts.radius] corner radius of the tile.
 * @param {string} [opts.pin] pin fill.
 * @param {boolean} [opts.monochrome] single-colour silhouette with the dot
 *   punched out, for Android themed icons.
 */
function markSvg({ pad = 0, background = NAVY, radius = 0, pin = WHITE, monochrome = false } = {}) {
  const min = -pad;
  const size = 64 + pad * 2;
  const tile =
    background === null
      ? ""
      : `<rect x="${min}" y="${min}" width="${size}" height="${size}" rx="${radius}" fill="${background}"/>`;

  if (monochrome) {
    // One path, evenodd: the dot becomes a hole so the tint shows through.
    const dot = `M${DOT.cx - DOT.r} ${DOT.cy}a${DOT.r} ${DOT.r} 0 1 0 ${DOT.r * 2} 0a${DOT.r} ${DOT.r} 0 1 0 ${-DOT.r * 2} 0Z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${min} ${min} ${size} ${size}" width="${size}" height="${size}">${tile}<path d="${RING}" fill="none" stroke="#FFFFFF" stroke-width="${RING_WIDTH}" stroke-linecap="round"/><path d="${ARROW}" fill="#FFFFFF"/><path d="${PIN} ${dot}" fill="#FFFFFF" fill-rule="evenodd"/></svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${min} ${min} ${size} ${size}" width="${size}" height="${size}">${tile}<path d="${RING}" fill="none" stroke="${TEAL}" stroke-width="${RING_WIDTH}" stroke-linecap="round"/><path d="${ARROW}" fill="${TEAL}"/><path d="${PIN}" fill="${pin}"/><circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" fill="${TEAL}"/></svg>`;
}

/** Readable form for the two SVGs that are committed as source files. */
function formatSvg(svg) {
  return `${svg.replace(/></g, ">\n  <").replace(/\n {2}<\/svg>/, "\n</svg>")}\n`;
}

/** Flat colour field — Android draws the adaptive foreground over this. */
function solidSvg(fill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="${fill}"/></svg>`;
}

/** @param {string} svg @param {string} out @param {number} size @param {boolean} flatten */
async function png(svg, out, size, flatten = false) {
  let img = sharp(Buffer.from(svg), { density: 2400 }).resize(size, size);
  // iOS app icons must not carry an alpha channel.
  if (flatten) img = img.flatten({ background: NAVY });
  await img.png({ compressionLevel: 9, palette: true }).toFile(out);
}

const TILE = markSvg();
/** Adaptive/maskable art: mark at ~56% of the canvas, inside the safe circle. */
const PADDED_TILE = markSvg({ pad: 12 });
const PADDED_MARK = markSvg({ pad: 12, background: null });
const PADDED_MONO = markSvg({ pad: 12, background: null, monochrome: true });
const ROUNDED_TILE = markSvg({ radius: 14 });

mkdirSync("public/icons", { recursive: true });
writeFileSync("public/favicon.svg", formatSvg(TILE));

await png(TILE, "public/icons/favicon-32.png", 32);
await png(TILE, "public/icons/icon-192.png", 192);
await png(TILE, "public/icons/icon-512.png", 512);
await png(PADDED_TILE, "public/icons/icon-maskable-512.png", 512);
await png(TILE, "public/icons/apple-touch-icon.png", 180, true);

for (const app of ["driver", "rider"]) {
  const dir = `apps/${app}/assets`;
  writeFileSync(`${dir}/mark.svg`, formatSvg(ROUNDED_TILE));
  await png(TILE, `${dir}/icon.png`, 1024, true);
  await png(TILE, `${dir}/favicon.png`, 48);
  // Splash draws on app.json's #0B2545 background, so ship the mark alone.
  await png(PADDED_MARK, `${dir}/splash-icon.png`, 512);
  await png(PADDED_MARK, `${dir}/android-icon-foreground.png`, 1024);
  await png(solidSvg(NAVY), `${dir}/android-icon-background.png`, 1024, true);
  await png(PADDED_MONO, `${dir}/android-icon-monochrome.png`, 1024);
}

console.log("Brand icons regenerated from the shared vector source.");
