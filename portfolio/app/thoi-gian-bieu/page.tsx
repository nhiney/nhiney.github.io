import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import vault from "./vault.json";
import { Planner } from "./Planner";

const font = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Unlisted page; its content ships only as an AES-GCM blob (vault.json) that the browser decrypts with a passphrase.
export const metadata: Metadata = {
  title: "Riêng tư",
  robots: { index: false, follow: false },
  // Own manifest so "Add to Home Screen" opens this page (the site manifest starts at "/").
  manifest: "/thoi-gian-bieu.webmanifest",
  appleWebApp: { capable: true, title: "Lịch 24h", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7ff" },
    { media: "(prefers-color-scheme: dark)", color: "#090e1b" },
  ],
};

export default function Page() {
  return <Planner vault={vault} fontClass={font.className} />;
}
