"use client";

import { motion } from "framer-motion";
import {
  BookMarked,
  ExternalLink,
  Globe,
  Heart,
  Library,
  ScanLine,
} from "lucide-react";
import {
  Eyebrow,
  HeadlineDisplay,
  PullQuote,
  Slide,
  Subhead,
  itemVariants,
} from "./shared";
import { useDeckT } from "./use-deck-t";

export function Slide18Closing({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s18;
  return (
    <Slide index={index} maxWidth="max-w-4xl">
      <Eyebrow index={13} label={s.eyebrow} />

      {/* Headline block */}
      <div className="mt-1">
        <motion.h2
          variants={itemVariants}
          className="text-balance text-2xl font-black leading-[1.15] tracking-tight text-muted-foreground/65 sm:text-3xl md:text-[2.2rem]"
        >
          {s.headline1}
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="mt-1 text-2xl font-black tracking-tight text-primary sm:text-3xl md:text-[2.2rem]"
        >
          {s.headlineBuilt}
        </motion.p>
      </div>

      {/* Intro */}
      <motion.p
        variants={itemVariants}
        className="mt-6 text-[0.82rem] leading-relaxed text-muted-foreground sm:text-[0.88rem]"
      >
        {s.layerIntro} {s.layerSubtitle}
      </motion.p>

      {/* Layers — 2×2 grid cards */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {s.layers.map((layer, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="group flex items-center gap-4 overflow-hidden rounded-xl border border-border/50 bg-secondary/30 px-4 py-3.5 transition-all duration-200 hover:border-primary/35 hover:bg-secondary/50"
          >
            <span className="shrink-0 tabular-nums text-[1.6rem] font-black leading-none text-primary/15 transition-colors duration-200 group-hover:text-primary/30">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="h-7 w-px shrink-0 bg-border/60" />
            <span className="text-[0.82rem] font-semibold leading-snug text-foreground sm:text-[0.88rem]">
              {layer}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Closing statement card */}
      <motion.div
        variants={itemVariants}
        className="relative mt-6 overflow-hidden rounded-2xl border border-primary/30 bg-primary/[0.05] px-6 py-5"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent" />
        <div className="pointer-events-none absolute left-0 inset-y-0 w-[3px] rounded-r-full bg-primary/50" />
        <p className="text-[0.85rem] italic leading-relaxed text-muted-foreground sm:text-[0.9rem]">
          {s.closing1}
        </p>
        <p className="mt-1.5 text-[0.85rem] font-bold italic leading-relaxed text-foreground sm:text-[0.9rem]">
          {s.closing2}
        </p>
      </motion.div>

      <PullQuote className="mt-6">{s.pullquote}</PullQuote>
    </Slide>
  );
}

export function Slide19References({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s19;

  return (
    <Slide index={index}>
      <Eyebrow index={14} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1} <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>

      {/* Method box */}
      <motion.div
        variants={itemVariants}
        className="mt-5 flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/[0.04] px-5 py-4 sm:flex-row sm:items-start sm:gap-6"
      >
        <div className="shrink-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">{s.methodLabel}</p>
          <p className="mt-1 text-[13px] font-black text-foreground">{s.methodTitle}</p>
        </div>
        <div className="h-px w-full bg-border/40 sm:h-auto sm:w-px sm:self-stretch" />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-muted-foreground">{s.methodSourcesLabel}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {s.methodSources.map((src, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />{src}
              </span>
            ))}
          </div>
          <p className="mt-2.5 text-[11px] italic text-muted-foreground/60">{s.methodNote}</p>
        </div>
      </motion.div>

      {/* Reference groups 2×2 */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {s.groups.map((g) => (
          <motion.div
            key={g.title}
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-secondary/40 p-5 transition-colors hover:border-border/80 hover:bg-secondary/50"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <p className="text-[13px] font-black tracking-tight text-foreground">{g.title}</p>
            {g.roleNote && (
              <p className="mt-1 text-[11px] italic text-primary/70">{g.roleNote}</p>
            )}
            <ul className="mt-3 space-y-3">
              {g.items.map((it) => (
                <li key={it.url}>
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/ref block rounded-lg p-1.5 -m-1.5 transition-colors hover:bg-primary/[0.04]"
                  >
                    <p className="text-[12px] font-semibold text-foreground leading-snug transition-colors group-hover/ref:text-primary">{it.name}</p>
                    <div className="mt-1 flex flex-wrap items-start gap-x-2 gap-y-0.5">
                      <span className="flex items-center gap-1 text-[10px] text-primary/60 transition-colors group-hover/ref:text-primary group-hover/ref:underline underline-offset-2 shrink-0">
                        <ExternalLink size={9} />{it.url.replace(/^https?:\/\/(www\.)?/, "")}
                      </span>
                      {it.desc && (
                        <span className="text-[10px] text-muted-foreground/70 leading-snug">— {it.desc}</span>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Academic notes */}
      <motion.div
        variants={itemVariants}
        className="mt-4 rounded-xl border border-border/40 bg-secondary/20 px-5 py-3.5"
      >
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">{s.academicLabel}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5">
          {s.academicNotes.map((note, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-1 w-1 shrink-0 rounded-full bg-border" />{note}
            </span>
          ))}
        </div>
      </motion.div>
    </Slide>
  );
}

export function Slide20ThankYou({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s20;

  const contacts = [
    { label: s.contactLabels[0], value: "nhiyen.engineer@gmail.com", href: "mailto:nhiyen.engineer@gmail.com" },
    { label: s.contactLabels[1], value: "startup.id.vn/portfolio",   href: "https://startup.id.vn/portfolio"  },
  ];

  return (
    <Slide index={index} maxWidth="max-w-3xl">
      <div className="flex flex-col items-center text-center">

        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground backdrop-blur-sm"
        >
          <Heart size={11} className="text-primary" /> {s.badge}
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="mt-5 text-balance text-[2rem] font-black tracking-tight text-foreground sm:text-[2.8rem] md:text-[3.5rem]"
          style={{ lineHeight: 1.05 }}
        >
          {s.title}
        </motion.h1>

        {/* Name + byline */}
        <motion.div variants={itemVariants} className="mt-5">
          <p className="text-[1rem] font-black tracking-tight text-foreground sm:text-[1.1rem]">
            {s.nameLabel}
          </p>
          <p className="mt-1 text-[0.88rem] text-muted-foreground">{s.byline}</p>
        </motion.div>

        {/* Heartfelt intro */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mt-5 max-w-xl text-[0.92rem] leading-[1.75] text-muted-foreground/80 sm:text-[0.98rem]"
        >
          {s.intro}
        </motion.p>

        {/* Contact — 2 cards */}
        <motion.div variants={itemVariants} className="mt-8 w-full">
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.32em] text-muted-foreground/45">
            {s.contactLabel}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-secondary/30 p-4 text-left backdrop-blur-sm transition-all duration-250 hover:border-primary/45 hover:bg-secondary/55 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">
                  {c.label}
                </p>
                <p className="mt-2 text-[13px] font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                  {c.value}
                </p>
              </a>
            ))}
          </div>
          {/* Portfolio invite */}
          <p className="mx-auto mt-3 max-w-sm text-[12px] italic leading-relaxed text-muted-foreground/60">
            {s.portfolioInvite}
          </p>
        </motion.div>

        {/* Closing thought */}
        <motion.div variants={itemVariants} className="mt-8 w-full text-left">
          <p className="mb-3 text-center text-[9px] font-bold uppercase tracking-[0.32em] text-muted-foreground/45">
            {s.footerTitle}
          </p>
          <div className="rounded-2xl border border-border/40 bg-secondary/25 px-6 py-5">
            <p className="text-[0.9rem] leading-[1.75] text-muted-foreground sm:text-[0.95rem]">
              {s.footerBody}
            </p>
          </div>
        </motion.div>

        {/* Pull quote — final statement */}
        <motion.div variants={itemVariants} className="mt-5 w-full">
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-primary/[0.05] px-6 py-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <p className="text-[0.95rem] font-bold italic leading-relaxed text-foreground sm:text-[1.05rem]">
              &ldquo;{s.pullquote}&rdquo;
            </p>
          </div>
        </motion.div>

      </div>
    </Slide>
  );
}
