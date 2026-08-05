"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThemeToggleLabels {
  light: string;
  dark: string;
  toLight: string;
  toDark: string;
}

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  labels?: Partial<ThemeToggleLabels>;
}

const DEFAULT_LABELS: ThemeToggleLabels = {
  light: "Light",
  dark: "Dark",
  toLight: "Switch to light theme",
  toDark: "Switch to dark theme",
};

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  } catch {
    /* System preference remains a safe fallback when storage is unavailable. */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle({ className, showLabel = false, labels }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const reduceMotion = useReducedMotion();
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };
  const targetLabel = theme === "light" ? resolvedLabels.toDark : resolvedLabels.toLight;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const syncFromRoot = () => setTheme(root.classList.contains("dark") ? "dark" : "light");
    const syncFromStorage = (event: StorageEvent) => {
      if (event.key !== "theme") return;
      if (event.newValue === "light" || event.newValue === "dark") {
        root.classList.toggle("dark", event.newValue === "dark");
        setTheme(event.newValue);
      }
    };
    const observer = new MutationObserver(syncFromRoot);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("storage", syncFromStorage);
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;

    // Enable temporary cross-fade transition for ALL color/border/shadow
    // tokens, then strip it after the animation finishes so it doesn't
    // permanently slow down other interactions.
    if (!reduceMotion) root.classList.add("theme-transitioning");
    setTheme(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      /* The current tab can still switch even when storage is unavailable. */
    }
    root.classList.toggle("dark", nextTheme === "dark");
    if (reduceMotion) root.classList.remove("theme-transitioning");
    else window.setTimeout(() => root.classList.remove("theme-transitioning"), 320);
  };

  if (!mounted) {
    return <div className={showLabel ? "h-10 w-36" : "h-10 w-10"} aria-hidden="true" />;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      data-analytics-event="theme_changed"
      data-analytics-label={theme === "light" ? "dark" : "light"}
      whileHover={reduceMotion ? undefined : { scale: 1.05 }}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      className={cn(
        "relative flex h-10 items-center justify-center rounded-full border border-input/70 shadow-sm transition-colors",
        showLabel ? "w-auto gap-2 px-3" : "w-10",
        "bg-secondary/60 hover:bg-accent",
        theme === "dark" ? "blue-glow border-primary/40" : "hover:border-primary/55",
        className
      )}
      aria-label={targetLabel}
      aria-pressed={theme === "dark"}
      title={targetLabel}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 10, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -10, opacity: 0, rotate: 90 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeInOut" }}
          className="relative z-10"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5 text-primary" fill="currentColor" fillOpacity={0.2} />
          ) : (
            <Sun className="h-5 w-5 text-foreground" />
          )}
        </motion.div>
      </AnimatePresence>

      {showLabel ? (
        <span className="relative z-10 whitespace-nowrap text-xs font-semibold">
          {theme === "light" ? resolvedLabels.light : resolvedLabels.dark}
        </span>
      ) : null}
    </motion.button>
  );
}
