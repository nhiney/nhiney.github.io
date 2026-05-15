import { getAllPosts } from "@/lib/mdx";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog | Yen Nhi",
  description: "Sharing insights on backend architecture and security.",
};

export default async function BlogPage() {
  const posts = await getAllPosts("blog");

  return (
    <Container className="pb-32 space-y-24">
      <Section className="space-y-8 pt-8 text-center">
        <FadeIn className="space-y-6 flex flex-col items-center">
          <Badge variant="outline" className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]">
            Writings
          </Badge>
          <Heading variant="hero" as="h1">Latest Thoughts</Heading>
          <Text variant="large" className="max-w-2xl text-zinc-400">
            Diving deep into backend engineering, security protocols, and algorithmic art.
          </Text>
        </FadeIn>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 pt-12">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.1}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <div className="h-full flex flex-col p-10 rounded-3xl bg-secondary/30 border border-border hover:border-primary/50 transition-all hover:-translate-y-2 group">
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span className="flex items-center gap-2">
                        <Calendar size={12} className="text-primary" /> {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={12} className="text-primary" /> {post.readingTime}
                      </span>
                    </div>
                    
                    <Heading variant="subtitle" className="group-hover:text-foreground text-2xl leading-tight text-white transition-colors">
                      {post.title}
                    </Heading>
                    
                    <Text variant="small" className="line-clamp-3 text-zinc-400 leading-relaxed">
                      {post.description}
                    </Text>
                  </div>
                  
                  <div className="mt-10 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-primary border-t border-border/50 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Read Article</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>
    </Container>
  );
}
