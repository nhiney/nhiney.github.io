"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import certificatesData from "@/data/certificates.json";

const CATEGORY_COLORS: Record<string, string> = {
  Academic: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Mobile Development": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Backend: "bg-red-500/10 text-red-400 border-red-500/20",
  Security: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Internet Technology": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export function CertificatesClient() {
  const { t } = useLanguage();
  const categories = [...new Set(certificatesData.map((c) => c.category))];

  return (
    <Container className="pb-32 space-y-24">
      {/* ── Header ── */}
      <Section className="space-y-10 pt-20 text-center">
        <FadeIn className="space-y-6 flex flex-col items-center">
          <Badge
            variant="outline"
            className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]"
          >
            {t("pages.certificates.hero.badge")}
          </Badge>
          <Heading variant="hero" as="h1">
            {t("pages.certificates.hero.title")}
          </Heading>
          <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
            {t("pages.certificates.hero.description")}
          </p>
        </FadeIn>

        {/* Category filter pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                CATEGORY_COLORS[cat] ?? "bg-primary/10 text-primary border-primary/20"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </Section>

      {/* ── Cards Grid ── */}
      <Section className="pt-0">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificatesData.map((cert, i) => (
            <FadeIn key={cert.id} delay={i * 0.05}>
              <div className="group relative flex h-full flex-col rounded-2xl border border-border/50 bg-card/60 p-7 glass-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_-12px_hsl(var(--primary))]">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-3xl">{cert.badge}</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                      CATEGORY_COLORS[cert.category] ??
                      "bg-primary/10 text-primary border-primary/20"
                    }`}
                  >
                    {cert.category}
                  </span>
                </div>

                <h3 className="mb-1 text-base font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {cert.title}
                </h3>

                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {cert.issuer} · {cert.date}
                </p>

                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {cert.description}
                </p>

                {cert.url && (
                  <Link
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
                  >
                    {t("pages.certificates.view_certificate")} <ExternalLink size={12} />
                  </Link>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>
    </Container>
  );
}
