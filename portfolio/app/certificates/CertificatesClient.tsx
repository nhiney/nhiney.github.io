"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ChevronDown, ExternalLink, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import certificatesData from "@/data/certificates.json";

type Certificate = (typeof certificatesData)[number];
type ViewMode = "all" | "certificates" | "courses";
type CourseEntry = { course: string; cert: Certificate };

const CATEGORY_COLORS: Record<string, string> = {
  Academic: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Mobile Development": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Backend: "bg-red-500/10 text-red-400 border-red-500/20",
  Security: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Internet Technology": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  AI: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
  "Project Management": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const CATEGORY_SHORT: Record<string, string> = {
  Backend: "BE",
  "Project Management": "PM",
  "Mobile Development": "Mobile",
  "Internet Technology": "Internet",
};

export function CertificatesClient() {
  const { t } = useLanguage();
  const [active, setActive] = useState<Certificate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = useMemo(
    () => [...new Set(certificatesData.map((c) => c.category))],
    [],
  );

  const filteredCerts = useMemo(
    () =>
      categoryFilter === "all"
        ? certificatesData
        : certificatesData.filter((c) => c.category === categoryFilter),
    [categoryFilter],
  );

  const allCourses: CourseEntry[] = useMemo(() => {
    const out: CourseEntry[] = [];
    for (const cert of certificatesData) {
      for (const course of cert.courses ?? []) {
        out.push({ course, cert });
      }
    }
    return out;
  }, []);

  const filteredCourses = useMemo(
    () =>
      categoryFilter === "all"
        ? allCourses
        : allCourses.filter((c) => c.cert.category === categoryFilter),
    [allCourses, categoryFilter],
  );

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const showCerts = viewMode === "all" || viewMode === "certificates";
  const showCourses = viewMode === "all" || viewMode === "courses";

  return (
    <Container className="pb-20 space-y-12">
      {/* ── Header ── */}
      <Section className="space-y-6 pt-12 text-center">
        <FadeIn className="space-y-5 flex flex-col items-center">
          <Badge
            variant="outline"
            className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]"
          >
            {t("pages.certificates.hero.badge")}
          </Badge>
          <Heading variant="hero" as="h1">
            {t("pages.certificates.hero.title")}
          </Heading>
          <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
            {t("pages.certificates.hero.description")}
          </p>
        </FadeIn>

        {/* Unified filter row — All dropdown (category) + view-mode pills */}
        <FadeIn className="flex flex-wrap items-center justify-center gap-3">
          <CategoryDropdown
            value={categoryFilter}
            onChange={setCategoryFilter}
            categories={categories}
            allLabel={t("pages.certificates.filter.all")}
          />
          {(
            [
              { key: "certificates", label: t("pages.certificates.filter.view_certificates") },
              { key: "courses", label: t("pages.certificates.filter.view_courses") },
            ] as { key: Exclude<ViewMode, "all">; label: string }[]
          ).map(({ key, label }) => {
            const isActive = viewMode === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setViewMode(isActive ? "all" : key)}
                aria-pressed={isActive}
                className={`inline-flex items-center rounded-full border px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border-primary/40 ring-2 ring-offset-2 ring-offset-background ring-primary/40"
                    : "border-border/60 bg-card/40 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </FadeIn>
      </Section>

      {/* ── Certificates Grid ── */}
      {showCerts && (
        <Section className="pt-0 space-y-8">
          {viewMode === "all" && (
            <SectionHeader label={t("pages.certificates.filter.view_certificates")} />
          )}
          {filteredCerts.length === 0 ? (
            <EmptyState text={t("pages.certificates.filter.empty")} />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCerts.map((cert, i) => {
                const realUrl = cert.verifyUrl ?? cert.url;
                return (
                  <FadeIn key={cert.id} delay={i * 0.05}>
                    <div
                      onClick={() => setActive(cert)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActive(cert);
                        }
                      }}
                      className="group relative flex h-full w-full flex-col rounded-2xl border border-border/50 bg-card/60 text-left glass-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_-12px_hsl(var(--primary))] overflow-hidden cursor-pointer"
                    >
                      <div className="relative w-full overflow-hidden border-b border-border/50 bg-white">
                        <div className="relative aspect-[5/4] w-full">
                          <Image
                            src={cert.image}
                            alt={cert.title}
                            fill
                            className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {cert.issuer}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                              CATEGORY_COLORS[cert.category] ??
                              "bg-primary/10 text-primary border-primary/20"
                            }`}
                          >
                            {cert.category}
                          </span>
                        </div>

                        <h3 className="mb-1.5 text-base font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                          {cert.title}
                        </h3>

                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80">
                          {cert.date}
                        </p>

                        <p className="flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                          {cert.description}
                        </p>

                        {realUrl && (
                          <Link
                            href={realUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-5 inline-flex items-center gap-2 self-start rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:bg-primary/20"
                          >
                            {t("pages.certificates.view_real")}
                            <ExternalLink size={11} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </Section>
      )}

      {/* ── Courses Grid ── */}
      {showCourses && (
        <Section className="pt-0 space-y-8">
          {viewMode === "all" && (
            <SectionHeader label={t("pages.certificates.filter.view_courses")} />
          )}
          {filteredCourses.length === 0 ? (
            <EmptyState text={t("pages.certificates.filter.empty")} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map(({ course, cert }, i) => (
                <FadeIn key={`${cert.id}-${course}`} delay={Math.min(i, 12) * 0.03}>
                  <button
                    type="button"
                    onClick={() => setActive(cert)}
                    className="group flex h-full w-full flex-col gap-3 rounded-xl border border-border/50 bg-card/40 p-5 text-left glass-card transition-all duration-300 hover:border-primary/40 hover:bg-card/70"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                          CATEGORY_COLORS[cert.category] ??
                          "bg-primary/10 text-primary border-primary/20"
                        }`}
                      >
                        {cert.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {course}
                    </h4>
                    <div className="mt-auto pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {t("pages.certificates.filter.part_of")} · {cert.title}
                    </div>
                  </button>
                </FadeIn>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="cert-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-background/90 backdrop-blur-md"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-border/60 bg-card glass-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label={t("pages.certificates.close")}
                className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground backdrop-blur-md transition-colors hover:border-primary/50 hover:text-primary"
              >
                <X size={18} />
              </button>

              <div className="relative w-full shrink-0 bg-white">
                <div className="relative aspect-[1.414/1] w-full max-h-[72vh]">
                  <Image
                    src={active.image}
                    alt={active.title}
                    fill
                    className="object-contain p-4 sm:p-6"
                    sizes="(max-width: 1024px) 100vw, 1100px"
                    priority
                    quality={100}
                  />
                </div>
              </div>

              <div className="space-y-5 overflow-y-auto border-t border-border/60 bg-card/80 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                      CATEGORY_COLORS[active.category] ??
                      "bg-primary/10 text-primary border-primary/20"
                    }`}
                  >
                    {active.category}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {active.issuer} · {active.date}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  {active.title}
                </h2>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {active.description}
                </p>

                {active.courses && active.courses.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {t("pages.certificates.courses_included")}
                    </div>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {active.courses.map((course) => (
                        <li
                          key={course}
                          className="rounded-xl border border-border/40 bg-background/40 px-4 py-2.5 text-xs leading-snug text-foreground/90"
                        >
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  {active.url && (
                    <Link
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-primary transition-all hover:bg-primary/20"
                    >
                      {t("pages.certificates.view_certificate")}
                      <ExternalLink size={12} />
                    </Link>
                  )}
                  {active.verifyUrl && (
                    <Link
                      href={active.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-foreground transition-all hover:border-primary/40 hover:text-primary"
                    >
                      {t("pages.certificates.verify")}
                      <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}

function CategoryDropdown({
  value,
  onChange,
  categories,
  allLabel,
}: {
  value: string;
  onChange: (next: string) => void;
  categories: string[];
  allLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const options: { key: string; label: string; full: string; color: string }[] = [
    {
      key: "all",
      label: allLabel,
      full: allLabel,
      color: "bg-primary/15 text-primary border-primary/40",
    },
    ...categories.map((cat) => ({
      key: cat,
      label: CATEGORY_SHORT[cat] ?? cat,
      full: cat,
      color: CATEGORY_COLORS[cat] ?? "bg-primary/10 text-primary border-primary/30",
    })),
  ];
  const current = options.find((o) => o.key === value) ?? options[0];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-primary ring-2 ring-offset-2 ring-offset-background ring-primary/40 transition-all"
      >
        <span>{current.label}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute left-1/2 top-[calc(100%+8px)] z-30 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-1.5 shadow-2xl backdrop-blur"
          >
            {options.map((opt) => {
              const isActive = value === opt.key;
              return (
                <li key={opt.key}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      onChange(opt.key);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? "bg-foreground/10 text-foreground"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${opt.color}`}
                      >
                        {opt.label}
                      </span>
                      {opt.full !== opt.label && (
                        <span className="text-[11px] font-semibold tracking-tight">
                          {opt.full}
                        </span>
                      )}
                    </span>
                    {isActive && <Check size={14} className="shrink-0 text-primary" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <span className="h-px flex-1 bg-border/60" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
      <span className="h-px flex-1 bg-border/60" />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
