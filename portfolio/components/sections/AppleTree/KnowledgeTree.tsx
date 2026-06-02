'use client'

import { useId } from 'react'
import type { KnowledgeNote } from '@/lib/knowledge-notes'
import {
  SVG_W, SVG_H,
  TRUNK_PATH,
  MAIN_BRANCH_PATHS,
  SUB_BRANCH_PATHS,
  ROOT_PATHS,
  LEAF_CLUSTERS,
  NODE_POSITIONS,
  SOURCE_TYPE_COLOR,
} from './treePaths'

// ─── Source-type symbols (render as SVG text) ─────────────────────────────────
const SOURCE_SYMBOLS: Record<string, string> = {
  book:   '☰',
  code:   '</>' ,
  life:   '✦',
  design: '◈',
}

// ─── Bark texture lines inside trunk ─────────────────────────────────────────
const BARK_LINES = [
  'M 484,640 C 487,618 488,598 485,576',
  'M 507,635 C 504,612 505,592 508,572',
  'M 492,560 C 495,540 496,522 493,504',
  'M 511,555 C 508,535 509,517 512,500',
  'M 487,490 C 490,472 491,456 488,438',
  'M 509,485 C 506,466 507,450 510,433',
  'M 493,420 C 495,404 496,390 494,376',
  'M 507,418 C 505,402 506,388 508,374',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2)
}

// ─── Component ───────────────────────────────────────────────────────────────
interface KnowledgeTreeProps {
  notes: KnowledgeNote[]
  hoveredId: string | null
  onHoverChange: (id: string | null) => void
}

