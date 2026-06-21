import { MDXRemote } from "next-mdx-remote/rsc";
import { components } from "@/components/mdx/MDXComponents";
import { getPostBySlug } from "@/lib/mdx";
import { LIBRARY_BOOKS } from "@/data/books";
import type { LibBookFull } from "@/lib/library/types";

// Build the full reading model for every curated book — joins the curated list
// with blog review content where a book links to one. Shared by /books and
// /books/[slug] so the data is identical.
export async function getLibraryBooks(): Promise<LibBookFull[]> {
  return Promise.all(
    LIBRARY_BOOKS.map(async (b): Promise<LibBookFull> => {
      const titles: Record<string, string> = { en: b.titleEn ?? b.title, vi: b.title };
      const descriptions: Record<string, string> = {};
      const bodies: Record<string, React.ReactNode> = {};
      let date = "";
      let readingTime = "";
      let tags: string[] = [];

      if (b.blogSlug) {
        const post = await getPostBySlug("blog", b.blogSlug);
        if (post) {
          const variants =
            post.i18n && post.i18n.en
              ? post.i18n
              : { en: { content: post.content, title: post.title, description: post.description } };
          for (const [lang, v] of Object.entries(variants)) {
            descriptions[lang] = (v as { description?: string }).description ?? post.description;
            bodies[lang] = <MDXRemote source={v.content} components={components} />;
          }
          date = post.date;
          readingTime = post.readingTime;
          tags = post.tags ?? [];
        }
      }

      return {
        slug: b.slug,
        blogSlug: b.blogSlug,
        meta: b,
        enTitle: b.titleEn ?? b.title,
        titles,
        descriptions,
        bodies,
        date,
        readingTime,
        tags,
      };
    })
  );
}
