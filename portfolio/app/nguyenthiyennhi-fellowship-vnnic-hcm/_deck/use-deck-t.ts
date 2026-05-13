"use client";

import { useLanguage } from "@/context/LanguageContext";
import { deckTx, type SlideTexts, type DeckLang } from "./translations";

export function useDeckT(): SlideTexts {
  const { language } = useLanguage();
  const lang: DeckLang = language === "vi" ? "vi" : "en";
  return deckTx[lang];
}
