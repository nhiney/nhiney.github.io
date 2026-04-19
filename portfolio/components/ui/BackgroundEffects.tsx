"use client";

import React from "react";

export function BackgroundEffects() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-glow-blue blur-[120px] opacity-50 dark:opacity-30" />
        <div className="absolute top-[10%] -right-[10%] w-[30%] h-[30%] bg-glow-pink blur-[100px] opacity-40 dark:opacity-20" />
        <div className="absolute bottom-[20%] left-[20%] w-[25%] h-[25%] bg-glow-blue blur-[100px] opacity-20 dark:opacity-10" />
      </div>
    </>
  );
}
