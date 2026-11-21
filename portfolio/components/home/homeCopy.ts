// UI labels that only the redesigned homepage uses. Content (projects,
// skills, experience…) still comes from `pages.portfolio` in the shared
// dictionaries; this file only holds the new chrome around it.

import { useLanguage } from "@/context/LanguageContext";
import { dictionaries } from "@/lib/i18n/dictionaries";
import certificates from "@/data/certificates.json";

const UI = {
  en: {
    role: "Business Analyst & Product Owner",
    location: "Ho Chi Minh City, Vietnam",
    localTime: "Local time",
    statHours: "Hours of focused building",
    principles: "How I work",
    certCta: "All certificates",
    copied: "Copied",
    copyEmail: "Copy email",
    available: "Available for internships",
    backToTop: "Back to top",
    kindProject: "Project",
    kindCert: "Certificate",
    kindResearch: "Research",
    kindCode: "Code",
    researchChip: "AI research at HUIT",
    githubChip: "GitHub profile",
    linkProject: "See the project",
    linkCv: "Read it in my CV",
    linkCerts: "See all certificates",
    verify: "Verify",
    prevProject: "Previous project",
    nextProject: "Next project",
    projectOf: "Project {n} of {total}",
    caseStudy: "Source code",
    // Homepage voice: specific, first person, no slogans.
    tagline: "Turning user needs into",
    taglineMark: "digital experiences that matter.",
    statement: "From **understanding the problem** and **setting priorities** to **delivering with the team**, I focus on building products that are **useful, easy to use**, and bring real value.",
    metaLead: "Product Owner",
    glanceTitle: "At a glance",
    glanceLine: "On academic projects I cover the whole cycle: **user research**, **wireframes**, **specs**, **sprint coordination** and **real-device testing**, and build hands-on with **Flutter, Firebase and ASP.NET MVC**.",
    ctaCv: "View my CV",
    ctaEmail: "Email me",
    aboutHeading: "I'd rather ask one more question than build the wrong feature.",
    projectsHeading: "Every project here began with a real problem, not a tech stack.",
    experienceHeading: "Three things I'd point to first.",
    skillsHeading: "What I work with",
    certsHeading: "Six Google programs, finished while leading a team.",
    contactHeading: "Have a problem worth solving? Let's talk.",
  },
  vi: {
    role: "Business Analyst & Product Owner",
    location: "TP. Hồ Chí Minh, Việt Nam",
    localTime: "Giờ địa phương",
    statHours: "Giờ tập trung xây dựng",
    principles: "Cách mình làm việc",
    certCta: "Tất cả chứng chỉ",
    copied: "Đã sao chép",
    copyEmail: "Sao chép email",
    available: "Sẵn sàng thực tập",
    backToTop: "Lên đầu trang",
    kindProject: "Dự án",
    kindCert: "Chứng chỉ",
    kindResearch: "Nghiên cứu",
    kindCode: "Mã nguồn",
    researchChip: "Nghiên cứu AI tại HUIT",
    githubChip: "Hồ sơ GitHub",
    linkProject: "Xem dự án",
    linkCv: "Xem trong CV",
    linkCerts: "Xem tất cả chứng chỉ",
    verify: "Xác minh",
    prevProject: "Dự án trước",
    nextProject: "Dự án tiếp theo",
    projectOf: "Dự án {n} / {total}",
    caseStudy: "Mã nguồn",
    tagline: "Biến nhu cầu người dùng thành",
    taglineMark: "trải nghiệm số có giá trị.",
    statement: "Từ **thấu hiểu vấn đề**, xác định **thứ tự ưu tiên** đến **hoàn thiện cùng đội ngũ**, mình tập trung tạo ra những sản phẩm **hữu ích, dễ sử dụng** và mang lại giá trị thực.",
    metaLead: "Product Owner",
    glanceTitle: "Tóm tắt nhanh",
    glanceLine: "Trong các dự án học thuật, mình đi trọn quy trình: **nghiên cứu người dùng**, **wireframe**, **đặc tả**, **điều phối sprint** đến **kiểm thử trên thiết bị thật**, và tự tay xây dựng với **Flutter, Firebase, ASP.NET MVC**.",
    ctaCv: "Xem CV",
    ctaEmail: "Gửi email",
    aboutHeading: "Mình thà hỏi thêm một câu còn hơn làm sai một tính năng.",
    projectsHeading: "Mỗi dự án ở đây bắt đầu từ một vấn đề thật, không phải từ công nghệ.",
    experienceHeading: "Ba điều mình muốn bạn xem trước tiên.",
    skillsHeading: "Những gì mình dùng để làm việc",
    certsHeading: "Sáu chương trình của Google, hoàn thành khi vẫn đang dẫn dắt team.",
    contactHeading: "Bạn có một vấn đề đáng giải quyết? Mình cùng trò chuyện nhé.",
  },
} as const;

export type HomeUi = { [K in keyof (typeof UI)["en"]]: string };

type ProjectItem = {
  tag: string; title: string; role: string; period: string;
  problem: string; actions?: string[]; impact: string[];
};

export type PortfolioCopy = {
  hero: {
    status: string; headline_pre: string; headline_acc1: string; headline_mid: string;
    sub_pre: string; cta_projects: string; cta_cv: string; cta_contact: string;
  };
  stats: { value: string; label: string }[];
  about: {
    eyebrow: string; heading_1: string; heading_2: string; heading_3: string;
    p1: string; p2: string; p3: string; tags: string[];
  };
  traits: { icon: string; title: string; body: string }[];
  skills: { eyebrow: string; heading: string; desc: string; groups: { category: string; items: string[] }[] };
  projects: {
    eyebrow: string; heading: string; desc: string; all_cta: string;
    label_problem: string; label_actions: string; label_impact: string; label_case_study: string;
    items: ProjectItem[];
  };
  experience: {
    eyebrow: string; heading: string; desc: string;
    items: { kind: "leadership" | "research" | "learning"; period: string; title: string; org: string; desc: string; evidence: string[] }[];
  };
  certifications: {
    eyebrow: string; heading: string; desc: string; all_cta: string;
    items: { emoji: string; title: string; issuer: string; date: string }[];
  };
  contact: { eyebrow: string; heading: string; desc: string; cta: string; github: string; linkedin: string };
};

export function useHomeCopy(): { copy: PortfolioCopy; ui: HomeUi; language: string } {
  const { language } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lang = (dictionaries[language] as any)?.pages?.portfolio;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const en = (dictionaries.en as any).pages.portfolio;
  const ui = (UI as Record<string, HomeUi>)[language] ?? UI.en;
  return { copy: { ...en, ...(lang ?? {}) } as PortfolioCopy, ui, language };
}

/** Coursera verify link for a homepage certificate title ("Google AI Professional" → the "Google AI" credential). */
export function certVerifyUrl(title: string): string {
  const match = certificates.find((c) => title === c.title || title.startsWith(`${c.title} `));
  return match?.verifyUrl ?? "/certificates/";
}
