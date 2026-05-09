"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, Shield, Terminal, Layers } from "lucide-react";
import { useRef, useState } from "react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { QuestionSection } from "@/components/ui/QuestionSection";
import { AnimatedScrollMouse } from "@/components/ui/AnimatedScrollMouse";
import { CursorTrailCanvas } from "@/components/ui/CursorTrailCanvas";
import { GithubIcon, LinkedinIcon, FacebookIcon, MailIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG } from "@/lib/constants";
import { Post } from "@/types";

// ─── Glow-on-hover card wrapper ───────────────────────────────────────────────

function GlowCard({ children, className, animateY = -6 }: {
  children: React.ReactNode; className?: string; animateY?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: animateY }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={cn("relative overflow-hidden", className)}
    >
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

// ─── Capability card ──────────────────────────────────────────────────────────

function CapabilityCard({ icon: Icon, iconBg, title, description, tags }: {
  icon: React.ElementType; iconBg: string; title: string;
  description: string; tags: string[];
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
          <span key={tag} className="rounded-full bg-primary/10 border border-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            {tag}
          </span>
        ))}
      </div>
    </GlowCard>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HomeClient({ projects: _ }: { projects: Post[] }) {
  const { t } = useLanguage();

  const socials = [
    { href: SITE_CONFIG.links.github, Icon: GithubIcon },
    { href: SITE_CONFIG.links.linkedin, Icon: LinkedinIcon },
    { href: SITE_CONFIG.links.facebook, Icon: FacebookIcon },
    { href: `mailto:${SITE_CONFIG.links.email}`, Icon: MailIcon },
  ];

  return (
    <>
      <CursorTrailCanvas className="pointer-events-none fixed inset-0 z-50 h-full w-full" />

      <Container className="space-y-28 pb-32">

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <Section
          id="about"
          className="relative flex min-h-[92vh] flex-col items-center justify-center py-0"
        >
          <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,white,transparent)] opacity-20" />
          <div className="absolute left-1/2 top-1/3 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[80px]" />

          <FadeIn className="relative z-10 flex w-full max-w-3xl flex-col items-start gap-8">
            <Badge
              variant="outline"
              className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-black tracking-[0.3em] uppercase text-[10px]"
            >
              {t("hero.welcome")}
            </Badge>

            <div className="space-y-3">
              <motion.h1
                initial={{ filter: "blur(12px)", opacity: 0, y: 20 }}
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-7xl font-black tracking-tighter text-spectrum leading-none md:text-8xl xl:text-9xl"
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
                {" · "}{t("hero.role_fullstack")}
                {" · "}Security Enthusiast
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
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_hsl(var(--primary))] active:scale-95"
              >
                {t("hero.cta_primary")}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/fellowship"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 px-8 py-4 text-sm font-black uppercase tracking-widest transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
              >
                Fellowship VNNIC
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex items-center gap-8"
            >
              {socials.map(({ href, Icon }) => (
                <motion.div key={href} whileHover={{ y: -4, scale: 1.15 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
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

          <AnimatedScrollMouse />
        </Section>

        {/* ══ CAPABILITIES ══════════════════════════════════════════════════ */}
        <Section className="space-y-14 pt-0">
          <FadeIn className="space-y-3">
            <Heading variant="section">Capabilities</Heading>
            <Heading variant="title">What I bring to the table</Heading>
          </FadeIn>
          <FadeIn>
            <div className="flex flex-col gap-5 xl:flex-row">
              <CapabilityCard
                icon={Code2} iconBg="bg-blue-600" title="Languages & Core"
                description="Versatile across multiple paradigms — mobile, scripting, systems, and database programming."
                tags={["Dart", "C#", "PHP", "Python", "PL/SQL", "JavaScript"]}
              />
              <CapabilityCard
                icon={Layers} iconBg="bg-violet-600" title="Backend & Mobile"
                description="Full-stack capable with a backend-first mindset. Fluent in Laravel, ASP.NET MVC, and Flutter."
                tags={["Flutter", "Laravel", "ASP.NET", "Firebase", "Node.js"]}
              />
              <CapabilityCard
                icon={Shield} iconBg="bg-emerald-600" title="Secure by Design"
                description="RBAC, SQL injection prevention, and database-level access controls built in from day one."
                tags={["RBAC", "Oracle DB", "REST APIs", "Auth"]}
              />
              <CapabilityCard
                icon={Terminal} iconBg="bg-orange-600" title="442+ Coding Hours"
                description="Tracked via Wakatime. Consistent daily coding focused on shipping real, functional systems."
                tags={["Wakatime", "Git", "CI/CD"]}
              />
            </div>
          </FadeIn>
        </Section>

        {/* ══ CONTACT ═══════════════════════════════════════════════════════ */}
        <QuestionSection />

      </Container>
    </>
  );
}
