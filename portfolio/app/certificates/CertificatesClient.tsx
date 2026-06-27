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
  Eye,
  ExternalLink,
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

  return (
    <Container className="pb-24 space-y-14">
      {/* ── Header ── */}
      <Section className="relative space-y-8 pt-12 text-center">
        {/* Ambient hero glow */}
        <div className="pointer-events-none absolute inset-x-0 -top-12 -z-10 mx-auto h-64 max-w-3xl bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--primary)/0.13),transparent_70%)] blur-2xl" />

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

        {/* Category filter */}
        <FadeIn delay={0.1} className="flex flex-wrap items-center justify-center gap-2.5">
          <CategoryDropdown
            value={categoryFilter}
            onChange={setCategoryFilter}
            categories={categories}
            allLabel={t("pages.certificates.filter.all")}
          />
        </FadeIn>
      </Section>

      {/* ── Certificates — credential grid ── */}
      <Section className="pt-0 space-y-6">
        {filteredCerts.length === 0 ? (
          <EmptyState text={t("pages.certificates.filter.empty")} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCerts.map((cert, i) => {
              const realUrl = cert.verifyUrl ?? cert.url;
              return (
                <FadeIn key={cert.id} delay={i * 0.05} className="h-full">
                  <article
                    onClick={() => setActive(cert)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActive(cert);
                      }
                    }}
                    className="group flex h-full cursor-pointer flex-col rounded-[14px] border border-border/60 bg-card/70 p-2 shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_14px_40px_rgba(15,23,42,0.11)] dark:bg-card/55 dark:shadow-[0_16px_44px_rgba(0,0,0,0.28)]"
                  >
                    <CertificateFrame
                      image={cert.image}
                      alt={cert.title}
                      verified={!!(cert.image && realUrl)}
                      verifiedLabel={t("pages.certificates.verified")}
                      viewLabel={t("pages.certificates.view_certificate")}
                      inProgressLabel={t("pages.certificates.in_progress")}
                      inProgressDescription={t("pages.certificates.in_progress_desc")}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Caption */}
                    <div className="flex flex-1 flex-col px-2 pb-2 pt-3.5">
                      <h3 className="min-h-[2.45rem] text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {cert.title}
                      </h3>
                      <div className="mt-2 flex min-w-0 items-center gap-2 text-[11px] text-muted-foreground">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor(cert.category)}`} />
                        <span className="min-w-0 truncate">{cert.issuer}</span>
                        <span className="text-border/80">·</span>
                        <span className="shrink-0">{locDate(cert.date)}</span>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        )}
        {filteredCerts.length > 0 && (
          <FadeIn
            delay={0.2}
            className="flex items-center justify-center gap-2 pt-2 text-center text-xs text-muted-foreground"
          >
            <ShieldCheck size={13} className="shrink-0 text-emerald-500" />
            <span>{t("pages.certificates.trust")}</span>
          </FadeIn>
        )}
      </Section>

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
              className="relative grid w-full max-w-6xl grid-cols-1 rounded-3xl border border-border/60 bg-card shadow-2xl md:max-h-[92vh] md:overflow-hidden md:grid-cols-[1.35fr_0.95fr]"
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
              <div className="flex items-center justify-center bg-gradient-to-br from-secondary/65 via-background to-background p-4 sm:p-6 md:p-7">
                <CertificateFrame
                  image={active.image}
                  alt={active.title}
                  variant="modal"
                  priority
                  inProgressLabel={t("pages.certificates.in_progress")}
                  inProgressDescription={t("pages.certificates.in_progress_desc")}
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
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
                    <ul className="grid min-w-0 gap-1.5">
                      {active.courses.map((course, idx) => {
                        const hasImage = !!course.image;
                        const cert = active;
                        return (
                          <li key={course.title} className="min-w-0">
                            {hasImage ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setActive(null);
                                  setActiveCourse({ course, cert });
                                }}
                                className="group flex w-full min-w-0 items-center gap-3 rounded-xl border border-border/40 bg-background/40 px-3 py-2 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                              >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold tabular-nums text-primary">
                                  {idx + 1}
                                </span>
                                <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground/90 transition-colors group-hover:text-primary">
                                  {locTitle(course)}
                                </span>
                                <ChevronRight
                                  size={12}
                                  className="shrink-0 text-primary opacity-60 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                                />
                              </button>
                            ) : (
                              <span className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-dashed border-border/40 bg-background/20 px-3 py-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/40 text-[10px] font-semibold tabular-nums text-muted-foreground/60">
                                  {idx + 1}
                                </span>
                                <span className="min-w-0 flex-1 truncate text-xs font-medium text-muted-foreground/70">
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
              className="relative grid w-full max-w-6xl grid-cols-1 rounded-3xl border border-border/60 bg-card shadow-2xl md:max-h-[92vh] md:overflow-hidden md:grid-cols-[1.35fr_0.95fr]"
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
                <div className="flex items-center justify-center bg-gradient-to-br from-secondary/65 via-background to-background p-4 sm:p-6 md:p-7">
                  <CertificateFrame
                    image={activeCourse.course.image}
                    alt={locTitle(activeCourse.course)}
                    variant="modal"
                    priority
                    inProgressLabel={t("pages.certificates.in_progress")}
                    inProgressDescription={t("pages.certificates.in_progress_desc")}
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
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

function CertificateFrame({
  image,
  alt,
  verified = false,
  verifiedLabel,
  viewLabel,
  inProgressLabel,
  inProgressDescription,
  priority = false,
  sizes,
  variant = "grid",
}: {
  image?: string | null;
  alt: string;
  verified?: boolean;
  verifiedLabel?: string;
  viewLabel?: string;
  inProgressLabel: string;
  inProgressDescription: string;
  priority?: boolean;
  sizes: string;
  variant?: "grid" | "modal";
}) {
  const isModal = variant === "modal";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[12px] border border-border/70 bg-[linear-gradient(135deg,hsl(var(--background))_0%,hsl(var(--secondary))_100%)] shadow-[0_1px_2px_rgba(15,23,42,0.05),_0_16px_34px_rgba(15,23,42,0.08)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.32)] ${
        isModal ? "max-w-[820px] p-2.5 sm:p-3.5" : "p-2.5"
      }`}
    >
      <div className="pointer-events-none absolute inset-2 rounded-[8px] border border-white/70 dark:border-white/10" />
      <div className="pointer-events-none absolute inset-[13px] rounded-[6px] border border-border/60" />

      <div
        className={`relative overflow-hidden rounded-[8px] border border-border/70 bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8),_0_1px_2px_rgba(15,23,42,0.05)] dark:bg-zinc-950 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] ${
          isModal ? "p-2 sm:p-2.5" : "p-2"
        }`}
      >
        <div className="relative aspect-[1.414/1] w-full overflow-hidden rounded-[5px] bg-white">
          {image ? (
            <Image
              src={image}
              alt={alt}
              fill
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.018]"
              sizes={sizes}
              priority={priority}
              quality={isModal ? 100 : 90}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                <Clock size={11} /> {inProgressLabel}
              </span>
              <p className="max-w-sm text-xs text-muted-foreground">{inProgressDescription}</p>
            </div>
          )}
        </div>
      </div>

      {image && verified && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 shadow-sm ring-1 ring-emerald-500/25 backdrop-blur-sm dark:bg-zinc-950/90 dark:text-emerald-400 dark:ring-emerald-400/20">
          <ShieldCheck size={10} strokeWidth={2.5} />
          {verifiedLabel}
        </span>
      )}

      {image && viewLabel && !isModal && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/32 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="mb-4 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-white/95 px-4 py-1.5 text-[11px] font-semibold text-zinc-900 shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
            <Eye size={12} />
            {viewLabel}
          </span>
        </div>
      )}
    </div>
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

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
