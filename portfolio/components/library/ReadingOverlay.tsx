"use client";

// The book detail view, in two stages:
//   A · Notes  — the book as a spinnable 3D object beside its key ideas (the
//                "ý chính" note). Click the book (or the CTA) to open it.
//   B · Reading — the book opens into a real 2-page spread you flip through,
//                Apple-Books style (FlipBookReader / StPageFlip).
// Frosted full-screen panel, portalled above the navbar, theme-aware.

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, BookOpen, RotateCw, ArrowLeft, ArrowDown, MousePointerClick } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/i18n/dictionaries";
import BookViewer3D from "./BookViewer3D";
import { FlipBookReader } from "./FlipBookReader";
import { LOCALE_LABEL, type LibBookFull } from "@/lib/library/types";
import { bookPaperSrc, bookLeafPaperSrc } from "@/lib/library/papers";

export function ReadingOverlay({
  book,
  onClose,
}: {
  book: LibBookFull | null;
  onClose: () => void;
}) {
  const { language, setLanguage, t } = useLanguage();
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

  const lang = book && book.pages[language] ? language : "en";
  const hasReview = !!book && Object.keys(book.bodies).length > 0;
  const title = book ? book.titles[lang] ?? book.enTitle : "";
  const keyPoints = book ? book.keyPoints[lang] ?? book.keyPoints.en ?? [] : [];
  const coverNote = book ? book.coverNote[lang] ?? book.coverNote.en : undefined;
  const deck = book ? book.pages[lang] ?? book.pages.en ?? [] : [];
  // Locales offered in the segmented switch (de-duped, en first).
  const locales = book ? Array.from(new Set(["en", ...Object.keys(book.pages)])) : [];
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
          className="fixed inset-0 z-[100] flex flex-col bg-background/85 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Back to the galaxy */}
          <button
            onClick={onClose}
            className="absolute left-4 top-4 z-30 inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur transition-colors hover:bg-foreground/20"
          >
            <ArrowLeft size={16} />
            {t("libraryPage.back")}
          </button>

          <AnimatePresence mode="wait">
            {reading ? (
              <motion.div
                key="reading"
                className="flex h-full w-full flex-col"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
                className="flex h-full w-full flex-col overflow-y-auto md:flex-row md:overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Left — the book as a spinnable, clickable 3D object */}
                <div className="relative h-[42vh] shrink-0 md:h-full md:w-[44%]">
                  <motion.div
                    className="pointer-events-none absolute left-1/2 top-2 z-10 flex -translate-x-1/2 flex-col items-center gap-0.5 text-primary sm:top-4 md:top-14 md:gap-1"
                    initial={{ y: -4, opacity: 0.65 }}
                    animate={{ y: 7, opacity: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.9, ease: "easeInOut" }}
                  >
                    <span className="rounded-full bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] shadow-sm backdrop-blur">
                      {t("libraryPage.open_book")}
                    </span>
                    <ArrowDown size={26} strokeWidth={1.7} />
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
                <div className="relative flex-1 overflow-y-auto">
                  {/* min-h-full + items-center centers a short sheet but lets a
                      tall one grow and scroll from the top (no clipping). */}
                  <div className="flex min-h-full items-center justify-center p-3 sm:p-5 md:p-6">
                    <div
                      className="note-sheet relative"
                      style={{
                        // Big, width-driven sheet (~45rem) so the note reads large;
                        // the photo's tall proportions set the height and the panel
                        // scrolls if it runs past the screen.
                        aspectRatio: paperRatio ?? 0.562,
                        width: "min(45rem, 100%)",
                        ...(paperSrc ? { backgroundImage: `url(${paperSrc})` } : {}),
                      }}
                    >
                      {/* Language switch — floats on the sheet's top corner */}
                      {locales.length > 1 && (
                        <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-0.5 rounded-full border border-[rgba(43,41,38,0.18)] bg-[rgba(255,255,255,0.5)] p-0.5 backdrop-blur">
                          {locales.map((loc) => (
                            <button
                              key={loc}
                              onClick={() => setLanguage(loc as Language)}
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

                      {/* Text sits in the paper's clean central writing zone — the
                          collage borders live in the outer ~18%. Symmetric padding +
                          centred column keeps it balanced left/right and top/bottom,
                          clear of the decorated edges. */}
                      <div className="relative flex h-full flex-col items-center justify-center px-[18%] py-[12%] text-center">
                        {book.tags?.[0] && (
                          <p className="note-accent text-[0.72rem] font-semibold uppercase tracking-[0.26em]">
                            {book.tags[0]}
                          </p>
                        )}
                        <h1 className="note-ink mt-2 font-heading text-[clamp(1.45rem,0.95rem+1.8vw,2.25rem)] font-bold leading-[1.15] tracking-tight text-balance">
                          {title}
                        </h1>
                        <p className="note-soft mt-2 font-serif text-[1rem] italic">{book.meta.author}</p>
                        {coverNote && (
                          <p className="note-accent mx-auto mt-4 max-w-[26rem] font-serif text-[clamp(0.95rem,0.75rem+0.65vw,1.12rem)] italic leading-snug text-balance">
                            {coverNote}
                          </p>
                        )}

                        {/* Key ideas — the note (left-aligned list, centred as a block) */}
                        {keyPoints.length > 0 && (
                          <div className={coverNote ? "mt-4" : "mt-5"}>
                            <p className="note-soft text-[0.72rem] font-semibold uppercase tracking-[0.26em]">
                              {t("libraryPage.key_ideas")}
                            </p>
                            <ol className="mx-auto mt-3 inline-flex max-w-[24rem] flex-col gap-2 text-left">
                              {keyPoints.map((kp, i) => (
                                <li key={i} className="note-ink flex gap-2.5 text-[clamp(0.82rem,0.66rem+0.5vw,0.98rem)] leading-snug">
                                  <span className="note-badge mt-0.5 inline-flex h-[1.05rem] w-[1.05rem] shrink-0 items-center justify-center rounded-full text-[0.62rem] font-bold">
                                    {i + 1}
                                  </span>
                                  <span>{kp}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Open CTA + full review link */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
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

                        <p className="note-soft mt-4 inline-flex items-center justify-center gap-1.5 text-xs">
                          <MousePointerClick size={13} />
                          {t("libraryPage.click_book_hint")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Close (galaxy) */}
                <button
                  onClick={onClose}
                  aria-label={t("libraryPage.close")}
                  className="absolute right-4 top-4 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground backdrop-blur transition-colors hover:border-primary hover:bg-secondary hover:text-primary"
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
