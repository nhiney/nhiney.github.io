// Morph targets for the homepage particle scene. Each function returns `count`
// xyz positions so particle i can travel dandelion → scatter → idea network → globe.
// Shapes are ~1–1.5 units in radius; the scatter field is sized to fill the
// viewport at scale 1 (camera z = 4.4, fov 34 → 2.69 units tall).

/** Small deterministic PRNG so every reload builds the same shapes. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type V3 = [number, number, number];

/**
 * A dandelion clock (bồ công anh): a thin curved stem, a warm seed core and a
 * sphere of fine filaments, each ending in a feathery tuft. Some seeds drift away.
 * Meaning: every seed is a question sent out; the page follows it to an idea
 * (bulb) and to the people it reaches (globe).
 * kind: 0 stem/filament, 1 tuft, 2 drifting seed, 3 core.
 * order: 0 at the stem base → 1 at the tufts (drives the intro and the light).
 */
export function createDandelion(count: number, seed = 29) {
  const rnd = mulberry32(seed);
  const C: V3 = [0, 0.45, 0];
  const R = 0.95;
  const position = new Float32Array(count * 3);
  const kind = new Float32Array(count);
  const order = new Float32Array(count);

  // Seed directions: an even Fibonacci sphere, minus the cone where the stem joins.
  const dirs: V3[] = [];
  const N = 320;
  for (let k = 0; k < N; k++) {
    const y = 1 - (2 * (k + 0.5)) / N;
    if (y < -0.82) continue;
    const r = Math.sqrt(1 - y * y);
    const a = k * 2.399963;
    dirs.push([Math.cos(a) * r, y, Math.sin(a) * r]);
  }
  const perp = (d: V3): [V3, V3] => {
    const u0: V3 = Math.abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    const u: V3 = [d[1] * u0[2] - d[2] * u0[1], d[2] * u0[0] - d[0] * u0[2], d[0] * u0[1] - d[1] * u0[0]];
    const l = Math.hypot(u[0], u[1], u[2]);
    const uu: V3 = [u[0] / l, u[1] / l, u[2] / l];
    return [uu, [d[1] * uu[2] - d[2] * uu[1], d[2] * uu[0] - d[0] * uu[2], d[0] * uu[1] - d[1] * uu[0]]];
  };

  const nStem = Math.floor(count * 0.08);
  const nCore = Math.floor(count * 0.05);
  const nFil = Math.floor(count * 0.55);
  const nTuft = Math.floor(count * 0.26); // the rest (~6%) drift away
  let i = 0;

  // Stem: a thin tube along a gentle curve from the ground to the core.
  for (; i < nStem; i++) {
    const t = rnd();
    const x = Math.sin(t * 2.4) * 0.12 * (1 - t);
    const y = -1.35 + t * (C[1] - 0.1 + 1.35);
    const a = rnd() * Math.PI * 2;
    const r = 0.016 + 0.006 * (1 - t);
    position.set([x + Math.cos(a) * r, y, Math.sin(a) * r], i * 3);
    kind[i] = 0;
    order[i] = t * 0.3;
  }
  // Core: a small dense seed bed.
  for (; i < nStem + nCore; i++) {
    const d = dirs[Math.floor(rnd() * dirs.length)];
    const r = 0.06 + rnd() * 0.07;
    position.set([C[0] + d[0] * r, C[1] + d[1] * r, C[2] + d[2] * r], i * 3);
    kind[i] = 3;
    order[i] = 0.32;
  }
  // Filaments: fine lines from the core out to each tuft.
  for (; i < nStem + nCore + nFil; i++) {
    const d = dirs[Math.floor(rnd() * dirs.length)];
    const t = 0.14 + rnd() * 0.72;
    position.set([C[0] + d[0] * R * t, C[1] + d[1] * R * t, C[2] + d[2] * R * t], i * 3);
    kind[i] = 0;
    order[i] = 0.35 + t * 0.55;
  }
  // Tufts: a small umbrella of rays at the end of each filament.
  for (; i < nStem + nCore + nFil + nTuft; i++) {
    const d = dirs[Math.floor(rnd() * dirs.length)];
    const [u, v] = perp(d);
    const a = rnd() * Math.PI * 2;
    const spread = Math.pow(rnd(), 0.6) * 0.13;
    const lift = 0.86 + rnd() * 0.06 + spread * 0.35;
    position.set([
      C[0] + d[0] * R * lift + (u[0] * Math.cos(a) + v[0] * Math.sin(a)) * spread,
      C[1] + d[1] * R * lift + (u[1] * Math.cos(a) + v[1] * Math.sin(a)) * spread,
      C[2] + d[2] * R * lift + (u[2] * Math.cos(a) + v[2] * Math.sin(a)) * spread,
    ], i * 3);
    kind[i] = 1;
    order[i] = 0.9 + rnd() * 0.1;
  }
  // Drifting seeds start on the upper/right side of the head; the shader carries them off.
  for (; i < count; i++) {
    const d = dirs[Math.floor(rnd() * dirs.length)];
    const dd: V3 = [Math.abs(d[0]) * 0.8 + 0.2, d[1] * 0.6 + 0.3, d[2]];
    position.set([C[0] + dd[0] * R, C[1] + dd[1] * R, C[2] + dd[2] * R * 0.6], i * 3);
    kind[i] = 2;
    order[i] = 1;
  }

  return { position, kind, order };
}

