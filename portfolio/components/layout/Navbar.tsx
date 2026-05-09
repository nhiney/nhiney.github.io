"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/widgets/LanguageSwitcher";
import { ThemeToggle } from "@/components/widgets/ThemeToggle";
import { AnimatedGradientText } from "@/components/effects/AnimatedGradientText";
import { useLanguage } from "@/context/LanguageContext";
import { NAV_ITEMS } from "@/lib/constants";
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
    <header
      className={cn(
        "sticky top-0 z-50 flex w-full justify-center transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/70 backdrop-blur-md"
          : "bg-background/0"
      )}
    >
      <Container className="flex h-16 items-center justify-between py-3">

        {/* ① Left — name + introduction badge */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="text-base font-black tracking-tight transition-opacity hover:opacity-80 whitespace-nowrap"
          >
            Nguyễn Thị Yến Nhi
          </Link>

          <Link href="/portfolio" className="hidden xl:block">
            <AnimatedGradientText className="py-2 px-5 text-sm cursor-pointer">
              🚀{" "}
              <span className="mx-2 inline-block h-4 w-[1px] shrink-0 bg-gray-400/60 align-middle" />
              <span className="animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent font-semibold">
                {t("nav.portfolio")}
              </span>
              <ChevronRight
                size={14}
                className="ml-1.5 inline-block transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
              />
            </AnimatedGradientText>
          </Link>
        </div>

        {/* ② Right — nav links + controls (natural width, empty space in the middle) */}
        <div className="hidden items-center gap-2 md:flex shrink-0">
          <nav className="flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(`nav.${item.name.toLowerCase()}`)}
              </Link>
            ))}
          </nav>

          <div className="h-6 w-[1px] bg-border/60 mx-1" />

          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

      </Container>
    </header>
  );
}
