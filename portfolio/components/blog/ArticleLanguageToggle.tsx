"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const ARTICLE_LOCALES = [
  { code: "en", label: "EN", name: "English" },
  { code: "vi", label: "VI", name: "Vietnamese" },
] as const;

export function ArticleLanguageToggle({ hasVietnamese }: { hasVietnamese: boolean }) {
  const { language, setLanguage, t } = useLanguage();

  if (!hasVietnamese) return null;

  const activeLanguage = language === "vi" ? "vi" : "en";

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-[var(--rule)] bg-[var(--paper)]/85 p-1 text-[0.68rem] shadow-sm"
      role="group"
      aria-label={t("footer.language")}
    >
      <Globe size={13} className="ml-1 text-[var(--accent-ink)]" aria-hidden="true" />
      {ARTICLE_LOCALES.map((locale) => {
        const active = activeLanguage === locale.code;
        return (
          <button
            key={locale.code}
            type="button"
            aria-label={`${t("footer.language")}: ${locale.name}`}
            aria-pressed={active}
            onClick={() => setLanguage(locale.code as Language)}
            className={cn(
              "rounded-full px-2.5 py-1 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]",
              active
                ? "bg-[var(--accent-ink)] text-[var(--paper)]"
                : "text-[var(--ink-faint)] hover:bg-[var(--rule-soft)] hover:text-[var(--ink)]",
            )}
          >
            {locale.label}
          </button>
        );
      })}
    </div>
  );
}
