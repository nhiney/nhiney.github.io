"use client";

// The Apple-Books-style reader: the opened book as a real 2-page spread you flip
// through. Built on StPageFlip (page-flip) for the soft page-turn + corner fold.
//
// React/StPageFlip own DIFFERENT DOM nodes on purpose: React renders the leaves
// into a hidden template it fully controls, and we hand *clones* to StPageFlip.
// So when StPageFlip tears its wrapper down on close, it never rips nodes out
// from under React (which would throw on unmount under React 19). Leaves are
// static content, so cloning loses nothing.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PageFlip } from "page-flip";
import { useLanguage } from "@/context/LanguageContext";
import type { BookPage } from "@/lib/library/types";

interface Props {
  pages: BookPage[];
  title: string;
  author: string;
  tag?: string;
  date?: string;
  readingTime?: string;
  /** Link to the full review on the blog, shown on the end leaf. */
  blogHref?: string;
  hasReview: boolean;
  onClose: () => void;
}

export function FlipBookReader({
  pages,
  title,
  author,
  tag,
  date,
  readingTime,
  blogHref,
  hasReview,
  onClose,
}: Props) {
  const { t } = useLanguage();
  const templateRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(pages.length);

  const flipNext = useCallback(() => flipRef.current?.flipNext(), []);
  const flipPrev = useCallback(() => flipRef.current?.flipPrev(), []);

  // Build the StPageFlip instance once. The deck never changes for a given
  // mount — the parent remounts this component (via key) on book/language change.
  useEffect(() => {
    const template = templateRef.current;
    const mount = mountRef.current;
    if (!template || !mount) return;

    let disposed = false;
    let pageFlip: PageFlip | null = null;

    (async () => {
      const { PageFlip } = await import("page-flip");
      if (disposed) return;

      // Hand StPageFlip its own copies of the leaves.
      const clones = Array.from(template.children).map((c) => c.cloneNode(true) as HTMLElement);
      clones.forEach((c) => mount.appendChild(c));

      pageFlip = new PageFlip(mount, {
        width: 460,
        height: 640,
        size: "stretch",
        minWidth: 280,
        maxWidth: 560,
        minHeight: 380,
        maxHeight: 780,
        drawShadow: true,
        // A touch slower with deeper turn-shadows reads as a heavier, more
        // premium paper turn.
        flippingTime: 820,
        maxShadowOpacity: 0.72,
        showCover: false,
        usePortrait: true,
        autoSize: true,
        mobileScrollSupport: false,
        clickEventForward: true,
        useMouseEvents: true,
        showPageCorners: true,
        swipeDistance: 18,
      });
      flipRef.current = pageFlip;

      pageFlip.loadFromHTML(clones);
      setTotal(pageFlip.getPageCount());
      setCurrent(pageFlip.getCurrentPageIndex());
      pageFlip.on("flip", (e) => setCurrent(e.data as number));
    })();

    return () => {
      disposed = true;
      try {
        pageFlip?.destroy();
      } catch {
        /* StPageFlip can throw mid-teardown; the node is being unmounted anyway. */
      }
      flipRef.current = null;
    };
  }, []);

  // Arrow keys flip; Escape returns to the notes view (stop it bubbling to the
  // overlay so the whole detail view doesn't close in one keypress).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flipNext();
      else if (e.key === "ArrowLeft") flipPrev();
      else if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      } else return;
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [flipNext, flipPrev, onClose]);

  const atStart = current <= 0;
  const atEnd = current >= total - 1;

  // The leaves, rendered once into a hidden template for StPageFlip to clone.
  const leaves = useMemo(
    () =>
      pages.map((page, i) => {
        const side = i % 2 === 0 ? "left" : "right";
        // Classic folio: just the page number, omitted on the title leaf.
        const folio = i === 0 ? "" : String(i + 1);
        return (
          <div key={i} className="flip-page" data-side={side}>
            <div className="flip-leaf">{renderLeaf(page, { title, author, tag, date, readingTime, blogHref, hasReview, folio, t })}</div>
          </div>
        );
      }),
    [pages, title, author, tag, date, readingTime, blogHref, hasReview, t]
  );

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-3 py-4 sm:px-6">
      {/* Hidden master copy React owns; StPageFlip clones from it. */}
      <div ref={templateRef} className="hidden" aria-hidden>
        {leaves}
      </div>

      {/* The live, flippable book. */}
      <div className="flex w-full flex-1 items-center justify-center overflow-hidden">
        <div ref={mountRef} className="flipbook-mount" />
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={flipPrev}
          disabled={atStart}
          aria-label={t("libraryPage.prev_page")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="min-w-20 text-center text-xs font-medium tabular-nums text-foreground/70">
          {current + 1} / {total}
        </span>
        <button
          onClick={flipNext}
          disabled={atEnd}
          aria-label={t("libraryPage.next_page")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Close (back to the notes view) */}
      <button
        onClick={onClose}
        aria-label={t("libraryPage.close")}
        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur transition hover:bg-secondary"
      >
        <X size={17} />
      </button>
    </div>
  );
}

type LeafCtx = {
  title: string;
  author: string;
  tag?: string;
  date?: string;
  readingTime?: string;
  blogHref?: string;
  hasReview: boolean;
  folio: string;
  t: (k: string) => string;
};

// Render one leaf's inner content by kind. Title & end leaves draw from the book
// props; content & list leaves draw from the deck.
function renderLeaf(page: BookPage, ctx: LeafCtx) {
  const { title, author, tag, date, readingTime, blogHref, hasReview, folio, t } = ctx;

  if (page.kind === "title") {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        {tag ? <p className="leaf-kicker mb-5">{tag}</p> : null}
        <h2 className="leaf-title text-[clamp(1.5rem,1rem+2.2vw,2.3rem)]">{title}</h2>
        <span className="leaf-rule my-5 w-10" />
        <p className="leaf-byline text-[1.15rem] leading-none">{author}</p>
        {date || readingTime ? (
          <p className="leaf-kicker mt-6 !tracking-[0.16em]">
            {[date, readingTime].filter(Boolean).join("  ·  ")}
          </p>
        ) : null}
      </div>
    );
  }

  if (page.kind === "end") {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="leaf-endmark text-base">❦</p>
        <p className="leaf-byline mt-5 text-[1.05rem]">{t("libraryPage.end_leaf")}</p>
        {hasReview && blogHref ? (
          <a
            href={blogHref}
            className="leaf-kicker mt-5 underline decoration-1 underline-offset-4 hover:opacity-80"
          >
            {t("libraryPage.read_full")} →
          </a>
        ) : null}
        <span className="leaf-folio">{folio}</span>
      </div>
    );
  }

  if (page.kind === "list") {
    const start = page.start ?? 0;
    return (
      <>
        {page.opening ? <p className="leaf-kicker mb-4">{t("libraryPage.key_ideas")}</p> : null}
        <ul className="leaf-list leaf-body">
          {(page.items ?? []).map((it, i) => (
            <li key={i}>
              <span className="leaf-num">{start + i + 1}</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
        <span className="leaf-folio">{folio}</span>
      </>
    );
  }

  // content
  const paras = page.paragraphs ?? [];
  return (
    <>
      {page.heading ? <h3 className="leaf-heading">{page.heading}</h3> : null}
      <div className={`leaf-body${page.opening ? " is-opening" : ""}`}>
        {paras.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <span className="leaf-folio">{folio}</span>
    </>
  );
}
