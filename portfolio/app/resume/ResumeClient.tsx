"use client";

import { Download, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";

const CV_PATH = "/NguyenThiYenNhi_CV.pdf";
const CV_FILENAME = "NguyenThiYenNhi_CV.pdf";

export function ResumeClient() {
  const { t } = useLanguage();

  return (
    <>
      {/* ══ Hero — kept inside the body container ═══════════════════════════ */}
      <Container className="pb-10">
        <Section className="space-y-4 pt-8 text-center">
          <FadeIn className="space-y-3 flex flex-col items-center">
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
                download={CV_FILENAME}
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
      </Container>

      {/* ══ CV PDF — rendered inline via the browser's native viewer ════════ */}
      <section className="pb-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-[1100px]">
              <div
                className="
                  overflow-hidden rounded-3xl border border-border bg-card
                  shadow-[0_2px_4px_-1px_rgba(0,0,0,0.06),0_10px_30px_-12px_rgba(0,0,0,0.18)]
                  dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]
                "
              >
                <object
                  data={`${CV_PATH}#view=FitH`}
                  type="application/pdf"
                  className="h-[80vh] min-h-[600px] w-full"
                  aria-label={t("pages.resume.hero.title")}
                >
                  {/* Fallback — many mobile browsers can't embed PDFs inline */}
                  <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
                    <p className="max-w-md text-base text-muted-foreground leading-relaxed">
                      {t("pages.resume.hero.description")}
                    </p>
                    <a
                      href={CV_PATH}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-9 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
                    >
                      <ExternalLink size={15} />
                      {t("pages.resume.hero.open_tab")}
                    </a>
                  </div>
                </object>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
