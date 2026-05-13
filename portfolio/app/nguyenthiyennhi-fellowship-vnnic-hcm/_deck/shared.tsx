"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const TOTAL_SLIDES = 20;

// Top breathing room (under the sticky progress bar) and bottom breathing
// room (above the sticky dot/arrow nav) measured in px. Used so slide content
// is never visually clipped by the chrome.
export const TOP_SAFE_PX = 24;
export const BOTTOM_SAFE_PX = 96;

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export const rightVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export function DeckBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 bg-grid opacity-50"
        style={{
          maskImage:
            "radial-gradient(ellipse 75% 60% at 50% 45%, #000 30%, transparent 92%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 60% at 50% 45%, #000 30%, transparent 92%)",
        }}
      />
      <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/[0.10] blur-[130px] dark:bg-primary/[0.20]" />
      <div className="absolute bottom-[-12rem] left-[6%] h-[30rem] w-[30rem] rounded-full bg-cyan-500/[0.10] blur-[150px] dark:bg-cyan-500/[0.22]" />
      <div className="absolute top-1/3 right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-violet-500/[0.10] blur-[150px] dark:bg-violet-500/[0.22]" />
      <div className="absolute top-[55%] left-[40%] h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/[0.08] blur-[140px] dark:bg-fuchsia-500/[0.16]" />
    </div>
  );
}

export function Slide({
  index,
  children,
  className = "",
  maxWidth = "max-w-6xl",
}: {
  index: number;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}) {
  return (
    <section
      data-slide-index={index}
      className={`relative flex h-full w-screen shrink-0 snap-start snap-always items-start justify-center px-5 sm:px-10 md:px-16 ${className}`}
      style={{
        paddingTop: `${TOP_SAFE_PX}px`,
        paddingBottom: `${BOTTOM_SAFE_PX}px`,
      }}
    >
      {/* Per-slide vertical scroller — the deck wheel handler detects this via
          data-slide-scroller, so internal scroll happens BEFORE slide nav. */}
      <div
        data-slide-scroller
        className="full-deck-slide relative flex h-full w-full justify-center overflow-y-auto overflow-x-hidden"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.4, once: false }}
          className={`relative my-auto w-full ${maxWidth}`}
        >
          <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-primary/35 via-cyan-400/25 to-violet-500/35 opacity-50 blur-[2px] dark:opacity-70" />
          <div className="relative rounded-[2rem] border border-border/60 bg-card/75 p-6 shadow-2xl backdrop-blur-2xl sm:p-10 md:p-14">
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Eyebrow({
  index,
  label,
  accent = "text-primary",
}: {
  index: number;
  label: string;
  accent?: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={`mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] ${accent}`}
    >
      <span className="font-mono">{String(index).padStart(2, "0")}</span>
      <span className="h-px w-10 bg-current opacity-40" />
      <span>{label}</span>
    </motion.div>
  );
}

export function HeadlineDisplay({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.h2
      variants={itemVariants}
      className={`text-balance text-4xl font-black tracking-tighter text-foreground sm:text-5xl md:text-6xl ${className}`}
      style={{ fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.04 }}
    >
      {children}
    </motion.h2>
  );
}

export function Subhead({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.p
      variants={itemVariants}
      className={`mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base ${className}`}
    >
      {children}
    </motion.p>
  );
}

// Shared hover treatment for every small interactive card on a slide.
// Lift is deliberately bigger (8% scale + 8px translate) so the focused
// card visually pops above its neighbours and the content inside becomes
// the visual centre of attention.
const hoverPop =
  "transform-gpu transition-all duration-300 ease-out hover:z-30 hover:-translate-y-2 hover:scale-[1.08] hover:bg-secondary/65";

export function GlassCard({
  children,
  className = "",
  accent = "primary",
}: {
  children: ReactNode;
  className?: string;
  accent?: "primary" | "cyan" | "violet" | "fuchsia" | "rose" | "amber" | "emerald";
}) {
  const accentMap: Record<string, string> = {
    primary:
      "border-primary/30 hover:border-primary/80 hover:shadow-[0_30px_70px_-18px_hsl(var(--primary)/0.65)]",
    cyan: "border-cyan-500/30 hover:border-cyan-400/80 hover:shadow-[0_30px_70px_-18px_rgba(6,182,212,0.6)]",
    violet:
      "border-violet-500/30 hover:border-violet-400/80 hover:shadow-[0_30px_70px_-18px_rgba(139,92,246,0.6)]",
    fuchsia:
      "border-fuchsia-500/30 hover:border-fuchsia-400/80 hover:shadow-[0_30px_70px_-18px_rgba(217,70,239,0.6)]",
    rose: "border-rose-500/30 hover:border-rose-400/80 hover:shadow-[0_30px_70px_-18px_rgba(244,63,94,0.6)]",
    amber:
      "border-amber-500/30 hover:border-amber-400/80 hover:shadow-[0_30px_70px_-18px_rgba(245,158,11,0.6)]",
    emerald:
      "border-emerald-500/30 hover:border-emerald-400/80 hover:shadow-[0_30px_70px_-18px_rgba(16,185,129,0.6)]",
  };
  return (
    <motion.div
      variants={itemVariants}
      className={`group relative cursor-default overflow-hidden rounded-2xl border bg-secondary/30 p-6 backdrop-blur-md ${hoverPop} ${accentMap[accent]} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function StatBlock({
  value,
  label,
  accent = "text-spectrum",
}: {
  value: string;
  label: string;
  accent?: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={`group relative cursor-default rounded-2xl border border-border/60 bg-secondary/30 px-5 py-4 backdrop-blur-md ${hoverPop} hover:border-primary/70 hover:shadow-[0_28px_60px_-18px_hsl(var(--primary)/0.6)]`}
    >
      <p
        className={`text-2xl font-black tracking-tight transition-transform duration-300 group-hover:scale-110 sm:text-3xl ${accent}`}
      >
        {value}
      </p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
        {label}
      </p>
    </motion.div>
  );
}

export function PullQuote({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.blockquote
      variants={itemVariants}
      className={`mt-8 border-l-2 border-primary pl-6 text-xl font-semibold italic leading-snug text-foreground sm:text-2xl md:text-[1.55rem] ${className}`}
    >
      &ldquo;{children}&rdquo;
    </motion.blockquote>
  );
}
