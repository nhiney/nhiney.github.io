'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Code2, Leaf, Palette, Sprout } from 'lucide-react'
import { KNOWLEDGE_NOTES, type KnowledgeNote } from '@/lib/knowledge-notes'

// ─── Domain metadata ─────────────────────────────────────────────────────────
// `pos` is the label's point in the SVG view-box; the stage matches that ratio
// so the HTML label sits over the right part of the canopy.
type GroupKey = 'book' | 'code' | 'design' | 'life'

const GROUP_META: Record<
  GroupKey,
  { label: string; Icon: typeof BookOpen; blurb: string; pos: { x: number; y: number } }
> = {
  book: {
    label: 'Books',
    Icon: BookOpen,
    blurb: 'Ideas worth keeping from the books that shaped how I think.',
    pos: { x: 178, y: 196 },
  },
  code: {
    label: 'Code',
    Icon: Code2,
    blurb: 'Engineering principles I lean on when designing and building systems.',
    pos: { x: 226, y: 120 },
  },
  design: {
    label: 'Design',
    Icon: Palette,
    blurb: 'Lessons on making interfaces clear, calm, and genuinely usable.',
    pos: { x: 334, y: 120 },
  },
  life: {
    label: 'Life',
    Icon: Leaf,
    blurb: 'Notes on focus, growth, and building a sustainable life.',
    pos: { x: 382, y: 196 },
  },
}
const ORDER: GroupKey[] = ['book', 'code', 'design', 'life']

// Glyph shown on each apple node, picked by the note's domain.
const GROUP_GLYPH: Record<GroupKey, string> = {
  book: '☰',
  code: '</>',
  design: '◈',
  life: '✦',
}

// View-box framed tightly around the broad tree.
const VB = { x: 50, y: 2, w: 460, h: 468 }

// ─── Tree generation ─────────────────────────────────────────────────────────
// A seeded PRNG keeps the result identical on server & client (no hydration
// drift). Branches are tapered, curved, FILLED shapes; the canopy is a dense
// broad crown, lit from the top — a real tree, not a tidy diagram.
type Seg = { d: string; w: number }
type Lf = { x: number; y: number; rot: number; sz: number; shade: number }
type Blob = { x: number; y: number; r: number }
type Pt = { x: number; y: number }

