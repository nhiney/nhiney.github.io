// Procedural "particle brain" point cloud.
//
// No model file: the shape is sampled from a few analytic primitives
// (two folded hemispheres, a striated cerebellum, a brainstem and a faint
// halo of dust). Folds are a cheap ridged sine field; particles are
// rejection-sampled so they crowd onto the gyri crowns and leave the sulci
// dark, which is what makes the cloud read as a brain rather than a blob.

export type BrainBuffers = {
  position: Float32Array; // xyz
  normal: Float32Array;   // outward direction, used for rim light
  random: Float32Array;   // 4 random values per particle
  kind: Float32Array;     // 0 surface, 1 inner volume, 2 dust
  count: number;
};

// Small deterministic PRNG so server/client and every reload get the same cloud.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ridge(x: number, y: number, z: number) {
  const f =
    Math.sin(3.1 * x + 1.7 * Math.sin(2.3 * z + 0.4)) *
    Math.sin(2.9 * y + 1.3 * Math.sin(2.1 * x + 1.1)) *
    Math.sin(3.3 * z + 1.1 * Math.sin(2.7 * y + 2.3));
  const g =
    Math.sin(5.7 * x + 2.1 * Math.sin(4.3 * y)) *
    Math.sin(6.1 * z + 1.9 * Math.sin(3.9 * x));
  // 1 on the crest of a fold, 0 in the groove.
  return 1 - Math.min(1, Math.abs(f * 0.72 + g * 0.28) * 1.9);
}

export function createBrain(count: number, seed = 7): BrainBuffers {
  const rnd = mulberry32(seed);
  const position = new Float32Array(count * 3);
  const normal = new Float32Array(count * 3);
  const random = new Float32Array(count * 4);
  const kind = new Float32Array(count);

  const nCerebrum = Math.floor(count * 0.74);
  const nCerebellum = Math.floor(count * 0.11);
  const nStem = Math.floor(count * 0.04);

  let i = 0;
  const push = (
    x: number, y: number, z: number,
    nx: number, ny: number, nz: number,
    k: number,
  ) => {
    position[i * 3] = x;
    position[i * 3 + 1] = y;
    position[i * 3 + 2] = z;
    const l = Math.hypot(nx, ny, nz) || 1;
    normal[i * 3] = nx / l;
    normal[i * 3 + 1] = ny / l;
    normal[i * 3 + 2] = nz / l;
    random[i * 4] = rnd();
    random[i * 4 + 1] = rnd();
    random[i * 4 + 2] = rnd();
    random[i * 4 + 3] = rnd();
    kind[i] = k;
    i++;
  };

  const randDir = () => {
    const u = rnd() * 2 - 1;
    const t = rnd() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    return [s * Math.cos(t), u, s * Math.sin(t)] as const;
  };

  // ── Cerebrum: two hemispheres, z is front (+) → back (−) ────────────────
  const RX = 0.56, RY = 0.7, RZ = 1.02;
  let guard = 0;
  while (i < nCerebrum && guard++ < count * 40) {
    const [dx, dy, dz] = randDir();
    const side = rnd() < 0.5 ? -1 : 1;
    let x = Math.abs(dx) * RX * side + side * 0.31;
    let y = dy * RY + 0.08;
    const z = dz * RZ;

    // Frontal lobe a touch taller, occipital a touch narrower.
    y += 0.06 * Math.max(0, z);
    x *= 1 - 0.08 * Math.max(0, -z);

    // Flatten the underside and tuck the temporal lobe in.
    if (y < -0.28) y = -0.28 + (y + 0.28) * 0.42;
    if (y < -0.12 && z > -0.2 && z < 0.55) x *= 0.97;

    // Medial wall: keep a thin longitudinal fissure between hemispheres.
    if (x * side < 0.035) x = side * (0.035 + rnd() * 0.02);

    const r = ridge(x, y, z);
    const accept = 0.22 + 0.78 * r * r;
    if (rnd() > accept) continue;

    const inner = rnd() < 0.14;
    const push2 = 1 + 0.055 * r - 0.03 - (inner ? 0.06 + rnd() * 0.18 : 0);
    const cx = side * 0.31;
    const cy = 0.08;
    push(
      cx + (x - cx) * push2, cy + (y - cy) * push2, z * push2,
      (x - cx) / (RX * RX), (y - cy) / (RY * RY), z / (RZ * RZ),
      inner ? 1 : 0,
    );
  }

  // ── Cerebellum: striated ellipsoid tucked under the occipital lobe ──────
  const target2 = i + nCerebellum;
  guard = 0;
  while (i < target2 && guard++ < count * 40) {
    const [dx, dy, dz] = randDir();
    const x = dx * 0.5;
    const y = dy * 0.24 - 0.4;
    const z = dz * 0.32 - 0.66;
    if (z > -0.5 && y > -0.32) continue; // hidden under the cerebrum
    const stripe = 0.5 + 0.5 * Math.cos((y + 0.4) * 62 + Math.sin(x * 9) * 0.6);
    if (rnd() > 0.25 + 0.75 * stripe) continue;
    push(x, y, z, dx / 0.5, dy / 0.24, dz / 0.32, rnd() < 0.12 ? 1 : 0);
  }

  // ── Brainstem: tapering tube angled slightly forward ─────────────────────
  const target3 = i + nStem;
  while (i < target3) {
    const t = rnd();
    const a = rnd() * Math.PI * 2;
    const rad = 0.15 - t * 0.05;
    const y = -0.32 - t * 0.66;
    const z = -0.22 - t * 0.12;
    push(Math.cos(a) * rad, y, z + Math.sin(a) * rad, Math.cos(a), 0, Math.sin(a), 0);
  }

  // ── Dust: faint halo that gives the cloud depth ──────────────────────────
  while (i < count) {
    const [dx, dy, dz] = randDir();
    const rr = 1.25 + Math.pow(rnd(), 0.7) * 1.6;
    push(dx * rr, dy * rr * 0.8, dz * rr, dx, dy, dz, 2);
  }

  return { position, normal, random, kind, count };
}
