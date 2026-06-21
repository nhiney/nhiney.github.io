"use client";

/**
 * Hand-drawn doodle set — wobbly, "drawn-with-a-marker" SVGs for the papercraft
 * layer (Mr. Panda inspired). Every stroke uses `currentColor`, so colour comes
 * from a Tailwind text utility on the wrapper (e.g. `text-paper-rose`). Fills use
 * the paper design tokens. Shapes are intentionally imperfect — that *is* the
 * aesthetic — so don't "tidy" the paths into clean geometry.
 */

import type { CSSProperties } from "react";

type DoodleProps = {
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
};

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* A curved, hand-sketched arrow — points the eye toward a CTA. */
export function DoodleArrow({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 90 60" className={className} style={style} aria-hidden>
      <path {...base} strokeWidth={3.2} d="M6 12 C 30 4, 64 8, 74 40" />
      <path {...base} strokeWidth={3.2} d="M60 33 L 76 42 L 80 25" />
    </svg>
  );
}

/* A four-point sparkle / twinkle star. */
export function DoodleStar({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden>
      <path
        {...base}
        strokeWidth={3}
        d="M20 3 C 22 15, 25 18, 37 20 C 25 22, 22 25, 20 37 C 18 25, 15 22, 3 20 C 15 18, 18 15, 20 3 Z"
      />
    </svg>
  );
}

/* A tiny plus-sparkle. */
export function DoodleSparkle({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path {...base} strokeWidth={2.6} d="M12 3 L12 21 M3 12 L21 12" />
    </svg>
  );
}

/* A hand-drawn heart. */
export function DoodleHeart({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 38" className={className} style={style} aria-hidden>
      <path
        {...base}
        strokeWidth={3}
        d="M20 34 C 4 23, 3 9, 13 7 C 18 6, 20 11, 20 13 C 20 11, 22 6, 27 7 C 37 9, 36 23, 20 34 Z"
      />
    </svg>
  );
}

/* A little smiling sun. */
export function DoodleSun({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 56 56" className={className} style={style} aria-hidden>
      <circle {...base} strokeWidth={2.8} cx={28} cy={28} r={12} />
      <path
        {...base}
        strokeWidth={2.6}
        d="M28 6 L28 13 M28 43 L28 50 M6 28 L13 28 M43 28 L50 28 M12 12 L17 17 M39 39 L44 44 M44 12 L39 17 M17 39 L12 44"
      />
    </svg>
  );
}

/* A small potted plant / sprig. */
export function DoodleLeaf({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 44 56" className={className} style={style} aria-hidden>
      <path {...base} strokeWidth={2.8} d="M22 52 L22 22" />
      <path {...base} strokeWidth={2.8} d="M22 30 C 10 28, 6 18, 8 10 C 18 12, 24 20, 22 30 Z" />
      <path {...base} strokeWidth={2.8} d="M22 36 C 34 34, 38 24, 36 16 C 26 18, 20 26, 22 36 Z" />
    </svg>
  );
}

/* A scribbly little open book. */
export function DoodleBook({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 56 44" className={className} style={style} aria-hidden>
      <path {...base} strokeWidth={2.8} d="M28 10 C 20 4, 10 5, 5 8 L5 36 C 10 33, 20 32, 28 38" />
      <path {...base} strokeWidth={2.8} d="M28 10 C 36 4, 46 5, 51 8 L51 36 C 46 33, 36 32, 28 38 Z" />
      <path {...base} strokeWidth={2.2} d="M11 16 L22 18 M11 23 L22 25 M34 18 L45 16 M34 25 L45 23" />
    </svg>
  );
}

/* A loose hand-drawn ring you can lasso around a word. */
export function DoodleCircle({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 80" className={className} style={style} aria-hidden preserveAspectRatio="none">
      <path
        {...base}
        strokeWidth={3}
        d="M100 6 C 40 4, 8 20, 10 40 C 12 64, 70 76, 120 74 C 178 72, 196 52, 190 32 C 184 14, 140 6, 96 8"
      />
    </svg>
  );
}

/* A wobbly hand-drawn underline — sits beneath a highlighted word. */
export function DoodleUnderline({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 220 16" preserveAspectRatio="none" className={className} style={style} aria-hidden>
      <path {...base} strokeWidth={4} d="M4 9 C 50 15, 96 3, 140 9 C 174 13, 198 11, 216 6" />
    </svg>
  );
}

/* A torn-paper edge — drop between sections as a divider strip. */
export function TornEdge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <path
        d="M0 24 V10 C 60 2 100 18 160 12 S 280 0 360 10 480 22 560 12 720 2 820 12 960 22 1060 10 1160 4 1200 12 V24 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Paper mascot — a cuddly hand-drawn character waving hello. Deliberately simple
 * and a little wonky (closed happy eyes, rosy cheeks) to stay friendly, not
 * uncanny. Skin/hair are literal warm hex so they read in both themes; cheeks,
 * sweater and outline ride the paper tokens.
 */
export function PaperMascot({ className, style }: DoodleProps) {
  const ink = "hsl(var(--paper-ink))";
  const rose = "hsl(var(--paper-rose))";   // repurposed: the single slate accent
  const skin = "#E7DDD3";                   // neutral warm-gray
  const hair = "#2E2C2A";                   // near-charcoal
  return (
    <svg viewBox="0 0 220 260" className={className} style={style} aria-hidden>
      <g fill="none" stroke={ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        {/* sweater / body */}
        <path
          d="M64 250 C 56 196, 64 154, 110 154 C 156 154, 164 196, 156 250 Z"
          fill={rose}
        />
        {/* waving arm + sleeve */}
        <path d="M150 184 C 172 176, 182 158, 178 142" fill={rose} />
        <circle cx={180} cy={134} r={9} fill={skin} />
        {/* back hair */}
        <ellipse cx={110} cy={106} rx={60} ry={62} fill={hair} />
        {/* face */}
        <circle cx={110} cy={94} r={50} fill={skin} />
        {/* bangs */}
        <path
          d="M62 86 C 66 50, 154 50, 158 86 C 150 66, 128 60, 110 72 C 92 60, 70 66, 62 86 Z"
          fill={hair}
        />
        {/* happy closed eyes */}
        <path d="M84 98 Q 92 107 100 98" />
        <path d="M120 98 Q 128 107 136 98" />
        {/* smile */}
        <path d="M101 116 Q 110 124 119 116" />
      </g>
      {/* soft cheeks (no stroke) — barely there */}
      <g fill={rose} opacity={0.28}>
        <ellipse cx={83} cy={112} rx={7} ry={4} />
        <ellipse cx={137} cy={112} rx={7} ry={4} />
      </g>
    </svg>
  );
}