function buildTree() {
  const mulberry32 = (a: number) => () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const rng = mulberry32(77123)
  const R = (d: number) => (d * Math.PI) / 180
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
  const sub = (a: Pt, b: Pt) => ({ x: a.x - b.x, y: a.y - b.y })
  const add = (a: Pt, b: Pt, s = 1) => ({ x: a.x + b.x * s, y: a.y + b.y * s })
  const unit = (v: Pt) => { const l = Math.hypot(v.x, v.y) || 1; return { x: v.x / l, y: v.y / l } }
  const perp = (v: Pt) => ({ x: -v.y, y: v.x })

  const branches: Seg[] = []
  const leaves: Lf[] = []
  const blobs: Blob[] = []

  const taper = (B: Pt, T: Pt, wB: number, wT: number, bow: number): string => {
    const n = perp(unit(sub(T, B)))
    const mid = { x: (B.x + T.x) / 2, y: (B.y + T.y) / 2 }
    const C = add(mid, n, bow)
    const wM = (wB + wT) / 2
    const f = (p: Pt) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    return (
      `M ${f(add(B, n, wB / 2))} Q ${f(add(C, n, wM / 2))} ${f(add(T, n, wT / 2))} ` +
      `L ${f(add(T, n, -wT / 2))} Q ${f(add(C, n, -wM / 2))} ${f(add(B, n, -wB / 2))} Z`
    )
  }
  const grow = (B: Pt, ang: number, len: number, w: number, depth: number) => {
    const T = { x: B.x + Math.cos(ang) * len, y: B.y + Math.sin(ang) * len }
    const wEnd = Math.max(1.2, w * 0.7)
    const bow = (rng() - 0.5) * len * 0.2
    branches.push({ d: taper(B, T, w, wEnd, bow), w })
    if (depth <= 0) return
    const kids = depth > 1 ? 2 : rng() < 0.4 ? 3 : 2
    const spread = 20 + rng() * 16
    for (let i = 0; i < kids; i++) {
      const t = i / (kids - 1) - 0.5
      const da = t * spread + (rng() - 0.5) * 11
      let na = ang + R(da)
      na = na * 0.9 + R(-90) * 0.1 // gentle upward bias
      grow(T, na, len * 0.74, wEnd * 0.92, depth - 1)
    }
  }

  const baseX = 280
  const ground = 452
  const trunkTop = { x: 280, y: 322 }
  branches.push({ d: taper({ x: baseX, y: ground }, trunkTop, 42, 27, (rng() - 0.5) * 5), w: 42 })
  for (const ra of [202, 224, 316, 338]) {
    const dir = { x: Math.cos(R(ra)), y: Math.sin(R(ra)) }
    const e = { x: baseX + dir.x * 44, y: ground + 10 }
    branches.push({ d: taper({ x: baseX, y: ground - 8 }, e, 18, 3, (rng() - 0.5) * 5), w: 18 })
  }
  const limbs = [
    { a: -146, l: 74 }, { a: -120, l: 92 }, { a: -98, l: 100 },
    { a: -82, l: 100 }, { a: -60, l: 92 }, { a: -34, l: 74 },
  ]
  for (const L of limbs) grow(trunkTop, R(L.a), L.l, 22, 3)

  // canopy — a dense broad crown, lit from the top, with an organic bumpy edge
  const C = { x: 280, y: 162 }
  const Rx = 208, Ry = 158
  const ph = rng() * 6.28, ph2 = rng() * 6.28
  const edge = (a: number) => 0.83 + 0.11 * Math.sin(a * 3 + ph) + 0.06 * Math.sin(a * 5 + ph2)
  for (let i = 0; i < 1500; i++) {
    const a = rng() * Math.PI * 2
    const rr = Math.pow(rng(), 0.6) * edge(a)
    const x = C.x + Math.cos(a) * rr * Rx
    const y = C.y + Math.sin(a) * rr * Ry
    const h = (C.y - y) / Ry // +1 top … −1 bottom → lights the crown from above
    const shade = clamp(0.5 + 0.34 * h + (rng() - 0.5) * 0.55, 0, 1)
    leaves.push({ x, y, rot: rng() * 180, sz: 0.82 + rng() * 0.5, shade })
  }
  for (let i = 0; i < 24; i++) {
    const a = rng() * Math.PI * 2
    const rr = Math.pow(rng(), 0.5) * 0.72
    blobs.push({ x: C.x + Math.cos(a) * rr * Rx, y: C.y + Math.sin(a) * rr * Ry, r: 28 + rng() * 18 })
  }
  return { branches, leaves, blobs }
}

const TREE = buildTree()
const px = (n: number) => `${(((n - VB.x) / VB.w) * 100).toFixed(2)}%`
const py = (n: number) => `${(((n - VB.y) / VB.h) * 100).toFixed(2)}%`

interface Branch {
  key: GroupKey
  label: string
  Icon: typeof BookOpen
  blurb: string
  pos: { x: number; y: number }
  notes: { note: KnowledgeNote; n: number }[]
}

