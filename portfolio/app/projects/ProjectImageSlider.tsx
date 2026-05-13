"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
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
            <img
              src={slides[index].src}
              alt={`${alt} — ${slides[index].caption}`}
              draggable={false}
              className="max-h-[68vh] w-full object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {/* Caption bar */}
        {slides[index].caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pb-3 pt-8">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 drop-shadow">
              {slides[index].caption}
            </p>
          </div>
        )}

        {/* Prev / Next */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label={t("pages.projects.prev_slide")}
              className="group/btn absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/70"
            >
              <ChevronLeft size={18} className="transition-transform group-hover/btn:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t("pages.projects.next_slide")}
              className="group/btn absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/70"
            >
              <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
        {t("pages.projects.gallery_label")} · {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
    </div>
  );
}
