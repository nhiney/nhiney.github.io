import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundEffects } from "@/components/effects/BackgroundEffects";
import { LanguageProvider } from "@/context/LanguageContext";
import { PostHogProvider } from "@/components/posthog/PostHogProvider";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    creator: "@nhiney",
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <head />
      <body className={cn(
        inter.variable,
        outfit.variable,
        inter.className,
        "min-h-full flex flex-col bg-background text-foreground transition-colors relative selection:bg-primary/20 font-sans"
      )}>
        <Script 
          id="theme-strategy" 
          src="/theme-strategy.js" 
          strategy="beforeInteractive" 
        />
        <PostHogProvider>
          <LanguageProvider>
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