export function KnowledgeTree({ notes, hoveredId, onHoverChange }: KnowledgeTreeProps) {
  const uid = useId().replace(/:/g, '')
  const nodeColors = notes.map((n) => SOURCE_TYPE_COLOR[n.sourceType] ?? SOURCE_TYPE_COLOR.book)

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width)  * SVG_W
    const py = ((e.clientY - rect.top)  / rect.height) * SVG_H
    const HIT = 40

    let bestId: string | null = null
    let bestD = Infinity
    for (let i = 0; i < NODE_POSITIONS.length; i++) {
      const note = notes[i]
      if (!note) continue
      const d = dist(px, py, NODE_POSITIONS[i].x, NODE_POSITIONS[i].y)
      if (d < HIT && d < bestD) { bestD = d; bestId = note.id }
    }
    onHoverChange(bestId)
  }

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="w-full h-auto cursor-default select-none"
      style={{ overflow: 'visible' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => onHoverChange(null)}
      aria-label="Knowledge Garden tree"
    >
      <defs>
        {/* Trunk gradient — top-to-bottom, lighter top */}
        <linearGradient id={`${uid}-trunk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--kt-trunk)"  stopOpacity="1"   />
          <stop offset="100%" stopColor="var(--kt-root)"   stopOpacity="0.9" />
        </linearGradient>

        {/* Canopy ambient glow */}
        <radialGradient id={`${uid}-canopy-glow`} cx="50%" cy="40%" r="55%">
          <stop offset="0%"   stopColor="var(--kt-leaf2)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--kt-leaf2)" stopOpacity="0"    />
        </radialGradient>

        {/* Per-node radial fills */}
        {notes.map((note, i) => (
          <radialGradient key={note.id} id={`${uid}-n${i}`} cx="38%" cy="34%" r="64%">
            <stop offset="0%"   stopColor={nodeColors[i]} stopOpacity="1"    />
            <stop offset="100%" stopColor={nodeColors[i]} stopOpacity="0.55" />
          </radialGradient>
        ))}

        {/* Node glow filter */}
        <filter id={`${uid}-nglow`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft drop shadow for leaf clusters */}
        <filter id={`${uid}-leafshadow`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="var(--kt-leaf)" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* ── Canopy ambient glow ───────────────────────────────────────────────── */}
      <ellipse cx="500" cy="185" rx="420" ry="210"
        fill={`url(#${uid}-canopy-glow)`}
      />

      {/* ── Ground shadow ────────────────────────────────────────────────────── */}
      <ellipse cx="500" cy="685" rx="130" ry="14"
        fill="var(--kt-root)" opacity="0.18"
      />

      {/* ── Roots ────────────────────────────────────────────────────────────── */}
      <g fill="none" strokeLinecap="round">
        {ROOT_PATHS.map((d, i) => (
          <path key={i} d={d}
            stroke="var(--kt-root)"
            strokeWidth={i % 2 === 0 ? 7 : 4}
            opacity="0.65"
          />
        ))}
      </g>

      {/* ── Trunk ────────────────────────────────────────────────────────────── */}
      <path d={TRUNK_PATH} fill={`url(#${uid}-trunk)`} />
      {/* Bark texture */}
      <g fill="none" strokeLinecap="round">
        {BARK_LINES.map((d, i) => (
          <path key={i} d={d}
            stroke="var(--kt-branch)"
            strokeWidth={i % 2 === 0 ? 1.2 : 0.9}
            opacity={0.28 + (i % 3) * 0.06}
          />
        ))}
      </g>

      {/* ── Sub-branches ─────────────────────────────────────────────────────── */}
      <g fill="none" strokeLinecap="round">
        {SUB_BRANCH_PATHS.map((d, i) => (
          <path key={i} d={d}
            stroke="var(--kt-branch)"
            strokeWidth={2.5}
            opacity="0.5"
          />
        ))}
      </g>

      {/* ── Main branches ────────────────────────────────────────────────────── */}
      <g fill="none" strokeLinecap="round">
        {MAIN_BRANCH_PATHS.map((d, i) => (
          <path key={i} d={d}
            stroke="var(--kt-trunk)"
            strokeWidth={i === 6 ? 6 : 8}
            opacity="0.9"
          />
        ))}
      </g>

      {/* ── Leaf clusters ────────────────────────────────────────────────────── */}
      <g filter={`url(#${uid}-leafshadow)`}>
        {LEAF_CLUSTERS.map((lc, i) => (
          <ellipse key={i}
            cx={lc.cx} cy={lc.cy} rx={lc.rx} ry={lc.ry}
            fill={lc.variant === 0 ? 'var(--kt-leaf)' : 'var(--kt-leaf2)'}
            opacity={lc.opacity}
            transform={lc.rotation !== 0 ? `rotate(${lc.rotation} ${lc.cx} ${lc.cy})` : undefined}
          />
        ))}
      </g>

      {/* ── Note nodes ───────────────────────────────────────────────────────── */}
      {NODE_POSITIONS.map((pos, i) => {
        const note     = notes[i]
        if (!note) return null
        const color    = nodeColors[i]
        const isActive = hoveredId === note.id
        const isDimmed = hoveredId !== null && !isActive
        const symbol   = SOURCE_SYMBOLS[note.sourceType] ?? '✦'
        const R        = isActive ? 23 : 19

        return (
          <g key={note.id} style={{ opacity: isDimmed ? 0.3 : 1, transition: 'opacity 0.3s ease' }}>

            {/* Far outer idle-float ring */}
            <circle cx={pos.x} cy={pos.y} r={34}
              fill="none" stroke={color} strokeWidth="0.8" opacity="0.18"
              style={{ animation: `kt-float ${3.4 + i * 0.45}s ease-in-out ${i * 0.35}s infinite` }}
            />

            {/* Active double-ripple */}
            {isActive && [0, 0.6].map((delay, k) => (
              <circle key={k} cx={pos.x} cy={pos.y} r={R + 4}
                fill="none" stroke={color} strokeWidth="1.5"
                style={{ animation: `kt-ripple 1.5s ease-out ${delay}s infinite` }}
              />
            ))}

            {/* Soft glow halo */}
            <circle cx={pos.x} cy={pos.y}
              r={isActive ? R + 12 : R + 6}
              fill={color}
              opacity={isActive ? 0.2 : 0.08}
            />

            {/* Core orb */}
            <circle
              cx={pos.x} cy={pos.y} r={R}
              fill={`url(#${uid}-n${i})`}
              stroke={color}
              strokeWidth={isActive ? 2.5 : 1.5}
              filter={isActive ? `url(#${uid}-nglow)` : undefined}
              style={{ transition: 'r 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
            />

            {/* Inner shine arc */}
            <path
              d={`M ${pos.x - R * 0.45},${pos.y - R * 0.55} A ${R * 0.6},${R * 0.5} 0 0,1 ${pos.x + R * 0.3},${pos.y - R * 0.6}`}
              fill="none" stroke="white" strokeWidth="1.5"
              strokeLinecap="round" opacity="0.35"
            />

            {/* Source-type symbol */}
            <text
              x={pos.x} y={pos.y + 0.5}
              textAnchor="middle" dominantBaseline="central"
              fontSize={note.sourceType === 'code' ? '8.5' : '12'}
              fontWeight="700"
              fill="white" opacity="0.92"
              style={{
                fontFamily: note.sourceType === 'code' ? 'monospace' : 'var(--font-inter), sans-serif',
                pointerEvents: 'none',
                letterSpacing: note.sourceType === 'code' ? '-0.5px' : '0',
              }}
            >
              {symbol}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
