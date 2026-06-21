"use client";

import * as React from "react";
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
import { useLanguage } from "@/context/LanguageContext";
import type { Project } from "@/data/cv";
import { cn } from "@/lib/utils";

function SectionBlock({
  icon: Icon,
  label,
  accent,
  children,
}: {
  icon: React.ElementType;
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md", accent)}>
          {/* createElement avoids the `never`-typed JSX attributes a polymorphic
              React.ElementType triggers under @types/react 19. */}
          {React.createElement(Icon, { size: 13 })}
        </div>
        <h3 className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </h3>
      </div>
      <div className="text-sm leading-relaxed text-foreground/80 pl-8">
        {children}
      </div>
    </div>
  );
}

function BulletList({ items, dotClass }: { items: string[]; dotClass: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className={cn("mt-[7px] h-1.5 w-1.5 rounded-full shrink-0", dotClass)} />
          {item}
        </li>
      ))}
    </ul>
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
          className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.article
            key="panel"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t("pages.projects.close_modal")}
              className="absolute right-4 top-4 z-[80] grid h-9 w-9 place-items-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur-md transition hover:text-foreground"
            >
              <X size={16} />
            </button>

            {/* Two-column layout */}
            <div className="flex flex-col md:flex-row md:min-h-[500px]">

              {/* Left — image panel */}
              <div className="md:w-[44%] shrink-0 bg-black/20 border-b md:border-b-0 md:border-r border-border/40 flex flex-col justify-center">
                <ProjectImageSlider images={project.gallery} alt={project.title} />
              </div>

              {/* Right — content panel */}
              <div className="flex-1 flex flex-col overflow-y-auto max-h-[85vh]">

                {/* Header */}
                <div className="px-6 pt-6 pb-5 sm:px-8 border-b border-border/40">
                  <div className="flex items-center gap-2 mb-3 pr-10">
                    <span className="text-xs font-bold tabular-nums text-muted-foreground/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={11} />
                      {project.period}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl pr-8">
                    {project.title}
                  </h2>
                  {project.role && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User size={12} className="text-primary" />
                      {project.role}
                    </p>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-5 sm:px-8 space-y-5 overflow-y-auto">

                  <SectionBlock
                    icon={AlertCircle}
                    label={t("pages.projects.problem_label")}
                    accent="bg-red-500/10 text-red-500"
                  >
                    <p>{project.problem}</p>
                  </SectionBlock>

                  <div className="h-px bg-border/30" />

                  <SectionBlock
                    icon={Lightbulb}
                    label={t("pages.projects.approach_label")}
                    accent="bg-amber-500/10 text-amber-500"
                  >
                    <BulletList items={project.contributions.slice(0, 5)} dotClass="bg-amber-500/60" />
                  </SectionBlock>

                  <div className="h-px bg-border/30" />

                  <SectionBlock
                    icon={CheckCircle2}
                    label={t("pages.projects.results_label")}
                    accent="bg-emerald-500/10 text-emerald-500"
                  >
                    <BulletList items={project.results} dotClass="bg-emerald-500" />
                  </SectionBlock>

                  <div className="h-px bg-border/30" />

                  <SectionBlock
                    icon={Wrench}
                    label={t("pages.projects.tech_label")}
                    accent="bg-primary/10 text-primary"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {project.techPills.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border/60 bg-secondary/40 px-2.5 py-0.5 text-xs font-medium text-foreground/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </SectionBlock>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border/40 px-6 py-3.5 sm:px-8">
                  <span className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">
                    ESC
                  </span>
                  <Link
                    href={project.github ?? githubFallback}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
                  >
                    {t("pages.projects.view_repo")}
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
