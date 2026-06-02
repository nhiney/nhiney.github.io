"use client";

import React from "react";

export function BackgroundEffects() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* ── Light mode orbs — nearly invisible, just a whisper ── */}
        <div
          className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] rounded-full bg-blue-100/30 blur-[140px] dark:hidden animate-orb-1 will-change-transform"
        />
        <div
          className="absolute top-[10%] -right-[10%] w-[32%] h-[32%] rounded-full bg-pink-100/20 blur-[120px] dark:hidden animate-orb-2 will-change-transform"
        />
        <div
          className="absolute bottom-[20%] left-[20%] w-[28%] h-[28%] rounded-full bg-blue-100/10 blur-[110px] dark:hidden animate-orb-3 will-change-transform"
        />

        {/* ── Dark mode orbs — very subtle sapphire glow ── */}
        <div
          className="hidden dark:block absolute -top-[15%] -left-[5%] w-[50%] h-[50%] rounded-full bg-blue-600/[0.08] blur-[160px] animate-orb-1 will-change-transform"
        />
        <div
          className="hidden dark:block absolute top-[5%] -right-[8%] w-[35%] h-[35%] rounded-full bg-indigo-500/[0.06] blur-[140px] animate-orb-2 will-change-transform"
        />
        <div
          className="hidden dark:block absolute bottom-[10%] left-[15%] w-[30%] h-[30%] rounded-full bg-cyan-500/[0.05] blur-[120px] animate-orb-3 will-change-transform"
        />
      </div>
    </>
  );
}
