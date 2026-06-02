"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Compass,
  GraduationCap,
  Handshake,
  Key,
  Layers,
  Lightbulb,
  MapPinned,
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
  itemVariants,
} from "./shared";
import { useDeckT } from "./use-deck-t";

export function Slide12ChallengesAndSolutions({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s12;
  const ICONS = [Users, Layers, Lightbulb, MapPinned];

  return (
    <Slide index={index}>
      <Eyebrow index={9} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
          {s.headline2}
        </span>
      </HeadlineDisplay>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {/* Left: Challenges */}
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">{s.challengesLabel}</p>
          <div className="space-y-3">
            {s.challenges.map((it, i) => {
              const Icon = ICONS[i];
              const gaugeValue = it.maturityValue ? parseInt(it.maturityValue) : 0;
              return (
                <GlassCard key={it.title} accent="amber">
                  <div className="flex items-start gap-2.5">
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-1.5 shrink-0">
                      <Icon className="text-amber-500" size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="tabular-nums text-[9px] font-bold text-amber-500/60">{it.num}</span>
                      <h3 className="text-[11px] font-black tracking-tight text-foreground">{it.title}</h3>
                      <ul className="mt-1.5 space-y-1">
                        {it.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-1.5 text-[9px] leading-relaxed text-muted-foreground">
                            <span className="mt-[4px] h-1 w-1 shrink-0 rounded-full bg-amber-500/50" />{b}
                          </li>
                        ))}
                      </ul>
                      {it.maturityValue && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[8px] font-bold uppercase text-muted-foreground">
                            <span>{it.maturityLabel}</span>
                            <span className="text-amber-500">{it.maturityValue}</span>
                          </div>
                          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-amber-500/15">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${gaugeValue}%` }}
                              viewport={{ amount: 0.6, once: false }}
                              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                              className="h-full rounded-full bg-amber-400"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Right: Solutions */}
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{s.solutionsLabel}</p>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {s.solutions.map((p, i) => (
              <GlassCard key={p.title} accent="primary">
                <div className="flex items-center justify-between">
                  <span className="tabular-nums text-xl font-black text-muted-foreground/20">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-2 text-[11px] font-black tracking-tight text-foreground">{p.title}</h3>
                <ul className="mt-2 space-y-1">
                  {p.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-[9px] leading-relaxed text-muted-foreground">
                      <span className="mt-[4px] h-1 w-1 shrink-0 rounded-full bg-primary/40" />{b}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      <PullQuote className="mt-5">{s.pullquote}</PullQuote>
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
      <Eyebrow index={10} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>

      <motion.p
        variants={itemVariants}
        className="mt-4 text-[0.8rem] leading-relaxed text-muted-foreground sm:text-sm"
      >
        {s.intro}
      </motion.p>

      <div className="mt-8 space-y-4">
        {phases.map((p, i) => (
          <motion.div
            key={p.title}
            variants={itemVariants}
            className="group relative flex transform-gpu flex-col gap-5 rounded-2xl border border-border/60 bg-secondary/40 p-6 transition-all duration-300 ease-out hover:z-30 hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/40 hover:bg-secondary/60 hover:shadow-lg sm:flex-row sm:items-start sm:gap-6 sm:p-7"
          >
            <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-start sm:gap-3">
              <span
                className={`inline-block bg-gradient-to-br ${p.gradient} bg-clip-text tabular-nums text-4xl font-black text-transparent transition-transform duration-300 group-hover:scale-110 sm:text-5xl`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                <Calendar size={10} /> {p.window}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <p.icon size={18} className="text-primary shrink-0" />
                <h3 className="text-lg font-black tracking-tight text-foreground sm:text-xl">
                  {p.title}
                </h3>
              </div>
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                {p.target}
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">
                    {s.prioritiesLabel}
                  </p>
                  <ul className="space-y-1.5">
                    {p.priorities.map((pr, j) => (
                      <li key={j} className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                        <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                        {pr}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">
                    {s.outcomesLabel}
                  </p>
                  <ul className="space-y-1.5">
                    {p.outcomes.map((oc, j) => (
                      <li key={j} className="flex items-start gap-2 text-[11px] leading-relaxed text-foreground/80">
                        <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {oc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 grid gap-3 rounded-xl border border-primary/20 bg-primary/[0.04] p-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-primary/80">
                    {s.leadLabel}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.leadAgencies.map((la, j) => (
                      <span key={j} className="rounded-full border border-primary/30 bg-primary/[0.08] px-2.5 py-0.5 text-[9.5px] font-semibold text-foreground/85">
                        {la}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-primary/80">
                    {s.kpiLabel}
                  </p>
                  <ul className="space-y-1">
                    {p.kpiGates.map((kg, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-[10px] leading-snug text-foreground/85">
                        <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                        <span className="tabular-nums">{kg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        variants={itemVariants}
        className="mt-5 text-[0.75rem] leading-relaxed text-muted-foreground sm:text-[0.8rem]"
      >
        {s.closingNote}
      </motion.p>

      <PullQuote className="mt-6">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide15MyRole({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s15;

  return (
    <Slide index={index}>
      <Eyebrow index={11} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.4fr] lg:items-stretch">

        {/* LEFT — unified About-Me card */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col overflow-hidden rounded-2xl border border-border/55 bg-secondary/35 p-5"
        >
          {/* Profile identity block */}
          <div className="relative overflow-hidden rounded-xl border border-primary/25 bg-primary/[0.05] p-4">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/[0.08] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.3em] text-primary">
              <Compass size={10} /> {s.posLabel}
            </div>
            <h3 className="mt-3 text-[1.35rem] font-black leading-tight tracking-tight text-foreground sm:text-[1.55rem]">
              {s.name}
            </h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <GraduationCap size={11} className="shrink-0 text-primary/50" />
              {s.school}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-muted-foreground/60">
              <MapPinned size={10} className="shrink-0 text-primary/40" />
              {s.city}
            </div>
          </div>

          {/* Intro + intersection chips */}
          <div className="mt-4">
            <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
              {s.intro} <span className="font-medium text-foreground/70">{s.intersectionLabel}</span>
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {s.intersectionItems.map((item, i) => (
                <span
                  key={i}
                  className="rounded-full border border-primary/25 bg-primary/[0.07] px-2.5 py-1 text-[10.5px] font-semibold text-foreground/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Motivation */}
          <div className="mt-4">
            <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
              {s.motivationText}
            </p>
            <ul className="mt-2 space-y-1.5">
              {s.motivationItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] font-semibold text-foreground/80">
                  <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-primary/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Long-term direction — always pinned to bottom */}
          <div className="mt-auto border-t border-border/30 pt-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-primary">
              {s.pathLabel}
            </p>
            <p className="mt-2 text-[0.78rem] italic leading-relaxed text-muted-foreground/85">
              {s.pathText}
            </p>
          </div>
        </motion.div>

        {/* RIGHT — capability cards */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col overflow-hidden rounded-2xl border border-border/55 bg-secondary/35 p-5"
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-primary">
            {s.capLabel}
          </p>
          <div className="mt-4 grid flex-1 gap-3 sm:grid-cols-2 sm:grid-rows-2">
            {s.capabilities.map((cap) => (
              <div
                key={cap.title}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/75 hover:shadow-md hover:shadow-primary/5"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <h4 className="text-[11px] font-black leading-snug tracking-tight text-foreground">
                  {cap.title}
                </h4>
                <ul className="mt-2.5 flex-1 space-y-1.5">
                  {cap.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-[10px] leading-relaxed text-muted-foreground">
                      <span className="mt-[5px] h-[4px] w-[4px] shrink-0 rounded-full bg-primary/55" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.p
        variants={itemVariants}
        className="mt-5 text-[0.75rem] leading-relaxed text-muted-foreground sm:text-[0.8rem]"
      >
        {s.closingNote}
      </motion.p>

      <PullQuote className="mt-6">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide16WhyFellowship({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s16;
  const REASON_ICONS = [Key, Layers, Users, Rocket];
  const HORIZON_ICONS = [Rocket, Handshake, Telescope];
  const reasons = s.reasons.map((r, i) => ({ ...r, icon: REASON_ICONS[i] }));
  const horizons = s.horizons.map((h, i) => ({ ...h, icon: HORIZON_ICONS[i] }));

  return (
    <Slide index={index}>
      <Eyebrow index={12} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>

      <motion.div
        variants={itemVariants}
        className="mt-5 rounded-xl border border-border/60 bg-secondary/30 px-5 py-4"
      >
        <p className="text-[0.8rem] leading-relaxed text-muted-foreground">{s.intro}</p>
        <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
          {s.introBullets.map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-[11px] font-semibold text-foreground/80">
              <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
              {b}
            </li>
          ))}
        </ul>
      </motion.div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        {/* Left: 4 reason cards */}
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            {s.reasonsLabel}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {reasons.map((r) => (
              <GlassCard key={r.title} accent="primary">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-2 shrink-0">
                    <r.icon className="text-primary" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[11px] font-black tracking-tight text-foreground leading-snug">
                      {r.title}
                    </h3>
                    <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">{r.body}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Right: 3 horizon cards + closing */}
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            {s.visionsLabel}
          </p>
          <div className="space-y-3">
            {horizons.map((h) => (
              <motion.div
                key={h.title}
                variants={itemVariants}
                className="group flex transform-gpu items-start gap-4 rounded-2xl border border-border/60 bg-secondary/40 p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary/60 hover:shadow-md"
              >
                <div className="rounded-xl border border-primary/30 bg-primary/10 p-2 shrink-0">
                  <h.icon className="text-primary" size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-primary">{h.yearLabel}</span>
                  </div>
                  <h3 className="mt-0.5 text-[11px] font-black tracking-tight text-foreground">{h.title}</h3>
                  <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">{h.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.p
        variants={itemVariants}
        className="mt-5 text-[0.75rem] leading-relaxed text-muted-foreground sm:text-[0.8rem]"
      >
        {s.closingNote}
      </motion.p>

      <PullQuote className="mt-5">{s.pullquote}</PullQuote>
    </Slide>
  );
}
