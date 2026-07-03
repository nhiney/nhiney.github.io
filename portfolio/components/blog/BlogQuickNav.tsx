"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  List,
  Rows3,
  Search,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useArticleNavigation } from "@/components/blog/useArticleNavigation";

function getScrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") return "auto";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function scrollToDocumentTop() {
  window.scrollTo({ top: 0, behavior: getScrollBehavior() });
}

function scrollToDocumentEnd() {
  window.scrollTo({
    top: document.documentElement.scrollHeight - window.innerHeight,
    behavior: getScrollBehavior(),
  });
}

function QuickNavShell({
  ariaLabel,
  children,
  className,
}: {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "fixed right-[max(0.75rem,env(safe-area-inset-right))] top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-1 rounded-full border border-border/70 bg-background/90 p-1 shadow-[0_14px_40px_hsl(var(--foreground)/0.12)] backdrop-blur-md sm:right-5",
        className,
      )}
    >
      {children}
    </nav>
  );
}

function QuickNavButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "hover:bg-accent hover:text-foreground",
        disabled && "cursor-not-allowed opacity-35 hover:bg-transparent hover:text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

function QuickNavLink({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {children}
    </Link>
  );
}

export function BlogIndexQuickNav({
  postsTargetId,
  searchTargetId,
}: {
  postsTargetId: string;
  searchTargetId: string;
}) {
  const { t } = useLanguage();

  const scrollToPosts = () => {
    document.getElementById(postsTargetId)?.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
  };

  const focusSearch = () => {
    const input = document.getElementById(searchTargetId);
    input?.scrollIntoView({ behavior: getScrollBehavior(), block: "center" });
    if (input instanceof HTMLInputElement) input.focus({ preventScroll: true });
  };

  return (
    <QuickNavShell ariaLabel={t("blogPage.quick_nav")}>
      <QuickNavButton label={t("blogPage.quick_nav_top")} onClick={scrollToDocumentTop}>
        <ArrowUp size={16} aria-hidden="true" />
      </QuickNavButton>
      <QuickNavButton label={t("blogPage.quick_nav_search")} onClick={focusSearch}>
        <Search size={16} aria-hidden="true" />
      </QuickNavButton>
      <QuickNavButton label={t("blogPage.quick_nav_posts")} onClick={scrollToPosts}>
        <Rows3 size={16} aria-hidden="true" />
      </QuickNavButton>
      <QuickNavButton label={t("blogPage.quick_nav_bottom")} onClick={scrollToDocumentEnd}>
        <ArrowDown size={16} aria-hidden="true" />
      </QuickNavButton>
    </QuickNavShell>
  );
}

export function ArticleQuickNav() {
  const { t, language } = useLanguage();
  const nav = useArticleNavigation(language);

  if (!nav.mounted) return null;

  return (
    <QuickNavShell ariaLabel={t("blogPage.quick_nav")} className="blog-article-floating-nav">
      <QuickNavButton label={t("blogPage.quick_nav_top")} onClick={nav.scrollToTop}>
        <ArrowUp size={16} aria-hidden="true" />
      </QuickNavButton>
      <QuickNavButton
        label={t("blogPage.quick_nav_previous_section")}
        onClick={nav.scrollToPreviousHeading}
        disabled={!nav.hasPreviousHeading}
      >
        <ChevronUp size={17} aria-hidden="true" />
      </QuickNavButton>
      <QuickNavButton
        label={t("blogPage.quick_nav_next_section")}
        onClick={nav.scrollToNextHeading}
        disabled={!nav.hasNextHeading}
      >
        <ChevronDown size={17} aria-hidden="true" />
      </QuickNavButton>
      <QuickNavButton label={t("blogPage.quick_nav_bottom")} onClick={nav.scrollToEnd}>
        <ArrowDown size={16} aria-hidden="true" />
      </QuickNavButton>
      <QuickNavLink label={t("blogPage.quick_nav_all_articles")} href="/blog">
        <List size={16} aria-hidden="true" />
      </QuickNavLink>
    </QuickNavShell>
  );
}
