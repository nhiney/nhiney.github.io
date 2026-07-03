"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export interface ArticleHeading {
  id: string;
  text: string;
  level: number;
}

function getScrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") return "auto";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

function ensureHeadingId(element: HTMLElement, seen: Set<string>, index: number) {
  const base = element.id || slugify(element.textContent || "") || `section-${index + 1}`;
  let id = base;
  let suffix = 2;

  while (seen.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  if (element.id !== id) element.id = id;
  seen.add(id);
  return id;
}

export function useArticleNavigation(language: string) {
  const [headings, setHeadings] = useState<ArticleHeading[]>([]);
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) {
      const mountFrame = requestAnimationFrame(() => {
        setHeadings([]);
        setActiveId("");
        setMounted(true);
      });
      return () => cancelAnimationFrame(mountFrame);
    }

    const elements = Array.from(article.querySelectorAll<HTMLElement>("h2, h3"));
    const seen = new Set<string>();
    const items = elements.map((element, index) => ({
      id: ensureHeadingId(element, seen, index),
      text: element.textContent || "",
      level: Number(element.tagName.charAt(1)),
    }));

    const mountFrame = requestAnimationFrame(() => {
      setHeadings(items);
      setActiveId("");
      setMounted(true);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-100px 0% -66%" },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      cancelAnimationFrame(mountFrame);
      observer.disconnect();
    };
  }, [language]);

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

  const activeIndex = useMemo(
    () => headings.findIndex((heading) => heading.id === activeId),
    [activeId, headings],
  );

  const previousHeading = activeIndex > 0 ? headings[activeIndex - 1] : null;
  const nextHeading = activeIndex >= 0 ? headings[activeIndex + 1] ?? null : headings[0] ?? null;

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: getScrollBehavior() });
  }, []);

  const scrollToEnd = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight - window.innerHeight,
      behavior: getScrollBehavior(),
    });
  }, []);

  const scrollToHeading = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
  }, []);

  const scrollToPreviousHeading = useCallback(() => {
    if (previousHeading) scrollToHeading(previousHeading.id);
  }, [previousHeading, scrollToHeading]);

  const scrollToNextHeading = useCallback(() => {
    if (nextHeading) scrollToHeading(nextHeading.id);
  }, [nextHeading, scrollToHeading]);

  return {
    activeId,
    headings,
    mounted,
    progress,
    hasPreviousHeading: Boolean(previousHeading),
    hasNextHeading: Boolean(nextHeading),
    scrollToEnd,
    scrollToHeading,
    scrollToNextHeading,
    scrollToPreviousHeading,
    scrollToTop,
  };
}
