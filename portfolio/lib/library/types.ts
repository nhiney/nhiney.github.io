import type { ReactNode } from "react";
import type { BookMeta } from "@/data/books";

/** Lightweight view model the 3D scene needs for one readable book. */
export interface LibBookView {
  slug: string;
  /** Canonical (English) title — baked into the spine/cover texture. */
  title: string;
  meta: BookMeta;
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

