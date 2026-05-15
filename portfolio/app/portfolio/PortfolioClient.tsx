"use client";

import Link from "next/link";
import {
  ArrowRight, Mail, Download, ExternalLink,
  CheckCircle2, Code2, Wrench, BarChart2, Sparkles, Layers,
} from "lucide-react";
import { motion } from "framer-motion";

import { MouseSpotlight }  from "@/components/effects/MouseSpotlight";
import { BackgroundLines } from "@/components/effects/BackgroundLines";
import { Container }       from "@/components/ui/Container";
import { useLanguage }     from "@/context/LanguageContext";
import { SITE_CONFIG }     from "@/lib/constants";
import { cn }              from "@/lib/utils";
import type { Post }       from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type Stat        = { value: string; label: string };
type Trait       = { icon: string; title: string; body: string };
type SkillGroup  = { category: string; items: string[] };
type ProjectItem = { tag: string; title: string; role: string; period: string; problem: string; actions?: string[]; impact: string[] };
type TimelineItem= { period: string; title: string; org: string; desc: string };
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
  const lang = (require("@/lib/i18n/dictionaries").dictionaries[language] as any)?.pages?.portfolio;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const en   = (require("@/lib/i18n/dictionaries").dictionaries.en as any).pages.portfolio;
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

// ─── Skill group icon map (not translatable) ──────────────────────────────────