function randDir(rnd: () => number) {
  const u = rnd() * 2 - 1;
  const t = rnd() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(t), u, s * Math.sin(t)] as const;
}

/** Loose dust halo for the leftover ~12% of a shape's particles. */
function dust(out: Float32Array, i: number, rnd: () => number, r0: number, r1: number) {
  const [x, y, z] = randDir(rnd);
  const r = r0 + Math.pow(rnd(), 0.7) * (r1 - r0);
  out.set([x * r, y * r, z * r], i * 3);
}

/** Wide, deep field of particles drifting in front of and behind the text. */
export function createScatter(count: number, seed = 21): Float32Array {
  const rnd = mulberry32(seed);
  const out = new Float32Array(count * 3);
  let i = 0;
  while (i < count) {
    const x = (rnd() * 2 - 1) * 3.6;
    const y = (rnd() * 2 - 1) * 2.1;
    const z = -4 + rnd() * 5.4;
    // Keep a quiet, darker oval in the middle where the centred text sits.
    const e = (x / 2.3) ** 2 + (y / 1.15) ** 2;
    if (e < 1 && rnd() > 0.12 + 0.88 * e * e) continue;
    out.set([x, y, z], i * 3);
    i++;
  }
  return out;
}

// ─── Idea network: how a problem branches into solutions ─────────────────────

/**
 * A mind map in 3D: a bright core (the problem), seven primary ideas around it,
 * each splitting into a few smaller ones, joined by fine curved links.
 */
