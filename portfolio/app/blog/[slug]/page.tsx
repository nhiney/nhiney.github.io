import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ChevronRight } from "lucide-react";
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
import { LocaleText } from "@/components/blog/LocaleText";
import { TagLabel } from "@/components/blog/TagLabel";
import { LocalDate } from "@/components/blog/LocalDate";
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

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${SITE_CONFIG.url}/blog/${slug}`,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug("blog", slug);

  if (!post) notFound();

  const allPosts = await getAllPosts("blog");
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug && p.tags?.some((t: string) => post.tags?.includes(t)))
    .slice(0, 2);

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

  return (
    <>
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="relative mx-auto max-w-[55rem]">

          {/* Marginalia — the table of contents sits in the left gutter on wide
              screens, like pencilled notes in the margin of a book. */}
          <aside className="pointer-events-none absolute right-full top-0 hidden h-full pr-10 xl:block">
            <div className="pointer-events-auto sticky top-28 w-52">
              <TableOfContents />
            </div>
          </aside>

          {/* Back to the shelf */}
          <FadeIn>
            <Link
              href="/blog"
              className="group mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
              <T k="blogPage.back_to_all" />
            </Link>
          </FadeIn>

          {/* The printed page — a warm paper sheet resting on the desk */}
          <FadeIn
            delay={0.05}
            className="book-page px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20"
          >
            {/* Frontispiece — centred like a book's title page */}
            <header className="mx-auto max-w-2xl text-center">
              {post.tags?.[0] && (
                <p className="book-kicker mb-6">
                  <TagLabel tag={post.tags[0]} />
                </p>
              )}

              <h1 className="book-title text-[clamp(2rem,1.1rem+3vw,3rem)]">
                <LocaleText map={localeMap(post, "title")} />
              </h1>

              <div className="mt-8 flex flex-col items-center gap-4">
                <span className="book-rule w-12" />
                <p className="book-byline text-[1.4rem] leading-none">
                  Nguyễn Thị Yến Nhi
                </p>
                <p className="book-meta flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.7rem] uppercase">
                  <time dateTime={post.date as string}>
                    <LocalDate date={post.date as string} />
                  </time>
                  <span className="opacity-40">·</span>
                  <span>{post.readingTime}</span>
                  <span className="opacity-40">·</span>
                  <ViewCounter slug={slug} />
                </p>
              </div>

              <p className="book-lead mx-auto mt-8 max-w-xl text-balance text-lg">
                <LocaleText map={localeMap(post, "description")} />
              </p>
            </header>

            {/* A quiet flourish before the story opens */}
            <div className="mx-auto my-12 flex max-w-2xl items-center gap-4">
              <span className="book-rule flex-1" />
              <span className="book-endmark text-sm">❦</span>
              <span className="book-rule flex-1" />
            </div>

            {/* Cover plate, when the post carries one */}
            {post.image && (
              <div className="relative mx-auto mb-12 aspect-video max-w-2xl overflow-hidden rounded-[2px] border border-border/40">
                <Image src={post.image} alt={post.title} fill className="object-cover" priority />
              </div>
            )}

            {/* The article body — serif prose with drop cap & pull-quotes */}
            <ArticleI18n bodies={bodies} />

            {/* End mark — closing the book */}
            <div className="book-endmark mt-16 text-center text-base">❦ ❦ ❦</div>
          </FadeIn>

          {/* On the same shelf — related reads, back on the desk */}
          {relatedPosts.length > 0 && (
            <FadeIn className="mx-auto mt-14 max-w-2xl">
              <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground/60">
                <T k="blogPage.more_to_read" />
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group block rounded-lg border border-border/50 bg-card/40 p-5 transition-colors hover:border-border hover:bg-secondary/40"
                  >
                    {related.tags?.[0] && (
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/60">
                        <TagLabel tag={related.tags[0]} />
                      </span>
                    )}
                    <h4 className="mt-2 font-serif text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
                      <LocaleText map={localeMap(related, "title")} />
                    </h4>
                    <span className="mt-3 flex items-center gap-1 text-xs text-muted-foreground/70">
                      <LocalDate date={related.date} />
                      <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </Container>
    </>
  );
}

