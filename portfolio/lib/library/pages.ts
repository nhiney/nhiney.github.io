// Builds the flipbook "deck" for a book: a fixed number of leaves the
// FlipBookReader turns through, Apple-Books style. Each book is normalised to
// PAGES_PER_BOOK leaves so the spread cadence is identical across the shelf —
// bump this constant later to give richer books more room (see the note in the
// detail overlay). The interior leaves are SEEDED from the book's written
// review when it has one, otherwise from its key points.

import type { BookPage } from "./types";
import type { BookReadingPage } from "@/data/books";

/** How many leaves every book's flipbook has, for now. Title + interior + end. */
export const PAGES_PER_BOOK = 5;

/** Roughly how many characters comfortably fill one portrait reading leaf.
 * Kept conservative so prose doesn't overflow the fixed-height page; the rest
 * of a long review stays on the blog (the end leaf links to it). */
const PAGE_CHAR_BUDGET = 620;

/** Curated pages are shown in full, including on narrow portrait leaves. Keep
 * them shorter than generated excerpts because they retain headings and do not
 * have a blog fallback for omitted text. */
const CURATED_PAGE_CHAR_BUDGET = 430;

/** Turn a raw MDX/markdown review body into clean plain-text paragraphs. */
export function stripMarkdownToParagraphs(md: string): string[] {
  if (!md) return [];
  let text = md;

  // Drop fenced code blocks and any leftover frontmatter fence.
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/^---[\s\S]*?---/, "");

  const blocks: string[] = [];
  for (const rawBlock of text.split(/\n{2,}/)) {
    const lines = rawBlock
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      // Drop import/export and standalone JSX/MDX component lines.
      .filter((l) => !/^(import|export)\s/.test(l))
      .filter((l) => !/^<\/?[A-Za-z][^>]*>?$/.test(l));
    if (!lines.length) continue;

    let block = lines.join(" ");

    // Markdown → text: headings, list/quote markers, emphasis, links, images.
    block = block
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links → text
      .replace(/^#{1,6}\s+/g, "") // heading hashes
      .replace(/^>\s?/g, "") // blockquote
      .replace(/^[-*+]\s+/g, "") // bullet markers
      .replace(/^\d+\.\s+/g, "") // ordered markers
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/(^|[\s(])\*([^*]+)\*/g, "$1$2")
      .replace(/(^|[\s(])_([^_]+)_/g, "$1$2")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (block) blocks.push(block);
  }
  return blocks;
}

/** Distribute paragraphs across up to `maxPages` leaves, each held to roughly
 * PAGE_CHAR_BUDGET so no leaf overflows. Paragraphs are never split mid-way;
 * once the budget runs out the remaining text is dropped (it lives on the blog). */
function paginate(paragraphs: string[], maxPages: number): string[][] {
  const pages: string[][] = [];
  let current: string[] = [];
  let count = 0;

  for (const p of paragraphs) {
    const wouldOverflow = count > 0 && count + p.length > PAGE_CHAR_BUDGET;
    if (wouldOverflow) {
      pages.push(current);
      if (pages.length >= maxPages) return pages;
      current = [];
      count = 0;
    }
    current.push(p);
    count += p.length;
  }
  if (current.length && pages.length < maxPages) pages.push(current);
  return pages;
}

/** Split curated pages into as many leaves as they need. Paragraphs stay intact
 * and the source heading is shown on the first leaf, then repeated with a
 * continuation marker on following leaves so mobile readers never lose context. */
function paginateCuratedPages(readingPages: BookReadingPage[]): BookPage[] {
  const leaves: BookPage[] = [];

  for (const page of readingPages) {
    let current: string[] = [];
    let count = 0;
    let leafInSection = 0;

    const pushCurrent = () => {
      if (!current.length) return;
      leaves.push({
        kind: "content",
        heading: leafInSection === 0 ? page.heading : `${page.heading} (${leafInSection + 1})`,
        paragraphs: current,
        opening: leaves.length === 0,
      });
      current = [];
      count = 0;
      leafInSection += 1;
    };

    for (const paragraph of page.paragraphs) {
      const wouldOverflow = count > 0 && count + paragraph.length > CURATED_PAGE_CHAR_BUDGET;
      if (wouldOverflow) pushCurrent();
      current.push(paragraph);
      count += paragraph.length;
    }

    pushCurrent();
  }

  return leaves;
}

/** Split items into `n` contiguous, front-loaded groups, preserving order.
 * e.g. spread([0,1,2,3,4], 3) → [[0,1],[2,3],[4]]. */
function spread<T>(items: T[], n: number): T[][] {
  const groups: T[][] = [];
  const base = Math.floor(items.length / n);
  let rem = items.length % n;
  let idx = 0;
  for (let g = 0; g < n; g++) {
    const size = base + (rem > 0 ? 1 : 0);
    if (rem > 0) rem--;
    groups.push(items.slice(idx, idx + size));
    idx += size;
  }
  return groups;
}

/** Build a deck of exactly PAGES_PER_BOOK leaves: title · interior · end. The
 * deck holds only content (paragraphs / key-point items); the reader supplies
 * all localized chrome (title-leaf masthead, "Key ideas" label, end-leaf CTA),
 * so a deck built at build time stays correct under any UI language. */
export function buildDeck(
  reviewBody: string | undefined,
  keyPoints: string[],
  readingPages?: BookReadingPage[]
): BookPage[] {
  // Curated reading pages drive the WHOLE deck (title · pages · end), so each
  // book can run as long or short as its content needs — bump or trim the
  // `readingPages` array per book to add/remove leaves.
  if (readingPages?.length) {
    const leaves = paginateCuratedPages(readingPages);
    return [{ kind: "title" }, ...leaves, { kind: "end" }];
  }

  // Otherwise normalise to a fixed PAGES_PER_BOOK so books without curated pages
  // keep an identical spread cadence across the shelf.
  const interiorCount = Math.max(1, PAGES_PER_BOOK - 2);
  const interior: BookPage[] = [];

  const paragraphs = reviewBody ? stripMarkdownToParagraphs(reviewBody) : [];

  if (paragraphs.length) {
    const pages = paginate(paragraphs, interiorCount);
    pages.forEach((paras, i) =>
      interior.push({ kind: "content", paragraphs: paras, opening: i === 0 })
    );
  } else if (keyPoints.length) {
    // No written review yet — spread the key ideas across the interior leaves so
    // every page carries something (a few ideas per page), rather than one dense
    // list followed by blanks.
    const groups = spread(keyPoints, interiorCount);
    let offset = 0;
    groups.forEach((items, i) => {
      if (items.length) interior.push({ kind: "list", items, start: offset, opening: i === 0 });
      offset += items.length;
    });
  }

  // Pad to exactly interiorCount with blank leaves so the spread cadence holds.
  while (interior.length < interiorCount) interior.push({ kind: "content", paragraphs: [] });
  interior.length = interiorCount;

  return [{ kind: "title" }, ...interior, { kind: "end" }];
}
