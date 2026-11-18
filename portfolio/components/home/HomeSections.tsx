"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUp, ArrowUpRight, BadgeCheck, BarChart2, Bot, Check, ClipboardList,
  Code2, Copy, Layers, Microscope, Palette, Settings2, Target, TrendingUp, UsersRound, Wrench,
} from "lucide-react";
import {
  motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform,
  type MotionValue,
} from "framer-motion";

import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Rich } from "./Rich";
import { WORK_MOCKUPS } from "./WorkMockups";
import { useHomeCopy } from "./homeCopy";
import styles from "./home.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

function useReveal(delay = 0) {
  // No useReducedMotion branch here: it differs between SSR and client (hydration mismatch); MotionConfig reducedMotion="user" already drops the y motion.
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.9, ease: EASE, delay },
  };
}

function SectionHead({
  index, eyebrow, heading, desc, action, className,
}: {
  index: string; eyebrow: string; heading: React.ReactNode; desc?: string;
  action?: React.ReactNode; className?: string;
}) {
  const reveal = useReveal();
  return (
    <motion.div {...reveal} className={cn("grid gap-8 lg:grid-cols-12 lg:items-end", className)}>
      <div className="lg:col-span-8">
        <p className={styles.sectionLabel}>
          <span>({index})</span> {eyebrow}
        </p>
        <h2 className={cn(styles.h2, "mt-5")}>{heading}</h2>
      </div>
      <div className="space-y-5 lg:col-span-4">
        {desc && <p className={styles.lede}>{desc}</p>}
        {action}
      </div>
    </motion.div>
  );
}

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const target = parseFloat(value.replace(/[^\d.]/g, ""));
  const decimals = value.includes(".") ? value.split(".")[1].replace(/\D/g, "").length : 0;
  const suffix = value.replace(/[\d.,]/g, "");
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || Number.isNaN(target)) return;
    if (reduce) {
      const id = requestAnimationFrame(() => setN(target));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1600);
      setN(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduce]);

  if (Number.isNaN(target)) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// ─── Marquee ──────────────────────────────────────────────────────────────────

