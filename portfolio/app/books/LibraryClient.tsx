"use client";

// Reading room as a "book galaxy": every book floats in space; orbit to drift
// through the exhibition and click one to read. Adapts to light/dark theme.
// Clicking a book gives it a real, shareable URL (/books/<slug>) via pushState
// — no remount, so the 3D scene stays alive; static pages handle direct loads.

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ReadingOverlay } from "@/components/library/ReadingOverlay";
import type { LibBookFull, LibBookView } from "@/lib/library/types";

const BookGalaxy = dynamic(() => import("@/components/library/BookGalaxy"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#eceef2] text-foreground/50 dark:bg-[#07080f]">
      <Loader2 className="mr-2 animate-spin" size={18} />
      <span className="text-sm">Entering the galaxy…</span>
    </div>
  ),
});

export function LibraryClient({
  books,
  initialSlug,
}: {
  books: LibBookFull[];
  initialSlug?: string;
}) {
  const { t, language } = useLanguage();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug ?? null);
  const [isDark, setIsDark] = useState(false);

  // Theme detection (light/dark).
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Open a book → push /books/<slug> (no navigation/remount).
  const openBook = useCallback((slug: string) => {
    setSelectedSlug(slug);
    window.history.pushState({ slug }, "", `/books/${slug}/`);
  }, []);

  const closeBook = useCallback(() => {
    setSelectedSlug(null);
    window.history.pushState({}, "", `/books/`);
  }, []);

  // Keep selection in sync with browser back/forward.
  useEffect(() => {
    const onPop = () => {
      const m = window.location.pathname.match(/\/books\/([^/]+)\/?$/);
      const slug = m && m[1] ? m[1] : null;
      setSelectedSlug(slug && books.some((b) => b.slug === slug) ? slug : null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [books]);

  const view: LibBookView[] = useMemo(
    () => books.map((b) => ({ slug: b.slug, title: b.titles[language] ?? b.enTitle, meta: b.meta })),
    [books, language]
  );

  const selected = useMemo(
    () => books.find((b) => b.slug === selectedSlug) ?? null,
    [books, selectedSlug]
  );

  return (
    <section className="relative h-[calc(100dvh-4rem)] w-full overflow-hidden bg-[radial-gradient(125%_95%_at_50%_22%,#ffffff,#eaedf4_55%,#d7dcec_100%)] dark:bg-[#07080f]">
      {/* Light-mode atmosphere — a soft rose glow behind the (transparent) canvas */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_52%_at_50%_38%,hsl(var(--primary)/0.14),transparent_70%)] dark:hidden" />

      <BookGalaxy books={view} onSelect={openBook} paused={!!selectedSlug} isDark={isDark} />

      {/* Soft scrims so the title/hint stay readable over any book behind them */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-background via-background/75 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/90 to-transparent" />

      {/* Overlaid title + hint (theme-aware text) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center px-6 pt-7 text-center sm:pt-9">
        <p className="font-hand text-xl text-primary/90">{t("libraryPage.kicker")}</p>
        <h1 className="mt-0.5 font-serif text-[1.9rem] font-semibold tracking-tight text-foreground sm:text-[2.7rem]">
          {t("libraryPage.title")}
        </h1>
        <span className="mt-3 h-px w-12 bg-foreground/25" />
      </div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border/50 bg-background/80 px-4 py-1.5 text-xs text-foreground/90 backdrop-blur">
        <Sparkles size={13} />
        {t("libraryPage.galaxy_hint")}
      </div>

      <ReadingOverlay book={selected} onClose={closeBook} />
    </section>
  );
}
