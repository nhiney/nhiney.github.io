// Procedural textures for the 3D book, painted on a <canvas> (no image files).
// Covers are intentionally MINIMAL (solid colour + elegant serif type, like a
// Vintage/Penguin classic) so books without a real photo still look designed.
// Client-only (touches `document`).
import * as THREE from "three";
import type { BookMeta } from "@/data/books";

const isClient = typeof document !== "undefined";
const SERIF = "Georgia, 'Times New Roman', serif";

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function finalize(canvas: HTMLCanvasElement, aniso = 8) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = aniso;
  tex.needsUpdate = true;
  return tex;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function clean(title: string) {
  return title.split("—")[0].split(":")[0].trim();
}

/** Minimal editorial front cover. */
export function makeCoverTexture(meta: BookMeta, title: string): THREE.Texture {
  if (!isClient) return new THREE.Texture();
  const W = 768;
  const H = 1152;
  const canvas = makeCanvas(W, H);
  const ctx = canvas.getContext("2d")!;

  const g = ctx.createLinearGradient(0, 0, W * 0.4, H);
  g.addColorStop(0, `hsl(${meta.hue} ${meta.saturation}% ${meta.lightness}%)`);
  g.addColorStop(1, `hsl(${meta.hue} ${meta.saturation}% ${Math.max(10, meta.lightness - 14)}%)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // keyline
  ctx.strokeStyle = meta.foil;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 3;
  ctx.strokeRect(54, 54, W - 108, H - 108);
  ctx.globalAlpha = 1;

  ctx.fillStyle = meta.foil;
  ctx.textAlign = "center";

  // title
  ctx.font = `600 92px ${SERIF}`;
  let lines = wrap(ctx, clean(title), W - 220);
  if (lines.length > 3) {
    ctx.font = `600 72px ${SERIF}`;
    lines = wrap(ctx, clean(title), W - 200);
  }
  const lh = lines.length > 3 ? 86 : 110;
  const startY = H * 0.4 - ((lines.length - 1) * lh) / 2;
  lines.forEach((l, i) => ctx.fillText(l, W / 2, startY + i * lh));

  // small rule + author
  ctx.globalAlpha = 0.8;
  ctx.fillRect(W / 2 - 36, H * 0.7, 72, 2);
  ctx.globalAlpha = 1;
  ctx.font = `italic 40px ${SERIF}`;
  ctx.fillText(meta.author, W / 2, H * 0.7 + 64);

  if (meta.coverBlurb) {
    ctx.font = `italic 32px ${SERIF}`;
    ctx.globalAlpha = 0.86;
    const blurbLines = wrap(ctx, meta.coverBlurb, W - 190).slice(0, 5);
    const blurbLineHeight = 42;
    const blurbY = H * 0.82 - ((blurbLines.length - 1) * blurbLineHeight) / 2;
    blurbLines.forEach((line, i) => ctx.fillText(line, W / 2, blurbY + i * blurbLineHeight));
    ctx.globalAlpha = 1;
  }

  return finalize(canvas);
}

/** Vertical spine: title bottom-to-top + author. */
export function makeSpineTexture(meta: BookMeta, title: string): THREE.Texture {
  if (!isClient) return new THREE.Texture();
  const W = 200;
  const H = 1152;
  const canvas = makeCanvas(W, H);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = `hsl(${meta.hue} ${meta.saturation}% ${Math.max(12, meta.lightness - 4)}%)`;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = meta.foil;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = 3;
  for (const y of [96, H - 96]) {
    ctx.beginPath();
    ctx.moveTo(34, y);
    ctx.lineTo(W - 34, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = meta.foil;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 58px ${SERIF}`;
  let lines = wrap(ctx, clean(title), H - 320);
  if (lines.length > 2) {
    ctx.font = `600 46px ${SERIF}`;
    lines = wrap(ctx, clean(title), H - 320).slice(0, 2);
  }
  const lh = 64;
  const off = -((lines.length - 1) * lh) / 2 - 24;
  lines.forEach((l, i) => ctx.fillText(l, 0, off + i * lh));
  ctx.font = `italic 30px ${SERIF}`;
  ctx.globalAlpha = 0.8;
  ctx.fillText(meta.author, 0, off + lines.length * lh + 22);
  ctx.restore();

  return finalize(canvas);
}

let pagesCache: THREE.Texture | null = null;
export function makePagesTexture(): THREE.Texture {
  if (!isClient) return new THREE.Texture();
  if (pagesCache) return pagesCache;
  const W = 64;
  const H = 1152;
  const canvas = makeCanvas(W, H);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#efe7d4";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(120,104,78,0.32)";
  ctx.lineWidth = 1;
  for (let y = 2; y < H; y += 3) {
    ctx.globalAlpha = 0.3 + (Math.sin(y * 7.13) * 0.5 + 0.5) * 0.4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  pagesCache = finalize(canvas, 4);
  return pagesCache;
}

/** Soft neutral studio environment for clean reflections. */
export function makeStudioEnv(): THREE.Texture {
  if (!isClient) return new THREE.Texture();
  const W = 1024;
  const H = 512;
  const canvas = makeCanvas(W, H);
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.5, "#f0ede7");
  g.addColorStop(0.8, "#ddd8cf");
  g.addColorStop(1, "#c7c1b6");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  for (const [cx, r, a] of [
    [W * 0.5, 260, 0.9],
    [W * 0.22, 150, 0.4],
    [W * 0.8, 150, 0.4],
  ] as const) {
    const s = ctx.createRadialGradient(cx, H * 0.3, 6, cx, H * 0.3, r);
    s.addColorStop(0, `rgba(255,255,255,${a})`);
    s.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = s;
    ctx.fillRect(0, 0, W, H);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
