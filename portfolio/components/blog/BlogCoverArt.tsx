import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn line-art scenes for the cover placeholder. Each scene depicts an
 * everyday object that matches the article's theme (chosen by pickSceneKey), so
 * the illustration actually means something — a growth essay shows a plant by a
 * window, a tech essay a laptop, a friendship essay two cups, and so on.
 *
 * Pure SVG in currentColor; the parent sets color + opacity so the art stays
 * tonal and on-brand over the themed gradient.
 */

function frame(children: ReactNode) {
  return (
    <svg
      viewBox="0 0 320 180"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[58%] w-[58%]"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const SCENES: Record<string, ReactNode> = {
  // Desk with an open notebook, a cup and a pen — effort, habits, work.
  desk: frame(
    <>
      <path d="M34 140 H286" />
      <path d="M160 110 C142 100 126 102 120 106 L120 134 C126 130 142 130 160 138" />
      <path d="M160 110 C178 100 194 102 200 106 L200 134 C194 130 178 130 160 138" />
      <path d="M132 116 H150 M132 124 H150 M170 116 H188 M170 124 H188" strokeWidth={2.2} />
      <path d="M228 120 V134 Q228 140 234 140 H248 Q254 140 254 134 V120" />
      <path d="M254 123 Q263 123 263 130 Q263 136 254 135" />
      <path d="M236 108 Q233 113 238 117 M246 108 Q243 113 248 117" strokeWidth={2.2} />
      <path d="M96 136 L118 112" />
    </>,
  ),
  // Open laptop at rest with a cup — technology, focus, minimalism.
  laptop: frame(
    <>
      <path d="M34 142 H286" />
      <path d="M118 78 H202 V124 H118 Z" />
      <path d="M104 124 H216 L208 138 H112 Z" />
      <path d="M132 132 H188" strokeWidth={2.2} />
      <path d="M238 122 V134 Q238 139 243 139 H255 Q260 139 260 134 V122" />
      <path d="M260 125 Q267 125 267 130 Q267 135 260 134" />
    </>,
  ),
  // Potted plant on a sunlit windowsill — growth, slow living, healing.
  plant: frame(
    <>
      <path d="M110 44 H212 V134 H110 Z" />
      <path d="M161 44 V134 M110 90 H212" strokeWidth={2.4} />
      <path d="M96 134 H226" />
      <path d="M150 132 H172 L168 116 H154 Z" />
      <path d="M161 116 C161 102 156 94 149 90 M161 116 C161 100 167 94 175 92" />
      <path d="M149 90 q-7 -1 -8 6 q7 1 8 -6 M175 92 q7 -2 9 5 q-7 2 -9 -5" strokeWidth={2.2} />
      <circle cx="80" cy="60" r="12" />
      <path d="M80 40 V46 M80 74 V80 M60 60 H66 M94 60 H100 M66 46 L70 50 M94 74 L90 70" strokeWidth={2.2} />
    </>,
  ),
  // A steaming cup on a windowsill — self-worth, rest, quiet reflection.
  tea: frame(
    <>
      <path d="M112 46 H208 V130 H112 Z" />
      <path d="M160 46 V130 M112 88 H208" strokeWidth={2.4} />
      <path d="M98 130 H222" />
      <path d="M142 110 V124 Q142 132 150 132 H168 Q176 132 176 124 V110 Z" />
      <path d="M176 113 Q186 113 186 121 Q186 129 176 128" />
      <path d="M150 96 Q146 102 152 108 M168 96 Q164 102 170 108" strokeWidth={2.2} />
    </>,
  ),
  // A small stack of books and a cup — books, learning, reflection.
  books: frame(
    <>
      <path d="M34 140 H286" />
      <path d="M104 124 H202 V138 H104 Z" />
      <path d="M112 110 H196 V124 H112 Z" />
      <path d="M120 96 H188 V110 H120 Z" />
      <path d="M132 96 V110 M168 110 V124 M148 124 V138" strokeWidth={2.2} />
      <path d="M180 96 V86 L185 90 L190 86 V96" strokeWidth={2.2} />
      <path d="M226 122 V134 Q226 139 231 139 H243 Q248 139 248 134 V122" />
      <path d="M248 125 Q255 125 255 130 Q255 135 248 134" />
    </>,
  ),
  // Two cups set a little apart — friendship, love, boundaries.
  "two-cups": frame(
    <>
      <path d="M34 142 H286" />
      <path d="M92 116 V132 Q92 140 100 140 H118 Q126 140 126 132 V116 Z" />
      <path d="M126 120 Q136 120 136 128 Q136 136 126 135" />
      <path d="M100 100 Q96 107 102 114" strokeWidth={2.2} />
      <path d="M194 116 V132 Q194 140 202 140 H220 Q228 140 228 132 V116 Z" />
      <path d="M194 120 Q184 120 184 128 Q184 136 194 135" />
      <path d="M218 100 Q214 107 220 114" strokeWidth={2.2} />
    </>,
  ),
  // Rain on a window with a soft curtain — letting go, emotion, observation.
  rain: frame(
    <>
      <path d="M104 42 H216 V140 H104 Z" />
      <path d="M160 42 V140 M104 91 H216" strokeWidth={2.4} />
      <path d="M124 56 L118 72 M140 60 L134 76 M178 56 L172 72 M196 62 L190 78 M132 104 L126 120 M184 106 L178 122" strokeWidth={2.2} />
      <path d="M204 44 C198 70 210 92 204 138" strokeWidth={2.4} />
    </>,
  ),
  // A winding path toward the horizon at dawn — direction, perseverance.
  path: frame(
    <>
      <path d="M60 100 H260" strokeWidth={2.4} />
      <path d="M60 100 Q96 84 132 100 M188 100 Q224 84 260 100" strokeWidth={2.2} />
      <path d="M138 168 C142 142 150 120 156 100" />
      <path d="M186 168 C180 142 170 120 164 100" />
      <path d="M160 150 V142 M160 130 V124 M160 114 V110" strokeWidth={2.2} />
      <circle cx="206" cy="84" r="11" />
      <path d="M206 66 V72 M188 84 H194 M218 84 H224" strokeWidth={2.2} />
    </>,
  ),
  // An envelope under a desk lamp — letters, family, kindness.
  letter: frame(
    <>
      <path d="M34 146 H286" />
      <path d="M92 106 H184 V142 H92 Z" />
      <path d="M92 106 L138 132 L184 106" />
      <path d="M236 146 q-12 0 -12 -4 q0 -4 12 -4 q12 0 12 4 q0 4 -12 4" strokeWidth={2.4} />
      <path d="M236 138 V120 L214 92" />
      <path d="M200 90 H230 L224 104 H206 Z" />
      <path d="M210 108 L204 118 M218 108 L214 120" strokeWidth={2} />
    </>,
  ),
};

export function BlogCoverArt({ scene, className }: { scene: string; className?: string }) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center", className)}>
      {SCENES[scene] ?? SCENES.desk}
    </div>
  );
}
