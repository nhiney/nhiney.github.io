import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_PATH = path.join(process.cwd(), "content");

export interface PostMetadata {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface Post extends PostMetadata {
  slug: string;
  content: string;
  readingTime: string;
}

export function getSlugs(type: "projects" | "blog") {
  const dir = path.join(CONTENT_PATH, type);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => /\.mdx?$/.test(file));
}

export async function getPostBySlug(type: "projects" | "blog", slug: string): Promise<Post | null> {
  const normalizedSlug = slug.replace(/\.mdx?$/, "");
  const filePath = path.join(CONTENT_PATH, type, `${normalizedSlug}.mdx`);

  if (!fs.existsSync(filePath)) {
    const mdPath = path.join(CONTENT_PATH, type, `${normalizedSlug}.md`);
    if (!fs.existsSync(mdPath)) return null;
  }

  const actualPath = fs.existsSync(filePath) ? filePath : path.join(CONTENT_PATH, type, `${normalizedSlug}.md`);
  const fileContent = fs.readFileSync(actualPath, "utf8");
  const { data, content } = matter(fileContent);

  return {
    slug: normalizedSlug,
    content,
    ...(data as PostMetadata),
    readingTime: readingTime(content).text,
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
