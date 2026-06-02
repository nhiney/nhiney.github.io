"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/widgets/ThemeToggle";
import { AnimatedGradientText } from "@/components/effects/AnimatedGradientText";
import { useLanguage } from "@/context/LanguageContext";
import { NAV_ITEMS } from "@/lib/constants";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape, lock body scroll when open
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex w-full justify-center transition-all duration-300",
        scrolled || mobileOpen
          ? "border-b border-border/40 bg-background/80 backdrop-blur-md"
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

          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/40 transition-colors hover:bg-primary/10 hover:border-primary/40"
          >
            <AnimatePresence initial={false} mode="wait">
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  <Menu size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

      </Container>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-x-0 top-16 bottom-0 z-40 bg-background/40 backdrop-blur-sm md:hidden"
            />
            {/* panel */}
            <motion.nav
              id="mobile-nav"
              key="panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full z-50 border-b border-border/40 bg-background/95 backdrop-blur-md md:hidden"
            >
              <Container className="py-3">
                <ul className="flex flex-col">
                  {NAV_ITEMS.map((item, i) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" && pathname?.startsWith(item.href));
                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.04 * i }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "group flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium transition-colors",
                            active
                              ? "bg-primary/10 text-foreground"
                              : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                          )}
                        >
                          <span>{t(`nav.${item.name.toLowerCase()}`)}</span>
                          <ChevronRight
                            size={16}
                            className={cn(
                              "transition-transform duration-200 group-hover:translate-x-0.5",
                              active ? "text-primary" : "text-muted-foreground/60"
                            )}
                          />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </Container>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
