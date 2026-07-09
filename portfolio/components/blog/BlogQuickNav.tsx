"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
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

async function copyToClipboard(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fall back to the local selection-based copy path below.
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
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
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"list" | "search">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const panelId = "article-quick-nav-panel";

  const hasHeadings = nav.headings.length > 0;
  const progressScale = Math.max(0, Math.min(1, nav.progress / 100)).toString();
  const filteredHeadings = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return nav.headings;
    return nav.headings.filter((heading) => heading.text.toLocaleLowerCase().includes(query));
  }, [nav.headings, searchQuery]);

  const closePanel = () => {
    setPanelOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    if (!panelOpen || panelMode !== "search") return;
    const frame = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [panelMode, panelOpen]);

  useEffect(() => {
    if (!panelOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanelOpen(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panelOpen]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const focusDesktopToc = () => {
    const toc = document.getElementById("article-toc-aside");
    if (!toc || !window.matchMedia("(min-width: 1600px)").matches) return false;

    closePanel();
    toc.focus({ preventScroll: true });
    return true;
  };

  const toggleSectionList = () => {
    if (!hasHeadings || focusDesktopToc()) return;

    if (panelOpen && panelMode === "list") {
      closePanel();
      return;
    }

    setPanelMode("list");
    setPanelOpen(true);
  };

  const openSectionSearch = () => {
    if (!hasHeadings) return;
    setPanelMode("search");
    setPanelOpen(true);
  };

  const copyArticleLink = async () => {
    if (await copyToClipboard(window.location.href)) setCopied(true);
  };

  if (!nav.mounted) return null;

  return (
    <div className="blog-article-rail-inner">
      <nav
        aria-label={t("blogPage.quick_nav")}
        className="article-quick-nav"
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
            label={t("blogPage.quick_nav_previous_section")}
            onClick={nav.scrollToPreviousHeading}
            disabled={!nav.hasPreviousHeading}
          >
            <ChevronUp size={18} aria-hidden="true" />
          </ArticleRailButton>
          <ArticleRailButton
            label={t("blogPage.quick_nav_search_sections")}
            onClick={openSectionSearch}
            disabled={!hasHeadings}
            active={panelOpen && panelMode === "search"}
            ariaControls={panelId}
            ariaExpanded={panelOpen && panelMode === "search"}
          >
            <Search size={16} aria-hidden="true" />
          </ArticleRailButton>
          <ArticleRailButton
            label={t("blogPage.quick_nav_sections")}
            onClick={toggleSectionList}
            disabled={!hasHeadings}
            active={panelOpen && panelMode === "list"}
            ariaControls={panelId}
            ariaExpanded={panelOpen && panelMode === "list"}
          >
            <List size={17} aria-hidden="true" />
          </ArticleRailButton>
          <ArticleRailButton
            label={t("blogPage.quick_nav_next_section")}
            onClick={nav.scrollToNextHeading}
            disabled={!nav.hasNextHeading}
          >
            <ChevronDown size={18} aria-hidden="true" />
          </ArticleRailButton>
          <ArticleRailButton label={t("blogPage.quick_nav_bottom")} onClick={nav.scrollToEnd}>
            <ArrowDown size={17} aria-hidden="true" />
          </ArticleRailButton>
          <span className="article-quick-nav-divider" aria-hidden="true" />
          <ArticleRailButton
            label={copied ? t("blogPage.quick_nav_link_copied") : t("blogPage.quick_nav_copy_link")}
            onClick={copyArticleLink}
            active={copied}
          >
            {copied ? <Check size={16} aria-hidden="true" /> : <Clipboard size={16} aria-hidden="true" />}
          </ArticleRailButton>
          <ArticleRailLink label={t("blogPage.quick_nav_all_articles")} href="/blog">
            <ArrowLeft size={16} aria-hidden="true" />
          </ArticleRailLink>
        </div>
      </nav>

      {panelOpen && (
        <section
          id={panelId}
          role="dialog"
          aria-label={t("blogPage.quick_nav_section_list")}
          className="article-quick-nav-panel rounded-lg border border-border/70 bg-background/95 p-3 shadow-[0_18px_50px_hsl(var(--foreground)/0.14)] backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground/60">
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

          <div className="relative mt-2">
            <Search
              size={14}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
            />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("blogPage.quick_nav_section_search")}
              className="h-9 w-full rounded-md border border-border/60 bg-background pl-8 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-primary/45 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mt-2 max-h-72 overflow-y-auto pr-1">
            {filteredHeadings.length > 0 ? (
              filteredHeadings.map((heading) => {
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
