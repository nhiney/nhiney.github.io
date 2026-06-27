export const SITE_CONFIG = {
  name: "Yen Nhi",
  fullName: "Nguyen Thi Yen Nhi",
  // ≤60 chars — primary keyword first for Google ranking signal
  title: "Nguyen Thi Yen Nhi — Business Analyst",
  // ≤155 chars — natural keyword density, action-oriented
  description: "Business Analyst with a Computer Science background in Ho Chi Minh City. I turn business needs into user stories, system flows & specs. Open to BA roles.",
  // startup.id.vn is the live domain — GitHub Pages redirects to here
  url: "https://startup.id.vn",
  keywords: [
    "Nguyen Thi Yen Nhi",
    "Business Analyst Vietnam",
    "Technical Business Analyst",
    "Business Analyst Ho Chi Minh City",
    "Business Analyst Intern",
    "BPMN 2.0",
    "User Stories",
    "System Analysis",
    "Requirements Analysis",
    "Agile Business Analyst",
    "Nguyễn Thị Yến Nhi",
  ],
  links: {
    github: "https://github.com/nhiney",
    linkedin: "https://www.linkedin.com/in/nhi-yen-410b2a2b7/",
    email: "nhiyen.engineer@gmail.com",
    wakatime: "https://wakatime.com/@nhiney",
    portfolio: "https://startup.id.vn",
  },
  projects: {
    // External deployment — there is no internal /mei-closet route
    "Mei Closet": "https://mei-closet.vercel.app",
  },
  author: "Nguyen Thi Yen Nhi",
  // Paste the token from Google Search Console → Settings → Ownership
  // verification → "HTML tag" (the content="..." value). Leave "" to omit.
  // Free, and required to get the site crawled fast + see search queries.
  googleSiteVerification: "",
  ogImages: {
    home:         "https://startup.id.vn/og/home.png",
    blog:         "https://startup.id.vn/og/blog.png",
    books:        "https://startup.id.vn/og/books.png",
    projects:     "https://startup.id.vn/og/projects.png",
    certificates: "https://startup.id.vn/og/certificates.png",
    mindMap:      "https://startup.id.vn/og/mind-map.png",
    resume:       "https://startup.id.vn/og/resume.png",
    portfolio:    "https://startup.id.vn/og/portfolio.png",
  },
};

export const NAV_ITEMS = [
  // Fellowship VNNIC — hidden from global nav; page still reachable at /nguyenthiyennhi-fellowship-vnnic-hcm.
  // To re-enable, uncomment the line below.
  // { name: "Fellowship", href: "/nguyenthiyennhi-fellowship-vnnic-hcm" },

  { name: "Certificates", href: "/certificates" },
  { name: "Blog", href: "/blog" },
  { name: "Waitlist", href: "/waitlist" },
  { name: "Books", href: "/books" },
];

export const HERO_CONTENT = {
  welcome: "Welcome to my engineering product page",
  firstName: "Yen Nhi",
  roles: ["Backend Specialist", "Full-stack Engineer", "Security Enthusiast"],
  description: "Building secure, scalable, and high-performance backend systems. Passionate about architecting robust databases and developing mobile solutions with Flutter.",
};

export const SKILLS = [
  {
    category: "Languages & Core",
    items: ["Dart", "C#", "PHP", "Python", "PL/SQL", "JavaScript"],
  },
  {
    category: "Backend & Web",
    items: ["Flutter", "Laravel", "ASP.NET MVC", "Oracle DB", "Firebase", "Node.js"],
  },
  {
    category: "Tools & Specialty",
    items: ["RBAC Security", "Database Security", "REST APIs", "Git", "Wakatime", "Tkinter"],
  },
];

export const EDUCATION_DATA = [
  {
    year: "Present",
    title: "Software Engineering Student",
    organization: "Information Technology",
    description: "Specializing in Building Secure and Scalable Systems. Currently focusing on complex system integration and backend optimization.",
  }
];

export const EXTRACURRICULAR_DATA = [
  {
    year: "2024",
    title: "Project Lead",
    organization: "E-commerce & Healthcare Apps",
    description: "Leading development teams for clinic booking and sports field management systems using Flutter and Laravel.",
  },
  {
    year: "Passions",
    title: "Continuous Learning",
    organization: "Wakatime: 957+ Hours",
    description: "Maintaining a deep focus on coding efficiency and activity patterns, with a goal of 'not wasting' time in 2025.",
  }
];

export const APPROACH_ITEMS = [
  {
    title: "Architecture & Design",
    description: "Focusing on solid database ERD designs and secure backend architectural patterns.",
  },
  {
    title: "Secure Development",
    description: "Implementing Role-Based Access Control and protecting against common vulnerabilities like SQL injection.",
  },
  {
    title: "Rapid Implementation",
    description: "Utilizing modern frameworks like ASP.NET MVC and Laravel to deliver functional, high-performance systems.",
  }
];

export const IMPACT_METRICS = [
  { label: "Repositories", value: "8+", icon: "Briefcase" },
  { label: "Contributions", value: "186+", icon: "Code" },
  { label: "Coding Hours", value: "957+", icon: "Users" },
  { label: "Main Tech", value: "3+", icon: "Zap" },
];

export const MIND_MAP_DATA = {
  root: "Yen Nhi",
  branches: [
    {
      label: "Technical Skills",
      items: ["Backend Systems", "Mobile Flutter", "Database Security"],
    },
    {
      label: "Main Projects",
      items: ["S-Book Clinic", "Sport Booking", "Secured DB"],
    },
    {
      label: "Learning",
      items: ["Cloud Architecture", "Advanced Security"],
    },
    {
      label: "Strengths",
      items: ["Product Mindset", "Leadership"],
    },
    {
      label: "Interests",
      items: ["Acrylic Drawing", "Open Source"],
    },
  ],
};
