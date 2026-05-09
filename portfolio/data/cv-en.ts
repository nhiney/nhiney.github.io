// ─── English CV content (extracted from public/cv.pdf) ───────────────────────

import type { CVData } from "./cv-types";

export const CV_EN: CVData = {
  name: "Nguyen Thi Yen Nhi",
  contact: {
    phone: "(+84) 326-583-876",
    email: "nhiyen.engineer@gmail.com",
    github:   { handle: "nhiney",      url: "https://github.com/nhiney"        },
    linkedin: { handle: "nhi-yen-0906", url: "https://linkedin.com/in/nhi-yen-0906" },
  },
  summary: [
    "Third-year IT student (GPA 3.34/4.0, expected 2027) with a product mindset — experienced in identifying user pain points, defining requirements, and guiding technical teams to ship solutions.",
    "Led mobile app development end-to-end: from user research and Figma wireframing to sprint coordination and real-device validation, across a 4-member academic team.",
    "Completed Google Project Management Professional Certificate; applied Agile task decomposition and sprint tracking in academic projects.",
    "Leverages AI tools (Claude, ChatGPT, Cursor, Whimsical) to accelerate product documentation, prototyping, and workflow design across academic assignments.",
  ],
  skills: [
    { category: "Product & Design",     items: "Figma (wireframing, user flow), Whimsical, User Research, Requirement Analysis, User Story Writing" },
    { category: "Project Management",   items: "Agile/Scrum, Sprint Planning, Task Decomposition, Stakeholder Communication" },
    { category: "Technical Literacy",   items: "Flutter/Dart, .NET MVC (C#), Python, Firebase, SQL Server, Git/GitHub, REST APIs" },
    { category: "AI & Data",            items: "Prompt Engineering, AI Workflow Design, SQL (data queries), ChatGPT, Claude, Cursor" },
    { category: "Soft Skills",          items: "Team Leadership, Critical Thinking, Structured Communication, Problem-Solving" },
  ],
  projects: [
    {
      title:  "Smart Medical Booking App",
      role:   "Team Leader & Core Developer",
      period: "Feb 2026 – Present",
      status: { label: "In progress", tone: "ongoing" },
      problem:
        "Healthcare scheduling in Vietnam lacks real-time conflict prevention and is inaccessible to elderly and non-tech users — causing double-bookings, appointment confusion, and low self-service adoption among at-risk demographics.",
      contributions: [
        "Conducted user surveys and Figma wireframing to identify friction in the booking flow; surfaced voice interaction as a critical accessibility need for elderly users — drove the decision to build a voice-assisted booking feature.",
        "Defined 3 user personas (Patient, Doctor, Admin) with distinct workflows, translating them into RBAC requirements enforced via Firebase Authentication.",
        "Designed Firestore data models for scalable query performance, then specified real-time conflict-prevention logic using Firebase Transactions — preventing double-booking scenarios at the data layer.",
        "Led a 4-member team: decomposed features into sprint tasks, tracked delivery milestones, and aligned technical output with product requirements.",
        "Designed 100+ manual test scenarios to validate core booking flows; deployed and tested on real mobile devices to surface environment-specific defects beyond emulator coverage.",
        "Integrated Google Maps API for location-based clinic discovery to reduce drop-off at the selection step.",
      ],
      results: [
        "Eliminated double-booking at the data layer via Firebase Transactions",
        "Voice-assisted flow opens the app to elderly / non-tech users",
        "100+ manual test scenarios passing on real devices",
        "4-member team delivering on a tracked sprint cadence",
      ],
      tech: "Flutter, Dart, Firebase (Firestore, Auth, Cloud Functions), Google Maps API, Figma",
      techPills: ["Flutter", "Dart", "Firebase", "Google Maps API", "Figma"],
    },
    {
      title:  "E-Commerce Shoe Shop System",
      role:   "Team Leader & Core Developer",
      period: "Dec 2025",
      status: { label: "Shipped in 1 month", tone: "duration" },
      problem:
        "Manual inventory tracking caused stockout errors and delayed order responses; no self-service support channel existed, creating unnecessary friction for customers.",
      contributions: [
        "Led a 3-member team; translated business requirements into technical specifications using MVC architecture to separate concerns and reduce integration friction.",
        "Identified inventory inconsistency as the core operational pain point → automated stock updates via SQL Triggers and Stored Procedures, enforcing ACID properties and eliminating manual tracking errors.",
        "Reduced customer support load by integrating a lightweight AI chatbot to handle common inquiries at scale.",
        "Improved perceived UX responsiveness by applying AJAX to eliminate disruptive full-page reloads.",
      ],
      results: [
        "Stockout errors removed via automated SQL Triggers + Stored Procedures",
        "Customer support load cut by handling common queries through an AI chatbot",
        "Snappier UX after replacing full-page reloads with targeted AJAX calls",
        "Clean MVC separation made the codebase easy for the 3-person team to extend",
      ],
      tech: "ASP.NET MVC, C#, SQL Server, JavaScript",
      techPills: ["ASP.NET MVC", "C#", "SQL Server", "JavaScript"],
    },
    {
      title:  "English Vocabulary Learning App",
      period: "Jun 2025",
      status: { label: "9.5 / 10 final score", tone: "shipped" },
      problem:
        "Manual flashcard methods kept losing user data and serving stale content — there was no lightweight desktop tool that combined fresh definitions with reliable persistence for learners.",
      contributions: [
        "Designed 5+ UI screens with Tkinter focused on intuitive, low-friction interaction for learners.",
        "Integrated external REST APIs for real-time definitions and examples, eliminating static data dependencies.",
        "Managed 500+ vocabulary entries with full CRUD and a robust file-handling mechanism to prevent data loss.",
        "Delivered a fully packaged executable; received a 9.5/10 evaluation score.",
      ],
      results: [
        "9.5 / 10 evaluation score from the course panel",
        "500+ vocabulary entries with full CRUD and durable file storage",
        "Fresh definitions and examples on every lookup via live REST APIs",
        "One-click executable — no setup required for the end user",
      ],
      tech: "Python, Tkinter, JSON, REST API",
      techPills: ["Python", "Tkinter", "JSON", "REST API"],
    },
  ],
  github_note:
    "If you are interested in the project aspect, please visit my GitHub at github.com/nhiney for a more comprehensive overview.",
  education: [
    {
      school:   "Ho Chi Minh City University of Industry and Trade",
      location: "Ho Chi Minh City, Vietnam",
      degree:   "Bachelor of Information Technology",
      gpa:      "3.34 / 4.0",
      expected: "2027",
      notes: [
        "Consistently appointed as team lead in academic projects; coordinated cross-functional delivery across design, development, and QA phases.",
      ],
    },
  ],
  certifications: [
    {
      title:  "Google Professional Certificates",
      period: "Apr – May 2026",
      source: "Coursera",
      items: [
        { label: "Project Management",      description: "Agile methodologies, project lifecycle, stakeholder management, team collaboration." },
        { label: "AI Professional",         description: "Applied AI tools and prompt engineering to accelerate workflows across multiple academic assignments." },
        { label: "AI Essentials",           description: "Prompt engineering, AI tools in professional workflows, responsible AI usage." },
        { label: "IT Automation with Python", description: "Python scripting, Git, system administration, cloud technologies." },
      ],
    },
  ],
  research: {
    title:  "Scientific Research Competition",
    period: "Mar 2026",
    source: "Ho Chi Minh City University of Industry and Trade",
    description:
      "Co-authored a research project on building an AI-integrated social network for students; conceptualized the system architecture and designed core user interactions to enhance student engagement.",
  },
};
