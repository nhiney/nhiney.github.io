import { getAllPosts } from "@/lib/mdx";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Projects | Yen Nhi",
  description: "Highlighting my experience across full-stack and backend development.",
};

export default async function ProjectsPage() {
  const projects = await getAllPosts("projects");

  return (
    <Container className="pb-32 space-y-24">
      <Section className="space-y-12 pt-20 text-center">
        <FadeIn className="space-y-6 flex flex-col items-center">
          <Badge variant="outline" className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]">
            Portfolio
          </Badge>
          <Heading variant="hero" as="h1">Selected Works</Heading>
          <Text variant="large" className="max-w-2xl text-zinc-400">
            A collection of technical projects focused on backend architecture, security, and scalable system design.
          </Text>
        </FadeIn>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 pt-12">
          {projects.map((project, i) => (
            <FadeIn key={project.slug} delay={i * 0.1}>
              <Link href={`/projects/${project.slug}`} className="group block h-full">
                <div className="h-full flex flex-col p-8 rounded-2xl bg-secondary/30 border border-border hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-95 group">
                  <div className="space-y-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <span className="text-xl font-bold">{project.title[0]}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] opacity-50 uppercase tracking-tighter">
                        {project.date?.toString().split('-')[0]}
                      </Badge>
                    </div>
                    
                    <Heading variant="subtitle" className="group-hover:text-primary transition-colors text-xl">
                      {project.title}
                    </Heading>
                    
                    <Text variant="small" className="line-clamp-3 text-zinc-400">
                      {project.description}
                    </Text>
                    
                    <div className="flex flex-wrap gap-2 pt-4">
                      {project.tags?.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary group-hover:gap-4 transition-all border-t border-border/50 pt-6">
                    Read Case Study <ArrowRight size={14} />
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
