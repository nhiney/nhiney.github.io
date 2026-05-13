"use client";

import { Phone, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/widgets/Icons";
import { useCV, type Project } from "@/data/cv";
import { useLanguage } from "@/context/LanguageContext";

// ─── Internal building blocks ─────────────────────────────────────────────────

function CVSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="font-sans text-sm font-black uppercase tracking-[0.28em] text-primary">
        {title}
        <span className="ml-3 inline-block h-px w-12 align-middle bg-gradient-to-r from-primary/60 to-transparent" />
      </h2>
      {children}
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-5 leading-7 text-foreground/80 before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/70">
      {children}
    </li>
  );
}

function ProjectBlock({ project, t }: { project: Project; t: (key: string) => string }) {
  return (
    <article className="space-y-3">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className="font-sans text-lg font-bold tracking-tight text-foreground">{project.title}</h3>
          {project.role && (
            <span className="text-base italic text-muted-foreground">— {project.role}</span>
          )}
        </div>
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
          {project.period}
        </span>
      </header>

      <p className="italic leading-7 text-foreground/75">
        <span className="font-semibold not-italic text-foreground">{t("pages.resume.cv.problem")}: </span>
        {project.problem}
      </p>

      <div className="space-y-2">
        <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-foreground/70">{t("pages.resume.cv.contributions")}</p>
        <ul className="space-y-2">
          {project.contributions.map((c, i) => (
            <Bullet key={i}>{c}</Bullet>
          ))}
        </ul>
      </div>

      <p className="leading-7">
        <span className="font-sans font-bold uppercase tracking-widest text-[11px] text-foreground/70">{t("pages.resume.cv.tech")}: </span>
        <span className="text-foreground/80">{project.tech}</span>
      </p>
    </article>
  );
}

// ─── Main document ────────────────────────────────────────────────────────────

export function CVDocument() {
  const cv = useCV();
  const { t } = useLanguage();

  return (
    <article
      className="
        rounded-3xl border border-border bg-card text-[15.5px]
        p-8 sm:p-12 lg:p-16 space-y-12
        shadow-[0_2px_4px_-1px_rgba(0,0,0,0.06),0_10px_30px_-12px_rgba(0,0,0,0.18)]
        dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]
        font-[var(--font-inter)]
      "
    >

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="space-y-5 border-b border-border pb-8 text-center">
        <h1 className="font-sans text-4xl sm:text-5xl lg:text-[2.75rem] font-black tracking-tight uppercase text-foreground">
          {cv.name}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-foreground/75">
          <a href={`tel:${cv.contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
            <Phone size={13} /> {cv.contact.phone}
          </a>
          <a href={`mailto:${cv.contact.email}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
            <Mail size={13} /> {cv.contact.email}
          </a>
          <a href={cv.contact.github.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
            <GithubIcon size={13} /> {cv.contact.github.handle}
          </a>
          <a href={cv.contact.linkedin.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
            <LinkedinIcon size={13} /> {cv.contact.linkedin.handle}
          </a>
        </div>
      </header>

      {/* ── Summary ───────────────────────────────────────────────── */}
      <CVSection title={t("pages.resume.cv.summary")}>
        <div className="space-y-3 leading-7 text-foreground/85">
          {cv.summary.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </CVSection>

      {/* ── Skills & Tools ────────────────────────────────────────── */}
      <CVSection title={t("pages.resume.cv.skills")}>
        <dl className="space-y-3 leading-7">
          {cv.skills.map(({ category, items }) => (
            <div key={category} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <dt className="font-sans font-bold text-foreground sm:w-48 sm:shrink-0">{category}</dt>
              <dd className="text-foreground/80">{items}</dd>
            </div>
          ))}
        </dl>
      </CVSection>

      {/* ── Projects ──────────────────────────────────────────────── */}
      <CVSection title={t("pages.resume.cv.projects")}>
        <div className="space-y-10">
          {cv.projects.map((p) => (
            <ProjectBlock key={p.title} project={p} t={t} />
          ))}
        </div>
        <p className="mt-6 italic text-foreground/70 leading-7">
          {cv.github_note.split("github.com/nhiney").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <a
                  href={cv.contact.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold not-italic text-primary hover:underline"
                >
                  github.com/{cv.contact.github.handle}
                </a>
              )}
            </span>
          ))}
        </p>
      </CVSection>

      {/* ── Education ─────────────────────────────────────────────── */}
      <CVSection title={t("pages.resume.cv.education")}>
        {cv.education.map((edu) => (
          <div key={edu.school} className="space-y-3">
            <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-sans text-lg font-bold tracking-tight text-foreground">{edu.school}</h3>
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
                {edu.location}
              </span>
            </header>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between italic text-foreground/75">
              <span>
                {edu.degree} | <span className="font-semibold not-italic text-foreground">{t("pages.resume.cv.gpa")}: {edu.gpa}</span>
              </span>
              <span className="font-sans text-xs font-semibold uppercase tracking-widest not-italic shrink-0">
                {t("pages.resume.cv.expected")}: {edu.expected}
              </span>
            </div>
            <ul className="space-y-2">
              {edu.notes.map((note, i) => (
                <Bullet key={i}>{note}</Bullet>
              ))}
            </ul>
          </div>
        ))}
      </CVSection>

      {/* ── Certifications & Honors ───────────────────────────────── */}
      <CVSection title={t("pages.resume.cv.certifications")}>
        <div className="space-y-8">
          {cv.certifications.map((cert) => (
            <div key={cert.title} className="space-y-3">
              <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-sans text-lg font-bold tracking-tight text-foreground">{cert.title}</h3>
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
                  {cert.period}
                </span>
              </header>
              <p className="italic text-foreground/75">{cert.source}</p>
              <ul className="space-y-2">
                {cert.items.map((item) => (
                  <Bullet key={item.label}>
                    <span className="font-bold text-foreground">{item.label}: </span>
                    <span className="italic">{t("pages.resume.cv.certificate")}</span> | {item.description}
                  </Bullet>
                ))}
              </ul>
            </div>
          ))}

          {/* Research */}
          <div className="space-y-3">
            <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-sans text-lg font-bold tracking-tight text-foreground">{cv.research.title}</h3>
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
                {cv.research.period}
              </span>
            </header>
            <p className="italic text-foreground/75">{cv.research.source}</p>
            <ul className="space-y-2">
              <Bullet>{cv.research.description}</Bullet>
            </ul>
          </div>
        </div>
      </CVSection>
    </article>
  );
}
