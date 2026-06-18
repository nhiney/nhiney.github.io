"use client";

import { useLanguage } from "@/context/LanguageContext";

/** Render a translated label by dictionary key — usable inside server components. */
export function T({ k }: { k: string }) {
  const { t } = useLanguage();
  return <>{t(k)}</>;
}
