"use client";

// Reading mode: a frosted full-screen panel — the book's cover on the left
// (gently tilted, with a soft shadow) and its FULL review on the right in the
// blog's "printed page" styling. Crisp HTML, language switch, fully responsive.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, BookOpen, RotateCw, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/i18n/dictionaries";
import BookViewer3D from "./BookViewer3D";
import { LOCALE_LABEL, type LibBookFull } from "@/lib/library/types";
import { bookPaperSrc } from "@/lib/library/papers";

export function ReadingOverlay({
  book,
  onClose,
}: {
  book: LibBookFull | null;
  onClose: () => void;
}) {
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!book) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [book, onClose]);

  const lang = book && book.bodies[language] ? language : "en";
  const hasReview = !!book && Object.keys(book.bodies).length > 0;
  // The book's scrapbook paper, shown exactly as the original image (undistorted).
  // When present we show JUST the paper — the written content gets added later.
  const paperSrc = book ? bookPaperSrc(book.slug) : null;

  const tree = (
    <AnimatePresence>
      {book && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-background/85 backdrop-blur-md md:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Back button — always visible, returns to the galaxy */}
          <button
            onClick={onClose}
            className="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur transition-colors hover:bg-foreground/20"
          >
            <ArrowLeft size={16} />
            {t("libraryPage.back")}
          </button>

          {/* Left — the book as a spinnable 3D object */}
          <div className="relative h-[40vh] shrink-0 md:h-full md:w-[42%]">
            <BookViewer3D title={book.titles[lang] ?? book.enTitle} meta={book.meta} />
            <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-foreground/10 px-3.5 py-1.5 text-xs text-foreground/80 backdrop-blur">
              <RotateCw size={13} />
              {t("libraryPage.drag_to_spin")}
            </div>
          </div>

          {/* Right — the full review */}
          <motion.div
            className="relative flex-1 overflow-y-auto bg-background"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            {/* Sticky toolbar */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:px-8">
              {/* Language — segmented control */}
              {hasReview ? (
                <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-secondary/50 p-0.5">
                  {Object.keys(book.bodies).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setLanguage(loc as Language)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        lang === loc
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {LOCALE_LABEL[loc] ?? loc.toUpperCase()}
                    </button>
                  ))}
                </div>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                {hasReview && (
                  <Link
                    href={`/blog/${book.blogSlug ?? book.slug}`}
                    className="hidden items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary sm:inline-flex"
                  >
                    <BookOpen size={14} />
                    {t("libraryPage.open_in_blog")}
                  </Link>
                )}
                <button
                  onClick={onClose}
                  aria-label={t("libraryPage.close")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-secondary hover:text-primary"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {paperSrc ? (
              // Just the scrapbook paper — shown exactly as the original image
              // (true aspect ratio, no distortion). Content is written later.
              <div className="flex justify-center px-4 py-6 md:px-8 md:py-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={paperSrc}
                  alt={book.titles[lang] ?? book.enTitle}
                  className="h-auto w-full max-w-[40rem] rounded-md shadow-2xl"
                />
              </div>
            ) : hasReview ? (
              <div className="mx-auto max-w-[44rem] px-5 py-8 md:px-8 md:py-12">
                <div className="book-page px-6 py-10 sm:px-10 sm:py-14">
                  <header className="mx-auto max-w-2xl text-center">
                    {book.tags?.[0] && <p className="book-kicker mb-5">{book.tags[0]}</p>}
                    <h1 className="book-title text-[clamp(1.8rem,1rem+2.6vw,2.7rem)]">
                      {book.titles[lang] ?? book.enTitle}
                    </h1>
                    <div className="mt-7 flex flex-col items-center gap-3">
                      <span className="book-rule w-12" />
                      <p className="book-byline text-[1.3rem] leading-none">{book.meta.author}</p>
                      <p className="book-meta flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.7rem] uppercase">
                        <span>{book.date}</span>
                        <span className="opacity-40">·</span>
                        <span>{book.readingTime}</span>
                      </p>
                    </div>
                    <p className="book-lead mx-auto mt-7 max-w-xl text-balance text-lg">
                      {book.descriptions[lang] ?? book.descriptions.en}
                    </p>
                  </header>

                  <div className="mx-auto my-10 flex max-w-2xl items-center gap-4">
                    <span className="book-rule flex-1" />
                    <span className="book-endmark text-sm">❦</span>
                    <span className="book-rule flex-1" />
                  </div>

                  <article className="post-content">{book.bodies[lang] ?? book.bodies.en}</article>

                  <div className="book-endmark mt-14 text-center text-base">❦ ❦ ❦</div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[55vh] items-center justify-center px-6 py-12">
                <div className="book-page max-w-md px-8 py-14 text-center">
                  <p className="book-kicker mb-5">{book.tags?.[0] ?? "Books"}</p>
                  <h1 className="book-title text-[clamp(1.6rem,1rem+2vw,2.3rem)]">
                    {book.titles[lang] ?? book.enTitle}
                  </h1>
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <span className="book-rule w-12" />
                    <p className="book-byline text-[1.2rem] leading-none">{book.meta.author}</p>
                  </div>
                  <p className="book-lead mx-auto mt-7 text-balance text-base">
                    {t("libraryPage.no_review")}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Portal to <body> so the overlay sits above the navbar (escapes <main>'s
  // stacking context), making the full-screen detail view + Back button clear.
  return mounted ? createPortal(tree, document.body) : null;
}
