import type { Metadata } from "next";
import { VibrantClient } from "./VibrantClient";

// Standalone concept showcase — vibrant claymorphism / Pinterest-3D aesthetic.
// Kept out of search indexing; it's a design demo, not part of the live site.
export const metadata: Metadata = {
  title: "Vibrant Concept",
  description: "A playful claymorphism / Pinterest-style concept showcase — pinned certificates, book-cover projects, and floating 3D decor.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/vibrant" },
};

export default function VibrantPage() {
  return <VibrantClient />;
}
