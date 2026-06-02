"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="deck-inter relative isolate bg-background text-foreground">
      <DeckBackground />

      {/* ── Top chrome: progress bar + counter + label ── */}
      <div className="sticky top-16 z-30">
        {/* Progress track */}
        <div className="relative h-[3px] w-full bg-border/30">
          <motion.div
            aria-hidden
            className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-primary to-primary/70"
            animate={{ scaleX: (active + 1) / TOTAL_SLIDES }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "100%" }}
          />
        </div>

        {/* Counter + label chips */}
        <div className="pointer-events-none absolute right-4 top-3 flex items-center gap-2">
          <motion.div
            layout
            className="pointer-events-auto flex items-center gap-0 overflow-hidden rounded-full border border-border/55 bg-card/92 shadow-sm backdrop-blur-md"
          >
            <span className="px-3 py-1.5 tabular-nums text-[10px] font-bold tracking-widest text-primary">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="h-3 w-px bg-border/60" />
            <span className="px-3 py-1.5 tabular-nums text-[10px] tracking-widest text-muted-foreground/60">
              {String(TOTAL_SLIDES).padStart(2, "0")}
            </span>
          </motion.div>
          <div className="pointer-events-auto hidden rounded-full border border-border/55 bg-card/92 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground shadow-sm backdrop-blur-md sm:block">
            {currentLabel}
          </div>
        </div>
      </div>

      {/* ── Horizontal snap deck ── */}
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

      {/* ── Bottom navigation ── */}
      <div className="sticky bottom-0 z-30 flex items-center justify-center gap-3 px-4 pb-5 pt-2.5 sm:gap-4">
        {/* Prev */}
        <button
          type="button"
          onClick={() => scrollTo(active - 1)}
          aria-label="Previous slide"
          disabled={active === 0}
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/55 bg-card/92 text-foreground/60 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-primary/55 hover:text-primary hover:shadow-primary/15 disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:scale-100 disabled:hover:border-border/55 disabled:hover:text-foreground/60"
        >
          <ChevronLeft size={15} strokeWidth={2.5} />
        </button>

        {/* Dots nav */}
        <div className="flex flex-col items-center gap-1.5">
          <nav
            aria-label="Slide navigation"
            className="flex max-w-[min(80vw,600px)] items-center gap-1.5 overflow-x-auto rounded-full border border-border/55 bg-card/92 px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-md"
            style={{ scrollbarWidth: "none" }}
          >
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Slide ${i + 1} — ${s.label}`}
                aria-current={i === active ? true : undefined}
                className="group relative flex h-3 shrink-0 items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === active
                      ? "h-[5px] w-6 bg-primary shadow-sm shadow-primary/50"
                      : "h-[5px] w-[5px] bg-foreground/18 group-hover:bg-foreground/40"
                  }`}
                />
              </button>
            ))}
          </nav>
          {/* Current slide label under dots */}
          <motion.p
            key={currentLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-[9px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/45"
          >
            {currentLabel}
          </motion.p>
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => scrollTo(active + 1)}
          aria-label="Next slide"
          disabled={active === TOTAL_SLIDES - 1}
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/55 bg-card/92 text-foreground/60 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-primary/55 hover:text-primary hover:shadow-primary/15 disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:scale-100 disabled:hover:border-border/55 disabled:hover:text-foreground/60"
        >
          <ChevronRight size={15} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
