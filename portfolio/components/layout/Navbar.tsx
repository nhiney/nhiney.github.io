"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled ? "border-b border-border bg-background/80 backdrop-blur-md py-4" : "bg-transparent py-6"
    )}>
      <Container className="flex items-center justify-between gap-8">
        {/* ① Logo */}
        <Link href="/" className="group -ml-1 shrink-0 flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
            HI <span className="inline-block transition-transform group-hover:rotate-12">😊</span>
          </span>
        </Link>

        {/* ② Nav links — pushed to the right, close to controls, far from HI */}
        <nav className="hidden items-center gap-7 md:flex ml-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(`nav.${item.name.toLowerCase()}`)}
            </Link>
          ))}
        </nav>

        {/* ③ Controls — pinned to the right */}
        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            href="/#contact"
            className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-95"
          >
            {t("nav.contactBtn")}
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
