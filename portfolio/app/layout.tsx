import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundEffects } from "@/components/effects/BackgroundEffects";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { LanguageProvider } from "@/context/LanguageContext";
import { PostHogProvider } from "@/components/posthog/PostHogProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const BASE = SITE_CONFIG.url;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // ── Person ────────────────────────────────────────────────────────
    {
      "@type": "Person",
      "@id": `${BASE}/#person`,
      name: SITE_CONFIG.fullName,
      alternateName: ["Yen Nhi", "Nhi Yen", "Nguyễn Thị Yến Nhi"],
      url: BASE,
      image: {
        "@type": "ImageObject",
        url: SITE_CONFIG.ogImages.home,
        width: 1200,
        height: 630,
      },
      jobTitle: "Software Engineer",
      description: SITE_CONFIG.description,
      email: `mailto:${SITE_CONFIG.links.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ho Chi Minh City",
        addressCountry: "VN",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Information Technology (UIT)",
        sameAs: "https://www.uit.edu.vn",
      },
      knowsAbout: [
        "Backend Development",
        "Flutter Mobile Development",
        "Laravel PHP Framework",
        "ASP.NET MVC",
        "Oracle Database",
        "Database Security",
        "Role-Based Access Control",
        "REST API Design",
        "Firebase",
        "Software Engineering",
      ],
      hasCredential: [
        { "@type": "EducationalOccupationalCredential", name: "Google Software Engineering Certificate" },
        { "@type": "EducationalOccupationalCredential", name: "Mobile Development Certification" },
      ],
      sameAs: [
        SITE_CONFIG.links.github,
        SITE_CONFIG.links.linkedin,
        SITE_CONFIG.links.facebook,
        SITE_CONFIG.links.wakatime,
        SITE_CONFIG.links.portfolio,
      ],
    },

    // ── ProfilePage (Google's recommended type for portfolio sites) ───
    {
      "@type": "ProfilePage",
      "@id": `${BASE}/#profilepage`,
      url: BASE,
      name: `${SITE_CONFIG.fullName} — Software Engineer Portfolio`,
      description: SITE_CONFIG.description,
      mainEntity: { "@id": `${BASE}/#person` },
      dateModified: new Date().toISOString().split("T")[0],
    },

    // ── WebSite ───────────────────────────────────────────────────────
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: SITE_CONFIG.fullName,
      description: SITE_CONFIG.description,
      author: { "@id": `${BASE}/#person` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${BASE}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F5FA" },
    { media: "(prefers-color-scheme: dark)",  color: "#0A1020" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,        // shown on homepage
    template: `%s · Yen Nhi`,         // "Projects · Yen Nhi" — short & brandable
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.fullName, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.fullName,
  publisher: SITE_CONFIG.fullName,
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: `${SITE_CONFIG.fullName} Portfolio`,
    locale: "en_US",
    type: "profile",                   // "profile" beats "website" for personal pages
    images: [
      {
        url: SITE_CONFIG.ogImages.home,
        secureUrl: SITE_CONFIG.ogImages.home,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: `${SITE_CONFIG.fullName} — Software Engineer & Flutter Developer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    creator: "@nhiney",
    images: [
      {
        url: SITE_CONFIG.ogImages.home,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.fullName} — Software Engineer`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  // Verification tokens — add after submitting to Google/Bing Search Console
  // verification: {
  //   google: "YOUR_GOOGLE_SITE_VERIFICATION_TOKEN",
  //   other: { "msvalidate.01": "YOUR_BING_TOKEN" },
  // },
};

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
      if (!theme && supportDarkMode) theme = 'dark';
      if (!theme) theme = 'light';
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://github.com" />
      </head>
      <body className={cn(
        inter.variable,
        inter.className,
        "min-h-full flex flex-col bg-background text-foreground transition-colors relative selection:bg-primary/20 font-sans"
      )}>
        <PostHogProvider>
          <LanguageProvider>
            <ScrollProgress />
            <BackgroundEffects />
            <Navbar />
            <main className="flex-1 relative z-10">{children}</main>
            <Footer />
          </LanguageProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
