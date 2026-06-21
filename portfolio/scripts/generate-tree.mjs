/**
 * Build-time knowledge-tree rasteriser.
 *
 * The /mind-map tree used to render ~13,500 inline SVG nodes plus 220 infinite
 * framer-motion animations directly in the page — a 2 MB HTML document that
 * janked badly on phones/iPads. The geometry is fully deterministic (seeded
 * PRNG), so we bake it to two static PNGs (light + dark) once at build time and
 * the page just overlays the interactive fruit/labels on top.
 *
 * Keep the geometry here in sync with the viewBox/positions in
 * components/sections/AppleTree/AppleTreeMindMap.tsx.
 */

import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../public/mind-map");
mkdirSync(OUT_DIR, { recursive: true });

// Must match VB in AppleTreeMindMap.tsx
const VB = { x: 50, y: -20, w: 460, h: 490 };
const RENDER_WIDTH = 1400; // 2× the max display width (max-w-4xl ≈ 896px)

// ─── Theme colours (mirror of the --kt-* vars in globals.css) ─────────────────
const THEMES = {
  light: {
    trunk: "hsl(22 55% 28%)",
    branch: "hsl(22 48% 24%)",
    leaf: ["hsl(130 45% 26%)", "hsl(128 48% 32%)", "hsl(126 50% 40%)", "hsl(124 52% 48%)", "hsl(122 55% 58%)"],
    flower: ["hsl(330 100% 85%)", "hsl(330 100% 70%)", "hsl(45 100% 65%)", "hsl(0 0% 100%)"],
    ground: "rgba(100,116,139,0.30)",
  },
  dark: {
    trunk: "hsl(22 40% 18%)",
    branch: "hsl(22 36% 15%)",
    leaf: ["hsl(130 32% 18%)", "hsl(128 36% 24%)", "hsl(126 40% 32%)", "hsl(124 44% 42%)", "hsl(122 48% 52%)"],
    flower: ["hsl(330 60% 75%)", "hsl(330 80% 65%)", "hsl(45 80% 65%)", "hsl(0 0% 95%)"],
    ground: "rgba(148,163,184,0.28)",
  },
};

