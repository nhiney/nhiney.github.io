"use client";

// The Apple-Books-style reader: the opened book as a real 2-page spread you flip
// through. Built on StPageFlip (page-flip) for the soft page-turn + corner fold.
//
// React/StPageFlip own DIFFERENT DOM nodes on purpose: React renders the leaves
// into a hidden template it fully controls, and we hand *clones* to StPageFlip.
// So when StPageFlip tears its wrapper down on close, it never rips nodes out
// from under React (which would throw on unmount under React 19). Content is
// clone-safe; native note fields are hydrated when their live clones are made.

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Eye,
  FileSearch,
  Film,
  FlaskConical,
  Gauge,
  GitFork,
  Images,
  LockKeyhole,
  MessagesSquare,
  OctagonX,
  RotateCcw,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  UsersRound,
  Zap,
  X,
} from "lucide-react";
import type { PageFlip } from "page-flip";
import { useLanguage } from "@/context/LanguageContext";
import { LayeredTimeMapPage } from "@/components/library/LayeredTimeMapPage";
import { LoopRestorationPage } from "@/components/library/LoopRestorationPage";
import { FutureLabPage } from "@/components/library/FutureLabPage";
import { BreathingHousePage } from "@/components/library/BreathingHousePage";
import { ThemeToggle } from "@/components/widgets/ThemeToggle";
import {
  DAC_ILLUSTRATIONS,
  parseDacIllustrationMarker,
  type DacIllustration,
  type DacIllustrationBlock,
} from "@/lib/library/dacIllustrations";
import type { BookPage } from "@/lib/library/types";

const READER_NOTE_STORAGE_PREFIX = "portfolio:reader-note:";

function spreadReadingAnchor(
  page: number,
  mode: "portrait" | "landscape" | "unknown",
  pageCount: number,
) {
  const lastPage = Math.max(pageCount - 1, 0);
  if (mode === "landscape" && page > 0 && page < lastPage) {
    return Math.min(page + 1, lastPage);
  }
  return Math.min(Math.max(page, 0), lastPage);
}

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
  const frameRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const flippingRef = useRef(false);
  const currentLeafRef = useRef(0);
  const readingAnchorRef = useRef(0);
  const orientationRef = useRef<"portrait" | "landscape" | "unknown">("unknown");
  const restoringAnchorRef = useRef(false);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(pages.length);
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | "unknown">("unknown");
  const [isFlipping, setIsFlipping] = useState(false);
  const compactDeck = useMemo(
    () => pages.some(
      (page) => page.density === "compact"
        || page.theme === "conversation-atelier"
        || page.theme === "habit-field-guide"
        || page.theme === "thinking-dossier"
        || page.theme === "power-board"
        || page.theme === "breathing-house"
        || page.theme === "layered-time-map"
        || page.theme === "loop-restoration-workshop"
        || page.theme === "future-ethics-lab"
    ),
    [pages]
  );
  const readerTheme = useMemo(
    () => pages.find((page) => page.theme)?.theme,
    [pages]
  );
  const isBreathingHouse = readerTheme === "breathing-house";
  const isLayeredTimeMap = readerTheme === "layered-time-map";
  const isLoopRestoration = readerTheme === "loop-restoration-workshop";
  const isFutureLab = readerTheme === "future-ethics-lab";
  const usesAuthoredProgress = readerTheme === "conversation-atelier"
    || readerTheme === "habit-field-guide"
    || isBreathingHouse
    || isLayeredTimeMap
    || isLoopRestoration
    || isFutureLab;

  const flipNext = useCallback(() => {
    if (!flippingRef.current) flipRef.current?.flipNext();
  }, []);
  const flipPrev = useCallback(() => {
    if (!flippingRef.current) flipRef.current?.flipPrev();
  }, []);

  // Build the StPageFlip instance once. The deck never changes for a given
  // mount — the parent remounts this component (via key) on book/language change.
  useEffect(() => {
    const template = templateRef.current;
    const frame = frameRef.current;
    const mount = mountRef.current;
    if (!template || !frame || !mount) return;

    let disposed = false;
    let pageFlip: PageFlip | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let resizeFrame = 0;
    let requestUpdate: (() => void) | null = null;

    (async () => {
      const { PageFlip } = await import("page-flip");
      if (disposed) return;

      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Hand StPageFlip its own copies of the leaves.
      const clones = Array.from(template.children).map((c) => c.cloneNode(true) as HTMLElement);

      clones.forEach((clone, leafIndex) => {
        const markLeafActive = () => {
          readingAnchorRef.current = leafIndex;
        };
        clone.addEventListener("pointerdown", markLeafActive, true);
        clone.addEventListener("focusin", markLeafActive, true);

        clone.querySelectorAll<HTMLElement>("[id^='breathing-heading-']").forEach((heading) => {
          heading.id = `live-${heading.id}`;
        });
        clone.querySelectorAll<HTMLElement>("[aria-labelledby^='breathing-heading-']").forEach((page) => {
          const labelledBy = page.getAttribute("aria-labelledby");
          if (labelledBy) page.setAttribute("aria-labelledby", `live-${labelledBy}`);
        });
        clone.querySelectorAll<HTMLElement>("[data-page-control]").forEach((control) => {
          // StPageFlip handles pointer gestures on the page root. Keep native
          // controls inside a cloned leaf interactive without starting a turn.
          control.addEventListener("mousedown", (event) => event.stopPropagation());
          control.addEventListener("touchstart", (event) => event.stopPropagation(), { passive: true });

          const noteStorageKey = control.dataset.noteStorageKey;
          if (noteStorageKey && control instanceof HTMLTextAreaElement) {
            const storageKey = `${READER_NOTE_STORAGE_PREFIX}${noteStorageKey}`;
            try {
              control.value = window.localStorage.getItem(storageKey) ?? "";
            } catch {
              /* Reading and writing still work when local storage is unavailable. */
            }
            control.addEventListener("input", () => {
              try {
                window.localStorage.setItem(storageKey, control.value);
              } catch {
                /* Keep the field usable if storage is disabled or full. */
              }
            });
          }
        });
      });
      clones.forEach((c) => mount.appendChild(c));

      pageFlip = new PageFlip(mount, {
        width: 460,
        height: 640,
        size: "stretch",
        minWidth: 280,
        maxWidth: 560,
        minHeight: 380,
        maxHeight: 780,
        drawShadow: !reducedMotion,
        flippingTime: reducedMotion ? 1 : coarsePointer ? 560 : 720,
        maxShadowOpacity: coarsePointer ? 0.44 : 0.58,
        // First & last leaves are hard covers — the book opens from its real
        // cover, and you can always flip back to it.
        showCover: true,
        usePortrait: true,
        autoSize: true,
        // Vertical gestures remain available to the surrounding viewport;
        // content itself is paginated and never scrolls inside a leaf.
        mobileScrollSupport: true,
        clickEventForward: true,
        useMouseEvents: true,
        showPageCorners: !coarsePointer && !reducedMotion,
        disableFlipByClick: coarsePointer,
        swipeDistance: coarsePointer ? 32 : 18,
      });
      flipRef.current = pageFlip;

      const syncOrientation = (value: unknown, restoreAnchor = false) => {
        if (disposed) return;
        if (value !== "portrait" && value !== "landscape") return;

        orientationRef.current = value;
        setOrientation(value);

        // StPageFlip canonicalizes a two-page spread to its first leaf when
        // orientation changes. Restore the exact leaf the reader was on so a
        // portrait → landscape → portrait resize never moves them backwards.
        if (restoreAnchor && pageFlip) {
          const anchor = Math.min(
            Math.max(readingAnchorRef.current, 0),
            Math.max(pageFlip.getPageCount() - 1, 0),
          );
          if (pageFlip.getCurrentPageIndex() !== anchor) {
            restoringAnchorRef.current = true;
            pageFlip.turnToPage(anchor);
            restoringAnchorRef.current = false;
          }
        }
      };

      pageFlip.on("init", (event) => {
        const data = event.data as { mode?: unknown; page?: unknown };
        if (typeof data.page === "number") {
          currentLeafRef.current = data.page;
          const initialMode = data.mode === "portrait" || data.mode === "landscape"
            ? data.mode
            : "unknown";
          readingAnchorRef.current = spreadReadingAnchor(
            data.page,
            initialMode,
            pageFlip?.getPageCount() ?? pages.length,
          );
        }
        syncOrientation(data.mode);
      });
      pageFlip.on("changeOrientation", (event) => syncOrientation(event.data, true));
      pageFlip.on("changeState", (event) => {
        if (disposed) return;
        const flipping = event.data === "flipping";
        flippingRef.current = flipping;
        setIsFlipping(flipping);
      });
      pageFlip.on("flip", (event) => {
        if (disposed) return;
        const nextPage = event.data as number;
        const activeOrientation = pageFlip?.getOrientation() ?? "unknown";
        const orientationReflow = orientationRef.current !== "unknown"
          && activeOrientation !== orientationRef.current;
        const pageChanged = nextPage !== currentLeafRef.current;

        currentLeafRef.current = nextPage;
        if (pageChanged && !orientationReflow && !restoringAnchorRef.current) {
          readingAnchorRef.current = spreadReadingAnchor(
            nextPage,
            activeOrientation,
            pageFlip?.getPageCount() ?? pages.length,
          );
        }
        setCurrent(nextPage);
      });

      pageFlip.loadFromHTML(clones);
      setTotal(pageFlip.getPageCount());
      const initialPage = pageFlip.getCurrentPageIndex();
      currentLeafRef.current = initialPage;
      readingAnchorRef.current = spreadReadingAnchor(
        initialPage,
        pageFlip.getOrientation(),
        pageFlip.getPageCount(),
      );
      setCurrent(initialPage);

      // PageFlip listens for window resizes, while mobile browser chrome and
      // split-screen changes can resize only the reader frame. Observe both.
      requestUpdate = () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          if (disposed) return;
          try {
            pageFlip?.update();
          } catch {
            /* Ignore a resize racing with reader teardown. */
          }
        });
      };
      resizeObserver = new ResizeObserver(requestUpdate);
      resizeObserver.observe(frame);
      window.visualViewport?.addEventListener("resize", requestUpdate);
    })();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      if (requestUpdate) window.visualViewport?.removeEventListener("resize", requestUpdate);
      cancelAnimationFrame(resizeFrame);
      pageFlip?.off("init");
      pageFlip?.off("changeOrientation");
      pageFlip?.off("changeState");
      pageFlip?.off("flip");
      try {
        pageFlip?.destroy();
      } catch {
        /* StPageFlip can throw mid-teardown; the node is being unmounted anyway. */
      }
      flipRef.current = null;
      flippingRef.current = false;
    };
  }, [compactDeck, pages.length]);

  // Arrow keys flip; Escape returns to the notes view (stop it bubbling to the
  // overlay so the whole detail view doesn't close in one keypress).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.matches("input, textarea, select, [contenteditable='true']")
        && (e.key === "ArrowRight" || e.key === "ArrowLeft")
      ) {
        return;
      }
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
  const visibleLeafEnd = orientation === "landscape" && current > 0 && current < total - 1
    ? Math.min(current + 1, pages.length - 1)
    : Math.min(current, pages.length - 1);
  const announcedLeafIndex = usesAuthoredProgress ? visibleLeafEnd : current;
  const currentPage = pages[Math.min(Math.max(announcedLeafIndex, 0), Math.max(pages.length - 1, 0))];
  const currentHeading = currentPage?.heading || currentPage?.kicker || title;
  const authoredPageTotal = usesAuthoredProgress
    ? pages.filter((page) => page.kind === "content").length
    : total;
  const contentOrdinals = useMemo(() => {
    return pages.map((page, index) => page.kind === "content"
      ? pages.slice(0, index + 1).filter((candidate) => candidate.kind === "content").length
      : null);
  }, [pages]);
  const visibleContentOrdinals = usesAuthoredProgress
    ? contentOrdinals
      .slice(Math.max(current, 0), visibleLeafEnd + 1)
      .filter((value): value is number => value !== null)
    : [];
  const authoredPageCurrent = usesAuthoredProgress
    ? contentOrdinals
      .slice(0, visibleLeafEnd + 1)
      .filter((value): value is number => value !== null).length
    : current + 1;
  const authoredPageLabel = visibleContentOrdinals.length > 1
    ? `${String(visibleContentOrdinals[0]).padStart(2, "0")}–${String(visibleContentOrdinals.at(-1)).padStart(2, "0")}`
    : String(visibleContentOrdinals[0] ?? authoredPageCurrent).padStart(2, "0");
  const progress = authoredPageTotal > 0
    ? Math.min(100, Math.max(0, (authoredPageCurrent / authoredPageTotal) * 100))
    : 0;

  // The leaves, rendered once into a hidden template for StPageFlip to clone.
  const leaves = useMemo(
    () =>
      pages.map((page, i) => {
        // PageFlip opens cover-based books as [cover], then [1, 2]. For this
        // edition, odd content leaves therefore sit on the left of a spread.
        // Keep the established parity for other editions while aligning this
        // book's gutter shadow, asymmetric padding, and folio to the real side.
        const side = usesAuthoredProgress
          ? (i % 2 === 0 ? "right" : "left")
          : (i % 2 === 0 ? "left" : "right");
        const isHard = page.kind === "cover" || page.kind === "end";
        // Folio: content leaves numbered from 1; covers carry no number.
        const folio = isHard ? "" : String(i);
        const useCoverPhoto = page.kind === "cover" && !!coverSrc;
        const useBackPhoto = page.kind === "end" && !!coverBackSrc;
        return (
          <div
            key={i}
            className="flip-page"
            data-side={side}
            data-density={isHard ? "hard" : page.density}
            data-theme={isHard ? undefined : page.theme}
            data-design={isHard ? undefined : page.design}
            data-time-map-design={isHard ? undefined : page.timeMapDesign}
            data-loop-design={isHard ? undefined : page.loopDesign}
            data-future-lab-design={isHard ? undefined : page.futureLabDesign}
            data-continuation={page.continuation || undefined}
            data-authored-section={page.authoredSection?.index}
            data-authored-section-count={page.authoredSection?.total}
          >
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
                {renderLeaf(page, { title, author, tag, date, readingTime, blogHref, hasReview, folio, t })}
              </div>
            )}
          </div>
        );
      }),
    [pages, title, author, tag, date, readingTime, coverSrc, coverBackSrc, blogHref, hasReview, t, usesAuthoredProgress]
  );

  return (
    <div
      className={`flipreader-shell relative flex h-full w-full flex-col items-center justify-center${
        compactDeck ? " flipreader-compact" : ""
      }${
        leafPaperSrc ? " flipreader-paper" : ""
      }`}
      data-book-orientation={orientation}
      data-reader-theme={readerTheme}
      style={leafPaperSrc ? ({ "--leaf-paper-url": `url(${leafPaperSrc})` } as CSSProperties) : undefined}
    >
      {/* Hidden master copy React owns; StPageFlip clones from it. */}
      <div ref={templateRef} className="hidden" aria-hidden>
        {leaves}
      </div>

      {/* The live, flippable book. */}
      <div className="flipreader-stage">
        <div ref={frameRef} className="flipbook-frame">
          <div
            ref={mountRef}
            className="flipbook-mount"
            role="region"
            aria-label={title}
          />
        </div>
      </div>

      {isFutureLab ? (
        <ThemeToggle
          showLabel
          className="flipreader-theme-toggle"
          labels={{
            light: "Giao diện sáng",
            dark: "Giao diện tối",
            toLight: "Chuyển sang giao diện sáng",
            toDark: "Chuyển sang giao diện tối",
          }}
        />
      ) : null}

      {/* Controls */}
      <div className="flipreader-controls" role="group" aria-label={title}>
        <button
          type="button"
          onClick={flipPrev}
          disabled={atStart || isFlipping}
          aria-label={t("libraryPage.prev_page")}
          data-flip-action="previous"
          className="flipreader-control"
        >
          <ChevronLeft size={20} aria-hidden="true" focusable="false" />
        </button>
        <span className={`flipreader-counter${usesAuthoredProgress ? " has-progress" : ""}`}>
          <span className="flipreader-counter-numbers" aria-hidden>
            {usesAuthoredProgress
              ? `${authoredPageLabel} / ${authoredPageTotal}`
              : `${current + 1} / ${total}`}
          </span>
          {usesAuthoredProgress ? (
            <span
              className="flipreader-progress"
              role="progressbar"
              aria-label={`${authoredPageLabel} / ${authoredPageTotal}`}
              aria-valuemin={0}
              aria-valuemax={authoredPageTotal}
              aria-valuenow={authoredPageCurrent}
            >
              <span style={{ width: `${progress}%` }} />
            </span>
          ) : null}
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {authoredPageCurrent} / {authoredPageTotal}. {currentHeading}
          </span>
        </span>
        <button
          type="button"
          onClick={flipNext}
          disabled={atEnd || isFlipping}
          aria-label={t("libraryPage.next_page")}
          data-flip-action="next"
          className="flipreader-control"
        >
          <ChevronRight size={20} aria-hidden="true" focusable="false" />
        </button>
      </div>

      {/* Close (back to the notes view) */}
      <button
        onClick={onClose}
        aria-label={t("libraryPage.back")}
        className="flipreader-close"
      >
        <X size={17} />
      </button>
    </div>
  );
}

