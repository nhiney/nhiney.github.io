import { getAllPosts } from "@/lib/mdx";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BlogClient } from "./BlogClient";

export const metadata = {
  title: "Blog | Yen Nhi",
  description: "Reflections on youth, slow living, society, and the books that shape how I see the world.",
};

export default async function BlogPage() {
  const posts = await getAllPosts("blog");

  return (
    <Container className="pb-32">
      <Section className="pt-10">
        <BlogClient posts={posts} />
      </Section>
    </Container>
  );
}
