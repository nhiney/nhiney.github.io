"use client";

// The book detail view, in two stages:
//   A · Notes  — the book as a spinnable 3D object beside its key ideas (the
//                "ý chính" note). Click the book (or the CTA) to open it.
//   B · Reading — the book opens into a real 2-page spread you flip through,
//                Apple-Books style (FlipBookReader / StPageFlip).
// Frosted full-screen panel, portalled above the navbar, theme-aware.

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, BookOpen, RotateCw, ArrowLeft, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/i18n/dictionaries";
import BookViewer3D from "./BookViewer3D";
import { FlipBookReader } from "./FlipBookReader";
import { ThemeToggle } from "@/components/widgets/ThemeToggle";
import { LOCALE_LABEL, type LibBookFull } from "@/lib/library/types";
import { authoredReadingLocales, resolveReadingLocale } from "@/lib/library/readingLocale";
import type { BookOutsideSummary } from "@/data/books";
import { bookPaperSrc, bookLeafPaperSrc } from "@/lib/library/papers";

function renderNoteInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function OutsideSummaryLessons({
  heading,
  numbered,
  lessons,
  start = 0,
}: {
  heading?: string;
  numbered?: boolean;
  lessons: Array<{ heading: string; paragraph?: string }>;
  start?: number;
}) {
  const List = numbered ? "ol" : "ul";
  const LessonHeading = heading ? "h4" : "h3";

  return (
    <>
      {heading && (
        <h3 className="note-accent mt-4 font-heading text-[0.92em] font-bold tracking-wide">
          {heading}
        </h3>
      )}
      <List className={`${heading ? "mt-2" : "mt-3"} space-y-2.5`}>
        {lessons.map((lesson, index) => (
          <li key={lesson.heading} className="note-ink flex gap-2.5">
            {numbered ? (
              <span className="note-badge mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.66rem] font-bold" aria-hidden>
                {start + index + 1}
              </span>
            ) : (
              <span className="note-accent" aria-hidden>•</span>
            )}
            <div>
              <LessonHeading className="font-heading font-bold leading-snug">
                {lesson.heading}
              </LessonHeading>
              {lesson.paragraph && (
                <p className="mt-1">{renderNoteInline(lesson.paragraph)}</p>
              )}
            </div>
          </li>
        ))}
      </List>
    </>
  );
}

interface OverviewSlide {
  heading?: string;
  tagline?: string;
  introduction?: string[];
  lessons?: Array<{ heading: string; paragraph?: string }>;
  lessonStart?: number;
  conclusion?: string[];
  coverNote?: string;
  keyPoints?: string[];
  keyPointStart?: number;
}

function splitOverviewText(text: string, limit = 240): string[] {
  if (text.length <= limit) return [text];
  const sentences = text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g)?.map((part) => part.trim()) ?? [text];
  const pieces = sentences.flatMap((sentence) => {
    if (sentence.length <= limit) return [sentence];

    // A single Vietnamese sentence can be longer than the page budget. Keep
    // inline emphasis tokens intact, then fall back to word boundaries so one
    // long sentence cannot silently overflow into the footer.
    const tokens = sentence.match(/\*\*[^*]+\*\*|\*[^*]+\*|\S+/g) ?? [sentence];
    const sentenceChunks: string[] = [];
    let sentenceChunk = "";
    tokens.forEach((token) => {
      if (sentenceChunk && sentenceChunk.length + token.length + 1 > limit) {
        sentenceChunks.push(sentenceChunk);
        sentenceChunk = token;
      } else {
        sentenceChunk = sentenceChunk ? `${sentenceChunk} ${token}` : token;
      }
    });
    if (sentenceChunk) sentenceChunks.push(sentenceChunk);
    return sentenceChunks;
  });
  const chunks: string[] = [];
  let current = "";
  pieces.forEach((piece) => {
    if (current && current.length + piece.length + 1 > limit) {
      chunks.push(current);
      current = piece;
    } else {
      current = current ? `${current} ${piece}` : piece;
    }
  });
  if (current) chunks.push(current);
  return chunks;
}

