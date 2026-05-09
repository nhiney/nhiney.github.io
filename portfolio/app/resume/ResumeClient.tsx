"use client";

import { Download, FileText, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { CVDocument } from "./CVDocument";

const CV_PATH = "/cv.pdf";

const HIGHLIGHTS = [
  { key: "specialisation" },
  { key: "stack"          },
  { key: "hours"          },
  { key: "contrib"        },
] as const;

export function ResumeClient() {
  const { t } = useLanguage();

  return (
    <>
      {/* ══ Hero + Highlights — kept inside the body container ═══════════════ */}
      <Container className="space-y-10 pb-10">
        {/* ── Header ── */}
        <Section className="space-y-6 pt-12 text-center">
          <FadeIn className="space-y-5 flex flex-col items-center">
            <Badge
              variant="outline"
              className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]"
            >
              {t("pages.resume.hero.badge")}
            </Badge>
            <Heading variant="hero" as="h1">
              {t("pages.resume.hero.title")}
            </Heading>
            <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
              {t("pages.resume.hero.description")}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href={CV_PATH}
                download
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-9 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_hsl(var(--primary))] active:scale-95"
              >
                <Download size={16} className="transition-transform group-hover:-translate-y-0.5" />
                {t("pages.resume.hero.download")}
              </a>
              <a
                href={CV_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 rounded-full border border-border/60 px-9 py-4 text-sm font-black uppercase tracking-widest transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
              >
                <ExternalLink size={15} className="transition-transform group-hover:translate-x-0.5" />
                {t("pages.resume.hero.open_tab")}
              </a>
            </div>
          </FadeIn>
        </Section>

        {/* ── Quick highlights ── */}
        <Section className="pt-0">
          <FadeIn>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {HIGHLIGHTS.map(({ key }) => (
                <div
                  key={key}
                  className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-6 glass-card transition-all hover:border-primary/30 hover:bg-card/80"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {t(`pages.resume.${key}_label`)}
                  </p>
                  <p className="text-sm font-bold text-foreground leading-snug">{t(`pages.resume.${key}_value`)}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </Section>
      </Container>

      {/* ══ PDF Viewer — escapes the body container, near full-viewport ══════ */}
      <section className="pb-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <FadeIn className="mx-auto flex max-w-[1700px] items-center gap-3 pb-4">
            <FileText size={18} className="text-primary" />
            <Heading variant="section">{t("pages.resume.preview_section")}</Heading>
          </FadeIn>

          <FadeIn>
            <div className="mx-auto max-w-[1100px]">
              <CVDocument />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
