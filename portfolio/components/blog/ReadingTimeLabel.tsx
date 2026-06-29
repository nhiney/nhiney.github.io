"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { PostTranslation } from "@/types";

function minutesFrom(readingTime: string) {
  const match = readingTime.match(/\d+/);
  return match?.[0] ?? readingTime;
}

export function formatReadingTime(readingTime: string, language: string) {
  if (language === "vi") return `${minutesFrom(readingTime)} phút đọc`;
  return readingTime;
}

export function ReadingTimeLabel({
  readingTime,
  i18n,
}: {
  readingTime: string;
  i18n?: Record<string, PostTranslation>;
}) {
  const { language } = useLanguage();
  const localizedReadingTime = i18n?.[language]?.readingTime ?? readingTime;
  return <>{formatReadingTime(localizedReadingTime, language)}</>;
}
