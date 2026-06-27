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

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getSlugs("projects");
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx?$/, ""),
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPostBySlug("projects", slug) as Post | null;

  if (!project) return {};

  const ogImage = `${SITE_CONFIG.url}/og/projects/${slug}.png`;

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: `${SITE_CONFIG.url}/projects/${slug}`,
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [{ url: ogImage, alt: project.title }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPostBySlug("projects", slug);

  if (!project) notFound();

  return (
    <Container>
      <Section className="py-20 md:py-28">
        <FadeIn>
          <div className="mb-10 flex flex-col space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {project.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <time dateTime={project.date as string}>{formatDate(project.date as string)}</time>
              <span>•</span>
              <span>{project.readingTime}</span>
            </div>
          </div>
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <MDXRemote source={project.content as string} components={components} />
          </div>
        </FadeIn>
      </Section>
    </Container>
  );
}