// ─── Tree generation (ported verbatim from buildTree) ─────────────────────────
function buildTree() {
  const mulberry32 = (a) => () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng = mulberry32(77123);
  const R = (d) => (d * Math.PI) / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
  const add = (a, b, s = 1) => ({ x: a.x + b.x * s, y: a.y + b.y * s });
  const unit = (v) => { const l = Math.hypot(v.x, v.y) || 1; return { x: v.x / l, y: v.y / l }; };
  const perp = (v) => ({ x: -v.y, y: v.x });

  const branches = [];
  const leaves = [];
  const flowers = [];

  const taper = (B, T, wB, wT, bow) => {
    const n = perp(unit(sub(T, B)));
    const mid = { x: (B.x + T.x) / 2, y: (B.y + T.y) / 2 };
    const C = add(mid, n, bow);
    const wM = (wB + wT) / 2;
    const f = (p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    return (
      `M ${f(add(B, n, wB / 2))} Q ${f(add(C, n, wM / 2))} ${f(add(T, n, wT / 2))} ` +
      `L ${f(add(T, n, -wT / 2))} Q ${f(add(C, n, -wM / 2))} ${f(add(B, n, -wB / 2))} Z`
    );
  };
  const grow = (B, ang, len, w, depth) => {
    const T = { x: B.x + Math.cos(ang) * len, y: B.y + Math.sin(ang) * len };
    const wEnd = Math.max(1.2, w * 0.7);
    const bow = (rng() - 0.5) * len * 0.2;
    branches.push({ d: taper(B, T, w, wEnd, bow), w });
    if (depth <= 0) return;
    const kids = depth > 1 ? 2 : rng() < 0.4 ? 3 : 2;
    const spread = 20 + rng() * 16;
    for (let i = 0; i < kids; i++) {
      const t = i / (kids - 1) - 0.5;
      const da = t * spread + (rng() - 0.5) * 11;
      let na = ang + R(da);
      na = na * 0.9 + R(-90) * 0.1;
      grow(T, na, len * 0.74, wEnd * 0.92, depth - 1);
    }
  };

  const baseX = 280;
  const ground = 452;
  const trunkTop = { x: 280, y: 322 };
  branches.push({ d: taper({ x: baseX, y: ground }, trunkTop, 42, 27, (rng() - 0.5) * 5), w: 42 });
  for (const ra of [202, 224, 316, 338]) {
    const dir = { x: Math.cos(R(ra)), y: Math.sin(R(ra)) };
    const e = { x: baseX + dir.x * 44, y: ground + 10 };
    branches.push({ d: taper({ x: baseX, y: ground - 8 }, e, 18, 3, (rng() - 0.5) * 5), w: 18 });
  }
  const limbs = [
    { a: -146, l: 74 }, { a: -120, l: 92 }, { a: -98, l: 100 },
    { a: -82, l: 100 }, { a: -60, l: 92 }, { a: -34, l: 74 },
  ];
  for (const L of limbs) grow(trunkTop, R(L.a), L.l, 22, 3);

  const C = { x: 280, y: 162 };
  const Rx = 225, Ry = 175;
  const ph = rng() * 6.28, ph2 = rng() * 6.28;
  const edge = (a) => 0.83 + 0.11 * Math.sin(a * 3 + ph) + 0.06 * Math.sin(a * 5 + ph2);

  for (let i = 0; i < 6000; i++) {
    const a = rng() * Math.PI * 2;
    const rr = Math.pow(rng(), 0.55) * edge(a);
    const x = C.x + Math.cos(a) * rr * Rx;
    const y = C.y + Math.sin(a) * rr * Ry;
    const rX = (x - C.x) / Rx;
    const rY = (y - C.y) / Ry;
    const light = clamp(0.6 - (rY * 0.5) + (rX * 0.2) + (rng() - 0.5) * 0.4, 0, 1);
    const sz = (0.7 + rng() * 0.6) * 1.1;
    leaves.push({ x, y, rot: rng() * 180, sz, shade: light });
  }
  // The original draws 24 "blobs" here but never renders them; we still consume
  // the same PRNG draws so the flower scatter matches the component's intent.
  for (let i = 0; i < 24; i++) { rng(); rng(); rng(); }
  const flowerIdx = [0, 1, 2, 3];
  for (let i = 0; i < 400; i++) {
    const a = rng() * Math.PI * 2;
    const rr = Math.pow(rng(), 0.7) * edge(a);
    flowers.push({
      x: C.x + Math.cos(a) * rr * Rx,
      y: C.y + Math.sin(a) * rr * Ry,
      sz: 0.5 + rng() * 0.8,
      rot: rng() * 360,
      colorIdx: flowerIdx[Math.floor(rng() * flowerIdx.length)],
    });
  }

  return { branches, leaves, flowers };
}

const TREE = buildTree();

const thickWood = TREE.branches.filter((b) => b.w >= 12);
const thinWood = TREE.branches.filter((b) => b.w < 12);
const buckets = [
  TREE.leaves.filter((l) => l.shade < 0.25),
  TREE.leaves.filter((l) => l.shade >= 0.25 && l.shade < 0.45),
  TREE.leaves.filter((l) => l.shade >= 0.45 && l.shade < 0.65),
  TREE.leaves.filter((l) => l.shade >= 0.65 && l.shade < 0.82),
  TREE.leaves.filter((l) => l.shade >= 0.82),
];

const leafEl = (l) =>
  `<g transform="translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(0)}) scale(${l.sz.toFixed(2)})">` +
  `<path d="M -3.5,0.4 C -3.5,-1.4 0,-2.1 3.5,0.4 C 0,2.9 -3.5,2.2 -3.5,0.4 Z" fill="rgba(0,0,0,0.06)"/>` +
  `<path d="M -3.5,0 C -3.5,-1.8 0,-2.5 3.5,0 C 0,2.5 -3.5,1.8 -3.5,0 Z" stroke="rgba(0,0,0,0.08)" stroke-width="0.15"/>` +
  `<path d="M -3.1,0 L 2.6,0" stroke="rgba(255,255,255,0.12)" stroke-width="0.12" stroke-linecap="round"/>` +
  `</g>`;

// Mirror of flowerEl in the component (its non-animated baseline): a central
// dot plus five petals. The component animated opacity 0.7→1; we bake the
// bright end so the canopy keeps its "liti" flowering look.
const petals = [0, 72, 144, 216, 288]
  .map((deg) => ({ x: (Math.cos((deg * Math.PI) / 180) * 1.8).toFixed(3), y: (Math.sin((deg * Math.PI) / 180) * 1.8).toFixed(3) }));

const flowerEl = (f, colors) => {
  const c = colors.flower[f.colorIdx];
  return (
    `<g transform="translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.rot.toFixed(0)}) scale(${f.sz.toFixed(2)})">` +
    `<circle cx="0" cy="0" r="1.0" fill="${c}"/>` +
    petals.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="1.4" fill="${c}"/>`).join("") +
    `</g>`
  );
};

function treeSvg(colors) {
  const height = (RENDER_WIDTH * VB.h) / VB.w;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" width="${RENDER_WIDTH}" height="${height.toFixed(0)}">` +
    `<defs><linearGradient id="kt-wood" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0" stop-color="${colors.trunk}"/><stop offset="1" stop-color="${colors.branch}"/>` +
    `</linearGradient></defs>` +
    `<line x1="184" y1="456" x2="376" y2="456" stroke="${colors.ground}" stroke-width="1.2" stroke-dasharray="2 8" stroke-linecap="round"/>` +
    // wood
    `<g fill="${colors.branch}">${thinWood.map((b) => `<path d="${b.d}"/>`).join("")}</g>` +
    `<g fill="url(#kt-wood)">${thickWood.map((b) => `<path d="${b.d}"/>`).join("")}</g>` +
    // canopy
    buckets
      .map((bucket, i) => `<g fill="${colors.leaf[i]}" fill-opacity="0.85">${bucket.map(leafEl).join("")}</g>`)
      .join("") +
    `<g fill-opacity="0.9">${TREE.flowers.map((f) => flowerEl(f, colors)).join("")}</g>` +
    `</svg>`
  );
}

// WebP needs sharp (hoisted from the workspace root, not a portfolio dep). If
// it isn't resolvable in some environment, skip regeneration and keep the
// committed images so the build never breaks over a decorative asset.
let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  const haveImages = Object.keys(THEMES).every((n) => existsSync(resolve(OUT_DIR, `tree-${n}.webp`)));
  console.warn(
    `⚠ mind-map tree: 'sharp' not available — ${haveImages ? "keeping committed images" : "NO images present"}.`,
  );
  if (!haveImages) process.exitCode = 1;
  sharp = null;
}

if (sharp) {
  for (const [name, colors] of Object.entries(THEMES)) {
    const svg = treeSvg(colors);
    const png = new Resvg(svg, { fitTo: { mode: "width", value: RENDER_WIDTH } }).render().asPng();
    // PNG of the semi-transparent leaf noise compresses poorly (~1.7 MB); WebP
    // with alpha brings it down ~5×. Only the theme-matched image is fetched
    // (the off-theme <div> stays display:none), so per-visit cost is one file.
    const webp = await sharp(png).webp({ quality: 72, alphaQuality: 90, effort: 6 }).toBuffer();
    const out = resolve(OUT_DIR, `tree-${name}.webp`);
    writeFileSync(out, webp);
    console.log(`✓ mind-map tree (${name}): ${(webp.length / 1024).toFixed(0)} KB → ${out}`);
  }
}
