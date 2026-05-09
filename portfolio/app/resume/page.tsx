import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { ResumeClient } from "./ResumeClient";

export const metadata: Metadata = {
  title: "Resume | Yen Nhi",
  description: `CV and resume of ${SITE_CONFIG.fullName} — Software Engineering student specialising in backend systems and security.`,
};

export default function ResumePage() {
  return <ResumeClient />;
}
