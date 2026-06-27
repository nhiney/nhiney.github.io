import fs from "fs";
import path from "path";
import { getBlogImageMeta } from "@/lib/blog-image-prompt.mjs";

// SERVER-ONLY: touches the filesystem, so import this from server components /
// build scripts only — never from a "use client" module.

const PUBLIC_DIR = path.join(process.cwd(), "public");
const BLOG_IMG_DIR = path.join(PUBLIC_DIR, "images", "blog");
// Accept whatever format the generated/manual cover happens to be.
const EXTS = ["webp", "avif", "jpg", "jpeg", "png"] as const;

export interface BlogCover {
  /** Public src of an existing cover, or null when no file is present yet. */
  src: string | null;
  /** Natural alt text describing the illustration. */
  alt: string;
}

/**
 * Resolve a post's cover image.
 *
 * Priority: an explicit frontmatter `image` → a real file in public/images/blog
 * named after the slug → null. Returning null (instead of a guessed path) is
 * what lets the UI render a tasteful fallback instead of a broken image, so the
 * system is "ready": drop `<slug>.webp` into public/images/blog and it appears.
 */
export function resolveBlogCover(
  slug: string,
  title: string,
  tags: string[] = [],
  frontmatterImage?: string,
): BlogCover {
  const { imageAlt } = getBlogImageMeta(slug, title, tags);

  if (frontmatterImage) return { src: frontmatterImage, alt: imageAlt };

  for (const ext of EXTS) {
    if (fs.existsSync(path.join(BLOG_IMG_DIR, `${slug}.${ext}`))) {
      return { src: `/images/blog/${slug}.${ext}`, alt: imageAlt };
    }
  }
  return { src: null, alt: imageAlt };
}
