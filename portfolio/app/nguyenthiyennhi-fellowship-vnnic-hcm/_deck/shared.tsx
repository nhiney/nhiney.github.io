"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const TOTAL_SLIDES = 20;

export const TOP_SAFE_PX = 24;
export const BOTTOM_SAFE_PX = 100;

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
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
      {/* Ambient gradient orbs */}
      <div className="absolute -top-48 -left-32 h-[700px] w-[700px] rounded-full bg-primary/[0.07] blur-[140px] dark:bg-primary/[0.22]" />
      <div className="absolute top-1/2 -right-24 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/[0.05] blur-[120px] dark:bg-amber-400/[0.10]" />
      <div className="absolute -bottom-32 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-[100px] dark:bg-primary/[0.14]" />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 bg-grid opacity-[0.13] dark:opacity-[0.32]"
        style={{
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 45%, #000 10%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 45%, #000 10%, transparent 100%)",
        }}
      />
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
          {/* Outer glow layer */}
          <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-primary/[0.18] via-border/15 to-border/8 blur-[1px] dark:from-primary/[0.38] dark:via-amber-500/[0.08]" />
          {/* Card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-gradient-to-b from-card/98 via-card/96 to-card/92 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-10 md:p-14 dark:border-primary/[0.24] dark:shadow-black/70">
            {/* Top primary accent bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent dark:via-primary/90 dark:h-[3px]" />
            {/* Subtle inner vignette at corners */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/[0.04] dark:ring-primary/[0.12]" />
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
      className={`mb-5 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.42em] ${accent}`}
    >
      <span className="tabular-nums opacity-45">{String(index).padStart(2, "0")}</span>
      <span className="h-px w-10 bg-current opacity-20" />
      <span className="opacity-90">{label}</span>
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
      className={`text-balance text-[1.7rem] font-black tracking-tight text-foreground dark:text-white sm:text-[2.1rem] md:text-[2.55rem] ${className}`}
      style={{ lineHeight: 1.1 }}
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
      className={`mt-4 max-w-3xl text-[0.95rem] leading-[1.65] text-muted-foreground sm:text-[1.05rem] ${className}`}
    >
      {children}
    </motion.p>
  );
}

// Spotlight hover treatment — clean, professional, content-focused.
// No scale jump (too AI-jumpy); just a refined lift + primary-tinted glow shadow
// + an inner radial spotlight that brightens the card on hover.
const hoverLift =
  "transform-gpu transition-[transform,border-color,background-color,box-shadow] duration-400 ease-out hover:z-30 hover:-translate-y-2 hover:shadow-[0_28px_60px_-20px_hsl(var(--primary)/0.30)] dark:hover:shadow-[0_36px_80px_-8px_hsl(var(--primary)/0.60)]";

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
    primary: "border-border/45 bg-secondary/30 hover:border-primary/55 hover:bg-secondary/50",
    cyan:    "border-border/45 bg-secondary/30 hover:border-primary/55 hover:bg-secondary/50",
    violet:  "border-border/45 bg-secondary/30 hover:border-primary/55 hover:bg-secondary/50",
    fuchsia: "border-amber-500/18 bg-secondary/30 hover:border-amber-400/55 hover:bg-secondary/50",
    rose:    "border-rose-500/18 bg-secondary/30 hover:border-rose-400/55 hover:bg-secondary/50",
    amber:   "border-amber-500/18 bg-secondary/30 hover:border-amber-400/55 hover:bg-secondary/50",
    emerald: "border-border/45 bg-secondary/30 hover:border-primary/55 hover:bg-secondary/50",
  };
  return (
    <motion.div
      variants={itemVariants}
      className={`group/card relative cursor-default overflow-hidden rounded-2xl border p-6 ${hoverLift} ${accentMap[accent]} ${className} dark:border-primary/[0.28] dark:bg-secondary/60 dark:hover:border-primary/55 dark:hover:bg-secondary/75`}
    >
      {/* Radial spotlight — reveals from top on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% -20%, hsl(var(--primary) / 0.26), transparent 65%)",
        }}
      />
      {/* Top edge highlight — transitions to primary tint on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-colors duration-400 group-hover/card:via-primary/60 dark:via-primary/30 dark:group-hover/card:via-primary/80" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export function StatBlock({
  value,
  label,
  accent = "text-primary",
  cite,
}: {
  value: string;
  label: string;
  accent?: string;
  cite?: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={`group/card relative cursor-default overflow-hidden rounded-2xl border border-border/45 bg-secondary/30 px-5 py-5 ${hoverLift} hover:border-primary/55 hover:bg-secondary/50 dark:border-primary/[0.28] dark:bg-secondary/60 dark:hover:border-primary/55 dark:hover:bg-secondary/75`}
    >
      {/* Radial spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% -10%, hsl(var(--primary) / 0.30), transparent 60%)",
        }}
      />
      {/* Top edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-colors duration-400 group-hover/card:via-primary/60 dark:via-primary/30 dark:group-hover/card:via-primary/80" />
      <div className="relative">
        <p
          className={`text-3xl font-black tracking-tight transition-transform duration-400 group-hover/card:scale-[1.06] sm:text-4xl ${accent}`}
        >
          {value}
        </p>
        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-400 group-hover/card:text-foreground/85 dark:text-foreground/70 dark:group-hover/card:text-foreground">
          {label}
        </p>
        {cite && (
          <p className="mt-1.5 text-[9px] italic leading-tight text-primary/70">
            [{cite}]
          </p>
        )}
      </div>
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
      className={`relative mt-8 ${className}`}
    >
      {/* Large decorative opening quotation mark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-5 -left-1 select-none font-black leading-none text-primary/[0.14]"
        style={{ fontSize: "5.5rem" }}
      >
        &ldquo;
      </span>
      <p className="relative border-l-[3px] border-primary/55 pl-6 text-[1.1rem] font-semibold italic leading-snug text-foreground/85 sm:text-[1.25rem] md:text-[1.35rem] dark:border-primary/80 dark:text-foreground/95">
        {children}
      </p>
    </motion.blockquote>
  );
}
