"use client";

import { useLanguage } from "@/context/LanguageContext";
import { languages, visibleLanguages } from "@/lib/i18n/languages";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/20 px-4 py-2 text-xs font-bold transition-all hover:bg-secondary/40 active:scale-95 border-primary/20"
      >
        <Globe size={14} className="text-primary" />
        <span className="hidden sm:inline uppercase">{language}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown size={12} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 z-50 min-w-[140px] overflow-hidden rounded-2xl border border-border/50 bg-background/90 p-1 shadow-2xl backdrop-blur-xl"
            >
              {visibleLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition-all hover:bg-secondary/50",
                    language === lang.code ? "text-primary bg-primary/5" : "text-muted-foreground"
                  )}
                >
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
