import { MetadataRoute } from "next";
import { getSlugs } from "@/lib/mdx";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  const projectSlugs = getSlugs("projects");
  const projectUrls = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug.replace(/\.mdx?$/, "")}`,
    lastModified: new Date(),
  }));

  const blogSlugs = getSlugs("blog");
  const blogUrls = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug.replace(/\.mdx?$/, "")}`,
    lastModified: new Date(),
  }));

  const staticUrls = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/projects`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
  ];

  return [...staticUrls, ...projectUrls, ...blogUrls];
}
