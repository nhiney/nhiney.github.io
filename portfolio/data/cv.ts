// ─── Public CV API ───────────────────────────────────────────────────────────
// Components should import { useCV } from "@/data/cv" so the displayed copy
// auto-switches whenever the user changes the site language.

"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CV_EN } from "./cv-en";
import { CV_VI } from "./cv-vi";
import type { CVData } from "./cv-types";

export type { CVData, Project, SkillGroup, Certification, EducationEntry } from "./cv-types";

/** English copy is also exported for static contexts (e.g. SSR fallbacks). */
export const CV: CVData = CV_EN;

/** Returns the CV in the user's currently selected language (falls back to EN). */
export function useCV(): CVData {
  const { language } = useLanguage();
  if (language === "vi") return CV_VI;
  return CV_EN;
}
