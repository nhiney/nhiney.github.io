"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, GitBranch, Clock, Code2, Mail } from "lucide-react";

import { ColourfulText }      from "@/components/effects/ColourfulText";
import { GlowingEffect }      from "@/components/effects/GlowingEffect";
import { Container }          from "@/components/ui/Container";
import { PortfolioClient }    from "@/app/portfolio/PortfolioClient";
import { useLanguage }   from "@/context/LanguageContext";
import { SITE_CONFIG }   from "@/lib/constants";
import wakatimeTotal     from "@/data/wakatime.json";
import { cn }            from "@/lib/utils";
import { Post }          from "@/types";
import pageStyles        from "./HomeClient.module.css";

function Highlight({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className="font-semibold site-heading">{part}</strong>
          : part
      )}
    </>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TECH_PILLS = [
  { label: "Laravel", cls: "border-rose-200/85 bg-rose-50/80 text-rose-700/95 dark:border-rose-300/30 dark:bg-rose-400/[0.12] dark:text-rose-100/95" },
  { label: "Flutter", cls: "border-sky-200/85 bg-sky-50/80 text-sky-700/95 dark:border-sky-300/30 dark:bg-sky-400/[0.12] dark:text-sky-100/95" },
  { label: "Oracle DB", cls: "border-red-200/85 bg-red-50/78 text-red-700/95 dark:border-red-300/30 dark:bg-red-400/[0.12] dark:text-red-100/95" },
  { label: "Firebase", cls: "border-amber-200/90 bg-amber-50/82 text-amber-700/95 dark:border-amber-300/30 dark:bg-amber-400/[0.12] dark:text-amber-100/95" },
  { label: "ASP.NET", cls: "border-violet-200/85 bg-violet-50/80 text-violet-700/95 dark:border-violet-300/30 dark:bg-violet-400/[0.12] dark:text-violet-100/95" },
  { label: "Dart", cls: "border-cyan-200/85 bg-cyan-50/80 text-cyan-700/95 dark:border-cyan-300/30 dark:bg-cyan-400/[0.12] dark:text-cyan-100/95" },
  { label: "C#", cls: "border-indigo-200/85 bg-indigo-50/80 text-indigo-700/95 dark:border-indigo-300/30 dark:bg-indigo-400/[0.12] dark:text-indigo-100/95" },
  { label: "PHP", cls: "border-fuchsia-200/85 bg-fuchsia-50/78 text-fuchsia-700/95 dark:border-fuchsia-300/30 dark:bg-fuchsia-400/[0.12] dark:text-fuchsia-100/95" },
  { label: "PL/SQL", cls: "border-orange-200/85 bg-orange-50/80 text-orange-700/95 dark:border-orange-300/30 dark:bg-orange-400/[0.12] dark:text-orange-100/95" },
  { label: "REST APIs", cls: "border-emerald-200/85 bg-emerald-50/80 text-emerald-700/95 dark:border-emerald-300/30 dark:bg-emerald-400/[0.12] dark:text-emerald-100/95" },
  { label: "Node.js", cls: "border-lime-200/85 bg-lime-50/78 text-lime-700/95 dark:border-lime-300/30 dark:bg-lime-400/[0.12] dark:text-lime-100/95" },
  { label: "Git", cls: "border-slate-200/90 bg-slate-50/85 text-slate-700/95 dark:border-slate-300/30 dark:bg-slate-400/[0.12] dark:text-slate-100/95" },
];

const BENTO_TONES = {
  github: {
    frame: "border-sky-200/80 bg-white/78 dark:border-sky-300/24 dark:bg-sky-300/[0.05]",
    panel: "bg-[linear-gradient(135deg,hsl(var(--card)/0.99),rgba(248,250,255,0.96)_52%,rgba(232,245,255,0.58))] dark:bg-[linear-gradient(135deg,hsl(var(--card)/0.32),rgba(17,27,50,0.28)_56%,rgba(56,189,248,0.08))]",
    icon: "border-sky-200/90 bg-sky-50/88 text-sky-700 dark:border-sky-300/32 dark:bg-sky-400/[0.14] dark:text-sky-100",
    rule: "from-sky-300/45 via-blue-300/45 to-indigo-300/40",
  },
  coding: {
    frame: "border-indigo-200/80 bg-white/78 dark:border-indigo-300/24 dark:bg-indigo-300/[0.05]",
    panel: "bg-[linear-gradient(135deg,hsl(var(--card)/0.99),rgba(248,249,255,0.96)_52%,rgba(235,237,255,0.62))] dark:bg-[linear-gradient(135deg,hsl(var(--card)/0.32),rgba(19,25,52,0.28)_56%,rgba(99,102,241,0.09))]",
    icon: "border-indigo-200/90 bg-indigo-50/88 text-indigo-700 dark:border-indigo-300/32 dark:bg-indigo-400/[0.14] dark:text-indigo-100",
    rule: "from-blue-300/45 via-indigo-300/45 to-violet-300/40",
  },
  tech: {
    frame: "border-violet-200/78 bg-white/78 dark:border-violet-300/24 dark:bg-violet-300/[0.05]",
    panel: "bg-[linear-gradient(135deg,hsl(var(--card)/0.99),rgba(250,248,255,0.96)_52%,rgba(244,237,255,0.6))] dark:bg-[linear-gradient(135deg,hsl(var(--card)/0.32),rgba(25,21,51,0.28)_56%,rgba(168,85,247,0.08))]",
    icon: "border-violet-200/90 bg-violet-50/88 text-violet-700 dark:border-violet-300/32 dark:bg-violet-400/[0.14] dark:text-violet-100",
    rule: "from-violet-300/42 via-fuchsia-300/35 to-amber-300/38",
  },
} as const;

