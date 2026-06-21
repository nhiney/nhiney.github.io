"use client";

/**
 * Paper Diorama — a CSS-3D "shadow box". Layers of paper sit at different
 * `translateZ` depths inside a `preserve-3d` stage; the cursor rotates the whole
 * stage and the browser's perspective turns that into real depth parallax (near
 * props shift more than the backdrop). No WebGL — works fine under static export.
 *
 * Composition of transforms:
 *   perspective container → stage (mouse rotateX/rotateY, sprung) →
 *   idle wrapper (CSS "breathing") → depth layers (static translateZ).
 */

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import {
  PaperMascot,
  DoodleSparkle,
  DoodleLeaf,
  DoodleBook,
} from "./Doodles";
import { cn } from "@/lib/utils";

/** One depth plane in the box. `z` is its translateZ (px); larger = nearer. */
function Layer({
  z,
  className,
  children,
}: {
  z: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

export function PaperDiorama({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Normalised cursor position, -0.5 … 0.5, sprung for a soft follow.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 110, damping: 16, mass: 0.7 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateY = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-13, 13]);

  function handleMove(e: React.PointerEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <div className={cn("relative mx-auto w-full max-w-[20rem]", className)}>
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        className="relative [perspective:1100px]"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative"
        >
          <div
            className="diorama-idle relative aspect-[4/5]"
            style={{
              transformStyle: "preserve-3d",
              filter: "drop-shadow(0 34px 34px rgba(0,0,0,0.28))",
            }}
          >
            {/* ── backdrop (deepest) — the "photo" sky ── */}
            <Layer z={-72} className="overflow-hidden rounded-[12px]">
              <div className="notebook-grid h-full w-full bg-gradient-to-b from-secondary via-paper-sheet to-paper-sheet" />
            </Layer>

            {/* ── far doodles — faint, monochrome ── */}
            <Layer z={-46}>
              <DoodleSparkle className="absolute right-6 top-7 h-5 w-5 text-muted-foreground/35" />
              <DoodleSparkle className="absolute left-9 top-6 h-4 w-4 text-muted-foreground/30" />
            </Layer>

            {/* ── the star of the show ── */}
            <Layer z={4} className="flex items-end justify-center">
              <PaperMascot className="h-[74%] w-auto" />
            </Layer>

            {/* ── foreground props (nearest, biggest parallax) ── */}
            <Layer z={32}>
              <DoodleLeaf className="absolute -bottom-1 left-4 h-14 w-14 text-muted-foreground/45" />
              <DoodleBook className="absolute bottom-3 right-3 h-12 w-12 text-muted-foreground/45" />
            </Layer>

            {/* ── the frame / matboard window (front face of the box) ── */}
            <Layer z={58} className="rounded-[14px] border-[14px] border-paper-sheet">
              <div
                className="absolute inset-0 rounded-[2px]"
                style={{ boxShadow: "inset 0 0 26px 6px hsl(var(--paper-ink) / 0.18)" }}
              />
            </Layer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
