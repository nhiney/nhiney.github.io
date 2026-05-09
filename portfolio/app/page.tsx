import { getAllPosts } from "@/lib/mdx";
import { HomeClient } from "./HomeClient";

export default async function Home() {
  const allProjects = await getAllPosts("projects");
  const projects = allProjects.slice(0, 4); // Show top 4 projects

  return <HomeClient projects={projects} />;
}
