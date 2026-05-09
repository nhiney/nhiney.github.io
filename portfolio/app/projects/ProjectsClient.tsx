"use client";

import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { CV, type Project } from "@/data/cv";

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: Project["status"] }) {
  const tone = {
    shipped:  "bg-emerald-500/10  border-emerald-500/30 text-emerald-500",
    duration: "bg-blue-500/10     border-blue-500/30    text-blue-500",
    ongoing:  "bg-amber-500/10    border-amber-500/30   text-amber-500",
  }[status.tone];

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-widest ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.label}
    </span>
  );
}

// ─── Section block (label + body) ─────────────────────────────────────────────

function Block({
  label,
  accent,
  children,
}: {
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className={`h-px w-6 ${accent}`} />
        <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-foreground/60">{label}</h3>
      </div>
      <div className="text-[15px] leading-7 text-foreground/85">{children}</div>
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index, githubFallback }: { project: Project; index: number; githubFallback: string }) {
  const { t } = useLanguage();
  const repoUrl = project.github ?? githubFallback;

  return (
    <article className="relative overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.18)]">

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="space-y-5 p-8 sm:p-12 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <StatusPill status={project.status} />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Calendar size={13} /> {project.period}
          </span>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {project.title}
          </h2>
          {project.role && (
            <p className="text-base text-muted-foreground">— {project.role}</p>
          )}
        </div>
      </header>

      {/* Soft divider */}
      <div className="mx-8 sm:mx-12 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="p-8 sm:p-12 pt-10 space-y-10">

        <Block label={t("pages.projects.problem_label")} accent="bg-red-500/70">
          {project.problem}
        </Block>

        <Block label={t("pages.projects.approach_label")} accent="bg-amber-500/70">
          <ul className="space-y-2.5">
            {project.contributions.slice(0, 4).map((c, i) => (
              <li
                key={i}
                className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-500/70"
              >
                {c}
              </li>
            ))}
          </ul>
        </Block>

        <Block label={t("pages.projects.results_label")} accent="bg-emerald-500/70">
          <ul className="space-y-2.5">
            {project.results.map((r, i) => (
              <li
                key={i}
                className="relative pl-6 before:absolute before:left-0 before:top-[0.6em] before:h-2 before:w-2 before:rounded-full before:bg-emerald-500"
              >
                {r}
              </li>
            ))}
          </ul>
        </Block>

        <Block label={t("pages.projects.tech_label")} accent="bg-violet-500/70">
          <div className="flex flex-wrap gap-2">
            {project.techPills.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-[12px] font-semibold text-foreground/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </Block>
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="flex justify-end border-t border-border/60 px-8 sm:px-12 py-5">
        <Link
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest text-primary transition-all hover:bg-primary/5"
        >
          {t("pages.projects.view_repo")}
          <ArrowUpRight size={15} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </Link>
      </footer>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProjectsClient() {
  const { t } = useLanguage();
  const githubFallback = CV.contact.github.url;

  return (
    <Container className="pb-24 space-y-12">
      <Section className="space-y-6 pt-16 text-center">
        <FadeIn className="space-y-5 flex flex-col items-center">
          <Badge variant="outline" className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]">
            {t("pages.projects.hero.badge")}
          </Badge>
          <Heading variant="hero" as="h1">{t("pages.projects.hero.title")}</Heading>
          <Text variant="large" className="max-w-2xl text-muted-foreground">
            {t("pages.projects.hero.description")}
          </Text>
        </FadeIn>
      </Section>

      <Section className="pt-0">
        {/* One project per row, centered, generous max-width — no more 3-up cramming */}
        <div className="mx-auto max-w-[1100px] space-y-10">
          {CV.projects.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.08}>
              <ProjectCard project={p} index={i} githubFallback={githubFallback} />
            </FadeIn>
          ))}
        </div>
      </Section>
    </Container>
  );
}
