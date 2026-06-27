"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

type Slide = { src: string; caption: string };

type Props = {
  images: Slide[] | undefined;
  alt: string;
};

export function ProjectImageSlider({ images, alt }: Props) {
  const { t } = useLanguage();
  const slides = images ?? [];
  const total = slides.length;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      const wrapped = ((next % total) + total) % total;
      setDirection(wrapped > index ? 1 : -1);
      setIndex(wrapped);
    },
    [index, total]
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (total === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, total]);

  if (total === 0) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 text-muted-foreground">
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <ImageOff size={32} className="opacity-40" />
          <p className="text-sm font-semibold">{t("pages.projects.no_image")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-black/5 dark:bg-white/[0.03]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.38, ease: [0.22, 0.9, 0.32, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) next();
              else if (info.offset.x > 60) prev();
            }}
            className="flex cursor-grab items-center justify-center active:cursor-grabbing"
          >
            <Image
              src={slides[index].src}
              alt={`${alt} — ${slides[index].caption}`}
              width={1600}
              height={900}
              sizes="(min-width: 1024px) 80vw, 100vw"
              draggable={false}
              className="max-h-[40vh] sm:max-h-[55vh] w-full object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {/* Caption annotation — left margin, arrow points right, light/dark adaptive */}
        <AnimatePresence mode="wait">
          {slides[index].caption && (
            <motion.div
              key={slides[index].caption}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
              className="absolute left-2 top-12 flex flex-col items-start pointer-events-none z-10"
            >
              {/* Label pill — adaptive light/dark */}
              <motion.div
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="rounded-full border border-primary/50 bg-background/90 px-3 py-1.5 backdrop-blur-md shadow-[0_2px_12px_hsl(var(--primary)/0.2)]"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary whitespace-nowrap">
                  {slides[index].caption}
                </p>
              </motion.div>

              {/* Curved arrow — uses currentColor = primary */}
              <svg
                width="68" height="50"
                viewBox="0 0 68 50"
                fill="none"
                className="ml-3 text-primary drop-shadow-sm"
              >
                <motion.path
                  d="M 4 6 C 4 26, 26 40, 64 30"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 0.9, 0.32, 1] }}
                />
                <motion.path
                  d="M 59 25 L 64 30 L 59 35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.2, delay: 0.95 }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prev / Next — larger tap area for mobile */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label={t("pages.projects.prev_slide")}
              className="group/btn absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-primary/30 bg-background/80 text-primary backdrop-blur-md transition active:scale-95 hover:bg-primary/10 dark:border-white/20 dark:bg-black/40 dark:text-white dark:hover:bg-black/70"
            >
              <ChevronLeft size={18} className="transition-transform group-hover/btn:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t("pages.projects.next_slide")}
              className="group/btn absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-primary/30 bg-background/80 text-primary backdrop-blur-md transition active:scale-95 hover:bg-primary/10 dark:border-white/20 dark:bg-black/40 dark:text-white dark:hover:bg-black/70"
            >
              <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </>
        )}

        {/* Dots — padded for easier tap */}
        {total > 1 && (
          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2 py-1">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="p-1.5 -m-1.5"
              >
                <span className={`block rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-5 h-1.5 bg-primary dark:bg-white"
                    : "w-1.5 h-1.5 bg-primary/40 dark:bg-white/40 hover:bg-primary/70 dark:hover:bg-white/70"
                }`} />
              </button>
            ))}
          </div>
        )}

        {/* Counter — adaptive */}
        <div className="absolute right-3 top-3 rounded-full border border-primary/25 bg-background/80 px-2.5 py-0.5 text-[10px] font-bold tabular-nums text-primary backdrop-blur-md dark:border-white/20 dark:bg-black/50 dark:text-white">
          {index + 1}/{total}
        </div>
      </div>

    </div>
  );
}
