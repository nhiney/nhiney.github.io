import type { ReactNode } from "react";
import type { BookMeta, BookReadingPage } from "@/data/books";

/** Lightweight view model the 3D scene needs for one readable book. */
export interface LibBookView {
  slug: string;
  /** Canonical (English) title — baked into the spine/cover texture. */
  title: string;
  meta: BookMeta;
}

/** One leaf in the flipbook reader. Built from the review (or key points) and
 * rendered in the printed-book palette by FlipBookReader. */
export interface BookPage {
  kind: "title" | "list" | "content" | "end";
  /** Small uppercase label above the leaf (e.g. tag / "Key ideas"). */
  kicker?: string;
  /** Section/chapter heading for the leaf. */
  heading?: string;
  /** Body paragraphs (content leaves). */
  paragraphs?: string[];
  /** Bullet items (list leaves — the key-points page). */
  items?: string[];
  /** 0-based number the first item on a list leaf continues from. */
  start?: number;
  /** True for the first content/list leaf — gets the heading kicker / drop cap. */
  opening?: boolean;
}

/** Full reading model — adds the localized prose for the reading overlay. */
export interface LibBookFull {
  slug: string;
  /** Blog post slug for the full review, if any. */
  blogSlug?: string;
  meta: BookMeta;
  /** Canonical English title (spine/cover). */
  enTitle: string;
  /** Per-locale title / description (always includes "en"). */
  titles: Record<string, string>;
  descriptions: Record<string, string>;
  /** Per-locale compiled MDX body (server-rendered, always includes "en"). */
  bodies: Record<string, ReactNode>;
  /** Per-locale key-point notes shown before opening (always includes "en"). */
  keyPoints: Record<string, string[]>;
  /** Per-locale short cover note for the outside/detail view. */
  coverNote: Record<string, string | undefined>;
  /** Optional curated reading pages used to seed the flipbook. */
  readingPages: Record<string, BookReadingPage[] | undefined>;
  /** Per-locale flipbook deck (each PAGES_PER_BOOK long, always includes "en"). */
  pages: Record<string, BookPage[]>;
  date: string;
  readingTime: string;
  tags: string[];
}

export const LOCALE_LABEL: Record<string, string> = {
  en: "EN",
  vi: "VI",
  ja: "日本語",
  zh: "中文",
  es: "ES",
  fr: "FR",
  de: "DE",
  ko: "한국어",
  ru: "RU",
  pt: "PT",
};
