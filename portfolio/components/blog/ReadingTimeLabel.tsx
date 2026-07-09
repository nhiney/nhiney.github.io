"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { PostTranslation } from "@/types";

function minutesFrom(readingTime: string) {
  const match = readingTime.match(/\d+/);
  return match?.[0] ?? readingTime;
}

export function formatReadingTime(readingTime: string, template: string) {
  return template.replace("{minutes}", minutesFrom(readingTime));
}

export function ReadingTimeLabel({
  readingTime,
  i18n,
}: {
  readingTime: string;
  i18n?: Record<string, PostTranslation>;
}) {
  const { language, t } = useLanguage();
  const localizedReadingTime = i18n?.[language]?.readingTime ?? readingTime;
  return <>{formatReadingTime(localizedReadingTime, t("blogPage.minute_read"))}</>;
}
