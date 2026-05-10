"use client";

import Link from "next/link";
import { ArrowRight, Mail, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { SITE_CONFIG } from "@/lib/constants";
import type { Post } from "@/types";

// Typed slices of the dictionary so the section data stays structured.
type PortfolioCopy = {
  hero: { badge: string; eyebrow: string; title: string; description: string };
  signature: { quote: string; attribution: string };
  principles_section: string;
  principles_title: string;
  principles_intro: string;
  principles: { title: string; body: string }[];
  process_section: string;
  process_title: string;
  process_intro: string;
  process: { label: string; body: string }[];
  exploring_section: string;
  exploring_title: string;
  exploring_intro: string;
  exploring: { tag: string; title: string; body: string }[];
  beyond_section: string;
  beyond_title: string;
  beyond_intro: string;
  beyond: { label: string; body: string }[];
  manifesto_section: string;
  manifesto_title: string;
  manifesto_body: string;
  contact_title: string;
  contact_body: string;
  contact_cta_primary: string;
  contact_cta_secondary: string;
};

function usePortfolioCopy(): PortfolioCopy {
  const { language } = useLanguage();
  // Fall back to English if a section is missing (mirrors the t() fallback).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lang = (dictionaries[language] as any)?.pages?.portfolio;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const en = (dictionaries.en as any).pages.portfolio;
  return { ...en, ...(lang ?? {}) } as PortfolioCopy;
}

export function PortfolioClient(_props: { projects: Post[] }) {
  const copy = usePortfolioCopy();

  return (
    <Container className="space-y-24 pb-24">

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <Section className="space-y-7 pt-14 text-center">
        <FadeIn className="space-y-6 flex flex-col items-center">
          <Badge
            variant="outline"
            className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]"
          >
            {copy.hero.badge}
          </Badge>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/80">
              {copy.hero.eyebrow}
            </p>
            <Heading variant="hero" as="h1" className="max-w-3xl">
              {copy.hero.title}
            </Heading>
          </div>

          <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
            {copy.hero.description}
          </p>
        </FadeIn>
      </Section>

      {/* ── SIGNATURE QUOTE — the working belief ───────────────────────────── */}
      <Section className="pt-0">
        <FadeIn>
          <figure className="relative mx-auto max-w-3xl rounded-3xl border border-border/50 bg-card/60 px-7 py-9 sm:px-10 sm:py-12">
            <div className="absolute -left-3 -top-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-background text-primary shadow-[0_0_30px_-10px_hsl(var(--primary))]">
              <Quote size={16} />
            </div>
            <blockquote className="text-lg sm:text-xl leading-relaxed text-foreground/90 font-medium">
              &ldquo;{copy.signature.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
              {copy.signature.attribution}
            </figcaption>
          </figure>
        </FadeIn>
      </Section>

      {/* ── PRINCIPLES (numbered cards) ────────────────────────────────────── */}
      <Section className="space-y-10 pt-0">
        <SectionHeader
          eyebrow={copy.principles_section}
          title={copy.principles_title}
          intro={copy.principles_intro}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {copy.principles.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.06}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 transition-all hover:border-primary/40 hover:bg-card/70 sm:p-7">
                {/* Vertical accent line */}
                <span className="pointer-events-none absolute inset-y-6 left-0 w-[3px] rounded-full bg-gradient-to-b from-primary/80 via-primary/40 to-transparent" />
                <div className="flex items-baseline gap-4 pl-3">
                  <span className="text-xs font-black tabular-nums tracking-[0.25em] text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-black tracking-tight text-foreground sm:text-xl">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-3 pl-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {p.body}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ── PROCESS — how I work (2x2 grid) ────────────────────────────────── */}
      <Section className="space-y-10 pt-0">
        <SectionHeader
          eyebrow={copy.process_section}
          title={copy.process_title}
          intro={copy.process_intro}
        />

        <FadeIn>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-border/50 bg-border/40 sm:grid-cols-2">
            {copy.process.map((step) => (
              <div
                key={step.label}
                className="group relative bg-card/60 p-6 transition-colors hover:bg-card sm:p-8"
              >
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  {step.label}
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ── EXPLORING — current radar ──────────────────────────────────────── */}
      <Section className="space-y-10 pt-0">
        <SectionHeader
          eyebrow={copy.exploring_section}
          title={copy.exploring_title}
          intro={copy.exploring_intro}
        />

        <ul className="space-y-3">
          {copy.exploring.map((e, i) => (
            <FadeIn key={e.title} delay={i * 0.05}>
              <li className="group flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/40 p-5 transition-all hover:border-primary/30 hover:bg-card/70 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
                <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                  {e.tag}
                </span>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-base font-black tracking-tight text-foreground sm:text-lg">
                    {e.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {e.body}
                  </p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ul>
      </Section>

      {/* ── BEYOND — values / fuels ────────────────────────────────────────── */}
      <Section className="space-y-10 pt-0">
        <SectionHeader
          eyebrow={copy.beyond_section}
          title={copy.beyond_title}
          intro={copy.beyond_intro}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.beyond.map((b, i) => (
            <FadeIn key={b.label} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-dashed border-border/60 bg-background/30 p-5 transition-colors hover:border-primary/30 hover:bg-background/60">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/70">
                  {b.label}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ── MANIFESTO — heading toward ─────────────────────────────────────── */}
      <Section className="pt-0">
        <FadeIn>
          <div className="mx-auto max-w-3xl rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 via-card/40 to-card/40 p-7 sm:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
              {copy.manifesto_section}
            </p>
            <Heading variant="title" className="mt-4 text-2xl sm:text-3xl">
              {copy.manifesto_title}
            </Heading>
            <p className="mt-5 text-base leading-relaxed text-foreground/85 sm:text-lg">
              {copy.manifesto_body}
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* ── CONTACT CTA ────────────────────────────────────────────────────── */}
      <Section className="pt-0">
        <FadeIn className="text-center space-y-6">
          <Heading variant="title" className="text-2xl sm:text-3xl">
            {copy.contact_title}
          </Heading>
          <p className="mx-auto max-w-xl text-base text-muted-foreground leading-relaxed">
            {copy.contact_body}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link
              href={`mailto:${SITE_CONFIG.links.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-black uppercase tracking-widest text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_hsl(var(--primary))] active:scale-95"
            >
              <Mail size={15} />
              {copy.contact_cta_primary}
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 px-7 py-3 text-sm font-black uppercase tracking-widest text-foreground transition-all hover:border-primary/40 hover:text-primary"
            >
              {copy.contact_cta_secondary}
              <ArrowRight size={15} />
            </Link>
          </div>
        </FadeIn>
      </Section>

    </Container>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <FadeIn className="space-y-3 max-w-2xl">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
        {eyebrow}
      </p>
      <Heading variant="title" className="text-2xl sm:text-3xl">
        {title}
      </Heading>
      <p className="text-sm text-muted-foreground leading-relaxed sm:text-[15px]">
        {intro}
      </p>
    </FadeIn>
  );
}
