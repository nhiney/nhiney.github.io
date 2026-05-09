"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, GitCommit, Package, Code2, Shield, Terminal, Layers } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Timeline } from "@/components/ui/Timeline";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { AboutMindMap } from "@/components/ui/AboutMindMap";
import { ProjectProductCard } from "@/components/ui/ProjectProductCard";
import { SkillsVisualizer } from "@/components/ui/SkillsVisualizer";
import { GithubStats } from "@/components/ui/GithubStats";
import { QuestionSection } from "@/components/ui/QuestionSection";
import { AnimatedScrollMouse } from "@/components/ui/AnimatedScrollMouse";
import { CursorTrailCanvas } from "@/components/ui/CursorTrailCanvas";
import { GithubIcon, LinkedinIcon, FacebookIcon, MailIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { EDUCATION_DATA, EXTRACURRICULAR_DATA, SITE_CONFIG } from "@/lib/constants";
import { Post } from "@/types";

// ─── Reusable glow-on-hover card wrapper ─────────────────────────────────────

function GlowCard({
  children,
  className,
  animateY = -6,
}: {
  children: React.ReactNode;
  className?: string;
  animateY?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: animateY }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Mouse-following glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle at ${mouse.x}px ${mouse.y}px, hsl(var(--primary) / 0.10) 0%, transparent 65%)`,
          boxShadow: hovered ? "0 0 0 1px hsl(var(--primary) / 0.25)" : "none",
        }}
      />
      {children}
    </motion.div>
  );
}

// ─── Hero right-column stat card ─────────────────────────────────────────────

function StatCard({
  icon: Icon,
  value,
  label,
  className,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <GlowCard className={cn("rounded-2xl border border-border/50 bg-card/60 p-6 glass-card", className)} animateY={-4}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <Icon size={18} className="text-primary" />
      </div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
    </GlowCard>
  );
}

// ─── Saasfly-style feature card ───────────────────────────────────────────────

function FeatureCard({
  icon: Icon,
  iconBg,
  title,
  description,
  tags,
}: {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  description: string;
  tags: string[];
}) {
  return (
    <GlowCard className="flex-1 rounded-3xl border border-border/50 bg-card/60 p-8 glass-card">
      <div className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-full", iconBg)}>
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="mb-2 text-lg font-black tracking-tight">{title}</h3>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-primary/10 border border-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary"
          >
            {tag}
          </span>
        ))}
      </div>
    </GlowCard>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────

export function HomeClient({ projects }: { projects: Post[] }) {
  const { t } = useLanguage();

  const socials = [
    { href: SITE_CONFIG.links.github, Icon: GithubIcon },
    { href: SITE_CONFIG.links.linkedin, Icon: LinkedinIcon },
    { href: SITE_CONFIG.links.facebook, Icon: FacebookIcon },
    { href: `mailto:${SITE_CONFIG.links.email}`, Icon: MailIcon },
  ];

  return (
    <>
      {/* Physics cursor trail — fixed full-screen canvas */}
      <CursorTrailCanvas className="pointer-events-none fixed inset-0 z-50 h-full w-full" />

      <Container className="space-y-32 pb-32">

        {/* ══════════════════════════════════════════════
            HERO — 2-col layout (saasfly style)
        ══════════════════════════════════════════════ */}
        <Section
          id="about"
          className="relative flex min-h-[95vh] flex-col items-center justify-center py-0"
        >
          {/* Background grid + radial glow */}
          <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,white,transparent)] opacity-20" />
          <div className="absolute left-1/2 top-1/3 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[80px]" />

          <div className="relative z-10 grid w-full items-center gap-12 xl:grid-cols-[1fr_420px]">

            {/* LEFT: text content */}
            <FadeIn className="flex flex-col items-center gap-8 text-center xl:items-start xl:text-left">
              <Badge
                variant="outline"
                className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-black tracking-[0.3em] uppercase text-[10px]"
              >
                {t("hero.welcome")}
              </Badge>

              <div className="space-y-4">
                <motion.h1
                  initial={{ filter: "blur(12px)", opacity: 0, y: 20 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-6xl font-black tracking-tighter text-spectrum leading-none md:text-7xl xl:text-8xl"
                >
                  {SITE_CONFIG.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground"
                >
                  <span className="text-primary">{t("hero.role_backend")}</span>
                  {" · "}
                  <span>{t("hero.role_fullstack")}</span>
                  {" · "}
                  <span>Security Enthusiast</span>
                </motion.p>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-lg text-base leading-relaxed text-muted-foreground"
              >
                {t("hero.description")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap justify-center gap-4 xl:justify-start"
              >
                <Link
                  href="#contact"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_hsl(var(--primary))] active:scale-95"
                >
                  {t("hero.cta_primary")}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#resume"
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 px-8 py-4 text-sm font-black uppercase tracking-widest transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
                >
                  {t("hero.cta_secondary")}
                </Link>
              </motion.div>

              {/* Social icons with spring hover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="flex items-center gap-8"
              >
                {socials.map(({ href, Icon }) => (
                  <motion.div
                    key={href}
                    whileHover={{ y: -4, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Link
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Icon size={22} />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </FadeIn>

            {/* RIGHT: bento stat cards — xl only (saasfly rightside-marketing) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
              className="hidden xl:grid grid-cols-2 gap-4"
            >
              <StatCard icon={Clock} value="442+" label="Coding Hours" className="col-span-2" />
              <StatCard icon={GitCommit} value="186+" label="Contributions" />
              <StatCard icon={Package} value="8+" label="Repositories" />

              {/* Tech stack pill card */}
              <GlowCard className="col-span-2 rounded-2xl border border-border/50 bg-card/60 p-6 glass-card" animateY={-3}>
                <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Core Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Dart", "Laravel", "Python", "Flutter", "ASP.NET", "Oracle DB", "Firebase", "Node.js"].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          </div>

          <AnimatedScrollMouse />
        </Section>

        {/* ══════════════════════════════════════════════
            CAPABILITIES — saasfly 4-card feature grid
        ══════════════════════════════════════════════ */}
        <Section className="space-y-16">
          <FadeIn className="space-y-3 text-center">
            <Heading variant="section">Capabilities</Heading>
            <Heading variant="title">What I bring to the table</Heading>
          </FadeIn>
          <FadeIn>
            <div className="flex flex-col gap-5 xl:flex-row">
              <FeatureCard
                icon={Code2}
                iconBg="bg-blue-600"
                title="Languages & Core"
                description="Versatile across multiple paradigms — mobile, scripting, systems, and database programming."
                tags={["Dart", "C#", "PHP", "Python", "PL/SQL", "JavaScript"]}
              />
              <FeatureCard
                icon={Layers}
                iconBg="bg-violet-600"
                title="Backend & Mobile"
                description="Full-stack capable with a backend-first mindset. Fluent in Laravel, ASP.NET MVC, and Flutter."
                tags={["Flutter", "Laravel", "ASP.NET", "Firebase", "Node.js"]}
              />
              <FeatureCard
                icon={Shield}
                iconBg="bg-emerald-600"
                title="Secure by Design"
                description="RBAC, SQL injection prevention, and database-level access controls built in from day one."
                tags={["RBAC", "Oracle DB", "REST APIs", "Auth"]}
              />
              <FeatureCard
                icon={Terminal}
                iconBg="bg-orange-600"
                title="442+ Coding Hours"
                description="Tracked via Wakatime. Consistent daily coding focused on shipping real, functional systems."
                tags={["Wakatime", "Git", "CI/CD"]}
              />
            </div>
          </FadeIn>
        </Section>

        {/* ══════════════════════════════════════════════
            GITHUB STATS
        ══════════════════════════════════════════════ */}
        <Section className="space-y-16">
          <FadeIn className="space-y-3 text-center">
            <Heading variant="section">{t("analytics.title")}</Heading>
            <Heading variant="title" className="text-spectrum">{t("analytics.subtitle")}</Heading>
          </FadeIn>
          <GithubStats />
        </Section>

        {/* ══════════════════════════════════════════════
            PROJECTS
        ══════════════════════════════════════════════ */}
        <Section id="projects" className="space-y-16">
          <FadeIn className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <Heading variant="section">{t("projects.section")}</Heading>
              <Heading variant="title">{t("projects.title")}</Heading>
            </div>
            <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
              <Link
                href="/projects"
                className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary"
              >
                {t("projects.view_all")}
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </FadeIn>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectProductCard key={project.slug} project={project} />
            ))}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════
            ABOUT MIND MAP
        ══════════════════════════════════════════════ */}
        <Section className="space-y-16">
          <FadeIn className="space-y-3 text-center">
            <Heading variant="section">Network</Heading>
            <Heading variant="title">Product Mindset</Heading>
          </FadeIn>
          <AboutMindMap />
        </Section>

        {/* ══════════════════════════════════════════════
            SKILLS
        ══════════════════════════════════════════════ */}
        <Section className="space-y-16">
          <FadeIn className="space-y-3 text-center">
            <Heading variant="section">Inventory</Heading>
            <Heading variant="title">Technical Stack & Mastery</Heading>
          </FadeIn>
          <SkillsVisualizer />
        </Section>

        {/* ══════════════════════════════════════════════
            TIMELINE
        ══════════════════════════════════════════════ */}
        <Section id="resume" className="grid gap-20 lg:grid-cols-2 lg:gap-32">
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

        {/* ══════════════════════════════════════════════
            CONTACT
        ══════════════════════════════════════════════ */}
        <QuestionSection />

      </Container>
    </>
  );
}
