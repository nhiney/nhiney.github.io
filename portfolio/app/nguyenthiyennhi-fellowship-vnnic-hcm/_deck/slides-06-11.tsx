"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Building2,
  Cpu,
  Lock,
  MapPin,
  Radio,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Sprout,
  Truck,
  Wifi,
  Zap,
  Activity,
  ServerCog,
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

export function Slide06Strategy({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s06;

  return (
    <Slide index={index}>
      <Eyebrow index={5} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl border border-border/60 bg-secondary/30 p-7 backdrop-blur-md"
        >
          <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {s.posLabel}
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span
                className="text-4xl font-black tracking-tight text-foreground sm:text-5xl"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Top 10
              </span>
              <span className="text-sm font-semibold text-muted-foreground">{s.globalLabel}</span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span
                className="text-3xl font-black tracking-tight text-foreground sm:text-4xl"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Top 2
              </span>
              <span className="text-sm font-semibold text-muted-foreground">{s.aseanLabel}</span>
            </div>
            <div className="mt-5 h-px w-full bg-border/60" />
            <div className="mt-5 flex items-baseline gap-3">
              <span
                className="text-4xl font-black tracking-tight text-primary sm:text-5xl"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                60%+
              </span>
              <span className="text-sm font-semibold text-muted-foreground">{s.trafficLabel}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative rounded-2xl border border-border/60 bg-secondary/30 p-7 backdrop-blur-md"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            {s.objLabel}
          </div>
          <ul className="mt-5 space-y-4">
            {s.objectives.map((o, i) => (
              <li key={i} className="flex items-start gap-4">
                <span
                  className="text-primary mt-0.5 font-mono text-2xl font-black"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-foreground">{o}</p>
              </li>
            ))}
          </ul>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            <MapPin size={11} /> Hanoi · Da Nang · TP.HCM
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

export function Slide07IPv6AI({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s07;

  return (
    <Slide index={index}>
      <Eyebrow index={6} label={s.eyebrow} accent="text-cyan-500 dark:text-cyan-300" />
      <HeadlineDisplay>
        {s.headline1} <span className="text-primary">{s.headline2}</span> {s.headline3}
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.06] p-7 backdrop-blur-md"
        >
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="relative">
            <BrainCircuit className="text-cyan-500" size={28} />
            <h3 className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {s.cardTitle}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground sm:text-base">
              {s.points.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Activity size={14} className="mt-1.5 shrink-0 text-cyan-500" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="grid gap-4 content-center">
          <StatBlock value="25K+" label={s.stat1label} accent="text-cyan-500" />
          <StatBlock value="< 1 ms" label={s.stat2label} accent="text-primary" />
          <StatBlock value="3.4 × 10³⁸" label={s.stat3label} accent="text-violet-500" />
        </div>
      </div>

      <PullQuote className="mt-10">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide08IPv6IoT({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s08;
  const DOMAIN_ICONS = [Smartphone, Stethoscope, Truck, Sprout, ServerCog, Building2];
  const domains = s.domains.map((label, i) => ({ icon: DOMAIN_ICONS[i], label }));

  return (
    <Slide index={index}>
      <Eyebrow index={7} label={s.eyebrow} accent="text-amber-500 dark:text-amber-300" />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-amber-500 dark:text-amber-400">
          {s.headline2}
        </span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <StatBlock value="75 B+" label={s.stat1label} accent="text-amber-500" />
        <StatBlock value="5.6×" label={s.stat2label} accent="text-primary" />
        <StatBlock value="25+" label={s.stat3label} accent="text-primary" />
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        {domains.map((d) => (
          <div
            key={d.label}
            className="group flex transform-gpu flex-col items-center gap-2 rounded-2xl border border-border/60 bg-secondary/30 p-4 text-center backdrop-blur-md transition-all duration-300 ease-out hover:z-30 hover:-translate-y-2 hover:scale-[1.12] hover:border-amber-400/80 hover:bg-secondary/65 hover:shadow-[0_30px_70px_-18px_rgba(245,158,11,0.6)]"
          >
            <d.icon className="text-amber-500 transition-transform group-hover:scale-125" size={22} />
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">
              {d.label}
            </p>
          </div>
        ))}
      </motion.div>

      <PullQuote className="mt-10">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide09SmartCity({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s09;
  const LAYER_ICONS = [Activity, Stethoscope, Zap, ShieldCheck, Building2];
  const layers = s.layers.map((l, i) => ({ ...l, icon: LAYER_ICONS[i] }));

  return (
    <Slide index={index}>
      <Eyebrow index={8} label={s.eyebrow} accent="text-violet-500 dark:text-violet-300" />
      <HeadlineDisplay>
        {s.headline1} <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-4 lg:grid-cols-5 md:grid-cols-2">
        {layers.map((l) => (
          <GlassCard key={l.name} accent="violet" className="!p-5">
            <l.icon className="text-violet-500" size={22} />
            <h3 className="mt-3 text-base font-black tracking-tight text-foreground">{l.name}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{l.body}</p>
          </GlassCard>
        ))}
      </div>

      <PullQuote className="mt-10">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide10IPv65G({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s10;

  return (
    <Slide index={index}>
      <Eyebrow index={9} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1} <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl border border-primary/25 bg-primary/[0.05] p-7 backdrop-blur-md"
        >
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <Radio className="text-primary" size={28} />
            <h3 className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {s.cardTitle}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground sm:text-base">
              {s.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Wifi size={14} className="mt-1.5 shrink-0 text-primary" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="grid gap-4 content-center">
          <StatBlock value="1 M/km²" label={s.stat1label} accent="text-primary" />
          <StatBlock value="< 1 ms" label={s.stat2label} accent="text-primary" />
          <StatBlock value="10 Gbps" label={s.stat3label} accent="text-cyan-500" />
        </div>
      </div>
    </Slide>
  );
}

export function Slide11Cybersecurity({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s11;

  return (
    <Slide index={index}>
      <Eyebrow index={10} label={s.eyebrow} accent="text-emerald-500 dark:text-emerald-300" />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <GlassCard accent="emerald">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-300">
            <Lock size={11} /> {s.capLabel}
          </div>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground sm:text-base">
            {s.capabilities.map((c, i) => (
              <li key={i} className="flex items-start gap-3">
                <ShieldCheck size={14} className="mt-1 shrink-0 text-emerald-500" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard accent="amber">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300">
            <Cpu size={11} /> {s.cavLabel}
          </div>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground sm:text-base">
            {s.caveats.map((c, i) => (
              <li key={i} className="flex items-start gap-3">
                <Activity size={14} className="mt-1 shrink-0 text-amber-500" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <PullQuote className="mt-10">{s.pullquote}</PullQuote>
    </Slide>
  );
}
