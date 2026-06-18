"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import { Post } from "@/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";
import { ViewCounter } from "@/components/blog/ViewCounter";
import { LocalDate } from "@/components/blog/LocalDate";
import { translateTag } from "@/components/blog/TagLabel";
import { useLanguage } from "@/context/LanguageContext";

interface BlogClientProps {
  posts: Post[];
}

/* Pick a post's localized title/description, falling back to English. */
function localized(post: Post, field: "title" | "description", language: string) {
  return post.i18n?.[language]?.[field] ?? post[field];
}

/* A small dot-separated meta line: date · reading time · views */
function Meta({ post, className }: { post: Post; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-xs text-muted-foreground/70", className)}>
      <time><LocalDate date={post.date} /></time>
      <span className="text-muted-foreground/30">·</span>
      <span>{post.readingTime}</span>
      <span className="text-muted-foreground/30">·</span>
      <ViewCounter slug={post.slug} readOnly showLabel={false} />
    </div>
  );
}

/* Lead article — the most recent post, given a little more room to breathe */
function FeaturedArticle({ post }: { post: Post }) {
  const { t, language } = useLanguage();
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="border-b border-border/50 pb-12">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            {t("blogPage.latest")}
          </span>
          {post.tags?.[0] && (
            <>
              <span className="h-px w-6 bg-border" />
              <span className="text-[11px] text-muted-foreground/70">{translateTag(t, post.tags[0])}</span>
            </>
          )}
        </div>

        <h2 className="max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary md:text-[2.6rem] md:leading-[1.1]">
          {localized(post, "title", language)}
        </h2>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {localized(post, "description", language)}
        </p>

        <div className="mt-7 flex items-center gap-4">
          <Meta post={post} />
          <span className="flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
            {t("blogPage.read")} <ArrowRight size={15} />
          </span>
        </div>
      </article>
    </Link>
  );
}

/* List row — clean editorial style, no thumbnails */
function ArticleRow({ post }: { post: Post }) {
  const { t, language } = useLanguage();
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="flex flex-col gap-3 border-b border-border/40 py-8 transition-colors sm:flex-row sm:items-baseline sm:gap-8">
        {/* Date rail: date on top, reading time · views below */}
        <div className="shrink-0 text-xs text-muted-foreground/70 sm:w-36">
          <time className="block"><LocalDate date={post.date} /></time>
          <span className="mt-1 flex items-center gap-2 text-muted-foreground/50">
            {post.readingTime}
            <span className="text-muted-foreground/30">·</span>
            <ViewCounter slug={post.slug} readOnly showLabel={false} />
          </span>
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-balance text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
              {localized(post, "title", language)}
            </h3>
            <ArrowUpRight
              size={18}
              className="mt-1 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
            />
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {localized(post, "description", language)}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-muted-foreground/60 transition-colors group-hover:text-muted-foreground"
                >
                  #{translateTag(t, tag)}
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
  const { t } = useLanguage();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { allTags, tagCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => p.tags?.forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
    return { allTags: sorted, tagCounts: counts };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeTag) result = result.filter((p) => p.tags?.includes(activeTag));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, activeTag, searchQuery]);

  const isFiltering = Boolean(activeTag || searchQuery);
  const featuredPost = isFiltering ? null : posts[0];
  const listPosts = featuredPost
    ? filteredPosts.filter((p) => p.slug !== featuredPost.slug)
    : filteredPosts;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* ── Toolbar: search + count ─────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={16} />
          <input
            type="text"
            placeholder={t("blogPage.search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full border-0 border-b border-transparent bg-transparent pl-7 pr-7 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-border"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground/60">
          {filteredPosts.length}{" "}
          {t(filteredPosts.length === 1 ? "blogPage.article_one" : "blogPage.article_other")}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* ── Sidebar: topics ───────────────────────────────────── */}
        <aside className="lg:w-48 lg:shrink-0">
          {/* Mobile: horizontal chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none lg:hidden">
            <TagChip label={t("blogPage.all")} count={posts.length} active={!activeTag} onClick={() => setActiveTag(null)} />
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

          {/* Desktop: vertical list */}
          <nav className="sticky top-24 hidden lg:block">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/50">
              {t("blogPage.topics")}
            </p>
            <ul className="space-y-0.5">
              <TopicItem label={t("blogPage.all_posts")} count={posts.length} active={!activeTag} onClick={() => setActiveTag(null)} />
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

        {/* ── Article list ──────────────────────────────────────── */}
        <div className="min-w-0 flex-1">
          {filteredPosts.length === 0 ? (
            <FadeIn>
              <div className="flex flex-col items-center justify-center gap-3 py-28 text-center">
                <p className="text-sm text-muted-foreground">{t("blogPage.no_results")}</p>
                {isFiltering && (
                  <button
                    onClick={() => { setActiveTag(null); setSearchQuery(""); }}
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
              {listPosts.map((post, i) => (
                <FadeIn key={post.slug} delay={i * 0.05}>
                  <ArticleRow post={post} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar item primitives ───────────────────────────────────── */

function TopicItem({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "group flex w-full items-center justify-between rounded-md py-1.5 text-sm transition-colors",
          active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
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

function TagChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs transition-colors",
        active
          ? "border-primary/40 bg-primary/10 font-medium text-primary"
          : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
      )}
    >
      {label} <span className="text-muted-foreground/50">{count}</span>
    </button>
  );
}
