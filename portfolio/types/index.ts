export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  problem?: string;
  role?: string;
  impact?: string;
  github?: string;
  demo?: string;
}

export interface PostTranslation {
  title: string;
  description: string;
  content: string;
  readingTime: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  readingTime: string;
  /** Per-locale variants (keyed by language code, always includes "en"). */
  i18n?: Record<string, PostTranslation>;
  /** Resolved cover src (server-side); null when no image file exists yet. */
  coverImage?: string | null;
  /** Alt text for the cover illustration. */
  coverAlt?: string;
}

export interface ProjectFrontmatter extends PostFrontmatter {
  link?: string;
  github?: string;
}

export interface Project extends ProjectFrontmatter {
  slug: string;
  content: string;
  readingTime: string;
}
