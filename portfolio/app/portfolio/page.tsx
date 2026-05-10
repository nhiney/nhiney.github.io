import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { PortfolioClient } from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio | Yen Nhi",
  description: "The bit of me that doesn't fit on a CV — engineering principles, working process, what I'm currently exploring, and what fuels the work beyond the code.",
};

export default async function PortfolioPage() {
  const allProjects = await getAllPosts("projects");
  const projects = allProjects.slice(0, 4);

  return <PortfolioClient projects={projects} />;
}
