import { getAllPosts } from "@/lib/mdx";
import { ProjectsClient } from "./ProjectsClient";

export const metadata = {
  title: "Projects | Yen Nhi",
  description: "Highlighting my experience across full-stack and backend development.",
};

export default async function ProjectsPage() {
  const projects = await getAllPosts("projects");
  return <ProjectsClient projects={projects} />;
}
