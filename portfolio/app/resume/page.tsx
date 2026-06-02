import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { ResumeClient } from "./ResumeClient";

export const metadata: Metadata = {
  title: "Resume",
  description: `CV and resume of ${SITE_CONFIG.fullName} — Software Engineering student specialising in backend systems, database architecture, and application security.`,
  keywords: ["resume", "CV", "software engineer CV", "backend developer resume", "Nguyen Thi Yen Nhi CV"],
  alternates: { canonical: "/resume" },
  openGraph: {
    title: "Resume — Nguyen Thi Yen Nhi",
    description: `CV of ${SITE_CONFIG.fullName} — Software Engineering student specialising in backend systems, database architecture, and application security.`,
    url: `${SITE_CONFIG.url}/resume`,
    images: [{ url: SITE_CONFIG.ogImages.resume, width: 1200, height: 630, alt: "Resume — Nguyen Thi Yen Nhi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume — Nguyen Thi Yen Nhi",
    description: `CV of ${SITE_CONFIG.fullName} — Software Engineering student specialising in backend systems and security.`,
    images: [SITE_CONFIG.ogImages.resume],
  },
};

export default function ResumePage() {
  return <ResumeClient />;
}
