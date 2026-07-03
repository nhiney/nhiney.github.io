"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, List } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useArticleNavigation } from "@/components/blog/useArticleNavigation";

function TocActionButton({
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
        "grid size-8 place-items-center rounded-full text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "hover:bg-accent hover:text-foreground",
        disabled && "cursor-not-allowed opacity-35 hover:bg-transparent hover:text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function TableOfContents() {
  const { t, language } = useLanguage();
  const nav = useArticleNavigation(language);

  // Hide entirely when the article has no sub-headings
  if (nav.headings.length === 0) return null;

  return (
    <div
      className={cn(
        "transition-all duration-500",
        nav.mounted ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
      )}
    >
      <p className="mb-4 text-[11px] font-semibold uppercase text-muted-foreground/50">
        {t("blogPage.on_this_page")}
      </p>

      <nav className="flex flex-col border-l border-border/60">
        {nav.headings.map((item) => {
          const active = nav.activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "-ml-px border-l py-1.5 text-sm leading-snug transition-colors duration-200",
                item.level === 3 ? "pl-7" : "pl-4",
                active
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground/80 hover:border-border hover:text-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                nav.scrollToHeading(item.id);
              }}
            >
              {item.text}
            </a>
          );
        })}
      </nav>

      {/* Reading progress + back to top */}
      <div className="mt-6 space-y-3 border-t border-border/50 pt-4">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground/60">
          <span className="uppercase">{t("blogPage.reading")}</span>
          <span className="tabular-nums font-medium text-muted-foreground">{nav.progress}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-border/50">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
            style={{ width: `${nav.progress}%` }}
          />
        </div>
        <div className="flex items-center gap-1" role="group" aria-label={t("blogPage.quick_nav")}>
          <TocActionButton label={t("blogPage.quick_nav_top")} onClick={nav.scrollToTop}>
            <ArrowUp size={14} aria-hidden="true" />
          </TocActionButton>
          <TocActionButton
            label={t("blogPage.quick_nav_previous_section")}
            onClick={nav.scrollToPreviousHeading}
            disabled={!nav.hasPreviousHeading}
          >
            <ChevronUp size={15} aria-hidden="true" />
          </TocActionButton>
          <TocActionButton
            label={t("blogPage.quick_nav_next_section")}
            onClick={nav.scrollToNextHeading}
            disabled={!nav.hasNextHeading}
          >
            <ChevronDown size={15} aria-hidden="true" />
          </TocActionButton>
          <TocActionButton label={t("blogPage.quick_nav_bottom")} onClick={nav.scrollToEnd}>
            <ArrowDown size={14} aria-hidden="true" />
          </TocActionButton>
          <Link
            href="/blog"
            aria-label={t("blogPage.quick_nav_all_articles")}
            title={t("blogPage.quick_nav_all_articles")}
            className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <List size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
