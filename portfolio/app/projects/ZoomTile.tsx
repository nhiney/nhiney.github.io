"use client";

import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }, []);
  return isTouch;
}

export type Tone = "red" | "amber" | "emerald" | "violet";

// All tones resolve to the single primary accent — sections are distinguished
// by their labels, not by colour, for a cleaner and more professional look.
const PRIMARY_TONE = {
  card: "bg-primary/[0.04] border-primary/20 dark:bg-primary/[0.06]",
  icon: "bg-primary/15 text-primary",
  bullet: "bg-primary/70",
  glow: "from-primary/15",
  ring: "ring-primary/40",
} as const;

export const TONE_PALETTE: Record<
  Tone,
  { card: string; icon: string; bullet: string; glow: string; ring: string }
> = {
  red: PRIMARY_TONE,
  amber: PRIMARY_TONE,
  emerald: PRIMARY_TONE,
  violet: PRIMARY_TONE,
};

export type Origin = "tl" | "tr" | "bl" | "br" | "tc" | "bc" | "c";

const ORIGIN_CSS: Record<Origin, string> = {
  tl: "top left",
  tr: "top right",
  bl: "bottom left",
  br: "bottom right",
  tc: "top center",
  bc: "bottom center",
  c: "center",
};

// ─── Comfortable tile (modal) — scale + max-height reveal ─────────────────────

const COMFORT_COLLAPSED = 84;
const COMFORT_EXPANDED = 820;
const COMFORT_SCALE = 1.15;

