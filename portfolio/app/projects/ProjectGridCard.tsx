"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Lightbulb,
  Maximize2,
  User,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { Project } from "@/data/cv";
import { BulletList, TONE_PALETTE } from "./ZoomTile";
import type { Tone } from "./ZoomTile";
import { cn } from "@/lib/utils";

// ── Lightbox ──────────────────────────────────────────────────────────────────

function ImageLightbox({
  slides,
  startIndex,
  onClose,
}: {
  slides: { src: string; caption: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const total = slides.length;

  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prev_ = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev_;
    };
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Image */}
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 0.9, 0.32, 1] }}
        className="relative flex max-h-[92vh] max-w-[92vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={slides[idx].src}
            alt={slides[idx].caption}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            draggable={false}
            className="max-h-[88vh] max-w-[88vw] rounded-xl object-contain shadow-2xl"
          />
        </AnimatePresence>

        {/* Caption */}
        {slides[idx].caption && (
          <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-6">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-white/90">
              {slides[idx].caption}
            </p>
          </div>
        )}
      </motion.div>

      {/* Counter */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
        {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/20"
      >
        <X size={18} />
      </button>

      {/* Prev / Next */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </motion.div>
  );
}

// ── Status pill ───────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: Project["status"] }) {
  const tone = {
    shipped: "bg-emerald-500/15 border-emerald-400/40 text-emerald-300",
    duration: "bg-blue-500/15 border-blue-400/40 text-blue-300",
    ongoing:  "bg-amber-500/15 border-amber-400/40 text-amber-200",
  }[status.tone];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-widest backdrop-blur-md ${tone}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.label}
    </span>
  );
}

// ── Image deck helpers ────────────────────────────────────────────────────────

const CYCLE_MS = 1100;
const STACK_DEPTH = 3;

function slotStyle(slot: number) {
  const rotate = slot === 0 ? 0 : (slot % 2 === 0 ? 1 : -1) * slot * 2.4;
  return {
    y: slot * 14,
    scale: 1 - slot * 0.045,
    rotate,
    zIndex: 40 - slot * 5,
    opacity: 1 - slot * 0.12,
  };
}

// ── Info panel (tab switcher) ─────────────────────────────────────────────────

type TabKey = "problem" | "approach" | "results" | "tech";

const TAB_STYLES: Record<TabKey, { hover: string; active: string; panel: string }> = {
  problem:  {
    hover:  "hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/[0.06]",
    active: "text-red-400 border-red-500/40 bg-red-500/10",
    panel:  "border-red-500/20 bg-red-500/[0.04]",
  },
  approach: {
    hover:  "hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/[0.06]",
    active: "text-amber-400 border-amber-500/40 bg-amber-500/10",
    panel:  "border-amber-500/20 bg-amber-500/[0.04]",
  },
  results:  {
    hover:  "hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/[0.06]",
    active: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    panel:  "border-emerald-500/20 bg-emerald-500/[0.04]",
  },
  tech:     {
    hover:  "hover:text-violet-400 hover:border-violet-500/40 hover:bg-violet-500/[0.06]",
    active: "text-violet-400 border-violet-500/40 bg-violet-500/10",
    panel:  "border-violet-500/20 bg-violet-500/[0.04]",
  },
};

