"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.toggle("dark", true);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  if (!mounted) {
    return <div className="h-10 w-10" aria-hidden="true" />;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full border border-border/50 transition-colors",
        "bg-secondary/20 hover:bg-secondary/40",
        theme === "dark" ? "blue-glow border-primary/20" : "hover:border-primary/20",
        className
      )}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 10, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -10, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="relative z-10"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5 text-primary" fill="currentColor" fillOpacity={0.2} />
          ) : (
            <Sun className="h-5 w-5 text-zinc-600" />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Decorative pulse background */}
      <motion.div
        layoutId="theme-bg"
        className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100"
      />
    </motion.button>
  );
}