function packOverviewParagraphs(paragraphs: string[], limit = 300): string[][] {
  const parts = paragraphs.flatMap((paragraph) => splitOverviewText(paragraph));
  const groups: string[][] = [];
  let current: string[] = [];
  let length = 0;
  parts.forEach((part) => {
    if (current.length && length + part.length > limit) {
      groups.push(current);
      current = [];
      length = 0;
    }
    current.push(part);
    length += part.length;
  });
  if (current.length) groups.push(current);
  return groups;
}

function buildOverviewSlides(
  summary: BookOutsideSummary | undefined,
  coverNote: string | undefined,
  keyPoints: string[]
): OverviewSlide[] {
  if (summary) {
    // Keep the opening as a true editorial cover. The book title and author are
    // rendered by the surrounding sheet; this slide contributes only the
    // summary's tagline and heading, leaving every introduction paragraph for
    // the following running pages.
    const slides: OverviewSlide[] = [];
    slides.push({
      heading: summary.heading,
      tagline: summary.tagline,
    });
    const introGroups = packOverviewParagraphs(summary.introduction, 200);
    introGroups.forEach((introduction) => {
      slides.push({
        heading: summary.heading,
        introduction,
      });
    });
    summary.lessons.forEach((lesson, lessonIndex) => {
      const paragraphParts = lesson.paragraph
        ? splitOverviewText(lesson.paragraph, 200)
        : [undefined];
      paragraphParts.forEach((paragraph) => {
        slides.push({
          heading: summary.lessonsHeading ?? summary.heading,
          lessons: [{ heading: lesson.heading, paragraph }],
          lessonStart: lessonIndex,
        });
      });
    });
    packOverviewParagraphs(summary.conclusion, 200).forEach((conclusion) => {
      slides.push({ heading: summary.heading, conclusion });
    });
    return slides;
  }

  const slides: OverviewSlide[] = [];
  const coverParts = coverNote ? splitOverviewText(coverNote, 220) : [];
  coverParts.forEach((part) => slides.push({ coverNote: part }));
  let current: string[] = [];
  let currentLength = 0;
  let start = 0;
  keyPoints.forEach((point, index) => {
    const nextLength = currentLength + point.length;
    if (current.length && (current.length >= 2 || nextLength > 260)) {
      slides.push({ keyPoints: current, keyPointStart: start });
      current = [];
      currentLength = 0;
      start = index;
    }
    current.push(point);
    currentLength += point.length;
  });
  if (current.length) slides.push({ keyPoints: current, keyPointStart: start });
  return slides.length ? slides : [{}];
}

