import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { PortfolioClient } from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio | Yen Nhi",
  description: "Full engineering portfolio — projects, skills, GitHub stats, and background of Nguyen Thi Yen Nhi.",
};

export default async function PortfolioPage() {
  const allProjects = await getAllPosts("projects");
  const projects = allProjects.slice(0, 4);

  return <PortfolioClient projects={projects} />;
}
