// Book slugs that have a scrapbook "paper" photo, served from
// /public/textures/papers/<book-slug>.jpg and shown — exactly as the original
// image — as the reading page for that book in the library overlay. Each paper
// is picked to suit the book's cover. Keyed by LIBRARY_BOOKS slug (data/books.ts).
const BOOK_PAPERS = new Set<string>([
  "dac-nhan-tam",
  "atomic-habits",
  "silence-of-the-lambs",
  "48-laws-of-power",
  "thinking-fast-and-slow",
  "goodbye-things",
  "muon-kiep-nhan-sinh-1",
  "muon-kiep-nhan-sinh-2",
  "muon-kiep-nhan-sinh-3",
]);

/** Public path to a book's scrapbook paper photo, or null if it has none. */
export function bookPaperSrc(slug: string): string | null {
  return BOOK_PAPERS.has(slug) ? `/textures/papers/${slug}.jpg` : null;
}

// Decorative paper used as the INTERIOR flipbook leaf background (distinct from
// the outside note sheet above). Books listed here override the default
// printed-leaf palette. Empty for now — the pink floral paper was dropped
// because it sat over the prose; 48 Laws uses the plain vintage leaf + stickers.
const BOOK_LEAF_PAPERS: Record<string, string> = {};

/** Public path to a book's interior leaf paper, or null to use the default leaf. */
export function bookLeafPaperSrc(slug: string): string | null {
  return BOOK_LEAF_PAPERS[slug] ?? null;
}