function InfoPanel({ project, t }: { project: Project; t: (k: string) => string }) {
  const [active, setActive] = useState<TabKey>("problem");

  const tabs: { key: TabKey; icon: LucideIcon; label: string }[] = [
    { key: "problem",  icon: AlertCircle,  label: t("pages.projects.problem_label")  },
    { key: "approach", icon: Lightbulb,    label: t("pages.projects.approach_label") },
    { key: "results",  icon: CheckCircle2, label: t("pages.projects.results_label")  },
    { key: "tech",     icon: Wrench,       label: t("pages.projects.tech_label")     },
  ];

  const content: Record<TabKey, React.ReactNode> = {
    problem:  (
      <p className="text-[14px] leading-[1.75] text-foreground/80">
        {project.problem}
      </p>
    ),
    approach: <BulletList items={project.contributions.slice(0, 5)} tone="amber" />,
    results:  <BulletList items={project.results} tone="emerald" />,
    tech: (
      <div className="flex flex-wrap gap-2">
        {project.techPills.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-violet-500/25 bg-violet-500/[0.06] px-3.5 py-1.5 text-[12px] font-semibold text-foreground/85"
          >
            {tag}
          </span>
        ))}
      </div>
    ),
  };

  return (
    <div className="space-y-4">
      {/* Tab strip */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ key, icon: Icon, label }) => {
          const s = TAB_STYLES[key];
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onMouseEnter={() => setActive(key)}
              onClick={(e) => { e.stopPropagation(); setActive(key); }}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-200",
                isActive ? s.active : cn("border-border/50 text-muted-foreground", s.hover),
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Content panel — fixed min-height so card never jumps */}
      <div
        className={cn(
          "relative min-h-[140px] overflow-hidden rounded-2xl border p-5 transition-colors duration-300",
          TAB_STYLES[active].panel,
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {content[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Mobile info tile ──────────────────────────────────────────────────────────

function MobileInfoTile({
  icon: Icon,
  label,
  tone,
  children,
}: {
  icon: LucideIcon;
  label: string;
  tone: Tone;
  children: React.ReactNode;
}) {
  const palette = TONE_PALETTE[tone];
  return (
    <div className={`rounded-2xl border ${palette.card} p-3.5`}>
      <div className="mb-2.5 flex items-center gap-2">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${palette.icon}`}>
          <Icon size={12} />
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground">{label}</span>
      </div>
      <div className="text-[12px] leading-[1.55] text-foreground/75">{children}</div>
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

type Props = {
  project: Project;
  index: number;
  onOpen: () => void;
  flip?: boolean;
  delay?: number;
};

const LINGER_MS = 550;

export function ProjectGridCard({ project, index, onOpen, flip = false, delay = 0 }: Props) {
  const { t } = useLanguage();

  const slides = useMemo<{ src: string; caption: string }[]>(() => {
    const gallery = project.gallery ?? [];
    if (gallery.length > 0) return gallery;
    if (project.cover) return [{ src: project.cover, caption: project.title }];
    return [];
  }, [project.gallery, project.cover, project.title]);

  const reel = useMemo(() => slides.map((s) => s.src), [slides]);

  const total = reel.length;
  const [front, setFront] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const liftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef(0);
  const swiped = useRef(false);

  useEffect(() => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
    if (!hovered || total <= 1) return;
    timer.current = setInterval(() => setFront((f) => (f + 1) % total), CYCLE_MS);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [hovered, total]);

  useEffect(() => {
    if (hovered) {
      if (liftTimer.current) { clearTimeout(liftTimer.current); liftTimer.current = null; }
      setLifted(true);
    } else {
      liftTimer.current = setTimeout(() => setLifted(false), LINGER_MS);
    }
    return () => { if (liftTimer.current) clearTimeout(liftTimer.current); };
  }, [hovered]);

  const visible = useMemo(() => {
    const items: { idx: number; slot: number }[] = [];
    const count = Math.min(STACK_DEPTH, total);
    for (let i = 0; i < count; i++) items.push({ idx: (front + i) % total, slot: i });
    return items;
  }, [front, total]);

  const onActivate = () => {
    if (swiped.current) { swiped.current = false; return; }
    onOpen();
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onActivate(); }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: { type: "spring", stiffness: 260, damping: 26, delay },
      }}
      style={{ zIndex: lifted ? 60 : "auto", position: "relative" }}
      className="group w-full cursor-pointer rounded-[2rem] border border-border bg-card text-left outline-none ring-1 ring-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-[0_32px_100px_-35px_hsl(var(--primary)/0.22)] focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={`${project.title} — ${t("pages.projects.click_to_explore")}`}
    >
      {/* ── Top: image deck + header ──────────────────────────────────────── */}
      <div className="grid overflow-hidden rounded-t-[2rem] md:grid-cols-[1.05fr_1fr]">

        {/* Image deck */}
        <div
          className={cn(
            "relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-muted/30 to-black/40 md:aspect-auto md:min-h-[440px]",
            flip ? "md:order-2 md:border-l" : "md:order-1 md:border-r",
            "border-b border-border/60 md:border-b-0",
          )}
        >
          {total === 0 ? (
            <div className="grid h-full w-full place-items-center text-muted-foreground">
              <ImageOff size={40} className="opacity-30" />
            </div>
          ) : (
            <div
              className="absolute inset-8 sm:inset-10"
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; swiped.current = false; }}
              onTouchEnd={(e) => {
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(dx) > 40 && total > 1) {
                  setFront((f) => dx < 0 ? (f + 1) % total : (f - 1 + total) % total);
                  swiped.current = true;
                }
              }}
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(front % total); }}
            >
              <AnimatePresence initial={false}>
                {visible.map(({ idx, slot }) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 100, scale: 0.85, rotate: -3, opacity: 0, zIndex: 1 }}
                    animate={slotStyle(slot)}
                    exit={{
                      y: 260, rotate: 12, opacity: 0, scale: 0.92, zIndex: 60,
                      transition: { duration: 0.55, ease: [0.4, 0.0, 0.6, 1] },
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 26 }}
                    className="absolute inset-0 overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]"
                  >
                    <img
                      src={reel[idx]}
                      alt={`${project.title} — ${idx + 1}/${total}`}
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="absolute inset-x-6 top-6 z-[70] flex items-center justify-between sm:inset-x-8 sm:top-8">
            <span className="rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white backdrop-blur-md">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(front % total); }}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100 hover:bg-white/20"
                aria-label="Xem ảnh toàn màn hình"
              >
                <Maximize2 size={13} />
              </button>
              <StatusPill status={project.status} />
            </div>
          </div>

          {total > 1 && (
            <div className="absolute inset-x-6 bottom-6 z-[70] flex justify-center sm:inset-x-8 sm:bottom-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 text-[10.5px] font-black uppercase tracking-[0.25em] text-white/95 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 opacity-60" />
                {String((front % total) + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                <span className="mx-1 h-3 w-px bg-white/30" />
                <span className="[@media(hover:none)]:hidden">
                  {hovered ? t("pages.projects.gallery_label") : t("pages.projects.hover_hint")}
                </span>
                <span className="hidden [@media(hover:none)]:inline">Swipe</span>
              </span>
            </div>
          )}
        </div>

        {/* Header summary */}
        <div
          className={cn(
            "flex flex-col gap-5 p-8 sm:p-10 md:p-12",
            flip ? "md:order-1" : "md:order-2",
          )}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Calendar size={13} />
            {project.period}
          </span>

          <div className="space-y-2">
            <h3 className="text-3xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary md:text-[2.5rem] md:leading-[1.06]">
              {project.title}
            </h3>
            {project.role && (
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <User size={14} className="text-primary" />
                {project.role}
              </p>
            )}
          </div>

          <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
            {project.problem}
          </p>

          <div className="mt-auto space-y-4">
            {/* Tech pill preview */}
            <div className="flex flex-wrap gap-1.5">
              {project.techPills.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/60 bg-secondary/40 px-2.5 py-1 text-[10.5px] font-semibold text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {project.techPills.length > 3 && (
                <span className="rounded-full border border-border/60 bg-secondary/40 px-2.5 py-1 text-[10.5px] font-semibold text-muted-foreground">
                  +{project.techPills.length - 3}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
                {t("pages.projects.gallery_label")} · {total}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-primary transition-all group-hover:border-primary/50 group-hover:bg-primary/15">
                {t("pages.projects.click_to_explore")}
                <ArrowUpRight
                  size={13}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom (mobile): 2×2 info grid ───────────────────────────────── */}
      <div className="rounded-b-[2rem] border-t border-border/60 px-4 py-5 md:hidden">
        <div className="grid grid-cols-2 gap-2.5">
          <MobileInfoTile icon={AlertCircle} label={t("pages.projects.problem_label")} tone="red">
            {project.problem}
          </MobileInfoTile>
          <MobileInfoTile icon={Lightbulb} label={t("pages.projects.approach_label")} tone="amber">
            <ul className="space-y-1">
              {project.contributions.slice(0, 3).map((c, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/70" />
                  {c}
                </li>
              ))}
            </ul>
          </MobileInfoTile>
          <MobileInfoTile icon={CheckCircle2} label={t("pages.projects.results_label")} tone="emerald">
            <ul className="space-y-1">
              {project.results.slice(0, 3).map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {r}
                </li>
              ))}
            </ul>
          </MobileInfoTile>
          <MobileInfoTile icon={Wrench} label={t("pages.projects.tech_label")} tone="violet">
            <div className="flex flex-wrap gap-1">
              {project.techPills.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-violet-500/25 bg-violet-500/[0.06] px-2 py-0.5 text-[10px] font-semibold text-foreground/85"
                >
                  {tag}
                </span>
              ))}
            </div>
          </MobileInfoTile>
        </div>
      </div>

      {/* ── Bottom (desktop): tab panel ──────────────────────────────────── */}
      <div className="hidden rounded-b-[2rem] border-t border-border/60 px-8 py-8 md:block sm:px-10">
        <InfoPanel project={project} t={t} />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-transparent transition-all group-hover:ring-primary/25" />

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
