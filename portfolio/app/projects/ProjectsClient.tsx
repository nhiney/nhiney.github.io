"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { useCV, type Project } from "@/data/cv";
import { ProjectGridCard } from "./ProjectGridCard";
import { ProjectDetailModal } from "./ProjectDetailModal";

export function ProjectsClient() {
  const { t } = useLanguage();
  const cv = useCV();
  const githubFallback = cv.contact.github.url;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeProject: Project | null =
    activeIndex !== null ? cv.projects[activeIndex] ?? null : null;

  return (
    <Container className="pb-20 space-y-10">
      <Section className="space-y-6 pt-12 text-center">
        <FadeIn className="space-y-5 flex flex-col items-center">
          <Badge
            variant="outline"
            className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]"
          >
            {t("pages.projects.hero.badge")}
          </Badge>
          <Heading variant="hero" as="h1">
            {t("pages.projects.hero.title")}
          </Heading>
          <Text variant="large" className="max-w-2xl text-muted-foreground">
            {t("pages.projects.hero.description")}
          </Text>
        </FadeIn>
      </Section>

      <Section className="pt-0">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
          {cv.projects.map((p, i) => (
            <ProjectGridCard
              key={p.title}
              project={p}
              index={i}
              delay={i * 0.06}
              flip={i % 2 === 1}
              onOpen={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </Section>

      <ProjectDetailModal
        project={activeProject}
        index={activeIndex ?? 0}
        onClose={() => setActiveIndex(null)}
        githubFallback={githubFallback}
      />
    </Container>
  );
}
