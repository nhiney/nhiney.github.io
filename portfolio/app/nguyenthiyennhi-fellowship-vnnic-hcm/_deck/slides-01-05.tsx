"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Construction,
  Zap,
  Droplet,
  Network,
  Globe,
} from "lucide-react";
import {
  Eyebrow,
  GlassCard,
  HeadlineDisplay,
  PullQuote,
  Slide,
  Subhead,
  itemVariants,
} from "./shared";
import { useDeckT } from "./use-deck-t";

export function Slide01Cover({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s01;

  return (
    <Slide index={index} maxWidth="max-w-6xl">
      <div className="relative isolate text-center">
        {/* Giant IPv6 watermark — sits behind the title */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-x-0 top-[44%] -z-10 -translate-y-1/2 select-none overflow-hidden"
        >
          <p
            className="text-center font-black leading-[0.85] tracking-[-0.05em] text-primary/[0.055] dark:text-primary/[0.08]"
            style={{ fontSize: "clamp(8rem, 24vw, 20rem)" }}
          >
            IPv6
          </p>
        </motion.div>

        {/* Ambient halo for depth */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8 }}
          className="pointer-events-none absolute left-1/2 top-[44%] -z-20 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[120px]"
        />

        {/* Pill badge — fellowship label with globe + pulsing dot */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/[0.08] px-5 py-2 text-[10px] font-bold uppercase tracking-[0.32em] text-primary shadow-sm backdrop-blur-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <Globe size={11} className="opacity-80" />
          {s.badge}
        </motion.div>

        {/* Title — mixed case, hero scale, full title including IPv6 prefix */}
        <motion.h1
          variants={itemVariants}
          className="mx-auto mt-12 max-w-5xl text-balance text-[1.85rem] font-black leading-[1.08] tracking-tight text-foreground sm:text-[2.4rem] md:text-[3rem] lg:text-[3.5rem]"
        >
          {s.title}
        </motion.h1>

        {/* Refined divider — gradient lines with glowing dot */}
        <motion.div
          variants={itemVariants}
          className="mx-auto mt-10 flex items-center justify-center gap-3"
        >
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-primary/45" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/70 shadow-[0_0_10px_hsl(var(--primary))]" />
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-primary/45" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-3xl text-balance text-[0.95rem] leading-relaxed text-muted-foreground sm:text-[1.05rem] md:text-[1.1rem]"
        >
          {s.subtitle}
        </motion.p>

        {/* Author byline — pill chips */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
        >
          <span className="inline-flex items-center rounded-full border-2 border-primary/40 bg-primary/[0.09] px-5 py-2.5 text-[0.86rem] font-bold tracking-tight text-foreground shadow-sm sm:text-[0.94rem]">
            {s.tags[0]}
          </span>
          <span className="inline-flex items-center rounded-full border border-border/55 bg-secondary/45 px-5 py-2.5 text-[0.78rem] font-medium text-muted-foreground sm:text-[0.86rem]">
            {s.tags[1]}
          </span>
        </motion.div>

        {/* CTA — centered with animated arrow */}
        <motion.div variants={itemVariants} className="mt-12">
          <span className="inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.36em] text-muted-foreground/75">
            <span>{s.cta}</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex text-primary"
            >
              <ArrowRight size={11} strokeWidth={2.5} />
            </motion.span>
          </span>
        </motion.div>
      </div>
    </Slide>
  );
}

export function SlideIntro({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s_intro;
  return (
    <Slide index={index} maxWidth="max-w-5xl">
      <div className="flex min-h-[62vh] flex-col md:min-h-[66vh]">
        <Eyebrow index={1} label={s.eyebrow} />

        <div className="mt-6 flex flex-1 flex-col gap-3.5">
          {s.sections.map((section, i) => {
            const cleanTitle = section.title.replace(/^\s*\d+\.\s*/, "");
            return (
              <motion.article
                key={i}
                variants={itemVariants}
                className="group relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-border/45 bg-secondary/25 p-5 pl-7 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/[0.045] hover:shadow-lg hover:shadow-primary/10 sm:p-6 sm:pl-8"
              >
                {/* Left vertical accent — lights up on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full bg-primary/15 transition-all duration-300 group-hover:top-3 group-hover:bottom-3 group-hover:bg-primary group-hover:shadow-[0_0_16px_hsl(var(--primary))]"
                />

                {/* Inner top highlight */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Section header: number + title */}
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span
                    className="font-black leading-none tabular-nums text-primary/45 transition-colors duration-300 group-hover:text-primary"
                    style={{ fontSize: "1.85rem" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-balance text-[1.15rem] font-black leading-tight tracking-tight text-foreground sm:text-[1.3rem] md:text-[1.4rem]">
                    {cleanTitle}
                  </h3>
                </div>

                {/* Intro */}
                <p className="mt-3 max-w-3xl text-[0.9rem] leading-[1.65] text-muted-foreground transition-colors duration-300 group-hover:text-foreground/85 sm:text-[0.95rem]">
                  {section.intro}
                </p>

                {/* Bullets */}
                <ul className="mt-3 space-y-2">
                  {section.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-[0.88rem] font-medium leading-relaxed text-foreground/85 sm:text-[0.94rem]"
                    >
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/55 transition-colors duration-300 group-hover:bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </Slide>
  );
}

export function Slide02Vision({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s02;
  return (
    <Slide index={index} maxWidth="max-w-6xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        {/* Left: text */}
        <div>
          <Eyebrow index={2} label={s.eyebrow} />
          <motion.h2
            variants={itemVariants}
            className="text-balance text-3xl font-black leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] lg:text-[3rem]"
          >
            {s.headline1}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-foreground/80 sm:text-lg"
          >
            {s.headline2}
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {s.subhead}
          </motion.p>
          <PullQuote className="mt-10">{s.pullquote}</PullQuote>
        </div>

        {/* Right: globe image */}
        <motion.div variants={itemVariants} className="hidden lg:block">
          <div className="relative overflow-hidden rounded-2xl border border-border/40 h-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=640&q=85"
              alt="Global internet infrastructure — Earth from space"
              className="h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-card/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-card/40 to-transparent" />
            <p className="absolute bottom-3 left-4 text-[9px] font-bold uppercase tracking-[0.3em] text-foreground/40">
              Global Internet Infrastructure
            </p>
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

export function Slide03WhyInfrastructure({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s03;
  const ICONS = [TrendingUp, ShieldCheck, Sparkles];
  const ACCENTS = ["amber", "primary", "primary"] as const;
  const pillars = s.pillars.map((p, i) => ({ ...p, icon: ICONS[i], accent: ACCENTS[i] }));

  return (
    <Slide index={index}>
      <Eyebrow index={3} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>{" "}
        <span className="text-primary">{s.headline3}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      {/* Infrastructure analogy — two-panel contrast layout */}
      <motion.div
        variants={itemVariants}
        className="relative mt-8 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch"
      >
        {/* LEFT PANEL — legacy, grayscale/muted */}
        <div className="group overflow-hidden rounded-2xl border border-border/40 bg-muted/10 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-border/60 hover:shadow-lg hover:shadow-black/10">
          {/* Header */}
          <div className="border-b border-border/25 px-5 py-3.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/60">
              {s.analogyLegacyLabel}
            </p>
          </div>
          {/* Items */}
          <div className="divide-y divide-border/20 px-2 py-2">
            {([
              { Icon: Construction, idx: 0 },
              { Icon: Zap,          idx: 1 },
              { Icon: Droplet,      idx: 2 },
            ]).map(({ Icon, idx }) => (
              <div
                key={idx}
                className="group/item flex cursor-default items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 hover:bg-muted/30 hover:shadow-sm"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/40 transition-all duration-200 group-hover/item:bg-muted/70 group-hover/item:shadow-sm">
                  <Icon size={14} className="text-muted-foreground/50 transition-colors duration-200 group-hover/item:text-muted-foreground/80" strokeWidth={1.8} />
                </div>
                <span className="text-[12px] font-semibold text-muted-foreground/60 transition-colors duration-200 group-hover/item:text-muted-foreground/90">
                  {s.analogyItems[idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — arrow connector */}
        <div className="flex items-center justify-center">
          {/* Mobile */}
          <div className="flex w-full items-center gap-3 sm:hidden">
            <div className="h-px flex-1 bg-border/50" />
            <ArrowRight size={18} className="rotate-90 text-primary" strokeWidth={2.5} />
            <div className="h-px flex-1 bg-border/50" />
          </div>
          {/* Desktop */}
          <div className="hidden flex-col items-center gap-2 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/45 bg-primary/10 shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)]">
              <ArrowRight size={17} className="text-primary" strokeWidth={2.5} />
            </div>
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary/65">
              {s.analogyConnectorLabel}
            </span>
          </div>
        </div>

        {/* RIGHT PANEL — digital, primary glow */}
        <div className="group relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/[0.10] via-primary/[0.06] to-primary/[0.03] shadow-[0_0_32px_-10px_hsl(var(--primary)/0.3)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.45)]">
          {/* Top accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          {/* Header */}
          <div className="border-b border-primary/20 px-5 py-3.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-primary/80">
              {s.analogyDigitalLabel}
            </p>
          </div>
          {/* Content — vertically centered */}
          <div className="flex h-[calc(100%-2.75rem)] flex-col items-center justify-center gap-4 px-5 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/35 bg-primary/15 shadow-[0_0_28px_-6px_hsl(var(--primary)/0.5)] transition-transform duration-300 group-hover:scale-105">
              <Network size={24} className="text-primary" strokeWidth={1.8} />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-[13px] font-black tracking-wide text-primary">
                {s.analogyDigitalItem}
              </p>
              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-primary/50">
                IPv6 · Next Generation
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {pillars.map((p) => (
          <GlassCard key={p.tag} accent={p.accent}>
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-current/30 bg-current/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]">
                <p.icon size={11} />
                {p.tag}
              </div>
              <h3
                className="text-xl font-black tracking-tight text-foreground sm:text-2xl"
                dangerouslySetInnerHTML={{ __html: p.title }}
              />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <PullQuote className="mt-10">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide04IPv6Imperative({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s04;

  return (
    <Slide index={index}>
      <Eyebrow index={4} label={s.eyebrow} accent="text-rose-500/85 dark:text-rose-300/85" />

      {/* Headline — solid foreground; only IPv4 / IPv6 keywords carry color */}
      <HeadlineDisplay>
        <span className="text-rose-500 dark:text-rose-300">IPv4</span>
        {" "}
        {s.headline1.replace(/^IPv4\s*/, "")}
        {" "}
        <span className="text-primary">IPv6</span>
        {" "}
        {s.headline2.replace(/^IPv6\s*/, "")}
      </HeadlineDisplay>

      {/* Hero stat strip — the impact numbers, prominently sized */}
      <div className="mt-9 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { value: s.stat1value, label: s.stat1label, cite: s.stat1cite, tone: "rose" as const },
          { value: s.stat2value, label: s.stat2label, cite: s.stat2cite, tone: "neutral" as const },
          { value: s.stat3value, label: s.stat3label, cite: s.stat3cite, tone: "rose" as const },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className={`group relative overflow-hidden rounded-2xl border px-4 py-5 backdrop-blur-sm sm:px-5 sm:py-6 ${
              stat.tone === "rose"
                ? "border-rose-500/25 bg-gradient-to-br from-rose-500/[0.07] via-secondary/25 to-secondary/15"
                : "border-border/50 bg-secondary/25"
            }`}
          >
            <p
              className={`font-black leading-[0.95] tracking-tight tabular-nums ${
                stat.tone === "rose"
                  ? "text-rose-500 dark:text-rose-300"
                  : "text-foreground"
              }`}
              style={{ fontSize: "clamp(1.75rem, 4.2vw, 2.85rem)" }}
            >
              {stat.value}
            </p>
            <p className="mt-3 text-[0.72rem] font-semibold leading-[1.4] text-muted-foreground sm:text-[0.78rem]">
              {stat.label}
            </p>
            {stat.cite && (
              <p className="mt-1.5 text-[0.65rem] italic leading-tight text-primary/65 sm:text-[0.7rem]">
                [{stat.cite}]
              </p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_1fr] lg:gap-8">
        {/* Left: Crisis cascade */}
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <AlertCircle size={14} className="text-rose-500/90" strokeWidth={2.4} />
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-rose-500/90">
              {s.crisisLabel}
            </p>
          </div>

          <div className="space-y-3">
            {s.cascade.map((card, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-border/45 bg-secondary/25 px-5 py-4 transition-colors duration-300 hover:border-rose-500/35 hover:bg-secondary/35"
              >
                {/* Left rose accent rail */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-3 left-0 w-[2.5px] rounded-r-full bg-rose-500/35 transition-colors duration-300 group-hover:bg-rose-500/70"
                />
                <div className="flex items-baseline gap-3.5 pl-2">
                  <span className="font-black leading-none tabular-nums text-rose-500/40 transition-colors duration-300 group-hover:text-rose-500/80 text-[1.25rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.05rem] font-bold leading-[1.3] tracking-tight text-foreground">
                    {card.title}
                  </h3>
                </div>
                <ul className="mt-3 space-y-2 pl-9">
                  {card.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-[0.9rem] leading-[1.6] text-muted-foreground"
                    >
                      <span className="mt-[8px] h-[4px] w-[4px] shrink-0 rounded-full bg-muted-foreground/55" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Solution comparison table */}
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <CheckCircle2 size={14} className="text-primary" strokeWidth={2.4} />
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary">
              {s.solutionLabel}
            </p>
          </div>

          <motion.div
            variants={itemVariants}
            className="overflow-hidden rounded-2xl border border-border/55 bg-secondary/20 backdrop-blur-md"
          >
            {/* Header row */}
            <div className="grid grid-cols-[1.3fr_1fr_1.1fr] border-b border-border/60 bg-secondary/40 px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              <div>{s.thDim}</div>
              <div className="flex items-center gap-1.5 text-rose-500/85">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500/60" />
                IPv4
              </div>
              <div className="flex items-center gap-1.5 text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                IPv6
              </div>
            </div>

            {/* Body rows */}
            {s.rows.map((r, i) => (
              <motion.div
                key={r.dim}
                variants={itemVariants}
                className={`grid grid-cols-[1.3fr_1fr_1.1fr] items-center gap-2 px-4 py-3.5 transition-colors duration-200 hover:bg-primary/[0.035] ${
                  i % 2 === 0 ? "bg-card/35" : "bg-transparent"
                } ${i < s.rows.length - 1 ? "border-b border-border/30" : ""}`}
              >
                <div className="text-[0.92rem] font-semibold leading-[1.35] text-foreground">
                  {r.dim}
                </div>
                <div className="text-[0.88rem] leading-[1.35] text-muted-foreground tabular-nums">
                  {r.v4}
                </div>
                <div className="text-[0.92rem] font-bold leading-[1.35] text-foreground tabular-nums">
                  {r.v6}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <PullQuote className="mt-9">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function SlideAbstract({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s_abstract;
  const PILLAR_ACCENTS = ["primary", "amber", "primary"] as const;

  return (
    <Slide index={index} maxWidth="max-w-5xl">
      <Eyebrow index={2} label={s.eyebrow} />

      <motion.h2
        variants={itemVariants}
        className="text-balance text-2xl font-black leading-[1.15] tracking-tight text-foreground sm:text-3xl md:text-[2.35rem]"
      >
        {s.title}
      </motion.h2>

      <motion.div
        variants={itemVariants}
        className="mt-6 rounded-2xl border border-primary/25 bg-primary/[0.04] p-5 sm:p-6"
      >
        <p className="text-[0.92rem] leading-[1.7] text-foreground/85 sm:text-[1rem]">
          {s.summary}
        </p>
      </motion.div>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {s.pillars.map((p, i) => (
          <GlassCard key={p.tag} accent={PILLAR_ACCENTS[i]}>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-current/35 bg-current/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.28em]">
              {p.tag}
            </div>
            <h3 className="mt-3 text-[0.95rem] font-black leading-snug tracking-tight text-foreground sm:text-[1.05rem]">
              {p.title}
            </h3>
            <p className="mt-2 text-[0.82rem] leading-[1.55] text-muted-foreground sm:text-[0.88rem]">
              {p.body}
            </p>
          </GlassCard>
        ))}
      </div>

      <motion.div variants={itemVariants} className="mt-7">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
          {s.keywordsLabel}
        </p>
        <div className="flex flex-wrap gap-2">
          {s.keywords.map((k) => (
            <span
              key={k}
              className="rounded-full border border-primary/25 bg-primary/[0.06] px-3 py-1 text-[10px] font-semibold tracking-tight text-foreground/85"
            >
              {k}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="mt-6 border-t border-border/40 pt-4 text-[10px] italic leading-relaxed text-muted-foreground sm:text-[11px]"
      >
        {s.citationLine}
      </motion.p>
    </Slide>
  );
}
