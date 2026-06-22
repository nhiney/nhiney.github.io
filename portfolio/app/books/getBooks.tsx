import { MDXRemote } from "next-mdx-remote/rsc";
import { components } from "@/components/mdx/MDXComponents";
import { getPostBySlug } from "@/lib/mdx";
import { LIBRARY_BOOKS } from "@/data/books";
import type { BookPage, LibBookFull } from "@/lib/library/types";
import { buildDeck } from "@/lib/library/pages";

// Build the full reading model for every curated book — joins the curated list
// with blog review content where a book links to one. Shared by /books and
// /books/[slug] so the data is identical.
export async function getLibraryBooks(): Promise<LibBookFull[]> {
  return Promise.all(
    LIBRARY_BOOKS.map(async (b): Promise<LibBookFull> => {
      const titles: Record<string, string> = { en: b.titleEn ?? b.title, vi: b.title };
      const descriptions: Record<string, string> = {};
      const bodies: Record<string, React.ReactNode> = {};
      // Raw review markdown per locale — kept only to seed the flipbook deck.
      const rawBodies: Record<string, string> = {};
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
            rawBodies[lang] = (v as { content: string }).content;
          }
          date = post.date;
          readingTime = post.readingTime;
          tags = post.tags ?? [];
        }
      }

      // Localized key points (en required by the data type; vi falls back to en).
      const keyPoints: Record<string, string[]> = {
        en: b.keyPoints?.en ?? [],
        vi: b.keyPoints?.vi ?? b.keyPoints?.en ?? [],
      };
      const coverNote: Record<string, string | undefined> = {
        en: b.coverNote?.en,
        vi: b.coverNote?.vi ?? b.coverNote?.en,
      };
      const readingPages: LibBookFull["readingPages"] = {
        en: b.readingPages?.en,
        vi: b.readingPages?.vi ?? b.readingPages?.en,
      };

      // Pre-build a flipbook deck per locale the reader might show. The union of
      // review locales + en + vi; unknown locales fall back to "en" at runtime.
      const deckLocales = new Set<string>(["en", "vi", ...Object.keys(rawBodies)]);
      const pages: Record<string, BookPage[]> = {};
      for (const loc of deckLocales) {
        const review = rawBodies[loc] ?? rawBodies.en;
        const points = keyPoints[loc] ?? keyPoints.en;
        const customPages = readingPages[loc] ?? readingPages.en;
        pages[loc] = buildDeck(review, points, customPages);
      }

      return {
        slug: b.slug,
        blogSlug: b.blogSlug,
        meta: b,
        enTitle: b.titleEn ?? b.title,
        titles,
        descriptions,
        bodies,
        keyPoints,
        coverNote,
        readingPages,
        pages,
        date,
        readingTime,
        tags,
      };
    })
  );
}
