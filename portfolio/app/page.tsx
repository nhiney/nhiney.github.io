"use client";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { HERO_CONTENT, SKILLS, EDUCATION_DATA, EXTRACURRICULAR_DATA, SITE_CONFIG } from "@/lib/constants";
import { Timeline } from "@/components/ui/Timeline";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

export default function Home() {
  return (
    <Container className="space-y-32 pb-32">
      {/* Hero Section - Inspired by clelia.dev */}
      <Section id="about" className="relative flex min-h-[90vh] flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(white,transparent_70%)] opacity-20" />
        
        <FadeIn className="relative z-10 flex flex-col items-center gap-10">
          <Badge variant="outline" className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]">
            {HERO_CONTENT.welcome}
          </Badge>
          
          <div className="space-y-6 max-w-4xl">
            <Heading variant="hero">
              {SITE_CONFIG.name}
            </Heading>
            <Heading as="h2" variant="title" className="text-zinc-400 font-medium">
              {HERO_CONTENT.roles[0]}
            </Heading>
          </div>

          <Text variant="large" className="max-w-2xl text-zinc-400 text-lg leading-relaxed">
            I am <span className="text-foreground font-semibold">{SITE_CONFIG.name}</span>, {HERO_CONTENT.description}
          </Text>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <Link
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-all hover:blue-glow hover:scale-105 active:scale-95"
            >
              Get to know my work <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#resume"
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-bold text-foreground transition-all hover:bg-muted/10 active:scale-95"
            >
              More About Me
            </Link>
          </div>

          <div className="flex gap-8 pt-12 items-center">
            <Link href={SITE_CONFIG.links.github} target="_blank" className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
              <GithubIcon />
            </Link>
            <Link href={SITE_CONFIG.links.linkedin} target="_blank" className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
              <LinkedinIcon />
            </Link>
            <Link href={SITE_CONFIG.links.facebook} target="_blank" className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
              <FacebookIcon />
            </Link>
            <Link href={`mailto:${SITE_CONFIG.links.email}`} className="text-muted-foreground hover:text-primary transition-all hover:scale-110">
              <MailIcon />
            </Link>
          </div>
        </FadeIn>

        {/* Floating Icons decoration */}
        <div className="absolute top-1/4 left-10 md:left-20 opacity-20 md:opacity-100 animate-bounce [animation-duration:5s]">
          <span className="text-6xl md:text-8xl filter grayscale hover:grayscale-0 transition-all cursor-default">💻</span>
        </div>
        <div className="absolute top-1/3 right-10 md:right-20 opacity-20 md:opacity-100 animate-bounce [animation-duration:7s]">
          <span className="text-6xl md:text-8xl filter grayscale hover:grayscale-0 transition-all cursor-default">⚡️</span>
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-20 md:opacity-100 animate-pulse [animation-duration:4s]">
          <span className="text-5xl md:text-7xl filter grayscale hover:grayscale-0 transition-all cursor-default">🚀</span>
        </div>
      </Section>

      {/* Skills Section - Redesigned */}
      <Section className="space-y-20">
        <div className="text-center space-y-4">
          <Heading variant="section">Stack & Proficiency</Heading>
          <Heading variant="title">Tools of the trade</Heading>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {SKILLS.map((category, idx) => (
            <FadeIn key={category.category} delay={idx * 0.1} className="p-8 rounded-2xl bg-secondary/50 border border-border hover:border-primary/50 transition-colors group">
              <Heading variant="subtitle" className="mb-8">{category.category}</Heading>
              <div className="flex flex-wrap gap-3">
                {category.items.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-background/80 py-1 px-4 border-border/50 font-medium">
                    {skill}
                  </Badge>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Timeline Section */}
      <Section id="resume" className="grid gap-20 lg:grid-cols-2 lg:gap-32">
        <div className="space-y-16">
          <div className="space-y-4">
            <Heading variant="section">History</Heading>
            <Heading variant="title">Education</Heading>
          </div>
          <Timeline items={EDUCATION_DATA} />
        </div>
        <div className="space-y-16">
          <div className="space-y-4">
            <Heading variant="section">Community</Heading>
            <Heading variant="title">Extracurriculars</Heading>
          </div>
          <Timeline items={EXTRACURRICULAR_DATA} />
        </div>
      </Section>

      {/* Modern CTA Section */}
      <Section id="contact" className="relative group overflow-hidden rounded-[2rem] bg-secondary/30 border border-border px-8 py-24 md:px-24 text-center">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <FadeIn className="relative space-y-10 max-w-3xl mx-auto">
          <Heading variant="hero" className="text-4xl sm:text-6xl">
            Interested in my profile? Let&apos;s talk!
          </Heading>
          <Text variant="large">
            I&apos;m currently looking for internship opportunities where I can apply my backend engineering skills to real-world challenges.
          </Text>
          <div className="pt-4">
            <Link
              href={`mailto:${SITE_CONFIG.links.email}`}
              className="inline-flex rounded-full bg-primary px-16 py-6 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-2xl transition-all hover:scale-110 active:scale-95 blue-glow"
            >
              Send Message
            </Link>
          </div>
        </FadeIn>
      </Section>
    </Container>
  );
}
