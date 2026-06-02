'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Code2, Leaf, Palette, Quote } from 'lucide-react'
import type { KnowledgeNote } from '@/lib/knowledge-notes'
import { SOURCE_TYPE_COLOR } from './treePaths'

// ─── Icon per sourceType ───────────────────────────────────────────────────────

const SOURCE_ICONS = {
  book:   BookOpen,
  code:   Code2,
  life:   Leaf,
  design: Palette,
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface NoteCardProps {
  note: KnowledgeNote | null
  x: number          // pixel x relative to container
  y: number          // pixel y relative to container
  placement: 'above' | 'below' | 'left' | 'right'
  containerW: number
  svgDisplayH: number
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function NoteCard({ note, x, y, placement, containerW }: NoteCardProps) {
  const CARD_W = 300

  // Compute card left so it never overflows the container
  let cardLeft = x - CARD_W / 2
  if (cardLeft < 8) cardLeft = 8
  if (cardLeft + CARD_W > containerW - 8) cardLeft = containerW - CARD_W - 8

  // Vertical offset — place above or below the node
  const CARD_OFFSET = 42
  const cardTop =
    placement === 'above' ? y - CARD_OFFSET : y + CARD_OFFSET

  if (!note) return null

  const color = SOURCE_TYPE_COLOR[note.sourceType] ?? SOURCE_TYPE_COLOR.book
  const Icon  = SOURCE_ICONS[note.sourceType]      ?? BookOpen

  // Y axis for AnimatePresence initial
  const yInit = placement === 'above' ? 10 : -10

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={note.id}
        style={{
          position:   'absolute',
          left:       cardLeft,
          top:        cardTop,
          width:      CARD_W,
          zIndex:     50,
          pointerEvents: 'none',
          // transform-origin for the spring
          transformOrigin: placement === 'above' ? 'bottom center' : 'top center',
        }}
        initial={{ opacity: 0, y: yInit, scale: 0.92 }}
        animate={{ opacity: 1, y: 0,     scale: 1     }}
        exit={{    opacity: 0, y: yInit, scale: 0.92  }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        {/* Card shell — glassmorphism */}
        <div
          className="rounded-2xl border shadow-2xl overflow-hidden"
          style={{
            background:  'hsl(var(--card) / 0.94)',
            backdropFilter: 'blur(16px)',
            borderColor: `${color}38`,
          }}
        >
          {/* Accent top bar */}
          <div
            className="h-[3px]"
            style={{ background: `linear-gradient(90deg, ${color}, ${color}22)` }}
          />

          <div className="p-4 space-y-3">
            {/* Header row: source badge + quote icon */}
            <div className="flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{ background: `${color}18` }}
              >
                <Icon size={11} style={{ color }} strokeWidth={2} />
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ color }}
                >
                  {note.source}
                </span>
              </div>
              <Quote size={14} className="opacity-20 shrink-0" style={{ color }} />
            </div>

            {/* Title */}
            <p
              className="text-[13px] font-bold leading-snug tracking-tight"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              {note.title}
            </p>

            {/* Excerpt */}
            <blockquote
              className="text-[11.5px] leading-relaxed italic border-l-2 pl-2.5"
              style={{
                color:       'hsl(var(--muted-foreground))',
                borderColor: `${color}50`,
              }}
            >
              {note.excerpt}
            </blockquote>

            {/* Personal reflection */}
            {note.reflection && (
              <p
                className="text-[10.5px] leading-relaxed"
                style={{ color: `${color}cc` }}
              >
                ✦ {note.reflection}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em]"
                  style={{
                    background: `${color}14`,
                    color:      `${color}cc`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
