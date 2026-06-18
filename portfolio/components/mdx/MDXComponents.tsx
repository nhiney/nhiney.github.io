import React, { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { highlightCode } from "@/lib/shiki";
import { cn } from "@/lib/utils";
import { KeyTakeaway } from "@/components/mdx/KeyTakeaway";

type LinkProps = ComponentPropsWithoutRef<"a">;
type ImageProps = ComponentPropsWithoutRef<typeof Image>;
type HeadingProps = ComponentPropsWithoutRef<"h1">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type PreProps = ComponentPropsWithoutRef<"pre">;

const CustomLink = ({ href, ...props }: LinkProps) => {
  if (href?.startsWith("/")) {
    return (
      <Link 
        href={href} 
        {...props} 
        className="text-zinc-600 underline dark:text-zinc-400"
      >
        {props.children}
      </Link>
    );
  }
  return (
    <a 
      target="_blank" 
      rel="noopener noreferrer" 
      href={href} 
      {...props} 
      className="text-zinc-600 underline dark:text-zinc-400" 
    />
  );
};

const CustomImage = ({ alt, ...props }: ImageProps) => (
  <Image alt={alt || ""} className="rounded-lg shadow-md" {...props} />
);

const Pre = async ({ children, ...props }: PreProps) => {
  // Use unknown then cast to child element type to avoid any
  const child = children as { props?: { children?: string; className?: string } };
  const code = child?.props?.children || "";
  const lang = child?.props?.className?.replace("language-", "") || "text";
  const highlighted = await highlightCode(code, lang);

  return (
    <pre 
      {...props} 
      className={cn("overflow-x-auto rounded-lg p-4 bg-zinc-950", props.className)} 
      dangerouslySetInnerHTML={{ __html: highlighted }} 
    />
  );
};

export const components = {
  h1: (props: HeadingProps) => (
    <h1 className="mb-4 mt-8 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2 className="mb-4 mt-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100" {...props} />
  ),
  h3: (props: HeadingProps) => (
    <h3 className="mb-4 mt-6 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100" {...props} />
  ),
  p: (props: ParagraphProps) => (
    <p className="mb-4 leading-7 text-zinc-700 dark:text-zinc-400" {...props} />
  ),
  ul: (props: ListProps) => (
    <ul className="mb-4 ml-6 list-disc text-zinc-700 dark:text-zinc-400" {...props} />
  ),
  ol: (props: ListProps) => (
    <ol className="mb-4 ml-6 list-decimal text-zinc-700 dark:text-zinc-400" {...props} />
  ),
  li: (props: ListItemProps) => <li className="mb-1" {...props} />,
  a: CustomLink,
  Image: CustomImage,
  pre: Pre,
  // Editorial building block authors can drop into any .mdx article.
  KeyTakeaway,
};
