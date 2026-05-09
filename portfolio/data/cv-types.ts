// ─── CV content types — shared between cv-en.ts and cv-vi.ts ─────────────────

export type Project = {
  title: string;
  role?: string;
  period: string;
  /** Short status pill rendered on the Projects page. Tone drives colour. */
  status: { label: string; tone: "shipped" | "ongoing" | "duration" };
  problem: string;
  contributions: string[];
  /** Measurable outcomes — Projects page only. */
  results: string[];
  tech: string;
  /** Tech stack split into individual pills for the Projects page. */
  techPills: string[];
  /** Optional repo link — defaults to the CV-level GitHub if absent. */
  github?: string;
};

export type SkillGroup = {
  category: string;
  items: string;
};

export type Certification = {
  title: string;
  period: string;
  source: string;
  items: { label: string; description: string }[];
};

export type EducationEntry = {
  school: string;
  location: string;
  degree: string;
  gpa: string;
  expected: string;
  notes: string[];
};

export type CVData = {
  name: string;
  contact: {
    phone: string;
    email: string;
    github:   { handle: string; url: string };
    linkedin: { handle: string; url: string };
  };
  summary: string[];
  skills: SkillGroup[];
  projects: Project[];
  github_note: string;
  education: EducationEntry[];
  certifications: Certification[];
  research: {
    title: string;
    period: string;
    source: string;
    description: string;
  };
};
