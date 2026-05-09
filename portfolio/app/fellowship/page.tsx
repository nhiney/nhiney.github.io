import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, Shield, Code2, Users, Zap, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "VNNIC Fellowship | Yen Nhi",
  description: "My application and vision for the VNNIC Internet Fellowship Program — contributing to Vietnam's internet infrastructure and DNS ecosystem.",
};

const WHY_ITEMS = [
  {
    icon: Globe,
    title: "Internet Infrastructure",
    description:
      "Vietnam's DNS and domain ecosystem shapes how millions access the web. I want to understand and contribute to that foundation — not just consume it.",
    color: "bg-blue-600",
  },
  {
    icon: Shield,
    title: "Security-First Mindset",
    description:
      "My background in RBAC, database security, and OWASP-aligned development maps directly to the challenges of a secure internet infrastructure.",
    color: "bg-emerald-600",
  },
  {
    icon: Code2,
    title: "Builder Mentality",
    description:
      "442+ tracked coding hours, 4 shipped projects, and a habit of diving into architecture before writing a single line — I build things that last.",
    color: "bg-violet-600",
  },
  {
    icon: Users,
    title: "Community Impact",
    description:
      "Led development teams, mentored peers in backend architecture, and believe technology only matters when it reaches real people.",
    color: "bg-orange-600",
  },
];

const WHAT_I_BRING = [
  { label: "Backend expertise", detail: "Laravel · ASP.NET MVC · Oracle DB · REST APIs" },
  { label: "Security knowledge", detail: "RBAC · SQL injection prevention · PL/SQL security" },
  { label: "Mobile development", detail: "Flutter · Dart · Firebase · offline-first architecture" },
  { label: "Proven delivery", detail: "4 complete systems shipped with real users" },
  { label: "Coding consistency", detail: "442+ Wakatime hours · 186+ GitHub contributions" },
];

const GOALS = [
  {
    icon: BookOpen,
    title: "Learn DNS & Internet Governance",
    description: "Gain deep knowledge of Vietnam's internet infrastructure, ccTLD management, and domain policy from the experts who run it.",
  },
  {
    icon: Zap,
    title: "Contribute Meaningful Work",
    description: "Apply my engineering skills to real VNNIC projects — whether tooling, security audits, or developer education materials.",
  },
  {
    icon: Users,
    title: "Bridge Tech & Community",
    description: "Help translate complex internet policy into practical guides for the Vietnamese developer community.",
  },
];

export default function FellowshipPage() {
  return (
    <Container className="pb-32 space-y-28">

      {/* ── Hero ── */}
      <Section className="space-y-10 pt-20">
        <FadeIn className="flex flex-col gap-6">
          <Badge variant="outline" className="w-fit px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]">
            VNNIC Fellowship Program
          </Badge>
          <Heading variant="hero" as="h1" className="text-spectrum max-w-4xl">
            Building Vietnam's Internet, Together
          </Heading>
          <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
            I'm Nguyen Thi Yen Nhi — a software engineering student specialising in backend systems
            and database security. I'm applying for the VNNIC Internet Fellowship because I believe
            the next generation of Vietnam's internet needs engineers who think deeply about
            infrastructure, not just applications.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_hsl(var(--primary))] active:scale-95"
            >
              View my work <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-8 py-4 text-sm font-black uppercase tracking-widest transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
            >
              Download CV
            </Link>
          </div>
        </FadeIn>
      </Section>

      {/* ── Why VNNIC ── */}
      <Section className="space-y-14 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">Motivation</Heading>
          <Heading variant="title">Why the VNNIC Fellowship?</Heading>
        </FadeIn>
        <FadeIn>
          <div className="grid gap-6 sm:grid-cols-2">
            {WHY_ITEMS.map(({ icon: Icon, color, title, description }) => (
              <div key={title} className="rounded-3xl border border-border/50 bg-card/60 p-8 glass-card transition-all hover:border-primary/30">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${color}`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="mb-3 text-lg font-black tracking-tight">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ── What I bring ── */}
      <Section className="space-y-14 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">Contribution</Heading>
          <Heading variant="title">What I bring to VNNIC</Heading>
        </FadeIn>
        <FadeIn>
          <div className="divide-y divide-border/50 rounded-3xl border border-border/50 bg-card/60 glass-card overflow-hidden">
            {WHAT_I_BRING.map(({ label, detail }) => (
              <div key={label} className="flex flex-col gap-1 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-black tracking-tight text-foreground">{label}</span>
                <span className="text-xs font-semibold text-muted-foreground">{detail}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ── Goals ── */}
      <Section className="space-y-14 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">Vision</Heading>
          <Heading variant="title">What I aim to achieve</Heading>
        </FadeIn>
        <FadeIn>
          <div className="flex flex-col gap-5 lg:flex-row">
            {GOALS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex-1 rounded-3xl border border-border/50 bg-card/60 p-8 glass-card">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3 className="mb-3 text-base font-black tracking-tight">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ── CTA ── */}
      <Section className="pt-0">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-10 text-center glass-card">
            <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
            <Badge variant="outline" className="mb-6 px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]">
              Let's connect
            </Badge>
            <Heading variant="title" className="mb-4">Interested in my application?</Heading>
            <p className="mb-8 text-muted-foreground">
              I'd love to talk about how my skills align with VNNIC's mission.
            </p>
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_hsl(var(--primary))] active:scale-95"
            >
              Get in touch <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>
      </Section>

    </Container>
  );
}