export const AppleTreeMindMap = () => {
  const branches = useMemo<Branch[]>(() => {
    let n = 0
    const out: Branch[] = []
    for (const k of ORDER) {
      const notes = KNOWLEDGE_NOTES.filter((x) => x.sourceType === k)
      if (!notes.length) continue
      out.push({ key: k, ...GROUP_META[k], notes: notes.map((note) => ({ note, n: ++n })) })
    }
    return out
  }, [])

  // Apple nodes — one per note, in canonical order, scattered across the canopy.
  // A seeded scatter keeps server/client output identical (no hydration drift).
  const apples = useMemo(() => {
    const C = { x: 280, y: 162 }
    const Rx = 168, Ry = 126
    return KNOWLEDGE_NOTES.map((note, i) => {
      const a = (i * 2.399963) % (Math.PI * 2) // golden-angle spiral
      const rr = Math.sqrt((i + 0.5) / KNOWLEDGE_NOTES.length)
      return {
        note,
        glyph: GROUP_GLYPH[note.sourceType as GroupKey],
        x: C.x + Math.cos(a) * rr * Rx,
        y: C.y + Math.sin(a) * rr * Ry,
      }
    })
  }, [])

  const thickWood = TREE.branches.filter((b) => b.w >= 12)
  const thinWood = TREE.branches.filter((b) => b.w < 12)
  const leafDark = TREE.leaves.filter((l) => l.shade < 0.4)
  const leafMid = TREE.leaves.filter((l) => l.shade >= 0.4 && l.shade < 0.72)
  const leafLight = TREE.leaves.filter((l) => l.shade >= 0.72)
  const leafEl = (l: Lf, i: number) => (
    <ellipse
      key={i}
      cx={l.x.toFixed(1)}
      cy={l.y.toFixed(1)}
      rx={(4.2 * l.sz).toFixed(1)}
      ry={(2.6 * l.sz).toFixed(1)}
      transform={`rotate(${l.rot.toFixed(0)} ${l.x.toFixed(1)} ${l.y.toFixed(1)})`}
    />
  )

  return (
    <div className="relative w-full">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          <Sprout className="h-3 w-3 text-primary" /> Knowledge Tree
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Mind <span className="text-primary">Map</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          A growing tree of ideas, books, and engineering principles. Each{' '}
          <span className="font-semibold text-foreground">apple</span> is an insight — hover to peak,
          click to read.
        </p>
        <p className="mt-4 font-mono text-[11px] tracking-wider text-muted-foreground/60">
          {KNOWLEDGE_NOTES.length} insights · {branches.length} branches · always growing
        </p>
      </motion.header>

      {/* ── The Tree (organic illustration — frameless, sits on the page) ───── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative mx-auto mt-8 w-full max-w-3xl"
      >
        <div className="relative w-full" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
          <svg
            viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="kt-wood" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--kt-trunk)" />
                <stop offset="1" stopColor="var(--kt-branch)" />
              </linearGradient>
            </defs>

            {/* ground line */}
            <line
              x1={184} y1={456} x2={376} y2={456}
              stroke="currentColor"
              className="text-muted-foreground/30"
              strokeWidth={1.2}
              strokeDasharray="2 8"
              strokeLinecap="round"
            />

            {/* trunk + branches (wood) */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <g style={{ fill: 'var(--kt-branch)' }}>
                {thinWood.map((b, i) => (
                  <path key={i} d={b.d} />
                ))}
              </g>
              <g style={{ fill: 'url(#kt-wood)' }}>
                {thickWood.map((b, i) => (
                  <path key={i} d={b.d} />
                ))}
              </g>
            </motion.g>

            {/* canopy */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
            >
              <g style={{ fill: 'var(--kt-leaf)' }} fillOpacity={0.36}>
                {TREE.blobs.map((b, i) => (
                  <circle key={i} cx={b.x.toFixed(1)} cy={b.y.toFixed(1)} r={b.r.toFixed(1)} />
                ))}
              </g>
              <g style={{ fill: 'var(--kt-leaf)' }} fillOpacity={0.93}>{leafDark.map(leafEl)}</g>
              <g style={{ fill: 'var(--kt-leaf2)' }} fillOpacity={0.93}>{leafMid.map(leafEl)}</g>
              <g style={{ fill: 'var(--kt-leaf3)' }} fillOpacity={0.93}>{leafLight.map(leafEl)}</g>
            </motion.g>
          </svg>

          {/* apple nodes — one glyph per insight, scattered over the canopy */}
          {apples.map(({ note, glyph, x, y }, i) => (
            <motion.button
              key={note.id}
              type="button"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.03 }}
              title={note.title}
              aria-label={note.title}
              className="group absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/40 bg-card/80 font-mono text-[10px] text-primary shadow-sm backdrop-blur transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              style={{ left: px(x), top: py(y) }}
            >
              {glyph}
            </motion.button>
          ))}

          {/* domain labels over the canopy */}
          {branches.map((b, i) => (
            <motion.div
              key={b.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.95 + i * 0.1 }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: px(b.pos.x), top: py(b.pos.y) }}
            >
              <span className="flex items-center gap-1.5 rounded-full border border-border/70 bg-card/85 px-2.5 py-1 shadow-sm backdrop-blur">
                <b.Icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-bold tracking-wide text-foreground sm:text-xs">
                  {b.label}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{b.notes.length}</span>
              </span>
            </motion.div>
          ))}

          {/* root node — Knowledge */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ top: py(400) }}
          >
            <span className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-primary-foreground shadow-[0_8px_24px_-8px_hsl(var(--primary))]">
              <Sprout className="h-3.5 w-3.5" />
              <span className="text-[11px] font-black uppercase tracking-[0.12em]">Knowledge</span>
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Crawlable note content (visually hidden, kept for SEO & a11y) ────── */}
      <div className="sr-only">
        <h2>Knowledge notes by Nguyen Thi Yen Nhi</h2>
        {KNOWLEDGE_NOTES.map((note) => (
          <article key={note.id}>
            <h3>
              {note.title} — {note.source}
            </h3>
            <p>
              {note.excerpt}
              {note.reflection ? ` ${note.reflection}` : ''}
            </p>
            <p>{note.tags.join(', ')}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