// Inline markup for leaf prose — ==highlight==, *italic*, **bold**, `code` and
// external links. Flat (no nesting): authored marks never overlap.
function renderInline(text: string): ReactNode {
  const re = /==([^=]+)==|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] != null) out.push(<mark key={key++} className="leaf-hl">{m[1]}</mark>);
    else if (m[2] != null) out.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[3] != null) out.push(<em key={key++}>{m[3]}</em>);
    else if (m[4] != null) out.push(<code key={key++} className="leaf-inline-code">{m[4]}</code>);
    else {
      out.push(
        <a
          key={key++}
          className="leaf-link"
          href={m[6]}
          target="_blank"
          rel="noreferrer"
        >
          {m[5]}
        </a>
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const THINKING_DOSSIER_LABELS = {
  "THỬ NGAY": { Icon: Zap, tone: "fast" },
  "DẤU HIỆU NÊN CHẬM LẠI": { Icon: Clock3, tone: "warning" },
  "BA DẤU VẾT CẦN KIỂM TRA": { Icon: SearchCheck, tone: "check" },
  "BÀI KIỂM TRA TRƯỚC KHI CHỐT KẾ HOẠCH": { Icon: ClipboardCheck, tone: "check" },
  "THỬ ĐẢO CHIỀU": { Icon: RotateCcw, tone: "reflection" },
  "MINH HỌA: CUỘN PHIM VÀ ALBUM ẢNH": { Icon: Film, tone: "reflection" },
  "PHIẾU DỪNG": { Icon: Clock3, tone: "warning" },
  "TRƯỚC KHI KẾT LUẬN": { Icon: SearchCheck, tone: "check" },
  "BA Ô TRỐNG CẦN ĐIỀN": { Icon: FileSearch, tone: "check" },
  "CÂU NHẮC NHỎ": { Icon: CircleHelp, tone: "note" },
  "ĐÈN XANH CHO TRỰC GIÁC": { Icon: Gauge, tone: "check" },
  "BÀI KIỂM TRA HAI KHUNG": { Icon: RotateCcw, tone: "reflection" },
  "MA TRẬN TỐC ĐỘ QUYẾT ĐỊNH": { Icon: Gauge, tone: "note" },
  "NGHI THỨC RA QUYẾT ĐỊNH NHÓM": { Icon: UsersRound, tone: "process" },
  "GHI CHÚ BIÊN TẬP VÀ ĐỐI CHIẾU": { Icon: FileSearch, tone: "note" },
} as const;

function ThinkingDossierLabel({ label }: { label: keyof typeof THINKING_DOSSIER_LABELS }) {
  const { Icon, tone } = THINKING_DOSSIER_LABELS[label];
  return (
    <h4 className="leaf-thinking-label" data-tone={tone}>
      <Icon size={14} aria-hidden />
      <span>{label}</span>
    </h4>
  );
}

function parsePowerRoundMarker(marker: string): { number: string; title: string } | null {
  const match = marker.match(/^\[\[power-round:(\d+)\|([^\]]+)\]\]$/);
  return match ? { number: match[1], title: match[2] } : null;
}

type PowerSceneId = "stage" | "coat" | "water" | "gift" | "shadow" | "knot";

function parsePowerSceneMarker(marker: string): PowerSceneId | null {
  const match = marker.match(/^\[\[power-scene-illustration:(stage|coat|water|gift|shadow|knot)\]\]$/);
  return match ? match[1] as PowerSceneId : null;
}

function isEditorialLabel(line: string): boolean {
  return line.length <= 48
    && /[A-ZÀ-Ỹ]/.test(line)
    && line === line.toLocaleUpperCase("vi");
}

/** Turn legacy ASCII diagrams into calm editorial structures. The manuscript
 * stays unchanged; only its presentation changes from faux circuitry/arrows to
 * readable steps, paired comparisons, or labelled notes. */
function renderTextDiagram(block: string, key: number): ReactNode | null {
  const match = block.match(/^```(?:text)?\n([\s\S]*?)\n```$/);
  if (!match) return null;

  const rawLines = match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line !== "↓");
  const columnRows = rawLines.map((line) => line.split(/\s{2,}/).filter(Boolean));
  const isTwoColumn = columnRows.length >= 2
    && columnRows.every((row) => row.length === 2);

  if (isTwoColumn) {
    const [headings, ...rows] = columnRows;
    return (
      <section key={key} className="leaf-editorial-compare" aria-label={headings.join(" và ")}>
        {rows.map((row, rowIndex) => (
          <dl key={`${row[0]}-${rowIndex}`}>
            <div><dt>{headings[0]}</dt><dd>{renderInline(row[0])}</dd></div>
            <div><dt>{headings[1]}</dt><dd>{renderInline(row[1])}</dd></div>
          </dl>
        ))}
      </section>
    );
  }

  const labelledPairs: Array<{ label: string; text: string }> = [];
  for (let index = 0; index + 1 < rawLines.length; index += 2) {
    if (!isEditorialLabel(rawLines[index])) break;
    labelledPairs.push({ label: rawLines[index], text: rawLines[index + 1] });
  }
  if (labelledPairs.length * 2 === rawLines.length && labelledPairs.length > 0) {
    return (
      <dl key={key} className="leaf-editorial-notes">
        {labelledPairs.map((item) => (
          <div key={item.label}>
            <dt>{renderInline(item.label)}</dt>
            <dd>{renderInline(item.text)}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <ol key={key} className="leaf-editorial-sequence">
      {rawLines.map((line, index) => (
        <li key={`${line}-${index}`}>
          <span aria-hidden>{index + 1}</span>
          <span>{renderInline(line)}</span>
        </li>
      ))}
    </ol>
  );
}

function parsePipeRow(block: string): string[] | null {
  if (!/^\|.+\|$/.test(block.trim())) return null;
  return block
    .trim()
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

// A "Câu mình muốn nhớ" / "Chốt lại" takeaway renders as a highlighted margin
// note (label chip + italic line); every other paragraph renders inline-marked.
function renderPara(p: string, key: number): ReactNode {
  if (p === "[[time-map-legend]]") {
    return (
      <dl key={key} className="leaf-editorial-notes" aria-label="Ba lớp đọc cuốn sách">
        <div><dt>Câu chuyện</dt><dd>Điều cuốn sách đang kể</dd></div>
        <div><dt>Suy ngẫm</dt><dd>Điều mình đang hiểu và cảm nhận</dd></div>
        <div><dt>Hôm nay</dt><dd>Việc mình có thể làm trong hiện tại</dd></div>
      </dl>
    );
  }

  const textDiagram = renderTextDiagram(p, key);
  if (textDiagram) return textDiagram;

  const illustrationId = parseDacIllustrationMarker(p);
  if (illustrationId) {
    return <DacIllustrationBox key={key} illustration={DAC_ILLUSTRATIONS[illustrationId]} />;
  }
  if (p === "[[kind-conversation-mindmap]]") {
    return <KindConversationMindmap key={key} />;
  }
  if (p === "[[recognition-formula]]") {
    return <RecognitionFormula key={key} />;
  }
  if (p === "[[ethical-persuasion-table]]") {
    return <EthicalPersuasionTable key={key} />;
  }
  if (p === "[[consent-traffic-light-table]]") {
    return <ConsentTrafficLightTable key={key} />;
  }
  if (p === "[[seven-day-care-table]]") {
    return <SevenDayCareTable key={key} />;
  }
  if (p === "[[thinking-dossier-series]]") {
    return <ThinkingDossierSeries key={key} />;
  }
  if (p === "[[thinking-film-album-comparison]]") {
    return <ThinkingFilmAlbumComparison key={key} />;
  }
  if (p === "[[thinking-knowledge-gaps-table]]") {
    return <ThinkingKnowledgeGapsTable key={key} />;
  }
  if (p === "[[thinking-question-substitution-table]]") {
    return <ThinkingQuestionSubstitutionTable key={key} />;
  }
  if (p === "[[thinking-decision-speed-matrix]]") {
    return <ThinkingDecisionSpeedMatrix key={key} />;
  }
  if (p === "[[silence-casefile-series]]") {
    return <SilenceCasefileSeries key={key} />;
  }
  if (p === "[[silence-observation-notes]]") {
    return <SilenceObservationNotes key={key} />;
  }
  if (p === "[[silence-courage-flow]]") {
    return <SilenceCourageFlow key={key} />;
  }
  if (p === "[[silence-interrogation-brief]]") {
    return <SilenceInterrogationBrief key={key} />;
  }
  if (p === "[[silence-evidence-table]]") {
    return <SilenceEvidenceTable key={key} />;
  }
  if (p === "[[silence-evidence-loop]]") {
    return <SilenceEvidenceLoop key={key} />;
  }
  if (p === "[[silence-safety-formula]]") {
    return <SilenceSafetyFormula key={key} />;
  }
  if (p === "[[silence-vulnerability-branch]]") {
    return <SilenceVulnerabilityBranch key={key} />;
  }
  if (p === "[[silence-power-map]]") {
    return <SilencePowerMap key={key} />;
  }
  if (p === "[[silence-help-table]]") {
    return <SilenceHelpTable key={key} />;
  }
  if (p === "[[silence-fear-protocol]]") {
    return <SilenceFearProtocol key={key} />;
  }
  if (p === "[[power-board-series]]") {
    return <PowerBoardSeries key={key} />;
  }
  if (p === "[[power-card-series]]") {
    return <PowerPhaseBanner key={key} phase="cards" />;
  }
  if (p === "[[power-practice-series]]") {
    return <PowerPhaseBanner key={key} phase="practice" />;
  }
  const powerRound = parsePowerRoundMarker(p);
  if (powerRound) {
    return <PowerRoundBanner key={key} {...powerRound} />;
  }
  if (p === "[[power-compass]]") {
    return <PowerCompass key={key} />;
  }
  if (p === "[[power-reputation-table]]") {
    return <PowerReputationTable key={key} />;
  }
  if (p === "[[power-influence-formula]]") {
    return <PowerInfluenceFormula key={key} />;
  }
  if (p === "[[power-values-flex-table]]") {
    return <PowerValuesFlexTable key={key} />;
  }
  if (p === "[[power-value-dependency-diagram]]") {
    return <PowerValueDependencyDiagram key={key} />;
  }
  if (p === "[[power-caution-spectrum-diagram]]") {
    return <PowerCautionSpectrumDiagram key={key} />;
  }
  if (p === "[[power-position-mindmap]]") {
    return <PowerPositionMindmap key={key} />;
  }
  if (p === "[[power-plan-stop-diagram]]") {
    return <PowerPlanStopDiagram key={key} />;
  }
  if (p === "[[power-decision-console-diagram]]") {
    return <PowerDecisionConsoleDiagram key={key} />;
  }
  if (p === "[[power-six-images-diagram]]") {
    return <PowerSixImagesDiagram key={key} />;
  }
  if (p === "[[power-change-flow-diagram]]") {
    return <PowerChangeFlowDiagram key={key} />;
  }
  if (p === "[[power-victory-stop-diagram]]") {
    return <PowerVictoryStopDiagram key={key} />;
  }
  if (p === "[[power-core-flex-mindmap]]") {
    return <PowerCoreFlexMindmap key={key} />;
  }
  const powerScene = parsePowerSceneMarker(p);
  if (powerScene) {
    return <PowerSceneIllustration key={key} scene={powerScene} />;
  }
  if (p === "[[identity-change-diagram]]") {
    return <IdentityChangeDiagram key={key} />;
  }
  if (p === "[[habit-loop-diagram]]") {
    return <HabitLoopDiagram key={key} />;
  }
  if (p === "[[four-laws-practice-board]]") {
    return <FourLawsPracticeBoard key={key} />;
  }
  if (p === "[[seven-day-reading-table]]") {
    return <SevenDayReadingTable key={key} />;
  }
  if (p === "[[review-loop-diagram]]") {
    return <ReviewLoopDiagram key={key} />;
  }
  if (p === "[[silent-progress-diagram]]") {
    return <SilentProgressDiagram key={key} />;
  }
  if (p === "[[preparation-action-table]]") {
    return <PreparationActionTable key={key} />;
  }
  if (p === "[[energy-levels-diagram]]") {
    return <EnergyLevelsDiagram key={key} />;
  }

  const emphasizedHeading = p.match(/^\*\*([^*]+)\*\*$/);
  if (emphasizedHeading) {
    const thinkingLabel = emphasizedHeading[1] as keyof typeof THINKING_DOSSIER_LABELS;
    if (thinkingLabel in THINKING_DOSSIER_LABELS) {
      return <ThinkingDossierLabel key={key} label={thinkingLabel} />;
    }
    return <h4 key={key} className="leaf-subheading">{emphasizedHeading[1]}</h4>;
  }

  const powerCardHeading = p.match(/^###\s+(?:Thẻ|Nước cờ)\s+(\d+)\s+—\s+([\s\S]+)$/);
  if (powerCardHeading) {
    return (
      <PowerCardHeading
        key={key}
        number={powerCardHeading[1]}
        title={powerCardHeading[2]}
      />
    );
  }

  const powerChoice = p.match(/^\*\*([AB])\.\*\*\s+([\s\S]+)$/);
  if (powerChoice) {
    return (
      <p key={key} className="leaf-power-choice" data-choice={powerChoice[1].toLowerCase()}>
        <span>{powerChoice[1]}</span>
        <span>{renderInline(powerChoice[2])}</span>
      </p>
    );
  }

  const powerVerdict = p.match(/^\*\*(Chọn B(?: khi có thể thử an toàn)?\.)\*\*\s+([\s\S]+)$/);
  if (powerVerdict) {
    return (
      <aside key={key} className="leaf-power-note leaf-power-verdict">
        <Check size={14} aria-hidden />
        <p><strong>{powerVerdict[1]}</strong> {renderInline(powerVerdict[2])}</p>
      </aside>
    );
  }

  const powerGuardrail = p.match(
    /^\*\*(Lá cờ đỏ|Cách nói khác|Cách tự vệ|Cách nói rõ|Cách dùng sạch):\*\*\s+([\s\S]+)$/
  );
  if (powerGuardrail) {
    const isRisk = powerGuardrail[1] === "Lá cờ đỏ";
    const Icon = isRisk ? ShieldAlert : ShieldCheck;
    return (
      <aside key={key} className="leaf-power-guardrail" data-tone={isRisk ? "risk" : "safe"}>
        <Icon size={14} aria-hidden />
        <p><strong>{powerGuardrail[1]}:</strong> {renderInline(powerGuardrail[2])}</p>
      </aside>
    );
  }

  const powerBeforeAfter = p.match(/^\*\*(Trước|Sau):\*\*\s+([\s\S]+)$/);
  if (powerBeforeAfter) {
    return (
      <blockquote
        key={key}
        className="leaf-power-before-after"
        data-tone={powerBeforeAfter[1] === "Trước" ? "before" : "after"}
      >
        <span>{powerBeforeAfter[1]}</span>
        <p>{renderInline(powerBeforeAfter[2])}</p>
      </blockquote>
    );
  }

  if (p.startsWith("— ")) {
    return <p key={key} className="leaf-power-dialogue-line">{renderInline(p)}</p>;
  }

  const powerNote = p.match(
    /^\*\*(Một câu mang theo|Thử ngay|Ranh giới dễ nhớ|Bài tập 30 giây|Cuốn sổ ba dòng|Nước đi cuối ngày|Đèn báo|Khóa an toàn|Thao tác đặt lại|Trang soi lại|Câu hỏi dưới hình|Câu khép lại 48 nước cờ|Trước khi bắt đầu, điền ba ô):\*\*\s+([\s\S]+)$/
  );
  if (powerNote) {
    return (
      <aside key={key} className="leaf-power-note">
        <CircleHelp size={14} aria-hidden />
        <p><strong>{powerNote[1]}:</strong> {renderInline(powerNote[2])}</p>
      </aside>
    );
  }

  const subheading = p.match(/^###\s+([\s\S]+)$/);
  if (subheading) {
    return <h4 key={key} className="leaf-subheading">{renderInline(subheading[1])}</h4>;
  }

  const bullet = p.match(/^-\s+([\s\S]+)$/);
  if (bullet) {
    return (
      <p key={key} className="leaf-bullet">
        <span className="leaf-bullet-mark" aria-hidden>•</span>
        <span>{renderInline(bullet[1])}</span>
      </p>
    );
  }

  const dialogue = p.match(/^>\s+\[(before|after|next)\]\s+([\s\S]+)$/);
  if (dialogue) {
    const labels = { before: "Trước", after: "Sau", next: "Tiếp theo" } as const;
    const tone = dialogue[1] as keyof typeof labels;
    return (
      <blockquote key={key} className="leaf-dialogue" data-tone={tone}>
        <span className="leaf-dialogue-label">{labels[tone]}</span>
        <span>{renderInline(dialogue[2])}</span>
      </blockquote>
    );
  }

  const quote = p.match(/^>\s+([\s\S]+)$/);
  if (quote) {
    return <blockquote key={key} className="leaf-quote">{renderInline(quote[1])}</blockquote>;
  }

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

function isPlainCardBody(block: string): boolean {
  return !/^(###\s|>\s|-\s|\*\*[^*]+\*\*$|\[\[)/.test(block);
}

function plainInlineLength(block: string): number {
  return block.replace(/==|\*\*|\*/g, "").length;
}

/** Structured content gets a little editorial variety without changing its
 * order or wording: short bullet runs become checklists, and repeated labelled
 * steps become cards. Prose, quotes, forms, tables and diagrams stay one-column. */
function renderParagraphSequence(paragraphs: string[], keyOffset = 0): ReactNode[] {
  const nodes: ReactNode[] = [];
  let index = 0;

  while (index < paragraphs.length) {
    const tableRow = parsePipeRow(paragraphs[index]);
    if (tableRow) {
      let end = index;
      const rows: string[][] = [];
      while (end < paragraphs.length) {
        const row = parsePipeRow(paragraphs[end]);
        if (!row || row.length !== tableRow.length) break;
        rows.push(row);
        end += 1;
      }
      const [headers, ...bodyRows] = rows;
      nodes.push(
        <section
          key={`editorial-table-${keyOffset + index}`}
          className="leaf-editorial-table"
          aria-label={headers.join(" / ")}
        >
          <p className="leaf-editorial-table-heading">
            {headers.map((header, headerIndex) => (
              <span key={`${header}-${headerIndex}`}>{renderInline(header)}</span>
            ))}
          </p>
          {bodyRows.length ? bodyRows.map((row, rowIndex) => (
            <dl key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <div key={`${cellIndex}-${cell}`}>
                  <dt>{renderInline(headers[cellIndex] ?? `Mục ${cellIndex + 1}`)}</dt>
                  <dd>{renderInline(cell)}</dd>
                </div>
              ))}
            </dl>
          )) : (
            <p className="leaf-editorial-table-single">
              {headers.map((cell, cellIndex) => (
                <span key={`${cellIndex}-${cell}`}>{renderInline(cell)}</span>
              ))}
            </p>
          )}
        </section>
      );
      index = end;
      continue;
    }

    const ordered = paragraphs[index].match(/^(\d+)\.\s+([\s\S]+)$/);
    if (ordered) {
      let end = index;
      const items: Array<{ number: string; text: string }> = [];
      while (end < paragraphs.length) {
        const match = paragraphs[end].match(/^(\d+)\.\s+([\s\S]+)$/);
        if (!match) break;
        items.push({ number: match[1], text: match[2] });
        end += 1;
      }
      nodes.push(
        <ol key={`ordered-group-${keyOffset + index}`} className="leaf-step-list">
          {items.map((item) => (
            <li key={item.number}>
              <span className="leaf-step-num" aria-hidden>{item.number}</span>
              <span>{renderInline(item.text)}</span>
            </li>
          ))}
        </ol>
      );
      index = end;
      continue;
    }

    const bullet = paragraphs[index].match(/^-\s+([\s\S]+)$/);
    if (bullet) {
      let end = index;
      const items: string[] = [];
      while (end < paragraphs.length) {
        const match = paragraphs[end].match(/^-\s+([\s\S]+)$/);
        if (!match) break;
        items.push(match[1]);
        end += 1;
      }
      const useGrid = items.length >= 3
        && items.length <= 8
        && items.every((item) => !item.includes("....") && plainInlineLength(item) <= 90);
      nodes.push(
        <ul
          key={`bullet-group-${keyOffset + index}`}
          className={`leaf-bullet-group${useGrid ? " is-grid" : ""}`}
        >
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>
              <span className="leaf-bullet-mark" aria-hidden>•</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      index = end;
      continue;
    }

    const cardPairs: Array<{ heading: string; body: string }> = [];
    let pairEnd = index;
    while (pairEnd + 1 < paragraphs.length) {
      const heading = paragraphs[pairEnd].match(/^\*\*([^*]+)\*\*$/);
      const body = paragraphs[pairEnd + 1];
      if (!heading || !isPlainCardBody(body) || plainInlineLength(body) > 230) break;
      cardPairs.push({ heading: heading[1], body });
      pairEnd += 2;
    }
    if (cardPairs.length >= 2) {
      nodes.push(
        <div key={`card-grid-${keyOffset + index}`} className="leaf-card-grid">
          {cardPairs.map((pair) => (
            <section key={pair.heading} className="leaf-card">
              <h4>{renderInline(pair.heading)}</h4>
              <p>{renderInline(pair.body)}</p>
            </section>
          ))}
        </div>
      );
      index = pairEnd;
      continue;
    }

    nodes.push(renderPara(paragraphs[index], keyOffset + index));
    index += 1;
  }

  return nodes;
}

function renderContentParagraphs(
  paragraphs: string[],
  sectionBreaks: BookPage["sectionBreaks"]
): ReactNode[] {
  if (!sectionBreaks?.length) return renderParagraphSequence(paragraphs);

  const nodes: ReactNode[] = [];
  let start = 0;
  sectionBreaks.forEach((sectionBreak) => {
    nodes.push(
      ...renderParagraphSequence(
        paragraphs.slice(start, sectionBreak.beforeParagraph),
        start
      )
    );
    nodes.push(
      <h3
        key={`section-break-${sectionBreak.beforeParagraph}`}
        className="leaf-inline-section-heading"
      >
        {renderInline(sectionBreak.heading)}
      </h3>
    );
    start = sectionBreak.beforeParagraph;
  });
  nodes.push(...renderParagraphSequence(paragraphs.slice(start), start));
  return nodes;
}

function ThinkingDossierSeries() {
  return (
    <header className="leaf-thinking-series">
      <BrainCircuit size={20} aria-hidden />
      <div>
        <span>Tư duy nhanh và chậm</span>
        <strong>14 hồ sơ giúp mình nhìn rõ hơn trước khi quyết định</strong>
      </div>
    </header>
  );
}

const THINKING_MEMORY_VIEWS = [
  {
    label: "Cuộn phim",
    detail: "Ghi lại từng khoảnh khắc mình đã sống.",
    tone: "experience",
    Icon: Film,
  },
  {
    label: "Album ảnh",
    detail: "Chỉ giữ vài khoảnh khắc nổi bật để kể lại.",
    tone: "memory",
    Icon: Images,
  },
] as const;

function ThinkingFilmAlbumComparison() {
  return (
    <figure className="leaf-thinking-visual leaf-thinking-memory-views">
      <figcaption>Minh họa: Cuộn phim và Album ảnh</figcaption>
      <dl>
        {THINKING_MEMORY_VIEWS.map(({ label, detail, tone, Icon }) => (
          <div key={label} data-tone={tone}>
            <dt><Icon size={18} aria-hidden /><span>{label}</span></dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

function ThinkingAuthoredSectionLabel({
  section,
  continuation,
}: {
  section: NonNullable<BookPage["authoredSection"]>;
  continuation?: boolean;
}) {
  return (
    <p className="leaf-thinking-section-label">
      <span>Hồ sơ {String(section.index).padStart(2, "0")}/{section.total}</span>
      {continuation ? <span className="leaf-thinking-section-continuation">Tiếp</span> : null}
    </p>
  );
}

function SilenceCasefileSeries() {
  return (
    <header className="leaf-silence-series">
      <div>
        <span>Hồ sơ im lặng</span>
        <strong>14 lát cắt từ <em>Sự Im Lặng Của Bầy Cừu</em></strong>
      </div>
    </header>
  );
}

const SILENCE_OBSERVATION_NOTES = [
  {
    tone: "seen",
    label: "Điều mình thấy",
    detail: "Họ liên tục ngắt lời.",
  },
  {
    tone: "inference",
    label: "Điều mình đang đoán",
    detail: "Họ không tôn trọng mình.",
  },
  {
    tone: "check",
    label: "Điều mình cần kiểm tra",
    detail: "Đây là thói quen của họ hay họ chỉ làm vậy với mình?",
  },
] as const;

function SilenceObservationNotes() {
  return (
    <figure className="leaf-silence-visual leaf-silence-observation">
      <figcaption className="leaf-silence-visual-title">Ba dòng ghi nhanh</figcaption>
      <dl>
        {SILENCE_OBSERVATION_NOTES.map((note) => (
          <div key={note.label} data-tone={note.tone}>
            <dt>{note.label}</dt>
            <dd>{note.detail}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

const SILENCE_COURAGE_STEPS = [
  { tone: "signal", label: "Nỗi sợ", detail: "báo hiệu nguy hiểm" },
  { tone: "attention", label: "Sự nhạy cảm", detail: "giúp nhìn thấy chi tiết" },
  { tone: "discipline", label: "Kỷ luật", detail: "giữ mình không phản ứng vội" },
  { tone: "purpose", label: "Mục tiêu", detail: "nhắc mình vì sao phải bước tiếp" },
] as const;

function SilenceCourageFlow() {
  return (
    <figure
      className="leaf-silence-visual leaf-silence-flow"
      aria-label="Bên trong lòng can đảm"
    >
      <ol>
        {SILENCE_COURAGE_STEPS.map((step, index) => (
          <li key={step.label} data-step={index + 1} data-tone={step.tone}>
            <strong>{step.label}</strong>
            <span>{step.detail}</span>
          </li>
        ))}
      </ol>
      <p className="leaf-silence-flow-result">
        <span>Kết quả</span>
        <strong>Hành động</strong>
      </p>
    </figure>
  );
}

const SILENCE_INTERROGATION_BRIEF = [
  { tone: "need", label: "Clarice cần", detail: "Một manh mối." },
  {
    tone: "exchange",
    label: "Lecter muốn",
    detail: "Quyền bước vào những vùng riêng tư của cô.",
  },
  {
    tone: "risk",
    label: "Nguy cơ",
    detail: "Người cần thông tin trở thành người bị điều khiển.",
  },
  {
    tone: "boundary",
    label: "Ranh giới",
    detail: "Chia sẻ có lựa chọn, không trao toàn bộ bản thân để đổi lấy câu trả lời.",
  },
] as const;

function SilenceInterrogationBrief() {
  return (
    <figure className="leaf-silence-visual leaf-silence-brief">
      <figcaption className="leaf-silence-visual-title">Biên bản trao đổi</figcaption>
      <dl>
        {SILENCE_INTERROGATION_BRIEF.map((item) => (
          <div key={item.label} data-tone={item.tone}>
            <dt>{item.label}</dt>
            <dd>{item.detail}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

const SILENCE_EVIDENCE_ROWS = [
  ["Điều đã biết", "Họ trả lời bằng một từ."],
  ["Điều mình đang đoán", "Họ khó chịu hoặc không còn quan tâm."],
  ["Điều còn thiếu", "Họ đang ở đâu, có bận không, tâm trạng thế nào."],
  ["Bước kiểm tra", "Hỏi lại vào thời điểm phù hợp thay vì tự kết luận."],
] as const;

function SilenceEvidenceTable() {
  return (
    <div className="leaf-silence-visual leaf-silence-table leaf-silence-evidence-table">
      <table>
        <caption className="sr-only">Bảng chứng cứ cho tình huống một tin nhắn chỉ được trả lời bằng một từ</caption>
        <thead>
          <tr>
            <th scope="col">Ngăn hồ sơ</th>
            <th scope="col">Nội dung</th>
          </tr>
        </thead>
        <tbody>
          {SILENCE_EVIDENCE_ROWS.map(([label, detail]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SILENCE_EVIDENCE_LOOP = ["Nhìn thấy", "Đặt giả thuyết", "Kiểm tra", "Sửa lại"] as const;

function SilenceEvidenceLoop() {
  return (
    <figure
      className="leaf-silence-visual leaf-silence-evidence-loop"
      aria-label="Quy trình kiểm tra một giả thuyết"
    >
      <ol>
        {SILENCE_EVIDENCE_LOOP.map((step, index) => (
          <li key={step} data-step={index + 1}>
            <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>
    </figure>
  );
}

const SILENCE_SAFETY_FORMULA = [
  { tone: "speech", label: "Lời nói dễ nghe" },
  { tone: "boundary", label: "Tôn trọng ranh giới" },
  { tone: "consistency", label: "Hành vi nhất quán" },
] as const;

function SilenceSafetyFormula() {
  return (
    <figure className="leaf-plain-visual">
      <figcaption>Cảm giác an toàn có cơ sở</figcaption>
      <p className="leaf-plain-formula">
        {SILENCE_SAFETY_FORMULA.map((part) => part.label).join(" + ")} = <strong>Cảm giác an toàn có cơ sở</strong>
      </p>
    </figure>
  );
}

const SILENCE_VULNERABILITY_PATHS = [
  {
    tone: "safe",
    label: "Giữ an toàn",
    items: ["hỏi họ cần gì", "giữ bí mật", "cho họ lựa chọn"],
  },
  {
    tone: "risk",
    label: "Khai thác",
    items: ["nhắc lại để gây đau", "dùng làm lợi thế", "khiến họ phụ thuộc"],
  },
] as const;

function SilenceVulnerabilityBranch() {
  return (
    <figure className="leaf-plain-visual">
      <figcaption>Hai cách phản ứng khi nhìn thấy điểm yếu</figcaption>
      <div className="leaf-editorial-compare">
        {SILENCE_VULNERABILITY_PATHS.map((path) => (
          <dl key={path.label}>
            <div>
              <dt>{path.label}</dt>
              <dd>{path.items.join(" · ")}</dd>
            </div>
          </dl>
        ))}
      </div>
    </figure>
  );
}

const SILENCE_POWER_DIRECTIONS = [
  "Ai có địa vị và quyền quyết định?",
  "Ai có người hỗ trợ?",
  "Ai đang giữ thông tin?",
  "Mình có quyền từ chối hoặc rời đi không?",
] as const;

function SilencePowerMap() {
  return (
    <figure className="leaf-plain-visual">
      <figcaption>Bốn câu hỏi để đọc quyền lực trong một căn phòng</figcaption>
      <ol className="leaf-editorial-sequence">
        {SILENCE_POWER_DIRECTIONS.map((question, index) => (
          <li key={question}>
            <span aria-hidden>{index + 1}</span>
            <span>{question}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

const SILENCE_HELP_ROWS = [
  ["Hỏi người kia đang cần gì", "Tự quyết định thay họ"],
  ["Nói rõ mình có thể giúp đến đâu", "Hứa nhiều hơn khả năng"],
  ["Chia sẻ trách nhiệm", "Ôm toàn bộ vấn đề"],
  ["Vẫn giữ sức khỏe và ranh giới", "Kiệt sức rồi oán trách"],
] as const;

function SilenceHelpTable({
  partIndex = 0,
  partCount = 1,
}: {
  partIndex?: number;
  partCount?: number;
}) {
  const rows = itemsForPart(SILENCE_HELP_ROWS, partIndex, partCount);
  return (
    <div className="leaf-silence-visual leaf-silence-table leaf-silence-help-table">
      {partCount > 1 ? (
        <p className="leaf-rich-part-label">Giúp đỡ và cứu hộ · {partIndex + 1}/{partCount}</p>
      ) : null}
      <table>
        <caption className="sr-only">Phân biệt quan tâm lành mạnh và cố làm người cứu hộ</caption>
        <thead>
          <tr>
            <th scope="col">Quan tâm lành mạnh</th>
            <th scope="col">Cố làm người cứu hộ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([healthy, rescuer]) => (
            <tr key={healthy}>
              <td>{healthy}</td>
              <td>{rescuer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SILENCE_FEAR_PROTOCOL = [
  { label: "Gọi tên", detail: "“Mình đang sợ bị đánh giá.”" },
  { label: "Trở về dữ kiện", detail: "“Hiện tại người kia mới đặt một câu hỏi.”" },
  { label: "Chọn bước nhỏ nhất", detail: "“Mình sẽ xin vài giây suy nghĩ.”" },
  {
    label: "Giữ lối ra",
    detail: "“Nếu cuộc trò chuyện xúc phạm hoặc thiếu an toàn, mình có quyền dừng lại.”",
  },
] as const;

function SilenceFearProtocol() {
  return (
    <figure className="leaf-silence-visual leaf-silence-protocol">
      <figcaption className="leaf-silence-visual-title">Quy trình 60 giây</figcaption>
      <ol>
        {SILENCE_FEAR_PROTOCOL.map((step, index) => (
          <li key={step.label} data-step={index + 1}>
            <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function PowerBoardSeries() {
  return (
    <header className="leaf-power-series">
      <Eye size={20} aria-hidden />
      <div>
        <span>Phần I · Đọc bàn cờ</span>
        <h3>19 lăng kính và 48 nước cờ để hiểu quyền lực mà vẫn giữ được mình</h3>
      </div>
    </header>
  );
}

function PowerPhaseBanner({ phase }: { phase: "cards" | "practice" }) {
  const content = phase === "cards"
    ? {
        label: "Phần II",
        title: "48 nước cờ, tám cách đọc",
        description: "Cảnh ngắn · lựa chọn · cảnh báo · đối thoại · phép thử · sơ đồ",
        Icon: GitFork,
      }
    : {
        label: "Phần III",
        title: "Bảy ngày đưa sự tỉnh táo vào đời sống",
        description: "Quan sát cấu trúc, lựa chọn và loại quyền lực mình muốn có",
        Icon: Gauge,
      };
  const { Icon } = content;

  return (
    <header className="leaf-power-phase" data-phase={phase}>
      <Icon size={18} aria-hidden />
      <div>
        <span>{content.label}</span>
        <h3>{content.title}</h3>
        <small>{content.description}</small>
      </div>
    </header>
  );
}

function PowerRoundBanner({ number, title }: { number: string; title: string }) {
  return (
    <div className="leaf-power-round">
      <span>Vòng cờ {number}</span>
      <h3>{title}</h3>
    </div>
  );
}

function PowerCardHeading({ number, title }: { number: string; title: string }) {
  return (
    <h4 className="leaf-power-card-heading">
      <span>Nước cờ {number}</span>
      <strong>{title}</strong>
    </h4>
  );
}

const POWER_COMPASS_DIRECTIONS = [
  {
    position: "Phía trên",
    label: "Quyền quyết định",
    description: "Ai có thể chốt, thay đổi hoặc hủy quyết định?",
    Icon: Check,
  },
  {
    position: "Bên phải",
    label: "Quyền thông tin",
    description: "Ai biết điều mà những người khác chưa biết?",
    Icon: FileSearch,
  },
  {
    position: "Phía dưới",
    label: "Quyền chịu rủi ro",
    description: "Ai phải gánh hậu quả nếu quyết định sai?",
    Icon: ShieldAlert,
  },
  {
    position: "Bên trái",
    label: "Quyền lên tiếng",
    description: "Ai đang có góc nhìn quan trọng nhưng không được nghe?",
    Icon: MessagesSquare,
  },
] as const;

function PowerCompass() {
  return (
    <figure className="leaf-power-visual leaf-power-compass">
      <figcaption>Bốn hướng trên la bàn</figcaption>
      <dl>
        {POWER_COMPASS_DIRECTIONS.map(({ position, label, description, Icon }) => (
          <div key={position}>
            <dt><Icon size={14} aria-hidden /><span>{position}</span></dt>
            <dd><strong>{label}</strong><span>{description}</span></dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

const POWER_REPUTATION_FIELDS = [
  ["Điều đã hứa", "Cam kết cụ thể"],
  ["Hành động có thể kiểm tra", "Đã làm, chưa làm hay đã báo sớm?"],
  ["Ảnh hưởng tạo ra", "Ai được lợi hoặc phải sửa hậu quả?"],
] as const;

function PowerReputationTable() {
  return (
    <div className="leaf-power-visual leaf-power-responsive-table">
      <div className="leaf-power-visual-title"><Eye size={13} aria-hidden />Dấu vết của uy tín</div>
      <div className="leaf-power-desktop-table">
        <table>
          <caption className="sr-only">Dấu vết của uy tín</caption>
          <thead><tr>{POWER_REPUTATION_FIELDS.map(([label]) => <th key={label} scope="col">{label}</th>)}</tr></thead>
          <tbody><tr>{POWER_REPUTATION_FIELDS.map(([label, value]) => <td key={label}>{value}</td>)}</tr></tbody>
        </table>
      </div>
      <dl className="leaf-power-mobile-records">
        {POWER_REPUTATION_FIELDS.map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </div>
  );
}

const POWER_INFLUENCE_FACTORS = [
  "Năng lực thật",
  "Khả năng làm rõ giá trị",
  "Sự nhất quán theo thời gian",
] as const;

function PowerInfluenceFormula() {
  return (
    <figure className="leaf-power-visual leaf-power-formula">
      <figcaption>Ảnh hưởng đáng tin</figcaption>
      <div role="img" aria-label={POWER_INFLUENCE_FACTORS.join(" nhân ")}>
        {POWER_INFLUENCE_FACTORS.map((factor, index) => (
          <Fragment key={factor}>
            {index > 0 && <span className="leaf-power-formula-sign" aria-hidden>×</span>}
            <strong>{factor}</strong>
          </Fragment>
        ))}
      </div>
    </figure>
  );
}

const POWER_VALUES_FLEX_ROWS = [
  ["Không nói dối khách hàng", "Cách trình bày thông tin"],
  ["Không nhận công lao của người khác", "Cách phân chia vai trò"],
  ["Không bỏ qua rủi ro an toàn", "Thời gian và phạm vi triển khai"],
  ["Tôn trọng quyền từ chối", "Cách thương lượng"],
] as const;

function PowerValuesFlexTable({
  partIndex = 0,
  partCount = 1,
}: {
  partIndex?: number;
  partCount?: number;
}) {
  const rows = itemsForPart(POWER_VALUES_FLEX_ROWS, partIndex, partCount);
  return (
    <div className="leaf-power-visual leaf-power-responsive-table leaf-power-values-table">
      <div className="leaf-power-visual-title"><ShieldCheck size={13} aria-hidden />Hai cột giữ mình</div>
      {partCount > 1 ? (
        <p className="leaf-rich-part-label">Điều giữ vững và điều linh hoạt · {partIndex + 1}/{partCount}</p>
      ) : null}
      <div className="leaf-power-desktop-table">
        <table>
          <caption className="sr-only">Điều giữ vững và điều có thể thay đổi</caption>
          <thead><tr><th scope="col">Điều giữ vững</th><th scope="col">Điều có thể thay đổi</th></tr></thead>
          <tbody>
            {rows.map(([fixed, flexible]) => (
              <tr key={fixed}><th scope="row">{fixed}</th><td>{flexible}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="leaf-power-mobile-records leaf-power-value-records">
        {rows.map(([fixed, flexible]) => (
          <li key={fixed}>
            <dl>
              <div><dt>Điều giữ vững</dt><dd>{fixed}</dd></div>
              <div><dt>Điều có thể thay đổi</dt><dd>{flexible}</dd></div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface PowerFlowStep {
  label: string;
  detail?: string;
  tone?: "neutral" | "safe" | "risk" | "decision";
}

function PowerFlowDiagram({
  caption,
  steps,
}: {
  caption: string;
  steps: readonly PowerFlowStep[];
  layout?: "row" | "stack" | "wrap";
}) {
  return (
    <figure className="leaf-plain-visual">
      <figcaption>{caption}</figcaption>
      <ol className="leaf-editorial-sequence">
        {steps.map((step, index) => (
          <li key={`${step.label}-${index}`}>
            <span aria-hidden>{index + 1}</span>
            <span><strong>{step.label}</strong>{step.detail ? <> — {step.detail}</> : null}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function PowerForkDiagram({
  caption,
  steps,
  positive,
  negative,
}: {
  caption: string;
  steps: readonly PowerFlowStep[];
  positive: string;
  negative: string;
}) {
  return (
    <figure className="leaf-plain-visual">
      <figcaption>{caption}</figcaption>
      <ol className="leaf-editorial-sequence">
        {steps.map((step, index) => (
          <li key={`${step.label}-${index}`}>
            <span aria-hidden>{index + 1}</span>
            <span><strong>{step.label}</strong>{step.detail ? <> — {step.detail}</> : null}</span>
          </li>
        ))}
      </ol>
      <dl className="leaf-editorial-compare">
        <div><dt>Có</dt><dd>{positive}</dd></div>
        <div><dt>Không</dt><dd>{negative}</dd></div>
      </dl>
    </figure>
  );
}

function PowerValueDependencyDiagram() {
  return (
    <figure className="leaf-plain-visual">
      <figcaption>Giá trị hay sự phụ thuộc?</figcaption>
      <p className="leaf-plain-question">Mình đang được cần đến vì điều gì?</p>
      <dl className="leaf-editorial-compare">
        <div><dt>Năng lực và giá trị tạo ra</dt><dd>Ảnh hưởng bền vững</dd></div>
        <div><dt>Thông tin bị giữ lại</dt><dd>Mắc kẹt và mất niềm tin</dd></div>
      </dl>
    </figure>
  );
}

function PowerCautionSpectrumDiagram() {
  return (
    <PowerFlowDiagram
      caption="Từ thận trọng đến thao túng"
      steps={[
        { label: "Giữ khoảng nghĩ", detail: "Thận trọng", tone: "safe" },
        { label: "Nói rõ thời điểm phản hồi", detail: "Minh bạch", tone: "safe" },
        { label: "Giữ thông tin quan trọng", detail: "Cần cảnh giác", tone: "decision" },
        { label: "Ép quyết định trong mù mờ", detail: "Thao túng", tone: "risk" },
      ]}
    />
  );
}

function PowerPositionMindmap() {
  const questions = [
    ["Quyết định", "Ai chốt quyết định?"],
    ["Dữ liệu", "Ai giữ dữ liệu?"],
    ["Hậu quả", "Ai chịu hậu quả?"],
    ["Tiếng nói", "Ai chưa được lên tiếng?"],
  ] as const;

  return (
    <figure className="leaf-plain-visual">
      <figcaption>Bốn câu hỏi trước khi chọn vị trí</figcaption>
      <ol className="leaf-editorial-sequence">
        {questions.map(([label, question], index) => (
          <li key={label}><span aria-hidden>{index + 1}</span><span><strong>{label}:</strong> {question}</span></li>
        ))}
      </ol>
    </figure>
  );
}

function PowerPlanStopDiagram() {
  return (
    <PowerForkDiagram
      caption="Dòng chảy của một kế hoạch có điểm dừng"
      steps={[
        { label: "Giả định" },
        { label: "Thử nhỏ" },
        { label: "Tín hiệu thật" },
        { label: "Tiếp tục?", tone: "decision" },
      ]}
      positive="Mở rộng có giới hạn"
      negative="Dừng và giữ bài học"
    />
  );
}

function PowerDecisionConsoleDiagram() {
  return (
    <PowerFlowDiagram
      caption="Bảng điều khiển 60 giây"
      layout="stack"
      steps={[
        { label: "Một quyết định đang chờ" },
        { label: "Ai thiết kế các lựa chọn?" },
        { label: "Mình đang bị kéo bởi khát vọng nào?" },
        { label: "Nhu cầu ẩn của các bên là gì?" },
        { label: "Ranh giới nào cần giữ?" },
        { label: "Đúng thời điểm chưa?" },
        { label: "Điều gì cần buông để bước tiếp?", tone: "decision" },
      ]}
    />
  );
}

function PowerSixImagesDiagram() {
  return (
    <PowerFlowDiagram
      caption="Dải hình ảnh của sáu nước cờ"
      layout="wrap"
      steps={[
        { label: "Sân khấu", detail: "Làm điều thật được thấy" },
        { label: "Chiếc áo", detail: "Thích nghi mà không hòa tan" },
        { label: "Mặt nước", detail: "Giữ bình tĩnh" },
        { label: "Món quà", detail: "Nhìn cái giá ẩn" },
        { label: "Cái bóng", detail: "Tạo dấu ấn riêng" },
        { label: "Nút thắt", detail: "Sửa nguồn gây rối" },
      ]}
    />
  );
}

function PowerChangeFlowDiagram() {
  return (
    <PowerFlowDiagram
      caption="Một nhịp thay đổi để người khác theo kịp"
      layout="wrap"
      steps={[
        { label: "Giải thích vì sao" },
        { label: "Thử nhỏ" },
        { label: "Nghe phản hồi" },
        { label: "Điều chỉnh" },
        { label: "Mở rộng", tone: "safe" },
      ]}
    />
  );
}

function PowerVictoryStopDiagram() {
  return (
    <PowerForkDiagram
      caption="Biết dừng sau chiến thắng"
      steps={[
        { label: "Bắt đầu" },
        { label: "Tiến bộ" },
        { label: "Đạt mục tiêu" },
        { label: "Biết dừng?", tone: "decision" },
      ]}
      positive="Giữ thành quả"
      negative="Vượt ngưỡng rồi trả giá"
    />
  );
}

function PowerCoreFlexMindmap() {
  return (
    <figure className="leaf-plain-visual">
      <figcaption>Cốt lõi và phương pháp linh hoạt</figcaption>
      <dl className="leaf-editorial-compare">
        <div><dt>Điều không bán rẻ</dt><dd>Trung thực · Ranh giới · Trách nhiệm</dd></div>
        <div><dt>Phương pháp linh hoạt</dt><dd>Đổi công cụ · Đổi vai trò · Đổi thời điểm · Đổi cách nói</dd></div>
      </dl>
    </figure>
  );
}

const POWER_SCENES = {
  stage: { title: "Sân khấu", detail: "Bảng số liệu khô đặt cạnh núi chai nhựa cùng một giá trị dữ liệu" },
  coat: { title: "Chiếc áo", detail: "Hòa vào bối cảnh mà không hòa tan mình" },
  water: { title: "Mặt nước", detail: "Một cốc bị khuấy đục; một cốc được đặt yên để cặn lắng xuống" },
  gift: { title: "Món quà", detail: "Ba sợi dây phía dưới: Dữ liệu · Nghĩa vụ · Phụ thuộc" },
  shadow: { title: "Cái bóng", detail: "Bước ra khỏi người đi trước" },
  knot: { title: "Nút thắt", detail: "Sáu sợi dây mắc cùng một chỗ; lối gỡ là quy trình rõ ràng" },
} as const;

function PowerSceneIllustration({ scene }: { scene: PowerSceneId }) {
  const { title, detail } = POWER_SCENES[scene];
  return (
    <figure className="leaf-power-scene" data-scene={scene}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="leaf-power-scene-img"
        src={`/books/48-laws-of-power/illustrations/${scene}.webp`}
        alt=""
        width={768}
        height={512}
        draggable={false}
      />
      <figcaption className="leaf-power-scene-copy"><strong>{title}</strong><span>{detail}</span></figcaption>
    </figure>
  );
}

const THINKING_KNOWLEDGE_GAP_FIELDS = [
  {
    label: "Mình đã biết",
    value: "Thông tin đã kiểm tra",
    Icon: Check,
  },
  {
    label: "Mình chưa biết",
    value: "Dữ liệu còn thiếu",
    Icon: CircleHelp,
  },
  {
    label: "Điều gì có thể làm mình đổi ý?",
    value: "Bằng chứng đủ mạnh để thay đổi kết luận",
    Icon: SearchCheck,
  },
] as const;

function ThinkingKnowledgeGapsTable() {
  return (
    <div className="leaf-thinking-visual leaf-thinking-responsive-table leaf-thinking-gaps">
      <div className="leaf-thinking-desktop-table">
        <table>
          <caption className="sr-only">Ba ô trống cần điền trước khi kết luận</caption>
          <thead>
            <tr>
              {THINKING_KNOWLEDGE_GAP_FIELDS.map(({ label }) => (
                <th key={label} scope="col">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {THINKING_KNOWLEDGE_GAP_FIELDS.map(({ label, value }) => (
                <td key={label}>{value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <dl className="leaf-thinking-mobile-records">
        {THINKING_KNOWLEDGE_GAP_FIELDS.map(({ label, value, Icon }) => (
          <div key={label}>
            <dt><Icon size={14} aria-hidden />{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const THINKING_QUESTION_SUBSTITUTIONS = [
  ["Ứng viên có phù hợp với công việc không?", "Mình có thích cách họ nói chuyện không?"],
  ["Dự án có khả thi không?", "Bản trình bày có thuyết phục không?"],
  ["Khoản đầu tư này có rủi ro cao không?", "Mình có nhớ câu chuyện đáng sợ nào không?"],
  ["Người này có đáng tin không?", "Họ có giống hình mẫu người đáng tin trong đầu mình không?"],
] as const;

function itemsForPart<T>(items: readonly T[], partIndex: number, partCount: number): readonly T[] {
  const safeCount = Math.max(1, partCount);
  const start = Math.floor((items.length * partIndex) / safeCount);
  const end = Math.floor((items.length * (partIndex + 1)) / safeCount);
  return items.slice(start, end);
}

function ThinkingQuestionSubstitutionTable({
  partIndex = 0,
  partCount = 1,
}: {
  partIndex?: number;
  partCount?: number;
}) {
  const rows = itemsForPart(THINKING_QUESTION_SUBSTITUTIONS, partIndex, partCount);
  return (
    <div className="leaf-thinking-visual leaf-thinking-responsive-table leaf-thinking-substitution">
      {partCount > 1 ? (
        <p className="leaf-rich-part-label">Bảng câu hỏi · {partIndex + 1}/{partCount}</p>
      ) : null}
      <div className="leaf-thinking-desktop-table">
        <table>
          <caption className="sr-only">Câu hỏi thật sự và câu hỏi dễ bị thay thế</caption>
          <thead>
            <tr>
              <th scope="col">Câu hỏi thật sự</th>
              <th scope="col">Câu hỏi dễ bị thay thế</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([actual, substitute]) => (
              <tr key={actual}>
                <th scope="row">{actual}</th>
                <td>{substitute}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="leaf-thinking-mobile-records leaf-thinking-question-records">
        {rows.map(([actual, substitute]) => (
          <li key={actual}>
            <dl>
              <div>
                <dt>Câu hỏi thật sự</dt>
                <dd>{actual}</dd>
              </div>
              <div>
                <dt>Câu hỏi dễ bị thay thế</dt>
                <dd>{substitute}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

const THINKING_DECISION_MATRIX = {
  lowEasy: {
    consequence: "Hậu quả thấp",
    reversibility: "Dễ quay lại",
    strategy: "Quyết nhanh và học nhanh",
    example: "Chọn màu áo",
    Icon: Gauge,
    tone: "fast",
  },
  lowHard: {
    consequence: "Hậu quả thấp",
    reversibility: "Khó quay lại",
    strategy: "Kiểm tra ngắn trước khi chốt",
    example: "Mua thiết bị khó hoàn trả",
    Icon: SearchCheck,
    tone: "check",
  },
  highEasy: {
    consequence: "Hậu quả cao",
    reversibility: "Dễ quay lại",
    strategy: "Thử nhỏ và giới hạn rủi ro",
    example: "Thử chiến dịch nhỏ",
    Icon: FlaskConical,
    tone: "experiment",
  },
  highHard: {
    consequence: "Hậu quả cao",
    reversibility: "Khó quay lại",
    strategy: "Chậm lại và kiểm tra sâu",
    example: "Ký hợp đồng dài hạn",
    Icon: ShieldAlert,
    tone: "slow",
  },
} as const;

type ThinkingMatrixRecord = (typeof THINKING_DECISION_MATRIX)[keyof typeof THINKING_DECISION_MATRIX];

function ThinkingMatrixCell({ record }: { record: ThinkingMatrixRecord }) {
  const { Icon } = record;
  return (
    <div className="leaf-thinking-matrix-cell" data-tone={record.tone}>
      <Icon size={15} aria-hidden />
      <strong>{record.strategy}</strong>
      <span>{record.example}</span>
    </div>
  );
}

function ThinkingDecisionSpeedMatrix({
  partIndex = 0,
  partCount = 1,
}: {
  partIndex?: number;
  partCount?: number;
}) {
  const matrixRows = [
    {
      label: "Hậu quả cao",
      easy: THINKING_DECISION_MATRIX.highEasy,
      hard: THINKING_DECISION_MATRIX.highHard,
    },
    {
      label: "Hậu quả thấp",
      easy: THINKING_DECISION_MATRIX.lowEasy,
      hard: THINKING_DECISION_MATRIX.lowHard,
    },
  ] as const;
  const rows = itemsForPart(matrixRows, partIndex, partCount);
  const mobileRecords = rows.flatMap(({ easy, hard }) => [easy, hard]);

  return (
    <figure className="leaf-thinking-visual leaf-thinking-matrix">
      <figcaption>
        Tốc độ phù hợp cho từng quyết định
        {partCount > 1 ? ` · ${partIndex + 1}/${partCount}` : ""}
      </figcaption>
      <div className="leaf-thinking-matrix-desktop">
        <table>
          <caption className="sr-only">Ma trận tốc độ quyết định theo hậu quả và khả năng quay lại</caption>
          <thead>
            <tr>
              <th><span className="sr-only">Mức hậu quả</span></th>
              <th scope="col"><RotateCcw size={13} aria-hidden />Dễ quay lại</th>
              <th scope="col"><LockKeyhole size={13} aria-hidden />Khó quay lại</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, easy, hard }) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td><ThinkingMatrixCell record={easy} /></td>
                <td><ThinkingMatrixCell record={hard} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="leaf-thinking-matrix-mobile">
        {mobileRecords.map((record) => (
          <li key={`${record.consequence}-${record.reversibility}`}>
            <dl>
              <div><dt>Hậu quả</dt><dd>{record.consequence}</dd></div>
              <div><dt>Khả năng sửa lại</dt><dd>{record.reversibility}</dd></div>
            </dl>
            <ThinkingMatrixCell record={record} />
          </li>
        ))}
      </ul>
      {partIndex === partCount - 1 ? (
        <p className="leaf-thinking-matrix-note">
          Ma trận ở trang 13 giúp người đọc chọn tốc độ suy nghĩ dựa trên hai điều thực tế: hậu quả nếu sai và khả năng sửa lại quyết định.
        </p>
      ) : null}
    </figure>
  );
}

function dacIllustrationBlockWeight(block: DacIllustrationBlock): number {
  if (block.kind === "bullets") {
    return block.items.reduce((weight, item) => weight + item.length + 34, 0);
  }
  const rhythm = block.kind === "quote" ? 80 : block.kind === "takeaway" ? 64 : 42;
  return block.text.length + rhythm;
}

function splitDacIllustrationBlocks(
  illustration: DacIllustration,
  requestedParts: number
): DacIllustrationBlock[][] {
  const blocks = illustration.blocks.flatMap((block): DacIllustrationBlock[] => {
    if (block.kind !== "bullets" || block.items.length <= 2) return [block];
    const chunks: DacIllustrationBlock[] = [];
    for (let index = 0; index < block.items.length; index += 2) {
      chunks.push({ kind: "bullets", items: block.items.slice(index, index + 2) });
    }
    return chunks;
  });
  const partCount = Math.max(1, Math.min(requestedParts, blocks.length));
  const parts: DacIllustrationBlock[][] = [];
  let cursor = 0;

  for (let partIndex = 0; partIndex < partCount; partIndex += 1) {
    const partsRemaining = partCount - partIndex;
    const weightRemaining = blocks
      .slice(cursor)
      .reduce((weight, block) => weight + dacIllustrationBlockWeight(block), 0);
    const target = weightRemaining / partsRemaining;
    const part: DacIllustrationBlock[] = [];
    let weight = 0;

    while (cursor < blocks.length) {
      const blocksAfter = blocks.length - cursor - 1;
      const mustReserve = partsRemaining - 1;
      const next = blocks[cursor];
      if (part.length && weight >= target && blocksAfter >= mustReserve) break;
      part.push(next);
      weight += dacIllustrationBlockWeight(next);
      cursor += 1;
      if (blocks.length - cursor === mustReserve) break;
    }
    parts.push(part);
  }

  return parts;
}

function DacIllustrationBox({
  illustration,
  partIndex = 0,
  partCount = 1,
}: {
  illustration: DacIllustration;
  partIndex?: number;
  partCount?: number;
}) {
  const blocks = splitDacIllustrationBlocks(illustration, partCount)[partIndex] ?? [];
  return (
    <aside className="leaf-dac-example">
      <header className="leaf-dac-example-header">
        <span>
          Hộp minh họa{partCount > 1 ? ` · ${partIndex + 1}/${partCount}` : ""}
        </span>
        <h4>{illustration.title}</h4>
      </header>
      <div className="leaf-dac-example-body">
        {blocks.map((block, index) => {
          if (block.kind === "label") {
            return <h5 key={index}>{renderInline(block.text)}</h5>;
          }
          if (block.kind === "quote") {
            return (
              <blockquote key={index} className="leaf-dac-example-quote" data-tone={block.tone}>
                {renderInline(block.text)}
              </blockquote>
            );
          }
          if (block.kind === "bullets") {
            return (
              <ul key={index} className="leaf-dac-example-list">
                {block.items.map((item) => (
                  <li key={item}>
                    <span aria-hidden>•</span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          }
          if (block.kind === "takeaway") {
            return (
              <p key={index} className="leaf-dac-example-takeaway">
                {block.label ? <strong>{block.label}: </strong> : null}
                {renderInline(block.text)}
              </p>
            );
          }
          return <p key={index}>{renderInline(block.text)}</p>;
        })}
      </div>
    </aside>
  );
}

function KindConversationMindmap() {
  const branches = [
    {
      label: "Ý định",
      items: ["Muốn hiểu trước", "Không chỉ tìm cách thắng"],
    },
    {
      label: "Sự chú ý",
      items: ["Nghe hết câu", "Hỏi thêm một điều"],
    },
    {
      label: "Phẩm giá",
      items: ["Rõ việc", "Không gắn nhãn con người"],
    },
    {
      label: "Quyền lựa chọn",
      items: ["Được nói không", "Được giữ quan điểm khác"],
    },
  ] as const;

  return (
    <figure className="leaf-plain-visual">
      <figcaption>Bốn lăng kính của một cuộc trò chuyện tử tế</figcaption>
      <ol className="leaf-editorial-sequence">
        {branches.map(({ label, items }, index) => (
          <li key={label}>
            <span aria-hidden>{index + 1}</span>
            <span><strong>{label}:</strong> {items.join(" · ")}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function RecognitionFormula() {
  const steps = [
    "Điều mình quan sát",
    "Ảnh hưởng nó tạo ra",
    "Điều mình trân trọng",
  ] as const;

  return (
    <figure className="leaf-plain-visual">
      <figcaption>Công thức ghi nhận cụ thể</figcaption>
      <ol className="leaf-editorial-sequence">
        {steps.map((label, index) => (
          <li key={label}>
            <span aria-hidden>{index + 1}</span>
            <span>{label}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

const ETHICAL_PERSUASION_ROWS = [
  ["Nói rõ lợi ích và giới hạn", "Chỉ nói phần có lợi"],
  ["Cho người kia đủ thông tin", "Giấu thông tin có thể khiến họ từ chối"],
  ["Cho phép họ suy nghĩ", "Tạo áp lực phải trả lời ngay"],
  ["Chấp nhận câu trả lời “không”", "Dùng tội lỗi, sợ hãi hoặc quan hệ để ép"],
  ["Muốn hai bên cùng hiểu", "Chỉ quan tâm đến kết quả mình muốn"],
] as const;

function EthicalPersuasionTable({
  partIndex = 0,
  partCount = 1,
}: {
  partIndex?: number;
  partCount?: number;
}) {
  const rows = itemsForPart(ETHICAL_PERSUASION_ROWS, partIndex, partCount);
  return (
    <div className="leaf-dac-visual leaf-dac-responsive-table leaf-dac-persuasion">
      {partCount > 1 ? (
        <p className="leaf-rich-part-label">Thuyết phục và thao túng · {partIndex + 1}/{partCount}</p>
      ) : null}
      <div className="leaf-dac-desktop-table">
        <table>
          <caption className="sr-only">So sánh thuyết phục tử tế với thao túng</caption>
          <thead>
            <tr>
              <th scope="col">Thuyết phục tử tế</th>
              <th scope="col">Thao túng</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([kind, manipulation]) => (
              <tr key={kind}>
                <th scope="row">{kind}</th>
                <td>{manipulation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="leaf-dac-mobile-pairs">
        {rows.map(([kind, manipulation]) => (
          <li key={kind}>
            <div data-tone="kind">
              <strong>Thuyết phục tử tế</strong>
              <span>{kind}</span>
            </div>
            <div data-tone="risk">
              <strong>Thao túng</strong>
              <span>{manipulation}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const CONSENT_SIGNAL_ROWS = [
  {
    signal: "Xanh",
    tone: "green",
    Icon: Check,
    meaning: "Người kia hiểu và đồng ý rõ ràng",
    action: "Xác nhận bước tiếp theo",
  },
  {
    signal: "Vàng",
    tone: "yellow",
    Icon: Clock3,
    meaning: "Họ do dự, cần thêm thông tin hoặc thời gian",
    action: "Hỏi điều gì còn chưa rõ",
  },
  {
    signal: "Đỏ",
    tone: "red",
    Icon: OctagonX,
    meaning: "Họ im lặng vì sợ hãi, bị thúc ép hoặc không có quyền chọn",
    action: "Dừng lại và trả lại quyền quyết định",
  },
] as const;

function ConsentSignalBadge({
  signal,
  tone,
  Icon,
}: (typeof CONSENT_SIGNAL_ROWS)[number]) {
  return (
    <span className="leaf-dac-signal-badge" data-signal={tone}>
      <Icon size={13} aria-hidden />
      <span>{signal}</span>
    </span>
  );
}

function ConsentTrafficLightTable() {
  return (
    <div className="leaf-dac-visual leaf-dac-responsive-table leaf-dac-consent">
      <div className="leaf-dac-desktop-table">
        <table>
          <caption className="sr-only">Đèn tín hiệu của sự đồng thuận</caption>
          <thead>
            <tr>
              <th scope="col">Tín hiệu</th>
              <th scope="col">Điều có thể đang xảy ra</th>
              <th scope="col">Mình nên làm gì?</th>
            </tr>
          </thead>
          <tbody>
            {CONSENT_SIGNAL_ROWS.map((row) => (
              <tr key={row.signal}>
                <th scope="row"><ConsentSignalBadge {...row} /></th>
                <td>{row.meaning}</td>
                <td>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="leaf-dac-consent-cards">
        {CONSENT_SIGNAL_ROWS.map((row) => (
          <li key={row.signal}>
            <ConsentSignalBadge {...row} />
            <dl>
              <div>
                <dt>Điều có thể đang xảy ra</dt>
                <dd>{row.meaning}</dd>
              </div>
              <div>
                <dt>Mình nên làm gì?</dt>
                <dd>{row.action}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SEVEN_DAY_CARE_ROWS = [
  ["1", "Nghe một người nói trong hai phút mà không ngắt lời"],
  ["2", "Gọi đúng tên và hỏi lại nếu chưa chắc cách phát âm"],
  ["3", "Ghi nhận một đóng góp bằng lời khen cụ thể"],
  ["4", "Thừa nhận một sai sót mà không thêm lời biện minh"],
  ["5", "Hỏi một câu thay vì đưa mệnh lệnh"],
  ["6", "Đưa ra một lời đề nghị có đủ thông tin và quyền từ chối"],
  ["7", "Hỏi thêm một câu về điều người kia thật sự quan tâm"],
] as const;

function SevenDayCareTable({
  partIndex = 0,
  partCount = 1,
}: {
  partIndex?: number;
  partCount?: number;
}) {
  const rows = itemsForPart(SEVEN_DAY_CARE_ROWS, partIndex, partCount);
  return (
    <div className="leaf-dac-visual leaf-dac-challenge">
      {partCount > 1 ? (
        <p className="leaf-rich-part-label">Thử thách quan tâm · {partIndex + 1}/{partCount}</p>
      ) : null}
      <table>
        <caption className="sr-only">Thử thách thực hành sự quan tâm trong bảy ngày</caption>
        <thead>
          <tr>
            <th scope="col">Ngày</th>
            <th scope="col">Thực hành</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([day, practice]) => (
            <tr key={day}>
              <th scope="row"><span className="leaf-dac-day-badge">{day}</span></th>
              <td>{practice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IdentityChangeDiagram() {
  const steps = [
    ["Bản sắc", "Mình muốn trở thành ai?"],
    ["Quy trình", "Mình sẽ làm gì mỗi ngày?"],
    ["Kết quả", "Mình sẽ đạt được điều gì?"],
  ] as const;
  return (
    <figure className="leaf-plain-visual">
      <figcaption>Thay đổi từ trong ra ngoài</figcaption>
      <ol className="leaf-editorial-sequence">
        {steps.map(([label, detail], index) => (
          <li key={label}><span aria-hidden>{index + 1}</span><span><strong>{label}:</strong> {detail}</span></li>
        ))}
      </ol>
      <p className="leaf-plain-note">Kết quả tạo thêm bằng chứng và củng cố niềm tin.</p>
    </figure>
  );
}

function HabitLoopDiagram() {
  const steps = [
    ["Tín hiệu", "Điện thoại sáng màn hình"],
    ["Mong muốn", "Muốn biết có gì mới"],
    ["Hành động", "Cầm điện thoại và mở thông báo"],
    ["Phần thưởng", "Sự tò mò được giải tỏa"],
  ] as const;
  return (
    <figure className="leaf-plain-visual">
      <figcaption>Vòng lặp của một thói quen</figcaption>
      <ol className="leaf-editorial-sequence">
        {steps.map(([label, detail], index) => (
          <li key={label}><span aria-hidden>{index + 1}</span><span><strong>{label}:</strong> {detail}</span></li>
        ))}
      </ol>
      <p className="leaf-plain-note">Não ghi nhớ phần thưởng và muốn lặp lại.</p>
    </figure>
  );
}

const FOUR_LAWS_PRACTICE = [
  {
    label: "Dễ thấy",
    detail: "Đặt giày cạnh cửa trước giờ đi bộ.",
    tone: "cue",
    Icon: Eye,
  },
  {
    label: "Hấp dẫn",
    detail: "Chỉ nghe chương trình yêu thích khi đang đi.",
    tone: "desire",
    Icon: Zap,
  },
  {
    label: "Dễ làm",
    detail: "Bắt đầu bằng một vòng năm phút.",
    tone: "action",
    Icon: Gauge,
  },
  {
    label: "Dễ chịu",
    detail: "Đánh dấu ngay khi hoàn thành.",
    tone: "reward",
    Icon: Check,
  },
] as const;

function FourLawsPracticeBoard() {
  return (
    <figure className="leaf-habit-laws" aria-label="Bốn đòn bẩy cho một buổi đi bộ">
      <figcaption>Bốn đòn bẩy · một buổi đi bộ</figcaption>
      <ol>
        {FOUR_LAWS_PRACTICE.map(({ label, detail, tone, Icon }, index) => (
          <li key={label} data-tone={tone}>
            <span className="leaf-habit-law-index" aria-hidden>{String(index + 1).padStart(2, "0")}</span>
            <Icon size={16} aria-hidden />
            <span><strong>{label}</strong><small>{detail}</small></span>
          </li>
        ))}
      </ol>
      <p>Với thói quen muốn giảm, hãy đảo bốn hướng và làm hệ quả hiện ra sớm hơn.</p>
    </figure>
  );
}

const SEVEN_DAY_READING_ROWS = [
  ["Ngày 1", "✓ Đọc hai trang", "Bắt đầu dễ hơn mình nghĩ"],
  ["Ngày 2", "✓ Đọc bốn trang", "Đọc tiếp vì câu chuyện đang hay"],
  ["Ngày 3", "• Đọc một trang", "Về nhà muộn nhưng vẫn mở sách"],
  ["Ngày 4", "— Bỏ lỡ", "Để quên sách trong túi"],
  ["Ngày 5", "✓ Đọc hai trang", "Đặt sách lên gối từ buổi sáng"],
  ["Ngày 6", "✓ Đọc năm trang", "Để điện thoại ngoài phòng"],
  ["Ngày 7", "✓ Đọc hai trang", "Việc bắt đầu đã tự nhiên hơn"],
] as const;

function SevenDayReadingTable({
  partIndex = 0,
  partCount = 1,
}: {
  partIndex?: number;
  partCount?: number;
}) {
  const rows = itemsForPart(SEVEN_DAY_READING_ROWS, partIndex, partCount);
  return (
    <div className="leaf-week-table-wrap">
      {partCount > 1 ? (
        <p className="leaf-rich-part-label">Nhật ký bảy ngày · {partIndex + 1}/{partCount}</p>
      ) : null}
      <table className="leaf-week-table">
        <caption className="sr-only">Kết quả thử nghiệm thói quen đọc sách trong bảy ngày</caption>
        <thead>
          <tr>
            <th scope="col">Ngày</th>
            <th scope="col">Kết quả</th>
            <th scope="col">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([day, result, note]) => (
            <tr key={day} className={day === "Ngày 4" ? "is-missed" : undefined}>
              <th scope="row">{day}</th>
              <td>{result}</td>
              <td>{note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReviewLoopDiagram() {
  const steps = [
    ["Làm", "Thực hiện hành động nhỏ"],
    ["Đánh dấu", "Ghi lại trong vài giây"],
    ["Nhìn lại", "Điều gì giúp hoặc cản mình?"],
    ["Điều chỉnh", "Thay đổi một chi tiết"],
  ] as const;
  return (
    <figure className="leaf-plain-visual">
      <figcaption>Chu trình điều chỉnh thói quen</figcaption>
      <ol className="leaf-editorial-sequence">
        {steps.map(([label, detail], index) => (
          <li key={label}><span aria-hidden>{index + 1}</span><span><strong>{label}:</strong> {detail}</span></li>
        ))}
      </ol>
      <p className="leaf-plain-note">Lặp lại sau mỗi điều chỉnh.</p>
    </figure>
  );
}

function SilentProgressDiagram() {
  const stages = [
    ["HÀNH ĐỘNG NHỎ", "Chưa thấy khác biệt"],
    ["TÍCH LŨY ÂM THẦM", "Bắt đầu dễ hơn"],
    ["CHẠM NGƯỠNG", "Hệ thống dần ổn định"],
    ["KẾT QUẢ HIỆN RA", "Tiến bộ trở nên dễ thấy"],
  ] as const;

  return (
    <figure className="leaf-plain-visual">
      <figcaption>Tiến bộ âm thầm</figcaption>
      <ol className="leaf-editorial-sequence">
        {stages.map(([label, detail], index) => (
          <li key={label}><span aria-hidden>{index + 1}</span><span><strong>{label}:</strong> {detail}</span></li>
        ))}
      </ol>
    </figure>
  );
}

const PREPARATION_ACTION_ROWS = [
  ["Tìm phương pháp học tốt nhất", "Làm bài tập đầu tiên"],
  ["Mua giày chạy mới", "Mang giày và bước ra ngoài"],
  ["Tạo bảng kế hoạch đẹp", "Làm việc tập trung mười phút"],
  ["Xem video hướng dẫn viết", "Viết một đoạn chưa hoàn hảo"],
  ["Chọn ứng dụng quản lý tiền", "Ghi lại khoản chi đầu tiên"],
] as const;

function PreparationActionTable() {
  return (
    <div className="leaf-compare-table-wrap">
      <table className="leaf-compare-table">
        <caption className="sr-only">So sánh việc chuẩn bị với hành động thật</caption>
        <thead>
          <tr>
            <th scope="col">Chuẩn bị</th>
            <th scope="col">Hành động thật</th>
          </tr>
        </thead>
        <tbody>
          {PREPARATION_ACTION_ROWS.map(([preparation, action]) => (
            <tr key={preparation}>
              <th scope="row">{preparation}</th>
              <td>{action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EnergyLevelsDiagram() {
  return (
    <figure className="leaf-plain-visual">
      <figcaption>Hôm nay mình có bao nhiêu năng lượng?</figcaption>
      <dl className="leaf-editorial-notes">
        <div><dt>Nhiều</dt><dd>Làm phiên bản đầy đủ</dd></div>
        <div><dt>Vừa phải</dt><dd>Làm phiên bản nhỏ</dd></div>
        <div><dt>Quá tải</dt><dd>Giữ nhịp tối thiểu, nghỉ hoặc xin hỗ trợ</dd></div>
      </dl>
    </figure>
  );
}

function renderRichBlockPart(richBlock: NonNullable<BookPage["richBlock"]>): ReactNode {
  const { marker, partIndex, partCount } = richBlock;
  const illustrationId = parseDacIllustrationMarker(marker);
  if (illustrationId) {
    return (
      <DacIllustrationBox
        illustration={DAC_ILLUSTRATIONS[illustrationId]}
        partIndex={partIndex}
        partCount={partCount}
      />
    );
  }
  if (marker === "[[ethical-persuasion-table]]") {
    return <EthicalPersuasionTable partIndex={partIndex} partCount={partCount} />;
  }
  if (marker === "[[seven-day-reading-table]]") {
    return <SevenDayReadingTable partIndex={partIndex} partCount={partCount} />;
  }
  if (marker === "[[thinking-question-substitution-table]]") {
    return <ThinkingQuestionSubstitutionTable partIndex={partIndex} partCount={partCount} />;
  }
  if (marker === "[[thinking-film-album-comparison]]") {
    return <ThinkingFilmAlbumComparison />;
  }
  if (marker === "[[thinking-decision-speed-matrix]]") {
    return <ThinkingDecisionSpeedMatrix partIndex={partIndex} partCount={partCount} />;
  }
  if (marker === "[[seven-day-care-table]]") {
    return <SevenDayCareTable partIndex={partIndex} partCount={partCount} />;
  }
  if (marker === "[[silence-help-table]]") {
    return <SilenceHelpTable partIndex={partIndex} partCount={partCount} />;
  }
  if (marker === "[[power-values-flex-table]]") {
    return <PowerValuesFlexTable partIndex={partIndex} partCount={partCount} />;
  }
  if (marker === "[[energy-levels-diagram]]") return <EnergyLevelsDiagram />;
  return renderPara(marker, 0);
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
  const visualParas = page.visualSourceParagraphs ?? paras;
  if (page.richBlock) {
    const leadParas = paras.filter((paragraph) => paragraph !== page.richBlock?.marker);
    return (
      <>
        {page.authoredSection ? (
          <ThinkingAuthoredSectionLabel
            section={page.authoredSection}
            continuation={page.continuation}
          />
        ) : null}
        {page.heading ? (
          <h3 className={`leaf-heading${page.continuation ? " is-continuation" : ""}`}>
            {page.heading}
          </h3>
        ) : null}
        <div className="leaf-body leaf-rich-block-page">
          {leadParas.length ? renderParagraphSequence(leadParas) : null}
          {renderRichBlockPart(page.richBlock)}
        </div>
        <span className="leaf-folio">{folio}</span>
      </>
    );
  }

  if (page.theme === "breathing-house" && page.design) {
    return (
      <>
        <BreathingHousePage
          design={page.design}
          heading={page.heading ?? ""}
          paragraphs={visualParas}
          visualOnly={page.visualOnly}
          renderInline={renderInline}
        />
        <span className="leaf-folio">{folio}</span>
      </>
    );
  }

  if (page.theme === "layered-time-map" && page.timeMapDesign) {
    return (
      <>
        <LayeredTimeMapPage
          design={page.timeMapDesign}
          heading={page.heading ?? ""}
          paragraphs={visualParas}
          visualOnly={page.visualOnly}
          renderInline={renderInline}
        />
        <span className="leaf-folio">{folio}</span>
      </>
    );
  }

  if (page.theme === "loop-restoration-workshop" && page.loopDesign) {
    return (
      <>
        <LoopRestorationPage
          design={page.loopDesign}
          heading={page.heading ?? ""}
          paragraphs={paras}
          continuation={page.continuation}
          figureAfter={page.loopFigureAfter}
          showNotes={page.loopShowNotes}
          renderInline={renderInline}
        />
        <span className="leaf-folio">{folio}</span>
      </>
    );
  }

  if (page.theme === "future-ethics-lab" && page.futureLabDesign) {
    return (
      <>
        <FutureLabPage
          design={page.futureLabDesign}
          heading={page.heading ?? ""}
          paragraphs={visualParas}
          visualOnly={page.visualOnly}
          renderInline={renderInline}
        />
        <span className="leaf-folio">{folio}</span>
      </>
    );
  }

  const hasLeadingPowerBanner = !page.continuation && (
    paras[0] === "[[power-board-series]]"
    || paras[0] === "[[power-card-series]]"
    || paras[0] === "[[power-practice-series]]"
    || paras[0]?.startsWith("[[power-round:")
  );
  const hasLeadingPowerMove = page.theme === "power-board"
    && page.continuation
    && /^###\s+(?:Thẻ|Nước cờ)\s+\d+\s+—\s+/.test(paras[0] ?? "");
  return (
    <>
      {page.authoredSection ? (
        <ThinkingAuthoredSectionLabel
          section={page.authoredSection}
          continuation={page.continuation}
        />
      ) : null}
      {page.heading && !hasLeadingPowerBanner && !hasLeadingPowerMove ? (
        <h3 className={`leaf-heading${page.continuation ? " is-continuation" : ""}`}>
          {page.heading}
        </h3>
      ) : null}
      <div className={`leaf-body${page.opening ? " is-opening" : ""}`}>
        {renderContentParagraphs(paras, page.sectionBreaks)}
      </div>
      <span className="leaf-folio">{folio}</span>
    </>
  );
}
