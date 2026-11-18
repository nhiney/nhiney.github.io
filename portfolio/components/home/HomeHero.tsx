"use client";

import { Component, useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import wakatimeTotal from "@/data/wakatime.json";

import { Rich } from "./Rich";
import { useHomeCopy } from "./homeCopy";
import styles from "./home.module.css";

const ParticleBrain = dynamic(() => import("./ParticleBrain"), {
  ssr: false,
  loading: () => <div className={styles.canvasFallback} />,
});

// If WebGL is unavailable the hero keeps a soft static glow instead of a crash.
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <div className={styles.canvasFallback} /> : this.props.children;
  }
}

const EASE = [0.16, 1, 0.3, 1] as const;

function RevealWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ").filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className={styles.wordMask}>
          <motion.span
            className={cn(styles.word, className)}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * 0.06 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export function HomeHero() {
  const { copy, ui, language } = useHomeCopy();
  const { t } = useLanguage();
  const { hero } = copy;
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const locale = language === "vi" ? "vi-VN" : "en-US";
  const hours = new Intl.NumberFormat(locale).format(wakatimeTotal.hours);
  const preWords = hero.headline_pre.split(" ").length;
  const accWords = hero.headline_acc1.split(" ").length;

  const fadeUp = (d: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay: d },
  });

  const stats = [
    { value: "186+", label: ui.statContrib },
    { value: `${hours}h`, label: ui.statHours },
    { value: copy.stats[2]?.value ?? "6", label: ui.statPrograms },
  ];

  return (
    <section ref={sectionRef} className="relative pt-1 pb-3" aria-labelledby="home-hero-title">
      <div className={cn(styles.stage, styles.hero)}>
        <CanvasBoundary>
          <ParticleBrain className={styles.canvas} progress={scrollYProgress} interactionTarget={sectionRef} />
        </CanvasBoundary>
        <div className={styles.heroScrim} aria-hidden="true" />

        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-[2] flex flex-1 flex-col">
          <Container className="flex flex-1 flex-col px-5 sm:px-8 md:px-12">
            {/* Top meta row */}
            <motion.div {...fadeUp(0.1)} className="flex items-center justify-between gap-4 pt-6 sm:pt-8">
              <span className={styles.statusPill}>
                <span className={styles.liveDot} aria-hidden="true" />
                {hero.status}
              </span>
              <span className={cn(styles.mono, "hidden text-[11px] uppercase tracking-[0.18em] text-white/50 md:block")}>
                {ui.role}
              </span>
            </motion.div>

            {/* Headline block */}
            <div className="flex flex-1 flex-col justify-end pb-10 pt-[34svh] sm:pt-[38svh] lg:justify-center lg:pt-10 lg:pb-12">
              <div className="max-w-[46rem]">
                <motion.p {...fadeUp(0.25)} className={cn(styles.mono, "mb-6 text-[13px] text-white/60")}>
                  — {t("home.hero.title_prefix")}{" "}
                  <span className="text-white">{t("home.hero.name")}</span>
                </motion.p>

                <h1
                  id="home-hero-title"
                  className={cn(styles.heroTitle, language === "vi" && styles.heroTitleVi)}
                >
                  <RevealWords text={hero.headline_pre} delay={0.3} />{" "}
                  <RevealWords text={hero.headline_acc1} className={styles.iri} delay={0.3 + preWords * 0.06} />{" "}
                  <RevealWords text={hero.headline_mid} delay={0.3 + (preWords + accWords) * 0.06} />
                </h1>

                <motion.p {...fadeUp(0.85)} className={cn(styles.heroSub, "mt-7")}>
                  <Rich text={hero.sub_pre} />
                </motion.p>

                <motion.div {...fadeUp(1)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#projects"
                    className={styles.ctaPrimary}
                    data-analytics-event="hero_cta_clicked"
                    data-analytics-label="projects"
                  >
                    {hero.cta_projects}
                    <span className={styles.ctaIcon} aria-hidden="true">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </a>
                  <Link
                    href={`mailto:${SITE_CONFIG.links.email}`}
                    className={styles.ctaGhost}
                    data-analytics-event="hero_cta_clicked"
                    data-analytics-label="email"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {hero.cta_contact}
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Bottom stats + scroll cue */}
            <motion.div {...fadeUp(1.15)} className={cn(styles.heroStats, "flex items-end justify-between gap-6 py-6")}>
              <dl className="grid flex-1 grid-cols-3 gap-0 sm:max-w-[40rem]">
                {stats.map((s, i) => (
                  <div key={s.label} className={cn(styles.heroStat, i > 0 && "pl-4 sm:pl-7", "pr-3")}>
                    <dd className={cn(styles.statValue, "text-2xl text-white sm:text-[2.1rem]")}>{s.value}</dd>
                    <dt className="mt-2 text-[11px] leading-snug text-white/55 sm:text-xs">{s.label}</dt>
                  </div>
                ))}
              </dl>
              <div className="hidden flex-col items-end gap-3 lg:flex">
                <span className={cn(styles.mono, styles.hint)}>
                  <ArrowUpRight className="mr-1 inline h-3 w-3 -rotate-90" aria-hidden="true" />
                  {ui.hint}
                </span>
                <a href="#about" className="flex items-center gap-3 text-xs text-white/60 transition-colors hover:text-white">
                  <span className={styles.mono}>{ui.scroll}</span>
                  <span className={styles.scrollCue} aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