const GITHUB_STAT_BOXES = [
  {
    key: "github_contributions",
    value: 186,
    delay: 0,
    cls: "border-blue-200/85 bg-white/88 text-blue-700 dark:border-blue-300/30 dark:bg-blue-400/[0.13] dark:text-blue-100",
  },
  {
    key: "github_repos",
    value: 8,
    delay: 0.2,
    cls: "border-indigo-200/85 bg-white/88 text-indigo-700 dark:border-indigo-300/30 dark:bg-indigo-400/[0.13] dark:text-indigo-100",
  },
] as const;

// ─── Animated number counter ──────────────────────────────────────────────────

function AnimatedCounter({
  to,
  duration = 1.4,
  suffix = "",
  delay = 0,
  formatter,
}: {
  to: number;
  duration?: number;
  suffix?: string;
  delay?: number;
  formatter?: Intl.NumberFormat;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionFrame = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(reducedMotionFrame);
    }

    let raf = 0;
    let startTs: number | null = null;
    const startDelay = window.setTimeout(() => {
      const tick = (ts: number) => {
        if (startTs === null) startTs = ts;
        const progress = Math.min((ts - startTs) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(to * eased));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      window.clearTimeout(startDelay);
      cancelAnimationFrame(raf);
    };
  }, [to, duration, delay]);

  return <>{formatter ? formatter.format(value) : value}{suffix}</>;
}

// ─── Bento card ───────────────────────────────────────────────────────────────

