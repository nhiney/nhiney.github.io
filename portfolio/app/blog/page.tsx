import { getAllPosts } from "@/lib/mdx";
import { resolveBlogCover } from "@/lib/blog-cover";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BlogClient } from "./BlogClient";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

// The route is not locale-prefixed, so the canonical metadata stays English.
// Client-side language switching still exposes Vietnamese content in the page.
export const metadata: Metadata = {
  title: "Blog - Reflections on youth, slow living, and learning",
  description:
    "Reflections on youth, slow living, society, and the lessons I pick up along the way.",
  keywords: [
    "personal blog",
    "youth reflections",
    "slow living",
    "self healing",
    "overthinking",
    "perfectionism",
    "self worth",
    SITE_CONFIG.fullName,
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog - Reflections on youth, slow living, and learning",
    description:
      "Reflections on youth, slow living, society, and the lessons I pick up along the way.",
    url: `${SITE_CONFIG.url}/blog`,
    type: "website",
    locale: "en_US",
    alternateLocale: ["vi_VN"],
    images: [
      {
        url: SITE_CONFIG.ogImages.blog,
        secureUrl: SITE_CONFIG.ogImages.blog,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Blog - reflections on youth, slow living, and learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Reflections on youth, slow living, and learning",
    description:
      "Reflections on youth, slow living, society, and the lessons I pick up along the way.",
    images: [SITE_CONFIG.ogImages.blog],
  },
};

// Book write-ups now live in the dedicated /books library (and stay reachable
// from there and by direct link). The blog is reserved for writing about life
// and the things I'm learning — so anything tagged "Books" is kept out of this
// listing.
const BOOK_TAG = "Books";

export default async function BlogPage() {
  // Attach the resolved cover (real file or null) server-side so the client
  // listing can render an image or a themed fallback without touching the fs.
  const posts = (await getAllPosts("blog"))
    .filter((post) => !post.tags?.includes(BOOK_TAG))
    .map((post) => {
      const cover = resolveBlogCover(post.slug, post.title, post.tags, post.image);
      return { ...post, coverImage: cover.src, coverAlt: cover.alt };
    });

  return (
    <Container className="pb-32">
      <Section className="pt-10">
        <BlogClient posts={posts} />
      </Section>
    </Container>
  );
}
