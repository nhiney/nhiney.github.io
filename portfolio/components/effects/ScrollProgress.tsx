"use client";

import { useEffect, useRef } from "react";

/** Thin gradient bar at the top of the page that tracks scroll position. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const update = () => {
      const bar = barRef.current;
      if (!bar) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = scrollTop / (scrollHeight - clientHeight);
      bar.style.transform = `scaleX(${pct})`;
      bar.style.width = "100%";
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress"
      style={{ transform: "scaleX(0)", width: "100%" }}
      aria-hidden="true"
    />
  );
}
