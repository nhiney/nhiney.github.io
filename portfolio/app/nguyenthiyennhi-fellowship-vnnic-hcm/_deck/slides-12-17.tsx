"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  Calendar,
  Compass,
  FlaskConical,
  GraduationCap,
  Handshake,
  Key,
  Layers,
  Lightbulb,
  MapPinned,
  Megaphone,
  Network,
  Rocket,
  Telescope,
  Users,
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

export function Slide12Challenges({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s12;
  const GAUGES = [45, 55, 40, 60];
  const ICONS = [Users, Layers, Lightbulb, MapPinned];
  const items = s.items.map((it, i) => ({ ...it, icon: ICONS[i], gauge: GAUGES[i] }));

  return (
    <Slide index={index}>
      <Eyebrow index={11} label={s.eyebrow} accent="text-amber-500 dark:text-amber-300" />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
          {s.headline2}
        </span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {items.map((it) => (
          <GlassCard key={it.title} accent="amber">
            <div className="flex items-start gap-4">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5">
                <it.icon className="text-amber-500" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black tracking-tight text-foreground sm:text-xl">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                    <span>{s.maturityLabel}</span>
                    <span className="text-amber-500">{it.gauge}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-amber-500/15">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${it.gauge}%` }}
                      viewport={{ amount: 0.6, once: false }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <PullQuote className="mt-10">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide13Solutions({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s13;
  const ICONS = [GraduationCap, Briefcase, Building2, Megaphone, FlaskConical];
  const ACCENTS = ["primary", "cyan", "violet", "fuchsia", "emerald"] as const;
  const pillars = s.pillars.map((p, i) => ({ ...p, icon: ICONS[i], accent: ACCENTS[i] }));

  return (
    <Slide index={index}>
      <Eyebrow index={12} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <GlassCard key={p.title} accent={p.accent}>
            <div className="flex items-center justify-between">
              <div className={`rounded-xl border p-2.5 ${
                p.accent === "primary" ? "border-primary/30 bg-primary/10" :
                p.accent === "cyan" ? "border-cyan-500/30 bg-cyan-500/10" :
                p.accent === "violet" ? "border-violet-500/30 bg-violet-500/10" :
                p.accent === "fuchsia" ? "border-fuchsia-500/30 bg-fuchsia-500/10" :
                "border-emerald-500/30 bg-emerald-500/10"
              }`}>
                <p.icon className={
                  p.accent === "primary" ? "text-primary" :
                  p.accent === "cyan" ? "text-cyan-500" :
                  p.accent === "violet" ? "text-violet-500" :
                  p.accent === "fuchsia" ? "text-fuchsia-500" :
                  "text-emerald-500"
                } size={20} />
              </div>
              <span
                className="text-muted-foreground font-mono text-2xl font-black"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-black tracking-tight text-foreground sm:text-xl">
              {p.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </GlassCard>
        ))}
      </div>

      <PullQuote className="mt-10">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide14Roadmap({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s14;
  const WINDOWS = ["2026 – 2027", "2027 – 2028", "2028 – 2030"];
  const GRADIENTS = ["from-primary/70 to-primary", "from-primary to-blue-600", "from-blue-600 to-blue-800"];
  const PHASE_ICONS = [GraduationCap, Network, Rocket];
  const phases = s.phases.map((p, i) => ({ ...p, window: WINDOWS[i], gradient: GRADIENTS[i], icon: PHASE_ICONS[i] }));

  return (
    <Slide index={index}>
      <Eyebrow index={13} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 space-y-4">
        {phases.map((p, i) => (
          <motion.div
            key={p.title}
            variants={itemVariants}
            className="group relative flex transform-gpu flex-col gap-5 rounded-2xl border border-border/60 bg-secondary/30 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:z-30 hover:-translate-y-2 hover:scale-[1.04] hover:border-primary/80 hover:bg-secondary/65 hover:shadow-[0_30px_70px_-18px_hsl(var(--primary)/0.6)] sm:flex-row sm:items-start sm:gap-7 sm:p-7"
          >
            <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-start sm:gap-3">
              <span
                className={`inline-block bg-gradient-to-br ${p.gradient} bg-clip-text font-mono text-4xl font-black text-transparent transition-transform duration-300 group-hover:scale-110 sm:text-5xl`}
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                <Calendar size={10} /> {p.window}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p.icon size={20} className="text-primary" />
                <h3 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                  {p.title}
                </h3>
              </div>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
                {p.target}
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                {p.bullets.map((b, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </Slide>
  );
}

export function Slide15MyRole({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s15;

  return (
    <Slide index={index}>
      <Eyebrow index={14} label={s.eyebrow} accent="text-violet-500 dark:text-violet-300" />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <motion.div
          variants={itemVariants}
          className="relative flex flex-col items-start gap-5 overflow-hidden rounded-2xl border border-border/60 bg-secondary/30 p-7 backdrop-blur-md"
        >
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-violet-600 dark:text-violet-300">
              <Compass size={11} /> {s.posLabel}
            </div>
            <h3 className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {s.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.bio}</p>
            <div className="mt-6 h-px w-full bg-border/60" />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{s.pathText}</p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative rounded-2xl border border-border/60 bg-secondary/30 p-7 backdrop-blur-md"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            {s.capLabel}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {s.constellation.map((c) => (
              <div
                key={c}
                className="group flex transform-gpu items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4 transition-all duration-300 ease-out hover:z-30 hover:-translate-y-1 hover:scale-[1.04] hover:border-primary/50 hover:bg-card/70 hover:shadow-[0_14px_36px_-10px_hsl(var(--primary)/0.30)]"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500 transition-transform group-hover:scale-150" />
                <span className="text-sm font-semibold text-foreground">{c}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Slide>
  );
}

export function Slide16WhyFellowship({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s16;
  const REASON_ICONS = [Key, Telescope, Users, Handshake];
  const reasons = s.reasons.map((r, i) => ({ ...r, icon: REASON_ICONS[i] }));

  return (
    <Slide index={index}>
      <Eyebrow index={15} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {reasons.map((r) => (
          <GlassCard key={r.title} accent="primary">
            <div className="flex items-start gap-4">
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-2.5">
                <r.icon className="text-primary" size={22} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black tracking-tight text-foreground sm:text-xl">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <PullQuote className="mt-10">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide17FutureVision({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s17;
  const HORIZON_ICONS = [Rocket, Handshake, Telescope];
  const GLOW_COLORS = ["bg-primary/10", "bg-primary/8", "bg-primary/6"];
  const horizons = s.horizons.map((h, i) => ({ ...h, icon: HORIZON_ICONS[i], glow: GLOW_COLORS[i] }));
  const YEAR_LABELS = ["+5 years", "+10 years", "Long horizon"];

  return (
    <Slide index={index}>
      <Eyebrow index={16} label={s.eyebrow} accent="text-cyan-500 dark:text-cyan-300" />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {horizons.map((h, i) => (
          <motion.div
            key={h.title}
            variants={itemVariants}
            className="group relative transform-gpu overflow-hidden rounded-2xl border border-border/60 bg-secondary/30 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:z-30 hover:-translate-y-1 hover:scale-[1.04] hover:border-primary/50 hover:bg-secondary/60 hover:shadow-[0_16px_40px_-12px_hsl(var(--primary)/0.30)]"
          >
            <div className={`absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl transition group-hover:opacity-90 ${h.glow}`} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                <h.icon size={11} /> {YEAR_LABELS[i]}
              </div>
              <h3 className="mt-5 text-xl font-black tracking-tight text-foreground sm:text-2xl">
                {h.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-10 inline-flex items-center gap-3 rounded-full border border-primary/25 bg-primary/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.3em] text-primary"
      >
        <AlertTriangle size={12} className="opacity-0" />
        {s.badge}
      </motion.div>
    </Slide>
  );
}
