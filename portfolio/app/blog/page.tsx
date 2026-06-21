import { getAllPosts } from "@/lib/mdx";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BlogClient } from "./BlogClient";

export const metadata = {
  title: "Blog | Yen Nhi",
  description: "Reflections on youth, slow living, society, and the lessons I pick up along the way.",
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
