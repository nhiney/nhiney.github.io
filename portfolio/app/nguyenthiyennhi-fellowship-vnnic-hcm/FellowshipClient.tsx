"use client";

import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Shield,
  Code2,
  Users,
  Zap,
  BookOpen,
  GitBranch,
  Wrench,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Award,
  FileText,
  Calendar,
  Folder,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { DiagramMindmap } from "./diagrams/DiagramMindmap";
import { DiagramComparison } from "./diagrams/DiagramComparison";
import { DiagramArchitecture } from "./diagrams/DiagramArchitecture";

const CONTEXT_TIERS = [
  { key: "tier1", color: "bg-rose-600",    icon: Award    },
  { key: "tier2", color: "bg-amber-600",   icon: FileText },
  { key: "tier3", color: "bg-cyan-600",    icon: GitBranch },
] as const;

const TARGETS = ["target_1", "target_2", "target_3"] as const;
const WHY_NOWS = ["why_now_1", "why_now_2", "why_now_3"] as const;

const WHY_ITEMS = [
  { icon: Globe,     key: "sovereignty", color: "bg-blue-600"    },
  { icon: Zap,       key: "ai",          color: "bg-violet-600"  },
  { icon: Shield,    key: "security",    color: "bg-emerald-600" },
  { icon: Users,     key: "iot",         color: "bg-orange-600"  },
  { icon: ArrowRight,key: "performance", color: "bg-pink-600"    },
] as const;

const PILLARS = [
  { key: "pillar1", color: "bg-blue-600"    },
  { key: "pillar2", color: "bg-emerald-600" },
  { key: "pillar3", color: "bg-violet-600"  },
  { key: "pillar4", color: "bg-amber-600"   },
] as const;

const MILESTONE_ROWS = ["m2026", "m2028", "m2030"] as const;

const YOUTH_INITIATIVES = [
  { key: "init1", icon: Code2,     color: "bg-violet-600"  },
  { key: "init2", icon: Wrench,    color: "bg-emerald-600" },
  { key: "init3", icon: Globe,     color: "bg-blue-600"    },
  { key: "init4", icon: Users,     color: "bg-orange-600"  },
  { key: "init5", icon: BookOpen,  color: "bg-pink-600"    },
] as const;

const MINDSET_ROWS = ["row1", "row2", "row3", "row4", "row5", "row6", "row7"] as const;

const COMMITMENTS = ["commit1", "commit2", "commit3"] as const;

const WHAT_I_BRING = [
  { key: "backend"     },
  { key: "security"    },
  { key: "mobile"      },
  { key: "delivery"    },
  { key: "consistency" },
] as const;

const ASKS = ["ask_1", "ask_2", "ask_3"] as const;

const ESSAY_REFS = ["ref1", "ref2", "ref3", "ref4"] as const;

