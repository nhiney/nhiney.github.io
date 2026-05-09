"use client";

import Link from "next/link";
import { ArrowRight, GitBranch, Clock, Code2, Folder, Award, FileText, Globe } from "lucide-react";
import { motion } from "framer-motion";

import { ColourfulText }      from "@/components/ui/ColourfulText";
import { BackgroundLines }    from "@/components/ui/BackgroundLines";
import { AnimatedTooltip, type TooltipItem } from "@/components/ui/AnimatedTooltip";
import { GlowingEffect }      from "@/components/ui/GlowingEffect";
import { QuestionSection }    from "@/components/ui/QuestionSection";
import { CursorTrailCanvas }  from "@/components/ui/CursorTrailCanvas";
import { Container }          from "@/components/ui/Container";
import { GithubIcon, LinkedinIcon, FacebookIcon, MailIcon } from "@/components/ui/Icons";

import { useLanguage }   from "@/context/LanguageContext";
import { SITE_CONFIG }   from "@/lib/constants";
import { cn }            from "@/lib/utils";
import { Post }          from "@/types";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TECH_ITEMS: TooltipItem[] = [
  { id: 1, name: "Laravel",   role: "PHP Framework",        bg: "bg-red-500",    letter: "L",  href: "https://laravel.com" },
  { id: 2, name: "Flutter",   role: "Mobile SDK",           bg: "bg-blue-500",   letter: "F",  href: "https://flutter.dev" },
  { id: 3, name: "Oracle DB", role: "Database",             bg: "bg-orange-500", letter: "O" },
  { id: 4, name: "Firebase",  role: "Backend Platform",     bg: "bg-yellow-400", letter: "🔥", href: "https://firebase.google.com" },
  { id: 5, name: "ASP.NET",   role: ".NET Web Framework",   bg: "bg-violet-600", letter: "N",  href: "https://dotnet.microsoft.com" },
  { id: 6, name: "Dart",      role: "Programming Language", bg: "bg-cyan-500",   letter: "D",  href: "https://dart.dev" },
];

const FEATURES = [
  { icon: Folder,   title: "Projects",         description: "4 shipped systems — clinic booking, sports field, database security, and English learning app.",          href: "/portfolio#projects" },
  { icon: Award,    title: "Certificates",     description: "Professional certifications covering backend engineering, security, and cloud fundamentals.",              href: "/certificates" },
  { icon: FileText, title: "CV / Resume",      description: "Complete engineering background — education, experience, and technical skills at a glance.",              href: "/resume" },
  { icon: Globe,    title: "Fellowship VNNIC", description: "My application for VNNIC Internet Fellowship — contributing to Vietnam's internet infrastructure.",        href: "/fellowship" },
];

