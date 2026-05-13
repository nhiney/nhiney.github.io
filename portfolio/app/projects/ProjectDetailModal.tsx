"use client";

import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Lightbulb,
  User,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { ProjectImageSlider } from "./ProjectImageSlider";
import { BulletList, ZoomTile } from "./ZoomTile";
import { useLanguage } from "@/context/LanguageContext";
import type { Project } from "@/data/cv";

function StatusPill({ status }: { status: Project["status"] }) {
  const tone = {
    shipped: "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
    duration: "bg-blue-500/10 border-blue-500/30 text-blue-500",
    ongoing: "bg-amber-500/10 border-amber-500/30 text-amber-500",
  }[status.tone];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-widest ${tone}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.label}
    </span>
  );
}

type Props = {
  project: Project | null;
  index: number;
  onClose: () => void;
  githubFallback: string;
};

export function ProjectDetailModal({ project, index, onClose, githubFallback }: Props) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-md sm:py-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.article
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-5xl rounded-3xl border border-border bg-card shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t("pages.projects.close_modal")}
              className="absolute right-4 top-4 z-[80] grid h-10 w-10 place-items-center rounded-full border border-border bg-background/90 text-foreground backdrop-blur-md transition hover:rotate-90 hover:bg-background"
            >
              <X size={18} />
            </button>

            <header className="space-y-5 px-6 pb-6 pt-8 sm:px-10 sm:pt-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <StatusPill status={project.status} />
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Calendar size={13} />
                  {project.period}
                </span>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl">
                  {project.title}
                </h2>
                {project.role && (
                  <p className="inline-flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
                    <User size={14} className="text-primary" />
                    {project.role}
                  </p>
                )}
              </div>
            </header>

            <div className="px-6 sm:px-10">
              <ProjectImageSlider images={project.gallery} alt={project.title} />
            </div>

            <p className="mt-6 hidden px-6 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground md:block sm:px-10">
              {t("pages.projects.hover_hint")}
            </p>

            <div className="grid gap-6 px-6 py-10 sm:grid-cols-2 sm:gap-8 sm:px-10 sm:py-14">
              <div className="sm:col-span-2">
                <ZoomTile
                  icon={AlertCircle}
                  label={t("pages.projects.problem_label")}
                  tone="red"
                  origin="tc"
                >
                  {project.problem}
                </ZoomTile>
              </div>

              <ZoomTile
                icon={Lightbulb}
                label={t("pages.projects.approach_label")}
                tone="amber"
                origin="tl"
              >
                <BulletList items={project.contributions.slice(0, 5)} tone="amber" />
              </ZoomTile>

              <ZoomTile
                icon={CheckCircle2}
                label={t("pages.projects.results_label")}
                tone="emerald"
                origin="tr"
              >
                <BulletList items={project.results} tone="emerald" />
              </ZoomTile>

              <div className="sm:col-span-2">
                <ZoomTile
                  icon={Wrench}
                  label={t("pages.projects.tech_label")}
                  tone="violet"
                  origin="bc"
                >
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
                </ZoomTile>
              </div>
            </div>

            <footer className="flex items-center justify-between gap-4 border-t border-border/60 px-6 py-5 sm:px-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                ESC ↹
              </span>
              <Link
                href={project.github ?? githubFallback}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-primary transition-all hover:bg-primary/10"
              >
                {t("pages.projects.view_repo")}
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                />
              </Link>
            </footer>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