export function FellowshipClient() {
  const { t } = useLanguage();

  return (
    <Container className="pb-20 space-y-16">

      {/* ── Slide 1 · Hero (Manifesto Cover) ── */}
      <Section className="pt-12">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-16 text-center shadow-[0_0_120px_-30px_rgba(37,99,235,0.45)] sm:px-12 sm:py-24">
            {/* Background glows */}
            <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -z-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/4 -z-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 right-1/4 -z-0 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-7">
              {/* Top badge */}
              <Badge variant="outline" className="w-fit border-blue-400/30 bg-blue-500/10 px-6 py-2 font-bold uppercase tracking-[0.25em] text-blue-200 text-[10px]">
                {t("pages.fellowship.hero.badge")}
              </Badge>

              {/* Eyebrow */}
              <p className="text-[11px] font-bold uppercase tracking-[0.45em] text-blue-300/80">
                {t("pages.fellowship.hero.eyebrow")}
              </p>

              {/* Core title — centered manifesto style */}
              <h1 className="text-balance bg-gradient-to-br from-white via-blue-100 to-blue-300 bg-clip-text text-5xl font-black tracking-tighter text-transparent sm:text-6xl lg:text-7xl">
                {t("pages.fellowship.hero.title")}
              </h1>

              {/* Subtitle */}
              <p className="text-balance text-base font-semibold tracking-wide text-blue-100/80 sm:text-lg">
                {t("pages.fellowship.hero.subtitle")}
              </p>

              {/* Divider */}
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

              {/* Author block */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-300/70">
                  {t("pages.fellowship.hero.author_label")}
                </span>
                <span className="text-xl font-black tracking-tight text-white">
                  {t("pages.fellowship.hero.author_name")}
                </span>
                <span className="text-xs font-semibold tracking-wider text-blue-200/70">
                  {t("pages.fellowship.hero.author_meta")}
                </span>
              </div>

              {/* Thesis pull-quote */}
              <blockquote className="mt-2 max-w-3xl border-l-2 border-blue-400/50 pl-5 text-left text-sm font-semibold italic leading-relaxed text-blue-50/90 sm:text-base">
                {t("pages.fellowship.hero.thesis")}
              </blockquote>

              {/* CTA */}
              <div className="mt-2 flex flex-wrap justify-center gap-4">
                <Link
                  href="/portfolio"
                  className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.8)] active:scale-95"
                >
                  {t("pages.fellowship.hero.cta_primary")} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/resume"
                  className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 px-8 py-4 text-sm font-black uppercase tracking-widest text-blue-100 transition-all hover:border-blue-300/60 hover:bg-blue-500/10 active:scale-95"
                >
                  {t("pages.fellowship.hero.cta_secondary")}
                </Link>
              </div>
            </div>
          </div>

          {/* Sub-bio under hero card */}
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
            {t("pages.fellowship.hero.description")}
          </p>
        </FadeIn>
      </Section>

      {/* ── Slide 2 · Strategic Context ── */}
      <Section className="space-y-8 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.fellowship.context.section")}</Heading>
          <Heading variant="title">{t("pages.fellowship.context.title")}</Heading>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            {t("pages.fellowship.context.intro")}
          </p>
        </FadeIn>

        <FadeIn>
          <div className="grid gap-5 md:grid-cols-3">
            {CONTEXT_TIERS.map(({ key, color, icon: Icon }) => (
              <div key={key} className="rounded-3xl border border-border/50 bg-card/60 p-7 glass-card transition-all hover:border-primary/30">
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
                  <Icon size={18} className="text-white" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  {t(`pages.fellowship.context.${key}_label`)}
                </p>
                <h3 className="mt-2 mb-3 text-base font-black tracking-tight">
                  {t(`pages.fellowship.context.${key}_instrument`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`pages.fellowship.context.${key}_intent`)}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Targets */}
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-7 glass-card">
              <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-primary">
                {t("pages.fellowship.context.targets_title")}
              </h3>
              <ul className="space-y-3">
                {TARGETS.map((k) => (
                  <li key={k} className="flex gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                    <span className="text-sm leading-relaxed text-foreground">
                      {t(`pages.fellowship.context.${k}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why now */}
            <div className="rounded-3xl border border-border/50 bg-card/60 p-7 glass-card">
              <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-foreground">
                {t("pages.fellowship.context.why_now_title")}
              </h3>
              <ul className="space-y-3">
                {WHY_NOWS.map((k) => (
                  <li key={k} className="flex gap-3">
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-500" />
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {t(`pages.fellowship.context.${k}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>

        <p className="text-xs italic text-muted-foreground">
          {t("pages.fellowship.context.citation")}
        </p>
      </Section>

      {/* ── Slide 3 · Why IPv6 Matters ── */}
      <Section className="space-y-8 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.fellowship.why.section")}</Heading>
          <Heading variant="title">{t("pages.fellowship.why.title")}</Heading>
        </FadeIn>
        <FadeIn>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_ITEMS.map(({ icon: Icon, color, key }) => (
              <div key={key} className="rounded-3xl border border-border/50 bg-card/60 p-7 glass-card transition-all hover:border-primary/30">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${color}`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="mb-3 text-lg font-black tracking-tight">{t(`pages.fellowship.why.${key}_title`)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(`pages.fellowship.why.${key}_desc`)}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ── Slide 4 · Roadmap ── */}
      <Section className="space-y-8 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.fellowship.roadmap.section")}</Heading>
          <Heading variant="title">{t("pages.fellowship.roadmap.title")}</Heading>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            {t("pages.fellowship.roadmap.intro")}
          </p>
        </FadeIn>

        <FadeIn>
          <div className="grid gap-5 md:grid-cols-2">
            {PILLARS.map(({ key, color }) => (
              <div key={key} className="relative rounded-3xl border border-border/50 bg-card/60 p-7 glass-card transition-all hover:border-primary/30">
                <div className="mb-4 flex items-center gap-3">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${color}`}>
                    <Calendar size={14} className="text-white" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                    {t(`pages.fellowship.roadmap.${key}_year`)}
                  </span>
                </div>
                <h3 className="mb-3 text-base font-black tracking-tight">
                  {t(`pages.fellowship.roadmap.${key}_title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`pages.fellowship.roadmap.${key}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Milestones table */}
        <FadeIn>
          <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/60 glass-card">
            <h3 className="border-b border-border/50 px-7 py-5 text-sm font-black uppercase tracking-[0.2em] text-foreground">
              {t("pages.fellowship.roadmap.milestones_title")}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="px-7 py-4">{t("pages.fellowship.roadmap.col_year")}</th>
                    <th className="px-4 py-4">{t("pages.fellowship.roadmap.col_users")}</th>
                    <th className="px-4 py-4">{t("pages.fellowship.roadmap.col_aaaa")}</th>
                    <th className="px-4 py-4">{t("pages.fellowship.roadmap.col_gov")}</th>
                    <th className="px-7 py-4">{t("pages.fellowship.roadmap.col_rank")}</th>
                  </tr>
                </thead>
                <tbody>
                  {MILESTONE_ROWS.map((row) => (
                    <tr key={row} className="border-b border-border/30 last:border-b-0 transition-colors hover:bg-primary/5">
                      <td className="px-7 py-4 font-black tracking-tight text-foreground">
                        {t(`pages.fellowship.roadmap.${row}_year`)}
                      </td>
                      <td className="px-4 py-4 font-semibold text-muted-foreground">{t(`pages.fellowship.roadmap.${row}_users`)}</td>
                      <td className="px-4 py-4 font-semibold text-muted-foreground">{t(`pages.fellowship.roadmap.${row}_aaaa`)}</td>
                      <td className="px-4 py-4 font-semibold text-muted-foreground">{t(`pages.fellowship.roadmap.${row}_gov`)}</td>
                      <td className="px-7 py-4 font-black text-primary">{t(`pages.fellowship.roadmap.${row}_rank`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* ── Slide 5 · Youth Action Plan ── */}
      <Section className="space-y-8 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.fellowship.youth.section")}</Heading>
          <Heading variant="title">{t("pages.fellowship.youth.title")}</Heading>
          <p className="max-w-3xl text-sm italic text-muted-foreground leading-relaxed">
            {t("pages.fellowship.youth.premise")}
          </p>
        </FadeIn>

        <FadeIn>
          <div className="space-y-4">
            {YOUTH_INITIATIVES.map(({ key, icon: Icon, color }) => (
              <div key={key} className="flex flex-col gap-4 rounded-3xl border border-border/50 bg-card/60 p-7 glass-card transition-all hover:border-primary/30 sm:flex-row sm:items-start">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${color}`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-base font-black tracking-tight">
                    {t(`pages.fellowship.youth.${key}_title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`pages.fellowship.youth.${key}_desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ── Slide 6 · Mindset Shift ── */}
      <Section className="space-y-8 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.fellowship.mindset.section")}</Heading>
          <Heading variant="title">{t("pages.fellowship.mindset.title")}</Heading>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            {t("pages.fellowship.mindset.intro")}
          </p>
        </FadeIn>

        <FadeIn>
          <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/60 glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="w-1/2 px-7 py-4 text-rose-400">{t("pages.fellowship.mindset.col_v4")}</th>
                    <th className="w-1/2 px-7 py-4 text-emerald-400">{t("pages.fellowship.mindset.col_v6")}</th>
                  </tr>
                </thead>
                <tbody>
                  {MINDSET_ROWS.map((row) => (
                    <tr key={row} className="border-b border-border/30 last:border-b-0 transition-colors hover:bg-primary/5">
                      <td className="px-7 py-4 font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {t(`pages.fellowship.mindset.${row}_v4`)}
                      </td>
                      <td className="px-7 py-4 font-mono text-xs leading-relaxed text-foreground sm:text-sm">
                        {t(`pages.fellowship.mindset.${row}_v6`)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-7 glass-card">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-primary">
              <Lightbulb size={16} />
              {t("pages.fellowship.mindset.commits_title")}
            </h3>
            <ol className="space-y-4">
              {COMMITMENTS.map((k, idx) => (
                <li key={k} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-white">
                    {idx + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">
                    {t(`pages.fellowship.mindset.${k}`)}
                  </span>
                </li>
              ))}
            </ol>
            <blockquote className="mt-6 border-l-4 border-primary/50 pl-5 text-sm font-semibold italic text-foreground/90">
              “{t("pages.fellowship.mindset.quote")}”
            </blockquote>
          </div>
        </FadeIn>
      </Section>

      {/* ── Position Paper · Strategic Vision Essay ── */}
      <Section className="space-y-8 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.fellowship.essay.section")}</Heading>
          <Heading variant="title">{t("pages.fellowship.essay.title")}</Heading>
        </FadeIn>

        {/* Cover meta */}
        <FadeIn>
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-7 glass-card">
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  {t("pages.fellowship.essay.cover_applicant_label")}
                </p>
                <p className="mt-2 text-sm font-black tracking-tight text-foreground">
                  {t("pages.fellowship.essay.cover_applicant")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  {t("pages.fellowship.essay.cover_institution_label")}
                </p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">
                  {t("pages.fellowship.essay.cover_institution")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  {t("pages.fellowship.essay.cover_competencies_label")}
                </p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">
                  {t("pages.fellowship.essay.cover_competencies")}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Section 1 */}
        <FadeIn>
          <article className="rounded-3xl border border-border/50 bg-card/60 p-8 glass-card">
            <header className="mb-4 flex items-baseline gap-4">
              <span className="text-3xl font-black text-primary">
                {t("pages.fellowship.essay.s1_number")}
              </span>
              <h3 className="text-xl font-black tracking-tight text-foreground">
                {t("pages.fellowship.essay.s1_title")}
              </h3>
            </header>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("pages.fellowship.essay.s1_body")}
            </p>
            <div className="mt-6">
              <DiagramMindmap />
            </div>
          </article>
        </FadeIn>

        {/* Section 2 */}
        <FadeIn>
          <article className="rounded-3xl border border-border/50 bg-card/60 p-8 glass-card">
            <header className="mb-4 flex items-baseline gap-4">
              <span className="text-3xl font-black text-primary">
                {t("pages.fellowship.essay.s2_number")}
              </span>
              <h3 className="text-xl font-black tracking-tight text-foreground">
                {t("pages.fellowship.essay.s2_title")}
              </h3>
            </header>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("pages.fellowship.essay.s2_intro")}
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/40 bg-background/40 p-5">
                <h4 className="mb-2 text-sm font-black tracking-tight text-foreground">
                  {t("pages.fellowship.essay.s2_iot_title")}
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("pages.fellowship.essay.s2_iot_body")}
                </p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-background/40 p-5">
                <h4 className="mb-2 text-sm font-black tracking-tight text-foreground">
                  {t("pages.fellowship.essay.s2_5g_title")}
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("pages.fellowship.essay.s2_5g_body")}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <DiagramComparison />
            </div>
          </article>
        </FadeIn>

        {/* Section 3 */}
        <FadeIn>
          <article className="rounded-3xl border border-border/50 bg-card/60 p-8 glass-card">
            <header className="mb-4 flex items-baseline gap-4">
              <span className="text-3xl font-black text-primary">
                {t("pages.fellowship.essay.s3_number")}
              </span>
              <h3 className="text-xl font-black tracking-tight text-foreground">
                {t("pages.fellowship.essay.s3_title")}
              </h3>
            </header>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("pages.fellowship.essay.s3_body")}
            </p>
          </article>
        </FadeIn>

        {/* Section 4 */}
        <FadeIn>
          <article className="rounded-3xl border border-border/50 bg-card/60 p-8 glass-card">
            <header className="mb-4 flex items-baseline gap-4">
              <span className="text-3xl font-black text-primary">
                {t("pages.fellowship.essay.s4_number")}
              </span>
              <h3 className="text-xl font-black tracking-tight text-foreground">
                {t("pages.fellowship.essay.s4_title")}
              </h3>
            </header>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("pages.fellowship.essay.s4_intro")}
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-border/40 bg-background/40 p-5">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-black tracking-tight text-foreground">
                  <Code2 size={16} className="text-primary" />
                  {t("pages.fellowship.essay.s4_arch_title")}
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("pages.fellowship.essay.s4_arch_body")}
                </p>
                <div className="mt-5">
                  <DiagramArchitecture />
                </div>
              </div>

              <div className="rounded-2xl border border-border/40 bg-background/40 p-5">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-black tracking-tight text-foreground">
                  <Users size={16} className="text-primary" />
                  {t("pages.fellowship.essay.s4_lead_title")}
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("pages.fellowship.essay.s4_lead_body")}
                </p>
              </div>
            </div>
          </article>
        </FadeIn>

        {/* References */}
        <FadeIn>
          <div className="rounded-3xl border border-border/50 bg-card/60 p-8 glass-card">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-foreground">
              <BookOpen size={16} className="text-primary" />
              {t("pages.fellowship.essay.references_title")}
            </h3>
            <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              {ESSAY_REFS.map((k, i) => (
                <li key={k} className="flex gap-3">
                  <span className="font-mono text-xs font-bold text-primary/70">[{i + 1}]</span>
                  <span>{t(`pages.fellowship.essay.${k}`)}</span>
                </li>
              ))}
            </ol>
          </div>
        </FadeIn>
      </Section>

      {/* ── Slide 7a · What I Bring ── */}
      <Section className="space-y-8 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.fellowship.bring.section")}</Heading>
          <Heading variant="title">{t("pages.fellowship.bring.title")}</Heading>
        </FadeIn>
        <FadeIn>
          <div className="divide-y divide-border/50 rounded-3xl border border-border/50 bg-card/60 glass-card overflow-hidden">
            {WHAT_I_BRING.map(({ key }) => (
              <div key={key} className="flex flex-col gap-1 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-black tracking-tight text-foreground">{t(`pages.fellowship.bring.${key}_label`)}</span>
                <span className="text-xs font-semibold text-muted-foreground">{t(`pages.fellowship.bring.${key}_detail`)}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ── Slide 7b · Vision & CTA ── */}
      <Section className="pt-0">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-10 glass-card">
            <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

            <Badge variant="outline" className="mb-6 px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]">
              {t("pages.fellowship.cta.badge")}
            </Badge>

            <Heading variant="title" className="mb-4">
              {t("pages.fellowship.cta.vision_title")}
            </Heading>
            <p className="mb-8 max-w-3xl text-base leading-relaxed text-muted-foreground">
              {t("pages.fellowship.cta.vision_desc")}
            </p>

            <div className="mb-8 rounded-2xl border border-border/40 bg-background/40 p-6">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-foreground">
                <Folder size={16} className="text-primary" />
                {t("pages.fellowship.cta.ask_title")}
              </h4>
              <ul className="space-y-3">
                {ASKS.map((k) => (
                  <li key={k} className="flex gap-3">
                    <ArrowRight size={16} className="mt-1 shrink-0 text-primary" />
                    <span className="text-sm leading-relaxed text-foreground">
                      {t(`pages.fellowship.cta.${k}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <blockquote className="mb-8 border-l-4 border-primary/50 pl-5 text-base font-semibold italic text-foreground/90">
              “{t("pages.fellowship.cta.quote")}”
            </blockquote>

            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_hsl(var(--primary))] active:scale-95"
            >
              {t("pages.fellowship.cta.button")} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>
      </Section>

    </Container>
  );
}
