'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Code2, Leaf, Palette, Sprout } from 'lucide-react'
import { KNOWLEDGE_NOTES, type KnowledgeNote } from '@/lib/knowledge-notes'

// Domain metadata
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

// View-box framed tightly around the broad tree. The tree illustration itself is
// a static raster baked at build time (scripts/generate-tree.mjs) — it used to be
// ~13,500 inline SVG nodes plus 400 infinite framer-motion animations, a 2 MB
// document that janked badly on phones/iPads. The interactive overlay nodes below
// are positioned in this same coordinate space, so they stay pixel-aligned with
// the baked image (whose aspect-ratio equals this view-box).
const VB = { x: 50, y: -20, w: 460, h: 490 }
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

  // Fruit nodes — one per insight, scattered across the canopy.
  const apples = useMemo(() => {
    const C = { x: 280, y: 162 }
    const Rx = 185, Ry = 145
    return KNOWLEDGE_NOTES.map((note, i) => {
      const a = (i * 2.399963) % (Math.PI * 2) // golden-angle spiral
      const rr = Math.sqrt((i + 0.5) / KNOWLEDGE_NOTES.length)
      return {
        note,
        x: C.x + Math.cos(a) * rr * Rx,
        y: C.y + Math.sin(a) * rr * Ry,
      }
    })
  }, [])

  return (
    <div className="relative w-full">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          <Sprout className="h-3 w-3 text-primary" /> Knowledge Tree
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Mind <span className="text-primary">Map</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          A growing tree of ideas, books, and engineering principles. Each{' '}
          <span className="font-semibold text-foreground text-primary">fruit</span> is an insight — hover to peak,
          click to read.
        </p>
        <p className="mt-4 font-mono text-[11px] tracking-wider text-muted-foreground/60">
          {KNOWLEDGE_NOTES.length} insights · {branches.length} branches · always growing
        </p>
      </motion.header>

      {/* ── The Tree (baked raster illustration — frameless, sits on the page) ─ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative mx-auto mt-8 w-full max-w-4xl"
      >
        <div className="relative w-full" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
          {/* Static tree image. The container's aspect-ratio equals the original
              view-box, so the image fills it exactly and the overlay nodes below
              (positioned via px()/py()) stay aligned. Only the theme-matched
              image is fetched — the off-theme <div> stays display:none. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-center bg-no-repeat dark:hidden"
            style={{ backgroundImage: 'url(/mind-map/tree-light.webp)', backgroundSize: '100% 100%' }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden bg-center bg-no-repeat dark:block"
            style={{ backgroundImage: 'url(/mind-map/tree-dark.webp)', backgroundSize: '100% 100%' }}
          />

          {/* realistic apple nodes — scattered over the canopy */}
          {apples.map(({ note, x, y }, i) => (
            <motion.button
              key={note.id}
              type="button"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.03 }}
              title={note.title}
              aria-label={note.title}
              className="group absolute z-10 flex h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all hover:scale-125 hover:z-30 dark:shadow-[0_0_12px_rgba(239,68,68,0.4)]"
              style={{ 
                left: px(x), 
                top: py(y),
                backgroundImage: 'radial-gradient(circle at 35% 30%, #fca5a5 0%, #ef4444 35%, #991b1b 100%)',
                boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.4), 0 3px 5px rgba(0,0,0,0.3)'
              }}
            >
              {/* Apple stem & tiny leaf */}
              <svg className="absolute -top-[6px] left-1/2 w-4 h-4 -translate-x-1/2 pointer-events-none" viewBox="0 0 12 12" fill="none">
                <path d="M5.5 5 C5.5 2.5 6.5 1 7.5 0.5" stroke="#451a03" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M6.5 2.5 C8.5 0.5 11 1.5 10.5 3.5 C9.5 5 7 4 6.5 2.5 Z" fill="#166534" stroke="#14532d" strokeWidth="0.5" />
              </svg>
              {/* Glossy highlight */}
              <span className="absolute top-[3px] left-[4px] h-[5px] w-[5px] rounded-full bg-white/50 blur-[0.5px] pointer-events-none" />
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
