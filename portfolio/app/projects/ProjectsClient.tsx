"use client";

import Link from "next/link";
import { ArrowUpRight, AlertCircle, Lightbulb, CheckCircle2, Wrench, Calendar } from "lucide-react";
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
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.label}
    </span>
  );
}

// ─── Block within a card ──────────────────────────────────────────────────────

function CardBlock({
  icon: Icon,
  label,
  iconClass,
  children,
}: {
  icon: typeof AlertCircle;
  label: string;
  iconClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon size={13} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70">{label}</h3>
      </div>
      <div className="pl-9 text-sm leading-relaxed text-foreground/80">{children}</div>
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, githubFallback }: { project: Project; githubFallback: string }) {
  const { t } = useLanguage();
  const repoUrl = project.github ?? githubFallback;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.25)]">

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4 border-b border-border/60 p-7 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusPill status={project.status} />
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
            <Calendar size={12} /> {project.period}
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h2>
          {project.role && (
            <p className="text-sm italic text-muted-foreground">— {project.role}</p>
          )}
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="flex-1 space-y-6 p-7">

        {/* Problem */}
        <CardBlock
          icon={AlertCircle}
          label={t("pages.projects.problem_label")}
          iconClass="bg-red-500/10 text-red-500"
        >
          {project.problem}
        </CardBlock>

        {/* Approach */}
        <CardBlock
          icon={Lightbulb}
          label={t("pages.projects.approach_label")}
          iconClass="bg-amber-500/10 text-amber-500"
        >
          <ul className="space-y-1.5">
            {project.contributions.slice(0, 4).map((c, i) => (
              <li
                key={i}
                className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-amber-500/60"
              >
                {c}
              </li>
            ))}
          </ul>
        </CardBlock>

        {/* Results */}
        <CardBlock
          icon={CheckCircle2}
          label={t("pages.projects.results_label")}
          iconClass="bg-emerald-500/10 text-emerald-500"
        >
          <ul className="space-y-1.5">
            {project.results.map((r, i) => (
              <li
                key={i}
                className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-emerald-500"
              >
                {r}
              </li>
            ))}
          </ul>
        </CardBlock>

        {/* Tech */}
        <CardBlock
          icon={Wrench}
          label={t("pages.projects.tech_label")}
          iconClass="bg-violet-500/10 text-violet-500"
        >
          <div className="flex flex-wrap gap-2">
            {project.techPills.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background/40 px-3 py-1 text-[11px] font-semibold text-foreground/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardBlock>
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-border/60 p-5">
        <Link
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary transition-all hover:gap-3"
        >
          {t("pages.projects.view_repo")}
          <ArrowUpRight size={14} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
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
    <Container className="pb-24 space-y-14">
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
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {CV.projects.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.08}>
              <ProjectCard project={p} githubFallback={githubFallback} />
            </FadeIn>
          ))}
        </div>
      </Section>
    </Container>
  );
}
