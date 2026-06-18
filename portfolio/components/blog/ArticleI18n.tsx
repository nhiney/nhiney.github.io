"use client";

import { ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Picks the article body matching the active language and falls back to English.
 * Every available locale's compiled MDX is rendered on the server and passed in
 * as a node, so switching language is instant and works on a static export.
 */
export function ArticleI18n({ bodies }: { bodies: Record<string, ReactNode> }) {
  const { language } = useLanguage();
  return <article className="post-content">{bodies[language] ?? bodies.en}</article>;
}
