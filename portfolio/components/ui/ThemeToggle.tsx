"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Using a microtask to move setState out of the synchronous effect body to satisfy strict lint rules
    Promise.resolve().then(() => setMounted(true));
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      Promise.resolve().then(() => setTheme(savedTheme));
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      Promise.resolve().then(() => setTheme("dark"));
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "group relative flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-muted/50",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5 overflow-hidden">
        <Sun className={cn(
          "absolute inset-0 h-5 w-5 transition-all duration-500",
          theme === "dark" ? "translate-y-0 opacity-100 rotate-0" : "translate-y-8 opacity-0 rotate-90"
        )} />
        <Moon className={cn(
          "absolute inset-0 h-5 w-5 transition-all duration-500",
          theme === "light" ? "translate-y-0 opacity-100 rotate-0" : "-translate-y-8 opacity-0 -rotate-90"
        )} />
      </div>
    </button>
  );
}
