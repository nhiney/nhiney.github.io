"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const SeedField = dynamic(() => import("./SeedField"), { ssr: false });

// Inner pages that get the quiet 3D seed field. Skipped: the homepage (its own
// scene), /books (its own book galaxy), blog articles (reading pages) and the
// private planner.
function wantsSeedField(path: string) {
  return (
    path === "/certificates" ||
    path === "/blog" ||
    path === "/resume" ||
    path === "/privacy" ||
    path === "/projects" ||
    path.startsWith("/projects/")
  );
}

export function BackgroundEffects() {
  const pathname = usePathname();
  // The homepage keeps a plain, transparent backdrop — no orb loops.
  const hasHeroAtmosphere = pathname === "/";
  const path = (pathname ?? "/").replace(/\/$/, "") || "/";
  // Pages that opt out of the full-viewport paper-grain overlay: the restored
  // BA pages, the blog (its reading column reads cleaner on a flat sheet), and
  // every page with a live WebGL scene — the grain's mix-blend-mode re-blends the
  // whole screen each frame there (measured: 100ms+ hitches → gone without it).
  const hideGrain =
    path === "/" ||
    path === "/books" ||
    wantsSeedField(path) ||
    pathname === "/portfolio" ||
    pathname?.startsWith("/portfolio/") ||
    pathname === "/blog" ||
    pathname?.startsWith("/blog/");

  return (
    <>
      {!hideGrain && <div className="grain" aria-hidden="true" />}
      {!hasHeroAtmosphere && (
        <div
          className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          {/* ── Light mode orbs — soft violet wash, the site accent ── */}
          <div
            className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] rounded-full bg-violet-200/40 blur-[140px] dark:hidden animate-orb-1 will-change-transform"
          />
          <div
            className="absolute top-[10%] -right-[10%] w-[32%] h-[32%] rounded-full bg-indigo-100/45 blur-[120px] dark:hidden animate-orb-2 will-change-transform"
          />
          <div
            className="absolute bottom-[20%] left-[20%] w-[28%] h-[28%] rounded-full bg-violet-100/45 blur-[110px] dark:hidden animate-orb-3 will-change-transform"
          />

          {/* ── Dark mode orbs — faint violet glow, the site accent ── */}
          <div
            className="hidden dark:block absolute -top-[15%] -left-[5%] w-[50%] h-[50%] rounded-full bg-violet-600/[0.07] blur-[160px] animate-orb-1 will-change-transform"
          />
          <div
            className="hidden dark:block absolute top-[5%] -right-[8%] w-[35%] h-[35%] rounded-full bg-indigo-500/[0.05] blur-[140px] animate-orb-2 will-change-transform"
          />
          <div
            className="hidden dark:block absolute bottom-[10%] left-[15%] w-[30%] h-[30%] rounded-full bg-violet-500/[0.04] blur-[120px] animate-orb-3 will-change-transform"
          />

          {/* ── Light 3D: drifting dandelion seeds (both themes) ── */}
          {wantsSeedField(path) && <SeedField />}
        </div>
      )}
    </>
  );
}
