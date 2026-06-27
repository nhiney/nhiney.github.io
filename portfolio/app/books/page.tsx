import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { getLibraryBooks } from "./getBooks";
import { LibraryClient } from "./LibraryClient";

export const metadata: Metadata = {
  title: "Books",
  description:
    "A galaxy of the books I've read, floating in 3D — drift around, pick one up, spin it, and read the reflection inside.",
  alternates: { canonical: "/books" },
  openGraph: {
    title: "Books — Nguyen Thi Yen Nhi",
    description: "A 3D galaxy of the books I've read. Drift around, spin a book, read the reflection.",
    url: `${SITE_CONFIG.url}/books`,
    type: "website",
    images: [
      {
        url: SITE_CONFIG.ogImages.books,
        secureUrl: SITE_CONFIG.ogImages.books,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Books — Nguyen Thi Yen Nhi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Books — Nguyen Thi Yen Nhi",
    description: "A 3D galaxy of the books I've read. Drift around, spin a book, read the reflection.",
    images: [SITE_CONFIG.ogImages.books],
  },
};

export default async function BooksPage() {
  const books = await getLibraryBooks();
  return <LibraryClient books={books} />;
}
