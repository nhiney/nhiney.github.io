import type { Metadata } from "next";
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
};

export default function Page() {
  return <Planner vault={vault} fontClass={font.className} />;
}
