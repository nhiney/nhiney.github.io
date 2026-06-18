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
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1.0 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/certificates`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/mind-map`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/waitlist`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.4 },
  ];

  return [...staticUrls, ...projectUrls, ...blogUrls];
}