function BentoItem({ area, icon, title, tone, children }: {
  area: string;
  icon: React.ReactNode;
  title: string;
  tone: keyof typeof BENTO_TONES;
  children: React.ReactNode;
}) {
  const styles = BENTO_TONES[tone];

  return (
    <li className={cn("min-h-[12rem] list-none sm:min-h-[14rem]", area)}>
      <div className={cn("relative h-full rounded-2xl border p-2 shadow-[0_18px_48px_-38px_hsl(var(--foreground)/0.24)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_hsl(var(--foreground)/0.38)] sm:rounded-3xl", styles.frame)}>
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
        <div className={cn("relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-5 shadow-[0_10px_28px_-26px_hsl(var(--foreground)/0.2)] sm:p-6", styles.panel)}>
          <div className={cn("absolute inset-x-10 top-0 h-px rounded-b-full bg-gradient-to-r opacity-65", styles.rule)} />
          <div className="pointer-events-none absolute right-8 top-8 h-px w-20 rotate-[-22deg] bg-gradient-to-r from-transparent via-current to-transparent opacity-[0.06]" />
          <div className={cn("w-fit rounded-lg border p-2", styles.icon)}>
            {icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight site-heading">{title}</h3>
            <div className="text-sm site-body">{children}</div>
          </div>
        </div>
      </div>
    </li>
  );
}

// ─── Right-side bento grid ────────────────────────────────────────────────────

function PersonalBentoGrid() {
  const { language, t } = useLanguage();
  const hoursLocale = language === "vi" ? "vi-VN" : "en-US";
  const hoursFormatter = new Intl.NumberFormat(hoursLocale);
  const formattedHours = hoursFormatter.format(wakatimeTotal.hours);
  const codingTimeLabel = [
    formattedHours,
    t("home.bento.coding_hours_unit"),
    wakatimeTotal.minutes,
    t("home.bento.coding_minutes_unit"),
  ].join(" ");

  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 xl:max-h-[34rem] xl:grid-rows-2">

      <BentoItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/7]"
        icon={<GitBranch className="h-4 w-4" />}
        title={t("home.bento.github_title")}
        tone="github"
      >
        <div className="grid grid-cols-2 gap-3 mt-1">
          {GITHUB_STAT_BOXES.map((item) => (
            <div key={item.key} className={cn("rounded-xl border p-3 text-center shadow-[0_8px_18px_-16px_currentColor]", item.cls)}>
              <div className="text-2xl font-black">
                <AnimatedCounter
                  to={item.value}
                  suffix="+"
                  duration={item.value === 8 ? 1.0 : 1.4}
                  delay={item.delay}
                />
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-current/70">
                {t(`home.bento.${item.key}`)}
              </div>
            </div>
          ))}
        </div>
        <Link
          href={SITE_CONFIG.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          {t("home.bento.github_cta")} <ArrowRight size={11} />
        </Link>
      </BentoItem>

      <BentoItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:1/7/2/13]"
        icon={<Clock className="h-4 w-4" />}
        title={t("home.bento.coding_title")}
        tone="coding"
      >
        <div className="mt-1">
          <div className="coding-time-lockup">
            <span className="sr-only">{codingTimeLabel}</span>
            <span
              className="coding-time-stat coding-time-stat-hours"
              aria-hidden="true"
            >
              <span className="coding-time-number">
                <AnimatedCounter
                  to={wakatimeTotal.hours}
                  duration={1.6}
                  delay={0.1}
                  formatter={hoursFormatter}
                />
              </span>
              <span className="coding-time-unit">
                {t("home.bento.coding_hours_unit")}
              </span>
            </span>
            <span className="coding-time-divider" aria-hidden="true" />
            <span
              className="coding-time-stat coding-time-stat-minutes"
              aria-hidden="true"
            >
              <span className="coding-time-minutes-number">
                <AnimatedCounter
                  to={wakatimeTotal.minutes}
                  duration={1.15}
                  delay={0.25}
                />
              </span>
              <span className="coding-time-unit">
                {t("home.bento.coding_minutes_unit")}
              </span>
            </span>
          </div>
          <Link
            href={SITE_CONFIG.links.wakatime}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t("home.bento.coding_cta")}: ${codingTimeLabel}`}
            className="mt-3 flex w-fit items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80 hover:underline [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5"
          >
            {t("home.bento.coding_cta")} <ArrowRight size={11} />
          </Link>
        </div>
      </BentoItem>

      <BentoItem
        area="md:[grid-area:2/1/3/13] xl:[grid-area:2/1/3/13]"
        icon={<Code2 className="h-4 w-4" />}
        title={t("home.bento.tech_title")}
        tone="tech"
      >
        <div className="flex flex-wrap gap-2 mt-1">
          {TECH_PILLS.map((item) => (
            <span key={item.label} className={cn("rounded-full border px-3 py-1 text-[10px] font-bold shadow-sm", item.cls)}>
              {item.label}
            </span>
          ))}
        </div>
      </BentoItem>

    </ul>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HomeClient(_props: { projects: Post[]; latestPosts: Post[] }) {
  void _props;
  const { t } = useLanguage();

  return (
    <div className={pageStyles.pageShell}>
      <div className={pageStyles.pageContent}>
        {/* ══ HERO ════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden">

          <Container className="relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-start pb-10 pt-20 sm:justify-center sm:py-12 md:py-16 xl:justify-start xl:pb-16 xl:pt-[clamp(5.5rem,11svh,8rem)]">
            <div className="grid w-full grid-cols-1 gap-10 md:gap-12 xl:grid-cols-2 xl:items-center xl:gap-16">

            {/* ── Left: text ─────────────────────────────────────────── */}
            <div className="flex flex-col items-center gap-5 text-center xl:items-start xl:text-left">

              <p className="text-sm font-medium site-soft tracking-wide">
                <span className="block sm:inline">{t("home.hero.title_prefix")}</span>{" "}
                <ColourfulText text={t("home.hero.name")} />
              </p>

              <h1 className="max-w-3xl text-3xl font-bold leading-tight site-heading sm:text-4xl md:text-5xl md:leading-[1.1]">
                {t("pages.portfolio.hero.headline_pre")}{" "}
                <span className="site-accent-gradient">{t("pages.portfolio.hero.headline_acc1")}</span>{" "}
                {t("pages.portfolio.hero.headline_mid")}
              </h1>

              <p className="mx-auto max-w-lg text-base leading-relaxed site-body sm:text-lg xl:mx-0">
                <Highlight text={t("pages.portfolio.hero.sub_pre")} />
              </p>

              <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center xl:justify-start">
                <a
                  href="#projects"
                  data-analytics-event="hero_cta_clicked"
                  data-analytics-label="projects"
                  className="w-full sm:w-auto"
                >
                  <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto">
                    {t("pages.portfolio.hero.cta_projects")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </a>
                <Link
                  href={`mailto:${SITE_CONFIG.links.email}`}
                  data-analytics-event="hero_cta_clicked"
                  data-analytics-label="email"
                  className="w-full sm:w-auto"
                >
                  <button className="inline-flex items-center justify-center gap-2 border border-border/60 bg-background/60 backdrop-blur-sm rounded-full text-base px-7 h-12 font-medium transition-all hover:border-primary/40 hover:bg-primary/5 w-full sm:w-auto">
                    <Mail className="h-4 w-4" />
                    {t("pages.portfolio.hero.cta_contact")}
                  </button>
                </Link>
              </div>

            </div>

            {/* ── Right: bento grid ─────────────────────────────────── */}
            <div className="block">
              <PersonalBentoGrid />
            </div>

            </div>
          </Container>
        </section>

        {/* ══ PORTFOLIO CONTENT ══════════════════════════════════════════════ */}
        <PortfolioClient projects={[]} hideHero hideCerts />
      </div>
    </div>
  );
}
