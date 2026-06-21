// The curated shelf — the books the user has actually read. This is the single
// source of truth for the /library galaxy (NOT the blog). Each book shows a real
// cover photo from /public/books; books without a photo fall back to a clean
// designed cover painted from the palette. A book may link to a blog review via
// `blogSlug` (then reading mode shows the full write-up); books without one show
// just the cover + author.
//
// To add a book: drop a cover at /public/books/<slug>.jpg and add an entry here.
// To swap a cover: replace that file (same path).

export interface BookMeta {
  /** Author printed on the cover / shown in captions. */
  author: string;
  /** Palette for the designed fallback cover + the 3D spine & back. */
  hue: number;
  saturation: number;
  lightness: number;
  /** Foil colour for stamped title/rules on the designed cover & spine. */
  foil: string;
  /** Relative size multiplier (~0.9–1.15). */
  scale?: number;
  /** Real cover image served from /public (overrides the designed front cover). */
  cover?: string;
  /** Optional real back-cover image (maps onto the book's back face). */
  coverBack?: string;
  /** Optional real spine image (maps onto the book's spine face). */
  coverSpine?: string;
}

export interface LibraryBook extends BookMeta {
  /** Unique id (also the cover filename). */
  slug: string;
  /** Display title (Vietnamese). */
  title: string;
  /** English title (shown when the site language is English). */
  titleEn?: string;
  /** Blog post slug carrying the full review, if one exists. */
  blogSlug?: string;
}

export const LIBRARY_BOOKS: LibraryBook[] = [
  {
    slug: "dac-nhan-tam",
    title: "Đắc Nhân Tâm",
    titleEn: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    cover: "/books/dac-nhan-tam.webp",
    coverBack: "/books/dac-nhan-tam-back.webp",
    blogSlug: "dac-nhan-tam-review",
    hue: 222, // navy spine to match the VN First News cover
    saturation: 40,
    lightness: 20,
    foil: "#C9A24B",
    scale: 1.06,
  },
  {
    slug: "atomic-habits",
    title: "Atomic Habits",
    titleEn: "Atomic Habits",
    author: "James Clear",
    cover: "/books/atomic-habits.webp",
    hue: 36,
    saturation: 28,
    lightness: 60,
    foil: "#6B4E2E",
    scale: 1.04,
  },
  {
    slug: "silence-of-the-lambs",
    title: "Sự Im Lặng Của Bầy Cừu",
    titleEn: "The Silence of the Lambs",
    author: "Thomas Harris",
    cover: "/books/silence-of-the-lambs.jpg",
    hue: 210, // pale/white spine to match the VN cover
    saturation: 8,
    lightness: 86,
    foil: "#3A3A3A",
    scale: 1.0,
  },
  {
    slug: "48-laws-of-power",
    title: "48 Nguyên Tắc Chủ Chốt Của Quyền Lực",
    titleEn: "The 48 Laws of Power",
    author: "Robert Greene",
    cover: "/books/48-laws-of-power.jpg",
    coverBack: "/books/48-laws-of-power-back.jpg",
    hue: 0, // near-black spine to match the VN cover
    saturation: 30,
    lightness: 12,
    foil: "#CFCFCF",
    scale: 1.12,
  },
  {
    slug: "thinking-fast-and-slow",
    title: "Tư Duy Nhanh Và Chậm",
    titleEn: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    cover: "/books/thinking-fast-and-slow.webp",
    hue: 40,
    saturation: 12,
    lightness: 66,
    foil: "#4A463E",
    scale: 1.08,
  },
  {
    slug: "goodbye-things",
    title: "Lối Sống Tối Giản Của Người Nhật",
    titleEn: "Goodbye, Things",
    author: "Fumio Sasaki",
    cover: "/books/goodbye-things.webp",
    coverBack: "/books/goodbye-things-back.webp",
    hue: 150,
    saturation: 10,
    lightness: 80,
    foil: "#6A8A82",
    scale: 0.96,
  },
  {
    slug: "muon-kiep-nhan-sinh-1",
    title: "Muôn Kiếp Nhân Sinh - Tập 1",
    titleEn: "Many Lives, Many Times - Vol. 1",
    author: "Nguyên Phong",
    cover: "/books/muon-kiep-nhan-sinh-1.webp",
    coverBack: "/books/muon-kiep-nhan-sinh-1-back.jpg",
    hue: 220, // dark navy (broken-watch cover)
    saturation: 30,
    lightness: 12,
    foil: "#D8DCE4",
    scale: 1.0,
  },
  {
    slug: "muon-kiep-nhan-sinh-2",
    title: "Muôn Kiếp Nhân Sinh - Tập 2",
    titleEn: "Many Lives, Many Times - Vol. 2",
    author: "Nguyên Phong",
    cover: "/books/muon-kiep-nhan-sinh-2.jpg",
    coverBack: "/books/muon-kiep-nhan-sinh-2-back.jpg",
    hue: 210, // ocean blue
    saturation: 42,
    lightness: 30,
    foil: "#EAF1FB",
    scale: 1.0,
  },
  {
    slug: "muon-kiep-nhan-sinh-3",
    title: "Muôn Kiếp Nhân Sinh - Tập 3",
    titleEn: "Many Lives, Many Times - Vol. 3",
    author: "Nguyên Phong",
    cover: "/books/muon-kiep-nhan-sinh-3.webp",
    coverBack: "/books/muon-kiep-nhan-sinh-3-back.jpg",
    hue: 205, // deep door-blue
    saturation: 48,
    lightness: 22,
    foil: "#CFE6F5",
    scale: 1.0,
  },
];
