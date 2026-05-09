import type { Metadata } from "next";
import { CertificatesClient } from "./CertificatesClient";

export const metadata: Metadata = {
  title: "Certificates | Yen Nhi",
  description: "Certifications and achievements in software engineering, mobile development, and security.",
};

export default function CertificatesPage() {
  return <CertificatesClient />;
}
