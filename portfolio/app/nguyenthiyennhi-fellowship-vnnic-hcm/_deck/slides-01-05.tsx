"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Network,
  ShieldCheck,
  Cpu,
  Layers,
  Infinity as InfinityIcon,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  Eyebrow,
  GlassCard,
  HeadlineDisplay,
  PullQuote,
  Slide,
  StatBlock,
  Subhead,
  itemVariants,
} from "./shared";
import { useDeckT } from "./use-deck-t";

export function Slide01Cover({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s01;
  return (
    <Slide index={index} maxWidth="max-w-5xl">
      <div className="text-center">
        <motion.div
          variants={itemVariants}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.35em] text-primary"
        >
          <Globe size={12} />
          {s.badge}
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-balance text-5xl font-black tracking-tighter text-spectrum sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          style={{ fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.02 }}
        >
          {s.title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-7 max-w-2xl text-balance text-base font-medium text-muted-foreground sm:text-lg md:text-xl"
        >
          {s.subtitle}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mx-auto mt-10 h-px w-32 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {s.tags.map((text, i) => (
            <span
              key={i}
              className={`transform-gpu rounded-full border px-4 py-2 text-[11px] font-bold tracking-wider backdrop-blur-md transition-all duration-300 ease-out hover:z-30 hover:-translate-y-1.5 hover:scale-125 hover:border-primary/70 hover:shadow-[0_18px_40px_-12px_hsl(var(--primary)/0.5)] sm:text-xs ${
                i === 0
                  ? "border-primary/50 bg-primary/15 text-foreground"
                  : "border-border/60 bg-secondary/40 text-muted-foreground"
              }`}
            >
              {text}
            </span>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary"
        >
          <span>{s.cta}</span>
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={12} />
          </motion.span>
        </motion.div>
      </div>
    </Slide>
  );
}

export function Slide02Vision({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s02;
  return (
    <Slide index={index} maxWidth="max-w-5xl">
      <Eyebrow index={1} label={s.eyebrow} />

      <motion.h2
        variants={itemVariants}
        className="text-balance text-4xl font-black leading-[1.05] tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-[4.5rem]"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {s.headline1}{" "}
        <span className="text-spectrum">{s.headline2}</span>
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="mt-8 max-w-3xl text-base text-muted-foreground sm:text-lg"
      >
        {s.subhead}
      </motion.p>

      <PullQuote className="mt-10">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide03WhyInfrastructure({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s03;
  const ICONS = [TrendingUp, ShieldCheck, Sparkles];
  const ACCENTS = ["amber", "emerald", "violet"] as const;
  const pillars = s.pillars.map((p, i) => ({ ...p, icon: ICONS[i], accent: ACCENTS[i] }));

  return (
    <Slide index={index}>
      <Eyebrow index={2} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-spectrum">{s.headline2}</span>{" "}
        <span className="text-spectrum">{s.headline3}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {pillars.map((p) => (
          <GlassCard key={p.tag} accent={p.accent}>
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-current opacity-10 blur-3xl" />
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

export function Slide04IPv4Crisis({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s04;

  return (
    <Slide index={index}>
      <Eyebrow index={3} label={s.eyebrow} accent="text-rose-500 dark:text-rose-300" />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
          {s.headline2}
        </span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-rose-500/[0.05] p-6 backdrop-blur-md sm:p-8"
        >
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-rose-500/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-rose-600 dark:text-rose-300">
              <TrendingDown size={11} /> {s.gaugeLabel}
            </div>
            <div className="mt-6 flex items-end gap-3">
              <span
                className="text-7xl font-black tracking-tighter text-rose-500 sm:text-8xl"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                0%
              </span>
              <span className="mb-3 text-sm font-semibold text-muted-foreground">
                {s.gaugeSublabel}
              </span>
            </div>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-rose-500/15">
              <motion.div
                initial={{ width: "100%" }}
                whileInView={{ width: "0%" }}
                viewport={{ amount: 0.6, once: false }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-rose-600"
              />
            </div>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {s.cascade.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-500" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="grid gap-4">
          <StatBlock value="4.3 B" label={s.stat1label} accent="text-rose-500" />
          <StatBlock value="75 B+" label={s.stat2label} accent="text-amber-500" />
          <StatBlock value="0" label={s.stat3label} accent="text-rose-500" />
        </div>
      </div>

      <motion.p
        variants={itemVariants}
        className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        {s.sources}
      </motion.p>
    </Slide>
  );
}

export function Slide05WhyIPv6({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s05;
  const ICONS = [InfinityIcon, Network, Layers, ShieldCheck, Cpu];
  const rows = s.rows.map((r, i) => ({ ...r, icon: ICONS[i] }));

  return (
    <Slide index={index}>
      <Eyebrow index={4} label={s.eyebrow} accent="text-cyan-500 dark:text-cyan-300" />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-spectrum">{s.headline2}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <motion.div
        variants={itemVariants}
        className="mt-10 overflow-hidden rounded-2xl border border-border/60 bg-secondary/20 backdrop-blur-md"
      >
        <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-border/60 bg-secondary/30 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground sm:px-7">
          <div>{s.thDim}</div>
          <div className="flex items-center gap-2">
            <AlertCircle size={11} className="text-rose-500" /> IPv4
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={11} className="text-cyan-500" /> IPv6
          </div>
        </div>
        {rows.map((r, i) => (
          <motion.div
            key={r.dim}
            variants={itemVariants}
            className={`grid grid-cols-[1.2fr_1fr_1fr] items-center gap-3 px-5 py-4 text-sm transition-colors sm:px-7 sm:text-base ${
              i % 2 === 0 ? "bg-card/40" : "bg-card/20"
            }`}
          >
            <div className="flex items-center gap-3 text-foreground">
              <r.icon size={14} className="text-primary" />
              <span className="font-semibold">{r.dim}</span>
            </div>
            <div className="font-mono text-xs text-rose-500/90 sm:text-sm">{r.v4}</div>
            <div className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-300 sm:text-sm">
              {r.v6}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <PullQuote className="mt-8">{s.pullquote}</PullQuote>
    </Slide>
  );
}
