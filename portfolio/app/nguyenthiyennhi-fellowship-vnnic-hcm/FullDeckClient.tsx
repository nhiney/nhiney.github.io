"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SLIDES } from "./_deck";
import { DeckBackground, TOTAL_SLIDES } from "./_deck/shared";

export function FullDeckClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef(false);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = Math.round(el.scrollLeft / window.innerWidth);
        setActive(Math.max(0, Math.min(TOTAL_SLIDES - 1, idx)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // Let the slide's internal vertical scroller absorb the gesture first.
      const target = e.target as HTMLElement | null;
      const scroller = target?.closest<HTMLElement>("[data-slide-scroller]");
      if (scroller) {
        const atTop = scroller.scrollTop <= 0;
        const atBottom =
          scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
        const goingDown = e.deltaY > 0;
        const goingUp = e.deltaY < 0;
        if ((goingDown && !atBottom) || (goingUp && !atTop)) {
          return;
        }
      }
      e.preventDefault();
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      const idx = Math.round(el.scrollLeft / window.innerWidth);
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(TOTAL_SLIDES - 1, idx + dir));
      el.scrollTo({
        left: next * window.innerWidth,
        behavior: reducedMotion ? "auto" : "smooth",
      });
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 560);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [reducedMotion]);

  useEffect(() => {
    const goTo = (idx: number) => {
      const el = containerRef.current;
      if (!el) return;
      const target = Math.max(0, Math.min(TOTAL_SLIDES - 1, idx));
      el.scrollTo({
        left: target * window.innerWidth,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (["ArrowRight", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        goTo(active + 1);
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(active - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(TOTAL_SLIDES - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, reducedMotion]);

  useEffect(() => {
    const onResize = () => {
      const el = containerRef.current;
      if (!el) return;
      el.scrollTo({ left: active * window.innerWidth, behavior: "auto" });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  const scrollTo = (idx: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({
      left: idx * window.innerWidth,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const currentLabel = SLIDES[active]?.label ?? "";

  return (
    <div className="relative isolate bg-background text-foreground">
      <DeckBackground />

      {/* Sticky top: progress bar + slide meta sits just under global navbar (h-16). */}
      <div className="sticky top-16 z-30">
        <motion.div
          aria-hidden
          className="h-[2px] w-full origin-left bg-primary/80"
          animate={{ scaleX: (active + 1) / TOTAL_SLIDES }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="pointer-events-none absolute right-4 top-3 flex items-center gap-2">
          <div className="pointer-events-auto rounded-full border border-border/60 bg-card/85 px-3 py-1.5 font-mono text-[10px] tracking-widest text-foreground/80 backdrop-blur-md">
            <span className="text-primary">{String(active + 1).padStart(2, "0")}</span>
            <span className="opacity-50"> / {String(TOTAL_SLIDES).padStart(2, "0")}</span>
          </div>
          <div className="pointer-events-auto hidden rounded-full border border-border/60 bg-card/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/80 backdrop-blur-md sm:block">
            {currentLabel}
          </div>
        </div>
      </div>

      {/* Horizontal snap deck. Height is locked to viewport minus navbar so
          the snap behaves consistently; each slide owns its own vertical
          scroller for long content. */}
      <div
        ref={containerRef}
        className="full-deck relative w-full overflow-x-scroll overflow-y-hidden overscroll-contain"
        style={{
          height: "calc(100vh - 4rem)",
          minHeight: "640px",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style jsx global>{`
          .full-deck::-webkit-scrollbar { display: none; }
        `}</style>

        <div className="flex h-full w-max">
          {SLIDES.map((s, i) => (
            <s.Component key={s.id} index={i} />
          ))}
        </div>
      </div>

      {/* Sticky bottom navigation cluster (prev / dots / next) */}
      <div className="sticky bottom-0 z-30 flex items-center justify-center gap-2 px-4 pb-4 pt-3 sm:gap-3 sm:pb-5">
        <button
          type="button"
          onClick={() => scrollTo(active - 1)}
          aria-label="Previous slide"
          disabled={active === 0}
          className="pointer-events-auto group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/90 text-foreground/80 backdrop-blur-md transition-all hover:scale-110 hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 disabled:hover:border-border/60 disabled:hover:text-foreground/80"
        >
          <ArrowLeft size={14} />
        </button>

        <nav
          aria-label="Slide navigation"
          className="pointer-events-auto flex max-w-[min(80vw,640px)] items-center gap-1.5 overflow-x-auto rounded-full border border-border/60 bg-card/90 px-3 py-2.5 backdrop-blur-md"
          style={{ scrollbarWidth: "none" }}
        >
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Slide ${i + 1} — ${s.label}`}
              aria-current={i === active}
              className="group relative flex h-3 shrink-0 items-center justify-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-5 bg-primary"
                    : "w-1.5 bg-foreground/25 group-hover:bg-foreground/55"
                }`}
              />
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => scrollTo(active + 1)}
          aria-label="Next slide"
          disabled={active === TOTAL_SLIDES - 1}
          className="pointer-events-auto group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/90 text-foreground/80 backdrop-blur-md transition-all hover:scale-110 hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 disabled:hover:border-border/60 disabled:hover:text-foreground/80"
        >
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
