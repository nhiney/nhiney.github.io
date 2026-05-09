"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Soft radial glow that follows the cursor.
 *
 * - Uses CSS variables (`--mx`/`--my`) so DOM updates are cheap and the
 *   browser can repaint the gradient on the GPU.
 * - `pointer-events-none` guarantees it never blocks scroll, taps, or focus.
 * - Disabled on touch devices (`@media (hover: hover)`) so it doesn't run
 *   when there is no real cursor and on devices that struggle with the paint.
 * - Listens with `passive: true` to avoid blocking scroll on trackpads.
 */
export function MouseSpotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let nx = 0;
    let ny = 0;

    const apply = () => {
      el.style.setProperty("--mx", `${nx}px`);
      el.style.setProperty("--my", `${ny}px`);
      frame = 0;
    };

    const onMove = (e: MouseEvent) => {
      // Coordinates relative to the container so the glow tracks the
      // hero/section even if the page has scrolled.
      const rect = el.getBoundingClientRect();
      nx = e.clientX - rect.left;
      ny = e.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 mouse-spotlight",
        // Hide on touch — the effect needs a hover-capable pointer.
        "hidden [@media(hover:hover)]:block",
        className,
      )}
    />
  );
}
