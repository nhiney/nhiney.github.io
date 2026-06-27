/**
 * Free local blog cover generator.
 *
 * Creates documentary-inspired editorial illustrations from local metadata only.
 * No API, no network, no paid image model. Outputs one cover per post at
 * public/images/blog/<slug>.webp when sharp is available, otherwise .png.
 *
 *   node scripts/generate-blog-free-covers.mjs
 *   node scripts/generate-blog-free-covers.mjs --force
 */

import matter from "gray-matter";
import { Resvg } from "@resvg/resvg-js";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { getBlogImageMeta } from "../lib/blog-image-prompt.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BLOG_DIR = resolve(ROOT, "content/blog");
const OUT_DIR = resolve(ROOT, "public/images/blog");
const WIDTH = 1200;
const HEIGHT = 675;
const LOCALE_VARIANT_RE = /\.(en|vi|ja|zh|es|fr|de|ko|ru|pt)\.mdx?$/;
const EXTS = ["webp", "avif", "jpg", "jpeg", "png"];
const force = process.argv.includes("--force");

mkdirSync(OUT_DIR, { recursive: true });

let sharp = null;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  sharp = null;
}

const PALETTES = {
  writing: ["#f8efe2", "#fffaf3", "#d97706", "#7c2d12", "#334155"],
  self: ["#fae8ee", "#fff7f9", "#be3455", "#7f1d1d", "#334155"],
  slow: ["#e4f6ed", "#f8fffb", "#059669", "#064e3b", "#334155"],
  tech: ["#e7edf5", "#fbfdff", "#2563eb", "#1e3a8a", "#334155"],
  books: ["#f8efd9", "#fffaf0", "#b7791f", "#713f12", "#334155"],
  default: ["#eceff3", "#fffefd", "#64748b", "#334155", "#475569"],
};

const TAG_TO_TINT = {
  Discipline: "writing",
  Habits: "writing",
  Consistency: "writing",
  Focus: "writing",
  Creativity: "writing",
  Work: "writing",
  Money: "writing",
  Letter: "writing",
  Communication: "writing",
  "Self Worth": "self",
  Healing: "self",
  "Self Compassion": "self",
  Rest: "self",
  Comparison: "self",
  Identity: "self",
  "Slow Living": "slow",
  Mindfulness: "slow",
  "Letting Go": "slow",
  Growth: "slow",
  Solitude: "slow",
  Patience: "slow",
  Silence: "slow",
  Technology: "tech",
  "Imposter Syndrome": "tech",
  Minimalism: "tech",
  Books: "books",
  Learning: "books",
  Reflection: "books",
};

function tintFor(tags = []) {
  for (const tag of tags) {
    if (TAG_TO_TINT[tag]) return TAG_TO_TINT[tag];
  }
  return "default";
}

function existingCover(slug) {
  for (const ext of EXTS) {
    const file = resolve(OUT_DIR, `${slug}.${ext}`);
    if (existsSync(file)) return file;
  }
  return null;
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };
    return map[char];
  });
}

