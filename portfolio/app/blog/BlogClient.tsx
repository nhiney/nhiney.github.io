"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { LocalDate } from "@/components/blog/LocalDate";
import { translateTag } from "@/components/blog/TagLabel";
import { ViewCounter } from "@/components/blog/ViewCounter";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

interface BlogClientProps {
  posts: Post[];
}

const BLOG_TAG_CHANGE_EVENT = "blog-tag-change";

function localized(post: Post, field: "title" | "description", language: string) {
  return post.i18n?.[language]?.[field] ?? post[field];
}

function getTagSnapshot() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("tag") ?? "";
}

function subscribeToTagChange(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener(BLOG_TAG_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener(BLOG_TAG_CHANGE_EVENT, onStoreChange);
  };
}

function Meta({ post, className }: { post: Post; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-xs site-soft", className)}>
      <time dateTime={post.date}>
        <LocalDate date={post.date} />
      </time>
      <span className="text-muted-foreground/25">·</span>
      <span>{post.readingTime}</span>
      <span className="text-muted-foreground/25">·</span>
      <ViewCounter slug={post.slug} readOnly showLabel={false} />
    </div>
  );
}

function FeaturedArticle({ post }: { post: Post }) {
  const { t, language } = useLanguage();

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="border-b border-border/50 pb-12 transition-colors duration-300 group-hover:border-primary/30">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            {t("blogPage.latest")}
          </span>
          {post.tags?.[0] && (
            <>
              <span className="h-px w-7 bg-border" />
              <span className="text-[11px] font-medium site-soft">
                {translateTag(t, post.tags[0])}
              </span>
            </>
          )}
        </div>

        <h2 className="max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight site-heading transition-colors group-hover:text-primary md:text-[2.6rem] md:leading-[1.1]">
          {localized(post, "title", language)}
        </h2>

        <p className="mt-5 max-w-2xl text-base leading-8 site-body">
          {localized(post, "description", language)}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
          <Meta post={post} />
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary opacity-100 transition-transform duration-300 group-hover:translate-x-0.5 md:opacity-0 md:group-hover:opacity-100">
            {t("blogPage.read")} <ArrowRight size={15} />
          </span>
        </div>
      </article>
    </Link>
  );
}

