import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { PrivacyClient } from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy & Analytics",
  description:
    "Learn what optional analytics this portfolio uses and manage your analytics preference.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `Privacy & Analytics — ${SITE_CONFIG.fullName}`,
    description:
      "Learn what optional analytics this portfolio uses and manage your analytics preference.",
    url: `${SITE_CONFIG.url}/privacy`,
    type: "website",
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
