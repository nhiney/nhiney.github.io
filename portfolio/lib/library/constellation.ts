// Constellation / knowledge-map layout: scatter the books as nodes across a
// gentle plane, then link each to its nearest neighbours so they read as a
// connected network (on-brand with the brain icon). Deterministic.

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Constellation {
  positions: [number, number, number][];
  edges: [number, number][];
}

export function constellationLayout(n: number): Constellation {
  const rnd = mulberry32(0x5eedbeef);
  const W = 9.2; // x extent
  const H = 5.2; // y extent
  const minDist = 2.05; // keep nodes from crowding
  const positions: [number, number, number][] = [];

  let tries = 0;
  while (positions.length < n && tries < 4000) {
    tries++;
    const x = (rnd() - 0.5) * W;
    const y = (rnd() - 0.5) * H;
    const z = (rnd() - 0.5) * 1.4;
    if (positions.every((p) => Math.hypot(p[0] - x, p[1] - y) > minDist)) {
      positions.push([x, y, z]);
    }
  }
  // Fallback if rejection sampling fell short (shouldn't for ~9 nodes).
  while (positions.length < n) {
    const a = (positions.length / n) * Math.PI * 2;
    positions.push([Math.cos(a) * 3.6, Math.sin(a) * 2.2, 0]);
  }

  // Link each node to its 2 nearest neighbours (deduped) → a clean web.
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  positions.forEach((p, i) => {
    const near = positions
      .map((q, j) => ({ j, d: i === j ? Infinity : Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    near.forEach(({ j }) => {
      const k = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(k)) {
        seen.add(k);
        edges.push([i, j]);
      }
    });
  });

  return { positions, edges };
}
