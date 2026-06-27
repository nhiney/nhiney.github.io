import { getAllPosts } from "@/lib/mdx";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BlogClient } from "./BlogClient";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

// Audience is primarily Vietnamese — lead the listing metadata in Vietnamese so
// it surfaces for Vietnamese searches. The title is wrapped by the layout's
// "%s · Yen Nhi" template, so we intentionally omit the brand here.
export const metadata: Metadata = {
  title: "Blog — Nhật ký tuổi trẻ, sống chậm & chữa lành",
  description:
    "Những ghi chép về tuổi trẻ, sống chậm, xã hội và những bài học mình nhặt nhạnh trên đường đi — viết bằng giọng \"mình – bạn\", chân thật và gần gũi.",
  keywords: [
    "blog tiếng Việt",
    "blog tuổi trẻ",
    "sống chậm",
    "chữa lành",
    "overthinking",
    "cầu toàn",
    "tự ti",
    "bền bỉ",
    "Nguyễn Thị Yến Nhi",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Nhật ký tuổi trẻ, sống chậm & chữa lành",
    description:
      "Những ghi chép về tuổi trẻ, sống chậm, overthinking, tự trọng và những bài học mình nhặt nhạnh trên đường đi.",
    url: `${SITE_CONFIG.url}/blog`,
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: SITE_CONFIG.ogImages.blog,
        secureUrl: SITE_CONFIG.ogImages.blog,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Blog — Nhật ký tuổi trẻ, sống chậm & chữa lành",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Nhật ký tuổi trẻ, sống chậm & chữa lành",
    description:
      "Những ghi chép về tuổi trẻ, sống chậm, overthinking, tự trọng và những bài học mình nhặt nhạnh trên đường đi.",
    images: [SITE_CONFIG.ogImages.blog],
  },
};

// Book write-ups now live in the dedicated /books library (and stay reachable
// from there and by direct link). The blog is reserved for writing about life
// and the things I'm learning — so anything tagged "Books" is kept out of this
// listing.
const BOOK_TAG = "Books";

export default async function BlogPage() {
  const posts = (await getAllPosts("blog")).filter(
    (post) => !post.tags?.includes(BOOK_TAG)
  );

  return (
    <Container className="pb-32">
      <Section className="pt-10">
        <BlogClient posts={posts} />
      </Section>
    </Container>
  );
}
