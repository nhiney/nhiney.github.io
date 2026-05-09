"use client";

import { Download, FileText, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

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

          {/* Dual CTAs — primary download + secondary open-in-new-tab */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
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

      {/* ── PDF Viewer ── */}
      <Section className="pt-0 space-y-6">
        <FadeIn className="flex items-center gap-3">
          <FileText size={18} className="text-primary" />
          <Heading variant="section">{t("pages.resume.preview_section")}</Heading>
        </FadeIn>

        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 glass-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">

            {/* Toolbar strip — filename on the left, quick actions on the right */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/40 bg-background/40 px-6 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-foreground truncate">
                    {t("pages.resume.preview_filename")}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("pages.resume.preview_meta")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={CV_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                  title={t("pages.resume.hero.open_tab")}
                >
                  <ExternalLink size={11} />
                  {t("pages.resume.hero.open_tab")}
                </a>
                <a
                  href={CV_PATH}
                  download
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:opacity-90"
                  title={t("pages.resume.hero.download")}
                >
                  <Download size={11} />
                  {t("pages.resume.hero.download")}
                </a>
              </div>
            </div>

            {/* Iframe — A4 ratio (≈ 1:1.414) */}
            <div className="relative w-full bg-neutral-950" style={{ paddingBottom: "141.4%" }}>
              <iframe
                src={`${CV_PATH}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
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
      </Section>
    </Container>
  );
}
