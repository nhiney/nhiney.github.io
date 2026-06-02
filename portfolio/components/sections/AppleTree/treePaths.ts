// ─── SVG coordinate space ──────────────────────────────────────────────────────
// ViewBox: 1000 × 680.  Center trunk at x = 500.

export const SVG_W = 1000
export const SVG_H = 680

// ─── Trunk ─────────────────────────────────────────────────────────────────────
// A tapered trunk rising from the base up to where branches fork.
export const TRUNK_PATH =
  'M 470,680 C 468,620 462,560 460,490 L 465,490 C 470,430 472,390 480,350 ' +
  'C 488,310 492,280 500,260 ' +
  'C 508,280 512,310 520,350 ' +
  'C 528,390 530,430 535,490 L 540,490 ' +
  'C 538,560 532,620 530,680 Z'

// ─── Main branches ─────────────────────────────────────────────────────────────
export const MAIN_BRANCH_PATHS: string[] = [
  // Far-left branch → node 0 (175, 215)
  'M 492,350 C 440,320 340,280 220,230',
  // Left-center branch → node 1 (300, 155)
  'M 494,310 C 460,270 400,210 310,165',
  // Center-left branch → node 2 (430, 110)
  'M 498,280 C 488,240 464,180 440,120',
  // Center-right branch → node 3 (570, 110)
  'M 502,280 C 512,240 536,180 560,120',
  // Right-center branch → node 4 (700, 155)
  'M 506,310 C 540,270 600,210 690,165',
  // Far-right branch → node 5 (825, 215)
  'M 508,350 C 560,320 660,280 780,230',
  // Top-center branch → node 6 (500, 80)
  'M 500,265 C 500,220 500,160 500,92',
]

// ─── Sub-branches (decorative forks) ──────────────────────────────────────────
export const SUB_BRANCH_PATHS: string[] = [
  'M 380,280 C 330,255 280,240 240,260',
  'M 350,240 C 310,210 270,195 240,205',
  'M 450,200 C 420,175 390,165 360,180',
  'M 550,200 C 580,175 610,165 640,180',
  'M 650,240 C 690,210 730,195 760,205',
  'M 620,280 C 670,255 720,240 760,260',
  'M 480,195 C 468,165 458,140 450,125',
  'M 520,195 C 532,165 542,140 550,125',
]

// ─── Root paths ────────────────────────────────────────────────────────────────
export const ROOT_PATHS: string[] = [
  'M 490,670 C 450,665 380,672 320,660',
  'M 490,672 C 470,680 420,690 370,685',
  'M 500,675 C 500,680 498,692 494,700',
  'M 510,670 C 550,665 620,672 680,660',
  'M 510,672 C 530,680 580,690 630,685',
  'M 500,675 C 500,682 502,694 506,702',
]

// ─── Leaf clusters (canopy ellipses) ──────────────────────────────────────────
export interface LeafCluster {
  cx: number
  cy: number
  rx: number
  ry: number
  rotation: number
  opacity: number
  variant: 0 | 1  // 0 = primary leaf color, 1 = secondary leaf color
}

