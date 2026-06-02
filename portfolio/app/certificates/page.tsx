import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { CertificatesClient } from "./CertificatesClient";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Verified certifications and achievements in software engineering, mobile development, and application security.",
  keywords: ["certificates", "software engineering certificate", "mobile development certification", "security certification", "Nguyen Thi Yen Nhi"],
  alternates: { canonical: "/certificates" },
  openGraph: {
    title: "Certificates — Nguyen Thi Yen Nhi",
    description: "Verified certifications and achievements in software engineering, mobile development, and application security.",
    url: `${SITE_CONFIG.url}/certificates`,
    images: [{ url: SITE_CONFIG.ogImages.certificates, width: 1200, height: 630, alt: "Certificates — Nguyen Thi Yen Nhi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Certificates — Nguyen Thi Yen Nhi",
    description: "Verified certifications and achievements in software engineering, mobile development, and application security.",
    images: [SITE_CONFIG.ogImages.certificates],
  },
};

export default function CertificatesPage() {
  return <CertificatesClient />;
}