export function createIdeaNetwork(count: number, seed = 37): Float32Array {
  const rnd = mulberry32(seed);
  const out = new Float32Array(count * 3);

  // Primary nodes on an even sphere, secondary nodes fanning outward from each.
  const primaries: V3[] = [];
  const P = 7;
  for (let k = 0; k < P; k++) {
    const y = 1 - (2 * (k + 0.5)) / P;
    const r = Math.sqrt(1 - y * y);
    const a = k * 2.399963 + 0.4;
    const d = 0.78 + rnd() * 0.14;
    primaries.push([Math.cos(a) * r * d, y * d * 0.82, Math.sin(a) * r * d]);
  }
  const secondaries: { from: V3; at: V3 }[] = [];
  for (const p of primaries) {
    const n = 3 + Math.floor(rnd() * 2);
    for (let k = 0; k < n; k++) {
      const [dx, dy, dz] = randDir(rnd);
      const out3: V3 = [p[0] * 0.55 + dx * 0.3, p[1] * 0.55 + dy * 0.3, p[2] * 0.55 + dz * 0.3];
      secondaries.push({ from: p, at: [p[0] + out3[0], p[1] + out3[1], p[2] + out3[2]] });
    }
  }

  const ball = (c: V3, r: number): V3 => {
    const [dx, dy, dz] = randDir(rnd);
    const rr = r * (rnd() < 0.7 ? 0.85 + rnd() * 0.15 : Math.cbrt(rnd())); // bright shell, some core
    return [c[0] + dx * rr, c[1] + dy * rr, c[2] + dz * rr];
  };
  // Quadratic curve from a to b, bowed sideways so links feel organic.
  const curve = (a: V3, b: V3, bow: number): V3 => {
    const t = rnd();
    const m: V3 = [(a[0] + b[0]) / 2 + bow * (a[1] - b[1]), (a[1] + b[1]) / 2 + bow * 0.3, (a[2] + b[2]) / 2 - bow * (a[0] - b[0])];
    const u = 1 - t;
    const j = () => (rnd() - 0.5) * 0.008;
    return [
      u * u * a[0] + 2 * u * t * m[0] + t * t * b[0] + j(),
      u * u * a[1] + 2 * u * t * m[1] + t * t * b[1] + j(),
      u * u * a[2] + 2 * u * t * m[2] + t * t * b[2] + j(),
    ];
  };
  const O: V3 = [0, 0, 0];
  const parts: { w: number; at: () => V3 }[] = [
    { w: 11, at: () => ball(O, 0.17) },
    { w: 16, at: () => ball(primaries[Math.floor(rnd() * P)], 0.075) },
    { w: 12, at: () => { const s = secondaries[Math.floor(rnd() * secondaries.length)]; return ball(s.at, 0.04); } },
    { w: 24, at: () => { const k = Math.floor(rnd() * P); return curve(O, primaries[k], 0.12 * (k % 2 ? 1 : -1)); } },
    { w: 20, at: () => { const s = secondaries[Math.floor(rnd() * secondaries.length)]; return curve(s.from, s.at, 0.05); } },
    // A few cross-links between neighbouring ideas: the "aha" connections.
    { w: 5, at: () => { const k = Math.floor(rnd() * P); return curve(primaries[k], primaries[(k + 2) % P], 0.18); } },
  ];
  const total = parts.reduce((x, p) => x + p.w, 0);
  const nDust = Math.floor(count * 0.08);
  for (let i = 0; i < count - nDust; i++) {
    let pick = rnd() * total;
    let part = parts[0];
    for (const p of parts) { if (pick < p.w) { part = p; break; } pick -= p.w; }
    out.set(part.at(), i * 3);
  }
  for (let i = count - nDust; i < count; i++) dust(out, i, rnd, 1.2, 2.2);
  return out;
}

// ─── Globe: the people the work reaches ──────────────────────────────────────

// Cheap continent mask: positive on "land".
function land(x: number, y: number, z: number) {
  return (
    Math.sin(3.1 * x + 1.3 * Math.sin(2.2 * z)) * Math.sin(2.7 * y + 1.7 * Math.sin(1.9 * x)) +
    0.55 * Math.sin(4.3 * z + 2.1 * y + 0.7)
  );
}

/** A clean dotted globe: dense continents, sparse oceans, nothing raised off it. */
export function createGlobe(count: number, seed = 47): Float32Array {
  const rnd = mulberry32(seed);
  const out = new Float32Array(count * 3);
  const nSurface = Math.floor(count * 0.94);
  let i = 0;
  while (i < nSurface) {
    const [x, y, z] = randDir(rnd);
    if (land(x, y, z) < 0.1 && rnd() > 0.2) continue; // oceans stay sparse
    out.set([x, y, z], i * 3);
    i++;
  }
  for (; i < count; i++) dust(out, i, rnd, 1.15, 1.9);
  return out;
}
