"use client";

import { Download, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

const CV_PATH = "/CV - Nguyễn Thị Yến Nhi.pdf";

const HIGHLIGHTS = [
  { key: "specialisation" },
  { key: "stack"          },
  { key: "hours"          },
  { key: "contrib"        },
] as const;

export function ResumeClient() {
  const { t } = useLanguage();

  return (
    <Container className="pb-32 space-y-20">
      {/* ── Header ── */}
      <Section className="space-y-10 pt-20 text-center">
        <FadeIn className="space-y-6 flex flex-col items-center">
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

          <a
            href={CV_PATH}
            download
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_hsl(var(--primary))] active:scale-95"
          >
            <Download size={16} className="transition-transform group-hover:-translate-y-0.5" />
            {t("pages.resume.hero.download")}
          </a>
        </FadeIn>
      </Section>

      {/* ── Quick highlights ── */}
      <Section className="pt-0">
        <FadeIn>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {HIGHLIGHTS.map(({ key }) => (
              <div
                key={key}
                className="rounded-2xl border border-border/50 bg-card/60 p-6 glass-card"
              >
                <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {t(`pages.resume.${key}_label`)}
                </p>
                <p className="text-sm font-bold text-foreground">{t(`pages.resume.${key}_value`)}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ── PDF Viewer ── */}
      <Section className="pt-0 space-y-6">
        <FadeIn className="flex items-center gap-3">
          <FileText size={18} className="text-primary" />
          <Heading variant="section">{t("pages.resume.preview_section")}</Heading>
        </FadeIn>

        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-border/50 glass-card">
            <div className="relative w-full" style={{ paddingBottom: "141.4%" }}>
              <iframe
                src={`${CV_PATH}#toolbar=1&navpanes=0&scrollbar=1`}
                className="absolute inset-0 h-full w-full"
                title={`CV — ${SITE_CONFIG.fullName}`}
              />
            </div>

            <noscript>
              <div className="flex flex-col items-center justify-center gap-4 p-20 text-center">
                <FileText size={48} className="text-muted-foreground" />
                <p className="text-muted-foreground">
                  {t("pages.resume.no_js")}
                </p>
                <a
                  href={CV_PATH}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-white"
                >
                  <Download size={14} /> {t("pages.resume.hero.download")}
                </a>
              </div>
            </noscript>
          </div>
        </FadeIn>

        <FadeIn className="text-center">
          <a
            href={CV_PATH}
            download
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
          >
            <Download size={13} /> {t("pages.resume.save_copy")}
          </a>
        </FadeIn>
      </Section>
    </Container>
  );
}
