"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  ShieldCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import certificatesData from "@/data/certificates.json";

type Certificate = (typeof certificatesData)[number];
type Course = NonNullable<Certificate["courses"]>[number];
type ViewMode = "all" | "certificates" | "courses";
type CourseEntry = { course: Course; cert: Certificate; isStandalone?: boolean };

const CATEGORY_COLORS: Record<string, string> = {
  Academic: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Mobile Development": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Backend: "bg-red-500/10 text-red-400 border-red-500/20",
  Security: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Internet Technology": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  AI: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
  "Project Management": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Design: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

// Calm single-color dots for the premium / minimal "museum plaque" captions —
// avoids the loud filled pills everywhere while keeping category recognition.
const CATEGORY_DOT: Record<string, string> = {
  Academic: "bg-violet-400",
  "Mobile Development": "bg-blue-400",
  Backend: "bg-red-400",
  Security: "bg-emerald-400",
  "Internet Technology": "bg-cyan-400",
  AI: "bg-fuchsia-400",
  "Project Management": "bg-amber-400",
  Design: "bg-orange-400",
};

const CATEGORY_SHORT: Record<string, string> = {
  Backend: "BE",
  "Project Management": "PM",
  "Mobile Development": "Mobile",
  "Internet Technology": "Internet",
};

const dotColor = (category: string) => CATEGORY_DOT[category] ?? "bg-primary";

export function CertificatesClient() {
  const { t, language } = useLanguage();
  const locTitle = (item: { title: string; title_vi?: string | null }) =>
    language === "vi" && item.title_vi ? item.title_vi : item.title;
  const locDesc = (cert: Certificate) =>
    language === "vi" && (cert as unknown as { description_vi?: string | null }).description_vi
      ? (cert as unknown as { description_vi: string }).description_vi
      : cert.description;
  const VI_MONTHS: Record<string, string> = {
    Jan: "tháng 1", Feb: "tháng 2", Mar: "tháng 3", Apr: "tháng 4",
    May: "tháng 5", Jun: "tháng 6", Jul: "tháng 7", Aug: "tháng 8",
    Sep: "tháng 9", Oct: "tháng 10", Nov: "tháng 11", Dec: "tháng 12",
  };
  const locDate = (date: string | null | undefined): string => {
    if (!date) return "—";
    if (language !== "vi") return date;
    if (date === "In Progress") return t("pages.certificates.in_progress");
    return date.replace(/^(\w{3})\s+(\d+),\s+(\d{4})$/, (_, mon, day, year) =>
      `${day} ${VI_MONTHS[mon] ?? mon}, ${year}`
    );
  };
  const [active, setActive] = useState<Certificate | null>(null);
  const [activeCourse, setActiveCourse] = useState<CourseEntry | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const isStandaloneCourse = (c: Certificate) =>
    (c as Certificate & { type?: string }).type === "standalone_course";

  const categories = useMemo(
    () => [...new Set(certificatesData.filter((c) => !isStandaloneCourse(c)).map((c) => c.category))],
    [],
  );

  const filteredCerts = useMemo(
    () => {
      const certs = certificatesData.filter((c) => !isStandaloneCourse(c));
      return categoryFilter === "all" ? certs : certs.filter((c) => c.category === categoryFilter);
    },
    [categoryFilter],
  );

  const allCourses: CourseEntry[] = useMemo(() => {
    const out: CourseEntry[] = [];
    for (const cert of certificatesData) {
      if (isStandaloneCourse(cert)) {
        out.push({
          course: { title: cert.title, image: cert.image ?? null, verifyUrl: cert.verifyUrl ?? null, date: cert.date } as Course,
          cert,
          isStandalone: true,
        });
      } else {
        for (const course of cert.courses ?? []) {
          out.push({ course, cert });
        }
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

  const modalOpen = active !== null || activeCourse !== null;
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(null);
        setActiveCourse(null);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  const handleCourseClick = (course: Course, cert: Certificate) => {
    if (course.image) {
      setActiveCourse({ course, cert });
    } else {
      setActive(cert);
    }
  };

  const showCerts = viewMode === "all" || viewMode === "certificates";
  const showCourses = viewMode === "all" || viewMode === "courses";

  return (
    <Container className="pb-24 space-y-14">
      {/* ── Header ── */}
      <Section className="space-y-6 pt-12 text-center">
        <FadeIn className="space-y-5 flex flex-col items-center">
          <Badge
            variant="outline"
            className="px-5 py-1.5 bg-transparent border-border/60 text-muted-foreground font-medium tracking-[0.2em] uppercase text-[10px]"
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
        <FadeIn className="flex flex-wrap items-center justify-center gap-2.5">
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
                className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/60 bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </FadeIn>
      </Section>

      {/* ── Certificates — Gallery Wall ── */}
      {showCerts && (
        <Section className="pt-0 space-y-6">
          {viewMode === "all" && (
            <SectionHeader label={t("pages.certificates.filter.view_certificates")} />
          )}
          {filteredCerts.length === 0 ? (
            <EmptyState text={t("pages.certificates.filter.empty")} />
          ) : (
            <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-gradient-to-b from-muted/25 via-background to-background px-5 py-12 sm:px-10 sm:py-16">
              {/* Soft top wash — the "wall" + gallery light */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_55%_at_50%_0%,hsl(var(--foreground)/0.04),transparent_70%)]" />
              {/* Picture rail line */}
              <div className="pointer-events-none absolute inset-x-0 top-6 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

              <div className="relative grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCerts.map((cert, i) => {
                  const realUrl = cert.verifyUrl ?? cert.url;
                  return (
                    <FadeIn key={cert.id} delay={i * 0.05}>
                      <figure
                        onClick={() => setActive(cert)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActive(cert);
                          }
                        }}
                        className="group relative flex h-full cursor-pointer flex-col items-center text-center"
                      >
                        {/* Spotlight glow on hover */}
                        <div className="pointer-events-none absolute -inset-x-6 -top-8 bottom-10 rounded-[2.5rem] bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.14),transparent_75%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                        {/* Framed artwork */}
                        <div className="relative w-full transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
                          <div className="relative overflow-hidden rounded-[5px] bg-gradient-to-b from-zinc-200 to-zinc-300 p-[3px] shadow-[0_12px_28px_-14px_rgba(0,0,0,0.5)] ring-1 ring-black/10 transition-all duration-500 group-hover:shadow-[0_28px_55px_-18px_rgba(0,0,0,0.6)] group-hover:ring-primary/40 dark:from-zinc-700 dark:to-zinc-800 dark:ring-white/10 dark:group-hover:ring-primary/50">
                            {/* Inner bevel */}
                            <div className="rounded-[3px] bg-gradient-to-b from-white/50 to-black/10 p-px">
                              {/* Mat (museum matting) */}
                              <div className="overflow-hidden rounded-[2px] bg-[#faf9f6] p-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.14)] sm:p-4">
                                {cert.image ? (
                                  <div className="relative aspect-[1.414/1] w-full overflow-hidden bg-white ring-1 ring-black/5">
                                    <Image
                                      src={cert.image}
                                      alt={cert.title}
                                      fill
                                      className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex aspect-[1.414/1] w-full flex-col items-center justify-center gap-3 bg-white px-6">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                                      <Clock size={11} /> {t("pages.certificates.in_progress")}
                                    </span>
                                    <p className="text-center text-xs text-zinc-500">
                                      {t("pages.certificates.in_progress_desc")}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Museum plaque caption */}
                        <figcaption className="mt-5 flex w-full flex-1 flex-col items-center px-2">
                          <div className="mb-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                            <span className={`h-1.5 w-1.5 rounded-full ${dotColor(cert.category)}`} />
                            <span className="font-medium tracking-wide text-foreground/70">
                              {cert.category}
                            </span>
                            <span className="text-muted-foreground/40">·</span>
                            <span>{locDate(cert.date)}</span>
                          </div>
                          <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                            {cert.title}
                          </h3>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/60">
                            {cert.issuer}
                          </p>
                          {cert.courses && cert.courses.length > 0 && (
                            <p className="mt-2 text-[11px] text-muted-foreground/70">
                              {cert.courses.length} {t("pages.certificates.courses_included")}
                            </p>
                          )}
                          {realUrl && (
                            <Link
                              href={realUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline"
                            >
                              {t("pages.certificates.view_real")}
                              <ExternalLink size={11} />
                            </Link>
                          )}
                        </figcaption>
                      </figure>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* ── Courses — mini framed gallery ── */}
      {showCourses && (
        <Section className="pt-0 space-y-6">
          {viewMode === "all" && (
            <SectionHeader label={t("pages.certificates.filter.view_courses")} />
          )}
          {filteredCourses.length === 0 ? (
            <EmptyState text={t("pages.certificates.filter.empty")} />
          ) : (
            <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCourses.map(({ course, cert, isStandalone }, i) => {
                const hasImage = !!course.image;
                return (
                  <FadeIn key={`${cert.id}-${course.title}`} delay={Math.min(i, 12) * 0.03}>
                    <button
                      type="button"
                      onClick={() => handleCourseClick(course, cert)}
                      className="group relative flex h-full w-full flex-col text-center"
                    >
                      {/* Mini frame */}
                      <div className="relative w-full transition-transform duration-400 ease-out group-hover:-translate-y-1">
                        <div className="relative overflow-hidden rounded-[4px] bg-gradient-to-b from-zinc-200 to-zinc-300 p-[2px] shadow-[0_8px_20px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/10 transition-all duration-400 group-hover:shadow-[0_18px_36px_-16px_rgba(0,0,0,0.55)] group-hover:ring-primary/40 dark:from-zinc-700 dark:to-zinc-800 dark:ring-white/10 dark:group-hover:ring-primary/50">
                          <div className="overflow-hidden rounded-[2px] bg-[#faf9f6] p-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.12)]">
                            {hasImage ? (
                              <div className="relative aspect-[1.414/1] w-full overflow-hidden bg-white ring-1 ring-black/5">
                                <Image
                                  src={course.image as string}
                                  alt={locTitle(course)}
                                  fill
                                  className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                              </div>
                            ) : (
                              <div className="flex aspect-[1.414/1] w-full flex-col items-center justify-center gap-2 bg-white">
                                <GraduationCap size={22} className="text-zinc-300" />
                                <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                                  {t("pages.certificates.pending")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Completed badge */}
                        {hasImage && (
                          <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500 text-white shadow-md">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        )}
                      </div>

                      {/* Plaque */}
                      <div className="mt-3.5 flex flex-1 flex-col items-center px-1">
                        <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <span className={`h-1.5 w-1.5 rounded-full ${dotColor(cert.category)}`} />
                          <span className="font-medium tracking-wide text-foreground/60">
                            {CATEGORY_SHORT[cert.category] ?? cert.category}
                          </span>
                        </div>
                        <h4 className="line-clamp-2 text-[13px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {locTitle(course)}
                        </h4>
                        {course.date && (
                          <p className="mt-1 text-[11px] text-muted-foreground/60">
                            {locDate(course.date)}
                          </p>
                        )}
                        {!isStandalone && (
                          <p className="mt-1.5 line-clamp-1 max-w-full text-[10px] text-muted-foreground/45">
                            {cert.title}
                          </p>
                        )}
                      </div>
                    </button>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </Section>
      )}

      {/* ── Certificate Detail Modal ── */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="cert-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:p-6 bg-background/95 backdrop-blur-sm sm:items-center sm:backdrop-blur-md"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid w-full max-w-5xl grid-cols-1 rounded-3xl border border-border/60 bg-card shadow-2xl md:max-h-[92vh] md:overflow-hidden md:grid-cols-[1.25fr_1fr]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label={t("pages.certificates.close")}
                className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground backdrop-blur-md transition-colors hover:border-primary/50 hover:text-primary"
              >
                <X size={16} />
              </button>

              {/* ─ Image side (framed) ─ */}
              <div className="flex items-center justify-center bg-gradient-to-br from-muted/40 to-background p-5 sm:p-8">
                <div className="w-full overflow-hidden rounded-[5px] bg-gradient-to-b from-zinc-200 to-zinc-300 p-[3px] shadow-xl ring-1 ring-black/10 dark:from-zinc-700 dark:to-zinc-800 dark:ring-white/10">
                  <div className="rounded-[3px] bg-gradient-to-b from-white/50 to-black/10 p-px">
                    <div className="overflow-hidden rounded-[2px] bg-[#faf9f6] p-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.14)] sm:p-5">
                      {active.image ? (
                        <div className="relative aspect-[1.414/1] w-full bg-white ring-1 ring-black/5">
                          <Image
                            src={active.image}
                            alt={active.title}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 60vw"
                            priority
                            quality={100}
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[1.414/1] w-full flex-col items-center justify-center gap-4 bg-white">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                            <Clock size={12} /> {t("pages.certificates.in_progress")}
                          </span>
                          <p className="max-w-md px-6 text-center text-sm text-zinc-500">
                            {t("pages.certificates.in_progress_desc")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ─ Details side ─ */}
              <div className="flex flex-col bg-card/90 p-6 sm:p-7 md:max-h-[92vh] md:overflow-y-auto">
                {/* Top label */}
                <div className="mb-4 flex flex-wrap items-center gap-2.5 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 font-medium tracking-wide text-foreground/70">
                    <span className={`h-1.5 w-1.5 rounded-full ${dotColor(active.category)}`} />
                    {active.category}
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="uppercase tracking-[0.18em] text-muted-foreground/70">
                    {t("pages.certificates.specialization")}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mb-3 text-xl font-bold leading-tight tracking-tight text-foreground sm:text-[1.6rem]">
                  {active.title}
                </h2>

                {/* Description */}
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  {locDesc(active)}
                </p>

                {/* Info grid */}
                <div className="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40">
                  <div className="space-y-1.5 bg-background/50 p-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground/70">
                      <CalendarDays size={12} />
                      {t("pages.certificates.issued")}
                    </div>
                    <div className="text-sm font-semibold text-foreground">{locDate(active.date)}</div>
                  </div>
                  <div className="space-y-1.5 bg-background/50 p-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground/70">
                      <Award size={12} />
                      {t("pages.certificates.issued_by")}
                    </div>
                    <div className="text-sm font-semibold text-foreground">{active.issuer}</div>
                  </div>
                </div>

                {/* Courses included */}
                {active.courses && active.courses.length > 0 && (
                  <div className="mb-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-medium tracking-wide text-muted-foreground/70">
                        {t("pages.certificates.courses_included")}
                      </div>
                      <span className="text-[11px] font-semibold tabular-nums text-muted-foreground/60">
                        {active.courses.filter((c) => c.image).length}/{active.courses.length}
                      </span>
                    </div>
                    <ul className="grid gap-1.5">
                      {active.courses.map((course, idx) => {
                        const hasImage = !!course.image;
                        const cert = active;
                        return (
                          <li key={course.title}>
                            {hasImage ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setActive(null);
                                  setActiveCourse({ course, cert });
                                }}
                                className="group flex w-full items-center gap-3 rounded-xl border border-border/40 bg-background/40 px-3 py-2 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                              >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold tabular-nums text-primary">
                                  {idx + 1}
                                </span>
                                <span className="flex-1 truncate text-xs font-medium text-foreground/90 transition-colors group-hover:text-primary">
                                  {locTitle(course)}
                                </span>
                                <ChevronRight
                                  size={12}
                                  className="shrink-0 text-primary opacity-60 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                                />
                              </button>
                            ) : (
                              <span className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border/40 bg-background/20 px-3 py-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/40 text-[10px] font-semibold tabular-nums text-muted-foreground/60">
                                  {idx + 1}
                                </span>
                                <span className="flex-1 truncate text-xs font-medium text-muted-foreground/70">
                                  {locTitle(course)}
                                </span>
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Action buttons (full width, stacked) */}
                <div className="mt-auto space-y-2 pt-2">
                  {active.url && (
                    <Link
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-5 py-3 text-sm font-semibold tracking-wide text-primary transition-all hover:bg-primary/25"
                    >
                      {t("pages.certificates.view_certificate")}
                      <ExternalLink size={13} className="opacity-70" />
                    </Link>
                  )}
                  {active.verifyUrl && (
                    <Link
                      href={active.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-background/60 px-5 py-3 text-sm font-semibold tracking-wide text-foreground transition-all hover:border-primary/40 hover:text-primary"
                    >
                      <ShieldCheck size={14} />
                      {t("pages.certificates.verify")}
                      <ExternalLink size={13} className="opacity-70" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Course Detail Modal ── */}
      <AnimatePresence>
        {activeCourse && (
          <motion.div
            key="course-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:p-6 bg-background/95 backdrop-blur-sm sm:items-center sm:backdrop-blur-md"
            onClick={() => setActiveCourse(null)}
            role="dialog"
            aria-modal="true"
            aria-label={locTitle(activeCourse.course)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid w-full max-w-5xl grid-cols-1 rounded-3xl border border-border/60 bg-card shadow-2xl md:max-h-[92vh] md:overflow-hidden md:grid-cols-[1.25fr_1fr]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveCourse(null)}
                aria-label={t("pages.certificates.close")}
                className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground backdrop-blur-md transition-colors hover:border-primary/50 hover:text-primary"
              >
                <X size={16} />
              </button>

              {/* ─ Image side (framed) ─ */}
              {activeCourse.course.image && (
                <div className="flex items-center justify-center bg-gradient-to-br from-muted/40 to-background p-5 sm:p-8">
                  <div className="w-full overflow-hidden rounded-[5px] bg-gradient-to-b from-zinc-200 to-zinc-300 p-[3px] shadow-xl ring-1 ring-black/10 dark:from-zinc-700 dark:to-zinc-800 dark:ring-white/10">
                    <div className="rounded-[3px] bg-gradient-to-b from-white/50 to-black/10 p-px">
                      <div className="overflow-hidden rounded-[2px] bg-[#faf9f6] p-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.14)] sm:p-5">
                        <div className="relative aspect-[1.414/1] w-full bg-white ring-1 ring-black/5">
                          <Image
                            src={activeCourse.course.image}
                            alt={locTitle(activeCourse.course)}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 60vw"
                            priority
                            quality={100}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─ Details side ─ */}
              <div className="flex flex-col bg-card/90 p-6 sm:p-7 md:max-h-[92vh] md:overflow-y-auto">
                {/* Top label */}
                <div className="mb-5 flex flex-wrap items-center gap-2.5 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 font-medium tracking-wide text-foreground/70">
                    <span className={`h-1.5 w-1.5 rounded-full ${dotColor(activeCourse.cert.category)}`} />
                    {activeCourse.cert.category}
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="uppercase tracking-[0.18em] text-muted-foreground/70">
                    {t("pages.certificates.course_certificate")}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mb-6 text-xl font-bold leading-tight tracking-tight text-foreground sm:text-[1.6rem]">
                  {locTitle(activeCourse.course)}
                </h2>

                {/* Info grid */}
                <div className="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40">
                  <div className="space-y-1.5 bg-background/50 p-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground/70">
                      <CalendarDays size={12} />
                      {t("pages.certificates.issued")}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {locDate(activeCourse.course.date)}
                    </div>
                  </div>
                  <div className="space-y-1.5 bg-background/50 p-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground/70">
                      <Award size={12} />
                      {t("pages.certificates.issued_by")}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {activeCourse.cert.issuer}
                    </div>
                  </div>
                </div>

                {/* Parent spec card (clickable) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveCourse(null);
                    setActive(activeCourse.cert);
                  }}
                  className="group mb-6 flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-background/40 p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                      CATEGORY_COLORS[activeCourse.cert.category] ??
                      "bg-primary/10 text-primary border-primary/20"
                    }`}
                  >
                    <ImageIcon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-medium tracking-wide text-muted-foreground/70">
                      {t("pages.certificates.filter.part_of")}
                    </div>
                    <div className="truncate text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                      {activeCourse.cert.title}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </button>

                {/* Action buttons (full width, stacked) */}
                <div className="mt-auto space-y-2 pt-2">
                  {activeCourse.course.verifyUrl && (
                    <Link
                      href={activeCourse.course.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-5 py-3 text-sm font-semibold tracking-wide text-primary transition-all hover:bg-primary/25"
                    >
                      <ShieldCheck size={14} />
                      {t("pages.certificates.verify_course")}
                      <ExternalLink size={13} className="opacity-70" />
                    </Link>
                  )}
                  {activeCourse.cert.verifyUrl && (
                    <Link
                      href={activeCourse.cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-background/60 px-5 py-3 text-sm font-semibold tracking-wide text-foreground transition-all hover:border-primary/40 hover:text-primary"
                    >
                      {t("pages.certificates.verify_specialization")}
                      <ExternalLink size={13} className="opacity-70" />
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

  const options: { key: string; label: string; full: string; dot: string }[] = [
    { key: "all", label: allLabel, full: allLabel, dot: "bg-primary" },
    ...categories.map((cat) => ({
      key: cat,
      label: CATEGORY_SHORT[cat] ?? cat,
      full: cat,
      dot: CATEGORY_DOT[cat] ?? "bg-primary",
    })),
  ];
  const current = options.find((o) => o.key === value) ?? options[0];
  const isFiltering = value !== "all";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-all ${
          isFiltering
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border/60 bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
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
            className="absolute left-1/2 top-[calc(100%+8px)] z-30 w-60 -translate-x-1/2 overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-1.5 shadow-2xl backdrop-blur"
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
                    <span className="flex items-center gap-2.5">
                      <span className={`h-2 w-2 rounded-full ${opt.dot}`} />
                      <span className="text-[13px] font-medium tracking-tight">{opt.full}</span>
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
      <span className="text-[11px] font-medium uppercase tracking-[0.28em]">{label}</span>
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
