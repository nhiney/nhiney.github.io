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

const CATEGORY_SHORT: Record<string, string> = {
  Backend: "BE",
  "Project Management": "PM",
  "Mobile Development": "Mobile",
  "Internet Technology": "Internet",
};

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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                      className="group flex h-full w-full flex-col gap-3 cursor-pointer text-left"
                    >
                      {/* Card 1 — Image, border sát mép ảnh */}
                      <div className="relative w-full overflow-hidden rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 transition-all duration-500 group-hover:border-primary group-hover:shadow-[0_0_40px_-8px_hsl(var(--primary)/0.6)]">
                        {cert.image ? (
                          <>
                            <Image
                              src={cert.image}
                              alt={cert.title}
                              width={1413}
                              height={1000}
                              className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/35">
                              <div className="flex translate-y-4 items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 opacity-0 shadow-2xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900">
                                  {t("pages.certificates.view_certificate")}
                                </span>
                                <ExternalLink size={12} className="text-primary" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-amber-500/10 via-card to-background px-6 py-10">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-500">
                              <Clock size={11} /> {t("pages.certificates.in_progress")}
                            </span>
                            <p className="text-center text-xs text-muted-foreground">
                              {t("pages.certificates.in_progress_desc")}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Card 2 — Content */}
                      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 group-hover:border-primary/60 group-hover:bg-primary/[0.03] group-hover:shadow-[0_4px_24px_-8px_hsl(var(--primary)/0.2)]">
                        {/* Meta bar */}
                        <div className="flex items-center justify-between gap-2 border-b border-border/40 px-5 py-3 transition-colors duration-300 group-hover:border-primary/20 group-hover:bg-primary/[0.05]">
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                            {cert.issuer}
                          </span>
                          <div className="flex shrink-0 items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                                CATEGORY_COLORS[cert.category] ??
                                "bg-primary/10 text-primary border-primary/20"
                              }`}
                            >
                              {CATEGORY_SHORT[cert.category] ?? cert.category}
                            </span>
                            <span className="text-[9px] font-semibold text-muted-foreground/50">
                              {locDate(cert.date)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col p-5 pt-4">
                          <h3 className="mb-2 flex items-start justify-between gap-2 text-[15px] font-black leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                            <span>{cert.title}</span>
                            <ChevronRight
                              size={16}
                              className="mt-0.5 shrink-0 translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                            />
                          </h3>
                          <p className="flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                            {locDesc(cert)}
                          </p>
                          {cert.courses && cert.courses.length > 0 && (
                            <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                              {cert.courses.length} {t("pages.certificates.courses_included")}
                            </p>
                          )}
                          {realUrl && (
                            <Link
                              href={realUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:gap-2 hover:border-primary/60 hover:bg-primary/25"
                            >
                              {t("pages.certificates.view_real")}
                              <ExternalLink size={11} />
                            </Link>
                          )}
                        </div>
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
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map(({ course, cert, isStandalone }, i) => (
                <FadeIn key={`${cert.id}-${course.title}`} delay={Math.min(i, 12) * 0.03}>
                  <button
                    type="button"
                    onClick={() => handleCourseClick(course, cert)}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card/40 text-left transition-all duration-300 hover:border-primary/60 hover:bg-primary/[0.04] hover:shadow-[0_4px_20px_-8px_hsl(var(--primary)/0.35)]"
                  >
                    {/* Left accent bar */}
                    <div className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 rounded-r-full bg-primary transition-transform duration-300 group-hover:scale-y-100" />

                    {/* Body */}
                    <div className="flex flex-1 flex-col gap-2 p-4 pl-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all duration-300 ${
                            course.image
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110"
                              : "border-border/40 bg-muted/20 text-muted-foreground/40"
                          }`}
                        >
                          {course.image ? (
                            <Check size={11} strokeWidth={2.5} />
                          ) : (
                            <GraduationCap size={11} />
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                            CATEGORY_COLORS[cert.category] ??
                            "bg-primary/10 text-primary border-primary/20"
                          }`}
                        >
                          {cert.category}
                        </span>
                      </div>
                      <h4 className="line-clamp-3 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {locTitle(course)}
                      </h4>
                      {course.date && (
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                          {locDate(course.date)}
                        </div>
                      )}
                    </div>

                    {/* Footer cố định */}
                    <div className="flex items-center justify-between gap-2 border-t border-border/40 bg-background/30 px-4 py-2.5 transition-colors duration-300 group-hover:border-primary/20 group-hover:bg-primary/[0.06]">
                      <span className="max-w-[160px] truncate text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                        {isStandalone ? "—" : cert.title}
                      </span>
                      {course.image ? (
                        <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary transition-all duration-300 group-hover:gap-1.5">
                          <ImageIcon size={10} />
                          {t("pages.certificates.view_detail")}
                          <ChevronRight size={9} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      ) : (
                        <span className="shrink-0 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/30">
                          {t("pages.certificates.pending")}
                        </span>
                      )}
                    </div>
                  </button>
                </FadeIn>
              ))}
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

              {/* ─ Image side ─ */}
              <div className="relative bg-white">
                <div className="relative aspect-[1.414/1] w-full md:aspect-auto md:h-full md:min-h-[420px]">
                  {active.image ? (
                    <Image
                      src={active.image}
                      alt={active.title}
                      fill
                      className="object-contain p-3 sm:p-5 md:p-6"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority
                      quality={100}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-amber-500/15 via-card to-background">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-5 py-2 text-[11px] font-black uppercase tracking-widest text-amber-500">
                        <Clock size={12} /> {t("pages.certificates.in_progress")}
                      </span>
                      <p className="max-w-md px-6 text-center text-sm text-muted-foreground">
                        {t("pages.certificates.in_progress_desc")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ─ Details side ─ */}
              <div className="flex flex-col bg-card/90 p-6 sm:p-7 md:max-h-[92vh] md:overflow-y-auto">
                {/* Top label */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                      CATEGORY_COLORS[active.category] ??
                      "bg-primary/10 text-primary border-primary/20"
                    }`}
                  >
                    {active.category}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">
                    {t("pages.certificates.specialization")}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mb-3 text-xl font-black leading-tight tracking-tight text-foreground sm:text-[1.6rem]">
                  {active.title}
                </h2>

                {/* Description */}
                <p className="mb-5 text-xs leading-relaxed text-muted-foreground">
                  {locDesc(active)}
                </p>

                {/* Info grid */}
                <div className="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40">
                  <div className="space-y-1.5 bg-background/50 p-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">
                      <CalendarDays size={11} />
                      {t("pages.certificates.issued")}
                    </div>
                    <div className="text-sm font-bold text-foreground">{locDate(active.date)}</div>
                  </div>
                  <div className="space-y-1.5 bg-background/50 p-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">
                      <Award size={11} />
                      {t("pages.certificates.issued_by")}
                    </div>
                    <div className="text-sm font-bold text-foreground">{active.issuer}</div>
                  </div>
                </div>

                {/* Courses included */}
                {active.courses && active.courses.length > 0 && (
                  <div className="mb-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">
                        {t("pages.certificates.courses_included")}
                      </div>
                      <span className="text-[10px] font-black tabular-nums text-muted-foreground/60">
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
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[9px] font-black tabular-nums text-primary">
                                  {idx + 1}
                                </span>
                                <span className="flex-1 truncate text-xs font-semibold text-foreground/90 transition-colors group-hover:text-primary">
                                  {locTitle(course)}
                                </span>
                                <ChevronRight
                                  size={12}
                                  className="shrink-0 text-primary opacity-60 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                                />
                              </button>
                            ) : (
                              <span className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border/40 bg-background/20 px-3 py-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/40 text-[9px] font-black tabular-nums text-muted-foreground/60">
                                  {idx + 1}
                                </span>
                                <span className="flex-1 truncate text-xs font-semibold text-muted-foreground/70">
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
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-5 py-3 text-xs font-black uppercase tracking-widest text-primary transition-all hover:bg-primary/25"
                    >
                      {t("pages.certificates.view_certificate")}
                      <ExternalLink size={11} className="opacity-70" />
                    </Link>
                  )}
                  {active.verifyUrl && (
                    <Link
                      href={active.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-background/60 px-5 py-3 text-xs font-black uppercase tracking-widest text-foreground transition-all hover:border-primary/40 hover:text-primary"
                    >
                      <ShieldCheck size={13} />
                      {t("pages.certificates.verify")}
                      <ExternalLink size={11} className="opacity-70" />
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

              {/* ─ Image side ─ */}
              {activeCourse.course.image && (
                <div className="relative bg-white">
                  <div className="relative aspect-[1.414/1] w-full md:aspect-auto md:h-full md:min-h-[420px]">
                    <Image
                      src={activeCourse.course.image}
                      alt={locTitle(activeCourse.course)}
                      fill
                      className="object-contain p-3 sm:p-5 md:p-6"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority
                      quality={100}
                    />
                  </div>
                </div>
              )}

              {/* ─ Details side ─ */}
              <div className="flex flex-col bg-card/90 p-6 sm:p-7 md:max-h-[92vh] md:overflow-y-auto">
                {/* Top label */}
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                      CATEGORY_COLORS[activeCourse.cert.category] ??
                      "bg-primary/10 text-primary border-primary/20"
                    }`}
                  >
                    {activeCourse.cert.category}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">
                    {t("pages.certificates.course_certificate")}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mb-6 text-xl font-black leading-tight tracking-tight text-foreground sm:text-[1.6rem]">
                  {locTitle(activeCourse.course)}
                </h2>

                {/* Info grid */}
                <div className="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40">
                  <div className="space-y-1.5 bg-background/50 p-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">
                      <CalendarDays size={11} />
                      {t("pages.certificates.issued")}
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      {locDate(activeCourse.course.date)}
                    </div>
                  </div>
                  <div className="space-y-1.5 bg-background/50 p-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">
                      <Award size={11} />
                      {t("pages.certificates.issued_by")}
                    </div>
                    <div className="text-sm font-bold text-foreground">
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
                    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">
                      {t("pages.certificates.filter.part_of")}
                    </div>
                    <div className="truncate text-sm font-black text-foreground transition-colors group-hover:text-primary">
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
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-5 py-3 text-xs font-black uppercase tracking-widest text-primary transition-all hover:bg-primary/25"
                    >
                      <ShieldCheck size={13} />
                      {t("pages.certificates.verify_course")}
                      <ExternalLink size={11} className="opacity-70" />
                    </Link>
                  )}
                  {activeCourse.cert.verifyUrl && (
                    <Link
                      href={activeCourse.cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-background/60 px-5 py-3 text-xs font-black uppercase tracking-widest text-foreground transition-all hover:border-primary/40 hover:text-primary"
                    >
                      {t("pages.certificates.verify_specialization")}
                      <ExternalLink size={11} className="opacity-70" />
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
