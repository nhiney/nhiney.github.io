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
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground backdrop-blur-sm"
        >
          <Globe size={11} className="text-primary" />
          {s.badge}
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-balance text-[1.65rem] font-black tracking-tight text-foreground sm:text-3xl md:text-[2.25rem]"
          style={{ fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.12 }}
        >
          {s.title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-5 max-w-xl text-balance text-sm text-muted-foreground sm:text-[0.95rem]"
        >
          {s.subtitle}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mx-auto mt-8 h-px w-20 bg-border/60"
        />

        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {s.tags.map((text, i) => (
            <span
              key={i}
              className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors ${
                i === 0
                  ? "border-primary/30 bg-primary/8 text-foreground"
                  : "border-border/50 bg-secondary/30 text-muted-foreground"
              }`}
            >
              {text}
            </span>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground/70"
        >
          <span>{s.cta}</span>
          <ArrowRight size={11} />
        </motion.div>
      </div>
    </Slide>
  );
}

export function SlideIntro({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s_intro;
  return (
    <Slide index={index} maxWidth="max-w-2xl">
      <Eyebrow index={1} label={s.eyebrow} />
      <div className="mt-6 space-y-8">
        {s.sections.map((section, i) => (
          <motion.div key={i} variants={itemVariants} className="space-y-3">
            <h3 className="text-sm font-black tracking-tight text-foreground sm:text-[0.9rem]">
              {section.title}
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-[0.8rem]">
              {section.intro}
            </p>
            <ul className="space-y-2 pt-0.5">
              {section.bullets.map((bullet, j) => (
                <li key={j} className="flex items-start gap-2.5 text-xs text-foreground/80 sm:text-[0.8rem]">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
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
          <Eyebrow index={1} label={s.eyebrow} />
          <motion.h2
            variants={itemVariants}
            className="text-balance text-xl font-black leading-[1.14] tracking-tight text-foreground sm:text-2xl md:text-3xl"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {s.headline1}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-foreground/80"
          >
            {s.headline2}
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="mt-3 max-w-2xl text-[0.8rem] text-muted-foreground sm:text-sm"
          >
            {s.subhead}
          </motion.p>
          <PullQuote className="mt-8">{s.pullquote}</PullQuote>
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
  const ACCENTS = ["amber", "emerald", "violet"] as const;
  const pillars = s.pillars.map((p, i) => ({ ...p, icon: ICONS[i], accent: ACCENTS[i] }));

  return (
    <Slide index={index}>
      <Eyebrow index={2} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>{" "}
        <span className="text-primary">{s.headline3}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      {/* Infrastructure analogy image strip */}
      <motion.div variants={itemVariants} className="mt-6 relative overflow-hidden rounded-xl border border-border/40 h-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1400&q=80"
          alt="Infrastructure analogy — highways and digital networks"
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-card/90 via-transparent to-card/90" />
        <div className="absolute inset-0 flex items-center justify-center gap-5 px-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">Roads · Power Grids · Water</span>
          <ArrowRight size={14} className="text-primary shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary whitespace-nowrap">Internet Infrastructure</span>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
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
  const CARD_ACCENTS = ["rose", "amber", "violet"] as const;

  return (
    <Slide index={index}>
      <Eyebrow index={3} label={s.eyebrow} accent="text-rose-500 dark:text-rose-300" />
      <HeadlineDisplay>
        <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
          {s.headline1}
        </span>
      </HeadlineDisplay>
      <motion.p
        variants={itemVariants}
        className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-foreground/80"
      >
        {s.headline2}
      </motion.p>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {s.cascade.map((card, i) => (
          <GlassCard key={i} accent={CARD_ACCENTS[i]}>
            <h3 className="text-sm font-black leading-snug tracking-tight text-foreground">
              {card.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {card.bullets.map((b, j) => (
                <li key={j} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500/70" />
                  {b}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <StatBlock value={s.stat1value} label={s.stat1label} accent="text-rose-500" />
        <StatBlock value={s.stat2value} label={s.stat2label} accent="text-amber-500" />
        <StatBlock value={s.stat3value} label={s.stat3label} accent="text-rose-500" />
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/[0.04] px-5 py-4"
      >
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-[0.8rem]">
          {s.closing}
        </p>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
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
        <span className="text-primary">{s.headline2}</span>
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