function ArticleRow({ post }: { post: Post }) {
  const { t, language } = useLanguage();

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="flex flex-col gap-4 border-b border-border/40 py-8 transition-colors duration-300 hover:border-primary/25 sm:flex-row sm:items-baseline sm:gap-8">
        <div className="shrink-0 text-xs site-soft sm:w-36">
          <time className="block">
            <LocalDate date={post.date} />
          </time>
          <span className="mt-1 flex items-center gap-2 text-muted-foreground/50">
            {post.readingTime}
            <span className="text-muted-foreground/25">·</span>
            <ViewCounter slug={post.slug} readOnly showLabel={false} />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-balance text-xl font-semibold leading-snug tracking-tight site-heading transition-colors group-hover:text-primary">
              {localized(post, "title", language)}
            </h3>
            <ArrowUpRight
              size={18}
              className="mt-1 shrink-0 text-muted-foreground/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
            />
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-7 site-body line-clamp-2">
            {localized(post, "description", language)}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[11px] site-soft transition-colors group-hover:text-muted-foreground">
                  #{translateTag(t, tag).replace(/\s+/g, "")}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export function BlogClient({ posts }: BlogClientProps) {
  const { t, language } = useLanguage();
  const urlTag = useSyncExternalStore(subscribeToTagChange, getTagSnapshot, () => "");
  const activeTag = useMemo(
    () => (urlTag && posts.some((post) => post.tags?.includes(urlTag)) ? urlTag : null),
    [posts, urlTag],
  );
  const [searchQuery, setSearchQuery] = useState("");

  const setActiveTag = useCallback((tag: string | null) => {
    const url = new URL(window.location.href);
    if (tag) url.searchParams.set("tag", tag);
    else url.searchParams.delete("tag");
    window.history.replaceState(null, "", url.toString());
    window.dispatchEvent(new Event(BLOG_TAG_CHANGE_EVENT));
  }, []);

  const { allTags, tagCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);

    return { allTags: sorted, tagCounts: counts };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeTag) {
      result = result.filter((post) => post.tags?.includes(activeTag));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((post) =>
        localized(post, "title", language).toLowerCase().includes(query) ||
        localized(post, "description", language).toLowerCase().includes(query) ||
        post.tags?.some((tag) =>
          tag.toLowerCase().includes(query) ||
          translateTag(t, tag).toLowerCase().includes(query)
        )
      );
    }

    return result;
  }, [posts, activeTag, searchQuery, language, t]);

  const isFiltering = Boolean(activeTag || searchQuery);
  const featuredPost = isFiltering ? null : posts[0];
  const listPosts = featuredPost
    ? filteredPosts.filter((post) => post.slug !== featuredPost.slug)
    : filteredPosts;

  const clearFilters = () => {
    setActiveTag(null);
    setSearchQuery("");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/40"
            size={16}
          />
          <input
            type="text"
            placeholder={t("blogPage.search_placeholder")}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-10 w-full border-0 border-b border-transparent bg-transparent pl-7 pr-7 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-border"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label={t("blogPage.clear_filters")}
              onClick={() => setSearchQuery("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <p className="text-xs site-soft">
          {filteredPosts.length}{" "}
          {t(filteredPosts.length === 1 ? "blogPage.article_one" : "blogPage.article_other")}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <aside className="lg:w-48 lg:shrink-0">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <TagChip
              label={t("blogPage.all")}
              count={posts.length}
              active={!activeTag}
              onClick={() => setActiveTag(null)}
            />
            {allTags.map((tag) => (
              <TagChip
                key={tag}
                label={translateTag(t, tag)}
                count={tagCounts[tag]}
                active={activeTag === tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              />
            ))}
          </div>

          <nav className="sticky top-24 hidden lg:block">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/50">
              {t("blogPage.topics")}
            </p>
            <ul className="space-y-0.5">
              <TopicItem
                label={t("blogPage.all_posts")}
                count={posts.length}
                active={!activeTag}
                onClick={() => setActiveTag(null)}
              />
              {allTags.map((tag) => (
                <TopicItem
                  key={tag}
                  label={translateTag(t, tag)}
                  count={tagCounts[tag]}
                  active={activeTag === tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                />
              ))}
            </ul>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {filteredPosts.length === 0 ? (
            <FadeIn>
              <div className="flex flex-col items-center justify-center gap-3 py-28 text-center">
                <p className="text-sm site-body">{t("blogPage.no_results")}</p>
                {isFiltering && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t("blogPage.clear_filters")}
                  </button>
                )}
              </div>
            </FadeIn>
          ) : (
            <div>
              {featuredPost && (
                <FadeIn>
                  <div className="mb-2">
                    <FeaturedArticle post={featuredPost} />
                  </div>
                </FadeIn>
              )}
              {listPosts.map((post, index) => (
                <FadeIn key={post.slug} delay={index * 0.05}>
                  <ArticleRow post={post} />
                </FadeIn>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function TopicItem({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex w-full items-center justify-between rounded-md py-1.5 text-sm transition-colors",
          active ? "font-medium site-heading" : "site-body hover:text-foreground",
        )}
      >
        <span className="flex items-center gap-2">
          <span className={cn("h-3 w-px transition-colors", active ? "bg-primary" : "bg-transparent")} />
          {label}
        </span>
        <span className={cn("text-xs tabular-nums", active ? "text-primary" : "text-muted-foreground/40")}>
          {count}
        </span>
      </button>
    </li>
  );
}

function TagChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs transition-colors",
        active
          ? "border-primary/40 bg-primary/10 font-medium text-primary"
          : "border-border/60 site-soft hover:border-border hover:text-foreground",
      )}
    >
      {label} <span className="text-muted-foreground/50">{count}</span>
    </button>
  );
}
