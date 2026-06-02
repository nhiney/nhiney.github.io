import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { SITE_CONFIG } from "@/lib/constants";
import { PortfolioClient } from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "The bit of me that doesn't fit on a CV — engineering principles, working process, what I'm currently exploring, and what fuels the work beyond the code.",
  keywords: ["portfolio", "engineering portfolio", "software projects", "backend systems", "Nguyen Thi Yen Nhi portfolio"],
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio — Nguyen Thi Yen Nhi",
    description: "Engineering principles, working process, and what fuels the work beyond the code.",
    url: `${SITE_CONFIG.url}/portfolio`,
    images: [{ url: SITE_CONFIG.ogImages.portfolio, width: 1200, height: 630, alt: "Portfolio — Nguyen Thi Yen Nhi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio — Nguyen Thi Yen Nhi",
    description: "Engineering principles, working process, and what fuels the work beyond the code.",
    images: [SITE_CONFIG.ogImages.portfolio],
  },
};

export default async function PortfolioPage() {
  const allProjects = await getAllPosts("projects");
  const projects = allProjects.slice(0, 4);

  return <PortfolioClient projects={projects} />;
}
