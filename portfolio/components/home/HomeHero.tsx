"use client";

import { Fragment, useRef } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Rich } from "./Rich";
import { useHomeCopy } from "./homeCopy";
import styles from "./home.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

function RevealWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ").filter(Boolean);
  return (
    <>
      {/* The space sits outside the inline-block mask, where it would otherwise collapse. */}
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className={styles.wordMask}>
            <motion.span
              className={styles.word}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.05 }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

// Role, name, tagline (with a marker-pen highlight), how she works, two buttons on the left;
// the particle tree (ParticleScene, mounted once for the whole page) on the right.
export function HomeHero() {
  const { ui, language } = useHomeCopy();
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const fadeUp = (d: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay: d },
  });

  return (
    <section ref={sectionRef} data-scene={0} className={styles.hero} aria-labelledby="home-hero-title">
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className={styles.heroContent}>
        <Container>
          <div className={styles.heroCol}>
            <motion.p {...fadeUp(0.1)} className={styles.heroRole}>
              {ui.metaLead}
            </motion.p>

            <h1 id="home-hero-title" className={cn(styles.heroTitle, language === "vi" && styles.heroTitleVi, "mt-4")}>
              <RevealWords text={t("home.hero.name")} delay={0.2} />
            </h1>

            <motion.p {...fadeUp(0.55)} className={cn(styles.heroTagline, "mt-5")}>
              {ui.tagline} <span className={styles.heroMark}>{ui.taglineMark}</span>
            </motion.p>

            <motion.p {...fadeUp(0.65)} className={cn(styles.heroStatement, "mt-5")}>
              <Rich text={ui.statement} />
            </motion.p>

            <motion.div {...fadeUp(0.9)} className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/resume/"
                className={styles.btnPrimary}
                data-analytics-event="hero_cta_clicked"
                data-analytics-label="cv"
              >
                {ui.ctaCv}
              </Link>
              <Link
                href={`mailto:${SITE_CONFIG.links.email}`}
                className={styles.btnOutline}
                data-analytics-event="hero_cta_clicked"
                data-analytics-label="email"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {ui.ctaEmail}
              </Link>
            </motion.div>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