export const LEAF_CLUSTERS: LeafCluster[] = [
  // Top-center crown
  { cx: 500, cy: 100, rx: 80, ry: 55, rotation: 0,   opacity: 0.85, variant: 0 },
  { cx: 480, cy: 88,  rx: 55, ry: 40, rotation: -12, opacity: 0.70, variant: 1 },
  { cx: 520, cy: 85,  rx: 60, ry: 42, rotation: 15,  opacity: 0.68, variant: 0 },
  { cx: 500, cy: 70,  rx: 45, ry: 32, rotation: 0,   opacity: 0.55, variant: 1 },

  // Left wing
  { cx: 210, cy: 210, rx: 75, ry: 52, rotation: -20, opacity: 0.82, variant: 0 },
  { cx: 185, cy: 198, rx: 52, ry: 38, rotation: -35, opacity: 0.65, variant: 1 },
  { cx: 240, cy: 195, rx: 58, ry: 40, rotation: -10, opacity: 0.72, variant: 0 },
  { cx: 175, cy: 225, rx: 42, ry: 30, rotation: -45, opacity: 0.50, variant: 1 },
  { cx: 160, cy: 210, rx: 35, ry: 25, rotation: -55, opacity: 0.42, variant: 0 },

  // Left-center cluster
  { cx: 310, cy: 150, rx: 72, ry: 50, rotation: -15, opacity: 0.80, variant: 0 },
  { cx: 285, cy: 140, rx: 50, ry: 36, rotation: -28, opacity: 0.65, variant: 1 },
  { cx: 338, cy: 138, rx: 55, ry: 38, rotation: -5,  opacity: 0.70, variant: 0 },
  { cx: 295, cy: 122, rx: 40, ry: 28, rotation: -20, opacity: 0.52, variant: 1 },

  // Center-left cluster (node 2 area)
  { cx: 432, cy: 108, rx: 68, ry: 48, rotation: -8,  opacity: 0.78, variant: 0 },
  { cx: 408, cy: 96,  rx: 48, ry: 34, rotation: -20, opacity: 0.62, variant: 1 },
  { cx: 455, cy: 95,  rx: 52, ry: 36, rotation: 8,   opacity: 0.68, variant: 0 },
  { cx: 420, cy: 78,  rx: 38, ry: 27, rotation: -12, opacity: 0.50, variant: 1 },

  // Center-right cluster (node 3 area)
  { cx: 568, cy: 108, rx: 68, ry: 48, rotation: 8,   opacity: 0.78, variant: 0 },
  { cx: 545, cy: 96,  rx: 48, ry: 34, rotation: -8,  opacity: 0.62, variant: 1 },
  { cx: 592, cy: 95,  rx: 52, ry: 36, rotation: 20,  opacity: 0.68, variant: 0 },
  { cx: 580, cy: 78,  rx: 38, ry: 27, rotation: 12,  opacity: 0.50, variant: 1 },

  // Right-center cluster
  { cx: 690, cy: 150, rx: 72, ry: 50, rotation: 15,  opacity: 0.80, variant: 0 },
  { cx: 662, cy: 140, rx: 50, ry: 36, rotation: 5,   opacity: 0.65, variant: 1 },
  { cx: 715, cy: 138, rx: 55, ry: 38, rotation: 28,  opacity: 0.70, variant: 0 },
  { cx: 705, cy: 122, rx: 40, ry: 28, rotation: 20,  opacity: 0.52, variant: 1 },

  // Right wing
  { cx: 790, cy: 210, rx: 75, ry: 52, rotation: 20,  opacity: 0.82, variant: 0 },
  { cx: 815, cy: 198, rx: 52, ry: 38, rotation: 35,  opacity: 0.65, variant: 1 },
  { cx: 760, cy: 195, rx: 58, ry: 40, rotation: 10,  opacity: 0.72, variant: 0 },
  { cx: 825, cy: 225, rx: 42, ry: 30, rotation: 45,  opacity: 0.50, variant: 1 },
  { cx: 840, cy: 210, rx: 35, ry: 25, rotation: 55,  opacity: 0.42, variant: 0 },

  // Mid-canopy connective foliage
  { cx: 370, cy: 175, rx: 60, ry: 42, rotation: -15, opacity: 0.55, variant: 0 },
  { cx: 630, cy: 175, rx: 60, ry: 42, rotation: 15,  opacity: 0.55, variant: 0 },
  { cx: 450, cy: 145, rx: 55, ry: 38, rotation: -5,  opacity: 0.50, variant: 1 },
  { cx: 550, cy: 145, rx: 55, ry: 38, rotation: 5,   opacity: 0.50, variant: 1 },

  // Upper-fill wisps
  { cx: 500, cy: 130, rx: 65, ry: 44, rotation: 0,   opacity: 0.45, variant: 0 },
  { cx: 465, cy: 115, rx: 42, ry: 30, rotation: -10, opacity: 0.38, variant: 1 },
  { cx: 535, cy: 115, rx: 42, ry: 30, rotation: 10,  opacity: 0.38, variant: 1 },

  // Far outer wisps
  { cx: 130, cy: 235, rx: 38, ry: 26, rotation: -60, opacity: 0.32, variant: 0 },
  { cx: 870, cy: 235, rx: 38, ry: 26, rotation: 60,  opacity: 0.32, variant: 0 },

  // Lower canopy fringe
  { cx: 270, cy: 270, rx: 50, ry: 32, rotation: -25, opacity: 0.40, variant: 1 },
  { cx: 730, cy: 270, rx: 50, ry: 32, rotation: 25,  opacity: 0.40, variant: 1 },
]

// ─── Interactive note node positions ──────────────────────────────────────────
export interface NodePosition {
  x: number
  y: number
}

export const NODE_POSITIONS: NodePosition[] = [
  { x: 175, y: 215 },   // 0 — far left
  { x: 300, y: 155 },   // 1 — left-center
  { x: 430, y: 110 },   // 2 — center-left
  { x: 570, y: 110 },   // 3 — center-right
  { x: 700, y: 155 },   // 4 — right-center
  { x: 825, y: 215 },   // 5 — far right
  { x: 500, y: 80  },   // 6 — very top center
]

// ─── Accent colors per sourceType ─────────────────────────────────────────────
export const SOURCE_TYPE_COLOR: Record<string, string> = {
  book:   'hsl(38 93% 54%)',
  code:   'hsl(217 91% 62%)',
  life:   'hsl(158 80% 44%)',
  design: 'hsl(345 78% 60%)',
}