const TECH_PILLS = [
  { label: "Laravel",   color: "bg-red-500/10    border-red-500/20    text-red-400"    },
  { label: "Flutter",   color: "bg-blue-500/10   border-blue-500/20   text-blue-400"   },
  { label: "Oracle DB", color: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
  { label: "Firebase",  color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
  { label: "ASP.NET",   color: "bg-violet-500/10 border-violet-500/20 text-violet-400" },
  { label: "Dart",      color: "bg-cyan-500/10   border-cyan-500/20   text-cyan-400"   },
  { label: "C#",        color: "bg-green-500/10  border-green-500/20  text-green-400"  },
  { label: "PHP",       color: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400" },
  { label: "PL/SQL",    color: "bg-pink-500/10   border-pink-500/20   text-pink-400"   },
  { label: "REST APIs", color: "bg-teal-500/10   border-teal-500/20   text-teal-400"   },
  { label: "Node.js",   color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  { label: "Git",       color: "bg-rose-500/10   border-rose-500/20   text-rose-400"   },
];

// ─── Bento card ───────────────────────────────────────────────────────────────

function BentoItem({ area, icon, title, children }: {
  area: string; icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-3xl border border-border/40 p-2 dark:border-neutral-800">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
        <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl p-6 dark:bg-neutral-900/40 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="w-fit rounded-lg border border-gray-200 dark:border-neutral-800 p-2">
            {icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">{children}</div>
          </div>
        </div>
      </div>
    </li>
  );
}

// ─── Right-side bento grid ────────────────────────────────────────────────────

function PersonalBentoGrid() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 xl:max-h-[34rem] xl:grid-rows-2">

      <BentoItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/7]"
        icon={<GitBranch className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />}
        title="GitHub Activity"
      >
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 text-center">
            <div className="text-2xl font-black text-primary">186+</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Contributions</div>
          </div>
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 text-center">
            <div className="text-2xl font-black text-primary">8+</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Repositories</div>
          </div>
        </div>
        <Link
          href={SITE_CONFIG.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View on GitHub <ArrowRight size={11} />
        </Link>
      </BentoItem>

      <BentoItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/7]"
        icon={<Clock className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />}
        title="Coding Hours"
      >
        <div className="mt-1 space-y-3">
          <div>
            <span className="text-3xl font-black text-foreground">442+</span>
            <span className="ml-2 text-xs text-muted-foreground">hrs on Wakatime</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              <span>All time</span><span>≈ 18 days</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary/30 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          <Link
            href="https://wakatime.com/@_tolanhy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View on Wakatime <ArrowRight size={11} />
          </Link>
        </div>
      </BentoItem>

      <BentoItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/7/3/13]"
        icon={<Code2 className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />}
        title="Tech Stack"
      >
        <div className="flex flex-wrap gap-2 mt-1">
          {TECH_PILLS.map((t) => (
            <span key={t.label} className={cn("rounded-full border px-3 py-1 text-[10px] font-bold", t.color)}>
              {t.label}
            </span>
          ))}
        </div>
      </BentoItem>

    </ul>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HomeClient({ projects: _ }: { projects: Post[] }) {
  const { t } = useLanguage();

  const socials = [
    { href: SITE_CONFIG.links.github,            Icon: GithubIcon   },
    { href: SITE_CONFIG.links.linkedin,          Icon: LinkedinIcon  },
    { href: SITE_CONFIG.links.facebook,          Icon: FacebookIcon  },
    { href: `mailto:${SITE_CONFIG.links.email}`, Icon: MailIcon      },
  ];

  return (
    <>
      <CursorTrailCanvas className="pointer-events-none fixed inset-0 z-50 h-full w-full hidden md:block" />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[calc(100dvh-4rem)]">

        {/* Background lines — desktop-only, infinite SVG animations are too heavy for mobile GPUs during scroll */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block">
          <BackgroundLines className="h-full w-full [&_svg]:opacity-[0.10]">
            <span />
          </BackgroundLines>
        </div>

        <Container className="relative z-10 flex flex-col justify-center min-h-[calc(100dvh-4rem)] py-24">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 w-full xl:items-center">

            {/* ── Left: text ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-7">

              {/* Title */}
              <h1 className="text-4xl font-semibold leading-tight dark:text-zinc-100 md:text-5xl md:leading-[3.8rem]">
                Building secure backend systems with{" "}
                <ColourfulText text="Nguyễn Thị Yến Nhi" />
              </h1>

              {/* Subtitle */}
              <p className="text-neutral-500 dark:text-neutral-400 text-base sm:text-lg leading-relaxed max-w-lg">
                {t("hero.description")}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/portfolio">
                  <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-base px-7 h-12 font-medium transition-colors w-full sm:w-auto">
                    {t("hero.cta_primary")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link
                  href="/fellowship"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 px-7 h-12 text-base font-medium transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  Fellowship VNNIC
                </Link>
              </div>

              {/* Tech stack avatars + stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="flex pl-4">
                  <AnimatedTooltip items={TECH_ITEMS} />
                </div>
                <div className="flex flex-col gap-0.5 text-sm">
                  <span>
                    <span className="font-semibold">6 </span>
                    <span className="text-neutral-500 dark:text-neutral-400">core technologies mastered</span>
                  </span>
                  <span>
                    <span className="text-neutral-500 dark:text-neutral-400">shipped </span>
                    <ColourfulText text="4" />
                    <span className="text-neutral-500 dark:text-neutral-400"> complete systems</span>
                  </span>
                </div>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-6">
                {socials.map(({ href, Icon }) => (
                  <motion.div
                    key={href}
                    whileHover={{ y: -3, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Link
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Icon size={20} />
                    </Link>
                  </motion.div>
                ))}
              </div>

            </div>

            {/* ── Right: bento grid (xl only) ────────────────────────── */}
            <div className="hidden xl:block">
              <PersonalBentoGrid />
            </div>

          </div>
        </Container>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════════════════════ */}
      <Container className="py-16">
        <div className="flex gap-4 flex-col sm:flex-row">
          {FEATURES.map(({ icon: Icon, title, description, href }) => (
            <Link key={title} href={href} className="flex-1">
              <div className="h-full p-5 rounded-3xl border border-border/40 dark:border-neutral-800 dark:bg-neutral-900/40 hover:dark:bg-neutral-800/60 hover:border-primary/30 transition-all">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-purple-500" />
                    </div>
                    <h2 className="text-base font-semibold">{title}</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* ══ CONTACT ═══════════════════════════════════════════════════════════ */}
      <QuestionSection />
    </>
  );
}
