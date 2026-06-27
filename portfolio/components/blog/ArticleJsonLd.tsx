import { SITE_CONFIG } from "@/lib/constants";

interface ArticleJsonLdProps {
  slug: string;
  title: string;
  description: string;
  /** ISO date string from the post frontmatter, e.g. "2026-06-26". */
  date: string;
  tags?: string[];
  /** Absolute URL of the post's social/preview image (1200×630). */
  image: string;
  /** BCP-47 language of the headline/description shown to search engines. */
  lang?: string;
}

/**
 * Per-article structured data (schema.org BlogPosting + BreadcrumbList).
 *
 * This is what lets Google read each post as a first-class article — author,
 * publish date, image, breadcrumb trail — and become eligible for rich results
 * in Search and Discover. It renders as a plain <script> into the static HTML,
 * so it ships with the export: no client JS, no third-party service, no cost.
 *
 * The author/publisher reference the Person node defined once in the root
 * layout (@id ".../#person"); Google merges nodes by @id across the page.
 */
export function ArticleJsonLd({ slug, title, description, date, tags, image, lang = "en" }: ArticleJsonLdProps) {
  const base = SITE_CONFIG.url;
  const url = `${base}/blog/${slug}`;
  // Google caps the headline it will use at ~110 characters.
  const headline = title.length > 110 ? `${title.slice(0, 107)}…` : title;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
        headline,
        description,
        datePublished: date,
        dateModified: date,
        inLanguage: lang,
        image: [image],
        author: {
          "@type": "Person",
          "@id": `${base}/#person`,
          name: SITE_CONFIG.fullName,
          url: base,
        },
        publisher: { "@id": `${base}/#person` },
        isPartOf: {
          "@type": "Blog",
          "@id": `${base}/blog#blog`,
          name: `${SITE_CONFIG.fullName} — Blog`,
        },
        ...(tags && tags.length > 0 ? { keywords: tags.join(", ") } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: base },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
          { "@type": "ListItem", position: 3, name: headline, item: url },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
