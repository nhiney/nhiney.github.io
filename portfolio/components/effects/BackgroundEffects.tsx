"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function BackgroundEffects() {
  const pathname = usePathname();
  const isRestoredPage =
    pathname === "/" || pathname === "/portfolio" || pathname?.startsWith("/portfolio/");

  return (
    <>
      {!isRestoredPage && <div className="grain" aria-hidden="true" />}
      <div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* ── Light mode orbs — soft blue wash for an airy, on-brand feel ── */}
        <div
          className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] rounded-full bg-blue-200/45 blur-[140px] dark:hidden animate-orb-1 will-change-transform"
        />
        <div
          className="absolute top-[10%] -right-[10%] w-[32%] h-[32%] rounded-full bg-indigo-100/45 blur-[120px] dark:hidden animate-orb-2 will-change-transform"
        />
        <div
          className="absolute bottom-[20%] left-[20%] w-[28%] h-[28%] rounded-full bg-blue-100/50 blur-[110px] dark:hidden animate-orb-3 will-change-transform"
        />

        {/* ── Dark mode orbs — faint blue glow ── */}
        <div
          className="hidden dark:block absolute -top-[15%] -left-[5%] w-[50%] h-[50%] rounded-full bg-blue-500/[0.06] blur-[160px] animate-orb-1 will-change-transform"
        />
        <div
          className="hidden dark:block absolute top-[5%] -right-[8%] w-[35%] h-[35%] rounded-full bg-indigo-500/[0.05] blur-[140px] animate-orb-2 will-change-transform"
        />
        <div
          className="hidden dark:block absolute bottom-[10%] left-[15%] w-[30%] h-[30%] rounded-full bg-blue-500/[0.04] blur-[120px] animate-orb-3 will-change-transform"
        />
      </div>
    </>
  );
}
