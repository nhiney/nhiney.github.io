"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { Project } from "@/data/cv";
import { cn } from "@/lib/utils";

// ── Lightbox ──────────────────────────────────────────────────────────────────

function ImageLightbox({ slides, startIndex, onClose }: {
  slides: { src: string; caption: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const total = slides.length;
  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    const saved = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = saved; };
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative max-h-[92vh] max-w-[92vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img key={idx} src={slides[idx].src} alt={slides[idx].caption}
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.15 }}
            draggable={false} className="max-h-[88vh] max-w-[88vw] rounded-2xl object-contain shadow-2xl"
          />
        </AnimatePresence>
        {slides[idx].caption && (
          <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-10">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/80">{slides[idx].caption}</p>
          </div>
        )}
      </motion.div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 border border-white/10 px-3 py-1 text-[11px] font-semibold text-white/70 backdrop-blur-sm">
        {idx + 1} / {total}
      </div>
      <button type="button" onClick={onClose} className="absolute right-5 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20">
        <X size={16} />
      </button>
      {total > 1 && (
        <>
          <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-5 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"><ChevronLeft size={18} /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-5 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"><ChevronRight size={18} /></button>
        </>
      )}
    </motion.div>
  );
}

// ── Accent per project ────────────────────────────────────────────────────────

// Single-accent system — every card shares the primary tone for a clean,
// professional listing (no per-card rainbow rotation).
const PRIMARY_ACCENT = {
  stripe: "from-primary/60 to-transparent",
  tag: "bg-primary/10 text-primary border-primary/20",
  dot: "bg-primary",
} as const;
const ACCENTS = [PRIMARY_ACCENT, PRIMARY_ACCENT, PRIMARY_ACCENT, PRIMARY_ACCENT] as const;

// ── Image slider (left frame) ─────────────────────────────────────────────────

function CardSlider({ slides, onLightbox }: {
  slides: { src: string; caption: string }[];
  onLightbox: (i: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(0);
  const [hovered, setHovered] = useState(false);
  const total = slides.length;

  const goTo = useCallback((next: number) => {
    const n = ((next % total) + total) % total;
    setDir(n > idx ? 1 : -1);
    setIdx(n);
  }, [idx, total]);

  const goPrev = useCallback((e: React.MouseEvent) => { e.stopPropagation(); goTo(idx - 1); }, [goTo, idx]);
  const goNext = useCallback((e: React.MouseEvent) => { e.stopPropagation(); goTo(idx + 1); }, [goTo, idx]);

  // Auto-play while hovering
  useEffect(() => {
    if (!hovered || total <= 1) return;
    const id = setInterval(() => {
      setDir(1);
      setIdx((i) => (i + 1) % total);
    }, 1800);
    return () => clearInterval(id);
  }, [hovered, total]);

  if (total === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <ImageOff size={28} className="text-muted-foreground opacity-20" />
      </div>
    );
  }

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className="relative flex-1 cursor-zoom-in"
        onClick={() => onLightbox(idx)}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={idx}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            src={slides[idx].src}
            alt={slides[idx].caption}
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain p-3"
          />
        </AnimatePresence>

        {/* Prev / Next */}
        {total > 1 && (
          <>
            <button type="button" onClick={goPrev}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-black/80 active:scale-95">
              <ChevronLeft size={14} />
            </button>
            <button type="button" onClick={goNext}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-black/80 active:scale-95">
              <ChevronRight size={14} />
            </button>
          </>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-white/5 bg-black/30 px-3 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          {total > 1 && slides.map((_, i) => (
            <button key={i} type="button" onClick={(e) => { e.stopPropagation(); goTo(i); }}
              aria-label={`Slide ${i + 1}`}
              className={cn("rounded-full transition-all duration-300", i === idx ? "w-4 h-1 bg-white" : "w-1 h-1 bg-white/35 hover:bg-white/60")}
            />
          ))}
        </div>
        <span className="text-[9px] font-bold tabular-nums text-white/50">
          {String(idx + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

type Props = { project: Project; index: number; onOpen: () => void; delay?: number };

export function ProjectGridCard({ project, index, onOpen, delay = 0 }: Props) {
  const { t } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [contentFocused, setContentFocused] = useState(false);
  const accent = ACCENTS[index % ACCENTS.length];

  const slides = useMemo(() => {
    const g = project.gallery ?? [];
    if (g.length > 0) return g;
    if (project.cover) return [{ src: project.cover, caption: project.title }];
    return [];
  }, [project.gallery, project.cover, project.title]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex w-full flex-col sm:flex-row items-stretch gap-4 sm:gap-5"
    >
      {/* ── Frame 1: Image ── */}
      <motion.div
        animate={{ opacity: contentFocused ? 0.45 : 1, scale: contentFocused ? 0.985 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full sm:flex-1 overflow-hidden rounded-2xl border border-border/50 bg-black/25 dark:bg-black/40 min-h-[220px] sm:min-h-[320px] relative"
      >
        <div className={cn("absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r z-10", accent.stripe)} />
        <CardSlider slides={slides} onLightbox={(i) => setLightboxIndex(i)} />
      </motion.div>

      {/* ── Frame 2: Content ── */}
      <motion.div
        whileHover={{ y: -3 }}
        onHoverStart={() => setContentFocused(true)}
        onHoverEnd={() => setContentFocused(false)}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={onOpen}
        className="group/content w-full sm:flex-1 flex flex-col justify-between rounded-2xl border border-border/50 bg-card px-6 py-5 cursor-pointer relative overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.2)]"
      >
        {/* Ambient glow on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/0 transition-all duration-500 group-hover/content:bg-primary/[0.03]" />

        {/* top stripe */}
        <div className={cn("absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r", accent.stripe)} />

        {/* Header */}
        <div className="space-y-3 relative">
          <span className="text-[10px] font-bold tabular-nums text-muted-foreground/25 transition-colors duration-300 group-hover/content:text-muted-foreground/50">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-xl font-bold tracking-tight leading-snug text-primary">
            {project.title}
          </h3>
          {project.role && (
            <p className="text-sm italic text-muted-foreground">
              {project.role} · {project.period}
            </p>
          )}
        </div>

        {/* One-liner summary */}
        {project.problem && (
          <p className="relative mt-4 text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover/content:text-foreground/70">
            {project.problem}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-5 space-y-4 relative">
          <div className="h-px bg-border/40 transition-colors duration-300 group-hover/content:bg-primary/20" />

          {/* Tech pills */}
          <div className="flex flex-wrap gap-1.5">
            {project.techPills.slice(0, 5).map((tag) => (
              <span key={tag} className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-medium", accent.tag)}>
                {tag}
              </span>
            ))}
            {project.techPills.length > 5 && (
              <span className="rounded-full border border-border/50 bg-muted/20 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                +{project.techPills.length - 5}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition-all duration-300 group-hover/content:bg-primary group-hover/content:text-white group-hover/content:border-primary group-hover/content:gap-2.5">
            {t("pages.projects.click_to_explore")}
            <ArrowUpRight size={13} className="transition-transform duration-300 group-hover/content:translate-x-0.5 group-hover/content:-translate-y-0.5" />
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox
            slides={slides}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
