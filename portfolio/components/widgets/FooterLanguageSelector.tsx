"use client";

import { useLanguage } from "@/context/LanguageContext";
import { languages, visibleLanguages } from "@/lib/i18n/languages";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useState } from "react";

export function FooterLanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const current = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-full border border-border/60 bg-transparent px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-border hover:text-foreground active:scale-95"
      >
        <Globe size={14} className="text-muted-foreground" />
        <span className="text-sm leading-none">{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown
          size={12}
          className={cn("transition-transform", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              role="listbox"
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              className="absolute bottom-full left-1/2 z-50 mb-2 max-h-64 min-w-[160px] -translate-x-1/2 overflow-y-auto rounded-2xl border border-border/50 bg-background/95 p-1 text-left shadow-2xl backdrop-blur-xl"
            >
              {visibleLanguages.map((lang) => {
                const active = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all hover:bg-foreground/5",
                      active ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span className="flex-1">{lang.label}</span>
                    {active && <Check size={13} className="text-foreground" />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
