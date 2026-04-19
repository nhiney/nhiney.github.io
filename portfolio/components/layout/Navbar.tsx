"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
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
      <Container className="flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tighter sm:text-2xl">
            {SITE_CONFIG.name.toLowerCase()}.dev
          </span>
        </Link>
        
        <nav className="hidden items-center gap-10 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 border-l border-border pl-8">
            <ThemeToggle />
            <Link 
              href={SITE_CONFIG.links.linkedin}
              target="_blank"
              className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-95"
            >
              Contact Me
            </Link>
          </div>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
