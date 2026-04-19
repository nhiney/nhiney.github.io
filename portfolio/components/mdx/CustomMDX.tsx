import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import { Heading } from "@/components/ui/Heading";
import { Text as TextPrimitive } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import React from "react";

const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading variant="hero" as="h1" className={cn("mt-12 mb-6", className)} {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading variant="title" as="h2" className={cn("mt-12 mb-6", className)} {...props} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading variant="subtitle" as="h3" className={cn("mt-8 mb-4", className)} {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <TextPrimitive className={cn("mb-6 text-zinc-400 leading-relaxed", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("list-disc mb-6 pl-6 space-y-2 text-zinc-400", className)} {...props} />
  ),
  li: ({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className={cn("leading-relaxed", className)} {...props} />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className={cn("bg-zinc-800 text-zinc-200 px-2 rounded font-mono text-sm", className)} {...props} />
  ),
  Badge,
  Card,
};

interface CustomMDXProps {
  source: MDXRemoteProps["source"];
  components?: MDXRemoteProps["components"];
}

export function CustomMDX({ source, components: userComponents }: CustomMDXProps) {
  return (
    <MDXRemote
      source={source}
      components={{ ...components, ...(userComponents || {}) }}
    />
  );
}