function hash(value) {
  let h = 2166136261;
  for (const char of value) {
    h ^= char.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function person(x, y, scale, color = "#1f2937", pose = "standing") {
  const s = scale;
  const head = `<circle cx="${x}" cy="${y - 58 * s}" r="${15 * s}" fill="${color}" opacity=".88"/>`;
  if (pose === "sitting") {
    return `
      ${head}
      <path d="M${x - 13 * s} ${y - 39 * s} Q${x} ${y - 20 * s} ${x + 12 * s} ${y - 2 * s}" fill="none" stroke="${color}" stroke-width="${15 * s}" stroke-linecap="round"/>
      <path d="M${x - 6 * s} ${y - 8 * s} Q${x - 32 * s} ${y + 12 * s} ${x - 54 * s} ${y + 20 * s}" fill="none" stroke="${color}" stroke-width="${11 * s}" stroke-linecap="round"/>
      <path d="M${x + 7 * s} ${y - 6 * s} Q${x + 32 * s} ${y + 10 * s} ${x + 58 * s} ${y + 13 * s}" fill="none" stroke="${color}" stroke-width="${11 * s}" stroke-linecap="round"/>
      <path d="M${x - 3 * s} ${y - 24 * s} Q${x - 32 * s} ${y - 16 * s} ${x - 42 * s} ${y}" fill="none" stroke="${color}" stroke-width="${8 * s}" stroke-linecap="round"/>
      <path d="M${x + 8 * s} ${y - 25 * s} Q${x + 34 * s} ${y - 23 * s} ${x + 50 * s} ${y - 8 * s}" fill="none" stroke="${color}" stroke-width="${8 * s}" stroke-linecap="round"/>
    `;
  }
  if (pose === "walking") {
    return `
      ${head}
      <path d="M${x - 8 * s} ${y - 38 * s} Q${x + 10 * s} ${y - 13 * s} ${x + 4 * s} ${y + 18 * s}" fill="none" stroke="${color}" stroke-width="${15 * s}" stroke-linecap="round"/>
      <path d="M${x} ${y + 12 * s} Q${x - 28 * s} ${y + 37 * s} ${x - 42 * s} ${y + 70 * s}" fill="none" stroke="${color}" stroke-width="${10 * s}" stroke-linecap="round"/>
      <path d="M${x + 5 * s} ${y + 13 * s} Q${x + 28 * s} ${y + 35 * s} ${x + 42 * s} ${y + 65 * s}" fill="none" stroke="${color}" stroke-width="${10 * s}" stroke-linecap="round"/>
      <path d="M${x - 3 * s} ${y - 22 * s} Q${x - 30 * s} ${y - 6 * s} ${x - 45 * s} ${y + 10 * s}" fill="none" stroke="${color}" stroke-width="${8 * s}" stroke-linecap="round"/>
      <path d="M${x + 7 * s} ${y - 23 * s} Q${x + 30 * s} ${y - 18 * s} ${x + 45 * s} ${y - 4 * s}" fill="none" stroke="${color}" stroke-width="${8 * s}" stroke-linecap="round"/>
    `;
  }
  return `
    ${head}
    <path d="M${x} ${y - 39 * s} Q${x + 3 * s} ${y - 9 * s} ${x} ${y + 26 * s}" fill="none" stroke="${color}" stroke-width="${15 * s}" stroke-linecap="round"/>
    <path d="M${x} ${y + 22 * s} Q${x - 20 * s} ${y + 54 * s} ${x - 32 * s} ${y + 84 * s}" fill="none" stroke="${color}" stroke-width="${10 * s}" stroke-linecap="round"/>
    <path d="M${x + 2 * s} ${y + 22 * s} Q${x + 22 * s} ${y + 52 * s} ${x + 34 * s} ${y + 83 * s}" fill="none" stroke="${color}" stroke-width="${10 * s}" stroke-linecap="round"/>
    <path d="M${x - 3 * s} ${y - 20 * s} Q${x - 28 * s} ${y - 8 * s} ${x - 44 * s} ${y + 10 * s}" fill="none" stroke="${color}" stroke-width="${8 * s}" stroke-linecap="round"/>
    <path d="M${x + 5 * s} ${y - 20 * s} Q${x + 28 * s} ${y - 8 * s} ${x + 44 * s} ${y + 10 * s}" fill="none" stroke="${color}" stroke-width="${8 * s}" stroke-linecap="round"/>
  `;
}

function room(p, slug) {
  const n = hash(slug);
  const bokeh = Array.from({ length: 16 }, (_, i) => {
    const x = 760 + ((n >> (i % 12)) % 330);
    const y = 80 + ((n >> ((i + 5) % 16)) % 330);
    const r = 3 + ((n >> ((i + 9) % 20)) % 9);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${p[2]}" opacity=".12"/>`;
  }).join("");

  return `
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${p[0]}"/>
    <rect x="36" y="32" width="1128" height="611" rx="42" fill="${p[1]}" stroke="#d8dee8"/>
    <circle cx="104" cy="88" r="92" fill="${p[2]}" opacity=".08"/>
    <circle cx="1060" cy="555" r="156" fill="${p[3]}" opacity=".06"/>
    <path d="M36 500 C290 458 420 550 644 508 S982 466 1164 522" fill="none" stroke="${p[2]}" stroke-opacity=".08" stroke-width="2"/>
    <circle cx="116" cy="104" r="7" fill="${p[2]}" opacity=".58"/>
    <circle cx="992" cy="112" r="9" fill="${p[2]}" opacity=".18"/>
    <circle cx="1046" cy="140" r="5" fill="${p[2]}" opacity=".14"/>
    ${bokeh}
  `;
}

function sceneSvg(scene, p) {
  const ink = p[3];
  const accent = p[2];
  const muted = p[4];

  const table = `<path d="M170 468 H1005" stroke="${muted}" stroke-opacity=".28" stroke-width="16" stroke-linecap="round"/>`;
  const mug = (x, y) => `
    <path d="M${x} ${y} v42 q0 16 16 16 h36 q16 0 16-16 v-42 z" fill="#fff" stroke="${accent}" stroke-opacity=".45" stroke-width="4"/>
    <path d="M${x + 68} ${y + 10} q24 0 24 20 q0 22-24 22" fill="none" stroke="${accent}" stroke-opacity=".45" stroke-width="4"/>
    <path d="M${x + 18} ${y - 18} q-10 14 4 25 M${x + 42} ${y - 18} q-10 14 4 25" fill="none" stroke="${accent}" stroke-opacity=".42" stroke-width="3"/>
  `;

  if (scene === "laptop") {
    return `
      ${table}
      <rect x="420" y="258" width="310" height="180" rx="18" fill="#eaf1ff" stroke="${accent}" stroke-opacity=".36" stroke-width="5"/>
      <path d="M386 438 H766 L730 482 H424 Z" fill="#dce7f5" stroke="${accent}" stroke-opacity=".28" stroke-width="5"/>
      ${person(324, 394, 1.24, ink, "sitting")}
      ${mug(812, 392)}
      <rect x="222" y="462" width="96" height="18" rx="9" fill="${accent}" opacity=".18"/>
      <path d="M498 322 h150 M498 354 h104" stroke="${accent}" stroke-opacity=".20" stroke-width="10" stroke-linecap="round"/>
    `;
  }

  if (scene === "plant") {
    return `
      <rect x="735" y="112" width="260" height="292" rx="22" fill="#ffffff" stroke="${accent}" stroke-opacity=".18" stroke-width="5"/>
      <path d="M865 112 v292 M735 258 h260" stroke="${accent}" stroke-opacity=".16" stroke-width="4"/>
      <path d="M720 436 H1010" stroke="${muted}" stroke-opacity=".20" stroke-width="16" stroke-linecap="round"/>
      <path d="M820 436 h96 l-15 86 h-66 z" fill="#fff" stroke="${accent}" stroke-opacity=".48" stroke-width="5"/>
      <path d="M868 432 C850 372 808 350 780 332 M874 432 C888 360 925 336 960 315 M872 432 C872 382 876 350 872 306" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
      <path d="M780 332 q-38-12-48 26 q42 8 48-26 M960 315 q38-20 56 18 q-44 17-56-18 M872 306 q-32-30-65-2 q34 28 65 2" fill="${accent}" opacity=".26"/>
      ${person(520, 442, 1.15, ink, "standing")}
      <path d="M565 392 q80-30 162-2" fill="none" stroke="${accent}" stroke-opacity=".45" stroke-width="7" stroke-linecap="round"/>
      <circle cx="720" cy="392" r="5" fill="${accent}" opacity=".35"/>
      <circle cx="744" cy="386" r="4" fill="${accent}" opacity=".30"/>
      <circle cx="768" cy="380" r="4" fill="${accent}" opacity=".25"/>
    `;
  }

  if (scene === "two-cups") {
    return `
      ${table}
      ${person(390, 404, 1.06, ink, "sitting")}
      ${person(760, 404, 1.06, ink, "sitting")}
      ${mug(515, 386)}
      ${mug(640, 386)}
      <path d="M570 484 q56 24 118 0" fill="none" stroke="${accent}" stroke-opacity=".18" stroke-width="6" stroke-linecap="round"/>
      <rect x="548" y="345" width="86" height="12" rx="6" fill="${accent}" opacity=".15"/>
    `;
  }

  if (scene === "books") {
    return `
      ${table}
      ${person(324, 406, 1.08, ink, "sitting")}
      <path d="M452 310 q78-38 160 0 v128 q-78-36-160 0 z" fill="#fff" stroke="${accent}" stroke-opacity=".48" stroke-width="5"/>
      <path d="M612 310 q78-38 160 0 v128 q-78-36-160 0 z" fill="#fff" stroke="${accent}" stroke-opacity=".36" stroke-width="5"/>
      <path d="M612 310 v128" stroke="${accent}" stroke-opacity=".32" stroke-width="5"/>
      <rect x="812" y="405" width="146" height="22" rx="8" fill="${accent}" opacity=".18"/>
      <rect x="795" y="432" width="174" height="22" rx="8" fill="${accent}" opacity=".12"/>
      ${mug(840, 340)}
    `;
  }

  if (scene === "rain") {
    return `
      <rect x="660" y="112" width="292" height="355" rx="24" fill="#f8fbff" stroke="${accent}" stroke-opacity=".20" stroke-width="5"/>
      <path d="M806 112 v355 M660 288 h292" stroke="${accent}" stroke-opacity=".16" stroke-width="5"/>
      <path d="M700 160 l-20 64 M760 150 l-22 72 M858 160 l-20 64 M912 178 l-22 72 M718 330 l-20 64 M878 334 l-20 64" stroke="${accent}" stroke-opacity=".30" stroke-width="5" stroke-linecap="round"/>
      ${person(492, 445, 1.22, ink, "standing")}
      <path d="M536 386 q78-4 120-44" fill="none" stroke="${accent}" stroke-opacity=".35" stroke-width="8" stroke-linecap="round"/>
      <rect x="420" y="486" width="128" height="28" rx="14" fill="${accent}" opacity=".13"/>
      <circle cx="980" cy="510" r="42" fill="${accent}" opacity=".08"/>
    `;
  }

  if (scene === "path") {
    return `
      <path d="M130 476 C302 405 442 394 568 438 S826 506 1060 418" fill="none" stroke="${accent}" stroke-opacity=".18" stroke-width="28" stroke-linecap="round"/>
      <path d="M130 476 C302 405 442 394 568 438 S826 506 1060 418" fill="none" stroke="${accent}" stroke-opacity=".35" stroke-width="6" stroke-linecap="round"/>
      ${person(524, 390, 1.10, ink, "walking")}
      <path d="M756 230 q82-46 176 0" fill="none" stroke="${accent}" stroke-opacity=".18" stroke-width="12" stroke-linecap="round"/>
      <circle cx="972" cy="190" r="38" fill="${accent}" opacity=".14"/>
      <rect x="322" y="478" width="92" height="14" rx="7" fill="${accent}" opacity=".18"/>
    `;
  }

  if (scene === "letter") {
    return `
      ${table}
      ${person(342, 406, 1.08, ink, "sitting")}
      <path d="M476 346 h260 v148 h-260 z" fill="#fff" stroke="${accent}" stroke-opacity=".44" stroke-width="5"/>
      <path d="M476 346 l130 94 l130-94" fill="none" stroke="${accent}" stroke-opacity=".36" stroke-width="5"/>
      <path d="M790 300 h130 l-30 54 h-74 z" fill="${accent}" opacity=".12" stroke="${accent}" stroke-opacity=".24" stroke-width="5"/>
      <path d="M842 354 v116" stroke="${accent}" stroke-opacity=".26" stroke-width="9" stroke-linecap="round"/>
      ${mug(838, 396)}
    `;
  }

  if (scene === "tea") {
    return `
      <rect x="690" y="112" width="268" height="318" rx="24" fill="#fff" stroke="${accent}" stroke-opacity=".18" stroke-width="5"/>
      <path d="M824 112 v318 M690 270 h268" stroke="${accent}" stroke-opacity=".14" stroke-width="5"/>
      ${person(512, 435, 1.22, ink, "sitting")}
      ${mug(588, 354)}
      <path d="M742 474 H972" stroke="${muted}" stroke-opacity=".18" stroke-width="16" stroke-linecap="round"/>
      <path d="M902 196 q48 76 0 178" fill="none" stroke="${accent}" stroke-opacity=".13" stroke-width="10" stroke-linecap="round"/>
    `;
  }

  return `
    ${table}
    ${person(342, 408, 1.08, ink, "sitting")}
    <path d="M468 348 q100-42 202 0 v124 q-100-38-202 0 z" fill="#fff" stroke="${accent}" stroke-opacity=".40" stroke-width="5"/>
    <path d="M670 348 q100-42 202 0 v124 q-100-38-202 0 z" fill="#fff" stroke="${accent}" stroke-opacity=".30" stroke-width="5"/>
    ${mug(914, 392)}
  `;
}

function svgFor(post) {
  const palette = PALETTES[tintFor(post.tags)] ?? PALETTES.default;
  const aria = esc(post.imageAlt);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${aria}">
      <defs>
        <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.055"/>
          </feComponentTransfer>
        </filter>
        <linearGradient id="wash" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${palette[0]}"/>
          <stop offset=".62" stop-color="${palette[1]}"/>
          <stop offset="1" stop-color="${palette[0]}"/>
        </linearGradient>
      </defs>
      ${room(palette, post.slug).replace(`fill="${palette[0]}"`, 'fill="url(#wash)"')}
      ${sceneSvg(post.sceneKey, palette)}
      <rect width="${WIDTH}" height="${HEIGHT}" filter="url(#grain)" opacity=".8"/>
      <rect x="36" y="32" width="1128" height="611" rx="42" fill="none" stroke="#ffffff" stroke-opacity=".72"/>
    </svg>
  `;
}

function readPosts() {
  return readdirSync(BLOG_DIR)
    .filter((file) => /\.mdx?$/.test(file) && !LOCALE_VARIANT_RE.test(file))
    .sort()
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const { data } = matter(readFileSync(resolve(BLOG_DIR, file), "utf8"));
      return {
        slug,
        title: data.title ?? slug,
        tags: data.tags ?? [],
        frontmatterImage: data.image ?? null,
        ...getBlogImageMeta(slug, data.title ?? slug, data.tags ?? []),
      };
    });
}

async function render(post) {
  const png = new Resvg(svgFor(post), {
    fitTo: { mode: "width", value: WIDTH },
    font: { loadSystemFonts: true },
  }).render().asPng();

  if (sharp) {
    const webp = await sharp(png).webp({ quality: 82, alphaQuality: 90, effort: 5 }).toBuffer();
    const file = resolve(OUT_DIR, `${post.slug}.webp`);
    writeFileSync(file, webp);
    return file;
  }

  const file = resolve(OUT_DIR, `${post.slug}.png`);
  writeFileSync(file, png);
  return file;
}

async function main() {
  const posts = readPosts();
  let created = 0;
  let skipped = 0;

  for (const post of posts) {
    if (post.frontmatterImage) {
      skipped++;
      continue;
    }

    const existing = existingCover(post.slug);
    if (existing && !force) {
      skipped++;
      continue;
    }

    const file = await render(post);
    created++;
    console.log(`  ✓ ${file.replace(`${OUT_DIR}/`, "public/images/blog/")}`);
  }

  console.log(`\nFree local covers done. created ${created}, skipped ${skipped}.`);
  console.log(sharp ? "Format: webp" : "Format: png (sharp not available)");
}

main().catch((err) => {
  console.error("free cover generation failed:", err);
  process.exit(1);
});
