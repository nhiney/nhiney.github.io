"use client";

import Link from "next/link";
import { ArrowRight, Globe, Shield, Code2, Users, Zap, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";

const WHY_ITEMS = [
  { icon: Globe,  key: "infra",     color: "bg-blue-600"    },
  { icon: Shield, key: "security",  color: "bg-emerald-600" },
  { icon: Code2,  key: "builder",   color: "bg-violet-600"  },
  { icon: Users,  key: "community", color: "bg-orange-600"  },
] as const;

const WHAT_I_BRING = [
  { key: "backend"     },
  { key: "security"    },
  { key: "mobile"      },
  { key: "delivery"    },
  { key: "consistency" },
] as const;

const GOALS = [
  { icon: BookOpen, key: "learn"      },
  { icon: Zap,      key: "contribute" },
  { icon: Users,    key: "bridge"     },
] as const;

export function FellowshipClient() {
  const { t } = useLanguage();

  return (
    <Container className="pb-20 space-y-16">

      {/* ── Hero ── */}
      <Section className="space-y-6 pt-12">
        <FadeIn className="flex flex-col gap-6">
          <Badge variant="outline" className="w-fit px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]">
            {t("pages.fellowship.hero.badge")}
          </Badge>
          <Heading variant="hero" as="h1" className="text-spectrum max-w-4xl">
            {t("pages.fellowship.hero.title")}
          </Heading>
          <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
            {t("pages.fellowship.hero.description")}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_hsl(var(--primary))] active:scale-95"
            >
              {t("pages.fellowship.hero.cta_primary")} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-8 py-4 text-sm font-black uppercase tracking-widest transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
            >
              {t("pages.fellowship.hero.cta_secondary")}
            </Link>
          </div>
        </FadeIn>
      </Section>

      {/* ── Why VNNIC ── */}
      <Section className="space-y-8 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.fellowship.why.section")}</Heading>
          <Heading variant="title">{t("pages.fellowship.why.title")}</Heading>
        </FadeIn>
        <FadeIn>
          <div className="grid gap-6 sm:grid-cols-2">
            {WHY_ITEMS.map(({ icon: Icon, color, key }) => (
              <div key={key} className="rounded-3xl border border-border/50 bg-card/60 p-8 glass-card transition-all hover:border-primary/30">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${color}`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="mb-3 text-lg font-black tracking-tight">{t(`pages.fellowship.why.${key}_title`)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(`pages.fellowship.why.${key}_desc`)}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ── What I bring ── */}
      <Section className="space-y-8 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.fellowship.bring.section")}</Heading>
          <Heading variant="title">{t("pages.fellowship.bring.title")}</Heading>
        </FadeIn>
        <FadeIn>
          <div className="divide-y divide-border/50 rounded-3xl border border-border/50 bg-card/60 glass-card overflow-hidden">
            {WHAT_I_BRING.map(({ key }) => (
              <div key={key} className="flex flex-col gap-1 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-black tracking-tight text-foreground">{t(`pages.fellowship.bring.${key}_label`)}</span>
                <span className="text-xs font-semibold text-muted-foreground">{t(`pages.fellowship.bring.${key}_detail`)}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ── Goals ── */}
      <Section className="space-y-8 pt-0">
        <FadeIn className="space-y-3">
          <Heading variant="section">{t("pages.fellowship.goals.section")}</Heading>
          <Heading variant="title">{t("pages.fellowship.goals.title")}</Heading>
        </FadeIn>
        <FadeIn>
          <div className="flex flex-col gap-5 lg:flex-row">
            {GOALS.map(({ icon: Icon, key }) => (
              <div key={key} className="flex-1 rounded-3xl border border-border/50 bg-card/60 p-8 glass-card">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3 className="mb-3 text-base font-black tracking-tight">{t(`pages.fellowship.goals.${key}_title`)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(`pages.fellowship.goals.${key}_desc`)}</p>
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
              {t("pages.fellowship.cta.badge")}
            </Badge>
            <Heading variant="title" className="mb-4">{t("pages.fellowship.cta.title")}</Heading>
            <p className="mb-8 text-muted-foreground">
              {t("pages.fellowship.cta.description")}
            </p>
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_hsl(var(--primary))] active:scale-95"
            >
              {t("pages.fellowship.cta.button")} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>
      </Section>

    </Container>
  );
}
