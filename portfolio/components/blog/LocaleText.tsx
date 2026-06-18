"use client";

import { useLanguage } from "@/context/LanguageContext";

/**
 * Render a string from a per-locale map, falling back to English.
 * Used for post titles/descriptions that come from MDX frontmatter.
 */
export function LocaleText({ map }: { map: Record<string, string> }) {
  const { language } = useLanguage();
  return <>{map[language] ?? map.en ?? ""}</>;
}
