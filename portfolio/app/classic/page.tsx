import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { HomeClient } from "../HomeClient";

// Previous homepage design, preserved & viewable while the vibrant home is live.
// Kept out of search indexing — the canonical home is "/".
export const metadata: Metadata = {
  title: "Classic Home",
  description: "Previous homepage design.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/classic" },
};

export default async function ClassicHome() {
  const allPosts = await getAllPosts("blog");
  const latestPosts = allPosts.slice(0, 3);

  return <HomeClient projects={[]} latestPosts={latestPosts} />;
}