const SKILL_ICONS = [BarChart2, Layers, Code2, Wrench] as const;
const SKILL_STYLES = [
  { wrapperCls: "from-blue-500/10 to-blue-500/5 border-blue-500/20",   iconCls: "text-blue-500"   },
  { wrapperCls: "from-violet-500/10 to-violet-500/5 border-violet-500/20", iconCls: "text-violet-500" },
  { wrapperCls: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20", iconCls: "text-emerald-500" },
  { wrapperCls: "from-amber-500/10 to-amber-500/5 border-amber-500/20", iconCls: "text-amber-500"  },
] as const;

const PROJECT_HREFS = [
  "/projects/smart-medical-booking-app",
  "/projects/database-security-system",
  "/projects/english-learning-app",
] as const;

const PROJECT_TAG_CLS = [
  "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "text-amber-400 bg-amber-400/10 border-amber-400/20",
] as const;

const PROJECT_STRIPE = [
  "from-blue-500/60 via-blue-400/20 to-transparent",
  "from-emerald-500/60 via-emerald-400/20 to-transparent",
  "from-amber-500/60 via-amber-400/20 to-transparent",
] as const;

const PROJECT_NUM_CLS = [
  "text-blue-500/10",
  "text-emerald-500/10",
  "text-amber-500/10",
] as const;

const CERT_CLS = [
  "border-blue-500/30 bg-blue-500/5",
  "border-violet-500/30 bg-violet-500/5",
  "border-emerald-500/30 bg-emerald-500/5",
  "border-amber-500/30 bg-amber-500/5",
] as const;

// ─── Root ─────────────────────────────────────────────────────────────────────

export function PortfolioClient(_props: { projects: Post[] }) {
  const copy = usePortfolioCopy();

  return (
    <>
      <HeroSection copy={copy} />
      <AboutSection copy={copy} />
      <SkillsSection copy={copy} />
      <ProjectsSection copy={copy} />
      <ExperienceSection copy={copy} />
      <CertificationsSection copy={copy} />
      <ContactSection copy={copy} />
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ copy }: { copy: PortfolioCopy }) {
  const { hero, stats } = copy;
  return (
    <section className="relative flex items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <BackgroundLines className="h-full w-full [&_svg]:opacity-[0.07]">
          <span />
        </BackgroundLines>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.09),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <MouseSpotlight />

      <Container className="relative z-10 flex flex-col items-center text-center gap-5 pt-10 pb-14">

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          {hero.status}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl text-[1.75rem] font-bold tracking-tight leading-[1.12] sm:text-3xl md:text-[2.25rem]"
        >
          {hero.headline_pre}{" "}
          <span className="text-primary">{hero.headline_acc1}</span>
          {" "}{hero.headline_mid}{" "}
          <span className="text-primary">{hero.headline_acc2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="max-w-2xl text-base sm:text-lg leading-relaxed"
        >
          {hero.sub_pre}
          {hero.sub_ba && (
            <>{" "}<span className="font-semibold text-foreground">{hero.sub_ba}</span>,{" "}
            <span className="font-semibold text-foreground">{hero.sub_product}</span>,{" "}
            <span className="font-semibold text-foreground">{hero.sub_ux}</span>.{" "}</>
          )}
          {hero.sub_end}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.33 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link href="/projects">
            <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-full px-7 py-3 text-sm font-semibold transition-all hover:shadow-[0_0_32px_-8px_hsl(var(--primary))] hover:scale-[1.02] active:scale-95">
              {hero.cta_projects} <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href="/resume">
            <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 backdrop-blur-sm px-7 py-3 text-sm font-semibold transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95">
              <Download className="h-4 w-4" />
              {hero.cta_cv}
            </button>
          </Link>
          <Link href={`mailto:${SITE_CONFIG.links.email}`}>
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
            <span className="inline-block text-[11px] italic font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-sm">{about.eyebrow}</span>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight leading-snug">
              {about.heading_1} {about.heading_2} {about.heading_3}
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed">
              <p>{about.p1}</p>
              <p>{about.p2}</p>
              <p>{about.p3}</p>
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
                <span className="text-2xl leading-none group-hover:scale-110 inline-block transition-transform">{trait.icon}</span>
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
          <span className="inline-block text-[11px] italic font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-sm">{skills.eyebrow}</span>
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
            <span className="inline-block text-[11px] italic font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-sm">{projects.eyebrow}</span>
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
                  <Link
                    href={PROJECT_HREFS[i] ?? "/projects"}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0 pt-1"
                  >
                    {projects.label_case_study} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/40" />

                {/* 3-column: Problem · What I did · Results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground/40">{projects.label_problem}</p>
                    <p className="text-sm leading-relaxed text-foreground/75">{project.problem}</p>
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
                <div className="sm:hidden pt-1">
                  <Link href={PROJECT_HREFS[i] ?? "/projects"} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                    {projects.label_case_study} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
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
  return (
    <section className="py-16 bg-secondary/20 border-t border-border/40">
      <Container className="space-y-12">

        <motion.div {...inView()} className="space-y-3">
          <span className="inline-block text-[11px] italic font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-sm">{experience.eyebrow}</span>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{experience.heading}</h2>
          <p className="max-w-xl text-[15px] leading-relaxed">{experience.desc}</p>
        </motion.div>

        <div className="relative pl-7 sm:pl-10">
          <div className="absolute left-[10px] sm:left-[13px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-border/40 to-transparent" />
          <div className="space-y-5">
            {experience.items.map((item, i) => (
              <motion.div key={item.title} {...inViewX(i * 0.06)} className="relative">
                <div className="absolute -left-[22px] sm:-left-[25px] top-[18px] h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />
                <div className="rounded-2xl border border-border/50 bg-card/40 p-5 sm:p-6 hover:border-primary/30 hover:bg-card/60 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                    <span className="text-xs font-semibold text-primary tabular-nums">{item.period}</span>
                    <span className="hidden sm:block w-px h-3 bg-border/60" />
                    <span className="text-xs text-muted-foreground">{item.org}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">{item.title}</h3>
                  <p className="text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
            <span className="inline-block text-[11px] italic font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-sm">{certifications.eyebrow}</span>
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
              <span className="inline-block text-[11px] italic font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-sm">{contact.eyebrow}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{contact.heading}</h2>
            <p className="text-[15px] leading-relaxed max-w-lg mx-auto">{contact.desc}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`mailto:${SITE_CONFIG.links.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-95"
            >
              <Mail className="h-4 w-4" />
              {contact.cta}
            </Link>
            <Link
              href={SITE_CONFIG.links.github}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-7 py-3 text-sm font-semibold transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
            >
              {contact.github}
            </Link>
            <Link
              href={SITE_CONFIG.links.linkedin}
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
