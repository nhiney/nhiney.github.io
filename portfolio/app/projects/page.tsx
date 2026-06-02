import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { ProjectsClient } from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Projects",
  description: "Featured engineering projects — real-world apps built with Laravel, Flutter, ASP.NET & Oracle DB. What was broken, how I solved it, and what shipped.",
  keywords: ["software projects", "Laravel projects", "Flutter apps", "ASP.NET projects", "backend engineering", "Nguyen Thi Yen Nhi projects"],
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Nguyen Thi Yen Nhi",
    description: "Featured engineering projects — real-world apps built with Laravel, Flutter, ASP.NET & Oracle DB.",
    url: `${SITE_CONFIG.url}/projects`,
    images: [{ url: SITE_CONFIG.ogImages.projects, width: 1200, height: 630, alt: "Projects — Nguyen Thi Yen Nhi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Nguyen Thi Yen Nhi",
    description: "Featured engineering projects — real-world apps built with Laravel, Flutter, ASP.NET & Oracle DB.",
    images: [SITE_CONFIG.ogImages.projects],
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
