import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
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

export const metadata: Metadata = {
  title: "Portfolio | Yen Nhi",
  description: "Full engineering portfolio — projects, skills, GitHub stats, and background of Nguyen Thi Yen Nhi.",
};

export default async function PortfolioPage() {
  const allProjects = await getAllPosts("projects");
  const projects = allProjects.slice(0, 4);

  return (
    <Container className="space-y-32 pb-32">

      {/* ── Header ── */}
      <Section className="space-y-8 pt-20 text-center">
        <FadeIn className="flex flex-col items-center gap-6">
          <Badge variant="outline" className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]">
            Full Portfolio
          </Badge>
          <Heading variant="hero" as="h1">Engineering Work</Heading>
          <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
            A complete view of my projects, technical stack, GitHub activity, and background as a
            software engineering student specialising in backend systems and security.
          </p>
        </FadeIn>
      </Section>

      {/* ── GitHub Stats ── */}
      <Section className="space-y-14 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">Analytics</Heading>
          <Heading variant="title" className="text-spectrum">Engineering Intelligence Dashboard</Heading>
        </FadeIn>
        <GithubStats />
      </Section>

      {/* ── Projects ── */}
      <Section id="projects" className="space-y-16 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">Showcase</Heading>
          <Heading variant="title">Featured Engineering Projects</Heading>
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
          <Heading variant="section">Inventory</Heading>
          <Heading variant="title">Technical Stack & Mastery</Heading>
        </FadeIn>
        <SkillsVisualizer />
      </Section>

      {/* ── Mind Map ── */}
      <Section className="space-y-14 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">Network</Heading>
          <Heading variant="title">Product Mindset</Heading>
        </FadeIn>
        <AboutMindMap />
      </Section>

      {/* ── Timeline ── */}
      <Section id="resume" className="grid gap-20 pt-0 lg:grid-cols-2 lg:gap-32">
        <div className="space-y-12">
          <FadeIn className="space-y-3">
            <Heading variant="section">Credentials</Heading>
            <Heading variant="title">Education</Heading>
          </FadeIn>
          <Timeline items={EDUCATION_DATA} />
        </div>
        <div className="space-y-12">
          <FadeIn className="space-y-3">
            <Heading variant="section">Community</Heading>
            <Heading variant="title">Extra-curriculars</Heading>
          </FadeIn>
          <Timeline items={EXTRACURRICULAR_DATA} />
        </div>
      </Section>

    </Container>
  );
}
