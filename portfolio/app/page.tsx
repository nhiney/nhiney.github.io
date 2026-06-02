import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { SITE_CONFIG } from "@/lib/constants";
import { HomeClient } from "./HomeClient";

// Homepage gets explicit metadata so it overrides layout defaults precisely.
// title omitted → Next.js uses layout's `default` value (correct behaviour).
export const metadata: Metadata = {
  description: SITE_CONFIG.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    images: [{
      url: SITE_CONFIG.ogImages.home,
      secureUrl: SITE_CONFIG.ogImages.home,
      width: 1200,
      height: 630,
      type: "image/png",
      alt: `${SITE_CONFIG.fullName} — Software Engineer & Flutter Developer`,
    }],
  },
  twitter: {
    card: "summary_large_image",
    images: [{
      url: SITE_CONFIG.ogImages.home,
      alt: `${SITE_CONFIG.fullName} — Software Engineer`,
    }],
  },
};

export default async function Home() {
  const allProjects = await getAllPosts("projects");
  const projects = allProjects.slice(0, 4); // Show top 4 projects

  return <HomeClient projects={projects} />;
}
