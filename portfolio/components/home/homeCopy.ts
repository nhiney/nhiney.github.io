// UI labels that only the redesigned homepage uses. Content (projects,
// skills, experience…) still comes from `pages.portfolio` in the shared
// dictionaries; this file only holds the new chrome around it.

import { useLanguage } from "@/context/LanguageContext";
import { dictionaries } from "@/lib/i18n/dictionaries";

const UI = {
  en: {
    role: "Business Analyst · Product Owner",
    hint: "Move your cursor — the network responds",
    scroll: "Scroll to explore",
    location: "Ho Chi Minh City, Vietnam",
    localTime: "Local time",
    index: "Index",
    statContrib: "GitHub contributions",
    statHours: "Hours of focused building",
    statPrograms: "Verified Google programs",
    statProjects: "Projects shipped",
    statGpa: "GPA / 4.0",
    principles: "How I work",
    caseStudy: "Case study",
    role_label: "Role",
    capabilitiesNote: "Hover a card — tools sit closer to the problem than you think.",
    proofCount: "proof points",
    certCta: "All certificates",
    copyEmail: "Copy email",
    copied: "Copied!",
    or: "or find me on",
    available: "Available for internships",
    backToTop: "Back to top",
  },
  vi: {
    role: "Business Analyst · Product Owner",
    hint: "Di chuột — mạng nơ-ron sẽ phản hồi",
    scroll: "Cuộn để khám phá",
    location: "TP. Hồ Chí Minh, Việt Nam",
    localTime: "Giờ địa phương",
    index: "Mục lục",
    statContrib: "Lượt đóng góp GitHub",
    statHours: "Giờ tập trung xây dựng",
    statPrograms: "Chương trình Google đã xác thực",
    statProjects: "Dự án đã hoàn thành",
    statGpa: "GPA / 4.0",
    principles: "Cách mình làm việc",
    caseStudy: "Xem dự án",
    role_label: "Vai trò",
    capabilitiesNote: "Rê chuột lên từng thẻ — công cụ luôn gắn với vấn đề cần giải.",
    proofCount: "minh chứng",
    certCta: "Tất cả chứng chỉ",
    copyEmail: "Sao chép email",
    copied: "Đã sao chép!",
    or: "hoặc tìm mình trên",
    available: "Sẵn sàng thực tập",
    backToTop: "Lên đầu trang",
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
