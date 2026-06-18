"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const { t } = useLanguage();
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Collect headings + track which one is in view
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll("h2, h3"));
    const items = elements.map((el) => {
      if (!el.id) {
        el.id = el.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      }
      return {
        id: el.id,
        text: el.textContent || "",
        level: Number(el.tagName.charAt(1)),
      };
    });

    setHeadings(items);
    // next frame so the fade-in transition actually runs
    requestAnimationFrame(() => setMounted(true));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-100px 0% -66%" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Reading progress through the page
  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Hide entirely when the article has no sub-headings
  if (headings.length === 0) return null;

  return (
    <div
      className={cn(
        "transition-all duration-500",
        mounted ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      )}
    >
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/50">
        {t("blogPage.on_this_page")}
      </p>

      <nav className="flex flex-col border-l border-border/60">
        {headings.map((item) => {
          const active = activeId === item.id;
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
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
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
          <span className="uppercase tracking-[0.14em]">{t("blogPage.reading")}</span>
          <span className="tabular-nums font-medium text-muted-foreground">{progress}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-border/50">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowUp size={13} className="transition-transform group-hover:-translate-y-0.5" />
          {t("blogPage.back_to_top")}
        </button>
      </div>
    </div>
  );
}