export function ZoomTile({
  icon: Icon,
  label,
  tone,
  origin,
  bgVar = "hsl(var(--card))",
  children,
}: {
  icon: LucideIcon;
  label: string;
  tone: Tone;
  origin: Origin;
  bgVar?: string;
  children: React.ReactNode;
}) {
  const palette = TONE_PALETTE[tone];
  const [hovered, setHovered] = useState(false);
  const isTouch = useIsTouchDevice();

  // On touch devices, show content fully expanded — no collapse, no scale.
  if (isTouch) {
    return (
      <div className={`overflow-hidden rounded-2xl border ${palette.card} p-5`}>
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${palette.icon}`}>
            <Icon size={16} />
          </div>
          <h3 className="text-[10.5px] font-black uppercase tracking-[0.25em] text-foreground">{label}</h3>
        </div>
        <div className="text-[14px] leading-[1.7] text-foreground/85">{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      initial={false}
      animate={{
        scale: hovered ? COMFORT_SCALE : 1,
        zIndex: hovered ? 80 : 1,
      }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      style={{ transformOrigin: ORIGIN_CSS[origin] }}
      onClick={(e) => e.stopPropagation()}
      className={`relative cursor-default overflow-hidden rounded-2xl border ${palette.card} p-6 outline-none ring-1 ring-transparent transition-colors ${
        hovered ? `${palette.ring} bg-card shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]` : ""
      }`}
    >
      {/* Solid backdrop when expanded — kills tile bg tint that washes text out. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-2xl bg-card transition-opacity duration-200 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${palette.icon}`}>
            <Icon size={16} />
          </div>
          <h3 className="text-[10.5px] font-black uppercase tracking-[0.25em] text-foreground">{label}</h3>
        </div>
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-foreground/15 bg-foreground/[0.04] text-foreground/55 transition-opacity duration-200 ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
        >
          <Maximize2 size={11} />
        </span>
      </div>

      <motion.div
        initial={false}
        animate={{ maxHeight: hovered ? COMFORT_EXPANDED : COMFORT_COLLAPSED }}
        transition={{ duration: 0.45, ease: [0.22, 0.9, 0.32, 1] }}
        className="relative mt-4 overflow-hidden"
      >
        <div
          className={`text-[14.5px] leading-7 transition-colors ${
            hovered ? "text-foreground" : "text-foreground/85"
          }`}
        >
          {children}
        </div>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 transition-opacity ${
            hovered ? "opacity-0 duration-0" : "opacity-100 duration-300"
          }`}
          style={{ backgroundImage: `linear-gradient(to top, ${bgVar} 15%, transparent)` }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Wide tile (listing) — anchor + width-based horizontal popout ─────────────

// Reserves a fixed-height slot so the popout overlays neighbours without
// pushing the grid row. The tile is bottom-anchored inside this slot so the
// expansion grows UPWARD over the rest of the card (easier on the eye than
// pushing the user's attention down into the next card).
const WIDE_SLOT_HEIGHT = 148;
const WIDE_COLLAPSED_MAX_H = 60;
// Modest max-height on expansion — the popout is WIDE so content reflows
// into fewer lines and rarely needs more vertical room than this.
const WIDE_EXPANDED_MAX_H = 320;
const WIDE_EXPANDED_W = 880;
const WIDE_MIN_W = 320; // never shrink the popout below this even on narrow viewports

// Smooth ease-out cubic — feels more polished than spring (no bounce, no
// overshoot) and lets the simultaneous width/height tween settle in sync.
const TILE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TILE_DURATION = 0.35;

export type WideAnchor = "left" | "right";

export function WideTile({
  icon: Icon,
  label,
  tone,
  anchor = "left",
  bgVar = "hsl(var(--card))",
  children,
}: {
  icon: LucideIcon;
  label: string;
  tone: Tone;
  anchor?: WideAnchor;
  bgVar?: string;
  children: React.ReactNode;
}) {
  const palette = TONE_PALETTE[tone];
  const [hovered, setHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [slotWidth, setSlotWidth] = useState<number | null>(null);

  // Measure the slot so width can animate from a concrete pixel value (rather
  // than "100%" → "880px", which framer-motion cannot interpolate smoothly).
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setSlotWidth(el.getBoundingClientRect().width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isRight = anchor === "right";
  const collapsedW = slotWidth ?? undefined;
  const expandedW = Math.max(WIDE_MIN_W, slotWidth ? Math.max(WIDE_EXPANDED_W, slotWidth) : WIDE_EXPANDED_W);

  return (
    <div ref={wrapperRef} className="relative" style={{ minHeight: WIDE_SLOT_HEIGHT }}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        tabIndex={0}
        initial={false}
        animate={{
          width: hovered ? expandedW : collapsedW,
          zIndex: hovered ? 80 : 1,
        }}
        transition={{ duration: TILE_DURATION, ease: TILE_EASE }}
        style={{
          position: "absolute",
          // Bottom-anchor: tile expands UPWARD so content rises into the card
          // body rather than dangling below into the next card.
          top: "auto",
          bottom: 0,
          left: isRight ? "auto" : 0,
          right: isRight ? 0 : "auto",
        }}
        onClick={(e) => e.stopPropagation()}
        className={`cursor-default overflow-hidden rounded-2xl border ${palette.card} p-4 outline-none ring-1 ring-transparent transition-colors duration-300 sm:p-5 ${
          hovered ? `${palette.ring} bg-card shadow-[0_-30px_80px_-25px_rgba(0,0,0,0.55)]` : ""
        }`}
      >
        {/* Solid backdrop when expanded — kills the tinted glow + faint
            tile bg that washes text out. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-2xl bg-card transition-opacity duration-200 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${palette.icon}`}>
              <Icon size={14} />
            </div>
            <h3 className="text-[10.5px] font-black uppercase tracking-[0.25em] text-foreground">{label}</h3>
          </div>
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-foreground/15 bg-foreground/[0.04] text-foreground/55 transition-opacity duration-200 ${
              hovered ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden="true"
          >
            <Maximize2 size={11} />
          </span>
        </div>

        {/* Content — content height grows modestly because the popout is wide;
            text reflows into fewer lines. */}
        <motion.div
          initial={false}
          animate={{ maxHeight: hovered ? WIDE_EXPANDED_MAX_H : WIDE_COLLAPSED_MAX_H }}
          transition={{ duration: TILE_DURATION, ease: TILE_EASE }}
          className="relative mt-4 overflow-hidden"
        >
          <div
            className={`text-[14.5px] leading-7 transition-colors ${
              hovered ? "text-foreground" : "text-foreground/85"
            }`}
          >
            {children}
          </div>

          {/* Bottom fade only when collapsed — instant-hide on hover so it
              never overlaps text mid-transition. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 transition-opacity ${
              hovered ? "opacity-0 duration-0" : "opacity-100 duration-300"
            }`}
            style={{ backgroundImage: `linear-gradient(to top, ${bgVar} 15%, transparent)` }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function BulletList({ items, tone }: { items: string[]; tone: Tone }) {
  const dot = TONE_PALETTE[tone].bullet;
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="relative pl-5">
          <span className={`absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full ${dot}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}
