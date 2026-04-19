export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  readingTime: string;
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
