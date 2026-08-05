"use client";

import Link from "next/link";
import {
  ArrowRight, Mail,
  CheckCircle2, Code2, Wrench, BarChart2, Sparkles, Layers,
  BadgeCheck, Microscope, UsersRound,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { MouseSpotlight }  from "@/components/effects/MouseSpotlight";
import { BackgroundLines } from "@/components/effects/BackgroundLines";
import { Container }       from "@/components/ui/Container";
import { useLanguage }     from "@/context/LanguageContext";
import { SITE_CONFIG }     from "@/lib/constants";
import { dictionaries }    from "@/lib/i18n/dictionaries";
import { cn }              from "@/lib/utils";
import type { Post }       from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type Stat        = { value: string; label: string };
type Trait       = { icon: string; title: string; body: string };
type SkillGroup  = { category: string; items: string[] };
type ProjectItem = { tag: string; title: string; role: string; period: string; problem: string; actions?: string[]; impact: string[] };
type TimelineKind = "leadership" | "research" | "learning";
type TimelineItem= {
  kind: TimelineKind;
  period: string;
  title: string;
  org: string;
  desc: string;
  evidence: string[];
};
type CertItem    = { emoji: string; title: string; issuer: string; date: string };

type PortfolioCopy = {
  hero: {
    status: string; headline_pre: string; headline_acc1: string;
    headline_mid: string; headline_acc2: string;
    sub_pre: string; sub_ba: string; sub_product: string; sub_ux: string; sub_end: string;
    cta_projects: string; cta_cv: string; cta_contact: string;
  };
  stats: Stat[];
  about: {
    eyebrow: string; heading_1: string; heading_2: string; heading_3: string;
    p1: string; p2: string; p3: string; tags: string[];
  };
  traits: Trait[];
  skills: { eyebrow: string; heading: string; desc: string; groups: SkillGroup[] };
  projects: {
    eyebrow: string; heading: string; desc: string; all_cta: string;
    label_problem: string; label_actions: string; label_impact: string; label_case_study: string;
    items: ProjectItem[];
  };
  experience: { eyebrow: string; heading: string; desc: string; items: TimelineItem[] };
  certifications: { eyebrow: string; heading: string; desc: string; all_cta: string; items: CertItem[] };
  contact: { eyebrow: string; heading: string; desc: string; cta: string; github: string; linkedin: string };
};

function usePortfolioCopy(): PortfolioCopy {
  const { language } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lang = (dictionaries[language] as any)?.pages?.portfolio;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const en   = (dictionaries.en as any).pages.portfolio;
  return { ...en, ...(lang ?? {}) } as PortfolioCopy;
}

// ─── Motion presets ───────────────────────────────────────────────────────────

const inView = (delay = 0) => ({
  initial:     { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

const inViewX = (delay = 0) => ({
  initial:     { opacity: 0, x: -18 },
  whileInView: { opacity: 1, x: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

// ─── Inline highlight ─────────────────────────────────────────────────────────
// Renders `**keyword**` markers in copy as emphasised spans so readers can scan
// the important terms instead of wading through full paragraphs.

function Highlight({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className="font-semibold site-heading">{part}</strong>
          : part
      )}
    </>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
      {children}
    </span>
  );
}

// ─── Skill group icon map (not translatable) ──────────────────────────────────

const SKILL_ICONS = [BarChart2, Layers, Code2, Wrench] as const;
const SKILL_STYLES = [
  { wrapperCls: "from-primary/10 to-secondary/35 border-primary/20", iconCls: "text-primary" },
  { wrapperCls: "from-primary/10 to-secondary/35 border-primary/20", iconCls: "text-primary" },
  { wrapperCls: "from-primary/10 to-secondary/35 border-primary/20", iconCls: "text-primary" },
  { wrapperCls: "from-primary/10 to-secondary/35 border-primary/20", iconCls: "text-primary" },
] as const;

// GitHub repo per featured project (same order as projects.items).
// Empty string → the project has no public repo, so the link is hidden.
const PROJECT_REPOS = [
  "https://github.com/nhiney/smart-clinic-booking-app", // Smart Medical Booking App
  "https://github.com/nhiney/web-programing",           // E-Commerce Shoe Shop System
  "https://github.com/nhiney/english-app",              // English Vocabulary Learning App
] as const;

const PROJECT_TAG_CLS = [
  "text-primary bg-primary/10 border-primary/20",
  "text-primary bg-primary/10 border-primary/20",
  "text-primary bg-primary/10 border-primary/20",
] as const;

const PROJECT_STRIPE = [
  "from-primary/60 via-primary/20 to-transparent",
  "from-primary/60 via-primary/20 to-transparent",
  "from-primary/60 via-primary/20 to-transparent",
] as const;

const PROJECT_NUM_CLS = [
  "text-primary/10",
  "text-primary/10",
  "text-primary/10",
] as const;

const CERT_CLS = [
  "border-border/60 bg-card/45 hover:border-primary/30 hover:bg-card/70",
  "border-border/60 bg-card/45 hover:border-primary/30 hover:bg-card/70",
  "border-border/60 bg-card/45 hover:border-primary/30 hover:bg-card/70",
  "border-border/60 bg-card/45 hover:border-primary/30 hover:bg-card/70",
] as const;

const EXPERIENCE_ICONS = {
  leadership: UsersRound,
  research: Microscope,
  learning: BadgeCheck,
} as const;

const EXPERIENCE_ACCENTS = {
  leadership: {
    node: "border-blue-200/80 bg-blue-50 text-blue-600 shadow-blue-500/10 dark:border-blue-300/20 dark:bg-blue-400/10 dark:text-blue-200",
    date: "border-blue-200/70 bg-blue-50/70 text-blue-700 dark:border-blue-300/15 dark:bg-blue-400/[0.06] dark:text-blue-100",
    evidence: "text-blue-700/80 dark:text-blue-100/80",
  },
  research: {
    node: "border-cyan-200/80 bg-cyan-50 text-cyan-700 shadow-cyan-500/10 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-200",
    date: "border-cyan-200/70 bg-cyan-50/70 text-cyan-700 dark:border-cyan-300/15 dark:bg-cyan-400/[0.06] dark:text-cyan-100",
    evidence: "text-cyan-700/80 dark:text-cyan-100/80",
  },
  learning: {
    node: "border-violet-200/80 bg-violet-50 text-violet-700 shadow-violet-500/10 dark:border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-200",
    date: "border-violet-200/70 bg-violet-50/70 text-violet-700 dark:border-violet-300/15 dark:bg-violet-400/[0.06] dark:text-violet-100",
    evidence: "text-violet-700/80 dark:text-violet-100/80",
  },
} as const;

// ─── Root ─────────────────────────────────────────────────────────────────────

export function PortfolioClient(_props: { projects: Post[]; hideHero?: boolean; hideCerts?: boolean }) {
  const copy = usePortfolioCopy();

  return (
    <>
      {!_props.hideHero && <HeroSection copy={copy} />}
      <AboutSection copy={copy} />
      <SkillsSection copy={copy} />
      <ProjectsSection copy={copy} />
      <ExperienceSection copy={copy} />
      {!_props.hideCerts && <CertificationsSection copy={copy} />}
      <ContactSection copy={copy} />
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ copy }: { copy: PortfolioCopy }) {
  const { hero } = copy;
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <BackgroundLines className="h-full w-full [&_svg]:opacity-[0.07]">
          <span />
        </BackgroundLines>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.09),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <MouseSpotlight />

      <Container className="relative z-10 flex flex-col items-center gap-6 pt-14 pb-14 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-5xl text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl md:leading-[1.16]"
        >
          {hero.headline_pre}{" "}
          <span className="site-accent-gradient">{hero.headline_acc1}</span>
          {" "}{hero.headline_mid}{" "}
          <span className="site-accent-gradient">{hero.headline_acc2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          <Highlight text={hero.sub_pre} />
          {hero.sub_ba && (
            <>{" "}<span className="font-semibold site-heading">{hero.sub_ba}</span>,{" "}
            <span className="font-semibold site-heading">{hero.sub_product}</span>,{" "}
            <span className="font-semibold site-heading">{hero.sub_ux}</span>.{" "}</>
          )}
          {hero.sub_end}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.33 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <a
            href="#projects"
            data-analytics-event="portfolio_cta_clicked"
            data-analytics-label="projects"
          >
            <button className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-[0_0_32px_-8px_hsl(var(--primary))] active:scale-95">
              {hero.cta_projects} <ArrowRight className="h-4 w-4" />
            </button>
          </a>
          <Link
            href={`mailto:${SITE_CONFIG.links.email}`}
            data-analytics-event="portfolio_cta_clicked"
            data-analytics-label="email"
          >
            <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 backdrop-blur-sm px-7 py-3 text-sm font-semibold transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95">
              <Mail className="h-4 w-4" />
              {hero.cta_contact}
            </button>
          </Link>
        </motion.div>

      </Container>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSection({ copy }: { copy: PortfolioCopy }) {
  const { about, traits } = copy;
  return (
    <section className="py-16 border-t border-border/40">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">

          <motion.div {...inView()} className="space-y-6">
            <SectionEyebrow>{about.eyebrow}</SectionEyebrow>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              {about.heading_1} <span className="site-accent-gradient">{about.heading_2}</span> {about.heading_3}
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              <p><Highlight text={about.p1} /></p>
              <p><Highlight text={about.p2} /></p>
              <p><Highlight text={about.p3} /></p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {about.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border/60 bg-card/40 px-4 py-1.5 text-xs font-semibold text-foreground/80">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {traits.map((trait, i) => (
              <motion.div
                key={trait.title}
                {...inView(i * 0.08)}
                className="rounded-2xl border border-border/50 bg-card/40 p-5 space-y-2.5 hover:border-primary/30 hover:bg-card/70 transition-all group cursor-default"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/70 text-xl leading-none transition-transform group-hover:scale-110">
                  {trait.icon}
                </span>
                <h3 className="text-sm font-semibold text-foreground">{trait.title}</h3>
                <p className="text-xs leading-relaxed">{trait.body}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function SkillsSection({ copy }: { copy: PortfolioCopy }) {
  const { skills } = copy;
  return (
    <section className="py-16 bg-secondary/20 border-t border-border/40">
      <Container className="space-y-12">

        <motion.div {...inView()} className="space-y-3">
          <SectionEyebrow>{skills.eyebrow}</SectionEyebrow>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{skills.heading}</h2>
          <p className="max-w-xl text-[15px] leading-relaxed">{skills.desc}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {skills.groups.map((group, i) => {
            const Icon = SKILL_ICONS[i];
            const style = SKILL_STYLES[i];
            return (
              <motion.div
                key={group.category}
                {...inView(i * 0.07)}
                className={cn("rounded-2xl border bg-gradient-to-br p-6 space-y-4 hover:scale-[1.01] transition-all", style.wrapperCls)}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-5 w-5", style.iconCls)} />
                  <h3 className="font-semibold text-foreground">{group.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full bg-background/60 border border-border/50 px-3 py-1 text-xs font-medium text-foreground/80 hover:border-primary/30 transition-colors">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </Container>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsSection({ copy }: { copy: PortfolioCopy }) {
  const { projects } = copy;
  return (
    <section id="projects" className="py-16 border-t border-border/40">
      <Container className="space-y-12">

        <motion.div {...inView()} className="flex items-end justify-between gap-4">
          <div className="space-y-3">
            <SectionEyebrow>{projects.eyebrow}</SectionEyebrow>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{projects.heading}</h2>
            <p className="max-w-xl text-[15px] leading-relaxed">{projects.desc}</p>
          </div>
          <Link href="/projects" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0">
            {projects.all_cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="space-y-5">
          {projects.items.map((project, i) => (
            <motion.article
              key={project.title}
              {...inView(i * 0.07)}
              className="group rounded-2xl border border-border/50 bg-card/40 hover:border-primary/20 transition-colors overflow-hidden"
            >
              {/* Accent stripe */}
              <div className={cn("h-[2px] w-full bg-gradient-to-r", PROJECT_STRIPE[i])} />

              <div className="p-6 sm:p-8 space-y-5">
                {/* Title + meta + CTA */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <span className={cn("text-5xl font-black tabular-nums leading-none select-none shrink-0 mt-0.5", PROJECT_NUM_CLS[i])}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-medium", PROJECT_TAG_CLS[i])}>
                          {project.tag}
                        </span>
                        <span className="text-xs text-muted-foreground">{project.period}</span>
                        <span className="hidden sm:inline text-xs text-muted-foreground">· {project.role}</span>
                      </div>
                    </div>
                  </div>
                  {PROJECT_REPOS[i] && (
                    <a
                      href={PROJECT_REPOS[i]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0 pt-1"
                    >
                      {projects.label_case_study} <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-border/40" />

                {/* 3-column: Problem · What I did · Results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground/40">{projects.label_problem}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground"><Highlight text={project.problem} /></p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground/40">{projects.label_actions}</p>
                    <ul className="space-y-1.5">
                      {(project.actions ?? []).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-foreground/75">
                          <span className="mt-[7px] h-1 w-1 rounded-full bg-muted-foreground/40 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground/40">{projects.label_impact}</p>
                    <ul className="space-y-1.5">
                      {project.impact.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-foreground/75">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mobile CTA */}
                {PROJECT_REPOS[i] && (
                  <div className="sm:hidden pt-1">
                    <a
                      href={PROJECT_REPOS[i]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      {projects.label_case_study} <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div {...inView()} className="sm:hidden text-center">
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            {projects.all_cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

      </Container>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function ExperienceSection({ copy }: { copy: PortfolioCopy }) {
  const { experience } = copy;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative overflow-hidden border-t border-border/40 bg-[linear-gradient(180deg,hsl(var(--secondary)/0.2),hsl(var(--background))_42%)] py-12 sm:py-14"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-0 h-52 w-52 rounded-full bg-primary/[0.055] blur-3xl" />
      <Container className="relative space-y-8 px-4 sm:space-y-10 sm:px-6 md:px-10">

        <motion.div {...(shouldReduceMotion ? {} : inView())} className="max-w-3xl space-y-3">
          <div className="space-y-3">
            <SectionEyebrow>{experience.eyebrow}</SectionEyebrow>
            <h2 id="experience-heading" className="text-xl font-semibold leading-tight tracking-tight site-heading sm:text-2xl">
              {experience.heading}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 site-body">
            {experience.desc}
          </p>
        </motion.div>

        <div className="relative max-w-5xl">
          <ol className="space-y-3 sm:space-y-4">
            {experience.items.map((item, i) => {
              const accent = EXPERIENCE_ACCENTS[item.kind];
              const Icon = EXPERIENCE_ICONS[item.kind];
              const itemHeadingId = `experience-item-${i + 1}`;

              return (
                <motion.li
                  key={item.title}
                  {...(shouldReduceMotion ? {} : inViewX(i * 0.08))}
                  className="relative pl-11 sm:pl-12"
                >
                  {i < experience.items.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-7 left-4 top-4 w-px bg-gradient-to-b from-primary/25 via-primary/30 to-primary/15 sm:-bottom-8"
                    />
                  )}
                  <div className={cn(
                    "absolute left-0 top-4 z-10 grid h-8 w-8 place-items-center rounded-xl border bg-background shadow-[0_7px_18px_-10px_currentColor] ring-4 ring-background",
                    accent.node,
                  )} aria-hidden="true">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" focusable="false" strokeWidth={1.9} />
                  </div>

                  <article
                    className="rounded-2xl border border-border/55 bg-card/65 p-3.5 shadow-[0_14px_38px_-34px_hsl(var(--foreground)/0.42)] backdrop-blur-sm sm:p-5"
                    aria-labelledby={itemHeadingId}
                  >
                    <div className="grid gap-3 sm:grid-cols-[8.75rem_minmax(0,1fr)] sm:gap-5">
                      <div className="space-y-1.5">
                        <span className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold tabular-nums",
                          accent.date,
                        )}>
                          {item.period}
                        </span>
                        <p className="max-w-[9rem] text-xs font-medium leading-4 site-soft">{item.org}</p>
                      </div>

                      <div className="min-w-0">
                        <h3
                          id={itemHeadingId}
                          className="text-base font-semibold leading-snug tracking-tight site-heading sm:text-lg"
                        >
                          {item.title}
                        </h3>
                        <p className="mt-1.5 max-w-3xl text-sm leading-6 site-body">
                          {item.desc}
                        </p>
                        <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5">
                          {item.evidence.map((evidence) => (
                            <li
                              key={evidence}
                              className={cn(
                                "border-l border-border/70 pl-3 text-[11px] font-semibold leading-4 first:border-l-0 first:pl-0",
                                accent.evidence,
                              )}
                            >
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </ol>
        </div>

      </Container>
    </section>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────

function CertificationsSection({ copy }: { copy: PortfolioCopy }) {
  const { certifications } = copy;
  return (
    <section className="py-16 border-t border-border/40">
      <Container className="space-y-12">

        <motion.div {...inView()} className="flex items-end justify-between gap-4">
          <div className="space-y-3">
            <SectionEyebrow>{certifications.eyebrow}</SectionEyebrow>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{certifications.heading}</h2>
            <p className="max-w-xl text-[15px] leading-relaxed">{certifications.desc}</p>
          </div>
          <Link href="/certificates" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0">
            {certifications.all_cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.items.map((cert, i) => (
            <motion.div
              key={cert.title}
              {...inView(i * 0.07)}
              className={cn("rounded-2xl border p-5 space-y-3 hover:scale-[1.02] transition-all cursor-default group", CERT_CLS[i])}
            >
              <span className="text-2xl leading-none group-hover:scale-110 inline-block transition-transform">{cert.emoji}</span>
              <div>
                <h3 className="text-sm font-semibold text-foreground leading-snug">{cert.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
              </div>
              <span className="inline-block rounded-full bg-background/60 border border-border/50 px-2.5 py-1 text-[10px] font-semibold">
                {cert.date}
              </span>
            </motion.div>
          ))}
        </div>

      </Container>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection({ copy }: { copy: PortfolioCopy }) {
  const { contact } = copy;
  return (
    <section className="py-16 border-t border-border/40 bg-secondary/20">
      <Container>
        <motion.div {...inView()} className="mx-auto max-w-2xl text-center space-y-8">

          <div className="space-y-5">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <SectionEyebrow>{contact.eyebrow}</SectionEyebrow>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{contact.heading}</h2>
            <p className="text-[15px] leading-relaxed max-w-lg mx-auto">{contact.desc}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`mailto:${SITE_CONFIG.links.email}`}
              data-analytics-event="contact_channel_clicked"
              data-analytics-label="email"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-95"
            >
              <Mail className="h-4 w-4" />
              {contact.cta}
            </Link>
            <Link
              href={SITE_CONFIG.links.github}
              data-analytics-event="contact_channel_clicked"
              data-analytics-label="github"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-7 py-3 text-sm font-semibold transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
            >
              {contact.github}
            </Link>
            <Link
              href={SITE_CONFIG.links.linkedin}
              data-analytics-event="contact_channel_clicked"
              data-analytics-label="linkedin"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-7 py-3 text-sm font-semibold transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
            >
              {contact.linkedin}
            </Link>
          </div>

          <p className="text-xs text-muted-foreground pt-2">{SITE_CONFIG.links.email}</p>

        </motion.div>
      </Container>
    </section>
  );
}
