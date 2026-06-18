"use client";

import { useLanguage } from "@/context/LanguageContext";

/** Dictionary key for a tag, e.g. "Slow Living" -> "blogPage.tags.slow_living". */
function tagKey(tag: string) {
  return `blogPage.tags.${tag.toLowerCase().replace(/\s+/g, "_")}`;
}

/** Translate a tag name, falling back to the original when no translation exists. */
export function translateTag(t: (k: string) => string, tag: string): string {
  const key = tagKey(tag);
  const value = t(key);
  return value === key ? tag : value;
}

/** Tag label for use inside server components (resolves language on the client). */
export function TagLabel({ tag }: { tag: string }) {
  const { t } = useLanguage();
  return <>{translateTag(t, tag)}</>;
}
