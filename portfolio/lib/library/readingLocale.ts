import type { Language } from "@/lib/i18n/dictionaries";

type LocalizedCollection = Record<string, readonly unknown[] | undefined>;

export function authoredReadingLocales(
  readingPages: LocalizedCollection | undefined
): Language[] {
  if (!readingPages) return [];
  return Object.entries(readingPages)
    .filter(([locale, pages]) => (
      (locale === "en" || locale === "vi")
      && Array.isArray(pages)
      && pages.length > 0
    ))
    .map(([locale]) => locale as Language);
}

/** Resolve to a real manuscript before considering a generated key-point deck.
 * This prevents a Vietnamese-only book from looking empty when the surrounding
 * portfolio happens to be set to English. */
export function resolveReadingLocale(
  siteLanguage: Language,
  readingPages: LocalizedCollection | undefined,
  generatedDecks: LocalizedCollection | undefined
): Language {
  const authored = authoredReadingLocales(readingPages);
  if (authored.includes(siteLanguage)) return siteLanguage;
  if (authored.includes("vi")) return "vi";
  if (authored[0]) return authored[0];
  if (generatedDecks?.[siteLanguage]?.length) return siteLanguage;
  return "en";
}
