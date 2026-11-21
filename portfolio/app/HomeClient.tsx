"use client";

import { Component, useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";

import { HomeHero } from "@/components/home/HomeHero";
import {
  AboutSection,
  CapabilitiesSection,
  ContactSection,
  CredentialsSection,
  ManifestoSection,
  ProofSection,
  WorkSection,
} from "@/components/home/HomeSections";
import styles from "@/components/home/home.module.css";
import type { Post } from "@/types";

const ParticleScene = dynamic(() => import("@/components/home/ParticleScene"), {
  ssr: false,
  loading: () => <div className={styles.canvasFallback} />,
});

// Without WebGL the page keeps a soft static glow instead of crashing.
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <div className={styles.canvasFallback} /> : this.props.children;
  }
}

// Homepage after the "Dala" reference: one particle layer behind the whole page
// that morphs scene by scene (old tree → field → bulb → globe), text beside or over it.
export function HomeClient(_props: { projects: Post[]; latestPosts: Post[] }) {
  void _props;

  // Smooth, inertial scrolling (wheel steps become one glide), so the scroll-driven
  // 3D scenes and reveals move continuously. Off for reduced-motion users.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.13, autoRaf: true, anchors: { offset: -64 } }); // snappy, still smooth
    return () => lenis.destroy();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className={styles.page}>
        {/* Sticky inside the page, so the particles stop at the footer instead of covering it. */}
        <div className={styles.sceneTrack} aria-hidden="true">
          <div className={styles.sceneSticky}>
            <CanvasBoundary>
              <ParticleScene className={styles.canvas} />
            </CanvasBoundary>
          </div>
        </div>

        <div className={styles.content}>
          <HomeHero />
          <AboutSection />
          <ManifestoSection />
          <WorkSection />
          <ProofSection />
          <CapabilitiesSection />
          <CredentialsSection />
          <ContactSection />
        </div>
      </div>
    </MotionConfig>
  );
}