function MarqueeRow({ items, reverse, outline }: { items: string[]; reverse?: boolean; outline?: boolean }) {
  return (
    <div className={cn(styles.marquee, reverse && styles.marqueeReverse)}>
      {[0, 1].map((k) => (
        <div key={k} className={styles.marqueeTrack} aria-hidden={k === 1 || undefined}>
          {items.map((s, i) => (
            <span key={`${s}-${k}`} className="flex items-center gap-[2.25rem]">
              <span className={cn(styles.marqueeItem, (i % 2 === 1) !== !!outline && styles.marqueeOutline)}>{s}</span>
              <span className={styles.star} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkillMarquee() {
  const { copy } = useHomeCopy();
  const all = copy.skills.groups.flatMap((g) => g.items);
  const rowA = all.slice(0, Math.ceil(all.length / 2));
  const rowB = all.slice(Math.ceil(all.length / 2));


  return (
    <section aria-label={copy.skills.eyebrow} className="space-y-2 py-14 sm:py-20">
      <MarqueeRow items={rowA} />
      <MarqueeRow items={rowB} reverse outline />
    </section>
  );
}

// ─── About / Manifesto ────────────────────────────────────────────────────────

function ScrollWord({ word, range, progress, accent }: {
  word: string; range: [number, number]; progress: MotionValue<number>; accent?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className={cn(styles.manifestoWord, accent && styles.iri)}>
      {word}{" "}
    </motion.span>
  );
}

const TRAIT_ICONS = [BarChart2, Target, UsersRound, TrendingUp];

export function AboutSection() {
  const { copy, ui } = useHomeCopy();
  const { about, traits, stats } = copy;
  const textRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: textRef, offset: ["start 0.85", "end 0.5"] });
  const reveal = useReveal();
  const reveal2 = useReveal(0.1);

  const words = [
    ...about.heading_1.split(" ").map((w) => ({ w, accent: false })),
    ...about.heading_2.split(" ").map((w) => ({ w, accent: true })),
    ...about.heading_3.split(" ").map((w) => ({ w, accent: false })),
  ].filter((x) => x.w);

  return (
    <section id="about" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className={styles.sectionLabel}><span>(01)</span> {about.eyebrow}</p>
              <div className="mt-6 hidden flex-wrap gap-2 lg:flex">
                {about.tags.map((tag) => (
                  <span key={tag} className={styles.pill}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <p ref={textRef} className={styles.manifesto}>
              {words.map(({ w, accent }, i) => (
                <ScrollWord
                  key={i}
                  word={w}
                  accent={accent}
                  progress={scrollYProgress}
                  range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}
                />
              ))}
            </p>

            <motion.div {...reveal} className={cn(styles.lede, "mt-12 grid gap-6 text-[15px] md:grid-cols-3 [&_strong]:font-semibold [&_strong]:text-foreground")}>
              <p><Rich text={about.p1} /></p>
              <p><Rich text={about.p2} /></p>
              <p><Rich text={about.p3} /></p>
            </motion.div>

            <motion.dl {...reveal2} className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className={styles.statCard}>
                  <dd className={styles.statBig}><CountUp value={s.value} /></dd>
                  <dt className="mt-3 text-sm text-muted-foreground">{s.label}</dt>
                </div>
              ))}
            </motion.dl>

            <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
              {about.tags.map((tag) => (
                <span key={tag} className={styles.pill}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <p className={cn(styles.kicker, "mb-6")}>{ui.principles}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {traits.map((trait, i) => {
              const Icon = TRAIT_ICONS[i % TRAIT_ICONS.length];
              return <Principle key={trait.title} index={i} Icon={Icon} title={trait.title} body={trait.body} />;
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Principle({ index, Icon, title, body }: { index: number; Icon: typeof Target; title: string; body: string }) {
  const reveal = useReveal(index * 0.08);
  return (
    <motion.article {...reveal} className={styles.principle}>
      <div className="flex items-start justify-between">
        <span className={styles.iconChip}><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <span className={cn(styles.mono, "text-xs text-muted-foreground")}>0{index + 1}</span>
      </div>
      <h3 className="mt-8 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </motion.article>
  );
}

// ─── Featured work (sticky stack) ─────────────────────────────────────────────

const PROJECT_REPOS = [
  "https://github.com/nhiney/smart-clinic-booking-app",
  "https://github.com/nhiney/web-programing",
  "https://github.com/nhiney/english-app",
];

const PROJECT_ACCENTS = [
  { accent: "#7c5cff", soft: "rgba(124, 92, 255, 0.16)" },
  { accent: "#f2662b", soft: "rgba(242, 102, 43, 0.14)" },
  { accent: "#0ea5b7", soft: "rgba(14, 165, 183, 0.15)" },
];

export function WorkSection() {
  const { copy } = useHomeCopy();
  const { projects } = copy;
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });
  const n = projects.items.length;

  return (
    <section id="projects" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <SectionHead
          index="02"
          eyebrow={projects.eyebrow}
          heading={projects.heading}
          desc={projects.desc}
          action={
            <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-semibold">
              <span className="border-b border-current pb-0.5">{projects.all_cta}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          }
        />

        <div ref={stackRef} className="relative mt-14">
          {projects.items.map((p, i) => (
            <WorkCard
              key={p.title}
              index={i}
              total={n}
              progress={scrollYProgress}
              project={p}
              labels={projects}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

type Project = ReturnType<typeof useHomeCopy>["copy"]["projects"]["items"][number];

function WorkCard({ index, total, progress, project, labels }: {
  index: number; total: number; progress: MotionValue<number>; project: Project;
  labels: ReturnType<typeof useHomeCopy>["copy"]["projects"];
}) {
  const reduce = useReducedMotion();
  const targetScale = 1 - (total - 1 - index) * 0.045;
  const scale = useTransform(progress, [index / total, 1], [1, reduce ? 1 : targetScale]);
  const Mock = WORK_MOCKUPS[index % WORK_MOCKUPS.length];
  const tone = PROJECT_ACCENTS[index % PROJECT_ACCENTS.length];
  const repo = PROJECT_REPOS[index];
  const reveal = useReveal();

  return (
    <div className={styles.stackItem} style={{ ["--i" as string]: index }}>
      <motion.article
        {...reveal}
        style={{ scale, ["--accent" as string]: tone.accent, ["--accent-soft" as string]: tone.soft }}
        className={styles.workCard}
        aria-labelledby={`work-${index}`}
      >
        <div className={styles.workGlow} aria-hidden="true" />
        <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:p-11">
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={styles.tag}><span className={styles.tagDot} />{project.tag}</span>
                <span className={cn(styles.mono, "text-xs text-muted-foreground")}>{project.period}</span>
              </div>
              <span className={styles.workNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            </div>

            <h3 id={`work-${index}`} className={cn(styles.workTitle, "mt-4")}>{project.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{project.role}</p>

            <div className="mt-7 grid gap-7 sm:grid-cols-2">
              <div>
                <p className={styles.kicker}>{labels.label_problem}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
                  <Rich text={project.problem} />
                </p>
              </div>
              <div>
                <p className={styles.kicker}>{labels.label_impact}</p>
                <ul className="mt-3 space-y-2.5">
                  {project.impact.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-snug">
                      <span className={styles.check}><Check className="h-3 w-3" strokeWidth={3} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {project.actions && project.actions.length > 0 && (
              <details className="group mt-7 rounded-2xl bg-foreground/[0.03] px-4 py-3 ring-1 ring-inset ring-border/60">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                  {labels.label_actions}
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-foreground/5 text-xs transition-transform group-open:rotate-45">+</span>
                </summary>
                <ul className="mt-3 space-y-2 pb-1">
                  {project.actions.map((a) => (
                    <li key={a} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {repo && (
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold"
                data-analytics-event="project_repo_clicked"
                data-analytics-label={project.title}
              >
                <span className="border-b border-current pb-0.5">{labels.label_case_study}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </div>

          <div className="min-h-[340px] lg:min-h-[460px]">
            <Mock />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

// ─── Capabilities ─────────────────────────────────────────────────────────────

const SKILL_ICONS = [BarChart2, Layers, Code2, Wrench];
const SKILL_SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export function CapabilitiesSection() {
  const { copy, ui } = useHomeCopy();
  const { skills } = copy;

  const track = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section id="skills" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <SectionHead index="03" eyebrow={skills.eyebrow} heading={skills.heading} desc={skills.desc} />
        <div className="mt-14 grid gap-3 lg:grid-cols-12">
          {skills.groups.map((g, i) => {
            const Icon = SKILL_ICONS[i % SKILL_ICONS.length];
            return (
              <SkillCard key={g.category} index={i} className={SKILL_SPANS[i % SKILL_SPANS.length]} onPointerMove={track}>
                <div className="flex items-start justify-between">
                  <span className={styles.iconChip}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <span className={styles.bigIndex} aria-hidden="true">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight">{g.category}</h3>
                <p className={cn(styles.mono, "mt-1 text-xs text-muted-foreground")}>{g.items.length} · {skills.eyebrow.toLowerCase()}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li key={item} className={styles.pill}>{item}</li>
                  ))}
                </ul>
              </SkillCard>
            );
          })}
        </div>
        <p className={cn(styles.mono, "mt-6 hidden text-xs text-muted-foreground sm:block")}>{ui.capabilitiesNote}</p>
      </Container>
    </section>
  );
}

function SkillCard({ index, className, children, onPointerMove }: {
  index: number; className?: string; children: React.ReactNode;
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
}) {
  const reveal = useReveal(index * 0.07);
  return (
    <motion.article {...reveal} onPointerMove={onPointerMove} className={cn(styles.spot, "p-7 sm:p-8", className)}>
      {children}
    </motion.article>
  );
}

// ─── Proof points (experience) ────────────────────────────────────────────────

const KIND_ICONS = { leadership: UsersRound, research: Microscope, learning: BadgeCheck } as const;

export function ProofSection() {
  const { copy } = useHomeCopy();
  const { experience } = copy;
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 0.85", "end 0.55"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <SectionHead index="04" eyebrow={experience.eyebrow} heading={experience.heading} desc={experience.desc} />
        <div ref={railRef} className="relative mt-14">
          <div className={cn(styles.rail, "hidden lg:block")} aria-hidden="true">
            <motion.div className={styles.railFill} style={{ scaleX: fill }} />
          </div>
          <ol className="grid gap-4 lg:grid-cols-3 lg:gap-6">
            {experience.items.map((item, i) => (
              <ProofItem key={item.title} index={i} item={item} />
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

function ProofItem({ index, item }: { index: number; item: ReturnType<typeof useHomeCopy>["copy"]["experience"]["items"][number] }) {
  const Icon = KIND_ICONS[item.kind] ?? BadgeCheck;
  const reveal = useReveal(index * 0.12);
  return (
    <motion.li {...reveal} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className={styles.node}><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <span className={cn(styles.mono, "text-xs text-muted-foreground")}>{item.period}</span>
      </div>
      <article className={cn(styles.proofCard, "flex flex-col")}>
        <p className={styles.kicker}>{item.org}</p>
        <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight">{item.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-6">
          {item.evidence.map((e) => (
            <li key={e} className={styles.pill}>{e}</li>
          ))}
        </ul>
      </article>
    </motion.li>
  );
}

// ─── Credentials ──────────────────────────────────────────────────────────────

const CERT_ICONS = [ClipboardList, Bot, Palette, Settings2];

export function CredentialsSection() {
  const { copy, ui } = useHomeCopy();
  const { certifications } = copy;

  return (
    <section id="certifications" className="scroll-mt-16 py-16 sm:py-24">
      <Container>
        <SectionHead
          index="05"
          eyebrow={certifications.eyebrow}
          heading={certifications.heading}
          desc={certifications.desc}
          action={
            <Link href="/certificates" className="group inline-flex items-center gap-2 text-sm font-semibold">
              <span className="border-b border-current pb-0.5">{ui.certCta}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          }
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.items.map((c, i) => (
            <HoloCard key={c.title} index={i} title={c.title} issuer={c.issuer} date={c.date} Icon={CERT_ICONS[i % CERT_ICONS.length]} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function HoloCard({ index, title, issuer, date, Icon }: {
  index: number; title: string; issuer: string; date: string; Icon: typeof Bot;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reveal = useReveal(index * 0.08);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 16}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 18}deg`);
    el.style.setProperty("--px", `${x * 100}%`);
    el.style.setProperty("--py", `${y * 100}%`);
    el.style.setProperty("--o", "1");
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    ["--rx", "--ry", "--px", "--py", "--o"].forEach((p) => el.style.removeProperty(p));
  };

  return (
    <motion.div {...reveal} className={styles.holoWrap}>
      <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={cn(styles.holo, "flex flex-col")}>
        <div className="flex items-start justify-between">
          <span className={styles.seal}><Icon className="h-5 w-5" aria-hidden="true" /></span>
          <span className={cn(styles.mono, "inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground")}>
            <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> Verified
          </span>
        </div>
        <h3 className="mt-10 text-lg font-semibold leading-snug tracking-tight">{title}</h3>
        <div className="mt-auto flex items-end justify-between gap-3 pt-8">
          <p className="text-sm text-muted-foreground">{issuer}</p>
          <p className={cn(styles.mono, "text-xs")}>{date}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function MagneticLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });
  const reduce = useReducedMotion();

  return (
    <motion.a
      href={href}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
      data-analytics-event="contact_channel_clicked"
      data-analytics-label="email"
    >
      {children}
    </motion.a>
  );
}

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
  const reveal = useReveal();
  const reveal2 = useReveal(0.15);

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
    <section id="contact" className="scroll-mt-16 pt-8 pb-3" aria-labelledby="contact-title">
      <div className={cn(styles.stage, "px-0")}>
        <div className={styles.orb} aria-hidden="true" />
        <Container className="relative z-[2] px-5 pt-20 pb-8 sm:px-8 sm:pt-28 md:px-12">
          <motion.p {...reveal} className={styles.sectionLabel}>
            <span>(06)</span> {contact.eyebrow}
          </motion.p>

          <div className="mt-8 grid items-end gap-12 lg:grid-cols-[1fr_auto]">
            <motion.div {...reveal}>
              <h2 id="contact-title" className={cn(styles.contactTitle, "text-white")}>{contact.heading}</h2>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">{contact.desc}</p>
            </motion.div>
            <motion.div {...reveal2} className="flex justify-start lg:justify-end">
              <MagneticLink href={`mailto:${SITE_CONFIG.links.email}`} className={styles.bigCta}>
                <span className="flex flex-col items-center gap-2">
                  <ArrowUpRight className="h-6 w-6" aria-hidden="true" />
                  {contact.cta}
                </span>
              </MagneticLink>
            </motion.div>
          </div>

          <motion.div {...reveal2} className="mt-14 flex flex-wrap items-center gap-3">
            <button type="button" onClick={copyEmail} className={styles.socialLink} aria-live="polite">
              {copied ? <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              <span className={styles.mono}>{copied ? ui.copied : SITE_CONFIG.links.email}</span>
            </button>
            <span className="px-1 text-sm text-white/45">{ui.or}</span>
            <a
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              data-analytics-event="contact_channel_clicked"
              data-analytics-label="github"
            >
              {contact.github} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <a
              href={SITE_CONFIG.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              data-analytics-event="contact_channel_clicked"
              data-analytics-label="linkedin"
            >
              {contact.linkedin} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </motion.div>

          <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <div className={cn(styles.mono, "flex flex-wrap items-center gap-x-6 gap-y-2")}>
              <span className="inline-flex items-center gap-2 text-white/70">
                <span className={styles.liveDot} aria-hidden="true" /> {ui.available}
              </span>
              <span>{ui.location}</span>
              <span>{ui.localTime} · <LocalClock /></span>
            </div>
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={cn(styles.mono, "inline-flex items-center gap-2 transition-colors hover:text-white")}>
              {ui.backToTop} <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </Container>
      </div>
    </section>
  );
}

