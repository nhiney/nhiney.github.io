"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  List,
  Rows3,
  Search,
  X,
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

function ArticleRailButton({
  label,
  onClick,
  disabled,
  active,
  ariaControls,
  ariaExpanded,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      className={cn(
        "article-quick-nav-button grid size-10 shrink-0 place-items-center rounded-full border border-transparent text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "hover:bg-accent hover:text-foreground",
        active && "border-primary/45 bg-primary/10 text-primary ring-2 ring-primary/45 ring-offset-2 ring-offset-background",
        disabled && "cursor-not-allowed opacity-35 hover:bg-transparent hover:text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

function ArticleRailLink({
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
      className="article-quick-nav-button grid size-10 shrink-0 place-items-center rounded-full border border-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
  const [showRail, setShowRail] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");

    const updateVisibility = () => {
      const threshold = Math.min(window.innerHeight * 0.45, 420);
      setShowRail(!media.matches || window.scrollY > threshold);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    media.addEventListener("change", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      media.removeEventListener("change", updateVisibility);
    };
  }, []);

  const scrollToPosts = () => {
    document.getElementById(postsTargetId)?.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
  };

  const focusSearch = () => {
    const input = document.getElementById(searchTargetId);
    input?.scrollIntoView({ behavior: getScrollBehavior(), block: "center" });
    if (input instanceof HTMLInputElement) input.focus({ preventScroll: true });
  };

  return (
    <QuickNavShell
      ariaLabel={t("blogPage.quick_nav")}
      className={cn("blog-index-quick-nav", !showRail && "blog-index-quick-nav--hidden")}
    >
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
  const [panelOpen, setPanelOpen] = useState(false);
  const [showRail, setShowRail] = useState(false);
  const panelId = "article-quick-nav-panel";
  const panelTitleId = `${panelId}-title`;

  const hasHeadings = nav.headings.length > 0;
  const progressScale = Math.max(0, Math.min(1, nav.progress / 100)).toString();

  const closePanel = () => {
    setPanelOpen(false);
  };

  useEffect(() => {
    if (!panelOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanelOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panelOpen]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const updateVisibility = () => {
      const threshold = Math.min(window.innerHeight * 0.46, 420);
      setShowRail(!media.matches || window.scrollY > threshold);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    media.addEventListener("change", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      media.removeEventListener("change", updateVisibility);
    };
  }, []);

  const focusDesktopToc = () => {
    const toc = document.getElementById("article-toc-aside");
    if (!toc || !window.matchMedia("(min-width: 1280px)").matches) return false;

    closePanel();
    toc.focus({ preventScroll: true });
    return true;
  };

  const toggleSectionList = () => {
    if (!hasHeadings || focusDesktopToc()) return;

    if (panelOpen) {
      closePanel();
      return;
    }

    setPanelOpen(true);
  };

  if (!nav.mounted) return null;

  return (
    <div className="blog-article-rail-inner">
      <nav
        aria-label={t("blogPage.quick_nav")}
        className={cn("article-quick-nav", !showRail && "article-quick-nav--hidden")}
        style={{ "--article-progress": progressScale } as CSSProperties}
      >
        <span className="sr-only">
          {t("blogPage.reading")}: {nav.progress}%
        </span>
        <span className="article-quick-nav-progress" aria-hidden="true">
          <span />
        </span>
        <div className="article-quick-nav-actions">
          <ArticleRailButton label={t("blogPage.quick_nav_top")} onClick={nav.scrollToTop}>
            <ArrowUp size={17} aria-hidden="true" />
          </ArticleRailButton>
          <ArticleRailButton
            label={t("blogPage.quick_nav_sections")}
            onClick={toggleSectionList}
            disabled={!hasHeadings}
            active={panelOpen}
            ariaControls={panelId}
            ariaExpanded={panelOpen}
          >
            <List size={17} aria-hidden="true" />
          </ArticleRailButton>
          <ArticleRailButton label={t("blogPage.quick_nav_bottom")} onClick={nav.scrollToEnd}>
            <ArrowDown size={17} aria-hidden="true" />
          </ArticleRailButton>
          <span className="article-quick-nav-divider" aria-hidden="true" />
          <ArticleRailLink label={t("blogPage.quick_nav_all_articles")} href="/blog">
            <ArrowLeft size={16} aria-hidden="true" />
          </ArticleRailLink>
        </div>
      </nav>

      {panelOpen && (
        <section
          id={panelId}
          role="region"
          aria-labelledby={panelTitleId}
          className="article-quick-nav-panel rounded-lg border border-border/70 bg-background/95 p-3 shadow-[0_18px_50px_hsl(var(--foreground)/0.14)] backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p id={panelTitleId} className="text-xs font-semibold uppercase text-muted-foreground/60">
              {t("blogPage.quick_nav_section_list")}
            </p>
            <button
              type="button"
              aria-label={t("blogPage.quick_nav_close_sections")}
              title={t("blogPage.quick_nav_close_sections")}
              onClick={closePanel}
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-2 max-h-72 overflow-y-auto pr-1">
            {nav.headings.length > 0 ? (
              nav.headings.map((heading) => {
                const active = nav.activeId === heading.id;
                return (
                  <button
                    key={heading.id}
                    type="button"
                    aria-current={active ? "location" : undefined}
                    onClick={() => {
                      nav.scrollToHeading(heading.id);
                      closePanel();
                    }}
                    className={cn(
                      "block w-full rounded-md px-3 py-2 text-left text-sm leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      heading.level === 3 && "pl-6",
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {heading.text}
                  </button>
                );
              })
            ) : (
              <p className="rounded-md px-3 py-4 text-sm text-muted-foreground/70">
                {t("blogPage.quick_nav_no_sections")}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
