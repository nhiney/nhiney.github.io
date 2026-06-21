import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FooterLanguageSelector } from "@/components/widgets/FooterLanguageSelector";
import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/widgets/Icons";
import { SITE_CONFIG } from "@/lib/constants";
import { TreePine } from "lucide-react";

const SOCIAL_LINKS = [
  { href: SITE_CONFIG.links.github,            icon: GithubIcon,   label: "GitHub"   },
  { href: SITE_CONFIG.links.linkedin,          icon: LinkedinIcon, label: "LinkedIn"  },
  { href: `mailto:${SITE_CONFIG.links.email}`, icon: MailIcon,     label: "Email"    },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <Container className="flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">

        {/* Left — name + social icons */}
        <div className="flex items-center gap-5">
          <span className="text-sm font-semibold text-foreground whitespace-nowrap">
            {SITE_CONFIG.fullName}
          </span>
          <span className="h-4 w-px bg-border/60" />
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/60 transition-all hover:text-foreground hover:bg-secondary/60"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Right — mind map + projects + language + copyright */}
        <div className="flex items-center gap-5">
          {/* Mind Map — inline footer nav, always visible; icon keeps its identity */}
          <Link
            href="/mind-map"
            className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <TreePine className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">Mind Map</span>
          </Link>
          <span className="hidden sm:block h-4 w-px bg-border/60" />
          <div className="hidden sm:flex items-center gap-4">
            {Object.entries(SITE_CONFIG.projects).map(([name, url]) =>
              url.startsWith("http") ? (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {name}
                </a>
              ) : (
                <Link
                  key={name}
                  href={url}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {name}
                </Link>
              )
            )}
          </div>
          <span className="hidden sm:block h-4 w-px bg-border/60" />
          <FooterLanguageSelector />
          <span className="hidden md:block h-4 w-px bg-border/60" />
          <span className="hidden md:block text-xs text-muted-foreground/40 whitespace-nowrap">
            © 2026 {SITE_CONFIG.name}
          </span>
        </div>

      </Container>
    </footer>
  );
}
