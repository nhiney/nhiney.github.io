import { MetadataRoute } from "next";
import { getSlugs, getAllPosts } from "@/lib/mdx";
import { SITE_CONFIG } from "@/lib/constants";
import { LIBRARY_BOOKS } from "@/data/books";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  const now = new Date();

  const projectSlugs = getSlugs("projects");
  const projectUrls = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug.replace(/\.mdx?$/, "")}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Real publish dates so Google trusts the lastmod signal instead of a uniform
  // build timestamp; posts get a solid priority so they actually get crawled.
  const posts = await getAllPosts("blog");
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const bookUrls = LIBRARY_BOOKS.map((book) => ({
    url: `${baseUrl}/books/${book.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const staticUrls = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "monthly" as const, priority: 1.0 },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/resume`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/books`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/certificates`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/mind-map`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/waitlist`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.4 },
  ];

  return [...staticUrls, ...projectUrls, ...blogUrls, ...bookUrls];
}
