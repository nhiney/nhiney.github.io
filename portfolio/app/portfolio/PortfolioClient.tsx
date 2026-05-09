"use client";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { ProjectProductCard } from "@/components/ui/ProjectProductCard";
import { SkillsVisualizer } from "@/components/ui/SkillsVisualizer";
import { GithubStats } from "@/components/ui/GithubStats";
import { AboutMindMap } from "@/components/ui/AboutMindMap";
import { Timeline } from "@/components/ui/Timeline";
import { EDUCATION_DATA, EXTRACURRICULAR_DATA } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import type { Post } from "@/types";

export function PortfolioClient({ projects }: { projects: Post[] }) {
  const { t } = useLanguage();

  return (
    <Container className="space-y-32 pb-32">

      {/* ── Header ── */}
      <Section className="space-y-8 pt-20 text-center">
        <FadeIn className="flex flex-col items-center gap-6">
          <Badge variant="outline" className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]">
            {t("pages.portfolio.hero.badge")}
          </Badge>
          <Heading variant="hero" as="h1">{t("pages.portfolio.hero.title")}</Heading>
          <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
            {t("pages.portfolio.hero.description")}
          </p>
        </FadeIn>
      </Section>

      {/* ── GitHub Stats ── */}
      <Section className="space-y-14 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.portfolio.analytics_section")}</Heading>
          <Heading variant="title" className="text-spectrum">{t("pages.portfolio.analytics_title")}</Heading>
        </FadeIn>
        <GithubStats />
      </Section>

      {/* ── Projects ── */}
      <Section id="projects" className="space-y-16 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.portfolio.projects_section")}</Heading>
          <Heading variant="title">{t("pages.portfolio.projects_title")}</Heading>
        </FadeIn>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectProductCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>

      {/* ── Skills ── */}
      <Section className="space-y-14 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.portfolio.skills_section")}</Heading>
          <Heading variant="title">{t("pages.portfolio.skills_title")}</Heading>
        </FadeIn>
        <SkillsVisualizer />
      </Section>

      {/* ── Mind Map ── */}
      <Section className="space-y-14 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.portfolio.mindmap_section")}</Heading>
          <Heading variant="title">{t("pages.portfolio.mindmap_title")}</Heading>
        </FadeIn>
        <AboutMindMap />
      </Section>

      {/* ── Timeline ── */}
      <Section id="resume" className="grid gap-20 pt-0 lg:grid-cols-2 lg:gap-32">
        <div className="space-y-12">
          <FadeIn className="space-y-3">
            <Heading variant="section">{t("pages.portfolio.education_section")}</Heading>
            <Heading variant="title">{t("pages.portfolio.education_title")}</Heading>
          </FadeIn>
          <Timeline items={EDUCATION_DATA} />
        </div>
        <div className="space-y-12">
          <FadeIn className="space-y-3">
            <Heading variant="section">{t("pages.portfolio.extra_section")}</Heading>
            <Heading variant="title">{t("pages.portfolio.extra_title")}</Heading>
          </FadeIn>
          <Timeline items={EXTRACURRICULAR_DATA} />
        </div>
      </Section>

    </Container>
  );
}