export function ReadingOverlay({
  book,
  onClose,
}: {
  book: LibBookFull | null;
  onClose: () => void;
}) {
  const { language, setLanguage, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<{
    slug?: string;
    reading: boolean;
    paperRatio: number | null;
  }>({ slug: book?.slug, reading: false, paperRatio: null });
  // Distinguish a click on the 3D book from an orbit-drag, so spinning the book
  // doesn't accidentally open it.
  const pointer = useRef<{ x: number; y: number; at: number } | null>(null);

  // Gate the portal until after hydration (document.body isn't there during the
  // static-export prerender).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const activeSlug = book?.slug;
  const reading = stage.slug === activeSlug ? stage.reading : false;
  const paperRatio = stage.slug === activeSlug ? stage.paperRatio : null;
  const setReading = (next: boolean) => {
    setStage((prev) => ({
      slug: activeSlug,
      reading: next,
      paperRatio: prev.slug === activeSlug ? prev.paperRatio : null,
    }));
  };

  useEffect(() => {
    if (!book) return;
    const onKey = (e: KeyboardEvent) => {
      // While reading, the FlipBookReader owns Escape (it returns to notes).
      if (e.key === "Escape" && !reading) onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [book, onClose, reading]);

  const authoredLocales = useMemo(
    () => authoredReadingLocales(book?.readingPages),
    [book]
  );
  // A generated five-leaf key-point fallback is not a translation of an
  // authored manuscript. Prefer the locale that actually owns the full book;
  // otherwise a Vietnamese-only edition opened while the site is in English
  // appears to have lost all of its chapters.
  const lang = book
    ? resolveReadingLocale(language, book.readingPages, book.pages)
    : "en";
  const hasReview = !!book && Object.keys(book.bodies).length > 0;
  const title = book ? book.titles[lang] ?? book.enTitle : "";
  const keyPoints = useMemo(
    () => (book ? book.keyPoints[lang] ?? book.keyPoints.en ?? [] : []),
    [book, lang]
  );
  const coverNote = book ? book.coverNote[lang] ?? book.coverNote.en : undefined;
  const outsideSummary = book
    ? book.outsideSummary[lang] ?? book.outsideSummary.en
    : undefined;
  const overviewSlides = useMemo(
    () => buildOverviewSlides(outsideSummary, coverNote, keyPoints),
    [outsideSummary, coverNote, keyPoints]
  );
  const [overviewState, setOverviewState] = useState({
    slug: book?.slug,
    lang,
    index: 0,
  });
  const overviewIndex = overviewState.slug === book?.slug && overviewState.lang === lang
    ? Math.min(overviewState.index, overviewSlides.length - 1)
    : 0;
  const overviewSlide = overviewSlides[overviewIndex] ?? overviewSlides[0];
  const isOverviewOpening = overviewIndex === 0;
  const noteTitleScale = title.length >= 38
    ? "long"
    : title.length >= 24
      ? "medium"
      : "short";
  const setOverviewIndex = (index: number) => {
    setOverviewState({
      slug: book?.slug,
      lang,
      index: Math.min(Math.max(index, 0), overviewSlides.length - 1),
    });
  };
  const deck = book ? book.pages[lang] ?? book.pages.en ?? [] : [];
  const usesFutureLabTheme = deck.some((page) => page.theme === "future-ethics-lab");
  // Locales offered in the segmented switch (de-duped, en first).
  const locales: Language[] = book
    ? authoredLocales.length
      ? authoredLocales
      : Array.from(new Set(["en", ...Object.keys(book.pages)]))
        .filter((locale): locale is Language => locale === "en" || locale === "vi")
    : [];
  // The book's own scrapbook paper photo — one distinct sheet per book — backs
  // the OUTSIDE notes view (the flipbook leaves inside keep the printed palette).
  const paperSrc = book ? bookPaperSrc(book.slug) : null;
  const detailMeta = useMemo(
    () => (book ? { ...book.meta, coverBlurb: coverNote } : null),
    [book, coverNote]
  );

  // Read the paper's true proportions once so the sheet matches the photo.
  useEffect(() => {
    if (!paperSrc) return;
    const img = new window.Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setStage((prev) => ({
        slug: activeSlug,
        reading: prev.slug === activeSlug ? prev.reading : false,
        paperRatio: ratio,
      }));
    };
    img.src = paperSrc;
  }, [paperSrc, activeSlug]);

  const onBookPointerDown = (e: React.PointerEvent) => {
    pointer.current = { x: e.clientX, y: e.clientY, at: Date.now() };
  };
  const onBookPointerUp = (e: React.PointerEvent) => {
    const d = pointer.current;
    pointer.current = null;
    if (!d) return;
    const moved = Math.hypot(e.clientX - d.x, e.clientY - d.y);
    if (moved < 6 && Date.now() - d.at < 350) setReading(true);
  };

  const tree = (
    <AnimatePresence>
      {book && (
        <motion.div
          className="reading-overlay fixed inset-0 z-[100] flex flex-col bg-background/85 backdrop-blur-md dark:bg-background/55 dark:backdrop-blur-lg"
          data-book-slug={book.slug}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
        >
          {/* Back to the galaxy */}
          {!reading ? (
            <button
              onClick={onClose}
              className="reading-overlay-back absolute z-30 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-foreground/10 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur transition-colors hover:bg-foreground/20"
            >
              <ArrowLeft size={16} />
              {t("libraryPage.back")}
            </button>
          ) : null}

          {!reading && usesFutureLabTheme ? (
            <ThemeToggle
              showLabel
              className="reading-overlay-theme"
              labels={{
                light: "Giao diện sáng",
                dark: "Giao diện tối",
                toLight: "Chuyển sang giao diện sáng",
                toDark: "Chuyển sang giao diện tối",
              }}
            />
          ) : null}

          <AnimatePresence mode="wait">
            {reading ? (
              <motion.div
                key="reading"
                className="flex h-full w-full flex-col"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: reduceMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
              >
                <FlipBookReader
                  key={`${book.slug}-${lang}`}
                  pages={deck}
                  title={title}
                  author={book.meta.author}
                  tag={book.tags?.[0]}
                  date={book.date}
                  readingTime={book.readingTime}
                  coverSrc={book.meta.cover}
                  coverBackSrc={book.meta.coverBack}
                  leafPaperSrc={bookLeafPaperSrc(book.slug)}
                  blogHref={`/blog/${book.blogSlug ?? book.slug}`}
                  hasReview={hasReview}
                  onClose={() => setReading(false)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="notes"
                className="flex h-full w-full flex-col overflow-hidden lg:flex-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Left — the book as a spinnable, clickable 3D object */}
                <div className="relative hidden shrink-0 lg:block lg:h-full lg:w-[40%] xl:w-[42%]">
                  <motion.div
                    className="pointer-events-none absolute left-1/2 top-2 z-10 flex -translate-x-1/2 items-center text-primary"
                    initial={reduceMotion ? false : { y: -4, opacity: 0.65 }}
                    animate={reduceMotion ? { y: 0, opacity: 1 } : { y: 7, opacity: 1 }}
                    transition={reduceMotion
                      ? { duration: 0 }
                      : { repeat: Infinity, repeatType: "reverse", duration: 0.9, ease: "easeInOut" }}
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] shadow-sm backdrop-blur">
                      {t("libraryPage.open_book")}
                      <ArrowDown size={14} strokeWidth={1.8} />
                    </span>
                  </motion.div>
                  <div
                    className="h-full w-full cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={t("libraryPage.open_book")}
                    onPointerDown={onBookPointerDown}
                    onPointerUp={onBookPointerUp}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setReading(true);
                    }}
                  >
                    <BookViewer3D title={title} meta={detailMeta ?? book.meta} />
                  </div>
                  <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full bg-foreground/10 px-3.5 py-1.5 text-xs text-foreground/80 backdrop-blur md:flex">
                    <RotateCw size={13} />
                    {t("libraryPage.drag_to_spin")}
                  </div>
                </div>

                {/* Right — the key-ideas note, written on the book's OWN paper,
                    shown as a full sheet at the photo's true proportions. */}
                <div className="relative min-h-0 flex-1 overflow-hidden">
                  <div className="flex h-full items-center justify-center overflow-hidden p-2 sm:p-3 lg:p-4 xl:p-5">
                    <div
                      className="note-sheet relative"
                      style={{
                        aspectRatio: paperRatio ?? 0.562,
                        width: "min(50rem, 100%, var(--note-sheet-wide))",
                        maxHeight: "94dvh",
                        "--note-sheet-wide": `${(paperRatio ?? 0.562) * 94}dvh`,
                        "--note-sheet-mobile": `${(paperRatio ?? 0.562) * 94}dvh`,
                        ...(paperSrc ? { backgroundImage: `url(${paperSrc})` } : {}),
                      } as CSSProperties}
                      data-note-title-scale={noteTitleScale}
                      data-overview-opening={isOverviewOpening ? "true" : "false"}
                    >
                      {/* Language switch — floats on the sheet's top corner */}
                      {locales.length > 1 && (
                        <div className="note-language-switch absolute right-3 top-3 z-10 inline-flex items-center gap-0.5 rounded-full border border-[rgba(43,41,38,0.18)] bg-[rgba(255,255,255,0.5)] p-0.5 backdrop-blur">
                          {locales.map((loc) => (
                            <button
                              key={loc}
                              onClick={() => setLanguage(loc)}
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                                lang === loc
                                  ? "bg-[#2b2926] text-[#faf7f0] shadow-sm"
                                  : "note-soft hover:text-[#2b2926]"
                              }`}
                            >
                              {LOCALE_LABEL[loc] ?? loc.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Text sits inside the clean writing zone measured for this
                          exact paper asset. Responsive rules keep those per-book
                          boundaries intact, so collage decorations never become a
                          second text column or collide with the controls. */}
                      <div
                        className={`note-sheet-content flex flex-col items-center overflow-hidden text-center ${
                          outsideSummary
                            ? "note-sheet-content--summary"
                            : "relative h-full justify-start px-[14%] py-[7%] sm:px-[18%] sm:py-[10%]"
                        }`}
                      >
                        {isOverviewOpening && book.tags?.[0] && (
                          <p className="note-book-kicker note-accent text-[0.72rem] font-semibold uppercase tracking-[0.26em]">
                            {book.tags[0]}
                          </p>
                        )}
                        <h1 className={`note-title note-ink font-heading font-bold tracking-tight text-balance${
                          isOverviewOpening ? "" : " is-running"
                        }`}>
                          {title}
                        </h1>
                        {isOverviewOpening ? (
                          <p className="note-author note-soft font-serif italic">{book.meta.author}</p>
                        ) : null}
                        <div
                          key={`${book.slug}-${lang}-${overviewIndex}`}
                          className="note-overview-slide min-h-0 w-full max-w-[31rem] flex-1 overflow-hidden text-left"
                          data-overview-index={overviewIndex}
                          aria-live="polite"
                        >
                          {outsideSummary ? (
                            <>
                              {overviewSlide.tagline && (
                                <p className="note-overview-tagline note-ink mx-auto max-w-[28rem] text-center font-serif italic text-balance">
                                  {renderNoteInline(overviewSlide.tagline)}
                                </p>
                              )}
                              {overviewSlide.heading && (
                                <h2 className={`note-overview-heading note-accent text-center font-heading font-bold tracking-tight ${
                                  overviewSlide.tagline ? "mt-3" : ""
                                }`}>
                                  {overviewSlide.heading}
                                </h2>
                              )}
                              {overviewSlide.introduction?.length ? (
                                <div className="note-ink mt-3 space-y-2.5">
                                  {overviewSlide.introduction.map((paragraph, index) => (
                                    <p key={index}>{renderNoteInline(paragraph)}</p>
                                  ))}
                                </div>
                              ) : null}
                              {overviewSlide.lessons?.length ? (
                                <OutsideSummaryLessons
                                  numbered={outsideSummary.numbered}
                                  lessons={overviewSlide.lessons}
                                  start={overviewSlide.lessonStart}
                                />
                              ) : null}
                              {overviewSlide.conclusion?.length ? (
                                <div className="note-ink mt-3 space-y-2.5">
                                  {overviewSlide.conclusion.map((paragraph, index) => (
                                    <p key={index}>{renderNoteInline(paragraph)}</p>
                                  ))}
                                </div>
                              ) : null}
                            </>
                          ) : (
                            <>
                              {overviewSlide.coverNote && (
                                <p className="note-cover-note note-accent mx-auto max-w-[26rem] text-center font-serif italic leading-relaxed text-balance">
                                  {renderNoteInline(overviewSlide.coverNote)}
                                </p>
                              )}
                              {overviewSlide.keyPoints?.length ? (
                                <div className="note-key-ideas mt-2">
                                  <p className="note-key-ideas-label note-soft text-center text-[0.72rem] font-semibold uppercase tracking-[0.22em]">
                                    {t("libraryPage.key_ideas")}
                                  </p>
                                  <ol className="note-key-ideas-list mx-auto mt-3 flex max-w-[25rem] flex-col gap-2.5 text-left">
                                    {overviewSlide.keyPoints.map((point, index) => (
                                      <li key={`${overviewSlide.keyPointStart ?? 0}-${index}`} className="note-key-idea note-ink flex gap-2.5 leading-snug">
                                        <span className="note-badge mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.68rem] font-bold">
                                          {(overviewSlide.keyPointStart ?? 0) + index + 1}
                                        </span>
                                        <span>{point}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              ) : null}
                            </>
                          )}
                        </div>

                        <footer className="note-footer flex shrink-0 flex-col items-center">
                          {overviewSlides.length > 1 ? (
                            <nav className="note-pagination flex items-center justify-center gap-3" aria-label={lang === "vi" ? "Phân trang tổng quan" : "Overview pagination"}>
                            <button
                              type="button"
                              onClick={() => setOverviewIndex(overviewIndex - 1)}
                              disabled={overviewIndex === 0}
                              aria-label={lang === "vi" ? "Trang tổng quan trước" : "Previous overview page"}
                              className="note-page-button inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(43,41,38,0.26)] text-[#2b2926] transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <ChevronLeft size={17} aria-hidden />
                            </button>
                            <span className="note-soft min-w-12 text-center text-xs font-semibold tabular-nums">
                              {overviewIndex + 1} / {overviewSlides.length}
                            </span>
                            <button
                              type="button"
                              onClick={() => setOverviewIndex(overviewIndex + 1)}
                              disabled={overviewIndex === overviewSlides.length - 1}
                              aria-label={lang === "vi" ? "Trang tổng quan sau" : "Next overview page"}
                              className="note-page-button inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(43,41,38,0.26)] text-[#2b2926] transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <ChevronRight size={17} aria-hidden />
                            </button>
                            </nav>
                          ) : null}

                          {/* Open CTA + full review link */}
                          <div className="note-actions flex flex-wrap items-center justify-center gap-2.5">
                            <button
                              onClick={() => setReading(true)}
                              className="inline-flex items-center gap-2 rounded-full bg-[#2b2926] px-4 py-2 text-sm font-semibold text-[#faf7f0] shadow-md transition hover:opacity-90"
                            >
                              <BookOpen size={15} />
                              {t("libraryPage.open_book")}
                            </button>
                            {hasReview && (
                              <Link
                                href={`/blog/${book.blogSlug ?? book.slug}`}
                                className="note-soft inline-flex items-center gap-1.5 rounded-full border border-[rgba(43,41,38,0.28)] px-3.5 py-2 text-sm font-medium transition-colors hover:border-[#2b2926] hover:text-[#2b2926]"
                              >
                                {t("libraryPage.open_in_blog")}
                              </Link>
                            )}
                          </div>
                        </footer>

                      </div>
                    </div>
                  </div>
                </div>

                {/* Close (galaxy) */}
                <button
                  onClick={onClose}
                  aria-label={t("libraryPage.close")}
                  className="reading-overlay-close absolute z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground backdrop-blur transition-colors hover:border-primary hover:bg-secondary hover:text-primary"
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Portal to <body> so the overlay sits above the navbar (escapes <main>'s
  // stacking context), making the full-screen detail view + Back button clear.
  return mounted ? createPortal(tree, document.body) : null;
}
