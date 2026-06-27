import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { LIBRARY_BOOKS } from "@/data/books";
import { getLibraryBooks } from "../getBooks";
import { LibraryClient } from "../LibraryClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return LIBRARY_BOOKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = LIBRARY_BOOKS.find((x) => x.slug === slug);
  if (!b) return {};
  const title = `${b.title} — ${b.author}`;
  const description = `${b.title} by ${b.author} — reading notes and reflection.`;
  const ogImage = `${SITE_CONFIG.url}/og/books/${slug}.png`;

  return {
    title: b.title,
    description,
    alternates: { canonical: `/books/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}/books/${slug}`,
      type: "book",
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

// Same galaxy, but opened straight to this book — a real, shareable URL.
export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!LIBRARY_BOOKS.some((b) => b.slug === slug)) notFound();
  const books = await getLibraryBooks();
  return <LibraryClient books={books} initialSlug={slug} />;
}
