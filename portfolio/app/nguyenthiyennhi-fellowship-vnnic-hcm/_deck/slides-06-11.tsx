"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  FileText,
  MapPin,
} from "lucide-react";
import {
  Eyebrow,
  GlassCard,
  HeadlineDisplay,
  PullQuote,
  Slide,
  StatBlock,
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

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <motion.p
          variants={itemVariants}
          className="text-[0.8rem] leading-relaxed text-muted-foreground sm:text-sm"
        >
          {s.intro}
        </motion.p>
        <motion.ul variants={itemVariants} className="flex flex-wrap gap-2">
          {s.foundations.map((f, i) => (
            <li
              key={i}
              className="rounded-full border border-primary/25 bg-primary/[0.07] px-3 py-1 text-[11px] font-semibold text-foreground"
            >
              {f}
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.p
        variants={itemVariants}
        className="mt-6 mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary"
      >
        <FileText size={11} />
        {s.policyLabel}
      </motion.p>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {s.policyAnchors.map((pa) => {
          const inner = (
            <div className="relative h-full overflow-hidden rounded-xl border border-primary/25 bg-secondary/30 p-3.5 transition-colors hover:border-primary/55 hover:bg-secondary/50">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black tracking-tight text-primary">
                  {pa.code}
                </span>
                <span className="text-[9px] font-bold tabular-nums text-muted-foreground/70">
                  {pa.year}
                </span>
              </div>
              <p className="mt-1.5 text-[10.5px] leading-[1.45] text-foreground/85">
                {pa.title}
              </p>
              {pa.url && (
                <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-primary/70">
                  <ExternalLink size={9} />
                  {pa.url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 40)}
                </span>
              )}
            </div>
          );
          return (
            <motion.div key={pa.code} variants={itemVariants}>
              {pa.url ? (
                <a href={pa.url} target="_blank" rel="noopener noreferrer">{inner}</a>
              ) : (
                inner
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.p
        variants={itemVariants}
        className="mt-6 mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground"
      >
        {s.posLabel}
      </motion.p>
      <div className="grid grid-cols-3 gap-3">
        {s.positionStats.map((ps) => (
          <StatBlock
            key={ps.label}
            value={ps.value}
            label={ps.label}
            accent="text-primary"
            cite={ps.cite}
          />
        ))}
      </div>
      <motion.p
        variants={itemVariants}
        className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground sm:text-[0.8rem]"
      >
        {s.posNote}
      </motion.p>

      <motion.p
        variants={itemVariants}
        className="mt-7 mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-primary"
      >
        {s.objLabel}
      </motion.p>
      <div className="grid gap-4 lg:grid-cols-3">
        {s.objectives.map((obj, i) => (
          <GlassCard key={i} accent="primary">
            <div className="mb-2 tabular-nums text-2xl font-black leading-none text-primary/25">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="text-sm font-black leading-snug tracking-tight text-foreground">
              {obj.title}
            </h3>
            <ul className="mt-3 space-y-1.5">
              {obj.bullets.map((b, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
                >
                  <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                  {b}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-6 flex flex-wrap items-center gap-2"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          {s.citiesLabel}:
        </span>
        {s.cities.map((city, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/[0.07] px-3 py-1 text-[11px] font-semibold text-foreground"
          >
            <MapPin size={10} className="text-primary" /> {city}
          </span>
        ))}
      </motion.div>

      <PullQuote className="mt-8">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide07IntelligentSystems({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s07;

  return (
    <Slide index={index}>
      <Eyebrow index={6} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>

      <motion.p variants={itemVariants} className="mt-3 text-[0.8rem] leading-relaxed text-muted-foreground sm:text-sm">
        {s.intro}
      </motion.p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2 lg:items-stretch">
        {s.sections.map((sec, si) => (
          <motion.div key={sec.tag} variants={itemVariants} className="relative flex flex-col overflow-hidden rounded-2xl border border-border/55 bg-secondary/35 p-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
            {/* Tag */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-primary">
              {sec.tag}
            </div>
            {/* Headline */}
            <h3 className="mt-3 text-[0.88rem] font-black leading-snug tracking-tight text-foreground sm:text-sm">{sec.headline}</h3>
            {/* Intro */}
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">{sec.intro}</p>
            {/* Bullets */}
            <ul className="mt-3 space-y-1.5">
              {sec.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-[10px] leading-relaxed text-muted-foreground">
                  <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-primary/55" />{h}
                </li>
              ))}
            </ul>
            {/* Stat boxes — mt-auto pushes to card bottom, always aligned */}
            <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border/25 pt-4 mt-4">
              {sec.stats.map((st) => (
                <div key={st.label} className="relative flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card/60 p-3 text-center">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  {/* Value */}
                  <p className="tabular-nums text-[0.9rem] font-black leading-tight text-primary">{st.value}</p>
                  {/* Label — flex-1 so all boxes match tallest label */}
                  <p className="mt-1.5 flex-1 text-[8px] leading-[1.35] text-muted-foreground">{st.label}</p>
                  {/* Cite — always 1 line height to keep boxes uniform */}
                  <p className="mt-1.5 h-[0.9rem] text-[7.5px] italic leading-tight text-primary/55">
                    {st.cite ? `[${st.cite}]` : ""}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="mt-5">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">{s.domainsLabel}</p>
        <div className="flex flex-wrap gap-2">
          {s.domains.map((d) => (
            <span key={d} className="rounded-full border border-border/50 bg-secondary/30 px-3 py-1 text-[10px] font-semibold text-foreground/70">{d}</span>
          ))}
        </div>
      </motion.div>

      <PullQuote className="mt-5">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide09SmartInfrastructure({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s09;

  return (
    <Slide index={index}>
      <Eyebrow index={7} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>

      <motion.p variants={itemVariants} className="mt-3 text-[0.8rem] leading-relaxed text-muted-foreground sm:text-sm">
        {s.intro}
      </motion.p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2 lg:items-stretch">
        {s.sections.map((sec) => (
          <motion.div key={sec.tag} variants={itemVariants} className="relative flex flex-col overflow-hidden rounded-2xl border border-border/55 bg-secondary/35 p-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
            {/* Tag */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-primary">
              {sec.tag}
            </div>
            {/* Headline */}
            <h3 className="mt-3 text-[0.88rem] font-black leading-snug tracking-tight text-foreground sm:text-sm">{sec.headline}</h3>
            {/* Intro */}
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">{sec.intro}</p>
            {/* Bullets */}
            <ul className="mt-3 space-y-1.5">
              {sec.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-[10px] leading-relaxed text-muted-foreground">
                  <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-primary/55" />{h}
                </li>
              ))}
            </ul>
            {/* Extras (city tags etc.) */}
            {sec.extras.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {sec.extras.map((e) => (
                  <span key={e} className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[9px] font-semibold text-primary">{e}</span>
                ))}
              </div>
            )}
            {/* Stat boxes — mt-auto keeps them at card bottom regardless of content height */}
            <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border/25 pt-4 mt-4">
              {sec.stats.map((st) => (
                <div key={st.label} className="relative flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card/60 p-3 text-center">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  {/* Value */}
                  <p className="tabular-nums text-[0.9rem] font-black leading-tight text-primary">{st.value}</p>
                  {/* Label — flex-1 equalises height across all 3 boxes */}
                  <p className="mt-1.5 flex-1 text-[8px] leading-[1.35] text-muted-foreground">{st.label}</p>
                  {/* Cite — fixed line height keeps boxes uniform */}
                  <p className="mt-1.5 h-[0.9rem] text-[7.5px] italic leading-tight text-primary/55">
                    {st.cite ? `[${st.cite}]` : ""}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <PullQuote className="mt-5">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide11Cybersecurity({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s11;

  return (
    <Slide index={index}>
      <Eyebrow index={8} label={s.eyebrow} />
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

      <motion.p
        variants={itemVariants}
        className="mt-6 mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-primary"
      >
        {s.capLabel}
      </motion.p>
      <div className="grid gap-4 sm:grid-cols-2">
        {s.capabilities.map((cap, i) => (
          <GlassCard key={i} accent="primary" className="!p-5">
            <h3 className="text-[0.8rem] font-black tracking-tight text-foreground sm:text-sm">
              {cap.title}
            </h3>
            <ul className="mt-3 space-y-1.5">
              {cap.bullets.map((b, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
                >
                  <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                  {b}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5"
      >
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
          {s.cavLabel}
        </p>
        <ul className="space-y-2">
          {s.caveats.map((c, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[11px] leading-relaxed text-foreground/80"
            >
              <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-amber-500/70" />
              {c}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="mt-4 text-[0.75rem] leading-relaxed text-muted-foreground sm:text-[0.8rem]"
      >
        {s.closingNote}
      </motion.p>

      <PullQuote className="mt-6">{s.pullquote}</PullQuote>
    </Slide>
  );
}
