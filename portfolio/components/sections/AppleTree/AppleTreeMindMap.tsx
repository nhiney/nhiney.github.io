'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Code2, Leaf, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KNOWLEDGE_NOTES } from '@/lib/knowledge-notes'
import type { KnowledgeNote } from '@/lib/knowledge-notes'
import { KnowledgeTree } from './KnowledgeTree'
import { NoteCard } from './NoteCard'
import { NODE_POSITIONS, SVG_W, SVG_H, SOURCE_TYPE_COLOR } from './treePaths'

// ─── Mobile accordion item ────────────────────────────────────────────────────

function MobileNoteItem({ note }: { note: KnowledgeNote }) {
  const [open, setOpen] = useState(false)
  const color = SOURCE_TYPE_COLOR[note.sourceType] ?? SOURCE_TYPE_COLOR.book
  const Icon  = note.sourceType === 'book'   ? BookOpen
              : note.sourceType === 'code'   ? Code2
              : Leaf

  return (
    <motion.div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: `${color}30` }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <button
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
        style={{ background: `${color}0a` }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full"
            style={{ background: `${color}18` }}
          >
            <Icon size={13} style={{ color }} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold leading-tight truncate" style={{ color: 'hsl(var(--foreground))' }}>
              {note.title}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: `${color}bb` }}>
              {note.source}
            </p>
          </div>
        </div>
        {open
          ? <ChevronUp size={14} className="shrink-0 opacity-50" />
          : <ChevronDown size={14} className="shrink-0 opacity-50" />
        }
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{    height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-2.5">
              <p className="text-[11.5px] italic leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
                "{note.excerpt}"
              </p>
              {note.reflection && (
                <p className="text-[11px]" style={{ color: `${color}cc` }}>
                  ✦ {note.reflection}
                </p>
              )}
              <div className="flex flex-wrap gap-1 pt-0.5">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.11em]"
                    style={{ background: `${color}12`, color: `${color}bb` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main orchestrator ────────────────────────────────────────────────────────

export function AppleTreeMindMap({ className }: { className?: string }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Compute tooltip position in pixel-space relative to container
  const getTooltipProps = useCallback(() => {
    if (!hoveredId || !containerRef.current) return null

    const noteIndex = KNOWLEDGE_NOTES.findIndex((n) => n.id === hoveredId)
    if (noteIndex === -1) return null

    const nodePos  = NODE_POSITIONS[noteIndex]
    const rect     = containerRef.current.getBoundingClientRect()

    // The SVG is rendered at container width with aspect ratio locked.
    // Compute the actual rendered SVG dimensions.
    const containerW = rect.width
    const svgScale   = containerW / SVG_W
    const svgDisplayH = SVG_H * svgScale

    // Convert SVG coords → container-relative pixels
    const px = nodePos.x * svgScale
    const py = nodePos.y * svgScale

    // Decide placement: above if node is in lower half, below if upper half
    const placement: 'above' | 'below' = py < svgDisplayH * 0.55 ? 'below' : 'above'

    return {
      x: px,
      y: py,
      placement,
      containerW,
      svgDisplayH,
    }
  }, [hoveredId])

  const tip = getTooltipProps()
  const activeNote = hoveredId ? KNOWLEDGE_NOTES.find((n) => n.id === hoveredId) ?? null : null

  return (
    <div className={cn('relative w-full', className)}>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="mb-8 text-center space-y-2"
      >
        <p className="text-[11px] italic font-semibold uppercase tracking-[0.22em] text-primary/60">
          Digital Garden
        </p>
        <h2 className="text-2xl font-bold tracking-tight">
          Knowledge Garden{' '}
          <span className="text-primary/60 font-normal text-xl">/ Vườn Kiến Thức</span>
        </h2>
        <p className="text-[13px] text-muted-foreground/70 hidden sm:block">
          Notes &amp; insights from books and experience — hover a node to read
        </p>
      </motion.div>

      {/* ── Desktop tree ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.65 }}
        className="hidden sm:block"
      >
        <div
          ref={containerRef}
          className="relative mx-auto"
          style={{ maxWidth: 1060 }}
        >
          {/* Subtle radial glow behind the tree */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                'radial-gradient(ellipse 75% 55% at 50% 36%, hsl(130 45% 32% / 0.09) 0%, transparent 65%)',
            }}
          />

          <KnowledgeTree
            notes={KNOWLEDGE_NOTES}
            hoveredId={hoveredId}
            onHoverChange={setHoveredId}
          />

          {/* Tooltip overlay — absolutely positioned inside container */}
          <AnimatePresence mode="wait">
            {tip && activeNote && (
              <NoteCard
                key={activeNote.id}
                note={activeNote}
                x={tip.x}
                y={tip.y}
                placement={tip.placement}
                containerW={tip.containerW}
                svgDisplayH={tip.svgDisplayH}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Hint label */}
        <p className="mt-3 text-center text-[11px] text-muted-foreground/40 italic">
          {KNOWLEDGE_NOTES.length} notes · hover to explore
        </p>
      </motion.div>

      {/* ── Mobile accordion ─────────────────────────────────────────────────── */}
      <div className="sm:hidden space-y-2.5">
        <p className="text-center text-[11px] text-muted-foreground/60 italic mb-4">
          Tap a card to read the note
        </p>
        {KNOWLEDGE_NOTES.map((note) => (
          <MobileNoteItem key={note.id} note={note} />
        ))}
      </div>
    </div>
  )
}
