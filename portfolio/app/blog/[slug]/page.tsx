import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { components } from "@/components/mdx/MDXComponents";
import { getPostBySlug, getSlugs, Post } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { Metadata } from "next";

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
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug("blog", slug);

  if (!post) notFound();

  return (
    <Container>
      <Section className="py-20 md:py-28">
        <FadeIn>
          <div className="mb-10 flex flex-col space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-zinc-500">
              <time dateTime={post.date as string}>{formatDate(post.date as string)}</time>
              <span>•</span>
              <span>{post.readingTime}</span>
            </div>
          </div>
          <article className="prose prose-zinc dark:prose-invert max-w-none">
            <MDXRemote source={post.content as string} components={components} />
          </article>
        </FadeIn>
      </Section>
    </Container>
  );
}
