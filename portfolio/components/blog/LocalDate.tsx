"use client";

import { useLanguage } from "@/context/LanguageContext";

// Map the app's language codes to BCP-47 tags for Intl date formatting.
const LOCALE_TAG: Record<string, string> = {
  en: "en-US",
  vi: "vi-VN",
  ja: "ja-JP",
  zh: "zh-CN",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  ko: "ko-KR",
  ru: "ru-RU",
  pt: "pt-BR",
};

/** A long-form date that follows the active language (e.g. "10 tháng 4, 2026"). */
export function LocalDate({ date }: { date: string }) {
  const { language } = useLanguage();
  const tag = LOCALE_TAG[language] ?? "en-US";
  const formatted = new Date(date).toLocaleDateString(tag, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return <>{formatted}</>;
}
