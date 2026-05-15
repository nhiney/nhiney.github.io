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
      <Section className="space-y-4 pt-8 text-center">
        <FadeIn className="space-y-3 flex flex-col items-center">
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
        <div className="mx-auto max-w-4xl">
          <div className="relative flex flex-col">

            {/* Timeline line */}
            <div className="absolute left-5 sm:left-[3.25rem] top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-primary/35 to-transparent" />

            {cv.projects.map((p, i) => (
              <div key={p.title} className="relative flex items-start gap-3 sm:gap-6">
                {/* Timeline column: dot + period */}
                <div className="relative z-10 shrink-0 flex flex-col items-center gap-2 w-10 sm:w-[6.5rem] pt-6 sm:pt-10">
                  <div className="h-4 w-4 rounded-full border-2 border-primary bg-background shadow-[0_0_0_5px_hsl(var(--primary)/0.08)]" />
                  {p.period && (
                    <p className="hidden sm:block text-center text-[10px] font-semibold leading-snug text-primary/60 whitespace-pre-wrap">
                      {p.period.replace(" – ", "\n").replace(" - ", "\n")}
                    </p>
                  )}
                </div>

                {/* Card */}
                <div className="flex-1 min-w-0 py-5">
                  <ProjectGridCard
                    project={p}
                    index={i}
                    delay={i * 0.06}
                    onOpen={() => setActiveIndex(i)}
                  />
                </div>
              </div>
            ))}
          </div>
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
