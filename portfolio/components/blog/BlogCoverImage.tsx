"use client";

import Image from "next/image";
import { pickSceneKey } from "@/lib/blog-image-prompt.mjs";
import { BlogCoverArt } from "@/components/blog/BlogCoverArt";
import { cn } from "@/lib/utils";

// Soft, on-brand background tints chosen by the post's primary theme. Paired
// with the themed line-art scene, the placeholder reads as an intentional
// illustrated cover — never a broken-image box.
const GRADIENTS: Record<string, string> = {
  writing: "from-amber-50 to-orange-100/60 dark:from-amber-950/30 dark:to-orange-950/20",
  self:    "from-rose-50 to-pink-100/55 dark:from-rose-950/30 dark:to-pink-950/20",
  slow:    "from-emerald-50 to-teal-100/50 dark:from-emerald-950/30 dark:to-teal-950/20",
  tech:    "from-slate-100 to-zinc-200/60 dark:from-slate-900/40 dark:to-zinc-900/30",
  books:   "from-amber-50 to-yellow-100/50 dark:from-amber-950/30 dark:to-yellow-950/15",
  default: "from-stone-100 to-neutral-200/60 dark:from-stone-900/40 dark:to-neutral-900/30",
};

const TAG_TO_TINT: Record<string, keyof typeof GRADIENTS> = {
  Discipline: "writing", Habits: "writing", Consistency: "writing", Focus: "writing",
  Creativity: "writing", Work: "writing", Money: "writing", Letter: "writing", Communication: "writing",
  "Self Worth": "self", Healing: "self", "Self Compassion": "self", Rest: "self", Comparison: "self", Identity: "self",
  "Slow Living": "slow", Mindfulness: "slow", "Letting Go": "slow", Growth: "slow", Solitude: "slow",
  Patience: "slow", Silence: "slow",
  Technology: "tech", "Imposter Syndrome": "tech", Minimalism: "tech",
  Books: "books", Learning: "books", Reflection: "books",
};

function tintFor(tags: string[] = []): string {
  for (const tag of tags) {
    const key = TAG_TO_TINT[tag];
    if (key) return GRADIENTS[key];
  }
  return GRADIENTS.default;
}

interface BlogCoverImageProps {
  /** Existing cover src, or null/undefined to show the themed illustration. */
  src?: string | null;
  alt: string;
  tags?: string[];
  /** CSS aspect ratio for the frame, e.g. "16/9" (default) or "4/3". */
  aspect?: string;
  /** Eager-load above-the-fold (article hero); list items stay lazy. */
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Reusable blog illustration. Renders a real cover when one exists, otherwise a
 * themed line-art scene that matches the article's topic — same size either way,
 * so the layout never shifts and a missing file never shows a broken image.
 */
export function BlogCoverImage({
  src,
  alt,
  tags = [],
  aspect = "16/9",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 720px",
  className,
}: BlogCoverImageProps) {
  const frame = cn(
    "relative w-full overflow-hidden rounded-xl border border-border/40 bg-muted/30",
    className,
  );

  if (src) {
    return (
      <div className={frame} style={{ aspectRatio: aspect }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(frame, "bg-gradient-to-br", tintFor(tags))}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={alt}
    >
      <BlogCoverArt
        scene={pickSceneKey(tags)}
        className="text-foreground/30 dark:text-foreground/25"
      />
      {/* soft top highlight for a little depth */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent dark:from-white/5" />
    </div>
  );
}
