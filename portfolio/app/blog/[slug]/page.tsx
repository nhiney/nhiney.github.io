import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, CalendarDays, ChevronRight, Clock3 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { components } from "@/components/mdx/MDXComponents";
import { getPostBySlug, getSlugs, getAllPosts, Post } from "@/lib/mdx";
import type { PostTranslation } from "@/types";
import { SITE_CONFIG } from "@/lib/constants";
import { Metadata } from "next";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ViewCounter } from "@/components/blog/ViewCounter";
import { ArticleI18n } from "@/components/blog/ArticleI18n";
import { ArticleJsonLd } from "@/components/blog/ArticleJsonLd";
import { BlogCoverImage } from "@/components/blog/BlogCoverImage";
import { resolveBlogCover } from "@/lib/blog-cover";
import { LocaleText } from "@/components/blog/LocaleText";
import { TagLabel } from "@/components/blog/TagLabel";
import { LocalDate } from "@/components/blog/LocalDate";
import { ReadingTimeLabel } from "@/components/blog/ReadingTimeLabel";
import { T } from "@/components/i18n/T";

// Build per-locale string maps for a post's title / description, English first.
function localeMap(post: Post, field: "title" | "description"): Record<string, string> {
  const map: Record<string, string> = { en: post[field] };
  if (post.i18n) {
    for (const [lang, v] of Object.entries(post.i18n) as [string, PostTranslation][]) map[lang] = v[field];
  }
  return map;
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getSlugs("blog");
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx?$/, ""),
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug("blog", slug) as Post | null;

  if (!post) return {};

  // The blog's audience is primarily Vietnamese, so lead the page metadata with
  // the Vietnamese title/description when a translation exists. The <title> and
  // meta description are the strongest on-page relevance signals, so this makes
  // posts far easier to surface for Vietnamese searches — the English body still
  // lives in the same HTML for English readers.
  const vi = post.i18n?.vi;
  const title = vi?.title ?? post.title;
  const description = vi?.description ?? post.description;

  // Keep the English title as a keyword alongside the post's tags so the page
  // stays relevant for searches in either language.
  const keywords = Array.from(
    new Set([...(post.tags ?? []), title, post.title].filter(Boolean))
  ) as string[];

  // Prefer a real illustration when one exists, otherwise fall back to the
  // per-post card auto-generated at build time (scripts/generate-og.mjs).
  const cover = resolveBlogCover(slug, post.title, post.tags ?? [], post.image);
  const ogImage = cover.src
    ? `${SITE_CONFIG.url}${cover.src}`
    : `${SITE_CONFIG.url}/og/blog/${slug}.png`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "vi_VN",
      alternateLocale: ["en_US"],
      publishedTime: post.date as string,
      authors: [SITE_CONFIG.fullName],
      url: `${SITE_CONFIG.url}/blog/${slug}`,
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: ogImage, alt: title }],
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug("blog", slug);

  if (!post) notFound();

  // Surface the most topically-related articles: rank by how many tags they
  // share with this post (strongest overlap first), keeping the date order
  // from getAllPosts as the tie-breaker. Falls back to nothing when unrelated.
  const allPosts = await getAllPosts("blog");
  const relatedPosts = allPosts
    .map((p) => ({
      post: p,
      shared: (p.tags ?? []).filter((t: string) => post.tags?.includes(t)).length,
    }))
    .filter(({ post: p, shared }) => p.slug !== slug && shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3)
    .map(({ post: p }) => p);

  // Compile every available locale's body up front so the client can switch
  // language instantly. English ("en") is always present as the fallback.
  const variants: Record<string, { content: string }> =
    post.i18n && post.i18n.en ? post.i18n : { en: { content: post.content } };
  const bodies = Object.fromEntries(
    Object.entries(variants).map(([lang, v]) => [
      lang,
      <MDXRemote key={lang} source={v.content} components={components} />,
    ])
  );

  const cover = resolveBlogCover(slug, post.title, post.tags ?? [], post.image);
  const ogImage = cover.src
    ? `${SITE_CONFIG.url}${cover.src}`
    : `${SITE_CONFIG.url}/og/blog/${slug}.png`;

  // Mirror the VI-led page metadata in the structured data so the headline Google
  // reads matches the <title> it shows — consistent signals for VN searches.
  const viMeta = post.i18n?.vi;

  return (
    <>
      <ArticleJsonLd
        slug={slug}
        title={viMeta?.title ?? post.title}
        description={viMeta?.description ?? post.description}
        date={post.date as string}
        tags={post.tags}
        image={ogImage}
        lang={viMeta ? "vi" : "en"}
      />
      <Container className="py-10 sm:py-14 lg:py-16">
        <div className="blog-article-shell">
          <aside className="blog-article-toc" aria-label="Mục lục bài viết">
            <div className="blog-article-toc-inner">
              <TableOfContents />
            </div>
          </aside>

          <div className="blog-article-main mx-auto max-w-[48rem]">
            <FadeIn>
              <Link
                href="/blog"
                className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                <T k="blogPage.back_to_all" />
              </Link>
            </FadeIn>

            <FadeIn delay={0.05} className="book-page">
              <header className="border-b border-[var(--rule-soft)] pb-10 text-center sm:pb-12">
                {post.tags?.[0] && (
                  <p className="book-kicker mb-5">
                    <TagLabel tag={post.tags[0]} />
                  </p>
                )}

                <h1 className="book-title text-4xl sm:text-5xl lg:text-6xl">
                  <LocaleText map={localeMap(post, "title")} />
                </h1>

                <p className="book-lead mx-auto mt-6 max-w-[42rem] text-balance text-[1.14rem] sm:text-[1.24rem]">
                  <LocaleText map={localeMap(post, "description")} />
                </p>

                <div className="mx-auto mt-8 flex max-w-[42rem] flex-col items-center gap-4">
                  <p className="book-byline text-sm leading-none">
                    Nguyễn Thị Yến Nhi
                  </p>
                  <p className="book-meta flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[0.72rem]">
                    <time className="inline-flex items-center gap-1.5" dateTime={post.date as string}>
                      <CalendarDays size={14} />
                      <LocalDate date={post.date as string} />
                    </time>
                    <span className="opacity-35">/</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={14} />
                      <ReadingTimeLabel readingTime={post.readingTime} i18n={post.i18n} />
                    </span>
                    <span className="opacity-35">/</span>
                    <ViewCounter slug={slug} />
                  </p>
                </div>
              </header>

              <div className="mt-10">
                <BlogCoverImage
                  src={cover.src}
                  alt={cover.alt}
                  tags={post.tags}
                  aspect="16/9"
                  priority
                  sizes="(max-width: 768px) 100vw, 760px"
                />
              </div>

              <div className="mt-12 sm:mt-14">
                <ArticleI18n bodies={bodies} />
              </div>
            </FadeIn>

            {post.tags && post.tags.length > 0 && (
              <FadeIn className="mt-16 border-t border-border/50 pt-8">
                <p className="mb-3 text-[11px] font-semibold uppercase text-muted-foreground/60">
                  <T k="blogPage.topics" />
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/?tag=${encodeURIComponent(tag)}`}
                      className="rounded-full border border-border/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                    >
                      <TagLabel tag={tag} />
                    </Link>
                  ))}
                </div>
              </FadeIn>
            )}

            {relatedPosts.length > 0 && (
              <FadeIn className="mt-12 border-t border-border/50 pt-8">
                <p className="mb-2 text-[11px] font-semibold uppercase text-muted-foreground/60">
                  <T k="blogPage.more_to_read" />
                </p>
                <div>
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="group flex items-start justify-between gap-5 border-b border-border/40 py-5 transition-colors hover:border-primary/25"
                    >
                      <span className="min-w-0">
                        {related.tags?.[0] && (
                          <span className="text-[10px] font-medium uppercase text-muted-foreground/60">
                            <TagLabel tag={related.tags[0]} />
                          </span>
                        )}
                        <span className="mt-1 block text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                          <LocaleText map={localeMap(related, "title")} />
                        </span>
                        <span className="mt-2 block text-xs text-muted-foreground/70">
                          <LocalDate date={related.date} />
                        </span>
                      </span>
                      <ChevronRight
                        size={17}
                        className="mt-1 shrink-0 text-muted-foreground/45 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                      />
                    </Link>
                  ))}
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
