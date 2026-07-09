import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { ResumeClient } from "./ResumeClient";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume and CV for Nguyen Thi Yen Nhi, a Business Analyst with a Computer Science background in Ho Chi Minh City.",
  alternates: { canonical: "/resume" },
  openGraph: {
    title: "Resume — Nguyen Thi Yen Nhi",
    description:
      "Business Analyst resume covering requirements analysis, user stories, system flows, product documentation, and technical project delivery.",
    url: `${SITE_CONFIG.url}/resume`,
    type: "profile",
    images: [
      {
        url: SITE_CONFIG.ogImages.resume,
        secureUrl: SITE_CONFIG.ogImages.resume,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: `${SITE_CONFIG.fullName} — Business Analyst Resume`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume — Nguyen Thi Yen Nhi",
    description:
      "Business Analyst resume covering requirements analysis, user stories, system flows, product documentation, and technical project delivery.",
    images: [
      {
        url: SITE_CONFIG.ogImages.resume,
        alt: `${SITE_CONFIG.fullName} — Business Analyst Resume`,
      },
    ],
  },
};

export default function ResumePage() {
  return <ResumeClient />;
}
