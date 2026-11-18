"use client";

import { MotionConfig } from "framer-motion";

import { HomeHero } from "@/components/home/HomeHero";
import {
  AboutSection,
  CapabilitiesSection,
  ContactSection,
  CredentialsSection,
  ProofSection,
  SkillMarquee,
  WorkSection,
} from "@/components/home/HomeSections";
import styles from "@/components/home/home.module.css";
import type { Post } from "@/types";

// Homepage — "Particle Mind".
// A cinematic WebGL hero (an iridescent particle brain that reacts to the
// cursor and dissolves on scroll), then an editorial, scroll-choreographed
// story: manifesto → stacked case studies → capabilities → proof → credentials
// → a dark contact stage that mirrors the hero.
export function HomeClient(_props: { projects: Post[]; latestPosts: Post[] }) {
  void _props;
  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className={styles.page}>
        <HomeHero />
        <SkillMarquee />
        <AboutSection />
        <WorkSection />
        <CapabilitiesSection />
        <ProofSection />
        <CredentialsSection />
        <ContactSection />
      </div>
    </MotionConfig>
  );
}
