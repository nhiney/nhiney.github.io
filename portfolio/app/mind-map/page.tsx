import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AppleTreeMindMap } from "@/components/sections/AppleTree";
import { KNOWLEDGE_NOTES } from "@/lib/knowledge-notes";

const PAGE_URL = `${SITE_CONFIG.url}/mind-map`;

// Structured data (@graph) so search engines & AI can attribute the content to
// the author and read every note directly — surfacing the page for related queries.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${PAGE_URL}#page`,
      name: `Knowledge Mind Map — ${SITE_CONFIG.fullName}`,
      description:
        "A knowledge garden of lessons and insights from books, code, design and life, mapped as an interactive mind map.",
      url: PAGE_URL,
      inLanguage: "en",
      isPartOf: { "@type": "WebSite", name: SITE_CONFIG.fullName, url: SITE_CONFIG.url },
      author: { "@id": `${SITE_CONFIG.url}/#person` },
      about: ["Books", "Software Engineering", "UI Design", "Personal Growth"],
      primaryImageOfPage: SITE_CONFIG.ogImages.home,
    },
    {
      "@type": "Person",
      "@id": `${SITE_CONFIG.url}/#person`,
      name: SITE_CONFIG.fullName,
      alternateName: "Nguyễn Thị Yến Nhi",
      url: SITE_CONFIG.url,
      jobTitle: "Business Analyst",
      knowsAbout: [
        "Business Analysis",
        "Software Engineering",
        "Requirements Analysis",
        "UI Design",
        "Product Thinking",
      ],
      sameAs: [SITE_CONFIG.links.github, SITE_CONFIG.links.linkedin],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
        { "@type": "ListItem", position: 2, name: "Mind Map", item: PAGE_URL },
      ],
    },
    {
      "@type": "ItemList",
      name: `Knowledge Map — ${SITE_CONFIG.fullName}`,
      description:
        "Core lessons and insights, branching from four domains: Books, Code, Design and Life.",
      url: PAGE_URL,
      numberOfItems: KNOWLEDGE_NOTES.length,
      itemListElement: KNOWLEDGE_NOTES.map((note, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: note.title,
          headline: note.title,
          about: note.tags,
          keywords: note.tags.join(", "),
          isPartOf: note.source,
          author: { "@id": `${SITE_CONFIG.url}/#person` },
          text: note.excerpt + (note.reflection ? ` — ${note.reflection}` : ""),
        },
      })),
    },
  ],
};

export const metadata: Metadata = {
  title: "Mind Map",
  description: `Knowledge Garden of ${SITE_CONFIG.fullName} — notes and insights collected from books, code, design and life, mapped as an interactive mind map.`,
  keywords: [
    "mind map",
    "knowledge garden",
    "digital garden",
    "reading notes",
    "engineering principles",
    "Business Analyst",
    "Nguyen Thi Yen Nhi",
    "Nguyễn Thị Yến Nhi",
  ],
  alternates: { canonical: "/mind-map" },
  openGraph: {
    title: "Mind Map — Nguyen Thi Yen Nhi",
    description:
      "Knowledge Garden — notes and insights collected from books, code, design and life, mapped as an interactive mind map.",
    url: PAGE_URL,
    images: [{ url: SITE_CONFIG.ogImages.home, width: 1200, height: 630, alt: "Mind Map — Nguyen Thi Yen Nhi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mind Map — Nguyen Thi Yen Nhi",
    description: "Knowledge Garden — notes and insights collected from books, code, design and life.",
    images: [SITE_CONFIG.ogImages.home],
  },
};

export default function MindMapPage() {
  return (
    <Container className="pb-32 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section>
        <AppleTreeMindMap />
      </Section>
    </Container>
  );
}
