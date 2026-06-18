import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { Post, PostFrontmatter, PostTranslation } from "@/types";

const CONTENT_PATH = path.join(process.cwd(), "content");

// Supported locales. "en" is the base file (slug.mdx); every other locale
// lives in a sibling file named slug.<locale>.mdx and is optional — missing
// translations simply fall back to English at render time.
const LOCALES = ["en", "vi", "ja", "zh", "es", "fr", "de", "ko", "ru", "pt"] as const;
const LOCALE_VARIANT_RE = new RegExp(`\\.(${LOCALES.join("|")})\\.mdx?$`);

export type { Post };

export function getSlugs(type: "projects" | "blog") {
  const dir = path.join(CONTENT_PATH, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file) && !LOCALE_VARIANT_RE.test(file));
}

// Read one locale variant of a post. Returns null when that file is absent.
function readVariant(
  type: "projects" | "blog",
  slug: string,
  locale: (typeof LOCALES)[number]
): PostTranslation | null {
  const fileName = locale === "en" ? `${slug}.mdx` : `${slug}.${locale}.mdx`;
  const mdxPath = path.join(CONTENT_PATH, type, fileName);
  const mdPath = mdxPath.replace(/\.mdx$/, ".md");
  const actualPath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;
  if (!actualPath) return null;

  const { data, content } = matter(fs.readFileSync(actualPath, "utf8"));
  const fm = data as PostFrontmatter;
  return {
    title: fm.title,
    description: fm.description,
    content,
    readingTime: readingTime(content).text,
  };
}

export async function getPostBySlug(
  type: "projects" | "blog",
  slug: string
): Promise<Post | null> {
  const normalizedSlug = slug.replace(/\.mdx?$/, "");

  // The English file is the canonical source — its frontmatter drives metadata.
  const basePath = path.join(CONTENT_PATH, type, `${normalizedSlug}.mdx`);
  const baseMdPath = path.join(CONTENT_PATH, type, `${normalizedSlug}.md`);
  if (!fs.existsSync(basePath) && !fs.existsSync(baseMdPath)) return null;

  const actualBase = fs.existsSync(basePath) ? basePath : baseMdPath;
  const { data, content } = matter(fs.readFileSync(actualBase, "utf8"));

  // Gather every available locale variant for client-side switching.
  const i18n: Record<string, PostTranslation> = {};
  for (const locale of LOCALES) {
    const variant = readVariant(type, normalizedSlug, locale);
    if (variant) i18n[locale] = variant;
  }

  return {
    slug: normalizedSlug,
    content,
    ...(data as PostFrontmatter),
    readingTime: readingTime(content).text,
    i18n,
  } as Post;
}

export async function getAllPosts(type: "projects" | "blog"): Promise<Post[]> {
  const slugs = getSlugs(type);
  const posts = await Promise.all(
    slugs.map(async (slug) => await getPostBySlug(type, slug))
  );

  return (posts.filter((post) => post !== null) as Post[]).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
