"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import wakatimeTotal from "@/data/wakatime.json";

import { Rich } from "./Rich";
import { WORK_MOCKUPS } from "./WorkMockups";
import { certVerifyUrl, useHomeCopy } from "./homeCopy";
import styles from "./home.module.css";

// Every section below is one "scene" of the particle layer (see ParticleScene):
// `data-scene` tells it where the particles change shape. Text sits beside the
// shape (left/right) or centred over the scattered field, as in the reference.

const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

type Side = "left" | "right" | "center";

function Scene({ id, scene, side, tall, children, labelledBy }: {
  id?: string; scene?: number; side: Side; tall?: boolean; children: React.ReactNode; labelledBy?: string;
}) {
  return (
    <section
      id={id}
      data-scene={scene}
      className={cn(styles.scene, tall && styles.sceneTall)}
      aria-labelledby={labelledBy}
    >
      <Container className="w-full">
        <div className={side === "left" ? styles.colLeft : side === "right" ? styles.colRight : styles.colCenter}>
          {children}
        </div>
      </Container>
    </section>
  );
}

/** Outlined four-leaf clover, the page's icon (same shape as the particles). */
const LEAF = "M0 0C-7-6-10-9.5-10-13A5 5 0 0 1 0-15A5 5 0 0 1 10-13C10-9.5 7-6 0 0Z";
function Clover({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-27 -27 54 54" className={className} style={style} aria-hidden="true">
      <g fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        {[45, 135, 225, 315].map((a) => (
          <path key={a} d={LEAF} transform={`rotate(${a})`} />
        ))}
      </g>
      <path d="M0 0Q2 12 6 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const CLOVER_COLORS = ["#8052ff", "#ffb829", "#29c7a8", "#f24db8", "#4d85ff", "#9e6bff"];

// ─── 1. About: the tree close-up on the left, the introduction on the right ───

export function AboutSection() {
  const { copy, ui } = useHomeCopy();
  const { about } = copy;

  return (
    <Scene id="about" scene={1} side="right" labelledBy="about-title">
      <Reveal>
        <p className={styles.eyebrow}>{about.eyebrow}</p>
        <h2 id="about-title" className={cn(styles.h2, "mt-5")}>{ui.aboutHeading}</h2>
        <p className={cn(styles.body, "mt-7")}><Rich text={about.p1} /></p>
      </Reveal>
    </Scene>
  );
}

// ─── 2. At a glance: figures, one line on how she works, four traits ────────
// One screen, built to be skimmed by a recruiter in a few seconds.

export function ManifestoSection() {
  const { copy, ui, language } = useHomeCopy();
  const { stats, traits } = copy;
  const hours = new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US").format(wakatimeTotal.hours);
  const figures = [...stats.slice(0, 3), { value: `${hours}h`, label: ui.statHours }];

  return (
    <Scene scene={2} side="center" labelledBy="glance-title">
      <h2 id="glance-title" className="sr-only">{ui.glanceTitle}</h2>
      <Reveal>
        <dl className={styles.figures}>
          {figures.map((s) => (
            <div key={s.label} className="flex flex-col-reverse items-center">
              <dt className={cn(styles.caption, "mt-3")}>{s.label}</dt>
              <dd className={styles.figure}>{s.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <Reveal delay={0.08}>
        <p className={cn(styles.statement, "mx-auto mt-14 max-w-[46rem]")}><Rich text={ui.glanceLine} /></p>
      </Reveal>
      <Reveal delay={0.16}>
        <ul className={cn(styles.traitTags, "mt-10")} aria-label={ui.principles}>
          {traits.map((t) => <li key={t.title}>{t.title}</li>)}
        </ul>
      </Reveal>
    </Scene>
  );
}

// ─── 3. Projects: the light bulb on the left, then a carousel ────────────────

const PROJECT_REPOS = [
  "https://github.com/nhiney/smart-clinic-booking-app",
  "https://github.com/nhiney/web-programing",
  "https://github.com/nhiney/english-app",
];

// Detail pages that exist under /projects (the shoe shop has none yet, so it links to the list).
const PROJECT_PAGES = ["/projects/smart-medical-booking-app/", "/projects/", "/projects/english-learning-app/"];

// Each project tints its own mockup stage.
const PROJECT_ACCENTS = ["#8052ff", "#ffb829", "#29c7a8"];

export function WorkSection() {
  const { copy, ui } = useHomeCopy();
  const { projects } = copy;

  return (
    <>
      <Scene id="projects" scene={3} side="right" labelledBy="projects-title">
        <Reveal>
          <p className={styles.eyebrow}>{projects.eyebrow}</p>
          <h2 id="projects-title" className={cn(styles.h2, "mt-5")}>{ui.projectsHeading}</h2>
          <p className={cn(styles.body, "mt-7")}>{projects.desc}</p>
          <Link href="/projects/" className={cn(styles.textLink, "mt-8")}>
            {projects.all_cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </Scene>
      <ProjectCarousel />
    </>
  );
}

function ProjectCarousel() {
  const { copy, ui } = useHomeCopy();
  const { projects } = copy;
  const items = projects.items;
  const [index, setIndex] = useState(0);
  const go = (d: number) => setIndex((i) => (i + d + items.length) % items.length);
  const p = items[index];
  const Mock = WORK_MOCKUPS[index % WORK_MOCKUPS.length];

  return (
    <section data-scene={4} className={styles.scene} aria-roledescription="carousel" aria-label={projects.heading}>
      <Container className="w-full">
        <div className={styles.carousel}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className={styles.slide}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.32, ease: EASE }}
              aria-roledescription="slide"
              aria-label={ui.projectOf.replace("{n}", String(index + 1)).replace("{total}", String(items.length))}
            >
              <div className={styles.slideCard} style={{ ["--accent" as string]: PROJECT_ACCENTS[index % PROJECT_ACCENTS.length] }}>
                <Mock />
              </div>

              <div className={styles.slideInfo}>
                <p className={styles.roleLabel}>{p.role}</p>
                <h3 className={cn(styles.slideTitle, "mt-3")}>{p.title}</h3>
                <p className={cn(styles.caption, "mt-3")}>{p.tag}, {p.period}</p>

                <p className={cn(styles.eyebrow, "mt-9")}>{projects.label_problem}</p>
                <p className={cn(styles.body, "mt-3 text-[16px]")}><Rich text={p.problem} /></p>

                <p className={cn(styles.eyebrow, "mt-7")}>{projects.label_impact}</p>
                <ul className={cn(styles.bullets, "mt-3 space-y-1.5")}>
                  {p.impact.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
                </ul>

                <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
                  <Link
                    href={PROJECT_PAGES[index]}
                    className={styles.textLink}
                    data-analytics-event="project_page_clicked"
                    data-analytics-label={p.title}
                  >
                    {ui.linkProject} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  {PROJECT_REPOS[index] && (
                    <a
                      href={PROJECT_REPOS[index]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnGhost}
                      data-analytics-event="project_repo_clicked"
                      data-analytics-label={p.title}
                    >
                      {ui.caseStudy} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className={styles.carouselNav}>
            <button type="button" className={styles.navBtn} onClick={() => go(-1)} aria-label={ui.prevProject}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" className={styles.navBtn} onClick={() => go(1)} aria-label={ui.nextProject}>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className={cn(styles.caption, "ml-3 tabular-nums")} aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── 4. Experience + skills: the globe on the right ──────────────────────────

// Where each kind of experience is evidenced on the site.
const EXPERIENCE_LINKS = {
  leadership: { href: "/projects/smart-medical-booking-app/", label: "linkProject" },
  research: { href: "/resume/", label: "linkCv" },
  learning: { href: "/certificates/", label: "linkCerts" },
} as const;

export function ProofSection() {
  const { copy, ui } = useHomeCopy();
  const { experience } = copy;

  return (
    <Scene id="experience" scene={5} side="left" tall labelledBy="experience-title">
      <Reveal>
        <p className={styles.eyebrow}>{experience.eyebrow}</p>
        <h2 id="experience-title" className={cn(styles.h2, "mt-5")}>{ui.experienceHeading}</h2>
        <p className={cn(styles.body, "mt-7")}>{experience.desc}</p>
      </Reveal>

      <ol className="mt-16 grid gap-14">
        {experience.items.map((item, i) => (
          <li key={item.title}>
            <Reveal delay={i * 0.06}>
              <p className={styles.eyebrow}>{item.period}</p>
              <h3 className={cn(styles.h3, "mt-3")}>{item.title}</h3>
              <p className={cn(styles.roleLabel, "mt-2")}>{item.org}</p>
              <p className={cn(styles.body, "mt-4 text-[16px]")}>{item.desc}</p>
              <Link href={EXPERIENCE_LINKS[item.kind].href} className={cn(styles.textLink, "mt-5")}>
                {ui[EXPERIENCE_LINKS[item.kind].label]} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </li>
        ))}
      </ol>
    </Scene>
  );
}

export function CapabilitiesSection() {
  const { copy, ui } = useHomeCopy();
  const { skills } = copy;

  return (
    <Scene id="skills" side="left" labelledBy="skills-title">
      <Reveal>
        <p className={styles.eyebrow}>{skills.eyebrow}</p>
        <h2 id="skills-title" className={cn(styles.h2, "mt-5")}>{ui.skillsHeading}</h2>
        <p className={cn(styles.body, "mt-6")}>{skills.desc}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <dl className={cn(styles.skillTable, "mt-10")}>
          {skills.groups.map((g) => (
            <div key={g.category}>
              <dt>{g.category}</dt>
              <dd>{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Scene>
  );
}

// ─── 5. Certificates: names beside large clovers, scattered ──────────────────

export function CredentialsSection() {
  const { copy, ui } = useHomeCopy();
  const { certifications } = copy;

  return (
    <section id="certifications" data-scene={6} className={styles.scene} aria-labelledby="certifications-title">
      <Container className="w-full">
        <div className={styles.investors}>
          <Reveal className={styles.investorsHead}>
            <p className={styles.eyebrow}>{certifications.eyebrow}</p>
            <h2 id="certifications-title" className={cn(styles.h2, "mt-5")}>{ui.certsHeading}</h2>
            <p className={cn(styles.body, "mt-7")}>{certifications.desc}</p>
            <Link href="/certificates/" className={cn(styles.textLink, "mt-8")}>
              {ui.certCta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>

          <ul className={styles.investorList}>
            {certifications.items.map((c, i) => (
              <li key={c.title}>
                <Reveal delay={i * 0.08}>
                  <a
                    href={certVerifyUrl(c.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.investor}
                    data-analytics-event="certificate_verify_clicked"
                    data-analytics-label={c.title}
                  >
                    <Clover
                      className={styles.investorIcon}
                      style={{ color: CLOVER_COLORS[i % CLOVER_COLORS.length], rotate: `${(i * 37) % 60 - 30}deg` }}
                    />
                    <span>
                      <span className={styles.investorName}>{c.title}</span>
                      <span className={cn(styles.caption, "mt-1 flex items-center gap-1.5")}>
                        {c.issuer}, {c.date} · {ui.verify} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

// ─── 6. Contact: a centred closing line and one violet button ────────────────

function LocalClock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });
    const update = () => setNow(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{now || "--:--"} GMT+7</span>;
}

export function ContactSection() {
  const { copy, ui } = useHomeCopy();
  const { contact } = copy;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.links.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${SITE_CONFIG.links.email}`;
    }
  };

  return (
    <section id="contact" data-scene={7} className={cn(styles.scene, styles.contact)} aria-labelledby="contact-title">
      <Container className="w-full">
        <Reveal className="mx-auto max-w-[60rem] text-center">
          <h2 id="contact-title" className={cn(styles.display, "mx-auto")}>{ui.contactHeading}</h2>
          <p className={cn(styles.body, "mx-auto mt-7 max-w-[34rem]")}>{contact.desc}</p>
          <a
            href={`mailto:${SITE_CONFIG.links.email}`}
            className={cn(styles.btnPrimary, "mt-10")}
            data-analytics-event="contact_channel_clicked"
            data-analytics-label="email_button"
          >
            {ui.ctaEmail}
          </a>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            <button type="button" onClick={copyEmail} className={styles.btnGhost} aria-live="polite">
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? ui.copied : SITE_CONFIG.links.email}
            </button>
            <a
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnGhost}
              data-analytics-event="contact_channel_clicked"
              data-analytics-label="github"
            >
              {contact.github} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={SITE_CONFIG.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnGhost}
              data-analytics-event="contact_channel_clicked"
              data-analytics-label="linkedin"
            >
              {contact.linkedin} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <div className={cn(styles.caption, "mt-24 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between")}>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="inline-flex items-center gap-2 text-[color:var(--ink)]">
              <span className={styles.liveDot} aria-hidden="true" /> {ui.available}
            </span>
            <span>{ui.location}</span>
            <span>{ui.localTime} <LocalClock /></span>
          </div>
          <a
            href="#top"
            className="inline-flex items-center gap-2 transition-colors hover:text-[color:var(--ink)]"
          >
            {ui.backToTop} <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
}
