"use client";

// The Apple-Books-style reader: the opened book as a real 2-page spread you flip
// through. Built on StPageFlip (page-flip) for the soft page-turn + corner fold.
//
// React/StPageFlip own DIFFERENT DOM nodes on purpose: React renders the leaves
// into a hidden template it fully controls, and we hand *clones* to StPageFlip.
// So when StPageFlip tears its wrapper down on close, it never rips nodes out
// from under React (which would throw on unmount under React 19). Leaves are
// static content, so cloning loses nothing.

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
  /** Real front-cover photo — the first flippable (hard) leaf. */
  coverSrc?: string;
  /** Optional real back-cover photo for the closing hard leaf. */
  coverBackSrc?: string;
  /** Optional decorative paper photo used as the interior leaf background (e.g.
   * the pink floral handmade paper for 48 Laws). When set, the SVG stickers are
   * dropped — the paper's own pressed flowers are the decoration. */
  leafPaperSrc?: string | null;
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
  coverSrc,
  coverBackSrc,
  leafPaperSrc,
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
        // First & last leaves are hard covers — the book opens from its real
        // cover, and you can always flip back to it.
        showCover: true,
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
        const isHard = page.kind === "cover" || page.kind === "end";
        // Folio: content leaves numbered from 1; covers carry no number.
        const folio = isHard ? "" : String(i);
        const useCoverPhoto = page.kind === "cover" && !!coverSrc;
        const useBackPhoto = page.kind === "end" && !!coverBackSrc;
        return (
          <div key={i} className="flip-page" data-side={side} data-density={isHard ? "hard" : undefined}>
            {useCoverPhoto ? (
              <div className="flip-leaf flip-leaf-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="leaf-cover-img" src={coverSrc} alt={title} />
              </div>
            ) : useBackPhoto ? (
              <div className="flip-leaf flip-leaf-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="leaf-cover-img" src={coverBackSrc} alt="" />
              </div>
            ) : (
              <div className="flip-leaf">
                {page.kind === "content" && !leafPaperSrc ? <LeafSticker index={i} /> : null}
                {renderLeaf(page, { title, author, tag, date, readingTime, blogHref, hasReview, folio, t })}
              </div>
            )}
          </div>
        );
      }),
    [pages, title, author, tag, date, readingTime, coverSrc, coverBackSrc, leafPaperSrc, blogHref, hasReview, t]
  );

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center px-3 py-4 sm:px-6${
        leafPaperSrc ? " flipreader-paper" : ""
      }`}
      style={leafPaperSrc ? ({ "--leaf-paper-url": `url(${leafPaperSrc})` } as CSSProperties) : undefined}
    >
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

// Inline markup for leaf prose — ==highlight==, *italic*, **bold**. Flat (no
// nesting): the content is authored so marks never overlap.
function renderInline(text: string): ReactNode {
  const re = /==([^=]+)==|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] != null) out.push(<mark key={key++} className="leaf-hl">{m[1]}</mark>);
    else if (m[2] != null) out.push(<strong key={key++}>{m[2]}</strong>);
    else out.push(<em key={key++}>{m[3]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// A "Câu mình muốn nhớ" / "Chốt lại" takeaway renders as a highlighted margin
// note (label chip + italic line); every other paragraph renders inline-marked.
function renderPara(p: string, key: number): ReactNode {
  // Essence line at the top of each law.
  const cv = p.match(/^Giá trị cốt lõi\s+—\s+([\s\S]+)$/);
  if (cv) {
    return (
      <p key={key} className="leaf-coreval">
        <span className="leaf-coreval-label">Giá trị cốt lõi</span>
        <span className="leaf-coreval-text">{renderInline(cv[1])}</span>
      </p>
    );
  }
  // Takeaway at the bottom.
  const mk = p.match(/^(Câu mình muốn nhớ|Chốt lại)\s+—\s+([\s\S]+)$/);
  if (mk) {
    return (
      <p key={key} className="leaf-keynote">
        <span className="leaf-keynote-label">{mk[1]}</span>
        <span className="leaf-keynote-text">{renderInline(mk[2])}</span>
      </p>
    );
  }
  return <p key={key}>{renderInline(p)}</p>;
}

// Cute scrapbook stickers — one per content leaf, picked by leaf index so each
// page feels hand-decorated. They sit BEHIND the text (see .leaf-sticker CSS).
const STICKERS: ReactNode[] = [
  // 0 · washi tape strip (drawn purely in CSS, no glyph)
  null,
  // 1 · sparkle
  <svg key="s" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2c.7 4.6 2 5.9 6.6 6.6C14 9.3 12.7 10.6 12 15c-.7-4.4-2-5.7-6.6-6.4C10 7.9 11.3 6.6 12 2z" />
  </svg>,
  // 2 · heart
  <svg key="h" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 20.3l-1.4-1.3C5.4 14.2 2 11.1 2 7.6 2 5 4 3 6.5 3c1.7 0 3.3.9 4.1 2.3L12 7.5l1.4-2.2C14.2 3.9 15.8 3 17.5 3 20 3 22 5 22 7.6c0 3.5-3.4 6.6-8.6 11.4L12 20.3z" />
  </svg>,
  // 3 · little asterisk / spark doodle
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
    <path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7" />
  </svg>,
  // 4 · star outline
  <svg key="t" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.9z" />
  </svg>,
];

function LeafSticker({ index }: { index: number }) {
  const v = index % STICKERS.length;
  return (
    <span className={`leaf-sticker leaf-sticker-${v}`} aria-hidden>
      {STICKERS[v]}
    </span>
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

  if (page.kind === "title" || page.kind === "cover") {
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
        {paras.map((p, i) => renderPara(p, i))}
      </div>
      <span className="leaf-folio">{folio}</span>
    </>
  );
}
