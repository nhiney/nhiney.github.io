import { Language } from "@/lib/i18n/dictionaries";

export type LanguageOption = { code: Language; label: string; flag: string };

// All supported languages. en & vi ship full dictionaries; the rest provide
// nav/hero/etc. and gracefully fall back to English for any missing keys.
export const languages: LanguageOption[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "zh", label: "简体中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

// Languages surfaced in the UI selector. Trim this to hide a language without
// removing its dictionary. English is always the default.
export const VISIBLE_CODES: Language[] = ["en", "vi", "zh", "ja", "ko", "fr", "es", "de"];

export const visibleLanguages = languages.filter((l) => VISIBLE_CODES.includes(l.code));

export const DEFAULT_LANGUAGE: Language = "en";
