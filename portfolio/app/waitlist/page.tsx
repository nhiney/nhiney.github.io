"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { GithubIcon, LinkedinIcon } from "@/components/widgets/Icons";
import { SITE_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

const INTEREST_KEYS = ["projects", "articles"] as const;

export default function WaitlistPage() {
  const { t } = useLanguage();
  const mailHref = `mailto:${SITE_CONFIG.links.email}?subject=${encodeURIComponent(t("pages.waitlist.email_subject"))}`;

  return (
    <Container className="pb-32">
      <Section className="flex min-h-[90vh] flex-col items-center justify-center text-center">
        <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[80px]" />

        <FadeIn className="flex w-full max-w-2xl flex-col items-center gap-8">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-primary"
          >
            {t("pages.waitlist.hero.badge")}
          </Badge>

          <div className="space-y-4">
            <Heading variant="hero" as="h1" className="text-5xl md:text-6xl">
              {t("pages.waitlist.hero.title")}
            </Heading>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
              {t("pages.waitlist.hero.description")}
            </p>
          </div>

          <ul className="grid w-full gap-3 text-left sm:grid-cols-2">
            {INTEREST_KEYS.map((key) => (
              <li
                key={key}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground"
              >
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>{t(`pages.waitlist.interest_${key}`)}</span>
              </li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.35 }}
            className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              href={mailHref}
              data-analytics-event="contact_channel_clicked"
              data-analytics-label="email"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_-8px_hsl(var(--primary))] active:scale-95"
            >
              <Mail size={16} />
              {t("pages.waitlist.cta_email")}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={SITE_CONFIG.links.linkedin}
              data-analytics-event="contact_channel_clicked"
              data-analytics-label="linkedin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-card/50 px-8 py-4 text-sm font-bold transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
            >
              <LinkedinIcon size={16} />
              {t("pages.waitlist.cta_linkedin")}
            </Link>
            <Link
              href={SITE_CONFIG.links.github}
              data-analytics-event="contact_channel_clicked"
              data-analytics-label="github"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-card/50 px-8 py-4 text-sm font-bold transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
            >
              <GithubIcon size={16} />
              {t("pages.waitlist.cta_github")}
            </Link>
          </motion.div>

          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground/70">
            {t("pages.waitlist.privacy_note")}{" "}
            <span className="font-semibold text-muted-foreground">{SITE_CONFIG.links.email}</span>
          </p>
        </FadeIn>
      </Section>
    </Container>
  );
}
