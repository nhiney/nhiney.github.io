"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionaries, type Language } from "@/lib/i18n/dictionaries";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getPathValue(root: unknown, keys: string[]) {
  return keys.reduce<unknown>((current, key) => {
    if (typeof current !== "object" || current === null || Array.isArray(current)) {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, root);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // English is always the default for first-time visitors. We only switch away
  // from it when the visitor has previously made an explicit choice.
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null;
    if (savedLang && dictionaries[savedLang]) {
      document.documentElement.lang = savedLang;
      const frame = requestAnimationFrame(() => setLanguage(savedLang));
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
  };

  const t = (path: string): string => {
    const keys = path.split(".");
    const value = getPathValue(dictionaries[language], keys);
    if (typeof value === "string") return value;

    const fallback = getPathValue(dictionaries.en, keys);
    return typeof fallback === "string" ? fallback : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
